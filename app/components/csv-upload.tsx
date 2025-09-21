"use client";

import { useId, useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "./ui/button";

export interface CSVUploadProps {
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  onUpload: (files: FileList) => void;
  disabled?: boolean;
  className?: string;
}

export function CSVUpload({
  label = "Select TradingView exports",
  description = "StrategyName_Ticker_YYYY-MM-DD.csv · Columns must match TradingView’s \"List of trades\" format.",
  accept = ".csv",
  multiple = true,
  onUpload,
  disabled = false,
  className,
}: CSVUploadProps) {
  const inputId = useId();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const fileSummary = useMemo(() => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return null;
    }
    const names = Array.from(selectedFiles)
      .slice(0, 3)
      .map((file) => file.name)
      .join(", ");
    const remaining = selectedFiles.length - 3;
    return remaining > 0 ? `${names} +${remaining} more` : names;
  }, [selectedFiles]);

  return (
    <div className={clsx("space-y-3", className)}>
      <label
        htmlFor={inputId}
        className={clsx(
          "flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-900/60 p-6 text-center text-slate-300 transition",
          disabled ? "opacity-60" : "hover:border-brand"
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            const files = event.target.files;
            setSelectedFiles(files);
            if (files && files.length > 0) {
              onUpload(files);
            }
          }}
        />
        <span className="text-lg font-semibold text-white">{label}</span>
        <span className="mt-2 text-sm text-slate-400">{description}</span>
        {selectedFiles && selectedFiles.length > 0 && (
          <span className="mt-3 text-sm text-brand" data-testid="file-summary">
            {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} ready
            {fileSummary ? ` – ${fileSummary}` : ""}
          </span>
        )}
      </label>
      <div className="flex justify-end">
        <Button
          type="button"
          disabled={!selectedFiles || selectedFiles.length === 0 || disabled}
          onClick={() => {
            if (selectedFiles && selectedFiles.length > 0) {
              onUpload(selectedFiles);
            }
          }}
          variant="secondary"
        >
          Confirm selection
        </Button>
      </div>
    </div>
  );
}
