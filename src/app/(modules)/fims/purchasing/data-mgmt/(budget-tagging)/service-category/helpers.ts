import { db } from "@/db";
import {
  budgetSource,
  chartOfAccounts,
  opexCategory,
  serviceCategory,
  subAccounts,
} from "@/db/schema/fims";
import type { serviceCategorySearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { z } from "zod";

export async function fetchTabs() {
  const all = await db.select().from(serviceCategory);
  const active = await db
    .select()
    .from(serviceCategory)
    .where(eq(serviceCategory.status, 1));
  const inactive = await db
    .select()
    .from(serviceCategory)
    .where(eq(serviceCategory.status, 2));

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
  searchParams: z.infer<typeof serviceCategorySearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let serviceCategoryData = [];
  const pages = Math.ceil(
    (await db.query.serviceCategory.findMany()).length / 10,
  );
  if (name) {
    serviceCategoryData = await db.query.serviceCategory.findMany({
      limit,
      offset,
      orderBy: [desc(serviceCategory.createdAt)],
      where: and(
        eq(serviceCategory.name, name),
        inArray(serviceCategory.status, [status ? status : 1, 2]),
      ),
      with: {
        budgetSource: true,
        chartOfAccounts: true,
        opexCategory: true,
        subAccounts: true,
      },
    });
  } else {
    serviceCategoryData = await db.query.serviceCategory.findMany({
      limit,
      offset,
      orderBy: [desc(serviceCategory.createdAt)],
      where: inArray(serviceCategory.status, [status ? status : 1, 2]),
      with: {
        budgetSource: true,
        chartOfAccounts: true,
        opexCategory: true,
        subAccounts: true,
      },
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: serviceCategoryData,
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

// Create

export async function getDropdowns() {
  const budgetSourceActives = await db.query.budgetSource.findMany({
    where: eq(budgetSource.status, 1),
  });
  const opexCategoryActives = await db.query.opexCategory.findMany({
    where: eq(opexCategory.status, 1),
  });
  const chartOfAccountsActives = await db.query.chartOfAccounts.findMany({
    where: eq(chartOfAccounts.status, 1),
  });
  const subAccountsActives = await db.query.subAccounts.findMany({
    where: eq(subAccounts.status, 1),
  });
  return {
    budgetSource: budgetSourceActives,
    opexCategory: opexCategoryActives,
    chartOfAccounts: chartOfAccountsActives,
    subAccounts: subAccountsActives,
  };
}
