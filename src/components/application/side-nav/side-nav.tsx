"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/base/tooltips/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CollapseIcon,
  ExpandIcon,
  ChevronRightIcon,
  MoreIcon,
  SearchIcon,
  SparklesIcon,
  StarFilledIcon,
  StarIcon,
} from "./nav-icons";

/*
 * Left navigation, built to the WizKraft Figma left menu (file
 * DTfOUMmRzfz8munYZnMkr7, node 18:920).
 *
 * The design has four states — first-time user, active user, collapsed and
 * collapsed-hover. Those are not four components: the first two differ only in
 * how many sections have content, so the component renders whatever sections
 * it is given and the caller decides. Collapsed is a real variant and is
 * driven by `collapsed`.
 *
 * Figma metrics, kept literal rather than approximated: 230px expanded /
 * 80px collapsed, 32px rows, 8px radius, 12px horizontal padding, 16px icons,
 * and Caption/1 (12px/18px) for item text.
 */

export type NavIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface SideNavLink {
  id: string;
  label: string;
  href: string;
  icon: NavIconComponent;
}

export interface SideNavMenuItem {
  id: string;
  label: string;
  icon?: NavIconComponent;
  onSelect?: () => void;
  /** Nested items render as a submenu. */
  items?: SideNavMenuItem[];
  /** Draws a rule above this item. */
  separatorBefore?: boolean;
}

export interface SideNavEntry {
  id: string;
  label: string;
  href: string;
  /** The 16px tile shown in place of an icon — usually a project logo. */
  adornment?: React.ReactNode;
  favourite?: boolean;
  onToggleFavourite?: () => void;
  /**
   * An agent has finished something here and nobody has looked yet. Shows the
   * animated AI mark — in the rail as well as the expanded row.
   */
  taskComplete?: boolean;
  /**
   * Row actions. Rendered twice from one definition — as a right-click menu on
   * the row, and behind the overflow control that appears on hover.
   */
  menu?: { label: string; items: SideNavMenuItem[] };
}

export interface SideNavSection {
  id: string;
  label: string;
  /** Omitted for the plain lettered sections (FAVOURITES, ACTIVE TABS). */
  icon?: NavIconComponent;
  href?: string;
  entries: SideNavEntry[];
  /** Sections start closed, as the design's first-time state shows them. */
  defaultOpen?: boolean;
  /** Message shown instead of rows when the section is empty. */
  emptyLabel?: string;
}

export interface SideNavProps {
  /** Dashboard and New chat — the two rows above the sections. */
  primary: SideNavLink[];
  sections: SideNavSection[];
  /** Rows that sit between the sections and the toolkit, e.g. Workforce. */
  secondary?: SideNavLink[];
  /**
   * Shown in the collapsed rail in place of the sections. The rail has room
   * for destinations, not for groups that only exist to be expanded, so this
   * is the projects worth a one-click return — the open ones.
   */
  collapsedEntries?: SideNavEntry[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onSearch?: () => void;
  /** Decides which row is highlighted. */
  isActive?: (href: string) => boolean;
  /** The account row pinned to the bottom. */
  footer?: React.ReactNode;
  className?: string;
}

const ROW = "flex h-8 w-full items-center gap-2 rounded-lg px-3 text-caption-1 transition-colors";
const SECTION_LABEL =
  "min-w-0 flex-1 truncate text-[10px] leading-[18px] tracking-[0.2px] text-gray-600 uppercase";

export function SideNav({
  primary,
  sections,
  secondary = [],
  collapsedEntries = [],
  collapsed = false,
  onCollapsedChange,
  onSearch,
  isActive = () => false,
  footer,
  className,
}: SideNavProps) {
  return (
    <nav
      aria-label="Main"
      className={cn(
        "flex shrink-0 flex-col gap-6 bg-sidebar py-4 transition-[width] duration-200",
        collapsed ? "w-20 items-center px-2" : "w-[230px] px-2.5",
        className,
      )}
    >
      <Header
        collapsed={collapsed}
        onCollapsedChange={onCollapsedChange}
        onSearch={onSearch}
      />

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          collapsed ? "items-center justify-between" : "gap-6",
        )}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            collapsed ? "items-center gap-8 overflow-visible" : "gap-6 overflow-y-auto",
          )}
        >
          {/* Dashboard, New chat, Workforce, Skills and Connectors are one block. */}
          <div className={cn("flex flex-col", collapsed ? "items-center gap-2.5" : "w-full gap-2")}>
            {[...primary, ...secondary].map((link) => (
              <NavRow key={link.id} link={link} collapsed={collapsed} active={isActive(link.href)} />
            ))}
          </div>

          {!collapsed && (
            <div className="flex w-full flex-col gap-2.5">
              {sections.map((section) => (
                <Section key={section.id} section={section} isActive={isActive} />
              ))}
            </div>
          )}

          {collapsed && collapsedEntries.length > 0 && (
            <div className="flex flex-col items-center gap-2.5">
              {collapsedEntries.map((entry) => (
                <CollapsedEntry
                  key={entry.id}
                  entry={entry}
                  active={isActive(entry.href)}
                />
              ))}
            </div>
          )}
        </div>

        {footer}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ header */

