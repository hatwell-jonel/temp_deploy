import {
  // ewtValues,
  getRFPData,
} from "@/app/(modules)/fims/accounting/rfp/helpers";
// import { RadioGroupItem } from "@/components/ui/radio-group";
import { getColorOfPriority } from "@/components/colored";
import { DatePickerWithPresets } from "@/components/date-picker";
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
import { db } from "@/db";
import { formatDate, pesofy } from "@/lib/utils";
import { rfpSearchParams } from "@/validations/searchParams";
import { notFound } from "next/navigation";
// import { Suspense } from "react";
import {
  SearchButton,
  SearchForm,
  // SelectEwt, VatRadioGroup
} from "./client";

export async function HeaderDetails({ referenceNo }: { referenceNo: string }) {
  const { data: rfpData, total } = await getRFPData({ referenceNo });
  if (!rfpData) notFound();
  return (
    <>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date Requested: </span>
            <span>{formatDate(rfpData.dateRequested)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Transaction Date (From):{" "}
            </span>
            <span>{formatDate(rfpData.dateRequested)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Transaction Date (To):{" "}
            </span>
            <span>{formatDate(rfpData.transactionDateTo)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due Date: </span>
            <span>{formatDate(rfpData.dueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Priority Level: </span>
            <span
              className={getColorOfPriority(Number(rfpData.priorityLevelId))}
            >
              {rfpData.priorityLevel.name}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {rfpData.joNumber ? "JO" : "PO"} Number:{" "}
            </span>
            <span>{rfpData.joNumber || rfpData.poNumber || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">RFP Number:</span>
            <span>{rfpData.rfpNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Req. Division:</span>
            <span>{rfpData.requestor.division.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Branch: </span>
            <span>{rfpData.requestor.details.branch?.code ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">TIN: </span>
            <span>008-022-724-000</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 rounded-sm border border-[#707070] *:px-6 *:py-1.5">
        <div className="space-x-12 border-foreground border-r">
          <span className="text-muted-foreground">Payee: </span>
          <span>{rfpData.payee.name}</span>
        </div>
        <div className="space-x-12">
          <span className="text-muted-foreground">Subpayee: </span>
          <span>{rfpData.subPayee?.name ?? "-"}</span>
        </div>
      </div>
    </>
  );
}

export async function CategoryDetails({
  referenceNo,
}: {
  referenceNo: string;
}) {
  const { data: rfpData } = await getRFPData({ referenceNo });
  if (!rfpData) throw new Error("RFP not found!");
  return (
    <div>
      <div className="font-bold text-lg uppercase">Details</div>
      <div className="rounded-md border border-[#707070]">
        <Table className="text-sm">
          <TableHeader className="*:*:text-center">
            <TableRow className="border-b-0 *:h-8 *:border-[#707070] *:border-r">
              <TableHead>Budget Source</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>OPEX</TableHead>
              <TableHead>Chart of Account</TableHead>
              <TableHead className="!border-r-0">Sub Account</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="*:*:p-2 *:*:text-center">
            <TableRow className="bg-gray-100 *:border-[#707070] *:border-r">
              <TableCell>{rfpData.budgetSource.name}</TableCell>
              <TableCell>{rfpData.opexCategory.category}</TableCell>
              <TableCell>{rfpData.opexCategory.type}</TableCell>
              <TableCell>{rfpData.chartOfAccounts.name}</TableCell>
              <TableCell className="!border-r-0">
                {rfpData.subAccounts.name}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function PaymentTerms() {
  return (
    <div>
      <div className="font-bold text-lg uppercase">Payment and Terms</div>
      <div className="rounded-md border border-[#707070]">
        <Table className="text-sm">
          <TableHeader className="*:*:text-center">
            <TableRow className="border-b-0 *:h-8 *:border-[#707070] *:border-r">
              <TableHead>Payment Type</TableHead>
              <TableHead>Payment Terms</TableHead>
              <TableHead>RFP Term</TableHead>
              <TableHead className="!border-r-0">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="*:*:p-2 *:*:text-center">
            <TableRow className="bg-gray-100 *:border-[#707070] *:border-r">
              <TableCell>Check</TableCell>
              <TableCell>2</TableCell>
              <TableCell>1st</TableCell>
              <TableCell className="!border-r-0">{pesofy(982.14)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function CalculationsTable({
  total,
  vatAmount,
  ewtAmount,
}: {
  total: number;
  vatAmount: number;
  ewtAmount: number;
}) {
  return (
    <>
      <div>
        <Table>
          <TableHeader className="*:*:text-center">
            <TableRow className="border-[#707070] *:h-8 *:border-[#707070] *:border-r">
              <TableHead />
              <TableHead className="border-t bg-[#F2F2F2] text-foreground">
                Debit
              </TableHead>
              <TableHead className="border-t border-r bg-[#F2F2F2] text-foreground">
                Credit
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="*:*:p-1 *:*:text-center">
            <TableRow className="border-[#707070] *:border-[#707070] *:border-b *:border-l">
              <TableCell>VAT</TableCell>
              <TableCell>{vatAmount}</TableCell>
              <TableCell className="border-r" />
            </TableRow>
            <TableRow className="border-[#707070] *:border-[#707070] *:border-b *:border-l">
              <TableCell>EWT</TableCell>
              <TableCell />
              <TableCell className="border-r">{ewtAmount.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow className="border-[#707070] *:border-[#707070] *:border-b *:border-l">
              <TableCell>NET OF VAT</TableCell>
              <TableCell>{(total - vatAmount).toFixed(2)}</TableCell>
              <TableCell className="border-r" />
            </TableRow>
            <TableRow className="border-[#707070] *:border-[#707070] *:border-b *:border-l">
              <TableCell>NET OF AMOUNT</TableCell>
              <TableCell />
              <TableCell className="border-r">
                {(total - ewtAmount).toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className="border-[#707070] *:border-[#707070] *:border-b *:border-l">
              <TableCell>TOTAL</TableCell>
              <TableCell>{total.toFixed(2)}</TableCell>
              <TableCell className="border-r">{total.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export async function ParticularsTable({
  referenceNo,
}: { referenceNo: string }) {
  const { data, total } = await getRFPData({ referenceNo });
  const particulars = data?.particulars;
  return (
    <div>
      <div className="font-bold text-lg uppercase">Particulars</div>
      <div className="rounded-sm border border-[#707070]">
        <Table className="text-sm">
          <TableHeader className="*:*:text-center">
            <TableRow className="border-[#707070] *:h-8 *:border-[#707070] *:border-r">
              <TableHead>Description</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="!border-r-0">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="*:*:p-2 *:*:text-center">
            {particulars?.map((d) => (
              <TableRow
                key={d.id}
                className="*:border-[#707070] *:border-r odd:bg-gray-100"
              >
                <TableCell>{d.description}</TableCell>
                <TableCell>{d.quantity}</TableCell>
                <TableCell>{pesofy(d.amount)}</TableCell>
                <TableCell className="!border-r-0">
                  {pesofy(d.amount * d.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="border-[#707070]">
            <TableRow className="bg-[#F5F8FF]">
              <TableCell colSpan={4} className="p-2">
                <div className="flex justify-end gap-2 text-base text-primary">
                  GRAND TOTAL: <span>{pesofy(total)}</span>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

export async function Search({ searchParams }: { searchParams: unknown }) {
  const parsed = rfpSearchParams.parse(searchParams);
  const payees = await db.query.users.findMany();
  return (
    <>
      <SearchForm className="flex items-end gap-6">
        <div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
          <div className="space-y-2">
            <Label
              className="font-semibold text-xs"
              htmlFor="dateRequestedFrom"
            >
              Date Requested
            </Label>
            <div className="flex gap-6">
              <DatePickerWithPresets
                dateFormat="M-d-y"
                hideCalendar
                placeholder="From"
                key={JSON.stringify(parsed.dateRequestedFrom)}
                defaultDate={parsed.dateRequestedFrom}
                name="dateRequestedFrom"
                disablePreviousDates={false}
                className="w-[8rem] rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 hover:bg-transparent"
              />
              <DatePickerWithPresets
                hideCalendar
                dateFormat="M-d-y"
                name="dateRequestedTo"
                key={JSON.stringify(parsed.dateRequestedTo)}
                defaultDate={parsed.dateRequestedTo}
                placeholder="To"
                disablePreviousDates={false}
                className="w-[8rem] rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 hover:bg-transparent"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold text-xs" htmlFor="dateNeededFrom">
              Date Needed
            </Label>
            <div className="flex gap-6">
              <DatePickerWithPresets
                hideCalendar
                placeholder="From"
                dateFormat="M-d-y"
                key={JSON.stringify(parsed.dateNeededFrom)}
                defaultDate={parsed.dateNeededFrom}
                name="dateNeededFrom"
                disablePreviousDates={false}
                className="w-[8rem] rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 hover:bg-transparent"
              />
              <DatePickerWithPresets
                hideCalendar
                name="dateNeededTo"
                placeholder="To"
                key={JSON.stringify(parsed.dateNeededTo)}
                defaultDate={parsed.dateNeededTo}
                dateFormat="M-d-y"
                disablePreviousDates={false}
                className="w-[8rem] rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 hover:bg-transparent"
              />
            </div>
          </div>
          <div className="flex items-end space-y-2">
            <div className="flex gap-6">
              <Select
                name="payeeId"
                key={JSON.stringify(parsed.payeeId)}
                defaultValue={
                  parsed.payeeId ? String(parsed.payeeId) : undefined
                }
              >
                <SelectTrigger className="w-[8rem] rounded-none border-gray-400 border-x-0 border-t-0 border-b bg-transparent px-0 text-xs hover:bg-transparent focus-visible:ring-transparent focus:ring-transparent">
                  <SelectValue placeholder="Payee" />
                </SelectTrigger>
                <SelectContent>
                  {payees.map((payee) => (
                    <SelectItem key={payee.id} value={String(payee.id)}>
                      {payee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                name="subPayeeId"
                key={JSON.stringify(parsed.subPayeeId)}
                defaultValue={
                  parsed.subPayeeId ? String(parsed.subPayeeId) : undefined
                }
              >
                <SelectTrigger className="w-[8rem] rounded-none border-gray-400 border-x-0 border-t-0 border-b bg-transparent px-0 text-xs hover:bg-transparent focus-visible:ring-transparent focus:ring-transparent">
                  <SelectValue placeholder="Sub Payee" />
                </SelectTrigger>
                <SelectContent>
                  {payees.map((payee) => (
                    <SelectItem key={payee.id} value={String(payee.id)}>
                      {payee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
