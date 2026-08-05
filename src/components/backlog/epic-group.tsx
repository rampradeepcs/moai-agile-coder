"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronRight,
  MoreHorizontal,
  Bot,
  Puzzle,
  SquareCheck,
  Trash2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/lib/types";
import { memberById } from "@/lib/data";
import { TypeBadge, PriorityBadge, StatusBadge } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemRow } from "./item-row";

export function EpicGroup({
  epic,
  items,
  totalItems,
  open,
  onToggle,
  onOpenItem,
  onDeleteEpic,
  onDeleteItem,
  onAddChild,
}: {
  epic: WorkItem;
  /** children rows after filtering */
  items: WorkItem[];
  /** all children, used for progress */
  totalItems: WorkItem[];
  open: boolean;
  onToggle: () => void;
  onOpenItem: (item: WorkItem) => void;
  onDeleteEpic: (epic: WorkItem) => void;
  onDeleteItem: (item: WorkItem) => void;
  onAddChild: (epic: WorkItem, type: "feature" | "task") => void;
}) {
  const done = totalItems.filter((i) => i.status === "completed").length;
  const progress = totalItems.length > 0 ? (done / totalItems.length) * 100 : 0;
  const assignee = memberById(epic.assigneeId);

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-elevation-low">
      <header
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex h-12 cursor-pointer items-center gap-3 px-4 transition-colors hover:bg-accent/40"
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="flex text-muted-foreground"
        >
          <ChevronRight className="size-4" aria-hidden />
        </motion.span>

        <span className="min-w-0 truncate text-sm font-medium">{epic.title}</span>

        {totalItems.length > 0 && (
          <span className="hidden items-center gap-2 md:flex">
            <span className="text-xs whitespace-nowrap text-muted-foreground">
              {done}/{totalItems.length} done
            </span>
            <Progress value={progress} className="h-1 w-24" aria-label={`${done} of ${totalItems.length} items done`} />
          </span>
        )}

        <span className="ml-auto flex items-center gap-2">
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {epic.key}
          </span>
          <TypeBadge type={epic.type} className="hidden sm:inline-flex" />
          <PriorityBadge priority={epic.priority} className="hidden md:inline-flex" />
          <StatusBadge status={epic.status} className="hidden sm:inline-flex" />
          <UserAvatar member={assignee} size="sm" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground"
                aria-label={`Actions for epic ${epic.key}`}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="size-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                className="text-brand focus:text-brand"
                onSelect={() => toast("Nava is regenerating stories…", { icon: <Bot className="size-4 text-brand" /> })}
              >
                <Bot className="text-brand" aria-hidden />
                Regenerate stories
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onAddChild(epic, "feature")}>
                <Puzzle aria-hidden />
                Add feature
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onAddChild(epic, "task")}>
                <SquareCheck aria-hidden />
                Create task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => onDeleteEpic(epic)}>
                <Trash2 aria-hidden />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </header>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            {items.length > 0 ? (
              items.map((item) => (
                <ItemRow key={item.id} item={item} onOpen={onOpenItem} onDelete={onDeleteItem} />
              ))
            ) : (
              <div className="flex items-center gap-2 border-t px-4 py-3 pl-11">
                <span className="text-xs text-muted-foreground">No items yet —</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-7 gap-1.5 px-2 text-xs text-brand hover:text-brand")}
                  onClick={() => toast("Nava is generating stories…", { icon: <Bot className="size-4 text-brand" /> })}
                >
                  <Sparkles className="size-3.5" aria-hidden />
                  Generate stories
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
