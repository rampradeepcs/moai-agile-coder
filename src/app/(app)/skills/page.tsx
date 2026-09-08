import type { Metadata } from "next";

import { PageHeader } from "@/components/shared";
import { SkillsSettings } from "@/components/settings/skills";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-6">
      <PageHeader
        title="Skills"
        description="What your AI agents are allowed to do, and who they do it for."
      />
      <SkillsSettings />
    </div>
  );
}
