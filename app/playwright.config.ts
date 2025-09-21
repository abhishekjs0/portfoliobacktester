import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  use: {
    headless: true,
  },
  webServer: {
    command: "npm run dev -- --hostname 0.0.0.0 --port 3000",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
};

export default config;
