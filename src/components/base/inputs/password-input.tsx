"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input, type InputProps } from "./input";

export interface PasswordInputProps extends Omit<InputProps, "type" | "addonTrailing"> {
  /** Starts revealed. Uncontrolled — the toggle takes over from here. */
  defaultRevealed?: boolean;
  /** Removes the reveal control, leaving a plain masked field. */
  hideRevealToggle?: boolean;
}

/**
 * A password field with a reveal toggle.
 *
 * Letting someone check what they typed is the cheapest way to cut typos in a
 * field they cannot read back, and it matters most on the confirm-password
 * pairs where a typo is otherwise only discoverable by failing validation.
 */
export function PasswordInput({
  defaultRevealed = false,
  hideRevealToggle = false,
  label,
  ...props
}: PasswordInputProps) {
  const [revealed, setRevealed] = React.useState(defaultRevealed);

  // Names the control by what it does. The field's own label already
  // identifies which password this is, so it is only echoed when there is a
  // label to echo — several screens use a placeholder instead.
  const target = typeof label === "string" ? ` ${label.toLowerCase()}` : " password";

  return (
    <Input
      {...props}
      label={label}
      type={revealed ? "text" : "password"}
      addonTrailing={
        hideRevealToggle ? undefined : (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? `Hide${target}` : `Show${target}`}
            aria-pressed={revealed}
            className="grid size-6 cursor-pointer place-items-center rounded text-fg-tertiary transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none"
          >
            {revealed ? (
              <EyeOffIcon className="size-4" aria-hidden />
            ) : (
              <EyeIcon className="size-4" aria-hidden />
            )}
          </button>
        )
      }
    />
  );
}
