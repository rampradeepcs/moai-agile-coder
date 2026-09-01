"use client";

import * as React from "react";

import { activity, memberById } from "@/lib/data";
import { UserAvatar } from "@/components/work/user-avatar";
import { panelClasses } from "@/components/shared";
import { EmptyState, Pagination } from "@/components";
import { HistoryIcon } from "lucide-react";

const PAGE_SIZE = 4;

export function ActivityList() {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(Math.ceil(activity.length / PAGE_SIZE), 1);
  // Clamp during render so a shrinking feed can't strand us past the last page.
  const currentPage = Math.min(page, totalPages);
  const visible = activity.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div className={panelClasses({ padding: "none" })}>
        {visible.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon />}
            title="No activity yet"
            description="Actions taken by people and AI agents will show up here."
          />
        ) : (
          <ul className="divide-y">
            {visible.map((ev) => {
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
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          variant="compact"
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
