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

/*
 * `md` is the Figma CTA: 44px tall, 20px of horizontal padding, 6px gap and
 * the Button/1 text style. The other sizes step around it.
 */
const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-3.5 text-button-1",
  md: "h-11 gap-1.5 px-5 text-button-1",
  lg: "h-12 gap-2 px-6 text-button-1",
  xl: "h-14 gap-2 px-7 text-body-lg",
};

/*
 * The Figma CTA puts near-black text on the bright brand green rather than
 * white: #1a1a1a on #24d47d clears 8:1, where white would sit at 1.95:1.
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-brand-100 bg-brand-600 text-gray-900 hover:bg-brand-500 active:bg-brand-700",
  secondary:
    "border border-border bg-card text-foreground hover:bg-accent active:bg-accent",
  tertiary:
    "text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary active:bg-bg-tertiary",
  destructive:
    "bg-error-700 text-white hover:bg-error-800 active:bg-error-900 focus-visible:ring-error-600/50",
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
    "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[10px] font-medium whitespace-nowrap transition-colors outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
