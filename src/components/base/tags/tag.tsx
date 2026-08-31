"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TagSize = "sm" | "md" | "lg";

export interface TagProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "onSelect"> {
  size?: TagSize;
  /** Renders a dismiss control. Fires on click, Enter, Space and Backspace. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Accessible name for the dismiss control. */
  dismissLabel?: string;
  /** Optional leading slot — an avatar, dot or icon. */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const sizes: Record<TagSize, string> = {
  sm: "h-6 gap-1 pl-2 text-xs",
  md: "h-7 gap-1.5 pl-2.5 text-sm",
  lg: "h-8 gap-1.5 pl-3 text-sm",
};

const paddingEnd: Record<TagSize, string> = {
  sm: "pr-2",
  md: "pr-2.5",
  lg: "pr-3",
};

export function Tag({
  size = "md",
  dismissible = false,
  onDismiss,
  dismissLabel,
  icon,
  children,
  className,
  ...props
}: TagProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    // Backspace/Delete on the tag itself is the expected removal gesture in a
    // multi-value field, so support it alongside the dismiss button.
    if (dismissible && (event.key === "Backspace" || event.key === "Delete")) {
      event.preventDefault();
      onDismiss?.();
    }
    props.onKeyDown?.(event);
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border-primary bg-bg-primary font-medium text-fg-secondary",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
        sizes[size],
        !dismissible && paddingEnd[size],
        dismissible && "pr-1",
        className,
      )}
      {...props}
      onKeyDown={handleKeyDown}
    >
      {icon}
      <span className="truncate">{children}</span>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={
            dismissLabel ??
            (typeof children === "string" ? `Remove ${children}` : "Remove")
          }
          className={cn(
            "ml-0.5 grid size-4 shrink-0 cursor-pointer place-items-center rounded-sm text-fg-tertiary transition-colors",
            "hover:bg-bg-tertiary hover:text-fg-primary",
            "focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="size-2.5"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
