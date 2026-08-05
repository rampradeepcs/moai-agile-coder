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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tokenStats } from "@/lib/data";
import {
  axisTick,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from "./chart-style";

/* ————— animation ————— */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
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
  { label: "Usage", value: `${tokenStats.usagePct}%` },
];

const TOTAL_USED_ALL_USERS = 98200;

const cardClass = "rounded-xl border bg-card p-5 shadow-elevation-low";

/* ————— view ————— */

export function TokensView() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 lg:grid-cols-2">
      {/* Token balance overview */}
      <motion.div variants={item} className={`${cardClass} lg:col-span-2`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Token balance overview</h3>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Last 7 days
            <ChevronDown className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <span className="text-4xl font-semibold tracking-tight tabular-nums">
            {tokenStats.assigned.toLocaleString()}
          </span>
          <div className="h-14 w-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="balanceSparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.3} />
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
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {balanceCells.map((cell) => (
            <div key={cell.label} className="flex flex-col gap-1 rounded-lg border bg-surface p-3">
              <span className="text-xs text-muted-foreground">{cell.label}</span>
              <span className="text-lg font-semibold tabular-nums">{cell.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Usage breakdown */}
      <motion.div variants={item} className={cardClass}>
        <h3 className="mb-2 text-sm font-semibold">Usage breakdown</h3>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="relative h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
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
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  formatter={(value) => `${Number(value).toLocaleString()} tokens`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex min-w-48 flex-col gap-2">
            {tokenStats.breakdown.map((entry, i) => (
              <span key={entry.label} className="inline-flex items-center gap-1.5 text-xs">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: chartColors[i % chartColors.length] }}
                  aria-hidden
                />
                <span className="text-muted-foreground">{entry.label}:</span>
                <span className="font-medium tabular-nums">{entry.value.toLocaleString()} tokens</span>
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tokenStats.breakdown.map((entry) => (
            <div key={entry.label} className="flex flex-col gap-0.5 rounded-lg border bg-surface p-3">
              <span className="truncate text-xs text-muted-foreground">{entry.label}</span>
              <span className="text-sm font-semibold tabular-nums">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* User usage breakdown */}
      <motion.div variants={item} className={cardClass}>
        <h3 className="mb-2 text-sm font-semibold">User usage breakdown</h3>
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
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
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  formatter={(value) => `${Number(value).toLocaleString()} tokens`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold tabular-nums">
                {TOTAL_USED_ALL_USERS.toLocaleString()}
              </span>
              <span className="max-w-24 text-center text-[10px] leading-tight text-muted-foreground">
                Total tokens used
              </span>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
            {tokenStats.byUser.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ background: chartColors[i % chartColors.length] }}
                  aria-hidden
                />
                <span className="flex-1 truncate text-xs text-muted-foreground">{entry.name}</span>
                <span className="text-xs font-semibold tabular-nums">{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Token usage trend */}
      <motion.div variants={item} className={`${cardClass} lg:col-span-2`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold">Token usage trend</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-subtle px-2 py-0.5 text-[11px] font-medium text-success">
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
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tokenStats.trend} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
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
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Module usage breakdown */}
      <motion.div variants={item} className={`${cardClass} lg:col-span-2`}>
        <h3 className="mb-3 text-sm font-semibold">Module usage breakdown</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs text-muted-foreground">Module</TableHead>
              <TableHead className="text-xs text-muted-foreground">LLM model</TableHead>
              <TableHead className="text-right text-xs text-muted-foreground">Tokens</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokenStats.byModule.map((row) => (
              <TableRow key={row.module}>
                <TableCell className="font-medium text-brand">{row.module}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{row.llm}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {row.tokens.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
