"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, PasswordCriteria } from "@/components";
import { passwordError } from "@/lib/password";
import {
  AuthCard,
  AuthHeading,
} from "@/components/auth/auth-primitives";

/*
 * Invited-user screen (Figma 4:875). The workspace and email arrive with the
 * invite, so both are shown read-only; the invitee only sets their own details.
 */
const INVITE = { workspace: "Moai Consulting", email: "ada@wizkraft.dev" };

export default function InvitedUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({ first: "", last: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form.first.trim()) next.first = "Enter your first name";
    const passwordProblem = passwordError(form.password);
    if (passwordProblem) next.password = passwordProblem;
    if (form.confirm !== form.password) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length === 0) router.push("/apps");
  };

  return (
    <AuthCard onSubmit={submit}>
      <AuthHeading
        eyebrow="You're invited"
        title={`Join ${INVITE.workspace}`}
        description="Set up your profile and you're in — the workspace is already waiting."
      />

      <div className="flex w-full flex-col gap-4">
        <Input label="Email" value={INVITE.email} name="email" autoComplete="username" readOnly disabled />
        <Input
          label="First name"
          value={form.first}
          onChange={set("first")}
          placeholder="Ada"
          name="first-name"
          autoComplete="given-name"
          isInvalid={Boolean(errors.first)} errorMessage={errors.first}
        />
        <Input
          label="Last name"
          value={form.last}
          onChange={set("last")}
          placeholder="Lovelace"
          name="last-name"
          autoComplete="family-name"
        />
        <div className="flex w-full flex-col gap-3">
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="Choose a password"
            name="new-password"
            autoComplete="new-password"
            aria-describedby="password-criteria"
            isInvalid={Boolean(errors.password)} errorMessage={errors.password}
          />
          <PasswordCriteria id="password-criteria" value={form.password} />
        </div>
        <Input
          label="Confirm password"
          type="password"
          value={form.confirm}
          onChange={set("confirm")}
          placeholder="Re-enter your password"
          name="confirm-password"
          autoComplete="new-password"
          isInvalid={Boolean(errors.confirm)} errorMessage={errors.confirm}
        />
      </div>

      <Button type="submit" className="w-full">
        Join workspace
      </Button>
    </AuthCard>
  );
}
