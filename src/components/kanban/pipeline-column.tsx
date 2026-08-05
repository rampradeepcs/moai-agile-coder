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
      className={cn("flex w-[300px] min-w-[300px] shrink-0 flex-col", pipeline.colorClass)}
      aria-label={`${pipeline.name} pipeline`}
    >
      <div
        className="flex items-center justify-between gap-2 rounded-t-xl px-3 py-2.5"
        style={{ background: "var(--pipeline)" }}
      >
        <h3 className="truncate text-[13px] font-semibold text-white">{pipeline.name}</h3>
        <span className="rounded-full bg-white/25 px-2 py-px text-[11px] font-semibold tabular-nums text-white">
          {total}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 rounded-b-xl border border-t-0 bg-muted/30 p-1.5">
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
