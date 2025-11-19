import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [menus, timelines, businessModels, events, legals, qnas] = await Promise.all([
      prisma.menu.findMany({ orderBy: { order: "asc" } }),
      prisma.timeline.findMany({ orderBy: { order: "asc" } }),
      prisma.businessModel.findMany({ orderBy: { order: "asc" } }),
      prisma.event.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.legal.findMany({ orderBy: { order: "asc" } }),
      prisma.qnA.findMany({ orderBy: { order: "asc" } }),
    ]);

    return NextResponse.json({
      menus,
      timelines,
      businessModels,
      events,
      legals,
      qnas,
    });
  } catch (error) {
    // Do not leak internals
    return NextResponse.json({ message: "Failed to load landing data" }, { status: 500 });
  }
}


