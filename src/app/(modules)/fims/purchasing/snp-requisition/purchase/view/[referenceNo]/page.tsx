import { BudgetDetails } from "@/components/budget-details";
import { CancelButton } from "@/components/buttons/cancel";
import PrintButton from "@/components/buttons/print";
import { SubmitButton } from "@/components/buttons/submit";
import { TitleCard } from "@/components/cards/title";
import { getColorOfPriority } from "@/components/colored";
import { Loading } from "@/components/fallbacks";
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
import { getUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { purchaseRequisitionViewSearchParams } from "@/validations/searchParams";
import { notFound } from "next/navigation";
import * as React from "react";
import { type Reasons, getReasons, getRequisitionDetails } from "../../helpers";
import {
  ApproverForm,
  RequesterForm,
  RequisitionDetailsTable,
  ReviewerForm,
} from "./client";

const title = "Purchase Requisition";

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

export default function ViewPurchaseRequisitionPage({
  params,
  searchParams,
}: Props) {
  const { budgetDetails, print } =
    purchaseRequisitionViewSearchParams.parse(searchParams);
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard title={title} />
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <React.Suspense fallback={<Loading />}>
            <ReferenceNumberDetails
              referenceNo={params.referenceNo}
              showPrint={print}
              showBudgetDetails={budgetDetails}
              showButtons={searchParams.showButtons === "false" ? false : true}
            />
          </React.Suspense>
        </section>
      </div>
    </>
  );
}

export async function ReferenceNumberDetails({
  referenceNo,
  showBudgetDetails = true,
  showPrint = false,
  showButtons = true,
}: {
  referenceNo: string;
  showBudgetDetails?: boolean;
  showPrint?: boolean;
  showButtons?: boolean;
}) {
  const data = await getRequisitionDetails(referenceNo);
  const { id } = await getUser();

  const requisition = data.at(0)?.requisition;
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
      referenceNo={referenceNo}
      className="w-full space-y-1 rounded-md bg-background shadow-lg"
    >
      <div className="flex rounded-t-md bg-primary px-4 py-2 text-background">
        <CancelButton className="w-fit" type="button">
          <BackIcon />
        </CancelButton>
        <div className="flex flex-1 items-center justify-center">
          Purchase Requisition
        </div>
      </div>
      <div className="space-y-4 p-4 pt-2 text-xs">
        <div className="flex justify-between">
          <div>
            <div className="flex gap-2">
              <div className="min-w-[200px] text-muted-foreground">
                PRn No.:
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
                Expected Delivery Date:
              </div>{" "}
              {formatDate(requisition.expectedEndDate)}
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
          {showPrint ? <PrintButton /> : null}
        </div>
        <div className="rounded-md border border-gray-400">
          <React.Suspense key={referenceNo}>
            <RequisitionDetailsTable
              data={data}
              reasons={reasons}
              role={role}
            />
          </React.Suspense>
        </div>
        <RequesterInfo userId={requisition.createdBy} />
        {showBudgetDetails ? (
          <BudgetDetails
            budgetSource={data[0].itemCategory.budgetSource.name}
            coa={data[0].itemCategory.chartOfAccounts.name}
            opexCategory={data[0].itemCategory.opexCategory.category}
            opexType={data[0].itemCategory.opexCategory.type}
            subAccount={data[0].itemCategory.subAccounts.name}
          />
        ) : null}
        <div className="flex w-full justify-end gap-2 print:hidden">
          {!isUserAbleToApprove && nextActionUser != null && (
            <ViewTooltip>
              {nextActionWord} by {nextActionUser?.name}
            </ViewTooltip>
          )}
          {role === "approver" && nextAction === 1 && isUserAbleToApprove && (
            <DeclineDialog
              referenceNo={referenceNo}
              reasons={reasons}
              className="whitespace-pre-wrap"
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
  extends React.ComponentPropsWithoutRef<typeof Button> {
  reasons: Reasons;
  referenceNo: string;
}

async function DeclineDialog({
  reasons,
  referenceNo,
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
        <ApproverForm referenceNo={referenceNo} className="space-y-4">
          <div>
            <DialogHeader className="font-bold">
              Decline Purchase Requisition
            </DialogHeader>
            <DialogDescription>PRn No. : {referenceNo}</DialogDescription>
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
