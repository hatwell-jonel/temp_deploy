import ModalDialog from "@/components/dialogs/modal";
import { Loading } from "@/components/fallbacks";
import { DialogContent } from "@/components/ui/dialog";
import { Suspense } from "react";
import { ReferenceNumberDetails } from "../../../view/[referenceNo]/server";

type PageProps = {
  params: {
    referenceNo: string;
  };
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams, params }: PageProps) {
  const showButtons = searchParams.showButtons === "false" ? false : true;
  return (
    <ModalDialog>
      <DialogContent className="p-0 xl:max-w-[80vw]">
        <section className="max-h-dvh flex-1 overflow-auto">
          <Suspense fallback={<Loading />}>
            <ReferenceNumberDetails
              referenceNo={params.referenceNo}
              showButtons={showButtons}
            />
          </Suspense>
        </section>
      </DialogContent>
    </ModalDialog>
  );
}
