import { TitleCard } from "@/components/cards/title";
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="flex w-full flex-col gap-6 py-8">
        <TitleCard
          title={
            <>
              <Link href={"/fims/purchasing/snp-requisition/recurring"}>
                <Icons.arrow className="mr-2 inline-flex rotate-90 items-center text-capex" />
              </Link>
              Service & Purchase Requisition
            </>
          }
        />
        <section className="relative max-w-[90vw] xl:max-w-[72vw]">
          <div className="rounded-md bg-background p-4 shadow-lg">
            {children}
          </div>
        </section>
      </div>
    </>
  );
}
