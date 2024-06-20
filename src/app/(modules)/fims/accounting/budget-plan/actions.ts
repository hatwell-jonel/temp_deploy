"use server";

import { db } from "@/db";
import { yearlyBudget } from "@/db/schema/fims";
import { monthFullnames, months, pesofy } from "@/lib/utils";
import { decode } from "decode-formdata";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const path = "/fims/accounting/budget-plan";

const revalidatePaths = () => {
  revalidatePath(path);
  revalidatePath(`${path}/transfer`);
};

type State = {
  success: boolean | undefined;
  message: string | undefined | string[];
};

const createSchema = z
  .object({
    chartOfAccounts: z.coerce.number(),
    year: z.coerce.number(),
    from: z.object({
      month: z.enum(months),
      amount: z.coerce.number().min(1),
    }),
    to: z.object({
      month: z.enum(months),
      amount: z.coerce.number().min(1),
    }),
  })
  .refine((v) => v.from.month !== v.to.month, {
    message: "Same months are not valid.",
  });

export async function transfer(
  prevState: State,
  formData: FormData,
): Promise<State> {
  console.log(Object.fromEntries(formData.entries()));
  try {
    const formValues = decode(formData, {
      numbers: ["from.amount", "to.amount", "year", "chartOfAccounts"],
    });
    const parse = createSchema.safeParse(formValues);
    if (!parse.success) {
      return {
        message: parse.error.issues[0].message,
        success: false,
      };
    }
    const { chartOfAccounts: id, from, to, year } = parse.data;
    const COA = await db.query.chartOfAccounts.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    await db
      .update(yearlyBudget)
      .set({
        [to.month]: to.amount,
        [from.month]: from.amount,
      })
      .where(
        and(
          eq(yearlyBudget.year, year),
          eq(yearlyBudget.chartOfAccountsId, id),
        ),
      );

    const balance = await db.query.yearlyBudget.findFirst({
      where: (table, { and, eq }) =>
        and(eq(table.year, year), eq(table.chartOfAccountsId, id)),
    });

    const newBalance = !balance ? 0 : balance[to.month];
    const fullMonthName = {
      from: monthFullnames[months.indexOf(from.month)],
      to: monthFullnames[months.indexOf(to.month)],
    };
    const coaNameFrom = COA
      ? `${COA.name} - ${fullMonthName.from}`
      : fullMonthName.from;
    const coaNameTo = COA
      ? `${COA.name} - ${fullMonthName.to}`
      : fullMonthName.to;

    revalidatePaths();

    return {
      message: [
        `Budget has been successfully transferred from ${coaNameFrom} to ${coaNameTo}.`,
        `${coaNameTo} New Balance: ${pesofy(newBalance)}`,
      ],
      success: true,
    };
  } catch (error) {
    return {
      message: "Something went wrong",
      success: false,
    };
  }
}
