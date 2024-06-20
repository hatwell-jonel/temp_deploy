"use server";

import { db } from "@/db";
import { opexCategory } from "@/db/schema/fims";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const path = "/fims/purchasing/data-mgmt/opex-category";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const createSchema = zfd.formData({
  category: zfd.repeatableOfType(
    zfd.text(
      z
        .string({ required_error: "Category is required." })
        .min(3, { message: "Category must contain atleast 3 character(s)" }),
    ),
  ),
  type: zfd.repeatableOfType(
    zfd.text(
      z
        .string({ required_error: "Type is required." })
        .min(3, { message: "Type must contain atleast 3 character(s)" })
        .startsWith("OpEx ", { message: "Type must start with 'OpEx'" }),
    ),
  ),
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
    await db.insert(opexCategory).values(
      parsed.category.map((category, index) => ({
        category,
        type: parsed.type[index],
      })),
    );
    revalidatePath(path);
    return { success: true, message: "Successfully registered OpEx category!" };
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

const editSchema = zfd.formData({
  category: zfd.text(
    z
      .string({ required_error: "Category is required." })
      .min(3, { message: "Category must contain atleast 3 character(s)" }),
  ),
  type: zfd.text(
    z
      .string({ required_error: "Type is required." })
      .min(3, { message: "Type must contain atleast 3 character(s)" })
      .startsWith("OpEx ", { message: "Type must start with 'OpEx'" }),
  ),
});

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
    await db.update(opexCategory).set(parsed).where(eq(opexCategory.id, id));
    revalidatePath(path);
    return { success: true, message: "Successfully updated OpEx category!" };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function toggleStatus(id: number) {
  try {
    const data = await db.query.opexCategory.findFirst({
      where: eq(opexCategory.id, id),
    });
    const currentStatus = data?.status || 1;
    const newStatus = currentStatus === 1 ? 2 : 1;
    await db
      .update(opexCategory)
      .set({ status: newStatus })
      .where(eq(opexCategory.id, id));
    revalidatePath(path);
    return { ok: true, message: "" };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update status.",
    };
  }
}
