/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";

type ConfigWhere = NonNullable<Parameters<typeof prisma.config.findMany>[0]>["where"];
type ConfigOrderBy = NonNullable<Parameters<typeof prisma.config.findMany>[0]>["orderBy"];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortColumn = searchParams.get("sortColumn") || "key";
    const sortDirection = searchParams.get("sortDirection") || "asc";

    const where: ConfigWhere = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { key: { contains: search, mode: "insensitive" } },
        { value: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: ConfigOrderBy = 
      sortColumn === "key" 
        ? { key: sortDirection as "asc" | "desc" }
        : { key: sortDirection as "asc" | "desc" };

    const total = await prisma.config.count({ where });

    const skip = (page - 1) * limit;
    const configs = await prisma.config.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: configs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch configs", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, description } = body ?? {};

    if (!key || !value || !description) {
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

    const existingConfig = await prisma.config.findFirst({
      where: {
        key,
        deletedAt: null,
      },
    });

    if (existingConfig) {
      return NextResponse.json(
        { message: "Config dengan key ini sudah ada" },
        { status: 409 }
      );
    }

    const now = new Date();

    const created = await prisma.config.create({
      data: {
        key,
        value,
        description,
        createdAt: now,
        updatedAt: now,
        createdBy: payload.username,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { message: "Config dengan key ini sudah ada" },
        { status: 409 }
      );
    }
    console.error("[API] Create config error:", error);
    return NextResponse.json(
      { message: "Failed to create config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, value, description } = body ?? {};

    if (
      typeof id !== "number" ||
      !value ||
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

    const now = new Date();

    const updated = await prisma.config.update({
      where: { id },
      data: {
        value,
        description,
        updatedAt: now,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if ((error as Error).message.includes("Record to update not found")) {
      return NextResponse.json({ message: "Config not found" }, { status: 404 });
    }

    console.error("[API] Update config error:", error);
    return NextResponse.json(
      { message: "Failed to update config" },
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

    type ConfigUpdateManyWhere = NonNullable<Parameters<typeof prisma.config.updateMany>[0]>["where"];
    type ConfigUpdateManyData = NonNullable<Parameters<typeof prisma.config.updateMany>[0]>["data"];

    const updateManyWhere: ConfigUpdateManyWhere = { id: { in: ids } };
    const updateManyData: ConfigUpdateManyData = {
      deletedAt: now,
      deletedBy: payload.username,
    };

    const result = await prisma.config.updateMany({
      where: updateManyWhere,
      data: updateManyData,
    });

    return NextResponse.json({ updatedCount: result.count });
  } catch (error) {
    console.error("[API] Delete configs error:", error);
    return NextResponse.json(
      { message: "Failed to delete configs" },
      { status: 500 }
    );
  }
}

