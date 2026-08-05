"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Kanban, LayoutDashboard, ListTodo, Play, Settings2, Share2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { memberById } from "@/lib/data";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/work/user-avatar";
import { CommandTrigger } from "./command-palette";
import { NotificationsPopover } from "./notifications-popover";

const tabs = [
  { segment: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { segment: "backlog", label: "Backlog", icon: ListTodo },
  { segment: "kanban", label: "Kanban", icon: Kanban },
  { segment: "configure", label: "Configure", icon: Settings2 },
];

export function ProjectTopbar({ project }: { project: Project }) {
  const pathname = usePathname();
  const memberList = project.memberIds.map(memberById).filter(Boolean).slice(0, 4);
  const extra = project.memberIds.length + 18 - memberList.length;

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-3 border-b bg-background/90 px-6 pb-0 pt-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-brand hover:text-brand/80">
                  <Link href="/apps">All applications</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="truncate text-2xl font-bold tracking-tight">{project.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-1 hidden items-center -space-x-2 md:flex">
            {memberList.map((m) => (
              <UserAvatar key={m!.id} member={m} size="sm" className="ring-2 ring-background" />
            ))}
            <span className="grid size-6 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-background">
              +{extra}
            </span>
          </div>
          <div className="hidden lg:block">
            <CommandTrigger />
          </div>
          <NotificationsPopover />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Share link copied to clipboard")}>
            <Share2 className="size-3.5" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast("Invite sent", { description: "Your teammates will get an email invite." })}>
            <UserPlus className="size-3.5" /> Invite people
          </Button>
          <Button size="sm" className="gap-1.5 shadow-elevation-low" onClick={() => toast("Starting application…", { description: "AI agents are picking up the next stage." })}>
            <Play className="size-3.5 fill-current" /> Start application
          </Button>
        </div>
      </div>

      <nav aria-label="Project sections" className="flex items-center gap-1">
        {tabs.map((tab) => {
          const href = `/apps/${project.slug}/${tab.segment}`;
          const active = pathname.startsWith(href);
          return (
            <Link
              key={tab.segment}
              href={href}
              className={cn(
                "relative flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className="size-3.5" aria-hidden />
              {tab.label}
              {active && (
                <motion.span
                  layoutId="project-tab-indicator"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
