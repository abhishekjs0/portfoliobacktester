import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

test("upload screen renders", async ({ page }) => {
  await page.goto(`${baseURL}/upload`);
  await expect(page.getByText("Upload TradingView CSVs")).toBeVisible();
  await expect(page.getByText("Compliance reminder")).toBeVisible();
});
