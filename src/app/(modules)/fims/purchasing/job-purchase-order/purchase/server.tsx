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
import { getUser } from "@/lib/auth";
import { formatDate, pesofy } from "@/lib/utils";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ApproveForm, DeclineForm, NotesInput } from "../client";
import { PrintHeading } from "../print-heading";
import { getDetails, getReasons } from "./helpers";

const cachedDetails = cache(async (referenceNo: string) => {
  const data = await getDetails(referenceNo);
  if (!data) notFound();
  const total = data.canvasPurchase.reduce((accumulator, object) => {
    return accumulator + object.quantity * object.unitPrice;
  }, 0);
  return { data, total };
});

export async function PrintView({
  referenceNo,
  showButtons,
}: { referenceNo: string; showButtons?: boolean }) {
  const { data, total } = await cachedDetails(referenceNo);
  const details = data.canvasPurchase;

  const { id } = await getUser();
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, Number(id)),
  });
  if (!user) throw new Error("User not found!");

  const { nextActionUser, nextAction } = data;

  const isNextActionUserTheCurrentUser = nextActionUser?.id === Number(id);

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

  const supplier = details[0].supplier;
  const creator = data.requisition.creator;

  const firstRow = details[0];
  return (
    <>
      {role === "requester" && (
        <div className="flex justify-end print:hidden">
          <PrintButton />
        </div>
      )}
      <div className="w-full space-y-4 rounded-sm border-2 border-gray-400 py-4 text-xs print:block print:border-none *:px-8 print:*:px-0 print:[print-color-adjust:exact]">
        <PrintHeading title="Purchase Order" />
        <div className="!px-0 flex w-full border-primary border-b-2">
          <div className="w-1/2">
            <div className="max-w-52 rounded-tr-md bg-primary py-1 pl-8 text-base text-primary-foreground">
              Supplier
            </div>
          </div>
          <div className="w-1/2">
            <div className="max-w-52 rounded-t-md bg-primary py-1 pl-8 text-base text-primary-foreground">
              Ship to
            </div>
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/2 space-y-2">
            <div>{supplier.name}</div>
            <div className="max-w-sm text-balance">
              {supplier.address} Brgy. {supplier.barangay.name},{" "}
              {supplier.city.name}, {supplier.region.name},{" "}
              {supplier.postalCode}
            </div>
            <div>
              {supplier.firstName} {supplier.lastName}
            </div>
            <div>{supplier.mobileNumber}</div>
            <div>{supplier.emailAddress}</div>
          </div>
          <div className="w-1/2 space-y-2">
            <div>Cargo Padala Express Forwarding Services</div>
            <div className="text-balance">
              Building 9A, Salem International Commercial Complex, Domestic Rd.,
              Pasay City
            </div>
            <div>{creator.name}</div>
            <div>{creator.details.companyMobileNumber}</div>
            <div>{creator.details.companyEmail}</div>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="font-bold text-base">
            DELIVERY AND PAYMENT INFORMATION
          </div>
          <div className="rounded-md border border-gray-400">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="border-gray-400 border-b *:border-gray-400 *:border-r *:text-center">
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Payment Option</TableHead>
                  <TableHead>Installment Terms</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead className="!border-r-0">
                    Method of Delivery
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="print:*:whitespace-nowrap *:border-gray-400 *:border-r odd:bg-gray-100 *:py-2 *:text-center">
                  <TableCell>{formatDate(firstRow.deliveryDate)}</TableCell>
                  <TableCell>{firstRow.paymentOption.name}</TableCell>
                  <TableCell>{firstRow.installmentTerms}</TableCell>
                  <TableCell>{firstRow.paymentTerms}</TableCell>
                  <TableCell>{firstRow.paymentMode.name}</TableCell>
                  <TableCell className="!border-r-0">
                    {firstRow.methodOfDelivery.name}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="font-bold text-base">PURCHASE INFORMATION</div>
          <div className="rounded-md border border-gray-400">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="border-gray-400 border-b *:border-gray-400 *:border-r *:text-center">
                  <TableHead>Item Description</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="!border-r-0">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((row) => (
                  <TableRow
                    key={row.id}
                    className="print:*:whitespace-nowrap *:border-gray-400 *:border-r odd:bg-gray-100 *:py-2 *:text-center"
                  >
                    <TableCell>{row.itemDescription.description}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{pesofy(row.unitPrice)}</TableCell>
                    <TableCell className="!border-r-0">
                      {pesofy(row.unitPrice * row.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="border-gray-400 border-t">
                  <TableCell
                    colSpan={4}
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
                {supplier.lastName}, {supplier.firstName}
              </div>
              <hr className="border-gray-300 border-b" />
              <div>Supplier</div>
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
          isUserAbleToApprove && <DeclineDialog referenceNo={referenceNo} />}
        {role !== "requester" && isUserAbleToApprove && (
          <Form referenceNo={referenceNo} type="po">
            <SubmitButton promptMessage="Are you sure you want to approve this purchase order?">
              Approve
            </SubmitButton>
          </Form>
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
        <DeclineForm referenceNo={referenceNo} className="space-y-4" type="po">
          <div>
            <DialogHeader className="font-bold">
              Decline Purchase Order
            </DialogHeader>
            <DialogDescription>PR No. : {referenceNo}</DialogDescription>
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
