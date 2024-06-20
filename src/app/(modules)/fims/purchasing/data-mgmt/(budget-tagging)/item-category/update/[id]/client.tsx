"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { edit } from "../../action";

interface FormProps extends React.ComponentPropsWithoutRef<"form"> {
  itemCategoryId: number;
}

export function Form({ children, itemCategoryId, ...props }: FormProps) {
  const [state, action] = useFormState(edit.bind(null, itemCategoryId), {
    message: undefined,
    success: undefined,
  });
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
