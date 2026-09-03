"use client";

import * as React from "react";
import { toast as sonner } from "sonner";
import {
  CheckCircle2Icon,
  InfoIcon,
  TriangleAlertIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  type?: NotificationType;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Action row under the text — links or small buttons. */
  action?: React.ReactNode;
  /** Shows a dismiss control. */
  onDismiss?: () => void;
  className?: string;
}

const icons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2Icon,
  error: XCircleIcon,
  warning: TriangleAlertIcon,
  info: InfoIcon,
};

const accents: Record<NotificationType, string> = {
  success: "text-fg-success",
  error: "text-fg-error",
  warning: "text-fg-warning",
  info: "text-fg-brand",
};

const surfaces: Record<NotificationType, string> = {
  success: "border-success-300 bg-success-100 dark:border-success-900/60 dark:bg-success-1000/25",
  error: "border-error-300 bg-error-100 dark:border-error-900/60 dark:bg-error-1000/25",
  warning: "border-warning-300 bg-warning-100 dark:border-warning-900/60 dark:bg-warning-1000/25",
  info: "border-brand-300 bg-brand-100 dark:border-brand-900/60 dark:bg-brand-1000/25",
};

/**
 * The inline notification surface. Use it directly for banners, or via the
 * `toast` helpers below for transient messages.
 */
export function Notification({
  type = "info",
  title,
  description,
  action,
  onDismiss,
  className,
  ...props
}: NotificationProps) {
  const Icon = icons[type];

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 shadow-elevation-low",
        surfaces[type],
        className,
      )}
      {...props}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", accents[type])} />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-fg-primary">{title}</p>
        {description && (
          <p className="text-sm text-fg-secondary">{description}</p>
        )}
        {action && <div className="mt-1 flex items-center gap-3">{action}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            "-mt-1 -mr-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-fg-tertiary transition-colors",
            "hover:bg-black/5 hover:text-fg-primary dark:hover:bg-white/10",
            "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
          )}
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}

export interface ToastOptions {
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Milliseconds before auto-dismiss. */
  duration?: number;
}

function show(type: NotificationType, title: React.ReactNode, options?: ToastOptions) {
  return sonner.custom(
    (id) => (
      <Notification
        type={type}
        title={title}
        description={options?.description}
        action={options?.action}
        onDismiss={() => sonner.dismiss(id)}
        className="w-full max-w-sm bg-bg-primary shadow-elevation-mid"
      />
    ),
    { duration: options?.duration },
  );
}

/**
 * Design-system toasts. Renders the `Notification` surface through sonner, so
 * the `<Toaster />` already mounted in `providers.tsx` positions them.
 */
export const toast = {
  success: (title: React.ReactNode, options?: ToastOptions) =>
    show("success", title, options),
  error: (title: React.ReactNode, options?: ToastOptions) =>
    show("error", title, options),
  warning: (title: React.ReactNode, options?: ToastOptions) =>
    show("warning", title, options),
  info: (title: React.ReactNode, options?: ToastOptions) =>
    show("info", title, options),
  dismiss: sonner.dismiss,
};
