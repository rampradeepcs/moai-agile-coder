"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  AiSparklesIcon,
  EcommerceIcon,
  MicrophoneIcon,
  PaperclipIcon,
  SaasIcon,
  SendIcon,
  SprintIcon,
  type ChatIconProps,
} from "./chat-icons";

/*
 * New-chat entry screen from the WizKraft Figma app layout (file
 * DTfOUMmRzfz8munYZnMkr7, node 22:1488). The design centres a 1114px column;
 * here that is a max-width so the screen still holds together below it.
 */

const SUGGESTIONS: {
  id: string;
  icon: React.ComponentType<ChatIconProps>;
  title: string;
  body: string;
}[] = [
  {
    id: "saas",
    icon: SaasIcon,
    title: "Build a SaaS application for doctors",
    body: "Turn your idea into a complete product plan with features, requirements, and development tasks.",
  },
  {
    id: "ecommerce",
    icon: EcommerceIcon,
    title: "Create an e-commerce platform",
    body: "Turn your idea into a structured product with user flows, requirements, and a clear development plan.",
  },
  {
    id: "sprint",
    icon: SprintIcon,
    title: "Build a project management tool",
    body: "Shape your idea into features, requirements, and an actionable roadmap ready to build.",
  },
];

export function NewChatIntro({ onStart }: { onStart: (prompt: string) => void }) {
  const [prompt, setPrompt] = React.useState("");

  const submit = () => {
    const value = prompt.trim();
    if (value) onStart(value);
  };

  return (
    <div className="relative flex flex-1 items-center justify-center px-4 py-8">
      {/* The wizard silhouette the design floats behind the column. */}
      <Image
        aria-hidden
        src="/chat/watermark.svg"
        alt=""
        width={336}
        height={298}
        priority
        className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-[92%] opacity-60 lg:block"
      />

      <div className="relative flex w-full max-w-[1114px] flex-col items-center gap-4">
        <div className="flex w-full flex-col items-center gap-1">
          <div className="flex items-center justify-center gap-1">
            <h1 className="text-center text-2xl font-semibold text-gray-700 sm:text-head-1">
              Craft better work with <span className="text-brand-600">AI</span>
            </h1>
            <AiSparklesIcon className="size-6 shrink-0" />
          </div>
          <p className="text-center text-body-sm text-gray-500">
            Your team&rsquo;s intelligent workshop for turning ideas into outcomes.
          </p>
        </div>

        <div className="flex h-[120px] w-full flex-col gap-2 rounded-[10px] border border-white bg-sidebar p-5 shadow-[0px_10px_15px_rgba(0,0,0,0.04)]">
          <label htmlFor="new-chat-prompt" className="sr-only">
            What shall we craft today?
          </label>
          <textarea
            id="new-chat-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends; Shift+Enter keeps the newline.
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder="What shall we craft today?"
            className="min-h-0 w-full flex-1 resize-none bg-transparent text-body-md text-foreground outline-none placeholder:text-gray-300"
          />

          <div className="flex w-full items-center justify-between">
            <ComposerButton label="Attach a file">
              <PaperclipIcon className="size-4" />
            </ComposerButton>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex cursor-pointer items-baseline gap-2 rounded text-center focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none"
              >
                <span className="flex items-baseline gap-1">
                  <span className="text-body-sm text-foreground">5.6 Terra</span>
                  <span className="text-overline-1 text-gray-500">Medium</span>
                </span>
                <ChevronDown />
              </button>

              <ComposerButton label="Dictate">
                <MicrophoneIcon className="size-4" />
              </ComposerButton>

              <button
                type="button"
                onClick={submit}
                disabled={!prompt.trim()}
                aria-label="Start crafting"
                className={cn(
                  "grid size-8 shrink-0 cursor-pointer place-items-center rounded bg-card transition-opacity",
                  "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                )}
              >
                <SendIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUGGESTIONS.map(({ id, icon: Icon, title, body }) => (
            <button
              key={id}
              type="button"
              onClick={() => onStart(title)}
              className={cn(
                "flex cursor-pointer flex-col items-start gap-8 rounded-[10px] border border-gray-alpha10 bg-background px-4 py-3 text-left transition-colors",
                "hover:border-brand-600/40 focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              <span className="flex flex-col gap-1">
                <span className="text-body-sm text-foreground">{title}</span>
                <span className="text-overline-1 text-gray-500">{body}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComposerButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-4 shrink-0 cursor-pointer place-items-center rounded text-foreground transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none"
    >
      {children}
    </button>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" aria-hidden>
      <path
        d="M13.28 5.97 8.93 10.31a1.33 1.33 0 0 1-1.86 0L2.72 5.97"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
