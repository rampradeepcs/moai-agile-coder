"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  Pencil,
  Plus,
  Rocket,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { memberById, workItemByKey, workItems } from "@/lib/data";
import { StatusBadge, TypeBadge } from "@/components/work/badges";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { panelClasses } from "@/components/shared";

// ————————————————————————————————————————————————————————————————

type Environment = "Development" | "Staging" | "Production";

interface Release {
  id: string;
  name: string;
  launch: string; // yyyy-MM-dd
  environment: Environment;
  updatedOn: string;
  updatedById: string;
  notes: string;
  itemKeys: string[];
}

const seedReleases: Release[] = [
  {
    id: "r1",
    name: "Release V1.0.0",
    launch: "2026-08-07",
    environment: "Development",
    updatedOn: "2026-07-21",
    updatedById: "u2",
    notes:
      "First cut of the PawCare foundation: project scaffolding, CI pipeline and authentication with email, OTP and social sign-in. Design tokens and the base component library ship behind a feature flag.\n\nKnown gaps: session management lands in the next build, and flaky-network login hardening is still in QA.",
    itemKeys: ["PC-876", "PC-7580", "PC-7364"],
  },
  {
    id: "r2",
    name: "Release V1.0.1",
    launch: "2026-08-21",
    environment: "Staging",
    updatedOn: "2026-07-28",
    updatedById: "u1",
    notes:
      "Stabilisation build promoting the auth stack to staging. Adds session management, logout-everywhere and crash-free login on flaky networks.\n\nIncludes the first pass of the onboarding flow with mobile number and OTP verification.",
    itemKeys: ["PC-1458", "PC-9534", "PC-5613"],
  },
  {
    id: "r3",
    name: "Release V1.0.2",
    launch: "2026-09-11",
    environment: "Production",
    updatedOn: "2026-08-02",
    updatedById: "u2",
    notes:
      "Production launch of appointments: vet search with slot picking and confirmation, push reminders and the double-booking race-condition fix.\n\nDashboard summary cards ship read-only; calendar sync follows in V1.1.",
    itemKeys: ["PC-2755", "PC-2756", "PC-2760"],
  },
];

const envChip: Record<Environment, string> = {
  Development: "bg-info-subtle text-info",
  Staging: "bg-warning-subtle text-warning",
  Production: "bg-success-subtle text-success",
};

const fmt = (iso: string) => format(new Date(`${iso}T00:00:00`), "d MMM, yyyy");

function EnvChip({ environment }: { environment: Environment }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        envChip[environment],
      )}
    >
      {environment}
    </span>
  );
}

const readinessChecks = [
  { id: "tests", label: "All tests passing", done: true },
  { id: "docs", label: "Docs updated", done: true },
  { id: "signoff", label: "Staging sign-off", done: false },
  { id: "rollback", label: "Rollback plan", done: false },
];

// ————————————————————————————————————————————————————————————————

