"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export type ToggleSize = "sm" | "md";

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  size?: ToggleSize;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Places the label before the switch — used in settings rows. */
  labelPosition?: "start" | "end";
  className?: string;
  wrapperClassName?: string;
}

const trackSizes: Record<ToggleSize, string> = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
};

const thumbSizes: Record<ToggleSize, string> = {
  sm: "size-4 data-[state=checked]:translate-x-4",
  md: "size-5 data-[state=checked]:translate-x-5",
};

export function Toggle({
  size = "md",
  label,
  hint,
  labelPosition = "end",
  className,
  wrapperClassName,
  id,
  disabled,
  ...props
}: ToggleProps) {
  const generatedId = React.useId();
  const toggleId = id ?? generatedId;

  const control = (
    <SwitchPrimitive.Root
      id={toggleId}
      disabled={disabled}
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-bg-tertiary p-0.5 transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        "data-[state=checked]:bg-bg-brand-solid",
        "disabled:cursor-not-allowed disabled:opacity-50",
        trackSizes[size],
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform data-[state=unchecked]:translate-x-0",
          thumbSizes[size],
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label && !hint) return control;

  const text = (
    <div className="flex flex-col gap-0.5">
      {label && (
        <label
          htmlFor={toggleId}
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

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        labelPosition === "start" && "justify-between",
        wrapperClassName,
      )}
    >
      {labelPosition === "start" ? (
        <>
          {text}
          {control}
        </>
      ) : (
        <>
          {control}
          {text}
        </>
      )}
    </div>
  );
}
