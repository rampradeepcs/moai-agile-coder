"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, CreditCard, Download, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { creditBalance, currentPlan, invoices, plans } from "@/lib/workspace-data";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SubscriptionPage() {
  const [yearly, setYearly] = useState(false);
  const usedPct = Math.round((creditBalance.used / creditBalance.total) * 100);
  const seatPct = Math.round((currentPlan.seats / currentPlan.seatLimit) * 100);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-6">
      <PageHeader
        title="Subscription"
        description="Your plan, billing and invoices."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/credits">Buy credits</Link>
          </Button>
        }
      />

      {/* Current plan */}
      <section className="grid gap-4 rounded-xl bg-card p-6 shadow-soft md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="text-lg font-semibold">{currentPlan.name} plan</span>
            <span className="rounded-md bg-brand-subtle px-2 py-0.5 text-[11px] font-medium text-brand">
              Current
            </span>
          </span>
          <p className="text-[13px] text-muted-foreground">
            ${currentPlan.monthlyPrice}/month · renews {currentPlan.renewsOn}
          </p>
          <p className="mt-2 flex items-center gap-2 text-[13px] text-muted-foreground">
            <CreditCard className="size-4" aria-hidden />
            {currentPlan.paymentMethod.brand} ending {currentPlan.paymentMethod.last4}
            <button
              type="button"
              className="font-medium text-brand hover:underline"
              onClick={() => toast("Payment methods are managed by your billing admin.")}
            >
              Update
            </button>
          </p>
        </div>
        <PlanMeter
          label="Monthly credits"
          detail={`${creditBalance.used.toLocaleString()} of ${creditBalance.total.toLocaleString()} used`}
          pct={usedPct}
          warn={usedPct > 85}
        />
        <PlanMeter
          label="Seats"
          detail={`${currentPlan.seats} of ${currentPlan.seatLimit} in use`}
          pct={seatPct}
          warn={false}
        />
      </section>

      {/* Plans */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Plans</h2>
          <div className="inline-flex items-center rounded-lg bg-muted p-1 text-xs font-medium">
            {(["Monthly", "Yearly"] as const).map((label) => {
              const active = yearly === (label === "Yearly");
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setYearly(label === "Yearly")}
                  className={cn(
                    "rounded-md px-3 py-1.5 transition-colors",
                    active ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                  {label === "Yearly" && <span className={cn("ml-1", active ? "text-white/80" : "text-success")}>−20%</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan.id;
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col gap-4 rounded-xl bg-card p-5 shadow-soft",
                  isCurrent && "ring-2 ring-brand/60",
                )}
              >
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {plan.name}
                    {plan.id === "pro" && <Sparkles className="size-3.5 text-brand" aria-hidden />}
                  </p>
                  <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight">
                  {price === null ? (
                    "Custom"
                  ) : price === 0 ? (
                    "Free"
                  ) : (
                    <>
                      ${price}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </>
                  )}
                </p>
                <p className="text-xs font-medium text-brand">{plan.credits}</p>
                <ul className="flex flex-1 flex-col gap-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent}
                  onClick={() =>
                    toast(
                      plan.id === "enterprise"
                        ? "Our sales team will reach out shortly."
                        : `Switched to ${plan.name} — takes effect next cycle.`,
                    )
                  }
                >
                  {isCurrent ? "Current plan" : plan.id === "enterprise" ? "Contact sales" : `Switch to ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Invoices */}
      <section className="rounded-xl bg-card p-5 shadow-soft">
        <h2 className="mb-3 text-sm font-semibold">Invoices</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Billing period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.id}</TableCell>
                <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                <TableCell className="text-muted-foreground">{inv.period}</TableCell>
                <TableCell className="tabular-nums">${inv.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
                      inv.status === "paid"
                        ? "bg-success-subtle text-success"
                        : "bg-warning-subtle text-warning",
                    )}
                  >
                    {inv.status}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    aria-label={`Download ${inv.id}`}
                    className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => toast.success(`${inv.id}.pdf downloaded`)}
                  >
                    <Download className="size-3.5" aria-hidden />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

function PlanMeter({
  label,
  detail,
  pct,
  warn,
}: {
  label: string;
  detail: string;
  pct: number;
  warn: boolean;
}) {
  return (
    <div className="flex flex-col justify-center gap-1.5 rounded-lg bg-muted/60 p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className={cn("tabular-nums", warn ? "font-medium text-danger" : "text-muted-foreground")}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-background">
        <div
          className={cn("h-full rounded-full", warn ? "bg-danger" : "bg-brand")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground">{detail}</p>
    </div>
  );
}
