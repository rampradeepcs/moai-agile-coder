"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

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
  onSubmit,
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * Renders the card as a `<form>`. Worth doing on any screen with fields:
   * it gives Enter-to-submit from every input rather than the one the handler
   * happens to be wired to, and it is what lets a password manager recognise
   * the flow and offer to fill or save.
   */
  onSubmit?: () => void;
}) {
  const classes = cn(
    "flex w-full max-w-[600px] flex-col rounded-[10px]",
    "gap-6 p-6 sm:gap-8 sm:p-[50px]",
    "border border-card bg-secondary shadow-card",
    className,
  );

  const content = (
    <>
      <AuthLogo />
      {children}
    </>
  );

  if (!onSubmit) return <div className={classes}>{content}</div>;

  return (
    <form
      className={classes}
      // Validation and messaging are ours; native bubbles would duplicate it.
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {content}
    </form>
  );
}

/** Doubles as the way out of the flow — back to the marketing home page. */
export function AuthLogo() {
  return (
    <Link
      href="/"
      aria-label="WizKraft home"
      className={cn(
        "flex h-[30px] w-fit items-center gap-2 rounded-md transition-opacity hover:opacity-70",
        "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:ring-offset-4 focus-visible:ring-offset-secondary focus-visible:outline-none",
      )}
    >
      <Image src="/auth/logo-mark.svg" alt="" width={32} height={29} priority />
      <span className="text-body-lg text-foreground">wizkraft.ai</span>
    </Link>
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
          <Image src="/auth/ai-sparkle.svg" alt="" width={14} height={14} loading="eager" />
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
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ------------------------------------------------------------ actions */

/**
 * The trailing action row — one primary button, optionally preceded by a
 * secondary (Back / Cancel).
 *
 * `flex-1` is scoped to `sm` deliberately. In the stacked column below that
 * breakpoint it resolves against the *height*, so `flex-basis: 0` overrides
 * the button's `h-11` and collapses every action to its content box (~26px).
 */
export function AuthActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row sm:gap-4",
        "[&>*]:w-full sm:[&>*]:w-auto sm:[&>*]:flex-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Low-emphasis text action ("Skip for now", "Use a different email"). Padded
 * out to a 44px touch target without changing how it reads.
 */
export function AuthTextButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "mx-auto inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md px-3",
        "text-body-md text-muted-foreground transition-colors hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:text-muted-foreground/60",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------ social row */

export function SocialSignIn({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={() => onSelect?.("google")}
        iconLeading={<Image src="/auth/google.svg" alt="" width={14} height={14} loading="eager" />}
      >
        Continue with Google
      </Button>
      <div className="flex w-full items-start gap-3 sm:gap-4">
        {SOCIAL_PROVIDERS.map(({ id, label, icon }) => (
          <Button
            key={id}
            type="button"
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
 * Figma's export returns the same placeholder vector for all three of these
 * instances, so Microsoft and LinkedIn come from the brand assets supplied
 * directly; GitHub uses the glyph the project already ships.
 */
const SOCIAL_PROVIDERS: { id: string; label: string; icon: React.ReactNode }[] = [
  {
    id: "microsoft",
    label: "Microsoft",
    icon: <Image src="/auth/microsoft.svg" alt="" width={14} height={14} loading="eager" />,
  },
  { id: "github", label: "GitHub", icon: <GithubIcon className="size-3.5" /> },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: <Image src="/auth/linkedin.svg" alt="" width={14} height={14} loading="eager" />,
  },
];


/** The wizard-staff mark the design puts on primary CTAs. */
export function WandIcon() {
  return <Image src="/auth/wizard-stick.png" alt="" width={14} height={14} loading="eager" />;
}
