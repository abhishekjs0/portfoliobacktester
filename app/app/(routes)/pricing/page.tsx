"use client";

import { useMemo, useState } from "react";
import Button from "../../../components/ui/button";
import { startCheckout } from "../../../lib/billing";
import { BillingInterval } from "../../../lib/api";
import { usePlan } from "../../../lib/use-plan";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Experiment with solo symbols and understand the workflow.",
    price: { monthly: 0, annual: 0 },
    highlight: "Perfect for validating a single strategy.",
    features: [
      { label: "Up to 5 CSV uploads per portfolio", included: true },
      { label: "1 backtest run per day", included: true },
      { label: "Risk ratios & correlations", included: false },
      { label: "Monte Carlo simulations", included: false },
      { label: "Team invites", included: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Serious iteration with premium analytics and automations.",
    price: { monthly: 39, annual: 399 },
    highlight: "Best for systematic traders and desks",
    features: [
      { label: "Up to 25 CSV uploads per portfolio", included: true },
      { label: "Unlimited portfolio reruns", included: true },
      { label: "Risk ratios & correlations", included: true },
      { label: "Monte Carlo simulations", included: true },
      { label: "Team invites", included: true },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Scale to funds with automation, SSO and priority support.",
    price: { monthly: 99, annual: 999 },
    highlight: "Includes concierge onboarding and white-glove SLAs.",
    features: [
      { label: "Up to 100 CSV uploads per portfolio", included: true },
      { label: "Unlimited portfolio reruns", included: true },
      { label: "Risk ratios & correlations", included: true },
      { label: "Monte Carlo simulations", included: true },
      { label: "Team invites", included: true },
    ],
  },
] as const;

export default function PricingPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const { plan } = usePlan();

  const formattedPlans = useMemo(() => {
    return plans.map((planOption) => {
      const priceValue = planOption.price[interval];
      const formatted = priceValue === 0 ? "Free" : `$${priceValue}${interval === "annual" ? " /yr" : " /mo"}`;
      const secondary =
        interval === "annual" && priceValue > 0 ? `$${Math.round(planOption.price.monthly * 12)} value` : null;
      return { ...planOption, formattedPrice: formatted, secondary };
    });
  }, [interval]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
          Pricing
        </span>
        <h1 className="mt-4 text-4xl font-bold text-white">Choose a plan that grows with your strategy</h1>
        <p className="mt-3 text-lg text-slate-300">Annual billing saves two months. Toggle below to compare.</p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/60 p-2 text-sm text-slate-200">
          <button
            className={`rounded-full px-4 py-2 ${interval === "monthly" ? "bg-brand text-white" : "hover:text-white"}`}
            onClick={() => setInterval("monthly")}
            type="button"
          >
            Monthly
          </button>
          <button
            className={`rounded-full px-4 py-2 ${interval === "annual" ? "bg-brand text-white" : "hover:text-white"}`}
            onClick={() => setInterval("annual")}
            type="button"
          >
            Annual
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {formattedPlans.map((planOption) => {
          const isCurrentPlan = plan === planOption.id;
          const isFree = planOption.id === "free";
          return (
            <div
              key={planOption.id}
              className={`flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg ${
                planOption.id === "pro" ? "ring-2 ring-brand" : ""
              }`}
            >
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{planOption.name}</h2>
                  <p className="text-sm text-slate-300">{planOption.description}</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {planOption.formattedPrice}
                  {planOption.secondary && <span className="block text-sm text-slate-300">{planOption.secondary}</span>}
                </p>
                <p className="text-sm text-slate-300">{planOption.highlight}</p>
                <ul className="space-y-2 text-sm">
                  {planOption.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2 text-slate-200">
                      <span aria-hidden="true">{feature.included ? "✓" : "🔒"}</span>
                      <span className={!feature.included ? "text-slate-500" : undefined}>{feature.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                {isCurrentPlan ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={planOption.id === "pro" ? "primary" : "secondary"}
                    onClick={() => {
                      if (!isFree) {
                        void startCheckout(planOption.id, interval);
                      }
                    }}
                    disabled={isFree}
                  >
                    {isFree ? "Included" : `Choose ${planOption.name}`}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
