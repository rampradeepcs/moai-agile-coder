"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components";
import {
  AuthCard,
  AuthHeading,
} from "@/components/auth/auth-primitives";

/*
 * No backend to authenticate against, so any well-formed credentials sign in.
 * These two reserved inputs keep the designed error states reachable:
 *   an address containing "unknown" -> "This email is not registered"
 *   the password "wrong"            -> "Incorrect password"
 */
const UNKNOWN_EMAIL_MARKER = "unknown";
const REJECTED_PASSWORD = "wrong";

export default function SignInPage() {
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
      <AuthHeading
        eyebrow="Welcome back"
        title="Sign in to WizKraft"
        description="Pick up where you left off — your projects, sprints and AI agents are waiting."
      />

      <div className="flex w-full flex-col gap-4">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({});
          }}
          placeholder="you@company.com"
          name="email"
          autoComplete="email"
          isInvalid={Boolean(errors.email)} errorMessage={errors.email}
        />
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({});
          }}
          placeholder="Enter your password"
          name="password"
          autoComplete="current-password"
          isInvalid={Boolean(errors.password)} errorMessage={errors.password}
        />
        <Link
          href="/auth/forgot-password"
          className="inline-flex min-h-11 w-fit items-center text-body-md text-foreground underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full">
        Sign in
      </Button>

      <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-body-md text-foreground">
          Don&rsquo;t have an account?
        </span>
        <Button asChild variant="secondary">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
