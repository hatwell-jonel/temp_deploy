import { db } from "@/db";
import { supplier } from "@/db/schema/fims";
import type { supplierSearchParams } from "@/validations/searchParams";
import { desc } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof supplierSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);
  const pages = Math.ceil((await db.query.supplier.findMany()).length / 10);

  const data = await db.query.supplier.findMany({
    limit,
    offset,
    orderBy: [desc(supplier.createdAt)],
    where: (table, { eq }) => (name ? eq(table.name, name) : undefined),
    with: {
      bank: true,
      barangay: true,
      city: true,
      industry: true,
      region: true,
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

export const getIndustries = cache(async () => {
  const industries = await db.query.industry.findMany();
  return industries;
});

export const getRegions = cache(async () => {
  const regions = await db.query.region.findMany();
  return regions;
});

export const getCities = cache(async (regionId: number | undefined) => {
  if (!regionId) return [];
  const cities = await db.query.city.findMany({
    where: (table, { eq }) => eq(table.regionId, regionId),
  });
  return cities;
});

export const getBarangays = cache(async (cityId: number | undefined) => {
  if (!cityId) return [];
  const barangays = await db.query.barangay.findMany({
    where: (table, { eq }) => eq(table.cityId, cityId),
  });
  return barangays;
});
