"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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
  GroupsIcon,
  NewChatIcon,
  ProjectsIcon,
  SkillsIcon,
  WorkforceIcon,
} from "@/components/application/side-nav/nav-icons";
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
const ACTIVE_KEY = "wizkraft-active-projects";
const FAVOURITES_KEY = "wizkraft-favourites";

/** Figma groups projects by kind; the data carries the platform string. */
const isMobile = (platform: string) => platform.toLowerCase().includes("mobile");

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
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = usePersisted(COLLAPSED_KEY, false);
  const [favourites, setFavourites] = usePersisted(FAVOURITES_KEY, DEFAULT_FAVOURITES);
  const [storedTabs, setStoredTabs] = usePersisted(ACTIVE_KEY, NO_TABS);

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
      active: activeSlugs.includes(project.slug),
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
    {
      id: "saas",
      label: "SaaS applications",
      icon: GroupsIcon,
      href: "/apps",
      entries: entries(projects.filter((p) => !isMobile(p.platform))),
    },
    {
      id: "mobile",
      label: "Mobile applications",
      icon: GroupsIcon,
      href: "/apps",
      entries: entries(projects.filter((p) => isMobile(p.platform))),
      defaultOpen: false,
    },
    {
      id: "all",
      label: "All projects",
      icon: ProjectsIcon,
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
    <SideNav
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      onSearch={() => document.dispatchEvent(new CustomEvent(COMMAND_PALETTE_EVENT))}
      isActive={(href) => {
        // Toolkit links differ only by query string, so a pathname-only
        // comparison would light both of them up on /settings — or neither.
        const [path, query] = href.split("?");
        if (query) {
          const [key, value] = query.split("=");
          return pathname.replace(/\/$/, "") === path && searchParams.get(key) === value;
        }
        // /apps is the index; its children have their own rows.
        if (path === "/apps") return pathname.replace(/\/$/, "") === "/apps";
        return pathname === path || pathname.startsWith(`${path}/`);
      }}
      primary={[
        { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
        { id: "new-chat", label: "New chat", href: "/apps/new", icon: NewChatIcon, emphasis: true },
      ]}
      sections={sections}
      secondary={[
        { id: "workforce", label: "Workforce", href: "/users", icon: WorkforceIcon },
      ]}
      toolkit={{
        label: "AI Toolkit",
        links: [
          { id: "skills", label: "Skills", href: "/settings?tab=skills", icon: SkillsIcon },
          {
            id: "connectors",
            label: "Connectors",
            href: "/settings?tab=connectors",
            icon: ConnectorsIcon,
          },
        ],
      }}
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
  );
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
