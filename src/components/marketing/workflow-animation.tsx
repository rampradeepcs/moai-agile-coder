"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  Check,
  FileText,
  Kanban,
  Layers,
  MessageSquareText,
  Palette,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stages = [
  { icon: MessageSquareText, title: "Describe your product", artifact: "“An AI-powered pet care platform…”" },
  { icon: FileText, title: "Requirement document", artifact: "12 requirements drafted" },
  { icon: Palette, title: "Design document", artifact: "Logo, colors & typography picked" },
  { icon: Layers, title: "Epics & stories", artifact: "9 epics · 24 stories generated" },
  { icon: Kanban, title: "Board runs itself", artifact: "AI agents move the work" },
  { icon: Rocket, title: "Release", artifact: "V1.0 ready to ship" },
];

const STEP_MS = 1700;

/**
 * Looping product-workflow animation for the auth panel: a pulse travels
 * down the pipeline and lights each stage as the AI "completes" it.
 */
export function WorkflowAnimation() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (stages.length + 1)), STEP_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  // With reduced motion, show the finished pipeline.
  const current = reduceMotion ? stages.length : step;

  return (
    <div className="relative w-[400px] max-w-full">
      {/* AI orb */}
      <div className="mb-6 flex items-center gap-3">
        <span className="relative grid size-11 place-items-center rounded-xl bg-brand-gradient text-white shadow-elevation-mid">
          <Bot className="size-5" aria-hidden />
          {!reduceMotion && (
            <motion.span
              className="absolute inset-0 rounded-xl bg-brand-gradient"
              animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.35, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ zIndex: -1 }}
            />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "oklch(0.97 0.005 286)" }}>
            WizKraft is working…
          </p>
          <p className="text-xs" style={{ color: "oklch(0.72 0.02 155)" }}>
            from idea to release, one pipeline
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Connector rail */}
        <div
          className="absolute bottom-7 left-[21px] top-2 w-px"
          style={{ background: "oklch(1 0 0 / 14%)" }}
        />
        {/* Traveling pulse */}
        {!reduceMotion && (
          <motion.span
            className="absolute left-[18.5px] z-10 size-1.5 rounded-full"
            style={{
              background: "oklch(0.767 0.18 155)",
              boxShadow: "0 0 12px 3px oklch(0.7 0.17 155 / 75%)",
            }}
            animate={{ top: stages.map((_, i) => i * 68 + 20) }}
            transition={{ duration: (stages.length * STEP_MS) / 1000, repeat: Infinity, ease: "linear" }}
          />
        )}

        <ul className="flex flex-col gap-3">
          {stages.map((stage, i) => {
            const state = i < current ? "done" : i === current ? "active" : "pending";
            return (
              <motion.li
                key={stage.title}
                initial={false}
                animate={{
                  scale: state === "active" ? 1.02 : 1,
                  opacity: state === "pending" ? 0.55 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className={cn(
                  "relative flex h-14 items-center gap-3 rounded-xl border px-3 backdrop-blur-sm transition-colors",
                  state === "active"
                    ? "border-white/25 bg-white/10 shadow-[0_8px_32px_-8px_oklch(0.5_0.16_155/60%)]"
                    : "border-white/10 bg-white/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-xl transition-colors",
                    state === "pending" ? "bg-white/10 text-white/50" : "bg-brand-gradient text-white",
                  )}
                >
                  {state === "done" ? <Check className="size-4" aria-hidden /> : <stage.icon className="size-4" aria-hidden />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium" style={{ color: "oklch(0.96 0.005 286)" }}>
                    {stage.title}
                  </span>
                  <AnimatePresence initial={false}>
                    {state !== "pending" && (
                      <motion.span
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="block truncate text-[11px]"
                        style={{ color: "oklch(0.7 0.03 155)" }}
                      >
                        {stage.artifact}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <AnimatePresence initial={false}>
                  {state === "active" && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="flex gap-0.5"
                      aria-hidden
                    >
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="size-1 rounded-full bg-white/80"
                          animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.18 }}
                        />
                      ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
