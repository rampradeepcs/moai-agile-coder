"use client";

import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { memberById } from "@/lib/data";
import { UserAvatar } from "@/components/work/user-avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MAX_SHOWN = 4;

/**
 * "Working now" cluster for project tiles: avatars of members currently
 * active on the project (green presence dot; AI agents pulse), plus a
 * count of the remaining team.
 */
export function ActiveMembers({ project, className }: { project: Project; className?: string }) {
  const working = (project.workingIds ?? []).map(memberById).filter((m) => !!m);
  const idle = project.memberIds.length - working.length;

  if (working.length === 0) {
    return (
      <div className={cn("flex items-center gap-1.5 text-[11px] text-muted-foreground", className)}>
        <span className="size-1.5 rounded-full bg-muted-foreground/40" aria-hidden />
        No one working right now
        {idle > 0 && <span className="text-muted-foreground/70">· {idle} on the team</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <div className="flex items-center -space-x-1.5">
        {working.slice(0, MAX_SHOWN).map((m) => (
          <Tooltip key={m.id}>
            <TooltipTrigger asChild>
              <span className="relative inline-flex">
                <UserAvatar member={m} size="sm" showTooltip={false} className="ring-2 ring-card" />
                <span
                  className={cn(
                    "absolute -bottom-px -right-px size-2 rounded-full bg-success ring-2 ring-card",
                    m.kind === "agent" && "animate-pulse-soft",
                  )}
                  aria-hidden
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {m.name} · {m.kind === "agent" ? "AI agent working" : "working now"}
            </TooltipContent>
          </Tooltip>
        ))}
        {working.length > MAX_SHOWN && (
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-muted px-1 text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
            +{working.length - MAX_SHOWN}
          </span>
        )}
      </div>
      <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-success">
        <span className="relative flex size-1.5" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-success" />
        </span>
        {working.length} working now
      </span>
    </div>
  );
}
