const { test, expect } = require("@playwright/test");
const path = require("node:path");

const pages = [
  { name: "homepage", route: "/" },
  { name: "research", route: "/research.html" },
  { name: "journal", route: "/journal.html" },
  { name: "curators", route: "/curators.html" },
  { name: "curator-profile-template", route: "/curator-profile-template.html" },
  { name: "entity", route: "/entity.html" },
  { name: "contribute", route: "/contribute.html" }
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
        if (pageInfo.name === "curators") {
          await expect(page.locator(".directory-hero")).toHaveCSS("display", "grid");
          await expect(page.locator(".filter-row")).toHaveCSS("display", "grid");
        }


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


test("curator profile navigates through verified exhibition, institution, and artist relationships", async ({ page }) => {
  const source = { id: "source-test", status: "published", title: { fa: "منبع آزمایشی", en: "Test source" }, url: "https://example.org/source" };
  const record = (id, name, extra = {}) => ({
    id, status: "published", reviewStatus: "approved", reviewedAt: "2026-11-07",
    sourceIds: ["source-test"], name: { fa: name, en: name }, ...extra
  });
  const fixture = {
    schemaVersion: 1,
    contentPolicy: { publishedRecordsRequireSources: true, publishedRecordsRequireEditorialReview: true, placeholderRecordsAreNeverRendered: true },
    curators: [record("curator-test", "Test Curator", {
      biography: { fa: "شرح آزمایشی", en: "Test biography" },
      approach: { fa: "رویکرد آزمایشی", en: "Test approach" },
      practiceTypes: ["independent"], locationGroup: "iran",
      roles: [{ title: { fa: "کیوریتور مستقل", en: "Independent curator" }, institution: { fa: "مؤسسه آزمایشی", en: "Test institution" } }],
      education: [{ degree: { fa: "کارشناسی ارشد", en: "MA" }, institution: { fa: "دانشگاه آزمایشی", en: "Test University" } }],
      researchInterests: [{ label: { fa: "هنر معاصر", en: "Contemporary art" } }]
    })],
    exhibitions: [record("exhibition-test", "Test Exhibition", { summary: { fa: "نمایشگاه آزمایشی", en: "Test exhibition" } })],
    galleries: [record("gallery-test", "Test Gallery")],
    museums: [record("museum-test", "Test Museum")],
    artists: [record("artist-test", "Test Artist")],
    projects: [],
    publications: [],
    sources: [source],
    relationships: [
      { id: "rel-1", status: "published", fromType: "curator", fromId: "curator-test", toType: "exhibition", toId: "exhibition-test", relationType: "curated", sourceIds: ["source-test"] },
      { id: "rel-2", status: "published", fromType: "exhibition", fromId: "exhibition-test", toType: "gallery", toId: "gallery-test", relationType: "hosted", sourceIds: ["source-test"] },
      { id: "rel-3", status: "published", fromType: "exhibition", fromId: "exhibition-test", toType: "museum", toId: "museum-test", relationType: "hosted", sourceIds: ["source-test"] },
      { id: "rel-4", status: "published", fromType: "exhibition", fromId: "exhibition-test", toType: "artist", toId: "artist-test", relationType: "participated", sourceIds: ["source-test"] }
    ]
  };

  await page.addInitScript(() => localStorage.setItem("casg-language", "en"));
  await page.route("**/data/curator-network.json", (route) => route.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify(fixture)
  }));
  await page.goto("/curator-profile-template.html?id=curator-test&lang=en", { waitUntil: "networkidle" });
  await expect(page.locator("[data-profile-name]")).toHaveText("Test Curator");
  await expect(page.getByText("Independent curator")).toBeVisible();
  await expect(page.getByText("MA")).toBeVisible();
  await expect(page.getByRole("link", { name: "Test Gallery" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Test Museum" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Test Artist" })).toBeVisible();
  await page.getByRole("link", { name: "Test Exhibition" }).click();
  await expect(page).toHaveURL(/entity\.html\?type=exhibition&id=exhibition-test/);
  await expect(page.locator("[data-entity-name]")).toHaveText("Test Exhibition");
  await expect(page.getByRole("link", { name: "Test Gallery" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Test Museum" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Test Artist" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Test Curator" })).toBeVisible();
  await page.getByRole("link", { name: "Test Gallery" }).click();
  await expect(page.locator("[data-entity-name]")).toHaveText("Test Gallery");
  await expect(page.getByRole("link", { name: "Test Exhibition" })).toBeVisible();
});
