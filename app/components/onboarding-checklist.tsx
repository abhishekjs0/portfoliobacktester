"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChecklistState, ChecklistStepId, loadChecklist, subscribeToChecklist, completeChecklistStep } from "../lib/checklist";
import { trackEvent } from "../lib/analytics";

const STEPS: Array<{ id: ChecklistStepId; title: string; description: string }> = [
  {
    id: "upload-demo",
    title: "Upload a demo CSV",
    description: "Use the sample data or your own to seed the dashboard.",
  },
  {
    id: "run-backtest",
    title: "Run a portfolio backtest",
    description: "Execute a portfolio simulation to unlock analytics.",
  },
  {
    id: "view-metrics",
    title: "Review strategy metrics",
    description: "Explore drawdown, CAGR, Sharpe and trade analytics.",
  },
  {
    id: "invite-teammate",
    title: "Invite a teammate",
    description: "Share access so collaborators can review backtests.",
  },
];

export function OnboardingChecklist() {
  const [state, setState] = useState<ChecklistState>({});

  useEffect(() => {
    setState(loadChecklist());
    return subscribeToChecklist(setState);
  }, []);

  const completedCount = STEPS.filter((step) => state[step.id]).length;
  const percentComplete = Math.round((completedCount / STEPS.length) * 100);

  return (
    <section aria-labelledby="onboarding-checklist" className="tv-card space-y-4 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="onboarding-checklist" className="text-lg font-semibold text-white">
            Getting started checklist
          </h2>
          <p className="text-sm text-slate-300">Complete the steps below to unlock the full workspace.</p>
        </div>
        <div className="text-sm text-slate-300">{percentComplete}% complete</div>
      </div>
      <ol className="space-y-3">
        {STEPS.map((step) => {
          const isDone = Boolean(state[step.id]);
          return (
            <li
              key={step.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-white/5 bg-slate-950/60 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isDone ? "bg-emerald-500 text-slate-950" : "border border-white/30 text-slate-200"
                    }`}
                    aria-hidden="true"
                  >
                    {isDone ? "✓" : STEPS.indexOf(step) + 1}
                  </span>
                  <p className="font-medium text-white">{step.title}</p>
                </div>
                <p className="mt-1 text-sm text-slate-300">{step.description}</p>
              </div>
              {!isDone && step.id === "invite-teammate" && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    completeChecklistStep(step.id);
                    trackEvent("invite_teammate_clicked");
                    window.open("mailto:?subject=Join%20the%20portfolio%20workspace", "_blank");
                  }}
                >
                  Invite
                </Button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
