"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  LayoutGrid,
  Pencil,
  Plus,
  Table2,
  Trash2,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SearchInput, panelClasses } from "@/components/shared";
import { Drawer, EmptyState } from "@/components";
import { members, memberById } from "@/lib/data";
import type { Member } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar, AssigneeInline } from "@/components/work/user-avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

/* ————— model ————— */

interface Team {
  id: string;
  name: string;
  /** pipeline-* utility class — sets --pipeline / --pipeline-soft */
  colorClass?: string;
  /** direct hex, used when no colorClass */
  hex?: string;
  description: string;
  memberIds: string[];
  agentIds: string[];
  status: "active" | "inactive";
}

const seedTeams: Team[] = [
  {
    id: "t-pm",
    name: "Project management",
    colorClass: "pipeline-pm",
    description:
      "Oversee project timelines, coordinate team efforts, and keep sprints aligned with delivery goals.",
    memberIds: ["u1", "u2"],
    agentIds: ["a1", "a2"],
    status: "active",
  },
  {
    id: "t-design",
    name: "Design",
    colorClass: "pipeline-design",
    description:
      "Own research, information architecture and visual design across all product surfaces.",
    memberIds: ["u3"],
    agentIds: ["a3", "a4", "a5", "a6"],
    status: "active",
  },
  {
    id: "t-frontend",
    name: "Frontend",
    colorClass: "pipeline-frontend",
    description:
      "Build the client experience — components, API integration and performance.",
    memberIds: ["u4"],
    agentIds: ["a7"],
    status: "active",
  },
  {
    id: "t-backend",
    name: "Backend",
    colorClass: "pipeline-backend",
    description:
      "Design services, data models and APIs that power the platform securely at scale.",
    memberIds: ["u5"],
    agentIds: ["a8", "a9", "a10"],
    status: "active",
  },
  {
    id: "t-testing",
    name: "Testing",
    colorClass: "pipeline-testing",
    description:
      "Plan and automate quality assurance across critical flows and releases.",
    memberIds: ["u6"],
    agentIds: [],
    status: "active",
  },
  {
    id: "t-devops",
    name: "DevOps",
    hex: "#3d8de8",
    description: "Keep environments, CI/CD and releases healthy and repeatable.",
    memberIds: ["u5"],
    agentIds: [],
    status: "active",
  },
  {
    id: "t-sales",
    name: "Sales",
    hex: "#22b07d",
    description: "Drive pipeline, demos and customer conversations.",
    memberIds: ["u2"],
    agentIds: [],
    status: "inactive",
  },
  {
    id: "t-marketing",
    name: "Marketing",
    hex: "#e8a33d",
    description: "Grow awareness through campaigns, content and social media.",
    memberIds: ["u3"],
    agentIds: [],
    status: "active",
  },
];

const suggestedNames = [
  "Product management",
  "Design",
  "Frontend",
  "Backend",
  "Social media",
  "Marketing",
  "Sales",
];

const swatches = ["#7c5cff", "#3d8de8", "#22b07d", "#e8a33d", "#e25c5c", "#c85ce2"];

const humans = members.filter((m) => m.kind === "human");
const agents = members.filter((m) => m.kind === "agent");

/** Solid + soft colors for a team, from its pipeline class or hex. */
function teamColor(team: Pick<Team, "colorClass" | "hex">) {
  if (team.colorClass) {
    return {
      className: team.colorClass,
      solid: "var(--pipeline)",
      soft: "var(--pipeline-soft)",
    };
  }
  const hex = team.hex ?? "#7c5cff";
  return {
    className: undefined,
    solid: hex,
    soft: `color-mix(in oklch, ${hex} 12%, transparent)`,
  };
}

function AvatarStack({ ids, max = 4 }: { ids: string[]; max?: number }) {
  const shown = ids.slice(0, max);
  const extra = ids.length - shown.length;
  return (
    <span className="flex items-center -space-x-2">
      {shown.map((id) => (
        <UserAvatar key={id} member={memberById(id)} size="sm" className="ring-2 ring-card" />
      ))}
      {extra > 0 && (
        <span className="z-10 inline-flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
          +{extra}
        </span>
      )}
    </span>
  );
}

