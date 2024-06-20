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
import type { serviceDescription } from "@/db/schema/fims";
import { cn } from "@/lib/utils";
import type { FormPropsWithReference } from "@/types";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import type { PreferredWorkers } from "../../helpers";
import { create } from "./action";

export function Form({
  children,
  referenceNo,
  ...props
}: FormPropsWithReference) {
  const [state, action] = useFormState(create.bind(null, referenceNo), {
    message: undefined,
    success: undefined,
  });
  const router = useRouter();
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success("Successfully registered Canvas Request - SR!");
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

function TotalRateCells({ row }: { row: number }) {
  const [hours, setHours] = React.useState<number>(0);
  const [rate, setRate] = React.useState<number>(0);

  return (
    <>
      <TableCell className="px-1.5 text-center">
        <Input
          name={`detail.${row}.hours`}
          type="number"
          onChange={(e) => setHours(e.currentTarget.valueAsNumber)}
        />
      </TableCell>
      <TableCell className="px-1.5 text-center">
        <Input name={`detail.${row}.extentOfWork`} type="text" />
      </TableCell>
      <TableCell className="px-1.5 text-center">
        <div className="relative">
          <Input
            name={`detail.${row}.rate`}
            className="w-[180px] pl-6"
            type="number"
            onChange={(e) => setRate(e.currentTarget.valueAsNumber)}
          />
          <PesoInputDecor />
        </div>
      </TableCell>
      <TableCell className="px-1.5 text-center">
        <div className="relative">
          <Input className="w-[180px] pl-6" value={rate * hours} disabled />
          <PesoInputDecor />
        </div>
      </TableCell>
    </>
  );
}

type TableRowFormProps = {
  preferredWorkers: PreferredWorkers;
  description: typeof serviceDescription.$inferSelect;
} & React.ComponentPropsWithoutRef<typeof TableRow>;

export function TableRowForm({
  description,
  className,
  preferredWorkers,
  ...props
}: TableRowFormProps) {
  const [rows, setRows] = React.useState(1);
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => {
        const isLast = index + 1 === rows;
        return (
          <TableRow
            {...props}
            key={index}
            className={cn(className, "odd:bg-gray-100")}
          >
            {index === 0 && (
              <TableCell className="px-1.5 text-center" rowSpan={rows}>
                {description.description}
              </TableCell>
            )}
            <TableCell className="px-1.5 text-center">
              <input
                type="hidden"
                name={`detail.${index}.serviceDescriptionId`}
                value={description.id}
              />
              <Select name={`detail.${index}.workerId`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Worker" />
                </SelectTrigger>
                <SelectContent>
                  {preferredWorkers.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <DatePickerWithPresets name={`detail.${index}.startDate`} />
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <DatePickerWithPresets name={`detail.${index}.endDate`} />
            </TableCell>
            <TotalRateCells row={index} />
            <TableCell className="px-1.5 text-center">
              <AttachmentButtonInput name={`detail.${index}.file`} multiple />
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
