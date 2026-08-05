"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: number;
  role: "user" | "ai";
  text: string;
}

const cannedReplies = [
  "On it — I'm looking across your Paw care workspace. Sprint 24 is at 72% with 3 items likely to slip; want me to draft a re-plan?",
  "Done. I've summarised the backlog: 9 epics, 24 stories, 2 open bugs. The riskiest item is PC-7364 (auth) — it blocks 2 downstream tasks.",
  "Good question — the Design pipeline is the current bottleneck. Echo finished low-fidelity; high-fidelity has no agent assigned yet.",
];

export default function AiChatPage() {
  const [greeting, setGreeting] = useState("Hello!");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const nextId = useRef(1);
  const replyIdx = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning!" : h < 17 ? "Good afternoon!" : "Good evening!");
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = () => {
    const text = draft.trim();
    if (!text || thinking) return;
    setDraft("");
    setMessages((m) => [...m, { id: nextId.current++, role: "user", text }]);
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: nextId.current++, role: "ai", text: cannedReplies[replyIdx.current++ % cannedReplies.length] },
      ]);
      setThinking(false);
    }, 1100);
  };

  return (
    <div className="relative flex h-[calc(100svh-152px)] flex-col overflow-hidden">
      {/* Watermark bolt */}
      <Zap
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 text-foreground opacity-[0.03]"
        strokeWidth={0.75}
      />

      {/* Thread / greeting */}
      <div className="relative flex-1 overflow-y-auto px-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-center gap-3 text-center text-3xl font-semibold tracking-tight md:text-4xl"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-brand-subtle text-brand">
                <Sparkles className="size-5" aria-hidden />
              </span>
              {greeting} How can I help you today!
            </motion.h2>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4 py-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "ai" && (
                    <span className="mr-2.5 mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-brand-subtle text-brand">
                      <Sparkles className="size-3.5" aria-hidden />
                    </span>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-brand-gradient text-white shadow-elevation-low"
                        : "border bg-card shadow-soft",
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {thinking && (
                <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-brand-subtle text-brand">
                    <Sparkles className="size-3.5" aria-hidden />
                  </span>
                  <span className="flex gap-1 rounded-2xl border bg-card px-4 py-3 shadow-soft" aria-label="AI is thinking">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="relative px-6 pb-6">
        <div className="relative mx-auto max-w-5xl rounded-3xl border bg-card shadow-elevation-mid focus-within:ring-2 focus-within:ring-ring/40">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Curious about something? Ask away!"
            aria-label="Ask the AI about this project"
            rows={5}
            className="w-full resize-none bg-transparent px-5 py-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={send}
            aria-label="Send message"
            disabled={!draft.trim() || thinking}
            className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-brand-gradient text-white shadow-elevation-mid transition-all enabled:hover:-translate-y-px enabled:hover:opacity-95 disabled:opacity-40"
          >
            <Send className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
