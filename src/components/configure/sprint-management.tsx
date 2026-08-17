"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { eachDayOfInterval, format, isWeekend } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/lib/types";
import { memberById, workItemById, workItems } from "@/lib/data";
import { PriorityBadge, StatusBadge, TypeBadge, statusConfig } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ————————————————————————————————————————————————————————————————
// Local model — sprint groups seeded from the shared mock work items.

interface SprintGroup {
  id: string;
  name: string;
  start: string; // yyyy-MM-dd
  end: string;
  goal?: string;
  itemIds: string[];
}

const seedGroups: SprintGroup[] = [
  {
    id: "sg1",
    name: "Sprint 1",
    start: "2026-07-20",
    end: "2026-07-24",
    goal: "Stand up the PawCare foundation — repo, environments, auth and base components.",
    itemIds: ["e1", "w1", "w2", "w3", "w4", "w5", "w6", "w21"],
  },
  {
    id: "sg2",
    name: "Sprint 2",
    start: "2026-07-27",
    end: "2026-07-31",
    goal: "Design artifacts and the onboarding journey ready for build.",
    itemIds: ["e2", "w15", "w16", "w17", "w18", "e3", "w7", "w8"],
  },
  {
    id: "sg3",
    name: "Sprint 3",
    start: "2026-08-03",
    end: "2026-08-07",
    goal: "Appointments booking flow end to end.",
    itemIds: ["w9", "w10", "w11", "w12", "w13", "w14"],
  },
];

const parse = (iso: string) => new Date(`${iso}T00:00:00`);

const workingDays = (start: string, end: string) => {
  const s = parse(start);
  const e = parse(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e < s) return 0;
  return eachDayOfInterval({ start: s, end: e }).filter((d) => !isWeekend(d)).length;
};

const fmt = (iso: string) => format(parse(iso), "d MMM, yyyy");

type Row = { item: WorkItem; depth: number; hasChildren: boolean };

// ————————————————————————————————————————————————————————————————

