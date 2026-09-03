"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type BadgeSize = "sm" | "md" | "lg";
export type BadgeColor = "brand" | "gray" | "error" | "warning" | "success";

export interface BadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  size?: BadgeSize;
  color?: BadgeColor;
  /** Leading status dot tinted to match `color`. */
  withDot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const sizes: Record<BadgeSize, string> = {
  sm: "gap-1 px-2 py-0.5 text-xs",
  md: "gap-1.5 px-2.5 py-0.5 text-sm",
  lg: "gap-1.5 px-3 py-1 text-sm",
};

/*
 * Each color pairs a light and a dark treatment. The raw scale is intentional
 * here: a badge tint must stay recognisably brand/error/success in both themes
 * rather than following the neutral surface tokens.
 */
const colors: Record<BadgeColor, string> = {
  // Light text sits at -900 on the -100 fill: the Figma ramps are bright, and
  // -800 lands at 3.1:1 on brand/success/warning. -900 clears 4.5:1 for all five.
  brand:
    "bg-brand-100 text-brand-900 ring-brand-300 dark:bg-brand-1000/40 dark:text-brand-300 dark:ring-brand-800/50",
  gray: "bg-gray-100 text-gray-900 ring-gray-300 dark:bg-gray-900/60 dark:text-gray-300 dark:ring-gray-700/50",
  error:
    "bg-error-100 text-error-900 ring-error-300 dark:bg-error-1000/40 dark:text-error-300 dark:ring-error-800/50",
  warning:
    "bg-warning-100 text-warning-900 ring-warning-300 dark:bg-warning-1000/40 dark:text-warning-300 dark:ring-warning-800/50",
  success:
    "bg-success-100 text-success-900 ring-success-300 dark:bg-success-1000/40 dark:text-success-300 dark:ring-success-800/50",
};

const dots: Record<BadgeColor, string> = {
  brand: "bg-brand-600",
  gray: "bg-gray-600",
  error: "bg-error-600",
  warning: "bg-warning-600",
  success: "bg-success-600",
};

export function Badge({
  size = "md",
  color = "gray",
  withDot = false,
  icon,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium ring-1 ring-inset",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
        sizes[size],
        colors[color],
        className,
      )}
      {...props}
    >
      {withDot && (
        <span
          className={cn("size-1.5 shrink-0 rounded-full", dots[color])}
          aria-hidden="true"
        />
      )}
      {icon}
      {children}
    </span>
  );
}
