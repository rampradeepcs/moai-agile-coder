"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Bot, ChevronDown, Maximize2, MessageSquare, Paperclip, Play, SendHorizontal, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority, Status, WorkItem } from "@/lib/types";
import { members, pipelines, sprints } from "@/lib/data";
import { PriorityBadge, StatusBadge, TypeBadge, priorityConfig, statusConfig } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const humans = members.filter((m) => m.kind === "human");
const agents = members.filter((m) => m.kind === "agent");

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export function TaskDetailSheet({
  item,
  open,
  onOpenChange,
  allItems,
  onUpdate,
}: {
  item: WorkItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allItems: WorkItem[];
  onUpdate: (id: string, patch: Partial<WorkItem>) => void;
}) {
  const [comment, setComment] = useState("");

  const pipeline = pipelines.find((p) => p.id === item?.pipelineId);
  const siblings = item?.parentId
    ? allItems.filter((w) => w.parentId === item.parentId && w.id !== item.id)
    : [];
  const dependencies = (item?.dependencyIds ?? [])
    .map((id) => allItems.find((w) => w.id === id))
    .filter((w): w is WorkItem => Boolean(w));

  const update = (patch: Partial<WorkItem>, message: string) => {
    if (!item) return;
    onUpdate(item.id, patch);
    toast.success(message);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 data-[side=right]:sm:max-w-[520px]"
      >
        {item && (
          <div key={item.id} className="flex flex-col gap-5 px-5 py-5">
            <SheetHeader className="gap-2 p-0 text-left">
              <SheetDescription className="text-xs text-muted-foreground">
                All applications / Paw care /{" "}
                <span className="font-mono text-foreground">{item.key}</span>
              </SheetDescription>

              <div className="flex flex-wrap items-center gap-3">
                <TypeBadge type={item.type} />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="size-3.5" aria-hidden /> {item.comments ?? 0}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Paperclip className="size-3.5" aria-hidden /> {item.attachments ?? 0}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span aria-hidden>#</span> {item.points ?? 0}
                </span>
              </div>

              <SheetTitle className="text-xl font-semibold leading-snug">{item.title}</SheetTitle>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => toast(`Starting ${item.key}…`, { description: "AI agents are picking up this task." })}
                >
                  <Play className="size-3.5 fill-current" aria-hidden /> Start
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => toast("Opening AI chat…", { description: `Context loaded for ${item.key}.` })}
                >
                  <Bot className="size-3.5" aria-hidden /> AI chat
                </Button>
                <Button variant="outline" size="sm" className="ml-auto gap-1.5" asChild>
                  <Link href={`/apps/paw-care/task/${item.key}`}>
                    <Maximize2 className="size-3.5" aria-hidden /> Full view
                  </Link>
                </Button>
              </div>
            </SheetHeader>

            <Separator />

            {/* Fields */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <Field label="Team">
                <span className={cn("flex h-8 items-center gap-2 text-[13px] font-medium", pipeline?.colorClass)}>
                  <span
                    className="size-2 rounded-full"
                    style={{ background: "var(--pipeline)" }}
                    aria-hidden
                  />
                  {pipeline?.name ?? "Unassigned"}
                </span>
              </Field>

              <Field label="Assignee">
                <Select
                  value={item.assigneeId}
                  onValueChange={(v) => update({ assigneeId: v }, "Assignee updated")}
                >
                  <SelectTrigger size="sm" className="w-full text-xs" aria-label="Assignee">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {humans.map((m) => (
                        <SelectItem key={m.id} value={m.id} className="text-xs">
                          <UserAvatar member={m} size="xs" showTooltip={false} /> {m.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="text-[11px] uppercase tracking-wide">Agents</SelectLabel>
                      {agents.map((m) => (
                        <SelectItem key={m.id} value={m.id} className="text-xs">
                          <UserAvatar member={m} size="xs" showTooltip={false} /> {m.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Sprint">
                <Select
                  value={item.sprintId}
                  onValueChange={(v) => update({ sprintId: v }, "Sprint updated")}
                >
                  <SelectTrigger size="sm" className="w-full text-xs" aria-label="Sprint">
                    <SelectValue placeholder="No sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {sprints.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={item.status}
                  onValueChange={(v) => update({ status: v as Status }, "Status updated")}
                >
                  <SelectTrigger size="sm" className="w-full text-xs" aria-label="Status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusConfig) as Status[]).map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        <StatusBadge status={s} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Priority">
                <Select
                  value={item.priority}
                  onValueChange={(v) => update({ priority: v as Priority }, "Priority updated")}
                >
                  <SelectTrigger size="sm" className="w-full text-xs" aria-label="Priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(priorityConfig) as Priority[]).map((p) => (
                      <SelectItem key={p} value={p} className="text-xs">
                        <PriorityBadge priority={p} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Release">
                <span className="flex h-8 items-center text-[13px] font-medium">{item.release ?? "V1.0"}</span>
              </Field>

              <div className="col-span-2">
                <Field label="Dependency">
                  {dependencies.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {dependencies.map((dep) => (
                        <span
                          key={dep.id}
                          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          title={dep.title}
                        >
                          {dep.key}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/70">No dependencies</span>
                  )}
                </Field>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">Description</span>
              <Textarea
                defaultValue={item.description}
                placeholder="Add a description…"
                className="min-h-24 text-xs"
                onBlur={(e) => {
                  if (e.target.value !== (item.description ?? "")) {
                    update({ description: e.target.value }, "Description updated");
                  }
                }}
              />
            </div>

            {/* Attachments */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">Attachments</span>
              <button
                type="button"
                onClick={() => toast("Upload attachments", { description: "File uploads are disabled in this demo." })}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed px-4 py-6 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
              >
                <Upload className="size-4" aria-hidden />
                <span>
                  Drag your files or <span className="font-medium text-brand">upload</span>
                </span>
              </button>
              <p className="text-xs text-muted-foreground/70">No attachments found</p>
            </div>

            {/* Mapped tasks */}
            <Collapsible defaultOpen={siblings.length > 0}>
              <CollapsibleTrigger className="group flex w-full items-center gap-1.5 text-left">
                <span className="text-sm font-semibold">Mapped tasks</span>
                <span className="rounded-md bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground">
                  {siblings.length}
                </span>
                <ChevronDown
                  className="ml-auto size-3.5 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90"
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 flex flex-col gap-1">
                  {siblings.length === 0 && (
                    <p className="text-xs text-muted-foreground/70">No mapped tasks</p>
                  )}
                  {siblings.map((sib) => {
                    const StatusIcon = statusConfig[sib.status].icon;
                    return (
                      <div
                        key={sib.id}
                        className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-2"
                      >
                        <StatusIcon
                          className={cn("size-3.5 shrink-0", statusConfig[sib.status].className.split(" ")[0])}
                          aria-hidden
                        />
                        <span className="font-mono text-[10px] text-muted-foreground">{sib.key}</span>
                        <span className="min-w-0 flex-1 truncate text-xs font-medium">{sib.title}</span>
                        <StatusBadge status={sib.status} />
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Comments */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">Comments</span>
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!comment.trim()) return;
                  toast.success("Comment posted");
                  setComment("");
                }}
              >
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a message"
                  className="h-9 text-xs"
                />
                <Button type="submit" size="icon" variant="outline" aria-label="Send comment">
                  <SendHorizontal className="size-4" aria-hidden />
                </Button>
              </form>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
