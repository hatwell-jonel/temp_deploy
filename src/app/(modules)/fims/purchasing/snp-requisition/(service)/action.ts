"use server";

import { db } from "@/db";
import {
  purchasing,
  requisition,
  serviceRequisition,
  serviceRequisitionAttachments,
} from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import {
  generateCodeFromDate,
  getPriorityLevel,
  getReviewersAndApprovers,
} from "@/lib/helpers";
import { dateSchema, numericSchema } from "@/lib/schema-builder";
import { utapi } from "@/lib/uploadthing";
import { decode } from "decode-formdata";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const path = "/fims/purchasing/data-mgmt/item-description";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const createSchema = zfd
  .formData({
    startDate: dateSchema("Start Date"),
    endDate: dateSchema("End Date"),
    category: numericSchema("Categeory"),
    description: numericSchema("Description"),
    numberOfWorkers: numericSchema("Number of Workers"),
    manHours: numericSchema("Man Hours"),
    estimatedRate: numericSchema("Estimated Rate"),
    preferredWorker: z.coerce.number().optional(),
    purpose: z.coerce.number().optional(),
    location: numericSchema("Location"),
    comments: z.string().optional(),
    file: z.array(z.instanceof(File).optional()),
  })
  .refine(
    (d) => d.startDate <= d.endDate,
    "End date must be later or equal to start date",
  );

export async function create(_: State, formData: FormData): Promise<State> {
  try {
    const formValues = decode(formData, {
      arrays: ["file"],
      dates: ["startDate", "endDate"],
      files: ["file"],
      numbers: [
        "category",
        "description",
        "numberOfWorkers",
        "manHours",
        "estimatedRate",
        "location",
      ],
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

    const referenceNo = await generateCodeFromDate({ prefix: "FLS-SRN" });

    const user = await getUser();

    const reviewersAndApprovers = await getReviewersAndApprovers(
      parsed.estimatedRate,
      1,
    );

    const priorityLevelId = await getPriorityLevel(parsed.startDate);

    await db.transaction(async (tx) => {
      const purchasingData = await tx.insert(purchasing).values({});
      await tx.insert(requisition).values({
        createdBy: Number(user.id),
        expectedEndDate: parsed.endDate,
        expectedStartDate: parsed.startDate,
        priorityLevelId,
        requisitionNo: referenceNo,
        requisitionTypeId: 1,
        purchasingId: purchasingData[0].insertId,
        ...reviewersAndApprovers,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
      });

      await tx.insert(serviceRequisition).values({
        requisitionNo: referenceNo,
        estimatedRate: parsed.estimatedRate,
        locationId: parsed.location,
        manHours: parsed.manHours,
        numberOfWorkers: parsed.numberOfWorkers,
        serviceCategoryId: parsed.category,
        serviceDescriptionId: parsed.description,
        comments: parsed.comments,
        preferredWorkerId: parsed.preferredWorker
          ? parsed.preferredWorker
          : undefined,
        purposeId: parsed.purpose ? parsed.purpose : undefined,
      });

      const serviceRequisitionData =
        await tx.query.serviceRequisition.findFirst({
          where: (service, { eq }) => eq(service.requisitionNo, referenceNo),
        });
      if (parsed.file.length > 0) {
        const uploadedFileResponse = await utapi.uploadFiles(
          formData.getAll("file"),
        );
        console.log({ uploadedFileResponse });
        if (!serviceRequisitionData)
          throw new Error("Service Requisition inserted not found!");
        const toInsert: (typeof serviceRequisitionAttachments.$inferInsert)[] =
          [];
        for (let index = 0; index < uploadedFileResponse.length; index++) {
          const uploaded = uploadedFileResponse[index].data;
          if (uploaded) {
            toInsert.push({
              key: uploaded.key,
              serviceRequisitionId: serviceRequisitionData.id,
              url: uploaded.url,
            });
          }
        }
        await tx.insert(serviceRequisitionAttachments).values(toInsert);
      }
    });
    revalidatePath(path);
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
