"use server";

import { db } from "@/db";
import { budgetSource, manpower } from "@/db/schema/fims";
import { actionMessage, camelCaseToWords } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";

const path = "/fims/purchasing/manpower-mgmt";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const createSchema = createInsertSchema(manpower, {
  emailAddress: (schema) => schema.emailAddress.email(),
  agency: (schema) => schema.agency.min(3),
  firstName: (schema) => schema.firstName.min(1),
  lastName: (schema) => schema.lastName.min(1),
  mobileNumber: (schema) => schema.mobileNumber.min(10),
  tin: (schema) => schema.tin.min(5),
});

export async function create(_: State, formData: FormData): Promise<State> {
  try {
    const parsed = createSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!parsed.success) {
      console.log(JSON.stringify(parsed.error));
      return {
        success: false,
        message: actionMessage(parsed.error.flatten().fieldErrors),
      };
    }
    await db.insert(manpower).values(parsed.data);
    revalidatePath(path);
    return { success: true, message: "Successfully registered Manpower!" };
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
    const parsed = createSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!parsed.success) {
      console.log(JSON.stringify(parsed.error));
      return {
        success: false,
        message: Object.entries(parsed.error.flatten().fieldErrors)
          .map(([k, v]) => `${camelCaseToWords(k)} : ${v}`)
          .join(" "),
      };
    }
    await db.update(manpower).set(parsed.data).where(eq(manpower.id, id));
    revalidatePath(path);
    return { success: true, message: "Successfully updated budget source!" };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function toggleStatus(id: number) {
  try {
    const data = await db.query.budgetSource.findFirst({
      where: eq(budgetSource.id, id),
    });
    const currentStatus = data?.status || 1;
    const newStatus = currentStatus === 1 ? 2 : 1;
    await db
      .update(budgetSource)
      .set({ status: newStatus })
      .where(eq(budgetSource.id, id));
    revalidatePath(path);
    return { ok: true, message: "" };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update status.",
    };
  }
}
