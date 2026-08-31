"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  ChartColumn,
  ChevronDown,
  CreditCard,
  LifeBuoy,
  ExternalLink,
  LayoutDashboard,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { currentUser, projects } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/work/user-avatar";
import { ProjectLogo } from "@/components/work/project-logo";
import { BrandMark } from "@/components/marketing/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

const ACTIVE_KEY = "agile-coder-active-projects";

export function AppRail() {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [allOpen, setAllOpen] = useState(false);
  // Opened projects behave like browser tabs; persisted across navigations.
  const [activeSlugs, setActiveSlugs] = useState<string[]>([]);
  const [seenActivity, setSeenActivity] = useState<Record<string, boolean>>({});

  const currentSlug = pathname.match(/^\/apps\/([^/]+)/)?.[1];
  const currentProjectSlug = projects.some((p) => p.slug === currentSlug) ? currentSlug : undefined;

  // Hydrate the tab list, and collapse on narrow viewports.
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(ACTIVE_KEY) ?? "[]");
      if (Array.isArray(stored)) setActiveSlugs(stored.filter((s) => projects.some((p) => p.slug === s)));
    } catch {
      /* first visit */
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setExpanded(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Visiting a project opens its tab automatically.
  useEffect(() => {
    if (!currentProjectSlug) return;
    setActiveSlugs((prev) => {
      if (prev.includes(currentProjectSlug)) return prev;
      const next = [...prev, currentProjectSlug];
      localStorage.setItem(ACTIVE_KEY, JSON.stringify(next));
      return next;
    });
  }, [currentProjectSlug]);

  const openProject = (slug: string) => {
    setActiveSlugs((prev) => {
      const next = prev.includes(slug) ? prev : [...prev, slug];
      localStorage.setItem(ACTIVE_KEY, JSON.stringify(next));
      return next;
    });
    setSeenActivity((prev) => ({ ...prev, [slug]: true }));
    router.push(`/apps/${slug}/ai-chat`);
  };

  const closeProject = (slug: string) => {
    setActiveSlugs((prev) => {
      const next = prev.filter((s) => s !== slug);
      localStorage.setItem(ACTIVE_KEY, JSON.stringify(next));
      return next;
    });
    if (slug === currentProjectSlug) router.push("/apps");
  };

  const activeProjects = activeSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is (typeof projects)[number] => !!p);

  const menuItem =
    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground";

  return (
    <motion.aside
      animate={{ width: expanded ? 232 : 64 }}
      transition={{ type: "spring", stiffness: 380, damping: 36 }}
      className="sticky top-0 z-30 flex h-svh shrink-0 flex-col overflow-hidden border-r bg-sidebar py-3 text-sidebar-foreground"
    >
      {/* Logo */}
      <div className={cn("flex items-center px-3.5", !expanded && "justify-center px-0")}>
        <Link href="/apps" aria-label="Agile Coder home" className="flex min-w-0 items-center gap-2">
          <BrandMark className="size-9 shrink-0 text-brand" />
          {expanded && <span className="truncate text-sm font-semibold tracking-tight">Agile Coder</span>}
        </Link>
      </div>

      {/* Menu + active project tabs — anchored to the vertical middle */}
      <div
        className={cn(
          "absolute inset-x-0 top-1/2 flex max-h-[70svh] -translate-y-1/2 flex-col overflow-y-auto scrollbar-thin",
          expanded ? "px-3" : "items-center px-0",
        )}
      >
        {expanded ? (
          <>
            <nav aria-label="Main" className="flex flex-col gap-0.5">
              <Link
                href="/dashboard"
                className={cn(menuItem, pathname.startsWith("/dashboard") && "bg-brand-subtle text-brand")}
              >
                <LayoutDashboard className="size-4 shrink-0" aria-hidden />
                Dashboard
              </Link>
              <Link href="/apps/new" className={menuItem}>
                <Sparkles className="size-4 shrink-0" aria-hidden />
                New chat
              </Link>

              {/* All projects — inline expandable dropdown */}
              <button
                type="button"
                aria-expanded={allOpen}
                onClick={() => setAllOpen((v) => !v)}
                className={cn(menuItem, allOpen && "text-foreground")}
              >
                <Box className="size-4 shrink-0" aria-hidden />
                All projects
                <ChevronDown
                  className={cn("ml-auto size-3.5 transition-transform", allOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {allOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    {projects.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => openProject(p.slug)}
                          className="group flex w-full items-center gap-2.5 rounded-xl py-1.5 pl-8 pr-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                        >
                          <ProjectLogo project={p} size="sm" className="rounded-lg" />
                          <span className="min-w-0 flex-1 truncate text-left">{p.name}</span>
                          <ExternalLink
                            className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden
                          />
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              <Link href="/users" className={cn(menuItem, pathname.startsWith("/users") && "bg-brand-subtle text-brand")}>
                <Users className="size-4 shrink-0" aria-hidden />
                Workforce
              </Link>

              <p className="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Workspace
              </p>
              <Link
                href="/usage"
                className={cn(
                  menuItem,
                  (pathname.startsWith("/usage") || pathname.startsWith("/credits")) &&
                    "bg-brand-subtle text-brand",
                )}
              >
                <ChartColumn className="size-4 shrink-0" aria-hidden />
                Usage
              </Link>
              <Link
                href="/subscription"
                className={cn(menuItem, pathname.startsWith("/subscription") && "bg-brand-subtle text-brand")}
              >
                <CreditCard className="size-4 shrink-0" aria-hidden />
                Subscription
              </Link>
              <Link
                href="/settings"
                className={cn(menuItem, pathname.startsWith("/settings") && "bg-brand-subtle text-brand")}
              >
                <Settings className="size-4 shrink-0" aria-hidden />
                Settings
              </Link>
              <Link
                href="/design-system"
                className={cn(menuItem, pathname.startsWith("/design-system") && "bg-brand-subtle text-brand")}
              >
                <Palette className="size-4 shrink-0" aria-hidden />
                Design system
              </Link>
              <Link
                href="/support"
                className={cn(menuItem, pathname.startsWith("/support") && "bg-brand-subtle text-brand")}
              >
                <LifeBuoy className="size-4 shrink-0" aria-hidden />
                Support
              </Link>
            </nav>

            {/* Active projects — browser-tab style */}
            {activeProjects.length > 0 && (
              <div className="mt-4 border-t pt-3">
                <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Projects
                </p>
                <ul className="flex flex-col gap-1.5">
                  {activeProjects.map((p) => {
                    const isCurrent = p.slug === currentProjectSlug;
                    const activity = !seenActivity[p.slug] && !isCurrent ? p.aiActivity : undefined;
                    return (
                      <li key={p.id} className="group relative">
                        <Link
                          href={`/apps/${p.slug}/ai-chat`}
                          onClick={() => setSeenActivity((prev) => ({ ...prev, [p.slug]: true }))}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl py-2 pl-2.5 pr-8 text-[13px] transition-all",
                            isCurrent
                              ? "bg-brand-subtle font-medium text-brand ring-1 ring-brand/30"
                              : "bg-background text-foreground ring-1 ring-border hover:bg-accent/60",
                          )}
                        >
                          <span className="relative inline-flex shrink-0">
                            <ProjectLogo project={p} size="sm" className="rounded-lg" />
                            {activity && (
                              <span className="absolute -right-0.5 -top-0.5 flex size-2.5" aria-hidden>
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
                                <span className="relative inline-flex size-2.5 rounded-full bg-brand ring-2 ring-sidebar" />
                              </span>
                            )}
                          </span>
                          <span className="truncate">{p.name}</span>
                        </Link>
                        <button
                          type="button"
                          aria-label={`Close ${p.name}`}
                          onClick={() => closeProject(p.slug)}
                          className="absolute right-2 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          <X className="size-3" aria-hidden />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Collapsed — icon rail with flyout for All projects */}
            <nav aria-label="Main" className="flex flex-col items-center gap-1.5">
              <RailIcon label="Dashboard" href="/dashboard" active={pathname.startsWith("/dashboard")}>
                <LayoutDashboard className="size-4.5" aria-hidden />
              </RailIcon>

              <RailIcon label="New chat" href="/apps/new">
                <Sparkles className="size-4.5" aria-hidden />
              </RailIcon>

              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        aria-label="All projects"
                        className="grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                      >
                        <Box className="size-4.5" aria-hidden />
                      </button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="right">All projects</TooltipContent>
                </Tooltip>
                <PopoverContent side="right" align="start" className="w-56 p-2">
                  <p className="px-2 pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    All Projects
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {projects.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => openProject(p.slug)}
                          className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors hover:bg-accent/60"
                        >
                          <ProjectLogo project={p} size="sm" className="rounded-lg" />
                          <span className="min-w-0 flex-1 truncate text-left">{p.name}</span>
                          <ExternalLink
                            className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>

              <RailIcon label="Workforce" href="/users" active={pathname.startsWith("/users")}>
                <Users className="size-4.5" aria-hidden />
              </RailIcon>

              <RailIcon
                label="Usage"
                href="/usage"
                active={pathname.startsWith("/usage") || pathname.startsWith("/credits")}
              >
                <ChartColumn className="size-4.5" aria-hidden />
              </RailIcon>

              <RailIcon label="Subscription" href="/subscription" active={pathname.startsWith("/subscription")}>
                <CreditCard className="size-4.5" aria-hidden />
              </RailIcon>

              <RailIcon label="Settings" href="/settings" active={pathname.startsWith("/settings")}>
                <Settings className="size-4.5" aria-hidden />
              </RailIcon>

              <RailIcon
                label="Design system"
                href="/design-system"
                active={pathname.startsWith("/design-system")}
              >
                <Palette className="size-4.5" aria-hidden />
              </RailIcon>

              <RailIcon label="Support" href="/support" active={pathname.startsWith("/support")}>
                <LifeBuoy className="size-4.5" aria-hidden />
              </RailIcon>
            </nav>

            {activeProjects.length > 0 && (
              <div className="mt-3 flex w-full flex-col items-center gap-2 border-t pt-3">
                {activeProjects.map((p) => {
                  const isCurrent = p.slug === currentProjectSlug;
                  return (
                    <Tooltip key={p.id}>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/apps/${p.slug}/ai-chat`}
                          aria-label={p.name}
                          className={cn(
                            "rounded-full p-1 transition-all",
                            isCurrent
                              ? "bg-brand-subtle shadow-soft ring-2 ring-brand"
                              : "hover:bg-accent/60",
                          )}
                        >
                          <ProjectLogo project={p} size="sm" className="rounded-lg" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{p.name}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className={cn("mt-auto flex flex-col gap-2", expanded ? "px-3" : "items-center")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={expanded ? "Collapse menu" : "Expand menu"}
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
                expanded ? "px-3 py-2 text-[13px]" : "size-10 justify-center",
              )}
            >
              {expanded ? <PanelLeftClose className="size-4 shrink-0" /> : <PanelLeftOpen className="size-4.5" />}
              {expanded && "Collapse menu"}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{expanded ? "Collapse menu" : "Expand menu"}</TooltipContent>
        </Tooltip>

        <div className={cn("flex items-center gap-2", expanded ? "px-1" : "flex-col")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className={cn("flex min-w-0 items-center gap-2 rounded-xl p-1 text-left transition-colors hover:bg-accent/60", expanded && "flex-1")}
              >
                <UserAvatar member={currentUser} size="md" showTooltip={false} />
                {expanded && (
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-xs font-medium">{currentUser.name}</span>
                    <span className="truncate text-[10px] text-muted-foreground">{currentUser.role}</span>
                  </span>
                )}
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
          <ThemeToggle />
        </div>
      </div>
    </motion.aside>
  );
}

function RailIcon({
  label,
  href,
  active,
  children,
}: {
  label: string;
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          aria-label={label}
          className={cn(
            "grid size-10 place-items-center rounded-xl transition-colors",
            active
              ? "bg-brand-subtle text-brand shadow-elevation-low"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
