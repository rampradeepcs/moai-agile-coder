"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Coins, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { memberById, projects } from "@/lib/data";
import { creditBalance, projectUsage, usageTrend, userUsage } from "@/lib/workspace-data";
import { ChartFrame, ChartTooltip, PageHeader, axisProps, gridProps } from "@/components/shared";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SERIES = [
  { key: "paw-care", color: "var(--chart-1)" },
  { key: "skin-care", color: "var(--chart-6)" },
  { key: "fit-coach", color: "var(--chart-3)" },
] as const;

export default function UsagePage() {
  const [allocations, setAllocations] = useState(() =>
    Object.fromEntries(projectUsage.map((p) => [p.slug, p.allocated])),
  );
  const [managing, setManaging] = useState<string | null>(null);
  const [draft, setDraft] = useState(0);
  const [userFilter, setUserFilter] = useState<string>("all");

  const managingProject = projectUsage.find((p) => p.slug === managing);
  const filteredUsers =
    userFilter === "all"
      ? userUsage
      : userUsage.filter((u) => u.projects.includes(userFilter));

  const usedPct = Math.round((creditBalance.used / creditBalance.total) * 100);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
      <PageHeader
        title="Usage & utilisation"
        description="Where your workspace credits go — by project and by person."
        actions={
          <Button asChild size="sm">
            <Link href="/credits">Add credits</Link>
          </Button>
        }
      />

      {/* Workspace balance */}
      <section className="grid gap-4 rounded-xl bg-card p-6 shadow-soft sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-subtle text-brand">
            <Coins className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-xl font-semibold tabular-nums tracking-tight">
              {creditBalance.remaining.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">credits remaining</p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1.5 sm:col-span-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {creditBalance.used.toLocaleString()} of {creditBalance.total.toLocaleString()} used this cycle
            </span>
            <span className="tabular-nums">{usedPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", usedPct > 85 ? "bg-danger" : "bg-brand")}
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">Credits refresh on {creditBalance.refreshOn}</p>
        </div>
      </section>

      {/* Monthly consumption chart */}
      <section className="rounded-xl bg-card p-5 shadow-soft">
        <h2 className="mb-4 text-sm font-semibold">Monthly consumption</h2>
        <ChartFrame height={240}>
            <BarChart data={usageTrend} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis
                {...axisProps}
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              />
              <ChartTooltip
                formatter={(value, name) => [
                  Number(value ?? 0).toLocaleString(),
                  projects.find((p) => p.slug === name)?.name ?? String(name),
                ]}
              />
              {SERIES.map((s, i) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  stackId="a"
                  fill={s.color}
                  radius={i === SERIES.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartFrame>
      </section>

      {/* Per-project usage */}
      <section className="rounded-xl bg-card p-5 shadow-soft">
        <h2 className="mb-3 text-sm font-semibold">By project</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>LLM</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="min-w-44">Utilisation</TableHead>
              <TableHead className="text-right">Used / allocated</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectUsage.map((p) => {
              const allocated = allocations[p.slug];
              const pct = Math.min(100, Math.round((p.used / allocated) * 100));
              return (
                <TableRow key={p.slug}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.llm}</TableCell>
                  <TableCell className="text-muted-foreground">{p.members}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-full max-w-36 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            pct > 90 ? "bg-danger" : pct > 70 ? "bg-warning" : "bg-brand",
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {p.used.toLocaleString()} / {allocated.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="xs"
                      className="gap-1"
                      onClick={() => {
                        setManaging(p.slug);
                        setDraft(allocated);
                      }}
                    >
                      <SlidersHorizontal className="size-3" aria-hidden /> Manage
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      {/* Per-user usage */}
      <section className="rounded-xl bg-card p-5 shadow-soft">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">By person</h2>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger size="sm" className="w-44 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead className="min-w-44">Share of usage</TableHead>
              <TableHead className="text-right">Credits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => {
              const member = memberById(u.memberId);
              if (!member) return null;
              return (
                <TableRow key={u.memberId}>
                  <TableCell>
                    <span className="flex items-center gap-2.5">
                      <UserAvatar member={member} size="sm" showTooltip={false} />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium">{member.name}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {member.role}
                        </span>
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-medium",
                        member.kind === "agent"
                          ? "bg-pink-subtle text-pink"
                          : "bg-teal-subtle text-teal",
                      )}
                    >
                      {member.kind === "agent" ? "AI agent" : "Human"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.projects
                      .map((slug) => projects.find((p) => p.slug === slug)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-full max-w-36 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${u.share}%` }}
                        />
                      </div>
                      <span className="text-[11px] tabular-nums text-muted-foreground">{u.share}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{u.credits.toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      {/* Manage allocation dialog */}
      <Dialog open={managing !== null} onOpenChange={(open) => !open && setManaging(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage allocation</DialogTitle>
            <DialogDescription>
              Set the monthly credit budget for {managingProject?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold tabular-nums tracking-tight">
                {draft.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                {managingProject?.used.toLocaleString()} already used
              </span>
            </div>
            <Slider
              value={[draft]}
              min={managingProject?.used ?? 0}
              max={200000}
              step={5000}
              onValueChange={([v]) => setDraft(v)}
            />
            <p className="text-[11px] text-muted-foreground">
              Lower bound is the project&apos;s current usage. Changes apply immediately.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManaging(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (managing) {
                  setAllocations((a) => ({ ...a, [managing]: draft }));
                  toast.success(`${managingProject?.name} allocation set to ${draft.toLocaleString()}`);
                }
                setManaging(null);
              }}
            >
              Save allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
