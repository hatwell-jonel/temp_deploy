import { TitleCard } from "@/components/cards/title";
import { Icons } from "@/components/icons";
import Link from "next/link";
import CreateForm from "../_form";

const title = "Create LOA";

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
        <CreateForm searchParams={searchParams} />
      </div>
    </>
  );
}
