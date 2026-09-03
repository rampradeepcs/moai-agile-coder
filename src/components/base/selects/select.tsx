"use client";

import * as React from "react";
import {
  DropdownMenu as DropdownMenuPrimitive,
  Select as SelectPrimitive,
} from "radix-ui";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectBaseProps {
  options: SelectOption[];
  label?: string;
  hint?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  placeholder?: string;
  size?: SelectSize;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
}

export interface SelectSingleProps extends SelectBaseProps {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface SelectMultiProps extends SelectBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type SelectProps = SelectSingleProps | SelectMultiProps;

const sizes: Record<SelectSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-3.5 text-sm",
  lg: "h-11 px-4 text-md",
};

function triggerClasses(
  size: SelectSize,
  isInvalid: boolean,
  className?: string,
) {
  return cn(
    "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-bg-primary text-fg-primary transition-colors outline-none",
    "focus:ring-2 focus:ring-offset-0 data-[state=open]:ring-2",
    isInvalid
      ? "border-border-error focus:ring-error-600/30 data-[state=open]:ring-error-600/30"
      : "border-border-primary focus:border-border-brand focus:ring-brand-600/30 data-[state=open]:border-border-brand data-[state=open]:ring-brand-600/30",
    "disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-fg-disabled",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    sizes[size],
    className,
  );
}

const contentClasses = cn(
  "z-50 max-h-72 min-w-[var(--radix-dropdown-menu-trigger-width,var(--radix-select-trigger-width))] overflow-y-auto rounded-lg border border-border-primary bg-bg-primary p-1 shadow-elevation-mid",
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
);

const itemClasses = cn(
  "relative flex cursor-pointer items-center gap-2 rounded-md py-2 pr-8 pl-2.5 text-sm text-fg-primary outline-none select-none",
  "focus:bg-bg-secondary data-[highlighted]:bg-bg-secondary",
  "data-[disabled]:pointer-events-none data-[disabled]:text-fg-disabled",
);

function OptionBody({ option }: { option: SelectOption }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      {option.icon}
      <span className="flex min-w-0 flex-col">
        <span className="truncate">{option.label}</span>
        {option.description && (
          <span className="truncate text-xs text-fg-tertiary">
            {option.description}
          </span>
        )}
      </span>
    </span>
  );
}

function FieldShell({
  label,
  hint,
  errorMessage,
  isInvalid,
  wrapperClassName,
  describedById,
  children,
}: {
  label?: string;
  hint?: string;
  errorMessage?: string;
  isInvalid: boolean;
  wrapperClassName?: string;
  describedById: string;
  children: React.ReactNode;
}) {
  const description = isInvalid && errorMessage ? errorMessage : hint;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <span className="text-sm font-medium text-fg-secondary">{label}</span>
      )}
      {children}
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

export function Select(props: SelectProps) {
  const {
    options,
    label,
    hint,
    errorMessage,
    isInvalid = false,
    placeholder = "Select an option",
    size = "md",
    disabled,
    className,
    wrapperClassName,
  } = props;

  const describedById = React.useId();

  /* ---------------------------------------------------------------- multi */
  if (props.multiple) {
    return (
      <MultiSelect
        {...props}
        size={size}
        isInvalid={isInvalid}
        placeholder={placeholder}
        describedById={describedById}
        wrapperClassName={wrapperClassName}
        className={className}
      />
    );
  }

  /* --------------------------------------------------------------- single */
  return (
    <FieldShell
      label={label}
      hint={hint}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      wrapperClassName={wrapperClassName}
      describedById={describedById}
    >
      <SelectPrimitive.Root
        value={props.value}
        defaultValue={props.defaultValue}
        onValueChange={props.onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          aria-label={label}
          aria-invalid={isInvalid || undefined}
          className={triggerClasses(size, isInvalid, className)}
        >
          <SelectPrimitive.Value
            placeholder={
              <span className="text-fg-tertiary">{placeholder}</span>
            }
          />
          <SelectPrimitive.Icon asChild>
            <ChevronDownIcon className="text-fg-tertiary" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={6}
            className={contentClasses}
          >
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={itemClasses}
                >
                  <SelectPrimitive.ItemText>
                    <OptionBody option={option} />
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2.5">
                    <CheckIcon className="size-4 text-fg-brand" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </FieldShell>
  );
}

function MultiSelect({
  options,
  label,
  hint,
  errorMessage,
  isInvalid,
  placeholder,
  size,
  disabled,
  className,
  wrapperClassName,
  describedById,
  value,
  defaultValue,
  onValueChange,
}: SelectMultiProps & {
  isInvalid: boolean;
  placeholder: string;
  size: SelectSize;
  describedById: string;
}) {
  const [innerValue, setInnerValue] = React.useState<string[]>(
    defaultValue ?? [],
  );
  const selected = value ?? innerValue;

  const toggle = (optionValue: string) => {
    const next = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue];
    if (value === undefined) setInnerValue(next);
    onValueChange?.(next);
  };

  const summary =
    selected.length === 0
      ? null
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? placeholder)
        : `${selected.length} selected`;

  return (
    <FieldShell
      label={label}
      hint={hint}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      wrapperClassName={wrapperClassName}
      describedById={describedById}
    >
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger
          disabled={disabled}
          aria-label={label}
          aria-invalid={isInvalid || undefined}
          className={triggerClasses(size, isInvalid, className)}
        >
          <span className={cn("truncate", !summary && "text-fg-tertiary")}>
            {summary ?? placeholder}
          </span>
          <ChevronDownIcon className="text-fg-tertiary" />
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            sideOffset={6}
            align="start"
            className={contentClasses}
          >
            {options.map((option) => (
              <DropdownMenuPrimitive.CheckboxItem
                key={option.value}
                checked={selected.includes(option.value)}
                disabled={option.disabled}
                // Keep the menu open so several values can be picked in a row.
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={() => toggle(option.value)}
                className={itemClasses}
              >
                <OptionBody option={option} />
                <DropdownMenuPrimitive.ItemIndicator className="absolute right-2.5">
                  <CheckIcon className="size-4 text-fg-brand" />
                </DropdownMenuPrimitive.ItemIndicator>
              </DropdownMenuPrimitive.CheckboxItem>
            ))}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </FieldShell>
  );
}
