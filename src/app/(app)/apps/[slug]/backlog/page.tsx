"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { WorkItem } from "@/lib/types";
import { childrenOf, epics, workItemByKey } from "@/lib/data";
import { BacklogFilters, emptyFilters, type BacklogFilterState } from "@/components/backlog/filters";
import { CreateEpicDialog } from "@/components/backlog/create-epic-dialog";
import { EpicGroup } from "@/components/backlog/epic-group";
import { TaskDetailSheet } from "@/components/backlog/task-detail-sheet";
import { panelClasses } from "@/components/shared";
import { EmptyState } from "@/components";
import { SearchX } from "lucide-react";

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
  // Manual ordering (drag & drop) for epics and for children within each epic
  const [epicOrder, setEpicOrder] = React.useState<string[]>(() => epics.map((e) => e.id));
  const [childOrder, setChildOrder] = React.useState<Record<string, string[]>>({});
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  const allEpics = React.useMemo(() => {
    const pool = [...createdEpics, ...epics].filter((e) => !removedIds.has(e.id));
    const byId = new Map(pool.map((e) => [e.id, e]));
    const ordered = epicOrder.filter((id) => byId.has(id)).map((id) => byId.get(id)!);
    const rest = pool.filter((e) => !epicOrder.includes(e.id));
    return [...rest, ...ordered];
  }, [createdEpics, removedIds, epicOrder]);

  const childrenFor = React.useCallback(
    (epicId: string) => {
      const pool = [...childrenOf(epicId), ...extraChildren.filter((c) => c.parentId === epicId)].filter(
        (c) => !removedIds.has(c.id),
      );
      const order = childOrder[epicId];
      if (!order) return pool;
      const byId = new Map(pool.map((c) => [c.id, c]));
      const ordered = order.filter((id) => byId.has(id)).map((id) => byId.get(id)!);
      const rest = pool.filter((c) => !order.includes(c.id));
      return [...ordered, ...rest];
    },
    [extraChildren, removedIds, childOrder],
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const a = String(active.id);
    const o = String(over.id);

    if (a.startsWith("epic:")) {
      // When dropped over an item row (nested sortables), resolve its parent epic.
      const targetEpicId = o.startsWith("epic:")
        ? o.slice(5)
        : (over.data.current?.parentId as string | undefined);
      if (!targetEpicId || targetEpicId === a.slice(5)) return;
      const ids = allEpics.map((e) => e.id);
      const from = ids.indexOf(a.slice(5));
      const to = ids.indexOf(targetEpicId);
      if (from < 0 || to < 0) return;
      setEpicOrder(arrayMove(ids, from, to));
      const epic = allEpics[from];
      toast.success(`${epic?.key ?? "Epic"} moved ${to < from ? "up" : "down"}`);
      return;
    }

    if (a.startsWith("item:")) {
      const parentA = active.data.current?.parentId as string | undefined;
      const parentO = o.startsWith("item:")
        ? (over.data.current?.parentId as string | undefined)
        : o.slice(5);
      if (!parentA || parentA !== parentO) return;
      const items = childrenFor(parentA);
      const ids = items.map((c) => c.id);
      const from = ids.indexOf(a.slice(5));
      const to = o.startsWith("item:") ? ids.indexOf(o.slice(5)) : 0;
      if (from < 0 || to < 0) return;
      setChildOrder((prev) => ({ ...prev, [parentA]: arrayMove(ids, from, to) }));
      toast.success(`${items[from]?.key ?? "Item"} moved ${to < from ? "up" : "down"}`);
    }
  };

  return (
    <div className="px-6 py-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <BacklogFilters filters={filters} onChange={setFilters} className="min-w-0 flex-1" />
        <CreateEpicDialog
          onCreate={(epic) => {
            setCreatedEpics((prev) => [epic, ...prev]);
            setEpicOrder((prev) => [epic.id, ...prev]);
            setOpenMap((prev) => ({ ...prev, [epic.id]: true }));
          }}
        />
      </div>

      {/* Epic groups — draggable to re-arrange (disabled while filtering) */}
      <DndContext id="backlog-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={groups.map((g) => `epic:${g.epic.id}`)} strategy={verticalListSortingStrategy}>
          <div className="mt-4 flex flex-col gap-3">
            {groups.length === 0 && (
              <EmptyState
                className={panelClasses({ padding: "none" })}
                icon={<SearchX />}
                title="No matching work items"
                description="Try clearing the search or removing some filters."
              />
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
                  sortable={!filtersActive}
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
        </SortableContext>
      </DndContext>

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
