"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Bot, Coins, FolderKanban, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { activity, memberById, projects } from "@/lib/data";
import {
  agentCount,
  creditBalance,
  memberCount,
  usageTrend,
} from "@/lib/workspace-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  axisTick,
  gridProps,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from "@/components/dashboard/chart-style";
import { GlobalHeader } from "@/components/shell/global-header";
import { ProjectLogo } from "@/components/work/project-logo";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";

const SERIES = [
  { key: "paw-care", color: "var(--chart-1)" },
  { key: "skin-care", color: "var(--chart-6)" },
  { key: "fit-coach", color: "var(--chart-3)" },
] as const;

export default function GlobalDashboardPage() {
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const usedPct = Math.round((creditBalance.used / creditBalance.total) * 100);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
      <GlobalHeader
        title="Dashboard"
        description="Everything happening across your workspace."
        actions={
          <Button asChild size="sm">
            <Link href="/apps/new">New project</Link>
          </Button>
        }
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Projects"
          value={String(projects.length)}
          sub={`${activeProjects} active`}
          icon={FolderKanban}
          iconClass="bg-brand-subtle text-brand"
        />
        <KpiCard
          label="Credits used"
          value={`${usedPct}%`}
          sub={`${creditBalance.remaining.toLocaleString()} remaining`}
          delta="+12%"
          positive={false}
          icon={Coins}
          iconClass="bg-warning-subtle text-warning"
        />
        <KpiCard
          label="Team members"
          value={String(memberCount)}
          sub="across all projects"
          icon={Users2}
          iconClass="bg-teal-subtle text-teal"
        />
        <KpiCard
          label="AI agents"
          value={String(agentCount)}
          sub="4 working right now"
          icon={Bot}
          iconClass="bg-pink-subtle text-pink"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        {/* Usage trend across projects */}
        <section className="rounded-xl bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Credit usage by project</h2>
            <Link
              href="/usage"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              View usage <ArrowUpRight className="size-3" aria-hidden />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageTrend} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                <defs>
                  {SERIES.map((s) => (
                    <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={s.color} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  formatter={(value, name) => [
                    Number(value ?? 0).toLocaleString(),
                    projects.find((p) => p.slug === name)?.name ?? String(name),
                  ]}
                />
                {SERIES.map((s) => (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={2}
                    fill={`url(#fill-${s.key})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {SERIES.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden />
                {projects.find((p) => p.slug === s.key)?.name}
              </span>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section className="rounded-xl bg-card p-5 shadow-soft">
          <h2 className="mb-4 text-sm font-semibold">Recent AI activity</h2>
          <ul className="flex flex-col gap-4">
            {activity.slice(0, 6).map((event) => {
              const actor = memberById(event.actorId);
              return (
                <li key={event.id} className="flex items-start gap-2.5">
                  {actor && <UserAvatar member={actor} size="sm" showTooltip={false} />}
                  <div className="min-w-0 flex-1 text-[13px] leading-snug">
                    <span className="font-medium">{actor?.name}</span>{" "}
                    <span className="text-muted-foreground">
                      {event.action} {event.target}
                    </span>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/80">{event.at}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Project overview cards */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">Projects</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p, i) => {
            const pct = Math.min(100, Math.round((p.tokensUsed / p.tokensAssigned) * 100));
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25, ease: "easeOut" }}
              >
                <Link
                  href={`/apps/${p.slug}/dashboard`}
                  className="flex h-full flex-col gap-3 rounded-xl bg-card p-5 shadow-soft transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-center gap-3">
                    <ProjectLogo project={p} size="md" className="rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.platform}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
                        p.status === "active"
                          ? "bg-success-subtle text-success"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-auto flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Credits</span>
                      <span className="tabular-nums">
                        {p.tokensUsed.toLocaleString()} / {p.tokensAssigned.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full", pct > 90 ? "bg-danger" : "bg-brand")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
