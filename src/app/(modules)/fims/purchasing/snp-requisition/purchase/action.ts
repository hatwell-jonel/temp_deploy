"use server";

import { db } from "@/db";
import {
  purchase,
  purchaseAttachments,
  purchasing,
  requisition,
} from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import {
  generateCodeFromDate,
  getPriorityLevel,
  getReviewersAndApprovers,
} from "@/lib/helpers";
import { numericSchema } from "@/lib/schema-builder";
import { utapi } from "@/lib/uploadthing";
import { decode } from "decode-formdata";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const path = "/fims/purchasing/snp-requisition/purchase";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const createSchema = z.object({
  endDate: z.coerce.date({ invalid_type_error: "Invalid delivery date." }),
  requisitionTypeId: z.coerce.number(),
  detail: z.array(
    z.object({
      category: numericSchema("Category", false),
      description: numericSchema("Description", false),
      quantity: numericSchema("Quantity", false),
      unit: numericSchema("Unit", false),
      estimatedPrice: numericSchema("Estimated Price", false),
      estimatedTotal: numericSchema("Estimated Total", false),
      purpose: z.coerce.number().transform((v) => (!v ? null : v)),
      beneficiaryBranch: numericSchema("Benefeciary Branch", false),
      preferredSupplier: z.coerce.number().transform((v) => (!v ? null : v)),
      remarks: z.string().transform((v) => (v === "" ? null : v)),
      isSample: z.string().transform((v) => v === "true"),
      file: z.array(z.instanceof(File).optional()),
    }),
  ),
});

export async function create(_: State, formData: FormData): Promise<State> {
  try {
    const formValues = decode(formData, {
      arrays: ["detail", "detail.$.file"],
      dates: ["endDate"],
      files: ["detail.$.file"],
      numbers: [
        "detail.$.category",
        "detail.$.description",
        "detail.$.unit",
        "detail.$.quantity",
        "detail.$.estimatedPrice",
        "detail.$.estimatedTotal",
        "detail.$.beneficiaryBranch",
        "detail.$.preferredSupplierId",
      ],
    });
    console.log({ formValues });
    const safeParse = createSchema.safeParse(formValues);
    if (!safeParse.success) {
      console.log(safeParse.error);
      return {
        message: safeParse.error.errors.map((e) => e.message).join(" "),
        success: false,
      };
    }
    const { detail, endDate, requisitionTypeId } = safeParse.data;
    const startDate = new Date();

    const referenceNo = await generateCodeFromDate({ prefix: "FLS-PRN" });
    const user = await getUser();
    const parsed = safeParse.data;

    const reviewersAndApprovers = await getReviewersAndApprovers(
      parsed.detail.reduce((acc, obj) => acc + obj.estimatedTotal, 0),
      1,
    );

    const priorityLevelId = await getPriorityLevel(endDate);

    await db.transaction(async (tx) => {
      const purchasingData = await tx.insert(purchasing).values({});
      await tx.insert(requisition).values({
        createdBy: Number(user.id),
        expectedEndDate: endDate,
        expectedStartDate: startDate,
        priorityLevelId,
        requisitionNo: referenceNo,
        requisitionTypeId,
        purchasingId: purchasingData[0].insertId,
        ...reviewersAndApprovers,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
      });

      for (const d of detail) {
        await tx.insert(purchase).values({
          beneficialBranchId: d.beneficiaryBranch,
          estimatedPrice: d.estimatedPrice,
          estimatedTotal: d.estimatedTotal,
          isSampleProduct: d.isSample,
          itemCategoryId: d.category,
          itemDescriptionId: d.description,
          quantity: d.quantity,
          requisitionNo: referenceNo,
          unitId: d.unit,
          preferredSupplierId: d.preferredSupplier,
        });
        const detailData = await tx.query.purchase.findFirst({
          where: (table, { eq }) => eq(table.requisitionNo, referenceNo),
          orderBy: (table, { desc }) => [desc(table.createdAt)],
        });
        if (!detailData) throw new Error("Inserted detail not found!");
        const uploadedFileResponse = await utapi.uploadFiles(d.file);
        const toInsert: (typeof purchaseAttachments.$inferInsert)[] = [];
        for (const { data: uploaded } of uploadedFileResponse) {
          if (uploaded) {
            toInsert.push({
              key: uploaded.key,
              purchaseId: detailData.id,
              url: uploaded.url,
            });
          }
        }
        if (toInsert.length > 0) {
          await tx.insert(purchaseAttachments).values(toInsert);
        }
      }
    });
    revalidatePath(path, "layout");
    return {
      success: true,
      message: referenceNo,
    };
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
