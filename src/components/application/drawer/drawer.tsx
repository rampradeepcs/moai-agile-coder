"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type DrawerSide = "left" | "right";
export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  side?: DrawerSide;
  size?: DrawerSize;
  children?: React.ReactNode;
  /** Sticky action row pinned to the bottom edge. */
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
  className?: string;
}

const sizes: Record<DrawerSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
};

const sides: Record<DrawerSide, string> = {
  left: cn(
    "left-0 border-r",
    "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  ),
  right: cn(
    "right-0 border-l",
    "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  ),
};

/** Closes the nearest Drawer. */
export const DrawerClose = DialogPrimitive.Close;

export function Drawer({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  side = "right",
  size = "md",
  children,
  footer,
  hideCloseButton = false,
  className,
}: DrawerProps) {
  return (
    <DialogPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-bg-overlay backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />

        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 z-50 flex w-full flex-col border-border-primary bg-bg-primary shadow-elevation-high",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-300 data-[state=closed]:duration-200",
            sides[side],
            sizes[size],
            className,
          )}
        >
          <div className="flex items-start gap-4 border-b border-border-secondary p-6">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <DialogPrimitive.Title className="text-md font-semibold text-fg-primary">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="text-sm text-fg-tertiary">
                  {description}
                </DialogPrimitive.Description>
              ) : (
                <DialogPrimitive.Description className="sr-only">
                  {typeof title === "string" ? title : "Panel"}
                </DialogPrimitive.Description>
              )}
            </div>

            {!hideCloseButton && (
              <DialogPrimitive.Close
                aria-label="Close"
                className={cn(
                  "-mt-1 -mr-1 grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-fg-tertiary transition-colors",
                  "hover:bg-bg-secondary hover:text-fg-primary",
                  "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
                )}
              >
                <XIcon className="size-4" />
              </DialogPrimitive.Close>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-6 text-sm text-fg-secondary">
            {children}
          </div>

          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-border-secondary p-6">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
