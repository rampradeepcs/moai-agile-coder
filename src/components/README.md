# Agile Coder component library

React 19 · TypeScript 5 · Tailwind CSS 4. Live reference: [`/design-system`](../app/design-system/page.tsx).

```
src/components/
├── base/           # Button, Input, Textarea, Select, Checkbox, Radio,
│                   # Toggle, Badge, Avatar, Tooltip, Tag
├── application/    # Dropdown, Modal, Table, Tabs, Pagination, EmptyState,
│                   # DatePicker, FileUpload, Toast, Drawer, Progress
├── shared/         # Global components — the patterns used on many screens
└── index.ts        # barrel export
```

## Global components (`shared/`)

Patterns that appeared on more than one screen, extracted so each has one
definition. Import them from `@/components/shared`.

| Component | Replaces | Applied to |
|---|---|---|
| `PageHeader` | The screen title / description / actions block | 8 screens |
| `Panel` + `panelClasses` | `rounded-xl border bg-card …` card surfaces | ~45 surfaces in 25 files |
| `SearchInput` | Relative wrapper + absolutely positioned search icon | 6 screens |
| `FilterPill` | Multi-select filter dropdown with a count badge | backlog + kanban toolbars |
| `StatCard` | The `KpiCard` that lived in `dashboard/` | 9 cards on 2 dashboards |
| `ChartFrame` / `ChartTooltip` / `ChartLegend` | `ResponsiveContainer` wrappers, repeated tooltip styling, legend dots | 10 charts in 5 files |
| `ProjectTile` (+ `ProjectStatusBadge`, `CreditsMeter`) | Two separate project card implementations | dashboard + applications |

These are built on the existing `ui/` primitives, so adopting them changed
structure rather than appearance. Use `<Panel>` for a standard surface, and
`panelClasses()` when the surface has to be a different element — a
`motion.div`, a `<button>` — so those still track one definition:

```tsx
<Panel title="Logo" action={<Button …/>} bodyClassName="grid gap-3">…</Panel>

<motion.div className={panelClasses({ padding: "lg", elevation: "soft" })}>…</motion.div>
```

Inconsistencies found and resolved while extracting these:

- The **users** and **applications** screens rendered their page title at
  `text-sm`, where every other screen used `text-xl`. They now match.
- The backlog and kanban toolbars each had their own `FilterPill`. Only kanban
  showed an active state on the trigger, and the two count badges were shaped
  differently. Both now use the kanban treatment.
- The dashboard's project card treated `deprecated` projects as plain
  "inactive" grey; the applications grid gave them a red chip.
  `ProjectStatusBadge` renders all three states distinctly everywhere.
- The two project cards drew their credit bar differently — one hand-rolled,
  one via `<Progress>` — and each re-implemented the 90% over-budget threshold.
  `CreditsMeter` owns it now, with `labelPlacement` for the two label layouts.
- `StatCard` takes a `tone` (`brand`, `warning`, `teal`, …) instead of the raw
  `iconClass` string each of the 9 call sites used to repeat.

`StatCard` counts its value up on mount with `requestAnimationFrame`. Browsers
freeze rAF in background tabs, so a card rendered off-screen shows a partial
number until the tab is focused, then finishes. That is inherited behaviour, not
a regression.

One drift was deliberately **preserved**: panels use `shadow-elevation-low` in
some places and `shadow-soft` in others. `Panel` exposes this as an `elevation`
prop and every call site kept its current value, so the extraction changed no
pixels. Standardising on one is a follow-up decision.

## Importing

Deep imports are the documented path and stay tree-shake friendly:

```tsx
import { Button } from "@/components/base/buttons/button";
import { Table } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badge";
```

The barrel is the convenience alternative when pulling in several at once:

```tsx
import { Button, Badge, Table } from "@/components";
```

`@/` resolves to `src/`.

## Tokens

