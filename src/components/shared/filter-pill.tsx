"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterPillProps {
  label: string;
  /** Leading Lucide icon. Used by the backlog toolbar. */
  icon?: React.ElementType;
  selected: string[];
  /**
   * Declarative option list. Omit and pass `children` instead when the items
   * need custom content — avatars, priority dots, status icons.
   */
  options?: FilterOption[];
  onToggle?: (value: string) => void;
  /** Adds a "Clear selection" row while anything is selected. */
  onClear?: () => void;
  children?: React.ReactNode;
  contentClassName?: string;
}

/**
 * Multi-select filter dropdown used by the backlog and kanban toolbars, which
 * previously carried two copies of this that had drifted apart — different
 * count-badge shapes and only one showing an active state on the trigger.
 */
export function FilterPill({
  label,
  icon: Icon,
  selected,
  options,
  onToggle,
  onClear,
  children,
  contentClassName,
}: FilterPillProps) {
  const active = selected.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 px-3 text-xs font-medium",
            active && "border-brand/40 text-brand",
          )}
        >
          {Icon && (
            <Icon
              className={cn("size-3.5", active ? "text-brand" : "text-muted-foreground")}
              aria-hidden
            />
          )}
          {label}
          {active && (
            <span className="grid size-4 place-items-center rounded-full bg-brand-subtle text-[10px] font-semibold text-brand">
              {selected.length}
            </span>
          )}
          <ChevronDown className="size-3 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className={cn("max-h-80 w-56 overflow-y-auto", contentClassName)}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Filter by {label.toLowerCase()}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {options
          ? options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selected.includes(option.value)}
                onCheckedChange={() => onToggle?.(option.value)}
                // Keep the menu open so several values can be picked in a row.
                onSelect={(event) => event.preventDefault()}
                className="text-xs"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))
          : children}

        {active && onClear && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xs text-muted-foreground"
              onSelect={onClear}
            >
              Clear selection
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
