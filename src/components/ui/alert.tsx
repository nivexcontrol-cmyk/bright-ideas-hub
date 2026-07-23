import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * LV-01.2B.3 — Alertas canônicos do Nivex Control.
 *
 * Variantes públicas preservadas para compatibilidade: `default`, `destructive`.
 * Novas variantes semânticas: `info`, `success`, `warning`, `error`.
 *
 * Distinção estático x dinâmico:
 *   - `live="off"`: apenas conteúdo visual, sem região viva. Uso para
 *     exemplos estáticos já presentes no carregamento inicial da página.
 *   - `live="polite"`: `role="status"` + `aria-live="polite"`. Padrão para
 *     info/success/warning inseridos dinamicamente.
 *   - `live="assertive"`: `role="alert"` + `aria-live="assertive"`. Padrão
 *     para `destructive`/`error` inseridos dinamicamente.
 *
 * Cada variante nunca comunica somente pela cor: ícone e rótulo textual
 * acompanham o significado.
 */

const alertVariants = cva(
  "relative w-full rounded-[8px] border px-4 py-3 text-sm flex items-start gap-3",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-foreground",
        info: "border-info/40 bg-info/10 text-foreground",
        success: "border-success/40 bg-success/10 text-foreground",
        warning: "border-warning/40 bg-warning/10 text-foreground",
        error: "border-destructive/40 bg-destructive/10 text-foreground",
        destructive: "border-destructive/40 bg-destructive/10 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;
type LiveMode = "off" | "polite" | "assertive";

const ICONS: Record<AlertVariant, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  destructive: XCircle,
};

const ICON_COLORS: Record<AlertVariant, string> = {
  default: "text-foreground",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  destructive: "text-destructive",
};

const PREFIX: Record<AlertVariant, string> = {
  default: "Informação",
  info: "Informação",
  success: "Sucesso",
  warning: "Atenção",
  error: "Erro",
  destructive: "Erro",
};

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role">,
    VariantProps<typeof alertVariants> {
  /**
   * "off" para alertas estáticos exibidos no carregamento inicial.
   * "polite" ou "assertive" para alertas dinâmicos.
   * Padrão: assertive para destructive/error; polite nos demais.
   */
  live?: LiveMode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, live, children, ...props }, ref) => {
    const v: AlertVariant = variant ?? "default";
    const resolvedLive: LiveMode =
      live ?? (v === "destructive" || v === "error" ? "assertive" : "polite");

    const ariaProps =
      resolvedLive === "off"
        ? {}
        : {
            role: resolvedLive === "assertive" ? "alert" : "status",
            "aria-live": resolvedLive,
          };

    const Icon = ICONS[v];

    return (
      <div
        ref={ref}
        data-variant={v}
        data-live={resolvedLive}
        className={cn(alertVariants({ variant: v }), className)}
        {...ariaProps}
        {...props}
      >
        <Icon aria-hidden className={cn("mt-0.5 h-5 w-5 shrink-0", ICON_COLORS[v])} />
        <div className="min-w-0 flex-1">
          <span className="sr-only">{PREFIX[v]}: </span>
          {children}
        </div>
      </div>
    );
  },
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
