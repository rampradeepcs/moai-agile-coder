"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/base/checkboxes/checkbox";
import { Pagination } from "@/components/application/pagination/pagination";

export type SortDirection = "asc" | "desc";

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  /** Enables the sort control. Requires `sortValue` to actually reorder. */
  sortable?: boolean;
  /** The comparable value behind the rendered cell. */
  sortValue?: (row: T) => string | number;
  align?: "left" | "center" | "right";
  /** Any CSS width, e.g. `"12rem"` or `"25%"`. */
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  /** Stable identity for each row — used for React keys and selection. */
  rowKey: (row: T) => string;
  caption?: React.ReactNode;
  /** Adds the leading checkbox column. */
  selectable?: boolean;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  /** Controlled sort. Omit to let the table sort itself. */
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSortChange?: (key: string, direction: SortDirection) => void;
  defaultSortKey?: string;
  defaultSortDirection?: SortDirection;
  /** Rows per page. Omit to render every row without pagination. */
  pageSize?: number;
  onRowClick?: (row: T) => void;
  /** Rendered in place of the table body when there are no rows. */
  emptyState?: React.ReactNode;
  className?: string;
}

const aligns = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function Table<T>({
  data,
  columns,
  rowKey,
  caption,
  selectable = false,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  sortKey,
  sortDirection,
  onSortChange,
  defaultSortKey,
  defaultSortDirection = "asc",
  pageSize,
  onRowClick,
  emptyState,
  className,
}: TableProps<T>) {
  /* ------------------------------------------------------------ selection */
  const [innerSelected, setInnerSelected] = React.useState<string[]>(
    defaultSelectedKeys ?? [],
  );
  const selected = selectedKeys ?? innerSelected;

  const commitSelection = (next: string[]) => {
    if (selectedKeys === undefined) setInnerSelected(next);
    onSelectionChange?.(next);
  };

  /* -------------------------------------------------------------- sorting */
  const [innerSort, setInnerSort] = React.useState<{
    key: string | null;
    direction: SortDirection;
  }>({ key: defaultSortKey ?? null, direction: defaultSortDirection });

  const isSortControlled = sortKey !== undefined;
  const activeSortKey = isSortControlled ? sortKey : innerSort.key;
  const activeSortDirection = isSortControlled
    ? (sortDirection ?? "asc")
    : innerSort.direction;

  const toggleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;
    const next: SortDirection =
      activeSortKey === column.key && activeSortDirection === "asc"
        ? "desc"
        : "asc";
    if (!isSortControlled) setInnerSort({ key: column.key, direction: next });
    onSortChange?.(column.key, next);
  };

  const sorted = React.useMemo(() => {
    const column = columns.find((c) => c.key === activeSortKey);
    // Controlled sorting means the parent already ordered `data` for us.
    if (!column?.sortValue || isSortControlled) return data;

    const factor = activeSortDirection === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const left = column.sortValue!(a);
      const right = column.sortValue!(b);
      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * factor;
      }
      return String(left).localeCompare(String(right)) * factor;
    });
  }, [data, columns, activeSortKey, activeSortDirection, isSortControlled]);

  /* ----------------------------------------------------------- pagination */
  const [page, setPage] = React.useState(1);
  const totalPages = pageSize ? Math.max(Math.ceil(sorted.length / pageSize), 1) : 1;

  // Clamp during render rather than in an effect: a shrinking dataset (say,
  // after filtering) would otherwise strand us on a page that no longer exists.
  const currentPage = Math.min(page, totalPages);

  const rows = React.useMemo(() => {
    if (!pageSize) return sorted;
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  /* ---------------------------------------------------- header checkbox */
  const pageKeys = rows.map(rowKey);
  const selectedOnPage = pageKeys.filter((key) => selected.includes(key));
  const headerChecked: boolean | "indeterminate" =
    pageKeys.length > 0 && selectedOnPage.length === pageKeys.length
      ? true
      : selectedOnPage.length > 0
        ? "indeterminate"
        : false;

  const toggleAll = () => {
    if (headerChecked === true) {
      commitSelection(selected.filter((key) => !pageKeys.includes(key)));
    } else {
      commitSelection([...new Set([...selected, ...pageKeys])]);
    }
  };

  const toggleRow = (key: string) => {
    commitSelection(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key],
    );
  };

  const columnCount = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="w-full overflow-x-auto rounded-xl border border-border-primary bg-bg-primary">
        <table className="w-full border-collapse text-sm">
          {caption && (
            <caption className="border-b border-border-secondary px-5 py-3 text-left text-sm text-fg-tertiary">
              {caption}
            </caption>
          )}

          <thead>
            <tr className="border-b border-border-secondary bg-bg-secondary">
              {selectable && (
                <th scope="col" className="w-12 px-5 py-3">
                  <Checkbox
                    size="sm"
                    checked={headerChecked}
                    onCheckedChange={toggleAll}
                    aria-label="Select all rows on this page"
                  />
                </th>
              )}

              {columns.map((column) => {
                const isActive = activeSortKey === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    aria-sort={
                      isActive
                        ? activeSortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : column.sortable
                          ? "none"
                          : undefined
                    }
                    className={cn(
                      "px-5 py-3 text-xs font-semibold whitespace-nowrap text-fg-tertiary",
                      aligns[column.align ?? "left"],
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column)}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1.5 rounded transition-colors hover:text-fg-secondary",
                          "focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none",
                          isActive && "text-fg-secondary",
                        )}
                      >
                        {column.header}
                        {isActive ? (
                          activeSortDirection === "asc" ? (
                            <ChevronUpIcon className="size-3.5" />
                          ) : (
                            <ChevronDownIcon className="size-3.5" />
                          )
                        ) : (
                          <ChevronsUpDownIcon className="size-3.5 opacity-60" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-5 py-0">
                  {emptyState ?? (
                    <p className="py-10 text-center text-sm text-fg-tertiary">
                      No results found.
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const key = rowKey(row);
                const isSelected = selected.includes(key);

                return (
                  <tr
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    data-state={isSelected ? "selected" : undefined}
                    className={cn(
                      "border-b border-border-secondary last:border-b-0 transition-colors",
                      isSelected ? "bg-bg-brand" : "hover:bg-bg-secondary",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {selectable && (
                      <td
                        className="px-5 py-3.5"
                        // Keep row-level click handlers from firing on the checkbox.
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Checkbox
                          size="sm"
                          checked={isSelected}
                          onCheckedChange={() => toggleRow(key)}
                          aria-label={`Select row ${key}`}
                        />
                      </td>
                    )}

                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-5 py-3.5 text-fg-secondary",
                          aligns[column.align ?? "left"],
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageSize && sorted.length > pageSize && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-4"
        />
      )}
    </div>
  );
}
