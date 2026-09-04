"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface OptionRowProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "onSelect"> {
  /** Ordinal shown on the left, e.g. `"01"`. */
  index?: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

/**
 * Full-width selectable row used by the onboarding questions — a numbered
 * label that tints to the brand green when chosen.
 */
export function OptionRow({
  index,
  label,
  description,
  selected = false,
  onSelect,
  className,
  ...props
}: OptionRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-4 rounded-[10px] border bg-card px-4 py-4 text-left transition-colors sm:gap-[31px] sm:px-[21px]",
        selected
          ? "border-brand-600 bg-brand-600/10"
          : "border-border hover:border-brand-600/40",
        className,
      )}
      {...props}
    >
      {index && (
        <span className="w-[30px] shrink-0 text-body-lg text-muted-foreground">
          {index}
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <span className="text-body-lg text-foreground">{label}</span>
        {description && (
          <span className="text-body-md text-muted-foreground">{description}</span>
        )}
      </span>
    </button>
  );
}
