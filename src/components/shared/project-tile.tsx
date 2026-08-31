"use client";

import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { ProjectLogo } from "@/components/work/project-logo";
import { ActiveMembers } from "@/components/work/active-members";
import { panelClasses } from "./panel";

/* --------------------------------------------------------------- sub-parts */

const statusStyles: Record<Project["status"], string> = {
  active: "bg-success-subtle text-success",
  inactive: "bg-muted text-muted-foreground",
  deprecated: "bg-danger-subtle text-danger",
};

export interface ProjectStatusBadgeProps
  extends React.ComponentPropsWithoutRef<"span"> {
  status: Project["status"];
  className?: string;
}

/**
 * Project lifecycle chip. The dashboard previously only handled `active` and
 * lumped `deprecated` in with `inactive`; all three now read distinctly.
 */
export function ProjectStatusBadge({
  status,
  className,
  ...props
}: ProjectStatusBadgeProps) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
        statusStyles[status],
        className,
      )}
      {...props}
    >
      {status}
    </span>
  );
}

export interface CreditsMeterProps
  extends React.ComponentPropsWithoutRef<"div"> {
  used: number;
  assigned: number;
  /** Percentage above which the bar turns red. */
  dangerThreshold?: number;
  /** `"split"` puts the label above the bar, `"below"` puts it under. */
  labelPlacement?: "split" | "below";
  className?: string;
}

/** Credit consumption bar with the shared over-budget threshold. */
export function CreditsMeter({
  used,
  assigned,
  dangerThreshold = 90,
  labelPlacement = "split",
  className,
  ...props
}: CreditsMeterProps) {
  const pct = assigned > 0 ? Math.min(100, Math.round((used / assigned) * 100)) : 0;
  const overBudget = pct > dangerThreshold;

  const amounts = `${used.toLocaleString()} / ${assigned.toLocaleString()}`;

  const bar = (
    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full", overBudget ? "bg-danger" : "bg-brand")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {labelPlacement === "split" ? (
        <>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Credits</span>
            <span className={cn("tabular-nums", overBudget && "text-danger")}>
              {amounts}
            </span>
          </div>
          {bar}
        </>
      ) : (
        <>
          {bar}
          <p
            className={cn(
              "text-[11px] tabular-nums",
              overBudget ? "text-danger" : "text-muted-foreground",
            )}
          >
            {amounts} tokens
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- tile */

export interface ProjectTileProps {
  project: Project;
  /** Where the tile navigates. Defaults to the project's dashboard. */
  href?: string;
  /**
   * `compact` shows the platform as a subtitle (workspace dashboard).
   * `detailed` shows platform and model chips (all applications).
   */
  variant?: "compact" | "detailed";
  /** Renders the favourite toggle in the top-right. */
  favourite?: boolean;
  onFavouriteChange?: (next: boolean) => void;
  className?: string;
}

/**
 * Project summary card — logo, name, status, description, team and credits.
 * The workspace dashboard and the applications grid each had their own copy of
 * this, which had drifted in status colours, progress bar and hover treatment.
 */
export function ProjectTile({
  project,
  href,
  variant = "compact",
  favourite,
  onFavouriteChange,
  className,
}: ProjectTileProps) {
  const target = href ?? `/apps/${project.slug}/dashboard`;
  const showFavourite = favourite !== undefined;

  return (
    <div
      className={panelClasses({
        padding: "md",
        elevation: "soft",
        className: cn(
          "relative flex h-full flex-col gap-3 transition-shadow hover:shadow-elevation-mid",
          className,
        ),
      })}
    >
      {/* Full-tile hit area; interactive children sit above it via z-10. */}
      <Link
        href={target}
        className="absolute inset-0 rounded-xl"
        aria-label={`Open ${project.name}`}
      />

      <div className="flex items-start gap-3">
        <ProjectLogo
          project={project}
          size={variant === "detailed" ? "lg" : "md"}
          className="rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{project.name}</p>
          {variant === "compact" && (
            <p className="truncate text-xs text-muted-foreground">
              {project.platform}
            </p>
          )}
        </div>

        {showFavourite ? (
          <button
            type="button"
            aria-label={
              favourite
                ? `Remove ${project.name} from favourites`
                : `Add ${project.name} to favourites`
            }
            aria-pressed={favourite}
            onClick={() => onFavouriteChange?.(!favourite)}
            className="relative z-10 -mt-1 -mr-1 rounded-md p-1 text-muted-foreground transition-colors hover:text-warning"
          >
            <Star
              className={cn("size-4", favourite && "fill-warning text-warning")}
              aria-hidden
            />
          </button>
        ) : (
          <ProjectStatusBadge status={project.status} />
        )}
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      {variant === "detailed" && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
            {project.platform}
          </span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
            {project.llm}
          </span>
          <ProjectStatusBadge status={project.status} className="ml-auto" />
        </div>
      )}

      <ActiveMembers project={project} className="relative z-10" />

      <CreditsMeter
        used={project.tokensUsed}
        assigned={project.tokensAssigned}
        labelPlacement={variant === "detailed" ? "below" : "split"}
        className="mt-auto"
      />
    </div>
  );
}
