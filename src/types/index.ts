import type { SideNavIcons as Icons } from "@/components/icons";
import type { ComponentPropsWithoutRef } from "react";
export interface SideNavItem {
  title: string;
  href: string;
  defaultPath?: string;
  icon?: keyof typeof Icons;
  subItems?: SideNavItem[];
}

export interface MainNavItem {
  title: string;
  href: string;
  disabled?: boolean;
  sideNav?: SideNavItem[];
}

export interface FormPropsWithReference
  extends ComponentPropsWithoutRef<"form"> {
  referenceNo: string;
}

export type RecurringCategory =
  | "airline"
  | "subscription"
  | "utility"
  | "rental";
