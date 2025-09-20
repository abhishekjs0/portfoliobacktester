import { Button, Card } from "@backtester/ui";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Test ideas with limited uploads.",
    features: ["5 backtests per day", "Community support"],
    cta: "Start for free",
  },
  {
    name: "Pro",
    price: "$49",
    description: "Unlimited backtests and advanced analytics.",
    features: ["Unlimited uploads", "Priority email support", "Advanced analytics"],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Let's chat",
    description: "Custom SLAs, SSO, and dedicated onboarding.",
    features: ["Unlimited workspaces", "Dedicated success manager", "Custom limits"],
    cta: "Contact sales",
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-10">
      <header className="text-center">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Pricing that scales with you</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Choose the plan that fits your team. Upgrade or downgrade anytime.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.highlighted ? "border-indigo-500 shadow-lg shadow-indigo-200/40" : undefined}
            heading={plan.name}
            footer={<Button>{plan.cta}</Button>}
          >
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">{plan.price}
              {plan.price === "$49" ? <span className="text-base font-normal text-slate-500">/month</span> : null}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span aria-hidden="true">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
