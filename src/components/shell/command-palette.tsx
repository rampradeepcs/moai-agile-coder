"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bot,
  FileText,
  Kanban,
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  Moon,
  Plus,
  Search,
  Settings2,
  Sun,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { projects, workItems } from "@/lib/data";
import { TypeBadge } from "@/components/work/badges";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Global search" description="Search projects, tasks, users and commands">
      <Command>
      <CommandInput placeholder="Search projects, tasks, users…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem key={p.id} value={`project ${p.name}`} onSelect={() => go(`/apps/${p.slug}/dashboard`)}>
              <LayoutGrid />
              {p.name}
              <span className="ml-2 truncate text-xs text-muted-foreground">{p.platform}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tasks">
          {workItems.slice(0, 7).map((w) => (
            <CommandItem key={w.id} value={`${w.key} ${w.title}`} onSelect={() => go(`/apps/paw-care/backlog?item=${w.key}`)}>
              <span className="font-mono text-xs text-muted-foreground">{w.key}</span>
              <span className="truncate">{w.title}</span>
              <span className="ml-auto"><TypeBadge type={w.type} /></span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/apps/paw-care/dashboard")}><LayoutDashboard />Dashboard</CommandItem>
          <CommandItem onSelect={() => go("/apps/paw-care/backlog")}><ListTodo />Backlog</CommandItem>
          <CommandItem onSelect={() => go("/apps/paw-care/kanban")}><Kanban />Kanban</CommandItem>
          <CommandItem onSelect={() => go("/apps/paw-care/configure")}><Settings2 />Configure</CommandItem>
          <CommandItem onSelect={() => go("/users")}><Users />Users</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Commands">
          <CommandItem onSelect={() => go("/apps/new")}>
            <Plus />
            New application
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/apps/new")}>
            <Bot />
            Ask AI to create a task
          </CommandItem>
          <CommandItem onSelect={() => go("/apps/paw-care/configure?tab=documents")}>
            <FileText />
            Open requirement document
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              setOpen(false);
            }}
          >
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
            Toggle theme
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function CommandTrigger({ onOpen }: { onOpen?: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-8 w-full max-w-64 items-center gap-2 rounded-lg border bg-card px-2.5 text-left text-[13px] text-muted-foreground shadow-elevation-low transition-colors hover:border-ring/40"
      onClickCapture={() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
      }}
    >
      <Search className="size-3.5" aria-hidden />
      <span className="flex-1 truncate">Search</span>
      <kbd className="pointer-events-none rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
        ⌘K
      </kbd>
    </button>
  );
}
