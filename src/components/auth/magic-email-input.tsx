"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface MagicEmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  id?: string;
  label?: string;
}

// Gap between the end of the rendered text and the wand's *near* (bottom-
// left) edge once rotated, so the wand never sits on top of a character.
const WAND_REST_OFFSET = 2;
const OPTICAL_GAP = 6;
// The wand's near (bottom-left) edge, measured empirically against the
// current CSS (7px wide x 34px tall, rotate(20deg), translate3d(--wand-x,
// -72%, 0)) — absorbs both the rotated-box half-width and the drop-shadow
// filter's visual bleed, which getBoundingClientRect doesn't include.
const WAND_NEAR_EDGE_ALLOWANCE = 14;
const WAND_TOTAL_GAP = OPTICAL_GAP + WAND_NEAR_EDGE_ALLOWANCE;
// Room reserved on the right so the wand's far (top) edge — which swings
// further right as it rotates — never gets clipped by the field.
const WAND_RIGHT_CLEARANCE = 34;

function commonPrefixLength(a: string, b: string) {
  const len = Math.min(a.length, b.length);
  let i = 0;
  while (i < len && a[i] === b[i]) i++;
  return i;
}

/**
 * A "magical" email field: the real `<input>` holds focus, selection and
 * paste behaviour as normal but renders its text transparent, while a
 * pointer-events-none overlay draws each character with a small reveal pop
 * and keeps a wand tip hovering just past the caret.
 */
export function MagicEmailInput({
  value,
  onChange,
  placeholder,
  name,
  autoComplete,
  isInvalid,
  errorMessage,
  id,
  label,
}: MagicEmailInputProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const overlayTextRef = React.useRef<HTMLSpanElement>(null);
  const wandRef = React.useRef<HTMLDivElement>(null);
  const particlesRef = React.useRef<HTMLDivElement>(null);
  const prevValueRef = React.useRef("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [newCharRange, setNewCharRange] = React.useState<{ from: number; to: number } | null>(
    null,
  );
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const updateWandAndClip = React.useCallback(() => {
    const overlayText = overlayTextRef.current;
    const overlay = overlayRef.current;
    const wand = wandRef.current;
    if (!overlayText || !overlay || !wand) return;

    const textWidth = overlayText.offsetWidth;
    const availWidth = overlay.clientWidth;

    const shift = Math.min(0, availWidth - textWidth - WAND_TOTAL_GAP - WAND_RIGHT_CLEARANCE);
    overlayText.style.transform = `translateX(${shift}px)`;

    const textEndX = textWidth + shift;
    let wandX = textWidth === 0 ? WAND_REST_OFFSET : textEndX + WAND_TOTAL_GAP;
    const maxX = availWidth - WAND_RIGHT_CLEARANCE;
    wandX = Math.max(WAND_REST_OFFSET, Math.min(wandX, maxX));

    wand.style.setProperty("--wand-x", `${wandX}px`);
  }, []);

  const spawnParticles = React.useCallback((count: number) => {
    const wand = wandRef.current;
    const host = particlesRef.current;
    if (!wand || !host) return;
    const wandRect = wand.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    const originX = wandRect.left - hostRect.left + wandRect.width / 2;
    const originY = wandRect.top - hostRect.top + 8;

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "wk-magic-particle";
      const angle = Math.random() * Math.PI - Math.PI / 2 - Math.PI / 4;
      const dist = 10 + Math.random() * 14;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist - 6;
      el.style.setProperty("--px", `${px.toFixed(1)}px`);
      el.style.setProperty("--py", `${py.toFixed(1)}px`);
      el.style.left = `${originX}px`;
      el.style.top = `${originY}px`;
      const delay = Math.random() * 80;
      el.style.animationDelay = `${delay}ms`;
      host.appendChild(el);
      window.setTimeout(() => {
        el.remove();
      }, 460 + delay + 60);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    const prevValue = prevValueRef.current;
    const prefixLen = commonPrefixLength(prevValue, nextValue);
    const added = nextValue.length > prevValue.length && prefixLen === prevValue.length;

    setNewCharRange(added ? { from: prefixLen, to: nextValue.length } : null);

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (added && !reducedMotion) {
      const diff = nextValue.length - prevValue.length;
      spawnParticles(Math.max(2, Math.min(4, diff + 1)));
    }

    prevValueRef.current = nextValue;
    onChange(nextValue);
  };

  React.useEffect(() => {
    const raf = requestAnimationFrame(updateWandAndClip);
    return () => cancelAnimationFrame(raf);
  }, [value, updateWandAndClip]);

  React.useEffect(() => {
    const handleResize = () => requestAnimationFrame(updateWandAndClip);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateWandAndClip]);

  const chars = value.split("");
  const description = isInvalid && errorMessage ? errorMessage : undefined;
  const describedById = `${inputId}-description`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-caption-1 text-muted-foreground">
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative flex h-11 w-full items-stretch overflow-hidden rounded-[10px] border bg-card text-button-1 shadow-input-inner transition-colors",
          isInvalid
            ? "border-error-500"
            : "border-border focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/30",
        )}
      >
        <input
          id={inputId}
          type="text"
          inputMode="email"
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Email id"
          aria-invalid={isInvalid || undefined}
          aria-describedby={description ? describedById : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 font-medium text-transparent caret-transparent outline-none placeholder:font-medium placeholder:text-muted-foreground/70"
        />

        <div className="wk-email-overlay" ref={overlayRef} aria-hidden="true">
          <span className="wk-email-overlay-text font-medium text-foreground" ref={overlayTextRef}>
            {chars.map((ch, i) => (
              <span
                key={i}
                className={cn(
                  "wk-char",
                  newCharRange && i >= newCharRange.from && i < newCharRange.to && "wk-char-new",
                )}
              >
                {ch}
              </span>
            ))}
          </span>
          <div className={cn("wk-magic-wand", isFocused && "is-active")} ref={wandRef}>
            <svg viewBox="0 0 40 220" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="58" width="24" height="158" rx="12" fill="#111114" />
              <rect x="8" y="0" width="24" height="66" rx="12" fill="#f2f5f8" />
            </svg>
          </div>
          <div className="wk-magic-particles" ref={particlesRef} />
        </div>
      </div>

      {description && (
        <p id={describedById} className="text-caption-1 text-error-500">
          {description}
        </p>
      )}
    </div>
  );
}
