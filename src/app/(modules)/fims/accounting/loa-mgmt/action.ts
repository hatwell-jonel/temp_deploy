"use server";

import { db } from "@/db";
import { loaManagement } from "@/db/schema/fims";
import { decode } from "decode-formdata";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const path = "/fims/accounting/loa-mgmt";

type State = {
  success: boolean | undefined;
  message: string | undefined;
};

const createSchema = z.object({
  subModule: z.coerce.number(),
  detail: z.array(
    z
      .object({
        divisionId: z.coerce.number(),
        minimumBudget: z.coerce.number(),
        maximumBudget: z.coerce.number(),
        reviewerId: z.coerce
          .number()
          .optional()
          .transform((s) => (s === 0 ? null : s)),
        reviewer2Id: z.coerce
          .number()
          .optional()
          .transform((s) => (s === 0 ? null : s)),
        approver1Id: z.coerce
          .number()
          .min(1, { message: "Approver 1 is required." }),
        approver2Id: z.coerce
          .number()
          .optional()
          .transform((s) => (s === 0 ? null : s)),
        approver3Id: z.coerce
          .number()
          .optional()
          .transform((s) => (s === 0 ? null : s)),
        level: z.coerce.number(),
      })
      .refine((d) => d.maximumBudget >= d.minimumBudget, {
        message:
          "Maximum budget must be greater than or equal to minimum budget.",
      }),
  ),
});

export async function create(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData, {
      numbers: [
        "subModule",
        "detail.$.divisionId",
        "detail.$.minimumBudget",
        "detail.$.maximumBudget",
        "detail.$.approver1Id",
        "detail.$.approver2Id",
        "detail.$.approver3Id",
        "detail.$.level",
      ],
    });
    console.log(formValues.detail);
    const safeParse = createSchema.safeParse(formValues);
    if (!safeParse.success) {
      console.log(JSON.stringify(safeParse.error));
      return {
        message: safeParse.error.errors[0].message,
        success: false,
      };
    }
    const { detail, subModule } = safeParse.data;
    console.log({ detail });

    await db.transaction(async (tx) => {
      const valuesToInsert: (typeof loaManagement.$inferInsert)[] = detail.map(
        (d) => ({
          approver1Id: d.approver1Id,
          reviewer1Id: d.reviewerId,
          reviewer2Id: d.reviewer2Id,
          approver2Id: d.approver2Id,
          approver3Id: d.approver3Id,
          divisionId: d.divisionId,
          level: d.level,
          minAmount: d.minimumBudget,
          maxAmount: d.maximumBudget,
          subModuleId: subModule,
        }),
      );
      await tx.insert(loaManagement).values(valuesToInsert);
    });
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully registered LOA!",
    };
  } catch (error) {
    console.log({ error });
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

type Bind = {
  subModuleId: number;
  divisionId: number;
};

export async function edit(
  binded: Bind,
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData, {
      numbers: [
        "subModule",
        "detail.$.divisionId",
        "detail.$.minimumBudget",
        "detail.$.maximumBudget",
        "detail.$.approver1Id",
        "detail.$.approver2Id",
        "detail.$.approver3Id",
        "detail.$.level",
      ],
    });
    console.log(formValues.detail);
    const safeParse = createSchema.safeParse(formValues);
    if (!safeParse.success) {
      console.log(JSON.stringify(safeParse.error));
      return {
        message: `${safeParse.error.errors[0].path} : ${safeParse.error.errors[0].message}`,
        success: false,
      };
    }
    const { detail, subModule } = safeParse.data;
    console.log({ detail });

    await db.transaction(async (tx) => {
      const valuesToInsert: (typeof loaManagement.$inferInsert)[] = detail.map(
        (d) => ({
          approver1Id: d.approver1Id,
          reviewer1Id: d.reviewerId,
          reviewer2Id: d.reviewer2Id,
          approver2Id: d.approver2Id,
          approver3Id: d.approver3Id,
          divisionId: d.divisionId,
          level: d.level,
          minAmount: d.minimumBudget,
          maxAmount: d.maximumBudget,
          subModuleId: subModule,
        }),
      );
      for (const values of valuesToInsert) {
        await tx
          .update(loaManagement)
          .set(values)
          .where(
            and(
              eq(loaManagement.divisionId, binded.divisionId),
              eq(loaManagement.subModuleId, binded.subModuleId),
              eq(loaManagement.level, values.level),
            ),
          );
      }
    });
    revalidatePath(path);
    return {
      success: true,
      message: "Successfully updated LOA!",
    };
  } catch (error) {
    console.log({ error });
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function toggleStatus({
  divisionId,
  subModuleId,
}: {
  subModuleId: number;
  divisionId: number;
}) {
  try {
    const data = await db.query.loaManagement.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.subModuleId, subModuleId),
          eq(table.divisionId, divisionId),
        ),
    });
    const currentStatus = data?.status || 1;
    const newStatus = currentStatus === 1 ? 2 : 1;
    await db
      .update(loaManagement)
      .set({ status: newStatus })
      .where(
        and(
          eq(loaManagement.subModuleId, subModuleId),
          eq(loaManagement.divisionId, divisionId),
        ),
      );
    return { ok: true, message: "" };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update status.",
    };
  }
}
