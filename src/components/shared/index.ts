/**
 * Global components — the patterns that appear on more than one screen.
 *
 * These are app-level compositions built on the existing `ui/` primitives, so
 * adopting them changes structure rather than appearance. New UI that isn't
 * replacing an existing screen should prefer the design-system library in
 * `base/` and `application/` instead.
 */

export { Panel, panelClasses } from "./panel";
export type {
  PanelElevation,
  PanelPadding,
  PanelProps,
  PanelTitleStyle,
} from "./panel";

export { PageHeader } from "./page-header";
export type { PageHeaderProps } from "./page-header";

export { SearchInput } from "./search-input";
export type { SearchInputProps, SearchInputSize } from "./search-input";

export { FilterPill } from "./filter-pill";
export type { FilterOption, FilterPillProps } from "./filter-pill";

export { StatCard } from "./stat-card";
export type { StatCardProps, StatCardTone } from "./stat-card";

export {
  ChartFrame,
  ChartLegend,
  ChartTooltip,
  axisProps,
  axisTick,
  gridProps,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from "./chart";
export type {
  ChartFrameProps,
  ChartLegendItem,
  ChartLegendProps,
  ChartTooltipProps,
} from "./chart";

export { CreditsMeter, ProjectStatusBadge, ProjectTile } from "./project-tile";
export type {
  CreditsMeterProps,
  ProjectStatusBadgeProps,
  ProjectTileProps,
} from "./project-tile";
