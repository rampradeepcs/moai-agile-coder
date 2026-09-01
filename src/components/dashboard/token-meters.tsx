"use client";

import { Progress } from "@/components";
import { cn } from "@/lib/utils";
import { tokenStats } from "@/lib/data";
import type { Project } from "@/lib/types";

const WEEK_BUDGET = 12000;
const DAY_BUDGET = 2000;

function Meter({
  label,
  value,
  max,
  showMax,
  danger,
}: {
  label: string;
  value: number;
  max: number;
  showMax?: boolean;
  danger?: boolean;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-xs text-muted-foreground">{label}</span>
        <span className={cn("shrink-0 text-xs font-semibold tabular-nums", danger && "text-danger")}>
          {value.toLocaleString()}
          {showMax && (
            <span className="font-normal text-muted-foreground">
              {" "}/ {max.toLocaleString()}
            </span>
          )}
        </span>
      </div>
      <Progress value={pct} size="sm" color={danger ? "error" : "brand"} />
    </div>
  );
}

/** Common top strip — token consumption meters, visible in both views. */
export function TokenMeters({ project }: { project: Project }) {
  const usagePct = (project.tokensUsed / project.tokensAssigned) * 100;
  return (
    <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
      <Meter
        label="Tokens used"
        value={project.tokensUsed}
        max={project.tokensAssigned}
        showMax
        danger={usagePct > 90}
      />
      <Meter label="This week" value={tokenStats.thisWeek} max={WEEK_BUDGET} />
      <Meter label="Today's usage" value={tokenStats.today} max={DAY_BUDGET} />
    </div>
  );
}
