import * as React from "react";

import { cn } from "@/lib/utils";

export type PanelPadding = "none" | "sm" | "md" | "lg";
export type PanelElevation = "low" | "soft" | "high" | "none";
/**
 * Three heading treatments exist across the app: a document-style title, a
 * smaller one for dense sections, and an uppercase overline in the configurator.
 */
export type PanelTitleStyle = "heading" | "compact" | "overline";

export interface PanelProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Trailing control on the title row — usually a button or menu. */
  action?: React.ReactNode;
  titleStyle?: PanelTitleStyle;
  padding?: PanelPadding;
  elevation?: PanelElevation;
  className?: string;
  /** Applied to the content wrapper below the title row. */
  bodyClassName?: string;
}

const paddings: Record<PanelPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const elevations: Record<PanelElevation, string> = {
  low: "shadow-elevation-low",
  soft: "shadow-soft",
  high: "shadow-elevation-high",
  none: "",
};

/**
 * The class string behind `Panel`. Use it when the surface has to be a
 * different element than a `<section>` — a `motion.div`, a `<button>`, an
 * `<article>` — so those still track one definition.
 */
export function panelClasses({
  padding = "md",
  elevation = "low",
  className,
}: {
  padding?: PanelPadding;
  elevation?: PanelElevation;
  className?: string;
} = {}) {
  return cn(
    "rounded-xl border bg-card",
    paddings[padding],
    elevations[elevation],
    className,
  );
}

/**
 * The workspace's standard card surface. Roughly 25 hand-rolled copies of this
 * markup existed across the configure, docgen, dashboard and users screens.
 */
export function Panel({
  title,
  description,
  action,
  titleStyle = "heading",
  padding = "md",
  elevation = "low",
  className,
  bodyClassName,
  children,
  ...props
}: PanelProps) {
  const hasHeader = Boolean(title || description || action);

  return (
    <section
      className={panelClasses({ padding, elevation, className })}
      {...props}
    >
      {hasHeader && (
        <div
          className={cn(
            "flex justify-between gap-2",
            description ? "items-start" : "items-center",
          )}
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            {title &&
              (titleStyle === "overline" ? (
                <h3 className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  {title}
                </h3>
              ) : titleStyle === "compact" ? (
                <h3 className="text-sm font-semibold">{title}</h3>
              ) : (
                <h2 className="font-semibold tracking-tight">{title}</h2>
              ))}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>
      )}

      {children != null &&
        (hasHeader ? (
          <div className={cn("mt-4", bodyClassName)}>{children}</div>
        ) : bodyClassName ? (
          <div className={bodyClassName}>{children}</div>
        ) : (
          children
        ))}
    </section>
  );
}
