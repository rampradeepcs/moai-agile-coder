"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components";
import {
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
    <AuthCard>
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
          isInvalid={Boolean(errors.password)} errorMessage={errors.password}
        />
        <Input
          type="password"
          label="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Re-enter your password"
          isInvalid={Boolean(errors.confirm)} errorMessage={errors.confirm}
        />
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
        <Button asChild variant="secondary" className="flex-1">
          <Link href="/auth/sign-in">Cancel</Link>
        </Button>
        <Button className="flex-1" onClick={submit}>
          Save password
        </Button>
      </div>
    </AuthCard>
  );
}
