"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/marketing/brand-icons";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "wrong") {
      setError(true);
      toast.error("Invalid email ID or Password");
      return;
    }
    router.push("/apps");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-balance">
        Welcome back to your workspace.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Sign in to pick up where you left off — your projects, sprints and AI agents are
        waiting.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
            aria-invalid={error || undefined}
            className={cn(error && "border-danger")}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-password">Password</Label>
            <Link
              href="#"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            aria-invalid={error || undefined}
            className={cn(error && "border-danger")}
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Sign in
        </Button>
      </form>

      <div className="flex items-center gap-3 py-5">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="outline" size="lg" className="w-full">
        <GoogleIcon />
        Continue with Google
      </Button>

      <p className="mt-8 text-sm text-muted-foreground">
        New here?{" "}
        <Link
          href="/auth/sign-up"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create a workspace
        </Link>
      </p>
    </div>
  );
}
