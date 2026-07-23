import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableMobileCard } from "./data-table-mobile-card";
import type { DataTableProps, DataTableRowAction, SortDirection } from "./types";

export function DataTable<T>({
  caption,
  columns,
  data,
  getRowId,
  searchable = true,
  searchPlaceholder,
  rowActions,
  pageSize = 10,
  emptyState,
  testIdPrefix = "dt",
}: DataTableProps<T>) {
  const isMobile = useIsMobile();
  const reactId = React.useId();
  const searchInputId = `${testIdPrefix}-search-${reactId}`;

  const [query, setQuery] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);
  const [page, setPage] = React.useState(1);

  // Reset page ao mudar filtro/ordenação/dados
  React.useEffect(() => {
    setPage(1);
  }, [query, sortColumn, sortDir, data]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((row) =>
      columns.some((col) => String(col.accessor(row)).toLowerCase().includes(q)),
    );
  }, [data, query, columns]);

  const sorted = React.useMemo(() => {
    if (!sortColumn || !sortDir) return filtered;
    const col = columns.find((c) => c.id === sortColumn);
    if (!col) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = col.accessor(a);
      const vb = col.accessor(b);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, columns, sortColumn, sortDir]);

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const toggleSort = (colId: string) => {
    if (sortColumn !== colId) {
      setSortColumn(colId);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") {
      setSortDir("desc");
      return;
    }
    if (sortDir === "desc") {
      setSortColumn(null);
      setSortDir(null);
      return;
    }
    setSortDir("asc");
  };

  const ariaSort = (colId: string): "ascending" | "descending" | "none" => {
    if (sortColumn !== colId || !sortDir) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  };

  const showEmpty = total === 0;

  return (
    <div className="flex flex-col gap-3" data-testid={`${testIdPrefix}-root`}>
      {searchable ? (
        <DataTableToolbar
          value={query}
          onChange={setQuery}
          placeholder={searchPlaceholder}
          inputId={searchInputId}
          labelText="Buscar registros"
        />
      ) : null}

      {showEmpty ? (
        <div data-testid={`${testIdPrefix}-empty`}>{emptyState}</div>
      ) : isMobile ? (
        <ul className="flex flex-col gap-3" data-testid={`${testIdPrefix}-cards`}>
          {paged.map((row) => (
            <li key={getRowId(row)}>
              <DataTableMobileCard row={row} columns={columns} rowActions={rowActions} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-border bg-surface">
          <Table data-testid={`${testIdPrefix}-table`}>
            <caption className="sr-only">{caption}</caption>
            <TableHeader>
              <TableRow>
                {columns.map((col) => {
                  const sortable = col.sortable !== false;
                  const current = sortColumn === col.id ? sortDir : null;
                  const Icon =
                    current === "asc" ? ArrowUp : current === "desc" ? ArrowDown : ArrowUpDown;
                  return (
                    <TableHead
                      key={col.id}
                      aria-sort={sortable ? ariaSort(col.id) : undefined}
                      scope="col"
                      className="h-12 px-3"
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col.id)}
                          className={cn(
                            "inline-flex min-h-11 items-center gap-1.5 rounded-[8px] px-2 py-1",
                            "text-left text-sm font-semibold text-foreground hover:bg-muted",
                          )}
                          data-testid={`${testIdPrefix}-sort-${col.id}`}
                        >
                          <span>{col.header}</span>
                          <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-foreground" />
                          <span className="sr-only">
                            {current === "asc"
                              ? "ordenado de forma crescente"
                              : current === "desc"
                                ? "ordenado de forma decrescente"
                                : "não ordenado"}
                          </span>
                        </button>
                      ) : (
                        <span className="text-sm font-semibold text-foreground">{col.header}</span>
                      )}
                    </TableHead>
                  );
                })}
                {rowActions && rowActions.length > 0 ? (
                  <TableHead scope="col" className="h-12 px-3 text-right">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.id} className="px-3 py-3 text-sm text-foreground">
                      {col.cell ? col.cell(row) : String(col.accessor(row))}
                    </TableCell>
                  ))}
                  {rowActions && rowActions.length > 0 ? (
                    <TableCell className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        {rowActions.map((action: DataTableRowAction<T>) => (
                          <Button
                            key={action.id}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="min-h-11 min-w-11"
                            aria-label={action.label(row)}
                            onClick={() => action.onClick(row)}
                          >
                            {action.children}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!showEmpty ? (
        <DataTablePagination
          page={currentPage}
          pageCount={pageCount}
          total={total}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(pageCount, p + 1))}
        />
      ) : null}
    </div>
  );
}
