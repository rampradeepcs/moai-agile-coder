import { AppSideNav } from "@/components/shell/app-side-nav";
import { CommandPalette } from "@/components/shell/command-palette";

/*
 * App shell from the WizKraft Figma app layout (file DTfOUMmRzfz8munYZnMkr7,
 * node 27:1961): the menu sits flush to the left edge with a 10px band above,
 * below and to its right, and the content is a bordered, rounded panel filling
 * the remainder. The page carries the same #efeff0 as the menu, so the two read
 * as one ground and only the panel's #f9f9fa lifts away from it.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex h-svh w-full gap-2.5 overflow-hidden bg-sidebar py-2.5 pr-2.5">
      <AppSideNav />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto rounded-[10px] border border-gray-alpha10 bg-background">
        {children}
      </main>
      <CommandPalette />
    </div>
  );
}
