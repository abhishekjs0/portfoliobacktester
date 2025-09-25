#!/usr/bin/env node
import { readdir } from "fs/promises";
import path from "path";
import os from "os";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

async function hasRequiredBrowsers() {
  const browsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH
    ?? path.join(os.homedir(), ".cache", "ms-playwright");

  try {
    const entries = await readdir(browsersPath);
    const requiredPrefixes = [
      "chromium-",
      "chromium_headless_shell-",
      "firefox-",
      "webkit-",
    ];
    return requiredPrefixes.every((prefix) =>
      entries.some((entry) => entry.startsWith(prefix)),
    );
  } catch {
    return false;
  }
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    child.on("exit", (code) => resolve(code ?? 0));
    child.on("error", (error) => reject(error));
  });
}

async function commandExists(command) {
  const exitCode = await run("sh", ["-c", `command -v ${command} >/dev/null 2>&1`], {
    stdio: "ignore",
  });
  return exitCode === 0;
}

async function ensureBrowsers() {
  if (await hasRequiredBrowsers()) {
    return;
  }

  const playwrightCli = process.platform === "win32"
    ? path.join(projectRoot, "node_modules", ".bin", "playwright.cmd")
    : path.join(projectRoot, "node_modules", ".bin", "playwright");

  const args = ["install"];
  if (process.platform === "linux" && await commandExists("apt-get")) {
    args.push("--with-deps");
  }

  console.log("Installing Playwright browsers...");
  const exitCode = await run(playwrightCli, args, {
    cwd: projectRoot,
    stdio: "inherit",
  });

  if (exitCode !== 0) {
    throw new Error(`Playwright install exited with code ${exitCode}`);
  }
}

ensureBrowsers().catch((error) => {
  console.error(error);
  process.exit(1);
});
