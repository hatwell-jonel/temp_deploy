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
import { cn, formatDate, pesofy } from "@/lib/utils";
import type { FormPropsWithReference, RecurringCategory } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import type {
  AirlineDetails,
  Reasons,
  RentalDetails,
  SubscriptionDetails,
  UtilityDetails,
} from "../../helpers";
import { approveOrDecline, review } from "./action";

interface FormProps extends FormPropsWithReference {
  category: RecurringCategory;
}

export function ReviewerForm({
  children,
  referenceNo,
  category,
  ...props
}: FormProps) {
  const [state, action] = useFormState(
    review.bind(null, { category, referenceNo }),
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
    }
  }, [state]);
  return (
    <form {...props} action={action}>
      {children}
    </form>
  );
}

export function ApproverForm({
  children,
  referenceNo,
  category,
  ...props
}: FormProps) {
  const [state, action] = useFormState(
    approveOrDecline.bind(null, { category, referenceNo }),
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
    }
  }, [state]);
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

export function AirlineDetailsTable({
  role,
  reasons,
  data,
}: {
  data: AirlineDetails["airline"];
  role: "approver" | "reviewer" | "requester";
  reasons: Reasons;
}) {
  const colSpan = role === "reviewer" ? 10 : 9;
  const [isPending, startTransition] = React.useTransition();
  const rejectedData = data.filter((d) => d.rejectionId !== null);
  const [markedIds, setMarkedIds] = React.useState<number[]>(
    rejectedData.map((d) => d.id),
  );

  const filtered = data.filter((d) => !markedIds.includes(d.id));
  const grandTotal = filtered.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);

  return (
    <Table className="text-xs" key={data[0].referenceNo}>
      <TableHeader>
        <TableRow className="!border-b-0 *:h-6 *:border-gray-400 *:border-r">
          {role === "reviewer" && <TableHead className="!border-r-0" />}
          <TableHead />
          <TableHead />
          <TableHead colSpan={2} className="border-b bg-[#E2E2E2] text-center">
            Transaction date
          </TableHead>
          <TableHead />
          <TableHead />
          <TableHead />
          <TableHead className="last:border-r-0" />
          {role === "reviewer" && <TableHead className="last:border-r-0" />}
        </TableRow>
        <TableRow className="border-gray-400 *:h-8 *:border-gray-400 *:border-r *:text-center *:text-foreground">
          {role === "reviewer" && (
            <TableHead className="!border-r-0 pl-3">
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
          <TableHead>Transport Mode</TableHead>
          <TableHead>Carrier</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>SOA No.</TableHead>
          <TableHead>MAWB No.</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="last:border-r-0">Action</TableHead>
          {role === "reviewer" && (
            <TableHead className="last:border-r-0">
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
              className={cn(
                "*:border-gray-400 *:border-r odd:bg-gray-100 *:text-center *:text-foreground",
                isChecked && "bg-red-100",
              )}
              key={data.id}
            >
              <React.Suspense>
                {role === "reviewer" && (
                  <TableCell className="!border-r-0">
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
              <TableCell>{data.transportMode.name}</TableCell>
              <TableCell>{data.carrier.name}</TableCell>
              <TableCell>{formatDate(data.startDate)}</TableCell>
              <TableCell>{formatDate(data.endDate)}</TableCell>
              <TableCell>{data.soaNumber}</TableCell>
              <TableCell>{data.mawbNumber}</TableCell>
              <TableCell>{pesofy(data.amount)}</TableCell>
              <TableCell className="last:border-r-0">
                <div className="flex items-center justify-center">
                  {data.attachments.length > 0 ? (
                    <ShowAttachmentLinks
                      fileUrls={data.attachments.map((a) => a.url)}
                    />
                  ) : null}
                </div>
              </TableCell>
              {role === "reviewer" && (
                <TableCell className="pl-3 last:border-r-0">
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

export function UtilityDetailsTable({
  role,
  reasons,
  data,
}: {
  data: UtilityDetails["utility"];
  role: "approver" | "reviewer" | "requester";
  reasons: Reasons;
}) {
  const colSpan = role === "reviewer" ? 9 : 8;
  const [isPending, startTransition] = React.useTransition();
  const rejectedData = data.filter((d) => d.rejectionId !== null);
  const [markedIds, setMarkedIds] = React.useState<number[]>(
    rejectedData.map((d) => d.id),
  );

  const filtered = data.filter((d) => !markedIds.includes(d.id));
  const grandTotal = filtered.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);

  return (
    <Table className="text-xs" key={data[0].referenceNo}>
      <TableHeader>
        <TableRow className="!border-b-0 *:h-6 *:border-gray-400 *:border-r">
          {role === "reviewer" && <TableHead className="!border-r-0" />}
          <TableHead />
          <TableHead />
          <TableHead colSpan={2} className="border-b bg-[#E2E2E2] text-center">
            Transaction date
          </TableHead>
          <TableHead />
          <TableHead />
          <TableHead className="last:border-r-0" />
          {role === "reviewer" && <TableHead className="last:border-r-0" />}
        </TableRow>
        <TableRow className="border-gray-400 *:h-8 *:border-gray-400 *:border-r *:text-center *:text-foreground">
          {role === "reviewer" && (
            <TableHead className="!border-r-0 pl-3">
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
          <TableHead>Utility Type</TableHead>
          <TableHead>Service Provider</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>SOA No.</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="last:border-r-0">Action</TableHead>
          {role === "reviewer" && (
            <TableHead className="last:border-r-0">
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
              className={cn(
                "*:border-gray-400 *:border-r odd:bg-gray-100 *:text-center *:text-foreground",
                isChecked && "bg-red-100",
              )}
              key={data.id}
            >
              <React.Suspense>
                {role === "reviewer" && (
                  <TableCell className="!border-r-0">
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
              <TableCell>{data.utilityType.name}</TableCell>
              <TableCell>{data.serviceProvider.name}</TableCell>
              <TableCell>{formatDate(data.startDate)}</TableCell>
              <TableCell>{formatDate(data.endDate)}</TableCell>
              <TableCell>{data.soaNumber}</TableCell>
              <TableCell>{pesofy(data.amount)}</TableCell>
              <TableCell className="last:border-r-0">
                <div className="flex items-center justify-center">
                  {data.attachments.length > 0 ? (
                    <ShowAttachmentLinks
                      fileUrls={data.attachments.map((a) => a.url)}
                    />
                  ) : null}
                </div>
              </TableCell>
              {role === "reviewer" && (
                <TableCell className="pl-3 last:border-r-0">
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

export function RentalDetailsTable({
  role,
  reasons,
  data,
}: {
  data: RentalDetails["rental"];
  role: "approver" | "reviewer" | "requester";
  reasons: Reasons;
}) {
  const colSpan = role === "reviewer" ? 9 : 8;
  const [isPending, startTransition] = React.useTransition();
  const rejectedData = data.filter((d) => d.rejectionId !== null);
  const [markedIds, setMarkedIds] = React.useState<number[]>(
    rejectedData.map((d) => d.id),
  );

  const filtered = data.filter((d) => !markedIds.includes(d.id));
  const grandTotal = filtered.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);

  return (
    <Table className="text-xs" key={data[0].referenceNo}>
      <TableHeader>
        <TableRow className="!border-b-0 *:h-6 *:border-gray-400 *:border-r">
          {role === "reviewer" && <TableHead className="!border-r-0" />}
          <TableHead />
          <TableHead />
          <TableHead colSpan={2} className="border-b bg-[#E2E2E2] text-center">
            Transaction date
          </TableHead>
          <TableHead />
          <TableHead className="last:border-r-0" />
          {role === "reviewer" && <TableHead className="last:border-r-0" />}
        </TableRow>
        <TableRow className="border-gray-400 *:h-8 *:border-gray-400 *:border-r *:text-center *:text-foreground">
          {role === "reviewer" && (
            <TableHead className="!border-r-0 pl-3">
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
          <TableHead>Hub/Office</TableHead>
          <TableHead>Leasor</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="last:border-r-0">Action</TableHead>
          {role === "reviewer" && (
            <TableHead className="last:border-r-0">
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
              className={cn(
                "*:border-gray-400 *:border-r odd:bg-gray-100 *:text-center *:text-foreground",
                isChecked && "bg-red-100",
              )}
              key={data.id}
            >
              <React.Suspense>
                {role === "reviewer" && (
                  <TableCell className="!border-r-0">
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
              <TableCell>{data.hub.name}</TableCell>
              <TableCell>{data.leasor.name}</TableCell>
              <TableCell>{formatDate(data.startDate)}</TableCell>
              <TableCell>{formatDate(data.endDate)}</TableCell>
              <TableCell>{pesofy(data.amount)}</TableCell>
              <TableCell className="last:border-r-0">
                <div className="flex items-center justify-center">
                  {data.attachments.length > 0 ? (
                    <ShowAttachmentLinks
                      fileUrls={data.attachments.map((a) => a.url)}
                    />
                  ) : null}
                </div>
              </TableCell>
              {role === "reviewer" && (
                <TableCell className="pl-3 last:border-r-0">
                  <input
                    type="hidden"
                    name={`details.${index}.id`}
                    value={data.id}
                  />
                  {isChecked ? (
                    <Select name={`details.${index}.reasonId`}>
                      <SelectTrigger className="bg-inherit text-xs">
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

export function SubscriptionDetailsTable({
  role,
  reasons,
  data,
}: {
  data: SubscriptionDetails["subscription"];
  role: "approver" | "reviewer" | "requester";
  reasons: Reasons;
}) {
  const colSpan = role === "reviewer" ? 10 : 9;
  const [isPending, startTransition] = React.useTransition();
  const rejectedData = data.filter((d) => d.rejectionId !== null);
  const [markedIds, setMarkedIds] = React.useState<number[]>(
    rejectedData.map((d) => d.id),
  );

  const filtered = data.filter((d) => !markedIds.includes(d.id));
  const grandTotal = filtered.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);

  return (
    <Table className="text-xs" key={data[0].referenceNo}>
      <TableHeader>
        <TableRow className="!border-b-0 *:h-6 *:border-gray-400 *:border-r">
          {role === "reviewer" && <TableHead className="!border-r-0" />}
          <TableHead />
          <TableHead />
          <TableHead colSpan={2} className="border-b bg-[#E2E2E2] text-center">
            Transaction date
          </TableHead>
          <TableHead />
          <TableHead />
          <TableHead className="last:border-r-0" />
          {role === "reviewer" && <TableHead className="last:border-r-0" />}
        </TableRow>
        <TableRow className="border-gray-400 *:h-8 *:border-gray-400 *:border-r *:text-center *:text-foreground">
          {role === "reviewer" && (
            <TableHead className="!border-r-0 pl-3">
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
          <TableHead>Subscription</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>SOA No.</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="last:border-r-0">Action</TableHead>
          {role === "reviewer" && (
            <TableHead className="last:border-r-0">
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
              className={cn(
                "*:border-gray-400 *:border-r odd:bg-gray-100 *:text-center *:text-foreground",
                isChecked && "bg-red-100",
              )}
              key={data.id}
            >
              <React.Suspense>
                {role === "reviewer" && (
                  <TableCell className="!border-r-0">
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
              <TableCell>{data.subscription.name}</TableCell>
              <TableCell>{data.provider.name}</TableCell>
              <TableCell>{formatDate(data.startDate)}</TableCell>
              <TableCell>{formatDate(data.endDate)}</TableCell>
              <TableCell>{data.soaNumber}</TableCell>
              <TableCell>{pesofy(data.amount)}</TableCell>
              <TableCell className="last:border-r-0">
                <div className="flex items-center justify-center">
                  {data.attachments.length > 0 ? (
                    <ShowAttachmentLinks
                      fileUrls={data.attachments.map((a) => a.url)}
                    />
                  ) : null}
                </div>
              </TableCell>
              {role === "reviewer" && (
                <TableCell className="pl-3 last:border-r-0">
                  <input
                    type="hidden"
                    name={`details.${index}.id`}
                    value={data.id}
                  />
                  {isChecked ? (
                    <Select name={`details.${index}.reasonId`}>
                      <SelectTrigger className="bg-inherit text-xs">
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
