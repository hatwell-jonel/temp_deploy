import { db } from "@/db";
import { request, requisition } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import type { canvasRequestSearchParams } from "@/validations/searchParams";
import { and, desc, eq, ne, or } from "drizzle-orm";
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
    eq(request.type, 2),
    ne(request.finalStatus, 1),
    name ? eq(request.requestNo, name) : undefined,
    or(eq(request.nextActionUserId, userId), eq(request.createdBy, userId)),
  );

  const all = await db.query.request.findMany({
    where,
  });

  const pages = Math.ceil(all.length / limit);

  const data = await db.query.request.findMany({
    limit,
    offset,
    orderBy: [desc(requisition.createdAt)],
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

export async function getRequisitionDetails(referenceNo: string) {
  const requestData = await db.query.request.findFirst({
    where: (table, { eq }) => eq(table.requestNo, referenceNo),
    with: {
      priorityLevel: true,
      nextActionUser: true,
    },
  });
  if (!requestData) return null;
  const { purchasingId } = requestData;
  const data = await db.query.canvassing.findFirst({
    where: (table, { eq }) => eq(table.purchasingId, purchasingId),
    with: {
      canvasPurchase: {
        with: {
          attachments: true,
          methodOfDelivery: true,
          paymentMode: true,
          paymentOption: true,
          supplier: true,
          itemDescription: {
            with: {
              itemCategory: true,
            },
          },
        },
      },
    },
  });

  if (!data) return null;
  const { canvasPurchase } = data;

  return {
    ...requestData,
    canvasPurchase,
  };
}

export type RequisitionDetails = NonNullable<
  Awaited<ReturnType<typeof getRequisitionDetails>>
>;
