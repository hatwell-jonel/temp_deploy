import { db } from "@/db";
import { order } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import type { canvasRequestSearchParams } from "@/validations/searchParams";
import { and, eq, ne, or } from "drizzle-orm";
import type { z } from "zod";

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof canvasRequestSearchParams>;
}) {
  const { name, status } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);

  const user = await getUser();
  const userId = Number(user.id);

  const where = and(
    eq(order.type, 2),
    ne(order.finalStatus, 1),
    name ? eq(order.orderNo, name) : undefined,
    or(eq(order.nextActionUserId, userId), eq(order.createdBy, userId)),
  );

  const all = await db.query.order.findMany({
    where,
  });

  const pages = Math.ceil(all.length / limit);

  const data = await db.query.order.findMany({
    limit,
    offset,
    orderBy: (table, { desc }) => [desc(table.createdAt)],
    with: {
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

export async function getDetails(referenceNo: string) {
  const orderData = await db.query.order.findFirst({
    where: (table, { eq }) => eq(table.orderNo, referenceNo),
    with: {
      priorityLevel: true,
      nextActionUser: true,
    },
  });
  if (!orderData) return null;
  const { purchasingId } = orderData;
  const canvassingData = await db.query.canvassing.findFirst({
    where: (table, { eq }) => eq(table.purchasingId, purchasingId),
    with: {
      canvasPurchase: {
        with: {
          attachments: true,
          methodOfDelivery: true,
          paymentMode: true,
          paymentOption: true,
          supplier: {
            with: {
              barangay: true,
              city: true,
              region: true,
            },
          },
          itemDescription: {
            with: {
              itemCategory: true,
            },
          },
        },
      },
    },
  });
  if (!canvassingData) return null;
  const requisitionData = await db.query.requisition.findFirst({
    where: (table, { eq }) => eq(table.purchasingId, purchasingId),
    with: {
      creator: {
        with: {
          details: true,
        },
      },
    },
  });
  if (!requisitionData) return null;
  return {
    canvasPurchase: canvassingData.canvasPurchase,
    requisition: requisitionData,
    ...orderData,
  };
}

export type Details = NonNullable<Awaited<ReturnType<typeof getDetails>>>;
