import {
  type Reasons,
  getAirlineDetails,
  getReasons,
  getRentalDetails,
  getSubscriptionDetails,
  getUtilityDetails,
} from "@/app/(modules)/fims/purchasing/snp-requisition/recurring/helpers";
import { BudgetDetails } from "@/components/budget-details";
import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import { getColorOfPriority } from "@/components/colored";
import { BackIcon } from "@/components/icons";
import { RequesterInfo } from "@/components/requester-info";
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
import { ViewTooltip } from "@/components/view-tooltip";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { RecurringCategory } from "@/types";
import { notFound } from "next/navigation";
import * as React from "react";
import {
  AirlineDetailsTable,
  ApproverForm,
  RentalDetailsTable,
  RequesterForm,
  ReviewerForm,
  SubscriptionDetailsTable,
  UtilityDetailsTable,
} from "./client";

const title = "Recurring Requisition";

export const metadata = {
  title,
};

interface Props {
  params: {
    referenceNo: string;
  };
  searchParams: {
    [key: string]: string[] | string | undefined;
  };
}

export default async function ViewPage({ params, searchParams }: Props) {
  const serviceCategory = await db.query.recurring.findFirst({
    where: (table, { eq }) => eq(table.requisitionNo, params.referenceNo),
    with: {
      category: true,
    },
  });
  const showButtons = searchParams.showButtons === "false" ? false : true;
  const categoryName = serviceCategory?.category.name;

  return (
    <>
      {categoryName === "Airline" && (
        <Airline referenceNo={params.referenceNo} showButtons={showButtons} />
      )}
      {categoryName === "Utilities" && (
        <Utilities referenceNo={params.referenceNo} showButtons={showButtons} />
      )}
      {categoryName === "Rentals" && (
        <Rentals referenceNo={params.referenceNo} showButtons={showButtons} />
      )}
      {categoryName === "Subscription" && (
        <Subscription
          referenceNo={params.referenceNo}
          showButtons={showButtons}
        />
      )}
    </>
  );
}

interface DetailsProps {
  referenceNo: string;
  showButtons: boolean;
}

export async function Airline({ showButtons, referenceNo }: DetailsProps) {
  const data = await getAirlineDetails(referenceNo);
  const { id } = await getUser();
  const requisition = data?.requisition;
  if (!requisition) notFound();
  const reasons = await getReasons();
  const { nextActionUser, nextAction } = requisition;
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
  const Form =
    nextAction === 3 && isNextActionUserTheCurrentUser
      ? ReviewerForm
      : nextAction === 1 && isNextActionUserTheCurrentUser
        ? ApproverForm
        : RequesterForm;
  const isUserAbleToApprove =
    requisition.nextActionUserId === Number(id) &&
    requisition.finalStatus !== 2;

  return (
    <Form
      category="airline"
      referenceNo={referenceNo}
      className="w-full space-y-1 rounded-md bg-background shadow-lg"
    >
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
              <div className="min-w-[200px] text-muted-foreground">
                SRN-R No.:
              </div>
              <span className="text-primary">{referenceNo}</span>
            </div>
            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Date Created:
              </div>{" "}
              {requisition.createdAt ? formatDate(requisition.createdAt) : "-"}
            </div>
            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Priority Level:
              </div>{" "}
              <div
                className={getColorOfPriority(
                  Number(requisition.priorityLevelId),
                )}
              >
                {requisition.priorityLevel.name}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-400">
          <React.Suspense key={referenceNo}>
            <AirlineDetailsTable
              data={data.airline}
              reasons={reasons}
              role={role}
            />
          </React.Suspense>
        </div>
        <RequesterInfo userId={requisition.createdBy} />
        <BudgetDetails
          budgetSource={data.category.budgetSource.name}
          coa={data.category.chartOfAccounts.name}
          opexCategory={data.category.opexCategory.category}
          opexType={data.category.opexCategory.type}
          subAccount={data.category.subAccounts.name}
        />
        <div className="flex w-full justify-end gap-2 print:hidden">
          {!isUserAbleToApprove && nextActionUser != null && (
            <ViewTooltip>
              {nextActionWord} by {nextActionUser?.name}
            </ViewTooltip>
          )}
          {role === "approver" && nextAction === 1 && isUserAbleToApprove && (
            <DeclineDialog
              category="airline"
              referenceNo={referenceNo}
              reasons={reasons}
            >
              Submit
            </DeclineDialog>
          )}
          {role !== "requester" && isUserAbleToApprove && (
            <SubmitButton className="whitespace-pre-wrap">
              {role === "approver" ? "Approve" : "Submit"}
            </SubmitButton>
          )}
        </div>
      </div>
    </Form>
  );
}

