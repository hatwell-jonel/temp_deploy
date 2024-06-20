import { SideNav } from "@/components/layouts/side-navigation";
import { SiteHeader } from "@/components/layouts/site-header";
import RequestNotification from "@/components/request-notification";
import { site } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-row">
      <SideNav />
      <div className="relative h-full flex-1">
        <SiteHeader />
        <main className="flex min-h-[calc(100vh-84px)] flex-col bg-[#EFEFEF]">
          <section className="container relative flex h-full flex-1 flex-col">
            {children}
          </section>
        </main>
      </div>
      <RequestNotification />
    </div>
  );
}
