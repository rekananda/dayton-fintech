import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { BussinessModelDataT, EventDataT, LegalDataT, MenuDataT, QnADataT, TimelineDataT, DynamicTableDataT } from "@/config/types";

type BusinessModelWithRelations = NonNullable<Awaited<ReturnType<typeof prisma.businessModel.findFirst<{
  include: {
    tables: {
      include: {
        columns: true;
        rows: {
          include: {
            cells: {
              include: {
                column: true;
              };
            };
          };
        };
      };
    };
  };
}>>>>;

function transformBusinessModel(businessModel: BusinessModelWithRelations): BussinessModelDataT {
  const tables = businessModel.tables
    .sort((a, b) => a.order - b.order)
    .map((table) => {
      const columns = table.columns
        .filter((col) => !col.deletedAt)
        .sort((a, b) => a.order - b.order)
        .map((col) => ({
          key: col.key as string,
          label: col.label,
        }));

      const rows = table.rows
        .filter((row) => !row.deletedAt)
        .sort((a, b) => a.order - b.order)
        .map((row) => {
          const rowData: Record<string, string | number> = { id: row.id, order: row.order };
          
          row.cells.forEach((cell) => {
            const column = table.columns.find((col: { id: number; key: string; deletedAt: Date | null }) => col.id === cell.columnId);
            if (column && !column.deletedAt) {
              rowData[column.key] = cell.value;
            }
          });
          
          return rowData;
        });

      return {
        columns: columns.map((col) => ({
          key: col.key as keyof DynamicTableDataT,
          label: col.label,
        })),
        datas: rows as DynamicTableDataT[],
      };
    });

  return {
    id: businessModel.id,
    title: businessModel.title,
    description: businessModel.description,
    tags: businessModel.tags,
    order: businessModel.order,
    tables: tables.length > 0 ? (tables as BussinessModelDataT["tables"]) : undefined,
    tnc: businessModel.tnc || undefined,
  };
}

export async function GET() {
  try {
    const [menus, timelines, businessModelsRaw, events, legals, qnas, configs] = await Promise.all([
      prisma.menu.findMany({ 
        where: { deletedAt: null },
        orderBy: { order: "asc" } 
      }),
      prisma.timeline.findMany({ 
        where: { deletedAt: null },
        orderBy: { order: "asc" } 
      }),
      prisma.businessModel.findMany({ 
        where: { deletedAt: null },
        orderBy: { order: "asc" },
        include: {
          tables: {
            where: { deletedAt: null },
            orderBy: { order: "asc" },
            include: {
              columns: {
                where: { deletedAt: null },
                orderBy: { order: "asc" },
              },
              rows: {
                where: { deletedAt: null },
                orderBy: { order: "asc" },
                include: {
                  cells: {
                    include: {
                      column: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.event.findMany({ 
        where: { deletedAt: null },
        orderBy: { date: "asc" } 
      }),
      prisma.legal.findMany({ 
        where: { deletedAt: null },
        orderBy: { order: "asc" } 
      }),
      prisma.qnA.findMany({ 
        where: { deletedAt: null },
        orderBy: { order: "asc" } 
      }),
      prisma.config.findMany({
        where: { deletedAt: null },
      }),
    ]);

    const menusFormatted: MenuDataT[] = menus.map((menu) => ({
      id: menu.id,
      label: menu.label,
      href: menu.href,
      order: menu.order,
    }));

    const timelinesFormatted: TimelineDataT[] = timelines.map((timeline) => ({
      id: timeline.id,
      icon: timeline.icon as TimelineDataT["icon"],
      title: timeline.title,
      description: timeline.description,
      color: timeline.color as TimelineDataT["color"],
      order: timeline.order,
    }));

    const businessModelsFormatted: BussinessModelDataT[] = businessModelsRaw.map(transformBusinessModel);

    const eventsFormatted: EventDataT[] = events.map((event) => ({
      id: event.id,
      imageUrl: event.imageUrl,
      date: event.date instanceof Date ? event.date.toISOString() : new Date(event.date).toISOString(),
      title: event.title,
      description: event.description,
      meetingLink: event.meetingLink || undefined,
      location: event.location || undefined,
    }));

    const legalsFormatted: LegalDataT[] = legals.map((legal) => ({
      id: legal.id,
      title: legal.title,
      description: legal.description,
      order: legal.order,
    }));

    const qnasFormatted: QnADataT[] = qnas.map((qna) => ({
      id: qna.id,
      question: qna.question,
      answer: qna.answer,
      order: qna.order,
    }));

    const parseConfigValue = <T = unknown>(value: string | undefined, defaultValue: T): T => {
      if (!value) return defaultValue;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    };

    const getConfigValue = <T = unknown>(key: string, defaultValue: T): T => {
      const config = configs.find((c: { key: string; value: string }) => c.key === key);
      return config ? parseConfigValue<T>(config.value, defaultValue) : defaultValue;
    };

    const whatsappNumber = getConfigValue("whatsapp_number", "6281234567890");
    const whatsappMessage = getConfigValue("whatsapp_message", "Halo, saya ingin bertanya tentang layanan Dayton Fintech.");
    const email = getConfigValue("email", "hello@daytonfintech.com");
    const mainTitle = getConfigValue("main-title", "Trading Emas Otomatis, Aman dan Terukur");
    const mainDescription = getConfigValue("main-description", "Pendekatan trend-following yang disiplin dengan target adaptif mengikuti volatilitas, pengendalian eksposur, serta jeda otomatis saat rilis data berdampak tinggi.");
    const mainBadges = getConfigValue("main-badges", ["Gold • XAUUSD • H1 • Tren"]);
    const secondaryBadges = getConfigValue("secondary-badges", ["Profit Sharing <b>25%</b>", "Referral hingga <b>10%</b>", "<b>Broker MT4 • H1</b>"]);

    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({
      menus: menusFormatted,
      timelines: timelinesFormatted,
      businessModels: businessModelsFormatted,
      events: eventsFormatted,
      legals: legalsFormatted,
      qnas: qnasFormatted,
      config: {
        whatsappNumber,
        whatsappMessage,
        whatsappLink,
        email,
        mainTitle,
        mainDescription,
        mainBadges,
        secondaryBadges,
      },
    });
  } catch (error) {
    console.error("Error loading landing data:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { 
        message: "Failed to load landing data",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}


