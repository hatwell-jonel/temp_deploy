"use server";

import { db } from "@/db";
import {
  canvasPurchase as canvasRequest,
  canvasPurchaseAttachments as canvasRequestAttachments,
  canvassing,
  requisition,
} from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import { generateCodeFromDate, getReviewersAndApprovers } from "@/lib/helpers";
import { utapi } from "@/lib/uploadthing";
import { decode } from "decode-formdata";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const path = "/fims/purchasing/canvas-request/purchase";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const createCanvasSchema = createInsertSchema(canvasRequest, {
  itemDescriptionId: z.coerce.number(),
  quantity: z.coerce.number(),
  unitPrice: z.coerce.number(),
  supplierId: z.coerce.number(),
  paymentModeId: z.coerce.number(),
  paymentOptionId: z.coerce.number(),
  methodOfDeliveryId: z.coerce.number(),
  installmentTerms: z.coerce.number(),
  paymentTerms: z.coerce.number(),
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
    const formValues = decode(formData, {
      arrays: ["detail", "detail.$.file"],
      files: ["detail.$.file"],
      dates: ["detail.$.deliveryDate"],
      numbers: [
        "detail.$.itemDescriptionId",
        "detail.$.supplierId",
        "detail.$.paymentModeId",
        "detail.$.paymentOptionId",
        "detail.$.methodOfDeliveryId",
      ],
    });
    const formDetail = formValues as z.infer<typeof createSchema>;
    formDetail.detail = formDetail.detail.filter((item) => {
      const hasNonFileProperties = Object.keys(item).some(
        (key) => key !== "file",
      );
      return hasNonFileProperties;
    });
    const safeParse = createSchema.safeParse(formDetail);
    if (!safeParse.success) {
      return {
        message: `${safeParse.error.errors[0].path} : ${safeParse.error.errors[0].message}`,
        success: false,
      };
    }
    const { detail } = safeParse.data;

    const canvasRequestNo = await generateCodeFromDate({ prefix: "FLS-CRPRn" });

    await db.transaction(async (tx) => {
      await tx
        .update(requisition)
        .set({ hasCanvassing: true })
        .where(
          and(
            eq(requisition.requisitionNo, referenceNo),
            eq(requisition.hasCanvassing, false),
          ),
        );

      const requisitionData = await tx.query.requisition.findFirst({
        where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
      });

      if (!requisitionData) throw new Error("Cannot find requisition.");

      const reviewersAndApprovers = await getReviewersAndApprovers(
        detail.reduce((acc, obj) => acc + obj.unitPrice * obj.quantity, 0),
        2,
      );

      const user = await getUser();

      await tx.insert(canvassing).values({
        purchasingId: requisitionData.purchasingId,
        canvasRequestNo,
        type: 2,
        priorityLevelId: requisitionData.priorityLevelId,
        expectedStartDate: requisitionData.expectedStartDate,
        expectedEndDate: requisitionData.expectedEndDate,
        createdBy: Number(user.id),
        requestedBy: requisitionData.createdBy,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
        ...reviewersAndApprovers,
      });

      for (const d of detail) {
        await tx.insert(canvasRequest).values({
          ...d,
          itemDescriptionId: d.itemDescriptionId,
          methodOfDeliveryId: d.methodOfDeliveryId,
          paymentModeId: d.paymentModeId,
          paymentOptionId: d.paymentOptionId,
          supplierId: d.supplierId,
          canvasRequestNo,
        });

        const uploadedFileResponse = await utapi.uploadFiles(d.file);
        const toInsert: (typeof canvasRequestAttachments.$inferInsert)[] = [];
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
          await tx.insert(canvasRequestAttachments).values(toInsert);
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
