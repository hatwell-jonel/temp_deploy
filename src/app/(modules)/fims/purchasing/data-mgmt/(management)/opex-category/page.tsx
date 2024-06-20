import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { FilterTabs1 } from "@/components/filter-tabs";
import { Icons } from "@/components/icons";
import { Pagination } from "@/components/pagination";
import Search from "@/components/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { budgetSourceSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import type { z } from "zod";
import { CreateForm, EditForm, ToggleSwitch } from "./client";
import { fetchTabs, getTableData } from "./helpers";

const title = "OpEx Category";
const searchPlaceholder = "OpEx Category";
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
  const parsed = budgetSourceSearchParams.parse(searchParams);
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
          <CreateForm title={title} />
        </TitleCard>
        <Suspense>
          <Search
            placeholder={searchPlaceholder}
            inputVariable={inputVariable}
          />
        </Suspense>
        <section>
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
  searchParams: z.infer<typeof budgetSourceSearchParams>;
}) {
  const { data, meta } = await getTableData({ searchParams });
  return (
    <>
      <div className="rounded-md bg-background py-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">No.</TableHead>
              <TableHead className="text-center">OpEx Category</TableHead>
              <TableHead className="text-center">OpEx Type</TableHead>
              <TableHead className="flex items-center justify-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, index) => (
              <TableRow key={d.id} className="odd:bg-[#F9FAFB]">
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="text-center">{d.category}</TableCell>
                <TableCell className="text-center">{d.type}</TableCell>
                <TableCell className="flex justify-center gap-2">
                  <EditForm defaultValues={d} />
                  <ToggleSwitch defaultValue={d.status === 1} id={d.id} />
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