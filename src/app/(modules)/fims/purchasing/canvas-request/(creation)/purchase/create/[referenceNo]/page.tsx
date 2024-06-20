import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Suspense } from "react";
import { FormTable } from "./server";

const title = "Canvas Request - PRn Form";

export const metadata = {
  title,
};

type PageProps = {
  params: {
    referenceNo: string;
  };
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ params }: PageProps) {
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/purchasing/canvas-request/purchase"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              {title}
            </>
          }
        />
        <section className="relative max-w-[90vw] xl:max-w-[73vw]">
          <Suspense fallback={<Loading />}>
            <FormTable referenceNo={params.referenceNo} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
