import { Form } from "@/app/(modules)/fims/accounting/rfp/client";
import { getRFPData } from "@/app/(modules)/fims/accounting/rfp/helpers";
import {
  CalculationsTable,
  CategoryDetails,
  HeaderDetails,
  ParticularsTable,
  PaymentTerms,
} from "@/app/(modules)/fims/accounting/rfp/server";
import { SubmitButton } from "@/components/buttons/submit";
import { ViewTooltip } from "@/components/view-tooltip";
import { getUser } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const title = "View RFP";

export const metadata = {
  title,
};

export default async function RFPViewPage({
  params,
  searchParams,
}: {
  params: { referenceNo: string };
  searchParams: {
    [key: string]: undefined | string | string[];
  };
}) {
  const showButtons = searchParams.showButtons === "false" ? false : true;
  const { id } = await getUser();
  const { data, total } = await getRFPData({
    referenceNo: params.referenceNo,
  });

  if (!data || data.isDraft) notFound();

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

  const actionType = nextAction === 1 ? "approve" : "create";

  const isUserAbleToApprove =
    data.nextActionUserId === Number(id) && data.finalStatus !== 2;

  const rfpData = data;

  return (
    <Form
      className="my-6 space-y-6"
      actionType={actionType}
      referenceNo={params.referenceNo}
    >
      <div className="space-y-4 rounded-sm border border-[#707070] bg-background p-6 text-sm print:border-0 print:p-0">
        <div className="grid grid-cols-2 items-center gap-10">
          <Image
            src="/images/capex-logo.png"
            width={127}
            height={58}
            alt="Logo"
            priority
          />
          <div className="font-bold text-3xl">REQUEST FOR PAYMENT</div>
        </div>
        <HeaderDetails referenceNo={params.referenceNo} />
        <ParticularsTable referenceNo={params.referenceNo} />
        <Calculations referenceNo={params.referenceNo} />
        <CategoryDetails referenceNo={params.referenceNo} />
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="uppercase">Remarks</div>
          </div>
          {rfpData.remarks ? <div className="">{rfpData.remarks}</div> : "-"}
        </div>
        <PaymentTerms />
        <div className="grid grid-cols-2 *:mt-12">
          <div className="flex flex-col justify-center gap-2 px-24 *:text-center">
            <div className="border-foreground border-b pb-2 font-semibold">
              {rfpData.requestor.name}
            </div>
            <div className="text-xs">Requested By</div>
          </div>
          <div className="flex flex-col justify-center gap-2 px-24 *:text-center">
            <div className="border-foreground border-b pb-2 font-semibold">
              {rfpData.firstApprover?.name ?? "-"}
            </div>
            <div className="text-xs">1st Approver</div>
          </div>
          <div className="flex flex-col justify-center gap-2 px-24 *:text-center">
            <div className="border-foreground border-b pb-2 font-semibold">
              {rfpData.secondApprover?.name ?? "-"}
            </div>
            <div className="text-xs">2nd Approver</div>
          </div>
          <div className="flex flex-col justify-center gap-2 px-24 *:text-center">
            <div className="border-foreground border-b pb-2 font-semibold">
              {rfpData.thirdApprover?.name ?? "-"}
            </div>
            <div className="text-xs">3rd Approver</div>
          </div>
        </div>
      </div>
      <div className="rounded-md border border-[#707070] bg-background p-6 print:hidden">
        <div className="font-bold text-lg uppercase">Attachments</div>
        <div className="flex flex-col gap-2">
          {rfpData.attachments.map((attachment) => (
            <Link
              key={attachment.id}
              href={attachment.url}
              className="text-primary underline underline-offset-4"
              target="_blank"
            >
              {attachment.name}
            </Link>
          ))}
        </div>
      </div>
      <input type="hidden" name="amount" value={total} />
      <div className="flex w-full justify-end gap-2 print:hidden">
        {!isUserAbleToApprove && nextActionUser != null && (
          <ViewTooltip>
            {nextActionWord} by {nextActionUser?.name}
          </ViewTooltip>
        )}
        {/* {role !== "requester" &&
          [1, 3].includes(nextAction) &&
          isUserAbleToApprove && (
            <DeclineDialog
              referenceNo={referenceNo}
              reasons={reasons}
              className="whitespace-pre-wrap"
            >
              Submit
            </DeclineDialog>
          )} */}
        {role !== "requester" && isUserAbleToApprove && (
          <SubmitButton
            className="whitespace-pre-wrap"
            promptMessage="Are you sure you want to approve this RFP?"
          >
            {role === "approver" ? "Approve" : "Submit"}
          </SubmitButton>
        )}
      </div>
    </Form>
  );
}

async function Calculations({ referenceNo }: { referenceNo: string }) {
  const { data: rfpData, total } = await getRFPData({
    referenceNo,
  });

  if (!rfpData || rfpData.isDraft) notFound();

  const vat = rfpData.vatable || false ? "vat" : "non-vat";
  const ewt = rfpData.ewtPercentage || 0;
  const isVatable = rfpData.vatable || false;

  const vatAmount = vat === "vat" ? total * 0.12 : 0;
  const ewtAmount = ewt ? ewt * total : 0;
  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="mt-12 flex flex-col gap-8">
          {isVatable ? "VAT (Inclusive)" : "Non-VAT (Exclusive)"}
          <div className="space-x-4">
            <span className="font-semibold text-muted-foreground">EWT:</span>
            <span className="font-semibold">
              {ewt ? `${ewt * 100} %` : "-"}
            </span>
          </div>
        </div>
        <CalculationsTable
          total={total}
          vatAmount={vatAmount}
          ewtAmount={ewtAmount}
        />
      </div>
    </div>
  );
}
