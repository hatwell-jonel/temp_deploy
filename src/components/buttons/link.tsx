"use client";

import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { Loading } from "../fallbacks";

interface LinkButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  href: string;
}

export default function LinkButton({
  children,
  href,
  className,
  ...props
}: LinkButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      {...props}
      type="button"
      className={cn("flex w-full items-center gap-2", className)}
      onClick={() =>
        startTransition(() => {
          window.history.pushState(null, "", href);
          window.history.go();
        })
      }
    >
      {isPending ? <Loading /> : children}
    </button>
  );
}
