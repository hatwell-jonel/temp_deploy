"use client";

import { ShowAttachmentLinks } from "@/components/show-attachment";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDate, pesofy } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import type { CanvasRequestDetails, Reasons } from "../../helpers";
import { approveOrDecline, decline, review } from "./action";

interface FormProps extends React.ComponentPropsWithoutRef<"form"> {
  referenceNo: string;
}

export function ReviewerForm({ children, referenceNo, ...props }: FormProps) {
  const [state, action] = useFormState(review.bind(null, referenceNo), {
    message: undefined,
    success: undefined,
  });
  const router = useRouter();
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
      router.back();
    }
  }, [state, router]);
  return (
    <form {...props} action={action}>
      {children}
    </form>
  );
}

export function ApproverForm({ children, referenceNo, ...props }: FormProps) {
  const router = useRouter();
  const [state, action] = useFormState(
    approveOrDecline.bind(null, referenceNo),
    {
      message: undefined,
      success: undefined,
    },
  );
  React.useEffect(() => {
    if (state.success === false) {
      toast.error(state.message);
    } else if (state.success === true) {
      toast.success(state.message);
      router.back();
    }
  }, [state, router]);
  return (
    <form {...props} action={action}>
      {children}
    </form>
  );
}

export function RequesterForm({ children, ...props }: FormProps) {
  return <form {...props}>{children}</form>;
}

export function DeclineForm({ children, referenceNo, ...props }: FormProps) {
  const router = useRouter();
  const [state, action] = useFormState(decline.bind(null, referenceNo), {
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
    <form {...props} action={action}>
      {children}
    </form>
  );
}

interface ReasonSelectProps
  extends React.ComponentPropsWithoutRef<typeof Select> {
  amountToDeduct: number;
}

export function ReasonSelect({
  children,
  onValueChange,
  amountToDeduct,
  ...props
}: ReasonSelectProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const currentAmount = searchParams.get("amount")
    ? Number(searchParams.get("amount"))
    : 0;

  const newAmount = currentAmount + amountToDeduct;

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
      onValueChange={() =>
        startTransition(() =>
          router.replace(
            `${pathname}?${createQueryString("amount", String(newAmount))}`,
            { scroll: false },
          ),
        )
      }
    >
      {children}
    </Select>
  );
}

