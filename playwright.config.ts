import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { VOTTING_EMAILS } from "./emails";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  globalSetup: "./global-setup.ts",
  use: {
    headless: false,
    trace: "on-first-retry",
  },

  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    // Generate a project per email for parallel execution
    ...VOTTING_EMAILS.map((email) => ({
      name: `chromium-${email}`,
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.join(__dirname, `playwright/.auth/${email.replace(/[@.]/g, "_")}.json`),
      },
      dependencies: ["setup"],
    }))
  ],
});
