"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Cable,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared";
import { GeneralSettings } from "@/components/settings/general";
import { AccountSettings } from "@/components/settings/account";
import { PrivacySettings } from "@/components/settings/privacy";
import { SkillsSettings } from "@/components/settings/skills";
import { ConnectorsSettings } from "@/components/settings/connectors";

const TABS = [
  { id: "general", label: "General", icon: Settings2, component: GeneralSettings },
  { id: "account", label: "Account", icon: UserRound, component: AccountSettings },
  { id: "privacy", label: "Privacy", icon: ShieldCheck, component: PrivacySettings },
  { id: "skills", label: "Skills", icon: Sparkles, component: SkillsSettings },
  { id: "connectors", label: "Connectors", icon: Cable, component: ConnectorsSettings },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SettingsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get("tab");
  const tabId: TabId = TABS.some((t) => t.id === param) ? (param as TabId) : "general";
  const tab = TABS.find((t) => t.id === tabId)!;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-6">
      <PageHeader title="Settings" description="Workspace preferences, account and integrations." />

      <nav
        aria-label="Settings sections"
        className="inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-muted p-1.5"
      >
        {TABS.map((t) => {
          const active = t.id === tabId;
          return (
            <Link
              key={t.id}
              href={`${pathname}?tab=${t.id}`}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                active ? "text-white" : "text-foreground/80 hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="settings-tab-pill"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <t.icon className="relative size-4" aria-hidden />
              <span className="relative">{t.label}</span>
            </Link>
          );
        })}
      </nav>

      <motion.div
        key={tabId}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <tab.component />
      </motion.div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}
