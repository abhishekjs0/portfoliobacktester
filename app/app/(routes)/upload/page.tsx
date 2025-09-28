
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import CSVUpload from "@/components/csv-upload";
import Button from "@/components/ui/button";
import { usePlan } from "@/lib/use-plan";
import { uploadFiles, trackEvent } from "@/lib/api";
import { completeChecklistStep } from "@/lib/checklist";

export default function UploadPage() {
  const router = useRouter();
  const { plan } = usePlan();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = useCallback((tone: "success" | "error", message: string) => {
    setToast({ tone, message });
  }, []);

  const validateFiles = useCallback((fileList: File[]): string | null => {
    if (!fileList.length) {
      return "Select at least one CSV file.";
    }

    const invalidFile = fileList.find((file) => !file.name.toLowerCase().endsWith(".csv"));
    if (invalidFile) {
      return "Invalid file format. Please upload TradingView Strategy Tester CSVs (max 20 MB).";
    }

    const oversizeFile = fileList.find((file) => file.size > 20 * 1024 * 1024);
    if (oversizeFile) {
      return "One or more files exceed 20 MB. Trim your exports and try again.";
    }

    return null;
  }, []);

  const handleUploadSelection = useCallback((fileList: FileList) => {
    const nextFiles = Array.from(fileList ?? []);
    const validationError = validateFiles(nextFiles);
    setSuccessMessage(null);
    if (validationError) {
      setFiles([]);
      setError(validationError);
      showToast("error", validationError);
      return;
    }
    setFiles(nextFiles);
    setError(null);
    if (nextFiles.length > 0) {
      trackEvent("csv_selection", { count: nextFiles.length });
    }
  }, [showToast, validateFiles]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      showToast("error", validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await uploadFiles(files);
      trackEvent("csv_upload_submitted", { files: files.length });
      setSuccessMessage(`Uploaded ${response.files.length} file${response.files.length === 1 ? "" : "s"} successfully.`);
      completeChecklistStep("upload-demo");
      setTimeout(() => {
        router.push(`/dashboard?batchId=${response.batchId}`);
      }, 600);
    } catch (err) {
      setError((err as Error).message);
      showToast("error", (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-6 rounded-lg border border-orange-500/40 bg-orange-500/10 p-4 text-sm text-orange-200">
        <strong>Compliance reminder:</strong> No TradingView scraping or automation. Upload your own exports only.
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white">Upload TradingView CSVs</h1>
      <p className="mt-2 text-slate-300">
        Files are parsed privately in your browser. Share summaries or raw CSVs only if you choose to.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <CSVUpload
          onUpload={handleUploadSelection}
          disabled={isSubmitting}
          description="StrategyName_Ticker_YYYY-MM-DD.csv · Columns must match TradingView’s “List of trades” format."
        />
        {isSubmitting && (
          <div className="relative h-2 overflow-hidden rounded-full bg-slate-800" role="status" aria-live="polite">
            <div className="absolute inset-y-0 left-0 w-1/3 animate-pulse rounded-full bg-brand/80" />
          </div>
        )}
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200" role="alert">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200" role="status">
            <p>{successMessage}</p>
            <p className="mt-1 text-xs text-emerald-100/80 sm:text-sm">
              Upload complete. Sign in to view combined results.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            {plan === "free"
              ? "Starter plan: Upload up to 3 CSVs per portfolio. Upgrade when you need more headroom."
              : "Trader & Quant Pro members can upload up to 100 CSVs per portfolio."}
          </p>
          <Button type="submit" disabled={isSubmitting || files.length === 0} isLoading={isSubmitting} className="w-full sm:w-auto">
            Upload & Continue
          </Button>
        </div>
      </form>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex min-w-[240px] items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.tone === "error"
              ? "border-red-500/50 bg-red-500/20 text-red-50"
              : "border-emerald-500/40 bg-emerald-500/15 text-emerald-50"
          }`}
          role={toast.tone === "error" ? "alert" : "status"}
        >
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${toast.tone === "error" ? "bg-red-400" : "bg-emerald-400"}`}
          />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
