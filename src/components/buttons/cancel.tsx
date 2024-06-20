"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CancelButton({
  children = "Cancel",
  variant = "outlined",
  size = "long",
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      size={size}
      {...props}
      type="button"
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
