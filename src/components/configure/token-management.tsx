"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  Cell,
  Pie,
  PieChart,
} from "recharts";
import { ArrowLeft, CheckCircle2, Plus, Printer } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { tokenStats, projects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartFrame, ChartTooltip, panelClasses } from "@/components/shared";

/* ————— constants ————— */

const TOKENS_USED = 98280;
const TOKENS_ASSIGNED = 100000;
const TOTAL_USED_ALL_USERS = 98200;
const TOTAL_AVAILABLE_BALANCE = 235000;
const WEEK_BUDGET = 12000;
const DAY_BUDGET = 2000;

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

const quickPicks = [
  { label: "25k", value: 25000 },
  { label: "50k", value: 50000 },
  { label: "100k", value: 100000 },
  { label: "250k", value: 250000 },
];

/* ————— animation ————— */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/* ————— pieces ————— */

function Meter({
  label,
  value,
  max,
  showMax,
  danger,
}: {
  label: string;
  value: number;
  max: number;
  showMax?: boolean;
  danger?: boolean;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex min-w-40 flex-1 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("text-xs font-semibold tabular-nums", danger && "text-danger")}>
          {value.toLocaleString()}
          {showMax && (
            <span className="font-normal text-muted-foreground">
              {" "}/ {max.toLocaleString()}
            </span>
          )}
        </span>
      </div>
      <Progress
        value={pct}
        aria-label={label}
        className={cn(
          "h-1.5 w-full",
          danger
            ? "[&>[data-slot=progress-indicator]]:bg-danger"
            : "[&>[data-slot=progress-indicator]]:bg-brand",
        )}
      />
    </div>
  );
}

/* ————— view ————— */

export function TokenManagement({ onBack }: { onBack: () => void }) {
  const params = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === params.slug) ?? projects[0];
  const [available, setAvailable] = useState(project.tokensAssigned - project.tokensUsed);

  // Add-tokens flow
  const [addOpen, setAddOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [added, setAdded] = useState(false);

  const parsedAmount = Number(amount.replace(/[^0-9]/g, "")) || 0;

  const openAdd = () => {
    setAmount("");
    setAddOpen(true);
  };

  const proceedToOtp = () => {
    if (parsedAmount <= 0) {
      toast.error("Enter a token count to add.");
      return;
    }
    setAddOpen(false);
    setOtp("");
    setAdded(false);
    setOtpOpen(true);
  };

  const verifyOtp = () => {
    if (otp.length < 4) return;
    setAvailable((v) => v + parsedAmount);
    setAdded(true);
    toast.success(`${parsedAmount.toLocaleString()} tokens added to Paw care`);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Token Management
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast("Usage summary exported")}
          >
            <Printer className="size-3.5" aria-hidden />
            Export summary
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus className="size-3.5" aria-hidden />
            Add tokens
          </Button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
        {/* Hero + meters */}
        <motion.div variants={item} className={panelClasses({ padding: "lg", elevation: "soft" })}>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div className="flex flex-col gap-1">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">
                {available.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">available tokens</span>
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-3">
              <Meter
                label="Tokens used"
                value={TOKENS_USED}
                max={TOKENS_ASSIGNED}
                showMax
                danger={TOKENS_USED / TOKENS_ASSIGNED > 0.9}
              />
              <Meter label="This week" value={tokenStats.thisWeek} max={WEEK_BUDGET} />
              <Meter label="Today's usage" value={tokenStats.today} max={DAY_BUDGET} />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Module usage breakdown */}
          <motion.div variants={item} className={panelClasses({ elevation: "soft" })}>
            <h3 className="mb-3 text-sm font-semibold">Module Usage Breakdown</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs text-muted-foreground">Module</TableHead>
                  <TableHead className="text-xs text-muted-foreground">LLM Model</TableHead>
                  <TableHead className="text-right text-xs text-muted-foreground">Tokens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenStats.byModule.map((row) => (
                  <TableRow key={row.module}>
                    <TableCell className="font-medium text-brand">{row.module}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.llm}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {row.tokens.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* User usage breakdown */}
          <motion.div variants={item} className={panelClasses({ elevation: "soft" })}>
            <h3 className="mb-2 text-sm font-semibold">User Usage Breakdown</h3>
            <div className="flex flex-col items-center gap-5">
              <div className="relative h-52 w-52">
                <ChartFrame height={208}>
                  <PieChart>
                    <Pie
                      data={tokenStats.byUser}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={66}
                      outerRadius={90}
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
                  <span className="text-xl font-semibold tabular-nums">
                    {TOTAL_USED_ALL_USERS.toLocaleString()}
                  </span>
                  <span className="max-w-24 text-center text-[10px] leading-tight text-muted-foreground">
                    Total tokens used
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {tokenStats.byUser.map((entry, i) => (
                  <span key={entry.name} className="inline-flex items-center gap-1.5 text-xs">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: chartColors[i % chartColors.length] }}
                      aria-hidden
                    />
                    <span className="text-muted-foreground">{entry.name}</span>
                    <span className="font-semibold tabular-nums">{entry.value.toLocaleString()}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Add tokens dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <DialogTitle>Add tokens</DialogTitle>
              <span className="inline-flex items-center rounded-md bg-success-subtle px-2.5 py-1 text-[11px] font-medium text-success">
                Total available balance: {TOTAL_AVAILABLE_BALANCE.toLocaleString()}
              </span>
            </div>
            <DialogDescription>
              Allocate additional AI tokens to this project from your workspace balance.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="token-count" className="text-xs text-muted-foreground">
                Token count<span className="text-danger">*</span>
              </Label>
              <Input
                id="token-count"
                inputMode="numeric"
                placeholder="e.g. 50,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {quickPicks.map((q) => {
                const selected = parsedAmount === q.value;
                return (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => setAmount(String(q.value))}
                    className={cn(
                      "rounded-lg border px-3 py-1 text-xs font-medium transition-colors",
                      selected
                        ? "bg-brand-subtle text-brand ring-1 ring-brand"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={proceedToOtp}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP verification dialog */}
      <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
        <DialogContent className="sm:max-w-md">
          {added ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="size-12 text-success" aria-hidden />
              <DialogTitle>Tokens added!</DialogTitle>
              <DialogDescription>
                {parsedAmount.toLocaleString()} tokens were added to Paw care
              </DialogDescription>
              <Button className="mt-2" onClick={() => setOtpOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Verify with OTP</DialogTitle>
                <DialogDescription>
                  We&apos;ve sent a verification code to venkat@moaiconsulting.co.in
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center py-3">
                <InputOTP maxLength={4} value={otp} onChange={setOtp} aria-label="One-time passcode">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOtpOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={otp.length < 4} onClick={verifyOtp}>
                  Verify
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
