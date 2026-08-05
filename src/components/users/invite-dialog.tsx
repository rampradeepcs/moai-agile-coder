"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-3.5" aria-hidden />
          Invite users
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite users</DialogTitle>
          <DialogDescription>
            They&apos;ll get an email with a link to join this workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="invite-emails" className="text-xs text-muted-foreground">
              Email addresses, comma separated
            </Label>
            <Textarea
              id="invite-emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="ada@example.com, grace@example.com"
              className="min-h-24"
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Admin", "Member", "Viewer"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={send}>Send invites</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
