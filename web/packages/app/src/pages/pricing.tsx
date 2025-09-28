import { useState } from "react";
import clsx from "clsx";
import { Button, Card } from "@backtester/ui";

type BillingCycle = "monthly" | "annual";

type PlanFeature = {
  label: string;
  included: boolean;
  locked?: boolean;
};

type Plan = {
  id: "starter" | "trader" | "quant-pro";
  name: string;
  tagline: string;
  monthlyPrice: number;
  cta: string;
  priceNote: string;
  highlighted?: boolean;
  features: PlanFeature[];
};

const ANNUAL_DISCOUNT = 0.15;

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For validating single strategies",
    monthlyPrice: 0,
    cta: "Get started free",
    priceNote: "No credit card required",
    features: [
      { label: "Up to 3 CSV uploads per portfolio", included: true },
      { label: "3 backtest runs per day", included: true },
      { label: "Email support", included: true },
      { label: "Risk ratios & correlations", included: false, locked: true },
    ],
  },
  {
    id: "trader",
    name: "Trader",
    tagline: "For growing multi-symbol setups",
    monthlyPrice: 9,
    cta: "Choose Trader",
    priceNote: "Cancel anytime",
    highlighted: true,
    features: [
      { label: "Up to 20 CSV uploads per portfolio", included: true },
      { label: "50 backtest runs per day", included: true },
      { label: "Risk ratios & correlations", included: true },
      { label: "Priority support", included: true },
    ],
  },
  {
    id: "quant-pro",
    name: "Quant Pro",
    tagline: "For desks running daily portfolios",
    monthlyPrice: 29,
    cta: "Choose Quant Pro",
    priceNote: "Cancel anytime",
    features: [
      { label: "Up to 100 CSV uploads per portfolio", included: true },
      { label: "250 backtest runs per day", included: true },
      { label: "Risk ratios & correlations", included: true },
      { label: "Portfolio report export (PDF & CSV)", included: true },
      { label: "Priority support with SLA", included: true },
    ],
  },
];

const comparisonRows = [
  {
    label: "CSV uploads per portfolio",
    values: { starter: "3", trader: "20", "quant-pro": "100" },
  },
  {
    label: "Backtest runs per day",
    values: { starter: "3", trader: "50", "quant-pro": "250" },
  },
  {
    label: "Risk ratios & correlations",
    values: { starter: "—", trader: "Included", "quant-pro": "Included" },
  },
  {
    label: "Portfolio report export",
    values: { starter: "—", trader: "—", "quant-pro": "PDF & CSV" },
  },
  {
    label: "Support",
    values: { starter: "Email", trader: "Priority", "quant-pro": "Priority + SLA" },
  },
];

function formatCurrency(amount: number) {
  if (amount === 0) {
    return "$0";
  }
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
}

