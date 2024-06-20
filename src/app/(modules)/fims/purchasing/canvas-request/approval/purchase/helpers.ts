import { db } from "@/db";
import { canvassing } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import type { canvasRequestSearchParams } from "@/validations/searchParams";
import { and, desc, eq, ne, or } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";

export async function getTableData({
  searchParams,
  finalStatus,
}: {
  searchParams: z.infer<typeof canvasRequestSearchParams>;
  finalStatus?: number;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);

  const user = await getUser();
  const userId = Number(user.id);

  const where = and(
    eq(canvassing.type, 2),
    ne(canvassing.finalStatus, 1),
    name ? eq(canvassing.canvasRequestNo, name) : undefined,
    or(
      eq(canvassing.nextActionUserId, userId),
      eq(canvassing.createdBy, userId),
    ),
  );

  const all = await db.query.canvassing.findMany({
    where,
  });

  const pages = Math.ceil(all.length / 10);

  const canvassingData = await db.query.canvassing.findMany({
    limit,
    offset,
    orderBy: [desc(canvassing.createdAt)],
    with: {
      canvasPurchase: true,
      purchasing: true,
      priorityLevel: true,
      creator: {
        with: {
          division: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
    where,
  });

  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: canvassingData,
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

export const getDescriptions = cache(async (categoryId: number | undefined) => {
  if (!categoryId) return [];
  const descriptions = await db.query.serviceDescription.findMany({
    where: (description, { eq, and }) =>
      and(
        eq(description.status, 1),
        eq(description.serviceCategoryId, categoryId),
      ),
    columns: {
      id: true,
      description: true,
    },
  });
  return descriptions;
});

export const getPreferredWorkers = cache(async () => {
  const preferredWorkers = await db.query.manpower.findMany({
    where: (manpower, { eq }) => eq(manpower.status, 1),
    columns: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      agency: true,
    },
  });
  return preferredWorkers.map((man) => ({
    id: man.id,
    name: `${man.firstName} ${man.middleName ?? ""} ${man.lastName}`,
    agency: man.agency,
  }));
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

export async function getReasons() {
  const reasons = await db.query.reasonForRejection.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return reasons;
}

export type Reasons = Awaited<ReturnType<typeof getReasons>>;

export async function getCanvasRequestDetails(referenceNo: string) {
  const data = await db.query.canvasPurchase.findMany({
    where: (fields, { eq, and, isNull }) =>
      and(eq(fields.canvasRequestNo, referenceNo), isNull(fields.reasonId)),
    with: {
      canvassing: {
        with: {
          priorityLevel: true,
          nextActionUser: true,
        },
      },
      attachments: true,
      itemDescription: {
        with: {
          itemCategory: true,
        },
      },
      methodOfDelivery: true,
      paymentMode: true,
      paymentOption: true,
      reasonForRejection: true,
      supplier: true,
    },
    orderBy: (table, { asc, desc }) => [
      asc(table.itemDescriptionId),
      desc(table.createdAt),
    ],
  });
  return data;
}

export type CanvasRequestDetails = Awaited<
  ReturnType<typeof getCanvasRequestDetails>
>;

export async function getRequisitionDetails(referenceNo: string) {
  const data = await db.query.serviceRequisition.findMany({
    where: (service, { eq }) => eq(service.requisitionNo, referenceNo),
    with: {
      attachments: true,
      location: {
        columns: {
          code: true,
        },
      },
      preferredWorker: {
        columns: {
          agency: true,
        },
      },
      purpose: {
        columns: {
          name: true,
        },
      },
      serviceCategory: {
        columns: {
          name: true,
        },
        with: {
          budgetSource: {
            columns: {
              name: true,
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
      serviceDescription: {
        columns: {
          description: true,
        },
      },
      requisition: {
        with: {
          priorityLevel: true,
        },
      },
    },
  });
  return data;
}

export type RequisitionDetails = NonNullable<
  Awaited<ReturnType<typeof getRequisitionDetails>>
>;

export type PreferredWorkers = Awaited<ReturnType<typeof getPreferredWorkers>>;
