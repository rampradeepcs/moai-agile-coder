"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { panelClasses } from "@/components/shared";

export function RepositoryTab() {
  return (
    <div className={panelClasses({ padding: "lg", className: "max-w-2xl" })}>
      <h2 className="text-sm font-semibold">Repository configuration</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Where Agile Coder pushes generated code and setup files.
      </p>

      <div className="mt-5 grid gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="repo-url" className="text-xs text-muted-foreground">
            Repository URL
          </Label>
          <span className="inline-flex items-center gap-1 rounded-md bg-success-subtle px-2 py-0.5 text-[11px] font-medium text-success">
            <span aria-hidden>●</span> Repo connected
          </span>
        </div>
        <Input
          id="repo-url"
          defaultValue="https://github.com/ram/agilecoder"
          className="font-mono text-xs"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Connecting a repository lets Agile Coder sync generated code and setup
          files with Git.
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        <Button variant="ghost">Cancel</Button>
        <Button onClick={() => toast.success("Repository settings saved")}>
          Save
        </Button>
      </div>
    </div>
  );
}
