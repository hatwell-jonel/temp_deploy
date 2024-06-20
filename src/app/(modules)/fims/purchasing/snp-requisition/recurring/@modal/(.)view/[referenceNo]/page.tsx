import ModalDialog from "@/components/dialogs/modal";
import { Loading } from "@/components/fallbacks";
import { DialogContent } from "@/components/ui/dialog";
import { Suspense } from "react";
import ViewPage from "../../../view/[referenceNo]/page";

interface Props {
  params: {
    referenceNo: string;
  };
  searchParams: {
    [key: string]: string[] | string | undefined;
  };
}
export default function Page(props: Props) {
  return (
    <ModalDialog>
      <DialogContent className="p-0 xl:max-w-[80vw]">
        <section className="max-h-dvh flex-1 overflow-auto">
          <Suspense fallback={<Loading />}>
            <ViewPage {...props} />
          </Suspense>
        </section>
      </DialogContent>
    </ModalDialog>
  );
}
