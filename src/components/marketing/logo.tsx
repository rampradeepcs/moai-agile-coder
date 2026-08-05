import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand mark from the Figma concept — a seven-petal pinwheel glyph.
 * Bare glyph (no container), tinted via currentColor.
 */
export function BrandMark({ className }: { className?: string }) {
  const petals = 7;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      {Array.from({ length: petals }, (_, i) => (
        <path
          key={i}
          d="M12 11.4 C10.9 8.1 11.6 4.7 14.1 2.2 C16 3.4 17 5.5 16.6 7.7 C16.2 9.9 14.5 11.2 12 11.4 Z"
          transform={`rotate(${(i * 360) / petals} 12 12)`}
        />
      ))}
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  compact = false,
}: {
  className?: string;
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight text-foreground",
        className
      )}
      aria-label="Agile Coder home"
    >
      <BrandMark className="size-8 shrink-0 text-brand" />
      {!compact && <span className="text-[15px]">Agile Coder</span>}
    </Link>
  );
}
