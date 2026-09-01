"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "busy";

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: AvatarSize;
  /** Image source. Falls back to initials, then to the placeholder icon. */
  src?: string;
  alt?: string;
  /** Full name — initials are derived from it when no image loads. */
  name?: string;
  /** Overrides the derived initials. */
  initials?: string;
  /** Replaces the default placeholder icon. */
  icon?: React.ReactNode;
  status?: AvatarStatus;
  className?: string;
  /** Applied to the fallback, for a per-user tint or a custom text colour. */
  fallbackClassName?: string;
}

const sizes: Record<AvatarSize, string> = {
  xs: "size-6 text-xs",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-md",
  xl: "size-14 text-lg",
};

const statusSizes: Record<AvatarSize, string> = {
  xs: "size-1.5",
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
  xl: "size-3.5",
};

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-success-500",
  offline: "bg-gray-400",
  busy: "bg-error-500",
};

/** "Ada Lovelace" → "AL"; single names give one letter. */
function deriveInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  size = "md",
  src,
  alt,
  name,
  initials,
  icon,
  status,
  className,
  fallbackClassName,
  ...props
}: AvatarProps) {
  const resolvedInitials = initials ?? (name ? deriveInitials(name) : "");

  return (
    <span className="relative inline-flex shrink-0">
      <AvatarPrimitive.Root
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-primary bg-bg-tertiary align-middle select-none",
          sizes[size],
          className,
        )}
        {...props}
      >
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={alt ?? name ?? ""}
            className="size-full object-cover"
          />
        )}
        <AvatarPrimitive.Fallback
          delayMs={src ? 300 : 0}
          className={cn(
            "flex size-full items-center justify-center font-semibold text-fg-secondary",
            fallbackClassName,
          )}
        >
          {resolvedInitials || (icon ?? <UserIcon className="size-1/2" />)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>

      {status && (
        <span
          className={cn(
            "absolute right-0 bottom-0 rounded-full ring-2 ring-bg-primary",
            statusSizes[size],
            statusColors[status],
          )}
          aria-label={status}
          role="status"
        />
      )}
    </span>
  );
}

export interface AvatarGroupProps
  extends React.ComponentPropsWithoutRef<"div"> {
  size?: AvatarSize;
  /** Avatars past this count collapse into a `+n` chip. */
  max?: number;
  className?: string;
}

export function AvatarGroup({
  size = "md",
  max,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visible = max ? items.slice(0, max) : items;
  const overflow = items.length - visible.length;

  return (
    <div className={cn("flex items-center -space-x-2", className)} {...props}>
      {visible}
      {overflow > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full border border-border-primary bg-bg-tertiary font-semibold text-fg-secondary",
            sizes[size],
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
