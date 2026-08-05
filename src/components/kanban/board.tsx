"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Member, Pipeline, Stage, WorkItem } from "@/lib/types";
import { pipelines, workItems } from "@/lib/data";
import { KanbanToolbar, emptyFilters, type FilterKey, type Filters } from "./filters";
import { PipelineColumn } from "./pipeline-column";
import { KanbanCardView, type CardActions } from "./kanban-card";
import { TaskDetailSheet } from "./task-detail-sheet";

interface StageLocation {
  pipeline: Pipeline;
  stage: Stage;
}

const stageIndex = new Map<string, StageLocation>();
for (const pipeline of pipelines) {
  for (const stage of pipeline.stages) {
    stageIndex.set(stage.id, { pipeline, stage });
  }
}

function AutoMoveRibbon() {
  return (
    <div className="flex w-6 shrink-0 items-center justify-center self-stretch" aria-hidden>
      <span className="rounded-full bg-success-subtle px-1 py-3 text-[9px] font-medium tracking-wide text-success [writing-mode:vertical-rl]">
        Completed tasks will be moved to To-do of next pipeline
      </span>
    </div>
  );
}

export function KanbanBoard() {
  const [items, setItems] = useState<WorkItem[]>(() =>
    workItems.filter((w) => w.pipelineId && w.stageId),
  );
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Keep the sticky toolbar snug under the (variable-height) project header
  const [stickyTop, setStickyTop] = useState(118);
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => setStickyTop(header.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const matchesFilters = useCallback(
    (w: WorkItem) => {
      const q = search.trim().toLowerCase();
      if (q && !w.title.toLowerCase().includes(q) && !w.key.toLowerCase().includes(q)) return false;
      if (filters.assignee.length && !filters.assignee.includes(w.assigneeId ?? "")) return false;
      if (filters.priority.length && !filters.priority.includes(w.priority)) return false;
      if (filters.type.length && !filters.type.includes(w.type)) return false;
      if (filters.status.length && !filters.status.includes(w.status)) return false;
      if (filters.sprint.length && !filters.sprint.includes(w.sprintId ?? "")) return false;
      if (filters.release.length && !filters.release.includes(w.release ?? "V1.0")) return false;
      return true;
    },
    [search, filters],
  );

  const visiblePipelines = filters.pipeline.length
    ? pipelines.filter((p) => filters.pipeline.includes(p.id))
    : pipelines;

  const itemsByStage = useMemo(() => {
    const map: Record<string, WorkItem[]> = {};
    for (const item of items) {
      if (!item.stageId || !matchesFilters(item)) continue;
      (map[item.stageId] ??= []).push(item);
    }
    return map;
  }, [items, matchesFilters]);

  const moveToStage = useCallback((itemId: string, stageId: string) => {
    const location = stageIndex.get(stageId);
    if (!location) return;
    setItems((prev) =>
      prev.map((w) =>
        w.id === itemId
          ? {
              ...w,
              stageId,
              pipelineId: location.pipeline.id,
              status:
                location.stage.pinned === "end"
                  ? "completed"
                  : location.stage.pinned === "start"
                    ? "todo"
                    : w.status,
            }
          : w,
      ),
    );
  }, []);

  /** Move + toast + the core auto-move rule: Completed → next pipeline's To Do. */
  const handleMove = useCallback(
    (item: WorkItem, stageId: string) => {
      const location = stageIndex.get(stageId);
      if (!location || item.stageId === stageId) return;
      moveToStage(item.id, stageId);
      toast.success(`${item.key} moved to ${location.stage.name}`);

      if (location.stage.pinned === "end") {
        const index = pipelines.findIndex((p) => p.id === location.pipeline.id);
        const next = pipelines[index + 1];
        const nextStart = next?.stages.find((s) => s.pinned === "start");
        if (next && nextStart) {
          const timeout = setTimeout(() => {
            moveToStage(item.id, nextStart.id);
            toast.success(`Auto-moved to ${next.name} · To Do`, {
              description: `${item.key} continues in the next pipeline.`,
            });
          }, 600);
          timeoutsRef.current.push(timeout);
        }
      }
    },
    [moveToStage],
  );

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const overId = event.over?.id;
    if (!overId) return;
    const item = items.find((w) => w.id === event.active.id);
    if (item) handleMove(item, String(overId));
  };

  const actions: CardActions = useMemo(
    () => ({
      onOpen: (item: WorkItem) => {
        setSelectedId(item.id);
        setSheetOpen(true);
      },
      onAssignAgent: (item: WorkItem, agent: Member) => {
        setItems((prev) => prev.map((w) => (w.id === item.id ? { ...w, assigneeId: agent.id } : w)));
        toast.success(`${item.key} assigned to ${agent.name}`, { description: agent.role });
      },
      onMoveNext: (item: WorkItem) => {
        const location = item.stageId ? stageIndex.get(item.stageId) : undefined;
        if (!location) return;
        const stages = location.pipeline.stages;
        const nextStage = stages[stages.findIndex((s) => s.id === item.stageId) + 1];
        if (!nextStage) {
          toast.info(`${item.key} is already in the last stage`);
          return;
        }
        handleMove(item, nextStage.id);
      },
      onFlag: (item: WorkItem) => toast(`${item.key} flagged`, { description: "The team will be notified." }),
      onDelete: (item: WorkItem) => {
        setItems((prev) => prev.filter((w) => w.id !== item.id));
        toast.success(`${item.key} deleted`);
      },
    }),
    [handleMove],
  );

  const activeItem = activeId ? items.find((w) => w.id === activeId) : undefined;
  const activePipeline = activeItem ? pipelines.find((p) => p.id === activeItem.pipelineId) : undefined;
  const selectedItem = selectedId ? (items.find((w) => w.id === selectedId) ?? null) : null;

  return (
    <div className="flex flex-col">
      {/* Sticky toolbar */}
      <div
        className="sticky z-20 border-b bg-background/95 px-6 py-3 backdrop-blur"
        style={{ top: stickyTop }}
      >
        <KanbanToolbar
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onToggleFilter={(key: FilterKey, value: string) =>
            setFilters((prev) => ({
              ...prev,
              [key]: prev[key].includes(value)
                ? prev[key].filter((v) => v !== value)
                : [...prev[key], value],
            }))
          }
          onClearFilter={(key: FilterKey) => setFilters((prev) => ({ ...prev, [key]: [] }))}
        />
      </div>

      <div className="flex flex-col gap-4 px-6 py-5">
        {/* Info banner */}
        <div className="flex items-center gap-2 rounded-lg bg-brand-subtle/50 px-3 py-2 text-xs text-muted-foreground">
          <Info className="size-3.5 shrink-0 text-brand" aria-hidden />
          <p>
            When a task is moved to the <span className="font-medium text-brand">Completed stage</span>, it will
            automatically move to the <span className="font-medium text-brand">To Do stage</span> of the next pipeline.
          </p>
        </div>

        {/* Board */}
        <DndContext
          id="kanban-board"
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="-mx-6 overflow-x-auto px-6 pb-4 scrollbar-thin">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.03 } } }}
              className="flex min-w-max items-stretch gap-2"
            >
              {visiblePipelines.map((pipeline, index) => (
                <div key={pipeline.id} className="contents">
                  {index > 0 && <AutoMoveRibbon />}
                  <PipelineColumn
                    pipeline={pipeline}
                    itemsByStage={itemsByStage}
                    dragActive={activeId !== null}
                    actions={actions}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeItem && (
              <div className={cn("w-[286px]", activePipeline?.colorClass)}>
                <KanbanCardView item={activeItem} className="rotate-2 shadow-elevation-high" />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskDetailSheet
        item={selectedItem}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        allItems={items}
        onUpdate={(id, patch) =>
          setItems((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)))
        }
      />
    </div>
  );
}
