"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TableCell } from "@/components/ui/table";
import type { opexCategory } from "@/db/schema/fims";
import React, { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { toggleStatus } from "./action";

export function ToggleSwitch({
  defaultValue,
  id,
}: {
  defaultValue: boolean;
  id: number;
}) {
  const [check, setCheck] = useOptimistic(defaultValue);
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      onCheckedChange={(checked) => {
        setCheck(checked);
        startTransition(async () => {
          const response = await toggleStatus(id);
          if (!response.ok) toast.error(response.message);
        });
      }}
      defaultChecked={defaultValue}
    />
  );
}

export function SelectOpex({
  categories,
  defaultValue,
}: {
  categories: (typeof opexCategory.$inferSelect)[];
  defaultValue?: string;
}) {
  const [selected, setSelected] = React.useState<undefined | string>(
    defaultValue,
  );
  return (
    <>
      <TableCell className="text-center">
        <Select
          name="opexCategory"
          onValueChange={(val) => setSelected(val)}
          defaultValue={selected}
        >
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="OpEx Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((item) => (
              <SelectItem value={String(item.id)} key={item.id}>
                {item.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-center">
        <Select disabled value={selected}>
          <SelectTrigger className="w-[180px] text-xs">
            <SelectValue placeholder="OpEx Type" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((item) => (
              <SelectItem value={String(item.id)} key={item.id}>
                {item.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </>
  );
}
