import { SideNav } from "@/components/layouts/side-navigation";
import { SiteHeader } from "@/components/layouts/site-header";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-row">
      <SideNav />
      <div className="relative h-full flex-1">
        <SiteHeader />
        <main className="flex min-h-[calc(100vh-84px)] flex-col bg-[#EFEFEF]">
          <section className="container relative flex h-full flex-1 flex-col items-center justify-center font-extrabold text-3xl text-primary">
            Not Found!
          </section>
        </main>
      </div>
    </div>
  );
}
