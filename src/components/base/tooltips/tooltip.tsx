"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export type TooltipSide = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  /** The trigger. Must forward a ref and accept props — Radix clones it. */
  children: React.ReactNode;
  title: React.ReactNode;
  /** Secondary line under the title. */
  description?: React.ReactNode;
  side?: TooltipSide;
  align?: "start" | "center" | "end";
  /** Hides the arrow when false. */
  arrow?: boolean;
  delayDuration?: number;
  sideOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Wrap the app (or a subtree) once so tooltips share a hover-intent timer.
 * Radix requires a provider above any `Tooltip`.
 */
export const TooltipProvider = TooltipPrimitive.Provider;

export function Tooltip({
  children,
  title,
  description,
  side = "top",
  align = "center",
  arrow = true,
  delayDuration = 200,
  sideOffset = 6,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      delayDuration={delayDuration}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-elevation-mid dark:bg-gray-800",
            "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
            className,
          )}
        >
          <p className="font-semibold">{title}</p>
          {description && (
            <p className="mt-0.5 text-gray-300">{description}</p>
          )}
          {arrow && (
            <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-800" />
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
