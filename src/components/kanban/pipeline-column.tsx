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
      className={cn("flex w-[300px] min-w-[300px] shrink-0 flex-col rounded-xl bg-surface p-2", pipeline.colorClass)}
      aria-label={`${pipeline.name} pipeline`}
    >
      <div className="flex items-center gap-2 px-2 pb-3 pt-2">
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{ background: "var(--pipeline)" }}
        />
        <h3 className="truncate text-sm font-medium">{pipeline.name}</h3>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
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
