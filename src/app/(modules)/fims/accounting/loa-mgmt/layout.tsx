import { HasAccess } from "@/components/access-rights/server";
import { LoadingLayout } from "@/components/fallbacks";
import { Suspense } from "react";

export default function Layout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<LoadingLayout />}>
        <HasAccess path="/fims/accounting/loa-mgmt">
          {props.children}
          {props.modal}
        </HasAccess>
      </Suspense>
    </>
  );
}
