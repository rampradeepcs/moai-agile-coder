"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { childrenOf, epics } from "@/lib/data";
import { TypeBadge } from "@/components/work/badges";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AiCostConfirm } from "./ai-cost-confirm";
import { CornerDownRight, Pencil } from "lucide-react";

export function InfoArchitectureTab() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const verify = () => {
    if (otp.length === 4) {
      setOtpOpen(false);
      setOtp("");
      toast.success("Verified — regeneration queued");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Information architecture</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Generated epic &amp; story structure for PawCare. Read-only —
            editing regenerates downstream artifacts.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
          <Pencil className="size-3.5" aria-hidden />
          Edit
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {epics.map((epic, i) => {
          const children = childrenOf(epic.id);
          return (
            <motion.div
              key={epic.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="rounded-xl border bg-card p-4 shadow-elevation-low"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <TypeBadge type="epic" />
                  <span className="truncate text-sm font-semibold">
                    {epic.title}
                  </span>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {epic.key}
                </span>
              </div>
              {children.length > 0 ? (
                <ul className="mt-3 space-y-1.5 border-l pl-3">
                  {children.map((c) => (
                    <li key={c.id} className="flex min-w-0 items-center gap-2">
                      <CornerDownRight
                        className="size-3 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                      <TypeBadge type={c.type} />
                      <span className="truncate text-xs">{c.title}</span>
                      <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                        {c.key}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">
                  No stories generated yet.
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <AiCostConfirm
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Edit information architecture?"
        sectionLabel="Information architecture"
        onProceed={() => setOtpOpen(true)}
      />

      <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Verify with OTP</DialogTitle>
            <DialogDescription>
              Enter the 4-digit code sent to your email to confirm the
              regeneration.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-2">
            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOtpOpen(false)}>
              Cancel
            </Button>
            <Button disabled={otp.length < 4} onClick={verify}>
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
