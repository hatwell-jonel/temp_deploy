import { db } from "@/db";
import { opexCategory } from "@/db/schema/fims";
import type { opexCategorySearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { z } from "zod";

export async function fetchTabs() {
  const all = await db.select().from(opexCategory);
  const active = await db
    .select()
    .from(opexCategory)
    .where(eq(opexCategory.status, 1));
  const inactive = await db
    .select()
    .from(opexCategory)
    .where(eq(opexCategory.status, 2));

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
  searchParams: z.infer<typeof opexCategorySearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let opexCategoryData = [];
  const pages = Math.ceil((await db.query.opexCategory.findMany()).length / 10);
  if (name) {
    opexCategoryData = await db.query.opexCategory.findMany({
      limit,
      offset,
      orderBy: [desc(opexCategory.createdAt)],
      where: and(
        eq(opexCategory.category, name),
        inArray(opexCategory.status, [status ? status : 1, 2]),
      ),
    });
  } else {
    opexCategoryData = await db.query.opexCategory.findMany({
      limit,
      offset,
      orderBy: [desc(opexCategory.createdAt)],
      where: inArray(opexCategory.status, [status ? status : 1, 2]),
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: opexCategoryData,
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
