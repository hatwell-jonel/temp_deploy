import { db } from "@/db";
import { rfp } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import type { rfpSearchParams } from "@/validations/searchParams";
import { and, eq, gte, lte, or } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";

export const getTableData = async ({
  searchParams,
  role = "requester",
}: {
  searchParams: z.output<typeof rfpSearchParams>;
  role?: "requester" | "reviewer" | "approver";
}) => {
  const {
    dateRequestedFrom,
    dateRequestedTo,
    dateNeededFrom,
    dateNeededTo,
    payeeId,
    subPayeeId,
  } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);

  const user = await getUser();
  const userId = Number(user.id);

  const where = and(
    or(
      and(
        eq(rfp.nextActionUserId, userId),
        eq(rfp.isDraft, role !== "requester" ? false : true),
      ),
      eq(rfp.createdBy, userId),
    ),
    eq(rfp.status, 0),
    dateRequestedFrom ? gte(rfp.dateRequested, dateRequestedFrom) : undefined,
    dateRequestedTo ? lte(rfp.dateRequested, dateRequestedTo) : undefined,
    dateNeededFrom ? gte(rfp.dateNeeded, dateNeededFrom) : undefined,
    dateNeededTo ? lte(rfp.dateNeeded, dateNeededTo) : undefined,
    payeeId ? eq(rfp.payeeId, payeeId) : undefined,
    subPayeeId ? eq(rfp.subPayee, subPayeeId) : undefined,
  );

  const all = await db.query.rfp.findMany({
    where,
  });

  const pages = Math.ceil(all.length / limit);

  const data = await db.query.rfp.findMany({
    limit,
    offset,
    orderBy: (table, { desc }) => [desc(table.dateRequested)],
    with: {
      requestor: {
        with: {
          details: true,
        },
      },
      payee: true,
      subPayee: true,
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
};

export const getRFPData = cache(
  async ({ referenceNo }: { referenceNo: string }) => {
    const rfpData = await db.query.rfp.findFirst({
      where: (table, { eq }) => eq(table.rfpNo, referenceNo),
      with: {
        nextActionUser: true,
        particulars: true,
        payee: true,
        subPayee: true,
        priorityLevel: true,
        budgetSource: true,
        chartOfAccounts: true,
        subAccounts: true,
        opexCategory: true,
        attachments: true,
        firstApprover: true,
        secondApprover: true,
        thirdApprover: true,
        requestor: {
          with: {
            division: true,
            details: {
              with: {
                branch: true,
              },
            },
          },
        },
      },
    });

    const total = rfpData?.particulars.reduce(
      (prev, curr) => prev + curr.amount * curr.quantity,
      0,
    );

    return {
      data: rfpData,
      total: total || 0,
    };
  },
);

export const ewtValues = [
  {
    value: 0.01,
    percentage: "1%",
  },
  {
    value: 0.02,
    percentage: "2%",
  },
  { value: 0.05, percentage: "5%" },
  {
    value: 0.1,
    percentage: "10%",
  },
  {
    value: 0.15,
    percentage: "15%",
  },
];
