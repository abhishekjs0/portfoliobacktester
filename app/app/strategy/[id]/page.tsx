import Link from "next/link";

export default function StrategyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 text-slate-200">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Portfolio result</span>
        <h1 className="mt-4 text-3xl font-bold text-white">Run not found</h1>
        <p className="mt-3 text-sm text-slate-300">
          We couldn’t locate a saved portfolio run with the ID <span className="font-mono text-white/80">{params.id}</span>.
          If you just uploaded CSVs, give the processing a moment and refresh. Otherwise, start a fresh upload below.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/backtests"
            className="rounded-full border border-white/15 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-brand hover:text-brand"
          >
            ← Back to backtests
          </Link>
          <Link
            href="/upload"
            className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark"
          >
            Upload CSVs
          </Link>
        </div>
      </div>
    </div>
  );
}
