"use client";

import { toast } from "sonner";
import { members } from "@/lib/data";
import { UserAvatar } from "@/components/work/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

const humans = members.filter((m) => m.kind === "human");

const lastActive = ["2m ago", "18m ago", "1h ago", "3h ago", "yesterday", "2d ago"];

export function MembersTable() {
  return (
    <div className="rounded-xl border bg-card shadow-elevation-low">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Workspace role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last active</TableHead>
            <TableHead className="w-10" aria-label="Actions" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {humans.map((m, i) => (
            <TableRow key={m.id}>
              <TableCell>
                <span className="flex items-center gap-2.5">
                  <UserAvatar member={m} size="md" showTooltip={false} />
                  <span className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">{m.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {m.email}
                    </span>
                  </span>
                </span>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {m.role}
              </TableCell>
              <TableCell>
                {i === 0 ? (
                  <Select defaultValue="super-admin" disabled>
                    <SelectTrigger size="sm" className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super-admin">Super admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    defaultValue="Member"
                    onValueChange={(v) =>
                      toast.success(`${m.name} is now ${v}`)
                    }
                  >
                    <SelectTrigger size="sm" className="w-[140px]">
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
                )}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 rounded-md bg-success-subtle px-2 py-0.5 text-[11px] font-medium text-success">
                  <span aria-hidden>●</span> Active
                </span>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {lastActive[i % lastActive.length]}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Actions for ${m.name}`}
                    >
                      <MoreHorizontal className="size-4" aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        toast(`Change role for ${m.name}`, {
                          description: "Use the workspace role dropdown.",
                        })
                      }
                    >
                      Change role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toast.success(`${m.name} deactivated`)}
                    >
                      Deactivate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        toast.success(`${m.name} removed from workspace`)
                      }
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
