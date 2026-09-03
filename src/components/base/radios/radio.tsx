"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export type RadioVariant = "default" | "card";
export type RadioSize = "sm" | "md";

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /** `card` turns each item into a selectable bordered panel. */
  variant?: RadioVariant;
  size?: RadioSize;
  className?: string;
}

export interface RadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}

/** Variant and size travel down to the items so call sites set them once. */
const RadioContext = React.createContext<{
  variant: RadioVariant;
  size: RadioSize;
}>({ variant: "default", size: "md" });

const dotSizes: Record<RadioSize, string> = {
  sm: "size-4",
  md: "size-5",
};

const indicatorSizes: Record<RadioSize, string> = {
  sm: "size-1.5",
  md: "size-2",
};

export function RadioGroup({
  variant = "default",
  size = "md",
  className,
  ...props
}: RadioGroupProps) {
  const context = React.useMemo(() => ({ variant, size }), [variant, size]);

  return (
    <RadioContext.Provider value={context}>
      <RadioGroupPrimitive.Root
        className={cn("grid gap-2.5", className)}
        {...props}
      />
    </RadioContext.Provider>
  );
}

export function Radio({
  label,
  hint,
  className,
  id,
  disabled,
  ...props
}: RadioProps) {
  const { variant, size } = React.useContext(RadioContext);
  const generatedId = React.useId();
  const radioId = id ?? generatedId;

  const control = (
    <RadioGroupPrimitive.Item
      id={radioId}
      disabled={disabled}
      className={cn(
        "grid shrink-0 cursor-pointer place-items-center rounded-full border border-border-primary bg-bg-primary transition-colors outline-none",
        "hover:border-border-brand hover:bg-bg-brand",
        "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        "data-[state=checked]:border-bg-brand-solid data-[state=checked]:bg-bg-brand-solid",
        "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-bg-disabled",
        dotSizes[size],
        variant === "default" && className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn(
          "rounded-full bg-fg-on-brand",
          indicatorSizes[size],
        )}
      />
    </RadioGroupPrimitive.Item>
  );

  const text = (label || hint) && (
    <div className="flex flex-col gap-0.5">
      {label && (
        <label
          htmlFor={radioId}
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
  );

  if (variant === "card") {
    return (
      // `has-[[data-state=checked]]` lifts the selected state to the panel so
      // the whole card reads as selected without duplicating React state.
      <label
        htmlFor={radioId}
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-xl border border-border-primary bg-bg-primary p-4 transition-colors",
          "hover:border-border-brand hover:bg-bg-secondary",
          "has-[[data-state=checked]]:border-border-brand has-[[data-state=checked]]:bg-bg-brand",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-600/50",
          disabled && "cursor-not-allowed opacity-60 hover:border-border-primary hover:bg-bg-primary",
          className,
        )}
      >
        {control}
        {text}
      </label>
    );
  }

  if (!label && !hint) return control;

  return (
    <div className="flex items-start gap-2.5">
      {control}
      {text}
    </div>
  );
}
