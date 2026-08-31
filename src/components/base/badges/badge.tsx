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
  brand:
    "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-900/40 dark:text-brand-200 dark:ring-brand-700/50",
  gray: "bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-800/60 dark:text-gray-200 dark:ring-gray-600/50",
  error:
    "bg-error-50 text-error-700 ring-error-200 dark:bg-error-900/40 dark:text-error-200 dark:ring-error-700/50",
  warning:
    "bg-warning-50 text-warning-700 ring-warning-200 dark:bg-warning-900/40 dark:text-warning-200 dark:ring-warning-700/50",
  success:
    "bg-success-50 text-success-700 ring-success-200 dark:bg-success-900/40 dark:text-success-200 dark:ring-success-700/50",
};

const dots: Record<BadgeColor, string> = {
  brand: "bg-brand-500",
  gray: "bg-gray-500",
  error: "bg-error-500",
  warning: "bg-warning-500",
  success: "bg-success-500",
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
