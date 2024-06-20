import { TitleCard } from "@/components/cards/title";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const title = "Data Management";

export const metadata = {
  title,
};

const baseHref = "/fims/purchasing/data-mgmt";

const budgetTagging = [
  {
    href: `${baseHref}/item-category`,
    name: "Item Category",
  },
  {
    href: `${baseHref}/service-category`,
    name: "Service Category",
  },
  {
    href: `${baseHref}/item-description`,
    name: "Item Description",
  },
  {
    href: `${baseHref}/service-description`,
    name: "Service Description",
  },
];

const management = [
  {
    href: `${baseHref}/budget-source`,
    name: "Budget Source",
  },
  {
    href: `${baseHref}/opex-category`,
    name: "OpEx Category",
  },
  {
    href: `${baseHref}/chart-of-accounts`,
    name: "Chart of Accounts",
  },
  {
    href: `${baseHref}/sub-accounts`,
    name: "Sub Accounts",
  },
  {
    href: `${baseHref}/reasons-for-rejection`,
    name: "Reasons for rejection",
  },
  {
    href: `${baseHref}/purpose`,
    name: "Purpose",
  },
  {
    href: `${baseHref}/unit`,
    name: "Unit",
  },
  {
    href: `${baseHref}/industry`,
    name: "Industry",
  },
];

export default function DataMgmtPage() {
  return (
    <>
      <div className="flex flex-col gap-6 py-8">
        <TitleCard title={title}>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"outlined"}
                  className="group flex flex-row gap-2 border-2 font-semibold text-primary hover:bg-primary hover:text-background"
                >
                  Budget Tagging
                  <span className="ml-2">
                    <Icons.triangleLeft
                      className="-rotate-90 h-4 w-4 fill-primary group-hover:fill-white"
                      aria-hidden="true"
                    />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuGroup>
                  {budgetTagging.map((item, index) => (
                    <DropdownMenuItem asChild key={index}>
                      <Link href={item.href}>{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"outlined"}
                  className="group flex flex-row gap-2 border-2 font-semibold text-primary hover:bg-primary hover:text-background"
                >
                  Management
                  <span className="ml-2">
                    <Icons.triangleLeft
                      className="-rotate-90 h-4 w-4 fill-primary group-hover:fill-white"
                      aria-hidden="true"
                    />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuGroup>
                  {management.map((item, index) => (
                    <DropdownMenuItem asChild key={index}>
                      <Link href={item.href}>{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TitleCard>
      </div>
    </>
  );
}
