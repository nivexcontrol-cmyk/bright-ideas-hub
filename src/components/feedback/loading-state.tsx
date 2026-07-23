import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * LoadingState: skeletons com dimensões estáveis.
 * - aria-busy="true" na região.
 * - Anúncio discreto por aria-live="polite" com um rótulo curto.
 * - Reduz animação em prefers-reduced-motion (regra global já aplica).
 * - Não simula progresso falso: apenas indica "carregando".
 */
export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  rows?: number;
}

export const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ label = "Carregando conteúdo…", rows = 3, className, ...props }, ref) => {
    const items = Array.from({ length: Math.max(1, rows) });
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        aria-live="polite"
        className={cn(
          "rounded-[12px] border border-border bg-surface p-4 sm:p-6",
          className,
        )}
        {...props}
      >
        <span className="sr-only">{label}</span>
        <div className="space-y-3" aria-hidden="true">
          <div className="h-4 w-1/3 animate-pulse rounded-[8px] bg-primary/10" />
          {items.map((_, i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse rounded-[8px] bg-primary/10"
              style={{ width: `${100 - i * 8}%` }}
            />
          ))}
        </div>
      </div>
    );
  },
);
LoadingState.displayName = "LoadingState";
