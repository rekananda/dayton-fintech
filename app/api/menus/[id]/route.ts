import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  const menu = await prisma.menu.findUnique({ where: { id } });
  if (!menu) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(menu);
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const body = await request.json();
    const { label, href, order } = body ?? {};
    const updated = await prisma.menu.update({
      where: { id },
      data: {
        ...(label !== undefined ? { label } : {}),
        ...(href !== undefined ? { href } : {}),
        ...(order !== undefined ? { order } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Failed to update menu" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    await prisma.menu.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Failed to delete menu" }, { status: 500 });
  }
}