export async function Utilities({ showButtons, referenceNo }: DetailsProps) {
  const data = await getUtilityDetails(referenceNo);
  const { id } = await getUser();
  const requisition = data?.requisition;
  if (!requisition) notFound();
  const reasons = await getReasons();
  const { nextActionUser, nextAction } = requisition;
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
  const Form =
    nextAction === 3 && isNextActionUserTheCurrentUser
      ? ReviewerForm
      : nextAction === 1 && isNextActionUserTheCurrentUser
        ? ApproverForm
        : RequesterForm;
  const isUserAbleToApprove =
    requisition.nextActionUserId === Number(id) &&
    requisition.finalStatus !== 2;
  return (
    <Form
      category="utility"
      referenceNo={referenceNo}
      className="w-full space-y-1 rounded-md bg-background shadow-lg"
    >
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
              <div className="min-w-[200px] text-muted-foreground">
                SRN-R No.:
              </div>
              <span className="text-primary">{referenceNo}</span>
            </div>
            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Date Created:
              </div>{" "}
              {requisition.createdAt ? formatDate(requisition.createdAt) : "-"}
            </div>

            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Priority Level:
              </div>{" "}
              <div
                className={getColorOfPriority(
                  Number(requisition.priorityLevelId),
                )}
              >
                {requisition.priorityLevel.name}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-400">
          <React.Suspense key={referenceNo}>
            <UtilityDetailsTable
              data={data.utility}
              reasons={reasons}
              role={role}
            />
          </React.Suspense>
        </div>
        <RequesterInfo userId={requisition.createdBy} />
        <BudgetDetails
          budgetSource={data.category.budgetSource.name}
          coa={data.category.chartOfAccounts.name}
          opexCategory={data.category.opexCategory.category}
          opexType={data.category.opexCategory.type}
          subAccount={data.category.subAccounts.name}
        />
        <div className="flex w-full justify-end gap-2 print:hidden">
          {!isUserAbleToApprove && nextActionUser != null && (
            <ViewTooltip>
              {nextActionWord} by {nextActionUser?.name}
            </ViewTooltip>
          )}
          {role === "approver" && nextAction === 1 && isUserAbleToApprove && (
            <DeclineDialog
              category="utility"
              referenceNo={referenceNo}
              reasons={reasons}
            >
              Submit
            </DeclineDialog>
          )}
          {role !== "requester" && isUserAbleToApprove && (
            <SubmitButton className="whitespace-pre-wrap">
              {role === "approver" ? "Approve" : "Submit"}
            </SubmitButton>
          )}
        </div>
      </div>
    </Form>
  );
}

export async function Rentals({ showButtons, referenceNo }: DetailsProps) {
  const data = await getRentalDetails(referenceNo);
  const { id } = await getUser();
  const requisition = data?.requisition;
  if (!requisition) notFound();
  const reasons = await getReasons();
  const { nextActionUser, nextAction } = requisition;
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
  const Form =
    nextAction === 3 && isNextActionUserTheCurrentUser
      ? ReviewerForm
      : nextAction === 1 && isNextActionUserTheCurrentUser
        ? ApproverForm
        : RequesterForm;
  const isUserAbleToApprove =
    requisition.nextActionUserId === Number(id) &&
    requisition.finalStatus !== 2;

  return (
    <Form
      category="rental"
      referenceNo={referenceNo}
      className="w-full space-y-1 rounded-md bg-background shadow-lg"
    >
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
              <div className="min-w-[200px] text-muted-foreground">
                SRN-R No.:
              </div>
              <span className="text-primary">{referenceNo}</span>
            </div>
            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Date Created:
              </div>{" "}
              {requisition.createdAt ? formatDate(requisition.createdAt) : "-"}
            </div>

            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Priority Level:
              </div>{" "}
              <div
                className={getColorOfPriority(
                  Number(requisition.priorityLevelId),
                )}
              >
                {requisition.priorityLevel.name}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-400">
          <React.Suspense key={referenceNo}>
            <RentalDetailsTable
              data={data.rental}
              reasons={reasons}
              role={role}
            />
          </React.Suspense>
        </div>
        <RequesterInfo userId={requisition.createdBy} />
        <BudgetDetails
          budgetSource={data.category.budgetSource.name}
          coa={data.category.chartOfAccounts.name}
          opexCategory={data.category.opexCategory.category}
          opexType={data.category.opexCategory.type}
          subAccount={data.category.subAccounts.name}
        />
        <div className="flex w-full justify-end gap-2 print:hidden">
          {!isUserAbleToApprove && nextActionUser != null && (
            <ViewTooltip>
              {nextActionWord} by {nextActionUser?.name}
            </ViewTooltip>
          )}
          {role === "approver" && nextAction === 1 && isUserAbleToApprove && (
            <DeclineDialog
              category="rental"
              referenceNo={referenceNo}
              reasons={reasons}
            >
              Submit
            </DeclineDialog>
          )}
          {role !== "requester" && isUserAbleToApprove && (
            <SubmitButton className="whitespace-pre-wrap">
              {role === "approver" ? "Approve" : "Submit"}
            </SubmitButton>
          )}
        </div>
      </div>
    </Form>
  );
}

