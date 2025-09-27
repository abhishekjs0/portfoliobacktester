import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

const primaryNavLinks = ["Backtests", "User guide", "Pricing"];

test("homepage highlights the key BacktestLab entry points", async ({ page }) => {
  await page.goto(`${baseURL}/`);

  const banner = page.getByRole("banner");

  for (const navLink of primaryNavLinks) {
    await expect(banner.getByRole("link", { name: navLink })).toBeVisible();
  }

  await expect(banner.getByRole("link", { name: "Log in" })).toBeVisible();
  await expect(banner.getByRole("link", { name: "Sign up" })).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: /Test your TradingView strategy on multiple scripts/i,
    })
  ).toBeVisible();

  await expect(
    page.getByRole("form", { name: "Upload TradingView CSV" })
  ).toBeVisible();
});
