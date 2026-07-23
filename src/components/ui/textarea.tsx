import * as React from "react";

import { cn } from "@/lib/utils";

/*
 * Nivex Control — Textarea (LV-01.2B.2)
 * Altura mínima ampla; a área interativa cobre o próprio controle.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-24 w-full rounded-[8px] border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
