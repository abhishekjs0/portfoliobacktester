import { useCallback, useRef, useState } from "react";
import type { ChangeEventHandler, DragEventHandler } from "react";
import clsx from "clsx";
import { Button } from "./Button";
import { VisuallyHidden } from "./VisuallyHidden";

export interface CSVUploadProps {
  label?: string;
  description?: string;
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSizeMb?: number;
}

export function CSVUpload({
  label = "Upload CSV",
  description = "Drag and drop a CSV or click to choose a file.",
  onFileSelect,
  accept = ".csv",
  maxSizeMb = 10,
}: CSVUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        return;
      }
      const file = files[0];
      if (accept) {
        const allowed = accept
          .split(",")
          .map((entry) => entry.trim().toLowerCase())
          .filter(Boolean);
        const matchesType = allowed.some((entry) => {
          if (entry.startsWith(".")) {
            return file.name.toLowerCase().endsWith(entry);
          }
          return file.type.toLowerCase() === entry;
        });
        if (!matchesType) {
          setError("Please choose a CSV file.");
          return;
        }
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`File must be smaller than ${maxSizeMb}MB.`);
        return;
      }
      setError(null);
      setFileName(file.name);
      onFileSelect?.(file);
    },
    [accept, maxSizeMb, onFileSelect]
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      handleFiles(event.target.files);
    },
    [handleFiles]
  );

  const handleDrop = useCallback<DragEventHandler<HTMLLabelElement>>(
    (event) => {
      event.preventDefault();
      setDragActive(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="csv-upload space-y-3">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        htmlFor="csv-upload-input"
        className={clsx(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center",
          dragActive
            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
        )}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        <p className="text-sm font-medium">{description}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Supports CSV files up to {maxSizeMb}MB.</p>
        <Button type="button" variant="secondary" className="mt-4" onClick={() => inputRef.current?.click()}>
          {label}
        </Button>
        <input
          ref={inputRef}
          id="csv-upload-input"
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleChange}
        />
      </label>
      {fileName ? (
        <p className="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
          Selected file: <span className="font-medium">{fileName}</span>
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-rose-600" role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
