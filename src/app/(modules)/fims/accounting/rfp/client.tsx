"use client";

import {
  approveOrDecline,
  create,
  search,
} from "@/app/(modules)/fims/accounting/rfp/action";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

export function VatRadioGroup({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroup>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  return (
    <RadioGroup
      className={className}
      {...props}
      onValueChange={(v) =>
        router.replace(`${pathname}?${createQueryString("vat", v)}`, {
          scroll: false,
        })
      }
    >
      {children}
    </RadioGroup>
  );
}

export function SelectEwt({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Select>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
      onValueChange={(v) =>
        router.replace(`${pathname}?${createQueryString("ewt", v)}`, {
          scroll: false,
        })
      }
    >
      {children}
    </Select>
  );
}

interface ModifiedFormProps extends React.ComponentPropsWithoutRef<"form"> {
  referenceNo: string;
  actionType: "create" | "approve";
}

export function Form({
  children,
  action,
  actionType,
  referenceNo,
  ...props
}: ModifiedFormProps) {
  const formAction =
    actionType === "create"
      ? create.bind(null, referenceNo)
      : approveOrDecline.bind(null, referenceNo);
  const router = useRouter();
  const [state, dispatch] = useFormState(formAction, {
    message: undefined,
    success: undefined,
  });
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
      router.push("/fims/accounting/rfp");
    }
  }, [state, router]);
  return (
    <form {...props} action={dispatch}>
      {children}
    </form>
  );
}

export function SearchForm({
  children,
}: React.ComponentPropsWithoutRef<"form">) {
  // const searchParams = useSearchParams();
  const [state, dispatch] = useFormState(search, {
    message: undefined,
    success: undefined,
  });

  return (
    <>
      <form className="flex items-end gap-6" action={dispatch}>
        {children}
      </form>
    </>
  );
}

export function SearchButton({
  children,
  disabled,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending}>
      {pending && (
        <Icons.spinner className="mr-2 inline-flex size-4 animate-spin" />
      )}{" "}
      {children}
    </Button>
  );
}
