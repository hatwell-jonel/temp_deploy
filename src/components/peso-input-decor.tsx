import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface PesoInputDecorProps extends ComponentPropsWithoutRef<"span"> {}

export default function PesoInputDecor({
  className,
  ...props
}: PesoInputDecorProps) {
  return (
    <>
      <span
        className={cn("absolute top-2 left-2 text-gray-400 text-sm", className)}
        {...props}
      >
        ₱
      </span>
    </>
  );
}
