"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

export type BookCoverPhase = "idle" | "falling" | "opening";

/*
 * Book -> card entrance timeline, shared by every auth page that opens with
 * the spellbook intro. Constants ported 1:1 from the standalone prototype
 * this animation was built and tuned in.
 */
const FALL_MS = 1070; // fall + settle, one eased keyframe animation
const PAUSE_MS = 120; // brief beat before the cover lifts
const OPEN_MS = 1220; // cover rotates open around the spine hinge
// The card starts fading in once the cover's foreshortened silhouette has
// mostly receded, so it reads as emerging after the book opens, not popping
// on top of a still-visible cover.
const CARD_DELAY_INTO_OPEN = 680;
const HIDE_BUFFER = 150;
// Safety net: forces every row visible even if a stagger gets caught
// mid-animation by a backgrounded tab or a slow device.
const FINAL_SAFETY_MS = 1600;

export function useBookIntroTimeline() {
  const [bookPhase, setBookPhase] = useState<BookCoverPhase>("idle");
  const [bookHidden, setBookHidden] = useState(false);
  const [cardRevealing, setCardRevealing] = useState(false);
  const [cardFinal, setCardFinal] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setBookHidden(true);
      setCardFinal(true);
      return;
    }

    const raf = requestAnimationFrame(() => setBookPhase("falling"));
    const timers = [
      window.setTimeout(() => setBookPhase("opening"), FALL_MS + PAUSE_MS),
      window.setTimeout(
        () => setCardRevealing(true),
        FALL_MS + PAUSE_MS + CARD_DELAY_INTO_OPEN,
      ),
      window.setTimeout(
        () => setBookHidden(true),
        FALL_MS + PAUSE_MS + OPEN_MS + HIDE_BUFFER,
      ),
      window.setTimeout(
        () => setCardFinal(true),
        FALL_MS + PAUSE_MS + CARD_DELAY_INTO_OPEN + FINAL_SAFETY_MS,
      ),
    ];

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return { bookPhase, bookHidden, cardRevealing, cardFinal };
}

export function rowDelay(ms: number): CSSProperties {
  return { "--row-delay": `${ms}ms` } as CSSProperties;
}
