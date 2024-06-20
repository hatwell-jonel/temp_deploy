"use server";

import { db } from "@/db";
import { supplier } from "@/db/schema/fims";
import { actionMessage } from "@/lib/utils";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const path = "/fims/purchasing/manpower-mgmt";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const createSchema = createInsertSchema(supplier, {
  name: (schema) => schema.name.min(1),
  address: (schema) => schema.address.min(3),
  tradeName: (schema) => schema.tradeName.min(3),
  tin: (schema) => schema.tin.min(5),
  emailAddress: (schema) => schema.emailAddress.email(),
  firstName: (schema) => schema.firstName.min(1),
  lastName: (schema) => schema.lastName.min(1),
  mobileNumber: (schema) => schema.mobileNumber.min(10),
  payeeName: (schema) => schema.payeeName.min(2),
  payeeAccountNumber: (schema) => schema.payeeAccountNumber.min(3),
  bankAccountName: (schema) => schema.bankAccountName.min(2),
  bankAccountNumber: (schema) => schema.bankAccountNumber.min(3),
  bankId: z.coerce.number(),
  barangayId: z.coerce.number(),
  cityId: z.coerce.number(),
  industryId: z.coerce.number(),
  regionId: z.coerce.number(),
});

export async function create(_: State, formData: FormData): Promise<State> {
  try {
    console.log(Object.fromEntries(formData.entries()));
    const formValues = decode(formData, {
      numbers: ["industryId", "barangayId", "cityId", "regionId", "bankId"],
    });
    // console.log(formValues);
    const parsed = createSchema.safeParse(formValues);
    if (!parsed.success) {
      console.log(JSON.stringify(parsed.error));
      return {
        success: false,
        message: actionMessage(parsed.error.flatten().fieldErrors),
      };
    }
    await db.insert(supplier).values({
      ...parsed.data,
      bankId: parsed.data.bankId,
      barangayId: parsed.data.barangayId,
      cityId: parsed.data.cityId,
      industryId: parsed.data.industryId,
      regionId: parsed.data.regionId,
    });
    revalidatePath(path);
    return { success: true, message: "Successfully registered Supplier!" };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function edit(
  id: number,
  _: State,
  formData: FormData,
): Promise<State> {
  try {
    console.log(Object.fromEntries(formData.entries()));
    const formValues = decode(formData, {
      numbers: ["industryId", "barangayId", "cityId", "regionId", "bankId"],
    });
    // console.log(formValues);
    const parsed = createSchema.safeParse(formValues);
    if (!parsed.success) {
      console.log(JSON.stringify(parsed.error));
      return {
        success: false,
        message: actionMessage(parsed.error.flatten().fieldErrors),
      };
    }
    await db
      .update(supplier)
      .set({
        ...parsed.data,
        bankId: parsed.data.bankId,
        barangayId: parsed.data.barangayId,
        cityId: parsed.data.cityId,
        industryId: parsed.data.industryId,
        regionId: parsed.data.regionId,
      })
      .where(eq(supplier.id, id));
    revalidatePath(path);
    return { success: true, message: "Successfully registered Supplier!" };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function toggleStatus(id: number) {
  try {
    const data = await db.query.supplier.findFirst({
      where: eq(supplier.id, id),
    });
    const currentStatus = data?.status || 1;
    const newStatus = currentStatus === 1 ? 2 : 1;
    await db
      .update(supplier)
      .set({ status: newStatus })
      .where(eq(supplier.id, id));
    revalidatePath(path);
    return { ok: true, message: "" };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update status.",
    };
  }
}
