"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { currentUser, projects } from "@/lib/data";
import { ProjectLogo } from "@/components/work/project-logo";
import {
  SideNav,
  SideNavFooter,
  type SideNavEntry,
  type SideNavSection,
} from "@/components/application/side-nav/side-nav";
import {
  ConnectorsIcon,
  DashboardIcon,
  NewChatIcon,
  FolderAddIcon,
  FolderIcon,
  ShareIcon,
  SkillsIcon,
  StarIcon,
  WorkforceIcon,
} from "@/components/application/side-nav/nav-icons";
import { NewGroupDialog } from "./new-group-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COMMAND_PALETTE_EVENT } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";

const COLLAPSED_KEY = "wizkraft-nav-collapsed";
const GROUPS_KEY = "wizkraft-project-groups";
const ACTIVE_KEY = "wizkraft-active-projects";
const FAVOURITES_KEY = "wizkraft-favourites";

/**
 * A group someone made themselves. Favourites and All projects are not in this
 * list — they are the two built-in views and cannot be edited or removed.
 */
interface ProjectGroup {
  id: string;
  name: string;
  slugs: string[];
}

const NO_GROUPS: ProjectGroup[] = [];

const projectHref = (slug: string) => `/apps/${slug}/dashboard`;

const DEFAULT_FAVOURITES = projects.filter((p) => p.favourite).map((p) => p.slug);
const NO_TABS: string[] = [];

/*
 * Same-tab writes do not raise a `storage` event, so subscribers are notified
 * directly.
 */
const listeners = new Set<() => void>();

/**
 * State backed by localStorage.
 *
 * Read through `useSyncExternalStore` rather than restored in an effect: the
 * server snapshot is the fallback, so the prerendered markup and the first
 * client render agree, and React swaps in the stored value without a hydration
 * mismatch or a cascading re-render.
 */
function usePersisted<T>(key: string, fallback: T) {
  const cache = React.useRef<{ raw: string | null; value: T }>({ raw: null, value: fallback });

  const subscribe = React.useCallback((onChange: () => void) => {
    listeners.add(onChange);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) onChange();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  // Cached against the raw string so repeated reads return a stable reference.
  const getSnapshot = React.useCallback(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      // Blocked storage reads as "nothing saved".
    }
    if (raw !== cache.current.raw) {
      let value = fallback;
      if (raw !== null) {
        try {
          value = JSON.parse(raw) as T;
        } catch {
          value = fallback;
        }
      }
      cache.current = { raw, value };
    }
    return cache.current.value;
  }, [key, fallback]);

  const value = React.useSyncExternalStore(subscribe, getSnapshot, () => fallback);

  const set = React.useCallback(
    (next: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Nothing persists, but the session still reflects the change.
      }
      listeners.forEach((listener) => listener());
    },
    [key],
  );

  return [value, set] as const;
}

/**
 * Application wiring for the left navigation: supplies the real projects,
 * routes and account menu to the presentational `SideNav`.
 */
