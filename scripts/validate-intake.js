#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run validate:intake -- <draft.json>");
  process.exit(2);
}

const errors = [];
const add = (condition, message) => { if (!condition) errors.push(message); };
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isHttps = (value) => {
  try { return new URL(value).protocol === "https:"; } catch (_) { return false; }
};
const hasText = (value) => typeof value === "string" && value.trim().length > 0;

let payload;
try {
  payload = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file), "utf8"));
} catch (error) {
  console.error("Could not read valid JSON:", error.message);
  process.exit(2);
}

add(isObject(payload), "Root must be a JSON object.");
if (!isObject(payload)) {
  console.error(errors.join("\n"));
  process.exit(1);
}

add(payload.format === "casg-curator-intake", "Unsupported intake format.");
add(payload.schemaVersion === 1, "Unsupported schemaVersion; expected 1.");
add(Array.isArray(payload.curators) && payload.curators.length === 1, "Exactly one curator draft is required.");
add(Array.isArray(payload.sources) && payload.sources.length >= 1, "At least one source record is required.");
add(Array.isArray(payload.relationships) && payload.relationships.length === 0, "Intake packages must not include unreviewed relationships.");

const curator = Array.isArray(payload.curators) ? payload.curators[0] : null;
const sources = Array.isArray(payload.sources) ? payload.sources : [];
if (isObject(curator)) {
  add(hasText(curator.id), "Curator ID is required.");
  add(curator.status === "draft", "Curator status must remain draft.");
  add(curator.reviewStatus === "pending", "Curator reviewStatus must remain pending.");
  add(curator.reviewedAt === null, "Curator reviewedAt must remain null before editorial review.");
  add(isObject(curator.name) && hasText(curator.name.fa) && hasText(curator.name.en), "Curator name must include Persian and English values.");
  add(Array.isArray(curator.sourceIds) && curator.sourceIds.length > 0, "Curator must reference at least one source.");
  add(curator.intakeDeclaration === true, "Contributor declaration is required.");
  if (curator.website) add(isHttps(curator.website), "Optional curator website must use HTTPS.");
  if (curator.publicEmail) add(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(curator.publicEmail), "Public email is not a valid email address.");
} else {
  add(false, "Curator draft must be an object.");
}

const sourceIds = new Set();
for (const source of sources) {
  add(isObject(source), "Each source must be an object.");
  if (!isObject(source)) continue;
  add(hasText(source.id), "Every source needs an ID.");
  if (sourceIds.has(source.id)) errors.push("Duplicate source ID: " + source.id);
  sourceIds.add(source.id);
  add(source.status === "draft", "Source status must remain draft.");
  add(isObject(source.title) && (hasText(source.title.fa) || hasText(source.title.en)), "Every source needs a title.");
  add(isHttps(source.url), "Every source URL must use HTTPS.");
}
if (isObject(curator) && Array.isArray(curator.sourceIds)) {
  for (const id of curator.sourceIds) add(sourceIds.has(id), "Curator references missing source: " + id);
  for (const id of sourceIds) add(curator.sourceIds.includes(id), "Unreferenced source record: " + id);
}

if (errors.length) {
  console.error("Intake validation failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}

console.log("Intake package is structurally valid.");
console.log("Editorial review is still required; this command does not import or publish data.");
console.log("Curator:", curator.name.en, "/", curator.name.fa);
console.log("Sources:", sources.length);
