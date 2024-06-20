"use server";

import { db } from "@/db";
import {
  availment,
  canvasService,
  canvassing,
  purchasing,
  request,
} from "@/db/schema/fims";
import {
  generateCodeFromDate,
  getNextActionUser,
  getReviewersAndApprovers,
} from "@/lib/helpers";
import { convertMonthToShort } from "@/lib/utils";
import { decode } from "decode-formdata";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const path = "/fims/purchasing/canvas-request/approval";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const declineSchema = z.object({
  reasonId: z.coerce.number(),
});

export async function decline(
  referenceNo: string,
  _: State,
  formData: FormData,
): Promise<State> {
  try {
    const decodedFormData = decode(formData, {
      numbers: ["reasonId"],
    });
    const parse = declineSchema.safeParse(decodedFormData);
    if (!parse.success)
      return {
        message: parse.error.errors[0].message,
        success: false,
      };
    const { reasonId } = parse.data;
    const approverStatus = 2;

    console.log("Starting transaction...");
    await db.transaction(async (tx) => {
      const c = await tx.query.canvassing.findFirst({
        where: (table, { eq, and }) =>
          and(eq(table.canvasRequestNo, referenceNo), eq(table.finalStatus, 3)),
      });

      if (!c) throw new Error("Canvassing not found!");

      const setValues = {
        approver1Status: c.approver1Id ? approverStatus : c.approver1Status,
        approver2Status:
          (c.approver2Status === 0 && c.approver1Status === 1) ||
          (c.approver1Status === 0 && c.approver2Id === null)
            ? approverStatus
            : c.approver2Status,
        approver3Status:
          (c.approver3Status === 0 &&
            c.approver2Status === 1 &&
            c.approver1Status === 1) ||
          (c.approver2Status === 0 && c.approver3Id === null)
            ? approverStatus
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
        .update(canvassing)
        .set({
          ...setValues,
          nextActionUserId,
          finalStatus,
          nextAction: finalStatus === 1 ? 4 : finalStatus === 2 ? 2 : 1,
        })
        .where(and(eq(canvassing.canvasRequestNo, referenceNo)));

      if (finalStatus) {
        await tx
          .update(purchasing)
          .set({ canvassingFinalStatus: finalStatus })
          .where(eq(purchasing.id, c.purchasingId));
      }

      await tx
        .update(canvasService)
        .set({ reasonId: reasonId ?? null })
        .where(eq(canvasService.canvasRequestNo, referenceNo));
    });

    revalidatePath(path);
    return {
      message: "Successfully changed status to Rejected!",
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

const approveOrDeclineSchema = z.object({
  total: z.number(),
});

export async function approveOrDecline(
  referenceNo: string,
  _: State,
  formData: FormData,
): Promise<State> {
  try {
    const decodedFormData = decode(formData, {
      arrays: ["details"],
      numbers: ["details.$.id", "total"],
      booleans: ["details.$.marked"],
    });
    const parse = approveOrDeclineSchema.safeParse(decodedFormData);
    if (!parse.success)
      return {
        message: parse.error.errors[0].message,
        success: false,
      };
    const { total } = parse.data;

    // When the grand total is greater than 0, set to approved. Otherwise, decline
    const approverStatus = total > 0 ? 1 : 2;
    console.log("Starting transaction...");
    await db.transaction(async (tx) => {
      const c = await tx.query.canvassing.findFirst({
        where: (table, { eq, and }) =>
          and(eq(table.canvasRequestNo, referenceNo), eq(table.finalStatus, 3)),
      });

      if (!c) throw new Error("Canvassing not found!");

      const setValues = {
        approver1Status: c.approver1Id ? approverStatus : c.approver1Status,
        approver2Status:
          (c.approver2Status === 0 && c.approver1Status === 1) ||
          (c.approver1Status === 0 && c.approver2Id === null)
            ? approverStatus
            : c.approver2Status,
        approver3Status:
          (c.approver3Status === 0 &&
            c.approver2Status === 1 &&
            c.approver1Status === 1) ||
          (c.approver2Status === 0 && c.approver3Id === null)
            ? approverStatus
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
        .update(canvassing)
        .set({
          ...setValues,
          nextActionUserId,
          finalStatus,
          nextAction: finalStatus === 1 ? 4 : finalStatus === 2 ? 2 : 1,
        })
        .where(and(eq(canvassing.canvasRequestNo, referenceNo)));

      if (finalStatus) {
        console.log("Updating purchasing...");
        await tx
          .update(purchasing)
          .set({ canvassingFinalStatus: finalStatus })
          .where(eq(purchasing.id, c.purchasingId));
        if (finalStatus === 1) {
          console.log("Inserting request...");
          const canvassingData = await tx.query.canvassing.findFirst({
            where: (table, { eq }) => eq(table.canvasRequestNo, referenceNo),
          });
          if (!canvassingData) throw new Error("Canvassing not found!");
          const { canvasRequestNo, requestedBy, createdBy, ...rest } =
            canvassingData;
          const requestNo = await generateCodeFromDate({ prefix: "FLS-SR" });
          const reviewersAndApprovers = await getReviewersAndApprovers(
            total,
            3,
          );
          await tx.insert(request).values({
            ...rest,
            createdBy: requestedBy,
            requestNo,
            finalStatus: 0,
            nextAction: 1,
            nextActionUserId: Object.values(reviewersAndApprovers).find(
              (approver) => approver !== undefined,
            ),
            ...reviewersAndApprovers,
          });

          console.log("Inserting availment...");
          const canvasService = await tx.query.canvasService.findFirst({
            where: (table, { eq }) => eq(table.canvasRequestNo, referenceNo),
            with: {
              serviceDescription: {
                with: {
                  serviceCategory: true,
                },
              },
            },
          });

          if (canvasService?.serviceDescription?.serviceCategory) {
            const {
              chartOfAccountsId,
              opexCategoryId,
              subAccountsId,
              budgetSourceId,
            } = canvasService.serviceDescription.serviceCategory;
            const date = new Date();
            const values: typeof availment.$inferInsert = {
              requisitionNo: referenceNo,
              budgetSourceId: budgetSourceId,
              coaId: chartOfAccountsId,
              opexId: opexCategoryId,
              subAccountId: subAccountsId,
              amount: total,
              month: convertMonthToShort(date.getMonth()),
              year: date.getFullYear(),
            };
            await tx.insert(availment).values(values).onDuplicateKeyUpdate({
              set: values,
            });
          }
        }
      }
    });
    const newStatus = approverStatus === 2 ? "Declined" : "Approved";
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

const reviewSchmea = z.object({
  total: z.coerce.number(),
  reasonId: z.coerce
    .number()
    .nullish()
    .transform((value) => (value === 0 ? null : value)),
  details: z.array(
    z.object({
      id: z.coerce.number(),
      marked: z.coerce.boolean(),
    }),
  ),
});

export async function review(
  referenceNo: string,
  _: State,
  formData: FormData,
): Promise<State> {
  try {
    const decodedFormData = decode(formData);
    const parse = reviewSchmea.safeParse(decodedFormData);
    if (!parse.success)
      return {
        message: parse.error.errors[0].message,
        success: false,
      };
    const { reasonId, details } = parse.data;
    console.log({ parse });
    const reviewerStatus = reasonId ? 2 : 1;

    console.log("Starting transaction...");
    await db.transaction(async (tx) => {
      const c = await tx.query.canvassing.findFirst({
        where: (table, { eq, and }) =>
          and(eq(table.canvasRequestNo, referenceNo), eq(table.finalStatus, 0)),
      });

      if (!c) throw new Error("Canvassing not found!");

      const setValues = {
        reviewer1Status:
          c.reviewer1Status === 0 ? reviewerStatus : c.reviewer1Status,
        reviewer2Status:
          // either when reviewer2Status is pending and reviewer1Status is approved
          // or when reviewer1Status is pending and reviewer2Id is null
          (c.reviewer2Status === 0 && c.reviewer1Status === 1) ||
          (c.reviewer1Status === 0 && c.reviewer2Id === null)
            ? reviewerStatus
            : c.reviewer2Status,
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
        c.reviewer1Id,
        c.reviewer2Id,
        c.approver1Id,
        c.approver2Id,
        c.approver3Id,
      ];

      const isDeclined = finalStatus === 2;
      const nextActionUserId = await getNextActionUser(approvers, isDeclined);
      console.log({ nextActionUserId, isDeclined });

      console.log("Updating canvassing...");
      await tx
        .update(canvassing)
        .set({
          ...setValues,
          nextActionUserId,
          finalStatus,
          nextAction: finalStatus === 3 ? 1 : finalStatus === 2 ? 2 : 3,
        })
        .where(
          and(
            eq(canvassing.canvasRequestNo, referenceNo),
            eq(canvassing.finalStatus, 0),
          ),
        );

      console.log("Updating purchasing...");
      if (finalStatus) {
        await tx
          .update(purchasing)
          .set({
            canvassingFinalStatus: finalStatus,
          })
          .where(eq(purchasing.id, c.purchasingId));
      }

      await tx
        .update(canvasService)
        .set({ reasonId: reasonId ?? null })
        .where(eq(canvasService.canvasRequestNo, referenceNo));

      const unMarkedIds = details.filter((d) => !d.marked).map((d) => d.id);
      if (unMarkedIds.length > 0) {
        await tx
          .delete(canvasService)
          .where(inArray(canvasService.id, unMarkedIds));
      }
    });

    const newStatus = reviewerStatus === 1 ? "Reviewed" : "Declined";

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
