"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type EmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Displayed in a tinted circle above the title. */
  icon?: React.ReactNode;
  /** Primary and secondary actions — usually `Button`s. */
  action?: React.ReactNode;
  size?: EmptyStateSize;
  className?: string;
}

const sizes: Record<EmptyStateSize, string> = {
  sm: "gap-3 py-8",
  md: "gap-4 py-12",
  lg: "gap-5 py-16",
};

const iconSizes: Record<EmptyStateSize, string> = {
  sm: "size-10 [&_svg]:size-5",
  md: "size-12 [&_svg]:size-6",
  lg: "size-14 [&_svg]:size-7",
};

const titleSizes: Record<EmptyStateSize, string> = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  size = "md",
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className={cn(
            "grid shrink-0 place-items-center rounded-full border border-border-secondary bg-bg-secondary text-fg-tertiary",
            iconSizes[size],
          )}
        >
          {icon}
        </span>
      )}

      <div className="flex max-w-sm flex-col gap-1">
        <p className={cn("font-semibold text-fg-primary", titleSizes[size])}>
          {title}
        </p>
        {description && (
          <p className="text-sm text-fg-tertiary">{description}</p>
        )}
      </div>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
