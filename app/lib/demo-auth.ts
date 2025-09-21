"use client";

export interface DemoUser {
  name: string;
  email: string;
  password: string;
}

const STORAGE_KEY = "portfolio-demo-user";

export function registerDemoUser(user: DemoUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as DemoUser) : null;
}

export function authenticateDemoUser(email: string, password: string): DemoUser {
  const user = getDemoUser();
  if (!user || user.email !== email || user.password !== password) {
    throw new Error("Invalid credentials");
  }
  return user;
}
