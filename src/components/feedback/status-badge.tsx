import * as React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * LV-01.2B.3 — StatusBadge: identificação visual de estados.
 * Nunca comunica somente pela cor: cor + ícone + texto sempre presentes.
 * Renderiza como <span>: não é interativo, não é botão.
 */

export type StatusTone = "info" | "success" | "warning" | "error";

const TONE_CLASSES: Record<StatusTone, string> = {
  info: "bg-info/10 text-info border-info/40",
  // Sucesso: mantém verde oficial na borda e no ícone, mas usa o token
  // oficial --foreground (#1f2937) no rótulo para garantir contraste ≥ 4,5:1
  // sobre o fundo #EAF2EA gerado por bg-success/10 (o par #2E7D32 sobre
  // #EAF2EA rende apenas 4,48:1).
  success: "bg-success/10 text-foreground border-success/40",
  warning: "bg-warning/10 text-foreground border-warning/40",
  error: "bg-destructive/10 text-destructive border-destructive/40",
};

const TONE_ICON: Record<
  StatusTone,
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

// Ícones mantêm a cor oficial da tonalidade mesmo quando o rótulo usa outro
// token (caso do sucesso, cujo texto usa --foreground para contraste AA).
const TONE_ICON_CLASSES: Record<StatusTone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

const TONE_PREFIX: Record<StatusTone, string> = {
  info: "Informação",
  success: "Sucesso",
  warning: "Atenção",
  error: "Erro",
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone: StatusTone;
  children: React.ReactNode;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ tone, children, className, ...props }, ref) => {
    const Icon = TONE_ICON[tone];
    return (
      <span
        ref={ref}
        data-tone={tone}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-[999px] border px-2.5 py-0.5 text-xs font-semibold",
          TONE_CLASSES[tone],
          className,
        )}
        {...props}
      >
        <Icon aria-hidden className={cn("h-3.5 w-3.5 shrink-0", TONE_ICON_CLASSES[tone])} />
        <span className="sr-only">{TONE_PREFIX[tone]}: </span>
        <span>{children}</span>
      </span>
    );
  },
);
StatusBadge.displayName = "StatusBadge";
