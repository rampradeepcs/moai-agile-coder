"use client";

import { Button, type ButtonProps } from "@/components";
import { cn } from "@/lib/utils";

/** Five small sparkles riding just ahead of the wavefront — positions/delays
 * are hand-placed rather than randomized so the wave reads as one
 * deliberate left-to-right sweep every time it plays. */
const SPARKS = [
  { top: "26%", delay: "0ms" },
  { top: "62%", delay: "60ms" },
  { top: "42%", delay: "150ms" },
  { top: "75%", delay: "220ms" },
  { top: "50%", delay: "320ms" },
];

function CtaChargeOverlay() {
  return (
    <span className="wk-cta-charge" aria-hidden="true">
      <span className="wk-cta-charge-fill" />
      <span className="wk-cta-charge-edge" />
      {SPARKS.map((spark, i) => (
        <span
          key={i}
          className="wk-cta-spark"
          style={{ top: spark.top, animationDelay: spark.delay }}
        />
      ))}
    </span>
  );
}

export interface ChargingCtaButtonProps extends ButtonProps {
  /** Plays the golden charge wave once while true — see `useCtaCharge`. */
  charging: boolean;
}

/**
 * The primary Sign In / Start crafting CTA, unchanged in every dimension
 * (size, radius, type, position) but wrapping its icon+label in their own
 * stacking layer so the charge overlay (negative z-index) can never paint
 * over them. `isolate` scopes that z-index to this button specifically,
 * regardless of what stacking context the page around it happens to have.
 */
export function ChargingCtaButton({
  charging,
  className,
  children,
  iconLeading,
  iconTrailing,
  ...props
}: ChargingCtaButtonProps) {
  return (
    <Button
      {...props}
      className={cn("relative isolate overflow-hidden", charging && "pointer-events-none", className)}
    >
      {charging && <CtaChargeOverlay />}
      <span className="relative z-10 inline-flex items-center gap-1.5">
        {iconLeading}
        {children}
        {iconTrailing}
      </span>
    </Button>
  );
}
