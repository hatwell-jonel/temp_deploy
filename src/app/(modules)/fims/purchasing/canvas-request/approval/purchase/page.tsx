import CanvasRequestTabs from "@/app/(modules)/fims/purchasing/canvas-request/tabs";
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
import { getRole1 as getRole } from "@/lib/helpers";
import { formatDate } from "@/lib/utils";
import { canvasRequestSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import type { z } from "zod";
import { getTableData } from "./helpers";

const title = "Canvas Request";
const searchPlaceholder = "CRPRn No.";
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
  const parsed = canvasRequestSearchParams.parse(searchParams);
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard title={title} />
        <Suspense>
          <Tabs />
        </Suspense>
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

async function Tabs() {
  const user = await getUser();
  const { role } = await getRole({
    id: user.id,
    subModuleId: 2,
  });
  return <CanvasRequestTabs userRole={role} />;
}

async function TableData({
  searchParams,
}: {
  searchParams: z.infer<typeof canvasRequestSearchParams>;
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
            <TableRow className="[&_th]:h-8">
              <TableHead className="text-center">CRPRn No.</TableHead>
              <TableHead className="text-center">Priority Level</TableHead>
              <TableHead className="text-center">Expected Start Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">
                Requester&apos;s Division
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datas.map((data) => (
              <TableRow
                className="text-xs [&_th]:h-8 odd:bg-gray-100"
                key={data.id}
              >
                <TableCell className="whitespace-nowrapp-1.5 text-center">
                  <Link
                    href={`/fims/purchasing/canvas-request/approval/purchase/view/${data.canvasRequestNo}`}
                    className="text-primary underline underline-offset-4"
                  >
                    {data.canvasRequestNo}
                  </Link>
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  <Priority priority={data.priorityLevel.id} />
                </TableCell>
                <TableCell className="text-center">
                  {formatDate(data.expectedStartDate)}
                </TableCell>
                <TableCell className="text-center">
                  {<Status status={data.finalStatus || 0} />}
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  {data.creator.division.name}
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  <div className="flex items-center justify-center">
                    <Link
                      href={`/fims/purchasing/canvas-request/approval/purchase/view/${data.canvasRequestNo}?showButtons=false`}
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
