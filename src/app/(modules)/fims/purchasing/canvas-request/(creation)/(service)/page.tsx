import { CopyToClipboard } from "@/components/buttons/copy-to-clipboard";
import { TitleCard } from "@/components/cards/title";
import { Priority } from "@/components/colored";
import { Loading } from "@/components/fallbacks";
import { FilterTabs1 } from "@/components/filter-tabs";
import { Icons } from "@/components/icons";
import { Pagination } from "@/components/pagination";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { canvasRequestSearchParams } from "@/validations/searchParams";
import { Copy, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { z } from "zod";
import CanvasRequestTabs from "../../tabs";
import { getTableData } from "./helpers";

const title = "Canvas Request";
const searchPlaceholder = "SRn No.";
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
        <CanvasRequestTabs userRole="requester" />
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
              <TableHead className="text-center">SRn No.</TableHead>
              <TableHead className="text-center">Priority Level</TableHead>
              <TableHead className="text-center">Expected Start Date</TableHead>
              <TableHead className="text-center">Requester Division</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datas.map((data) => (
              <TableRow
                className="text-xs [&_th]:h-8 odd:bg-gray-100"
                key={data.id}
              >
                <TableCell className="p-1.5 text-center">
                  <Link
                    className="text-nowrap text-primary underline underline-offset-4"
                    href={`/fims/purchasing/canvas-request/create/${data.requisitionNo}`}
                  >
                    {data.requisitionNo}
                  </Link>
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  <Priority priority={data.priorityLevel.id} />
                </TableCell>
                <TableCell className="text-center">
                  {formatDate(data.expectedStartDate)}
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  {data.creator.division.name}
                </TableCell>
                <TableCell className="p-1.5 text-center">
                  <div className="flex items-center justify-center">
                    <Link
                      href={`/fims/purchasing/canvas-request/view/${data.requisitionNo}?print=true&budgetDetails=false`}
                      className="text-xs"
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

type RowActionProps = {
  referenceNo: string;
};

function RowAction({ referenceNo }: RowActionProps) {
  const buttonName = "View";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link
            href={`/fims/purchasing/canvas-request/view/${referenceNo}?print=true&budgetDetails=false`}
            className="text-xs"
          >
            {buttonName}
            <DropdownMenuShortcut>
              <Icons.view />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/fims/purchasing/canvas-request/create/${referenceNo}`}
            className="text-xs"
          >
            Create Canvas
            <DropdownMenuShortcut>
              <Icons.add className="size-4 text-primary" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" asChild>
          <CopyToClipboard textToCopy={referenceNo} className="w-full">
            Copy SRn No.
            <DropdownMenuShortcut>
              <Copy className="size-4 text-primary" strokeWidth={3} />
            </DropdownMenuShortcut>
          </CopyToClipboard>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
