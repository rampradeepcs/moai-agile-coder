"use client";

import { activity, memberById } from "@/lib/data";
import { UserAvatar } from "@/components/work/user-avatar";
import { panelClasses } from "@/components/shared";

export function ActivityList() {
  return (
    <div className={panelClasses({ padding: "none", className: "max-w-2xl" })}>
      <ul className="divide-y">
        {activity.map((ev) => {
          const actor = memberById(ev.actorId);
          return (
            <li key={ev.id} className="flex items-center gap-3 px-4 py-3">
              <UserAvatar member={actor} size="sm" showTooltip={false} />
              <p className="min-w-0 flex-1 truncate text-sm">
                <span className="font-medium">{actor?.name ?? "Someone"}</span>{" "}
                <span className="text-muted-foreground">{ev.action}</span>{" "}
                <span className="font-medium">{ev.target}</span>
              </p>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {ev.at}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
