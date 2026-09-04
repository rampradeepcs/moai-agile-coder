"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components";
import {
  AuthCard,
  AuthDivider,
  AuthHeading,
  SocialSignIn,
  WandIcon,
} from "@/components/auth/auth-primitives";

/*
 * Any valid address signs up — there is no backend to check against. An
 * address containing "taken" is reserved so the "already exists" state from
 * the design stays reachable for review.
 */
const TAKEN_EMAIL_MARKER = "taken";

export default function SignUpPage() {
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
      <AuthHeading
        eyebrow="Step 1 of 3 · Start crafting"
        title="Create free account"
        description="Turn ideas into outcomes with AI-powered workflows."
      />

      <div className="flex w-full flex-col gap-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter email id"
          aria-label="Email id"
          name="email"
          autoComplete="email"
          isInvalid={Boolean(error ?? undefined)} errorMessage={error ?? undefined}
        />

        <Button type="submit" className="w-full" iconLeading={<WandIcon />}>
          Start crafting
        </Button>

        <AuthDivider />
        <SocialSignIn />
      </div>

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

      <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-body-md text-foreground">
          Already have an account?
        </span>
        <Button asChild variant="secondary">
          <Link href="/auth/sign-in">Sign in</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
