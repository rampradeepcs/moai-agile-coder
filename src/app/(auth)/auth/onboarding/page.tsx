"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = 4;

const USAGE_OPTIONS = [
  { id: "individual", num: "01", title: "Individual use", body: "Plan and ship your own projects with AI doing the heavy lifting." },
  { id: "team", num: "02", title: "Team & company use", body: "Coordinate sprints, pipelines and agents across your whole team." },
];

const ROLE_OPTIONS = [
  "Project Manager",
  "Product Manager",
  "Startup Founder",
  "Engineering Manager",
  "Agency",
  "Developer",
  "Something else",
];

const TEAM_SIZE_OPTIONS = ["2–5 members", "5–20 members", "20–50 members", "100+ members"];

const PRO_FEATURES = [
  "Unlimited Projects",
  "Unlimited Team Members",
  "Unlimited AI Generations",
  "Advanced Sprint Analytics",
  "500 AI Credits / month",
  "Ability to buy additional credits",
  "Basic Analytics",
];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [usage, setUsage] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [teamSize, setTeamSize] = React.useState<string | null>(null);
  const [billing, setBilling] = React.useState<"monthly" | "yearly">("monthly");

  const selections = [usage, role, teamSize];
  const canNext = step < 3 && selections[step] !== null;

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  return (
    <div>
      {/* Progress dots + skip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2" aria-label={`Step ${step + 1} of ${STEPS}`}>
          {Array.from({ length: STEPS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-6 bg-brand-gradient" : "w-1.5 bg-border",
                i < step && "bg-primary/40"
              )}
            />
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/apps")}>
          Skip
        </Button>
      </div>

      <div className="mt-8 min-h-[26rem]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {step === 0 && (
            <motion.div
              key="usage"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold tracking-tight text-balance">
                How will you use agile coder?
              </h1>
              <div className="mt-6 space-y-3">
                {USAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setUsage(opt.id)}
                    aria-pressed={usage === opt.id}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/40",
                      usage === opt.id && "border-primary ring-2 ring-primary/30"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        usage === opt.id ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {opt.num}
                    </span>
                    <span>
                      <span className="block font-semibold tracking-tight">{opt.title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {opt.body}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="role"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold tracking-tight text-balance">
                What best describes you?
              </h1>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRole(opt)}
                    aria-pressed={role === opt}
                    className={cn(
                      "rounded-lg border bg-card px-4 py-2 text-sm transition-all hover:border-primary/40",
                      role === opt
                        ? "border-primary bg-brand-subtle font-medium text-brand ring-1 ring-primary/40"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="teamsize"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold tracking-tight text-balance">
                How big is your team?
              </h1>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {TEAM_SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTeamSize(opt)}
                    aria-pressed={teamSize === opt}
                    className={cn(
                      "rounded-xl border bg-card p-4 text-center text-sm font-medium transition-all hover:border-primary/40",
                      teamSize === opt && "border-primary ring-2 ring-primary/30"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="plan"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold tracking-tight text-balance">
                Pick your plan
              </h1>
              <div className="mt-6 rounded-xl border border-primary bg-card p-6 shadow-elevation-mid">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold tracking-tight">Agile coder Pro</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Everything you need to ship faster.
                    </p>
                  </div>
                  <div
                    className="flex items-center rounded-full border bg-muted p-0.5"
                    role="group"
                    aria-label="Billing period"
                  >
                    {(["monthly", "yearly"] as const).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBilling(b)}
                        aria-pressed={billing === b}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors",
                          billing === b
                            ? "bg-card text-foreground shadow-elevation-low"
                            : "text-muted-foreground"
                        )}
                      >
                        {b}
                        {b === "yearly" && (
                          <span className="rounded-md bg-success-subtle px-1.5 py-px text-[10px] font-semibold text-success">
                            -20%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight">
                    ${billing === "yearly" ? "19" : "24"}
                  </span>
                  <span className="text-sm text-muted-foreground">/ user / month</span>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="size-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => router.push("/apps")}
                >
                  Start free trial
                </Button>
                <Button
                  variant="ghost"
                  className="mt-2 w-full text-muted-foreground"
                  onClick={() => router.push("/apps")}
                >
                  Continue with free plan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prev / Next */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => go(step - 1)}
          disabled={step === 0}
        >
          Previous
        </Button>
        {step < 3 && (
          <Button onClick={() => go(step + 1)} disabled={!canNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
