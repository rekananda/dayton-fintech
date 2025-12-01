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

    const where: Prisma.MenuWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { label: { contains: search, mode: "insensitive" } },
        { href: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy = 
      sortColumn === "label" 
        ? { label: sortDirection as "asc" | "desc" }
        : { order: sortDirection as "asc" | "desc" };

    const total = await prisma.menu.count({ where });

    const skip = (page - 1) * limit;
    const menus = await prisma.menu.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: menus,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch menus", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, order } = body ?? {};

    if (!label || typeof order !== "number") {
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

    const created = await prisma.menu.create({
      data: {
        label,
        order,
        href: "/",
        createdAt: now,
        updatedAt: now,
        createdBy: payload.username,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[API] Create menu error:", error);
    return NextResponse.json(
      { message: "Failed to create menu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, label, order } = body ?? {};

    if (
      typeof id !== "number" ||
      !label ||
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

    const updated = await prisma.menu.update({
      where: { id },
      data: {
        label,
        order,
        updatedAt: now,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if ((error as Error).message.includes("Record to update not found")) {
      return NextResponse.json({ message: "Menu not found" }, { status: 404 });
    }

    console.error("[API] Update menu error:", error);
    return NextResponse.json(
      { message: "Failed to update menu" },
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

    const result = await prisma.menu.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: now,
        deletedBy: payload.username,
      },
    });

    return NextResponse.json({ updatedCount: result.count });
  } catch (error) {
    console.error("[API] Delete menus error:", error);
    return NextResponse.json(
      { message: "Failed to delete menus" },
      { status: 500 }
    );
  }
}


