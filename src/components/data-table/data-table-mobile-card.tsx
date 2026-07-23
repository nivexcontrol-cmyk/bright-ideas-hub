import * as React from "react";

import { Button } from "@/components/ui/button";
import type { DataTableColumn, DataTableRowAction } from "./types";

export interface DataTableMobileCardProps<T> {
  row: T;
  columns: DataTableColumn<T>[];
  rowActions?: DataTableRowAction<T>[];
}

export function DataTableMobileCard<T>({
  row,
  columns,
  rowActions,
}: DataTableMobileCardProps<T>) {
  return (
    <article className="rounded-[12px] border border-border bg-surface p-4 shadow-sm">
      <dl className="grid grid-cols-1 gap-2">
        {columns.map((col) => (
          <div
            key={col.id}
            className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-baseline gap-3"
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-foreground">
              {col.mobileLabel ?? col.header}
            </dt>
            <dd className="text-sm text-foreground">
              {col.cell ? col.cell(row) : String(col.accessor(row))}
            </dd>
          </div>
        ))}
      </dl>
      {rowActions && rowActions.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {rowActions.map((action) => (
            <Button
              key={action.id}
              type="button"
              variant="secondary"
              className="min-h-12 min-w-12"
              aria-label={action.label(row)}
              onClick={() => action.onClick(row)}
            >
              {action.children}
            </Button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
