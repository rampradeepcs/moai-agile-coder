"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, Loader2, Pencil, Plus, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DocSection {
  id: string;
  title: string;
  paragraph?: string;
  bullets?: string[];
}

const INITIAL_SECTIONS: DocSection[] = [
  {
    id: "executive-summary",
    title: "Executive summary",
    paragraph:
      "PawCare is an AI-powered mobile application (iOS/Android) built on React Native, FastAPI, and PostgreSQL. It enables pet owners to book vet appointments, track vaccinations, manage health records, and receive smart care reminders — all powered by Google Gemini Pro.",
  },
  {
    id: "goals",
    title: "Goals",
    bullets: [
      "Simplify vet appointment booking for pet owners",
      "Centralize pet health records in one secure platform",
      "Automate vaccination & care reminders using AI",
      "Provide an AI health assistant for pet care guidance",
      "Support multiple pet profiles per user account",
    ],
  },
  {
    id: "functional",
    title: "Functional requirements",
    bullets: [
      "User auth — register, login, profile management",
      "Pet profiles — add, edit, delete multiple pets",
      "Appointment booking — search vets, pick slots, confirm",
      "Vaccination tracker — log, view, set reminders",
      "Health records — upload docs, view history",
      "AI assistant — Gemini Pro powered Q&A chat",
      "Smart reminders — push notifications via schedule",
    ],
  },
  {
    id: "non-functional",
    title: "Non-functional requirements",
    bullets: [
      "Performance — app load under 2s, API response under 500ms",
      "Security — HIPAA-aligned data handling, encrypted storage",
      "Scalability — support 10k+ concurrent users",
      "Availability — 99.9% uptime SLA",
      "Accessibility — WCAG 2.1 AA compliant",
    ],
  },
  {
    id: "constraints",
    title: "Constraints",
    bullets: [
      "Tech stack fixed: React Native + FastAPI + PostgreSQL",
      "LLM: Google Gemini Pro only",
      "Mobile only — no web app in current scope",
      "Must comply with healthcare data regulations",
    ],
  },
];

const ADDABLE_SECTIONS = [
  "Problem statement",
  "Target audience",
  "Success metrics",
  "Homepage module",
  "Social proof section",
];

export function RequirementDoc({ onApprove }: { onApprove: () => void }) {
  const [generating, setGenerating] = React.useState(true);
  const [sections, setSections] = React.useState<DocSection[]>(INITIAL_SECTIONS);
  const [addChecked, setAddChecked] = React.useState<string[]>([]);
  const [customSection, setCustomSection] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(false);
  const [regenTarget, setRegenTarget] = React.useState<string | null>(null);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setGenerating(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const appendSections = () => {
    const titles = [...addChecked, ...(customSection.trim() ? [customSection.trim()] : [])];
    if (titles.length === 0) return;
    setSections((s) => [
      ...s,
      ...titles
        .filter((t) => !s.some((sec) => sec.title === t))
        .map((title) => ({
          id: title.toLowerCase().replace(/\s+/g, "-"),
          title,
          paragraph:
            "Drafted by AI from your requirement gatherings — click Edit to refine this section.",
        })),
    ]);
    setAddChecked([]);
    setCustomSection("");
    setAddOpen(false);
    toast.success(`${titles.length} section${titles.length > 1 ? "s" : ""} added`);
  };

  const startEdit = (section: DocSection) => {
    setEditingId(section.id);
    setEditDraft(section.paragraph ?? section.bullets?.join("\n") ?? "");
  };

  const saveEdit = (section: DocSection) => {
    setSections((s) =>
      s.map((sec) =>
        sec.id === section.id
          ? sec.bullets
            ? { ...sec, bullets: editDraft.split("\n").filter(Boolean) }
            : { ...sec, paragraph: editDraft }
          : sec
      )
    );
    setEditingId(null);
    toast.success("Section updated");
  };

  if (generating) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Generating requirement document…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-3xl px-6 py-8"
        >
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                PawCare — Requirement Document
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">v03 · Generated May 2026</p>
            </div>
            <Popover open={addOpen} onOpenChange={setAddOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus />
                  Add sections
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <p className="text-sm font-medium">Add sections</p>
                <div className="mt-3 space-y-2.5">
                  {ADDABLE_SECTIONS.map((title) => (
                    <div key={title} className="flex items-center gap-2">
                      <Checkbox
                        id={`add-${title}`}
                        checked={addChecked.includes(title)}
                        onCheckedChange={(checked) =>
                          setAddChecked((c) =>
                            checked ? [...c, title] : c.filter((t) => t !== title)
                          )
                        }
                      />
                      <Label htmlFor={`add-${title}`} className="text-sm font-normal">
                        {title}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Input
                    value={customSection}
                    onChange={(e) => setCustomSection(e.target.value)}
                    placeholder="Something else…"
                    aria-label="Custom section name"
                    className="h-8 text-sm"
                  />
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={appendSections}
                  disabled={addChecked.length === 0 && !customSection.trim()}
                >
                  Add
                </Button>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sections */}
          <div className="mt-6 space-y-4 pb-8">
            {sections.map((section) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border bg-card p-5 shadow-elevation-low"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold tracking-tight">{section.title}</h2>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        editingId === section.id ? setEditingId(null) : startEdit(section)
                      }
                    >
                      <Pencil />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setRegenTarget(section.title)}
                    >
                      <Sparkles />
                      Regenerate
                    </Button>
                  </div>
                </div>

                {editingId === section.id ? (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      aria-label={`Edit ${section.title}`}
                      className="min-h-28 text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => saveEdit(section)}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : section.paragraph ? (
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {section.paragraph}
                  </p>
                ) : (
                  <ul className="mt-2.5 space-y-1.5">
                    {section.bullets?.map((b) => (
                      <li key={b} className="flex gap-2.5 text-sm text-muted-foreground">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary/60" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-end gap-2 px-6 py-4">
          <Button variant="outline" onClick={() => setRegenTarget("the entire document")}>
            <RefreshCw />
            Regenerate document
          </Button>
          <Button onClick={() => setApproveOpen(true)}>
            <Check />
            Approve
          </Button>
        </div>
      </div>

      {/* Regenerate warning */}
      <AlertDialog open={regenTarget !== null} onOpenChange={(o) => !o && setRegenTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate with AI?</AlertDialogTitle>
            <AlertDialogDescription>
              Regenerating {regenTarget} will consume AI tokens from your workspace
              allowance. The current content will be replaced.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRegenTarget(null);
                toast.success("Regenerated with the latest context");
              }}
            >
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve dialog */}
      <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve requirement document!</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve requirement document and proceed to move on
              to Design document generation?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onApprove}>Generate design document</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
