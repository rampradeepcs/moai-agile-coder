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

/** Addresses already on the demo workspace, used for the "exists" state. */
const TAKEN = ["ram@moaiconsulting.co.in", "ada@wizkraft.dev"];

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
    if (TAKEN.includes(value.toLowerCase())) {
      setError("This email already exists. Try signing in instead.");
      return;
    }
    setError(null);
    router.push(`/auth/user-details?email=${encodeURIComponent(value)}`);
  };

  return (
    <AuthCard>
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
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Enter email id"
          aria-label="Email id"
          isInvalid={Boolean(error ?? undefined)} errorMessage={error ?? undefined}
        />

        <Button className="w-full" iconLeading={<WandIcon />} onClick={submit}>
          Start crafting
        </Button>

        <AuthDivider />
        <SocialSignIn />
      </div>

      <p className="text-caption-1 text-muted-foreground/80 text-center">
        By continuing, you agree to our{" "}
        <a href="#" className="text-foreground">Terms of Service</a> and{" "}
        <a href="#" className="text-foreground">Privacy Policy</a>.
      </p>

      <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-overline-1 text-foreground">
          Already have an account?
        </span>
        <Button asChild variant="secondary">
          <Link href="/auth/sign-in">Sign in</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
