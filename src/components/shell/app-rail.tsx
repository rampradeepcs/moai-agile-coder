"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronsLeft,
  ChevronsRight,
  Coins,
  Home,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { currentUser, projects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/work/user-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/apps", label: "Home", icon: Home, exact: true },
  { href: "/apps?filter=favourites", label: "Favourites", icon: Star },
  { href: "/apps", label: "All Applications", icon: LayoutGrid, exact: false, key: "apps" },
  { href: "/users", label: "Users", icon: Users },
];

export function AppRail() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const favourites = projects.filter((p) => p.favourite);

  // Collapse to the icon rail on narrow viewports; expand again on desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setExpanded(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <motion.aside
      layout
      animate={{ width: expanded ? 232 : 60 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      className="sticky top-0 z-30 flex h-svh shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground"
    >
      {/* Logo row */}
      <div className={cn("flex h-14 items-center gap-2 border-b px-3", expanded ? "justify-between" : "justify-center")}>
        <Link href="/apps" className="flex items-center gap-2 overflow-hidden">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-elevation-low">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <AnimatePresence>
            {expanded && (
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
        {expanded && (
          <Button variant="ghost" size="icon" className="size-7" aria-label="Collapse sidebar" onClick={() => setExpanded(false)}>
            <ChevronsLeft className="size-4" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {!expanded && (
          <RailButton label="Expand" onClick={() => setExpanded(true)}>
            <ChevronsRight className="size-4" />
          </RailButton>
        )}

        {navItems.map((item) => {
          const active =
            item.key === "apps"
              ? pathname.startsWith("/apps")
              : item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href.split("?")[0]) && item.href !== "/apps";
          return (
            <NavLink key={item.label} href={item.href} label={item.label} active={active} expanded={expanded}>
              <item.icon className="size-4" aria-hidden />
            </NavLink>
          );
        })}

        {/* Favourites */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Favourites
                </span>
                <Link href="/apps/new" aria-label="New application">
                  <Plus className="size-3.5 text-muted-foreground transition-colors hover:text-foreground" />
                </Link>
              </div>
              {favourites.map((p) => {
                const active = pathname.startsWith(`/apps/${p.slug}`);
                return (
                  <Link
                    key={p.id}
                    href={`/apps/${p.slug}/dashboard`}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors",
                      active
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-md bg-brand-subtle text-[10px] font-bold text-brand">
                      {p.name[0]}
                    </span>
                    <span className="truncate">{p.name}</span>
                    <Star className="ml-auto size-3 fill-warning text-warning opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              })}
              <button
                type="button"
                className="mt-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
              >
                <MoreHorizontal className="size-4" aria-hidden />
                More
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg bg-brand-subtle px-2 py-1.5 text-brand",
                !expanded && "justify-center",
              )}
            >
              <Coins className="size-4 shrink-0" aria-hidden />
              {expanded && (
                <span className="flex flex-col leading-none">
                  <span className="text-xs font-bold">400</span>
                  <span className="text-[10px] opacity-80">AI credits</span>
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">400 AI credits available</TooltipContent>
        </Tooltip>

        <div className={cn("flex items-center gap-2", !expanded && "justify-center")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex min-w-0 flex-1 items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-sidebar-accent/60">
                <UserAvatar member={currentUser} size="md" showTooltip={false} />
                {expanded && (
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-xs font-medium">{currentUser.name}</span>
                    <span className="truncate text-[10px] text-muted-foreground">Super admin</span>
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
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
          {expanded && <ThemeToggle />}
        </div>
      </div>
    </motion.aside>
  );
}

function NavLink({
  href,
  label,
  active,
  expanded,
  children,
}: {
  href: string;
  label: string;
  active?: boolean;
  expanded: boolean;
  children: React.ReactNode;
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors",
        !expanded && "justify-center px-0 py-2",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
      )}
    >
      {children}
      {expanded && <span className="truncate">{label}</span>}
    </Link>
  );
  if (expanded) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function RailButton({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className="flex items-center justify-center rounded-lg py-2 text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
