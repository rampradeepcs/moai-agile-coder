"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  ChevronsLeft,
  ChevronsRight,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { currentUser, projects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/work/user-avatar";
import { ProjectLogo } from "@/components/work/project-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

const railItems = [
  { href: "/apps/new", label: "New project", icon: Sparkles },
  { href: "/apps", label: "Projects", icon: Box },
  { href: "/users", label: "Users", icon: Users },
];

export function AppRail() {
  const pathname = usePathname();
  const [railExpanded, setRailExpanded] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelHovered, setPanelHovered] = useState(false);
  // AI-activity notifications are cleared once the project is visited.
  const [seenActivity, setSeenActivity] = useState<Record<string, boolean>>({});

  // Collapse the projects panel to icons-only on narrow viewports.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setPanelCollapsed(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const projectLink = (p: (typeof projects)[number], withName: boolean) => {
    const active = pathname.startsWith(`/apps/${p.slug}`);
    const activity = !seenActivity[p.id] && !active ? p.aiActivity : undefined;
    const label = activity ? `${p.name} — ${activity.count} AI update${activity.count > 1 ? "s" : ""}: ${activity.message}` : p.name;

    const logoWithBadge = (
      <span className="relative inline-flex shrink-0">
        <ProjectLogo project={p} size="sm" className="rounded-full" />
        {activity && (
          <span className="absolute -right-0.5 -top-0.5 flex size-2.5" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-brand ring-2 ring-sidebar" />
          </span>
        )}
      </span>
    );

    const link = (
      <Link
        key={p.id}
        href={`/apps/${p.slug}/ai-chat`}
        aria-label={label}
        onClick={() => setSeenActivity((prev) => ({ ...prev, [p.id]: true }))}
        className={cn(
          "flex items-center gap-2.5 rounded-xl transition-all",
          withName ? "px-2.5 py-2 text-[13px]" : "justify-center p-1.5",
          active
            ? withName
              ? "bg-background font-medium text-brand shadow-soft ring-1 ring-border"
              : "bg-brand-subtle shadow-soft ring-2 ring-brand"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          !active && activity && withName && "bg-brand-subtle/40",
        )}
      >
        {logoWithBadge}
        {withName && (
          <>
            <span className="truncate">{p.name}</span>
            {activity && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand-subtle px-1.5 py-0.5 text-[10px] font-semibold text-brand animate-pulse-soft">
                <Sparkles className="size-2.5" aria-hidden />
                {activity.count}
              </span>
            )}
          </>
        )}
      </Link>
    );

    if (withName) return link;
    return (
      <Tooltip key={p.id}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="flex max-w-56 flex-col gap-0.5">
          <span className="font-medium">{p.name}</span>
          {activity && <span className="text-[11px] opacity-80">✨ {activity.message}</span>}
        </TooltipContent>
      </Tooltip>
    );
  };

  const expandedPanelContent = (
    <>
      <div className="flex items-center justify-between px-1 pb-3">
        <span className="text-[13px] font-medium">Projects</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Collapse projects panel"
              onClick={() => {
                setPanelCollapsed(true);
                setPanelHovered(false);
              }}
              className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              <PanelLeftClose className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Collapse projects panel</TooltipContent>
        </Tooltip>
      </div>
      <Button asChild className="w-full gap-1.5">
        <Link href="/apps/new">
          <Plus className="size-4" /> Add new project
        </Link>
      </Button>
      {/* Project list — same vertical middle as the rail menu */}
      <nav
        aria-label="Projects"
        className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 flex-col gap-1"
      >
        {projects.map((p) => projectLink(p, true))}
      </nav>
    </>
  );

  return (
    <div className="sticky top-0 z-30 flex h-svh shrink-0">
      {/* 1st level — icon rail */}
      <motion.aside
        animate={{ width: railExpanded ? 184 : 64 }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
        className="relative flex flex-col overflow-hidden border-r bg-sidebar py-3 text-sidebar-foreground"
      >
        <div className={cn("flex items-center gap-2 px-3.5", railExpanded ? "justify-between" : "justify-center")}>
          <Link href="/apps" aria-label="Agile Coder home" className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-elevation-low">
              <Sparkles className="size-4.5" aria-hidden />
            </span>
            <AnimatePresence>
              {railExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  className="truncate text-sm font-semibold tracking-tight"
                >
                  Agile Coder
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Menu — anchored to the exact vertical middle */}
        <nav
          aria-label="Main"
          className={cn(
            "absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-1.5",
            railExpanded ? "px-3" : "items-center",
          )}
        >
          {railItems.map((item) => {
            const active =
              item.href === "/apps"
                ? pathname.startsWith("/apps") && !pathname.startsWith("/apps/new")
                : pathname.startsWith(item.href);
            const link = (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl transition-colors",
                  railExpanded ? "px-3 py-2 text-[13px]" : "size-10 justify-center",
                  active
                    ? "bg-brand-subtle font-medium text-brand shadow-elevation-low"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <item.icon className="size-4.5 shrink-0" aria-hidden />
                {railExpanded && <span className="truncate">{item.label}</span>}
              </Link>
            );
            if (railExpanded) return link;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className={cn("mt-auto flex flex-col gap-2", railExpanded ? "items-start px-3" : "items-center")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={railExpanded ? "Collapse menu" : "Expand menu"}
                aria-expanded={railExpanded}
                onClick={() => setRailExpanded((v) => !v)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
                  railExpanded ? "w-full px-3 py-2 text-[13px]" : "size-10 justify-center",
                )}
              >
                {railExpanded ? <ChevronsLeft className="size-4.5 shrink-0" /> : <ChevronsRight className="size-4.5" />}
                {railExpanded && "Collapse"}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{railExpanded ? "Collapse menu" : "Expand menu"}</TooltipContent>
          </Tooltip>
          <div className={cn("flex items-center gap-2", railExpanded ? "px-1.5" : "flex-col")}>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Account menu" className="rounded-full transition-transform hover:scale-105">
                  <UserAvatar member={currentUser} size="md" showTooltip={false} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{currentUser.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{currentUser.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/users">Workspace settings</Link></DropdownMenuItem>
                <DropdownMenuItem>Email preferences</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" asChild><Link href="/auth/sign-in">Sign out</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.aside>

      {/* 2nd level — projects panel: expanded, or icons-only with hover flyout */}
      <div
        className="relative"
        onMouseEnter={() => setPanelHovered(true)}
        onMouseLeave={() => setPanelHovered(false)}
      >
        <motion.aside
          animate={{ width: panelCollapsed ? 60 : 216 }}
          transition={{ type: "spring", stiffness: 380, damping: 36 }}
          className="relative h-full overflow-hidden border-r bg-sidebar text-sidebar-foreground"
        >
          {panelCollapsed ? (
            <div className="flex h-full w-[60px] flex-col items-center py-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Expand projects panel"
                    onClick={() => setPanelCollapsed(false)}
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                  >
                    <PanelLeftOpen className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand projects panel</TooltipContent>
              </Tooltip>
              {/* Icons only — same vertical middle as the rail menu */}
              <nav
                aria-label="Projects"
                className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2"
              >
                {projects.map((p) => projectLink(p, false))}
              </nav>
            </div>
          ) : (
            <div className="relative h-full w-[216px] p-4">{expandedPanelContent}</div>
          )}
        </motion.aside>

        {/* Hover flyout over the collapsed strip */}
        <AnimatePresence>
          {panelCollapsed && panelHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="absolute inset-y-0 left-0 z-40 w-[216px] border-r bg-sidebar p-4 text-sidebar-foreground shadow-elevation-high"
            >
              <div className="flex items-center justify-between px-1 pb-3">
                <span className="text-[13px] font-medium">Projects</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Pin projects panel open"
                      onClick={() => {
                        setPanelCollapsed(false);
                        setPanelHovered(false);
                      }}
                      className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                    >
                      <PanelLeftOpen className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Pin open</TooltipContent>
                </Tooltip>
              </div>
              <Button asChild className="w-full gap-1.5">
                <Link href="/apps/new">
                  <Plus className="size-4" /> Add new project
                </Link>
              </Button>
              <nav
                aria-label="Projects"
                className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 flex-col gap-1"
              >
                {projects.map((p) => projectLink(p, true))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
