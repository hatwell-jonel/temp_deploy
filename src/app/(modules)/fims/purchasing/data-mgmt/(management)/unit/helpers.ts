import { db } from "@/db";
import { unit } from "@/db/schema/fims";
import type { unitSearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { z } from "zod";

export async function fetchTabs() {
  const all = await db.select().from(unit);
  const active = await db.select().from(unit).where(eq(unit.status, 1));
  const inactive = await db.select().from(unit).where(eq(unit.status, 2));

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
  searchParams: z.infer<typeof unitSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let unitData = [];
  const pages = Math.ceil((await db.query.unit.findMany()).length / 10);
  if (name) {
    unitData = await db.query.unit.findMany({
      limit,
      offset,
      orderBy: [desc(unit.createdAt)],
      where: and(
        eq(unit.name, name),
        inArray(unit.status, [status ? status : 1, 2]),
      ),
    });
  } else {
    unitData = await db.query.unit.findMany({
      limit,
      offset,
      orderBy: [desc(unit.createdAt)],
      where: inArray(unit.status, [status ? status : 1, 2]),
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: unitData,
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
