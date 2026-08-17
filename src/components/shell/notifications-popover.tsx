"use client";

import { AtSign, Bell, Bot, Check, Info, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { notifications as seed } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const kindIcon = {
  mention: AtSign,
  update: RefreshCcw,
  ai: Bot,
  system: Info,
} as const;

export function NotificationsPopover() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState("all");
  const unread = items.filter((n) => !n.read).length;
  const visible = tab === "all" ? items : tab === "mentions" ? items.filter((n) => n.kind === "mention") : items.filter((n) => !n.read);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              className="relative size-9 rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Bell className="size-4" />
              {unread > 0 && (
                <span className="absolute right-0.5 top-0.5 grid size-3.5 place-items-center rounded-full bg-danger text-[8px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground"
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          >
            <Check className="size-3.5" /> Mark all read
          </Button>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="px-4 pt-2">
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
            <TabsTrigger value="mentions" className="text-xs">Mentions</TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollArea className="h-80">
          <ul className="flex flex-col p-2">
            {visible.length === 0 && (
              <li className="px-3 py-10 text-center text-sm text-muted-foreground">You&apos;re all caught up.</li>
            )}
            {visible.map((n) => {
              const Icon = kindIcon[n.kind];
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.map((p) => (p.id === n.id ? { ...p, read: true } : p)))}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent/60",
                      !n.read && "bg-brand-subtle/40",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full",
                        n.kind === "ai" ? "bg-brand-subtle text-brand" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-medium">{n.title}</span>
                        {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />}
                      </span>
                      <span className="line-clamp-2 text-xs text-muted-foreground">{n.body}</span>
                      <span className="text-[10px] text-muted-foreground/70">{n.at}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
        <div className="border-t px-4 py-2 text-center">
          <Button variant="link" size="sm" className="h-6 text-xs text-muted-foreground">
            Notification preferences
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
