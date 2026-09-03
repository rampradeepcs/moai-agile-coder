"use client";

import { useState } from "react";
import { toast } from "sonner";
import { workspace } from "@/lib/workspace-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsCard, SettingsRow } from "./shared";

export function GeneralSettings() {
  const [name, setName] = useState(workspace.name);
  const [url, setUrl] = useState(workspace.url);

  return (
    <div className="flex flex-col gap-4">
      <SettingsCard
        title="Workspace"
        description="How your workspace appears across the product."
        footer={
          <Button size="sm" onClick={() => toast.success("Workspace settings saved")}>
            Save changes
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ws-name">Workspace name</Label>
            <Input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ws-url">Workspace URL</Label>
            <div className="flex items-center">
              <span className="flex h-9 items-center rounded-l-lg border border-r-0 border-input bg-muted px-2.5 text-[13px] text-muted-foreground">
                wizkraft.app/
              </span>
              <Input
                id="ws-url"
                className="rounded-l-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Localisation" description="Language, time and calendar defaults for everyone.">
        <div className="grid gap-4 sm:grid-cols-3">
          <LabeledSelect label="Language" defaultValue={workspace.language} options={["English (US)", "English (UK)", "தமிழ்", "हिन्दी"]} />
          <LabeledSelect label="Timezone" defaultValue={workspace.timezone} options={["Asia/Kolkata (GMT+5:30)", "UTC (GMT+0)", "America/New_York (GMT−4)"]} />
          <LabeledSelect label="Week starts on" defaultValue={workspace.weekStart} options={["Monday", "Sunday"]} />
        </div>
      </SettingsCard>

      <SettingsCard title="Defaults" description="Applied to every newly created project.">
        <SettingsRow
          title="Default LLM"
          description="Model used until a project picks its own."
          control={
            <Select defaultValue="Claude Opus 4" onValueChange={(v) => toast(`Default LLM set to ${v}`)}>
              <SelectTrigger size="sm" className="w-44 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Claude Opus 4", "GPT-5", "Google Gemini Pro"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
        <SettingsRow
          title="Sprint length"
          description="Default cadence for new sprint plans."
          control={
            <Select defaultValue="1 week" onValueChange={(v) => toast(`Sprint length set to ${v}`)}>
              <SelectTrigger size="sm" className="w-44 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["1 week", "2 weeks", "3 weeks"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </SettingsCard>
    </div>
  );
}

function LabeledSelect({
  label,
  defaultValue,
  options,
}: {
  label: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
