"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Play,
  Bot,
  Share2,
  MessageSquare,
  Paperclip,
  Hash,
  Plus,
  X,
  Search,
  Send,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority, Status, WorkItem, WorkItemType } from "@/lib/types";
import { activity, childrenOf, memberById, members, pipelines, sprints, workItemById, workItems } from "@/lib/data";
import { priorityConfig, statusConfig, StatusBadge, PriorityBadge, TypeBadge } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const releases = ["V1.0", "V1.1"];
const depTabs: { label: string; value: WorkItemType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Epic", value: "epic" },
  { label: "Feature", value: "feature" },
  { label: "Story", value: "story" },
  { label: "Task", value: "task" },
  { label: "Subtask", value: "subtask" },
  { label: "Bug", value: "bug" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function MappedSection({ title, items }: { title: string; items: WorkItem[] }) {
  const [open, setOpen] = React.useState(true);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md px-1 py-1.5 text-sm font-semibold hover:bg-accent/40"
        >
          <span>
            {title}
            <span className="ml-2 text-xs font-normal text-muted-foreground">{items.length}</span>
          </span>
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", !open && "-rotate-90")} aria-hidden />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {items.length === 0 ? (
          <p className="px-1 py-2 text-xs text-muted-foreground">Nothing mapped yet.</p>
        ) : (
          <ul className="flex flex-col">
            {items.map((it) => {
              const c = statusConfig[it.status];
              return (
                <li key={it.id} className="flex items-center gap-2 rounded-md px-1 py-1.5 hover:bg-accent/30">
                  <c.icon className={cn("size-3.5 shrink-0", c.className.split(" ")[0])} aria-label={c.label} />
                  <span className="font-mono text-[11px] text-muted-foreground">{it.key}</span>
                  <span className="min-w-0 truncate text-xs">{it.title}</span>
                </li>
              );
            })}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function TaskDetailBody({ item }: { item: WorkItem }) {
  const [title, setTitle] = React.useState(item.title);
  const [pipelineId, setPipelineId] = React.useState(item.pipelineId ?? "");
  const [assigneeId, setAssigneeId] = React.useState(item.assigneeId ?? "");
  const [sprintId, setSprintId] = React.useState(item.sprintId ?? "");
  const [status, setStatus] = React.useState<Status>(item.status);
  const [priority, setPriority] = React.useState<Priority>(item.priority);
  const [release, setRelease] = React.useState(item.release ?? "");
  const [description, setDescription] = React.useState(item.description ?? "");
  const [deps, setDeps] = React.useState<string[]>(
    (item.dependencyIds ?? []).map((id) => workItemById(id)?.key ?? id),
  );
  const [depSearch, setDepSearch] = React.useState("");
  const [depTab, setDepTab] = React.useState<WorkItemType | "all">("all");
  const [depOpen, setDepOpen] = React.useState(false);
  const [comment, setComment] = React.useState("");

  const humans = members.filter((m) => m.kind === "human");
  const agents = members.filter((m) => m.kind === "agent");

  const related = React.useMemo(
    () =>
      item.type === "epic"
        ? childrenOf(item.id)
        : workItems.filter((w) => w.parentId === item.parentId && w.id !== item.id),
    [item],
  );
  const mappedFeatures = related.filter((w) => w.type === "feature" || w.type === "story");
  const mappedTasks = related.filter((w) => w.type === "task" || w.type === "subtask" || w.type === "bug");

  const depCandidates = workItems.filter((w) => {
    if (w.id === item.id || deps.includes(w.key)) return false;
    if (depTab !== "all" && w.type !== depTab) return false;
    const q = depSearch.trim().toLowerCase();
    if (!q) return true;
    return w.title.toLowerCase().includes(q) || w.key.toLowerCase().includes(q);
  });

  const quiet = (msg: string) => toast(msg, { duration: 1600 });

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 px-6 pt-5 pb-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs">
          <span className="text-brand">All applications</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-brand">Paw care</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-mono text-muted-foreground">{item.key}</span>
        </nav>

        {/* Type + counters */}
        <div className="mt-3 flex items-center gap-2">
          <TypeBadge type={item.type} />
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            <MessageSquare className="size-3" aria-hidden />
            {item.comments ?? 0}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Paperclip className="size-3" aria-hidden />
            {item.attachments ?? 0}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Hash className="size-3" aria-hidden />
            {item.points ?? 0}
          </span>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => quiet("Title updated")}
          aria-label="Task title"
          className="mt-2 w-full border-none bg-transparent text-xl font-bold outline-none placeholder:text-muted-foreground"
          placeholder="Untitled"
        />

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => toast("Handed to AI agent…", { icon: <Bot className="size-4 text-brand" /> })}>
            <Play className="size-3.5" aria-hidden />
            Start
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => quiet("Opening AI chat…")}>
            <Bot className="size-3.5" aria-hidden />
            AI chat
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => quiet("Link copied to clipboard")}>
            <Share2 className="size-3.5" aria-hidden />
            Share
          </Button>
        </div>

        {/* Fields */}
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
          <Field label="Team">
            <Select
              value={pipelineId}
              onValueChange={(v) => {
                setPipelineId(v);
                quiet("Team updated");
              }}
            >
              <SelectTrigger size="sm" className="w-full" aria-label="Team">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className={cn("flex items-center gap-2", p.colorClass)}>
                      <span className="size-2 rounded-full" style={{ backgroundColor: "var(--pipeline)" }} aria-hidden />
                      {p.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Assignee">
            <Select
              value={assigneeId}
              onValueChange={(v) => {
                setAssigneeId(v);
                quiet("Assignee updated");
              }}
            >
              <SelectTrigger size="sm" className="w-full" aria-label="Assignee">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Team</SelectLabel>
                  {humans.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span className="flex items-center gap-2">
                        <UserAvatar member={m} size="xs" showTooltip={false} />
                        {m.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Agents</SelectLabel>
                  {agents.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span className="flex items-center gap-2">
                        <UserAvatar member={m} size="xs" showTooltip={false} />
                        {m.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Sprint">
            <Select
              value={sprintId}
              onValueChange={(v) => {
                setSprintId(v);
                quiet("Sprint updated");
              }}
            >
              <SelectTrigger size="sm" className="w-full" aria-label="Sprint">
                <SelectValue placeholder="No sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Status">
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as Status);
                quiet("Status updated");
              }}
            >
              <SelectTrigger size="sm" className="w-full" aria-label="Status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(statusConfig) as Status[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    <StatusBadge status={s} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Priority">
            <Select
              value={priority}
              onValueChange={(v) => {
                setPriority(v as Priority);
                quiet("Priority updated");
              }}
            >
              <SelectTrigger size="sm" className="w-full" aria-label="Priority">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(priorityConfig) as Priority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    <PriorityBadge priority={p} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Release">
            <Select
              value={release}
              onValueChange={(v) => {
                setRelease(v);
                quiet("Release updated");
              }}
            >
              <SelectTrigger size="sm" className="w-full" aria-label="Release">
                <SelectValue placeholder="No release" />
              </SelectTrigger>
              <SelectContent>
                {releases.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="col-span-2">
            <Field label="Dependency">
              <div className="flex flex-wrap items-center gap-1.5">
                {deps.map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {key}
                    <button
                      type="button"
                      aria-label={`Remove dependency ${key}`}
                      className="text-muted-foreground/70 hover:text-foreground"
                      onClick={() => {
                        setDeps((d) => d.filter((k) => k !== key));
                        quiet("Dependency removed");
                      }}
                    >
                      <X className="size-3" aria-hidden />
                    </button>
                  </span>
                ))}
                <Popover open={depOpen} onOpenChange={setDepOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-6 gap-1 rounded-md px-2 text-[11px]">
                      <Plus className="size-3" aria-hidden />
                      Add
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-80 p-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
                      <Input
                        value={depSearch}
                        onChange={(e) => setDepSearch(e.target.value)}
                        placeholder="Search work items"
                        aria-label="Search work items"
                        className="h-8 pl-8 text-xs"
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {depTabs.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setDepTab(t.value)}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
                            depTab === t.value
                              ? "border-transparent bg-brand text-white"
                              : "text-muted-foreground hover:bg-accent",
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <ul className="mt-2 max-h-52 overflow-y-auto">
                      {depCandidates.length === 0 && (
                        <li className="px-1 py-2 text-xs text-muted-foreground">No matching items</li>
                      )}
                      {depCandidates.map((w) => (
                        <li key={w.id}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left hover:bg-accent/40"
                            onClick={() => {
                              setDeps((d) => [...d, w.key]);
                              setDepOpen(false);
                              quiet(`Dependency ${w.key} added`);
                            }}
                          >
                            <span className="font-mono text-[11px] text-muted-foreground">{w.key}</span>
                            <span className="min-w-0 truncate text-xs">{w.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>
            </Field>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Description</span>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => quiet("Description saved")}
            rows={4}
            placeholder="Add a description…"
            className="text-sm"
          />
        </div>

        {/* Attachments */}
        <div className="mt-6 flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Attachments</span>
          <button
            type="button"
            onClick={() => quiet("Upload coming soon")}
            className="flex flex-col items-center gap-1 rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-accent/30"
          >
            <span>
              Drag your files or <span className="font-medium text-brand">upload</span>
            </span>
          </button>
          <span className="text-xs text-muted-foreground">No attachments found</span>
        </div>

        {/* Mapped sections */}
        <div className="mt-6 flex flex-col gap-2">
          <MappedSection title="Mapped features" items={mappedFeatures} />
          <MappedSection title="Mapped tasks" items={mappedTasks} />
        </div>

        {/* Activity */}
        <div className="mt-6 flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Activity</span>
          <ul className="flex flex-col gap-2.5">
            {activity.slice(0, 3).map((ev) => {
              const actor = memberById(ev.actorId);
              return (
                <li key={ev.id} className="flex items-center gap-2.5">
                  <UserAvatar member={actor} size="xs" showTooltip={false} />
                  <span className="min-w-0 truncate text-xs">
                    <span className="font-medium">{actor?.name}</span>{" "}
                    <span className="text-muted-foreground">{ev.action}</span>{" "}
                    <span className="font-medium">{ev.target}</span>
                  </span>
                  <span className="ml-auto text-[11px] whitespace-nowrap text-muted-foreground">{ev.at}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Sticky comment footer */}
      <div className="sticky bottom-0 flex items-center gap-2 border-t bg-popover px-6 py-3">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && comment.trim()) {
              toast.success("Comment posted");
              setComment("");
            }
          }}
          placeholder="Write a message"
          aria-label="Write a message"
          className="h-9 text-sm"
        />
        <Button
          size="icon"
          className="size-9 shrink-0"
          aria-label="Send message"
          onClick={() => {
            if (comment.trim()) {
              toast.success("Comment posted");
              setComment("");
            }
          }}
        >
          <Send className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

export function TaskDetailSheet({
  item,
  open,
  onOpenChange,
}: {
  item: WorkItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[540px] gap-0 overflow-y-auto p-0 sm:max-w-[540px]">
        <SheetTitle className="sr-only">{item ? `${item.key} — ${item.title}` : "Task details"}</SheetTitle>
        {item && <TaskDetailBody key={item.id} item={item} />}
      </SheetContent>
    </Sheet>
  );
}
