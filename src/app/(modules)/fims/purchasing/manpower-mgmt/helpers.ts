import { db } from "@/db";
import { manpower } from "@/db/schema/fims";
import type { manpowerSearchParams } from "@/validations/searchParams";
import { desc } from "drizzle-orm";
import type { z } from "zod";

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof manpowerSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  const pages = Math.ceil((await db.query.manpower.findMany()).length / 10);

  const data = await db.query.manpower.findMany({
    limit,
    offset,
    orderBy: [desc(manpower.createdAt)],
    where: (table, { sql }) =>
      name
        ? sql`CONCAT(${table.firstName},' ',${table.middleName},' ',${table.lastName}) ILIKE '%${name}%'`
        : undefined,
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
