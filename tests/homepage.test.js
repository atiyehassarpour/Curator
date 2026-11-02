const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
const js = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

test("homepage has unique IDs and all in-page links resolve", () => {
  const ids = [...html.matchAll(/\\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, "duplicate HTML id found");
  const idSet = new Set(ids);
  const anchors = [...html.matchAll(/\\bhref=["']#([^"']+)["']/g)].map((match) => match[1]);
  assert.ok(anchors.length > 0, "expected in-page navigation links");
  for (const anchor of anchors) assert.ok(idSet.has(anchor), `missing target #${anchor}`);
});

test("homepage exposes Persian and English content for language switching", () => {
  const bilingualNodes = [...html.matchAll(/data-fa=["'][^"']+["']\\s+data-en=["'][^"']+["']/g)];
  assert.ok(bilingualNodes.length >= 15, "expected bilingual content throughout the homepage");
  assert.match(html, /<html lang="fa" dir="rtl">/);
  assert.match(js, /root\\.dir = isEnglish \\? "ltr" : "rtl"/);
  assert.match(js, /URLSearchParams\\(window\\.location\\.search\\)/);
});

test("navigation controls have accessible state and close behavior", () => {
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-controls="primary-nav"/);
  assert.match(js, /setAttribute\\("aria-expanded"/);
  assert.match(js, /event\\.key === "Escape"/);
  assert.match(js, /!nav\\.contains\\(event\\.target\\)/);
});

test("responsive and reduced-motion styles are present", () => {
  assert.match(css, /@media\\s*\\(max-width:\\s*850px\\)/);
  assert.match(css, /@media\\s*\\(max-width:\\s*520px\\)/);
  assert.match(css, /prefers-reduced-motion:\\s*reduce/);
  assert.match(css, /:focus-visible/);
});
