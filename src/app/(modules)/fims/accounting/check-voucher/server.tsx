import { MultipleInputOR } from "@/app/(modules)/fims/accounting/check-voucher/client";
import { cacheGetReasons } from "@/app/(modules)/fims/accounting/check-voucher/helpers";
import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import { Status } from "@/components/colored";
import { DatePickerWithPresets } from "@/components/date-picker";
import { FilterTabs1 } from "@/components/filter-tabs";
import { Icons } from "@/components/icons";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import * as D from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ViewTooltip } from "@/components/view-tooltip";
import { getUser as uncachedGetUser } from "@/lib/auth";
import { getRole1 as uncachedGetRole } from "@/lib/helpers";
import {
  numberToWords as amountToWords,
  formatDate,
  pesofy,
} from "@/lib/utils";
import type { checkVoucherSearchParams } from "@/validations/searchParams";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import type { z } from "zod";
import { SearchButton } from "../rfp/client";
import { Form, SearchForm } from "./client";
import { getTableData, getCVData as uncachedGetData } from "./helpers";

const getUser = cache(uncachedGetUser);
const getRole = cache(uncachedGetRole);
const getData = cache(uncachedGetData);

export async function TableData({
  searchParams,
}: {
  searchParams: z.infer<typeof checkVoucherSearchParams>;
}) {
  const { id } = await getUser();
  const { role } = await getRole({
    id,
    subModuleId: 6,
  });
  const { data, meta } = await getTableData({ searchParams });

  const tabs = [
    {
      name: "All",
      value: data.length,
      filterValue: null,
    },
    {
      name: "Pending",
      value: data.filter((d) => d.finalStatus === 0).length,
      filterValue: "0",
    },
    {
      name: "Approved",
      value: data.filter((d) => d.finalStatus === 1).length,
      filterValue: "1",
    },
    {
      name: "Declined",
      value: data.filter((d) => d.finalStatus === 2).length,
      filterValue: "2",
    },
  ];

  const datas = searchParams.status
    ? data.filter((d) => d.finalStatus === Number(searchParams.status))
    : data;

  return (
    <>
      <FilterTabs1
        searchParamsName="status"
        tabs={tabs}
        className="uppercase"
        shortenOnMobile={false}
      />
      <div className="rounded-md bg-background py-2 shadow-lg">
        <Table className="text-xs">
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="*:h-8 *:whitespace-nowrap *:text-center">
              {role !== "requester" && <TableHead>CV Ref. number</TableHead>}
              <TableHead>RFP Ref. number</TableHead>
              <TableHead>Payee</TableHead>
              <TableHead>Sub Payee</TableHead>
              <TableHead>Check number</TableHead>
              <TableHead>Check date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datas.map((d) => {
              const viewUrl =
                role === "requester"
                  ? `/fims/accounting/check-voucher/create/${d.rfpNo}`
                  : `/fims/accounting/check-voucher/view/${d.rfpNo}`;
              return (
                <TableRow
                  key={d.id}
                  className="*:h-8 *:whitespace-nowrap odd:bg-gray-100 *:text-center"
                >
                  {role !== "requester" && (
                    <TableCell>
                      <Link
                        className="select-all text-primary underline underline-offset-4"
                        href={viewUrl}
                      >
                        {d.cvNo}
                      </Link>
                    </TableCell>
                  )}
                  <TableCell>
                    {role !== "requester" ? (
                      <div className="select-all text-[#0D8E09] underline underline-offset-4">
                        {d.rfpNo}
                      </div>
                    ) : (
                      <Link
                        href={viewUrl}
                        className="select-all text-primary underline underline-offset-4"
                      >
                        {d.rfpNo}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>{d.rfp.payee.name}</TableCell>
                  <TableCell>{d.rfp.subPayee?.name || "-"}</TableCell>
                  <TableCell>{d.checkNumber || "-"}</TableCell>
                  <TableCell>{formatDate(d.createdAt)}</TableCell>
                  <TableCell>{pesofy(d.rfp.amount)}</TableCell>
                  <TableCell>
                    <Status status={d.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`${viewUrl}?showButtons=false`}>
                        <Icons.view />
                      </Link>
                      <Link href={`${viewUrl}?print=true`}>
                        <Icons.print
                          className="size-4 text-primary"
                          strokeWidth={3}
                        />
                      </Link>
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

export async function Search({
  searchParams,
}: {
  searchParams: z.infer<typeof checkVoucherSearchParams>;
}) {
  const { status, checkNumber, rfpReferenceNo, dateRelease } = searchParams;
  const { id } = await getUser();
  const { role } = await getRole({ id, subModuleId: 6 });
  return (
    <>
      <SearchForm>
        {role !== "requester" && (
          <div className="flex items-end space-y-2">
            <div className="flex gap-6">
              <Input
                className="w-[8rem] rounded-none border-gray-400 border-x-0 border-t-0 border-b bg-transparent px-0 text-xs hover:bg-transparent focus-visible:ring-transparent focus:ring-transparent"
                placeholder="CV Ref. number"
                name="checkNumber"
                key={checkNumber}
                defaultValue={checkNumber}
              />
            </div>
          </div>
        )}
        <div className="flex items-end space-y-2">
          <div className="flex gap-6">
            <Input
              className="w-[8rem] rounded-none border-gray-400 border-x-0 border-t-0 border-b bg-transparent px-0 text-xs hover:bg-transparent focus-visible:ring-transparent focus:ring-transparent"
              placeholder="RFP Ref. number"
              name="rfpReferenceNo"
              key={rfpReferenceNo}
              defaultValue={rfpReferenceNo}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-xs" htmlFor="dateRelease">
            Date Release
          </Label>
          <div className="flex gap-6">
            <DatePickerWithPresets
              hideCalendar
              placeholder="MM/DD/YYYY"
              dateFormat="M-d-y"
              defaultDate={dateRelease ? new Date(dateRelease) : undefined}
              name="dateRelease"
              className="w-[8rem] rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 hover:bg-transparent"
              disablePreviousDates={false}
            />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <SearchButton
            size={"sm"}
            type="submit"
            className="h-8 rounded-sm px-8 py-0.5 text-xs"
          >
            Search
          </SearchButton>
        </div>
      </SearchForm>
    </>
  );
}

interface DetailsListProps {
  rfp: string;
  type?: "view" | "create";
}

export async function DetailsList({ rfp, type = "view" }: DetailsListProps) {
  const data = await getData(rfp);
  if (type === "view" && data.isDraft) notFound();
  const orSiNumbers = data.orSiNumber;
  const branch = data.rfp.requestor.details.branch;
  const total = data.rfp.amount;
  const ewtPercentage = data.rfp.ewtPercentage ?? 0;
  const ewtAmount = ewtPercentage * total;
  const cashInBankAmount = total - ewtAmount;
  const vatAmount = data.rfp.vatable ? total * 0.12 : 0;
  const accountsPayableAmount = total - vatAmount;
  return (
    <>
      <input type="hidden" name="cvNo" value={data.cvNo} />
      <div className="grid grid-cols-2 items-start gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">Date:</div>
            <div>{formatDate(new Date())}</div>
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">CV Series No:</div>
            <div>{data.cvNo}</div>
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">Payee:</div>
            <div>{data.rfp.payee.name}</div>
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">TIN:</div>
            <div>{data.rfp.tin ?? "-"}</div>
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">Amount (PHP):</div>
            <div>{pesofy(data.rfp.amount)}</div>
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">
              Amount in Words:
            </div>
            <div className="capitalize">
              {amountToWords(data.rfp.amount)} Pesos
            </div>
          </div>
        </div>
        <div className="ml-16 flex flex-col justify-center gap-2">
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">RFP Ref. No.:</div>
            <div>{data.rfpNo}</div>
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">Bank:</div>
            <div>Metrobank</div>
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">Check no.:</div>
            {type === "view" ? (
              <div>{data.checkNumber}</div>
            ) : (
              <Input name="checkNumber" className="h-4 border-primary" />
            )}
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">Check Date:</div>
            {type === "view" ? (
              <div>{formatDate(data.releaseDate)}</div>
            ) : (
              <DatePickerWithPresets
                name="releaseDate"
                hideCalendar
                placeholder="MM/DD/YYYY"
                className="h-4 rounded-sm border-primary"
              />
            )}
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">OR / SI No.:</div>
            {type === "view" ? (
              <div className="flex flex-col">
                {orSiNumbers.map((or) => (
                  <div key={or.orNumber}>{or.orNumber}</div>
                ))}
              </div>
            ) : (
              <MultipleInputOR />
            )}
          </div>
          <div className="flex">
            <div className="min-w-32 text-muted-foreground">Branch:</div>
            <div>{branch ? `${branch.display} (${branch.code})` : "-"}</div>
          </div>
        </div>
        <div>
          <Table className="border-collapse border border-gray-400 text-xs">
            <TableHeader>
              <TableRow className="border border-gray-400 bg-[#F2F2F2]">
                <TableHead
                  colSpan={2}
                  className="h-8 text-center font-bold text-foreground"
                >
                  DETAILS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="*:*:border *:*:border-gray-400 *:*:p-2">
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Category
                </TableCell>
                <TableCell className="text-center">GAE 2</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  OpEx Type
                </TableCell>
                <TableCell className="text-center">1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Chart of Account
                </TableCell>
                <TableCell className="text-center">Utilities</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Sub Account
                </TableCell>
                <TableCell className="text-center">Electric</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <Table className="border-collapse border border-gray-400 text-xs">
            <TableHeader>
              <TableRow className="border border-gray-400 bg-[#F2F2F2]">
                <TableHead className="h-8 text-center font-bold text-foreground">
                  ENTRY
                </TableHead>
                <TableHead className="h-8 text-center font-bold text-foreground">
                  DEBIT
                </TableHead>
                <TableHead className="h-8 text-center font-bold text-foreground">
                  CREDIT
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="*:*:border *:*:border-gray-400 *:*:p-2">
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Accounts Payable (NET)
                </TableCell>
                <TableCell className="text-center">
                  {accountsPayableAmount.toFixed(2)}
                </TableCell>
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Input VAT
                </TableCell>
                <TableCell className="text-center">{vatAmount}</TableCell>
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">EWT</TableCell>
                <TableCell />
                <TableCell className="text-center">
                  {ewtAmount.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Cash in Bank
                </TableCell>
                <TableCell />
                <TableCell className="text-center">
                  {cashInBankAmount.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow className="*:font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-center">{data.rfp.amount}</TableCell>
                <TableCell className="text-center">{data.rfp.amount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="col-span-2 flex flex-col">
          <div className="font-bold">REMARKS</div>
          <div className="text-xs">{data.rfp.remarks || "-"}</div>
        </div>
      </div>
    </>
  );
}

export async function Signatures({ rfp }: { rfp: string }) {
  const data = await getData(rfp);
  const total = data.rfp.amount;
  return (
    <>
      <div className="mt-12 grid grid-cols-3 gap-20">
        <div className="flex w-full flex-col">
          <div className="border-gray-400 border-b pb-1 text-center font-bold">
            {data.rfp.requestor.name}
          </div>
          <div className="pt-1 text-center text-xs">Prepared by</div>
        </div>
        <div className="flex w-full flex-col">
          <div className="border-gray-400 border-b pb-1 text-center font-bold">
            {data?.firstReviewer?.name ?? "-"}
          </div>
          <div className="pt-1 text-center text-xs">Reviewed by</div>
        </div>
        <div className="flex w-full flex-col">
          <div className="border-gray-400 border-b pb-1 text-center font-bold">
            {data?.firstApprover?.name ?? "-"}
          </div>
          <div className="pt-1 text-center text-xs">Approved by</div>
        </div>
      </div>
    </>
  );
}

export async function CreateControlButtons({ rfp }: { rfp: string }) {
  const data = await getData(rfp);
  if (!data.isDraft) redirect(`/fims/accounting/check-voucher/view/${rfp}`);
  return (
    <div className="flex justify-end gap-4 print:hidden">
      <CancelButton>Cancel</CancelButton>
      <SubmitButton>Submit</SubmitButton>
    </div>
  );
}

export async function ControlButtons({ rfp }: { rfp: string }) {
  const { id } = await getUser();
  const data = await getData(rfp);

  const { nextActionUser, nextAction } = data;

  const isNextActionUserTheCurrentUser = nextActionUser?.id === Number(id);

  const role =
    nextAction === 3 && isNextActionUserTheCurrentUser
      ? "reviewer"
      : nextAction === 1 && isNextActionUserTheCurrentUser
        ? "approver"
        : "requester";

  const nextActionWord =
    nextAction === 3
      ? "To Review"
      : nextAction === 1
        ? "To Approve"
        : nextAction === 4
          ? "For Release"
          : "Declined";

  const isUserAbleToApprove =
    data.nextActionUserId === Number(id) && data.finalStatus !== 2;

  return (
    <>
      <div className="flex w-full justify-end gap-2 print:hidden">
        {!isUserAbleToApprove && nextActionUser != null && nextAction !== 4 && (
          <ViewTooltip>
            {nextActionWord} by {nextActionUser?.name}
          </ViewTooltip>
        )}
        {nextAction === 4 && (
          <ViewTooltip>
            <strong>For Release</strong>
            <div>Approved by {data.firstApprover?.name}</div>
          </ViewTooltip>
        )}
        {role !== "requester" &&
          [1, 3].includes(nextAction) &&
          isUserAbleToApprove && (
            <DeclineDialog
              cvNo={data.cvNo}
              rfpNo={rfp}
              className="whitespace-pre-wrap"
            >
              Submit
            </DeclineDialog>
          )}
        {role !== "requester" && isUserAbleToApprove && (
          <Form actionType={role === "approver" ? "approve" : "review"}>
            <input type="hidden" name="cvNo" value={data.cvNo} />
            <input type="hidden" name="rfpNo" value={rfp} />
            <SubmitButton
              className="whitespace-pre-wrap"
              promptMessage="Are you sure you want to approve this CV receipt?"
            >
              {role === "approver" ? "Approve" : "Submit"}
            </SubmitButton>
          </Form>
        )}
      </div>
    </>
  );
}

interface DeclineDialog extends React.ComponentPropsWithoutRef<typeof Button> {
  rfpNo: string;
  cvNo: string;
}

async function DeclineDialog({
  rfpNo,
  cvNo,
  children,
  ...props
}: DeclineDialog) {
  const reasons = await cacheGetReasons();

  return (
    <D.Dialog>
      <D.DialogTrigger asChild>
        <Button variant={"outLined-destructive"} size={"long"} type="button">
          Decline
        </Button>
      </D.DialogTrigger>
      <D.DialogContent className="max-w-md py-4 pt-2">
        <Form className="space-y-4" actionType="decline">
          <input type="hidden" name="cvNo" value={cvNo} />
          <input type="hidden" name="rfpNo" value={rfpNo} />
          <div>
            <D.DialogHeader className="font-bold">
              Decline CV Receipt
            </D.DialogHeader>
            <D.DialogDescription>CV Series No. : {cvNo}</D.DialogDescription>
          </div>
          <div>
            <Label htmlFor="reasonId" className="text-primary">
              Reason
            </Label>
            <Select name={"reasonId"} required>
              <SelectTrigger className="w-full bg-inherit text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((reason) => (
                  <SelectItem value={String(reason.id)} key={reason.id}>
                    {reason.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-4">
            <D.DialogTrigger asChild>
              <Button variant={"outlined"} size={"long"}>
                Back
              </Button>
            </D.DialogTrigger>
            <SubmitButton
              {...props}
              variant={"destructive"}
              size={"long"}
              promptMessage="Are you sure you want to approve this CV receipt?"
            >
              {children}
            </SubmitButton>
          </div>
        </Form>
      </D.DialogContent>
    </D.Dialog>
  );
}
