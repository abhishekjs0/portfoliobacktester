"use client";

<<<<<<< HEAD
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFiles, shareParsedSummary, ParsedFileSummary } from "../../../lib/api";
import { computeSummaryStats } from "../../../lib/csvStats";
import { announce } from "../../../lib/announcer";

type WorkerResult = { rows: Array<Record<string, unknown>> };

const workerUrl = new URL("../../../workers/csvParserWorker.ts", import.meta.url);

function parseCsvFile(file: File, onProgress: (value: number) => void): Promise<WorkerResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerUrl, { type: "module" });
    worker.onmessage = (event: MessageEvent) => {
      const { type, data } = event.data as { type: string; data: unknown };
      if (type === "progress") {
        const progress = (data as { progress: number }).progress;
        onProgress(progress);
      } else if (type === "result") {
        worker.terminate();
        resolve(data as WorkerResult);
      } else if (type === "error") {
        worker.terminate();
        reject(new Error((data as { message: string }).message));
      }
    };
    worker.postMessage({ file });
  });
}
=======
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CSVUpload } from "../../../components/csv-upload";
import { Button } from "../../../components/ui/button";
import { uploadFiles } from "../../../lib/api";
import { trackEvent } from "../../../lib/analytics";
import { completeChecklistStep } from "../../../lib/checklist";
import { usePlan } from "../../../lib/use-plan";
>>>>>>> origin/main

export default function UploadPage() {
  const router = useRouter();
  const { plan } = usePlan();
  const [files, setFiles] = useState<File[]>([]);
  const [summaries, setSummaries] = useState<ParsedFileSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
<<<<<<< HEAD
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [allowRawUpload, setAllowRawUpload] = useState(false);
  const [shareSummary, setShareSummary] = useState(false);

  const totalFiles = files.length || 1;

  const parseFiles = useCallback(async (selected: File[]) => {
    if (selected.length === 0) {
      setSummaries([]);
      setParseProgress(0);
      return;
    }
    setIsParsing(true);
    setParseProgress(0);
    setSummaries([]);
    setError(null);
    const nextSummaries: ParsedFileSummary[] = [];
    for (let index = 0; index < selected.length; index += 1) {
      const file = selected[index];
      try {
        const result = await parseCsvFile(file, (progress) => {
          const weighted = ((index + progress) / selected.length) * 100;
          setParseProgress(Math.round(weighted));
        });
        const stats = computeSummaryStats(result.rows);
        nextSummaries.push({
          fileName: file.name,
          sampleCount: stats.sampleCount,
          meanReturn: stats.meanReturn,
          sharpeRatio: stats.sharpeRatio,
          maxDrawdown: stats.maxDrawdown,
          priceColumn: stats.priceColumn,
        });
      } catch (err) {
        const message = `Unable to parse ${file.name}: ${(err as Error).message}`;
        setError(message);
        announce(message);
        setIsParsing(false);
        return;
      }
    }
    setSummaries(nextSummaries);
    setIsParsing(false);
    setParseProgress(100);
    setStatus(`Parsed ${nextSummaries.length} file${nextSummaries.length === 1 ? "" : "s"} locally.`);
    announce(`Parsed ${nextSummaries.length} file${nextSummaries.length === 1 ? "" : "s"} locally.`);
  }, []);

  const handleFileSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const list = event.target.files;
      if (!list) return;
      const nextFiles = Array.from(list).slice(0, 100);
      setFiles(nextFiles);
      setStatus(null);
      void parseFiles(nextFiles);
    },
    [parseFiles],
  );
=======
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUploadSelection = useCallback((fileList: FileList) => {
    const nextFiles = Array.from(fileList ?? []);
    setFiles(nextFiles);
    setSuccessMessage(null);
    if (nextFiles.length > 0) {
      trackEvent("csv_selection", { count: nextFiles.length });
    }
  }, []);