export async function Subscription({ showButtons, referenceNo }: DetailsProps) {
  const data = await getSubscriptionDetails(referenceNo);
  const { id } = await getUser();
  const requisition = data?.requisition;
  if (!requisition) notFound();
  const reasons = await getReasons();
  const { nextActionUser, nextAction } = requisition;
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
  const Form =
    nextAction === 3 && isNextActionUserTheCurrentUser
      ? ReviewerForm
      : nextAction === 1 && isNextActionUserTheCurrentUser
        ? ApproverForm
        : RequesterForm;
  const isUserAbleToApprove =
    requisition.nextActionUserId === Number(id) &&
    requisition.finalStatus !== 2;

  return (
    <Form
      category="subscription"
      referenceNo={referenceNo}
      className="w-full space-y-1 rounded-md bg-background shadow-lg"
    >
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
              <div className="min-w-[200px] text-muted-foreground">
                SRN-R No.:
              </div>
              <span className="text-primary">{referenceNo}</span>
            </div>
            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Date Created:
              </div>{" "}
              {requisition.createdAt ? formatDate(requisition.createdAt) : "-"}
            </div>

            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                Priority Level:
              </div>{" "}
              <div
                className={getColorOfPriority(
                  Number(requisition.priorityLevelId),
                )}
              >
                {requisition.priorityLevel.name}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-400">
          <React.Suspense key={referenceNo}>
            <SubscriptionDetailsTable
              data={data.subscription}
              reasons={reasons}
              role={role}
            />
          </React.Suspense>
        </div>
        <RequesterInfo userId={requisition.createdBy} />
        <BudgetDetails
          budgetSource={data.category.budgetSource.name}
          coa={data.category.chartOfAccounts.name}
          opexCategory={data.category.opexCategory.category}
          opexType={data.category.opexCategory.type}
          subAccount={data.category.subAccounts.name}
        />
        <div className="flex w-full justify-end gap-2 print:hidden">
          {!isUserAbleToApprove && nextActionUser != null && (
            <ViewTooltip>
              {nextActionWord} by {nextActionUser?.name}
            </ViewTooltip>
          )}
          {role === "approver" && nextAction === 1 && isUserAbleToApprove && (
            <DeclineDialog
              category="subscription"
              referenceNo={referenceNo}
              reasons={reasons}
            >
              Submit
            </DeclineDialog>
          )}
          {role !== "requester" && isUserAbleToApprove && (
            <SubmitButton className="whitespace-pre-wrap">
              {role === "approver" ? "Approve" : "Submit"}
            </SubmitButton>
          )}
        </div>
      </div>
    </Form>
  );
}

interface DeclineDialogProps
  extends React.ComponentPropsWithoutRef<typeof SubmitButton> {
  referenceNo: string;
  reasons: Reasons;
  category: RecurringCategory;
}

async function DeclineDialog({
  referenceNo,
  reasons,
  category,
  children,
  ...props
}: DeclineDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outLined-destructive"} size={"long"} type="button">
          Decline
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <ApproverForm
          referenceNo={referenceNo}
          className="space-y-4"
          category={category}
        >
          <div>
            <DialogHeader className="font-bold">
              Decline Service Requisition
            </DialogHeader>
            <DialogDescription>SRn No. : {referenceNo}</DialogDescription>
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
              Decline
            </SubmitButton>
          </div>
        </ApproverForm>
      </DialogContent>
    </Dialog>
  );
}
