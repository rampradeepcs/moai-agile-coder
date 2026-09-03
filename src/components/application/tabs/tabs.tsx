"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export type TabsVariant = "underline" | "pill";
export type TabsSize = "sm" | "md";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Trailing count chip. */
  badge?: React.ReactNode;
  disabled?: boolean;
  /** Panel body. Omit to render the tab list only. */
  content?: React.ReactNode;
}

export interface TabsProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    "children"
  > {
  items: TabItem[];
  variant?: TabsVariant;
  size?: TabsSize;
  /** Stretches triggers to fill the row. */
  fullWidth?: boolean;
  className?: string;
  listClassName?: string;
}

const sizes: Record<TabsSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  md: "h-10 gap-2 px-3.5 text-sm",
};

const lists: Record<TabsVariant, string> = {
  underline: "flex items-center gap-1 border-b border-border-primary",
  pill: "inline-flex items-center gap-1 rounded-lg bg-bg-tertiary p-1",
};

const triggers: Record<TabsVariant, string> = {
  underline: cn(
    "relative -mb-px cursor-pointer rounded-t-md border-b-2 border-transparent font-semibold text-fg-tertiary transition-colors",
    "hover:border-border-primary hover:text-fg-secondary",
    "data-[state=active]:border-bg-brand-solid data-[state=active]:text-fg-brand",
  ),
  pill: cn(
    "cursor-pointer rounded-md font-semibold text-fg-tertiary transition-colors",
    "hover:text-fg-secondary",
    "data-[state=active]:bg-bg-primary data-[state=active]:text-fg-primary data-[state=active]:shadow-elevation-low",
  ),
};

export function Tabs({
  items,
  variant = "underline",
  size = "md",
  fullWidth = false,
  className,
  listClassName,
  ...props
}: TabsProps) {
  const hasPanels = items.some((item) => item.content !== undefined);

  return (
    <TabsPrimitive.Root className={cn("flex flex-col", className)} {...props}>
      <TabsPrimitive.List
        className={cn(lists[variant], fullWidth && "w-full", listClassName)}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap outline-none",
              "focus-visible:ring-2 focus-visible:ring-brand-600/50",
              "disabled:pointer-events-none disabled:text-fg-disabled",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              sizes[size],
              triggers[variant],
              fullWidth && "flex-1",
            )}
          >
            {item.icon}
            {item.label}
            {item.badge != null && (
              <span className="ml-0.5 rounded-full bg-bg-tertiary px-1.5 py-0.5 text-xs font-medium text-fg-secondary">
                {item.badge}
              </span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {hasPanels &&
        items.map((item) => (
          <TabsPrimitive.Content
            key={item.value}
            value={item.value}
            className="mt-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-600/50"
          >
            {item.content}
          </TabsPrimitive.Content>
        ))}
    </TabsPrimitive.Root>
  );
}