export function AppSideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = usePersisted(COLLAPSED_KEY, true);
  const [favourites, setFavourites] = usePersisted(FAVOURITES_KEY, DEFAULT_FAVOURITES);
  const [storedTabs, setStoredTabs] = usePersisted(ACTIVE_KEY, NO_TABS);
  const [groups, setGroups] = usePersisted<ProjectGroup[]>(GROUPS_KEY, NO_GROUPS);
  // The project awaiting a home once the new group is named.
  const [pendingSlug, setPendingSlug] = React.useState<string | null>(null);

  // Visiting a project puts it in Active tabs, as the design shows.
  const slugInPath = pathname.match(/^\/apps\/([^/]+)/)?.[1];
  const currentSlug =
    slugInPath && projects.some((p) => p.slug === slugInPath) ? slugInPath : undefined;

  // Derived, so the tab shows the moment the project opens; the effect only
  // writes it through so it survives a reload.
  const isNewTab = Boolean(currentSlug) && !storedTabs.includes(currentSlug!);
  const activeSlugs = React.useMemo(
    () => (isNewTab ? [...storedTabs, currentSlug!] : storedTabs),
    [isNewTab, storedTabs, currentSlug],
  );

  React.useEffect(() => {
    if (isNewTab) setStoredTabs(activeSlugs);
  }, [isNewTab, activeSlugs, setStoredTabs]);

  const toggleFavourite = (slug: string) => {
    setFavourites(
      favourites.includes(slug)
        ? favourites.filter((s) => s !== slug)
        : [...favourites, slug],
    );
  };

  const moveToGroup = (slug: string, groupId: string) => {
    setGroups(
      groups.map((group) => ({
        ...group,
        // A project belongs to one group, so leaving the old one is implied.
        slugs:
          group.id === groupId
            ? [...group.slugs.filter((s) => s !== slug), slug]
            : group.slugs.filter((s) => s !== slug),
      })),
    );
  };

  const createGroupWith = (name: string) => {
    const group: ProjectGroup = {
      id: `g${Date.now().toString(36)}`,
      name,
      slugs: pendingSlug ? [pendingSlug] : [],
    };
    setGroups([
      ...groups.map((g) =>
        pendingSlug ? { ...g, slugs: g.slugs.filter((s) => s !== pendingSlug) } : g,
      ),
      group,
    ]);
    toast.success(`Group "${name}" created`);
    setPendingSlug(null);
  };

  const toEntry = (slug: string): SideNavEntry | null => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) return null;
    return {
      id: project.slug,
      label: project.name,
      href: projectHref(project.slug),
      adornment: <ProjectLogo project={project} size="xs" />,
      favourite: favourites.includes(project.slug),
      onToggleFavourite: () => toggleFavourite(project.slug),
      // The data marks unseen work finished by an agent — exactly the design's
      // "show the AI icon once the task is complete".
      taskComplete: Boolean(project.aiActivity),
      menu: {
        label: "More",
        items: [
          {
            id: "share",
            label: "Share project",
            icon: ShareIcon,
            onSelect: () => toast.success(`Share link for ${project.name} copied`),
          },
          {
            id: "favourite",
            label: favourites.includes(project.slug) ? "Unfavourite" : "Favourite",
            icon: StarIcon,
            onSelect: () => toggleFavourite(project.slug),
          },
          {
            id: "move",
            label: "Move to group",
            icon: FolderIcon,
            items: [
              ...groups.map((group) => ({
                id: group.id,
                label: group.name,
                icon: FolderIcon,
                onSelect: () => {
                  moveToGroup(project.slug, group.id);
                  toast.success(`${project.name} moved to ${group.name}`);
                },
              })),
              {
                id: "new-group",
                label: "New group",
                icon: FolderAddIcon,
                separatorBefore: groups.length > 0,
                onSelect: () => setPendingSlug(project.slug),
              },
            ],
          },
        ],
      },
    };
  };

  const entries = (list: typeof projects) =>
    list.map((p) => toEntry(p.slug)).filter((e): e is SideNavEntry => e !== null);

  const sections: SideNavSection[] = [
    {
      id: "favourites",
      label: "Favourites",
      entries: entries(projects.filter((p) => favourites.includes(p.slug))),
      emptyLabel: "Star a project to pin it here.",
    },
    // Groups people made themselves sit between the two built-in views.
    ...groups.map((group) => ({
      id: group.id,
      label: group.name,
      entries: entries(projects.filter((p) => group.slugs.includes(p.slug))),
      emptyLabel: "Move a project here from its menu.",
    })),
    {
      id: "all",
      label: "All projects",
      href: "/apps",
      entries: entries(projects),
    },
    {
      id: "active",
      label: "Active tabs",
      entries: entries(projects.filter((p) => activeSlugs.includes(p.slug))),
      emptyLabel: "Projects you open appear here.",
    },
  ];

  return (
    <>
    <SideNav
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      onSearch={() => document.dispatchEvent(new CustomEvent(COMMAND_PALETTE_EVENT))}
      isActive={(href) => {
        // Every destination is a real path now, so no query matching — and so
        // no useSearchParams in the shell, which would put every app route
        // behind a client-only Suspense boundary.
        // /apps is the index; its children have rows of their own.
        if (href === "/apps") return pathname.replace(/\/$/, "") === "/apps";
        return pathname === href || pathname.startsWith(`${href}/`);
      }}
      primary={[
        { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
        { id: "new-chat", label: "New chat", href: "/apps/new", icon: NewChatIcon },
      ]}
      sections={sections}
      collapsedEntries={entries(
        projects.filter((p) =>
          activeSlugs.length > 0
            ? activeSlugs.includes(p.slug)
            : favourites.includes(p.slug),
        ),
      )}
      secondary={[
        { id: "workforce", label: "Workforce", href: "/users", icon: WorkforceIcon },
        { id: "skills", label: "Skills", href: "/skills", icon: SkillsIcon },
        { id: "connectors", label: "Connectors", href: "/connectors", icon: ConnectorsIcon },
      ]}
      footer={
        <div className={collapsed ? "flex flex-col items-center gap-2" : "flex items-center gap-2"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SideNavFooter
                collapsed={collapsed}
                initials={initialsOf(currentUser.name)}
                name={currentUser.name}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span>{currentUser.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {currentUser.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/users">Workspace settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/usage">Usage &amp; credits</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscription">Subscription</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support">Support</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/design-system">Design system</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" asChild>
                <Link href="/auth/sign-in">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {!collapsed && <ThemeToggle />}
        </div>
      }
    />
    <NewGroupDialog
      open={pendingSlug !== null}
      onOpenChange={(open) => !open && setPendingSlug(null)}
      existingNames={groups.map((g) => g.name)}
      onCreate={createGroupWith}
    />
    </>
  );
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
