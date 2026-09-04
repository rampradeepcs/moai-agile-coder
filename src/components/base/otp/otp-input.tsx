"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface OtpInputProps {
  /** Number of boxes. The design uses six. */
  length?: number;
  value: string;
  onValueChange: (value: string) => void;
  /** Turns every box red and exposes `aria-invalid`. */
  isInvalid?: boolean;
  /** Fires when the last box is filled. */
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
}

/**
 * One-time-code entry: square boxes that advance on input, step back on
 * Backspace, move with the arrow keys and accept a pasted code into all boxes.
 */
export function OtpInput({
  length = 6,
  value,
  onValueChange,
  isInvalid = false,
  onComplete,
  autoFocus = false,
  className,
}: OtpInputProps) {
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  /*
   * Positions are held as a fixed-length array rather than derived from the
   * joined string: `["1", "", "3"].join("")` is `"13"`, so clearing a middle
   * box would otherwise shift every later digit one place left.
   */
  const [slots, setSlots] = React.useState<string[]>(() =>
    Array.from({ length }, (_, i) => value[i] ?? ""),
  );

  /*
   * Re-sync when the parent resets or sets the value wholesale. Adjusting
   * state during render — rather than in an effect — is React's documented
   * pattern for deriving from props, and avoids the extra commit.
   */
  const [syncedValue, setSyncedValue] = React.useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    if (slots.join("") !== value) {
      setSlots(Array.from({ length }, (_, i) => value[i] ?? ""));
    }
  }

  const commit = (next: string[]) => {
    setSlots(next);
    const joined = next.join("");
    onValueChange(joined);
    if (next.every((d) => d !== "")) onComplete?.(joined);
  };

  const setDigit = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = [...slots];
    next[index] = char;
    commit(next);
    if (char && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !slots[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    commit(Array.from({ length }, (_, i) => text[i] ?? ""));
    inputs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <div className={cn("flex w-full gap-1.5 sm:gap-2", className)} onPaste={onPaste}>
      {slots.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={digit}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus={autoFocus && i === 0}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={isInvalid || undefined}
          className={cn(
            "aspect-square min-w-0 flex-1 rounded-[10px] border bg-card text-center",
            "text-xl font-semibold text-foreground shadow-input-inner outline-none sm:text-head-1",
            isInvalid
              ? "border-error-500"
              : digit
                ? "border-brand-600"
                : "border-border focus:border-brand-600",
          )}
        />
      ))}
    </div>
  );
}
