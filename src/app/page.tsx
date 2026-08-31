"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, FileText, Kanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";
import { PromptCard } from "@/components/marketing/prompt-card";
import { panelClasses } from "@/components/shared";

const NAV_LINKS = ["Product", "Pricing", "Docs", "Changelog"];

const SUGGESTIONS = [
  "Develop a fitness coaching mobile app…",
  "Build an AI-powered agile workspace…",
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI agents run your pipeline",
    body: "Assign work to autonomous agents that pick up tickets, move stages, and report back — while your team stays focused on the product.",
  },
  {
    icon: FileText,
    title: "Docs that write themselves",
    body: "Requirement and design documents are generated from a short conversation, kept in sync with the work as it evolves.",
  },
  {
    icon: Kanban,
    title: "A board that moves itself",
    body: "Epics, stories and tasks are created, estimated and sequenced automatically — the board reflects reality without manual grooming.",
  },
];

const STATS = [
  { value: "10k+", label: "teams onboard" },
  { value: "1.2M", label: "tickets generated" },
  { value: "38%", label: "faster sprints" },
  { value: "99.9%", label: "uptime" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-svh overflow-x-clip">
      {/* Background — soft blue glow + faint masked grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute left-1/3 top-[-10rem] h-[22rem] w-[26rem] -translate-x-1/2 rounded-full bg-info/10 blur-[100px]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 55% at 50% 0%, black 20%, transparent 75%)",
          }}
        />
      </div>

      {/* Nav */}
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link}
              href="#"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Start for free</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-24 pt-20 text-center sm:pt-28"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-elevation-low"
        >
          <span className="text-primary">✦</span> AI-native project management
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-6 text-6xl font-bold tracking-tight text-balance sm:text-7xl"
        >
          Agile{" "}
          <span className="text-primary">
            Execution
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance"
        >
          Describe your product and workflow goals — Agile Coder will generate structured
          project architecture powered by AI.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 w-full max-w-2xl">
          <PromptCard href="/apps/new" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          {SUGGESTIONS.map((s) => (
            <Link
              key={s}
              href="/apps/new"
              className="rounded-lg border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </Link>
          ))}
        </motion.div>
      </motion.section>

      {/* Features */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto grid w-full max-w-5xl gap-5 px-6 pb-24 md:grid-cols-3"
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={fadeUp}
            className={panelClasses({ padding: "lg", className: "transition-shadow hover:shadow-elevation-mid" })}
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand-subtle text-brand">
              <f.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Stat strip */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto w-full max-w-5xl px-6 pb-24"
      >
        <motion.div
          variants={fadeUp}
          className={panelClasses({ padding: "none", className: "grid grid-cols-2 gap-8 px-8 py-10 sm:grid-cols-4" })}
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold tracking-tight sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">© 2026 Agile Coder</p>
          <nav className="flex items-center gap-4" aria-label="Footer">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
