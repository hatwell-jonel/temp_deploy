"use server";

import { db } from "@/db";
import { chartOfAccounts } from "@/db/schema/fims";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const path = "/fims/purchasing/data-mgmt/chart-of-accounts";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const nameSchema = zfd.text(
  z.string({ required_error: "Chart of Account is required." }).min(3, {
    message: "Chart of Account must contain atleast 3 character(s)",
  }),
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
    await db.insert(chartOfAccounts).values(
      parsed.name.map((name, index) => ({
        name,
        accountCode: parsed.accountCode[index],
      })),
    );
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully registered Chart of Accounts!",
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
    await db
      .update(chartOfAccounts)
      .set(parsed)
      .where(eq(chartOfAccounts.id, id));
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully updated Chart of Accounts!",
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
    const data = await db.query.chartOfAccounts.findFirst({
      where: eq(chartOfAccounts.id, id),
    });
    const currentStatus = data?.status || 1;
    const newStatus = currentStatus === 1 ? 2 : 1;
    await db
      .update(chartOfAccounts)
      .set({ status: newStatus })
      .where(eq(chartOfAccounts.id, id));
    revalidatePath(path);
    return { ok: true, message: "" };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update status.",
    };
  }
}
