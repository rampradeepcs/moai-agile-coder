"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority, Status, WorkItemType } from "@/lib/types";
import { members, pipelines, sprints } from "@/lib/data";
import { priorityConfig, statusConfig, typeConfig } from "@/components/work/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface FilterOption {
  value: string;
  label: string;
}

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

function FilterPill({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const active = selected.length > 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-1 rounded-full text-xs", active && "border-brand/40 text-brand")}
        >
          {label}
          {active && (
            <span className="grid size-4 place-items-center rounded-full bg-brand-subtle text-[10px] font-semibold text-brand">
              {selected.length}
            </span>
          )}
          <ChevronDown className="size-3 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 w-52 overflow-y-auto">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Filter by {label.toLowerCase()}</DropdownMenuLabel>
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={() => onToggle(option.value)}
            onSelect={(e) => e.preventDefault()}
            className="text-xs"
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
        {active && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-muted-foreground" onSelect={onClear}>
              Clear selection
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search issues…"
          className="h-8 w-56 pl-8 text-xs"
          aria-label="Search issues"
        />
      </div>

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
