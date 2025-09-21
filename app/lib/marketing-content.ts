export const keyBenefits = [
  {
    title: "Save Hours Every Week",
    description:
      "Automate the tedious export-and-merge workflow. Traders report reclaiming two hours a day compared with spreadsheets.",
  },
  {
    title: "Boost Strategy Confidence",
    description:
      "Understand how each symbol contributes to portfolio risk and return so you can deploy capital with conviction.",
  },
  {
    title: "No Code, No Hassle",
    description:
      "Import TradingView CSVs and receive portfolio analytics instantly. If you know TradingView, you already know how to use this.",
  },
  {
    title: "Insightful Metrics at a Glance",
    description:
      "Review portfolio CAGR, max drawdown, Sharpe, correlation and more without leaving the browser.",
  },
];

export const faqItems = [
  {
    question: "Will this work without Pine Script?",
    answer:
      "Yes. Upload the trade CSVs generated from TradingView or any other platform. We analyse raw trade data—no Pine execution required.",
  },
  {
    question: "Do I need to be a programmer?",
    answer:
      "No coding skills are needed. The workflow mirrors TradingView's Strategy Tester with a guided upload wizard and interactive dashboards.",
  },
  {
    question: "Is my strategy data safe?",
    answer:
      "All uploads are encrypted in transit and at rest. You stay in control of your data, and you can opt for client-side only processing if preferred.",
  },
  {
    question: "How is this different from other backtest platforms?",
    answer:
      "We focus on TradingView power-users. Instead of rewriting strategies in another language, simply reuse your existing exports and get portfolio-ready analytics.",
  },
  {
    question: "Is there a free version?",
    answer:
      "Yes. The Free tier supports up to three symbols per backtest. Upgrade to unlock unlimited symbols, longer history and advanced comparison reports.",
  },
  {
    question: "How much data can it handle?",
    answer:
      "Our compute pipeline comfortably processes hundreds of thousands of trades. Even ten years of data across 50 symbols completes in seconds.",
  },
];

export const flows = [
  {
    id: "flow-1",
    title: "Flow 1: Onboarding to First Portfolio Result",
    description:
      "Guide new users from signup to their first combined equity curve with an empty state, CSV upload modal and automated aggregation.",
    steps: [
      "Create an account and land on the dashboard with an empty state call-to-action.",
      "Upload multiple TradingView CSVs via the guided modal with validation feedback.",
      "Watch the processing status update in real-time as the backend merges trades.",
      "Review the aggregated equity curve, KPIs and trade list once the run completes.",
    ],
  },
  {
    id: "flow-2",
    title: "Flow 2: Compare Strategies Across Symbols",
    description:
      "Enable power-users to evaluate multiple runs at once, selecting backtests and viewing overlayed metrics and equity curves.",
    steps: [
      "Pick completed backtests from the list view using multi-select controls.",
      "Open the comparison workspace to see equity curves stacked together.",
      "Sort metrics by Sharpe, drawdown or hit-rate to spot the most resilient mix.",
      "Decide which strategy to iterate on next or duplicate configurations for re-runs.",
    ],
  },
  {
    id: "flow-3",
    title: "Flow 3: Subscribe and Unlock Pro Features",
    description:
      "Upgrade paths surface when users hit Free tier limits, leading into a secure Stripe checkout and instant plan activation.",
    steps: [
      "Preview plan benefits from the pricing page or in-app upgrade prompts.",
      "Launch Stripe Checkout with prefilled plan metadata for a smooth payment experience.",
      "Return to the dashboard with confirmation messaging and increased symbol limits.",
      "Access premium capabilities such as unlimited uploads and advanced analytics.",
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
