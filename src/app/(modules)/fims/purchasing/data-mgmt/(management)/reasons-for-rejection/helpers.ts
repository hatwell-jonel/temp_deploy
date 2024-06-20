import { db } from "@/db";
import { reasonForRejection } from "@/db/schema/fims";
import type { reasonForRejectionSearchParams } from "@/validations/searchParams";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { z } from "zod";

export async function fetchTabs() {
  const all = await db.select().from(reasonForRejection);
  const active = await db
    .select()
    .from(reasonForRejection)
    .where(eq(reasonForRejection.status, 1));
  const inactive = await db
    .select()
    .from(reasonForRejection)
    .where(eq(reasonForRejection.status, 2));

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
  searchParams: z.infer<typeof reasonForRejectionSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  let reasonForRejectionData = [];
  const pages = Math.ceil(
    (await db.query.reasonForRejection.findMany()).length / 10,
  );
  if (name) {
    reasonForRejectionData = await db.query.reasonForRejection.findMany({
      limit,
      offset,
      orderBy: [desc(reasonForRejection.createdAt)],
      where: and(
        eq(reasonForRejection.name, name),
        inArray(reasonForRejection.status, [status ? status : 1, 2]),
      ),
    });
  } else {
    reasonForRejectionData = await db.query.reasonForRejection.findMany({
      limit,
      offset,
      orderBy: [desc(reasonForRejection.createdAt)],
      where: inArray(reasonForRejection.status, [status ? status : 1, 2]),
    });
  }
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: reasonForRejectionData,
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
