"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BasicDetailsTab } from "@/components/configure/basic-details";
import { InfoArchitectureTab } from "@/components/configure/info-architecture";
import { TechStackTab } from "@/components/configure/tech-stack";
import { RepositoryTab } from "@/components/configure/repository";
import { SetupFilesTab } from "@/components/configure/setup-files";
import { PromptsTab } from "@/components/configure/prompts";
import { DocumentsTab } from "@/components/configure/documents";
import { KanbanConfigTab } from "@/components/configure/kanban-config";

const tabs = [
  { id: "basic", label: "Basic details" },
  { id: "ia", label: "Information architecture" },
  { id: "stack", label: "Tech stack & AI" },
  { id: "repository", label: "Repository" },
  { id: "setup", label: "Setup files" },
  { id: "prompts", label: "Prompts" },
  { id: "documents", label: "Documents" },
  { id: "kanban", label: "Kanban" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function ConfigureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const param = searchParams.get("tab");
  const active: TabId = tabs.some((t) => t.id === param)
    ? (param as TabId)
    : "basic";

  const setTab = (id: TabId) => {
    router.replace(`${pathname}?tab=${id}`, { scroll: false });
  };

  return (
    <div className="px-6 py-5">
      <nav
        aria-label="Configure sections"
        className="scrollbar-thin flex gap-1.5 overflow-x-auto pb-1"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              active === t.id
                ? "bg-brand-gradient text-white shadow-elevation-low"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mt-5"
      >
        {active === "basic" && <BasicDetailsTab />}
        {active === "ia" && <InfoArchitectureTab />}
        {active === "stack" && <TechStackTab />}
        {active === "repository" && <RepositoryTab />}
        {active === "setup" && <SetupFilesTab />}
        {active === "prompts" && <PromptsTab />}
        {active === "documents" && <DocumentsTab />}
        {active === "kanban" && <KanbanConfigTab />}
      </motion.div>
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={null}>
      <ConfigureContent />
    </Suspense>
  );
}
