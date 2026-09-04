"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components";
import {
  AuthActions,
  AuthCard,
  AuthHeading,
} from "@/components/auth/auth-primitives";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Invalid email id");
      return;
    }
    setError(null);
    router.push("/auth/otp?next=reset");
  };

  return (
    <AuthCard onSubmit={submit}>
      <AuthHeading
        title="Reset your password"
        description="Tell us the email on your account and we'll send a verification code."
      />

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(null);
        }}
        placeholder="you@company.com"
        name="email"
        autoComplete="email"
        isInvalid={Boolean(error ?? undefined)} errorMessage={error ?? undefined}
      />

      <AuthActions>
        <Button asChild variant="secondary">
          <Link href="/auth/sign-in">Back to sign in</Link>
        </Button>
        <Button type="submit">Send code</Button>
      </AuthActions>
    </AuthCard>
  );
}
