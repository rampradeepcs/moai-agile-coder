"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { pipelines as basePipelines, memberById, members } from "@/lib/data";
import type { Pipeline, Stage } from "@/lib/types";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, GripVertical, Info, Pencil, Plus } from "lucide-react";

const agents = members.filter((m) => m.kind === "agent");

const swatches = [
  { name: "Mint", value: "oklch(0.85 0.12 165)" },
  { name: "Sky", value: "oklch(0.8 0.11 230)" },
  { name: "Violet", value: "oklch(0.65 0.2 290)" },
  { name: "Amber", value: "oklch(0.82 0.14 80)" },
  { name: "Pink", value: "oklch(0.75 0.15 350)" },
  { name: "Rose", value: "oklch(0.65 0.2 15)" },
  { name: "Black", value: "oklch(0.25 0.01 286)" },
];

function StageCard({ stage }: { stage: Stage }) {
  const agent = memberById(stage.agentId);
  return (
    <div className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2 shadow-elevation-low">
      <GripVertical
        className="size-3.5 shrink-0 text-muted-foreground/60"
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{stage.name}</p>
        {agent ? (
          <span className="mt-1 flex items-center gap-1.5">
            <UserAvatar member={agent} size="xs" showTooltip={false} />
            <span className="truncate text-[10px] text-muted-foreground">
              {agent.name} · {agent.role}
            </span>
          </span>
        ) : (
          <span className="mt-1 inline-flex rounded-full bg-muted px-1.5 py-px text-[10px] text-muted-foreground">
            Manual
          </span>
        )}
      </div>
    </div>
  );
}

function PinnedChip({ name }: { name: string }) {
  return (
    <div className="rounded-full border border-dashed px-3 py-1.5 text-center text-[11px] font-medium text-muted-foreground">
      {name}
    </div>
  );
}

export function KanbanConfigTab() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(basePipelines);
  const [addStageFor, setAddStageFor] = useState<string | null>(null);
  const [stageName, setStageName] = useState("");
  const [stageColor, setStageColor] = useState(swatches[2].value);
  const [stageAgent, setStageAgent] = useState<string>("manual");

  const resetDialog = () => {
    setStageName("");
    setStageColor(swatches[2].value);
    setStageAgent("manual");
  };

  const addStage = () => {
    if (!addStageFor || !stageName.trim()) return;
    setPipelines((prev) =>
      prev.map((p) =>
        p.id === addStageFor
          ? {
              ...p,
              stages: [
                ...p.stages.filter((s) => s.pinned !== "end"),
                {
                  id: `${p.id}-${Date.now()}`,
                  name: stageName.trim(),
                  color: stageColor,
                  agentId: stageAgent === "manual" ? undefined : stageAgent,
                },
                ...p.stages.filter((s) => s.pinned === "end"),
              ],
            }
          : p,
      ),
    );
    toast.success(`Stage “${stageName.trim()}” added`);
    setAddStageFor(null);
    resetDialog();
  };

  const addPipeline = () => {
    const n = pipelines.length + 1;
    setPipelines((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: `New pipeline ${n}`,
        colorClass: "pipeline-marketing",
        stages: [
          { id: `np${n}-todo`, name: "To Do", pinned: "start" },
          { id: `np${n}-done`, name: "Completed", pinned: "end" },
        ],
      },
    ]);
    toast.success("Pipeline added — rename it and add stages");
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-info-subtle/60 px-3 py-2">
          <Info className="size-3.5 shrink-0 text-info" aria-hidden />
          <p className="text-xs text-foreground/80">
            Items move automatically between stages as AI agents finish their
            work — completed stages hand off to the next stage in the pipeline.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={addPipeline}>
            <Plus className="size-3.5" aria-hidden />
            Add new pipeline
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast("Preview opens the live kanban board")}
          >
            <Eye className="size-3.5" aria-hidden />
            Preview
          </Button>
        </div>
      </div>

      <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-4">
        {pipelines.map((p) => {
          const start = p.stages.find((s) => s.pinned === "start");
          const end = p.stages.find((s) => s.pinned === "end");
          const middle = p.stages.filter((s) => !s.pinned);
          return (
            <div key={p.id} className={cn("w-64 shrink-0", p.colorClass)}>
              <div
                className="flex items-center justify-between rounded-lg px-3 py-2 text-white"
                style={{ background: "var(--pipeline)" }}
              >
                <span className="truncate text-xs font-semibold">
                  {p.name}
                </span>
                <button
                  type="button"
                  aria-label={`Rename ${p.name} pipeline`}
                  className="rounded p-0.5 opacity-80 hover:opacity-100"
                  onClick={() => toast(`Rename “${p.name}” — coming soon`)}
                >
                  <Pencil className="size-3" aria-hidden />
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {start && <PinnedChip name={start.name} />}
                {middle.map((s) => (
                  <StageCard key={s.id} stage={s} />
                ))}
                <button
                  type="button"
                  className="w-full rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                  onClick={() => setAddStageFor(p.id)}
                >
                  + Add new stage
                </button>
                {end && <PinnedChip name={end.name} />}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={addStageFor !== null}
        onOpenChange={(o) => {
          if (!o) {
            setAddStageFor(null);
            resetDialog();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add new stage</DialogTitle>
            <DialogDescription>
              New stages slot in just before “Completed”.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label
                htmlFor="stage-name"
                className="text-xs text-muted-foreground"
              >
                Stage name
              </Label>
              <Input
                id="stage-name"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="e.g. Design review"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Choose colour
              </Label>
              <div className="flex items-center gap-2.5 pt-1">
                {swatches.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    aria-label={`${s.name} colour`}
                    onClick={() => setStageColor(s.value)}
                    className={cn(
                      "size-6 rounded-full transition-transform hover:scale-110",
                      stageColor === s.value &&
                        "ring-2 ring-ring ring-offset-2 ring-offset-background",
                    )}
                    style={{ background: s.value }}
                  />
                ))}
                <button
                  type="button"
                  aria-label="Automation colour"
                  onClick={() => setStageColor("automation")}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "size-6 rounded-full transition-transform hover:scale-110",
                      stageColor === "automation" &&
                        "ring-2 ring-ring ring-offset-2 ring-offset-background",
                    )}
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.65 0.2 290), oklch(0.75 0.15 350), oklch(0.82 0.14 80))",
                    }}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Automation
                  </span>
                </button>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Select AI agent
              </Label>
              <Select value={stageAgent} onValueChange={setStageAgent}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} — {a.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setAddStageFor(null);
                resetDialog();
              }}
            >
              Cancel
            </Button>
            <Button disabled={!stageName.trim()} onClick={addStage}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
