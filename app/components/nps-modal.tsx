"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Button from "./ui/button";
import { submitNpsResponse } from "../lib/api";
import { trackEvent } from "../lib/analytics";

const STORAGE_KEY = "backtestlab-nps-last-response";
const SURVEY_DELAY_DAYS = 90;

function shouldDisplaySurvey(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const last = window.localStorage.getItem(STORAGE_KEY);
  if (!last) {
    return true;
  }
  const lastDate = new Date(last);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - SURVEY_DELAY_DAYS);
  return lastDate < threshold;
}

export function NpsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shouldDisplaySurvey()) {
      const timer = setTimeout(() => setIsOpen(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const submitDisabled = useMemo(() => score === null || isSubmitting, [score, isSubmitting]);

  const close = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (score === null) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await submitNpsResponse({ score, comment: comment.trim() || undefined });
      trackEvent("nps_submitted", { score });
      close();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">How likely are you to recommend BacktestLab?</h2>
            <p className="mt-2 text-sm text-slate-300">0 = Not likely · 10 = Extremely likely</p>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white" aria-label="Dismiss survey">
            ×
          </button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <fieldset className="grid grid-cols-11 gap-2" aria-label="NPS score">
            {Array.from({ length: 11 }, (_, index) => index).map((value) => (
              <label key={value} className="flex flex-col items-center text-xs text-slate-400">
                <input
                  type="radio"
                  name="nps-score"
                  value={value}
                  className="peer hidden"
                  onChange={() => setScore(value)}
                />
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-sm text-white transition peer-checked:bg-brand peer-checked:text-white"
                  aria-hidden="true"
                >
                  {value}
                </span>
              </label>
            ))}
          </fieldset>
          <label className="block text-sm text-slate-300">
            Anything else you’d like to share?
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
            />
          </label>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={close}>
              Not now
            </Button>
            <Button type="submit" disabled={submitDisabled} isLoading={isSubmitting}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
