import { db } from "@/db";
import { budgetSource } from "@/db/schema/fims";
import type { budgetSourceSearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { z } from "zod";

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof budgetSourceSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let budgetSourceData = [];
  const pages = Math.ceil((await db.query.budgetSource.findMany()).length / 10);
  if (name) {
    budgetSourceData = await db.query.budgetSource.findMany({
      limit,
      offset,
      orderBy: [desc(budgetSource.createdAt)],
      where: and(
        eq(budgetSource.name, name),
        inArray(budgetSource.status, [status ? status : 1, 2]),
      ),
    });
  } else {
    budgetSourceData = await db.query.budgetSource.findMany({
      limit,
      offset,
      orderBy: [desc(budgetSource.createdAt)],
      where: inArray(budgetSource.status, [status ? status : 1, 2]),
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: budgetSourceData,
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
