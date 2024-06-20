"use client";

import { useHidden } from "@/hooks/use-hidden";
import { Icons } from "./icons";
import { SheetToggle } from "./sheet-toggle";

export function ShowNavButton() {
  const { isHidden, setIsHidden } = useHidden();
  return (
    <>
      <div className="absolute top-0 left-0 hidden xl:block">
        {isHidden ? (
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="flex flex-1 items-center justify-center p-8"
          >
            <Icons.hamburger className="h-5 w-5" fill="#003399" />
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className="absolute top-0 left-0 block xl:hidden">
        <div className="flex flex-1 items-center justify-center p-8">
          <SheetToggle />
        </div>
      </div>
    </>
  );
}
