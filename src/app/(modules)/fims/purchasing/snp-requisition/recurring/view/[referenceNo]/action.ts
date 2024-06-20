"use server";

import { db } from "@/db";
import {
  airline,
  purchasing,
  rentals,
  requisition,
  subscriptionDetail,
  utility,
} from "@/db/schema/fims";
import { getNextActionUser } from "@/lib/helpers";
import type { RecurringCategory } from "@/types";
import { decode } from "decode-formdata";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const path = "/fims/purchasing/snp-requisition/recurring";

type BindedData = {
  referenceNo: string;
  category: RecurringCategory;
};

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const tableOfCategory = {
  airline: airline,
  subscription: subscriptionDetail,
  utility: utility,
  rental: rentals,
} as const;

const reviewSchema = z.object({
  total: z.number(),
  details: z.array(
    z.object({
      id: z.coerce.number(),
      reasonId: z.coerce
        .number()
        .nullish()
        .transform((value) => (value === 0 ? null : value)),
    }),
  ),
});

export async function review(
  bindedData: BindedData,
  _: State,
  formData: FormData,
): Promise<State> {
  console.log(bindedData);
  const { category, referenceNo } = bindedData;
  try {
    const decodedFormData = decode(formData, {
      arrays: ["details"],
      numbers: ["details.$.id", "total"],
    });
    const parse = reviewSchema.safeParse(decodedFormData);
    if (!parse.success)
      return {
        message: parse.error.errors[0].message,
        success: false,
      };
    const { details, total } = parse.data;

    // When the grand total is greater than 0, set to reviewed. Otherwise, decline
    const reviewerStatus = total > 0 ? 1 : 2;

    console.log("Starting transaction...");
    await db.transaction(async (tx) => {
      const requisitionData = await tx.query.requisition.findFirst({
        where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
      });

      if (!requisitionData) throw new Error("Cannot find Reference Number!");

      const setValues = {
        reviewer1Status:
          requisitionData.reviewer1Status === 0
            ? reviewerStatus
            : requisitionData.reviewer1Status,
        reviewer2Status:
          // either when reviewer2Status is pending and reviewer1Status is approved
          // or when reviewer1Status is pending and reviewer2Id is null
          (requisitionData.reviewer2Status === 0 &&
            requisitionData.reviewer1Status === 1) ||
          (requisitionData.reviewer1Status === 0 &&
            requisitionData.reviewer2Id === null)
            ? reviewerStatus
            : requisitionData.reviewer2Status,
      };

      const reviewerStatuses = [
        setValues.reviewer1Status,
        setValues.reviewer2Status,
      ];

      const finalStatus = reviewerStatuses.every((status) => status === 1)
        ? 3
        : reviewerStatuses.some((status) => status === 2)
          ? 2
          : undefined;

      const approvers = [
        requisitionData.reviewer1Id,
        requisitionData.reviewer2Id,
        requisitionData.approver1Id,
        requisitionData.approver2Id,
        requisitionData.approver3Id,
      ];

      const isDeclined = finalStatus === 2;
      const nextActionUserId = await getNextActionUser(approvers, isDeclined);
      console.log({ nextActionUserId, isDeclined });

      console.log("Updating requisition...");
      await db
        .update(requisition)
        .set({
          ...setValues,
          nextActionUserId,
          finalStatus,
          nextAction: finalStatus === 3 ? 1 : finalStatus === 2 ? 2 : 3,
        })
        .where(
          and(
            eq(requisition.requisitionNo, referenceNo),
            eq(requisition.finalStatus, 0),
          ),
        );

      console.log("Updating purchasing...");
      if (finalStatus) {
        await tx
          .update(purchasing)
          .set({
            requisitionFinalStatus: finalStatus,
          })
          .where(eq(purchasing.id, requisitionData.purchasingId));
      }
      const table = tableOfCategory[category];
      // loop over details, set rejectionId to null when reasonId is null
      for (const { reasonId, id } of details) {
        await tx
          .update(table)
          .set({ rejectionId: reasonId ?? null })
          .where(and(eq(table.id, id)));
      }
    });
    const newStatus = reviewerStatus === 1 ? "Reviewed" : "Declined";
    revalidatePath(path);
    return {
      message: `Successfully changed status to ${newStatus}`,
      success: true,
    };
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

const approveOrDeclineSchmea = z.object({
  reasonId: z.coerce
    .number()
    .nullish()
    .transform((value) => (value === 0 ? null : value)),
});

export async function approveOrDecline(
  { category, referenceNo }: BindedData,
  _: State,
  formData: FormData,
): Promise<State> {
  try {
    const decodedFormData = decode(formData);
    const parse = approveOrDeclineSchmea.safeParse(decodedFormData);
    if (!parse.success)
      return {
        message: parse.error.errors[0].message,
        success: false,
      };
    const { reasonId } = parse.data;
    const approverStatus = reasonId ? 2 : 1;

    console.log("Starting approve or decline transaction...");
    await db.transaction(async (tx) => {
      const requisitionData = await tx.query.requisition.findFirst({
        where: (table, { eq, and }) =>
          and(eq(table.requisitionNo, referenceNo), eq(table.finalStatus, 3)),
      });

      if (!requisitionData) throw new Error("Requisition not found!");
      const setValues = {
        approver1Status: requisitionData.approver1Id
          ? approverStatus
          : requisitionData.approver1Status,
        approver2Status:
          (requisitionData.approver2Status === 0 &&
            requisitionData.approver1Status === 1) ||
          (requisitionData.approver1Status === 0 &&
            requisitionData.approver2Id === null)
            ? approverStatus
            : requisitionData.approver2Status,
        approver3Status:
          (requisitionData.approver3Status === 0 &&
            requisitionData.approver2Status === 1 &&
            requisitionData.approver1Status === 1) ||
          (requisitionData.approver2Status === 0 &&
            requisitionData.approver3Id === null)
            ? approverStatus
            : requisitionData.approver3Status,
      };

      const approverStatuses = [
        setValues.approver1Status,
        setValues.approver2Status,
        setValues.approver3Status,
      ];

      const finalStatus = approverStatuses.every((status) => status === 1)
        ? 1
        : approverStatuses.some((status) => status === 2)
          ? 2
          : undefined;

      const approvers = [
        requisitionData.approver1Id,
        requisitionData.approver2Id,
        requisitionData.approver3Id,
      ];

      const isDeclined = finalStatus === 2;
      const nextActionUserId = await getNextActionUser(approvers, isDeclined);
      console.log({ nextActionUserId, isDeclined, finalStatus });

      await tx
        .update(requisition)
        .set({
          ...setValues,
          nextActionUserId,
          finalStatus,
          nextAction: finalStatus === 1 ? 4 : finalStatus === 2 ? 2 : 1,
        })
        .where(and(eq(requisition.requisitionNo, referenceNo)));

      if (finalStatus) {
        await tx
          .update(purchasing)
          .set({ requisitionFinalStatus: finalStatus })
          .where(eq(purchasing.id, requisitionData.purchasingId));
      }
      const table = tableOfCategory[category];
      await tx
        .update(table)
        .set({ rejectionId: reasonId ?? null })
        .where(eq(table.referenceNo, referenceNo));
    });

    const newStatus = approverStatus === 2 ? "Declined" : "Approved";

    revalidatePath(path);
    return {
      message: `Successfully changed status to ${newStatus}.`,
      success: true,
    };
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}