import { cn } from "@/lib/utils";
import type { Member } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot } from "lucide-react";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
  const sizeClass = { xs: "size-5 text-[9px]", sm: "size-6 text-[10px]", md: "size-8 text-xs", lg: "size-10 text-sm" }[size];

  const avatar = (
    <Avatar className={cn(sizeClass, "ring-1 ring-border", className)}>
      <AvatarFallback
        className="font-semibold text-white"
        style={{ backgroundColor: member?.color ?? "var(--muted)" }}
      >
        {member ? (
          member.kind === "agent" && size !== "xs" ? (
            <span className="relative inline-flex items-center justify-center">
              {initials(member.name)}
            </span>
          ) : (
            initials(member.name)
          )
        ) : (
          "?"
        )}
      </AvatarFallback>
    </Avatar>
  );

  if (!showTooltip || !member) return avatar;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="relative inline-flex">
          {avatar}
          {member.kind === "agent" && (
            <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-brand p-px text-white ring-1 ring-background">
              <Bot className="size-2.5" aria-hidden />
            </span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="flex flex-col gap-0.5">
        <span className="font-medium">{member.name}</span>
        <span className="text-[11px] opacity-80">{member.role}</span>
      </TooltipContent>
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
