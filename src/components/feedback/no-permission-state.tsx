import * as React from "react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * NoPermissionState: mensagem neutra.
 * Não revela nomes de recursos protegidos, IDs, quantidades ou informações
 * que o usuário não poderia acessar. O título e a descrição são fixos:
 * o consumidor não pode injetar texto que exponha conteúdo protegido.
 */
export interface NoPermissionStateProps extends React.HTMLAttributes<HTMLDivElement> {
  actionLabel?: string;
  onAction?: () => void;
}

export const NoPermissionState = React.forwardRef<HTMLDivElement, NoPermissionStateProps>(
  ({ actionLabel, onAction, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center rounded-[12px] border border-border bg-background p-6 text-center",
          className,
        )}
        {...props}
      >
        <Lock aria-hidden className="h-8 w-8 text-secondary" />
        <h3 className="mt-3 text-base font-semibold text-foreground">Acesso indisponível</h3>
        <p className="mt-1.5 max-w-md text-sm text-foreground">
          Você não tem permissão para visualizar este conteúdo. Entre em contato com o responsável
          pela sua unidade se precisar de acesso.
        </p>
        {actionLabel && onAction ? (
          <Button type="button" variant="secondary" className="mt-4" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    );
  },
);
NoPermissionState.displayName = "NoPermissionState";
