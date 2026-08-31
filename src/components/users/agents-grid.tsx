"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { members, pipelines } from "@/lib/data";
import { AgentBadge } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { Switch } from "@/components/ui/switch";
import { panelClasses } from "@/components/shared";

const agents = members.filter((m) => m.kind === "agent");

const stagesAssigned = (agentId: string) =>
  pipelines.reduce(
    (n, p) => n + p.stages.filter((s) => s.agentId === agentId).length,
    0,
  );

export function AgentsGrid() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(agents.map((a) => [a.id, true])),
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {agents.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.25 }}
          className={panelClasses({ padding: "sm" })}
        >
          <div className="flex items-start justify-between">
            <UserAvatar member={a} size="lg" showTooltip={false} />
            <Switch
              checked={enabled[a.id]}
              aria-label={`${enabled[a.id] ? "Disable" : "Enable"} ${a.name}`}
              onCheckedChange={(v) => {
                setEnabled((prev) => ({ ...prev, [a.id]: v }));
                toast.success(`${a.name} ${v ? "enabled" : "disabled"}`);
              }}
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{a.name}</p>
            <AgentBadge />
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {a.role}
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Stages assigned:{" "}
            <span className="font-medium text-foreground">
              {stagesAssigned(a.id)}
            </span>
          </p>
        </motion.div>
      ))}
    </div>
  );
}
