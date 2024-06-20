import {
  Form,
  SelectEwt,
  VatRadioGroup,
} from "@/app/(modules)/fims/accounting/rfp/client";
import {
  ewtValues,
  getRFPData,
} from "@/app/(modules)/fims/accounting/rfp/helpers";
import {
  CalculationsTable,
  CategoryDetails,
  HeaderDetails,
  ParticularsTable,
  PaymentTerms,
} from "@/app/(modules)/fims/accounting/rfp/server";
import { CancelButton } from "@/components/buttons/cancel";
import { SubmitButton } from "@/components/buttons/submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rfpCreateSearchParams } from "@/validations/searchParams";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const title = "Create RFP";

export const metadata = {
  title,
};

interface PageProps {
  params: { referenceNo: string };
  searchParams: unknown;
}

export default async function RFPCreatePage({
  params,
  searchParams,
}: PageProps) {
  const { data: rfpData } = await getRFPData({
    referenceNo: params.referenceNo,
  });
  if (!rfpData) notFound();
  return (
    <Form
      className="my-6 space-y-6"
      actionType="create"
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
        <Calculations params={params} searchParams={searchParams} />
        <CategoryDetails referenceNo={params.referenceNo} />
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="uppercase">Remarks</div>
            <span className="font-normal text-muted-foreground text-sm italic">
              (Optional)
            </span>
          </div>
          <Input
            name="remarks"
            defaultValue={undefined}
            className="w-full"
            placeholder="Add Remarks"
          />
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
      <div>
        <div className="font-bold text-lg uppercase">Attachments</div>
        <Input
          name="file"
          type="file"
          multiple
          className="h-10 w-full"
          placeholder="Add Attachments"
        />
      </div>
      <div className="flex justify-end gap-4">
        <CancelButton type="button">Cancel</CancelButton>
        <SubmitButton
          type="submit"
          promptMessage="Are you sure you want to submit this RFP?"
        >
          Submit
        </SubmitButton>
      </div>
    </Form>
  );
}

async function Calculations({
  params: { referenceNo },
  searchParams,
}: PageProps) {
  const { data: rfpData, total } = await getRFPData({
    referenceNo,
  });
  if (!rfpData) notFound();
  const { ewt, vat } = rfpCreateSearchParams.parse(searchParams);

  const vatAmount = vat === "vat" ? total * 0.12 : 0;
  const ewtAmount = ewt ? ewt * total : 0;
  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="mt-12 flex flex-col gap-8">
          <Suspense>
            <VatRadioGroup
              className="flex gap-12"
              defaultValue={vat || "non-vat"}
              name="vatable"
            >
              <div className="flex">
                <RadioGroupItem value="vat" id="r1" />
                <Label className="ml-2" htmlFor="r1">
                  VAT (Inclusive)
                </Label>
              </div>
              <div className="flex">
                <RadioGroupItem value="non-vat" id="r2" />
                <Label className="ml-2" htmlFor="r2">
                  Non-VAT (Exclusive)
                </Label>
              </div>
            </VatRadioGroup>
          </Suspense>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">EWT: * </span>
            <Suspense>
              <SelectEwt
                defaultValue={ewt ? String(ewt) : undefined}
                name="ewt"
              >
                <SelectTrigger className="w-[150px] text-foreground text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {ewtValues.map((e) => (
                    <SelectItem key={e.percentage} value={String(e.value)}>
                      {e.percentage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectEwt>
            </Suspense>
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