export function ReleaseManagement({ onBack }: { onBack: () => void }) {
  const [releases, setReleases] = useState<Release[]>(seedReleases);
  const [viewId, setViewId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ mode: "create" } | { mode: "edit"; release: Release } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Release | null>(null);

  const viewing = viewId ? (releases.find((r) => r.id === viewId) ?? null) : null;

  const upsert = (data: Omit<Release, "id" | "updatedOn" | "updatedById">) => {
    const today = format(new Date(), "yyyy-MM-dd");
    if (dialog?.mode === "edit") {
      const id = dialog.release.id;
      setReleases((rs) =>
        rs.map((r) => (r.id === id ? { ...r, ...data, updatedOn: today, updatedById: "u1" } : r)),
      );
      toast.success(`${data.name} updated`);
    } else {
      setReleases((rs) => [
        ...rs,
        { id: `r-${Date.now()}`, updatedOn: today, updatedById: "u1", ...data },
      ]);
      toast.success(`${data.name} created`);
    }
    setDialog(null);
  };

  const remove = (release: Release) => {
    setReleases((rs) => rs.filter((r) => r.id !== release.id));
    if (viewId === release.id) setViewId(null);
    toast.success(`${release.name} deleted`);
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ——— Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Release Management
        </button>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus data-icon="inline-start" aria-hidden />
          Create release
        </Button>
      </div>

      {viewing ? (
        <ReleaseDetail
          key={viewing.id}
          release={viewing}
          onBack={() => setViewId(null)}
          onEdit={() => setDialog({ mode: "edit", release: viewing })}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={panelClasses({ padding: "none", elevation: "soft", className: "overflow-hidden" })}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase">Name</TableHead>
                  <TableHead className="text-xs uppercase">Launch date</TableHead>
                  <TableHead className="text-xs uppercase">Environment</TableHead>
                  <TableHead className="text-xs uppercase">Updated on</TableHead>
                  <TableHead className="text-xs uppercase">Updated by</TableHead>
                  <TableHead className="text-right text-xs uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {releases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                      No releases yet — create your first release.
                    </TableCell>
                  </TableRow>
                )}
                {releases.map((release) => {
                  const updatedBy = memberById(release.updatedById);
                  return (
                    <TableRow key={release.id} className="hover:bg-accent/30">
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => setViewId(release.id)}
                          className="text-sm font-medium text-brand transition-opacity hover:opacity-80"
                        >
                          {release.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-sm">{fmt(release.launch)}</TableCell>
                      <TableCell>
                        <EnvChip environment={release.environment} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fmt(release.updatedOn)}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <UserAvatar member={updatedBy} size="xs" />
                          <span className="text-sm">{updatedBy?.name ?? "—"}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`View ${release.name}`}
                            onClick={() => setViewId(release.id)}
                          >
                            <Eye aria-hidden />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${release.name}`}
                            onClick={() => setDialog({ mode: "edit", release })}
                          >
                            <Pencil aria-hidden />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-danger hover:text-danger"
                            aria-label={`Delete ${release.name}`}
                            onClick={() => setDeleteTarget(release)}
                          >
                            <Trash2 aria-hidden />
                          </Button>
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}

      {/* ——— Create / Edit dialog */}
      <ReleaseDialog
        key={dialog?.mode === "edit" ? dialog.release.id : `create-${releases.length}`}
        open={dialog !== null}
        onOpenChange={(o) => !o && setDialog(null)}
        editing={dialog?.mode === "edit" ? dialog.release : null}
        onSubmit={upsert}
      />

      {/* ——— Delete confirm */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              The release and its mapping to work items will be removed. This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deleteTarget && remove(deleteTarget)}
            >
              Delete release
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————

function ReleaseDetail({
  release,
  onBack,
  onEdit,
}: {
  release: Release;
  onBack: () => void;
  onEdit: () => void;
}) {
  const [checks, setChecks] = useState(readinessChecks);
  const ready = checks.filter((c) => c.done).length;
  const updatedBy = memberById(release.updatedById);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-brand"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        View release
      </button>

      {/* Title row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-brand">
            <Rocket className="size-4.5" aria-hidden />
          </span>
          <h2 className="truncate text-lg font-semibold tracking-tight">{release.name}</h2>
          <EnvChip environment={release.environment} />
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil data-icon="inline-start" aria-hidden />
          Edit
        </Button>
      </div>

      {/* Meta grid */}
      <div className={panelClasses({ elevation: "soft", className: "grid grid-cols-2 gap-4 sm:grid-cols-4" })}>
        <div>
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Launch date</div>
          <div className="mt-1 text-sm font-medium">{fmt(release.launch)}</div>
        </div>
        <div>
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Environment</div>
          <div className="mt-1">
            <EnvChip environment={release.environment} />
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Updated on</div>
          <div className="mt-1 text-sm font-medium">{fmt(release.updatedOn)}</div>
        </div>
        <div>
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Updated by</div>
          <div className="mt-1 flex items-center gap-2">
            <UserAvatar member={updatedBy} size="xs" />
            <span className="text-sm font-medium">{updatedBy?.name ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* Release notes */}
      <section className={panelClasses({ elevation: "soft" })}>
        <h3 className="text-sm font-semibold">Release notes</h3>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {release.notes.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Deployment readiness */}
      <section className={panelClasses({ elevation: "soft" })}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Deployment readiness</h3>
          <span className="text-xs text-muted-foreground">
            {ready} of {checks.length} ready
          </span>
        </div>
        <Progress value={(ready / checks.length) * 100} className="mt-3" />
        <ul className="mt-4 grid gap-1 sm:grid-cols-2">
          {checks.map((check) => (
            <li key={check.id}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-accent/40">
                <Checkbox
                  checked={check.done}
                  onCheckedChange={(v) =>
                    setChecks((cs) => cs.map((c) => (c.id === check.id ? { ...c, done: v === true } : c)))
                  }
                  aria-label={check.label}
                />
                <span className={cn("text-sm", check.done && "text-muted-foreground line-through")}>
                  {check.label}
                </span>
                {check.done && <Check className="size-3.5 text-success" aria-hidden />}
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* Mapped work items */}
      <section className={panelClasses({ padding: "none", elevation: "soft" })}>
        <h3 className="px-5 pt-5 pb-3 text-sm font-semibold">Mapped work items</h3>
        {release.itemKeys.length === 0 ? (
          <p className="px-5 pb-5 text-xs text-muted-foreground">No work items mapped to this release.</p>
        ) : (
          <ul>
            {release.itemKeys.map((key) => {
              const item = workItemByKey(key);
              return (
                <li
                  key={key}
                  className="flex items-center gap-2.5 border-t px-5 py-2.5 transition-colors hover:bg-accent/30"
                >
                  <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {key}
                  </span>
                  {item ? (
                    <>
                      <TypeBadge type={item.type} />
                      <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                      <StatusBadge status={item.status} />
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unknown work item</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </motion.div>
  );
}

// ————————————————————————————————————————————————————————————————

function ReleaseDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Release | null;
  onSubmit: (data: Omit<Release, "id" | "updatedOn" | "updatedById">) => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [launch, setLaunch] = useState(editing?.launch ?? "");
  const [environment, setEnvironment] = useState<Environment>(editing?.environment ?? "Development");
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [keys, setKeys] = useState<Set<string>>(new Set(editing?.itemKeys ?? []));

  const valid = name.trim().length > 0 && launch.length > 0;

  const toggleKey = (key: string) => {
    setKeys((s) => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit ${editing.name}` : "Create release"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the release details and mapped work items."
              : "Plan a new release and map the work items it ships."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="release-name" className="text-xs text-muted-foreground">
              Release name
            </Label>
            <Input
              id="release-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Release V1.1.0"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="release-launch" className="text-xs text-muted-foreground">
                Launch date
              </Label>
              <Input
                id="release-launch"
                type="date"
                value={launch}
                onChange={(e) => setLaunch(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Environment</Label>
              <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  {(["Development", "Staging", "Production"] as const).map((env) => (
                    <SelectItem key={env} value={env}>
                      {env}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="release-notes" className="text-xs text-muted-foreground">
              Release notes
            </Label>
            <Textarea
              id="release-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What ships in this release?"
              rows={4}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Map work items</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between font-normal">
                  <span className={cn(keys.size === 0 && "text-muted-foreground")}>
                    {keys.size === 0
                      ? "Select work items…"
                      : `${keys.size} ${keys.size === 1 ? "item" : "items"} selected`}
                  </span>
                  <ChevronDown data-icon="inline-end" className="text-muted-foreground" aria-hidden />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1.5">
                <ul className="scrollbar-thin max-h-56 overflow-y-auto">
                  {workItems
                    .filter((w) => w.type !== "epic")
                    .map((item) => (
                      <li key={item.id}>
                        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/40">
                          <Checkbox
                            checked={keys.has(item.key)}
                            onCheckedChange={() => toggleKey(item.key)}
                            aria-label={`Select ${item.key} ${item.title}`}
                          />
                          <span className="font-mono text-[11px] text-muted-foreground">{item.key}</span>
                          <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                        </label>
                      </li>
                    ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!valid}
            onClick={() =>
              onSubmit({
                name: name.trim(),
                launch,
                environment,
                notes: notes.trim(),
                itemKeys: [...keys],
              })
            }
          >
            {editing ? "Save changes" : "Create release"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
