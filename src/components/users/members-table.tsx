"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { members } from "@/lib/data";
import type { Member } from "@/lib/types";
import { UserAvatar } from "@/components/work/user-avatar";
import {
  Badge,
  Button,
  Dropdown,
  Select,
  Table,
  toast,
  type TableColumn,
} from "@/components";

const humans = members.filter((m) => m.kind === "human");

const lastActive = ["2m ago", "18m ago", "1h ago", "3h ago", "yesterday", "2d ago"];
const activeIndex = new Map(humans.map((m, i) => [m.id, i]));

const workspaceRoles = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "Viewer", label: "Viewer" },
];

export function MembersTable() {
  const [selected, setSelected] = React.useState<string[]>([]);

  const columns: TableColumn<Member>[] = [
    {
      key: "member",
      header: "Member",
      sortable: true,
      sortValue: (m) => m.name,
      cell: (m) => (
        <span className="flex items-center gap-2.5">
          <UserAvatar member={m} size="md" showTooltip={false} />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-fg-primary">{m.name}</span>
            <span className="text-[11px] text-fg-tertiary">{m.email}</span>
          </span>
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      sortValue: (m) => m.role,
      cell: (m) => <span className="text-xs text-fg-tertiary">{m.role}</span>,
    },
    {
      key: "workspaceRole",
      header: "Workspace role",
      width: "11rem",
      cell: (m) =>
        activeIndex.get(m.id) === 0 ? (
          <Select
            size="sm"
            disabled
            defaultValue="super-admin"
            options={[{ value: "super-admin", label: "Super admin" }]}
          />
        ) : (
          <Select
            size="sm"
            defaultValue="Member"
            options={workspaceRoles}
            onValueChange={(v) => toast.success(`${m.name} is now ${v}`)}
          />
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: () => (
        <Badge size="sm" color="success" withDot>
          Active
        </Badge>
      ),
    },
    {
      key: "lastActive",
      header: "Last active",
      sortable: true,
      sortValue: (m) => activeIndex.get(m.id) ?? 0,
      cell: (m) => (
        <span className="text-xs text-fg-tertiary">
          {lastActive[(activeIndex.get(m.id) ?? 0) % lastActive.length]}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "3.5rem",
      cell: (m) => (
        <Dropdown
          align="end"
          trigger={
            <Button
              variant="tertiary"
              size="sm"
              aria-label={`Actions for ${m.name}`}
              className="size-8 px-0"
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          }
          items={[
            {
              id: "role",
              label: "Change role",
              onSelect: () =>
                toast.info(`Change role for ${m.name}`, {
                  description: "Use the workspace role dropdown.",
                }),
            },
            {
              id: "deactivate",
              label: "Deactivate",
              onSelect: () => toast.success(`${m.name} deactivated`),
            },
            {
              id: "remove",
              label: "Remove",
              destructive: true,
              onSelect: () => toast.success(`${m.name} removed from workspace`),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Table
      data={humans}
      columns={columns}
      rowKey={(m) => m.id}
      selectable
      selectedKeys={selected}
      onSelectionChange={setSelected}
      defaultSortKey="member"
      caption={
        selected.length > 0
          ? `${selected.length} of ${humans.length} selected`
          : `${humans.length} members`
      }
    />
  );
}
