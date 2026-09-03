"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export type DatePickerSize = "sm" | "md" | "lg";

interface DatePickerBaseProps {
  label?: string;
  hint?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  placeholder?: string;
  size?: DatePickerSize;
  disabled?: boolean;
  /** Passed through to react-day-picker to grey out unselectable days. */
  disabledDates?: React.ComponentProps<typeof Calendar>["disabled"];
  /** `date-fns` pattern used to render the selected value. */
  dateFormat?: string;
  className?: string;
  wrapperClassName?: string;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: "single";
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

const sizes: Record<DatePickerSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-3.5 text-sm",
  lg: "h-11 px-4 text-md",
};

export function DatePicker(props: DatePickerProps) {
  const {
    label,
    hint,
    errorMessage,
    isInvalid = false,
    placeholder,
    size = "md",
    disabled,
    disabledDates,
    dateFormat = "d MMM yyyy",
    className,
    wrapperClassName,
  } = props;

  const isRange = props.mode === "range";
  const describedById = React.useId();
  const [open, setOpen] = React.useState(false);

  // One piece of state covers both modes; the mode decides how it is read.
  const [innerValue, setInnerValue] = React.useState<Date | DateRange | undefined>(
    props.defaultValue,
  );
  const selected = props.value ?? innerValue;

  const commit = (next: Date | DateRange | undefined) => {
    if (props.value === undefined) setInnerValue(next);
    if (isRange) {
      (props as DatePickerRangeProps).onValueChange?.(next as DateRange | undefined);
    } else {
      (props as DatePickerSingleProps).onValueChange?.(next as Date | undefined);
      // A single date completes the interaction, so close the popover.
      if (next) setOpen(false);
    }
  };

  const display = React.useMemo(() => {
    if (!selected) return null;
    if (isRange) {
      const range = selected as DateRange;
      if (!range.from) return null;
      return range.to
        ? `${format(range.from, dateFormat)} – ${format(range.to, dateFormat)}`
        : format(range.from, dateFormat);
    }
    return format(selected as Date, dateFormat);
  }, [selected, isRange, dateFormat]);

  const description = isInvalid && errorMessage ? errorMessage : hint;
  const fallback = placeholder ?? (isRange ? "Select a date range" : "Select a date");

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <span className="text-sm font-medium text-fg-secondary">{label}</span>
      )}

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          disabled={disabled}
          aria-label={label ?? fallback}
          aria-invalid={isInvalid || undefined}
          aria-describedby={description ? describedById : undefined}
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 rounded-lg border bg-bg-primary text-left transition-colors outline-none",
            "focus:ring-2 data-[state=open]:ring-2",
            isInvalid
              ? "border-border-error focus:ring-error-600/30 data-[state=open]:ring-error-600/30"
              : "border-border-primary focus:border-border-brand focus:ring-brand-600/30 data-[state=open]:border-border-brand data-[state=open]:ring-brand-600/30",
            "disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-fg-disabled",
            sizes[size],
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-fg-tertiary" />
          <span
            className={cn(
              "flex-1 truncate",
              display ? "text-fg-primary" : "text-fg-tertiary",
            )}
          >
            {display ?? fallback}
          </span>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            className={cn(
              "z-50 rounded-xl border border-border-primary bg-bg-primary p-0 shadow-elevation-mid",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            )}
          >
            {isRange ? (
              <Calendar
                mode="range"
                numberOfMonths={2}
                autoFocus
                disabled={disabledDates}
                selected={selected as DateRange | undefined}
                onSelect={(range) => commit(range)}
                className="bg-transparent"
              />
            ) : (
              <Calendar
                mode="single"
                autoFocus
                disabled={disabledDates}
                selected={selected as Date | undefined}
                onSelect={(date) => commit(date)}
                className="bg-transparent"
              />
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {description && (
        <p
          id={describedById}
          className={cn(
            "text-sm",
            isInvalid && errorMessage ? "text-fg-error" : "text-fg-tertiary",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
