import { Icons } from "../icons";

export function Loading() {
  return (
    <div className="flex min-h-[20rem] w-full items-center justify-center">
      <Icons.spinner className="animate-spin" />
    </div>
  );
}

export function LoadingLayout() {
  return (
    <main className="flex min-h-[calc(100vh-84px)] flex-col bg-[#EFEFEF]">
      <section className="container relative flex h-full flex-1 flex-col items-center justify-center">
        <Icons.spinner className="animate-spin" />
      </section>
    </main>
  );
}
