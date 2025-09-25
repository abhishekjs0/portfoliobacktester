import Link from "next/link";

const marketingPages = [
  {
    href: "/",
    name: "Home",
    description:
      "Hero landing screen that introduces the portfolio backtesting workspace, highlights upload speeds, and showcases the TradingView-inspired UI.",
    highlights: [
      "Hero CTA leading to upload panel",
      "Platform stats and badges",
      "Workflow overview cards",
    ],
  },
  {
    href: "/features",
    name: "Features",
    description:
      "Detailed feature spotlight covering portfolio aggregation, equity analytics, and TradingView parity across the experience.",
    highlights: [
      "Multi-symbol strategy aggregation",
      "Portfolio KPIs and report parity",
      "Automation and collaboration callouts",
    ],
  },
  {
    href: "/markets",
    name: "Markets",
    description:
      "Marketing page that walks through the real-time market workspaces, data coverage, and broker integrations for active desks.",
    highlights: [
      "Hero CTA with demo layout",
      "Segmented coverage cards",
      "Integration spotlight grid",
    ],
  },
  {
    href: "/ideas",
    name: "Ideas",
    description:
      "Explains how traders can capture alpha in research notebooks, iterate on strategies, and collaborate on setups.",
    highlights: [
      "Notebook-style research hub",
      "Strategy comparison callouts",
      "Trading desk workflow timeline",
    ],
  },
  {
    href: "/scripts",
    name: "Scripts",
    description:
      "Showcases curated Pine Script templates, versioning, and code sharing for TradingView-based automation.",
    highlights: [
      "Script marketplace hero",
      "Community scorecards",
      "Version control highlights",
    ],
  },
  {
    href: "/screeners",
    name: "Screeners",
    description:
      "Product overview for customizable screening layouts that mirror TradingView filters with turbo-charged portfolio context.",
    highlights: [
      "Realtime filter configuration",
      "Saved screener panels",
      "Call-to-action for building watchlists",
    ],
  },
  {
    href: "/backtests",
    name: "Backtests",
    description:
      "Explains the multi-symbol backtesting engine, scheduling options, and analytics surfaced on the dashboard.",
    highlights: [
      "Comparison cards for manual vs automated",
      "Run scheduler callouts",
      "Performance insight stack",
    ],
  },
  {
    href: "/pricing",
    name: "Pricing",
    description:
      "Breaks down the subscription plans, quota differences, and add-ons for data, automation, and collaboration.",
    highlights: [
      "Plan comparison grid",
      "Usage meter explanations",
      "Enterprise inquiry CTA",
    ],
  },
  {
    href: "/roadmap",
    name: "Roadmap",
    description:
      "Public roadmap highlighting what is shipping next, recently launched capabilities, and community voting.",
    highlights: [
      "Now/Next/Later swimlanes",
      "Customer signal badges",
      "Feedback channel links",
    ],
  },
  {
    href: "/feedback",
    name: "Feedback",
    description:
      "Centralized form for customer interviews, feature requests, and support escalation with response-time expectations.",
    highlights: [
      "Segmented contact options",
      "Priority response commitments",
      "Links to roadmap and beta community",
    ],
  },
];

const productWorkflows = [
  {
    href: "/signup",
    name: "Signup",
    description:
      "Account creation form that opens the beta, capturing name, email, and password in a two-step onboarding flow.",
    highlights: [
      "Accessibility labels for every field",
      "Beta opt-in messaging",
      "Link through to login for existing members",
    ],
  },
  {
    href: "/login",
    name: "Login",
    description:
      "Authentication form for returning traders, supporting password entry and persistent demo sessions for exploration.",
    highlights: [
      "Password visibility toggle",
      "Demo session explainer",
      "Links to reset or create an account",
    ],
  },
  {
    href: "/dashboard",
    name: "Dashboard",
    description:
      "Authenticated workspace that mirrors TradingView KPIs, demo welcome banner, and empty states until CSVs are uploaded.",
    highlights: [
      "Welcome banner for new accounts",
      "Portfolio KPI placeholders",
      "Navigation into uploads and backtests",
    ],
  },
  {
    href: "/upload",
    name: "Upload",
    description:
      "CSV upload experience that accepts TradingView exports, summarises parsed files, and routes into the analysis workspace.",
    highlights: [
      "Drag-and-drop upload surface",
      "File summary preview",
      "Success toast leading to batch results",
    ],
  },
];

