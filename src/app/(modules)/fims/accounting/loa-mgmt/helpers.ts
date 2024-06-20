import { db } from "@/db";
import type { loaSearchParams } from "@/validations/searchParams";
import type { z } from "zod";

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof loaSearchParams>;
}) {
  const { status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 9;
  const offset = limit * (page - 1);
  const pages = Math.ceil((await db.query.loaManagement.findMany()).length / 9);

  const data = await db.query.loaManagement.findMany({
    limit,
    offset,
    orderBy: (table, { desc, asc }) => [
      asc(table.subModuleId),
      asc(table.divisionId),
      asc(table.level),
      desc(table.createdAt),
    ],
    with: {
      division: true,
      firstReviewer: true,
      secondReviewer: true,
      firstApprover: true,
      secondApprover: true,
      thirdApprover: true,
      subModule: true,
    },
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
