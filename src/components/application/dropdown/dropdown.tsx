"use client";

import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Right-aligned hint, e.g. `⌘K`. */
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
  /** Renders the item in the error colour for destructive actions. */
  destructive?: boolean;
}

export interface DropdownSection {
  id: string;
  /** Optional section heading. Sections are separated by a rule. */
  label?: string;
  items: DropdownItem[];
}

export interface DropdownProps {
  /** The trigger element — cloned by Radix, so it must accept props. */
  trigger: React.ReactNode;
  /** Flat list. Ignored when `sections` is supplied. */
  items?: DropdownItem[];
  sections?: DropdownSection[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function MenuItem({ item }: { item: DropdownItem }) {
  return (
    <DropdownMenuPrimitive.Item
      disabled={item.disabled}
      onSelect={item.onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm outline-none select-none",
        "data-[highlighted]:bg-bg-secondary",
        "data-[disabled]:pointer-events-none data-[disabled]:text-fg-disabled",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        item.destructive
          ? "text-fg-error data-[highlighted]:bg-error-50 dark:data-[highlighted]:bg-error-900/30"
          : "text-fg-primary",
      )}
    >
      {item.icon && (
        <span
          className={cn(
            "shrink-0",
            item.destructive ? "text-fg-error" : "text-fg-tertiary",
          )}
        >
          {item.icon}
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.shortcut && (
        <span className="shrink-0 text-xs tracking-wide text-fg-tertiary">
          {item.shortcut}
        </span>
      )}
    </DropdownMenuPrimitive.Item>
  );
}

export function Dropdown({
  trigger,
  items,
  sections,
  side = "bottom",
  align = "start",
  open,
  defaultOpen,
  onOpenChange,
  className,
}: DropdownProps) {
  const resolved: DropdownSection[] =
    sections ?? (items ? [{ id: "default", items }] : []);

  return (
    <DropdownMenuPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          side={side}
          align={align}
          sideOffset={6}
          className={cn(
            "z-50 min-w-56 overflow-hidden rounded-lg border border-border-primary bg-bg-primary p-1 shadow-elevation-mid",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className,
          )}
        >
          {resolved.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && (
                <DropdownMenuPrimitive.Separator className="-mx-1 my-1 h-px bg-border-primary" />
              )}
              {section.label && (
                <DropdownMenuPrimitive.Label className="px-2.5 py-1.5 text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
                  {section.label}
                </DropdownMenuPrimitive.Label>
              )}
              {section.items.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </React.Fragment>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
