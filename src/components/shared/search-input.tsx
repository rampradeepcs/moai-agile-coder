"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export type SearchInputSize = "sm" | "md" | "lg";

export interface SearchInputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size" | "onChange"> {
  size?: SearchInputSize;
  value: string;
  /** Receives the value directly — the common case at every call site. */
  onValueChange: (value: string) => void;
  /** Required: every search field needs an accessible name. */
  "aria-label": string;
  className?: string;
  /** Applied to the positioning wrapper rather than the input. */
  wrapperClassName?: string;
}

/**
 * Search field with a leading icon. Six screens hand-rolled this
 * relative-wrapper-plus-absolute-icon markup, each with slightly different
 * metrics; the three sizes here reproduce all of them.
 */
const sizes: Record<SearchInputSize, { field: string; icon: string }> = {
  sm: { field: "h-8 pl-8 text-xs", icon: "left-2.5 size-3.5" },
  md: { field: "pl-9", icon: "left-3 size-4" },
  lg: { field: "h-11 pl-9", icon: "left-3 size-4" },
};

export function SearchInput({
  size = "md",
  value,
  onValueChange,
  className,
  wrapperClassName,
  ...props
}: SearchInputProps) {
  const metrics = sizes[size];

  return (
    <div className={cn("relative", wrapperClassName)}>
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          metrics.icon,
        )}
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn(metrics.field, className)}
        {...props}
      />
    </div>
  );
}
