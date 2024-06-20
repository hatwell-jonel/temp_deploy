"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DatePickerProps extends React.ComponentPropsWithoutRef<"input"> {
  hideCalendar?: boolean;
  dateFormat?: string;
  defaultDate?: Date | undefined;
  disablePreviousDates?: boolean;
}

export function DatePickerWithPresets({
  hideCalendar,
  className,
  placeholder,
  dateFormat = "MM/d/y",
  defaultDate,
  disablePreviousDates = true,
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-8 w-[220px] justify-start border-gray-400 text-left font-normal text-xs",
            !date && "text-muted-foreground",
            className,
          )}
        >
          {hideCalendar ? null : (
            <CalendarIcon className="mr-2 size-4 text-primary" />
          )}
          {date ? (
            format(date, dateFormat)
          ) : (
            <span>{placeholder || "MM/DD/YYYY"}</span>
          )}
          <input
            type="hidden"
            {...props}
            value={date ? String(date?.toISOString()) : undefined}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), Number.parseInt(value)))
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={
              disablePreviousDates
                ? (date) =>
                    new Date(date).setHours(0, 0, 0, 0) <
                      new Date().setHours(0, 0, 0, 0) ||
                    new Date(date).setHours(0, 0, 0, 0) <
                      new Date("1900-01-01").setHours(0, 0, 0, 0)
                : undefined
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
