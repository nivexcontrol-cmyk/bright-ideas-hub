import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface DataTablePaginationProps {
  page: number;
  pageCount: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export function DataTablePagination({
  page,
  pageCount,
  total,
  onPrev,
  onNext,
}: DataTablePaginationProps) {
  const displayPage = pageCount === 0 ? 0 : page;
  const displayCount = pageCount;
  return (
    <nav
      aria-label="Paginação"
      className="flex flex-col items-start justify-between gap-2 pt-2 sm:flex-row sm:items-center"
    >
      <p className="text-sm text-foreground" data-testid="dt-pagination-info">
        {total} {total === 1 ? "registro" : "registros"} — página {displayPage} de {displayCount}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Página anterior"
          onClick={onPrev}
          disabled={page <= 1}
          data-testid="dt-prev"
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Próxima página"
          onClick={onNext}
          disabled={page >= pageCount || pageCount === 0}
          data-testid="dt-next"
        >
          <ChevronRight aria-hidden className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