export function DetailsTable({
  role,
  reasons,
  ...props
}: {
  data: CanvasRequestDetails;
  role: "approver" | "reviewer" | "requester";
  reasons: Reasons;
}) {
  const data = props.data;
  const colSpan = role === "reviewer" ? 13 : 12;
  const [isPending, startTransition] = React.useTransition();
  const approvedList = data.filter((d) => d.isApproved);
  const [markedIds, setMarkedIds] = React.useState<number[]>(
    approvedList.map((d) => d.id),
  );

  const filtered = data.filter((d) => markedIds.includes(d.id));
  const grandTotal = filtered.reduce((prev, curr) => {
    return prev + curr.quantity * curr.unitPrice;
  }, 0);

  const groupedData = data.reduce(
    (acc, obj) => {
      const key = obj.itemDescriptionId.toString(); // Convert bigint to string for grouping
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      (acc[key] = acc[key] || []).push(obj);
      return acc;
    },
    {} as { [key: string]: CanvasRequestDetails },
  );

  let previousDescriptionId: null | number = null;

  const earliestDates: Array<Date> = [];
  const lowestNumbers: Array<number> = [];

  for (const [key, value] of Object.entries(groupedData)) {
    const earliestDateObject = value.reduce((prev, curr) => {
      return prev.deliveryDate < curr.deliveryDate ? prev : curr;
    });
    const lowestNumberObject = value.reduce((prev, curr) => {
      return prev.quantity * prev.unitPrice < curr.unitPrice * prev.quantity
        ? prev
        : curr;
    });
    earliestDates.push(earliestDateObject.deliveryDate);
    lowestNumbers.push(
      lowestNumberObject.quantity * lowestNumberObject.unitPrice,
    );
  }

  // const earliestDateObject = v.reduce((prev, curr) => {
  //   return prev.deliveryDate < curr.deliveryDate ? prev : curr;
  // });

  // // Get the object with the lowest number
  // const lowestNumberObject = v.reduce((prev, curr) => {
  //   return prev.quantity * prev.unitPrice < curr.unitPrice * prev.quantity
  //     ? prev
  //     : curr;
  // });

  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow className="border-gray-400 bg-background *:whitespace-nowrap">
          <TableHead className="text-center text-foreground">
            Item Description
          </TableHead>
          <TableHead className="text-center text-foreground">
            Quantity
          </TableHead>
          {role === "reviewer" && <TableHead />}
          <TableHead className="text-center text-foreground">
            Supplier
          </TableHead>
          <TableHead className="text-center text-foreground">
            Unit Price
          </TableHead>
          <TableHead className="text-center text-foreground">
            Total Price
          </TableHead>
          <TableHead className="text-center text-foreground">
            Delivery Date
          </TableHead>
          <TableHead className="text-center text-foreground">
            Payment Option
          </TableHead>
          <TableHead className="text-center text-foreground">
            <div>Installment Terms</div>
          </TableHead>
          <TableHead className="text-center text-foreground">
            <div>Payment Terms</div>
          </TableHead>
          <TableHead className="text-center text-foreground">
            <div>Payment Mode</div>
          </TableHead>
          <TableHead className="text-center text-foreground">
            Method of Delivery
          </TableHead>
          <TableHead className="text-center text-foreground">
            Attachments
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((data, index) => {
          const totalPrice = data.unitPrice * data.quantity;
          const isChecked = markedIds.includes(data.id);
          const isSameDescriptionId =
            Number(data.itemDescriptionId) === previousDescriptionId;
          previousDescriptionId = Number(data.itemDescriptionId);
          const rowSpan = props.data.filter(
            (d) => d.itemDescriptionId === data.itemDescriptionId,
          ).length;
          return (
            <TableRow
              className={cn(
                "bg-gray-100 even:bg-background",
                isChecked &&
                  role === "reviewer" &&
                  "bg-[#C7D8F9] even:bg-[#C7D8F9]",
              )}
              key={data.id}
            >
              <input
                type="hidden"
                name={`details.${index}.id`}
                value={String(data.id)}
              />
              {!isSameDescriptionId && (
                <>
                  <TableCell
                    className="border-gray-400 border-r border-b bg-background text-center text-foreground"
                    rowSpan={rowSpan}
                  >
                    <div className="flex items-center justify-center">
                      {data.itemDescription.description}
                    </div>
                  </TableCell>
                  <TableCell
                    className="border-gray-400 border-r border-b bg-background text-center text-foreground"
                    rowSpan={rowSpan}
                  >
                    <div className="flex items-center justify-center">
                      {data.quantity}
                    </div>
                  </TableCell>
                </>
              )}

              {role === "reviewer" && (
                <TableCell>
                  <Checkbox
                    name={`details.${index}.marked`}
                    checked={isChecked}
                    onCheckedChange={(c) => {
                      startTransition(() => {
                        if (c === true) {
                          setMarkedIds([...new Set([...markedIds, data.id])]);
                        } else if (c === false) {
                          setMarkedIds([]);
                        }
                      });
                    }}
                  />
                </TableCell>
              )}
              <TableCell className="border-gray-400 border-r text-center text-foreground">
                {data.supplier.name}
              </TableCell>
              <TableCell className="border-gray-400 border-r text-center text-foreground">
                {data.unitPrice}
              </TableCell>
              <TableCell
                className={cn(
                  "whitespace-nowrap border-gray-400 border-r text-center text-foreground",
                  lowestNumbers.includes(totalPrice) &&
                    role === "reviewer" &&
                    "bg-[#C7D8F9] font-semibold text-primary",
                )}
              >
                {pesofy(totalPrice)}
              </TableCell>
              <TableCell
                className={cn(
                  "border-gray-400 border-r text-center text-foreground",
                  earliestDates.includes(data.deliveryDate) &&
                    role === "reviewer" &&
                    "bg-[#C7D8F9] font-semibold text-primary",
                )}
              >
                {formatDate(data.deliveryDate)}
              </TableCell>
              <TableCell className="border-gray-400 border-r text-center text-foreground">
                {data.paymentOption.name}
              </TableCell>
              <TableCell className="border-gray-400 border-r text-center text-foreground">
                {data.installmentTerms}
              </TableCell>
              <TableCell className="border-gray-400 border-r text-center text-foreground">
                {data.paymentTerms}
              </TableCell>
              <TableCell className="border-gray-400 border-r text-center text-foreground">
                {data.paymentOption.name}
              </TableCell>
              <TableCell className="border-gray-400 border-r text-center text-foreground">
                {data.methodOfDelivery.name}
              </TableCell>
              <TableCell className="text-center text-foreground">
                <div className="flex items-center justify-center">
                  {data.attachments.length > 0 ? (
                    <ShowAttachmentLinks
                      fileUrls={data.attachments.map((a) => a.url)}
                    />
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter className="border-gray-400">
        <TableRow>
          <TableCell colSpan={colSpan}>
            <div className="flex w-full justify-end gap-2 text-xl">
              <span className="font-bold">GRAND TOTAL : </span>
              <input type="hidden" name="total" value={grandTotal} />
              <span className="text-primary">{pesofy(grandTotal)}</span>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
