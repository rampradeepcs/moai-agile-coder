"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { WorkItem } from "@/lib/types";
import { childrenOf, epics, workItemByKey } from "@/lib/data";
import { BacklogFilters, emptyFilters, type BacklogFilterState } from "@/components/backlog/filters";
import { CreateEpicDialog } from "@/components/backlog/create-epic-dialog";
import { EpicGroup } from "@/components/backlog/epic-group";
import { TaskDetailSheet } from "@/components/backlog/task-detail-sheet";

let childSeq = 8000;

function matchesFilters(item: WorkItem, f: BacklogFilterState) {
  const q = f.search.trim().toLowerCase();
  if (q && !item.title.toLowerCase().includes(q) && !item.key.toLowerCase().includes(q)) return false;
  if (f.assignees.length > 0 && (!item.assigneeId || !f.assignees.includes(item.assigneeId))) return false;
  if (f.types.length > 0 && !f.types.includes(item.type)) return false;
  if (f.priorities.length > 0 && !f.priorities.includes(item.priority)) return false;
  if (f.statuses.length > 0 && !f.statuses.includes(item.status)) return false;
  return true;
}

function BacklogScreen() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = React.useState<BacklogFilterState>(emptyFilters);
  const [createdEpics, setCreatedEpics] = React.useState<WorkItem[]>([]);
  const [extraChildren, setExtraChildren] = React.useState<WorkItem[]>([]);
  const [removedIds, setRemovedIds] = React.useState<Set<string>>(new Set());
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>(() => {
    const first = epics[0]?.id;
    const second = epics.length > 2 ? epics[2].id : undefined; // Application setup + Onboarding
    const map: Record<string, boolean> = {};
    if (first) map[first] = true;
    if (second) map[second] = true;
    return map;
  });
  const [selected, setSelected] = React.useState<WorkItem | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // Deep link: ?item=PC-7364 opens the detail sheet on mount
  const deepLinked = React.useRef(false);
  React.useEffect(() => {
    if (deepLinked.current) return;
    deepLinked.current = true;
    const key = searchParams.get("item");
    if (!key) return;
    const item = workItemByKey(key);
    if (item) {
      setSelected(item);
      setSheetOpen(true);
    }
  }, [searchParams]);

  const filtersActive =
    filters.search.trim().length > 0 ||
    filters.assignees.length > 0 ||
    filters.types.length > 0 ||
    filters.priorities.length > 0 ||
    filters.statuses.length > 0;

  const allEpics = React.useMemo(
    () => [...createdEpics, ...epics].filter((e) => !removedIds.has(e.id)),
    [createdEpics, removedIds],
  );

  const childrenFor = React.useCallback(
    (epicId: string) =>
      [...childrenOf(epicId), ...extraChildren.filter((c) => c.parentId === epicId)].filter(
        (c) => !removedIds.has(c.id),
      ),
    [extraChildren, removedIds],
  );

  const groups = allEpics
    .map((epic) => {
      const all = childrenFor(epic.id);
      const filtered = filtersActive ? all.filter((c) => matchesFilters(c, filters)) : all;
      return { epic, all, filtered };
    })
    .filter((g) => !filtersActive || g.filtered.length > 0 || matchesFilters(g.epic, filters));

  const openItem = (item: WorkItem) => {
    setSelected(item);
    setSheetOpen(true);
  };

  const addChild = (epic: WorkItem, type: "feature" | "task") => {
    childSeq += 1;
    const child: WorkItem = {
      id: `local-w${childSeq}`,
      key: `PC-${childSeq}`,
      title: type === "feature" ? "New feature" : "New task",
      type,
      priority: "medium",
      status: "todo",
      parentId: epic.id,
      points: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setExtraChildren((prev) => [...prev, child]);
    setOpenMap((prev) => ({ ...prev, [epic.id]: true }));
    toast.success(`${type === "feature" ? "Feature" : "Task"} ${child.key} added to ${epic.title}`);
  };

  return (
    <div className="px-6 py-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <BacklogFilters filters={filters} onChange={setFilters} className="min-w-0 flex-1" />
        <CreateEpicDialog
          onCreate={(epic) => {
            setCreatedEpics((prev) => [epic, ...prev]);
            setOpenMap((prev) => ({ ...prev, [epic.id]: true }));
          }}
        />
      </div>

      {/* Epic groups */}
      <div className="mt-4 flex flex-col gap-3">
        {groups.length === 0 && (
          <div className="rounded-xl border bg-card px-6 py-10 text-center shadow-elevation-low">
            <p className="text-sm font-semibold">No matching work items</p>
            <p className="mt-1 text-xs text-muted-foreground">Try clearing the search or removing some filters.</p>
          </div>
        )}
        {groups.map(({ epic, all, filtered }, index) => (
          <motion.div
            key={epic.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
          >
            <EpicGroup
              epic={epic}
              items={filtered}
              totalItems={all}
              open={filtersActive ? true : !!openMap[epic.id]}
              onToggle={() => setOpenMap((prev) => ({ ...prev, [epic.id]: !prev[epic.id] }))}
              onOpenItem={openItem}
              onDeleteEpic={(e) => {
                setRemovedIds((prev) => new Set(prev).add(e.id));
                toast.success(`Epic ${e.key} deleted`);
              }}
              onDeleteItem={(item) => {
                setRemovedIds((prev) => new Set(prev).add(item.id));
                toast.success(`${item.key} deleted`);
              }}
              onAddChild={addChild}
            />
          </motion.div>
        ))}
      </div>

      <TaskDetailSheet item={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}

export default function BacklogPage() {
  return (
    <Suspense fallback={null}>
      <BacklogScreen />
    </Suspense>
  );
}
