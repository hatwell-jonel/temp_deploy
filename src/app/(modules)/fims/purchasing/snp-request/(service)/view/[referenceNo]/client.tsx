"use client";

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
