import { Loading } from "@/components/fallbacks";
import { checkVoucherSearchParams } from "@/validations/searchParams";
import { Suspense } from "react";
import { Search, TableData } from "../server";
import Tabs from "./tabs";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  const parsed = checkVoucherSearchParams.parse(searchParams);
  return (
    <>
      <Tabs />
      <Suspense>
        <Search searchParams={parsed} />
      </Suspense>
      <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
        <Suspense fallback={<Loading />}>
          <TableData searchParams={parsed} />
        </Suspense>
      </section>
    </>
  );
}
