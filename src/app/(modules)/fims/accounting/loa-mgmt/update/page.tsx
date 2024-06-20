import { TitleCard } from "@/components/cards/title";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Suspense } from "react";
import { UpdateForm } from "../_form";

const title = "Update LOA";

export const metadata = {
  title,
};

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/accounting/loa-mgmt"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              {title}
            </>
          }
        />
        <Suspense>
          <UpdateForm searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
