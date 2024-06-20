import { LoadingLayout } from "@/components/fallbacks";
import { getUser } from "@/lib/auth";
import { getRole1 as getRole } from "@/lib/helpers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<LoadingLayout />}>
        <RedirectIfRquester>{children}</RedirectIfRquester>
      </Suspense>
    </>
  );
}

async function RedirectIfRquester({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = await getUser();
  const { role } = await getRole({
    id,
    subModuleId: 2,
  });
  if (role === "requester") redirect("/fims/purchasing/canvas-request");
  return <>{children}</>;
}
