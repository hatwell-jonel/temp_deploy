import { TitleCard } from "@/components/cards/title";
import { Priority, Status } from "@/components/colored";
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
import { getUser } from "@/lib/auth";
import { getRole1 } from "@/lib/helpers";
import { formatDate } from "@/lib/utils";
import { snpRequestSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import type { z } from "zod";
import Tabs from "../tabs";
import { getTableData } from "./helpers";

const title = "Service & Purchase Request";
const searchPlaceholder = "SR No.";
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
  const parsed = snpRequestSearchParams.parse(searchParams);
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard title={title} />
        <Tabs />
        <Suspense>
          <Search
            placeholder={searchPlaceholder}
            inputVariable={inputVariable}
          />
        </Suspense>
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <Suspense fallback={<Loading />}>
            <TableData searchParams={parsed} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function TableData({
  searchParams,
}: {
  searchParams: z.infer<typeof snpRequestSearchParams>;
}) {
  const { id } = await getUser();
  const { role } = await getRole1({ id, subModuleId: 3 });
  const { data, meta } = await getTableData({ searchParams });

  const tabs = [
    {
      name: "All",
      value: data.length,
      filterValue: null,
    },
    {
      name: "Critically Important",
      value: data.filter((d) => d.priorityLevelId === 1).length,
      filterValue: "1",
    },
    {
      name: "Very Important",
      value: data.filter((d) => d.priorityLevelId === 2).length,
      filterValue: "2",
    },
    {
      name: "Important",
      value: data.filter((d) => d.priorityLevelId === 3).length,
      filterValue: "3",
    },
    {
      name: "Less Important",
      value: data.filter((d) => d.priorityLevelId === 4).length,
      filterValue: "4",
    },
  ];

  const datas = searchParams.status
    ? data.filter((d) => d.priorityLevelId === searchParams.status)
    : data;

  return (
    <>
      <FilterTabs1
        searchParamsName="status"
        tabs={tabs}
        className="capitalize"
      />
      <div className="rounded-md bg-background pb-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="[&_th]:h-8">
              <TableHead className="text-center">SR No.</TableHead>
              <TableHead className="text-center">Priority Level</TableHead>
              <TableHead className="text-center">Expected Start Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Requester Division</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((data) => (
              <TableRow
                className="text-xs [&_th]:h-8 odd:bg-gray-100"
                key={data.id}
              >
                <TableCell className="whitespace-nowrap p-1.5 text-center">
                  {role !== "requester" ? (
                    <Link
                      className="text-primary underline underline-offset-4"
                      href={`/fims/purchasing/snp-request/view/${data.requestNo}`}
                    >
                      {data.requestNo}
                    </Link>
                  ) : (
                    data.requestNo
                  )}
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  <Priority priority={data.priorityLevel.id} />
                </TableCell>
                <TableCell className="text-center">
                  {formatDate(data.expectedStartDate)}
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  <Status status={data.finalStatus || 0} />
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  {data.creator.division.name}
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/fims/purchasing/snp-request/view/${data.requestNo}?showButtons=false`}
                      className="text-xs"
                      title="View"
                    >
                      <Icons.view />
                    </Link>
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
