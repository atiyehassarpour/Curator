const { test, expect } = require("@playwright/test");
const path = require("node:path");

const pages = [
  { name: "homepage", route: "/" },
  { name: "research", route: "/research.html" },
  { name: "journal", route: "/journal.html" },
  { name: "curators", route: "/curators.html" },
  { name: "curator-profile-template", route: "/curator-profile-template.html" },\n  { name: "entity", route: "/entity.html?type=gallery&id=preview" }
];
const languages = ["fa", "en"];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 }
];

for (const pageInfo of pages) {
  for (const language of languages) {
    for (const viewport of viewports) {
      test(`${pageInfo.name} renders in ${language} at ${viewport.name}`, async ({ browser }, testInfo) => {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
        const runtimeErrors = [];
        page.on("pageerror", error => runtimeErrors.push(error.message));

        await page.goto(`${pageInfo.route}?lang=${language}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);

        await expect(page.locator("body")).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("lang", language);
        await expect(page.locator("html")).toHaveAttribute("dir", language === "fa" ? "rtl" : "ltr");
        await expect(page).toHaveTitle(/.+/);

        const dimensions = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth
        }));
        expect(
          dimensions.document,
          `Unexpected horizontal overflow: viewport=${dimensions.viewport}, document=${dimensions.document}`
        ).toBeLessThanOrEqual(dimensions.viewport + 1);
        expect(runtimeErrors, "Unexpected browser runtime errors").toEqual([]);

        if (viewport.name === "mobile") {
          const menuButton = page.locator(".menu-toggle");
          if (await menuButton.isVisible()) {
            await menuButton.click();
            await expect(menuButton).toHaveAttribute("aria-expanded", "true");
            await page.keyboard.press("Escape");
            await expect(menuButton).toHaveAttribute("aria-expanded", "false");
          }
        }

        const screenshotPath = testInfo.outputPath(
          `${pageInfo.name}-${language}-${viewport.name}.png`
        );
        await page.screenshot({ path: screenshotPath, fullPage: true, animations: "disabled" });
        await page.close();
      });
    }
  }
}

for (const pageInfo of pages) {
  test(`${pageInfo.name} has no horizontal overflow at narrow 320px width`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(`${pageInfo.route}?lang=fa`, { waitUntil: "networkidle" });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
  });
}
