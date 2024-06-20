"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { name: string; path: string; short: string };

const basePath = "/fims/purchasing/canvas-request";

const creationTabs: Tab[] = [
  { name: "CR - SERVICE", path: basePath, short: "CR - SR" },
  {
    name: "CR - PURCHASE",
    path: `${basePath}/purchase`,
    short: "CR-PR",
  },
];

const approvalTabs: Tab[] = [
  {
    name: "SRn - CANVAS",
    path: `${basePath}/approval`,
    short: "CR - SR",
  },
  {
    name: "PRn - CANVAS",
    path: `${basePath}/approval/purchase`,
    short: "CR-PR",
  },
];

export default function CanvasRequestTabs({
  userRole,
}: {
  userRole: "reviewer" | "requester" | "approver";
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-4">
      {userRole === "requester" && (
        <div className="rounded-md bg-background px-4 py-2.5 shadow-md">
          <div className="mb-2 text-muted-foreground text-sm">
            Creation of Canvas Request
          </div>
          <div className="flex flex-row gap-4">
            {creationTabs.map((tab) => (
              <div className="flex items-center justify-center" key={tab.name}>
                <Link
                  href={tab.path}
                  className={cn(
                    "relative line-clamp-2 w-[6.3rem] overflow-hidden rounded-lg border border-primary bg-background px-8 py-1.5 text-center font-thin text-gray-600 text-sm uppercase lg:line-clamp-none lg:w-full hover:border-2 hover:font-semibold hover:text-primary",
                    pathname === tab.path &&
                      "border-2 font-semibold text-primary",
                  )}
                >
                  <div className="hidden lg:block">
                    {tab.name} <br /> REQUISITION
                  </div>
                  <div className="block lg:hidden">{tab.short}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="rounded-md bg-background px-4 py-2.5 shadow-md">
        <div className="mb-2 text-muted-foreground text-sm">
          Approval of Canvas Request
        </div>
        <div className="flex flex-row gap-4">
          {approvalTabs.map((tab) => (
            <div className="flex items-center justify-center" key={tab.name}>
              <Link
                href={tab.path}
                className={cn(
                  "relative line-clamp-2 w-[6.3rem] overflow-hidden rounded-lg border border-primary bg-background px-8 py-1.5 text-center font-thin text-gray-600 text-sm uppercase lg:line-clamp-none lg:w-full hover:border-2 hover:font-semibold hover:text-primary",
                  pathname === tab.path &&
                    "border-2 font-semibold text-primary",
                )}
              >
                <div className="hidden lg:block">
                  {tab.name} <br /> REQUEST
                </div>
                <div className="block lg:hidden">{tab.short}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
