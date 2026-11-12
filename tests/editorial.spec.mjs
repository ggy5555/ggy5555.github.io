import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BEFORE = "http://127.0.0.1:4174";
const AFTER = "http://127.0.0.1:4173";

test("home retains brainmap entry and search finds a concept", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main.home-page")).toBeVisible();
  await expect(page.locator(".hero-brain-link")).toHaveAttribute("href", "brainmap.html");
  await page.locator("#main-q").fill("해마");
  await page.locator(".search-box[data-site-search] button[type=submit]").click();
  await expect(page.locator("[data-search-results] .search-result").first()).toBeVisible();
});

test("atlas preserves lobe interaction and adds accessible text routes", async ({ page }, testInfo) => {
  await page.goto("/brainmap.html");
  const frontal = page.locator(".brain-lobe.frontal");
  await expect(frontal).toHaveAttribute("href", "frontal.html");
  if (testInfo.project.name === "mobile") {
    await frontal.click();
    await expect(page.locator("[data-mobile-brain-title]")).toContainText("전두엽");
    await expect(frontal).toHaveAttribute("data-active", "true");
  } else {
    await frontal.hover();
    await expect(page.locator("[data-brain-tooltip]")).toHaveAttribute("data-visible", "true");
  }
  await expect(page.locator(".brainmap-key a")).toHaveCount(5);
  await page.locator(".brainmap-key a[href='cerebellum.html']").click();
  await expect(page).toHaveURL(/cerebellum\.html/);
});

test("learning progress is saved under the existing key", async ({ page }) => {
  await page.goto("/neuroanatomy.html");
  const button = page.locator(".progress-toggle");
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("neuroArchive.learningProgress.v1") || "null"));
  expect(saved.completed["neuroanatomy.html"]).toBeTruthy();
  await page.reload();
  await expect(page.locator(".progress-toggle")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('.toc a[aria-current="location"]').first()).toBeVisible();
});

test("quiz feedback and session survive a refresh", async ({ page }) => {
  await page.goto("/quiz.html");
  await page.locator("[data-quiz-start]").click();
  await expect(page.locator("[data-question-prompt]")).toBeVisible();
  await page.locator("[data-question-options] .quiz-option").first().click();
  await expect(page.locator("[data-question-feedback]")).toBeVisible();
  await expect(page.locator("[data-question-options] .quiz-option.correct")).toHaveCount(1);
  const session = await page.evaluate(() => localStorage.getItem("neuroArchive.quizSession.v1"));
  expect(session).toBeTruthy();
  await page.reload();
  await expect(page.locator("[data-question-feedback]")).toBeVisible();
});

test("record editor saves, updates, exports, and imports JSON locally", async ({ page }) => {
  await page.goto("/record-editor.html");
  await page.locator('[name="type"]').selectOption("ca");
  await page.locator('[name="date"]').fill("2026-11-12");
  await page.locator('[name="title"]').fill("에디토리얼 회귀 테스트");
  await page.locator('[name="stage"]').fill("구현 점검");
  await page.locator('[name="actualWork"]').fill("개선된 레이아웃을 검증했다.");
  await page.locator("[data-record-form] [type=submit]").click();
  await expect(page.locator("[data-saved-records] .research-card")).toHaveCount(1);
  await page.locator("[data-saved-records] .research-card button").first().click();
  await page.locator('[name="title"]').fill("수정된 회귀 테스트");
  await page.locator("[data-record-form] [type=submit]").click();
  await expect(page.locator("[data-saved-records]")).toContainText("수정된 회귀 테스트");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("[data-export]").click()
  ]);
  expect(download.suggestedFilename()).toMatch(/\.json$/);
  const imported = [{
    id: "test-import-1", type: "ca", date: "2026-11-11",
    title: "가져온 기록", stage: "검토", status: "확정",
    actualWork: "JSON 가져오기 검사", evidenceLinks: [], references: []
  }];
  await page.locator("[data-import]").setInputFiles({
    name: "qa-records.json", mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(imported), "utf8")
  });
  await expect(page.locator("[data-saved-records] .research-card")).toHaveCount(2);
  await page.reload();
  await expect(page.locator("[data-saved-records]")).toContainText("가져온 기록");
});

test("theme persists; keyboard skip and reduced motion are available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  const toggle = page.locator("[data-theme-toggle]");
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("neuro-archive-theme"))).toBe("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("representative pages have no horizontal document overflow", async ({ page }) => {
  for (const route of ["/", "/neuroanatomy.html", "/brainmap.html", "/quiz.html", "/research-archive.html", "/record-editor.html"]) {
    await page.goto(route);
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    expect(horizontalOverflow, "horizontal overflow on " + route).toBe(false);
  }
});

test("capture before and after visual baselines", async ({ page }, testInfo) => {
  test.slow();
  const dir = join("test-results", "visual");
  mkdirSync(dir, { recursive: true });
  const samplePages = {
    home: "index.html",
    learning: "neuroanatomy.html",
    atlas: "brainmap.html",
    quiz: "quiz.html",
    research: "research-archive.html",
    editor: "record-editor.html"
  };
  for (const [name, route] of Object.entries(samplePages)) {
    for (const [label, origin] of [["before", BEFORE], ["after", AFTER]]) {
      await page.goto(origin + "/" + route, { waitUntil: "domcontentloaded" });
      await page.locator("main").first().waitFor();
      await page.screenshot({
        path: join(dir, name + "-" + testInfo.project.name + "-" + label + ".png"),
        animations: "disabled",
        fullPage: false
      });
    }
  }
});
