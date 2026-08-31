"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiCostConfirm } from "./ai-cost-confirm";
import { Check, Pencil, Plus, RefreshCw, Sparkles } from "lucide-react";
import { panelClasses } from "@/components/shared";

interface DocSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

const initialSections: DocSection[] = [
  {
    id: "exec",
    title: "Executive summary",
    paragraphs: [
      "PawCare is a mobile-first pet care platform that gives pet parents a single place to book vet appointments, track vaccinations, store health records and receive smart reminders. The app is built with React Native on top of a FastAPI backend and PostgreSQL, with Google Gemini Pro powering conversational assistance and generation features.",
      "The v1 release targets iOS and Android and focuses on the booking-to-reminder loop for dogs and cats, with multi-pet households supported from day one.",
    ],
  },
  {
    id: "goals",
    title: "Goals",
    bullets: [
      "Let a pet parent go from sign-up to a confirmed vet appointment in under 3 minutes.",
      "Digitise vaccination and health records with shareable, vet-verified entries.",
      "Reduce missed appointments by 40% through smart, escalating reminders.",
      "Support multi-pet households with per-pet timelines and profiles.",
      "Reach 10k monthly active users within two quarters of launch.",
    ],
  },
  {
    id: "functional",
    title: "Functional requirements",
    bullets: [
      "Authentication — email/password sign up & sign in, OTP verification, password reset, session management and logout-everywhere.",
      "Pet profiles — species, breed, weight history, photos, allergies and medications per pet.",
      "Appointments — vet search, slot selection, booking confirmation, rescheduling and cancellation.",
      "Vaccination tracker — schedule templates per species with due/overdue states and vet sign-off.",
      "Reminders — push notifications for appointments, vaccinations and medication doses.",
      "Health records — document upload (PDF, images), visit summaries and shareable export.",
    ],
  },
  {
    id: "nonfunctional",
    title: "Non-functional requirements",
    bullets: [
      "Availability — 99.9% uptime SLA for booking and reminder services.",
      "Security & privacy — HIPAA-aligned handling of health data; encryption at rest and in transit.",
      "Performance — p95 API latency under 300 ms; cold app start under 2.5 s on mid-range devices.",
      "Accessibility — WCAG 2.1 AA compliance across all core flows.",
      "Scalability — horizontal scaling of the FastAPI layer to 50k concurrent users.",
    ],
  },
  {
    id: "constraints",
    title: "Constraints",
    bullets: [
      "Mobile stack fixed to React Native (Expo) for iOS/Android parity.",
      "Backend limited to FastAPI + PostgreSQL; no additional datastore in v1.",
      "LLM usage capped by the workspace token budget (100,000 tokens for PawCare).",
      "v1 launch scope is dogs and cats only; exotic pets deferred to v2.",
    ],
  },
];

const addableSections = [
  "Problem statement",
  "Target audience",
  "Success metrics",
  "Homepage module",
  "Social proof section",
];

export function DocumentsTab() {
  const [sections, setSections] = useState<DocSection[]>(initialSections);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [somethingElse, setSomethingElse] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [confirm, setConfirm] = useState<{
    title: string;
    section: string;
  } | null>(null);

  const addSections = () => {
    const picked = addableSections.filter((s) => checked[s]);
    const extra = somethingElse.trim();
    const titles = extra ? [...picked, extra] : picked;
    if (titles.length === 0) return;
    setSections((prev) => [
      ...prev,
      ...titles.map((t) => ({
        id: `${t}-${Date.now()}`,
        title: t,
        paragraphs: [
          `Draft content for “${t}” will be generated on the next document regeneration.`,
        ],
      })),
    ]);
    setChecked({});
    setSomethingElse("");
    setPopoverOpen(false);
    toast.success(
      `${titles.length} section${titles.length > 1 ? "s" : ""} added`,
    );
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">
            PawCare — Requirement Document
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            v03 · Generated May 2026
          </p>
        </div>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="size-3.5" aria-hidden />
              Add sections
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Add sections to this document
            </p>
            <div className="mt-2 space-y-2">
              {addableSections.map((s) => (
                <label
                  key={s}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={!!checked[s]}
                    onCheckedChange={(v) =>
                      setChecked((prev) => ({ ...prev, [s]: v === true }))
                    }
                  />
                  {s}
                </label>
              ))}
            </div>
            <Input
              value={somethingElse}
              onChange={(e) => setSomethingElse(e.target.value)}
              placeholder="Something else"
              className="mt-3 h-8 text-xs"
            />
            <Button size="sm" className="mt-3 w-full" onClick={addSections}>
              Add
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        {sections.map((s, i) => (
          <motion.section
            key={s.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 6) * 0.04, duration: 0.25 }}
            className={panelClasses()}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{s.title}</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() =>
                    setConfirm({ title: `Edit ${s.title}?`, section: s.title })
                  }
                >
                  <Pencil className="size-3" aria-hidden />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() =>
                    setConfirm({
                      title: `Regenerate ${s.title}?`,
                      section: s.title,
                    })
                  }
                >
                  <Sparkles className="size-3" aria-hidden />
                  Regenerate
                </Button>
              </div>
            </div>
            {s.paragraphs?.map((p, j) => (
              <p
                key={j}
                className="mt-2.5 text-sm leading-relaxed text-foreground/90"
              >
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-2.5 space-y-1.5">
                {s.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2 text-sm leading-relaxed">
                    <span
                      className="mt-2 size-1 shrink-0 rounded-full bg-brand"
                      aria-hidden
                    />
                    <span className="text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() =>
            setConfirm({
              title: "Regenerate document?",
              section: "Requirement document",
            })
          }
        >
          <RefreshCw className="size-3.5" aria-hidden />
          Regenerate document
        </Button>
        <Button
          onClick={() => toast.success("Requirement document v03 approved")}
        >
          <Check className="size-3.5" aria-hidden />
          Approve
        </Button>
      </div>

      <AiCostConfirm
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm?.title ?? ""}
        sectionLabel={confirm?.section ?? ""}
        onProceed={() => toast.success("Regeneration queued — you'll be notified")}
      />
    </div>
  );
}
