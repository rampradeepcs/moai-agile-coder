"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Input, OptionRow, Stepper } from "@/components";
import {
  AuthActions,
  AuthCard,
  AuthTextButton,
} from "@/components/auth/auth-primitives";

/*
 * Four-step onboarding from the Figma sign-up section, in canvas order:
 * how you'll use it → name the workspace → your role → team size.
 */
const USE_OPTIONS = ["Individual use", "Team & company use"];
const ROLE_OPTIONS = [
  "Product Manager",
  "Project Manager",
  "Startup Founder",
  "Engineering Manager",
  "Agency / Consultant",
  "Developer",
];
const TEAM_SIZES = ["Just me", "2 – 10", "11 – 50", "51 – 200", "201 – 500", "500+"];

const TOTAL = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [use, setUse] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [otherRole, setOtherRole] = useState("");
  const [teamSize, setTeamSize] = useState<string | null>(null);

  const canAdvance =
    (step === 1 && use !== null) ||
    (step === 2 && workspace.trim().length > 0) ||
    (step === 3 && role !== null) ||
    (step === 4 && teamSize !== null);

  const next = () => {
    if (step < TOTAL) setStep(step + 1);
    else router.push("/apps");
  };

  const heading = {
    1: { title: "How will you use WizKraft?", sub: "So we can shape the workspace around you." },
    2: { title: "Name your workspace", sub: "You can rename it at any time in settings." },
    3: { title: "What best describes you?", sub: "This tailors the templates we suggest first." },
    4: { title: "How big is your team?", sub: "We'll size sprints and pipelines to match." },
  }[step]!;

  return (
    <AuthCard onSubmit={() => canAdvance && next()}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-foreground sm:text-head-1">
            {heading.title}
          </h1>
          <Image
            src="/auth/ai-sparkle.svg"
            alt=""
            width={24}
            height={24}
            loading="eager"
            className="size-5 shrink-0 sm:size-6"
          />
        </div>
        <p className="text-body-md text-muted-foreground">{heading.sub}</p>
      </div>

      <div className="flex w-full items-baseline justify-between">
        <span className="text-body-lg font-medium text-foreground">
          {step === 1 && "Pick one to get started"}
          {step === 2 && "Workspace name"}
          {step === 3 && "Choose your role"}
          {step === 4 && "Select a range"}
        </span>
        <span className="text-body-md text-muted-foreground">
          {step}/{TOTAL}
        </span>
      </div>

      <div className="flex w-full flex-col gap-4">
        {step === 1 &&
          USE_OPTIONS.map((label, i) => (
            <OptionRow
              key={label}
              index={String(i + 1).padStart(2, "0")}
              label={label}
              selected={use === label}
              onSelect={() => setUse(label)}
            />
          ))}

        {step === 2 && (
          <Input
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            placeholder="e.g. Acme Product Team"
            aria-label="Workspace name"
            name="workspace"
            autoComplete="organization"
          />
        )}

        {step === 3 && (
          <>
            {ROLE_OPTIONS.map((label, i) => (
              <OptionRow
                key={label}
                index={String(i + 1).padStart(2, "0")}
                label={label}
                selected={role === label}
                onSelect={() => setRole(label)}
              />
            ))}
            <Input
              value={otherRole}
              onChange={(e) => setOtherRole(e.target.value)}
              placeholder="Something else — tell us"
              aria-label="Other role"
            />
          </>
        )}

        {step === 4 &&
          TEAM_SIZES.map((label, i) => (
            <OptionRow
              key={label}
              index={String(i + 1).padStart(2, "0")}
              label={label}
              selected={teamSize === label}
              onSelect={() => setTeamSize(label)}
            />
          ))}
      </div>

      <AuthActions>
        {step > 1 && (
          <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button type="submit" disabled={!canAdvance}>
          {step === TOTAL ? "Enter workspace" : "Continue"}
        </Button>
      </AuthActions>

      <div className="flex w-full flex-col gap-4">
        <Stepper step={step} total={TOTAL} />
        {/*
          Without this the flow is a dead end on step 1: no Back, and no way to
          reach the workspace. Every answer here is refinable later in settings.
        */}
        <AuthTextButton onClick={() => router.push("/apps")}>
          Skip for now
        </AuthTextButton>
      </div>
    </AuthCard>
  );
}
