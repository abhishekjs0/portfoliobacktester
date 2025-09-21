"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFiles } from "../../../lib/api";

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await uploadFiles(files);
      router.push(`/dashboard?batchId=${response.batchId}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-6 rounded-lg border border-orange-500/40 bg-orange-500/10 p-4 text-sm text-orange-200">
        <strong>Compliance reminder:</strong> No TradingView scraping or
        automation. Upload your own exports only.
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white">
        Upload TradingView CSVs
      </h1>
      <p className="mt-2 text-slate-300">
        Drop up to 100 “List of trades” CSV exports to backtest an equal-capital
        multi-symbol portfolio in seconds.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-900/60 p-6 text-center text-slate-300 hover:border-brand">
          <input
            type="file"
            multiple
            accept=".csv"
            className="hidden"
            onChange={(event) => {
              const nextFiles = Array.from(event.target.files ?? []);
              setFiles(nextFiles);
            }}
          />
          <span className="text-lg font-semibold text-white">
            Select TradingView exports
          </span>
          <span className="mt-2 text-sm text-slate-400">
            StrategyName_Ticker_YYYY-MM-DD.csv · Columns must match
            TradingView’s “List of trades” format.
          </span>
          {files.length > 0 && (
            <span className="mt-3 text-sm text-brand">
              {files.length} file{files.length > 1 ? "s" : ""} ready
            </span>
          )}
        </label>
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting || files.length === 0}
          className="w-full rounded-full bg-brand px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isSubmitting ? "Uploading…" : "Upload & Continue"}
        </button>
      </form>
    </div>
  );
}
