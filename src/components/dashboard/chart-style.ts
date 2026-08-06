import type { CSSProperties } from "react";

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
