import Link from "next/link";
import { faqItems, flows } from "@/lib/marketing-content";

const tradingViewSteps = [
  {
    title: "Open your strategy",
    description:
      "In TradingView, load the chart for the symbol you want to test, apply your strategy script, and open the Strategy Tester tab.",
  },
  {
    title: "Export the trade list",
    description:
      "Click the ••• menu in Strategy Tester, choose Export list of trades, and save the CSV to your computer.",
  },
  {
    title: "Repeat for each symbol",
    description:
      "Switch to the next ticker, run the same strategy and export again. Rename files so you can recognise the symbol at a glance.",
  },
];

const uploadSteps = [
  {
    title: "Gather your CSVs",
    description:
      "Once you have a CSV for every symbol, select up to 100 files at once. BacktestLab will merge them into a single portfolio run.",
  },
  {
    title: "Upload to BacktestLab",
    description:
      "Drag and drop the files into the uploader on the dashboard or click Choose file to browse manually. We&rsquo;ll validate formats instantly.",
  },
  {
    title: "Review the combined analytics",
    description:
      "Watch progress in real-time, then explore the equity curve, KPIs, trade breakdowns and comparison tools without leaving the browser.",
  },
];

export default function GuidePage() {
  return (
    <main className="landing-root">
      <section className="landing-section" aria-labelledby="guide-heading">
        <div className="landing-container guide-intro">
          <span className="hero__eyebrow">BacktestLab user guide</span>
          <h1 id="guide-heading" className="landing-section-title">From TradingView exports to portfolio insight</h1>
          <p className="guide-lede">
            Follow these steps to export Strategy Tester results for multiple symbols, upload up to 100 CSVs at once, and
            interpret the combined analytics with confidence.
          </p>
          <div className="guide-cta">
            <Link href="/signup" className="button button--primary">
              Create a free account
            </Link>
            <Link href="/#upload-panel" className="button button--ghost">
              Jump to uploader
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="tradingview-heading">
        <div className="landing-container">
          <h2 id="tradingview-heading" className="landing-section-title">Exporting from TradingView</h2>
          <p className="guide-description">
            Capture each symbol&rsquo;s trade history with the Strategy Tester. You&rsquo;ll reuse the exact CSV files inside BacktestLab—no code edits or data wrangling required.
          </p>
          <ol className="guide-steps">
            {tradingViewSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="upload-heading">
        <div className="landing-container">
          <h2 id="upload-heading" className="landing-section-title">Uploading to BacktestLab</h2>
          <p className="guide-description">
            Bring every symbol together in a single upload. BacktestLab keeps the workflow familiar while unlocking portfolio-level analytics instantly.
          </p>
          <ol className="guide-steps">
            {uploadSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="guide-note" role="note">
            <strong>Tip:</strong> Use consistent timeframes and position sizing in TradingView before exporting. It keeps your merged metrics honest and easy to compare.
          </div>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="flows-heading">
        <div className="landing-container">
          <h2 id="flows-heading" className="landing-section-title">What you&rsquo;ll accomplish</h2>
          <div className="flow-grid">
            {flows.map((flow) => (
              <article key={flow.id} className="flow-card">
                <span className="tag">{flow.title}</span>
                <p className="flow-card__description">{flow.description}</p>
                <ol className="flow-card__steps">
                  {flow.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="guide-faq-heading">
        <div className="landing-container">
          <h2 id="guide-faq-heading" className="landing-section-title">FAQ</h2>
          <div className="faq-grid">
            {faqItems.map((faq) => (
              <article key={faq.question} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
