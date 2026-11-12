import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 45000,
  expect: { timeout: 12000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    colorScheme: "light",
    acceptDownloads: true,
    trace: "retain-on-failure"
  },
  projects: [
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
    { name: "mobile", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } }
  ],
  webServer: [
    {
      command: "python3 -m http.server 4173 --bind 127.0.0.1",
      url: "http://127.0.0.1:4173/index.html",
      timeout: 30000,
      reuseExistingServer: !process.env.CI
    },
    {
      command: "python3 -m http.server 4174 --bind 127.0.0.1 --directory baseline",
      url: "http://127.0.0.1:4174/index.html",
      timeout: 30000,
      reuseExistingServer: !process.env.CI
    }
  ]
});
