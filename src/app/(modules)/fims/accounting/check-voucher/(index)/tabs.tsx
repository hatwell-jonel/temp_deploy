"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { name: string; path: string; short: string };

const basePath = "/fims/accounting/check-voucher";

const tabs: Tab[] = [
  { name: "Request for Payment", path: basePath, short: "RFP" },
  { name: "Cash Advance", path: `${basePath}/cash-advance`, short: "CA" },
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
            <div className="hidden min-h-10 max-w-[120px] items-center justify-center lg:flex">
              {tab.name}
            </div>
            <div className="block lg:hidden">{tab.short}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
