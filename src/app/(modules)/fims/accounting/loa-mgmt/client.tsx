"use client";
import { Icons } from "@/components/icons";
import PesoInputDecor from "@/components/peso-input-decor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import type { users } from "@/db/schema/_pulled";
import type { budgetSource } from "@/db/schema/fims";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState as ReactUFS } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { create, edit, toggleStatus } from "./action";

type FormValues = {
  detail: {
    level: number[];
  }[];
};

export function RowWrapper({
  divisionItems,
  userItems,
}: {
  divisionItems: (typeof budgetSource.$inferSelect)[];
  userItems: (typeof users.$inferSelect)[];
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      detail: [
        {
          level: [0, 1, 2],
        },
      ],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "detail", // unique name for your Field Array
  });

  const searchParams = useSearchParams();

  const subModuleId = searchParams.get("subModuleId") || "";

  return (
    <>
      {fields.map((field, idx) => (
        <React.Fragment key={field.id}>
          {field.level.map((v, index) => {
            const value = v + idx * 3;
            const minVal = v === 0 ? 1 : v === 1 ? 10001 : 100001;
            const maxVal = v === 0 ? 10000 : v === 1 ? 100000 : 1000000;
            return (
              <TableRow
                key={value}
                className={v === 2 ? "border-gray-400 border-b" : ""}
              >
                {v === 0 && (
                  <TableCell className="border-gray-400 border-r" rowSpan={3}>
                    <SelectDivision
                      rows={field.level.map((l) => l + idx * 3)}
                      fieldNumber={idx}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Division" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisionItems.map((item) => (
                          <SelectItem value={String(item.id)} key={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectDivision>
                  </TableCell>
                )}
                <TableCell
                  className={cn(
                    "border-gray-400 border-r border-b text-center",
                    v + 1 === 3 && "border-b-0",
                  )}
                >
                  {v + 1}
                  <input
                    type="hidden"
                    name={`detail.${value}.level`}
                    value={v + 1}
                  />
                </TableCell>
                <TableCell className="px-2 text-center">
                  <div className="relative">
                    <Input
                      className="px-6"
                      name={`detail.${value}.minimumBudget`}
                      defaultValue={minVal}
                    />
                    <PesoInputDecor />
                  </div>
                </TableCell>
                <TableCell className="border-gray-400 border-r px-2 text-center">
                  <div className="relative">
                    <Input
                      className="px-6"
                      name={`detail.${value}.maximumBudget`}
                      defaultValue={maxVal}
                    />
                    <PesoInputDecor />
                  </div>
                </TableCell>
                {!["3", "4"].includes(subModuleId) && (
                  <>
                    <TableCell className="text-center">
                      <Select name={`detail.${value}.reviewerId`}>
                        <SelectTrigger>
                          <SelectValue placeholder="Reviewer 1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"0"}>Clear Select</SelectItem>
                          {userItems.map((item) => (
                            <SelectItem value={String(item.id)} key={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Select name={`detail.${value}.reviewer2Id`}>
                        <SelectTrigger>
                          <SelectValue placeholder="Reviewer 2" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"0"}>Clear Select</SelectItem>
                          {userItems.map((item) => (
                            <SelectItem value={String(item.id)} key={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </>
                )}
                <TableCell className="text-center">
                  <Select name={`detail.${value}.approver1Id`}>
                    <SelectTrigger>
                      <SelectValue placeholder="Approver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"0"}>Clear Select</SelectItem>
                      {userItems.map((item) => (
                        <SelectItem value={String(item.id)} key={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Select name={`detail.${value}.approver2Id`}>
                    <SelectTrigger>
                      <SelectValue placeholder="Approver 2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"0"}>Clear Select</SelectItem>
                      {userItems.map((item) => (
                        <SelectItem value={String(item.id)} key={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Select name={`detail.${value}.approver3Id`}>
                    <SelectTrigger>
                      <SelectValue placeholder="Approver 3" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"0"}>Clear Select</SelectItem>
                      {userItems.map((item) => (
                        <SelectItem value={String(item.id)} key={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                {v === 0 && (
                  <TableCell className="text-center" rowSpan={3}>
                    <div className="flex items-center justify-center">
                      {idx === fields.length - 1 ? (
                        <Button
                          type="button"
                          size={"icon"}
                          variant="default"
                          onClick={() => append({ level: [0, 1, 2] })}
                          className="size-5 rounded-full p-1"
                        >
                          <Icons.add />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size={"icon"}
                          variant={"destructive"}
                          onClick={() => remove(idx)}
                          className="size-5 rounded-full p-1"
                        >
                          <Icons.subtract />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
}

interface SelectDivisionProps extends React.PropsWithChildren {
  rows: number[];
  fieldNumber: number;
}

function SelectDivision({ children, rows, fieldNumber }: SelectDivisionProps) {
  const [divisionValue, setDivisionValue] = React.useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams],
  );

  const selectedQueryParams = searchParams.get("selected");

  return (
    <>
      <Select
        onValueChange={(v) => {
          setDivisionValue(v);
          router.replace(
            `${pathname}?${createQueryString({
              [`division.${fieldNumber}`]: v,
              selected: `${selectedQueryParams}.${v}`,
            })}`,
          );
        }}
      >
        {children}
      </Select>
      {rows.map((row) => (
        <input
          key={row}
          type="hidden"
          name={`detail.${row}.divisionId`}
          value={divisionValue}
        />
      ))}
    </>
  );
}

export function SelectDivisionUpdate({
  children,
  defaultValue,
  ...props
}: React.ComponentPropsWithoutRef<typeof Select>) {
  const [divisionValue, setDivisionValue] = React.useState(defaultValue);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams],
  );

  return (
    <>
      <Select
        {...props}
        defaultValue={defaultValue}
        onValueChange={(v) => {
          setDivisionValue(v);
          router.replace(
            `${pathname}?${createQueryString({
              selectedDivision: v,
            })}`,
          );
        }}
      >
        {children}
      </Select>
      {[0, 1, 2].map((row) => (
        <input
          key={row}
          type="hidden"
          name={`detail.${row}.divisionId`}
          value={divisionValue}
        />
      ))}
    </>
  );
}

export function Form({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [state, action] = ReactUFS(create, {
    message: undefined,
    success: undefined,
  });
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
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

interface EditFormProps extends React.ComponentPropsWithoutRef<"form"> {
  binded: {
    subModuleId: number;
    divisionId: number;
  };
}

export function EditForm({ children, binded, ...props }: EditFormProps) {
  const router = useRouter();
  const [state, action] = ReactUFS(edit.bind(null, binded), {
    message: undefined,
    success: undefined,
  });
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
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

export function ToggleSwitch({
  defaultValue,
  divisionId,
  subModuleId,
}: {
  defaultValue: boolean;
  subModuleId: number;
  divisionId: number;
}) {
  const [check, setCheck] = React.useOptimistic(defaultValue);
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  return (
    <Switch
      onCheckedChange={(checked) => {
        setCheck(checked);
        startTransition(async () => {
          const response = await toggleStatus({ subModuleId, divisionId });
          if (!response.ok) toast.error(response.message);
          if (response.ok) router.refresh();
        });
      }}
      defaultChecked={defaultValue}
    />
  );
}

export function SelectSubModule({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Select>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  return (
    <>
      <Select
        {...props}
        onValueChange={(v) =>
          router.replace(`${pathname}?${createQueryString("subModuleId", v)}`)
        }
      >
        {children}
      </Select>
    </>
  );
}
