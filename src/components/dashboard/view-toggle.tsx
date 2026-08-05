"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const options = [
  { id: "sprint", label: "Sprint" },
  { id: "tokens", label: "Tokens" },
] as const;

export type DashboardView = (typeof options)[number]["id"];

export function ViewToggle({
  value,
  onChange,
}: {
  value: DashboardView;
  onChange: (view: DashboardView) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Dashboard view"
      className="flex shrink-0 items-center gap-1 rounded-full border bg-card p-1 shadow-elevation-low"
    >
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="dashboard-view-pill"
                className="absolute inset-0 rounded-full bg-brand"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
