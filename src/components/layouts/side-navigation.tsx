"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MainNav } from "@/config/site";
import { useHidden } from "@/hooks/use-hidden";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Icons, SideNavIcons } from "../icons";
import { NavIndicator } from "../indicators/nav";
import { HomeLink } from "./home-link";

export function SideNav() {
  const { isHidden, setIsHidden } = useHidden();
  if (isHidden) return null;
  return (
    <>
      <aside
        className={cn(
          "sticky top-0 left-0 z-20 hidden h-screen w-[350px] bg-background shadow-lg xl:block print:hidden",
        )}
      >
        <div className="relative flex flex-col">
          <div className="z-40 flex flex-row items-center justify-between gap-12 p-4">
            <HomeLink />
            <button
              className="-mt-6"
              onClick={() => {
                setIsHidden(!isHidden);
              }}
            >
              <Icons.close className="h-5 w-5" fill="#003399" />
            </button>
          </div>
          <AccordionNav />
        </div>
      </aside>
    </>
  );
}

export function AccordionNav() {
  const pathname = usePathname();
  const SideBar = MainNav.find((nav) => pathname.startsWith(nav.href))?.sideNav;
  const value = pathname.split("/")[2];
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full lg:pr-4 lg:pl-6"
      defaultValue={value}
    >
      {SideBar?.map((item, index) => {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const Icon = SideNavIcons[item.icon!];
        return (
          <Fragment key={index}>
            <AccordionItem
              value={item.title.toLowerCase()}
              className="border-none"
            >
              <AccordionTrigger
                className={cn(
                  "relative flex w-full justify-between py-2 hover:no-underline",
                  pathname.startsWith(item.href) &&
                    "[&[data-state=open]>svg]:fill-primary",
                )}
              >
                <div
                  className={cn(
                    "flex flex-row items-start justify-start gap-2",
                    pathname.startsWith(item.href)
                      ? "font-semibold text-primary"
                      : "text-[#3A3A3A]",
                  )}
                >
                  {item.icon && (
                    <Icon isFilled={pathname.startsWith(item.href)} />
                  )}
                  <div className="flex-1 text-left">{item.title}</div>
                </div>
                {pathname.startsWith(item.href) && (
                  <NavIndicator
                    className="-left-6 absolute top-0 h-full w-1 bg-primary"
                    layoutId="bubbleSide"
                  />
                )}
              </AccordionTrigger>

              <AccordionContent>
                <div className="mx-[20px] ml-10 flex flex-col gap-2 font-medium">
                  {item.subItems?.map((subItem) => {
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        prefetch={false}
                        className={
                          pathname.startsWith(subItem.href)
                            ? "font-semibold text-primary"
                            : "text-[#3A3A3A]"
                        }
                      >
                        {subItem.title}
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Fragment>
        );
      })}
    </Accordion>
  );
}
