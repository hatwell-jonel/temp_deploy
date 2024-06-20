"use server";

import { db } from "@/db";
import {
  checkVoucher,
  purchasing,
  rfp,
  rfpAttachments,
} from "@/db/schema/fims";
import {
  generateCodeFromDate,
  getNextActionUser,
  getReviewersAndApprovers,
} from "@/lib/helpers";
import { utapi } from "@/lib/uploadthing";
import { decode } from "decode-formdata";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { z } from "zod";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const path = "/fims/accounting/rfp";

const createSchema = z.object({
  vatable: z.enum(["vat", "non-vat"]),
  ewt: z.coerce.number({ required_error: "EWT is required." }).min(0.01),
  remarks: z.string().optional(),
  file: z.array(z.instanceof(File).optional()),
});

export async function create(
  referenceNo: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData, {
      arrays: ["file"],
      files: ["file"],
      numbers: ["ewt"],
    });
    const safeParse = createSchema.safeParse(formValues);
    if (!safeParse.success) {
      console.log(safeParse.error);
      return {
        message: safeParse.error.errors[0].message,
        success: false,
      };
    }
    const parsed = safeParse.data;
    await db
      .update(rfp)
      .set({
        vatable: parsed.vatable === "vat",
        ewtPercentage: parsed.ewt,
        remarks: parsed.remarks,
        isDraft: false,
      })
      .where(eq(rfp.rfpNo, referenceNo));

    const uploadedFileResponse = await utapi.uploadFiles(parsed.file);
    const toInsert: Array<typeof rfpAttachments.$inferInsert> = [];
    await db.transaction(async (tx) => {
      for (const { data: uploaded } of uploadedFileResponse) {
        if (uploaded) {
          toInsert.push({
            rfpNo: referenceNo,
            ...uploaded,
          });
        }
      }
      if (toInsert.length > 0) {
        await tx.insert(rfpAttachments).values(toInsert);
      }
    });
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully registered RFP!",
    };
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

async function updateRFPAndInsertCheckVoucher({
  rfpNo,
  amount,
  rejectionId,
}: { rfpNo: string; amount: number; rejectionId: number | null }) {
  const approverStatus = rejectionId != null ? 2 : amount > 0 ? 1 : 2;
  await db.transaction(async (tx) => {
    const c = await tx.query.rfp.findFirst({
      where: (table, { eq, and }) => and(eq(table.rfpNo, rfpNo)),
    });

    if (!c) throw new Error("RFP not found!");

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
      .update(rfp)
      .set({
        ...setValues,
        nextActionUserId,
        status: finalStatus,
        reasonForRejectionId: rejectionId,
        nextAction: finalStatus === 1 ? 4 : finalStatus === 2 ? 2 : 1,
      })
      .where(and(eq(rfp.rfpNo, rfpNo)));

    if (finalStatus) {
      await tx
        .update(purchasing)
        .set({ rfpFinalStatus: finalStatus })
        .where(eq(purchasing.id, c.purchasingId));
      if (finalStatus === 1) {
        console.log("Inserting check voucher");
        const rfpData = await tx.query.rfp.findFirst({
          where: (table, { eq }) => eq(table.rfpNo, rfpNo),
        });

        if (!rfpData) throw new Error("Cannot find Reference Number in RFP.");

        const reviewersAndApprovers = await getReviewersAndApprovers(amount, 6);

        const cvNo = await generateCodeFromDate({ prefix: "FLS-CV" });

        await tx.insert(checkVoucher).values({
          cvNo,
          purchasingId: rfpData.purchasingId,
          rfpNo: rfpData.rfpNo,
          status: 0,
          ...reviewersAndApprovers,
          nextActionUserId: Object.values(reviewersAndApprovers).find(
            (approver) => approver !== undefined,
          ),
          nextAction: 3,
          createdBy: rfpData.requestedBy,
        });
      }
    }
  });

  const statusInWord = approverStatus === 2 ? "Declined" : "Approved";

  return { message: `Successfully changed status to ${statusInWord}` };
}

const approveOrDeclineSchema = z.object({
  amount: z.coerce.number(),
  rejectionId: z.coerce.number().nullish().optional(),
});

export async function approveOrDecline(
  referenceNo: string,
  _: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData, {
      numbers: ["amount", "order"],
    });
    const parsed = approveOrDeclineSchema.safeParse(formValues);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);
    const { amount, rejectionId } = parsed.data;

    const { message } = await updateRFPAndInsertCheckVoucher({
      rfpNo: referenceNo,
      amount,
      rejectionId: rejectionId ?? null,
    });

    revalidatePath(path);
    return {
      success: true,
      message,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

const searchSchema = z.object({
  payeeId: z.string().optional(),
  subPayeeId: z.string().optional(),
  dateRequestedFrom: z.string().optional(),
  dateRequestedTo: z.string().optional(),
  dateNeededFrom: z.string().optional(),
  dateNeededTo: z.string().optional(),
});

export async function search(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData);
    const parsed = searchSchema.safeParse(formValues);
    if (!parsed.success) {
      console.error(JSON.stringify(parsed.error));
      throw new Error(parsed.error.issues[0].message);
    }
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value) {
        searchParams.append(key, value);
      }
    }
    redirect(`/fims/accounting/rfp?${searchParams.toString()}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
