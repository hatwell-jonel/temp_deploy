"use server";

import { db } from "@/db";
import { budgetSource } from "@/db/schema/fims";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const path = "/fims/purchasing/data-mgmt/budget-source";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

export async function create(_: State, formData: FormData): Promise<State> {
  const names = formData.getAll("name") as string[];
  const parsedNames = z.array(z.string().min(3)).safeParse(names);
  if (!parsedNames.success)
    return {
      success: false,
      message: "Must contain atleast 3 character(s)",
    };
  try {
    await db.insert(budgetSource).values(names.map((name) => ({ name })));
    revalidatePath(path);
    return { success: true, message: "Successfully registered budget source!" };
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
  const name = formData.get("name") as string;
  const parsedName = z.string().min(3).safeParse(name);
  if (!parsedName.success)
    return {
      success: false,
      message: "Must contain atleast 3 character(s)",
    };
  try {
    await db.update(budgetSource).set({ name }).where(eq(budgetSource.id, id));
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
