"use client";

import { SubmitButton } from "@/components/buttons/submit";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { create, edit, toggleStatus } from "./action";

export function CreateForm({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState(1);
  const [state, action] = useFormState(create, {
    success: undefined,
    message: undefined,
  });
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success === true) {
      toast.success(state.message);
      formRef.current?.reset();
      setOpen(false);
      setRows(1);
    } else if (state.success === false) {
      toast.error(state.message);
    }
  }, [state]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"long"}
          className="w-full text-sm lg:mr-6 lg:w-fit lg:px-4"
        >
          Register {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Register Service Description</DialogTitle>
        </DialogHeader>
        <form className="space-y-2" action={action} ref={formRef}>
          <div className="flex w-full flex-1 text-primary text-xs">
            <div className="w-1/3">Category</div>
            <div className="w-1/3">Service Description</div>
            <div className="w-1/3">Estimated Market Price</div>
            <div className="size-4" />
          </div>
          {Array.from({ length: rows }).map((_, index) => (
            <div className="flex items-center gap-2" key={index}>
              {children}
              {rows === index + 1 ? (
                <Button
                  type="button"
                  size={"icon"}
                  className="size-5 rounded-full p-1"
                  onClick={() => setRows(rows + 1)}
                >
                  <Icons.add />
                </Button>
              ) : (
                <Button
                  type="button"
                  size={"icon"}
                  variant={"destructive"}
                  className="size-5 rounded-full p-1"
                  onClick={() => setRows(rows - 1)}
                >
                  <Icons.subtract />
                </Button>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-4">
            <DialogTrigger asChild>
              <Button size="long" variant={"outlined"} type="button">
                Back
              </Button>
            </DialogTrigger>
            <SubmitButton type="submit">SUBMIT</SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditForm({
  children,
  id,
}: {
  id: number;
} & React.PropsWithChildren) {
  const [open, setOpen] = React.useState(false);
  const [state, action] = useFormState(edit.bind(null, id), {
    success: undefined,
    message: undefined,
  });
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success === true) {
      toast.success(state.message);
      formRef.current?.reset();
      setOpen(false);
    } else if (state.success === false) {
      toast.error(state.message);
    }
  }, [state]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Icons.edit />
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Service Description</DialogTitle>
        </DialogHeader>
        <form className="space-y-2" action={action} ref={formRef}>
          {children}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ToggleSwitch({
  defaultValue,
  id,
}: {
  defaultValue: boolean;
  id: number;
}) {
  const [check, setCheck] = React.useOptimistic(defaultValue);
  const [isPending, startTransition] = React.useTransition();

  return (
    <Switch
      onCheckedChange={(checked) => {
        setCheck(checked);
        startTransition(async () => {
          const response = await toggleStatus(id);
          if (!response.ok) toast.error(response.message);
        });
      }}
      defaultChecked={defaultValue}
    />
  );
}
