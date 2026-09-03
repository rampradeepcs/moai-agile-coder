"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional trigger. Omit when driving the modal with `open`. */
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Leading icon rendered in a tinted circle beside the title. */
  icon?: React.ReactNode;
  size?: ModalSize;
  children?: React.ReactNode;
  /** Footer action row — usually a cancel and a confirm `Button`. */
  footer?: React.ReactNode;
  /** Hides the close affordance in the top-right. */
  hideCloseButton?: boolean;
  className?: string;
}

const sizes: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

/** Closes the nearest Modal. Use inside `footer` for cancel buttons. */
export const ModalClose = DialogPrimitive.Close;

export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  icon,
  size = "md",
  children,
  footer,
  hideCloseButton = false,
  className,
}: ModalProps) {
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
            "fixed top-1/2 left-1/2 z-50 flex w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col",
            "max-h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-border-primary bg-bg-primary shadow-elevation-high",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            sizes[size],
            className,
          )}
        >
          <div className="flex items-start gap-4 p-6 pb-4">
            {icon && (
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-bg-brand text-fg-brand [&_svg]:size-5">
                {icon}
              </span>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <DialogPrimitive.Title className="text-md font-semibold text-fg-primary">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="text-sm text-fg-tertiary">
                  {description}
                </DialogPrimitive.Description>
              ) : (
                // Radix warns without a description; keep it for screen readers.
                <DialogPrimitive.Description className="sr-only">
                  {typeof title === "string" ? title : "Dialog"}
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

          {children && (
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2 text-sm text-fg-secondary">
              {children}
            </div>
          )}

          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-border-secondary px-6 py-4">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
