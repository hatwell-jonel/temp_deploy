import { TitleCard } from "@/components/cards/title";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { YEAR_DROPDOWN } from "@/config/dropdowns";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { cn, formatNumber, monthFullnames, months, pesofy } from "@/lib/utils";
import { budgetPlanSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import * as React from "react";
import { Suspense } from "react";
import { SelectYear } from "./client";

const title = "Budget Plan";

export const metadata = {
  title,
};

const baseHref = "/fims/accounting/budget-plan";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  const parseSP = budgetPlanSearchParams.parse(searchParams);
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard title={title}>
          <Link
            href={`${baseHref}/transfer`}
            className={cn(
              buttonVariants({ size: "long", variant: "outlined" }),
              "w-full text-xs lg:mr-6 lg:w-fit lg:px-4",
            )}
          >
            Budget Transfer
          </Link>
        </TitleCard>
        <div className="space-y-2">
          <div className="flex gap-4 text-xs">
            <Suspense>
              <CurrentDivision />
            </Suspense>
            <div>
              Year
              <Suspense>
                <SelectYear
                  defaultValue={parseSP.year ? String(parseSP.year) : undefined}
                >
                  <SelectTrigger className="w-[150px] text-foreground">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_DROPDOWN.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectYear>
              </Suspense>
            </div>
          </div>
          <section className="relative max-w-[90vw] xl:max-w-[72vw]">
            <Suspense>
              <DataTable searchParams={searchParams} />
            </Suspense>
          </section>
        </div>
      </div>
    </>
  );
}

