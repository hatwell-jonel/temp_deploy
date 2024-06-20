import { TitleCard } from "@/components/cards/title";
import { TransferForm } from "./form";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

const title = "Budget Plan Transfer";

export const metadata = {
  title,
};

export default function Page({ searchParams }: PageProps) {
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard title="Budget Plan Transfer" />
        <div className="space-y-2">
          <section className="relative max-w-[90vw] xl:max-w-[73vw]">
            <TransferForm searchParams={searchParams} />
          </section>
        </div>
      </div>
    </>
  );
}
