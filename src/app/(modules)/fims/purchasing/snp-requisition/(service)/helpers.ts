import { db } from "@/db";
import { requisition } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import type { serviceRequisitionSearchParams } from "@/validations/searchParams";
import { and, desc, eq, or } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";

const isServiceRequisition = eq(requisition.requisitionTypeId, 1);

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof serviceRequisitionSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);

  const user = await getUser();
  const userId = Number(user.id);

  const where = and(
    isServiceRequisition,
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

  const serviceRequisitionData = await db.query.requisition.findMany({
    limit,
    offset,
    orderBy: [desc(requisition.createdAt)],
    with: {
      purchasing: true,
      priorityLevel: true,
      creator: {
        columns: {
          name: true,
        },
      },
    },
    where,
  });
  const next = pages > page ? page + 1 : 1;
  const previous = page > 1 ? page - 1 : 1;
  return {
    data: serviceRequisitionData,
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
    where: (category, { eq, and }) =>
      and(eq(category.status, 1), eq(category.isRecurring, false)),
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
      price: true,
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
              id: true,
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
          nextActionUser: true,
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
