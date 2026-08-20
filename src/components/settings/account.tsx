"use client";

import { toast } from "sonner";
import { currentUser } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/work/user-avatar";
import { SettingsCard, SettingsRow } from "./shared";

export function AccountSettings() {
  return (
    <div className="flex flex-col gap-4">
      <SettingsCard
        title="Profile"
        description="How you appear to teammates and in activity feeds."
        footer={
          <Button size="sm" onClick={() => toast.success("Profile updated")}>
            Save changes
          </Button>
        }
      >
        <div className="flex items-center gap-4">
          <UserAvatar member={currentUser} size="lg" showTooltip={false} />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <button
              type="button"
              className="text-left text-xs font-medium text-brand hover:underline"
              onClick={() => toast("Avatar uploads are coming soon.")}
            >
              Change avatar
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="acc-name">Full name</Label>
            <Input id="acc-name" defaultValue={currentUser.name} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="acc-role">Role</Label>
            <Input id="acc-role" defaultValue={currentUser.role} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="acc-email">Email</Label>
            <Input id="acc-email" type="email" defaultValue={currentUser.email} />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Security" description="Sign-in and session controls for your account.">
        <SettingsRow
          title="Password"
          description="Last changed 3 months ago."
          control={
            <Button variant="outline" size="sm" onClick={() => toast("Password reset email sent")}>
              Change password
            </Button>
          }
        />
        <SettingsRow
          title="Two-factor authentication"
          description="Adds an OTP step when signing in."
          control={
            <Button variant="outline" size="sm" onClick={() => toast("2FA setup started — check your email")}>
              Enable 2FA
            </Button>
          }
        />
        <SettingsRow
          title="Active sessions"
          description="2 devices signed in."
          control={
            <Button variant="outline" size="sm" onClick={() => toast.success("Other sessions signed out")}>
              Sign out others
            </Button>
          }
        />
      </SettingsCard>

      <SettingsCard title="Danger zone" description="Irreversible actions for your account.">
        <SettingsRow
          title="Delete account"
          description="Removes your profile and unassigns your work."
          control={
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error("Account deletion requires a workspace admin approval")}
            >
              Delete account
            </Button>
          }
        />
      </SettingsCard>
    </div>
  );
}
