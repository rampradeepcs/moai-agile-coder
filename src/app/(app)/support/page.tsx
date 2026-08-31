"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  CheckCircle2,
  Keyboard,
  LifeBuoy,
  MessageSquareText,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, SearchInput } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RESOURCES = [
  {
    icon: Rocket,
    title: "Getting started",
    desc: "From product idea to a running board in 10 minutes.",
    className: "bg-brand-subtle text-brand",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    desc: "Guides for pipelines, AI agents, tokens and releases.",
    className: "bg-teal-subtle text-teal",
  },
  {
    icon: Keyboard,
    title: "Keyboard shortcuts",
    desc: "⌘K opens search — and everything else worth knowing.",
    className: "bg-warning-subtle text-warning",
  },
];

const FAQS = [
  {
    q: "How do credits work?",
    a: "Every AI action — generating documents, stories, designs or chat replies — consumes credits. Your plan refreshes a monthly allowance, and purchased credit packs never expire; they're consumed after the monthly allowance runs out. Track everything under Usage.",
  },
  {
    q: "What happens when a task reaches Completed?",
    a: "When a task is moved to the Completed stage of a pipeline it automatically moves to the To Do stage of the next pipeline, so work flows from Project management through Design, Development and Testing without manual grooming.",
  },
  {
    q: "Can I control what AI agents do on their own?",
    a: "Yes — Settings → Skills defines exactly which actions agents may take autonomously. Disable a skill and its agent will draft suggestions but never act without a human approving.",
  },
  {
    q: "How do I add teammates?",
    a: "Invite people from Workforce → Invite users, or from a project's topbar invite action. Seats are counted against your plan — you can see the current seat usage under Subscription.",
  },
  {
    q: "Which LLMs can projects use?",
    a: "Each project picks its model in Configure → App settings (Claude, GPT and Gemini families are built in). Enterprise plans can bring custom LLM endpoints.",
  },
];

export default function SupportPage() {
  const [query, setQuery] = useState("");
  const [sent, setSent] = useState(false);

  const faqs = FAQS.filter(
    (f) => !query || (f.q + f.a).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-6">
      <PageHeader
        title="Support"
        description="Answers, guides, and a direct line to us."
        actions={
          <span className="flex items-center gap-1.5 rounded-md bg-success-subtle px-2.5 py-1 text-[11px] font-medium text-success">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            All systems operational
          </span>
        }
      />

      {/* Search */}
      <SearchInput
        size="lg"
        value={query}
        onValueChange={setQuery}
        placeholder="Search help articles and FAQs…"
        aria-label="Search help"
      />

      {/* Quick resources */}
      <div className="grid gap-3 sm:grid-cols-3">
        {RESOURCES.map((r) => (
          <button
            key={r.title}
            type="button"
            onClick={() => toast(`${r.title} opens in the help center`)}
            className="flex flex-col items-start gap-2.5 rounded-xl bg-card p-4 text-left shadow-soft transition-colors hover:bg-accent/40"
          >
            <span className={cn("grid size-9 place-items-center rounded-lg", r.className)}>
              <r.icon className="size-4.5" aria-hidden />
            </span>
            <span className="text-[13px] font-semibold">{r.title}</span>
            <span className="text-xs leading-relaxed text-muted-foreground">{r.desc}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* FAQs */}
        <section className="rounded-xl bg-card p-5 shadow-soft">
          <h2 className="mb-2 text-sm font-semibold">Frequently asked</h2>
          {faqs.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-muted-foreground">
              No answers match “{query}” — send us a message instead.
            </p>
          ) : (
            <Accordion type="single" collapsible>
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left text-[13px] font-medium">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </section>

        {/* Contact */}
        <section className="flex h-fit flex-col gap-4 rounded-xl bg-card p-5 shadow-soft">
          {sent ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-success-subtle text-success">
                <CheckCircle2 className="size-6" aria-hidden />
              </span>
              <p className="text-sm font-semibold">Message sent</p>
              <p className="max-w-60 text-xs leading-relaxed text-muted-foreground">
                Our team replies within 4 hours on the Pro plan. We&apos;ll get back to you at
                khalil@moaiconsulting.co.in.
              </p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setSent(false)}>
                Send another
              </Button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-3.5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-lg bg-brand-subtle text-brand">
                  <LifeBuoy className="size-4.5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">Contact support</h2>
                  <p className="text-[11px] text-muted-foreground">Replies within 4 hours on Pro</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sup-topic">Topic</Label>
                <Select defaultValue="billing">
                  <SelectTrigger id="sup-topic" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billing">Billing & credits</SelectItem>
                    <SelectItem value="agents">AI agents & skills</SelectItem>
                    <SelectItem value="bug">Something looks broken</SelectItem>
                    <SelectItem value="feature">Feature request</SelectItem>
                    <SelectItem value="other">Something else</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sup-subject">Subject</Label>
                <Input id="sup-subject" required placeholder="Short summary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sup-message">Message</Label>
                <Textarea
                  id="sup-message"
                  required
                  rows={4}
                  placeholder="What's happening? Include a project or task key if relevant."
                />
              </div>
              <Button type="submit" className="gap-1.5">
                <MessageSquareText className="size-4" aria-hidden />
                Send message
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
