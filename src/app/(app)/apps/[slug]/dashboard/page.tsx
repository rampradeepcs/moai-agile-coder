"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/lib/data";
import { TokenMeters } from "@/components/dashboard/token-meters";
import { ViewToggle, type DashboardView } from "@/components/dashboard/view-toggle";
import { SprintView } from "@/components/dashboard/sprint-view";
import { TokensView } from "@/components/dashboard/tokens-view";

export default function DashboardPage() {
  const [view, setView] = useState<DashboardView>("sprint");
  const params = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === params.slug) ?? projects[0];

  return (
    <div className="flex min-w-0 flex-col gap-5 overflow-x-clip px-4 py-5 sm:px-6">
      {/* Common top strip — meters stack on mobile, toggle drops to its own row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <TokenMeters project={project} />
        <div className="flex justify-start lg:shrink-0">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {view === "sprint" ? (
          <motion.div
            key="sprint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SprintView />
          </motion.div>
        ) : (
          <motion.div
            key="tokens"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <TokensView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
