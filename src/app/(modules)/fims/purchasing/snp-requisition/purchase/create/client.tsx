"use client";

import AttachmentButtonInput from "@/components/buttons/attachment";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { create } from "../action";
import type {
  Categories,
  Descriptions,
  Locations,
  PreferredSuppliers,
  Purposes,
  Units,
} from "../helpers";

export function Form({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [state, action] = useFormState(create, {
    message: undefined,
    success: undefined,
  });
  const router = useRouter();
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success("Successfully registered Purchase Requisition!");
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

export function SelectCategory({
  categories,
  descriptions,
  row,
}: {
  categories: Categories;
  descriptions: Descriptions;
  row: number;
}) {
  const [categoryId, setCategoryId] = React.useState<number | undefined>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function updateSearchParams(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    const newPath = `${pathname}?${params.toString()}`;
    router.replace(newPath);
  }
  return (
    <>
      <TableCell className="px-1.5 text-center">
        <Select
          onValueChange={(v) => setCategoryId(Number(v))}
          name={`detail.${row}.category`}
        >
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="Item Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((item) => (
              <SelectItem value={String(item.id)} key={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="px-1.5 text-center">
        <Select
          name={`detail.${row}.description`}
          onValueChange={(v) => {
            updateSearchParams(
              `estimatedPrice.${row}`,
              String(descriptions.find((d) => d.id === Number(v))?.price || 0),
            );
          }}
        >
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="Item Description" />
          </SelectTrigger>
          <SelectContent>
            {descriptions
              .filter((d) => Number(d.itemCategoryId) === categoryId)
              .map((item) => (
                <SelectItem value={String(item.id)} key={item.id}>
                  {item.description}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </TableCell>
    </>
  );
}

type TableRowFormProps = {
  descriptions: Descriptions;
  categories: Categories;
  units: Units;
  locations: Locations;
  preferredSuppliers: PreferredSuppliers;
  purposes: Purposes;
} & React.ComponentPropsWithoutRef<typeof TableRow>;

type FormValues = {
  detail: {
    quantity: number;
  }[];
};

export function TableRowForm({
  descriptions,
  categories,
  locations,
  preferredSuppliers,
  purposes,
  units,
  ...props
}: TableRowFormProps) {
  const { control } = useForm<FormValues>({
    defaultValues: {
      detail: [
        {
          quantity: 1,
        },
      ],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "detail",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function updateSearchParams(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    const newPath = `${pathname}?${params.toString()}`;
    router.replace(newPath);
  }

  return (
    <>
      {fields.map((field, index) => {
        const estimatedPrice = searchParams.get(`estimatedPrice.${index}`)
          ? Number(searchParams.get(`estimatedPrice.${index}`))
          : 0;
        const quantity = searchParams.get(`quantity.${index}`)
          ? Number(searchParams.get(`quantity.${index}`))
          : 1;
        const estimatedTotal = estimatedPrice * quantity;
        const isLast = index + 1 === fields.length;
        return (
          <TableRow {...props} key={field.id}>
            <SelectCategory
              categories={categories}
              descriptions={descriptions}
              row={index}
            />

            <TableCell className="px-1.5 text-center">
              <Input
                name={`detail.${index}.quantity`}
                className="w-[60px]"
                defaultValue={field.quantity}
                onChange={(e) =>
                  updateSearchParams(`quantity.${index}`, e.target.value)
                }
              />
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <Select name={`detail.${index}.unit`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <div className="relative">
                <Input
                  name={`detail.${index}.estimatedPrice`}
                  className="w-[180px] pl-6"
                  readOnly
                  value={String(estimatedPrice)}
                />
                <PesoInputDecor />
              </div>
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <div className="relative">
                <Input
                  name={`detail.${index}.estimatedTotal`}
                  className="w-[180px] pl-6"
                  value={String(estimatedTotal)}
                  readOnly
                />
                <PesoInputDecor />
              </div>
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <Select name={`detail.${index}.purpose`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <Select name={`detail.${index}.beneficiaryBranch`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="MNL" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <Select name={`detail.${index}.preferredSupplier`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {preferredSuppliers.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <Input name={`detail.${index}.remarks`} className="w-[180px]" />
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <CheckBoxModified row={index} />
            </TableCell>
            <TableCell className="px-1.5 text-center">
              <AttachmentButtonInput name={`detail.${index}.file`} multiple />
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    size={"icon"}
                    variant={"destructive"}
                    className="size-5 rounded-full p-1"
                    onClick={() => remove(index)}
                  >
                    <Icons.subtract />
                  </Button>
                )}
                {!!isLast && (
                  <Button
                    type="button"
                    size={"icon"}
                    className="size-5 rounded-full p-1"
                    onClick={() => append({ quantity: 1 })}
                  >
                    <Icons.add />
                  </Button>
                )}
              </div>
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
