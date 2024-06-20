"use server";

import { db } from "@/db";
import { order, purchasing, request } from "@/db/schema/fims";
import {
  generateCodeFromDate,
  getNextActionUser,
  getReviewersAndApprovers,
} from "@/lib/helpers";
import { decode } from "decode-formdata";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const path = "/fims/purchasing/snp-request/purchase";

export async function review(
  referenceNo: string,
  _: State,
  formData: FormData,
): Promise<State> {
  try {
    const newStatus = "Reviewed";

    revalidatePath(path, "layout");
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
  total: z.coerce.number(),
});

export async function approveOrDecline(
  referenceNo: string,
  _: State,
  formData: FormData,
): Promise<State> {
  try {
    const decodedFormData = decode(formData, {
      numbers: ["total"],
    });
    const parse = approveOrDeclineSchmea.safeParse(decodedFormData);
    if (!parse.success)
      return {
        message: parse.error.errors[0].message,
        success: false,
      };
    const { reasonId: reasonForRejectionId, total } = parse.data;
    const requestFinalStatus = reasonForRejectionId ? 2 : 1;
    const approverStatus = requestFinalStatus === 2 ? "Declined" : "Approved";

    console.log("Starting transaction...");
    await db.transaction(async (tx) => {
      const c = await tx.query.request.findFirst({
        where: (table, { eq, and }) => and(eq(table.requestNo, referenceNo)),
      });

      if (!c) throw new Error("Request not found!");

      const setValues = {
        approver1Status: c.approver1Id ? requestFinalStatus : c.approver1Status,
        approver2Status:
          (c.approver2Status === 0 && c.approver1Status === 1) ||
          (c.approver1Status === 0 && c.approver2Id === null)
            ? requestFinalStatus
            : c.approver2Status,
        approver3Status:
          (c.approver3Status === 0 &&
            c.approver2Status === 1 &&
            c.approver1Status === 1) ||
          (c.approver2Status === 0 && c.approver3Id === null)
            ? requestFinalStatus
            : c.approver3Status,
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

      const approvers = [c.approver1Id, c.approver2Id, c.approver3Id];

      const isDeclined = finalStatus === 2;
      const nextActionUserId = await getNextActionUser(approvers, isDeclined);
      console.log({ nextActionUserId, isDeclined, finalStatus });

      await tx
        .update(request)
        .set({
          ...setValues,
          nextActionUserId,
          finalStatus,
          nextAction: finalStatus === 1 ? 4 : finalStatus === 2 ? 2 : 1,
        })
        .where(and(eq(request.requestNo, referenceNo)));

      if (finalStatus) {
        console.log("Updating purchasing...");
        await tx
          .update(purchasing)
          .set({ requestFinalStatus: finalStatus })
          .where(eq(purchasing.id, c.purchasingId));
        if (finalStatus === 1) {
          console.log("Inserting order...");
          const requestData = await tx.query.request.findFirst({
            where: (table, { eq }) => eq(table.requestNo, referenceNo),
          });
          if (!requestData) throw new Error("Request not found!");
          const { requestNo, ...rest } = requestData;
          const orderNo = await generateCodeFromDate({ prefix: "FLS-JO" });
          const reviewersAndApprovers = await getReviewersAndApprovers(
            total,
            4,
          );
          await tx.insert(order).values({
            ...rest,
            orderNo,
            finalStatus: 0,
            nextAction: 1,
            nextActionUserId: Object.values(reviewersAndApprovers).find(
              (approver) => approver !== undefined,
            ),
            ...reviewersAndApprovers,
          });
        }
      }
    });
    revalidatePath(path, "layout");

    return {
      message: `Successfully changed status to ${approverStatus}.`,
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
