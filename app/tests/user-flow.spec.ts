import path from "path";
import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const fixturePath = path.resolve(__dirname, "fixtures/sample-portfolio.csv");

const uploadResponse = {
  batchId: "batch-123",
  files: [
    {
      fileId: "file-1",
      ticker: "AAPL",
      strategy: "Momentum",
      exportDate: "2023-01-01",
      rows: 42,
    },
  ],
};

test("user can register, login, and upload a CSV", async ({ page }) => {
  await page.goto(`${baseURL}/signup`);
  await page.getByRole("textbox", { name: /name/i }).fill("Test Trader");
  await page.getByRole("textbox", { name: /email/i }).fill("test@example.com");
  await page.getByLabel("Password").fill("supersecret123");
  await page.getByRole("button", { name: /sign up/i }).click();

  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Password").fill("supersecret123");
  await page.getByRole("button", { name: /log in/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("status")).toContainText("Welcome aboard");

  await page.route("**/api/proxy/api/uploads", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(uploadResponse),
    });
  });

  await page.goto(`${baseURL}/upload`);
  await expect(page.getByText("Upload TradingView CSVs")).toBeVisible();
  await page.setInputFiles('input[type="file"]', fixturePath);
  await expect(page.getByTestId("file-summary")).toContainText("1 file ready");
  await page.getByRole("button", { name: /upload & continue/i }).click();
  await expect(page.getByRole("status")).toContainText("Uploaded 1 file successfully.");
  await expect(page).toHaveURL(/batchId=batch-123/);
});
