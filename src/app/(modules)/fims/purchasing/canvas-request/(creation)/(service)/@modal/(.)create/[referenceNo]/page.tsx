import ModalDialog from "@/components/dialogs/modal";
import { Loading } from "@/components/fallbacks";
import { DialogContent } from "@/components/ui/dialog";
import { Suspense } from "react";
import { FormTable } from "../../../create/[referenceNo]/server";

type PageProps = {
  params: {
    referenceNo: string;
  };
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams, params }: PageProps) {
  return (
    <ModalDialog>
      <DialogContent className="p-0 xl:max-w-[80vw]">
        <section className="max-h-dvh flex-1 overflow-auto">
          <div className="px-4 pt-4 font-bold text-lg text-primary">
            Canvas Request - SRn Form
          </div>
          <Suspense fallback={<Loading />}>
            <FormTable referenceNo={params.referenceNo} />
          </Suspense>
        </section>
      </DialogContent>
    </ModalDialog>
  );
}
