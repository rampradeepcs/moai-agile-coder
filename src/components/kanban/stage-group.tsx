"use client";

import { useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Stage, WorkItem } from "@/lib/types";
import { memberById } from "@/lib/data";
import { UserAvatar } from "@/components/work/user-avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { KanbanCard, type CardActions } from "./kanban-card";

function DropPlaceholder({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-lg border border-dashed py-3 text-[11px] text-muted-foreground transition-colors",
        active && "border-[color:var(--pipeline)] font-medium text-foreground",
      )}
      style={active ? { backgroundColor: "var(--pipeline-soft)" } : undefined}
    >
      Drop here
    </div>
  );
}

export function StageGroup({
  stage,
  items,
  dragActive,
  actions,
}: {
  stage: Stage;
  items: WorkItem[];
  dragActive: boolean;
  actions: CardActions;
}) {
  const [open, setOpen] = useState(items.length > 0);
  const prevCount = useRef(items.length);

  // Auto-expand a stage when a card lands in it
  useEffect(() => {
    if (items.length > prevCount.current) setOpen(true);
    prevCount.current = items.length;
  }, [items.length]);

  const { isOver, setNodeRef } = useDroppable({ id: stage.id });
  const stageAgent = memberById(stage.agentId);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        ref={setNodeRef}
        className="rounded-lg transition-colors"
        style={{ backgroundColor: isOver ? "var(--pipeline-soft)" : undefined }}
      >
        <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-muted/60">
          <ChevronDown
            className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", !open && "-rotate-90")}
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {stage.name}
          </span>
          {stageAgent && <UserAvatar member={stageAgent} size="xs" />}
          <span className="rounded-full bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground">
            {items.length}
          </span>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="flex flex-col gap-2 px-1 pb-2 pt-0.5">
            {items.map((item) => (
              <KanbanCard key={item.id} item={item} actions={actions} />
            ))}
            {items.length === 0 &&
              (dragActive ? (
                <DropPlaceholder active={isOver} />
              ) : (
                <div className="grid place-items-center rounded-lg border border-dashed py-3 text-[11px] text-muted-foreground/70">
                  No tasks
                </div>
              ))}
          </div>
        </CollapsibleContent>

        {/* Collapsed stage still needs a visible drop target while dragging */}
        {!open && dragActive && (
          <div className="px-1 pb-2">
            <DropPlaceholder active={isOver} />
          </div>
        )}
      </div>
    </Collapsible>
  );
}
