"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  hint?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  /** Shows a `used / maxLength` counter. Requires `maxLength`. */
  showCount?: boolean;
  className?: string;
  wrapperClassName?: string;
}

export function Textarea({
  label,
  hint,
  errorMessage,
  isInvalid = false,
  showCount = false,
  maxLength,
  disabled,
  className,
  wrapperClassName,
  id,
  value,
  defaultValue,
  onChange,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const describedById = `${textareaId}-description`;
  const description = isInvalid && errorMessage ? errorMessage : hint;

  // Track length for the counter while staying usable as a controlled field.
  const [innerLength, setInnerLength] = React.useState(
    String(defaultValue ?? "").length,
  );
  const length = value !== undefined ? String(value).length : innerLength;
  const overLimit = maxLength !== undefined && length > maxLength;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setInnerLength(event.target.value.length);
    onChange?.(event);
  };

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-fg-secondary"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-invalid={isInvalid || undefined}
        aria-describedby={description || showCount ? describedById : undefined}
        className={cn(
          "w-full resize-y rounded-lg border bg-bg-primary px-3.5 py-2.5 text-sm text-fg-primary outline-none transition-colors",
          "placeholder:text-fg-tertiary",
          "focus:ring-2 focus:ring-offset-0",
          isInvalid
            ? "border-border-error focus:ring-error-600/30"
            : "border-border-primary focus:border-border-brand focus:ring-brand-600/30",
          "disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-fg-disabled",
          className,
        )}
        {...props}
      />

      {(description || showCount) && (
        <div className="flex items-start justify-between gap-3">
          <p
            id={describedById}
            className={cn(
              "text-sm",
              isInvalid && errorMessage ? "text-fg-error" : "text-fg-tertiary",
            )}
          >
            {description}
          </p>
          {showCount && maxLength !== undefined && (
            <span
              aria-live="polite"
              className={cn(
                "shrink-0 text-sm tabular-nums",
                overLimit ? "text-fg-error" : "text-fg-tertiary",
              )}
            >
              {length} / {maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
