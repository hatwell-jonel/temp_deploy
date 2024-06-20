import { Form } from "@/app/(modules)/fims/accounting/check-voucher/client";
import {
  CreateControlButtons,
  DetailsList,
  Signatures,
} from "@/app/(modules)/fims/accounting/check-voucher/server";
import Image from "next/image";
import { Suspense } from "react";

interface PageProps {
  params: {
    rfp: string;
  };
}

export const metadata = {
  title: "Check Voucher Receipt",
};

export default function Page({ params }: PageProps) {
  return (
    <>
      <Form className="mx-auto flex flex-col gap-6 py-8" actionType="create">
        <input type="hidden" name="rfpReferenceNo" value={params.rfp} />
        <div className="max-w-3xl border border-gray-400 bg-white p-6 text-xs print:border-none print:p-0">
          <div className="mb-2 grid grid-cols-2 items-center gap-6">
            <Image
              src={"/images/capex-logo.png"}
              width={127}
              height={58}
              alt="Logo"
              priority
            />
            <div className="text-right font-bold text-xl">
              CHECK VOUCHER RECEIPT
            </div>
          </div>
          <Suspense>
            <DetailsList rfp={params.rfp} type="create" />
          </Suspense>
          <Suspense>
            <Signatures rfp={params.rfp} />
          </Suspense>
        </div>
        <Suspense>
          <CreateControlButtons rfp={params.rfp} />
        </Suspense>
      </Form>
    </>
  );
}
