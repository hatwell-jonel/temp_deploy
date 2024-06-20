import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import { getColorOfPriority } from "@/components/colored";
import { BackIcon } from "@/components/icons";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewTooltip } from "@/components/view-tooltip";
import { getUser } from "@/lib/auth";
import { getUserDetails } from "@/lib/helpers";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import * as React from "react";
import {
  type Reasons,
  getCanvasRequestDetails,
  getReasons,
} from "../../helpers";
import {
  ApproverForm,
  DeclineForm,
  DetailsTable,
  RequesterForm,
  ReviewerForm,
} from "./client";

export async function ReferenceNumberDetails({
  referenceNo,
  showButtons = true,
}: {
  referenceNo: string;
  showButtons?: boolean;
}) {
  const data = await getCanvasRequestDetails(referenceNo);
  const { id } = await getUser();

  const canvassing = data.at(0)?.canvassing;
  if (!canvassing) notFound();

  const reasons = await getReasons();

  const { nextActionUser, nextAction } = canvassing;

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
    canvassing.nextActionUserId === Number(id) && canvassing.finalStatus !== 2;

  return (
    <Form
      id="sr"
      referenceNo={referenceNo}
      className="w-full space-y-1 rounded-md bg-background shadow-lg"
    >
      <div className="flex rounded-t-md bg-primary px-4 py-2 text-background">
        <CancelButton className="w-fit" type="button">
          <BackIcon />
        </CancelButton>
        <div className="flex flex-1 items-center justify-center">
          CANVAS REQUEST - SRn Form
        </div>
      </div>
      <div className="space-y-4 p-4 pt-2 text-xs">
        <div>
          <div className="flex gap-2">
            <div className="min-w-[200px] text-muted-foreground">
              Date Created:
            </div>{" "}
            {canvassing.createdAt ? formatDate(canvassing.createdAt) : "-"}
          </div>
          <div className="flex gap-2">
            <div className="min-w-[200px] text-muted-foreground">
              Expected Start Date:
            </div>{" "}
            {formatDate(canvassing.expectedStartDate)}
          </div>
          <div className="flex gap-2">
            <div className="min-w-[200px] text-muted-foreground">
              Expected End Date:
            </div>{" "}
            {formatDate(canvassing.expectedEndDate)}
          </div>
          <div className="flex gap-2">
            <div className="min-w-[200px] text-muted-foreground">
              Priority Level:
            </div>{" "}
            <div
              className={getColorOfPriority(Number(canvassing.priorityLevelId))}
            >
              {canvassing.priorityLevel.name}
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-400">
          <React.Suspense key={referenceNo}>
            <DetailsTable data={data} reasons={reasons} role={role} />
          </React.Suspense>
        </div>
        <RequesterInfo userId={canvassing.createdBy} />
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

function DeclineDialog({
  referenceNo,
  children,
  reasons,
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
        <DeclineForm className="space-y-4" referenceNo={referenceNo}>
          <div>
            <DialogHeader className="font-bold">
              Decline Canvas Request - SRn
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
            <SubmitButton
              {...props}
              variant={"destructive"}
              size={"long"}
              type="submit"
            >
              {children}
            </SubmitButton>
          </div>
        </DeclineForm>
      </DialogContent>
    </Dialog>
  );
}

async function RequesterInfo({ userId }: { userId: number }) {
  const { detail, division, location, position, user } =
    await getUserDetails(userId);
  return (
    <div className="rounded-md border border-gray-400">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-gray-400">
            <TableHead
              className="text-center font-bold text-foreground"
              colSpan={4}
            >
              REQUESTER&apos;S INFORMATION
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="w-full">
            <TableCell className="w-1/4 border-gray-400 border-r text-left text-foreground">
              <span className="mr-4 text-muted-foreground">Name: </span>
              {user.name}
            </TableCell>
            <TableCell className="w-1/4 border-gray-400 border-r text-left text-foreground">
              <span className="mr-4 text-muted-foreground">Position: </span>
              {position?.code}
            </TableCell>
            <TableCell className="w-1/4 border-gray-400 border-r text-left text-foreground">
              <span className="mr-4 text-muted-foreground">Division: </span>
              {division?.name}
            </TableCell>
            <TableCell className="w-1/4 text-left text-foreground">
              <span className="mr-4 text-muted-foreground">Branch: </span>
              {location?.code}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
