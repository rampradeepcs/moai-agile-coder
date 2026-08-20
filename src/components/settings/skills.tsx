"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { members } from "@/lib/data";
import { skills as skillData } from "@/lib/workspace-data";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/work/user-avatar";

export function SkillsSettings() {
  const [skills, setSkills] = useState(skillData);
  const enabled = skills.filter((s) => s.enabled).length;

  const toggle = (id: string, on: boolean) => {
    setSkills((list) => list.map((s) => (s.id === id ? { ...s, enabled: on } : s)));
    const skill = skills.find((s) => s.id === id);
    toast(`${skill?.name} ${on ? "enabled" : "disabled"}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl bg-card p-5 shadow-soft">
        <span className="grid size-10 place-items-center rounded-lg bg-brand-subtle text-brand">
          <Sparkles className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold">
            {enabled} of {skills.length} skills enabled
          </p>
          <p className="text-xs text-muted-foreground">
            Skills define what AI agents are allowed to do autonomously across projects.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {skills.map((skill) => {
          const agent = members.find((m) => m.name === skill.agent);
          return (
            <div
              key={skill.id}
              className={cn(
                "flex flex-col gap-3 rounded-xl bg-card p-4 shadow-soft transition-opacity",
                !skill.enabled && "opacity-70",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold">{skill.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{skill.desc}</p>
                </div>
                <Switch
                  checked={skill.enabled}
                  onCheckedChange={(v) => toggle(skill.id, v)}
                  aria-label={`Toggle ${skill.name}`}
                />
              </div>
              <div className="mt-auto flex items-center gap-2 text-[11px] text-muted-foreground">
                {agent && <UserAvatar member={agent} size="xs" showTooltip={false} />}
                Runs via {skill.agent}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
