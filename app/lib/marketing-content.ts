export const keyBenefits = [
  {
    title: "Upload once, merge everything",
    description:
      "Drop Strategy Tester exports for every symbol and BacktestLab stitches them into a unified equity curve automatically.",
    icon: "merge",
    accent: "violet",
  },
  {
    title: "Workspace that mirrors TradingView",
    description:
      "Navigate overlays, trade tables, and KPI tiles in an interface inspired by TradingView—no new tooling to learn.",
    icon: "layout",
    accent: "blue",
  },
  {
    title: "Decision-ready analytics",
    description:
      "Scan CAGR, drawdown, hit rate, and volatility at a glance so the strongest strategy mix stands out instantly.",
    icon: "target",
    accent: "teal",
  },
  {
    title: "Iterate without spreadsheet chaos",
    description:
      "Duplicate runs, compare variations, and surface resilient blends without exporting a single CSV back to Excel.",
    icon: "loop",
    accent: "pink",
  },
];

export const faqItems = [
  {
    question: "Do I need to write Pine Script or code?",
    answer:
      "No. Export trades from TradingView's Strategy Tester and drop the CSV files into BacktestLab. We handle the rest.",
  },
  {
    question: "Can I upload more than one symbol at once?",
    answer:
      "Yes. Select up to 100 CSV exports in one go. We'll merge them into a single portfolio view automatically.",
  },
  {
    question: "What happens to my strategy data?",
    answer:
      "Your files stay private. Uploads are encrypted in transit and processed securely—nothing is shared without your consent.",
  },
  {
    question: "Why use BacktestLab over spreadsheets?",
    answer:
      "We recreate the TradingView workflow with portfolio analytics built in. No manual merging, pivot tables or chart wrangling required.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Absolutely. Start on the Free tier to test workflows with a few symbols, then upgrade only when you need more capacity.",
  },
  {
    question: "How large can my uploads be?",
    answer:
      "Each CSV can be up to 20MB and we comfortably handle hundreds of thousands of trades across years of history.",
  },
];

export const flows = [
  {
    id: "flow-1",
    title: "Get to your first portfolio result",
    description: "Go from signup to a combined equity curve in just a few minutes.",
    steps: [
      "Create a BacktestLab account and open the dashboard.",
      "Export Strategy Tester CSVs for each symbol you want to include.",
      "Upload up to 100 files together using the drag-and-drop modal.",
      "Review the merged equity curve, KPIs and trade list as soon as processing finishes.",
    ],
  },
  {
    id: "flow-2",
    title: "Compare strategies side by side",
    description: "Spot the strongest ideas by layering multiple backtests in one workspace.",
    steps: [
      "Select completed backtests from the list view with multi-select controls.",
      "Open the comparison workspace to stack equity curves and tables together.",
      "Sort metrics like Sharpe, drawdown or win rate to see what holds up.",
      "Decide which strategy to scale or iterate on next without leaving the page.",
    ],
  },
  {
    id: "flow-3",
    title: "Upgrade when you need more headroom",
    description: "Unlock pro tooling the moment you outgrow the Free tier limits.",
    steps: [
      "Preview plan benefits from in-app prompts or the pricing page.",
      "Check out securely with Stripe—no support tickets or delays.",
      "Return to the dashboard with confirmation and higher symbol limits.",
      "Access premium analytics such as unlimited uploads and advanced risk views.",
    ],
  },
];

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    badge: "Start here",
    description: "Test small portfolios with core analytics and demo data.",
    features: [
      "Up to 3 symbols per backtest",
      "Two concurrent uploads",
      "Portfolio KPIs and equity chart",
      "Email support within 48 hours",
    ],
  },
  {
    name: "Standard",
    price: "$19",
    cadence: "per month",
    badge: "Most popular",
    description: "Perfect for serious retail quants balancing speed and depth.",
    features: [
      "Up to 15 symbols per backtest",
      "Parameter snapshots & saved presets",
      "Comparison workspace",
      "Priority support with Slack community",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per month",
    badge: "For power users",
    description:
      "Unlimited scale, automation hooks and white-glove onboarding.",
    features: [
      "Unlimited symbols and history",
      "API access & webhook automations",
      "Advanced risk analytics (exposure, factor tilt)",
      "Same-day expert support",
    ],
  },
];

export const roadmapMilestones = [
  {
    quarter: "Week 1",
    title: "Requirements & Architecture",
    description:
      "Finalize technical design, set up repo, CI and data schemas for TradingView CSV ingestion.",
    status: "complete",
  },
  {
    quarter: "Week 4",
    title: "Backend Aggregation Engine",
    description:
      "Deliver the portfolio merge service that computes P&L, drawdown and metrics for uploaded CSV batches.",
    status: "in-progress",
  },
  {
    quarter: "Week 6",
    title: "Alpha Testing",
    description:
      "Invite early users to upload data, capture edge cases and harden parsing logic.",
    status: "up-next",
  },
  {
    quarter: "Week 9",
    title: "Marketing & Pricing Rollout",
    description:
      "Publish features and pricing pages, integrate analytics and prep for beta launch.",
    status: "planned",
  },
  {
    quarter: "Week 12",
    title: "Public Beta",
    description:
      "Scale beta invites, collect testimonials and monitor performance for wider release.",
    status: "planned",
  },
];
