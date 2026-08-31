"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { panelClasses } from "@/components/shared";

interface PromptCardProps {
  placeholder?: string;
  /** When provided, submitting navigates here (marketing usage). */
  href?: string;
  /** When provided, submitting calls this instead of navigating. */
  onSubmit?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function PromptCard({
  placeholder = "What do you want to build today?",
  href,
  onSubmit,
  className,
  autoFocus,
}: PromptCardProps) {
  const router = useRouter();
  const [value, setValue] = React.useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (onSubmit) {
      onSubmit(trimmed);
      setValue("");
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <div
      className={cn(
        panelClasses({ padding: "none", elevation: "high", className: "w-full max-w-2xl p-3" }),
        className
      )}
    >
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label="Describe what you want to build"
        className="min-h-20 resize-none border-0 bg-transparent px-1.5 shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Attach a file">
            <Paperclip />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Dictate with your voice">
            <Mic />
          </Button>
        </div>
        <Button
          size="icon-sm"
          className="rounded-full"
          aria-label="Send prompt"
          onClick={submit}
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}
