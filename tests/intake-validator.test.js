const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.join(__dirname, "..");
const validator = path.join(root, "scripts", "validate-intake.js");
const validPackage = () => ({
  format: "casg-curator-intake",
  schemaVersion: 1,
  curators: [{
    id: "sample-curator",
    status: "draft",
    reviewStatus: "pending",
    reviewedAt: null,
    name: { fa: "نام نمونه", en: "Sample Curator" },
    sourceIds: ["source-sample"],
    intakeDeclaration: true,
    website: "https://example.org",
    publicEmail: "editor@example.org"
  }],
  sources: [{
    id: "source-sample",
    status: "draft",
    title: { fa: "منبع نمونه", en: "Sample source" },
    url: "https://example.org/source"
  }],
  relationships: []
});

function runValidator(payload) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "casg-intake-"));
  const file = path.join(dir, "draft.json");
  fs.writeFileSync(file, JSON.stringify(payload));
  const result = spawnSync(process.execPath, [validator, file], { encoding: "utf8" });
  fs.rmSync(dir, { recursive: true, force: true });
  return result;
}

test("accepts a structurally valid draft without publishing it", () => {
  const result = runValidator(validPackage());
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Editorial review is still required/);
  assert.match(result.stdout, /does not import or publish/);
});

test("rejects non-draft records and unreviewed source URLs", () => {
  const payload = validPackage();
  payload.curators[0].status = "published";
  payload.sources[0].url = "http://example.org/source";
  const result = runValidator(payload);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /status must remain draft/);
  assert.match(result.stderr, /URL must use HTTPS/);
});

test("rejects missing or unreferenced source records", () => {
  const payload = validPackage();
  payload.curators[0].sourceIds = ["missing-source"];
  const result = runValidator(payload);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /references missing source/);
  assert.match(result.stderr, /Unreferenced source record/);
});

test("rejects a curator draft without bilingual names or contributor declaration", () => {
  const payload = validPackage();
  payload.curators[0].name.en = "";
  payload.curators[0].intakeDeclaration = false;
  const result = runValidator(payload);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Persian and English values/);
  assert.match(result.stderr, /declaration is required/);
});
