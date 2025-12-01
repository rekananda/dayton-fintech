import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortColumn = searchParams.get("sortColumn") || "order";
    const sortDirection = searchParams.get("sortDirection") || "asc";

    const where: Prisma.QnAWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { question: { contains: search, mode: "insensitive" } },
        { answer: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy = 
      sortColumn === "question" 
        ? { question: sortDirection as "asc" | "desc" }
        : { order: sortDirection as "asc" | "desc" };

    const total = await prisma.qnA.count({ where });

    const skip = (page - 1) * limit;
    const qnas = await prisma.qnA.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: qnas,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch Q&As", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, answer, order } = body ?? {};

    if (!question || !answer || typeof order !== "number") {
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

    const created = await prisma.qnA.create({
      data: {
        question,
        answer,
        order,
        createdAt: now,
        updatedAt: now,
        createdBy: payload.username,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[API] Create Q&A error:", error);
    return NextResponse.json(
      { message: "Failed to create Q&A" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, question, answer, order } = body ?? {};

    if (
      typeof id !== "number" ||
      !question ||
      !answer ||
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

    const updated = await prisma.qnA.update({
      where: { id },
      data: {
        question,
        answer,
        order,
        updatedAt: now,
        updatedBy: payload.username,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if ((error as Error).message.includes("Record to update not found")) {
      return NextResponse.json({ message: "Q&A not found" }, { status: 404 });
    }

    console.error("[API] Update Q&A error:", error);
    return NextResponse.json(
      { message: "Failed to update Q&A" },
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

    const result = await prisma.qnA.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: now,
        deletedBy: payload.username,
      },
    });

    return NextResponse.json({ updatedCount: result.count });
  } catch (error) {
    console.error("[API] Delete Q&As error:", error);
    return NextResponse.json(
      { message: "Failed to delete Q&As" },
      { status: 500 }
    );
  }
}

