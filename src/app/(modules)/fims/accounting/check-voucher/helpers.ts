import { db } from "@/db";
import { checkVoucher } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import { getRole1 } from "@/lib/helpers";
import type { checkVoucherSearchParams } from "@/validations/searchParams";
import { and, eq, or } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { z } from "zod";

export async function getTableData({
  searchParams,
}: {
  searchParams: z.infer<typeof checkVoucherSearchParams>;
}) {
  const { checkNumber, rfpReferenceNo, dateRelease } = searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = limit * (page - 1);

  const user = await getUser();
  const userId = Number(user.id);
  const { role } = await getRole1({
    id: user.id,
    subModuleId: 6,
  });

  const where = and(
    rfpReferenceNo ? eq(checkVoucher.rfpNo, rfpReferenceNo) : undefined,
    dateRelease ? eq(checkVoucher.createdAt, dateRelease) : undefined,
    checkNumber ? eq(checkVoucher.checkNumber, checkNumber) : undefined,
    or(
      role !== "requester"
        ? eq(checkVoucher.nextActionUserId, userId)
        : undefined,
      eq(checkVoucher.createdBy, userId),
    ),
    role === "approver" ? eq(checkVoucher.isDraft, false) : undefined,
  );

  const all = await db.query.rfp.findMany({
    where,
  });

  const pages = Math.ceil(all.length / limit);

  const data = await db.query.checkVoucher.findMany({
    limit,
    offset,
    orderBy: (table, { desc }) => [desc(table.createdAt)],
    where,
    with: {
      rfp: {
        with: {
          payee: true,
          subPayee: true,
        },
      },
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

export async function getCVData(rfpReferenceNo: string) {
  const data = await db.query.checkVoucher.findFirst({
    where: (table, { eq }) => eq(table.rfpNo, rfpReferenceNo),
    with: {
      nextActionUser: true,
      firstReviewer: true,
      firstApprover: true,
      orSiNumber: true,
      rfp: {
        with: {
          payee: true,
          subPayee: true,
          priorityLevel: true,
          budgetSource: true,
          chartOfAccounts: true,
          subAccounts: true,
          opexCategory: true,
          attachments: true,
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
      },
    },
  });
  if (!data) notFound();
  return data;
}

export const cacheGetReasons = cache(async () => {
  const reasons = await db.query.reasonForRejection.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return reasons;
});
