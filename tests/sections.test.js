const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const pages = ["research.html", "journal.html"];

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  test(page + " has unique IDs and resolvable in-page links", () => {
    const ids = [...html.matchAll(/\\bid=["']([^"']+)["']/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, "duplicate id found");
    const idSet = new Set(ids);
    const anchors = [...html.matchAll(/\\bhref=["']#([^"']+)["']/g)].map((match) => match[1]);
    for (const anchor of anchors) assert.ok(idSet.has(anchor), "missing target #" + anchor);
  });

  test(page + " includes bilingual copy and shared navigation", () => {
    assert.match(html, /<html lang="fa" dir="rtl">/);
    assert.match(html, /data-title-fa=/);
    assert.match(html, /data-title-en=/);
    assert.match(html, /data-fa=/);
    assert.match(html, /data-en=/);
    assert.match(html, /href="research\\.html"/);
    assert.match(html, /href="journal\\.html"/);
    assert.match(html, /aria-controls="primary-nav"/);
    assert.match(html, /aria-current="page"/);
  });

  test(page + " clearly identifies all sample editorial content as preview", () => {
    assert.match(html, /نمونه/);
    assert.match(html, /PLACEHOLDER|PREVIEW/i);
    assert.match(html, /rights|حقوق|منابع|sources/i);
    assert.match(html, /data-aria-fa=/);
    assert.match(html, /data-aria-en=/);
  });
}

for (const page of ["curators.html", "curator-profile-template.html"]) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  test(page + " is bilingual and explicitly protects against invented profiles", () => {
    assert.match(html, /<html lang="fa" dir="rtl">/);
    assert.match(html, /data-title-fa=/);
    assert.match(html, /data-title-en=/);
    assert.match(html, /data-fa=/);
    assert.match(html, /data-en=/);
    assert.match(html, /PLACEHOLDER|الگوی صفحه|الگوی طراحی/i);
    assert.match(html, /verified|تأیید|راستی‌آزمایی/i);
    assert.match(html, /aria-controls="primary-nav"/);
  });
}

test("curator directory includes labeled search and filters", () => {
  const html = fs.readFileSync(path.join(root, "curators.html"), "utf8");
  assert.match(html, /id="curator-search"/);
  assert.match(html, /id="curator-field"/);
  assert.match(html, /id="curator-location"/);
  assert.match(html, /aria-live="polite"/);
  const js = fs.readFileSync(path.join(root, "curators.js"), "utf8");
  assert.match(js, /addEventListener\("input"/);
  assert.match(js, /data-curator-profile/);
});

test("section styles include responsive and reduced-motion rules", () => {
  const css = fs.readFileSync(path.join(root, "sections.css"), "utf8");
  assert.match(css, /@media\\s*\\(max-width:\\s*850px\\)/);
  assert.match(css, /@media\\s*\\(max-width:\\s*520px\\)/);
  assert.match(css, /prefers-reduced-motion:\\s*reduce/);
});
