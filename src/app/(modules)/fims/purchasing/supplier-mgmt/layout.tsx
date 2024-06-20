import { HasAccess } from "@/components/access-rights/server";
import { LoadingLayout } from "@/components/fallbacks";
import { Suspense } from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<LoadingLayout />}>
        <HasAccess path="/fims/purchasing/supplier-mgmt">{children}</HasAccess>
      </Suspense>
    </>
  );
}
