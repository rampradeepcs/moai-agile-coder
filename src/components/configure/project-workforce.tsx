"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { members, pipelines } from "@/lib/data";
import type { Member } from "@/lib/types";
import { AgentBadge } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ————— data ————— */

const humans = members.filter((m) => m.kind === "human");
const agents = members.filter((m) => m.kind === "agent");

/** Stable member → team mapping for this project. */
const teamByMember: Record<string, string> = {
  u1: "Project management",
  u2: "Project management",
  u3: "Design",
  u4: "Frontend",
  u5: "Backend",
  u6: "Testing",
};

const teamNames = [
  "Project management",
  "Design",
  "Frontend",
  "Backend",
  "Testing",
  "DevOps",
];

const assignedStageCount = (agentId: string) =>
  pipelines.reduce(
    (n, p) => n + p.stages.filter((s) => s.agentId === agentId).length,
    0,
  );

const assignedProjects = [
  { name: "Nuclyo", description: "Nuclear-grade project analytics suite.", color: "#7c5cff" },
  { name: "Wear wise", description: "Wearables companion for daily wellness.", color: "#22b07d" },
  { name: "Rydyt", description: "On-demand ride booking marketplace.", color: "#e8a33d" },
  { name: "Agile coder", description: "AI-native agile delivery workspace.", color: "#3d8de8" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const memberTeam = (m: Member) =>
  m.kind === "agent" ? "AI workforce" : (teamByMember[m.id] ?? "—");

const memberManager = (m: Member) => (m.id === "u1" ? "—" : "Ram Pradeep");

function ActiveChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-success-subtle px-2 py-0.5 text-[11px] font-medium text-success">
      <span className="size-1.5 rounded-full bg-success" aria-hidden />
      Active
    </span>
  );
}

/* ————— view ————— */

export function ProjectWorkforce({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"employees" | "agents">("employees");
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [viewing, setViewing] = useState<Member | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const visibleHumans = humans.filter((m) => !removedIds.includes(m.id));

  const removeMember = (m: Member) => {
    setRemovedIds((ids) => [...ids, m.id]);
    toast.success(`${m.name} removed from this project`);
  };

  /* ——— inline "View user" detail ——— */
  if (viewing) {
    const m = viewing;
    const details = [
      { label: "Email id", value: m.email },
      { label: "User name", value: m.name },
      { label: "Team", value: memberTeam(m) },
      { label: "Role", value: m.role },
      { label: "Manager", value: memberManager(m) },
      { label: "Status", value: "Active" },
    ];
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setViewing(null)}
            className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" aria-hidden />
            View user
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 py-2">
          <span
            className="flex size-24 items-center justify-center rounded-full text-2xl font-semibold text-white ring-1 ring-border"
            style={{ backgroundColor: m.color }}
            aria-hidden
          >
            {initials(m.name)}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">{m.name}</span>
            {m.kind === "agent" && <AgentBadge />}
          </div>
          <span className="text-sm text-muted-foreground">{m.role}</span>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-soft">
          <h3 className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Basic details
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            {details.map((d) => (
              <div key={d.label} className="flex min-w-0 flex-col gap-1">
                <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  {d.label}
                </span>
                {d.label === "Status" ? (
                  <span>
                    <ActiveChip />
                  </span>
                ) : (
                  <span className="truncate text-sm" title={d.value}>
                    {d.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-soft">
          <h3 className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Assigned projects
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {assignedProjects.map((p) => (
              <div
                key={p.name}
                className="flex items-start gap-3 rounded-xl border bg-surface p-3.5 transition-shadow hover:shadow-elevation-low"
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: p.color }}
                  aria-hidden
                >
                  {p.name[0]}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">{p.name}</span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">
                    {p.description}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  /* ——— list ——— */
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Project Workforce
        </button>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <Plus className="size-3.5" aria-hidden />
          Invite workforce
        </Button>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Workforce type"
        className="flex w-fit shrink-0 items-center gap-1 rounded-full border bg-card p-1 shadow-elevation-low"
      >
        {(
          [
            { id: "employees", label: "Employees" },
            { id: "agents", label: "Agents" },
          ] as const
        ).map((option) => {
          const active = tab === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(option.id)}
              className={cn(
                "relative rounded-lg px-4 py-1.5 text-xs font-medium transition-colors",
                active ? "text-white" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="workforce-tab-pill"
                  className="absolute inset-0 rounded-full bg-brand-gradient shadow-elevation-low"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-x-auto rounded-xl border bg-card shadow-soft"
      >
        {tab === "employees" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-muted-foreground">Member</TableHead>
                <TableHead className="text-xs text-muted-foreground">Team</TableHead>
                <TableHead className="text-xs text-muted-foreground">Role</TableHead>
                <TableHead className="text-xs text-muted-foreground">Manager</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-xs text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleHumans.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <UserAvatar member={m} showTooltip={false} />
                      <span className="flex min-w-0 flex-col leading-tight">
                        <span className="truncate text-sm font-medium">{m.name}</span>
                        <span className="truncate text-xs text-muted-foreground">{m.email}</span>
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{memberTeam(m)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.role}</TableCell>
                  <TableCell className="text-sm">{memberManager(m)}</TableCell>
                  <TableCell>
                    <ActiveChip />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`View ${m.name}`}
                        onClick={() => setViewing(m)}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Edit ${m.name}`}
                        onClick={() => toast(`Editing ${m.name} — coming soon`)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${m.name}`}
                        className="text-danger hover:text-danger"
                        onClick={() => removeMember(m)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-muted-foreground">Agent</TableHead>
                <TableHead className="text-xs text-muted-foreground">Specialty</TableHead>
                <TableHead className="text-xs text-muted-foreground">Assigned stages</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-xs text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <UserAvatar member={m} showTooltip={false} />
                      <span className="truncate text-sm font-medium">{m.name}</span>
                      <AgentBadge />
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.role}</TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {assignedStageCount(m.id)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      defaultChecked
                      aria-label={`Toggle ${m.name} active`}
                      onCheckedChange={(checked) =>
                        toast(`${m.name} ${checked ? "activated" : "paused"}`)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`View ${m.name}`}
                        onClick={() => setViewing(m)}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Edit ${m.name}`}
                        onClick={() => toast(`Editing ${m.name} — coming soon`)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${m.name}`}
                        className="text-danger hover:text-danger"
                        onClick={() => toast(`${m.name} can't be removed while assigned to stages`)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* ——— Invite dialog ——— */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite workforce</DialogTitle>
            <DialogDescription>
              Invite teammates by email and place them on a team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="invite-emails" className="text-xs text-muted-foreground">
                Email addresses
              </Label>
              <Textarea
                id="invite-emails"
                rows={3}
                placeholder="jane@company.com, arun@company.com…"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Team</Label>
              <Select defaultValue={teamNames[0]}>
                <SelectTrigger className="w-full" aria-label="Team">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teamNames.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="invite-role" className="text-xs text-muted-foreground">
                Role
              </Label>
              <Input id="invite-role" placeholder="e.g. Frontend engineer" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setInviteOpen(false);
                toast.success("Invites sent");
              }}
            >
              Send invites
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
