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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { reasonForRejection } from "@/db/schema/fims";
import React, { useEffect, useOptimistic, useRef, useTransition } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { create, edit, toggleStatus } from "./action";

export function CreateForm({ title }: { title: string }) {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState(1);
  const [state, action] = useFormState(create, {
    success: undefined,
    message: undefined,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
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
      <DialogTrigger asChild>
        <Button
          size={"long"}
          className="w-full text-sm lg:mr-6 lg:w-fit lg:px-4"
        >
          Register {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Register Reason for Rejection</DialogTitle>
        </DialogHeader>
        <form className="space-y-2" action={action} ref={formRef}>
          <Label htmlFor={"name"} className="text-primary">
            Enter Reason for Rejection :
          </Label>
          {Array.from({ length: rows }).map((_, index) => (
            <div className="flex items-center gap-2" key={index}>
              <div className="flex-1">
                <Input name="name" />
              </div>
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
  defaultValues,
}: {
  defaultValues: typeof reasonForRejection.$inferSelect;
}) {
  const [open, setOpen] = React.useState(false);
  const [state, action] = useFormState(edit.bind(null, defaultValues.id), {
    success: undefined,
    message: undefined,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Reason for Rejection</DialogTitle>
        </DialogHeader>
        <form className="space-y-2" action={action} ref={formRef}>
          <Label htmlFor={"name"} className="text-primary">
            Edit Reason for Rejection :
          </Label>
          <Input name="name" defaultValue={defaultValues.name} />
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

export function ToggleSwitch({
  defaultValue,
  id,
}: {
  defaultValue: boolean;
  id: number;
}) {
  const [check, setCheck] = useOptimistic(defaultValue);
  const [isPending, startTransition] = useTransition();

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
