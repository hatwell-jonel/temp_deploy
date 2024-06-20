import { hasAccess } from "@/lib/helpers";

export async function HasAccess({
  path,
  children,
}: { path: string; children: React.ReactNode }) {
  const res = await hasAccess({ path });
  if (!res)
    return (
      <main className="flex min-h-[calc(100vh-84px)] flex-col bg-[#EFEFEF]">
        <section className="container relative flex h-full flex-1 flex-col items-center justify-center font-extrabold text-3xl text-primary">
          Unauthorized!
          <div className="flex items-center justify-center font-normal text-black text-xs">
            Request access from path{" "}
            <code className="select-all rounded-md border border-gray-200 bg-muted px-1.5 font-mono text-muted-foreground italic">
              {path}
            </code>{" "}
            to continue.
          </div>
        </section>
      </main>
    );
  return <>{children}</>;
}
