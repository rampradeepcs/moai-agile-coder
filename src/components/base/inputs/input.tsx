"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size"> {
  size?: InputSize;
  label?: string;
  /** Helper text below the field. Replaced by `errorMessage` when invalid. */
  hint?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  /** Leading icon rendered inside the field. */
  icon?: React.ReactNode;
  /** Static text joined to the left edge, e.g. `https://`. */
  addonLeading?: React.ReactNode;
  addonTrailing?: React.ReactNode;
  className?: string;
  /** Applied to the outer wrapper rather than the `<input>`. */
  wrapperClassName?: string;
}

const sizes: Record<InputSize, string> = {
  sm: "h-9 text-sm",
  md: "h-10 text-sm",
  lg: "h-11 text-md",
};

const paddings: Record<InputSize, string> = {
  sm: "px-3",
  md: "px-3.5",
  lg: "px-4",
};

export function Input({
  size = "md",
  label,
  hint,
  errorMessage,
  isInvalid = false,
  icon,
  addonLeading,
  addonTrailing,
  disabled,
  className,
  wrapperClassName,
  id,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const describedById = `${inputId}-description`;
  const description = isInvalid && errorMessage ? errorMessage : hint;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-fg-secondary"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex w-full items-stretch overflow-hidden rounded-lg border bg-bg-primary transition-colors",
          "focus-within:ring-2 focus-within:ring-offset-0",
          isInvalid
            ? "border-border-error focus-within:ring-error-500/30"
            : "border-border-primary focus-within:border-border-brand focus-within:ring-brand-500/30",
          disabled && "cursor-not-allowed bg-bg-disabled",
          sizes[size],
        )}
      >
        {addonLeading && (
          <span
            className={cn(
              "flex items-center border-r border-border-primary bg-bg-secondary text-fg-tertiary",
              paddings[size],
            )}
          >
            {addonLeading}
          </span>
        )}

        {icon && (
          <span
            className={cn(
              "flex items-center pl-3 text-fg-tertiary [&_svg]:size-4 [&_svg]:shrink-0",
              addonLeading && "pl-3",
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={description ? describedById : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-fg-primary outline-none",
            "placeholder:text-fg-tertiary",
            "disabled:cursor-not-allowed disabled:text-fg-disabled",
            icon ? "pl-2" : paddings[size],
            addonTrailing ? "pr-2" : paddings[size],
            className,
          )}
          {...props}
        />

        {addonTrailing && (
          <span
            className={cn(
              "flex items-center text-fg-tertiary [&_svg]:size-4 [&_svg]:shrink-0",
              paddings[size],
            )}
          >
            {addonTrailing}
          </span>
        )}
      </div>

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
