"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Bug,
  Cable,
  FileText,
  GitBranch,
  HardDrive,
  MessageSquare,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { connectors as connectorData } from "@/lib/workspace-data";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, { icon: LucideIcon; className: string }> = {
  github: { icon: GitBranch, className: "bg-muted text-foreground" },
  figma: { icon: PenTool, className: "bg-pink-subtle text-pink" },
  slack: { icon: MessageSquare, className: "bg-teal-subtle text-teal" },
  jira: { icon: FileText, className: "bg-info-subtle text-info" },
  gdrive: { icon: HardDrive, className: "bg-warning-subtle text-warning" },
  sentry: { icon: Bug, className: "bg-danger-subtle text-danger" },
};

export function ConnectorsSettings() {
  const [connectors, setConnectors] = useState(connectorData);
  const connected = connectors.filter((c) => c.connected).length;

  const toggle = (id: string) => {
    setConnectors((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        const next = !c.connected;
        toast(next ? `${c.name} connected` : `${c.name} disconnected`);
        return { ...c, connected: next, account: next ? "moai-consulting" : null };
      }),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl bg-card p-5 shadow-soft">
        <span className="grid size-10 place-items-center rounded-lg bg-brand-subtle text-brand">
          <Cable className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold">{connected} connected</p>
          <p className="text-xs text-muted-foreground">
            Connectors keep WizKraft in sync with the rest of your toolchain.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {connectors.map((c) => {
          const meta = ICONS[c.id];
          return (
            <div key={c.id} className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg",
                    meta?.className ?? "bg-muted text-foreground",
                  )}
                >
                  {meta && <meta.icon className="size-4.5" aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[13px] font-semibold">
                    {c.name}
                    {c.connected && (
                      <span className="rounded-md bg-success-subtle px-1.5 py-0.5 text-[10px] font-medium text-success">
                        Connected
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2">
                <span className="truncate text-[11px] text-muted-foreground">
                  {c.connected && c.account ? c.account : "Not connected"}
                </span>
                <Button
                  variant={c.connected ? "outline" : "default"}
                  size="xs"
                  onClick={() => toggle(c.id)}
                >
                  {c.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
