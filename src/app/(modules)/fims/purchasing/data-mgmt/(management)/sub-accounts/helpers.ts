import { db } from "@/db";
import { subAccounts } from "@/db/schema/fims";
import type { subAccountsSearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { z } from "zod";

export async function fetchTabs() {
  const all = await db.select().from(subAccounts);
  const active = await db
    .select()
    .from(subAccounts)
    .where(eq(subAccounts.status, 1));
  const inactive = await db
    .select()
    .from(subAccounts)
    .where(eq(subAccounts.status, 2));

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
  searchParams: z.infer<typeof subAccountsSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let subAccountsData = [];
  const pages = Math.ceil((await db.query.subAccounts.findMany()).length / 10);
  if (name) {
    subAccountsData = await db.query.subAccounts.findMany({
      limit,
      offset,
      orderBy: [desc(subAccounts.createdAt)],
      where: and(
        eq(subAccounts.name, name),
        inArray(subAccounts.status, [status ? status : 1, 2]),
      ),
    });
  } else {
    subAccountsData = await db.query.subAccounts.findMany({
      limit,
      offset,
      orderBy: [desc(subAccounts.createdAt)],
      where: inArray(subAccounts.status, [status ? status : 1, 2]),
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: subAccountsData,
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
