"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Plus, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { currentUser, projects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/work/user-avatar";
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
  const [panelOpen, setPanelOpen] = useState(true);

  // Hide the projects panel on narrow viewports; the icon rail always stays.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setPanelOpen(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="sticky top-0 z-30 flex h-svh shrink-0">
      {/* Icon rail */}
      <aside className="flex w-16 flex-col items-center border-r bg-sidebar py-3 text-sidebar-foreground">
        <Link href="/apps" aria-label="Agile Coder home" className="mb-6">
          <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient text-white shadow-elevation-low">
            <Sparkles className="size-4.5" aria-hidden />
          </span>
        </Link>

        <nav className="flex flex-col items-center gap-1.5">
          {railItems.map((item) => {
            const active =
              item.href === "/apps" ? pathname.startsWith("/apps") && !pathname.startsWith("/apps/new") : pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      "grid size-10 place-items-center rounded-xl transition-colors",
                      active
                        ? "bg-brand-subtle text-brand shadow-elevation-low"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4.5" aria-hidden />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2">
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
      </aside>

      {/* Projects panel */}
      <AnimatePresence initial={false}>
        {panelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 216, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="overflow-hidden border-r bg-sidebar text-sidebar-foreground"
          >
            <div className="flex h-full w-[216px] flex-col gap-1 p-4">
              <span className="px-1 pb-3 text-[13px] font-medium">Projects</span>
              <Button asChild className="mb-4 w-full gap-1.5 rounded-full bg-brand-gradient text-white shadow-elevation-mid transition-transform hover:-translate-y-px hover:opacity-95">
                <Link href="/apps/new">
                  <Plus className="size-4" /> Add new project
                </Link>
              </Button>

              <nav className="flex flex-col gap-1" aria-label="Projects">
                {projects.map((p) => {
                  const active = pathname.startsWith(`/apps/${p.slug}`);
                  return (
                    <Link
                      key={p.id}
                      href={`/apps/${p.slug}/ai-chat`}
                      className={cn(
                        "rounded-xl px-3 py-2 text-[13px] transition-all",
                        active
                          ? "bg-background font-medium text-brand shadow-soft ring-1 ring-border"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      )}
                    >
                      {p.name}
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
