import { db } from "@/db";
import { requisition } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import type { purchaseRequisitionSearchParams } from "@/validations/searchParams";
import { and, desc, eq, or } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";

const isPurchaseRequisition = eq(requisition.requisitionTypeId, 2);

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof purchaseRequisitionSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);

  const user = await getUser();
  const userId = Number(user.id);

  const where = and(
    isPurchaseRequisition,
    name ? eq(requisition.requisitionNo, name) : undefined,
    or(
      eq(requisition.nextActionUserId, userId),
      eq(requisition.createdBy, userId),
    ),
  );

  const all = await db.query.requisition.findMany({
    where,
  });

  const pages = Math.ceil(all.length / 10);

  const requisitionData = await db.query.requisition.findMany({
    limit,
    offset,
    orderBy: [desc(requisition.createdAt)],
    with: {
      priorityLevel: true,
      creator: true,
      purchasing: true,
    },
    where,
  });
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: requisitionData,
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
    where: (category, { eq, and }) =>
      and(eq(category.status, 1), eq(category.isRecurring, false)),
    columns: {
      id: true,
      name: true,
    },
  });
  return categories;
});

export const getDescriptions = cache(async () => {
  const descriptions = await db.query.itemDescription.findMany({
    where: (description, { eq }) => eq(description.status, 1),
    columns: {
      id: true,
      description: true,
      itemCategoryId: true,
      price: true,
    },
  });
  return descriptions;
});

export const getPreferredSupplier = cache(async () => {
  const preferredSuppliers = await db.query.supplier.findMany({
    where: (table, { eq }) => eq(table.status, 1),
    columns: {
      id: true,
      name: true,
    },
  });
  return preferredSuppliers;
});

export const getLocations = cache(async () => {
  const locations = await db.query.branchReference.findMany({
    columns: {
      id: true,
      code: true,
    },
  });
  return locations;
});

export const getPurposes = cache(async () => {
  const purposes = await db.query.purpose.findMany({
    where: (purpose, { eq }) => eq(purpose.status, 1),
    columns: {
      id: true,
      name: true,
    },
  });
  return purposes;
});

export const getUnits = cache(async () => {
  const units = await db.query.unit.findMany({
    where: (table, { eq }) => eq(table.status, 1),
    columns: {
      id: true,
      name: true,
    },
  });
  return units;
});

export async function getReasons() {
  const reasons = await db.query.reasonForRejection.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return reasons;
}

export async function getRequisitionDetails(referenceNo: string) {
  const data = await db.query.purchase.findMany({
    where: (table, { eq, and, isNull }) =>
      and(eq(table.requisitionNo, referenceNo), isNull(table.rejectionId)),
    with: {
      attachments: true,
      beneficialBranch: {
        columns: {
          code: true,
        },
      },
      unit: {
        columns: {
          name: true,
        },
      },
      preferredSupplier: {
        columns: {
          name: true,
        },
      },
      purpose: {
        columns: {
          name: true,
        },
      },
      itemCategory: {
        columns: {
          name: true,
        },
        with: {
          budgetSource: {
            columns: {
              name: true,
              id: true,
            },
          },
          chartOfAccounts: {
            columns: {
              name: true,
            },
          },
          opexCategory: {
            columns: {
              category: true,
              type: true,
            },
          },
          subAccounts: {
            columns: {
              name: true,
            },
          },
        },
      },
      itemDescription: {
        columns: {
          description: true,
        },
      },
      requisition: {
        with: {
          nextActionUser: true,
          priorityLevel: true,
        },
      },
    },
  });
  return data;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type GetType<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>;

export type Categories = GetType<typeof getCategories>;
export type Descriptions = GetType<typeof getDescriptions>;
export type PreferredSuppliers = GetType<typeof getPreferredSupplier>;
export type Locations = GetType<typeof getLocations>;
export type Purposes = GetType<typeof getPurposes>;
export type Units = GetType<typeof getUnits>;
export type Reasons = GetType<typeof getReasons>;
export type RequisitionDetails = NonNullable<
  GetType<typeof getRequisitionDetails>
>;