async function CurrentDivision() {
  const divisions = await db.query.budgetSource.findMany();
  const session = await auth();
  if (!session?.user) throw new Error("No session.");
  const userData = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, Number(session.user?.id)),
  });
  const divisionId = userData?.divisionId;
  return (
    <>
      <div>
        Division
        <Select defaultValue={divisionId ? String(divisionId) : undefined}>
          <SelectTrigger
            className="w-[250px] text-foreground disabled:opacity-80"
            disabled={!!divisionId}
          >
            <SelectValue placeholder="Division" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((division) => (
              <SelectItem value={String(division.id)} key={division.id}>
                {division.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

async function DataTable({ searchParams }: PageProps) {
  const parsedSP = budgetPlanSearchParams.parse(searchParams);
  const year = parsedSP.year || new Date().getFullYear();
  const session = await auth();
  if (!session?.user) throw new Error("No user");
  const userId = session.user.id;
  const userData = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, Number(userId)),
  });

  const data = await db.query.yearlyBudget.findMany({
    where: (table, { eq, and }) =>
      and(
        eq(table.year, year),
        parsedSP.divisionId
          ? eq(table.divisionId, parsedSP.divisionId)
          : userData?.divisionId
            ? eq(table.divisionId, userData.divisionId)
            : undefined,
      ),
    with: {
      division: true,
      chartOfAccounts: true,
      opexCategory: true,
      availment: true,
    },
  });

  const divisionName = data.at(0)?.division.name;

  return (
    <div className="overflow-x-auto rounded-md bg-background shadow-md">
      <Table className="text-xs">
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow className="*:h-6 data-[bordered]:*:border-gray-400 data-[bordered]:*:border-l-2 *:text-center *:text-xs">
            <TableHead
              colSpan={4}
              className="sticky left-0 z-10 bg-background"
            />
            <TableHead data-bordered />
            <TableHead data-bordered />
            <TableHead data-bordered />
            <TableHead colSpan={2} data-bordered />
            <TableHead colSpan={2} data-bordered />
            <TableHead colSpan={4} data-bordered className="border-b-2">
              TOTAL SAVINGS
            </TableHead>
            {monthFullnames.map((month) => (
              <TableHead
                colSpan={5}
                key={month}
                className="border-b-2"
                data-bordered
              >
                {month}
              </TableHead>
            ))}
          </TableRow>
          <TableRow className="*:min-w-[120px] data-[bordered]:*:border-gray-400 data-[bordered]:*:border-l-2 *:text-center">
            <TableCell className="sticky left-0 z-10 bg-background">
              Division
            </TableCell>
            <TableCell className="sticky left-[120px] z-10 bg-background">
              Category
            </TableCell>
            <TableCell className="sticky left-[240px] z-10 bg-background">
              Chart of Accounts
            </TableCell>
            <TableCell className="sticky left-[360px] z-10 bg-background">
              Sub-Accounts
            </TableCell>
            <TableCell data-bordered>CIS Code</TableCell>
            <TableCell data-bordered>OpEx Type</TableCell>
            <TableCell data-bordered>Total Approved Budget</TableCell>
            <TableCell data-bordered colSpan={2}>
              Total Availment
            </TableCell>
            <TableCell data-bordered colSpan={2}>
              Total Unavailed
            </TableCell>
            <TableCell data-bordered colSpan={2}>
              FLS
            </TableCell>
            <TableCell data-bordered colSpan={2}>
              DMT
            </TableCell>
            {months.map((month) => (
              <React.Fragment key={month}>
                <TableCell data-bordered>Approved</TableCell>
                <TableCell data-bordered>Availed</TableCell>
                <TableCell data-bordered>Unavailed</TableCell>
                <TableCell data-bordered>FLS Savings</TableCell>
                <TableCell data-bordered>DMT Savings</TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-[#ECF2FF] data-[bordered]:*:border-gray-400 data-[bordered]:*:border-l-2 *:text-center">
            <TableCell
              className="!text-left sticky left-0 z-10 bg-inherit pl-10 font-bold text-lg text-primary"
              colSpan={4}
            >
              {divisionName} DIVISION TOTAL BUDGET
            </TableCell>
            <TableCell data-bordered />
            <TableCell data-bordered />
            <TableCell data-bordered>{pesofy(256200)}</TableCell>
          </TableRow>
          {data.map((data) => {
            const totalAvailedMonthArray = months.map((month) =>
              data.availment
                .filter((a) => a.month === month)
                .reduce((prev, curr) => prev + curr.amount, 0),
            );
            const totalUnavailedMonthArray = months.map((month) => data[month]);
            const totalApprovedMonthArray = months.map((_) => 30000);
            const totals = {
              approved: totalApprovedMonthArray.reduce(
                (prev, curr) => prev + curr,
                0,
              ),
              unavailed: totalUnavailedMonthArray.reduce(
                (prev, curr) => prev + curr,
                0,
              ),
              availed: totalAvailedMonthArray.reduce(
                (prev, curr) => prev + curr,
                0,
              ),
            };
            return (
              <TableRow
                className="*:whitespace-nowrap data-[bordered]:*:border-gray-400 data-[bordered]:*:border-l-2 even:bg-background odd:bg-[#ECF2FF] *:text-center"
                key={data.id}
              >
                <TableCell className="sticky left-0 z-10 bg-inherit">
                  {divisionName}
                </TableCell>
                <TableCell className="sticky left-[120px] z-10 bg-inherit">
                  {data.opexCategory.category}
                </TableCell>
                <TableCell className="sticky left-[240px] z-10 bg-inherit">
                  {data.chartOfAccounts.name}
                </TableCell>
                <TableCell className="sticky left-[360px] z-10 bg-inherit">
                  2
                </TableCell>
                <TableCell data-bordered />
                <TableCell data-bordered>{data.opexCategory.type}</TableCell>
                <TableCell data-bordered>{totals.approved}</TableCell>
                <TableCell data-bordered>{totals.availed}</TableCell>
                <TableCell data-bordered>
                  {formatNumber((totals.availed / totals.approved) * 100)} %
                </TableCell>
                <TableCell data-bordered>{totals.unavailed} </TableCell>
                <TableCell data-bordered>
                  {formatNumber((totals.unavailed / totals.approved) * 100)} %
                </TableCell>
                <TableCell data-bordered>fls</TableCell>
                <TableCell data-bordered>fls</TableCell>
                <TableCell data-bordered>dmt</TableCell>
                <TableCell data-bordered>dmt</TableCell>
                {months.map((month, index) => {
                  const availed = totalAvailedMonthArray[index];
                  const unavailed = data[month];
                  const approved = 0;
                  const flsSavings = {
                    percentage: ((unavailed - availed) / unavailed) * 100,
                    amount: unavailed - availed,
                  };
                  const approverSavings = {
                    percentage: 0,
                    amount: 0,
                  };
                  return (
                    <React.Fragment key={month}>
                      <TableCell data-bordered>
                        {pesofy(totalApprovedMonthArray[index])}
                      </TableCell>
                      <TableCell data-bordered>
                        {pesofy(totalAvailedMonthArray[index])}
                      </TableCell>
                      <TableCell data-bordered>{pesofy(unavailed)}</TableCell>
                      <TableCell data-bordered>
                        {pesofy(flsSavings.amount)} (
                        {formatNumber(flsSavings.percentage)} %)
                      </TableCell>
                      <TableCell data-bordered>
                        {pesofy(approverSavings.amount)} (
                        {formatNumber(approverSavings.percentage)} %)
                      </TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
