"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  ArchiveIcon,
  CopyIcon,
  BotIcon,
  CoinsIcon,
  FolderPlusIcon,
  SignalHighIcon,
  MoonIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  Trash2Icon,
  TriangleAlertIcon,
  Users2Icon,
} from "lucide-react";

import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  DrawerClose,
  Dropdown,
  EmptyState,
  FileUpload,
  Input,
  Modal,
  ModalClose,
  Notification,
  Pagination,
  Progress,
  ProgressCircle,
  Radio,
  RadioGroup,
  Select,
  Table,
  Tabs,
  Tag,
  Textarea,
  Toggle,
  Tooltip,
  toast,
  type TableColumn,
  type UploadedFile,
} from "@/components";
import {
  ChartFrame,
  FilterPill,
  ChartLegend,
  ChartTooltip,
  CreditsMeter,
  PageHeader,
  Panel,
  ProjectStatusBadge,
  ProjectTile,
  SearchInput,
  StatCard,
  axisProps,
  gridProps,
} from "@/components/shared";
import { projects } from "@/lib/data";
import { palette, surfaces } from "../../../../tailwind.preset";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

/* ------------------------------------------------------------------ page */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-t border-border-secondary pt-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-fg-primary">{title}</h2>
        <p className="text-sm text-fg-tertiary">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  sprintLoad: number;
}

const members: Member[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@wizkraft.dev", role: "Engineering lead", status: "active", sprintLoad: 82 },
  { id: "2", name: "Grace Hopper", email: "grace@wizkraft.dev", role: "Staff engineer", status: "active", sprintLoad: 64 },
  { id: "3", name: "Alan Turing", email: "alan@wizkraft.dev", role: "Product designer", status: "invited", sprintLoad: 31 },
  { id: "4", name: "Katherine Johnson", email: "katherine@wizkraft.dev", role: "Data scientist", status: "active", sprintLoad: 95 },
  { id: "5", name: "Barbara Liskov", email: "barbara@wizkraft.dev", role: "Principal engineer", status: "suspended", sprintLoad: 12 },
  { id: "6", name: "Margaret Hamilton", email: "margaret@wizkraft.dev", role: "Engineering manager", status: "active", sprintLoad: 47 },
];

const demoTrend = [
  { month: "Jan", value: 12_400 },
  { month: "Feb", value: 18_900 },
  { month: "Mar", value: 16_200 },
  { month: "Apr", value: 24_800 },
  { month: "May", value: 31_500 },
  { month: "Jun", value: 28_300 },
];

const statusColor = {
  active: "success",
  invited: "warning",
  suspended: "error",
} as const;