function getPriceDetails(plan: Plan, billing: BillingCycle) {
  if (plan.monthlyPrice === 0) {
    return {
      price: "$0",
      suffix: "per month",
      strikePrice: undefined,
      billingNote: "",
    };
  }

  if (billing === "monthly") {
    return {
      price: `${formatCurrency(plan.monthlyPrice)}`,
      suffix: "per month",
      strikePrice: undefined,
      billingNote: "Billed monthly",
    };
  }

  const discountedMonthly = plan.monthlyPrice * (1 - ANNUAL_DISCOUNT);
  const annualTotal = discountedMonthly * 12;

  return {
    price: `${formatCurrency(Number(discountedMonthly.toFixed(2)))}`,
    suffix: "per month, billed annually",
    strikePrice: `${formatCurrency(plan.monthlyPrice)}`,
    billingNote: `Billed at ${formatCurrency(Number(annualTotal.toFixed(2)))}/year`,
  };
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="space-y-16">
      <header className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
          Pricing
        </p>
        <h1 className="text-4xl font-semibold text-slate-50">
          Choose a plan that grows with your strategy
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-300">
          Start free and scale as you need. Annual plans save 15%.
        </p>
        <div className="flex items-center justify-center gap-3 text-sm text-slate-300">
          <Button
            variant={billingCycle === "monthly" ? "primary" : "ghost"}
            className={clsx(
              "min-w-[120px] border border-slate-700/80",
              billingCycle === "monthly" ? "shadow-lg shadow-indigo-500/30" : "bg-slate-800/60"
            )}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === "annual" ? "primary" : "ghost"}
            className={clsx(
              "min-w-[120px] border border-slate-700/80",
              billingCycle === "annual" ? "shadow-lg shadow-indigo-500/30" : "bg-slate-800/60"
            )}
            onClick={() => setBillingCycle("annual")}
          >
            Annual <span className="ml-2 text-xs text-indigo-200">Save 15%</span>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const { price, suffix, strikePrice, billingNote } = getPriceDetails(plan, billingCycle);

          return (
            <Card
              key={plan.id}
              className={clsx(
                "flex h-full flex-col border-slate-700/80 bg-slate-900/80 backdrop-blur",
                plan.highlighted
                  ? "border-indigo-500/70 shadow-xl shadow-indigo-500/20"
                  : "border-slate-800"
              )}
              heading={
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                      {plan.name}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-300">{plan.tagline}</p>
                  </div>
                  {plan.highlighted ? (
                    <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase text-indigo-200">
                      Most Popular
                    </span>
                  ) : null}
                </div>
              }
            >
              <div className="flex h-full flex-col gap-6">
                <div className="text-left">
                  <div className="flex items-baseline gap-3">
                    {strikePrice ? (
                      <span className="text-lg text-slate-500 line-through">{strikePrice}/mo</span>
                    ) : null}
                    <span className="text-4xl font-semibold text-white">{price}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{suffix}</p>
                  {billingNote ? (
                    <p className="mt-1 text-xs text-slate-500">{billingNote}</p>
                  ) : null}
                </div>

                <ul className="flex flex-1 flex-col gap-3 text-sm">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className={clsx(
                        "flex items-start gap-3 rounded-lg border border-slate-800/80 bg-slate-900/40 p-3",
                        feature.included ? "text-slate-200" : "text-slate-500"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={clsx(
                          "flex h-6 w-6 items-center justify-center rounded-full text-base",
                          feature.included
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-800 text-slate-400"
                        )}
                      >
                        {feature.included ? "✓" : feature.locked ? "🔒" : "–"}
                      </span>
                      <span className="leading-snug">{feature.label}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Button
                    className={clsx(
                      "w-full",
                      plan.highlighted
                        ? "px-6"
                        : "border border-slate-700/80 bg-slate-900/60 text-indigo-200 hover:bg-slate-800/80 hover:text-indigo-100"
                    )}
                    variant={plan.highlighted ? "primary" : "ghost"}
                  >
                    {plan.cta}
                  </Button>
                  <p className="text-center text-xs text-slate-400">{plan.priceNote}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-slate-800/80 bg-slate-900/60 px-6 py-4 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span aria-hidden="true">🛡️</span>
          SSL-secure checkout
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true">💳</span>
          Powered by Stripe
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true">🔒</span>
          Encrypted in transit
        </span>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="text-sm font-semibold text-indigo-300 underline decoration-indigo-500/70 decoration-2 underline-offset-4 hover:text-indigo-200"
          onClick={() => setShowComparison((value) => !value)}
        >
          {showComparison ? "Hide detailed comparison" : "Compare plans"}
        </button>
      </div>

      {showComparison ? (
        <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60">
          <div className="grid grid-cols-4 border-b border-slate-800/80 bg-slate-900/80 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="text-left">Feature</span>
            {plans.map((plan) => (
              <span key={plan.id} className="text-center text-slate-200">
                {plan.name}
              </span>
            ))}
          </div>
          <dl className="divide-y divide-slate-800/80 text-sm text-slate-300">
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-4 px-6 py-4">
                <dt className="font-medium text-slate-400">{row.label}</dt>
                {plans.map((plan) => (
                  <dd key={plan.id} className="text-center text-slate-200">
                    {row.values[plan.id]}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <section className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900/40 px-10 py-12 text-center shadow-lg shadow-indigo-500/20">
        <h2 className="text-3xl font-semibold text-white">Backtest smarter portfolios today.</h2>
        <p className="mt-3 text-lg text-slate-300">
          Trusted by 500+ TradingView quants. Join them and unlock portfolio-level insights in minutes.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Button className="px-6">Create Free Account</Button>
          <Button variant="ghost" className="text-indigo-300 hover:text-indigo-200">
            See Pricing
          </Button>
        </div>
      </section>
    </div>
  );
}
