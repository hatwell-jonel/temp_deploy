"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MainNav } from "@/config/site";
import { cn } from "@/lib/utils";

export function NavigationMenuMain() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="block xl:hidden">
          <NavigationMenuTrigger className="mr-2 font-bold">
            Menu
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[150px] uppercase">
              {MainNav.map((nav, index) => (
                <ListItem
                  className={cn(
                    "",
                    nav.disabled && "cursor-not-allowed text-muted-foreground",
                  )}
                  key={index}
                  title={nav.title}
                  href={nav.disabled ? "#" : nav.href}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent hover:bg-accent focus:text-accent-foreground hover:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="font-bold text-sm leading-none">{title}</div>
          <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
