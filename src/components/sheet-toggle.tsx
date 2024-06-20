import { Icons } from "@/components/icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HomeLink } from "./layouts/home-link";
import { AccordionNav } from "./layouts/side-navigation";

export function SheetToggle() {
  return (
    <>
      <Sheet modal={false}>
        <SheetTrigger>
          <Icons.hamburger className="h-5 w-5" fill="#003399" />
        </SheetTrigger>
        <SheetContent side={"left"} className="block xl:hidden">
          <HomeLink className="ml-4" />
          <AccordionNav />
        </SheetContent>
      </Sheet>
    </>
  );
}
