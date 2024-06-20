"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={className}
      {...props}
      disabled={pending || props.disabled}
    >
      {pending && (
        <Icons.spinner className="mr-2 inline-flex size-4 animate-spin" />
      )}
      {children}
    </Button>
  );
}
