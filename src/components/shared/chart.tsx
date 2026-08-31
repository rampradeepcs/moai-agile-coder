"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ tokens */

/** Shared recharts tooltip styling — dark-mode safe via semantic tokens. */
export const tooltipContentStyle: CSSProperties = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--popover-foreground)",
  fontSize: 12,
  lineHeight: 1.5,
  boxShadow: "var(--elevation-mid)",
  padding: "8px 12px",
};

export const tooltipLabelStyle: CSSProperties = {
  color: "var(--muted-foreground)",
  fontWeight: 500,
  fontSize: 11,
  marginBottom: 6,
};

export const tooltipItemStyle: CSSProperties = {
  color: "var(--popover-foreground)",
  padding: "1px 0",
};

export const axisTick = { fill: "var(--muted-foreground)", fontSize: 11 };

/** Faint dashed grid — shared by all cartesian charts. */
export const gridProps = {
  vertical: false,
  stroke: "var(--border)",
  strokeDasharray: "3 4",
  strokeOpacity: 0.7,
} as const;

/** Spread onto `<XAxis>` / `<YAxis>` for the house axis treatment. */
export const axisProps = {
  tick: axisTick,
  tickLine: false,
  axisLine: false,
} as const;

/* -------------------------------------------------------------- components */

export interface ChartFrameProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Chart height in pixels. Width always fills the container. */
  height?: number;
  /** A single recharts chart element. */
  children: React.ReactElement;
  className?: string;
}

/**
 * Sized, responsive wrapper for a recharts chart.
 *
 * `min-w-0` matters: without it a chart inside a flex or grid parent refuses to
 * shrink and pushes the layout wider on small screens.
 */
export function ChartFrame({
  height = 260,
  children,
  className,
  ...props
}: ChartFrameProps) {
  return (
    <div
      className={cn("w-full min-w-0", className)}
      style={{ height }}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export type ChartTooltipProps = React.ComponentProps<typeof Tooltip>;

/**
 * Recharts `<Tooltip>` pre-wired with the house styling. Use it in place of the
 * bare import so the three style objects stay in one place.
 */
export function ChartTooltip(props: ChartTooltipProps) {
  return (
    <Tooltip
      contentStyle={tooltipContentStyle}
      labelStyle={tooltipLabelStyle}
      itemStyle={tooltipItemStyle}
      cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
      {...props}
    />
  );
}

export interface ChartLegendItem {
  /** Swatch colour — any CSS colour, usually a chart token. */
  color: string;
  label: React.ReactNode;
}

export interface ChartLegendProps
  extends Omit<React.ComponentPropsWithoutRef<"ul">, "children"> {
  items: ChartLegendItem[];
  className?: string;
}

/** Dot-and-label legend rendered under a chart. */
export function ChartLegend({ items, className, ...props }: ChartLegendProps) {
  return (
    <ul className={cn("flex flex-wrap gap-4", className)} {...props}>
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: item.color }}
            aria-hidden
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
