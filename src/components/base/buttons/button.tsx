"use client";

import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "link";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Swaps the leading slot for a spinner and blocks activation. */
  isLoading?: boolean;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  /** Renders the single child as the button, inheriting its styles. */
  asChild?: boolean;
  className?: string;
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-3 text-sm",
  md: "h-10 gap-1.5 px-3.5 text-sm",
  lg: "h-11 gap-2 px-4 text-md",
  xl: "h-12 gap-2 px-[1.125rem] text-md",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-bg-brand-solid text-fg-on-brand hover:bg-brand-700 active:bg-brand-800",
  secondary:
    "border border-border-primary bg-bg-primary text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary active:bg-bg-tertiary",
  tertiary:
    "text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary active:bg-bg-tertiary",
  destructive:
    "bg-error-600 text-white hover:bg-error-700 active:bg-error-800 focus-visible:ring-error-500/50",
  link: "text-fg-brand underline-offset-4 hover:underline",
};

/** Link is typographic — it takes the text size of its row, never the box. */
const linkSizes: Record<ButtonSize, string> = {
  sm: "h-auto gap-1 p-0 text-sm",
  md: "h-auto gap-1 p-0 text-sm",
  lg: "h-auto gap-1.5 p-0 text-md",
  xl: "h-auto gap-1.5 p-0 text-md",
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  iconLeading,
  iconTrailing,
  asChild = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  const classes = cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-colors outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    variant === "link"
      ? "disabled:text-fg-disabled"
      : "disabled:bg-bg-disabled disabled:text-fg-disabled disabled:border-border-disabled",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    variant === "link" ? linkSizes[size] : sizes[size],
    variants[variant],
    className,
  );

  if (asChild) {
    return (
      <Comp className={classes} {...props}>
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Spinner /> : iconLeading}
      {children}
      {iconTrailing}
    </Comp>
  );
}
