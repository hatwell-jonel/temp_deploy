"use server";

import { db } from "@/db";
import {
  airline,
  airlineAttachments,
  purchasing,
  recurring,
  rentals,
  rentalsAttachments,
  requisition,
  subscriptionDetail,
  subscriptionsAttachments,
  utility,
  utilityAttachments,
} from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import { generateCodeFromDate, getReviewersAndApprovers } from "@/lib/helpers";
import { dateSchema, numericSchema } from "@/lib/schema-builder";
import { utapi } from "@/lib/uploadthing";
import { add, getYear } from "date-fns";
import { decode } from "decode-formdata";
import { z } from "zod";

// const path = "/fims/purchasing/snp-requisition/recurring";

export type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const createAirlineSchema = z.object({
  detail: z.array(
    z
      .object({
        transportModeId: numericSchema("Transport Mode", false),
        carrierId: numericSchema("Carrier", false),
        from: dateSchema("From", false),
        to: dateSchema("To", false),
        soaNumber: z.string({ required_error: "SOA Number is required." }),
        mawbNumber: z.string({ required_error: "MAWB Number is required." }),
        amount: numericSchema("Amount", false),
        file: z.array(z.instanceof(File).optional()),
      })
      .refine(
        (d) => d.from <= d.to,
        "'From' date must be later or equal to 'To' date",
      ),
  ),
});

export async function createAirline(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const category = await db.query.serviceCategory.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.isRecurring, true), eq(table.name, "Airline")),
    });
    if (!category) throw new Error("Cannot find recurring service category.");
    const serviceCategoryId = category.id;
    const formValues = decode(formData, {
      arrays: ["detail", "detail.$.file"],
      dates: ["detail.$.from", "detail.$.to"],
      files: ["detail.$.file"],
      numbers: [
        "detail.$.transportModeId",
        "detail.$.carrierId",
        "detail.$.amount",
      ],
    });
    const safeParse = createAirlineSchema.safeParse(formValues);
    if (!safeParse.success) {
      console.log(safeParse.error);
      return {
        message: safeParse.error.errors.map((e) => e.message).join(" "),
        success: false,
      };
    }
    const { detail } = safeParse.data;
    const startDate = new Date();

    const referenceNo = await generateCodeFromDate({ prefix: "FLS-SRN-R" });

    const user = await getUser();

    const reviewersAndApprovers = await getReviewersAndApprovers(
      detail.reduce((acc, obj) => acc + obj.amount, 0),
      1,
    );

    await db.transaction(async (tx) => {
      const purchasingData = await tx.insert(purchasing).values({});
      await tx.insert(requisition).values({
        createdBy: Number(user.id),
        expectedEndDate: startDate,
        expectedStartDate: startDate,
        priorityLevelId: 1,
        requisitionNo: referenceNo,
        requisitionTypeId: 5,
        purchasingId: purchasingData[0].insertId,
        ...reviewersAndApprovers,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
      });

      await tx.insert(recurring).values({
        serviceCategoryId,
        requisitionNo: referenceNo,
      });
      for (const d of detail) {
        const airlineTable = await tx.insert(airline).values({
          carrierId: d.carrierId,
          endDate: d.to,
          startDate: d.from,
          referenceNo,
          soaNumber: d.soaNumber,
          transportModeId: d.transportModeId,
          mawbNumber: d.mawbNumber,
          amount: d.amount,
        });
        const uploadedFileResponse = await utapi.uploadFiles(d.file);
        const toInsert: (typeof airlineAttachments.$inferInsert)[] = [];
        for (const { data: uploaded } of uploadedFileResponse) {
          if (uploaded) {
            toInsert.push({
              key: uploaded.key,
              airlineId: airlineTable[0].insertId,
              url: uploaded.url,
            });
          }
        }
        if (toInsert.length > 0) {
          await tx.insert(airlineAttachments).values(toInsert);
        }
      }
    });

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

const createUtilitySchema = z.object({
  detail: z.array(
    z
      .object({
        utilityTypeId: numericSchema("Utility Type", false),
        serviceProviderId: numericSchema("Service Provider", false),
        from: dateSchema("From", false),
        to: dateSchema("To", false),
        soaNumber: z.string({ required_error: "SOA Number is required." }),
        amount: numericSchema("Amount", false),
        file: z.array(z.instanceof(File).optional()),
      })
      .refine(
        (d) => d.from <= d.to,
        "'From' date must be later or equal to 'To' date",
      ),
  ),
});

