import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { extractFileIdFromUrl, isGoogleDriveUrl, deleteFileFromGoogleDrive } from "../upload/gdrive/delete/route";

type EventWhere = NonNullable<Parameters<typeof prisma.event.findMany>[0]>["where"];
type EventOrderBy = NonNullable<Parameters<typeof prisma.event.findMany>[0]>["orderBy"];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortColumn = searchParams.get("sortColumn") || "date";
    const sortDirection = searchParams.get("sortDirection") || "desc";

    const where: EventWhere = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: EventOrderBy = 
      sortColumn === "title" 
        ? { title: sortDirection as "asc" | "desc" }
        : sortColumn === "date"
        ? { date: sortDirection as "asc" | "desc" }
        : { date: "desc" };

    const total = await prisma.event.count({ where });

    const skip = (page - 1) * limit;
    const events = await prisma.event.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    // Convert date to ISO string for frontend
    const formattedEvents = events.map(event => ({
      ...event,
      date: event.date.toISOString(),
    }));

    return NextResponse.json({
      data: formattedEvents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch events", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, meetingLink, location, date, title, description } = body ?? {};

    if (!imageUrl || !date || !title || !description) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.username) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const now = new Date();
    const eventDate = new Date(date);

    const created = await prisma.event.create({
      data: {
        imageUrl,
        meetingLink: meetingLink || null,
        location: location || null,
        date: eventDate,
        title,
        description,
        createdAt: now,
        updatedAt: now,
        createdBy: payload.username,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json({
      ...created,
      date: created.date.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("[API] Create event error:", error);
    return NextResponse.json(
      { message: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, imageUrl, meetingLink, location, date, title, description } = body ?? {};

    if (
      typeof id !== "number" ||
      !imageUrl ||
      !date ||
      !title ||
      !description
    ) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.username) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = payload.sub || payload.username;

    // Get existing event to check old image URL
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (existingEvent.imageUrl !== imageUrl && existingEvent.imageUrl) {
      if (isGoogleDriveUrl(existingEvent.imageUrl)) {
        const fileId = extractFileIdFromUrl(existingEvent.imageUrl);
        if (fileId) {
          try {
            await deleteFileFromGoogleDrive(fileId, userId);
            console.log(`Deleted old Google Drive image for event ${id}`);
          } catch (error) {
            console.error(`Failed to delete old Google Drive image for event ${id}:`, error);
          }
        }
      }
    }

    const now = new Date();
    const eventDate = new Date(date);

    const updated = await prisma.event.update({
      where: { id },
      data: {
        imageUrl,
        meetingLink: meetingLink || null,
        location: location || null,
        date: eventDate,
        title,
        description,
        updatedAt: now,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json({
      ...updated,
      date: updated.date.toISOString(),
    });
  } catch (error) {
    if ((error as Error).message.includes("Record to update not found")) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    console.error("[API] Update event error:", error);
    return NextResponse.json(
      { message: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body ?? {};

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.username) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = payload.sub || payload.username;

    // Get events before deleting to check for Google Drive images
    const eventsToDelete = await prisma.event.findMany({
      where: { id: { in: ids }, deletedAt: null },
      select: { id: true, imageUrl: true },
    });

    // Delete images from Google Drive if they are from Drive
    for (const event of eventsToDelete) {
      if (event.imageUrl && isGoogleDriveUrl(event.imageUrl)) {
        const fileId = extractFileIdFromUrl(event.imageUrl);
        if (fileId) {
          try {
            await deleteFileFromGoogleDrive(fileId, userId);
            console.log(`Deleted Google Drive image for event ${event.id}`);
          } catch (error) {
            console.error(`Failed to delete Google Drive image for event ${event.id}:`, error);
            // Continue with event deletion even if image deletion fails
          }
        }
      }
    }

    const now = new Date();

    const result = await prisma.event.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: now,
        deletedBy: payload.username,
      },
    });

    return NextResponse.json({ updatedCount: result.count });
  } catch (error) {
    console.error("[API] Delete events error:", error);
    return NextResponse.json(
      { message: "Failed to delete events" },
      { status: 500 }
    );
  }
}

