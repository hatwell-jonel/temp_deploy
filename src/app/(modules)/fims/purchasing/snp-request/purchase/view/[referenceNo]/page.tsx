import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import * as React from "react";
import { ReferenceNumberDetails, title } from "./server";

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

export default function ViewServiceRequestPage({
  params,
  searchParams,
}: Props) {
  const showButtons = searchParams.showButtons === "false" ? false : true;
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard title={title} />
        <section className="relative max-w-full xl:max-w-[calc(72vw)]">
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
