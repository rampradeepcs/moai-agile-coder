"use client";

import * as React from "react";
import { Search, ChevronDown, Users, Shapes, SignalHigh, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority, Status, WorkItemType } from "@/lib/types";
import { members } from "@/lib/data";
import { priorityConfig, statusConfig, typeConfig } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BacklogFilterState {
  search: string;
  assignees: string[];
  types: WorkItemType[];
  priorities: Priority[];
  statuses: Status[];
}

export const emptyFilters: BacklogFilterState = {
  search: "",
  assignees: [],
  types: [],
  priorities: [],
  statuses: [],
};

function FilterPill({
  label,
  icon: Icon,
  selected,
  children,
}: {
  label: string;
  icon: React.ElementType;
  selected: string[];
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs font-medium">
          <Icon className="size-3.5 text-muted-foreground" aria-hidden />
          {label}
          {selected.length > 0 && (
            <span className="rounded-md bg-brand px-1.5 py-px text-[10px] font-semibold text-white">
              {selected.length}
            </span>
          )}
          <ChevronDown className="size-3 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BacklogFilters({
  filters,
  onChange,
  className,
}: {
  filters: BacklogFilterState;
  onChange: (next: BacklogFilterState) => void;
  className?: string;
}) {
  const toggle = <K extends "assignees" | "types" | "priorities" | "statuses">(
    key: K,
    value: BacklogFilterState[K][number],
  ) => {
    const list = filters[key] as string[];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    onChange({ ...filters, [key]: next });
  };

  const humans = members.filter((m) => m.kind === "human");
  const agents = members.filter((m) => m.kind === "agent");

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search this board"
          aria-label="Search this board"
          className="h-8 w-56 pl-8 text-xs"
        />
      </div>

      <FilterPill label="Assigned to" icon={Users} selected={filters.assignees}>
        {humans.map((m) => (
          <DropdownMenuCheckboxItem
            key={m.id}
            checked={filters.assignees.includes(m.id)}
            onCheckedChange={() => toggle("assignees", m.id)}
            onSelect={(e) => e.preventDefault()}
          >
            <UserAvatar member={m} size="xs" showTooltip={false} />
            <span className="truncate">{m.name}</span>
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] tracking-wide text-muted-foreground uppercase">Agents</DropdownMenuLabel>
        {agents.map((m) => (
          <DropdownMenuCheckboxItem
            key={m.id}
            checked={filters.assignees.includes(m.id)}
            onCheckedChange={() => toggle("assignees", m.id)}
            onSelect={(e) => e.preventDefault()}
          >
            <UserAvatar member={m} size="xs" showTooltip={false} />
            <span className="truncate">{m.name}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </FilterPill>

      <FilterPill label="Type" icon={Shapes} selected={filters.types}>
        {(Object.keys(typeConfig) as WorkItemType[]).map((t) => (
          <DropdownMenuCheckboxItem
            key={t}
            checked={filters.types.includes(t)}
            onCheckedChange={() => toggle("types", t)}
            onSelect={(e) => e.preventDefault()}
          >
            {typeConfig[t].label}
          </DropdownMenuCheckboxItem>
        ))}
      </FilterPill>

      <FilterPill label="Priority" icon={SignalHigh} selected={filters.priorities}>
        {(Object.keys(priorityConfig) as Priority[]).map((p) => (
          <DropdownMenuCheckboxItem
            key={p}
            checked={filters.priorities.includes(p)}
            onCheckedChange={() => toggle("priorities", p)}
            onSelect={(e) => e.preventDefault()}
          >
            <span className={cn("size-1.5 rounded-full", priorityConfig[p].bar)} aria-hidden />
            {priorityConfig[p].label}
          </DropdownMenuCheckboxItem>
        ))}
      </FilterPill>

      <FilterPill label="Status" icon={CircleDot} selected={filters.statuses}>
        {(Object.keys(statusConfig) as Status[]).map((s) => {
          const c = statusConfig[s];
          return (
            <DropdownMenuCheckboxItem
              key={s}
              checked={filters.statuses.includes(s)}
              onCheckedChange={() => toggle("statuses", s)}
              onSelect={(e) => e.preventDefault()}
            >
              <c.icon className="size-3.5" aria-hidden />
              {c.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </FilterPill>
    </div>
  );
}
