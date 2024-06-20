import { TitleCard } from "@/components/cards/title";
import { Icons } from "@/components/icons";
import { Pagination } from "@/components/pagination";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, pesofy } from "@/lib/utils";
import Link from "next/link";
import { Suspense, cache } from "react";
import { ToggleSwitch } from "./client";
import { getTableData } from "./helpers";

const title = "LOA Management";

export const metadata = {
  title,
};

const baseHref = "/fims/accounting/loa-mgmt";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard title={title}>
          <Link
            href={`${baseHref}/create`}
            className={cn(
              buttonVariants({ size: "long" }),
              "w-full text-xs lg:mr-6 lg:w-fit lg:px-4",
            )}
          >
            <Icons.add className="mr-1 size-4" /> Create LOA
          </Link>
        </TitleCard>
        <div className="rounded-md bg-background shadow-md">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="*:h-8">
                <TableHead className="border-gray-300 border-r-2" />
                <TableHead className="border-gray-300 border-r-2" />
                <TableHead className="border-gray-300 border-r-2" />
                <TableHead
                  colSpan={2}
                  className="border-gray-300 border-r-2 bg-[#E2E2E2] text-center text-foreground uppercase tracking-wider"
                >
                  Budget Range
                </TableHead>
                <TableHead colSpan={5} className="border-gray-300 border-r-2" />
                <TableHead />
              </TableRow>
              <TableRow>
                <TableHead className="border-gray-300 border-r-2 text-center text-foreground">
                  Module
                </TableHead>
                <TableHead className="border-gray-300 border-r-2 text-center text-foreground">
                  Department
                </TableHead>
                <TableHead className="border-gray-300 border-r-2 text-center text-foreground">
                  Level
                </TableHead>
                <TableHead className="text-center text-foreground">
                  Minimum
                </TableHead>
                <TableHead className="border-gray-300 border-r-2 text-center text-foreground">
                  Maximum
                </TableHead>
                <TableHead className="text-center text-foreground">
                  Reviewer 1
                </TableHead>
                <TableHead className="text-center text-foreground">
                  Reviewer 2
                </TableHead>
                <TableHead className="text-center text-foreground">
                  Approver 1
                </TableHead>
                <TableHead className="text-center text-foreground">
                  Approver 2
                </TableHead>
                <TableHead className="border-gray-300 border-r-2 text-center text-foreground">
                  Approver 3
                </TableHead>
                <TableHead className="text-center text-foreground">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <Suspense key={JSON.stringify(searchParams)}>
              <TableContent searchParams={searchParams} />
            </Suspense>
          </Table>
        </div>
        <Suspense>
          <SuspendablePagination searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function SuspendablePagination({ searchParams }: PageProps) {
  const { meta } = await cachedTableData({ searchParams });
  return <Pagination meta={meta} />;
}

const cachedTableData = cache(async ({ searchParams }: PageProps) => {
  return await getTableData({ searchParams });
});

async function TableContent({ searchParams }: PageProps) {
  const { data } = await cachedTableData({ searchParams });
  return (
    <>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} className="odd:bg-gray-100">
            {item.level === 1 && (
              <>
                <TableCell
                  className="border-gray-300 border-r-2 border-b-2 bg-gray-100 text-center"
                  rowSpan={3}
                >
                  {item.subModule.name}
                </TableCell>
                <TableCell
                  className="border-gray-300 border-r-2 border-b-2 bg-gray-100 text-center"
                  rowSpan={3}
                >
                  <div className="flex items-center justify-center">
                    {item.division.name}
                  </div>
                </TableCell>
              </>
            )}
            <TableCell
              className={cn(
                "border-gray-300 border-r-2 text-center",
                item.level === 3 && "border-b-2",
              )}
            >
              {item.level}
            </TableCell>
            <TableCell
              className={cn(
                "whitespace-nowrap text-right",
                item.level === 3 && "border-gray-300 border-b-2",
              )}
            >
              {pesofy(item.minAmount)}
            </TableCell>
            <TableCell
              className={cn(
                "whitespace-nowrap border-gray-300 border-r-2 text-right",
                item.level === 3 && "border-b-2",
              )}
            >
              {pesofy(item.maxAmount)}
            </TableCell>
            <TableCell
              className={cn(
                "text-center",
                item.level === 3 && "border-gray-300 border-b-2",
              )}
            >
              {item.firstReviewer?.name || "-"}
            </TableCell>
            <TableCell
              className={cn(
                "text-center",
                item.level === 3 && "border-gray-300 border-b-2",
              )}
            >
              {item.secondReviewer?.name || "-"}
            </TableCell>
            <TableCell
              className={cn(
                "text-center",
                item.level === 3 && "border-gray-300 border-b-2",
              )}
            >
              {item.firstApprover.name}
            </TableCell>
            <TableCell
              className={cn(
                "text-center",
                item.level === 3 && "border-gray-300 border-b-2",
              )}
            >
              {item.secondApprover?.name || "-"}
            </TableCell>
            <TableCell
              className={cn(
                "border-gray-300 border-r-2 text-center",
                item.level === 3 && "border-b-2",
              )}
            >
              {item.thirdApprover?.name || "-"}
            </TableCell>
            {item.level === 1 ? (
              <TableCell
                className="border-gray-300 border-b-2 bg-gray-100"
                rowSpan={3}
              >
                <div className="flex items-center justify-center gap-2">
                  <Link
                    href={`/fims/accounting/loa-mgmt/update?divisionId=${item.divisionId}&subModuleId=${item.subModuleId}`}
                  >
                    <Icons.edit />
                  </Link>
                  <ToggleSwitch
                    defaultValue={item.status === 1}
                    subModuleId={item.subModuleId}
                    divisionId={item.divisionId}
                  />
                </div>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}