function StatusChip({ status }: { status: Team["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium",
        status === "active"
          ? "bg-success-subtle text-success"
          : "bg-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "active" ? "bg-success" : "bg-muted-foreground",
        )}
        aria-hidden
      />
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

function MemberPickChip({
  member,
  selected,
  onToggle,
}: {
  member: Member;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "flex items-center gap-1.5 rounded-full border py-1 pr-2.5 pl-1 text-xs font-medium transition-colors",
        selected
          ? "bg-brand-subtle text-brand ring-1 ring-brand"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <UserAvatar member={member} size="xs" showTooltip={false} />
      {member.name}
    </button>
  );
}

/* ————— edit dialog ————— */

interface Draft {
  name: string;
  hex?: string;
  colorClass?: string;
  description: string;
  memberIds: string[];
  agentIds: string[];
}

const emptyDraft: Draft = {
  name: "",
  hex: undefined,
  colorClass: undefined,
  description: "",
  memberIds: [],
  agentIds: [],
};

/* ————— view ————— */

export function TeamManagement({ onBack }: { onBack: () => void }) {
  const [teams, setTeams] = useState<Team[]>(seedTeams);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"card" | "table">("card");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const [viewTeamId, setViewTeamId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const viewedTeam = teams.find((t) => t.id === viewTeamId);
  const deletingTeam = teams.find((t) => t.id === deleteId);

  const filtered = useMemo(
    () =>
      teams.filter(
        (t) =>
          t.name.toLowerCase().includes(query.trim().toLowerCase()) &&
          (statusFilter === "all" || t.status === statusFilter),
      ),
    [teams, query, statusFilter],
  );

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setDialogOpen(true);
  };

  const openEdit = (team: Team) => {
    setEditingId(team.id);
    setDraft({
      name: team.name,
      hex: team.hex,
      colorClass: team.colorClass,
      description: team.description,
      memberIds: team.memberIds,
      agentIds: team.agentIds,
    });
    setDialogOpen(true);
  };

  const saveDraft = () => {
    const name = draft.name.trim();
    if (!name) {
      toast.error("Team name is required.");
      return;
    }
    if (editingId) {
      setTeams((ts) =>
        ts.map((t) =>
          t.id === editingId
            ? {
                ...t,
                name,
                hex: draft.hex,
                colorClass: draft.colorClass,
                description: draft.description,
                memberIds: draft.memberIds,
                agentIds: draft.agentIds,
              }
            : t,
        ),
      );
      toast.success(`Team "${name}" updated`);
    } else {
      setTeams((ts) => [
        ...ts,
        {
          id: `t-${Date.now()}`,
          name,
          hex: draft.hex ?? swatches[ts.length % swatches.length],
          colorClass: draft.colorClass,
          description: draft.description,
          memberIds: draft.memberIds,
          agentIds: draft.agentIds,
          status: "active",
        },
      ]);
      toast.success(`Team "${name}" created`);
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (!deletingTeam) return;
    setTeams((ts) => ts.filter((t) => t.id !== deletingTeam.id));
    toast.success(`Team "${deletingTeam.name}" deleted`);
    setDeleteId(null);
  };

  const toggleDraftId = (key: "memberIds" | "agentIds", id: string) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(id) ? d[key].filter((x) => x !== id) : [...d[key], id],
    }));

  const actionButtons = (team: Team, subtle?: boolean) => (
    <div
      className={cn(
        "flex items-center gap-0.5",
        subtle &&
          "opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100",
      )}
    >
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={`View ${team.name}`}
        onClick={() => setViewTeamId(team.id)}
      >
        <Eye className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={`Edit ${team.name}`}
        onClick={() => openEdit(team)}
      >
        <Pencil className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={`Delete ${team.name}`}
        className="text-danger hover:text-danger"
        onClick={() => setDeleteId(team.id)}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );

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
          Team Management
        </button>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-3.5" aria-hidden />
          Create new team
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          size="sm"
          value={query}
          onValueChange={setQuery}
          placeholder="Search teams"
          aria-label="Search teams"
          wrapperClassName="w-full max-w-56"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="w-32 text-xs" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <div
          role="tablist"
          aria-label="Teams view"
          className="ml-auto flex shrink-0 items-center gap-1 rounded-full border bg-card p-1 shadow-elevation-low"
        >
          {(
            [
              { id: "card", label: "Card", icon: LayoutGrid },
              { id: "table", label: "Table", icon: Table2 },
            ] as const
          ).map((option) => {
            const active = view === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setView(option.id)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3.5 py-1 text-xs font-medium transition-colors",
                  active ? "text-white" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="team-view-pill"
                    className="absolute inset-0 rounded-full bg-brand-gradient shadow-elevation-low"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <option.icon className="relative z-10 size-3.5" aria-hidden />
                <span className="relative z-10">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={panelClasses({ padding: "none", elevation: "soft" })}
        >
          <EmptyState
            size="lg"
            icon={<UsersRound />}
            title="No teams found!"
            description="Create teams, assign members, and manage responsibilities."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus className="size-3.5" aria-hidden />
                Create new team
              </Button>
            }
          />
        </motion.div>
      ) : view === "card" ? (
        /* ——— Card view ——— */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {filtered.map((team, i) => {
              const color = teamColor(team);
              return (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.03, duration: 0.25, ease: "easeOut" }}
                  className={cn(
                    panelClasses({ elevation: "soft", className: "group relative overflow-hidden pl-6 transition-shadow hover:shadow-elevation-mid" }),
                    color.className,
                  )}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1.5"
                    style={{ background: color.solid }}
                    aria-hidden
                  />
                  <span
                    className="pointer-events-none absolute inset-y-0 left-0 w-24"
                    style={{
                      background: `linear-gradient(to right, ${color.soft}, transparent)`,
                    }}
                    aria-hidden
                  />
                  <div className="relative flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col gap-3">
                      <span className="truncate font-medium">{team.name}</span>
                      <div className="flex items-center gap-2.5">
                        <AvatarStack ids={[...team.memberIds, ...team.agentIds]} />
                        <span className="text-xs text-muted-foreground">
                          {team.memberIds.length + team.agentIds.length}{" "}
                          {team.memberIds.length + team.agentIds.length === 1
                            ? "member"
                            : "members"}
                        </span>
                      </div>
                    </div>
                    {actionButtons(team, true)}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* ——— Table view ——— */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={panelClasses({ padding: "none", elevation: "soft", className: "overflow-x-auto" })}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-muted-foreground">Name</TableHead>
                <TableHead className="text-xs text-muted-foreground">Members</TableHead>
                <TableHead className="text-xs text-muted-foreground">Agents</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-xs text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((team) => {
                const color = teamColor(team);
                return (
                  <TableRow key={team.id} className={color.className}>
                    <TableCell>
                      <span className="flex items-center gap-2 font-medium">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ background: color.solid }}
                          aria-hidden
                        />
                        {team.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <AvatarStack ids={team.memberIds} />
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {team.agentIds.length}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={team.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">{actionButtons(team)}</div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* ——— Create / edit dialog ——— */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit team" : "Create new team"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the team's details, members and agents."
                : "Name the team, pick a colour, and assign members and agents."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="team-name" className="text-xs text-muted-foreground">
                Team name<span className="text-danger">*</span>
              </Label>
              <Input
                id="team-name"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="e.g. Frontend"
              />
              <div className="mt-1 flex flex-wrap gap-1.5">
                {suggestedNames.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, name: n }))}
                    className={cn(
                      "rounded-md border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                      draft.name === n
                        ? "bg-brand-subtle text-brand ring-1 ring-brand"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Colour</Label>
              <div className="flex items-center gap-2">
                {swatches.map((hex) => {
                  const selected = draft.hex === hex && !draft.colorClass;
                  return (
                    <button
                      key={hex}
                      type="button"
                      aria-label={`Team colour ${hex}`}
                      aria-pressed={selected}
                      onClick={() =>
                        setDraft((d) => ({ ...d, hex, colorClass: undefined }))
                      }
                      className={cn(
                        "size-6 rounded-full transition-transform hover:scale-110",
                        selected && "ring-2 ring-brand ring-offset-2 ring-offset-card",
                      )}
                      style={{ background: hex }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="team-description" className="text-xs text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="team-description"
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Oversee project timelines, coordinate team efforts…"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Members</Label>
              <div className="flex flex-wrap gap-1.5">
                {humans.map((m) => (
                  <MemberPickChip
                    key={m.id}
                    member={m}
                    selected={draft.memberIds.includes(m.id)}
                    onToggle={() => toggleDraftId("memberIds", m.id)}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Agents</Label>
              <div className="flex flex-wrap gap-1.5">
                {agents.map((m) => (
                  <MemberPickChip
                    key={m.id}
                    member={m}
                    selected={draft.agentIds.includes(m.id)}
                    onToggle={() => toggleDraftId("agentIds", m.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveDraft}>{editingId ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ——— View sheet ——— */}
      <Drawer
        open={viewTeamId !== null}
        onOpenChange={(open: boolean) => !open && setViewTeamId(null)}
        side="right"
        size="lg"
        title="View team"
        description="Team details, members and agents."
        footer={
          viewedTeam ? (
            <Button
              variant="outline"
              onClick={() => {
                setViewTeamId(null);
                openEdit(viewedTeam);
              }}
            >
              <Pencil className="size-3.5" aria-hidden />
              Edit
            </Button>
          ) : undefined
        }
      >
        {viewedTeam && (
          <>
            <div className="flex flex-col gap-5">
                <div className={cn("grid grid-cols-3 gap-4", teamColor(viewedTeam).className)}>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                      Team name
                    </span>
                    <span className="text-sm font-medium">{viewedTeam.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                      Colour
                    </span>
                    <span
                      className="mt-0.5 size-4 rounded-full"
                      style={{ background: teamColor(viewedTeam).solid }}
                      aria-hidden
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                      Status
                    </span>
                    <StatusChip status={viewedTeam.status} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    Description
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {viewedTeam.description || "No description yet."}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    Members ({viewedTeam.memberIds.length})
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {viewedTeam.memberIds.length ? (
                      viewedTeam.memberIds.map((id) => (
                        <AssigneeInline key={id} member={memberById(id)} />
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No members yet.</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    Agents ({viewedTeam.agentIds.length})
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {viewedTeam.agentIds.length ? (
                      viewedTeam.agentIds.map((id) => (
                        <AssigneeInline key={id} member={memberById(id)} />
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No agents yet.</span>
                    )}
                  </div>
                </div>
              </div>
          </>
        )}
      </Drawer>

      {/* ——— Delete confirm ——— */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team?</AlertDialogTitle>
            <AlertDialogDescription>
              This won&apos;t delete its work items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
