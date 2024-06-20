"use client";

import AttachmentButtonInput from "@/components/buttons/attachment";
import { DatePickerWithPresets } from "@/components/date-picker";
import { Icons } from "@/components/icons";
import PesoInputDecor from "@/components/peso-input-decor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import type {
  itemDescription,
  methodOfDelivery,
  paymentMode,
  paymentOption,
  supplier,
} from "@/db/schema/fims";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { create } from "./action";

interface FormWithReferenceProps
  extends React.ComponentPropsWithoutRef<"form"> {
  referenceNo: string;
}

export function Form({
  children,
  referenceNo,
  ...props
}: FormWithReferenceProps) {
  const [state, action] = useFormState(create.bind(null, referenceNo), {
    message: undefined,
    success: undefined,
  });
  const router = useRouter();
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success("Successfully registered Canvas Request - PR!");
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
    <form
      {...props}
      action={action}
      key={state.success !== true ? "static" : Math.random()}
    >
      {children}
    </form>
  );
}

function TotalPriceCells({ row, quantity }: { row: string; quantity: number }) {
  const [total, setTotal] = React.useState<number>(0);

  return (
    <>
      <TableCell className="px-1.5 text-center">
        <div className="relative">
          <Input
            name={`detail.${row}.unitPrice`}
            className="w-[180px] pl-6"
            type="number"
            onChange={(e) => setTotal(e.currentTarget.valueAsNumber)}
          />
          <PesoInputDecor />
        </div>
      </TableCell>
      <TableCell className="px-1.5 text-center">
        <div className="relative">
          <Input className="w-[180px] pl-6" value={total * quantity} disabled />
          <PesoInputDecor />
        </div>
      </TableCell>
    </>
  );
}

interface SelectPaymentOptionProps extends React.PropsWithChildren {
  row: string;
}

function SelectPaymentOption({ children, row }: SelectPaymentOptionProps) {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const ref = React.useRef<HTMLInputElement | null>(null);
  const oneTimeValue = "1";

  React.useEffect(() => {
    if (value && ref.current) {
      ref.current.value = value === "1" ? "1" : "2";
    }
  }, [value]);

  return (
    <>
      <TableCell className="px-1.5 text-center">
        <Select
          name={`detail.${row}.paymentOptionId`}
          onValueChange={(v) => setValue(v)}
        >
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="Payment Option" />
          </SelectTrigger>
          {children}
        </Select>
      </TableCell>
      <TableCell className="px-1.5 text-center">
        <Input
          ref={ref}
          readOnly={value === oneTimeValue}
          name={`detail.${row}.installmentTerms`}
        />
      </TableCell>
    </>
  );
}

type TableRowFormProps = {
  suppliers: (typeof supplier.$inferSelect)[];
  description: typeof itemDescription.$inferSelect;
  paymentOptions: (typeof paymentOption.$inferSelect)[];
  paymentModes: (typeof paymentMode.$inferSelect)[];
  methodOfDeliveries: (typeof methodOfDelivery.$inferSelect)[];
  quantity: number;
  rowNumber: number;
  defaultSupplierId: number | null;
} & React.ComponentPropsWithoutRef<typeof TableRow>;

export function TableRowForm({
  description,
  rowNumber,
  className,
  quantity,
  paymentModes,
  paymentOptions,
  methodOfDeliveries,
  suppliers,
  defaultSupplierId,
  ...props
}: TableRowFormProps) {
  const [rows, setRows] = React.useState(3);
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => {
        const isLast = index + 1 === rows;
        return (
          <TableRow
            {...props}
            className={cn(className, "odd:bg-gray-100")}
            key={index}
          >
            {index === 0 && (
              <TableCell className="px-1.5 text-center" rowSpan={rows}>
                {description.description}
              </TableCell>
            )}
            <TableCell className="px-1.5 text-center">
              <input
                type="hidden"
                name={`detail.${rowNumber * 10 + index}.quantity`}
                value={quantity}
              />
              <input
                type="hidden"
                name={`detail.${rowNumber * 10 + index}.itemDescriptionId`}
                value={String(description.id)}
              />
              {quantity}
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <Select
                name={`detail.${rowNumber * 10 + index}.supplierId`}
                defaultValue={
                  defaultSupplierId && index === 0
                    ? String(defaultSupplierId)
                    : undefined
                }
              >
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TotalPriceCells
              quantity={quantity}
              row={String(rowNumber * 10 + index)}
            />
            <TableCell className="px-1.5 text-center">
              <DatePickerWithPresets
                name={`detail.${rowNumber * 10 + index}.deliveryDate`}
              />
            </TableCell>
            <SelectPaymentOption row={String(rowNumber * 10 + index)}>
              <SelectContent>
                {paymentOptions.map((item) => (
                  <SelectItem value={String(item.id)} key={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPaymentOption>
            <TableCell className="px-1.5 text-center">
              <Input name={`detail.${rowNumber * 10 + index}.paymentTerms`} />
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <Select name={`detail.${rowNumber * 10 + index}.paymentModeId`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <Select
                name={`detail.${rowNumber * 10 + index}.methodOfDeliveryId`}
              >
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Method of Delivery" />
                </SelectTrigger>
                <SelectContent>
                  {methodOfDeliveries.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <AttachmentButtonInput
                name={`detail.${rowNumber * 10 + index}.file`}
                multiple
              />
            </TableCell>
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

export function CheckBoxModified({ row }: { row: number }) {
  const [value, setValue] = React.useState(false);
  return (
    <>
      <Checkbox onCheckedChange={(v) => setValue(v === true)} />
      <input
        type="hidden"
        value={String(value)}
        name={`detail.${row}.isSample`}
      />
    </>
  );
}
