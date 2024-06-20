"use server";

import { db } from "@/db";
import {
  checkVoucher,
  checkVoucherOrSiNumber,
  purchasing,
} from "@/db/schema/fims";
import { getNextActionUser } from "@/lib/helpers";
import { decode } from "decode-formdata";
import { and, eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { z } from "zod";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const searchSchema = z.object({
  checkNumber: z.string().optional(),
  rfpReferenceNo: z.string().optional(),
  dateRelease: z.string().optional(),
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
      console.log(key, value);
      if (value) {
        searchParams.append(key, value.toString());
      }
    }
    console.log(searchParams.toString());
    redirect(`/fims/accounting/check-voucher?${searchParams.toString()}`);
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

const createSchema = z.object({
  rfpReferenceNo: z.string(),
  cvNo: z.string(),
  checkNumber: z.string(),
  releaseDate: z.coerce
    .date()
    .refine(
      (v) => v.getFullYear() >= 2023,
      "Release date must be 2023 or later",
    ),
  orNumber: z.string().min(3).array(),
});

export async function create(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData, {
      arrays: ["orNumber"],
      dates: ["releaseDate"],
    });
    const parsed = createSchema.safeParse(formValues);
    if (!parsed.success) {
      console.error(JSON.stringify(parsed.error));
      throw new Error(parsed.error.issues[0].message);
    }
    await db.transaction(async (tx) => {
      const {
        cvNo,
        checkNumber,
        releaseDate,
        rfpReferenceNo,
        orNumber: orNumbers,
      } = parsed.data;
      await tx
        .update(checkVoucher)
        .set({ checkNumber, releaseDate, isDraft: false })
        .where(eq(checkVoucher.rfpNo, rfpReferenceNo));
      const cvData = await tx.query.checkVoucher.findFirst({
        where: (table, { eq }) => eq(table.rfpNo, rfpReferenceNo),
      });
      await tx.insert(checkVoucherOrSiNumber).values(
        orNumbers.map((orNumber) => ({
          cvNo,
          orNumber,
        })),
      );
    });
    return {
      success: true,
      message: "Successfully registered Check Voucher!",
    };
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

async function updateCV({
  cvNo,
  rejectionId,
}: { cvNo: string; rejectionId: number | null }) {
  const approverStatus = rejectionId != null ? 2 : 1;
  await db.transaction(async (tx) => {
    const cv = await tx.query.checkVoucher.findFirst({
      where: (table, { eq, and }) => and(eq(table.cvNo, cvNo)),
    });

    if (!cv) throw new Error("CV not found!");

    const setValues = {
      approver1Status: cv.approver1Id ? approverStatus : cv.approver1Status,
      approver2Status:
        (cv.approver2Status === 0 && cv.approver1Status === 1) ||
        (cv.approver1Status === 0 && cv.approver2Id === null)
          ? approverStatus
          : cv.approver2Status,
      approver3Status:
        (cv.approver3Status === 0 &&
          cv.approver2Status === 1 &&
          cv.approver1Status === 1) ||
        (cv.approver2Status === 0 && cv.approver3Id === null)
          ? approverStatus
          : cv.approver3Status,
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

    const approvers = [cv.approver1Id, cv.approver2Id, cv.approver3Id];

    const isDeclined = finalStatus === 2;
    const nextActionUserId = await getNextActionUser(approvers, isDeclined);
    console.log({ nextActionUserId, isDeclined, finalStatus });

    await tx
      .update(checkVoucher)
      .set({
        ...setValues,
        nextActionUserId,
        status: finalStatus,
        reasonForRejectionId: rejectionId,
        nextAction: finalStatus === 1 ? 4 : finalStatus === 2 ? 2 : 1,
      })
      .where(eq(checkVoucher.cvNo, cvNo));

    if (finalStatus) {
      await tx
        .update(purchasing)
        .set({ checkVoucherFinalStatus: finalStatus })
        .where(eq(purchasing.id, cv.purchasingId));
    }
  });

  const statusInWord = approverStatus === 2 ? "Declined" : "Approved";

  return { message: `Successfully changed status to ${statusInWord}` };
}

const approveSchema = z.object({
  rfpNo: z.string(),
  cvNo: z.string(),
});

export async function approve(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData);
    const parsed = approveSchema.safeParse(formValues);
    if (!parsed.success) {
      console.error(JSON.stringify(parsed.error));
      throw new Error(parsed.error.issues[0].message);
    }
    const { rfpNo, cvNo } = parsed.data;
    const { message } = await updateCV({ cvNo, rejectionId: null });
    return {
      success: true,
      message,
    };
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

const declineSchema = z.object({
  cvNo: z.string(),
  rfpNo: z.string(),
  reasonId: z.coerce.number(),
});

export async function decline(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData, {
      numbers: ["reasonId"],
    });

    const parsed = declineSchema.safeParse(formValues);
    if (!parsed.success) {
      console.error(JSON.stringify(parsed.error));
      throw new Error(parsed.error.issues[0].message);
    }
    const { cvNo, reasonId } = parsed.data;
    const { message } = await updateCV({ cvNo, rejectionId: reasonId });
    return {
      success: true,
      message,
    };
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

const reviewSchema = z.object({
  cvNo: z.string(),
  rfpNo: z.string(),
});

export async function review(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData);
    const parsed = reviewSchema.safeParse(formValues);
    if (!parsed.success) {
      console.error(JSON.stringify(parsed.error));
      throw new Error(parsed.error.issues[0].message);
    }
    const { cvNo, rfpNo } = parsed.data;

    const reviewerStatus = 1;

    console.log("Starting transaction...");
    await db.transaction(async (tx) => {
      const c = await tx.query.checkVoucher.findFirst({
        where: (table, { eq, and }) =>
          and(eq(table.cvNo, cvNo), eq(table.finalStatus, 0)),
      });

      if (!c) throw new Error("Check Voucher not found!");

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

      console.log("Updating check voucher...");
      await tx
        .update(checkVoucher)
        .set({
          ...setValues,
          nextActionUserId,
          finalStatus,
          nextAction: finalStatus === 3 ? 1 : finalStatus === 2 ? 2 : 3,
        })
        .where(
          and(eq(checkVoucher.cvNo, cvNo), eq(checkVoucher.finalStatus, 0)),
        );

      console.log("Updating purchasing...");
      if (finalStatus) {
        await tx
          .update(purchasing)
          .set({
            checkVoucherFinalStatus: finalStatus,
          })
          .where(eq(purchasing.id, c.purchasingId));
      }
    });
    return {
      success: true,
      message: "Successfully reviewed check voucher!",
    };
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
