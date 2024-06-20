"use client";

import { Dialog } from "@/components/ui/dialog";
import type { FormPropsWithReference as FormProps } from "@/types";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { approveOrDecline, review } from "./action";

export function ReviewerForm({ children, referenceNo, ...props }: FormProps) {
  const [state, action] = useFormState(review.bind(null, referenceNo), {
    message: undefined,
    success: undefined,
  });
  const formRef = React.useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
      formRef.current?.reset();
    }
  }, [state]);
  return (
    <form {...props} action={action} ref={formRef}>
      {children}
    </form>
  );
}

export function ApproverForm({ children, referenceNo, ...props }: FormProps) {
  const [state, action] = useFormState(
    approveOrDecline.bind(null, referenceNo),
    {
      message: undefined,
      success: undefined,
    },
  );
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
    }
  }, [state]);
  return (
    <form {...props} action={action}>
      {children}
    </form>
  );
}

type DialogContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DialogContext = React.createContext<DialogContextType>({
  open: false,
  setOpen: () => {},
});

export function DialogWithForm({ children }: React.PropsWithChildren) {
  const [open, setOpen] = React.useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </DialogContext.Provider>
  );
}

export function RejectForm({ children, referenceNo, ...props }: FormProps) {
  const { setOpen } = React.useContext(DialogContext);
  const [state, action] = useFormState(
    approveOrDecline.bind(null, referenceNo),
    {
      message: undefined,
      success: undefined,
    },
  );
  const formRef = React.useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state, setOpen]);
  return (
    <form {...props} action={action} ref={formRef}>
      {children}
    </form>
  );
}
