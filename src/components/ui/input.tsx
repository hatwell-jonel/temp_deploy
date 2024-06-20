import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autoComplete = "off", ...props }, ref) => {
    return (
      <input
        type={type}
        autoComplete={autoComplete}
        className={cn(
          "flex h-8 w-full rounded-sm border border-[#707070] bg-background px-3 py-2 text-foreground text-xs ring-offset-background disabled:cursor-not-allowed read-only:cursor-not-allowed file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground disabled:opacity-50 read-only:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
