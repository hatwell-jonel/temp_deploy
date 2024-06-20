"use client";

import PesoInputDecor from "@/components/peso-input-decor";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { create } from "../action";

export function Form({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [state, action] = useFormState(create, {
    message: undefined,
    success: undefined,
  });
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success("Successfully registered Service Requisition!");
      toast(state.message, {
        action: {
          label: "Copy",
          onClick: () => navigator.clipboard.writeText(state.message || ""),
        },
      });
      router.back();
    }
  }, [state, router]);
  return (
    <form {...props} action={action}>
      {children}
    </form>
  );
}

export function CategorySelect({ children }: React.PropsWithChildren) {
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
      name="category"
      onValueChange={(value) =>
        router.replace(`${pathname}?${createQueryString("categoryId", value)}`)
      }
    >
      {children}
    </Select>
  );
}

export function AutoCalculateEstimatedRate({
  descriptions,
}: {
  descriptions: Array<{
    id: number;
    description: string;
    price: number;
  }>;
}) {
  const [estimatedRate, setEstimatedRate] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>("");
  const [numberOfWorkers, setNumberOfWorkers] = React.useState<string>("");
  const [manHours, setManHours] = React.useState<string>("");

  React.useEffect(() => {
    if (description && numberOfWorkers && manHours) {
      const totalPrice = descriptions.find(
        (d) => d.id === Number(description),
      )?.price;
      if (totalPrice) {
        setEstimatedRate(
          totalPrice * Number(numberOfWorkers) * Number(manHours),
        );
      }
    }
  }, [description, numberOfWorkers, manHours, descriptions]);

  return (
    <>
      <TableCell className="px-1.5 text-center">
        <Select
          name="description"
          onValueChange={(value) => setDescription(value)}
          value={description}
        >
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="Service Description" />
          </SelectTrigger>
          <SelectContent>
            {descriptions.map((item) => (
              <SelectItem value={String(item.id)} key={item.id}>
                {item.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="px-1.5 text-center">
        <Input
          name="numberOfWorkers"
          value={numberOfWorkers}
          onChange={(e) => setNumberOfWorkers(e.target.value)}
        />
      </TableCell>
      <TableCell className="px-1.5 text-center">
        <Input
          name="manHours"
          value={manHours}
          onChange={(e) => setManHours(e.target.value)}
        />
      </TableCell>
      <TableCell className="px-1.5 text-center">
        <div className="relative">
          <Input
            name="estimatedRate"
            className="w-[180px] pl-6"
            readOnly
            value={estimatedRate}
          />
          <PesoInputDecor />
        </div>
      </TableCell>
    </>
  );
}
