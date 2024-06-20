import ModalDialog from "@/components/dialogs/modal";
import { Loading } from "@/components/fallbacks";
import { DialogContent } from "@/components/ui/dialog";
import { Suspense } from "react";
import { FormTable } from "../../create/page";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page(_: PageProps) {
  return (
    <ModalDialog>
      <DialogContent className="p-0 xl:max-w-[80vw]">
        <section className="max-h-dvh flex-1 overflow-auto">
          <Suspense fallback={<Loading />}>
            <FormTable />
          </Suspense>
        </section>
      </DialogContent>
    </ModalDialog>
  );
}
