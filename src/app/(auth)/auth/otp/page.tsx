"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

const RESEND_SECONDS = 30;

export default function OtpPage() {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [state, setState] = React.useState<"idle" | "error" | "success">("idle");
  const [seconds, setSeconds] = React.useState(RESEND_SECONDS);
  const [shakeKey, setShakeKey] = React.useState(0);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleChange = (next: string) => {
    setValue(next);
    if (state !== "idle") setState("idle");
    if (next.length === 4) {
      if (next === "0000") {
        setState("error");
        setShakeKey((k) => k + 1);
      } else {
        setState("success");
        toast.success("Verified! Setting up your workspace…");
        setTimeout(() => router.push("/auth/onboarding"), 600);
      }
    }
  };

  const handleResend = () => {
    setSeconds(RESEND_SECONDS);
    setValue("");
    setState("idle");
    toast.success("A new OTP has been sent to your email.");
  };

  const slotClass = cn(
    "size-14 text-lg font-semibold",
    state === "error" && "border-danger data-[active=true]:border-danger",
    state === "success" && "border-success data-[active=true]:border-success"
  );

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-balance">OTP verification</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        We&apos;ve sent a verification code to{" "}
        <span className="font-medium text-foreground">venkat@moaiconsulting.co.in</span>
      </p>

      <motion.div
        key={shakeKey}
        animate={shakeKey > 0 ? { x: [0, -10, 10, -8, 8, -4, 0] } : undefined}
        transition={{ duration: 0.45 }}
        className="mt-10 flex justify-center"
      >
        <InputOTP
          maxLength={4}
          value={value}
          onChange={handleChange}
          aria-label="One-time verification code"
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className={cn(
                  "rounded-md border first:rounded-l-md last:rounded-r-md",
                  slotClass
                )}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </motion.div>

      {state === "error" && (
        <p className="mt-3 text-center text-sm font-medium text-danger" role="alert">
          Wrong OTP
        </p>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="tabular-nums font-medium text-foreground">
          00:{String(seconds).padStart(2, "0")}
        </span>
        <span aria-hidden>·</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={seconds > 0}
          className={cn(
            "font-medium underline-offset-4 transition-colors",
            seconds > 0
              ? "cursor-not-allowed opacity-50"
              : "text-primary hover:underline"
          )}
        >
          Resend OTP
        </button>
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft />
          Go back
        </Button>
      </div>
    </div>
  );
}
