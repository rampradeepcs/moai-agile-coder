"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";

import { Button, OtpInput } from "@/components";
import { AuthCard, AuthHeading } from "@/components/auth/auth-primitives";

/** Demo code; anything else lands on the "Wrong OTP" state from the design. */
const VALID = "123456";
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
    if (value === VALID) {
      setError(null);
      router.push(isReset ? "/auth/reset-password" : "/auth/onboarding");
    } else {
      setError("Wrong OTP");
    }
  };

  return (
    <AuthCard>
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
          <button
            type="button"
            disabled={secondsLeft > 0}
            onClick={() => {
              setSecondsLeft(COUNTDOWN);
              setCode("");
              setError(null);
            }}
            className="text-body-lg text-foreground disabled:text-muted-foreground/60"
          >
            {secondsLeft > 0 ? "Resend OTP" : "Resend OTP now"}
          </button>
        </div>
      </div>

      <Button className="w-full" onClick={() => verify()}>
        Verify
      </Button>

      {/* A mistyped address is only recoverable by going back a step. */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mx-auto flex items-center gap-1.5 text-body-md text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Use a different email
      </button>
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
