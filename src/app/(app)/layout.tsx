import { Suspense } from "react";

import { AppSideNav } from "@/components/shell/app-side-nav";
import { CommandPalette } from "@/components/shell/command-palette";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh w-full">
      <Suspense fallback={null}>
        <AppSideNav />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      <CommandPalette />
    </div>
  );
}