export const metadata = {
  title: "Product tour · Portfolio Backtester",
  description:
    "Preview every marketing and product workflow page in one curated tour so teams can understand the full Portfolio Backtester experience.",
};

export default function DemoPage() {
  return (
    <div className="marketing-page">
      <header className="marketing-hero">
        <div className="landing-container">
          <span className="landing-badge">Product walkthrough</span>
          <h1 className="marketing-hero__title">Explore every Portfolio Backtester page</h1>
          <p className="marketing-hero__sub">
            Jump straight into a curated tour of the marketing site, authenticated workspace, and onboarding flows. Each card below links directly to the live page so you can experience the interface hands-on.
          </p>
          <div className="marketing-hero__cta">
            <Link href="/signup" className="button button--primary">
              Join the beta
            </Link>
            <Link href="/upload" className="button button--outline">
              Try the CSV upload
            </Link>
          </div>
        </div>
      </header>

      <section className="marketing-section" aria-labelledby="marketing-tour">
        <div className="landing-container">
          <h2 id="marketing-tour" className="landing-section-title">
            Marketing site pages
          </h2>
          <p className="landing-section-sub">
            Everything prospects see before signing up. Browse storytelling, feature explainers, and pricing without hunting through navigation.
          </p>
          <div className="landing-grid" role="list">
            {marketingPages.map((page) => (
              <article key={page.href} className="landing-card" role="listitem">
                <h3>{page.name}</h3>
                <p>{page.description}</p>
                <ul className="landing-feature-list">
                  {page.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="landing-panel-cta">
                  <Link href={page.href} className="button button--ghost landing-btn">
                    Visit {page.name}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section" aria-labelledby="workflow-tour">
        <div className="landing-container">
          <h2 id="workflow-tour" className="landing-section-title">
            Authenticated workflows
          </h2>
          <p className="landing-section-sub">
            Review the end-to-end beta journey including signup, authentication, and the live dashboards traders use after importing CSVs.
          </p>
          <div className="landing-grid" role="list">
            {productWorkflows.map((page) => (
              <article key={page.href} className="landing-card" role="listitem">
                <h3>{page.name}</h3>
                <p>{page.description}</p>
                <ul className="landing-feature-list">
                  {page.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="landing-panel-cta">
                  <Link href={page.href} className="button button--ghost landing-btn">
                    Visit {page.name}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section" aria-labelledby="next-steps">
        <div className="landing-container">
          <h2 id="next-steps" className="landing-section-title">
            Next steps
          </h2>
          <div className="landing-feature">
            <div className="landing-panel">
              <h3 className="landing-panel-title">Need a guided run-through?</h3>
              <p>
                Share the <strong>/demo</strong> link with teammates or investors so they can experience every screen in minutes. Combine it with the end-to-end Playwright recording to demonstrate file uploads in motion.
              </p>
              <ul className="landing-feature-list">
                <li>Replay the CSV upload using the user-flow e2e test</li>
                <li>Bookmark key marketing pages for investor review</li>
                <li>Capture screenshots straight from this tour</li>
              </ul>
              <div className="landing-panel-cta">
                <Link href="/feedback" className="button button--primary landing-btn">
                  Request a guided session
                </Link>
              </div>
            </div>
            <div className="landing-panel">
              <h3 className="landing-panel-title">Share your impressions</h3>
              <p>
                The feedback form routes notes directly to the product team. Mention which pages resonated during the tour and any blockers you hit when exploring the dashboard or upload flow.
              </p>
              <ul className="landing-feature-list">
                <li>Tag improvements for onboarding and education</li>
                <li>Surface gaps in analytics depth or reporting</li>
                <li>Vote on roadmap items after finishing the tour</li>
              </ul>
              <div className="landing-panel-cta">
                <Link href="/roadmap" className="button button--outline landing-btn">
                  Vote on roadmap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