All tokens live in [`tailwind.preset.ts`](../../tailwind.preset.ts) at the repo
root. `tailwind.config.ts` applies it as a preset, and `globals.css` loads that
config with `@config "../../tailwind.config.ts";`.

**Semantic tokens are the default.** They resolve to CSS variables that flip
under `.dark`, so a component written with them is correct in both themes with
no `dark:` variant. The utility name follows the namespace:

| Token group | Utilities | Examples |
|---|---|---|
| `fg` | `text-fg-*` | `text-fg-primary`, `text-fg-secondary`, `text-fg-disabled` |
| `bg` | `bg-bg-*` | `bg-bg-primary`, `bg-bg-secondary`, `bg-bg-brand-solid` |
| `border` | `border-border-*` | `border-border-primary`, `border-border-error` |

**Raw scales** (`brand`, `gray`, `error`, `warning`, `success`, each `25`–`900`)
are for accents that must stay recognisable in both themes — a success badge
should read green in the dark, not follow the neutral surface. Those are the one
place `dark:` variants are expected.

```tsx
// semantic — theme-aware for free
<div className="bg-bg-primary text-fg-primary border-border-primary" />

// raw — deliberate accent, pair with a dark variant
<span className="bg-success-50 text-success-700 dark:bg-success-900/40" />
```

### The preset is additive

It never redefines a Tailwind default, because this library shares a codebase
with ~130 existing components:

- `text-xs` (291 uses), `max-w-md` and friends (50 uses) and `shadow-xs`
  (13 uses) keep their stock values. The type scale only *adds* `text-md` and
  `text-display-*`; elevations are added as `shadow-elevation-{low,mid,high}`.
- `brand`, `success` and `warning` carry `DEFAULT` and `subtle` keys, so the 176
  existing `text-brand` / `bg-brand-subtle` / `text-success` call sites keep
  resolving to the app's own variables.
- Spacing is inherited, not redefined. Named keys like `spacing.md` would shadow
  the container scale that `max-w-md` resolves from.

Adopting the preset is therefore a no-op for existing screens.

## Component contract

Every component in this library provides:

| Requirement | How it shows up |
|---|---|
| TypeScript props interface | Exported as `ComponentNameProps` |
| Default variants | Every variant prop has a sensible default |
| `className` prop | Merged last via `cn()`, so callers can always override |
| Dark mode | Semantic tokens; raw scales carry explicit `dark:` variants |
| Keyboard accessible | Tab, Enter, Escape and arrow keys all work |

Variants are plain `Record<Variant, string>` maps — readable, greppable, and
easy to extend without learning a variant DSL.

### Accessibility

Components whose keyboard and focus behaviour is genuinely hard to get right
(Select, Dropdown, Modal, Drawer, Tabs, Tooltip, Checkbox, Radio, Toggle,
Progress) are built on the Radix primitives already used by this project, so
focus traps, roving tabindex, typeahead and escape handling are correct rather
than approximated. The rest are hand-rolled.

Worth knowing:

- **Table** — header checkbox exposes the mixed state, sortable headers are real
  buttons and set `aria-sort`.
- **Tag** — `Backspace`/`Delete` on a dismissible tag removes it, matching the
  gesture people expect in a multi-value field.
- **FileUpload** — the dropzone is keyboard-operable (`Enter`/`Space`), not just
  a drop target.
- **Modal** / **Drawer** — always labelled; a description is rendered to
  screen readers even when one is not passed.

## Notes

- `Toast` renders through the `<Toaster />` already mounted in
  [`providers.tsx`](./providers.tsx); `Notification` is the same surface for
  inline banners.
- `DatePicker` composes the existing [`ui/calendar`](./ui/calendar.tsx)
  react-day-picker wrapper rather than restyling day-picker a second time.
- `src/components/ui/` is the pre-existing shadcn layer. It is untouched and
  still backs the app's feature components; this library is the new design-system
  surface that new UI should be built from.
