"use server";

import { db } from "@/db";
import {
  canvasService,
  canvasServiceAttachments,
  canvassing,
  requisition,
} from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import { generateCodeFromDate, getReviewersAndApprovers } from "@/lib/helpers";
import { utapi } from "@/lib/uploadthing";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const path = "/fims/purchasing/canvas-request";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const createCanvasSchema = createInsertSchema(canvasService, {
  extentOfWork: (schema) => schema.extentOfWork.min(3),
  serviceDescriptionId: z.coerce.number(),
  workerId: z.coerce.number(),
}).extend({
  file: z.array(z.instanceof(File).optional()),
});

const createSchema = z.object({
  detail: z.array(createCanvasSchema.omit({ canvasRequestNo: true })),
});

export async function create(
  referenceNo: string,
  _: State,
  formData: FormData,
): Promise<State> {
  try {
    for (const [path, value] of formData.entries()) {
      console.log(path, value);
    }
    const formValues = decode(formData, {
      arrays: ["detail", "detail.$.file"],
      files: ["detail.$.file"],
      dates: ["detail.$.startDate", "detail.$.endDate"],
      numbers: [
        "detail.$.worker",
        "detail.$.hours",
        "detail.$.rate",
        "detail.$.serviceDescriptionId",
      ],
    });
    console.log({ formValues });
    const safeParse = createSchema.safeParse(formValues);
    if (!safeParse.success) {
      console.log(JSON.stringify(safeParse.error));
      return {
        message: `${safeParse.error.errors[0].path} : ${safeParse.error.errors[0].message}`,
        success: false,
      };
    }
    const { detail } = safeParse.data;
    console.log({ detail });

    const canvasRequestNo = await generateCodeFromDate({ prefix: "FLS-CRSRn" });

    await db.transaction(async (tx) => {
      await tx
        .update(requisition)
        .set({ hasCanvassing: true })
        .where(eq(requisition.requisitionNo, referenceNo));

      const requisitionData = await tx.query.requisition.findFirst({
        where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
      });

      if (!requisitionData) throw new Error("Cannot find requisition.");

      const reviewersAndApprovers = await getReviewersAndApprovers(
        detail.reduce((acc, obj) => acc + obj.rate * obj.hours, 0),
        2,
      );

      const user = await getUser();

      const canvassingValues: typeof canvassing.$inferInsert = {
        purchasingId: requisitionData.purchasingId,
        canvasRequestNo,
        priorityLevelId: requisitionData.priorityLevelId,
        expectedStartDate: requisitionData.expectedStartDate,
        expectedEndDate: requisitionData.expectedEndDate,
        createdBy: Number(user.id),
        requestedBy: requisitionData.createdBy,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
        ...reviewersAndApprovers,
      };

      await tx.insert(canvassing).values(canvassingValues);

      for (const d of detail) {
        await tx.insert(canvasService).values({
          ...d,
          workerId: d.workerId,
          serviceDescriptionId: d.serviceDescriptionId,
          canvasRequestNo,
        });
        const uploadedFileResponse = await utapi.uploadFiles(d.file);
        const toInsert: (typeof canvasServiceAttachments.$inferInsert)[] = [];
        for (const { data: uploaded } of uploadedFileResponse) {
          if (uploaded) {
            toInsert.push({
              key: uploaded.key,
              canvasRequestNo,
              url: uploaded.url,
            });
          }
        }
        if (toInsert.length > 0) {
          await tx.insert(canvasServiceAttachments).values(toInsert);
        }
      }
    });
    revalidatePath(path);
    return {
      success: true,
      message: canvasRequestNo,
    };
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
