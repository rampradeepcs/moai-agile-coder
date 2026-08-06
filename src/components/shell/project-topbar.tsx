"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Flame,
  Kanban,
  LayoutDashboard,
  ListTodo,
  Play,
  Search,
  Settings2,
  Share2,
  Sparkles,
  UserPlus,
  Users2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { memberById, pipelines } from "@/lib/data";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/work/user-avatar";
import { NotificationsPopover } from "./notifications-popover";

const tabs = [
  { segment: "ai-chat", label: "AI chat", icon: Sparkles },
  { segment: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { segment: "backlog", label: "Backlog", icon: ListTodo },
  { segment: "kanban", label: "Kanban", icon: Kanban },
  { segment: "configure", label: "Configure", icon: Settings2 },
];

function CircleAction({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="grid size-9 place-items-center rounded-full border bg-card text-muted-foreground shadow-soft transition-all hover:-translate-y-px hover:text-foreground"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function ProjectTopbar({ project }: { project: Project }) {
  const pathname = usePathname();
  const memberList = project.memberIds.map(memberById).filter(Boolean).slice(0, 3);
  const extra = project.memberIds.length + 18 - memberList.length;
  const tokensLeft = project.tokensAssigned - project.tokensUsed + 19264;

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-4 bg-background/90 px-6 pb-4 pt-4 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-brand hover:text-brand/80">
                  <Link href="/apps">Projects</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="truncate text-2xl font-bold tracking-tight">{project.name}</h1>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users2 className="size-3.5" aria-hidden />
              {pipelines.length} active teams
            </span>
            <span className="hidden items-center -space-x-2 md:flex">
              {memberList.map((m) => (
                <UserAvatar key={m!.id} member={m} size="sm" className="ring-2 ring-background" />
              ))}
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-muted px-1 text-[10px] font-semibold text-muted-foreground ring-2 ring-background">
                +{extra}
              </span>
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <CircleAction
            label="Search (⌘K)"
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          >
            <Search className="size-4" aria-hidden />
          </CircleAction>
          <CircleAction label="Share" onClick={() => toast.success("Share link copied to clipboard")}>
            <Share2 className="size-4" aria-hidden />
          </CircleAction>
          <CircleAction label="Invite people" onClick={() => toast("Invite sent", { description: "Your teammates will get an email invite." })}>
            <UserPlus className="size-4" aria-hidden />
          </CircleAction>
          <NotificationsPopover />
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex h-9 items-center gap-1.5 rounded-full border bg-card px-3 text-[13px] font-semibold shadow-soft">
                <Flame className="size-4 text-brand" aria-hidden />
                {tokensLeft.toLocaleString()}
              </span>
            </TooltipTrigger>
            <TooltipContent>AI tokens remaining</TooltipContent>
          </Tooltip>
          <Button
            className="gap-1.5 rounded-full bg-brand-gradient text-white shadow-elevation-mid transition-transform hover:-translate-y-px hover:opacity-95"
            onClick={() => toast("Starting application…", { description: "AI agents are picking up the next stage." })}
          >
            <Play className="size-3.5 fill-current" /> Start application
          </Button>
        </div>
      </div>

      <nav
        aria-label="Project sections"
        className="inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-2xl border bg-card p-1 shadow-soft"
      >
        {tabs.map((tab) => {
          const href = `/apps/${project.slug}/${tab.segment}`;
          const active = pathname.startsWith(href);
          return (
            <Link
              key={tab.segment}
              href={href}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors",
                active ? "text-brand" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="project-tab-pill"
                  className="absolute inset-0 rounded-xl bg-background shadow-soft ring-1 ring-border"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <tab.icon className="relative size-3.5" aria-hidden />
              <span className="relative">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
