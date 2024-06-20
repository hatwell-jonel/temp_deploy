"use client";

import { Switch } from "@/components/ui/switch";
import * as React from "react";
import { toast } from "sonner";
import { edit, toggleStatus } from "./action";

import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { create } from "./action";

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

type DialogContextProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DialogContext = React.createContext<DialogContextProps>({
  open: false,
  setOpen: () => {},
});

export function DialogForm({ children }: React.PropsWithChildren) {
  const [open, setOpen] = React.useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <Dialog onOpenChange={setOpen} open={open}>
        {children}
      </Dialog>
    </DialogContext.Provider>
  );
}

export function Form({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [state, action] = useFormState(create, {
    message: undefined,
    success: undefined,
  });
  const { setOpen } = React.useContext(DialogContext);
  const router = useRouter();
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      setOpen(false);
      toast.success(state.message);
      router.refresh();
    }
  }, [state, router, setOpen]);
  return (
    <form
      {...props}
      action={action}
      key={state.success !== true ? "static" : Math.random()}
    >
      {children}
    </form>
  );
}

interface EditFormProps extends React.ComponentPropsWithoutRef<"form"> {
  tableId: number;
}

export function EditForm({ children, tableId, ...props }: EditFormProps) {
  const [state, action] = useFormState(edit.bind(null, tableId), {
    message: undefined,
    success: undefined,
  });
  const { setOpen } = React.useContext(DialogContext);
  const router = useRouter();
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      setOpen(false);
      toast.success(state.message);
      router.refresh();
    }
  }, [state, router, setOpen]);
  return (
    <form
      {...props}
      action={action}
      key={state.success !== true ? "static" : Math.random()}
    >
      {children}
    </form>
  );
}
