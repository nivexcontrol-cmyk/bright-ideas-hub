import * as React from "react";
import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, actionLabel, onAction, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center rounded-[12px] border border-border bg-background p-6 text-center",
          className,
        )}
        {...props}
      >
        <Inbox aria-hidden className="h-8 w-8 text-secondary" />
        <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1.5 max-w-md text-sm text-foreground">{description}</p>
        {actionLabel && onAction ? (
          <Button type="button" variant="secondary" className="mt-4" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";
