"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowUp, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PromptCard } from "@/components/marketing/prompt-card";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Script definition                                                   */
/* ------------------------------------------------------------------ */

type NodeKind = "single" | "multi" | "name" | "llm" | "summary";

interface ScriptNode {
  id: string;
  kind: NodeKind;
  question: (appName: string) => string;
  options?: string[];
}

const SCRIPT: Record<string, ScriptNode> = {
  platform: {
    id: "platform",
    kind: "single",
    question: () =>
      "Great! Share your choices and I'll get started building your pet care platform right away. Which platform do you want to build for?",
    options: ["API", "CLI", "Desktop", "Library", "Mobile App (iOS/Android)", "Plugin", "SAAS", "Web"],
  },
  name: {
    id: "name",
    kind: "name",
    question: () =>
      "Perfect! A few quick questions to shape your app's identity. What would you like to name your app?",
    options: ["Paw care", "VetGo", "Petpulse"],
  },
  status: {
    id: "status",
    kind: "single",
    question: (n) => `Got it! Let's go step by step. What's the current status of ${n}?`,
    options: ["Active", "Inactive", "Deprecated"],
  },
  features: {
    id: "features",
    kind: "multi",
    question: (n) => `Which are the key features of ${n}? (select all that apply)`,
    options: [
      "Vet appointments",
      "Vaccine trackers",
      "Health records",
      "Smart care reminders",
      "AI pet health assistants",
      "Multiple pet profiles",
    ],
  },
  llm: {
    id: "llm",
    kind: "llm",
    question: (n) => `Which LLM model should power ${n}'s AI features?`,
    options: ["GPT-5", "Claude Opus 4", "Claude Sonnet 4", "Gemini 2.5 Pro", "Google Gemini Pro"],
  },
  users: {
    id: "users",
    kind: "single",
    question: () => "Who are the primary users?",
    options: ["Pet owners", "Vet/clinic staff", "Admin", "All the above"],
  },
  modules: {
    id: "modules",
    kind: "multi",
    question: (n) => `Which modules should be part of ${n}? (select all that apply)`,
    options: [
      "Onboarding & Auth",
      "Pet profile management",
      "Vet appointment booking",
      "Vaccination tracking",
      "Health records",
      "Smart reminder",
      "AI health assistance",
      "Notification & alerts",
      "Settings and account",
      "Support",
      "All the above",
    ],
  },
  language: {
    id: "language",
    kind: "single",
    question: (n) => `Does ${n} need multi-language support?`,
    options: ["English only", "English + Regional languages", "Multi language support"],
  },
  languages: {
    id: "languages",
    kind: "multi",
    question: () => "Choose which languages",
    options: ["English", "Telugu", "Hindi", "Tamil", "Malayalam", "Marathi"],
  },
  summary: {
    id: "summary",
    kind: "summary",
    question: (n) => `All set! Here's the complete module summary for ${n}`,
  },
};

function nextNodeId(id: string, answer: string): string | null {
  switch (id) {
    case "platform":
      return "name";
    case "name":
      return "status";
    case "status":
      return "features";
    case "features":
      return "llm";
    case "llm":
      return "users";
    case "users":
      return "modules";
    case "modules":
      return "language";
    case "language":
      return answer.startsWith("Multi") ? "languages" : "summary";
    case "languages":
      return "summary";
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Messages                                                            */
/* ------------------------------------------------------------------ */

type Msg =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "bot"; nodeId: string };

const SUGGESTIONS = [
  "Develop a pet care platform for owners and vets…",
  "Build an AI-powered agile workspace…",
];

let msgId = 0;

/* ------------------------------------------------------------------ */

export function ChatFlow({
  onReachGathering,
  onApprove,
}: {
  onReachGathering: () => void;
  onApprove: () => void;
}) {
  const [msgs, setMsgs] = React.useState<Msg[]>([]);
  const [typing, setTyping] = React.useState(false);
  const [activeNodeId, setActiveNodeId] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [freeText, setFreeText] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const started = msgs.length > 0;

  const appName = (answers.name ?? "PawCare").replace(/\s+/g, "") === "Pawcare"
    ? "PawCare"
    : answers.name ?? "PawCare";

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing]);

  const pushBot = React.useCallback(
    (nodeId: string) => {
      setActiveNodeId(null);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, { id: ++msgId, role: "bot", nodeId }]);
        setActiveNodeId(nodeId);
      }, 700);
    },
    []
  );

  const start = (prompt: string) => {
    const text = prompt || "I want to build a pet care platform for pet owners and vets.";
    setMsgs([{ id: ++msgId, role: "user", text }]);
    pushBot("platform");
  };

  const answer = (nodeId: string, display: string) => {
    setMsgs((m) => [...m, { id: ++msgId, role: "user", text: display }]);
    setAnswers((a) => ({ ...a, [nodeId]: display }));
    const next = nextNodeId(nodeId, display);
    if (next) {
      if (next === "users") onReachGathering();
      pushBot(next);
    } else {
      setActiveNodeId(null);
    }
  };

  const handleFreeText = (e: React.FormEvent) => {
    e.preventDefault();
    const text = freeText.trim();
    if (!text) return;
    setFreeText("");
    const node = activeNodeId ? SCRIPT[activeNodeId] : null;
    if (node && (node.kind === "single" || node.kind === "name" || node.kind === "llm")) {
      answer(node.id, text);
    } else {
      toast.info("Pick from the options above to continue.");
    }
  };

  /* -------------------------- hero state -------------------------- */
  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-1 flex-col items-center justify-center px-6 pb-24"
      >
        <h1 className="text-3xl font-bold tracking-tight text-balance text-center">
          What are we building today?
        </h1>
        <div className="mt-8 w-full max-w-2xl">
          <PromptCard onSubmit={start} autoFocus />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => start(s)}
              className="rounded-full border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  /* -------------------------- chat state -------------------------- */
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-8">
          <AnimatePresence initial={false}>
            {msgs.map((msg) =>
              msg.role === "user" ? (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <span className="max-w-[80%] rounded-full bg-brand-gradient px-3 py-1.5 text-sm text-white shadow-elevation-low">
                    {msg.text}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <BotCard
                    node={SCRIPT[msg.nodeId]}
                    appName={appName}
                    active={activeNodeId === msg.nodeId}
                    answers={answers}
                    onAnswer={(display) => answer(msg.nodeId, display)}
                    onApproveClick={() => setApproveOpen(true)}
                  />
                </motion.div>
              )
            )}
          </AnimatePresence>

          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Docked composer */}
      <div className="border-t bg-background/80 backdrop-blur">
        <form
          onSubmit={handleFreeText}
          className="mx-auto flex w-full max-w-3xl items-center gap-2 px-6 py-4"
        >
          <Input
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Write a message"
            aria-label="Write a message"
            className="h-10 rounded-full px-4"
          />
          <Button
            type="submit"
            size="icon-lg"
            className="rounded-full"
            aria-label="Send message"
            disabled={!freeText.trim()}
          >
            <ArrowUp />
          </Button>
        </form>
      </div>

      {/* Approve dialog */}
      <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve requirement gatherings</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve all requirement gatherings and proceed to
              move on to Requirement document generation?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onApprove}>
              Generate requirement document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bot question card                                                   */
