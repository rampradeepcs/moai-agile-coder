"use client";

import { motion, type Variants } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceDot,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tokenStats } from "@/lib/data";
import { ChartFrame, ChartTooltip, axisTick, gridProps } from "@/components/shared";

/* ————— animation ————— */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

/* ————— derived data ————— */

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

// Invented 7-day sparkline for the balance overview
const sparkline = [
  { day: "Mon", value: 4200 },
  { day: "Tue", value: 5100 },
  { day: "Wed", value: 4800 },
  { day: "Thu", value: 6200 },
  { day: "Fri", value: 5900 },
  { day: "Sat", value: 7100 },
  { day: "Sun", value: 8300 },
];

const balanceCells = [
  { label: "Tokens assigned to this project", value: tokenStats.assigned.toLocaleString() },
  { label: "Total used", value: tokenStats.totalUsed.toLocaleString() },
  { label: "Remaining", value: tokenStats.remaining.toLocaleString() },
  { label: "Usage", value: `${tokenStats.usagePct}%`, pct: tokenStats.usagePct },
];

const breakdownTotal = tokenStats.breakdown.reduce((sum, entry) => sum + entry.value, 0);
const byUserTotal = tokenStats.byUser.reduce((sum, entry) => sum + entry.value, 0);

const TOTAL_USED_ALL_USERS = 98200;

const cardClass = "rounded-xl bg-card p-5 shadow-soft";

/** Shared donut legend row — dot, label, value + percentage right-aligned. */
function LegendRow({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/40">
      <span className="size-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
      <span className="flex-1 truncate text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value.toLocaleString()}</span>
      <span className="w-9 shrink-0 text-right text-[11px] text-muted-foreground tabular-nums">{pct}%</span>
    </div>
  );
}

/* ————— view ————— */

export function TokensView() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
      {/* Token balance overview */}
      <motion.div variants={item} className={`${cardClass} xl:col-span-2`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Token balance overview</h3>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-surface px-3 py-1 text-xs font-medium text-muted-foreground shadow-elevation-low transition-colors hover:text-foreground"
          >
            Last 7 days
            <ChevronDown className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-col">
            <span className="text-brand-gradient text-4xl font-bold tracking-tight tabular-nums">
              {tokenStats.assigned.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">Available tokens</span>
          </div>
          <ChartFrame height={56} className="w-36">
              <AreaChart data={sparkline} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="balanceSparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="value"
                  stroke="var(--success)"
                  strokeWidth={2}
                  fill="url(#balanceSparkFill)"
                  dot={false}
                />
              </AreaChart>
            </ChartFrame>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {balanceCells.map((cell) => (
            <div key={cell.label} className="flex flex-col gap-1 rounded-xl bg-surface p-3">
              <span className="text-xs text-muted-foreground">{cell.label}</span>
              <span className="text-lg font-semibold tabular-nums">{cell.value}</span>
              {cell.pct !== undefined && (
                <Progress
                  value={cell.pct}
                  className="mt-1 h-1.5 w-full [&>[data-slot=progress-indicator]]:bg-brand"
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Usage breakdown */}
      <motion.div variants={item} className={`${cardClass} min-w-0`}>
        <h3 className="mb-2 text-sm font-semibold">Usage breakdown</h3>
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8">
          <div className="relative h-44 w-44 shrink-0">
            <ChartFrame height={176}>
              <PieChart>
                <Pie
                  data={tokenStats.breakdown}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={56}
                  outerRadius={78}
                  paddingAngle={2}
                  cornerRadius={4}
                  stroke="var(--card)"
                >
                  {tokenStats.breakdown.map((entry, i) => (
                    <Cell key={entry.label} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  formatter={(value) => `${Number(value).toLocaleString()} tokens`}
                />
              </PieChart>
            </ChartFrame>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold tracking-tight tabular-nums">
                {breakdownTotal.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground">Tokens used</span>
            </div>
          </div>
          <div className="flex w-full min-w-0 flex-1 flex-col gap-1">
            {tokenStats.breakdown.map((entry, i) => (
              <LegendRow
                key={entry.label}
                label={entry.label}
                value={entry.value}
                pct={Math.round((entry.value / breakdownTotal) * 100)}
                color={chartColors[i % chartColors.length]}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* User usage breakdown */}
      <motion.div variants={item} className={`${cardClass} min-w-0`}>
        <h3 className="mb-2 text-sm font-semibold">User usage breakdown</h3>
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-48 w-48">
            <ChartFrame height={192}>
              <PieChart>
                <Pie
                  data={tokenStats.byUser}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={84}
                  paddingAngle={2}
                  cornerRadius={4}
                  stroke="var(--card)"
                >
                  {tokenStats.byUser.map((entry, i) => (
                    <Cell key={entry.name} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  formatter={(value) => `${Number(value).toLocaleString()} tokens`}
                />
              </PieChart>
            </ChartFrame>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold tracking-tight tabular-nums">
                {TOTAL_USED_ALL_USERS.toLocaleString()}
              </span>
              <span className="max-w-24 text-center text-[10px] leading-tight text-muted-foreground">
                Total tokens used
              </span>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-6">
            {tokenStats.byUser.map((entry, i) => (
              <LegendRow
                key={entry.name}
                label={entry.name}
                value={entry.value}
                pct={Math.round((entry.value / byUserTotal) * 100)}
                color={chartColors[i % chartColors.length]}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Token usage trend */}
      <motion.div variants={item} className={`${cardClass} min-w-0 overflow-hidden xl:col-span-2`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-sm font-semibold">Token usage trend</h3>
            <span className="inline-flex items-center gap-1 rounded-md bg-success-subtle px-2 py-0.5 text-[11px] font-medium text-success">
              <TrendingUp className="size-3" aria-hidden />
              +15% compared to last month
            </span>
          </div>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="all">All time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ChartFrame height={260}>
            <AreaChart data={tokenStats.trend} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <ChartTooltip
                formatter={(value) => [`${Number(value).toLocaleString()} tokens`, "Usage"]}
              />
              <Area
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#trendFill)"
                dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <ReferenceDot
                x="May"
                y={12597}
                r={5}
                fill="var(--chart-1)"
                stroke="var(--card)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartFrame>
      </motion.div>

      {/* Module usage breakdown */}
      <motion.div variants={item} className={`${cardClass} min-w-0 xl:col-span-2`}>
        <h3 className="mb-3 text-sm font-semibold">Module usage breakdown</h3>
        <div className="scrollbar-thin -mx-2 overflow-x-auto px-2">
          <Table className="min-w-[480px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-muted-foreground">Module</TableHead>
                <TableHead className="text-xs text-muted-foreground">LLM model</TableHead>
                <TableHead className="text-right text-xs text-muted-foreground">Tokens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenStats.byModule.map((row) => (
                <TableRow key={row.module} className="transition-colors hover:bg-accent/30">
                  <TableCell className="font-medium whitespace-nowrap text-brand">{row.module}</TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                    {row.llm}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {row.tokens.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </motion.div>
  );
}
