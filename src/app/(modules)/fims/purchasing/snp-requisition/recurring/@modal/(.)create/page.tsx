import ModalDialog from "@/components/dialogs/modal";
import { DialogContent } from "@/components/ui/dialog";
import { Suspense } from "react";
import CreatePage from "../../create/page";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  return (
    <ModalDialog>
      <DialogContent className="p-4 xl:max-w-[80vw]">
        <section className="max-h-dvh flex-1 overflow-auto">
          <Suspense>
            <CreatePage searchParams={searchParams} />
          </Suspense>
        </section>
      </DialogContent>
    </ModalDialog>
  );
}
