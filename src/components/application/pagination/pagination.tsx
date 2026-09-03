"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type PaginationVariant = "default" | "compact";

export interface PaginationProps extends React.ComponentPropsWithoutRef<"nav"> {
  /** 1-based current page. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: PaginationVariant;
  /** Page buttons shown around the current page in the `default` variant. */
  siblingCount?: number;
  className?: string;
}

const ELLIPSIS = "ellipsis" as const;
type PageSlot = number | typeof ELLIPSIS;

/**
 * Builds the page list with at most one gap on each side, always keeping the
 * first page, the last page and `siblingCount` neighbours visible.
 */
function buildRange(
  page: number,
  totalPages: number,
  siblingCount: number,
): PageSlot[] {
  // first + last + current + 2 ellipses + siblings on both sides
  const slots = siblingCount * 2 + 5;
  if (totalPages <= slots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, totalPages);
  const showLeftGap = left > 2;
  const showRightGap = right < totalPages - 1;

  if (!showLeftGap && showRightGap) {
    const count = 3 + siblingCount * 2;
    return [
      ...Array.from({ length: count }, (_, i) => i + 1),
      ELLIPSIS,
      totalPages,
    ];
  }

  if (showLeftGap && !showRightGap) {
    const count = 3 + siblingCount * 2;
    return [
      1,
      ELLIPSIS,
      ...Array.from({ length: count }, (_, i) => totalPages - count + 1 + i),
    ];
  }

  return [
    1,
    ELLIPSIS,
    ...Array.from({ length: right - left + 1 }, (_, i) => left + i),
    ELLIPSIS,
    totalPages,
  ];
}

const arrowClasses = cn(
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border-primary bg-bg-primary px-3 text-sm font-semibold text-fg-secondary transition-colors",
  "hover:bg-bg-secondary hover:text-fg-primary",
  "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
  "disabled:pointer-events-none disabled:border-border-disabled disabled:text-fg-disabled",
);

export function Pagination({
  page,
  totalPages,
  onPageChange,
  variant = "default",
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  const clamp = (next: number) => Math.min(Math.max(next, 1), totalPages);
  const goTo = (next: number) => {
    const target = clamp(next);
    if (target !== page) onPageChange(target);
  };

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex items-center gap-3",
        variant === "default" && "justify-between",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className={arrowClasses}
      >
        <ChevronLeftIcon className="size-4" />
        Previous
      </button>

      {variant === "compact" ? (
        <span aria-live="polite" className="text-sm font-medium text-fg-secondary">
          Page {page} of {totalPages}
        </span>
      ) : (
        <ul className="flex items-center gap-0.5">
          {buildRange(page, totalPages, siblingCount).map((slot, index) =>
            slot === ELLIPSIS ? (
              <li
                key={`gap-${index}`}
                aria-hidden="true"
                className="grid size-9 place-items-center text-sm text-fg-tertiary"
              >
                …
              </li>
            ) : (
              <li key={slot}>
                <button
                  type="button"
                  onClick={() => goTo(slot)}
                  aria-current={slot === page ? "page" : undefined}
                  aria-label={`Go to page ${slot}`}
                  className={cn(
                    "grid size-9 cursor-pointer place-items-center rounded-lg text-sm font-medium transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
                    slot === page
                      ? "bg-bg-brand text-fg-brand"
                      : "text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary",
                  )}
                >
                  {slot}
                </button>
              </li>
            ),
          )}
        </ul>
      )}

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className={arrowClasses}
      >
        Next
        <ChevronRightIcon className="size-4" />
      </button>
    </nav>
  );
}
