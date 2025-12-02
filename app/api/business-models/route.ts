import { NextResponse, NextRequest } from "next/server";
import { prisma, TxClient } from "@/config/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";

type BusinessModelWhere = NonNullable<Parameters<typeof prisma.businessModel.findMany>[0]>["where"];
type BusinessModelOrderBy = NonNullable<Parameters<typeof prisma.businessModel.findMany>[0]>["orderBy"];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortColumn = searchParams.get("sortColumn") || "order";
    const sortDirection = searchParams.get("sortDirection") || "asc";

    const where: BusinessModelWhere = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: BusinessModelOrderBy = 
      sortColumn === "title" 
        ? { title: sortDirection as "asc" | "desc" }
        : { order: sortDirection as "asc" | "desc" };

    // Parallel execution untuk optimasi performa
    const [total, businessModels] = await Promise.all([
      prisma.businessModel.count({ where }),
      prisma.businessModel.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
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
      }),
    ]);

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for Prisma "Record not found" error (P2025)
    if (errorMessage.includes("Record to update not found") || errorMessage.includes("P2025")) {
      return NextResponse.json({ message: "Business model not found" }, { status: 404 });
    }

    console.error("[API] Update business model error:", error);
    return NextResponse.json(
      { message: "Failed to update business model", error: errorMessage },
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

    // Use transaction to soft delete business models and their related tables
    const result = await prisma.$transaction(async (tx: TxClient) => {
      // Soft delete business models
      const deletedModels = await tx.businessModel.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: {
          deletedAt: now,
          deletedBy: payload.username,
        },
      });

      // Soft delete related tables (cascade soft delete)
      await tx.businessModelTable.updateMany({
        where: {
          businessModelId: { in: ids },
          deletedAt: null,
        },
        data: {
          deletedAt: now,
          deletedBy: payload.username,
        },
      });

      return deletedModels;
    });

    return NextResponse.json({ updatedCount: result.count });
  } catch (error) {
    console.error("[API] Delete business models error:", error);
    return NextResponse.json(
      { message: "Failed to delete business models", error: (error as Error).message },
      { status: 500 }
    );
  }
}

