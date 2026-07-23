import * as React from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/*
 * Nivex Control — FormField (LV-01.2B.2)
 *
 * Componente reutilizável que organiza rótulo persistente, controle,
 * descrição neutra e mensagem de erro. Cada FormField associa um único
 * label a um único controle e provê identificadores estáveis para
 * `aria-describedby`, além de `aria-invalid` quando `error` está presente.
 *
 * O erro é indicado por texto e ícone (AlertCircle), nunca apenas por cor,
 * e é anunciado via `role="alert"`. A descrição neutra é apenas visual.
 */

type Slots = {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
};

export interface FormFieldProps {
  id?: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  children: (slots: Slots) => React.ReactNode;
}

export function FormField({
  id: idProp,
  label,
  description,
  error,
  required,
  className,
  labelClassName,
  children,
}: FormFieldProps) {
  const generatedId = React.useId();
  const id = idProp ?? `ff-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(error);

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-sm font-medium text-foreground", labelClassName)}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-destructive">
            *
          </span>
        ) : null}
      </label>
      {children({ id, describedBy, invalid })}
      {description ? (
        <p id={descriptionId} className="text-xs text-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs font-medium text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
