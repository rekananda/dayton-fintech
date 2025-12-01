import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortColumn = searchParams.get("sortColumn") || "order";
    const sortDirection = searchParams.get("sortDirection") || "asc";

    const where: Prisma.BusinessModelWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy = 
      sortColumn === "title" 
        ? { title: sortDirection as "asc" | "desc" }
        : { order: sortDirection as "asc" | "desc" };

    const total = await prisma.businessModel.count({ where });

    const skip = (page - 1) * limit;
    const businessModels = await prisma.businessModel.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        tables: {
          where: { deletedAt: null },
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            order: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: businessModels,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch business models", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, tags, order, tnc } = body ?? {};

    if (!title || !description || typeof order !== "number") {
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

    const created = await prisma.businessModel.create({
      data: {
        title,
        description,
        tags: Array.isArray(tags) ? tags : [],
        order,
        tnc: tnc || null,
        createdAt: now,
        updatedAt: now,
        createdBy: payload.username,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[API] Create business model error:", error);
    return NextResponse.json(
      { message: "Failed to create business model" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, tags, order, tnc } = body ?? {};

    if (
      typeof id !== "number" ||
      !title ||
      !description ||
      typeof order !== "number"
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

    const now = new Date();

    const updated = await prisma.businessModel.update({
      where: { id },
      data: {
        title,
        description,
        tags: Array.isArray(tags) ? tags : [],
        order,
        tnc: tnc || null,
        updatedAt: now,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if ((error as Error).message.includes("Record to update not found")) {
      return NextResponse.json({ message: "Business model not found" }, { status: 404 });
    }

    console.error("[API] Update business model error:", error);
    return NextResponse.json(
      { message: "Failed to update business model" },
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

    const now = new Date();

    const result = await prisma.businessModel.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: now,
        deletedBy: payload.username,
      },
    });

    return NextResponse.json({ updatedCount: result.count });
  } catch (error) {
    console.error("[API] Delete business models error:", error);
    return NextResponse.json(
      { message: "Failed to delete business models" },
      { status: 500 }
    );
  }
}

