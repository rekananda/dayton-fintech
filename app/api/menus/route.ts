import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";

export async function GET() {
  const menus = await prisma.menu.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(menus);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, href, order } = body ?? {};
    if (!label || !href || typeof order !== "number") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }
    const created = await prisma.menu.create({ data: { label, href, order } });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create menu" }, { status: 500 });
  }
}


