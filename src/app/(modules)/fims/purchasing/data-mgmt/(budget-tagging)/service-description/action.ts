"use server";

import { db } from "@/db";
import { serviceDescription } from "@/db/schema/fims";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const path = "/fims/purchasing/data-mgmt/service-description";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const descriptionSchema = zfd.text(
  z.string({ required_error: "Service Description is required." }).min(3, {
    message: "Service Description must contain atleast 3 character(s)",
  }),
);

const priceSchema = zfd.numeric(
  z.coerce.number({
    required_error: "Estimated market price is required.",
    invalid_type_error: "Estimated market price must be number.",
  }),
);

const categoryIdSchema = zfd.numeric(
  z.coerce.number({
    required_error: "Category is required.",
    invalid_type_error: "Category must be number.",
  }),
);

const editSchema = zfd.formData({
  description: descriptionSchema,
  price: priceSchema,
  categoryId: categoryIdSchema,
});

const createSchema = zfd.formData({
  description: zfd.repeatableOfType(descriptionSchema),
  price: zfd.repeatableOfType(priceSchema),
  categoryId: zfd.repeatableOfType(categoryIdSchema),
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
    console.log({ parsed });
    await db.insert(serviceDescription).values(
      parsed.description.map((description, index) => ({
        description,
        serviceCategoryId: parsed.categoryId[index],
        price: parsed.price[index],
      })),
    );
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully registered Service Descriptions!",
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
    const { categoryId, description, price } = safeParse.data;
    await db
      .update(serviceDescription)
      .set({
        description,
        serviceCategoryId: categoryId,
        price,
      })
      .where(eq(serviceDescription.id, id));
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully updated Service Description!",
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
    const data = await db.query.serviceDescription.findFirst({
      where: eq(serviceDescription.id, id),
    });
    const currentStatus = data?.status || 1;
    const newStatus = currentStatus === 1 ? 2 : 1;
    await db
      .update(serviceDescription)
      .set({ status: newStatus })
      .where(eq(serviceDescription.id, id));
    revalidatePath(path);
    return { ok: true, message: "" };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update status.",
    };
  }
}
