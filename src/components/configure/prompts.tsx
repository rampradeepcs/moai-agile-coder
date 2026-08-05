"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileTerminal, Plus } from "lucide-react";

const platformPrompt = `Must include min below features…
1. User Authentication & Access — Sign up / Sign in (email, password); Password reset & email verification; OAuth (Google, GitHub, LinkedIn) (optional-early); Session management; Logout everywhere (security).
2. User & Account Management — User profile (name, email, avatar); Account / workspace concept; Change email / password; Account deletion (compliance).`;

export function PromptsTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [customPrompts, setCustomPrompts] = useState<string[]>([]);

  const saveCustom = () => {
    if (!draft.trim()) return;
    setCustomPrompts((prev) => [...prev, draft.trim()]);
    setDraft("");
    setDialogOpen(false);
    toast.success("Custom prompt saved");
  };

  return (
    <div className="max-w-3xl rounded-xl border bg-card p-6 shadow-elevation-low">
      <h2 className="text-sm font-semibold">App type setup</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        The base prompt every generation starts from, plus your custom
        additions.
      </p>

      <Tabs defaultValue="prompt" className="mt-4">
        <TabsList>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="mt-3">
          <div className="min-h-40 rounded-lg border bg-muted/40 px-3.5 py-3 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
            {platformPrompt}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Read-only — this baseline is maintained per platform by Agile
            Coder.
          </p>
        </TabsContent>

        <TabsContent value="custom" className="mt-3">
          {customPrompts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-10 text-center">
              <FileTerminal
                className="size-6 text-muted-foreground"
                aria-hidden
              />
              <p className="text-xs text-muted-foreground">
                No custom prompts yet. Add project-specific constraints that
                every generation must respect.
              </p>
              <Button size="sm" onClick={() => setDialogOpen(true)}>
                <Plus className="size-3.5" aria-hidden />
                Create custom prompt
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {customPrompts.map((p, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card p-3.5 shadow-elevation-low"
                >
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Custom prompt {i + 1}
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{p}</p>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="size-3.5" aria-hidden />
                Create custom prompt
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create custom prompt</DialogTitle>
            <DialogDescription>
              Appended to the platform prompt for all future generations in
              this app.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. All screens must support offline mode and sync when back online…"
            className="min-h-32"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!draft.trim()} onClick={saveCustom}>
              Save custom prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
