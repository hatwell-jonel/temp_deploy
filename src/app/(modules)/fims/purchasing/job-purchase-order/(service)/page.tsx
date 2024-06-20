import { TitleCard } from "@/components/cards/title";
import { Priority } from "@/components/colored";
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
import { formatDate } from "@/lib/utils";
import { snpRequestSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import type { z } from "zod";
import Tabs from "../tabs";
import { getTableData } from "./helpers";

const title = "Job & Purchase Order";
const searchPlaceholder = "JO No.";
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
  const { data, meta } = await getTableData({ searchParams });
  const tabs = [
    {
      name: "All",
      value: data.length,
      filterValue: null,
    },
    {
      name: "Critically Important",
      value: data.filter((d) => d.priorityLevel.id === 1).length,
      filterValue: "1",
    },
    {
      name: "Very Important",
      value: data.filter((d) => d.priorityLevel.id === 2).length,
      filterValue: "2",
    },
    {
      name: "Important",
      value: data.filter((d) => d.priorityLevel.id === 3).length,
      filterValue: "3",
    },
    {
      name: "Less Important",
      value: data.filter((d) => d.priorityLevel.id === 4).length,
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
        className="uppercase"
      />
      <div className="rounded-md bg-background pb-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="[&_th]:h-8 *:text-center">
              <TableHead>JO No.</TableHead>
              <TableHead>Priority Level</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Requester Division</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datas.map((data) => (
              <TableRow
                className="text-xs [&_th]:h-8 odd:bg-gray-100 *:p-1.5 *:text-center"
                key={data.id}
              >
                <TableCell>
                  <Link
                    href={`/fims/purchasing/job-purchase-order/view/${data.orderNo}`}
                    className="text-primary underline underline-offset-4"
                  >
                    {data.orderNo}
                  </Link>
                </TableCell>
                <TableCell>
                  <Priority priority={data.priorityLevel.id} />
                </TableCell>
                <TableCell>{formatDate(data.expectedStartDate)}</TableCell>
                <TableCell>{formatDate(data.expectedEndDate)}</TableCell>
                <TableCell>{data.creator.division.name}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      title="View"
                      href={`/fims/purchasing/job-purchase-order/view/${data.orderNo}?showButtons=false`}
                    >
                      <Icons.view className="size-4" />
                    </Link>
                    <Link
                      title="Print"
                      href={`/fims/purchasing/job-purchase-order/view/${data.orderNo}?print=true&showButtons=false`}
                    >
                      <Icons.print
                        className="size-4 text-primary"
                        strokeWidth={3}
                      />
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
