"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Bot,
  Link2,
  MessageSquare,
  Paperclip,
  Play,
  Send,
  Share2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority, Status, WorkItem } from "@/lib/types";
import { activity, childrenOf, memberById, members, pipelines, sprints, workItems } from "@/lib/data";
import {
  priorityConfig,
  statusConfig,
  PriorityBadge,
  StatusBadge,
  TypeBadge,
} from "@/components/work/badges";
import { UserAvatar, AssigneeInline } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TaskFullView({ item, slug }: { item: WorkItem; slug: string }) {
  const [title, setTitle] = React.useState(item.title);
  const [status, setStatus] = React.useState<Status>(item.status);
  const [priority, setPriority] = React.useState<Priority>(item.priority);
  const [assigneeId, setAssigneeId] = React.useState(item.assigneeId ?? "");
  const [sprintId, setSprintId] = React.useState(item.sprintId ?? "");
  const [comments, setComments] = React.useState<{ id: number; authorId: string; text: string; at: string }[]>([
    { id: 1, authorId: "u2", text: "Aligned this with the sprint scope — please confirm the due date rule.", at: "2h ago" },
    { id: 2, authorId: "a1", text: "I broke this down into 3 subtasks and queued them for review.", at: "1h ago" },
  ]);
  const [draft, setDraft] = React.useState("");

  const pipeline = pipelines.find((p) => p.id === item.pipelineId);
  const related = item.type === "epic" ? childrenOf(item.id) : workItems.filter((w) => w.parentId === item.parentId && w.id !== item.id);
  const dependencies = (item.dependencyIds ?? [])
    .map((id) => workItems.find((w) => w.id === id))
    .filter(Boolean) as WorkItem[];

  const quiet = (msg: string) => toast(msg, { duration: 1600 });

  const sendComment = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: prev.length + 1, authorId: "u1", text, at: "just now" }]);
    setDraft("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="text-xs">
          <Link href="/apps" className="text-brand hover:underline">Projects</Link>
          <span className="mx-1.5 text-muted-foreground">/</span>
          <Link href={`/apps/${slug}/backlog`} className="text-brand hover:underline capitalize">
            {slug.replace(/-/g, " ")}
          </Link>
          <span className="mx-1.5 text-muted-foreground">/</span>
          <span className="font-mono text-muted-foreground">{item.key}</span>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => quiet("Share link copied")}>
            <Share2 className="size-3.5" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href={`/apps/${slug}/story/${item.key}`}>
              <Bot className="size-3.5" /> AI chat
            </Link>
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => toast("Handed to AI agent…", { icon: <Bot className="size-4" /> })}>
            <Play className="size-3.5 fill-current" /> Start
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TypeBadge type={item.type} />
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquare className="size-3.5" aria-hidden /> {comments.length}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Paperclip className="size-3.5" aria-hidden /> {item.attachments ?? 0}
        </span>
        <span className="text-xs text-muted-foreground"># {item.points ?? 0} pts</span>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => quiet("Title saved")}
        aria-label="Task title"
        className="mt-1 w-full max-w-3xl bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted-foreground"
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-5">
          <Card data-size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={item.description}
                placeholder="Add a description…"
                className="min-h-28"
                onBlur={() => quiet("Description saved")}
              />
            </CardContent>
          </Card>

          <Card data-size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <button
                type="button"
                onClick={() => quiet("Upload coming soon")}
                className="flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed py-8 text-sm text-muted-foreground transition-colors hover:border-ring/50 hover:text-foreground"
              >
                <Upload className="size-4" aria-hidden />
                <span>
                  Drag your files or <span className="font-medium text-brand">upload</span>
                </span>
              </button>
              <p className="mt-2 text-xs text-muted-foreground">No attachments found</p>
            </CardContent>
          </Card>

          <Card data-size="sm">
            <CardHeader>
              <CardTitle className="text-sm">
                {item.type === "epic" ? "Mapped items" : "Related work"}{" "}
                <span className="ml-1 text-xs font-normal text-muted-foreground">{related.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              {related.length === 0 && <p className="text-xs text-muted-foreground">Nothing mapped yet.</p>}
              {related.map((r) => {
                const rs = statusConfig[r.status];
                return (
                  <div key={r.id} className="flex items-center gap-2.5 border-t py-2 first:border-t-0">
                    <rs.icon className={cn("size-3.5", rs.className.split(" ")[0])} aria-label={rs.label} />
                    <span className="font-mono text-[11px] text-muted-foreground">{r.key}</span>
                    <span className="min-w-0 truncate text-sm">{r.title}</span>
                    <span className="ml-auto"><StatusBadge status={r.status} /></span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card data-size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Comments</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {comments.map((c) => {
                const author = memberById(c.authorId);
                return (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <UserAvatar member={author} size="sm" showTooltip={false} />
                    <div className="min-w-0">
                      <p className="text-xs">
                        <span className="font-medium">{author?.name}</span>{" "}
                        <span className="text-muted-foreground">· {c.at}</span>
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-2 border-t pt-3">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendComment()}
                  placeholder="Write a message"
                  aria-label="Write a comment"
                />
                <Button size="icon" aria-label="Send comment" onClick={sendComment} disabled={!draft.trim()}>
                  <Send className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details column */}
        <div className="flex flex-col gap-5">
          <Card data-size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field label="Team">
                <span className="flex items-center gap-2 text-sm">
                  <span className={cn("size-2 rounded-full", pipeline?.colorClass)} style={{ background: "var(--pipeline)" }} />
                  {pipeline?.name ?? "Unassigned"}
                </span>
              </Field>
              <Field label="Assignee">
                <Select value={assigneeId} onValueChange={(v) => { setAssigneeId(v); quiet("Assignee updated"); }}>
                  <SelectTrigger className="w-full" aria-label="Assignee">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <AssigneeInline member={m} size="xs" />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Sprint">
                <Select value={sprintId} onValueChange={(v) => { setSprintId(v); quiet("Sprint updated"); }}>
                  <SelectTrigger className="w-full" aria-label="Sprint">
                    <SelectValue placeholder="No sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {sprints.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Status">
                <Select value={status} onValueChange={(v) => { setStatus(v as Status); quiet("Status updated"); }}>
                  <SelectTrigger className="w-full" aria-label="Status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusConfig) as Status[]).map((s) => (
                      <SelectItem key={s} value={s}><StatusBadge status={s} /></SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Priority">
                <Select value={priority} onValueChange={(v) => { setPriority(v as Priority); quiet("Priority updated"); }}>
                  <SelectTrigger className="w-full" aria-label="Priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(priorityConfig) as Priority[]).map((p) => (
                      <SelectItem key={p} value={p}><PriorityBadge priority={p} /></SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Release">
                <span className="text-sm">{item.release ?? "V1.0"}</span>
              </Field>
              <Field label="Dependencies">
                {dependencies.length === 0 ? (
                  <span className="text-xs text-muted-foreground">No dependencies</span>
                ) : (
                  <span className="flex flex-wrap gap-1.5">
                    {dependencies.map((d) => (
                      <span key={d.id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        <Link2 className="size-3" aria-hidden />
                        {d.key}
                      </span>
                    ))}
                  </span>
                )}
              </Field>
            </CardContent>
          </Card>

          <Card data-size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {activity.slice(0, 4).map((a) => {
                const actor = memberById(a.actorId);
                return (
                  <div key={a.id} className="flex items-start gap-2.5">
                    <UserAvatar member={actor} size="xs" showTooltip={false} />
                    <p className="min-w-0 text-xs leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">{actor?.name}</span> {a.action}{" "}
                      <span className="text-foreground">{a.target}</span>
                      <span className="ml-1 opacity-70">· {a.at}</span>
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_1fr] items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
