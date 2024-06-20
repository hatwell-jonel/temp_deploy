import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import { getColorOfPriority } from "@/components/colored";
import { BackIcon } from "@/components/icons";
import { RequesterInfo } from "@/components/requester-info";
import { ShowAttachmentLinks } from "@/components/show-attachment";
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
import {
  formatDate,
  formatNumber,
  monthFullnames,
  months,
  pesofy,
} from "@/lib/utils";
import { getMonth, getYear } from "date-fns";
import { notFound } from "next/navigation";
import * as React from "react";
import { type Reasons, getReasons, getRequisitionDetails } from "../../helpers";
import { ApproverForm } from "./client";

export const title = "Service Request";

const cachedGetRequisitionDetails = React.cache(async (referenceNo: string) => {
  const data = await getRequisitionDetails(referenceNo);
  if (!data) notFound();
  if (data.canvasService.length < 1) notFound();
  return data;
});

export async function ReferenceNumberDetails({
  referenceNo,
  showButtons = true,
}: {
  referenceNo: string;
  showButtons?: boolean;
}) {
  const data = await cachedGetRequisitionDetails(referenceNo);
  const { id } = await getUser();
  const details = data.canvasService;
  const grandTotal = details.reduce((accumulator, object) => {
    return accumulator + object.rate * object.hours;
  }, 0);

  const { budgetSourceId, chartOfAccountsId: coaId } =
    details[0].serviceDescription.serviceCategory;
  const reasons = await getReasons();

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

  console.log({ nextActionWord });

  const Form = ApproverForm;

  const isUserAbleToApprove =
    data.nextActionUserId === Number(id) && data.finalStatus !== 2;

  const budgetProps = {
    coaId: Number(coaId),
    grandTotal: grandTotal,
    requestDate: data.expectedStartDate,
  };

  const { approvedBudget, totalAvailment } =
    await cachedBudgetData(budgetProps);
  const remainingBudget =
    approvedBudget - totalAvailment - budgetProps.grandTotal;

  return (
    <div className="w-full space-y-1 rounded-md bg-background shadow-lg">
      <div className="flex rounded-t-md bg-primary px-4 py-2 text-background">
        <CancelButton className="w-fit" type="button">
          <BackIcon />
        </CancelButton>
        <div className="flex flex-1 items-center justify-center">{title}</div>
      </div>
      <div className="space-y-4 p-4 pt-2 text-xs">
        <div className="flex justify-between">
          <div>
            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">SR No.:</div>
              <span className="text-primary">{referenceNo}</span>
            </div>
            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Expected Start Date:
              </div>{" "}
              {formatDate(data.expectedStartDate)}
            </div>
            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Priority Level:
              </div>{" "}
              <div className={getColorOfPriority(Number(data.priorityLevelId))}>
                {data.priorityLevel.name}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-400">
          <DetailsTable referenceNo={referenceNo} />
        </div>
        <RequesterInfo userId={data.createdBy} />
        <BudgetForTheMonth {...budgetProps} />
        <div className="flex w-full justify-end gap-2 print:hidden">
          {!isUserAbleToApprove && nextActionUser != null && (
            <ViewTooltip>
              {nextActionWord} by {nextActionUser?.name}
            </ViewTooltip>
          )}
          {role !== "requester" &&
            [1, 3].includes(nextAction) &&
            isUserAbleToApprove && (
              <DeclineDialog
                referenceNo={referenceNo}
                reasons={reasons}
                className="whitespace-pre-wrap"
              >
                Submit
              </DeclineDialog>
            )}
          {role !== "requester" &&
            isUserAbleToApprove &&
            remainingBudget > 0 && (
              <Form referenceNo={referenceNo}>
                <input type="hidden" name="total" value={grandTotal} />
                <SubmitButton
                  className="whitespace-pre-wrap"
                  promptMessage="Are you sure you want to approve this request?"
                >
                  Approve
                </SubmitButton>
              </Form>
            )}
        </div>
      </div>
    </div>
  );
}
type BudgetForTheMonthProps = {
  coaId: number;
  grandTotal: number;
  requestDate: Date;
};

// expensive calculation that is called more than once
const cachedBudgetData = React.cache(
  async ({ coaId, requestDate }: BudgetForTheMonthProps) => {
    const year = getYear(requestDate);
    const monthNum = getMonth(requestDate);
    const month = {
      short: months[monthNum],
      full: monthFullnames[monthNum],
    };
    const budgetData = await db.query.yearlyBudget.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.chartOfAccountsId, coaId), eq(table.year, year)),
      with: {
        availment: true,
        chartOfAccounts: true,
      },
    });

    const approvedBudget = budgetData?.[month.short] || 0;
    const totalAvailment =
      budgetData?.availment.reduce((accumulator, object) => {
        const amount = object.month === month.short ? object.amount : 0;
        return accumulator + amount;
      }, 0) || 0;

    return { approvedBudget, totalAvailment, budgetData, month, year };
  },
);

