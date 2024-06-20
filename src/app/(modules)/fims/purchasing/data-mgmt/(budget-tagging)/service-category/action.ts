"use server";

import { db } from "@/db";
import { serviceCategory } from "@/db/schema/fims";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const path = "/fims/purchasing/data-mgmt/service-category";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const selectSchema = (title: string) => {
  return zfd.numeric(
    z.coerce.number({
      required_error: `${title} is required.`,
      invalid_type_error: `Invalid type of ${title}`,
    }),
  );
};

const nameSchema = zfd.text(
  z.string({ required_error: "Service Category is required." }).min(3, {
    message: "Service Category must contain atleast 3 character(s)",
  }),
);

const editSchema = zfd.formData({
  name: nameSchema,
  isRecurring: zfd.checkbox(),
  budgetSource: selectSchema("Budget Source"),
  opexCategory: selectSchema("OpEx Category"),
  chartOfAccounts: selectSchema("Chart of Accounts"),
  subAccounts: selectSchema("Sub-Accounts"),
});

const createSchema = zfd.formData({
  name: zfd.repeatableOfType(nameSchema),
  isRecurring: zfd.repeatableOfType(zfd.checkbox()),
  budgetSource: zfd.repeatableOfType(selectSchema("Budget Source")),
  opexCategory: zfd.repeatableOfType(selectSchema("OpEx Category")),
  chartOfAccounts: zfd.repeatableOfType(selectSchema("Chart of Accounts")),
  subAccounts: zfd.repeatableOfType(selectSchema("Sub-Accounts")),
});

export async function create(_: State, formData: FormData): Promise<State> {
  try {
    console.log(Object.fromEntries(formData.entries()));
    const parsed = createSchema.safeParse(formData);
    if (!parsed.success)
      return { success: false, message: parsed.error.errors[0].message };
    console.log({ parsed });
    const toInsert: (typeof serviceCategory.$inferInsert)[] =
      parsed.data.name.map((name, index) => ({
        budgetSourceId: parsed.data.budgetSource[index],
        opexCategoryId: parsed.data.opexCategory[index],
        chartOfAccountsId: parsed.data.chartOfAccounts[index],
        subAccountsId: parsed.data.subAccounts[index],
        isRecurring: parsed.data.isRecurring[index],
        name,
      }));
    await db.insert(serviceCategory).values(toInsert);
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully registered service category!",
    };
  } catch (error) {
    console.log({ error });
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
  const parsed = editSchema.safeParse(formData);
  console.log({ parsed });
  if (!parsed.success)
    return {
      success: false,
      message: parsed.error.errors[0].message,
    };
  try {
    await db
      .update(serviceCategory)
      .set({
        budgetSourceId: parsed.data.budgetSource,
        name: parsed.data.name,
        isRecurring: parsed.data.isRecurring,
        opexCategoryId: parsed.data.opexCategory,
        chartOfAccountsId: parsed.data.chartOfAccounts,
        subAccountsId: parsed.data.subAccounts,
      })
      .where(eq(serviceCategory.id, id));
    revalidatePath(path);
    return { success: true, message: "Successfully updated service category!" };
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function toggleStatus(id: number) {
  try {
    const data = await db.query.serviceCategory.findFirst({
      where: eq(serviceCategory.id, id),
    });
    const currentStatus = data?.status || 1;
    const newStatus = currentStatus === 1 ? 2 : 1;
    await db
      .update(serviceCategory)
      .set({ status: newStatus })
      .where(eq(serviceCategory.id, id));
    revalidatePath(path);
    return { ok: true, message: "" };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update status.",
    };
  }
}
