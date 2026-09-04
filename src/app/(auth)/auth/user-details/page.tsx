"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@/components";
import {
  AuthCard,
  AuthHeading,
} from "@/components/auth/auth-primitives";

function UserDetailsForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const [form, setForm] = useState({
    org: "",
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
    if (!form.password) next.password = "Choose a password";
    else if (form.password.length < 8) next.password = "Use at least 8 characters";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length === 0)
      router.push(`/auth/otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthCard>
      <AuthHeading
        eyebrow="Step 2 of 3"
        title="Tell us about you"
        description="This is how your teammates will recognise you in the workspace."
      />

      <div className="flex w-full flex-col gap-4">
        <Input
          label="Organisation name"
          value={form.org}
          onChange={set("org")}
          placeholder="Acme Inc."
        />
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
          <Input
            label="First name"
            value={form.first}
            onChange={set("first")}
            placeholder="Ada"
            isInvalid={Boolean(errors.first)} errorMessage={errors.first}
          />
          <Input
            label="Last name"
            value={form.last}
            onChange={set("last")}
            placeholder="Lovelace"
          />
        </div>
        <Input
          label="Phone number"
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="+91 00000 00000"
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={set("password")}
          placeholder="At least 8 characters"
          isInvalid={Boolean(errors.password)} errorMessage={errors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          value={form.confirm}
          onChange={set("confirm")}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Re-enter your password"
          isInvalid={Boolean(errors.confirm)} errorMessage={errors.confirm}
        />
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
        <Button variant="secondary" className="flex-1" onClick={() => router.back()}>
          Back
        </Button>
        <Button className="flex-1" onClick={submit}>
          Continue
        </Button>
      </div>
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
