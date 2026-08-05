"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { projects, memberById } from "@/lib/data";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Star } from "lucide-react";

const statusChip: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success-subtle text-success" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground" },
  deprecated: { label: "Deprecated", className: "bg-danger-subtle text-danger" },
};

export default function AllApplicationsPage() {
  const [favs, setFavs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(projects.map((p) => [p.id, !!p.favourite])),
  );

  return (
    <div className="px-6 py-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold">All applications</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Everything your workspace is building
          </p>
        </div>
        <Button asChild>
          <Link href="/apps/new">
            <Plus className="size-3.5" aria-hidden />
            New application
          </Link>
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => {
          const pct = Math.round((p.tokensUsed / p.tokensAssigned) * 100);
          const overBudget = pct > 90;
          const status = statusChip[p.status];
          const fav = favs[p.id];
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
              whileHover={{ y: -3 }}
              className="relative rounded-xl border bg-card p-4 shadow-elevation-low transition-shadow hover:shadow-elevation-mid"
            >
              <Link
                href={`/apps/${p.slug}/dashboard`}
                className="absolute inset-0 rounded-xl"
                aria-label={`Open ${p.name}`}
              />

              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-sm font-bold text-brand">
                    {p.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <span className="truncate text-sm font-semibold">
                    {p.name}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={
                    fav
                      ? `Remove ${p.name} from favourites`
                      : `Add ${p.name} to favourites`
                  }
                  className="relative z-10 rounded-md p-1 text-muted-foreground transition-colors hover:text-warning"
                  onClick={() =>
                    setFavs((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                  }
                >
                  <Star
                    className={cn(
                      "size-4",
                      fav && "fill-warning text-warning",
                    )}
                    aria-hidden
                  />
                </button>
              </div>

              <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {p.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {p.platform}
                </span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {p.llm}
                </span>
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium",
                    status.className,
                  )}
                >
                  {status.label}
                </span>
              </div>

              <div className="mt-3.5">
                <Progress
                  value={pct}
                  className={cn(
                    "h-1",
                    overBudget && "[&_[data-slot=progress-indicator]]:bg-danger",
                  )}
                />
                <p
                  className={cn(
                    "mt-1.5 text-[11px] tabular-nums",
                    overBudget ? "text-danger" : "text-muted-foreground",
                  )}
                >
                  {p.tokensUsed.toLocaleString()} /{" "}
                  {p.tokensAssigned.toLocaleString()} tokens
                </p>
              </div>

              <div className="mt-3 flex -space-x-2">
                {p.memberIds.map((id) => {
                  const m = memberById(id);
                  return m ? (
                    <UserAvatar key={id} member={m} size="sm" />
                  ) : null;
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
