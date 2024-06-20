"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import AttachmentButtonInput from "@/components/buttons/attachment";
import { DatePickerWithPresets } from "@/components/date-picker";
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
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useFormState } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type {
  Carriers,
  Hubs,
  Leasors,
  Providers,
  ServiceProviders,
  Subscriptions,
  TransportModes,
  UtilityTypes,
} from "../helpers";

export function SelectCategory({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Select>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  return (
    <Select
      onValueChange={(v) =>
        router.replace(`${pathname}?${createQueryString("apCategory", v)}`)
      }
      {...props}
    >
      {children}
    </Select>
  );
}

type FormValues = {
  detail: {
    quantity: number;
  }[];
};

interface AirlineTableRowFormProps
  extends React.ComponentPropsWithoutRef<typeof TableRow> {
  transportModeItems: TransportModes;
  carrierItems: Carriers;
}

export function AirlineTableRowForm({
  transportModeItems,
  carrierItems,
  className,
  ...props
}: AirlineTableRowFormProps) {
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
  return (
    <>
      {fields.map((field, index) => {
        const isLast = index + 1 === fields.length;
        return (
          <TableRow
            className={cn(className, "*:px-1.5 *:text-center")}
            key={index}
          >
            <SelectTransportModeAndCarrier
              index={index}
              transportModes={transportModeItems}
              carriers={carrierItems}
            />
            <TableCell>
              <DatePickerWithPresets
                name={`detail.${index}.from`}
                className="w-[150px]"
              />
            </TableCell>
            <TableCell className="border-gray-400 border-r">
              <DatePickerWithPresets
                name={`detail.${index}.to`}
                className="w-[150px]"
              />
            </TableCell>
            <TableCell>
              <Input name={`detail.${index}.soaNumber`} className="w-[150px]" />
            </TableCell>
            <TableCell>
              <Input
                name={`detail.${index}.mawbNumber`}
                className="w-[150px]"
              />
            </TableCell>
            <TableCell>
              <div className="relative">
                <Input
                  name={`detail.${index}.amount`}
                  type="number"
                  className="w-[150px] pl-6"
                />
                <PesoInputDecor />
              </div>
            </TableCell>
            <TableCell>
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

function SelectTransportModeAndCarrier({
  transportModes,
  carriers,
  index,
}: {
  transportModes: TransportModes;
  carriers: Carriers;
  index: number;
}) {
  const [transportMode, setTransportMode] = React.useState<
    undefined | string
  >();

  const filteredCarriers = transportMode
    ? carriers.filter((c) => c.transportModeId === Number(transportMode))
    : carriers;
  return (
    <>
      <TableCell>
        <Select
          onValueChange={(v) => setTransportMode(v)}
          name={`detail.${index}.transportModeId`}
        >
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="Transport Mode" />
          </SelectTrigger>
          <SelectContent>
            {transportModes.map((item) => (
              <SelectItem value={String(item.id)} key={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="border-gray-400 border-r">
        <Select key={transportMode} name={`detail.${index}.carrierId`}>
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="Choose Carrier" />
          </SelectTrigger>
          <SelectContent>
            {filteredCarriers.map((item) => (
              <SelectItem value={String(item.id)} key={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </>
  );
}
type State = {
  success: boolean | undefined;
  message: string | undefined;
};

interface FormProps extends React.ComponentPropsWithoutRef<"form"> {
  formAction: (prevState: State, formData: FormData) => Promise<State>;
}

export function Form({ children, formAction, ...props }: FormProps) {
  const [state, dispatch] = useFormState(formAction, {
    message: undefined,
    success: undefined,
  });
  const router = useRouter();
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    }
    if (state.success === true) {
      toast.success("Succesfully registered Recurring Requisition!");
      toast(state.message, {
        action: {
          label: "Copy",
          onClick: () => navigator.clipboard.writeText(state.message ?? ""),
        },
      });
      router.back();
    }
  }, [state, router]);
  return (
    <form
      {...props}
      action={dispatch}
      key={state.success !== true ? "static" : Math.random()}
    >
      {children}
    </form>
  );
}

interface UtilitiesTableRowFormProps
  extends React.ComponentPropsWithoutRef<typeof TableRow> {
  utilityTypes: UtilityTypes;
  serviceProviders: ServiceProviders;
}

export function UtilitiesTableRowForm({
  utilityTypes,
  serviceProviders,
  className,
  ...props
}: UtilitiesTableRowFormProps) {
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
  return (
    <>
      {fields.map((field, index) => {
        const isLast = index + 1 === fields.length;
        return (
          <TableRow
            className={cn(className, "odd:bg-gray-100 *:px-1.5 *:text-center")}
            key={index}
          >
            <TableCell>
              <Select name={`detail.${index}.utilityTypeId`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Utility Type" />
                </SelectTrigger>
                <SelectContent>
                  {utilityTypes.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="border-gray-400 border-r">
              <Select name={`detail.${index}.serviceProviderId`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Service Provider" />
                </SelectTrigger>
                <SelectContent>
                  {serviceProviders.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <DatePickerWithPresets
                name={`detail.${index}.from`}
                className="w-[150px]"
              />
            </TableCell>
            <TableCell className="border-gray-400 border-r">
              <DatePickerWithPresets
                name={`detail.${index}.to`}
                className="w-[150px]"
              />
            </TableCell>
            <TableCell>
              <Input name={`detail.${index}.soaNumber`} className="w-[150px]" />
            </TableCell>
            <TableCell>
              <div className="relative">
                <Input
                  name={`detail.${index}.amount`}
                  type="number"
                  className="w-[150px] pl-6"
                />
                <PesoInputDecor />
              </div>
            </TableCell>
            <TableCell>
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

interface RentalsTableRowFormProps
  extends React.ComponentPropsWithoutRef<typeof TableRow> {
  leasors: Leasors;
  hubs: Hubs;
  type?: number;
}

export function RentalsTableRowForm({
  leasors,
  hubs,
  className,
  type,
  ...props
}: RentalsTableRowFormProps) {
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
  return (
    <>
      {fields.map((field, index) => {
        const isLast = index + 1 === fields.length;
        return (
          <TableRow
            {...props}
            className={cn(className, "odd:bg-gray-100 *:px-1.5 *:text-center")}
            key={index}
          >
            <TableCell>
              <Select name={`detail.${index}.hubId`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Hub/Office" />
                </SelectTrigger>
                <SelectContent>
                  {hubs.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="border-gray-400 border-r">
              <Select name={`detail.${index}.leasorId`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Leasor" />
                </SelectTrigger>
                <SelectContent>
                  {leasors.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <DatePickerWithPresets
                name={`detail.${index}.from`}
                className="w-[150px]"
              />
            </TableCell>
            <TableCell className={"border-gray-400 border-r"}>
              <DatePickerWithPresets
                name={`detail.${index}.to`}
                className="w-[150px]"
              />
            </TableCell>
            <TableCell>
              <Input name={`detail.${index}.terms`} className="w-[150px" />
            </TableCell>
            <TableCell>
              <div className="relative">
                <Input
                  name={`detail.${index}.amount`}
                  type="number"
                  className="w-[150px] pl-6"
                />
                <PesoInputDecor />
              </div>
            </TableCell>
            <TableCell>
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

interface SubscriptionTableRowFormProps
  extends React.ComponentPropsWithoutRef<typeof TableRow> {
  providers: Providers;
  subscriptions: Subscriptions;
}

export function SubscriptionTableRowForm({
  providers,
  subscriptions,
  className,
  ...props
}: SubscriptionTableRowFormProps) {
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
  return (
    <>
      {fields.map((field, index) => {
        const isLast = index + 1 === fields.length;
        return (
          <TableRow
            {...props}
            className={cn(className, "odd:bg-gray-100 *:px-1.5 *:text-center")}
            key={index}
          >
            <TableCell>
              <Select name={`detail.${index}.subscriptionId`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="border-gray-400 border-r">
              <Select name={`detail.${index}.providerId`}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((item) => (
                    <SelectItem value={String(item.id)} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <DatePickerWithPresets
                name={`detail.${index}.from`}
                className="w-[150px]"
              />
            </TableCell>
            <TableCell className="border-gray-400 border-r">
              <DatePickerWithPresets
                name={`detail.${index}.to`}
                className="w-[150px]"
              />
            </TableCell>
            <TableCell>
              <Input name={`detail.${index}.soaNumber`} className="w-[150px]" />
            </TableCell>
            <TableCell>
              <div className="relative">
                <Input
                  name={`detail.${index}.amount`}
                  type="number"
                  className="w-[150px] pl-6"
                />
                <PesoInputDecor />
              </div>
            </TableCell>
            <TableCell>
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

export function SelectRentalType({
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
    <Select
      {...props}
      onValueChange={(v) =>
        router.replace(`${pathname}?${createQueryString("rentalType", v)}`)
      }
    >
      {children}
    </Select>
  );
}
