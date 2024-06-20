import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { monthFullnames, months } from "@/lib/utils";
import { budgetPlanTransferSearchParams } from "@/validations/searchParams";
import { Suspense } from "react";
import {
  CreateForm,
  SelectCOA,
  SelectSearchParams,
  SelectYear,
  TransferredNewBalance,
} from "../client";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export async function TransferForm({ searchParams }: PageProps) {
  const parse = budgetPlanTransferSearchParams.safeParse(searchParams);
  if (!parse.success)
    return <>{JSON.stringify(parse.error.flatten().fieldErrors)}</>;
  const { coaID, year, from, to } = parse.data;

  const chartOfAccounts = await db.query.chartOfAccounts.findMany({
    where: (table, { eq }) => eq(table.status, 1),
    with: {
      yearlyBudget: true,
    },
  });

  const user = await getUser();
  const userDetails = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, Number(user.id)),
  });

  if (!userDetails) throw new Error("user not found!");

  let unavailedAmountFrom = 0;
  let unavailedAmountTo = 0;
  if (coaID && year) {
    const yearlyBudgetData = await db.query.yearlyBudget.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.chartOfAccountsId, coaID),
          eq(table.year, year),
          eq(table.divisionId, userDetails.divisionId),
        ),
    });
    if (!yearlyBudgetData)
      return `This chart of accounts has no tagged budget for year ${year}.`;
    if (yearlyBudgetData) {
      if (from) {
        unavailedAmountFrom = months.includes(from)
          ? yearlyBudgetData[from]
          : unavailedAmountFrom;
      }
      if (to) {
        unavailedAmountTo = months.includes(to)
          ? yearlyBudgetData[to]
          : unavailedAmountTo;
      }
    }
  }

  const years = chartOfAccounts.flatMap((coa) =>
    coa.yearlyBudget.map((yb) => yb.year),
  );
  const uniqueYears = [...new Set(years)];

  return (
    <Suspense fallback={<Icons.spinner className="size-5 animate-spin" />}>
      <CreateForm>
        <div className="max-w-md space-y-4 rounded-lg border border-foreground bg-background py-4 shadow-md *:px-4">
          <div className="font-bold text-md">Budget Transfer Form</div>
          <div className="flex justify-between">
            <div>
              <Label className="font-semibold text-xs">Chart of Accounts</Label>
              <SelectCOA
                name="chartOfAccounts"
                defaultValue={coaID ? String(coaID) : undefined}
              >
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {chartOfAccounts.map((coa) => (
                    <SelectItem key={coa.id} value={String(coa.id)}>
                      {coa.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectCOA>
            </div>
            <div>
              <Label className="font-semibold text-xs">Year</Label>
              <SelectYear name="year">
                <SelectTrigger className="w-[180px] text-foreground text-xs">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueYears.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectYear>
            </div>
          </div>
          <div className="!px-0 flex w-full text-xs">
            <div className="w-1/2 space-y-2 border-gray-400 border-r border-dashed *:px-4">
              <div className="border-gray-400 border-y bg-[#F2F2F2] text-center">
                From
              </div>
              <div>
                <Label className="font-semibold text-xs">Month</Label>
                <SelectSearchParams
                  paramKey="from"
                  defaultValue={from}
                  name="from.month"
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthFullnames.map((month, index) => (
                      <SelectItem
                        key={months[index]}
                        value={String(months[index])}
                      >
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectSearchParams>
              </div>
              <div>
                <Label className="font-semibold text-xs">
                  Unavailed Budget
                </Label>
                <Input
                  disabled
                  value={unavailedAmountFrom}
                  className="text-right"
                  type="number"
                />
              </div>
              <TransferredNewBalance
                unavailed={unavailedAmountFrom}
                method="subtract"
              >
                <Label className="font-semibold text-xs">
                  Amount to be Transferred
                </Label>
              </TransferredNewBalance>
            </div>
            <div className="w-1/2 space-y-2 *:px-4">
              <div className="border-gray-400 border-y bg-[#F2F2F2] text-center">
                To
              </div>
              <div>
                <Label className="font-semibold text-xs">Month</Label>
                <SelectSearchParams
                  paramKey="to"
                  defaultValue={to}
                  name="to.month"
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthFullnames.map((month, index) => (
                      <SelectItem
                        key={months[index]}
                        value={String(months[index])}
                      >
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectSearchParams>
              </div>
              <div>
                <Label className="font-semibold text-xs">
                  Unavailed Budget
                </Label>
                <Input
                  disabled
                  value={unavailedAmountTo}
                  className="text-right"
                  type="number"
                />
              </div>

              <TransferredNewBalance unavailed={unavailedAmountTo} method="add">
                <Label className="font-semibold text-xs">
                  Amount to be Received
                </Label>
              </TransferredNewBalance>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <CancelButton />
            <SubmitButton>Submit</SubmitButton>
          </div>
        </div>
      </CreateForm>
    </Suspense>
  );
}
