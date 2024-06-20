"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useState,
  useTransition,
} from "react";
import { Icons } from "./icons";

interface FilterTabsProps extends ComponentPropsWithoutRef<"button"> {
  tabs: {
    name: string;
    value: number;
    filterValue: string | null;
  }[];
}

interface FilterTabs1Props extends FilterTabsProps {
  searchParamsName: string;
  shortenOnMobile?: boolean;
}

export function FilterTabs1({
  searchParamsName,
  tabs,
  className,
  shortenOnMobile = true,
  ...props
}: FilterTabs1Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [clicked, setClicked] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const currentFilter =
    searchParams.get(searchParamsName) ?? tabs[0].filterValue;

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams],
  );

  return (
    <div className="flex">
      {tabs.map((tab, index) => {
        const currentTab = tab.filterValue;
        const replaceValue =
          currentFilter !== currentTab
            ? `${pathname}?${createQueryString({
                [searchParamsName]: currentTab,
              })}`
            : "#";

        const tabName = shortenOnMobile
          ? tab.name
              .split(" ")
              .map((word) => word.at(0))
              .join(" ")
          : tab.name;
        return (
          <button
            disabled={isPending}
            onClick={() => {
              setClicked(index);
              startTransition(() => {
                router.replace(replaceValue);
              });
            }}
            className={cn(
              "w-16 overflow-hidden border border-muted-foreground border-r-0 bg-background px-2.5 py-1 text-muted-foreground text-xs uppercase lg:w-fit",
              index === tabs.length - 1 && "rounded-tr-md border-r",
              index === 0 && "rounded-tl-md",
              currentFilter === currentTab && "bg-primary text-background",
              className,
            )}
            key={index}
            {...props}
          >
            <div className="flex justify-between">
              <div className="block xl:hidden">{tabName}</div>
              <div className="hidden xl:block">{tab.name}</div>
              {clicked && clicked === index && isPending ? (
                <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <div className="ml-2">{tab.value}</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
