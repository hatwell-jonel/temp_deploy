"use client";

import { MainNav } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIndicator } from "../indicators/nav";

export default function MainNavigation() {
  const path = usePathname();
  return (
    <>
      <div className="flex h-full flex-row gap-4">
        {MainNav.map((item, index) => {
          return (
            <Link
              href={item.disabled ? "#" : item.href}
              key={index}
              className={cn(
                "relative flex h-full items-center justify-center p-4",
                path.startsWith(item.href) && "text-primary",
                item.disabled && "cursor-not-allowed",
              )}
            >
              {item.title.toUpperCase()}
              {path.startsWith(item.href) && (
                <>
                  <NavIndicator
                    className="-bottom-1 absolute left-0 z-20 h-1.5 w-full rounded-full bg-primary"
                    layoutId="bubbleMain"
                  />
                  <NavIndicator
                    className="absolute inset-0 bg-primary/10"
                    layoutId="insetCover"
                  />
                </>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
