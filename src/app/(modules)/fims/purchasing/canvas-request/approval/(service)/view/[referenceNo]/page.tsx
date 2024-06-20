import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { Icons } from "@/components/icons";
import Link from "next/link";
import * as React from "react";
import { ReferenceNumberDetails } from "./server";

const title = "Canvas Request - SRn Form";

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

export default function Page({ params, searchParams }: Props) {
  const showButtons = searchParams.showButtons === "false" ? false : true;
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/purchasing/canvas-request/approval"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              {title}
            </>
          }
        />
        <section className="relative max-w-[90vw] xl:max-w-[72vw]">
          <React.Suspense fallback={<Loading />}>
            <ReferenceNumberDetails
              referenceNo={params.referenceNo}
              showButtons={showButtons}
            />
          </React.Suspense>
        </section>
      </div>
    </>
  );
}