export async function createUtility(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const category = await db.query.serviceCategory.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.isRecurring, true), eq(table.name, "Utilities")),
    });
    if (!category) throw new Error("Cannot find recurring service category.");
    const serviceCategoryId = category.id;
    const formValues = decode(formData, {
      arrays: ["detail", "detail.$.file"],
      dates: ["detail.$.from", "detail.$.to"],
      files: ["detail.$.file"],
      numbers: [
        "detail.$.utilityTypeId",
        "detail.$.serviceProviderId",
        "detail.$.amount",
      ],
    });
    const safeParse = createUtilitySchema.safeParse(formValues);
    if (!safeParse.success) {
      console.log(safeParse.error);
      return {
        message: safeParse.error.errors.map((e) => e.message).join(" "),
        success: false,
      };
    }
    const { detail } = safeParse.data;
    const startDate = new Date();

    const referenceNo = await generateCodeFromDate({ prefix: "FLS-SRN-R" });

    const user = await getUser();

    const reviewersAndApprovers = await getReviewersAndApprovers(
      detail.reduce((acc, obj) => acc + obj.amount, 0),
      1,
    );

    await db.transaction(async (tx) => {
      const purchasingData = await tx.insert(purchasing).values({});
      await tx.insert(requisition).values({
        createdBy: Number(user.id),
        expectedEndDate: startDate,
        expectedStartDate: startDate,
        priorityLevelId: 1,
        requisitionNo: referenceNo,
        requisitionTypeId: 5,
        purchasingId: purchasingData[0].insertId,
        ...reviewersAndApprovers,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
      });
      await tx.insert(recurring).values({
        serviceCategoryId,
        requisitionNo: referenceNo,
      });
      for (const d of detail) {
        const utilityTable = await tx.insert(utility).values({
          utilityTypeId: d.utilityTypeId,
          endDate: d.to,
          startDate: d.from,
          referenceNo,
          soaNumber: d.soaNumber,
          serviceProviderId: d.serviceProviderId,
          amount: d.amount,
        });
        const uploadedFileResponse = await utapi.uploadFiles(d.file);
        const toInsert: (typeof utilityAttachments.$inferInsert)[] = [];
        for (const { data: uploaded } of uploadedFileResponse) {
          if (uploaded) {
            toInsert.push({
              key: uploaded.key,
              utilityId: utilityTable[0].insertId,
              url: uploaded.url,
            });
          }
        }
        if (toInsert.length > 0) {
          await tx.insert(utilityAttachments).values(toInsert);
        }
      }
    });

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

const createRentalSchema = z.object({
  type: z.coerce.number(),
  detail: z.array(
    z
      .object({
        hubId: numericSchema("Hub/Office", false),
        leasorId: numericSchema("Leasor", false),
        from: dateSchema("From", false),
        to: z.coerce.date().optional(),
        amount: numericSchema("Amount", false),
        file: z.array(z.instanceof(File).optional()),
        terms: z.coerce.number().optional(),
      })
      .refine(
        (data) => {
          const { from, to } = data;
          if (to) {
            if (getYear(to) === 1970) return true;
            return from <= to;
          }
        },
        { message: "'From' date must be later or equal to 'To' date" },
      ),
  ),
});

export async function createRental(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const category = await db.query.serviceCategory.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.isRecurring, true), eq(table.name, "Rentals")),
    });
    if (!category) throw new Error("Cannot find recurring service category.");
    const serviceCategoryId = category.id;
    const formValues = decode(formData, {
      arrays: ["detail", "detail.$.file"],
      dates: ["detail.$.from", "detail.$.to"],
      files: ["detail.$.file"],
      numbers: [
        "detail.$.hubId",
        "detail.$.leasorId",
        "detail.$.amount",
        "type",
      ],
    });
    const safeParse = createRentalSchema.safeParse(formValues);
    if (!safeParse.success) {
      console.log(safeParse.error);
      return {
        message: safeParse.error.errors.map((e) => e.message).join(" "),
        success: false,
      };
    }
    const { detail, type } = safeParse.data;
    const startDate = new Date();

    const referenceNo = await generateCodeFromDate({ prefix: "FLS-SRN-R" });

    const user = await getUser();
    const reviewersAndApprovers = await getReviewersAndApprovers(
      detail.reduce((acc, obj) => acc + obj.amount, 0),
      1,
    );

    await db.transaction(async (tx) => {
      const purchasingData = await tx.insert(purchasing).values({});
      await tx.insert(requisition).values({
        createdBy: Number(user.id),
        expectedEndDate: startDate,
        expectedStartDate: startDate,
        priorityLevelId: 1,
        requisitionNo: referenceNo,
        requisitionTypeId: 5,
        purchasingId: purchasingData[0].insertId,
        ...reviewersAndApprovers,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
      });
      await tx.insert(recurring).values({
        serviceCategoryId,
        requisitionNo: referenceNo,
      });
      for (const d of detail) {
        const [{ insertId: rentalId }, _] = await tx.insert(rentals).values({
          hubId: d.hubId,
          endDate:
            type === 1
              ? d.to
              : add(new Date(), {
                  months: d.terms ?? 0,
                }),
          terms: type === 2 ? d.terms : undefined,
          startDate: d.from,
          referenceNo,
          leasorId: d.leasorId,
          amount: d.amount,
        });
        const uploadedFileResponse = await utapi.uploadFiles(d.file);
        const toInsert: (typeof rentalsAttachments.$inferInsert)[] = [];
        for (const { data: uploaded } of uploadedFileResponse) {
          if (uploaded) {
            toInsert.push({
              key: uploaded.key,
              rentalId,
              url: uploaded.url,
            });
          }
        }
        if (toInsert.length > 0) {
          await tx.insert(rentalsAttachments).values(toInsert);
        }
      }
    });

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