export default function DesignSystemPage() {
  const { resolvedTheme, setTheme } = useTheme();

  const [checked, setChecked] = React.useState<boolean | "indeterminate">("indeterminate");
  const [toggleOn, setToggleOn] = React.useState(true);
  const [page, setPage] = React.useState(3);
  const [selected, setSelected] = React.useState<string[]>(["2"]);
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<string[]>(["high"]);
  const [favourite, setFavourite] = React.useState(true);
  const [files, setFiles] = React.useState<UploadedFile[]>([
    { id: "f1", name: "product-requirements.pdf", size: 284_000 },
    { id: "f2", name: "design-tokens.json", size: 12_400, progress: 62 },
  ]);

  const columns: TableColumn<Member>[] = [
    {
      key: "name",
      header: "Member",
      sortable: true,
      sortValue: (row) => row.name,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm" name={row.name} />
          <div className="flex flex-col">
            <span className="font-medium text-fg-primary">{row.name}</span>
            <span className="text-xs text-fg-tertiary">{row.email}</span>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", sortable: true, sortValue: (row) => row.role, cell: (row) => row.role },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge size="sm" color={statusColor[row.status]} withDot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "load",
      header: "Sprint load",
      align: "right",
      sortable: true,
      sortValue: (row) => row.sprintLoad,
      width: "12rem",
      cell: (row) => (
        <Progress
          value={row.sprintLoad}
          size="sm"
          labelPosition="right"
          color={row.sprintLoad > 90 ? "error" : row.sprintLoad > 70 ? "warning" : "brand"}
        />
      ),
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      {/* ---------------------------------------------------------- header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Badge color="brand" size="sm" className="self-start">
            v1.0
          </Badge>
          <h1 className="text-display-sm font-semibold text-fg-primary">
            WizKraft design system
          </h1>
          <p className="max-w-xl text-md text-fg-tertiary">
            Eleven base and eleven application components, built on the tokens in{" "}
            <code className="rounded bg-bg-tertiary px-1.5 py-0.5 font-mono text-sm">
              tailwind.preset.ts
            </code>
            . Every surface below is driven by semantic tokens, so the theme
            switch is the only thing that changes.
          </p>
        </div>

        {/*
          The label is driven by CSS rather than `resolvedTheme` so the first
          paint matches the server render — no mounted flag, no hydration gap.
        */}
        <Button
          variant="secondary"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          iconLeading={
            <>
              <SunIcon className="hidden dark:block" />
              <MoonIcon className="block dark:hidden" />
            </>
          }
        >
          <span className="hidden dark:inline">Light theme</span>
          <span className="inline dark:hidden">Dark theme</span>
        </Button>
      </header>

      {/* --------------------------------------------------------- buttons */}
      <Section
        title="Button"
        description="primary · secondary · tertiary · destructive · link"
      >
        <Row label="Variants">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra large</Button>
        </Row>
        <Row label="States">
          <Button iconLeading={<PlusIcon />}>With icon</Button>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </Row>
      </Section>

      {/* ---------------------------------------------------------- inputs */}
      <Section
        title="Input, Textarea & Select"
        description="default · with icon · with addon · single · multi"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Project name" placeholder="Atlas rebuild" hint="Shown across the workspace." />
          <Input label="Search" placeholder="Search stories" icon={<SearchIcon />} />
          <Input label="Repository" addonLeading="github.com/" placeholder="acme/atlas" />
          <Input
            label="Sprint goal"
            defaultValue="Too short"
            isInvalid
            errorMessage="Enter at least 20 characters."
          />
          <Select
            label="Priority"
            placeholder="Select a priority"
            options={[
              { value: "p0", label: "P0 — Critical", description: "Blocks the release" },
              { value: "p1", label: "P1 — High" },
              { value: "p2", label: "P2 — Medium" },
              { value: "p3", label: "P3 — Low", disabled: true },
            ]}
          />
          <Select
            multiple
            label="Assignees"
            placeholder="Select teammates"
            hint="Pick as many as you need."
            defaultValue={["ada"]}
            options={[
              { value: "ada", label: "Ada Lovelace" },
              { value: "grace", label: "Grace Hopper" },
              { value: "alan", label: "Alan Turing" },
            ]}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Acceptance criteria"
              placeholder="Given… when… then…"
              maxLength={280}
              showCount
              hint="Markdown supported."
            />
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- controls */}
      <Section
        title="Checkbox, Radio & Toggle"
        description="default · indeterminate · card · with label"
      >
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Checkbox
              label="Select all stories"
              hint="Mixed state shown"
              checked={checked}
              onCheckedChange={setChecked}
            />
            <Checkbox label="Include sub-tasks" defaultChecked />
            <Checkbox label="Archived" disabled />
          </div>

          <div className="flex flex-col gap-3">
            <Toggle
              label="Auto-assign reviewers"
              hint="Round-robin across the squad"
              checked={toggleOn}
              onCheckedChange={setToggleOn}
            />
            <Toggle label="Email digests" size="sm" />
            <Toggle label="Locked" disabled />
          </div>

          <RadioGroup defaultValue="weekly">
            <Radio value="daily" label="Daily" />
            <Radio value="weekly" label="Weekly" />
            <Radio value="never" label="Never" />
          </RadioGroup>
        </div>

        <RadioGroup variant="card" defaultValue="scrum" className="sm:grid-cols-3">
          <Radio value="scrum" label="Scrum" hint="Fixed-length sprints with ceremonies." />
          <Radio value="kanban" label="Kanban" hint="Continuous flow with WIP limits." />
          <Radio value="hybrid" label="Hybrid" hint="Sprints with a pull-based board." />
        </RadioGroup>
      </Section>

      {/* -------------------------------------------------- badges & tags */}
      <Section
        title="Badge, Tag, Avatar & Tooltip"
        description="sm/md/lg × brand/gray/error/warning/success · dismissible · image/initials/icon"
      >
        <Row label="Badge colors">
          <Badge color="brand">Brand</Badge>
          <Badge color="gray">Gray</Badge>
          <Badge color="error">Error</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="success" withDot>
            Success
          </Badge>
        </Row>
        <Row label="Badge sizes">
          <Badge size="sm" color="brand">Small</Badge>
          <Badge size="md" color="brand">Medium</Badge>
          <Badge size="lg" color="brand">Large</Badge>
        </Row>
        <Row label="Tags">
          <Tag>Read-only</Tag>
          <Tag dismissible onDismiss={() => toast.info("Tag removed")}>
            frontend
          </Tag>
          <Tag dismissible size="lg" onDismiss={() => toast.info("Tag removed")}>
            needs-design
          </Tag>
        </Row>
        <Row label="Avatars">
          <Avatar size="xs" name="Ada Lovelace" />
          <Avatar size="sm" name="Grace Hopper" status="online" />
          <Avatar size="md" name="Alan Turing" status="busy" />
          <Avatar size="lg" />
          <AvatarGroup max={3} size="md">
            <Avatar size="md" name="Ada Lovelace" />
            <Avatar size="md" name="Grace Hopper" />
            <Avatar size="md" name="Alan Turing" />
            <Avatar size="md" name="Katherine Johnson" />
            <Avatar size="md" name="Barbara Liskov" />
          </AvatarGroup>
        </Row>
        <Row label="Tooltip sides">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Tooltip
              key={side}
              side={side}
              title={`Anchored ${side}`}
              description="Tooltips flip when they run out of room."
            >
              <Button variant="secondary" size="sm">
                {side}
              </Button>
            </Tooltip>
          ))}
        </Row>
      </Section>

      {/* ------------------------------------------------------------ tabs */}
      <Section title="Tabs" description="underline · pill">
        <Tabs
          defaultValue="backlog"
          items={[
            { value: "backlog", label: "Backlog", badge: 24, content: <p>Backlog panel.</p> },
            { value: "sprint", label: "Active sprint", badge: 8, content: <p>Sprint panel.</p> },
            { value: "done", label: "Done", content: <p>Done panel.</p> },
          ]}
        />
        <Tabs
          variant="pill"
          defaultValue="board"
          items={[
            { value: "board", label: "Board" },
            { value: "list", label: "List" },
            { value: "timeline", label: "Timeline" },
          ]}
        />
      </Section>

      {/* ----------------------------------------------------------- table */}
      <Section
        title="Table"
        description="sortable · selectable · with pagination — sort by member, role or sprint load"
      >
        <Table
          data={members}
          columns={columns}
          rowKey={(row) => row.id}
          selectable
          selectedKeys={selected}
          onSelectionChange={setSelected}
          defaultSortKey="name"
          pageSize={4}
          caption={`${selected.length} of ${members.length} selected`}
        />
      </Section>

      {/* ------------------------------------------- overlays & feedback */}
      <Section
        title="Dropdown, Modal & Drawer"
        description="with sections and icons · sm/md/lg with footer actions · left/right"
      >
        <Row label="Overlays">
          <Dropdown
            trigger={<Button variant="secondary">Actions</Button>}
            sections={[
              {
                id: "edit",
                label: "Edit",
                items: [
                  { id: "rename", label: "Rename", icon: <PencilIcon />, shortcut: "⌘R" },
                  { id: "duplicate", label: "Duplicate", icon: <CopyIcon />, shortcut: "⌘D" },
                ],
              },
              {
                id: "danger",
                items: [
                  { id: "archive", label: "Archive", icon: <ArchiveIcon /> },
                  { id: "delete", label: "Delete project", icon: <Trash2Icon />, destructive: true },
                ],
              },
            ]}
          />

          <Modal
            trigger={<Button variant="secondary">Open modal</Button>}
            title="Delete this project?"
            description="Every story, sprint and attachment will be removed. This cannot be undone."
            icon={<TriangleAlertIcon />}
            size="sm"
            footer={
              <>
                <ModalClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </ModalClose>
                <ModalClose asChild>
                  <Button variant="destructive" onClick={() => toast.error("Project deleted")}>
                    Delete
                  </Button>
                </ModalClose>
              </>
            }
          />

          <Drawer
            trigger={<Button variant="secondary">Open drawer</Button>}
            title="Story details"
            description="AC-1042 · Checkout flow refactor"
            side="right"
            footer={
              <>
                <DrawerClose asChild>
                  <Button variant="secondary">Close</Button>
                </DrawerClose>
                <Button onClick={() => toast.success("Story saved")}>Save</Button>
              </>
            }
          >
            <div className="flex flex-col gap-4">
              <Input label="Title" defaultValue="Checkout flow refactor" />
              <Textarea label="Description" defaultValue="Split the checkout into three steps." />
              <DatePicker label="Due date" />
            </div>
          </Drawer>
        </Row>

        <Row label="Toasts">
          <Button variant="secondary" onClick={() => toast.success("Sprint closed", { description: "12 of 14 stories shipped." })}>
            Success
          </Button>
          <Button variant="secondary" onClick={() => toast.error("Build failed", { description: "3 tests failed on main." })}>
            Error
          </Button>
          <Button variant="secondary" onClick={() => toast.warning("Sprint capacity exceeded")}>
            Warning
          </Button>
          <Button variant="secondary" onClick={() => toast.info("2 new stories assigned to you")}>
            Info
          </Button>
        </Row>

        <div className="grid gap-3 sm:grid-cols-2">
          <Notification type="success" title="Deployment succeeded" description="v2.4.0 is live in production." />
          <Notification type="error" title="Sync failed" description="Reconnect the GitHub integration." onDismiss={() => {}} />
          <Notification type="warning" title="Sprint ends tomorrow" description="4 stories are still in progress." />
          <Notification type="info" title="New teammate joined" description="Margaret Hamilton joined the squad." />
        </div>
      </Section>

      {/* --------------------------------------------------------- pickers */}
      <Section
        title="DatePicker, FileUpload & Progress"
        description="single · range · dropzone · button trigger · bar · circular"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <DatePicker label="Sprint start" />
          <DatePicker mode="range" label="Release window" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FileUpload
            label="Attachments"
            hint="PDF, PNG or JSON up to 10 MB"
            multiple
            maxSize={10 * 1024 * 1024}
            files={files}
            onFilesSelected={(picked) =>
              setFiles((current) => [
                ...current,
                ...picked.map((file) => ({
                  id: `${file.name}-${file.size}`,
                  name: file.name,
                  size: file.size,
                })),
              ])
            }
            onFileRemove={(id) => setFiles((current) => current.filter((f) => f.id !== id))}
          />
          <FileUpload variant="button" label="Import backlog" hint="CSV only" />
        </div>

        <div className="flex flex-col gap-4">
          <Progress value={72} labelPosition="right" />
          <Progress value={38} color="warning" labelPosition="right" />
          <Progress value={94} color="error" labelPosition="right" />
        </div>

        <Row label="Circular">
          <ProgressCircle value={72} />
          <ProgressCircle value={38} color="warning" size={80} />
          <ProgressCircle value={94} color="error" size={64} strokeWidth={6} />
          <ProgressCircle value={100} color="success" size={64} strokeWidth={6} />
        </Row>
      </Section>




      {/* ------------------------------------------------------- typography */}
      <Section
        title="Typography"
        description="Manrope, self-hosted as one variable file (axis 200–800). Geist Mono is kept for code and identifiers."
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
            Weights in use
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { cls: "font-normal", label: "Regular 400" },
              { cls: "font-medium", label: "Medium 500" },
              { cls: "font-semibold", label: "Semibold 600" },
              { cls: "font-bold", label: "Bold 700" },
            ].map(({ cls, label }) => (
              <div key={cls} className="flex flex-col gap-0.5">
                <span className={`text-2xl text-fg-primary ${cls}`}>Ag</span>
                <span className="text-xs text-fg-tertiary">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
            Type scale
          </p>
          <div className="flex flex-col gap-3">
            {[
              { cls: "text-display-2xl", label: "display-2xl" },
              { cls: "text-display-lg", label: "display-lg" },
              { cls: "text-display-sm", label: "display-sm" },
              { cls: "text-display-xs", label: "display-xs" },
              { cls: "text-md", label: "md" },
              { cls: "text-sm", label: "sm" },
              { cls: "text-xs", label: "xs" },
            ].map(({ cls, label }) => (
              <div key={cls} className="flex items-baseline gap-4">
                <span className="w-24 shrink-0 font-mono text-xs text-fg-tertiary">
                  {label}
                </span>
                <span className={`truncate font-semibold text-fg-primary ${cls}`}>
                  Agile execution
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
            Monospace
          </p>
          <p className="font-mono text-sm text-fg-secondary">
            PC-7364 · Geist Mono · 0123456789
          </p>
        </div>
      </Section>

      {/* --------------------------------------------------- colour palette */}
      <Section
        title="Colour palette"
        description="Generated from the WizKraft Figma colour styles — Primary (brand), neutrals, feedback and accents. Steps run 100–1000 as the design file defines them."
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
            Background fills
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(surfaces).map(([name, hex]) => (
              <div key={name} className="flex items-center gap-2.5">
                <span
                  className="size-10 rounded-lg border border-border-primary"
                  style={{ background: hex }}
                />
                <span className="flex flex-col">
                  <span className="text-sm text-fg-primary capitalize">{name}</span>
                  <span className="font-mono text-xs text-fg-tertiary">{hex}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {Object.entries(palette).map(([family, ramp]) => (
          <div key={family} className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
              {family}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(ramp).map(([step, hex]) => (
                <div key={step} className="flex w-[4.5rem] flex-col gap-1">
                  <span
                    className="h-12 w-full rounded-md border border-border-primary"
                    style={{ background: hex }}
                  />
                  <span className="text-[11px] font-medium text-fg-secondary">{step}</span>
                  <span className="font-mono text-[10px] text-fg-tertiary">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* ------------------------------------------------- global components */}
      <Section
        title="Global components"
        description="Patterns shared across screens — page header, panel, search, filter, stat card, charts and project tiles"
      >
        <Row label="Page header">
          <PageHeader
            className="w-full rounded-xl border border-border-primary bg-bg-primary p-5"
            title="Usage & utilisation"
            description="Where your workspace credits go — by project and by person."
            actions={<Button size="sm">Add credits</Button>}
          />
        </Row>

        <Row label="Panel">
          <Panel
            className="w-full sm:w-80"
            title="Release notes"
            titleStyle="compact"
            action={<Button variant="tertiary" size="sm">Edit</Button>}
          >
            <p className="text-sm text-fg-tertiary">
              Panels carry the workspace card surface — padding and elevation
              are props, so every screen shares one definition.
            </p>
          </Panel>
          <Panel className="w-full sm:w-64" title="Basic details" titleStyle="overline" elevation="soft">
            <p className="text-sm text-fg-tertiary">Overline heading variant.</p>
          </Panel>
        </Row>

        <Row label="Search input">
          <SearchInput
            size="sm"
            value={search}
            onValueChange={setSearch}
            placeholder="Search this board"
            aria-label="Search demo, small"
            wrapperClassName="w-56"
          />
          <SearchInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search work items…"
            aria-label="Search demo, medium"
            wrapperClassName="w-64"
          />
        </Row>

        <Row label="Filter pill">
          <FilterPill
            label="Priority"
            icon={SignalHighIcon}
            selected={priorityFilter}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
            onToggle={(value: string) =>
              setPriorityFilter((current) =>
                current.includes(value)
                  ? current.filter((v) => v !== value)
                  : [...current, value],
              )
            }
            onClear={() => setPriorityFilter([])}
          />
        </Row>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
            Stat card
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Projects" value="3" sub="2 active" icon={FolderPlusIcon} tone="brand" />
            <StatCard
              label="Credits used"
              value="80%"
              sub="40,520 remaining"
              delta="+12%"
              positive={false}
              icon={CoinsIcon}
              tone="warning"
            />
            <StatCard label="Team members" value="6" sub="across all projects" icon={Users2Icon} tone="teal" />
            <StatCard label="AI agents" value="11" sub="4 working right now" icon={BotIcon} tone="pink" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
            Chart frame, tooltip & legend
          </p>
          <Panel elevation="soft">
            <ChartFrame height={200}>
              <AreaChart data={demoTrend} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                <defs>
                  <linearGradient id="ds-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} />
                <ChartTooltip />
                <Area type="monotone" dataKey="value" stroke="var(--brand)" strokeWidth={2} fill="url(#ds-fill)" />
              </AreaChart>
            </ChartFrame>
            <ChartLegend className="mt-3" items={[{ color: "var(--brand)", label: "Credits used" }]} />
          </Panel>
        </div>

        <Row label="Project status & credits">
          <ProjectStatusBadge status="active" />
          <ProjectStatusBadge status="inactive" />
          <ProjectStatusBadge status="deprecated" />
          <CreditsMeter used={88_280} assigned={120_000} className="w-56" />
          <CreditsMeter used={38_900} assigned={40_000} labelPlacement="below" className="w-56" />
        </Row>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-fg-tertiary uppercase">
            Project tile — compact and detailed
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 2).map((project) => (
              <ProjectTile key={project.id} project={project} />
            ))}
            {projects.slice(0, 1).map((project) => (
              <ProjectTile
                key={`detailed-${project.id}`}
                project={project}
                variant="detailed"
                favourite={favourite}
                onFavouriteChange={setFavourite}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* --------------------------------------------- pagination & empty */}
      <Section
        title="Pagination & EmptyState"
        description="default · compact · with icon · with action"
      >
        <Pagination page={page} totalPages={12} onPageChange={setPage} />
        <Pagination page={page} totalPages={12} onPageChange={setPage} variant="compact" />

        <div className="rounded-xl border border-border-primary bg-bg-primary">
          <EmptyState
            icon={<FolderPlusIcon />}
            title="No projects yet"
            description="Describe what you want to build and WizKraft will draft the backlog for you."
            action={
              <>
                <Button variant="secondary">Import backlog</Button>
                <Button iconLeading={<PlusIcon />}>New project</Button>
              </>
            }
          />
        </div>
      </Section>
    </main>
  );
}
