import { getTableData as getTableDataUncached } from "@/app/(modules)/fims/accounting/rfp/helpers";
import { Search } from "@/app/(modules)/fims/accounting/rfp/server";
import { Priority, Status } from "@/components/colored";
import { Icons } from "@/components/icons";
import { Pagination } from "@/components/pagination";

import { ImportanceCard } from "@/components/cards/importance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUser as uncachedGetUser } from "@/lib/auth";
import { constructFullName, getRole1 } from "@/lib/helpers";
import { formatDate, pesofy } from "@/lib/utils";
import { rfpSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { Suspense } from "react";
import { cache } from "react";
import type { z } from "zod";

const getUser = cache(uncachedGetUser);
const getTableData = cache(getTableDataUncached);
const getRole = cache(getRole1);

type PageProps = {
  searchParams: unknown;
};

export default function Page({ searchParams }: PageProps) {
  const parsedSP = rfpSearchParams.parse(searchParams);
  return (
    <section className="space-y-6">
      <Suspense>
        <ImportanceCards searchParams={parsedSP} />
      </Suspense>
      <Search searchParams={searchParams} />
      <div className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
        <Suspense>
          <RFPTable searchParams={parsedSP} />
        </Suspense>
      </div>
      <Suspense>
        <PaginationASYNC searchParams={parsedSP} />
      </Suspense>
    </section>
  );
}

async function ImportanceCards({
  searchParams,
}: {
  searchParams: z.output<typeof rfpSearchParams>;
}) {
  const { id } = await getUser();
  const { role } = await getRole({
    id,
    subModuleId: 5,
  });
  const { data, meta } = await getTableData({ searchParams, role });
  const { status } = searchParams;
  const counts = {
    all: data.length,
    ci: data.filter((d) => d.priorityLevelId === 1).length,
    vi: data.filter((d) => d.priorityLevelId === 2).length,
    i: data.filter((d) => d.priorityLevelId === 3).length,
    li: data.filter((d) => d.priorityLevelId === 4).length,
  };
  return (
    <div className="grid grid-cols-3 gap-2 xl:mr-60 xl:grid-cols-5">
      <ImportanceCard type="all" isActive={status === 0}>
        {counts.all}
      </ImportanceCard>
      <ImportanceCard type="ci" isActive={status === 1}>
        {counts.ci}
      </ImportanceCard>
      <ImportanceCard type="vi" isActive={status === 2}>
        {counts.vi}
      </ImportanceCard>
      <ImportanceCard type="i" isActive={status === 3}>
        {counts.i}
      </ImportanceCard>
      <ImportanceCard type="li" isActive={status === 4}>
        {counts.li}
      </ImportanceCard>
    </div>
  );
}

async function PaginationASYNC({
  searchParams,
}: {
  searchParams: z.output<typeof rfpSearchParams>;
}) {
  const { meta } = await getTableData({ searchParams });
  return <Pagination meta={meta} />;
}

async function RFPTable({
  searchParams,
}: {
  searchParams: z.output<typeof rfpSearchParams>;
}) {
  const { id } = await getUser();
  const { role } = await getRole({
    id,
    subModuleId: 5,
  });

  const tableData = await getTableData({ searchParams, role });

  const underlineAction = role === "requester" ? "create" : "view";

  const data = searchParams.status
    ? tableData.data.filter((d) => d.priorityLevelId === searchParams.status)
    : tableData.data;

  return (
    <>
      <div className="rounded-md bg-background pb-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader className="*:*:h-8 *:*:whitespace-nowrap [&_tr]:border-b-0 *:*:text-center *:*:text-foreground">
            <TableRow>
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead
                colSpan={3}
                className="border-gray-400 border-x border-b"
              >
                APPROVER 1
              </TableHead>
              <TableHead
                colSpan={3}
                className="border-gray-400 border-x border-b"
              >
                APPROVER 2
              </TableHead>
              <TableHead
                colSpan={3}
                className="border-gray-400 border-x border-b"
              >
                APPROVER 2
              </TableHead>
              <TableHead />
              <TableHead />
              <TableHead />
            </TableRow>
            <TableRow className="*:*:whitespace-nowrap data-[bordered]:*:border-gray-400 data-[bordered]:*:border-x">
              <TableHead>Priority Level</TableHead>
              <TableHead>RFP Reference No.</TableHead>
              <TableHead>Payee</TableHead>
              <TableHead>Subpayee</TableHead>
              <TableHead>Request Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Requestor</TableHead>
              <TableHead>Date Needed</TableHead>
              <TableHead data-bordered data-approver="1">
                Status
              </TableHead>
              <TableHead data-bordered data-approver="1">
                Date Approved
              </TableHead>
              <TableHead data-bordered data-approver="1">
                Remarks
              </TableHead>
              <TableHead data-bordered data-approver="2">
                Status
              </TableHead>
              <TableHead data-bordered data-approver="2">
                Date Approved
              </TableHead>
              <TableHead data-bordered data-approver="2">
                Remarks
              </TableHead>
              <TableHead data-bordered data-approver="3">
                Status
              </TableHead>
              <TableHead data-bordered data-approver="3">
                Date Approved
              </TableHead>
              <TableHead data-bordered data-approver="3">
                Remarks
              </TableHead>
              <TableHead>RFP Status</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow
                key={d.id}
                className="*:whitespace-nowrap data-[bordered]:*:border-gray-400 data-[bordered]:*:border-x odd:bg-gray-100 *:py-1.5 *:text-center"
              >
                <TableCell>
                  <Priority priority={d.priorityLevelId} />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/fims/accounting/rfp/${underlineAction}/${d.rfpNo}`}
                    className="text-primary underline underline-offset-4"
                  >
                    {d.rfpNo}
                  </Link>
                </TableCell>
                <TableCell>{d.payee.name}</TableCell>
                <TableCell>{d.subPayee?.name || "-"}</TableCell>
                <TableCell>{d.requestType}</TableCell>
                <TableCell>{pesofy(d.amount)}</TableCell>
                <TableCell>{formatDate(d.dateRequested)}</TableCell>
                <TableCell>
                  {constructFullName({
                    userDetails: d.requestor.details,
                    withComma: true,
                    fallbackName: d.requestor.name,
                  })}
                </TableCell>
                <TableCell>{formatDate(d.dateNeeded)}</TableCell>
                <TableCell data-bordered>
                  {<Status status={d.approver1Status || 0} />}
                </TableCell>
                <TableCell data-bordered>
                  {formatDate(d.approver1StatusDate)}
                </TableCell>
                <TableCell data-bordered>{d.approver1remarks || "-"}</TableCell>
                <TableCell data-bordered>
                  {<Status status={d.approver2Status || 0} />}
                </TableCell>
                <TableCell data-bordered>
                  {formatDate(d.approver2StatusDate)}
                </TableCell>
                <TableCell data-bordered>{d.approver2remarks || "-"}</TableCell>
                <TableCell data-bordered>
                  {<Status status={d.approver3Status || 0} />}
                </TableCell>
                <TableCell data-bordered>
                  {formatDate(d.approver3StatusDate)}
                </TableCell>
                <TableCell data-bordered>{d.approver3remarks || "-"}</TableCell>
                <TableCell>
                  <Status status={d.status} />
                </TableCell>
                <TableCell>
                  {d.releaseDate ? formatDate(d.releaseDate) : null}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      title="View"
                      href={`/fims/accounting/rfp/view/${d.rfpNo}?showButtons=false`}
                    >
                      <Icons.view className="size-4" />
                    </Link>
                    {role === "requester" && (
                      <Link
                        title="Print"
                        href={`/fims/accounting/rfp/view/${d.rfpNo}?print=true&showButtons=false`}
                      >
                        <Icons.print
                          className="size-4 text-primary"
                          strokeWidth={3}
                        />
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
