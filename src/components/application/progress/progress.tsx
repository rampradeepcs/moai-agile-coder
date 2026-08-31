"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export type ProgressColor = "brand" | "success" | "warning" | "error";
export type ProgressSize = "sm" | "md" | "lg";
export type ProgressLabelPosition = "none" | "right" | "bottom";

export interface ProgressProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    "value"
  > {
  /** 0–100. Values outside the range are clamped. */
  value?: number;
  max?: number;
  color?: ProgressColor;
  size?: ProgressSize;
  labelPosition?: ProgressLabelPosition;
  /** Overrides the rendered label. Defaults to a percentage. */
  label?: React.ReactNode;
  className?: string;
}

const trackSizes: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-2.5",
};

const fills: Record<ProgressColor, string> = {
  brand: "bg-bg-brand-solid",
  success: "bg-success-600",
  warning: "bg-warning-500",
  error: "bg-error-600",
};

function clampPercent(value: number, max: number) {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(Math.max((value / max) * 100, 0), 100);
}

export function Progress({
  value = 0,
  max = 100,
  color = "brand",
  size = "md",
  labelPosition = "none",
  label,
  className,
  ...props
}: ProgressProps) {
  const percent = clampPercent(value, max);
  const text = label ?? `${Math.round(percent)}%`;

  const bar = (
    <ProgressPrimitive.Root
      value={percent}
      max={100}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-bg-tertiary",
        trackSizes[size],
        labelPosition === "none" && className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-full transition-[width]", fills[color])}
        style={{ width: `${percent}%` }}
      />
    </ProgressPrimitive.Root>
  );

  if (labelPosition === "none") return bar;

  return (
    <div
      className={cn(
        "flex w-full",
        labelPosition === "right"
          ? "items-center gap-3"
          : "flex-col gap-1.5",
        className,
      )}
    >
      {bar}
      <span
        className={cn(
          "shrink-0 text-sm font-medium tabular-nums text-fg-secondary",
          labelPosition === "bottom" && "self-end",
        )}
      >
        {text}
      </span>
    </div>
  );
}

export interface ProgressCircleProps
  extends React.ComponentPropsWithoutRef<"div"> {
  value?: number;
  max?: number;
  color?: ProgressColor;
  /** Diameter in pixels. */
  size?: number;
  strokeWidth?: number;
  /** Centre content. Defaults to a percentage; pass `null` to leave it empty. */
  label?: React.ReactNode;
  className?: string;
}

const strokes: Record<ProgressColor, string> = {
  brand: "stroke-brand-600",
  success: "stroke-success-600",
  warning: "stroke-warning-500",
  error: "stroke-error-600",
};

export function ProgressCircle({
  value = 0,
  max = 100,
  color = "brand",
  size = 96,
  strokeWidth = 8,
  label,
  className,
  ...props
}: ProgressCircleProps) {
  const percent = clampPercent(value, max);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Offsetting the dash array by the unfilled portion draws the arc.
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        className,
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-bg-tertiary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset]", strokes[color])}
        />
      </svg>

      {label !== null && (
        <span className="absolute text-sm font-semibold tabular-nums text-fg-primary">
          {label ?? `${Math.round(percent)}%`}
        </span>
      )}
    </div>
  );
}
