"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";

import { Button, OtpInput } from "@/components";
import {
  AuthCard,
  AuthHeading,
  AuthTextButton,
} from "@/components/auth/auth-primitives";

/*
 * There is no backend to check a code against, so any complete 6-digit entry
 * is accepted — a prototype should not dead-end the person walking through it.
 * `000000` is reserved so the "Wrong OTP" state from the design stays
 * reachable for review.
 */
const REJECTED_CODE = "000000";
const COUNTDOWN = 71; // 01:11 in the design

function OtpFlow() {
  const router = useRouter();
  const params = useSearchParams();
  // The reset-password branch reuses this screen and continues elsewhere.
  const isReset = params.get("next") === "reset";
  const email = params.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [secondsLeft]);

  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
    secondsLeft % 60,
  ).padStart(2, "0")}`;

  const verify = (value = code) => {
    if (value.length < 6) {
      setError("Enter all 6 digits");
      return;
    }
    if (value === REJECTED_CODE) {
      setError("Wrong OTP");
      return;
    }
    setError(null);
    router.push(isReset ? "/auth/reset-password" : "/auth/onboarding");
  };

  return (
    <AuthCard onSubmit={() => verify()}>
      <AuthHeading
        eyebrow={isReset ? undefined : "Step 3 of 3"}
        title="Verify your email"
        description={
          email ? (
            <>
              Enter the 6-digit code we sent to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </>
          ) : (
            "Enter the 6-digit code we just sent to your inbox."
          )
        }
      />

      <div className="flex w-full flex-col gap-3">
        <OtpInput
          value={code}
          onValueChange={(v) => {
            setCode(v);
            if (error) setError(null);
          }}
          onComplete={verify}
          isInvalid={Boolean(error)}
          autoFocus
        />

        {error && (
          <p className="flex items-center gap-1 text-caption-1 text-error-500">
            <Info className="size-3" aria-hidden />
            {error}
          </p>
        )}

        <div className="flex w-full items-center justify-between">
          <span className="text-body-lg tabular-nums text-foreground">{mmss}</span>
          <AuthTextButton
            disabled={secondsLeft > 0}
            onClick={() => {
              setSecondsLeft(COUNTDOWN);
              setCode("");
              setError(null);
            }}
            className="mx-0 -mr-3 text-body-lg text-foreground"
          >
            {secondsLeft > 0 ? "Resend OTP" : "Resend OTP now"}
          </AuthTextButton>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Verify
      </Button>

      {/* A mistyped address is only recoverable by going back a step. */}
      <AuthTextButton onClick={() => router.back()}>
        <ArrowLeft className="size-3.5" aria-hidden />
        Use a different email
      </AuthTextButton>
    </AuthCard>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpFlow />
    </Suspense>
  );
}
