"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon, KeyRoundIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, Input, Modal, ModalClose, PasswordCriteria } from "@/components";
import { passwordError } from "@/lib/password";

/*
 * There is no backend to check the existing password against, so any current
 * password is accepted. The literal "wrong" is reserved so the incorrect
 * -password state stays reachable for review, matching the convention the
 * sign-in screen uses.
 */
const REJECTED_CURRENT = "wrong";

type Errors = Partial<Record<"current" | "next" | "confirm", string>>;

export interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called once the password has actually been changed. */
  onChanged?: () => void;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onChanged,
}: ChangePasswordDialogProps) {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [errors, setErrors] = React.useState<Errors>({});
  const [isSaving, setIsSaving] = React.useState(false);

  // Reset when the dialog is dismissed, so a half-typed password is not
  // sitting in state the next time it opens.
  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setErrors({});
    setIsSaving(false);
  };

  const close = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const submit = async () => {
    const found: Errors = {};

    if (!current) found.current = "Enter your current password";
    else if (current === REJECTED_CURRENT) found.current = "Current password is incorrect";

    const problem = passwordError(next);
    if (problem) found.next = problem;
    else if (next === current) found.next = "Choose a password you haven't used here before";

    if (!confirm) found.confirm = "Re-enter the new password";
    else if (confirm !== next) found.confirm = "Passwords do not match";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setIsSaving(true);
    // Stands in for the request the real implementation would make.
    await new Promise((resolve) => setTimeout(resolve, 600));

    toast.success("Password changed", {
      description: "Use your new password the next time you sign in.",
    });
    onChanged?.();
    close(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={close}
      size="md"
      icon={<KeyRoundIcon className="size-5" />}
      title="Change password"
      description="You'll stay signed in on this device. Other sessions will need the new password."
      footer={
        <>
          <ModalClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </ModalClose>
          <Button type="submit" form="change-password-form" isLoading={isSaving}>
            Update password
          </Button>
        </>
      }
    >
      <form
        id="change-password-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-4"
      >
        <PasswordField
          label="Current password"
          name="current-password"
          autoComplete="current-password"
          value={current}
          onChange={(v) => {
            setCurrent(v);
            if (errors.current) setErrors((e) => ({ ...e, current: undefined }));
          }}
          error={errors.current}
          autoFocus
        />

        <div className="flex flex-col gap-3">
          <PasswordField
            label="New password"
            name="new-password"
            autoComplete="new-password"
            value={next}
            onChange={(v) => {
              setNext(v);
              if (errors.next) setErrors((e) => ({ ...e, next: undefined }));
            }}
            error={errors.next}
            describedBy="change-password-criteria"
          />
          <PasswordCriteria id="change-password-criteria" value={next} />
        </div>

        <PasswordField
          label="Confirm new password"
          name="confirm-password"
          autoComplete="new-password"
          value={confirm}
          onChange={(v) => {
            setConfirm(v);
            if (errors.confirm) setErrors((e) => ({ ...e, confirm: undefined }));
          }}
          error={errors.confirm}
        />
      </form>
    </Modal>
  );
}

/** A password input with a reveal toggle. */
function PasswordField({
  label,
  name,
  autoComplete,
  value,
  onChange,
  error,
  describedBy,
  autoFocus,
}: {
  label: string;
  name: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  describedBy?: string;
  autoFocus?: boolean;
}) {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <Input
      label={label}
      name={name}
      autoComplete={autoComplete}
      type={revealed ? "text" : "password"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      isInvalid={Boolean(error)}
      errorMessage={error}
      aria-describedby={describedBy}
      autoFocus={autoFocus}
      addonTrailing={
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          // The field's own label already names it; this only needs to say
          // what the control does.
          aria-label={revealed ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={revealed}
          className="grid size-6 cursor-pointer place-items-center rounded text-fg-tertiary transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none"
        >
          {revealed ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      }
    />
  );
}
