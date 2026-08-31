"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings2 } from "lucide-react";
import type { Priority, Status, WorkItemType } from "@/lib/types";
import { members, pipelines, sprints } from "@/lib/data";
import { priorityConfig, statusConfig, typeConfig } from "@/components/work/badges";
import { Button } from "@/components/ui/button";
import { FilterPill, SearchInput, type FilterOption } from "@/components/shared";

export type FilterKey = "pipeline" | "assignee" | "priority" | "type" | "status" | "sprint" | "release";
export type Filters = Record<FilterKey, string[]>;

export const emptyFilters: Filters = {
  pipeline: [],
  assignee: [],
  priority: [],
  type: [],
  status: [],
  sprint: [],
  release: [],
};

const filterDefs: { key: FilterKey; label: string; options: FilterOption[] }[] = [
  { key: "pipeline", label: "Pipeline", options: pipelines.map((p) => ({ value: p.id, label: p.name })) },
  {
    key: "assignee",
    label: "Assignee",
    options: members.map((m) => ({ value: m.id, label: m.kind === "agent" ? `${m.name} · AI` : m.name })),
  },
  {
    key: "priority",
    label: "Priority",
    options: (Object.keys(priorityConfig) as Priority[]).map((p) => ({ value: p, label: priorityConfig[p].label })),
  },
  {
    key: "type",
    label: "Type",
    options: (Object.keys(typeConfig) as WorkItemType[]).map((t) => ({ value: t, label: typeConfig[t].label })),
  },
  {
    key: "status",
    label: "Status",
    options: (Object.keys(statusConfig) as Status[]).map((s) => ({ value: s, label: statusConfig[s].label })),
  },
  { key: "sprint", label: "Sprint", options: sprints.map((s) => ({ value: s.id, label: s.name })) },
  { key: "release", label: "Release", options: [{ value: "V1.0", label: "V1.0" }] },
];

export function KanbanToolbar({
  search,
  onSearchChange,
  filters,
  onToggleFilter,
  onClearFilter,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  filters: Filters;
  onToggleFilter: (key: FilterKey, value: string) => void;
  onClearFilter: (key: FilterKey) => void;
}) {
  const pathname = usePathname();
  const configureHref = pathname.replace(/\/kanban.*$/, "/configure?tab=kanban");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        size="sm"
        value={search}
        onValueChange={onSearchChange}
        placeholder="Search issues…"
        aria-label="Search issues"
        wrapperClassName="w-56"
      />

      {filterDefs.map((def) => (
        <FilterPill
          key={def.key}
          label={def.label}
          options={def.options}
          selected={filters[def.key]}
          onToggle={(value) => onToggleFilter(def.key, value)}
          onClear={() => onClearFilter(def.key)}
        />
      ))}

      <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-xs" asChild>
        <Link href={configureHref}>
          <Settings2 className="size-3.5" aria-hidden /> Configure kanban
        </Link>
      </Button>
    </div>
  );
}
