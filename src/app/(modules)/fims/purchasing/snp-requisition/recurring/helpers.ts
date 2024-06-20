import { db } from "@/db";
import { requisition } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import type { purchaseRequisitionSearchParams } from "@/validations/searchParams";
import { and, desc, eq, or } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";

const isRecurringRequisition = eq(requisition.requisitionTypeId, 5);

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
    isRecurringRequisition,
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
      purchasing: true,
      priorityLevel: true,
      requisitionType: true,
      creator: true,
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
    where: (category, { eq }) => eq(category.status, 1),
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

export const getServiceCategories = async () => {
  const categories = await db.query.serviceCategory.findMany({
    where: (table, { eq }) => eq(table.isRecurring, true),
  });
  return categories;
};

export async function getReasons() {
  const reasons = await db.query.reasonForRejection.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return reasons;
}

export async function getTransportModes() {
  const data = await db.query.transportMode.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return data;
}

export async function getCarriers() {
  const data = await db.query.carrier.findMany({
    columns: {
      id: true,
      transportModeId: true,
      name: true,
    },
  });
  return data;
}

export async function getUtilityTypes() {
  const data = await db.query.utilityType.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return data;
}

export async function getServiceProviders() {
  const data = await db.query.serviceProvider.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return data;
}

export async function getHubs() {
  const data = await db.query.hub.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return data;
}

export async function getLeasors() {
  const data = await db.query.leasor.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return data;
}

export async function getSubscriptions() {
  const data = await db.query.subscription.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return data;
}

export async function getProviders() {
  const data = await db.query.provider.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return data;
}

export async function getRequisitionDetails(referenceNo: string) {
  const data = await db.query.recurring.findMany({
    where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
    with: {
      category: true,
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

export async function getAirlineDetails(referenceNo: string) {
  const data = await db.query.recurring.findFirst({
    where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
    with: {
      airline: {
        with: {
          carrier: true,
          transportMode: true,
          attachments: true,
        },
      },
      category: {
        with: {
          budgetSource: true,
          chartOfAccounts: true,
          opexCategory: true,
          subAccounts: true,
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
  if (!data) throw new Error("Recurring details doesn't exist!");
  return data;
}

export async function getUtilityDetails(referenceNo: string) {
  const data = await db.query.recurring.findFirst({
    where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
    with: {
      utility: {
        with: {
          utilityType: true,
          serviceProvider: true,
          attachments: true,
        },
      },
      category: {
        with: {
          budgetSource: true,
          chartOfAccounts: true,
          opexCategory: true,
          subAccounts: true,
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
  if (!data) throw new Error("Recurring details doesn't exist!");
  return data;
}

export async function getRentalDetails(referenceNo: string) {
  const data = await db.query.recurring.findFirst({
    where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
    with: {
      rental: {
        with: {
          hub: true,
          leasor: true,
          attachments: true,
        },
      },
      category: {
        with: {
          budgetSource: true,
          chartOfAccounts: true,
          opexCategory: true,
          subAccounts: true,
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
  if (!data) throw new Error("Recurring details doesn't exist!");
  return data;
}

export async function getSubscriptionDetails(referenceNo: string) {
  const data = await db.query.recurring.findFirst({
    where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
    with: {
      subscription: {
        with: {
          subscription: true,
          provider: true,
          attachments: true,
        },
      },
      category: {
        with: {
          budgetSource: true,
          chartOfAccounts: true,
          opexCategory: true,
          subAccounts: true,
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
  if (!data) throw new Error("Recurring details doesn't exist!");
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
export type TransportModes = GetType<typeof getTransportModes>;
export type Carriers = GetType<typeof getCarriers>;
export type ServiceProviders = GetType<typeof getServiceProviders>;
export type UtilityTypes = GetType<typeof getUtilityTypes>;
export type Leasors = GetType<typeof getLeasors>;
export type Hubs = GetType<typeof getHubs>;
export type Providers = GetType<typeof getProviders>;
export type Subscriptions = GetType<typeof getSubscriptions>;
export type AirlineDetails = GetType<typeof getAirlineDetails>;
export type UtilityDetails = GetType<typeof getUtilityDetails>;
export type RentalDetails = GetType<typeof getRentalDetails>;
export type SubscriptionDetails = GetType<typeof getSubscriptionDetails>;
export type RequisitionDetails = NonNullable<
  GetType<typeof getRequisitionDetails>
>;
