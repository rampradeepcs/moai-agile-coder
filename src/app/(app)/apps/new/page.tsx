"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocgenStepper } from "@/components/docgen/stepper";
import { ChatFlow } from "@/components/docgen/chat-flow";
import { RequirementDoc } from "@/components/docgen/requirement-doc";
import { DesignDoc } from "@/components/docgen/design-doc";

type Phase = "chat" | "reqdoc" | "designdoc" | "done";

export default function NewAppPage() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<Phase>("chat");
  // 0 Basic details · 1 Requirement gatherings · 2 Requirement doc · 3 Design doc
  const [stepperIndex, setStepperIndex] = React.useState(0);

  return (
    <div className="flex h-svh min-h-0 flex-col">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b px-6 py-3">
        <div className="min-w-0 flex-1 overflow-x-auto">
          <DocgenStepper current={stepperIndex} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/apps">Cancel</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Draft saved — pick it up anytime from Apps")}
          >
            Save as draft
          </Button>
        </div>
      </header>

      {/* Body */}
      <AnimatePresence mode="wait">
        {phase === "chat" && (
          <motion.div
            key="chat"
            className="flex min-h-0 flex-1 flex-col"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChatFlow
              onReachGathering={() => setStepperIndex(1)}
              onApprove={() => {
                setStepperIndex(2);
                setPhase("reqdoc");
              }}
            />
          </motion.div>
        )}

        {phase === "reqdoc" && (
          <motion.div
            key="reqdoc"
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RequirementDoc
              onApprove={() => {
                setStepperIndex(3);
                setPhase("designdoc");
              }}
            />
          </motion.div>
        )}

        {phase === "designdoc" && (
          <motion.div
            key="designdoc"
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DesignDoc onApprove={() => setPhase("done")} />
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            className="flex flex-1 flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            >
              <CheckCircle2 className="size-16 text-success" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-6 text-2xl font-bold tracking-tight"
            >
              PawCare workspace is ready
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-2 max-w-md text-sm text-muted-foreground"
            >
              Epics, stories and pipelines were generated from your documents.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Button
                size="lg"
                className="mt-8"
                onClick={() => router.push("/apps/paw-care/backlog")}
              >
                Open Paw care
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
