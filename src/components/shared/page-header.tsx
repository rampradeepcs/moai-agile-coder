import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<"header">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Trailing controls — buttons, status chips, dialogs. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Title block for a workspace screen. Moved out of `shell/` so every page uses
 * one definition: the users and applications screens previously hand-rolled
 * their own at a smaller type scale.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn("flex flex-wrap items-start justify-between gap-3", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-[13px] text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
