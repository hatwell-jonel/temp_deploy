import PrintButton from "@/components/buttons/print";
import { SubmitButton } from "@/components/buttons/submit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewTooltip } from "@/components/view-tooltip";
import { db } from "@/db";
import type { manpower } from "@/db/schema/fims";
import { getUser } from "@/lib/auth";
import { formatDate, pesofy } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, cache } from "react";
import { ApproveForm, DeclineForm, NotesInput } from "../client";
import { getDetails, getReasons } from "./helpers";

const cachedDetails = cache(async (referenceNo: string) => {
  const data = await getDetails(referenceNo);
  if (!data) notFound();
  const total = data.canvasService.reduce((accumulator, object) => {
    return accumulator + object.hours * object.rate;
  }, 0);
  return { data, total };
});

export async function PrintView({
  referenceNo,
  showButtons,
}: { referenceNo: string; showButtons?: boolean }) {
  const { data, total } = await cachedDetails(referenceNo);
  const details = data.canvasService;

  const { id } = await getUser();
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, Number(id)),
  });
  if (!user) throw new Error("User not found!");

  const { nextActionUser, nextAction } = data;

  const isNextActionUserTheCurrentUser = nextActionUser?.id === Number(id);

  console.log({ nextAction, showButtons, nextActionUser, id });

  const role =
    showButtons === false
      ? "requester"
      : nextAction === 3 && isNextActionUserTheCurrentUser
        ? "reviewer"
        : nextAction === 1 && isNextActionUserTheCurrentUser
          ? "approver"
          : "requester";

  const nextActionWord =
    nextAction === 3
      ? "To Review"
      : nextAction === 1
        ? "To Approve"
        : "Declined";

  const Form = ApproveForm;

  const isUserAbleToApprove =
    data.nextActionUserId === Number(id) && data.finalStatus !== 2;

  return (
    <>
      {role === "requester" && (
        <div className="flex justify-end print:hidden">
          <PrintButton />
        </div>
      )}
      <div className="w-full rounded-sm border-2 border-gray-400 py-4 text-xs print:block print:border-none *:px-8 print:*:px-0 print:[print-color-adjust:exact]">
        <JOHeading />
        <div className="!px-4 !py-1 mt-8 w-96 border-2 border-primary bg-primary text-center text-primary-foreground">
          {"Workers's Information"}
        </div>
        <hr className="!px-0 w-full border-primary border-b-2" />
        <div className="mt-2">
          <WorkerInfo worker={details[0].worker} />
        </div>
        <div className="mt-6 space-y-4">
          <div className="font-bold text-sm [font-size:14px]">
            JOB ORDER DETAILS
          </div>
          <div>
            <span className="text-muted-foreground">Service Description: </span>
            <span className="font-semibold">
              {details[0].serviceDescription.description}
            </span>
          </div>
          <div className="rounded-md border border-gray-400">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="border-gray-400 border-b *:border-gray-400 *:border-r *:text-center">
                  <TableHead>Worker</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Man Hours</TableHead>
                  <TableHead>Extent of Work</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="!border-r-0">Total Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((row) => (
                  <TableRow
                    key={row.id}
                    className="print:*:whitespace-nowrap *:border-gray-400 *:border-r odd:bg-gray-100 *:py-2 *:text-center"
                  >
                    <TableCell>
                      {row.worker.firstName} {row.worker.lastName}
                    </TableCell>
                    <TableCell>{formatDate(row.startDate)}</TableCell>
                    <TableCell>{formatDate(row.endDate)}</TableCell>
                    <TableCell>{row.hours}</TableCell>
                    <TableCell>{row.extentOfWork}</TableCell>
                    <TableCell>{pesofy(row.rate)}</TableCell>
                    <TableCell className="!border-r-0">
                      {pesofy(row.rate * row.hours)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="border-gray-400 border-t">
                  <TableCell
                    colSpan={7}
                    className="space-x-10 text-right font-bold text-lg"
                  >
                    <span>GRAND TOTAL:</span>
                    <span className="text-primary">{pesofy(total)}</span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className="flex w-full gap-x-56 pt-6">
            <div className="flex w-1/2 flex-col gap-1 *:text-center">
              <div className="font-semibold text-base">
                {details[0].worker.firstName} {details[0].worker.lastName}
              </div>
              <hr className="border-gray-300 border-b" />
              <div>Worker</div>
            </div>
            <div className="flex w-1/2 flex-col gap-1 *:text-center">
              <div className="font-semibold text-base">
                {data.requisition.creator.name}
              </div>
              <hr className="border-gray-300 border-b" />
              <div>Cargo Padala Express Forwarding Services Corporation</div>
            </div>
          </div>
          {role === "requester" && <NotesInput />}
        </div>
      </div>

      <div className="flex w-full justify-end gap-2 print:hidden">
        {!isUserAbleToApprove && nextActionUser != null && (
          <ViewTooltip>
            {nextActionWord} by {nextActionUser?.name}
          </ViewTooltip>
        )}
        {role !== "requester" &&
          [1, 3].includes(nextAction) &&
          isUserAbleToApprove && (
            <Suspense>
              <DeclineDialog referenceNo={referenceNo} />
            </Suspense>
          )}
        {role !== "requester" && isUserAbleToApprove && (
          <ApproveForm referenceNo={referenceNo} type="jo">
            <SubmitButton promptMessage="Are you sure you want to approve this job order?">
              Approve
            </SubmitButton>
          </ApproveForm>
        )}
      </div>
    </>
  );
}

async function DeclineDialog({
  referenceNo,
}: {
  referenceNo: string;
}) {
  const reasons = await getReasons();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outLined-destructive"} size={"long"} type="button">
          Decline
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DeclineForm referenceNo={referenceNo} className="space-y-4" type="jo">
          <div>
            <DialogHeader className="font-bold">Decline Job Order</DialogHeader>
            <DialogDescription>SR No. : {referenceNo}</DialogDescription>
          </div>
          <div>
            <Label htmlFor="reasonId" className="text-primary">
              Reason
            </Label>
            <Select name={"reasonId"}>
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
            <DialogTrigger asChild>
              <Button variant={"outlined"} size={"long"}>
                Back
              </Button>
            </DialogTrigger>
            <SubmitButton variant={"destructive"} size={"long"} type="submit">
              Decline
            </SubmitButton>
          </div>
        </DeclineForm>
      </DialogContent>
    </Dialog>
  );
}

function JOHeading() {
  return (
    <>
      <Table className="table-fixed border border-foreground text-xs [font-size:10px]">
        <TableBody className="*:w-full *:*:border-foreground *:*:border-r *:*:border-b">
          <TableRow>
            <TableCell rowSpan={3} className="w-1/3">
              <div>
                <Image
                  alt="capex-logo"
                  src="/images/capex-logo.png"
                  width={127}
                  height={70}
                />
                Bldg. 9A, Salem International Commercial Complex, Domestic Road,
                Pasay City
              </div>
            </TableCell>
            <TableCell
              colSpan={6}
              className="py-2 text-center font-semibold text-base"
            >
              Job Order
            </TableCell>
          </TableRow>
          <TableRow className="font-extralight">
            <TableCell className="bg-[#E6E6E6] py-2">Form No.:</TableCell>
            <TableCell colSpan={2} className="py-2" />
            <TableCell className="bg-[#E6E6E6] py-2">Date Issued:</TableCell>
            <TableCell colSpan={2} className="py-2" />
          </TableRow>
          <TableRow className="font-extralight">
            <TableCell className="bg-[#E6E6E6] py-2">Revision No.:</TableCell>
            <TableCell colSpan={2} className="py-2" />
            <TableCell className="bg-[#E6E6E6] py-2">
              Effectivity Date:
            </TableCell>
            <TableCell colSpan={2} className="py-2" />
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

function WorkerInfo({ worker }: { worker: typeof manpower.$inferSelect }) {
  return (
    <>
      <div className="flex">
        <div className="w-32 text-muted-foreground">Full Name: </div>
        <div>
          {worker.firstName} {worker.lastName}
        </div>
      </div>
      <div className="flex">
        <div className="w-32 text-muted-foreground">Email Address: </div>
        <div>{worker.emailAddress}</div>
      </div>
      <div className="flex">
        <div className="w-32 text-muted-foreground">Telephone No. : </div>
        <div>
          {worker.telephoneNumber && worker.telephoneNumber.length > 0
            ? worker.telephoneNumber
            : "-"}
        </div>
      </div>
      <div className="flex">
        <div className="w-32 text-muted-foreground">Agency: </div>
        <div>{worker.agency}</div>
      </div>
      <div className="flex">
        <div className="w-32 text-muted-foreground">TIN No. : </div>
        <div>{worker.tin}</div>
      </div>
    </>
  );
}
