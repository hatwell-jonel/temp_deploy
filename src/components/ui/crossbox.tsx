"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const CrossBox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-[#707070] ring-offset-background disabled:cursor-not-allowed data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <X className="size-4" strokeWidth={4} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
CrossBox.displayName = CheckboxPrimitive.Root.displayName;

export { CrossBox };
