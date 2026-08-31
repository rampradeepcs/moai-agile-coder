"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export type CheckboxSize = "sm" | "md";

export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    "checked" | "defaultChecked" | "onCheckedChange"
  > {
  size?: CheckboxSize;
  /** `"indeterminate"` renders the mixed state and sets `aria-checked="mixed"`. */
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

const sizes: Record<CheckboxSize, string> = {
  sm: "size-4 rounded-xs",
  md: "size-5 rounded-sm",
};

const iconSizes: Record<CheckboxSize, string> = {
  sm: "size-3",
  md: "size-3.5",
};

export function Checkbox({
  size = "md",
  label,
  hint,
  className,
  wrapperClassName,
  id,
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;

  const control = (
    <CheckboxPrimitive.Root
      id={checkboxId}
      disabled={disabled}
      className={cn(
        "peer grid shrink-0 cursor-pointer place-items-center border border-border-primary bg-bg-primary text-fg-on-brand transition-colors outline-none",
        "hover:border-border-brand hover:bg-bg-brand",
        "focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        "data-[state=checked]:border-bg-brand-solid data-[state=checked]:bg-bg-brand-solid",
        "data-[state=indeterminate]:border-bg-brand-solid data-[state=indeterminate]:bg-bg-brand-solid",
        "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-bg-disabled",
        sizes[size],
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center text-current">
        {props.checked === "indeterminate" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={iconSizes[size]}
            aria-hidden="true"
          >
            <path d="M5 12h14" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconSizes[size]}
            aria-hidden="true"
          >
            <path d="m20 6-11 11-5-5" />
          </svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label && !hint) return control;

  return (
    <div className={cn("flex items-start gap-2.5", wrapperClassName)}>
      {control}
      <div className="flex flex-col gap-0.5">
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "cursor-pointer text-sm font-medium text-fg-secondary select-none",
              disabled && "cursor-not-allowed text-fg-disabled",
            )}
          >
            {label}
          </label>
        )}
        {hint && <p className="text-sm text-fg-tertiary">{hint}</p>}
      </div>
    </div>
  );
}
