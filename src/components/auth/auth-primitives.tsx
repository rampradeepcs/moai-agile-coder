"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/marketing/brand-icons";
import { Button } from "@/components";

/*
 * Auth primitives, built to the WizKraft Figma auth frames
 * (file DTfOUMmRzfz8munYZnMkr7, sections 4:173 / 4:605 / 4:873).
 *
 * The metrics below are the design's, not approximations: 44px controls,
 * 10px radius, 16px horizontal padding, and the two Figma effect styles
 * (`shadow-card`, `shadow-input-inner`).
 */

/* ------------------------------------------------------------------ card */

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[600px] flex-col rounded-[10px]",
        "gap-6 p-6 sm:gap-8 sm:p-[50px]",
        "border border-card bg-secondary shadow-card",
        className,
      )}
    >
      <AuthLogo />
      {children}
    </div>
  );
}

export function AuthLogo() {
  return (
    <div className="flex h-[30px] items-center gap-2">
      <Image src="/auth/logo-mark.svg" alt="" width={32} height={29} priority />
      <span className="text-body-lg text-foreground">wizkraft.ai</span>
    </div>
  );
}

/* --------------------------------------------------------------- heading */

export function AuthHeading({
  eyebrow,
  title,
  description,
}: {
  /** Small line above the title, followed by the AI sparkle mark. */
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      {eyebrow && (
        <div className="flex items-center gap-1">
          <span className="text-body-md text-muted-foreground">{eyebrow}</span>
          <Image src="/auth/ai-sparkle.svg" alt="" width={14} height={14} />
        </div>
      )}
      <h1 className="text-2xl font-semibold text-foreground sm:text-head-1">
        {title}
      </h1>
      {description && (
        <p className="text-body-md text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- divider */

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex w-full items-center gap-4">
      <span className="h-px flex-1 bg-border" />
      <span className="text-caption-1 text-muted-foreground">{label}</span>
      <span className="h-px flex-1 bg-gray-alpha10" />
    </div>
  );
}

/* ------------------------------------------------------------ social row */

export function SocialSignIn({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => onSelect?.("google")}
        iconLeading={<Image src="/auth/google.svg" alt="" width={14} height={14} />}
      >
        Continue with Google
      </Button>
      <div className="flex w-full items-start gap-3 sm:gap-4">
        {SOCIAL_PROVIDERS.map(({ id, label, icon }) => (
          <Button
            key={id}
            variant="secondary"
            className="flex-1"
            aria-label={`Continue with ${label}`}
            onClick={() => onSelect?.(id)}
            iconLeading={icon}
          />
        ))}
      </div>
    </div>
  );
}

/*
 * Figma exports the same 460-byte placeholder vector for all three of these
 * instances no matter which node is requested, so only GitHub — which the
 * project already ships a matching glyph for — renders its real mark. Drop
 * real Microsoft and LinkedIn assets into /public/auth to finish the row.
 */
const SOCIAL_PROVIDERS: { id: string; label: string; icon: React.ReactNode }[] = [
  {
    id: "microsoft",
    label: "Microsoft",
    icon: <Image src="/auth/wand.svg" alt="" width={14} height={14} />,
  },
  { id: "github", label: "GitHub", icon: <GithubIcon className="size-3.5" /> },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: <Image src="/auth/wand.svg" alt="" width={14} height={14} />,
  },
];


/** The wand mark the design puts on primary CTAs. */
export function WandIcon() {
  return <Image src="/auth/wand.svg" alt="" width={14} height={14} />;
}
