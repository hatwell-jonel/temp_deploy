"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { pesofy } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { transfer } from "./actions";

export function SelectYear({
  onValueChange,
  children,
  defaultValue,
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

  function updateYear(year: string) {
    router.replace(`${pathname}?${createQueryString("year", year)}`);
  }

  return (
    <Select
      {...props}
      onValueChange={updateYear}
      defaultValue={defaultValue || searchParams.get("year") || undefined}
    >
      {children}
    </Select>
  );
}

export function SelectCOA({
  onValueChange,
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
        router.replace(`${pathname}?${createQueryString("coaID", v)}`)
      }
    >
      {children}
    </Select>
  );
}

export function CreateForm({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [state, action] = useFormState(transfer, {
    message: undefined,
    success: undefined,
  });

  React.useEffect(() => {
    if (state.success && state.message) {
      for (const msg of state.message) {
        toast.success(msg);
      }
    }
    if (state.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form {...props} className={className} action={action}>
      {children}
    </form>
  );
}

interface SelectSearchParamsProps
  extends React.ComponentPropsWithoutRef<typeof Select> {
  paramKey: string;
}

export function SelectSearchParams({
  onValueChange,
  paramKey,
  children,
  ...props
}: SelectSearchParamsProps) {
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
        router.replace(`${pathname}?${createQueryString(paramKey, v)}`)
      }
    >
      {children}
    </Select>
  );
}

export function TransferredNewBalance({
  unavailed,
  method = "subtract",
  children,
}: {
  unavailed: number;
  method?: "add" | "subtract";
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const balanceToTransfer = searchParams.get("balanceToTransfer")
    ? Number(searchParams.get("balanceToTransfer"))
    : 0;

  function updateBalanceToTransfer(
    balance: React.ChangeEvent<HTMLInputElement>,
  ) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("balanceToTransfer", balance.currentTarget.value);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }

  const value =
    method === "add"
      ? unavailed + balanceToTransfer
      : unavailed - balanceToTransfer;

  const inputName = method === "add" ? "to.amount" : "from.amount";

  return (
    <>
      <div className="relative">
        {children}
        <Input
          type="number"
          onChange={updateBalanceToTransfer}
          value={balanceToTransfer}
          className="text-right"
          disabled={method === "add"}
          step="1000"
        />
        <p className="absolute top-6 left-8">{method === "add" ? "+" : "-"} </p>
      </div>
      <div className="flex justify-between border-gray-400 border-y py-2">
        <div> New Balance</div>
        <div className="text-primary underline decoration-primary underline-offset-2">
          {pesofy(value)}
          <input type="hidden" name={inputName} value={value} />
        </div>
      </div>
    </>
  );
}
