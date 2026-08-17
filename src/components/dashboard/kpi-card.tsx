"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

/* Deterministic rAF count-up — always lands exactly on the target. */
function useCountUp(target: number, durationMs = 850) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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

export function KpiCard({
  label,
  value,
  sub,
  delta,
  positive,
  icon: Icon,
  iconClass,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: string;
  positive?: boolean;
  /** Optional lucide icon rendered in a colored chip. */
  icon?: LucideIcon;
  /** Chip colors, e.g. "bg-brand-subtle text-brand". */
  iconClass?: string;
  className?: string;
}) {
  const parsed = parseValue(value);

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-2xl bg-card p-5 shadow-soft",
        "transition-colors duration-200 ease-out",
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-xl",
                iconClass ?? "bg-brand-subtle text-brand",
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
              "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
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