const createSubscriptionSchema = z.object({
  detail: z.array(
    z
      .object({
        subscriptionId: numericSchema("Subscription", false),
        providerId: numericSchema("Provider", false),
        from: dateSchema("From", false),
        to: dateSchema("To", false),
        soaNumber: z.string({ required_error: "SOA Number is required." }),
        amount: numericSchema("Amount", false),
        file: z.array(z.instanceof(File).optional()),
      })
      .refine(
        (d) => d.from <= d.to,
        "'From' date must be later or equal to 'To' date",
      ),
  ),
});

export async function createSubscription(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const category = await db.query.serviceCategory.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.isRecurring, true), eq(table.name, "Subscription")),
    });
    if (!category) throw new Error("Cannot find recurring service category.");
    const serviceCategoryId = category.id;
    const formValues = decode(formData, {
      arrays: ["detail", "detail.$.file"],
      dates: ["detail.$.from", "detail.$.to"],
      files: ["detail.$.file"],
      numbers: [
        "detail.$.utilityTypeId",
        "detail.$.serviceProviderId",
        "detail.$.amount",
      ],
    });
    const safeParse = createSubscriptionSchema.safeParse(formValues);
    if (!safeParse.success) {
      console.log(safeParse.error);
      return {
        message: safeParse.error.errors.map((e) => e.message).join(" "),
        success: false,
      };
    }
    const { detail } = safeParse.data;
    const startDate = new Date();

    const referenceNo = await generateCodeFromDate({ prefix: "FLS-SRN-R" });

    const user = await getUser();

    const reviewersAndApprovers = await getReviewersAndApprovers(
      detail.reduce((acc, obj) => acc + obj.amount, 0),
      1,
    );

    await db.transaction(async (tx) => {
      const purchasingData = await tx.insert(purchasing).values({});
      await tx.insert(requisition).values({
        createdBy: Number(user.id),
        expectedEndDate: startDate,
        expectedStartDate: startDate,
        priorityLevelId: 1,
        requisitionNo: referenceNo,
        requisitionTypeId: 5,
        purchasingId: purchasingData[0].insertId,
        ...reviewersAndApprovers,
        nextActionUserId: Object.values(reviewersAndApprovers).find(
          (approver) => approver !== undefined,
        ),
      });
      await tx.insert(recurring).values({
        serviceCategoryId,
        requisitionNo: referenceNo,
      });

      for (const d of detail) {
        const [{ insertId: subscriptionId }, _] = await tx
          .insert(subscriptionDetail)
          .values({
            subscriptionId: d.subscriptionId,
            endDate: d.to,
            startDate: d.from,
            referenceNo,
            soaNumber: d.soaNumber,
            providerId: d.providerId,
            amount: d.amount,
          });
        const uploadedFileResponse = await utapi.uploadFiles(d.file);
        const toInsert: (typeof subscriptionsAttachments.$inferInsert)[] = [];
        for (const { data: uploaded } of uploadedFileResponse) {
          if (uploaded) {
            toInsert.push({
              key: uploaded.key,
              subscriptionId,
              url: uploaded.url,
            });
          }
        }
        if (toInsert.length > 0) {
          await tx.insert(subscriptionsAttachments).values(toInsert);
        }
      }
    });

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