function Header({
  collapsed,
  onCollapsedChange,
  onSearch,
}: Pick<SideNavProps, "collapsed" | "onCollapsedChange" | "onSearch">) {
  const toggle = onCollapsedChange && (
    <IconButton
      label={collapsed ? "Expand menu" : "Collapse menu"}
      onClick={() => onCollapsedChange(!collapsed)}
    >
      {collapsed ? <ExpandIcon className="size-4" /> : <CollapseIcon className="size-4" />}
    </IconButton>
  );

  if (collapsed) {
    return <div className="flex h-[30px] items-center justify-center">{toggle}</div>;
  }

  return (
    <div className="flex h-[30px] w-full items-center gap-6">
      <Link
        href="/"
        aria-label="WizKraft home"
        className="flex min-w-0 flex-1 items-center gap-2 rounded transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none"
      >
        <BrandMark />
        <span className="truncate text-body-lg text-foreground">wizkraft.ai</span>
      </Link>
      <div className="flex shrink-0 items-center gap-4">
        {onSearch && (
          <IconButton label="Search" onClick={onSearch}>
            <SearchIcon className="size-4" />
          </IconButton>
        )}
        {toggle}
      </div>
    </div>
  );
}

/** The wizard mark, carried at the size the header reserves for it. */
function BrandMark() {
  return (
    <svg viewBox="0 0 24 22" className="h-[21px] w-6 shrink-0" fill="#24D47D" aria-hidden>
      <path d="M6.17 15.74c.83-1.92 1.72-3.81 2.67-5.68.71-1.38 1.53-2.91 2.41-4.19 1.25-1.8 3.18-4 5.46-4.43.97-.18 2.1-.06 2.91.53.92.67 1.26 1.4 1.45 2.47-.54-.47-.94-.8-1.65-1-1.77-.5-2.82 1.06-3.18 2.58-.3 1.3-.24 2.57.01 3.87.05.26.09.52.16.78-.81-.33-1.53-.48-2.4-.49.22.14.45.27.67.41 1.4.92 2.37 2.24 2.91 3.81.13.39.27.74.35 1.15.04.16.07.3.11.46-.11-.05-.24-.12-.36-.16-2.64-1.15-5.42-1.74-8.27-1.12-1.2.26-2.11.59-3.24 1.03Z" />
      <path d="M11.22 15.93c2.99-.18 6.56 1 9.24 2.26.75.36 1.51.71 2.22 1.15.46.29 1.08.57 1.27 1.11.15.42-.06.8-.4 1.03-.86.6-1.92.87-2.9 1.16-.14-.36-.26-.67-.42-1.02.48-.16 1-.35 1.4-.67-.31-.27-.97-.59-1.35-.78-2.27-1.12-5.01-1.94-7.54-2.09h-.03c-.89-.06-1.79-.04-2.68.04-2.39.25-5.85 1.19-7.7 2.81.42.34.96.49 1.47.67-.16.28-.34.75-.45 1.05-.98-.2-2.2-.49-3-1.13-.49-.39-.45-1.01-.02-1.43.44-.43 1.01-.83 1.54-1.15 2.79-1.69 6.08-2.85 9.35-3Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------- rows */

function NavRow({
  link,
  collapsed,
  active,
}: {
  link: SideNavLink;
  collapsed?: boolean;
  active?: boolean;
}) {
  const Icon = link.icon;

  if (collapsed) {
    return (
      <Tooltip title={link.label} side="right">
        <Link
          href={link.href}
          aria-label={link.label}
          aria-current={active ? "page" : undefined}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg border border-gray-alpha10 transition-colors",
            "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
            active
              ? "bg-brand-600 text-gray-900"
              : "bg-sidebar text-foreground hover:bg-brand-600/10",
          )}
        >
          <Icon className="size-4" />
        </Link>
      </Tooltip>
    );
  }

  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        ROW,
        "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
        active
          ? "bg-brand-600 text-gray-900"
          : "text-foreground hover:bg-brand-600/10",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{link.label}</span>
    </Link>
  );
}

