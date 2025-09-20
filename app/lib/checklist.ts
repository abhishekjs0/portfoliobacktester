"use client";

export type ChecklistStepId = "upload-demo" | "run-backtest" | "view-metrics" | "invite-teammate";

const STORAGE_KEY = "portfolio-onboarding-checklist";
const EVENT_NAME = "checklist-update";

export interface ChecklistState {
  [key: string]: boolean;
}

export function loadChecklist(): ChecklistState {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ChecklistState) : {};
  } catch (error) {
    console.warn("Unable to load checklist", error);
    return {};
  }
}

export function completeChecklistStep(step: ChecklistStepId): void {
  if (typeof window === "undefined") return;
  const next = { ...loadChecklist(), [step]: true };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
}

export function resetChecklist(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: {} }));
}

export function subscribeToChecklist(callback: (state: ChecklistState) => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = (event: Event) => {
    if (event instanceof CustomEvent) {
      callback(event.detail as ChecklistState);
    } else {
      callback(loadChecklist());
    }
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
