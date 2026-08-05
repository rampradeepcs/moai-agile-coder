import { cn } from "@/lib/utils";
import type { Priority, Status, WorkItemType } from "@/lib/types";
import {
  Bot,
  Bug,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleEllipsis,
  CirclePause,
  Crown,
  Eye,
  FlaskConical,
  Layers,
  ListChecks,
  Puzzle,
  SquareCheck,
} from "lucide-react";

const typeConfig: Record<WorkItemType, { label: string; icon: React.ElementType; className: string }> = {
  epic: { label: "Epic", icon: Crown, className: "bg-brand-subtle text-brand" },
  feature: { label: "Feature", icon: Puzzle, className: "bg-teal-subtle text-teal" },
  story: { label: "Story", icon: Layers, className: "bg-info-subtle text-info" },
  task: { label: "Task", icon: SquareCheck, className: "bg-warning-subtle text-warning" },
  subtask: { label: "Subtask", icon: ListChecks, className: "bg-muted text-muted-foreground" },
  bug: { label: "Bug", icon: Bug, className: "bg-danger-subtle text-danger" },
};

export function TypeBadge({ type, className }: { type: WorkItemType; className?: string }) {
  const c = typeConfig[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        c.className,
        className,
      )}
    >
      <c.icon className="size-3" aria-hidden />
      {c.label}
    </span>
  );
}

const priorityConfig: Record<Priority, { label: string; className: string; bar: string }> = {
  low: { label: "Low", className: "bg-success-subtle text-success", bar: "bg-success" },
  medium: { label: "Medium", className: "bg-warning-subtle text-warning", bar: "bg-warning" },
  high: { label: "High", className: "bg-pink-subtle text-pink", bar: "bg-pink" },
  critical: { label: "Critical", className: "bg-danger-subtle text-danger", bar: "bg-danger" },
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const c = priorityConfig[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        c.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.bar)} aria-hidden />
      {c.label}
    </span>
  );
}

const statusConfig: Record<Status, { label: string; icon: React.ElementType; className: string }> = {
  backlog: { label: "Backlog", icon: CircleDashed, className: "text-muted-foreground bg-muted" },
  todo: { label: "To Do", icon: CircleDot, className: "text-muted-foreground bg-muted" },
  "in-progress": { label: "In progress", icon: CircleEllipsis, className: "text-warning bg-warning-subtle" },
  "in-review": { label: "In review", icon: Eye, className: "text-brand bg-brand-subtle" },
  testing: { label: "Testing", icon: FlaskConical, className: "text-pink bg-pink-subtle" },
  completed: { label: "Completed", icon: CircleCheck, className: "text-success bg-success-subtle" },
  blocked: { label: "Blocked", icon: CirclePause, className: "text-danger bg-danger-subtle" },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const c = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        c.className,
        className,
      )}
    >
      <c.icon className="size-3" aria-hidden />
      {c.label}
    </span>
  );
}

export function AgentBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-brand-subtle px-1.5 py-0.5 text-[11px] font-medium text-brand",
        className,
      )}
    >
      <Bot className="size-3" aria-hidden />
      Agent
    </span>
  );
}

export { typeConfig, priorityConfig, statusConfig };