/* ------------------------------------------------------------------ */

function BotCard({
  node,
  appName,
  active,
  answers,
  onAnswer,
  onApproveClick,
}: {
  node: ScriptNode;
  appName: string;
  active: boolean;
  answers: Record<string, string>;
  onAnswer: (display: string) => void;
  onApproveClick: () => void;
}) {
  return (
    <div className="flex max-w-[92%] items-start gap-3">
      <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand">
        <Sparkles className="size-3.5" />
      </span>
      <div className="rounded-2xl bg-muted p-4">
        <p className="text-sm leading-relaxed">{node.question(appName)}</p>

        {active && node.kind === "single" && node.options && (
          <ChipRow options={node.options} onPick={onAnswer} />
        )}

        {active && node.kind === "name" && node.options && (
          <NameOptions options={node.options} onPick={onAnswer} />
        )}

        {active && node.kind === "multi" && node.options && (
          <MultiOptions options={node.options} onDone={(vals) => onAnswer(vals.join(", "))} />
        )}

        {active && node.kind === "llm" && node.options && (
          <div className="mt-3 overflow-hidden rounded-xl border bg-card">
            <Command>
              <CommandInput placeholder="Search models…" />
              <CommandList className="max-h-52">
                <CommandEmpty>No model found.</CommandEmpty>
                <CommandGroup>
                  {node.options.map((opt) => (
                    <CommandItem key={opt} value={opt} onSelect={() => onAnswer(opt)}>
                      {opt}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}

        {node.kind === "summary" && (
          <div className="mt-3 space-y-3">
            <div className="overflow-hidden rounded-xl border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Field</th>
                    <th className="px-4 py-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["App name", appName],
                    ["Platform", answers.platform ?? "—"],
                    ["Status", answers.status ?? "—"],
                    ["Industry", "Pet care"],
                    ["LLM", answers.llm ?? "—"],
                  ].map(([field, value]) => (
                    <tr key={field} className="border-b last:border-b-0">
                      <td className="px-4 py-2.5 text-muted-foreground">{field}</td>
                      <td className="px-4 py-2.5 font-medium">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {active && (
              <Button onClick={onApproveClick}>
                <Check />
                Approve requirement gatherings
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ChipRow({ options, onPick }: { options: string[]; onPick: (v: string) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onPick(opt)}
          className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-brand-subtle hover:text-brand"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function NameOptions({ options, onPick }: { options: string[]; onPick: (v: string) => void }) {
  const [custom, setCustom] = React.useState("");
  return (
    <div className="mt-3 space-y-2.5">
      <ChipRow options={options} onPick={onPick} />
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (custom.trim()) onPick(custom.trim());
        }}
      >
        <Input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Something else…"
          aria-label="Custom app name"
          className="h-8 max-w-52 rounded-full bg-card px-3 text-xs"
        />
        <Button type="submit" size="sm" variant="outline" disabled={!custom.trim()}>
          Use name
        </Button>
      </form>
    </div>
  );
}

function MultiOptions({
  options,
  onDone,
}: {
  options: string[];
  onDone: (vals: string[]) => void;
}) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const toggle = (opt: string) =>
    setSelected((s) => (s.includes(opt) ? s.filter((o) => o !== opt) : [...s, opt]));

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={isSelected}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              isSelected
                ? "border-transparent bg-brand-gradient text-white shadow-elevation-low"
                : "bg-card hover:border-primary/50"
            )}
          >
            {isSelected && <Check className="size-3" />}
            {opt}
          </button>
        );
      })}
      <Button
        size="sm"
        className="rounded-full"
        disabled={selected.length === 0}
        onClick={() => onDone(selected)}
      >
        Done
      </Button>
    </div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
      aria-label="Agile Coder is typing"
    >
      <span className="flex size-7 items-center justify-center rounded-lg bg-brand-subtle text-brand">
        <Sparkles className="size-3.5" />
      </span>
      <span className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </motion.div>
  );
}
