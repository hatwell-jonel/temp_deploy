import { SubmitButton } from "@/components/buttons/submit";
import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { Icons } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import Link from "next/link";
import { Suspense } from "react";
import { SelectOpex } from "../client";
import { getDropdowns } from "../helpers";
import { Form, TableRowWrapper } from "./client";

const title = "Register Item Category";

export const metadata = {
  title,
};

export default function Page() {
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/purchasing/data-mgmt/item-category"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              {title}
            </>
          }
        />
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <Suspense fallback={<Loading />}>
            <FormTable />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function FormTable() {
  const { budgetSource, chartOfAccounts, opexCategory, subAccounts } =
    await getDropdowns();
  return (
    <Form className="space-y-4">
      <div className="w-full overflow-x-auto rounded-md bg-background py-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px] text-center">
                Item Category
              </TableHead>
              <TableHead className="text-center">Recurring</TableHead>
              <TableHead className="text-center">Budget Source</TableHead>
              <TableHead className="text-center">OpEx Category</TableHead>
              <TableHead className="text-center">OpEx Type</TableHead>
              <TableHead className="text-center">Chart of Accounts</TableHead>
              <TableHead className="text-center">Sub-Account</TableHead>
              <TableHead className="text-center" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRowWrapper>
              <TableCell className="text-center">
                <Input
                  name="name"
                  className="text-xs"
                  placeholder="Office Supplies"
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  className="size-5 rounded-none border-gray-400"
                  name="isRecurring"
                />
              </TableCell>
              <TableCell className="text-center">
                <Select name="budgetSource">
                  <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="Budget Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetSource.map((item) => (
                      <SelectItem value={String(item.id)} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <SelectOpex categories={opexCategory} />
              <TableCell className="text-center">
                <Select name="chartOfAccounts">
                  <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="Chart Of Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    {chartOfAccounts.map((item) => (
                      <SelectItem value={String(item.id)} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-center">
                <Select name="subAccounts">
                  <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="Sub-Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    {subAccounts.map((item) => (
                      <SelectItem value={String(item.id)} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRowWrapper>
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <SubmitButton>Submit</SubmitButton>
      </div>
    </Form>
  );
}