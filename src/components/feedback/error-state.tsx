import * as React from "react";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ErrorState: mensagem compreensível para pessoa não técnica.
 * Nunca exibe stack trace, código interno ou detalhes sensíveis.
 * O texto exibido é somente o `description` fornecido pelo consumidor.
 */
export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ title, description, retryLabel, onRetry, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        className={cn(
          "flex flex-col items-center justify-center rounded-[12px] border border-destructive/40 bg-destructive/10 p-6 text-center",
          className,
        )}
        {...props}
      >
        <XCircle aria-hidden className="h-8 w-8 text-destructive" />
        <h3 className="mt-3 text-base font-semibold text-destructive">{title}</h3>
        <p className="mt-1.5 max-w-md text-sm text-foreground">{description}</p>
        {retryLabel && onRetry ? (
          <Button type="button" variant="secondary" className="mt-4" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </div>
    );
  },
);
ErrorState.displayName = "ErrorState";
