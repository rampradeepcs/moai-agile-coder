"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import type { BookCoverPhase } from "@/components/auth/use-book-intro-timeline";

/**
 * The temporary spellbook that falls in, settles, then opens around its
 * spine to reveal the sign-up card underneath. Purely a positioning/3D
 * context — see the `.wk-book-scene` comment in globals.css for why it must
 * never carry a background, radius, or card-like shadow of its own.
 */
export function BookCover({ phase }: { phase: BookCoverPhase }) {
  return (
    <div className="wk-book-intro">
      <div
        className={cn(
          "wk-book-scene",
          phase !== "idle" && "is-falling",
          phase === "opening" && "is-opening",
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
