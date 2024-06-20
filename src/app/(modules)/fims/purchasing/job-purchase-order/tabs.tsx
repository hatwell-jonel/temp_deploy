"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { name: string; path: string; short: string };

const basePath = "/fims/purchasing/job-purchase-order";

const tabs: Tab[] = [
  { name: "Job", path: basePath, short: "JO" },
  { name: "Purchase", path: `${basePath}/purchase`, short: "PO" },
];

export default function Tabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-row gap-4">
      {tabs.map((tab) => (
        <div className="flex items-center justify-center" key={tab.name}>
          <Link
            href={tab.path}
            className={cn(
              "relative line-clamp-2 w-[6.3rem] overflow-hidden rounded-lg border border-primary bg-background px-8 py-1.5 text-center font-thin text-gray-600 text-sm uppercase lg:line-clamp-none lg:w-full hover:border-2 hover:font-semibold hover:text-primary",
              pathname === tab.path && "border-2 font-semibold text-primary",
            )}
          >
            <div className="hidden lg:block">
              {tab.name} <br /> Order
            </div>
            <div className="block lg:hidden">{tab.short}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