/** A project in the collapsed rail: its logo in the same 32px well as a nav icon. */
function CollapsedEntry({ entry, active }: { entry: SideNavEntry; active?: boolean }) {
  return (
    <Tooltip title={entry.label} side="right">
      <Link
        href={entry.href}
        aria-label={entry.label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative grid size-8 shrink-0 place-items-center rounded-lg border border-gray-alpha10 transition-colors",
          "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
          active ? "bg-brand-600" : "bg-sidebar hover:bg-brand-600/10",
        )}
      >
        {entry.adornment}
        {entry.taskComplete && (
          <SparklesIcon className="ai-task-complete absolute -top-1 -right-1 size-3 text-brand-600" />
        )}
      </Link>
    </Tooltip>
  );
}

function EntryRow(props: { entry: SideNavEntry; active?: boolean }) {
  const { entry } = props;
  if (!entry.menu) return <EntryRowBody {...props} />;
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="w-full">
          <EntryRowBody {...props} />
        </div>
      </ContextMenuTrigger>
      <MenuBody menu={entry.menu} variant="context" />
    </ContextMenu>
  );
}

function EntryRowBody({ entry, active }: { entry: SideNavEntry; active?: boolean }) {
  return (
    <div
      className={cn(
        "group/entry flex h-8 w-full items-center gap-2 rounded-lg px-1.5 transition-colors",
        active ? "bg-brand-600" : "hover:bg-brand-600/10",
      )}
    >
      <Link
        href={entry.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded text-caption-1",
          "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
          active ? "text-gray-900" : "text-foreground",
        )}
      >
        {entry.adornment}
        <span className="min-w-0 flex-1 truncate">{entry.label}</span>
      </Link>

      {entry.taskComplete && (
        <SparklesIcon
          className={cn(
            "ai-task-complete size-3.5 shrink-0",
            active ? "text-gray-900" : "text-brand-600",
          )}
        />
      )}

      {entry.onToggleFavourite && (
        <button
          type="button"
          onClick={entry.onToggleFavourite}
          aria-pressed={entry.favourite}
          aria-label={
            entry.favourite ? `Unfavourite ${entry.label}` : `Favourite ${entry.label}`
          }
          className={cn(
            "grid size-3.5 shrink-0 place-items-center rounded transition-opacity",
            "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
            // An unset star is noise on every row, so it appears on approach.
            entry.favourite
              ? "opacity-100"
              : "opacity-0 group-hover/entry:opacity-100 focus-visible:opacity-100",
          )}
        >
          {entry.favourite ? (
            <StarFilledIcon
              className={cn("size-3.5", active ? "text-gray-900" : "text-warning-600")}
            />
          ) : (
            <StarIcon
              className={cn("size-3.5", active ? "text-gray-900" : "text-muted-foreground")}
            />
          )}
        </button>
      )}

      {entry.menu && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`More options for ${entry.label}`}
              onClick={(event) => event.stopPropagation()}
              className={cn(
                "grid size-3.5 shrink-0 -rotate-90 place-items-center rounded transition-opacity",
                active ? "text-gray-900" : "text-muted-foreground",
                "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
                active
                  ? "opacity-100"
                  : "opacity-0 group-hover/entry:opacity-100 focus-visible:opacity-100",
              )}
            >
              <MoreIcon className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <MenuBody menu={entry.menu} variant="dropdown" />
        </DropdownMenu>
      )}
    </div>
  );
}

/**
 * Renders a menu definition against either primitive set. Radix's context and
 * dropdown menus share a shape, so the items are described once and the
 * trigger decides which surface they appear on.
 */
function MenuBody({
  menu,
  variant,
}: {
  menu: NonNullable<SideNavEntry["menu"]>;
  variant: "context" | "dropdown";
}) {
  const isContext = variant === "context";
  const Content = isContext ? ContextMenuContent : DropdownMenuContent;
  const Label = isContext ? ContextMenuLabel : DropdownMenuLabel;

  return (
    <Content className={"flex w-[250px] flex-col gap-2 rounded-[10px] border-gray-alpha10 bg-background px-1.5 py-4 shadow-[4px_8px_12px_rgba(0,0,0,0.14)]"}>
      <Label className={"px-2.5 py-0 text-overline-1 font-normal text-gray-500"}>{menu.label}</Label>
      {menu.items.map((item) => (
        <MenuEntry key={item.id} item={item} variant={variant} />
      ))}
    </Content>
  );
}

const MENU_ITEM =
  "flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-caption-1 text-foreground focus:bg-brand-600/10 focus:text-foreground data-[state=open]:bg-brand-600/10";

