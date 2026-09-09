"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { BookCover, type BookCoverPhase } from "@/components/auth/book-cover";
import { SignInCard } from "@/components/auth/sign-in-card";
import { SignUpCard } from "@/components/auth/sign-up-card";
import { useBookIntroTimeline } from "@/components/auth/use-book-intro-timeline";
import { cn } from "@/lib/utils";

/*
 * Shared by /auth/sign-in and /auth/sign-up (route-grouped as `(book)` so
 * the URLs are unaffected) specifically so this layout instance survives
 * navigating between them — Next only remounts a route's own page.tsx, not
 * the layout wrapping it.
 *
 * The card content itself is rendered HERE, directly from local `mode`
 * state, rather than via the routed `children` prop: Next resolves the
 * incoming page's segment on its own schedule (a separate render from the
 * pathname update), so anything driven by watching `children` swaps the
 * instant that resolves, regardless of any state/ref gymnastics used to try
 * to delay it — there's no reliable way to hold the old segment on screen
 * long enough for a close animation. Owning `mode` locally sidesteps that
 * entirely: a Sign In <-> Sign Up click changes our own state on our own
 * timeline, and only updates the URL (via router.replace) as a side effect,
 * not as the trigger. `page.tsx` under sign-in/ and sign-up/ render nothing
 * — they exist solely so those URLs resolve to this layout.
 */

type Mode = "sign-in" | "sign-up";

function modeFromPathname(pathname: string): Mode {
  return pathname.includes("sign-up") ? "sign-up" : "sign-in";
}

// Book closes over the current card, its content is swapped while the book
// sits fully closed, then it reopens onto the other card. Slower and gentler
// than a snap-flip, still shorter than the entrance — these must stay in
// sync with the wk-book-transition-close/open animation durations in
// globals.css, since those drive the actual visual motion these timers wait
// out.
const TRANSITION_CLOSE_MS = 720;
const TRANSITION_PAUSE_MS = 160; // beat at fully-closed where content swaps
const TRANSITION_OPEN_MS = 720;

type TransitionPhase = "idle" | "closing" | "opening";

export default function AuthBookLayout() {
  const pathname = usePathname();
  const router = useRouter();

  // The book/card entrance — unmodified, runs exactly once for the life of
  // this layout instance (i.e. once per visit to the sign-in/sign-up pair,
  // regardless of which of the two is opened first).
  const entrance = useBookIntroTimeline();

  const [mode, setMode] = useState<Mode>(() => modeFromPathname(pathname));
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>("idle");

  const prevPathnameRef = useRef(pathname);
  const mountedRef = useRef(false);
  // Set right before our own router.replace() so the pathname-watching
  // effect below (which exists for browser back/forward) doesn't also
  // re-run a transition we already ran ourselves.
  const selfNavigatingRef = useRef(false);
  const pendingTimersRef = useRef<number[]>([]);

  const clearPendingTimers = useCallback(() => {
    pendingTimersRef.current.forEach((t) => window.clearTimeout(t));
    pendingTimersRef.current = [];
  }, []);

  const runTransitionTo = useCallback(
    (nextMode: Mode) => {
      clearPendingTimers();

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        setMode(nextMode);
        setTransitionPhase("idle");
        return;
      }

      setTransitionPhase("closing");
      const swapTimer = window.setTimeout(() => {
        // Content changes only once the book is fully closed and covering it.
        setMode(nextMode);
        setTransitionPhase("opening");
      }, TRANSITION_CLOSE_MS + TRANSITION_PAUSE_MS);
      const doneTimer = window.setTimeout(
        () => setTransitionPhase("idle"),
        TRANSITION_CLOSE_MS + TRANSITION_PAUSE_MS + TRANSITION_OPEN_MS,
      );
      pendingTimersRef.current = [swapTimer, doneTimer];
    },
    [clearPendingTimers],
  );

  const switchMode = useCallback(
    (nextMode: Mode) => {
      selfNavigatingRef.current = true;
      router.replace(nextMode === "sign-up" ? "/auth/sign-up" : "/auth/sign-in", {
        scroll: false,
      });
      runTransitionTo(nextMode);
    },
    [router, runTransitionTo],
  );

  // Covers navigation this layout didn't itself trigger — browser back/
  // forward, a bookmark, or the URL bar — with the same close/open motion.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      prevPathnameRef.current = pathname;
      return;
    }
    if (pathname === prevPathnameRef.current) return;
    prevPathnameRef.current = pathname;

    if (selfNavigatingRef.current) {
      selfNavigatingRef.current = false;
      return;
    }

    runTransitionTo(modeFromPathname(pathname));
  }, [pathname, runTransitionTo]);

  useEffect(() => clearPendingTimers, [clearPendingTimers]);

  const showBook = transitionPhase !== "idle" || !entrance.bookHidden;
  const bookPhase: BookCoverPhase =
    transitionPhase === "closing"
      ? "transition-closing"
      : transitionPhase === "opening"
        ? "transition-opening"
        : entrance.bookPhase;

  return (
    <>
      {showBook && (
        <div className="wk-book-stage" aria-hidden="true">
          <BookCover phase={bookPhase} />
        </div>
      )}

      <div
        className={cn(
          "wk-card-wrap",
          entrance.cardRevealing && "is-revealing",
          entrance.cardFinal && "is-final",
        )}
      >
        {mode === "sign-up" ? (
          <SignUpCard onSwitchToSignIn={() => switchMode("sign-in")} />
        ) : (
          <SignInCard onSwitchToSignUp={() => switchMode("sign-up")} />
        )}
      </div>
    </>
  );
}
