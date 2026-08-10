"use client";

import { motion, type Variants } from "framer-motion";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeCheck,
  CalendarDays,
  Crown,
  Gauge,
  Layers,
  ShieldAlert,
  Sparkles,
  Timer,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { activity, memberById, sprints, sprintSummary } from "@/lib/data";
import type { Sprint } from "@/lib/types";
import { UserAvatar } from "@/components/work/user-avatar";
import { KpiCard } from "./kpi-card";
import { ProgressRing } from "./progress-ring";
import {
  axisTick,
  gridProps,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from "./chart-style";

/* ————— animation ————— */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

/* ————— helpers & derived data ————— */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fmtDay = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${d}`;
};

const sprintRange = (s: Sprint) => `${fmtDay(s.start)} – ${fmtDay(s.end)}`;

const activeSprint = sprints.find((s) => s.state === "active");

const avgVelocity = Math.floor(
  sprintSummary.velocity.reduce((sum, v) => sum + (v.committed + v.completed) / 2, 0) /
    sprintSummary.velocity.length,
);

const orderedSprints = [...sprints].sort((a, b) => a.start.localeCompare(b.start));

const performanceIcons: Record<string, { icon: LucideIcon; iconClass: string }> = {
  "Delivery performance": { icon: Truck, iconClass: "bg-teal-subtle text-teal" },
  "Sprint time": { icon: Zap, iconClass: "bg-warning-subtle text-warning" },
  "Quality score": { icon: BadgeCheck, iconClass: "bg-success-subtle text-success" },
  "Predictability & Risk": { icon: ShieldAlert, iconClass: "bg-danger-subtle text-danger" },
};

const countItems = [
  { label: "Completed", value: sprintSummary.counts.completed, dot: "bg-success", color: "var(--success)" },
  { label: "Bugs", value: sprintSummary.counts.bugs, dot: "bg-danger", color: "var(--danger)" },
  { label: "Testing", value: sprintSummary.counts.testing, dot: "bg-pink", color: "var(--pink)" },
  { label: "In review", value: sprintSummary.counts.inReview, dot: "bg-brand", color: "var(--brand)" },
  { label: "In progress", value: sprintSummary.counts.inProgress, dot: "bg-warning", color: "var(--warning)" },
  {
    label: "Backlog",
    value: sprintSummary.counts.backlog,
    dot: "bg-muted-foreground/60",
    color: "color-mix(in oklch, var(--muted-foreground) 55%, transparent)",
  },
];

/* Barcode strip — deterministic heights from index math (no Math.random,
   so server and client render identically). */
const BAR_COUNT = 120;
const countsTotal = countItems.reduce((sum, c) => sum + c.value, 0);
const cumulative = (() => {
  let acc = 0;
  return countItems.map((c) => (acc += c.value) / countsTotal);
})();
const barcodeBars = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = (i + 0.5) / BAR_COUNT;
  const idx = cumulative.findIndex((c) => t <= c);
  const noise = Math.abs(Math.sin(i * 12.9898 + 4.1) * 43758.5453) % 1;
  return {
    color: countItems[idx === -1 ? countItems.length - 1 : idx].color,
    height: Math.round(16 + noise * 26),
  };
});

const myWorkColors = ["var(--chart-3)", "var(--chart-1)", "var(--chart-2)", "var(--chart-6)"];

const deadlines = [
  ...(activeSprint
    ? [{ title: `${activeSprint.name} review & demo`, sub: "Active sprint ends", date: fmtDay(activeSprint.end), dot: "bg-danger" }]
    : []),
  ...sprints
    .filter((s) => s.state === "planned")
    .map((s) => ({ title: `${s.name} kickoff`, sub: "Planned sprint", date: fmtDay(s.start), dot: "bg-brand" })),
  // Invented milestones
  { title: "Beta release — TestFlight", sub: "Milestone", date: "Jun 15", dot: "bg-pink" },
  { title: "Vet booking GA rollout", sub: "Milestone", date: "Jun 24", dot: "bg-warning" },
  { title: "App store submission", sub: "Milestone", date: "Jun 30", dot: "bg-success" },
];

const cardClass = "rounded-2xl bg-card p-5 shadow-soft";

/** Legend rendered as small colored-dot chips. */
function LegendChips({
  items,
}: {
  items: { label: string; color: string; dashed?: boolean }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((legend) => (
        <span
          key={legend.label}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
        >
          {legend.dashed ? (
            <span
              className="h-0 w-3 border-t border-dashed"
              style={{ borderColor: legend.color }}
              aria-hidden
            />
          ) : (
            <span className="size-1.5 rounded-full" style={{ background: legend.color }} aria-hidden />
          )}
          {legend.label}
        </span>
      ))}
    </div>
  );
}

/* ————— view ————— */

export function SprintView() {
  const myWorkTotal = sprintSummary.myWork.total;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex min-w-0 flex-col gap-4">
      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total epics"
          value={String(sprintSummary.totalEpics)}
          sub="Across all modules"
          icon={Crown}
          iconClass="bg-brand-subtle text-brand"
        />
        <KpiCard
          label="Stories"
          value={String(sprintSummary.stories)}
          sub={`${sprintSummary.storiesInProgress} in progress`}
          icon={Layers}
          iconClass="bg-info-subtle text-info"
        />
        <KpiCard
          label="Active sprint"
          value={activeSprint?.name ?? "—"}
          sub={activeSprint ? sprintRange(activeSprint) : "No active sprint"}
          icon={Timer}
          iconClass="bg-pink-subtle text-pink"
        />
        <KpiCard
          label="Velocity"
          value={`${avgVelocity} pts`}
          sub="avg last 5 sprints"
          icon={Gauge}
          iconClass="bg-teal-subtle text-teal"
        />
      </motion.div>

      {/* AI project summary */}
      <motion.div variants={item} className={cardClass}>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-brand" aria-hidden>
            <Sparkles className="size-4" />
          </span>
          <h3 className="text-sm font-semibold">AI project summary</h3>
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground tabular-nums">{countsTotal.toLocaleString()}</span>{" "}
            items
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {countItems.map((c) => (
            <div key={c.label} className="flex items-center gap-2">
              <span className={cn("size-2 rounded-full", c.dot)} aria-hidden />
              <span className="text-xs text-muted-foreground">{c.label}</span>
              <span className="text-sm font-semibold tabular-nums">{c.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div
          className="mt-4 flex h-12 items-end gap-px overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
          }}
          aria-hidden
        >
          {barcodeBars.map((bar, i) => (
            <span
              key={i}
              className="w-0.5 shrink-0 rounded-t-full"
              style={{ height: bar.height, background: bar.color }}
            />
          ))}
        </div>
      </motion.div>

      {/* Performance */}
      <motion.div variants={item} className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Performance</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sprintSummary.performance.map((p) => (
            <KpiCard
              key={p.label}
              label={p.label}
              value={p.value}
              delta={p.delta}
              positive={p.positive}
              icon={performanceIcons[p.label]?.icon}
              iconClass={performanceIcons[p.label]?.iconClass}
            />
          ))}
        </div>
      </motion.div>

      {/* Sprint progress */}
      <motion.div variants={item} className={cardClass}>
        <h3 className="mb-4 text-sm font-semibold">Sprint progress</h3>
        <div className="scrollbar-thin -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-1">
          {orderedSprints.map((sprint) => {
            const isActive = sprint.state === "active";
            const isDone = sprint.completed >= 1;
            return (
              <div
                key={sprint.id}
                className={cn(
                  "relative flex min-w-[180px] flex-1 snap-start flex-col items-center gap-3 overflow-hidden rounded-2xl bg-surface p-4",
                  isActive &&
                    "ring-2 ring-brand/70 shadow-[0_10px_30px_-10px_oklch(0.54_0.22_262_/_45%)]",
                )}
              >
                  {/* subtle radial tint behind the ring */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "radial-gradient(circle at 50% 42%, var(--brand-subtle) 0%, transparent 72%)",
                      opacity: 0.5,
                    }}
                    aria-hidden
                  />
                  <div className="relative flex flex-col items-center gap-0.5 text-center">
                    <span className="text-sm font-semibold">{sprint.name}</span>
                    <span className="text-xs text-muted-foreground">{sprintRange(sprint)}</span>
                  </div>
                  <div className="relative">
                    <ProgressRing
                      value={sprint.completed}
                      size={92}
                      strokeWidth={8}
                      color={isDone ? "var(--success)" : "var(--brand)"}
                    >
                      <span className="text-lg font-semibold tabular-nums">
                        {Math.round(sprint.completed * 100)}%
                      </span>
                      <span className="text-[10px] text-muted-foreground">Completed</span>
                    </ProgressRing>
                  </div>
                  {isActive && (
                    <span className="relative rounded-full bg-brand-gradient px-2.5 py-0.5 text-[11px] font-medium text-white shadow-elevation-low">
                      Active
                    </span>
                  )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Charts row */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className={cn(cardClass, "min-w-0 overflow-hidden")}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Velocity</h3>
            <LegendChips
              items={[
                { label: "Committed", color: "var(--chart-1)" },
                { label: "Completed", color: "var(--chart-3)" },
              ]}
            />
          </div>
          <div className="h-[260px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintSummary.velocity} barGap={4} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="velCommitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                  </linearGradient>
                  <linearGradient id="velCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.25} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="sprint" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.35 }}
                  contentStyle={tooltipContentStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  formatter={(value) => `${Number(value).toLocaleString()} pts`}
                />
                <Bar dataKey="committed" name="Committed" fill="url(#velCommitted)" radius={[8, 8, 2, 2]} maxBarSize={18} />
                <Bar dataKey="completed" name="Completed" fill="url(#velCompleted)" radius={[8, 8, 2, 2]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn(cardClass, "min-w-0 overflow-hidden")}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Burndown</h3>
            <LegendChips
              items={[
                { label: "Ideal", color: "var(--muted-foreground)", dashed: true },
                { label: "Actual", color: "var(--chart-1)" },
              ]}
            />
          </div>
          <div className="h-[260px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={sprintSummary.burndown} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="burnActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  formatter={(value) => `${Number(value).toLocaleString()} pts`}
                />
                <Line
                  dataKey="ideal"
                  name="Ideal"
                  stroke="var(--muted-foreground)"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  dot={false}
                />
                <Area
                  dataKey="actual"
                  name="Actual"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#burnActual)"
                  dot={{ r: 3.5, fill: "var(--chart-1)", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* My work */}
      <motion.div variants={item} className={cardClass}>
        <h3 className="mb-2 text-sm font-semibold">My work</h3>
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
          <div className="relative h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sprintSummary.myWork.segments}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={62}
                  outerRadius={84}
                  paddingAngle={2}
                  cornerRadius={4}
                  stroke="var(--card)"
                >
                  {sprintSummary.myWork.segments.map((segment, i) => (
                    <Cell key={segment.label} fill={myWorkColors[i % myWorkColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  formatter={(value) => `${Number(value).toLocaleString()} tasks`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tracking-tight tabular-nums">{myWorkTotal.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Total tasks</span>
            </div>
          </div>
          <div className="flex w-full min-w-0 flex-col gap-1 lg:max-w-sm">
            {sprintSummary.myWork.segments.map((segment, i) => (
              <div
                key={segment.label}
                className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/40"
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: myWorkColors[i % myWorkColors.length] }}
                  aria-hidden
                />
                <span className="flex-1 truncate text-xs text-muted-foreground">{segment.label}</span>
                <span className="text-sm font-semibold tabular-nums">{segment.value.toLocaleString()}</span>
                <span className="w-9 text-right text-[11px] text-muted-foreground tabular-nums">
                  {Math.round((segment.value / myWorkTotal) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom row */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cardClass}>
          <h3 className="mb-3 text-sm font-semibold">Recent activity</h3>
          <div className="flex flex-col">
            {activity.map((event) => {
              const actor = memberById(event.actorId);
              return (
                <div
                  key={event.id}
                  className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/40"
                >
                  <UserAvatar member={actor} size="sm" />
                  <p className="min-w-0 flex-1 truncate text-sm">
                    <span className="font-medium">{actor?.name}</span>{" "}
                    <span className="text-muted-foreground">{event.action}</span>{" "}
                    <span className="font-medium">{event.target}</span>
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">{event.at}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="mb-3 text-sm font-semibold">Upcoming deadlines</h3>
          <div className="flex flex-col">
            {deadlines.map((deadline) => (
              <div
                key={deadline.title}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/40"
              >
                <span className={cn("size-2 shrink-0 rounded-full", deadline.dot)} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{deadline.title}</p>
                  <p className="text-xs text-muted-foreground">{deadline.sub}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium">
                  <CalendarDays className="size-3 text-muted-foreground" aria-hidden />
                  {deadline.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
