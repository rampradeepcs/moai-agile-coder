"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  MoreHorizontal,
  ExternalLink,
  ArrowRightLeft,
  Flag,
  GripVertical,
  Trash2,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/lib/types";
import { memberById } from "@/lib/data";
import { statusConfig, TypeBadge, PriorityBadge } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ItemRow({
  item,
  sortable = false,
  onOpen,
  onDelete,
}: {
  item: WorkItem;
  /** enables drag & drop re-arranging within the epic */
  sortable?: boolean;
  onOpen: (item: WorkItem) => void;
  onDelete: (item: WorkItem) => void;
}) {
  const status = statusConfig[item.status];
  const assignee = memberById(item.assigneeId);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `item:${item.id}`,
    data: { kind: "item", parentId: item.parentId },
    disabled: !sortable,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item);
        }
      }}
      className={cn(
        "grid cursor-pointer grid-cols-[auto_auto_auto_auto_1fr_auto_auto_auto_auto] items-center gap-3 border-t bg-card px-3 py-2.5 transition-colors hover:bg-accent/30",
        !sortable && "grid-cols-[auto_auto_auto_1fr_auto_auto_auto_auto] px-4",
        isDragging && "relative z-10 opacity-90 shadow-elevation-mid ring-2 ring-brand/40",
      )}
    >
      {sortable && (
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Re-order ${item.key}`}
          onClick={(e) => e.stopPropagation()}
          className="flex cursor-grab touch-none items-center rounded p-0.5 text-muted-foreground/40 transition-colors hover:bg-accent/60 hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-3.5" aria-hidden />
        </button>
      )}
      <status.icon className={cn("size-3.5", status.className.split(" ")[0])} aria-label={status.label} />
      <span className="font-mono text-[11px] text-muted-foreground">{item.key}</span>
      <TypeBadge type={item.type} />
      <span className="min-w-0 truncate text-sm">{item.title}</span>
      <PriorityBadge priority={item.priority} className="hidden sm:inline-flex" />
      <span className="hidden rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline">
        {item.points ?? 0} pts
      </span>
      <UserAvatar member={assignee} size="xs" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground"
            aria-label={`Actions for ${item.key}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="size-3.5" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onSelect={() => onOpen(item)}>
            <ExternalLink aria-hidden />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast.success(`${item.key} moved to Sprint 25`)}>
            <ArrowRightLeft aria-hidden />
            Move to sprint
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast(`${item.key} flagged for attention`)}>
            <Flag aria-hidden />
            Flag
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(item)}>
            <Trash2 aria-hidden />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
