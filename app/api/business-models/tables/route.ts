import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/config/jwt";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessModelId = searchParams.get("businessModelId");

    if (!businessModelId) {
      return NextResponse.json({ message: "businessModelId is required" }, { status: 400 });
    }

    const tables = await prisma.businessModelTable.findMany({
      where: {
        businessModelId: parseInt(businessModelId),
        deletedAt: null,
      },
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
    });

    return NextResponse.json({ data: tables });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch tables", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessModelId, name, order, columns, rows } = body ?? {};

    if (!businessModelId || !name || typeof order !== "number") {
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

    // Create table with columns, rows, and cells in a transaction
    const table = await prisma.$transaction(async (tx) => {
      const createdTable = await tx.businessModelTable.create({
        data: {
          businessModelId,
          name,
          order,
          createdAt: now,
          updatedAt: now,
          createdBy: payload.username,
          updatedBy: payload.username,
        },
      });

      // Create columns
      if (Array.isArray(columns) && columns.length > 0) {
        await tx.businessModelTableColumn.createMany({
          data: columns.map((col: { key: string; label: string; order: number }) => ({
            tableId: createdTable.id,
            key: col.key,
            label: col.label,
            order: col.order,
            createdAt: now,
            updatedAt: now,
            createdBy: payload.username,
            updatedBy: payload.username,
          })),
        });
      }

      // Get created columns
      const createdColumns = await tx.businessModelTableColumn.findMany({
        where: { tableId: createdTable.id },
      });

      // Create rows and cells
      if (Array.isArray(rows) && rows.length > 0) {
        for (const row of rows) {
          const createdRow = await tx.businessModelTableRow.create({
            data: {
              tableId: createdTable.id,
              order: row.order || 1,
              createdAt: now,
              updatedAt: now,
              createdBy: payload.username,
              updatedBy: payload.username,
            },
          });

          // Create cells for this row
          if (row.cells && Array.isArray(row.cells)) {
            const cellsData = row.cells.map((cell: { columnKey: string; value: string }) => {
              const column = createdColumns.find((col) => col.key === cell.columnKey);
              if (!column) return null;
              
              return {
                rowId: createdRow.id,
                columnId: column.id,
                value: cell.value || "",
                createdAt: now,
                updatedAt: now,
                createdBy: payload.username,
                updatedBy: payload.username,
              };
            }).filter(Boolean);

            if (cellsData.length > 0) {
              await tx.businessModelTableCell.createMany({
                data: cellsData as Prisma.BusinessModelTableCellCreateManyInput[],
              });
            }
          }
        }
      }

      // Return full table with relations
      return await tx.businessModelTable.findUnique({
        where: { id: createdTable.id },
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
      });
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error("[API] Create table error:", error);
    return NextResponse.json(
      { message: "Failed to create table", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, order, columns, rows } = body ?? {};

    if (typeof id !== "number" || !name || typeof order !== "number") {
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

    // Update table with columns, rows, and cells in a transaction
    const updatedTable = await prisma.$transaction(async (tx) => {
      // Update table basic info
      await tx.businessModelTable.update({
        where: { id },
        data: {
          name,
          order,
          updatedAt: now,
          updatedBy: payload.username,
        },
      });

      // Soft delete existing columns
      await tx.businessModelTableColumn.updateMany({
        where: { tableId: id, deletedAt: null },
        data: {
          deletedAt: now,
          deletedBy: payload.username,
        },
      });

      // Create/update columns
      if (Array.isArray(columns) && columns.length > 0) {
        for (const col of columns) {
          if (col.id) {
            // Update existing column
            await tx.businessModelTableColumn.update({
              where: { id: col.id },
              data: {
                key: col.key,
                label: col.label,
                order: col.order,
                deletedAt: null,
                updatedAt: now,
                updatedBy: payload.username,
              },
            });
          } else {
            // Create new column
            await tx.businessModelTableColumn.create({
              data: {
                tableId: id,
                key: col.key,
                label: col.label,
                order: col.order,
                createdAt: now,
                updatedAt: now,
                createdBy: payload.username,
                updatedBy: payload.username,
              },
            });
          }
        }
      }

      // Get all columns (including newly created)
      const allColumns = await tx.businessModelTableColumn.findMany({
        where: { tableId: id, deletedAt: null },
      });

      // Soft delete existing rows (which will cascade delete cells)
      await tx.businessModelTableRow.updateMany({
        where: { tableId: id, deletedAt: null },
        data: {
          deletedAt: now,
          deletedBy: payload.username,
        },
      });

      // Create/update rows and cells
      if (Array.isArray(rows) && rows.length > 0) {
        for (const row of rows) {
          let rowId: number;
          
          if (row.id) {
            // Update existing row
            await tx.businessModelTableRow.update({
              where: { id: row.id },
              data: {
                order: row.order,
                deletedAt: null,
                updatedAt: now,
                updatedBy: payload.username,
              },
            });
            rowId = row.id;

            // Delete existing cells for this row
            await tx.businessModelTableCell.updateMany({
              where: { rowId: row.id },
              data: {
                deletedAt: now,
                deletedBy: payload.username,
              },
            });
          } else {
            // Create new row
            const createdRow = await tx.businessModelTableRow.create({
              data: {
                tableId: id,
                order: row.order,
                createdAt: now,
                updatedAt: now,
                createdBy: payload.username,
                updatedBy: payload.username,
              },
            });
            rowId = createdRow.id;
          }

          // Create/update cells
          if (row.cells && Array.isArray(row.cells)) {
            const cellsData = row.cells.map((cell: { columnKey: string; value: string }) => {
              const column = allColumns.find((col) => col.key === cell.columnKey);
              if (!column) return null;
              
              return {
                rowId,
                columnId: column.id,
                value: cell.value || "",
                createdAt: now,
                updatedAt: now,
                createdBy: payload.username,
                updatedBy: payload.username,
              };
            }).filter(Boolean);

            if (cellsData.length > 0) {
              await tx.businessModelTableCell.createMany({
                data: cellsData as Prisma.BusinessModelTableCellCreateManyInput[],
                skipDuplicates: true,
              });
            }
          }
        }
      }

      // Return updated table with relations
      return await tx.businessModelTable.findUnique({
        where: { id },
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
                where: { deletedAt: null },
                include: {
                  column: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(updatedTable);
  } catch (error) {
    if ((error as Error).message.includes("Record to update not found")) {
      return NextResponse.json({ message: "Table not found" }, { status: 404 });
    }

    console.error("[API] Update table error:", error);
    return NextResponse.json(
      { message: "Failed to update table", error: (error as Error).message },
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

    const result = await prisma.businessModelTable.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: now,
        deletedBy: payload.username,
      },
    });

    return NextResponse.json({ updatedCount: result.count });
  } catch (error) {
    console.error("[API] Delete tables error:", error);
    return NextResponse.json(
      { message: "Failed to delete tables" },
      { status: 500 }
    );
  }
}

