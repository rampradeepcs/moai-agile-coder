"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components";
import {
  AuthCard,
  AuthDivider,
  AuthHeading,
  SocialSignIn,
  WandIcon,
} from "@/components/auth/auth-primitives";
import { MagicEmailInput } from "@/components/auth/magic-email-input";
import { rowDelay } from "@/components/auth/use-book-intro-timeline";

/*
 * Any valid address signs up — there is no backend to check against. An
 * address containing "taken" is reserved so the "already exists" state from
 * the design stays reachable for review.
 */
const TAKEN_EMAIL_MARKER = "taken";

/**
 * The sign-up card's own content — rendered by the `(book)` layout based on
 * its local `mode` state, not by a route directly, so switching to sign-in
 * is a state change the layout controls rather than a navigation it has to
 * react to. `onSwitchToSignIn` runs the book close/open transition.
 */
export function SignUpCard({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email id");
      return;
    }
    if (value.toLowerCase().includes(TAKEN_EMAIL_MARKER)) {
      setError("This email already exists. Try signing in instead.");
      return;
    }
    setError(null);
    router.push(`/auth/user-details?email=${encodeURIComponent(value)}`);
  };

  return (
    <AuthCard onSubmit={submit}>
      <div className="wk-row" style={rowDelay(120)}>
        <AuthHeading
          eyebrow="Step 1 of 3 · Start crafting"
          title="Create free account"
          description="Turn ideas into outcomes with AI-powered workflows."
        />
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="wk-row" style={rowDelay(220)}>
          <MagicEmailInput
            value={email}
            onChange={(value) => {
              setEmail(value);
              if (error) setError(null);
            }}
            placeholder="Enter email id"
            name="email"
            autoComplete="email"
            isInvalid={Boolean(error ?? undefined)}
            errorMessage={error ?? undefined}
          />
        </div>

        <div className="wk-row" style={rowDelay(320)}>
          <Button type="submit" className="w-full" iconLeading={<WandIcon />}>
            Start crafting
          </Button>
        </div>

        <div className="wk-row" style={rowDelay(400)}>
          <AuthDivider />
        </div>

        <div className="wk-row" style={rowDelay(460)}>
          <SocialSignIn />
        </div>
      </div>

      <div className="wk-row" style={rowDelay(540)}>
        <p className="text-caption-1 text-muted-foreground/80 text-center">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-foreground underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-foreground underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div className="wk-row" style={rowDelay(600)}>
        <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-body-md text-foreground">Already have an account?</span>
          <Button type="button" variant="secondary" onClick={onSwitchToSignIn}>
            Sign in
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}
