"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { evaluatePassword, type PasswordEvaluation } from "@/lib/password";

export interface PasswordCriteriaProps {
  /** The password being typed. */
  value: string;
  /** Hides the strength meter, leaving only the requirement list. */
  showStrength?: boolean;
  /** Ties the list to its field via aria-describedby. */
  id?: string;
  className?: string;
}

const STRENGTH_LABEL: Record<PasswordEvaluation["strength"], string> = {
  "too-weak": "Too weak",
  empty: "",
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

const STRENGTH_BAR: Record<PasswordEvaluation["strength"], string> = {
  "too-weak": "bg-border",
  empty: "bg-border",
  weak: "bg-error-500",
  fair: "bg-warning-600",
  good: "bg-brand-600",
  strong: "bg-brand-700",
};

const STRENGTH_TEXT: Record<PasswordEvaluation["strength"], string> = {
  "too-weak": "text-muted-foreground",
  empty: "text-muted-foreground",
  weak: "text-error-600",
  fair: "text-warning-900",
  good: "text-brand-900",
  strong: "text-brand-900",
};

/**
 * Live requirement checklist for a password field, driven by the shared rules
 * in `@/lib/password` so it cannot disagree with what validation enforces.
 *
 * The rules are all listed from the outset rather than revealed as they fail:
 * someone should be able to read the requirements before choosing, not
 * discover them one rejection at a time.
 */
export function PasswordCriteria({
  value,
  showStrength = true,
  id,
  className,
}: PasswordCriteriaProps) {
  const { rules, isValid, strength, score } = evaluatePassword(value);

  return (
    <div id={id} className={cn("flex w-full flex-col gap-3", className)}>
      {showStrength && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-caption-1 text-muted-foreground">Password strength</span>
            {strength !== "empty" && (
              <span className={cn("text-caption-1 font-medium", STRENGTH_TEXT[strength])}>
                {STRENGTH_LABEL[strength]}
              </span>
            )}
          </div>
          <div className="flex gap-1.5" aria-hidden>
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  step <= score ? STRENGTH_BAR[strength] : "bg-border",
                )}
              />
            ))}
          </div>
        </div>
      )}

      <ul className="flex flex-col gap-1.5">
        {rules.map(({ rule, met }) => (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-2 text-caption-1 transition-colors",
              met ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "grid size-4 shrink-0 place-items-center rounded-full border transition-colors",
                met
                  ? "border-brand-600 bg-brand-600 text-gray-900"
                  : "border-border bg-card",
              )}
            >
              {met && <CheckIcon className="size-2.5" strokeWidth={3} />}
            </span>
            {rule.label}
            {/* Read by screen readers; the tick alone conveys nothing to them. */}
            <span className="sr-only">{met ? " — met" : " — not met"}</span>
          </li>
        ))}
      </ul>

      {/*
        One polite announcement rather than one per rule: announcing every tick
        as it flips would talk over someone still typing.
      */}
      <p aria-live="polite" className="sr-only">
        {value && (isValid ? "Password meets all requirements" : "")}
      </p>
    </div>
  );
}
