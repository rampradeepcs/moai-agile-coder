"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Shared "AI cost confirm" pattern — any edit/regenerate action that would
 * re-run generation asks the user to acknowledge the token cost first.
 */
export function AiCostConfirm({
  open,
  onOpenChange,
  title,
  sectionLabel,
  onProceed,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** e.g. "Edit basic details?" */
  title: string;
  /** e.g. "Basic details" */
  sectionLabel: string;
  onProceed: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Editing the &lsquo;{sectionLabel}&rsquo; will regenerate the project
            setup. This action will consume additional AI tokens.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onProceed}>Yes, proceed</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
