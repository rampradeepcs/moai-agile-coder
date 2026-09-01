"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button, Modal, Select, Textarea, toast } from "@/components";

const roles = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "Viewer", label: "Viewer" },
];

export function InviteDialog() {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState("Member");

  const send = () => {
    const count = emails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean).length;
    setOpen(false);
    setEmails("");
    toast.success(
      count > 0
        ? `${count} invite${count > 1 ? "s" : ""} sent as ${role}`
        : "Invites sent",
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      size="sm"
      icon={<UserPlus />}
      title="Invite users"
      description="They'll get an email with a link to join this workspace."
      trigger={
        <Button iconLeading={<UserPlus />}>Invite users</Button>
      }
      footer={
        <>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={send}>Send invites</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Textarea
          label="Email addresses, comma separated"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="ada@example.com, grace@example.com"
          rows={3}
        />
        <Select
          label="Role"
          value={role}
          onValueChange={setRole}
          options={roles}
        />
      </div>
    </Modal>
  );
}
