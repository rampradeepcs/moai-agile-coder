"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Matches the CSS animation durations on .wk-cta-charge-fill/-edge/.wk-cta-spark
// in globals.css — keep these in sync if either changes.
const CTA_CHARGE_MS = 1000;

/**
 * Drives the primary-CTA "magic charge" sparkle wave. `trigger` plays the
 * wave once, then calls `onComplete` — the caller's existing submit/navigate
 * action, so the charge reads as the button doing real work rather than a
 * decorative delay bolted on before it. Skips straight to `onComplete` under
 * reduced motion.
 */
export function useCtaCharge() {
  const [charging, setCharging] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const trigger = useCallback((onComplete: () => void) => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      onComplete();
      return;
    }

    setCharging(true);
    timerRef.current = window.setTimeout(() => {
      setCharging(false);
      onComplete();
    }, CTA_CHARGE_MS);
  }, []);

  return { charging, trigger };
}
