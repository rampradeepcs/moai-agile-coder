"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

/*
 * "falling"/"opening" are the one-time entrance (fall in, then swing open).
 * "transition-closing"/"transition-opening" are the Sign In <-> Sign Up
 * state transition: the same book, closing over the current card then
 * reopening to the other one — see the `.wk-book-scene.is-transition*`
 * rules in globals.css for why these never touch the entrance's own
 * fall/opacity styling.
 */
export type BookCoverPhase =
  | "idle"
  | "falling"
  | "opening"
  | "transition-closing"
  | "transition-opening";

/**
 * The temporary spellbook that either falls in and opens (entrance), or
 * closes then reopens in place (auth-mode switch) — see `phase`. Purely a
 * positioning/3D context — see the `.wk-book-scene` comment in globals.css
 * for why it must never carry a background, radius, or card-like shadow of
 * its own.
 */
export function BookCover({ phase }: { phase: BookCoverPhase }) {
  return (
    <div className="wk-book-intro">
      <div
        className={cn(
          "wk-book-scene",
          (phase === "falling" || phase === "opening") && "is-falling",
          phase === "opening" && "is-opening",
          (phase === "transition-closing" || phase === "transition-opening") &&
            "is-transition",
          phase === "transition-closing" && "is-transition-closing",
          phase === "transition-opening" && "is-transition-opening",
        )}
      >
        <div className="wk-book-cover-rotate">
          <Image
            src="/auth/book-cover.png"
            alt="Wizkraft spellbook"
            fill
            sizes="600px"
            priority
            className="wk-book-cover-img"
          />
          <div className="wk-book-page-edge" />
        </div>
      </div>
    </div>
  );
}
