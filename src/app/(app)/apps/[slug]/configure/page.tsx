"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  Coins,
  Cpu,
  FileCode2,
  FileText,
  GitBranch,
  Info,
  MessageSquareText,
  Network,
  Rocket,
  Settings2,
  Timer,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BasicDetailsTab } from "@/components/configure/basic-details";
import { InfoArchitectureTab } from "@/components/configure/info-architecture";
import { TechStackTab } from "@/components/configure/tech-stack";
import { RepositoryTab } from "@/components/configure/repository";
import { SetupFilesTab } from "@/components/configure/setup-files";
import { PromptsTab } from "@/components/configure/prompts";
import { DocumentsTab } from "@/components/configure/documents";
import { KanbanConfigTab } from "@/components/configure/kanban-config";
import { TokenManagement } from "@/components/configure/token-management";
import { TeamManagement } from "@/components/configure/team-management";
import { ProjectWorkforce } from "@/components/configure/project-workforce";
import { SprintManagement } from "@/components/configure/sprint-management";
import { ReleaseManagement } from "@/components/configure/release-management";

const sections = [
  { id: "app-settings", title: "App settings", subtitle: "Configure application", icon: Settings2, iconClass: "bg-brand-subtle text-brand" },
  { id: "documents", title: "Documents", subtitle: "Requirement & design documents", icon: FileText, iconClass: "bg-info-subtle text-info" },
  { id: "tokens", title: "Token Management", subtitle: "Manage your project's AI token", icon: Coins, iconClass: "bg-warning-subtle text-warning" },
  { id: "teams", title: "Team Management", subtitle: "Create teams, assign members, and manage responsibilities.", icon: UsersRound, iconClass: "bg-teal-subtle text-teal" },
  { id: "workforce", title: "Project Workforce", subtitle: "Manage team members & AI agents", icon: Bot, iconClass: "bg-pink-subtle text-pink" },
  { id: "sprints", title: "Sprint Management", subtitle: "Create sprints, assign work, and monitor sprint progress.", icon: Timer, iconClass: "bg-success-subtle text-success" },
  { id: "releases", title: "Release Management", subtitle: "Manage releases, and deployment readiness.", icon: Rocket, iconClass: "bg-danger-subtle text-danger" },
] as const;

type SectionId = (typeof sections)[number]["id"] | "kanban";

const appSettingsTabs = [
  { id: "basic", label: "Basic details", icon: Info },
  { id: "ia", label: "Information architecture", icon: Network },
  { id: "stack", label: "Tech stack & AI", icon: Cpu },
  { id: "repository", label: "Repository", icon: GitBranch },
  { id: "setup", label: "Setup files", icon: FileCode2 },
  { id: "prompts", label: "Prompts", icon: MessageSquareText },
] as const;

type AppSettingsTabId = (typeof appSettingsTabs)[number]["id"];

/** Older deep links (?tab=basic etc.) land inside App settings. */
const legacyToSub: Record<string, AppSettingsTabId> = {
  basic: "basic",
  ia: "ia",
  stack: "stack",
  repository: "repository",
  setup: "setup",
  prompts: "prompts",
};

function SectionHeader({ title, onBack, actions }: { title: string; onBack: () => void; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-brand"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {title}
      </button>
      {actions}
    </div>
  );
}

function ConfigureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const param = searchParams.get("tab");
  const active: SectionId | null =
    param && (sections.some((s) => s.id === param) || param === "kanban")
      ? (param as SectionId)
      : param && legacyToSub[param]
        ? "app-settings"
        : null;
  const sub: AppSettingsTabId =
    (searchParams.get("sub") as AppSettingsTabId | null) ??
    (param && legacyToSub[param] ? legacyToSub[param] : "basic");

  const go = (id: SectionId | null, subId?: AppSettingsTabId) => {
    const qs = id ? `?tab=${id}${subId ? `&sub=${subId}` : ""}` : "";
    router.replace(`${pathname}${qs}`, { scroll: false });
  };

  // ——— Hub
  if (!active) {
    return (
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sections.map((s, i) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25, ease: "easeOut" }}
              whileHover={{ y: -2 }}
              className="group flex items-center justify-between gap-4 rounded-2xl border bg-card px-6 py-5 text-left shadow-soft transition-shadow hover:shadow-elevation-mid"
            >
              <span className="flex min-w-0 items-center gap-4">
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", s.iconClass)}>
                  <s.icon className="size-5" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-lg font-semibold tracking-tight">{s.title}</span>
                  <span className="truncate text-sm text-muted-foreground">{s.subtitle}</span>
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ——— Sections
  return (
    <motion.div
      key={active + (active === "app-settings" ? sub : "")}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="px-6 py-5"
    >
      {active === "app-settings" && (
        <>
          <SectionHeader title="App settings" onBack={() => go(null)} />
          <nav aria-label="App settings sections" className="scrollbar-thin mt-4 flex gap-1.5 overflow-x-auto pb-1">
            {appSettingsTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => go("app-settings", t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                  sub === t.id
                    ? "bg-brand-gradient text-white shadow-elevation-low"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <t.icon className="size-3.5" aria-hidden />
                {t.label}
              </button>
            ))}
          </nav>
          <div className="mt-5">
            {sub === "basic" && <BasicDetailsTab />}
            {sub === "ia" && <InfoArchitectureTab />}
            {sub === "stack" && <TechStackTab />}
            {sub === "repository" && <RepositoryTab />}
            {sub === "setup" && <SetupFilesTab />}
            {sub === "prompts" && <PromptsTab />}
          </div>
        </>
      )}

      {active === "documents" && (
        <>
          <SectionHeader title="Documents" onBack={() => go(null)} />
          <div className="mt-5"><DocumentsTab /></div>
        </>
      )}

      {active === "tokens" && <TokenManagement onBack={() => go(null)} />}
      {active === "teams" && <TeamManagement onBack={() => go(null)} />}
      {active === "workforce" && <ProjectWorkforce onBack={() => go(null)} />}
      {active === "sprints" && <SprintManagement onBack={() => go(null)} />}
      {active === "releases" && <ReleaseManagement onBack={() => go(null)} />}

      {active === "kanban" && (
        <>
          <SectionHeader title="Configure kanban" onBack={() => go(null)} />
          <div className="mt-5"><KanbanConfigTab /></div>
        </>
      )}
    </motion.div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={null}>
      <ConfigureContent />
    </Suspense>
  );
}
