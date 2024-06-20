import { db } from "@/db";
import { requisition } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import type { canvasRequestSearchParams } from "@/validations/searchParams";
import { and, desc, eq, or } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof canvasRequestSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);

  const user = await getUser();
  const userId = Number(user.id);

  const where = and(
    eq(requisition.hasCanvassing, false),
    eq(requisition.requisitionTypeId, 2),
    eq(requisition.finalStatus, 1),
    name ? eq(requisition.requisitionNo, name) : undefined,
    or(
      eq(requisition.nextActionUserId, userId),
      eq(requisition.createdBy, userId),
    ),
  );

  const all = await db.query.requisition.findMany({
    where,
  });

  const pages = Math.ceil(all.length / 10);

  const data = await db.query.requisition.findMany({
    limit,
    offset,
    orderBy: [desc(requisition.createdAt)],
    with: {
      priorityLevel: true,
      creator: {
        with: {
          division: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
    where,
  });
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data,
    meta: {
      previous,
      next,
      pages: Array.from({ length: pages }).map((_, index) => ({
        number: index + 1,
        isActive: page === index + 1,
      })),
      currentPage: page,
    },
  };
}

export const getSuppliers = cache(async () => {
  return await db.query.supplier.findMany({
    where: (table, { eq }) => eq(table.status, 1),
  });
});
