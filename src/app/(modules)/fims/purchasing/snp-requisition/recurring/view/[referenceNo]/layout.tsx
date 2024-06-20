import { TitleCard } from "@/components/cards/title";
import { Loading } from "@/components/fallbacks";
import * as React from "react";

const title = "Recurring Requisition";

export const metadata = {
  title,
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard title={title} />
        <section className="relative max-w-[90vw] xl:max-w-[calc(72vw)]">
          <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
        </section>
      </div>
    </>
  );
}