export function SprintManagement({ onBack }: { onBack: () => void }) {
  const [groups, setGroups] = useState<SprintGroup[]>(seedGroups);
  const [query, setQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [collapsedEpics, setCollapsedEpics] = useState<Set<string>>(new Set(["e2", "e3"]));

  // Dialog state
  const [sprintDialog, setSprintDialog] = useState<{ mode: "add" } | { mode: "edit"; group: SprintGroup } | null>(null);
  const [mapTarget, setMapTarget] = useState<SprintGroup | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SprintGroup | null>(null);

  const totalWorkingDays = groups.reduce((n, g) => n + workingDays(g.start, g.end), 0);
  const range = useMemo(() => {
    if (groups.length === 0) return null;
    const starts = groups.map((g) => g.start).sort();
    const ends = groups.map((g) => g.end).sort();
    return { start: starts[0], end: ends[ends.length - 1] };
  }, [groups]);

  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const q = query.trim().toLowerCase();
  const matches = (i: WorkItem) =>
    q.length === 0 || i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q);

  const rowsFor = (group: SprintGroup): Row[] => {
    const items = group.itemIds
      .map((id) => workItemById(id))
      .filter((i): i is WorkItem => Boolean(i));
    const rows: Row[] = [];
    const used = new Set<string>();

    for (const epic of items.filter((i) => i.type === "epic")) {
      const children = items.filter((i) => i.parentId === epic.id);
      const visibleChildren = q ? children.filter(matches) : children;
      const epicVisible = matches(epic) || visibleChildren.length > 0;
      used.add(epic.id);
      children.forEach((c) => used.add(c.id));
      if (!epicVisible) continue;
      rows.push({ item: epic, depth: 0, hasChildren: children.length > 0 });
      if (!collapsedEpics.has(epic.id)) {
        for (const child of visibleChildren) {
          rows.push({
            item: child,
            depth: child.dependencyIds && child.dependencyIds.length > 0 ? 2 : 1,
            hasChildren: false,
          });
        }
      }
    }

    for (const rest of items.filter((i) => !used.has(i.id) && matches(i))) {
      rows.push({ item: rest, depth: 0, hasChildren: false });
    }
    return rows;
  };

  const upsertSprint = (data: { name: string; start: string; end: string; goal: string }) => {
    if (sprintDialog?.mode === "edit") {
      const id = sprintDialog.group.id;
      setGroups((gs) => gs.map((g) => (g.id === id ? { ...g, ...data } : g)));
      toast.success(`${data.name} updated`);
    } else {
      setGroups((gs) => [...gs, { id: `sg-${Date.now()}`, itemIds: [], ...data }]);
      toast.success(`${data.name} created`);
    }
    setSprintDialog(null);
  };

  const mapTasks = (group: SprintGroup, ids: string[]) => {
    setGroups((gs) =>
      gs.map((g) => (g.id === group.id ? { ...g, itemIds: [...g.itemIds, ...ids] } : g)),
    );
    toast.success(`${ids.length} ${ids.length === 1 ? "task" : "tasks"} mapped to ${group.name}`);
    setMapTarget(null);
  };

  const deleteSprint = (group: SprintGroup) => {
    setGroups((gs) => gs.filter((g) => g.id !== group.id));
    toast.success(`${group.name} deleted — items moved back to the backlog`);
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ——— Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Sprint Management
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-right text-xs text-muted-foreground">
            <div className="font-medium text-foreground">
              {groups.length} {groups.length === 1 ? "sprint" : "sprints"} · {totalWorkingDays} working days
            </div>
            {range && (
              <div>
                {fmt(range.start)} – {fmt(range.end)}
              </div>
            )}
          </div>
          <Button onClick={() => setSprintDialog({ mode: "add" })}>
            <Plus data-icon="inline-start" aria-hidden />
            Add sprint
          </Button>
        </div>
      </div>

      {/* ——— Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search work items by title or key…"
          className="pl-9"
          aria-label="Search work items"
        />
      </div>

      {/* ——— Sprint groups */}
      <div className="flex flex-col gap-4">
        {groups.map((group, gi) => {
          const rows = rowsFor(group);
          const collapsed = collapsedGroups.has(group.id);
          const days = workingDays(group.start, group.end);
          return (
            <motion.section
              key={group.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.05, duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden rounded-xl border bg-card shadow-soft"
            >
              {/* Group header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setCollapsedGroups((s) => toggle(s, group.id))}
                  className="flex min-w-0 items-center gap-2 text-left transition-colors hover:text-brand"
                  aria-expanded={!collapsed}
                >
                  <span className="text-xs font-semibold tracking-wide uppercase">{group.name}</span>
                  <ChevronDown
                    className={cn("size-3.5 shrink-0 transition-transform", collapsed && "-rotate-90")}
                    aria-hidden
                  />
                  <span className="truncate text-xs text-muted-foreground">
                    · {fmt(group.start)} – {fmt(group.end)}
                    <span className="mx-1.5 opacity-60">|</span>
                    {days} working {days === 1 ? "day" : "days"}
                  </span>
                </button>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSprintDialog({ mode: "edit", group })}
                  >
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${group.name}`}>
                        <MoreHorizontal aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setMapTarget(group)}>
                        <Workflow aria-hidden /> Map tasks
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSprintDialog({ mode: "edit", group })}>
                        <Pencil aria-hidden /> Edit sprint
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(group)}>
                        <Trash2 aria-hidden /> Delete sprint
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Rows */}
              {!collapsed &&
                (rows.length === 0 ? (
                  <div className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
                    {q ? "No matching items in this sprint." : "No work items yet — map tasks to this sprint."}
                  </div>
                ) : (
                  <ul>
                    {rows.map(({ item, depth, hasChildren }) => {
                      const status = statusConfig[item.status];
                      const StatusIcon = status.icon;
                      const epicCollapsed = collapsedEpics.has(item.id);
                      return (
                        <li
                          key={item.id}
                          className="flex items-center gap-2 border-t px-4 py-2 transition-colors hover:bg-accent/30"
                          style={{ paddingLeft: `${16 + depth * 24}px` }}
                        >
                          {hasChildren ? (
                            <button
                              type="button"
                              onClick={() => setCollapsedEpics((s) => toggle(s, item.id))}
                              aria-label={`${epicCollapsed ? "Expand" : "Collapse"} ${item.title}`}
                              aria-expanded={!epicCollapsed}
                              className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              {epicCollapsed ? (
                                <ChevronRight className="size-3.5" aria-hidden />
                              ) : (
                                <ChevronDown className="size-3.5" aria-hidden />
                              )}
                            </button>
                          ) : (
                            <span className="flex size-4.5 items-center justify-center" aria-hidden>
                              <span className="size-1 rounded-full bg-muted-foreground/50" />
                            </span>
                          )}
                          <StatusIcon
                            className={cn("size-4 shrink-0", status.className.split(" ")[0])}
                            aria-hidden
                          />
                          <span
                            className={cn(
                              "min-w-0 flex-1 truncate text-sm",
                              item.type === "epic" && "font-semibold",
                            )}
                          >
                            {item.title}
                          </span>
                          <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
                            <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                              {item.key}
                            </span>
                            <TypeBadge type={item.type} />
                            <PriorityBadge priority={item.priority} className="hidden md:inline-flex" />
                            <StatusBadge status={item.status} className="hidden lg:inline-flex" />
                          </span>
                          <UserAvatar member={memberById(item.assigneeId)} size="xs" />
                        </li>
                      );
                    })}
                  </ul>
                ))}
            </motion.section>
          );
        })}
      </div>

      {/* ——— Add / Edit sprint dialog */}
      <SprintDialog
        key={sprintDialog?.mode === "edit" ? sprintDialog.group.id : `add-${groups.length}`}
        open={sprintDialog !== null}
        onOpenChange={(o) => !o && setSprintDialog(null)}
        editing={sprintDialog?.mode === "edit" ? sprintDialog.group : null}
        defaultName={`Sprint ${groups.length + 1}`}
        onSubmit={upsertSprint}
      />

      {/* ——— Map tasks dialog */}
      {mapTarget && (
        <MapTasksDialog
          key={mapTarget.id}
          group={mapTarget}
          onClose={() => setMapTarget(null)}
          onMap={(ids) => mapTasks(mapTarget, ids)}
        />
      )}

      {/* ——— Delete sprint */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Its items move back to the backlog. This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deleteTarget && deleteSprint(deleteTarget)}
            >
              Delete sprint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————

function SprintDialog({
  open,
  onOpenChange,
  editing,
  defaultName,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: SprintGroup | null;
  defaultName: string;
  onSubmit: (data: { name: string; start: string; end: string; goal: string }) => void;
}) {
  const [name, setName] = useState(editing?.name ?? defaultName);
  const [start, setStart] = useState(editing?.start ?? "");
  const [end, setEnd] = useState(editing?.end ?? "");
  const [goal, setGoal] = useState(editing?.goal ?? "");

  const days = start && end ? workingDays(start, end) : 0;
  const valid = name.trim().length > 0 && start.length > 0 && end.length > 0 && parse(end) >= parse(start);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit ${editing.name}` : "Add sprint"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update the sprint window and goal." : "Plan a new sprint window for the team."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="sprint-name" className="text-xs text-muted-foreground">
              Sprint name
            </Label>
            <Input id="sprint-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="sprint-start" className="text-xs text-muted-foreground">
                Start date
              </Label>
              <Input
                id="sprint-start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sprint-end" className="text-xs text-muted-foreground">
                End date
              </Label>
              <Input id="sprint-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {days > 0
              ? `${days} working ${days === 1 ? "day" : "days"} in this sprint.`
              : "Pick a start and end date to see working days."}
          </p>
          <div className="grid gap-1.5">
            <Label htmlFor="sprint-goal" className="text-xs text-muted-foreground">
              Goal <span className="opacity-70">(optional)</span>
            </Label>
            <Textarea
              id="sprint-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What should this sprint achieve?"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!valid}
            onClick={() => onSubmit({ name: name.trim(), start, end, goal: goal.trim() })}
          >
            {editing ? "Save changes" : "Create sprint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ————————————————————————————————————————————————————————————————

function MapTasksDialog({
  group,
  onClose,
  onMap,
}: {
  group: SprintGroup;
  onClose: () => void;
  onMap: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const inSprint = new Set(group.itemIds);
  const q = query.trim().toLowerCase();
  const available = workItems.filter(
    (w) =>
      !inSprint.has(w.id) &&
      (q.length === 0 || w.title.toLowerCase().includes(q) || w.key.toLowerCase().includes(q)),
  );

  const toggleItem = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Map tasks to {group.name}</DialogTitle>
          <DialogDescription>Pick work items to pull into this sprint.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or key…"
            className="pl-9"
            aria-label="Search available work items"
          />
        </div>
        <ul className="scrollbar-thin -mx-1 max-h-72 overflow-y-auto px-1">
          {available.length === 0 && (
            <li className="py-6 text-center text-xs text-muted-foreground">No work items found.</li>
          )}
          {available.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-accent/40">
                <Checkbox
                  checked={selected.has(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                  aria-label={`Select ${item.key} ${item.title}`}
                />
                <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {item.key}
                </span>
                <TypeBadge type={item.type} />
                <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
              </label>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={selected.size === 0} onClick={() => onMap([...selected])}>
            Map {selected.size} {selected.size === 1 ? "task" : "tasks"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
