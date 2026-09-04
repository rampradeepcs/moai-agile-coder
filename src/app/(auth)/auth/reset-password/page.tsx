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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const submit = () => {
    const next: typeof errors = {};
    if (password.length < 8) next.password = "Use at least 8 characters";
    if (confirm !== password) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length === 0) router.push("/auth/sign-in");
  };

  return (
    <AuthCard onSubmit={submit}>
      <AuthHeading
        title="Create new password"
        description="Choose a password you haven't used on this account before."
      />

      <div className="flex w-full flex-col gap-4">
        <Input
          type="password"
          label="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          name="new-password"
          autoComplete="new-password"
          isInvalid={Boolean(errors.password)} errorMessage={errors.password}
        />
        <Input
          type="password"
          label="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter your password"
          name="confirm-password"
          autoComplete="new-password"
          isInvalid={Boolean(errors.confirm)} errorMessage={errors.confirm}
        />
      </div>

      <AuthActions>
        <Button asChild variant="secondary">
          <Link href="/auth/sign-in">Cancel</Link>
        </Button>
        <Button type="submit">Save password</Button>
      </AuthActions>
    </AuthCard>
  );
}
