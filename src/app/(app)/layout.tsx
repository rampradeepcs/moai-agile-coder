import { AppRail } from "@/components/shell/app-rail";
import { CommandPalette } from "@/components/shell/command-palette";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh w-full">
      <AppRail />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      <CommandPalette />
    </div>
  );
}
