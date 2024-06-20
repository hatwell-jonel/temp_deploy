import { PrintViewWrapper } from "@/app/(modules)/fims/purchasing/job-purchase-order/client";
import { PrintView } from "@/app/(modules)/fims/purchasing/job-purchase-order/purchase/server";
import { Loading } from "@/components/fallbacks";
import { jobOrderViewSearchParams as searchParamsSchema } from "@/validations/searchParams";
import { Suspense } from "react";

const title = "View Purchase Order";

export const metadata = {
  title,
};

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
  params: {
    referenceNo: string;
  };
};

export default function Page({ searchParams, params }: PageProps) {
  const parsed = searchParamsSchema.parse(searchParams);
  return (
    <>
      <div className="mt-4 space-y-2 rounded-md border border-foreground bg-background p-6 print:mt-0 print:border-none print:py-0">
        <Suspense fallback={<Loading />}>
          <PrintViewWrapper printOnMount={parsed.print}>
            <PrintView
              referenceNo={params.referenceNo}
              showButtons={searchParams.showButtons === "false" ? false : true}
            />
          </PrintViewWrapper>
        </Suspense>
        <div className="fixed bottom-0 left-0 hidden space-y-2 px-6 print:block">
          <hr />
          <div className="flex w-[calc(100vw-40px)] justify-between px-6 pb-4 font-bold text-xs">
            <div>INTERNAL DOCUMENT</div>
            <div>
              CaPEx Forms and Templates |{" "}
              <span className="font-normal text-muted-foreground">
                Page 1 of 1
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
