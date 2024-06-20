import { TitleCard } from "@/components/cards/title";
import { Priority, Status } from "@/components/colored";
import { Loading } from "@/components/fallbacks";
import { FilterTabs1 } from "@/components/filter-tabs";
import { Icons } from "@/components/icons";
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
import { getUser } from "@/lib/auth";
import { getRole1 as getRole } from "@/lib/helpers";
import { cn, formatDate } from "@/lib/utils";
import RequisitionTabs from "@/snp-requisition/tabs";
import { serviceRequisitionSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import type { z } from "zod";
import { getTableData } from "./helpers";

const title = "Service & Purchase Requisition";
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
  const parsed = serviceRequisitionSearchParams.parse(searchParams);
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard title={title}>
          <Link
            href={"/fims/purchasing/snp-requisition/create"}
            className={cn(
              buttonVariants({ size: "long" }),
              "w-full text-xs lg:mr-6 lg:w-fit lg:px-4",
            )}
          >
            <Icons.add className="mr-1 size-4" /> Create Service Requisition
          </Link>
        </TitleCard>
        <RequisitionTabs />
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
  searchParams: z.infer<typeof serviceRequisitionSearchParams>;
}) {
  const { id } = await getUser();
  const { role, order } = await getRole({
    id,
    subModuleId: 1,
  });

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
              <TableHead colSpan={3} className="border-gray-600 border-r" />
              <TableHead
                colSpan={6}
                className="border-gray-600 border-r bg-[#E2E2E2]"
              >
                <div className="flex items-center justify-center">STATUS</div>
              </TableHead>
              {role !== "requester" && (
                <TableHead className="border-gray-600 border-r" />
              )}
              <TableHead />
            </TableRow>
            <TableRow className="[&_th]:h-8 *:whitespace-nowrap *:text-center *:text-foreground">
              <TableHead>SRn No.</TableHead>
              <TableHead>Priority Level</TableHead>
              <TableHead className="border-gray-600 border-r">
                Expected Start Date
              </TableHead>
              <TableHead>Requisition</TableHead>
              <TableHead>Canvassing</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>RFP</TableHead>
              <TableHead className="border-gray-600 border-r">
                Check Voucher
              </TableHead>
              {role !== "requester" && (
                <TableHead className="border-gray-600 border-r">
                  Requester&apos;s Name
                </TableHead>
              )}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datas.map((data) => {
              return (
                <TableRow
                  className="text-xs [&_th]:h-8 odd:bg-gray-100"
                  key={data.id}
                >
                  <TableCell className="whitespace-nowrap p-1.5 text-center">
                    {role !== "requester" ? (
                      <Link
                        className="text-primary underline underline-offset-4"
                        href={`/fims/purchasing/snp-requisition/view/${data.requisitionNo}`}
                      >
                        {data.requisitionNo}
                      </Link>
                    ) : (
                      data.requisitionNo
                    )}
                  </TableCell>
                  <TableCell className="p-1.5 text-center">
                    <Priority priority={data.priorityLevel.id} />
                  </TableCell>
                  <TableCell className="border-gray-600 border-r text-center">
                    {formatDate(data.expectedStartDate)}
                  </TableCell>
                  <TableCell className="p-1.5 text-center">
                    <Status status={data.purchasing.requisitionFinalStatus} />
                  </TableCell>
                  <TableCell className="p-1.5 text-center">
                    <Status status={data.purchasing.canvassingFinalStatus} />
                  </TableCell>
                  <TableCell className="p-1.5 text-center">
                    <Status status={data.purchasing.requestFinalStatus} />
                  </TableCell>
                  <TableCell className="p-1.5 text-center">
                    <Status status={data.purchasing.orderFinalStatus} />
                  </TableCell>
                  <TableCell className="p-1.5 text-center">
                    <Status status={data.purchasing.rfpFinalStatus} />
                  </TableCell>
                  <TableCell className="border-gray-600 border-r text-center">
                    <Status status={data.purchasing.checkVoucherFinalStatus} />
                  </TableCell>
                  {role !== "requester" && (
                    <TableCell className="whitespace-nowrap border-gray-600 border-r text-center">
                      {data.creator.name}
                    </TableCell>
                  )}
                  <TableCell className="p-1.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/fims/purchasing/snp-requisition/view/${data.requisitionNo}?showButtons=false`}
                        className="text-xs"
                        title="View"
                      >
                        <Icons.view />
                      </Link>
                      {data.purchasing.requisitionFinalStatus === 0 &&
                        role === "requester" && (
                          <Link
                            href={`/fims/purchasing/snp-requisition/edit/${data.requisitionNo}`}
                            className="text-xs"
                            title="Edit"
                          >
                            <Icons.edit />
                          </Link>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Pagination meta={meta} />
    </>
  );
}
