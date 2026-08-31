"use client";

import * as React from "react";
import { Users, Shapes, SignalHigh, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority, Status, WorkItemType } from "@/lib/types";
import { members } from "@/lib/data";
import { priorityConfig, statusConfig, typeConfig } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { FilterPill, SearchInput } from "@/components/shared";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
      <SearchInput
        size="sm"
        value={filters.search}
        onValueChange={(search) => onChange({ ...filters, search })}
        placeholder="Search this board"
        aria-label="Search this board"
        wrapperClassName="w-56"
      />

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
