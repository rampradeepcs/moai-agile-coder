import type { Metadata } from "next";

import { PageHeader } from "@/components/shared";
import { ConnectorsSettings } from "@/components/settings/connectors";

export const metadata: Metadata = { title: "Connectors" };

export default function ConnectorsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-6">
      <PageHeader
        title="Connectors"
        description="The tools WizKraft syncs with, and the accounts they run under."
      />
      <ConnectorsSettings />
    </div>
  );
}
