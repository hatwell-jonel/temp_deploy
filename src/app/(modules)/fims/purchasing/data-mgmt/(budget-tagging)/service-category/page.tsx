import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { FilterTabs1 } from "@/components/filter-tabs";
import { FaChecked, Icons } from "@/components/icons";
import { Pagination } from "@/components/pagination";
import Search from "@/components/search";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { serviceCategorySearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import type { z } from "zod";
import { ToggleSwitch } from "./client";
import { fetchTabs, getTableData } from "./helpers";

const title = "Service Category";
const searchPlaceholder = "Service Category";
const inputVariable = "name";

export const metadata = {
  title,
};

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  const parsed = serviceCategorySearchParams.parse(searchParams);
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/purchasing/data-mgmt"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              {title}
            </>
          }
        >
          <Link
            href={"/fims/purchasing/data-mgmt/service-category/create"}
            className={cn(
              buttonVariants({ size: "long" }),
              "w-full text-sm lg:mr-6 lg:w-fit lg:px-4",
            )}
          >
            Register {title}
          </Link>
        </TitleCard>
        <Suspense>
          <Search
            placeholder={searchPlaceholder}
            inputVariable={inputVariable}
          />
        </Suspense>
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <Suspense>
            <FilterTab />
          </Suspense>
          <Suspense fallback={<Loading />}>
            <TableData searchParams={parsed} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function FilterTab() {
  const tabs = await fetchTabs();
  return (
    <FilterTabs1
      searchParamsName="status"
      tabs={tabs}
      className="capitalize lg:w-24"
    />
  );
}

async function TableData({
  searchParams,
}: {
  searchParams: z.infer<typeof serviceCategorySearchParams>;
}) {
  const { data, meta } = await getTableData({ searchParams });
  const currentPage = searchParams.page || 1;
  const startingNumber = (currentPage - 1) * 10 + 1;
  return (
    <>
      <div className="rounded-md bg-background py-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">No.</TableHead>
              <TableHead className="text-center">Item Category</TableHead>
              <TableHead className="text-center">Recurring</TableHead>
              <TableHead className="text-center">Budget Source</TableHead>
              <TableHead className="text-center">OpEx Category</TableHead>
              <TableHead className="text-center">OpEx Type</TableHead>
              <TableHead className="text-center">Chart of Accounts</TableHead>
              <TableHead className="text-center">Sub-Account</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, index) => (
              <TableRow key={d.id} className="odd:bg-[#F9FAFB]">
                <TableCell className="text-center font-medium">
                  {index + startingNumber}
                </TableCell>
                <TableCell className="text-center">{d.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <FaChecked active={d.isRecurring} />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {d.budgetSource.name}
                </TableCell>
                <TableCell className="text-center">
                  {d.opexCategory.category}
                </TableCell>
                <TableCell className="text-center">
                  {d.opexCategory.type}
                </TableCell>
                <TableCell className="text-center">
                  {d.chartOfAccounts.name}
                </TableCell>
                <TableCell className="text-center">
                  {d.subAccounts.name}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/fims/purchasing/data-mgmt/service-category/update/${d.id}`}
                    >
                      <Icons.edit />
                    </Link>
                    <ToggleSwitch defaultValue={d.status === 1} id={d.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination meta={meta} />
    </>
  );
}
