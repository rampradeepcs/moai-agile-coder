"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Flag, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Member, WorkItem } from "@/lib/types";
import { memberById, members } from "@/lib/data";
import { PriorityBadge, typeChipClass } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export interface CardActions {
  onOpen: (item: WorkItem) => void;
  onAssignAgent: (item: WorkItem, agent: Member) => void;
  onMoveNext: (item: WorkItem) => void;
  onFlag: (item: WorkItem) => void;
  onDelete: (item: WorkItem) => void;
}

const agents = members.filter((m) => m.kind === "agent");

/** Pure presentational card — reused by the board and the DragOverlay. */
export function KanbanCardView({ item, className }: { item: WorkItem; className?: string }) {
  const assignee = memberById(item.assigneeId);
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-lg bg-surface-overlay p-3.5",
        "transition-[box-shadow,translate,background-color] duration-150",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-sm font-medium leading-snug">{item.title}</p>
        {assignee && (
          <span className="shrink-0">
            <UserAvatar member={assignee} size="xs" showTooltip={false} />
          </span>
        )}
      </div>
      {item.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
      )}
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-surface-raised px-1.5 py-0.5 text-[11px] text-foreground/80 dark:bg-muted">
          #{item.key}
        </span>
        <PriorityBadge priority={item.priority} />
        <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-medium capitalize", typeChipClass[item.type])}>
          {item.type}
        </span>
      </div>
    </div>
  );
}

export function KanbanCard({ item, actions }: { item: WorkItem; actions: CardActions }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: item.id });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.div
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          onClick={() => actions.onOpen(item)}
          className={cn("cursor-grab touch-none outline-none", isDragging && "opacity-40")}
        >
          <KanbanCardView
            item={item}
            className="hover:bg-accent/70 dark:hover:bg-accent"
          />
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onSelect={() => actions.onOpen(item)}>
          <SquareArrowOutUpRight className="size-3.5" aria-hidden /> Open
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Bot className="mr-2 size-3.5 text-muted-foreground" aria-hidden /> Assign to AI agent
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="max-h-72 w-56 overflow-y-auto">
            {agents.map((agent) => (
              <ContextMenuItem key={agent.id} onSelect={() => actions.onAssignAgent(item, agent)}>
                <UserAvatar member={agent} size="xs" showTooltip={false} />
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-xs font-medium">{agent.name}</span>
                  <span className="truncate text-[10px] text-muted-foreground">{agent.role}</span>
                </span>
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem onSelect={() => actions.onMoveNext(item)}>
          <ArrowRight className="size-3.5" aria-hidden /> Move to next stage
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => actions.onFlag(item)}>
          <Flag className="size-3.5" aria-hidden /> Flag
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onSelect={() => actions.onDelete(item)}>
          <Trash2 className="size-3.5" aria-hidden /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
