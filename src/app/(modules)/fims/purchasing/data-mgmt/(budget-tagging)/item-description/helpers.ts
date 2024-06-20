import { db } from "@/db";
import { itemDescription } from "@/db/schema/fims";
import type { itemDescriptionSearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";

export async function fetchTabs() {
  const all = await db.select().from(itemDescription);
  const active = await db
    .select()
    .from(itemDescription)
    .where(eq(itemDescription.status, 1));
  const inactive = await db
    .select()
    .from(itemDescription)
    .where(eq(itemDescription.status, 2));

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
  searchParams: z.infer<typeof itemDescriptionSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let itemDescriptionData = [];
  const pages = Math.ceil(
    (await db.query.itemDescription.findMany()).length / 10,
  );
  if (name) {
    itemDescriptionData = await db.query.itemDescription.findMany({
      limit,
      offset,
      orderBy: [desc(itemDescription.createdAt)],
      where: and(
        eq(itemDescription.description, name),
        inArray(itemDescription.status, [status ? status : 1, 2]),
      ),
      with: {
        itemCategory: true,
      },
    });
  } else {
    itemDescriptionData = await db.query.itemDescription.findMany({
      limit,
      offset,
      orderBy: [desc(itemDescription.createdAt)],
      where: inArray(itemDescription.status, [status ? status : 1, 2]),
      with: {
        itemCategory: true,
      },
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: itemDescriptionData,
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

export const getCategories = cache(async () => {
  const categories = await db.query.itemCategory.findMany({
    where: (category, { eq }) => eq(category.status, 1),
    columns: {
      id: true,
      name: true,
    },
  });
  return categories;
});
