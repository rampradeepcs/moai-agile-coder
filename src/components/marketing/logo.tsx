import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elevation-low">
        <Sparkles className="size-4" />
      </span>
      {!compact && <span className="text-[15px]">Agile Coder</span>}
    </Link>
  );
}
