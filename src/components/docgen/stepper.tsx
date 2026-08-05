"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const DOCGEN_STEPS = [
  "Basic details",
  "Requirement gatherings",
  "Requirement document",
  "Design document",
] as const;

export function DocgenStepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Creation progress">
      {DOCGEN_STEPS.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={label} className="flex items-center gap-2">
            {i > 0 && (
              <span
                aria-hidden
                className="hidden w-6 border-t border-dotted border-border sm:block md:w-9"
              />
            )}
            <span
              aria-current={state === "active" ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                state === "active" && "bg-brand-gradient text-white shadow-elevation-low",
                state === "done" && "bg-brand-subtle text-brand",
                state === "todo" && "border bg-card text-muted-foreground"
              )}
            >
              {state === "done" && <Check className="size-3" />}
              <span className={cn(state !== "active" && "hidden md:inline", state === "active" && "inline")}>
                {label}
              </span>
              {state !== "active" && <span className="md:hidden">{i + 1}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
