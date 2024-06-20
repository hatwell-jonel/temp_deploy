"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { create } from "../action";

export function TableRowWrapper({ children }: React.PropsWithChildren) {
  const [rows, setRows] = React.useState(1);
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => {
        const isLast = index + 1 === rows;
        return (
          <TableRow key={index} className="odd:bg-[#F9FAFB]">
            {children}
            <TableCell className="gap-2 text-center">
              {!isLast && (
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
              {!!isLast && (
                <Button
                  type="button"
                  size={"icon"}
                  className="size-5 rounded-full p-1"
                  onClick={() => setRows(rows + 1)}
                >
                  <Icons.add />
                </Button>
              )}
            </TableCell>
          </TableRow>
        );
      })}
    </>
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
