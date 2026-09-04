/**
 * WizKraft design system — public surface.
 *
 * Deep imports are the documented path and stay tree-shake friendly:
 *   import { Button } from "@/components/base/buttons/button";
 *   import { Table }  from "@/components/application/table/table";
 *
 * This barrel is the convenience alternative for call sites pulling in several
 * components at once. Tokens live in `tailwind.preset.ts` at the repo root.
 */

/* ------------------------------------------------------------------ base */
export { Button } from "./base/buttons/button";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./base/buttons/button";

export { Input } from "./base/inputs/input";
export type { InputProps, InputSize } from "./base/inputs/input";

export { Textarea } from "./base/textareas/textarea";
export type { TextareaProps } from "./base/textareas/textarea";

export { Select } from "./base/selects/select";
export type {
  SelectMultiProps,
  SelectOption,
  SelectProps,
  SelectSingleProps,
  SelectSize,
} from "./base/selects/select";

export { Checkbox } from "./base/checkboxes/checkbox";
export type { CheckboxProps, CheckboxSize } from "./base/checkboxes/checkbox";

export { Radio, RadioGroup } from "./base/radios/radio";
export type {
  RadioGroupProps,
  RadioProps,
  RadioSize,
  RadioVariant,
} from "./base/radios/radio";

export { Toggle } from "./base/toggles/toggle";
export type { ToggleProps, ToggleSize } from "./base/toggles/toggle";

export { Badge } from "./base/badges/badge";
export type { BadgeColor, BadgeProps, BadgeSize } from "./base/badges/badge";

export { Avatar, AvatarGroup } from "./base/avatars/avatar";
export type {
  AvatarGroupProps,
  AvatarProps,
  AvatarSize,
  AvatarStatus,
} from "./base/avatars/avatar";

export { Tooltip, TooltipProvider } from "./base/tooltips/tooltip";
export type { TooltipProps, TooltipSide } from "./base/tooltips/tooltip";

export { OtpInput } from "./base/otp/otp-input";
export type { OtpInputProps } from "./base/otp/otp-input";

export { OptionRow } from "./base/option-rows/option-row";
export type { OptionRowProps } from "./base/option-rows/option-row";

export { Tag } from "./base/tags/tag";
export type { TagProps, TagSize } from "./base/tags/tag";

/* ----------------------------------------------------------- application */
export { Dropdown } from "./application/dropdown/dropdown";
export type {
  DropdownItem,
  DropdownProps,
  DropdownSection,
} from "./application/dropdown/dropdown";

export { Modal, ModalClose } from "./application/modal/modal";
export type { ModalProps, ModalSize } from "./application/modal/modal";

export { Table } from "./application/table/table";
export type { SortDirection, TableColumn, TableProps } from "./application/table/table";

export { Tabs } from "./application/tabs/tabs";
export type { TabItem, TabsProps, TabsSize, TabsVariant } from "./application/tabs/tabs";

export { Pagination } from "./application/pagination/pagination";
export type {
  PaginationProps,
  PaginationVariant,
} from "./application/pagination/pagination";

export { EmptyState } from "./application/empty-state/empty-state";
export type {
  EmptyStateProps,
  EmptyStateSize,
} from "./application/empty-state/empty-state";

export { DatePicker } from "./application/date-picker/date-picker";
export type {
  DatePickerProps,
  DatePickerRangeProps,
  DatePickerSingleProps,
  DatePickerSize,
} from "./application/date-picker/date-picker";

export { FileUpload, formatFileSize } from "./application/file-upload/file-upload";
export type {
  FileUploadProps,
  FileUploadVariant,
  UploadedFile,
} from "./application/file-upload/file-upload";

export { Notification, toast } from "./application/toast/toast";
export type {
  NotificationProps,
  NotificationType,
  ToastOptions,
} from "./application/toast/toast";

export { Drawer, DrawerClose } from "./application/drawer/drawer";
export type { DrawerProps, DrawerSide, DrawerSize } from "./application/drawer/drawer";

export { Stepper } from "./application/stepper/stepper";
export type { StepperProps } from "./application/stepper/stepper";

export { Progress, ProgressCircle } from "./application/progress/progress";
export type {
  ProgressCircleProps,
  ProgressColor,
  ProgressLabelPosition,
  ProgressProps,
  ProgressSize,
} from "./application/progress/progress";
