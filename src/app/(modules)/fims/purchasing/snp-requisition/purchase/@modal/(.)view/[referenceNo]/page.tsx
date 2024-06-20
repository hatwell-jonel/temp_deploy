import ModalDialog from "@/components/dialogs/modal";
import { Loading } from "@/components/fallbacks";
import { DialogContent } from "@/components/ui/dialog";
import { purchaseRequisitionViewSearchParams } from "@/validations/searchParams";
import * as React from "react";
import { ReferenceNumberDetails } from "../../../view/[referenceNo]/page";

interface Props {
  params: {
    referenceNo: string;
  };
  searchParams: {
    [key: string]: string[] | string | undefined;
  };
}

export default function Page({ params, searchParams }: Props) {
  const { budgetDetails, print } =
    purchaseRequisitionViewSearchParams.parse(searchParams);
  return (
    <ModalDialog>
      <DialogContent className="p-0 xl:max-w-[70vw]">
        <section className="max-h-dvh flex-1 overflow-auto">
          <React.Suspense fallback={<Loading />}>
            <ReferenceNumberDetails
              referenceNo={params.referenceNo}
              showPrint={print}
              showBudgetDetails={budgetDetails}
            />
          </React.Suspense>
        </section>
      </DialogContent>
    </ModalDialog>
  );
}
