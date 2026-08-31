"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PageHeader, ProjectTile } from "@/components/shared";
import { Plus } from "lucide-react";

export default function AllApplicationsPage() {
  const [favs, setFavs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(projects.map((p) => [p.id, !!p.favourite])),
  );

  return (
    <div className="px-6 py-5">
      <PageHeader
        title="All applications"
        description="Everything your workspace is building"
        actions={
          <Button asChild>
            <Link href="/apps/new">
              <Plus className="size-3.5" aria-hidden />
              New application
            </Link>
          </Button>
        }
      />

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
            whileHover={{ y: -3 }}
          >
            <ProjectTile
              project={p}
              variant="detailed"
              href={`/apps/${p.slug}/ai-chat`}
              favourite={!!favs[p.id]}
              onFavouriteChange={(next: boolean) =>
                setFavs((prev) => ({ ...prev, [p.id]: next }))
              }
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
