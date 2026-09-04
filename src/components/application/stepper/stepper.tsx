"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface StepperProps extends React.ComponentPropsWithoutRef<"div"> {
  /** 1-based current step. */
  step: number;
  total?: number;
  className?: string;
}

/**
 * Segmented progress indicator. The active segment widens from 30px to 80px,
 * which is how the onboarding flow shows position without numbering.
 */
export function Stepper({ step, total = 4, className, ...props }: StepperProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${step} of ${total}`}
      className={cn("flex w-full items-center justify-center gap-1", className)}
      {...props}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i + 1 === step ? "w-20 bg-brand-600" : "w-[30px] bg-border",
          )}
        />
      ))}
    </div>
  );
}
