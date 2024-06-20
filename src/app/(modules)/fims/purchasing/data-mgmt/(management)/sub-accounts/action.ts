"use server";

import { db } from "@/db";
import { subAccounts } from "@/db/schema/fims";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const path = "/fims/purchasing/data-mgmt/sub-accounts";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const nameSchema = zfd.text(
  z
    .string({ required_error: "Sub Account is required." })
    .min(3, { message: "Sub Account must contain atleast 3 character(s)" }),
);

const accountCodeSchema = zfd.text(
  z
    .string({ required_error: "Account Code is required." })
    .min(3, { message: "Account Code must contain atleast 3 character(s)" }),
);

const editSchema = zfd.formData({
  name: nameSchema,
  accountCode: accountCodeSchema,
});

const createSchema = zfd.formData({
  name: zfd.repeatableOfType(nameSchema),
  accountCode: zfd.repeatableOfType(accountCodeSchema),
});

export async function create(_: State, formData: FormData): Promise<State> {
  try {
    const safeParse = createSchema.safeParse(formData);
    if (!safeParse.success) {
      console.log(safeParse.error);
      return {
        message: safeParse.error.errors[0].message,
        success: false,
      };
    }
    const parsed = safeParse.data;
    await db.insert(subAccounts).values(
      parsed.name.map((name, index) => ({
        name,
        accountCode: parsed.accountCode[index],
      })),
    );
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully registered Sub Account!",
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
  try {
    const safeParse = editSchema.safeParse(formData);
    if (!safeParse.success)
      return {
        message: safeParse.error.errors[0].message,
        success: false,
      };
    const parsed = safeParse.data;
    await db.update(subAccounts).set(parsed).where(eq(subAccounts.id, id));
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully updated Sub Account!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function toggleStatus(id: number) {
  try {
    const data = await db.query.subAccounts.findFirst({
      where: eq(subAccounts.id, id),
    });
    const currentStatus = data?.status || 1;
    const newStatus = currentStatus === 1 ? 2 : 1;
    await db
      .update(subAccounts)
      .set({ status: newStatus })
      .where(eq(subAccounts.id, id));
    revalidatePath(path);
    return { ok: true, message: "" };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update status.",
    };
  }
}
