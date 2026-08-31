"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatCardTone =
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "teal"
  | "pink"
  | "neutral";

export interface StatCardProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  label: string;
  /**
   * Displayed value. A leading number is counted up on mount, so `"80%"`,
   * `"4.2 days"` and `"1,204"` all animate while `"—"` renders as-is.
   */
  value: string;
  /** Supporting line under the value, e.g. `"40,520 remaining"`. */
  sub?: string;
  /** Change chip in the top-right, e.g. `"+12%"`. */
  delta?: string;
  /** Colours the delta chip green when true, red when false. */
  positive?: boolean;
  icon?: LucideIcon;
  /** Tints the icon chip. Ignored when `iconClass` is set. */
  tone?: StatCardTone;
  /** Escape hatch for a bespoke icon chip, e.g. `"bg-brand-subtle text-brand"`. */
  iconClass?: string;
  className?: string;
}

const tones: Record<StatCardTone, string> = {
  brand: "bg-brand-subtle text-brand",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
  info: "bg-info-subtle text-info",
  teal: "bg-teal-subtle text-teal",
  pink: "bg-pink-subtle text-pink",
  neutral: "bg-muted text-muted-foreground",
};

/* Deterministic rAF count-up — always lands exactly on the target. */
function useCountUp(target: number, durationMs = 850) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return target * progress;
}

function AnimatedNumber({ target, decimals }: { target: number; decimals: number }) {
  const value = useCountUp(target);
  return (
    <>
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </>
  );
}

/** Splits a value like "42 pts" / "4.2 days" / "92%" into a countable number + suffix. */
function parseValue(value: string): { num: number; decimals: number; suffix: string } | null {
  const match = /^([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/.exec(value.trim());
  if (!match) return null;
  const num = Number(match[1].replaceAll(",", ""));
  if (!Number.isFinite(num)) return null;
  const decimalPart = match[1].split(".")[1];
  return { num, decimals: decimalPart ? decimalPart.length : 0, suffix: match[2] };
}

/**
 * Headline metric card — icon chip, label, animated value, supporting line and
 * an optional change chip. Used across the workspace and sprint dashboards.
 */
export function StatCard({
  label,
  value,
  sub,
  delta,
  positive,
  icon: Icon,
  tone = "brand",
  iconClass,
  className,
  ...props
}: StatCardProps) {
  const parsed = parseValue(value);

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl bg-card p-5 shadow-soft",
        "transition-colors duration-200 ease-out",
        className,
      )}
      {...props}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-xl",
                iconClass ?? tones[tone],
              )}
              aria-hidden
            >
              <Icon className="size-4" />
            </span>
          )}
          <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        {delta && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
              positive ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger",
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" aria-hidden />
            ) : (
              <ArrowDownRight className="size-3" aria-hidden />
            )}
            {delta}
          </span>
        )}
      </div>
      <span className="text-3xl font-bold tracking-tight tabular-nums">
        {parsed ? (
          <>
            <AnimatedNumber target={parsed.num} decimals={parsed.decimals} />
            {parsed.suffix}
          </>
        ) : (
          value
        )}
      </span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}
