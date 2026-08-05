"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityList } from "@/components/users/activity-list";
import { AgentsGrid } from "@/components/users/agents-grid";
import { InviteDialog } from "@/components/users/invite-dialog";
import { MembersTable } from "@/components/users/members-table";
import { RolesCards } from "@/components/users/roles-cards";

export default function UsersPage() {
  return (
    <div className="px-6 py-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold">Users</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            People and AI agents working in this workspace
          </p>
        </div>
        <InviteDialog />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Tabs defaultValue="members" className="mt-5">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-4">
            <MembersTable />
          </TabsContent>
          <TabsContent value="agents" className="mt-4">
            <AgentsGrid />
          </TabsContent>
          <TabsContent value="roles" className="mt-4">
            <RolesCards />
          </TabsContent>
          <TabsContent value="activity" className="mt-4">
            <ActivityList />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