async function BudgetForTheMonth(props: BudgetForTheMonthProps) {
  const { approvedBudget, totalAvailment, budgetData, month, year } =
    await cachedBudgetData(props);
  const remainingBudget = approvedBudget - totalAvailment - props.grandTotal;

  return (
    <>
      <div className="rounded-md border border-gray-400">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="border-gray-400">
              <TableHead
                className="text-center font-bold text-foreground uppercase"
                colSpan={5}
              >
                {`${month.full} ${year} BUDGET`}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="*:h8 w-full *:w-1/5 *:border-gray-400 *:border-r *:py-2 *:text-center *:text-foreground">
              <TableCell>Chart Of Account</TableCell>
              <TableCell>Approved Budget</TableCell>
              <TableCell>Availed</TableCell>
              <TableCell>Remaining Budget</TableCell>
              <TableCell className="!border-r-0">Budget Needed</TableCell>
            </TableRow>
            <TableRow className="*:h8 w-full bg-gray-100 *:w-1/5 *:border-gray-400 *:border-r *:py-0 *:text-center *:text-foreground">
              <TableCell className="py-2">
                {budgetData?.chartOfAccounts.name}
              </TableCell>
              <TableCell className="py-2">{pesofy(approvedBudget)}</TableCell>
              <TableCell className="px-0 py-2">
                <div className="flex w-full justify-between">
                  <div className="w-2/3 border-gray-400 border-r-2 py-2">
                    {totalAvailment > 0 ? pesofy(totalAvailment) : pesofy(0)}
                  </div>
                  <div className="w-1/3 py-2 text-center">
                    {formatNumber((totalAvailment / approvedBudget) * 100)} %
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-0 py-2">
                <div className="flex w-full justify-between">
                  <div className="w-2/3 border-gray-400 border-r-2 py-2">
                    {remainingBudget > 0 ? pesofy(remainingBudget) : pesofy(0)}
                  </div>
                  <div className="w-1/3 py-2 text-center">
                    {formatNumber((remainingBudget / approvedBudget) * 100)} %
                  </div>
                </div>
              </TableCell>
              <TableCell className="!border-r-0 py-2">
                {remainingBudget < 0 ? pesofy(Math.abs(remainingBudget)) : "-"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

async function DetailsTable({ referenceNo }: { referenceNo: string }) {
  const data = await cachedGetRequisitionDetails(referenceNo);
  const grandTotal = data.canvasService.reduce((accumulator, object) => {
    return accumulator + object.rate * object.hours;
  }, 0);
  return (
    <>
      <Table className="text-xs">
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow className="border-gray-400 *:border-gray-400 *:border-r *:text-center *:text-foreground">
            <TableHead>Service Description</TableHead>
            <TableHead>Worker</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Man Hours</TableHead>
            <TableHead>Extent of Work</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Total Rate</TableHead>
            <TableHead className="!border-r-0">Attachment/s</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.canvasService.map((data) => {
            return (
              <TableRow
                className="border-gray-400 *:border-gray-400 *:border-r odd:bg-gray-100 *:text-center *:text-foreground"
                key={data.id}
              >
                <TableCell>{data.serviceDescription.description}</TableCell>
                <TableCell>{`${data.worker.firstName} ${data.worker.lastName}`}</TableCell>
                <TableCell>{formatDate(data.startDate)}</TableCell>
                <TableCell>{formatDate(data.endDate)}</TableCell>
                <TableCell>{data.hours}</TableCell>
                <TableCell>{data.extentOfWork}</TableCell>
                <TableCell>{pesofy(data.rate)}</TableCell>
                <TableCell>{pesofy(data.rate * data.hours)}</TableCell>
                <TableCell className="!border-r-0">
                  <div className="flex items-center justify-center">
                    {data.attachments.length > 0 ? (
                      <ShowAttachmentLinks
                        fileUrls={data.attachments.map((a) => a.url)}
                      />
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter className="border-gray-400">
          <TableRow>
            <TableCell colSpan={12}>
              <div className="flex w-full justify-end gap-2 text-xl">
                <span className="font-bold">GRAND TOTAL : </span>
                <input type="hidden" name="total" value={grandTotal} />
                <span className="text-primary">{pesofy(grandTotal)}</span>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

interface DeclineDialog extends React.ComponentPropsWithoutRef<typeof Button> {
  referenceNo: string;
  reasons: Reasons;
}

function DeclineDialog({
  referenceNo,
  reasons,
  children,
  ...props
}: DeclineDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outLined-destructive"} size={"long"} type="button">
          Decline
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <ApproverForm referenceNo={referenceNo} className="space-y-4">
          <div>
            <DialogHeader className="font-bold">
              Decline Service Request
            </DialogHeader>
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
            <SubmitButton {...props} variant={"destructive"} size={"long"}>
              {children}
            </SubmitButton>
          </div>
        </ApproverForm>
      </DialogContent>
    </Dialog>
  );
}
