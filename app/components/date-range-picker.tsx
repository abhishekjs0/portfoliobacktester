"use client";

import { useState } from "react";
import { format } from "date-fns";
import { cn } from "../lib/utils";

interface DateRangePickerProps {
  onChange: (value: { start: Date | null; end: Date | null }) => void;
}

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        className="rounded-md border border-white/10 bg-slate-900/60 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        onChange={(event) => {
          const value = event.target.value ? new Date(event.target.value) : null;
          setStart(value);
          onChange({ start: value, end });
        }}
      />
      <span className="text-sm text-slate-400">to</span>
      <input
        type="date"
        className="rounded-md border border-white/10 bg-slate-900/60 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        onChange={(event) => {
          const value = event.target.value ? new Date(event.target.value) : null;
          setEnd(value);
          onChange({ start, end: value });
        }}
      />
      <div className="text-xs text-slate-400">
        {start ? format(start, "MMM d, yyyy") : "Start"} – {end ? format(end, "MMM d, yyyy") : "End"}
      </div>
    </div>
  );
}
