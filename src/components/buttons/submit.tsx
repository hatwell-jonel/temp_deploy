"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButtonUnstyled({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { pending } = useFormStatus();
  return (
    <button {...props} disabled={pending}>
      {pending && (
        <Icons.spinner className="mr-2 inline-flex size-4 animate-spin" />
      )}{" "}
      {children}
    </button>
  );
}

interface SubmitButtonProps extends React.ComponentPropsWithRef<typeof Button> {
  promptMessage?: string;
}

export function SubmitButton({
  children,
  disabled,
  size = "long",
  promptMessage = "Are you sure you want to submit details?",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button className="hidden" type="submit" ref={ref} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size={"long"}
            {...props}
            type="button"
            disabled={pending || disabled}
          >
            {pending && (
              <Icons.spinner className="mr-2 inline-flex size-4 animate-spin" />
            )}
            {children}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xs">
          <div className="w-full text-balance text-center font-normal text-lg">
            {promptMessage}
          </div>
          <div className="flex items-center justify-center gap-2">
            <DialogTrigger asChild>
              <Button variant={"outlined"} type="button" size={"long"}>
                No
              </Button>
            </DialogTrigger>
            <Button
              type="button"
              onClick={() => {
                ref.current?.click();
                setOpen(false);
              }}
              size={"long"}
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
