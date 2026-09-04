"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components";
import {
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
    <AuthCard>
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
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="you@company.com"
        isInvalid={Boolean(error ?? undefined)} errorMessage={error ?? undefined}
      />

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
        <Button asChild variant="secondary" className="flex-1">
          <Link href="/auth/sign-in">Back to sign in</Link>
        </Button>
        <Button className="flex-1" onClick={submit}>
          Send code
        </Button>
      </div>
    </AuthCard>
  );
}
