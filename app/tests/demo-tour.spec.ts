import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

const marketingPages = [
  "Visit Home",
  "Visit Features",
  "Visit Markets",
  "Visit Ideas",
  "Visit Scripts",
  "Visit Screeners",
  "Visit Backtests",
  "Visit Pricing",
  "Visit Roadmap",
  "Visit Feedback",
];

const workflowPages = [
  "Visit Signup",
  "Visit Login",
  "Visit Dashboard",
  "Visit Upload",
];

test("demo tour lists every page link", async ({ page }) => {
  await page.goto(`${baseURL}/demo`);

  await expect(
    page.getByRole("heading", { name: "Marketing site pages" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Authenticated workflows" })
  ).toBeVisible();

  for (const linkText of [...marketingPages, ...workflowPages]) {
    await expect(page.getByRole("link", { name: linkText })).toBeVisible();
  }

  await expect(
    page.getByRole("link", { name: "Request a guided session" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Vote on roadmap" })).toBeVisible();
});
