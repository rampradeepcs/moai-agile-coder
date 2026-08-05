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
  const [panelOpen, setPanelOpen] = useState(true);

  // Hide the projects panel by default on narrow viewports.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setPanelOpen(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="sticky top-0 z-30 flex h-svh shrink-0">
      {/* 1st level — icon rail (collapsible: icons ⇄ icons + labels) */}
      <motion.aside
        animate={{ width: railExpanded ? 184 : 64 }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
        className="flex flex-col overflow-hidden border-r bg-sidebar py-3 text-sidebar-foreground"
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

        {/* Menu — vertically centered */}
        <nav
          aria-label="Main"
          className={cn("flex flex-1 flex-col justify-center gap-1.5", railExpanded ? "px-3" : "items-center px-0")}
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

        <div className={cn("flex flex-col gap-2", railExpanded ? "items-start px-3" : "items-center")}>
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
          {!panelOpen && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Show projects panel"
                  onClick={() => setPanelOpen(true)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
                    railExpanded ? "w-full px-3 py-2 text-[13px]" : "size-10 justify-center",
                  )}
                >
                  <PanelLeftOpen className="size-4.5 shrink-0" />
                  {railExpanded && "Projects panel"}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Show projects panel</TooltipContent>
            </Tooltip>
          )}
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

      {/* 2nd level — projects panel (collapsible) */}
      <AnimatePresence initial={false}>
        {panelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 216, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="overflow-hidden border-r bg-sidebar text-sidebar-foreground"
          >
            <div className="flex h-full w-[216px] flex-col p-4">
              <div className="flex items-center justify-between px-1 pb-3">
                <span className="text-[13px] font-medium">Projects</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Hide projects panel"
                      onClick={() => setPanelOpen(false)}
                      className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                    >
                      <PanelLeftClose className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Hide projects panel</TooltipContent>
                </Tooltip>
              </div>
              <Button asChild className="w-full gap-1.5">
                <Link href="/apps/new">
                  <Plus className="size-4" /> Add new project
                </Link>
              </Button>

              {/* Project list — vertically centered */}
              <nav className="flex flex-1 flex-col justify-center gap-1" aria-label="Projects">
                {projects.map((p) => {
                  const active = pathname.startsWith(`/apps/${p.slug}`);
                  return (
                    <Link
                      key={p.id}
                      href={`/apps/${p.slug}/ai-chat`}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition-all",
                        active
                          ? "bg-background font-medium text-brand shadow-soft ring-1 ring-border"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      )}
                    >
                      <ProjectLogo project={p} size="sm" />
                      <span className="truncate">{p.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
