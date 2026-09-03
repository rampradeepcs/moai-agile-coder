"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Apple, ChevronLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
} from "@/components/marketing/brand-icons";

export default function SignUpPage() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = React.useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-balance">
        The smartest way to manage what you&apos;re building.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Stop spending days breaking down requirements manually. Tell us what you&apos;re
        building, and get a fully structured ticket hierarchy your team can act on in
        minutes.
      </p>

      <div className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          {!showEmailForm ? (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                className="w-full"
              >
                <GoogleIcon />
                Continue with Google
              </Button>

              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" size="lg" aria-label="Continue with Apple">
                  <Apple />
                </Button>
                <Button variant="outline" size="lg" aria-label="Continue with GitHub">
                  <GithubIcon />
                </Button>
                <Button variant="outline" size="lg" aria-label="Continue with Facebook">
                  <FacebookIcon />
                </Button>
              </div>

              <div className="flex items-center gap-3 py-1">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">or</span>
                <Separator className="flex-1" />
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setShowEmailForm(true)}
              >
                <Mail />
                Continue with mail
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/auth/otp");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-workspace">Workspace name</Label>
                <InputGroup>
                  <InputGroupInput
                    id="signup-workspace"
                    placeholder="acme"
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>.wizkraft.app</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Sign up
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowEmailForm(false)}
              >
                <ChevronLeft />
                Go back
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-foreground">
          Terms of service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-foreground">
          Privacy policy
        </Link>
        .
      </p>

      <p className="mt-4 text-sm text-muted-foreground">
        Already have a workspace?{" "}
        <Link
          href="/auth/sign-in"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
