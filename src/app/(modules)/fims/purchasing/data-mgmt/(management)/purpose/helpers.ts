import { db } from "@/db";
import { purpose } from "@/db/schema/fims";
import type { purposeSearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { z } from "zod";

export async function fetchTabs() {
  const all = await db.select().from(purpose);
  const active = await db.select().from(purpose).where(eq(purpose.status, 1));
  const inactive = await db.select().from(purpose).where(eq(purpose.status, 2));

  const tabs: {
    name: string;
    value: number;
    filterValue: string | null;
  }[] = [
    {
      filterValue: null,
      name: "all",
      value: all.length,
    },
    {
      filterValue: "1",
      name: "active",
      value: active.length,
    },
    {
      filterValue: "2",
      name: "inactive",
      value: inactive.length,
    },
  ];
  return tabs;
}

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof purposeSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let purposeData = [];
  const pages = Math.ceil((await db.query.purpose.findMany()).length / 10);
  if (name) {
    purposeData = await db.query.purpose.findMany({
      limit,
      offset,
      orderBy: [desc(purpose.createdAt)],
      where: and(
        eq(purpose.name, name),
        inArray(purpose.status, [status ? status : 1, 2]),
      ),
    });
  } else {
    purposeData = await db.query.purpose.findMany({
      limit,
      offset,
      orderBy: [desc(purpose.createdAt)],
      where: inArray(purpose.status, [status ? status : 1, 2]),
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: purposeData,
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
