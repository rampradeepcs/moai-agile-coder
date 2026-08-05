"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const permissions = [
  "Manage workspace",
  "Invite users",
  "Manage billing & tokens",
  "Create applications",
  "Approve documents",
  "Configure kanban",
  "View analytics",
];

interface RoleDef {
  name: string;
  description: string;
  granted: string[];
  locked?: boolean;
}

const roles: RoleDef[] = [
  {
    name: "Super admin",
    description:
      "Full control of the workspace, billing and every application. There is exactly one super admin.",
    granted: permissions,
    locked: true,
  },
  {
    name: "Admin",
    description:
      "Manages people and applications day to day. Cannot touch billing or delete the workspace.",
    granted: [
      "Invite users",
      "Create applications",
      "Approve documents",
      "Configure kanban",
      "View analytics",
    ],
  },
  {
    name: "Member",
    description:
      "Builds and ships. Works inside applications they're added to and can view analytics.",
    granted: ["Create applications", "View analytics"],
  },
];

export function RolesCards() {
  const [grants, setGrants] = useState<Record<string, Record<string, boolean>>>(
    () =>
      Object.fromEntries(
        roles.map((r) => [
          r.name,
          Object.fromEntries(
            permissions.map((p) => [p, r.granted.includes(p)]),
          ),
        ]),
      ),
  );

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {roles.map((r) => (
        <div
          key={r.name}
          className="rounded-xl border bg-card p-5 shadow-elevation-low"
        >
          <h3 className="text-sm font-semibold">{r.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {r.description}
          </p>
          <div className="mt-4 space-y-2.5 border-t pt-4">
            {permissions.map((p) => (
              <label
                key={p}
                className={
                  r.locked
                    ? "flex items-center gap-2 text-sm opacity-70"
                    : "flex cursor-pointer items-center gap-2 text-sm"
                }
              >
                <Checkbox
                  checked={grants[r.name][p]}
                  disabled={r.locked}
                  onCheckedChange={(v) =>
                    setGrants((prev) => ({
                      ...prev,
                      [r.name]: { ...prev[r.name], [p]: v === true },
                    }))
                  }
                />
                {p}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
