"use client";


export default function UploadPage() {

  // ...existing code...
  const router = useRouter();
  const { plan } = usePlan();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUploadSelection = useCallback((fileList: FileList) => {
    const nextFiles = Array.from(fileList ?? []);
    setFiles(nextFiles);
    setSuccessMessage(null);
    if (nextFiles.length > 0) {
      trackEvent("csv_selection", { count: nextFiles.length });
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (files.length === 0) {
      setError("Select at least one CSV file.");
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
      </form>
    </div>
  );
}
