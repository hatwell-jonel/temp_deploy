import CreateForm from "../../_form";
import ModalDialog from "../dialog";

type PageProps = {
  searchParams: {
    [key: string]: undefined | string | string[];
  };
};

export default function Page({ searchParams }: PageProps) {
  return (
    <ModalDialog>
      <CreateForm searchParams={searchParams} />
    </ModalDialog>
  );
}
