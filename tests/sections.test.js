const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

for (const page of ["research.html", "journal.html", "curators.html", "curator-profile-template.html", "entity.html", "contribute.html"]) {
  const html = read(page);
  test(page + " has bilingual metadata and shared navigation", () => {
    assert.match(html, /<html lang="fa" dir="rtl">/);
    assert.match(html, /data-title-fa=/);
    assert.match(html, /data-title-en=/);
    assert.match(html, /data-fa=/);
    assert.match(html, /data-en=/);
    assert.match(html, /aria-controls="primary-nav"/);
  });
  test(page + " has unique IDs and valid in-page links", () => {
    const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1]);
    assert.equal(ids.length, new Set(ids).size, "duplicate id found");
    const idSet = new Set(ids);
    const anchors = [...html.matchAll(/\bhref=["']#([^"']+)["']/g)].map((m) => m[1]);
    for (const anchor of anchors) assert.ok(idSet.has(anchor), "missing target #" + anchor);
  });
}

test("curator directory loads shared network data and exposes search and filters", () => {
  const html = read("curators.html");
  assert.match(html, /id="curator-search"/);
  assert.match(html, /id="curator-field"/);
  assert.match(html, /id="curator-location"/);
  assert.ok(html.indexOf('src="network.js"') < html.indexOf('src="curators.js"'));
  const script = read("curators.js");
  assert.match(script, /api\.load\(\)/);
  assert.match(script, /data-curator-profile/);
  assert.match(script, /api\.isVerifiedRecord\(data, r\)/);
});

test("network data schema keeps all entity collections and relationships explicit", () => {
  const data = JSON.parse(read("data/curator-network.json"));
  for (const key of ["curators","exhibitions","galleries","museums","artists","projects","publications","sources","relationships"]) {
    assert.ok(Array.isArray(data[key]), key + " must be an array");
  }
  assert.equal(data.schemaVersion, 1);
  assert.equal(data.contentPolicy.publishedRecordsRequireSources, true);
  assert.equal(data.contentPolicy.publishedRecordsRequireEditorialReview, true);
});

test("relationship helpers resolve all entity collection names correctly", () => {
  const script = read("network.js");
  for (const type of ["curator","exhibition","gallery","museum","artist","project","publication"]) assert.match(script, new RegExp(type + ':'));
  assert.match(script, /const visibleRelations/);
  assert.match(script, /status === "published"/);
});

test("profile and entity pages use shared network rendering", () => {
  assert.match(read("curator-profile-template.html"), /src="profile\.js"/);
  assert.match(read("curator-profile-template.html"), /id="profile-relationships"/);
  assert.match(read("entity.html"), /src="entity\.js"/);
  assert.match(read("entity.html"), /id="entity-connections"/);
  assert.match(read("entity.html"), /id="entity-curator-links"/);
});

test("application language switcher contains no escaped newline artifacts", () => {
  const app = read("app.js");
  assert.doesNotMatch(app, /\\\\n/);
  assert.match(app, /casg:languagechange/);
});

test("directory and network styles include responsive breakpoints", () => {
  const css = read("curators.css") + read("sections.css");
  assert.match(css, /max-width:\s*850px/);
  assert.match(css, /max-width:\s*520px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("curator intake is local-only and exports draft records with sources", () => {
  const html = read("contribute.html");
  const script = read("contribute.js");
  assert.match(html, /id="curator-intake"/);
  assert.match(html, /name="sourceUrl"/);
  assert.match(html, /name="declaration"/);
  assert.match(script, /status:"draft"/);
  assert.match(script, /reviewStatus:"pending"/);
  assert.match(script, /reviewedAt:null/);
  assert.match(script, /protocol==="https:"/);
  assert.match(script, /URL\.createObjectURL/);
  assert.doesNotMatch(script, /fetch\s*\(/);
  assert.doesNotMatch(script, /XMLHttpRequest/);
});

test("curator profile renders optional credentials and curator-centered verified network links", () => {
  const html = read("curator-profile-template.html");
  const script = read("profile.js");
  for (const id of ["profile-portrait","profile-roles","profile-education","profile-interests","profile-links","profile-relationships","profile-sources"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  assert.match(script, /collectIndirectExhibitionEdges/);
  assert.match(script, /api\.visibleRelations\(data,"exhibition",exhibitionId\)/);
  assert.match(script, /safeExternalLink\(curator\.portrait\?\.url\)/);
  assert.match(script, /researchInterests/);
  assert.match(script, /verifiedRecord = \(type,id\) => api\.findRecord/);
});
