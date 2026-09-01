"use client";

import { motion } from "framer-motion";
import { Tabs } from "@/components";
import { ActivityList } from "@/components/users/activity-list";
import { AgentsGrid } from "@/components/users/agents-grid";
import { InviteDialog } from "@/components/users/invite-dialog";
import { MembersTable } from "@/components/users/members-table";
import { RolesCards } from "@/components/users/roles-cards";
import { PageHeader } from "@/components/shared";

export default function UsersPage() {
  return (
    <div className="px-6 py-5">
      <PageHeader
        title="Users"
        description="People and AI agents working in this workspace"
        actions={<InviteDialog />}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Tabs
          defaultValue="members"
          variant="pill"
          className="mt-5"
          items={[
            { value: "members", label: "Members", content: <MembersTable /> },
            { value: "agents", label: "AI Agents", content: <AgentsGrid /> },
            { value: "roles", label: "Roles", content: <RolesCards /> },
            { value: "activity", label: "Activity", content: <ActivityList /> },
          ]}
        />
      </motion.div>
    </div>
  );
}
