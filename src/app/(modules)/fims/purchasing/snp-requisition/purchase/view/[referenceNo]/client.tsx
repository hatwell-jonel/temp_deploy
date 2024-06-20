"use client";

import { ShowAttachmentLinks } from "@/components/show-attachment";
import { CrossBox } from "@/components/ui/crossbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, pesofy } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import type { Reasons, RequisitionDetails } from "../../helpers";
import { approveOrDecline, review } from "./action";

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

export function RequisitionDetailsTable({
  role,
  reasons,
  ...props
}: {
  data: RequisitionDetails;
  role: "approver" | "reviewer" | "requester";
  reasons: Reasons;
}) {
  const data = props.data;
  const colSpan = role === "reviewer" ? 13 : 12;
  const [isPending, startTransition] = React.useTransition();
  const rejectedData = data.filter((d) => d.rejectionId !== null);
  const [markedIds, setMarkedIds] = React.useState<number[]>(
    rejectedData.map((d) => d.id),
  );

  const filtered = data.filter((d) => !markedIds.includes(d.id));
  const grandTotal = filtered.reduce((accumulator, object) => {
    return accumulator + object.estimatedTotal;
  }, 0);

  return (
    <Table className="text-xs" key={data[0].requisitionNo}>
      <TableHeader>
        <TableRow className="border-gray-400">
          {role === "reviewer" && (
            <TableHead className="pl-3">
              <CrossBox
                checked={markedIds.length === data.length}
                onCheckedChange={(c) => {
                  startTransition(() => {
                    if (c === true) {
                      setMarkedIds(data.map((d) => d?.id));
                    } else if (c === false) {
                      setMarkedIds([]);
                    }
                  });
                }}
              />
            </TableHead>
          )}
          <TableHead className="text-center text-foreground">
            Item Category
          </TableHead>
          <TableHead className="text-center text-foreground">
            Item Description
          </TableHead>
          <TableHead className="text-center text-foreground">
            Quantity
          </TableHead>
          <TableHead className="text-center text-foreground">unit</TableHead>
          <TableHead className="text-center text-foreground">
            Estimated Price
          </TableHead>
          <TableHead className="text-center text-foreground">
            Estimated Total
          </TableHead>
          <TableHead className="text-center text-foreground">
            <div>Purpose</div>
          </TableHead>
          <TableHead className="text-center text-foreground">
            Beneficiary Branch
          </TableHead>
          <TableHead className="text-center text-foreground">
            <div>Preferred Supplier</div>
          </TableHead>
          <TableHead className="text-center text-foreground">
            <div>Remarks</div>
          </TableHead>
          <TableHead className="text-center text-foreground">Action</TableHead>
          {role === "reviewer" && (
            <TableHead className="text-foreground">
              Reason for Rejection
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((data, index) => {
          const isChecked = markedIds.includes(data.id);
          return (
            <TableRow
              className={cn("odd:bg-gray-100", isChecked && "bg-red-100")}
              key={data.id}
            >
              <React.Suspense>
                {role === "reviewer" && (
                  <TableCell>
                    <CrossBox
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
              </React.Suspense>
              <TableCell className="text-center text-foreground">
                {data.itemCategory.name}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.itemDescription.description}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.quantity}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.unit.name}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.estimatedPrice}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.estimatedTotal}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.purpose?.name ?? "-"}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.beneficialBranch.code}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.preferredSupplier?.name ?? "-"}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.remarks?.length !== 0 ? data.remarks : "-"}
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
              {role === "reviewer" && (
                <TableCell className="pl-3">
                  <input
                    type="hidden"
                    name={`details.${index}.id`}
                    value={data.id}
                  />
                  {isChecked ? (
                    <Select name={`details.${index}.reasonId`}>
                      <SelectTrigger className="w-[130px] bg-inherit text-xs">
                        <SelectValue placeholder="Reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasons.map((reason) => (
                          <SelectItem value={String(reason.id)} key={reason.id}>
                            {reason.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="w-[130px]" />
                  )}
                </TableCell>
              )}
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
