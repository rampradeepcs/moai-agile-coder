"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BadgeCheck, Coins, CreditCard, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { creditBalance, creditHistory, creditPacks, currentPlan } from "@/lib/workspace-data";
import { GlobalHeader } from "@/components/shell/global-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CUSTOM_STEP = 25000;
const CUSTOM_RATE = 0.45; // $ per 1k credits on custom amounts

export default function CreditsPage() {
  const [selectedPack, setSelectedPack] = useState<string>("pack-150");
  const [custom, setCustom] = useState(0);
  const [purchased, setPurchased] = useState(false);

  const pack = creditPacks.find((p) => p.id === selectedPack);
  const credits = custom > 0 ? custom : (pack?.credits ?? 0);
  const price = custom > 0 ? Math.round(custom * (CUSTOM_RATE / 1000)) : (pack?.price ?? 0);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-6">
      <GlobalHeader
        title="Add credits"
        description="Top up your workspace when the monthly allowance isn't enough."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/usage">View usage</Link>
          </Button>
        }
      />

      {/* Balance strip */}
      <section className="flex flex-wrap items-center gap-4 rounded-xl bg-card p-5 shadow-soft">
        <span className="grid size-10 place-items-center rounded-lg bg-brand-subtle text-brand">
          <Coins className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold tabular-nums tracking-tight">
            {creditBalance.remaining.toLocaleString()} credits left
          </p>
          <p className="text-xs text-muted-foreground">
            Plan includes {currentPlan.includedCredits.toLocaleString()} / month · refreshes {creditBalance.refreshOn}
          </p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* Packs */}
          <section>
            <h2 className="mb-3 text-sm font-semibold">Credit packs</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {creditPacks.map((p) => {
                const active = custom === 0 && p.id === selectedPack;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPack(p.id);
                      setCustom(0);
                    }}
                    className={cn(
                      "relative flex flex-col items-start gap-1 rounded-xl bg-card p-4 text-left shadow-soft transition-colors",
                      active ? "ring-2 ring-brand/60" : "hover:bg-accent/40",
                    )}
                  >
                    {"popular" in p && p.popular && (
                      <span className="absolute -top-2 right-3 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
                        Most popular
                      </span>
                    )}
                    <span className="text-lg font-semibold tabular-nums tracking-tight">
                      {(p.credits / 1000).toLocaleString()}k
                    </span>
                    <span className="text-xs text-muted-foreground">credits</span>
                    <span className="mt-2 text-sm font-medium">${p.price}</span>
                    <span className="text-[11px] text-muted-foreground">${p.perK.toFixed(2)} per 1k</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Custom amount */}
          <section className="rounded-xl bg-card p-5 shadow-soft">
            <h2 className="mb-1 text-sm font-semibold">Custom amount</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Need something in between? Adjust in steps of {CUSTOM_STEP.toLocaleString()}.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Decrease credits"
                disabled={custom === 0}
                onClick={() => setCustom((c) => Math.max(0, c - CUSTOM_STEP))}
              >
                <Minus />
              </Button>
              <span className="min-w-28 text-center text-xl font-semibold tabular-nums tracking-tight">
                {custom === 0 ? "—" : custom.toLocaleString()}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Increase credits"
                onClick={() => setCustom((c) => c + CUSTOM_STEP)}
              >
                <Plus />
              </Button>
              {custom > 0 && (
                <button
                  type="button"
                  className="ml-auto text-xs font-medium text-brand hover:underline"
                  onClick={() => setCustom(0)}
                >
                  Back to packs
                </button>
              )}
            </div>
          </section>

          {/* Recent credit history */}
          <section className="rounded-xl bg-card p-5 shadow-soft">
            <h2 className="mb-3 text-sm font-semibold">Recent activity</h2>
            <ul className="flex flex-col divide-y">
              {creditHistory.map((h) => (
                <li key={h.date + h.label} className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{h.label}</p>
                    <p className="text-[11px] text-muted-foreground">{h.date}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 tabular-nums font-medium",
                      h.amount > 0 ? "text-success" : "text-muted-foreground",
                    )}
                  >
                    {h.amount > 0 ? "+" : ""}
                    {h.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Order summary */}
        <aside className="flex h-fit flex-col gap-4 rounded-xl bg-card p-5 shadow-soft lg:sticky lg:top-6">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <dl className="flex flex-col gap-2 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Credits</dt>
              <dd className="font-medium tabular-nums">{credits.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Rate</dt>
              <dd className="tabular-nums text-muted-foreground">
                ${custom > 0 ? CUSTOM_RATE.toFixed(2) : pack?.perK.toFixed(2)} / 1k
              </dd>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm">
              <dt className="font-medium">Total</dt>
              <dd className="font-semibold tabular-nums">${price}</dd>
            </div>
          </dl>
          <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
            <CreditCard className="size-4 shrink-0" aria-hidden />
            {currentPlan.paymentMethod.brand} ending {currentPlan.paymentMethod.last4}
          </div>
          <Button disabled={credits === 0} onClick={() => setPurchased(true)}>
            Purchase {credits > 0 ? `${(credits / 1000).toLocaleString()}k credits` : ""}
          </Button>
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            Purchased credits never expire and are consumed after your monthly allowance.
          </p>
        </aside>
      </div>

      {/* Success dialog */}
      <Dialog
        open={purchased}
        onOpenChange={(open) => {
          setPurchased(open);
          if (!open) toast.success(`${credits.toLocaleString()} credits added to your balance`);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="items-center text-center">
            <span className="mb-2 grid size-12 place-items-center rounded-full bg-success-subtle text-success">
              <BadgeCheck className="size-6" aria-hidden />
            </span>
            <DialogTitle>Purchase complete</DialogTitle>
            <DialogDescription>
              {credits.toLocaleString()} credits were added to your workspace. A receipt was sent to your
              billing email.
            </DialogDescription>
          </DialogHeader>
          <Button className="mt-2" onClick={() => setPurchased(false)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
