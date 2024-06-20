"use client";

import { Select } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { edit } from "../../action";

interface FormProps extends React.ComponentPropsWithoutRef<"form"> {
  supplierId: number;
}

export function Form({ children, supplierId, ...props }: FormProps) {
  const [state, action] = useFormState(edit.bind(null, supplierId), {
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
    <form
      {...props}
      action={action}
      key={state.success === true ? Math.random() : "static"}
    >
      {children}
    </form>
  );
}

interface SelectWithRouterProps
  extends React.ComponentPropsWithoutRef<typeof Select> {
  queryKey: string;
}

export function SelectWithRouter({
  children,
  queryKey,
  ...props
}: SelectWithRouterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  return (
    <Select
      {...props}
      onValueChange={(value) =>
        router.push(`${pathname}?${createQueryString(queryKey, value)}`)
      }
    >
      {children}
    </Select>
  );
}
