import { TitleCard } from "@/components/cards/title";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateDialog } from "../server";

const title = "Cash Advance";

export const metadata = {
  title,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <TitleCard title={title}>
        <CreateDialog>
          <button
            className={cn(
              buttonVariants({ size: "long" }),
              "w-full text-xs lg:mr-6 lg:w-fit lg:px-4",
            )}
          >
            Cash Advance
          </button>
        </CreateDialog>
      </TitleCard>
      {children}
    </div>
  );
}
