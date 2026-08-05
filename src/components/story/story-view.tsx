"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/lib/types";
import { childrenOf } from "@/lib/data";
import { statusConfig, TypeBadge } from "@/components/work/badges";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bot,
  CheckCircle2,
  Circle,
  Loader2,
  Send,
  Share2,
  Sparkles,
} from "lucide-react";

const progressSteps = [
  "Reading Requirements",
  "Understanding User Flows",
  "Loading Design System",
  "Planning Layout",
  "Designing Dashboard",
  "Syncing with Figma",
];

const acceptanceCriteria = [
  "Dashboard loads health summary cards for every pet in the household.",
  "Upcoming appointments and vaccination due dates appear above the fold.",
  "Design uses the PawCare token set and passes WCAG 2.1 AA contrast.",
  "Layout adapts from 320 px phones to tablet split-view without clipping.",
];

interface ChatMessage {
  id: number;
  role: "user" | "agent";
  text: string;
}

export function StoryView({ slug, item }: { slug: string; item: WorkItem }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const announcedDone = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const siblings = item.parentId
    ? childrenOf(item.parentId).filter((w) => w.id !== item.id)
    : [];

  // Live AI progress — advance one step every ~1.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= progressSteps.length) {
          clearInterval(timer);
          return s;
        }
        return s + 1;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentStep >= progressSteps.length && !announcedDone.current) {
      announcedDone.current = true;
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "agent",
          text: "First draft is ready — check the preview ✨",
        },
      ]);
      toast.success("First draft ready", {
        description: "Echo synced the dashboard design to Figma.",
      });
    }
  }, [currentStep]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, currentStep]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: "user", text: trimmed },
    ]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "agent",
          text: "Got it — I'll fold that into the next iteration.",
        },
      ]);
    }, 1000);
  };

  const previewReady = currentStep >= 4;

  return (
    <div className="px-6 py-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
          <Link href="/apps" className="font-medium text-brand hover:underline">
            All applications
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href={`/apps/${slug}/dashboard`}
            className="font-medium text-brand hover:underline"
          >
            Paw care
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{item.key}</span>
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Created on Jun 23</span>
          <Button variant="outline" size="sm">
            <Share2 className="size-3.5" aria-hidden />
            Share
          </Button>
          <Button size="sm">
            <Bot className="size-3.5" aria-hidden />
            AI chat
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* LEFT */}
        <div className="min-w-0 space-y-5">
          {/* Figma preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-xl border bg-card shadow-elevation-low"
          >
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <h2 className="text-sm font-semibold">Figma Preview</h2>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="size-3 text-brand" aria-hidden />
                Live from Echo
              </span>
            </div>
            <div
              className="relative m-3 aspect-[16/10] overflow-hidden rounded-xl border"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            >
              <AnimatePresence mode="wait">
                {!previewReady ? (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <p className="text-xs text-muted-foreground">
                      Preview will appear as the agent works…
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 flex flex-col gap-2 p-3"
                  >
                    {/* mock dashboard skeleton */}
                    <div className="flex h-8 items-center gap-2 rounded-lg border bg-card px-2.5">
                      <Skeleton className="size-4 animate-pulse rounded-full" />
                      <Skeleton className="h-2.5 w-24 animate-pulse" />
                      <div className="ml-auto flex gap-1.5">
                        <Skeleton className="size-4 animate-pulse rounded-full" />
                        <Skeleton className="size-4 animate-pulse rounded-full" />
                      </div>
                    </div>
                    <div className="flex min-h-0 flex-1 gap-2">
                      <div className="hidden w-24 flex-col gap-1.5 rounded-lg border bg-card p-2 sm:flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-2.5 w-full animate-pulse"
                          />
                        ))}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="rounded-lg border bg-card p-2.5"
                            >
                              <Skeleton className="h-2 w-10 animate-pulse" />
                              <Skeleton className="mt-2 h-3.5 w-14 animate-pulse" />
                            </div>
                          ))}
                        </div>
                        <div className="flex min-h-0 flex-1 items-end gap-1.5 rounded-lg border bg-card p-3">
                          {[40, 65, 50, 80, 60, 90, 70, 55].map((h, i) => (
                            <Skeleton
                              key={i}
                              className="w-full animate-pulse rounded-sm"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Story content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
            className="rounded-xl border bg-card p-5 shadow-elevation-low"
          >
            <div className="flex items-center gap-2">
              <TypeBadge type={item.type} />
              <span className="text-[11px] text-muted-foreground">
                {item.key}
              </span>
            </div>
            <h1 className="mt-2 text-base font-semibold">{item.title}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {item.description ??
                "Design and ship the PawCare home dashboard — health summary cards per pet, upcoming appointments, vaccination due dates and quick actions, generated against the PawCare design system."}
            </p>

            <h3 className="mt-5 text-xs font-semibold text-muted-foreground">
              Acceptance criteria
            </h3>
            <ul className="mt-2 space-y-2">
              {acceptanceCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Checkbox
                    id={`ac-${i}`}
                    defaultChecked={i < 2}
                    className="mt-0.5"
                  />
                  <label htmlFor={`ac-${i}`} className="cursor-pointer text-sm">
                    {c}
                  </label>
                </li>
              ))}
            </ul>

            {siblings.length > 0 && (
              <>
                <h3 className="mt-5 text-xs font-semibold text-muted-foreground">
                  Mapped tasks
                </h3>
                <ul className="mt-2 divide-y rounded-lg border">
                  {siblings.map((s) => {
                    const sc = statusConfig[s.status];
                    return (
                      <li
                        key={s.id}
                        className="flex items-center gap-2.5 px-3 py-2"
                      >
                        <sc.icon
                          className={cn(
                            "size-3.5 shrink-0 rounded-full",
                            sc.className,
                          )}
                          aria-label={sc.label}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm">
                          {s.title}
                        </span>
                        <TypeBadge type={s.type} />
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {s.key}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </motion.div>
        </div>

        {/* RIGHT — AI chat */}
        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.12, ease: "easeOut" }}
          className="sticky top-24 flex h-[calc(100svh-180px)] flex-col rounded-xl border bg-card shadow-elevation-low"
        >
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Bot className="size-4 text-brand" aria-hidden />
            <h2 className="text-sm font-semibold">AI chat</h2>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success-subtle px-2 py-0.5 text-[10px] font-medium text-success">
              <span aria-hidden>●</span> Echo online
            </span>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-3 p-4">
              {/* user bubble */}
              <div className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                  Start the dashboard design for this story
                </p>
              </div>

              {/* agent message */}
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5">
                  <p className="text-sm font-medium">
                    Starting design for &ldquo;PawCare Dashboard&rdquo;…
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    I&apos;m reviewing the requirements, design system, user
                    flows, and brand guidelines to create the first draft.
                  </p>
                </div>
              </div>

              {/* progress checklist */}
              <div className="rounded-2xl border bg-muted/40 p-3.5">
                <ul className="space-y-2.5">
                  {progressSteps.map((step, i) => {
                    const done = i < currentStep;
                    const current = i === currentStep;
                    return (
                      <li key={step} className="flex items-center gap-2.5">
                        {done ? (
                          <CheckCircle2
                            className="size-4 shrink-0 text-success"
                            aria-hidden
                          />
                        ) : current ? (
                          <Loader2
                            className="size-4 shrink-0 animate-spin text-brand"
                            aria-hidden
                          />
                        ) : (
                          <Circle
                            className="size-4 shrink-0 text-muted-foreground/50"
                            aria-hidden
                          />
                        )}
                        <span
                          className={cn(
                            "text-sm",
                            done && "text-foreground",
                            current && "font-medium text-brand",
                            !done && !current && "text-muted-foreground",
                          )}
                        >
                          {step}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* appended messages */}
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <p
                      className={cn(
                        "max-w-[85%] px-3.5 py-2 text-sm",
                        m.role === "user"
                          ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-2xl rounded-bl-md bg-muted",
                      )}
                    >
                      {m.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* input */}
          <div className="border-t p-3">
            <button
              type="button"
              onClick={() => send("User Authentication")}
              className="mb-2 rounded-full border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              User Authentication
            </button>
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Chat anything about this app?"
                className="h-9"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                disabled={!input.trim()}
              >
                <Send className="size-4" aria-hidden />
              </Button>
            </form>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