>>>>>>> origin/main

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);
    if (files.length === 0) {
      const message = "Select at least one CSV file.";
      setError(message);
      announce(message);
      return;
    }

    if (!allowRawUpload) {
      const message = "Client-side metrics computed. Raw CSVs were not uploaded.";
      setStatus(message);
      announce(message);
      if (shareSummary && summaries.length > 0) {
        try {
          await shareParsedSummary(summaries);
        } catch (err) {
          console.debug("summary upload skipped", err);
        }
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await uploadFiles(files);
<<<<<<< HEAD
      if (shareSummary && summaries.length > 0) {
        try {
          await shareParsedSummary(summaries);
        } catch (err) {
          console.debug("summary upload skipped", err);
        }
      }
      const message = "Upload complete. Redirecting to dashboard.";
      setStatus(message);
      announce(message);
      router.push(`/dashboard?batchId=${response.batchId}`);
=======
      trackEvent("csv_upload_submitted", { files: files.length });
      setSuccessMessage(`Uploaded ${response.files.length} file${response.files.length === 1 ? "" : "s"} successfully.`);
      completeChecklistStep("upload-demo");
      setTimeout(() => {
        router.push(`/dashboard?batchId=${response.batchId}`);
      }, 600);
>>>>>>> origin/main
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      announce(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const summaryTotals = useMemo(() => {
    if (summaries.length === 0) return null;
    const mean = summaries.reduce((sum, item) => sum + item.meanReturn, 0) / summaries.length;
    const sharpe = summaries.reduce((sum, item) => sum + item.sharpeRatio, 0) / summaries.length;
    const maxDrawdown = summaries.reduce((acc, item) => Math.min(acc, item.maxDrawdown), 0);
    return { mean, sharpe, maxDrawdown };
  }, [summaries]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-6 rounded-lg border border-orange-500/40 bg-orange-500/10 p-4 text-sm text-orange-200">
        <strong>Compliance reminder:</strong> No TradingView scraping or automation. Upload your own exports only.
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white">Upload TradingView CSVs</h1>
      <p className="mt-2 text-slate-300">
        Files are parsed privately in your browser. Share summaries or raw CSVs only if you choose to.
      </p>
<<<<<<< HEAD
      <form onSubmit={handleSubmit} className="mt-8 space-y-6" aria-describedby="upload-help">
        <label
          htmlFor="csv-upload"
          className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-900/60 p-6 text-center text-slate-300 hover:border-brand"
        >
          <input
            id="csv-upload"
            type="file"
            multiple
            accept=".csv"
            className="hidden"
            onChange={handleFileSelection}
            aria-describedby="upload-help"
          />
          <span className="text-lg font-semibold text-white">Select TradingView exports</span>
          <span className="mt-2 text-sm text-slate-400" id="upload-help">
            StrategyName_Ticker_YYYY-MM-DD.csv · Columns must match TradingView’s “List of trades” format.
          </span>
          {files.length > 0 && (
            <span className="mt-3 text-sm text-brand" aria-live="polite">
              {files.length} file{files.length > 1 ? "s" : ""} ready for analysis
            </span>
          )}
        </label>

        {isParsing && (
          <div role="status" aria-live="polite" className="rounded-lg border border-white/10 bg-slate-900/70 p-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${parseProgress}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Parsing file {Math.ceil((parseProgress / 100) * totalFiles)} of {totalFiles}…
            </p>
          </div>
        )}

        {error && <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
        {status && !error && (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">{status}</div>
        )}

        <fieldset className="rounded-xl border border-white/10 bg-slate-900/60 p-4" aria-describedby="privacy-note">
          <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-200">Privacy controls</legend>
          <p id="privacy-note" className="text-sm text-slate-400">
            Raw CSVs stay on your device unless you opt to upload. Summaries include only aggregated metrics.
          </p>
          <div className="mt-4 space-y-3">
            <label className="flex items-start gap-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={allowRawUpload}
                onChange={(event) => setAllowRawUpload(event.target.checked)}
              />
              <span>Upload raw CSVs to the server to run portfolio backtests.</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={shareSummary}
                onChange={(event) => setShareSummary(event.target.checked)}
                disabled={summaries.length === 0}
              />
              <span>Send anonymised summary metrics to improve recommendations.</span>
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting || files.length === 0 || (allowRawUpload && isParsing)}
          className="w-full rounded-full bg-brand px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-700"
          data-analytics-event="upload_submit"
        >
          {allowRawUpload ? (isSubmitting ? "Uploading…" : "Upload & Continue") : "Save local analysis"}
        </button>
=======
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <CSVUpload
          onUpload={handleUploadSelection}
          disabled={isSubmitting}
          description="StrategyName_Ticker_YYYY-MM-DD.csv · Columns must match TradingView’s “List of trades” format."
        />
        {error && <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
        {successMessage && (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200" role="status">
            {successMessage}
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            {plan === "free"
              ? "Free plan: Upload up to 5 CSVs per batch. Upgrade for larger portfolios."
              : "Pro tip: Upload up to 100 CSVs per batch on paid plans."}
          </p>
          <Button type="submit" disabled={isSubmitting || files.length === 0} isLoading={isSubmitting} className="w-full sm:w-auto">
            Upload & Continue
          </Button>
        </div>
>>>>>>> origin/main
      </form>

      {summaries.length > 0 && (
        <section className="mt-10 space-y-4" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-2xl font-semibold text-white">
            Local summary statistics
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
              <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    File
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Samples
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Mean return
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Sharpe ratio
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Max drawdown
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Price column
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-900/40">
                {summaries.map((summary) => (
                  <tr key={summary.fileName}>
                    <th scope="row" className="px-4 py-3 font-medium text-white">
                      {summary.fileName}
                    </th>
                    <td className="px-4 py-3">{summary.sampleCount.toLocaleString()}</td>
                    <td className="px-4 py-3">{(summary.meanReturn * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3">{summary.sharpeRatio.toFixed(2)}</td>
                    <td className="px-4 py-3">{(summary.maxDrawdown * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3">{summary.priceColumn ?? "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {summaryTotals && (
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white">Averages across selected files</p>
              <ul className="mt-2 space-y-1">
                <li>Mean return: {(summaryTotals.mean * 100).toFixed(2)}%</li>
                <li>Sharpe ratio: {summaryTotals.sharpe.toFixed(2)}</li>
                <li>Worst drawdown: {(summaryTotals.maxDrawdown * 100).toFixed(2)}%</li>
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
