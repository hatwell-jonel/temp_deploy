import { db } from "@/db";
import { serviceDescription } from "@/db/schema/fims";
import type { serviceDescriptionSearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";

export async function fetchTabs() {
  const all = await db.select().from(serviceDescription);
  const active = await db
    .select()
    .from(serviceDescription)
    .where(eq(serviceDescription.status, 1));
  const inactive = await db
    .select()
    .from(serviceDescription)
    .where(eq(serviceDescription.status, 2));

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
  searchParams: z.infer<typeof serviceDescriptionSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let serviceDescriptionData = [];
  const pages = Math.ceil(
    (await db.query.serviceDescription.findMany()).length / 10,
  );
  if (name) {
    serviceDescriptionData = await db.query.serviceDescription.findMany({
      limit,
      offset,
      orderBy: [desc(serviceDescription.createdAt)],
      where: and(
        eq(serviceDescription.description, name),
        inArray(serviceDescription.status, [status ? status : 1, 2]),
      ),
      with: {
        serviceCategory: true,
      },
    });
  } else {
    serviceDescriptionData = await db.query.serviceDescription.findMany({
      limit,
      offset,
      orderBy: [desc(serviceDescription.createdAt)],
      where: inArray(serviceDescription.status, [status ? status : 1, 2]),
      with: {
        serviceCategory: true,
      },
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: serviceDescriptionData,
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
  const categories = await db.query.serviceCategory.findMany({
    where: (category, { eq }) => eq(category.status, 1),
    columns: {
      id: true,
      name: true,
    },
  });
  return categories;
});
