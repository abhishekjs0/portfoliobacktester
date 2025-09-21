export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Product roadmap & changelog</h1>
        <p className="mt-3 text-lg text-slate-300">
          Follow what shipped recently and what we’re building next. Updates sync automatically from our public roadmap.
        </p>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/10 shadow-xl">
        <iframe
          title="Portfolio Backtester roadmap"
          src="https://headwayapp.co/portfolio-backtester-roadmap"
          className="h-[700px] w-full border-0"
          loading="lazy"
        />
      </div>
      <p className="text-center text-sm text-slate-400">
        Have suggestions? <a className="text-brand" href="/feedback">Share feedback</a> — we review every note.
      </p>
    </div>
  );
}
