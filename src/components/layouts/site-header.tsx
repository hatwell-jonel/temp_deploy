import { Icons } from "@/components/icons";
import { NavigationMenuMain } from "@/components/layouts/nav-menu";
import { ShowNavButton } from "@/components/show-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MainNavigation from "./main-navigation";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-10 bg-background print:hidden">
      <div className="relative flex h-[84px] justify-end shadow-[#00000029] shadow-lg">
        <ShowNavButton />
        <nav
          aria-label="main navigation"
          className="hidden gap-6 px-6 font-semibold text-[#8D8D8D] xl:block"
        >
          <MainNavigation />
        </nav>
        <NavigationMenuMain />

        <div className="flex flex-row items-center justify-center gap-4">
          {/* <Combobox /> */}
          <Notifications />
          <Suspense fallback="Loading user">
            <UserButton />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function Notifications() {
  return (
    <div className="relative">
      <Icons.bell className="text-foreground" />
      <div className="-top-1 absolute right-0">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
        </span>
      </div>
    </div>
  );
}

async function UserButton() {
  const data = await auth();
  if (!data?.user) redirect("/signin");
  const { user } = data;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex flex-row gap-2 bg-background text-foreground hover:bg-background">
          <UserAvatar name={user.name ?? "Anonymous"} src={user.image ?? ""} />
          <div className="hidden xl:flex">
            {user.name}
            <span className="ml-2">
              <Icons.triangleLeft
                className="-rotate-90 h-4 w-4 fill-primary"
                aria-hidden="true"
              />
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div>
            <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
            <Link href={"/signout"}>Log out</Link>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserAvatar({ name, src }: { name: string; src: string }) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={`Avatar of ${name}`} />
      <AvatarFallback className="uppercase">{name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
}
