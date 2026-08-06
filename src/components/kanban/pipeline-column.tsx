"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Pipeline, WorkItem } from "@/lib/types";
import { StageGroup } from "./stage-group";
import type { CardActions } from "./kanban-card";

export function PipelineColumn({
  pipeline,
  itemsByStage,
  dragActive,
  actions,
}: {
  pipeline: Pipeline;
  itemsByStage: Record<string, WorkItem[]>;
  dragActive: boolean;
  actions: CardActions;
}) {
  const total = pipeline.stages.reduce((n, s) => n + (itemsByStage[s.id]?.length ?? 0), 0);

  return (
    <motion.section
      variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("flex w-[300px] min-w-[300px] shrink-0 flex-col rounded-2xl bg-muted/40 p-2", pipeline.colorClass)}
      aria-label={`${pipeline.name} pipeline`}
    >
      <div className="flex items-center gap-2 px-2 pb-2.5 pt-1">
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{ background: "var(--pipeline)" }}
        />
        <h3 className="truncate text-[11px] font-bold uppercase tracking-wider">{pipeline.name}</h3>
        <span className="ml-auto rounded-md bg-background/70 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
          {total} task{total === 1 ? "" : "s"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {pipeline.stages.map((stage) => (
          <StageGroup
            key={stage.id}
            stage={stage}
            items={itemsByStage[stage.id] ?? []}
            dragActive={dragActive}
            actions={actions}
          />
        ))}
      </div>
    </motion.section>
  );
}
