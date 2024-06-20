import { Suspense } from "react";
import { UpdateForm } from "../../_form";
import ModalDialog from "../dialog";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  return (
    <ModalDialog>
      <Suspense>
        <UpdateForm searchParams={searchParams} />
      </Suspense>
    </ModalDialog>
  );
}
