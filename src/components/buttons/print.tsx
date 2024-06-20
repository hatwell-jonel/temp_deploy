"use client";

import { cn } from "@/lib/utils";
import { Printer } from "lucide-react";
import { Button } from "../ui/button";

export default function PrintButton({
  className,
  type = "button",
  size = "long",
  variant = "outline",
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button
      {...props}
      type={type}
      size={size}
      variant={variant}
      className={cn(
        "border-gray-400 text-foreground/70 text-xs shadow-md print:hidden hover:bg-primary hover:text-background",
        className,
      )}
      onClick={() => window.print()}
    >
      {children ? (
        children
      ) : (
        <>
          <Printer className="mr-2 inline-flex size-3.5 items-center" /> Print
        </>
      )}
    </Button>
  );
}
