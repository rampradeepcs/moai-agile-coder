import { cn } from "@/lib/utils";
import type { Member } from "@/lib/types";
import { Avatar, Tooltip } from "@/components";
import { Bot } from "lucide-react";

/** Per-member sizing kept from the original wrapper so 26 call sites are unaffected. */
const sizeClasses = {
  xs: "size-5 text-[9px]",
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
};

export function UserAvatar({
  member,
  size = "md",
  className,
  showTooltip = true,
}: {
  member?: Member;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showTooltip?: boolean;
}) {
  const avatar = (
    <Avatar
      name={member?.name}
      initials={member ? undefined : "?"}
      // The member's own colour drives the chip, so the fallback stays transparent.
      style={{ backgroundColor: member?.color ?? "var(--muted)" }}
      fallbackClassName="text-white"
      className={cn("ring-1 ring-border", sizeClasses[size], className)}
    />
  );

  if (!showTooltip || !member) return avatar;

  return (
    <Tooltip title={member.name} description={member.role} side="top">
      <span className="relative inline-flex">
        {avatar}
        {member.kind === "agent" && (
          <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-brand p-px text-white ring-1 ring-background">
            <Bot className="size-2.5" aria-hidden />
          </span>
        )}
      </span>
    </Tooltip>
  );
}

export function AssigneeInline({ member, size = "md" }: { member?: Member; size?: "xs" | "sm" | "md" }) {
  if (!member) return <span className="text-xs text-muted-foreground">Unassigned</span>;
  return (
    <span className="flex min-w-0 items-center gap-2">
      <UserAvatar member={member} size={size === "md" ? "sm" : size} showTooltip={false} />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-xs font-medium">{member.name}</span>
        <span className="truncate text-[10px] text-muted-foreground">{member.role}</span>
      </span>
    </span>
  );
}
