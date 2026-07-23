import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export interface DataTableToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputId: string;
  labelText: string;
}

export function DataTableToolbar({
  value,
  onChange,
  placeholder,
  inputId,
  labelText,
}: DataTableToolbarProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <label htmlFor={inputId} className="sr-only">
        {labelText}
      </label>
      <div className="relative w-full sm:max-w-xs">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground"
        />
        <Input
          id={inputId}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Buscar…"}
          className="pl-9"
        />
      </div>
    </div>
  );
}
