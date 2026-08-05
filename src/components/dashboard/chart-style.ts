import type { CSSProperties } from "react";

/** Shared recharts tooltip styling — dark-mode safe via semantic tokens. */
export const tooltipContentStyle: CSSProperties = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--popover-foreground)",
  fontSize: 12,
  boxShadow: "var(--elevation-mid)",
  padding: "8px 12px",
};

export const tooltipLabelStyle: CSSProperties = {
  color: "var(--muted-foreground)",
  fontWeight: 500,
  marginBottom: 4,
};

export const tooltipItemStyle: CSSProperties = {
  color: "var(--popover-foreground)",
};

export const axisTick = { fill: "var(--muted-foreground)", fontSize: 11 };
