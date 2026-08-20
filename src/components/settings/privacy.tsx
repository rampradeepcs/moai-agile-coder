"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsCard, SettingsRow } from "./shared";

function useToggle(initial: boolean, label: string) {
  const [on, setOn] = useState(initial);
  return {
    checked: on,
    onCheckedChange: (v: boolean) => {
      setOn(v);
      toast(`${label} ${v ? "enabled" : "disabled"}`);
    },
  };
}

export function PrivacySettings() {
  const training = useToggle(false, "Model improvement");
  const analytics = useToggle(true, "Product analytics");
  const activity = useToggle(true, "Activity visibility");

  return (
    <div className="flex flex-col gap-4">
      <SettingsCard title="AI & data" description="Control how your workspace data is used by AI features.">
        <SettingsRow
          title="Use my data to improve models"
          description="Off by default — prompts and documents stay private to your workspace."
          control={<Switch {...training} />}
        />
        <SettingsRow
          title="Product analytics"
          description="Anonymous usage metrics that help us improve the product."
          control={<Switch {...analytics} />}
        />
        <SettingsRow
          title="Prompt retention"
          description="How long AI chat history is kept before automatic deletion."
          control={
            <Select defaultValue="90 days" onValueChange={(v) => toast(`Prompt retention set to ${v}`)}>
              <SelectTrigger size="sm" className="w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["30 days", "90 days", "1 year", "Forever"].map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </SettingsCard>

      <SettingsCard title="Visibility" description="What teammates can see about your work.">
        <SettingsRow
          title="Show my activity in feeds"
          description="Card moves, comments and reviews appear in project activity."
          control={<Switch {...activity} />}
        />
      </SettingsCard>

      <SettingsCard title="Your data" description="Export or erase the data tied to your workspace.">
        <SettingsRow
          title="Export workspace data"
          description="Projects, documents and activity as a JSON archive."
          control={
            <Button variant="outline" size="sm" onClick={() => toast.success("Export started — we'll email you a link")}>
              Request export
            </Button>
          }
        />
        <SettingsRow
          title="Delete workspace data"
          description="Permanently removes all projects and documents."
          control={
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error("Deletion requires confirmation from all workspace admins")}
            >
              Delete data
            </Button>
          }
        />
      </SettingsCard>
    </div>
  );
}
