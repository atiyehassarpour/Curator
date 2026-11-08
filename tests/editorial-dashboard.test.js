const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("editorial dashboard is a local bilingual tool", () => {
  const html = read("editorial-dashboard.html");
  const script = read("editorial-dashboard.js");
  assert.match(html, /<html lang="fa" dir="rtl">/);
  assert.match(html, /data-fa=/);
  assert.match(html, /data-en=/);
  assert.match(html, /type="file"[^>]*multiple/);
  assert.match(html, /editorial-dashboard\.js/);
  assert.match(script, /file\.text\(\)/);
  assert.doesNotMatch(script, /\bfetch\s*\(/);
  assert.doesNotMatch(script, /XMLHttpRequest/);
  assert.doesNotMatch(script, /localStorage|sessionStorage|indexedDB/);
});

test("dashboard review export keeps source intake separate and cannot publish", () => {
  const script = read("editorial-dashboard.js");
  assert.match(script, /intakePackage:c\.payload/);
  assert.match(script, /casg-editorial-review/);
  assert.match(script, /not approval or publication authorization/i);
  assert.doesNotMatch(script, /reviewStatus\s*=\s*["']approved/);
  assert.doesNotMatch(script, /status\s*=\s*["']published/);
});