function MenuEntry({
  item,
  variant,
}: {
  item: SideNavMenuItem;
  variant: "context" | "dropdown";
}) {
  const isContext = variant === "context";
  const Item = isContext ? ContextMenuItem : DropdownMenuItem;
  const Separator = isContext ? ContextMenuSeparator : DropdownMenuSeparator;
  const Sub = isContext ? ContextMenuSub : DropdownMenuSub;
  const SubTrigger = isContext ? ContextMenuSubTrigger : DropdownMenuSubTrigger;
  const SubContent = isContext ? ContextMenuSubContent : DropdownMenuSubContent;
  const Label = isContext ? ContextMenuLabel : DropdownMenuLabel;
  const Icon = item.icon;

  if (item.items) {
    return (
      <>
        {item.separatorBefore && <Separator className="my-0 h-px bg-gray-alpha10" />}
        <Sub>
          <SubTrigger className={cn(MENU_ITEM, "[&_svg.lucide]:hidden")}>
            {Icon && <Icon className="size-4 shrink-0" />}
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <ChevronRightIcon className="size-4 shrink-0" />
          </SubTrigger>
          <SubContent className={"flex w-[250px] flex-col gap-2 rounded-[10px] border-gray-alpha10 bg-background px-1.5 py-4 shadow-[4px_8px_12px_rgba(0,0,0,0.14)]"}>
            <Label className={"px-2.5 py-0 text-overline-1 font-normal text-gray-500"}>{item.label}</Label>
            {item.items.map((child) => (
              <MenuEntry key={child.id} item={child} variant={variant} />
            ))}
          </SubContent>
        </Sub>
      </>
    );
  }

  return (
    <>
      {item.separatorBefore && <Separator className="my-0 h-px bg-gray-alpha10" />}
      <Item className={MENU_ITEM} onSelect={item.onSelect}>
        {Icon && <Icon className="size-4 shrink-0" />}
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
      </Item>
    </>
  );
}

/* --------------------------------------------------------------- sections */

function Section({
  section,
  isActive,
}: {
  section: SideNavSection;
  isActive: (href: string) => boolean;
}) {
  const Icon = section.icon;
  return (
    <Disclosure
      defaultOpen={section.defaultOpen ?? false}
      label={
        Icon ? (
          <>
            <Icon className="size-4 shrink-0 text-foreground" />
            <span className="min-w-0 flex-1 truncate text-caption-1 text-foreground">
              {section.label}
            </span>
          </>
        ) : (
          section.label
        )
      }
      plain={!Icon}
    >
      <div className="flex w-full flex-col gap-0.5 px-1.5">
        {section.entries.length === 0 ? (
          <p className="px-3 pb-1 text-caption-1 text-muted-foreground">
            {section.emptyLabel ?? "Nothing here yet."}
          </p>
        ) : (
          section.entries.map((entry) => (
            <EntryRow key={entry.id} entry={entry} active={isActive(entry.href)} />
          ))
        )}
      </div>
    </Disclosure>
  );
}

/** The collapsible block the design draws on the raised #f9f9fa ground. */
function Disclosure({
  label,
  defaultOpen = false,
  plain = false,
  children,
}: {
  label: React.ReactNode;
  defaultOpen?: boolean;
  /** Renders the label as the small uppercase caption rather than a nav row. */
  plain?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-0.5 rounded-lg",
        // Closed sections sit flat on the menu; the raised ground appears only
        // once a section has content to hold.
        open && "bg-surface-raised pb-1.5",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={id}
        // `text-left` is load-bearing: a <button> centres its text by default,
        // which pushed every section label off the rows' left edge.
        className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none"
      >
        {plain ? <span className={SECTION_LABEL}>{label}</span> : label}
        {open ? (
          <ChevronUpIcon className="size-3 shrink-0 text-foreground" />
        ) : (
          <ChevronDownIcon className="size-3 shrink-0 text-foreground" />
        )}
      </button>
      <div id={id} hidden={!open}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-lg text-foreground transition-colors hover:bg-brand-600/10 focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none"
    >
      {children}
    </button>
  );
}

/** The account row the design pins to the bottom of the menu. */
export function SideNavFooter({
  collapsed,
  initials,
  name,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  collapsed?: boolean;
  initials: string;
  name: string;
}) {
  if (collapsed) {
    return (
      <button
        type="button"
        aria-label="Account menu"
        className={cn(
          "grid size-10 shrink-0 cursor-pointer place-items-center rounded bg-brand-600 text-button-1 text-white shadow-[14px_17px_20px_rgba(112,144,176,0.08)]",
          "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        {initials}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Account menu"
      className={cn(
        "flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg bg-surface-raised p-3 text-left transition-colors hover:bg-background",
        "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="grid size-6 shrink-0 place-items-center rounded bg-brand-600 text-[11px] leading-4 text-white shadow-[14px_17px_20px_rgba(112,144,176,0.08)]"
      >
        {initials}
      </span>
      <span className="min-w-0 flex-1 truncate text-caption-1 text-foreground">{name}</span>
      <ChevronDownIcon className="size-4 shrink-0 text-foreground" />
    </button>
  );
}
