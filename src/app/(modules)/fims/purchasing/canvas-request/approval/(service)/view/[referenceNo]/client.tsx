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
  const router = useRouter();
  const [state, action] = useFormState(review.bind(null, referenceNo), {
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
    <form
      {...props}
      action={action}
      key={state.success === true ? Math.random() : "static"}
    >
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
  const colSpan = role === "reviewer" ? 12 : 11;
  const [isPending, startTransition] = React.useTransition();
  const approvedList = data.filter((d) => d.isApproved);
  const [markedIds, setMarkedIds] = React.useState<number[]>(
    approvedList.map((d) => d.id),
  );

  const filtered = data.filter((d) => markedIds.includes(d.id));
  const grandTotal = filtered.reduce((accumulator, object) => {
    return accumulator + object.rate * object.hours;
  }, 0);

  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow className="border-gray-400 bg-background">
          <TableHead className="text-center text-foreground">
            Service Description
          </TableHead>
          {role === "reviewer" && <TableHead />}
          <TableHead className="text-center text-foreground">Worker</TableHead>
          <TableHead className="text-center text-foreground">
            Start Date
          </TableHead>
          <TableHead className="text-center text-foreground">
            End Date
          </TableHead>
          <TableHead className="text-center text-foreground">
            Man Hours
          </TableHead>
          <TableHead className="text-center text-foreground">
            <div>Extent of Work</div>
          </TableHead>
          <TableHead className="text-center text-foreground">
            <div>Rate</div>
          </TableHead>
          <TableHead className="text-center text-foreground">
            Total Rate
          </TableHead>
          <TableHead className="text-center text-foreground">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((data, index) => {
          const isChecked = markedIds.includes(data.id);
          return (
            <TableRow
              className={cn(
                "bg-gray-100 even:bg-background",
                isChecked &&
                  role === "reviewer" &&
                  "bg-primary/50 even:bg-primary/50",
              )}
              key={data.id}
            >
              <TableCell className="text-center text-foreground">
                <input
                  type="hidden"
                  name={`details.${index}.id`}
                  value={String(data.id)}
                />
                {data.serviceDescription.description}
              </TableCell>
              {role === "reviewer" && (
                <TableCell>
                  <Checkbox
                    checked={isChecked}
                    name={`details.${index}.marked`}
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
              <TableCell className="text-center text-foreground">
                {data.worker.firstName} {data.worker.lastName}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {formatDate(data.startDate)}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {formatDate(data.endDate)}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.hours}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.extentOfWork}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.rate}
              </TableCell>
              <TableCell className="text-center text-foreground">
                {data.rate * data.hours}
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
