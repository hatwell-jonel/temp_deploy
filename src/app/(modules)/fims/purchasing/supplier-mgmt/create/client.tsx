"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { create } from "../action";

export function Form({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [state, action] = useFormState(create, {
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

type Context = {
  confirmed: boolean;
  setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
};

const confirmContext = React.createContext<Context>({
  confirmed: false,
  setConfirmed: () => {},
});

interface ConfirmButtonProps {
  children: React.ReactNode;
  formId: string | number;
}

export function ConfirmButton({ children, formId }: ConfirmButtonProps) {
  const [confirmed, setConfirmed] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (confirmed) {
      buttonRef.current?.click();
    }
  }, [confirmed]);
  return (
    <confirmContext.Provider value={{ confirmed, setConfirmed }}>
      <Dialog>
        <DialogTrigger asChild>
          <Button size={"long"}>OK</Button>
        </DialogTrigger>
        <DialogContent>
          <div>{children}</div>
          <div className="flex justify-end gap-2">
            <DialogTrigger asChild>
              <Button variant={"outlined"} size={"long"}>
                No
              </Button>
            </DialogTrigger>
            <Button
              size={"long"}
              onClick={() => {
                startTransition(async () => {
                  setConfirmed(true);
                });
              }}
              disabled={isPending}
            >
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                "Yes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </confirmContext.Provider>
  );
}
