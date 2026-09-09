"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, PasswordInput } from "@/components";
import { AuthCard, AuthHeading } from "@/components/auth/auth-primitives";
import { MagicEmailInput } from "@/components/auth/magic-email-input";
import { rowDelay } from "@/components/auth/use-book-intro-timeline";

/*
 * No backend to authenticate against, so any well-formed credentials sign in.
 * These two reserved inputs keep the designed error states reachable:
 *   an address containing "unknown" -> "This email is not registered"
 *   the password "wrong"            -> "Incorrect password"
 */
const UNKNOWN_EMAIL_MARKER = "unknown";
const REJECTED_PASSWORD = "wrong";

/**
 * The sign-in card's own content — rendered by the `(book)` layout based on
 * its local `mode` state, not by a route directly, so switching to sign-up
 * is a state change the layout controls rather than a navigation it has to
 * react to. `onSwitchToSignUp` runs the book close/open transition.
 */
export function SignInCard({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = () => {
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors({ email: "Invalid email id" });
      return;
    }
    if (value.includes(UNKNOWN_EMAIL_MARKER)) {
      setErrors({ email: "This email is not registered" });
      return;
    }
    if (!password) {
      setErrors({ password: "Enter your password" });
      return;
    }
    if (password === REJECTED_PASSWORD) {
      setErrors({ password: "Incorrect password" });
      return;
    }
    setErrors({});
    router.push("/apps");
  };

  return (
    <AuthCard onSubmit={submit}>
      <div className="wk-row" style={rowDelay(120)}>
        <AuthHeading
          eyebrow="Welcome back"
          title="Sign in to WizKraft"
          description="Pick up where you left off — your projects, sprints and AI agents are waiting."
        />
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="wk-row" style={rowDelay(220)}>
          <MagicEmailInput
            label="Email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              if (errors.email) setErrors({});
            }}
            placeholder="you@company.com"
            name="email"
            autoComplete="email"
            isInvalid={Boolean(errors.email)}
            errorMessage={errors.email}
          />
        </div>

        <div className="wk-row" style={rowDelay(320)}>
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({});
            }}
            placeholder="Enter your password"
            name="password"
            autoComplete="current-password"
            isInvalid={Boolean(errors.password)}
            errorMessage={errors.password}
          />
        </div>

        <div className="wk-row" style={rowDelay(380)}>
          <Link
            href="/auth/forgot-password"
            className="inline-flex min-h-11 w-fit items-center text-body-md text-foreground underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <div className="wk-row" style={rowDelay(460)}>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </div>

      <div className="wk-row" style={rowDelay(540)}>
        <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-body-md text-foreground">Don&rsquo;t have an account?</span>
          <Button type="button" variant="secondary" onClick={onSwitchToSignUp}>
            Sign up
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}
