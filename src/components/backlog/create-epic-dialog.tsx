"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Priority, WorkItem } from "@/lib/types";
import { members, sprints } from "@/lib/data";
import { priorityConfig } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const epicSchema = z.object({
  name: z.string().min(1, "Epic name is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  assigneeId: z.string().optional(),
  sprintId: z.string().optional(),
});

type EpicFormValues = z.infer<typeof epicSchema>;

let epicSeq = 9020;

export function CreateEpicDialog({ onCreate }: { onCreate: (epic: WorkItem) => void }) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<EpicFormValues>({
    resolver: zodResolver(epicSchema),
    defaultValues: { name: "", description: "", priority: "medium", assigneeId: undefined, sprintId: undefined },
  });

  const humans = members.filter((m) => m.kind === "human");
  const agents = members.filter((m) => m.kind === "agent");

  const onSubmit = (values: EpicFormValues) => {
    epicSeq += 1;
    const epic: WorkItem = {
      id: `local-e${epicSeq}`,
      key: `PC-${epicSeq}`,
      title: values.name,
      description: values.description || undefined,
      type: "epic",
      priority: values.priority as Priority,
      status: "backlog",
      assigneeId: values.assigneeId,
      sprintId: values.sprintId,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    onCreate(epic);
    toast.success("Epic created");
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Plus className="size-3.5" aria-hidden />
          Create epic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create epic</DialogTitle>
          <DialogDescription>Add a new epic to the backlog. Stories can be generated later.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="epic-name" className="text-xs text-muted-foreground">
              Epic name
            </Label>
            <Input
              id="epic-name"
              placeholder="e.g. Health records"
              aria-invalid={!!form.formState.errors.name}
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-danger">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="epic-description" className="text-xs text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="epic-description"
              rows={3}
              placeholder="What outcome does this epic deliver?"
              {...form.register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Controller
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full" size="sm" aria-label="Priority">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(priorityConfig) as Priority[]).map((p) => (
                        <SelectItem key={p} value={p}>
                          <span className="flex items-center gap-2">
                            <span className={cn("size-1.5 rounded-full", priorityConfig[p].bar)} aria-hidden />
                            {priorityConfig[p].label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Sprint</Label>
              <Controller
                control={form.control}
                name="sprintId"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full" size="sm" aria-label="Sprint">
                      <SelectValue placeholder="No sprint" />
                    </SelectTrigger>
                    <SelectContent>
                      {sprints.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Assignee</Label>
            <Controller
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" size="sm" aria-label="Assignee">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Team</SelectLabel>
                      {humans.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <span className="flex items-center gap-2">
                            <UserAvatar member={m} size="xs" showTooltip={false} />
                            {m.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Agents</SelectLabel>
                      {agents.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <span className="flex items-center gap-2">
                            <UserAvatar member={m} size="xs" showTooltip={false} />
                            {m.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create epic
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
