import { db } from "@/db";
import { chartOfAccounts } from "@/db/schema/fims";
import type { chartOfAccountsSearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { z } from "zod";

export async function fetchTabs() {
  const all = await db.select().from(chartOfAccounts);
  const active = await db
    .select()
    .from(chartOfAccounts)
    .where(eq(chartOfAccounts.status, 1));
  const inactive = await db
    .select()
    .from(chartOfAccounts)
    .where(eq(chartOfAccounts.status, 2));

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
  searchParams: z.infer<typeof chartOfAccountsSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let chartOfAccountsData = [];
  const pages = Math.ceil(
    (await db.query.chartOfAccounts.findMany()).length / 10,
  );
  if (name) {
    chartOfAccountsData = await db.query.chartOfAccounts.findMany({
      limit,
      offset,
      orderBy: [desc(chartOfAccounts.createdAt)],
      where: and(
        eq(chartOfAccounts.name, name),
        inArray(chartOfAccounts.status, [status ? status : 1, 2]),
      ),
    });
  } else {
    chartOfAccountsData = await db.query.chartOfAccounts.findMany({
      limit,
      offset,
      orderBy: [desc(chartOfAccounts.createdAt)],
      where: inArray(chartOfAccounts.status, [status ? status : 1, 2]),
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: chartOfAccountsData,
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
