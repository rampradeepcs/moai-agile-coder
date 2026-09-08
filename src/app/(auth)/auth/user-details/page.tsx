"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, PasswordCriteria, PasswordInput } from "@/components";
import { passwordError } from "@/lib/password";
import {
  AuthActions,
  AuthCard,
  AuthHeading,
} from "@/components/auth/auth-primitives";

function UserDetailsForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const [form, setForm] = useState({
    first: "",
    last: "",
    phone: "",
    password: "",
    confirm: "",
  });
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
    if (Object.keys(next).length === 0)
      router.push(`/auth/otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthCard onSubmit={submit}>
      <AuthHeading
        eyebrow="Step 2 of 3"
        title="Tell us about you"
        description="This is how your teammates will recognise you in the workspace."
      />

      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
          <Input
            label="First name"
            value={form.first}
            onChange={set("first")}
            placeholder="Ada"
          name="first"
          autoComplete="given-name"
            isInvalid={Boolean(errors.first)} errorMessage={errors.first}
          />
          <Input
            label="Last name"
            value={form.last}
            onChange={set("last")}
            placeholder="Lovelace"
          name="last"
          autoComplete="family-name"
          />
        </div>
        <Input
          label="Phone number"
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="+91 00000 00000"
          name="phone"
          autoComplete="tel"
        />
        <div className="flex w-full flex-col gap-3">
          <PasswordInput
            label="Password"
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
        <PasswordInput
          label="Confirm password"
          value={form.confirm}
          onChange={set("confirm")}
          placeholder="Re-enter your password"
          name="confirm-password"
          autoComplete="new-password"
          isInvalid={Boolean(errors.confirm)} errorMessage={errors.confirm}
        />
      </div>

      <AuthActions>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </AuthActions>
    </AuthCard>
  );
}

export default function UserDetailsPage() {
  return (
    <Suspense fallback={null}>
      <UserDetailsForm />
    </Suspense>
  );
}
