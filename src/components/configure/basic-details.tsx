"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Radio, RadioGroup } from "@/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiCostConfirm } from "./ai-cost-confirm";
import { panelClasses } from "@/components/shared";

const platforms = [
  "Mobile app (iOS/Android)",
  "Web",
  "Desktop",
  "API",
  "SAAS",
];

const llms = [
  "Google Gemini Pro",
  "GPT-5",
  "Claude Opus 4",
  "Claude Sonnet 4",
  "Gemini 2.5 Pro",
];

export function BasicDetailsTab() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className={panelClasses({ padding: "lg", className: "max-w-2xl" })}>
      <h2 className="text-sm font-semibold">Basic details</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Core facts about this application. Changing them regenerates the setup.
      </p>

      <div className="mt-5 grid gap-5">
        <div className="grid gap-1.5">
          <Label htmlFor="app-name" className="text-xs text-muted-foreground">
            App name
          </Label>
          <Input id="app-name" defaultValue="PawCare" />
        </div>

        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Platform</Label>
          <Select defaultValue="Mobile app (iOS/Android)">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <RadioGroup
            defaultValue="active"
            size="sm"
            className="flex gap-5 pt-1"
          >
            {(["Active", "Inactive", "Deprecated"] as const).map((s) => (
              <Radio key={s} value={s.toLowerCase()} id={`status-${s}`} label={s} />
            ))}
          </RadioGroup>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="industry" className="text-xs text-muted-foreground">
            Industry
          </Label>
          <Input id="industry" defaultValue="Pet care" />
        </div>

        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">LLM</Label>
          <Select defaultValue="Google Gemini Pro">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {llms.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        <Button variant="ghost">Cancel</Button>
        <Button onClick={() => setConfirmOpen(true)}>Save</Button>
      </div>

      <AiCostConfirm
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Edit basic details?"
        sectionLabel="Basic details"
        onProceed={() =>
          toast.success("Basic details saved — regeneration queued")
        }
      />
    </div>
  );
}
