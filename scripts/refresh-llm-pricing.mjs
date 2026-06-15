#!/usr/bin/env node
/**
 * refresh-llm-pricing.mjs
 *
 * Refresh the LLM pricing dataset at data/llm-pricing.json.
 *
 * Usage:
 *   node scripts/refresh-llm-pricing.mjs [--input path/to/snapshot.json] [--check-stale]
 *
 * Without --input: performs a validation / stale-check pass on the current data.
 * With --input: merges the snapshot into the current data using model_id as key,
 * updates timestamps, validates fields, and writes the merged file.
 */

import fs from "node:fs";
import path from "node:path";

const DATA_PATH = path.resolve("data/llm-pricing.json");
const REQUIRED_FIELDS = [
  "provider",
  "model",
  "model_id",
  "input_price",
  "output_price",
  "context_window",
  "notes",
  "source_url",
];
const OPTIONAL_FIELDS = [
  "cached_input_price",
  "max_output_tokens",
  "mmlu",
  "humaneval",
  "chatbot_arena",
];
const STALE_DAYS = 30;

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function saveJson(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function nowIso() {
  return new Date().toISOString();
}

function isValidNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) && value >= 0;
}

function validateModel(model, index) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (model[field] === undefined || model[field] === "" || model[field] === null) {
      errors.push(`[${index}] missing required field: ${field}`);
    }
  }

  if (!isValidNumber(model.input_price)) {
    errors.push(`[${index}] input_price must be a non-negative number`);
  }
  if (!isValidNumber(model.output_price)) {
    errors.push(`[${index}] output_price must be a non-negative number`);
  }
  if (!Number.isInteger(model.context_window) || model.context_window <= 0) {
    errors.push(`[${index}] context_window must be a positive integer`);
  }

  for (const field of OPTIONAL_FIELDS) {
    const value = model[field];
    if (value !== undefined && value !== null && !isValidNumber(value)) {
      errors.push(`[${index}] optional field ${field} must be a non-negative number if present`);
    }
  }

  return errors;
}

function checkStale(data) {
  const updatedAt = data.updated_at ? new Date(data.updated_at) : null;
  if (!updatedAt || Number.isNaN(updatedAt.getTime())) {
    return ["updated_at is missing or invalid"];
  }

  const now = new Date();
  const daysSinceUpdate = (now - updatedAt) / (1000 * 60 * 60 * 24);
  const warnings = [];

  if (daysSinceUpdate > STALE_DAYS) {
    warnings.push(`Dataset last updated ${Math.round(daysSinceUpdate)} days ago (> ${STALE_DAYS}).`);
  }

  return warnings;
}

function mergeSnapshot(current, snapshot) {
  const existingById = new Map(current.models.map((m) => [m.model_id, m]));
  const merged = [];
  let added = 0;
  let updated = 0;
  let unchanged = 0;

  for (const incoming of snapshot.models) {
    const existing = existingById.get(incoming.model_id);

    if (!existing) {
      merged.push({
        ...incoming,
        _first_seen: nowIso(),
      });
      added++;
      continue;
    }

    const hasPriceChange =
      incoming.input_price !== existing.input_price ||
      incoming.output_price !== existing.output_price;

    if (hasPriceChange) {
      merged.push({
        ...existing,
        ...incoming,
        _price_changed_at: nowIso(),
      });
      updated++;
    } else {
      merged.push(existing);
      unchanged++;
    }
  }

  // Preserve models in current that are not in the snapshot.
  const incomingIds = new Set(snapshot.models.map((m) => m.model_id));
  for (const model of current.models) {
    if (!incomingIds.has(model.model_id)) {
      merged.push(model);
    }
  }

  return { merged, added, updated, unchanged };
}

function printReport(data, validationErrors, staleWarnings, mergeStats) {
  console.log(`\n--- LLM Pricing Refresh Report ---`);
  console.log(`Dataset: ${DATA_PATH}`);
  console.log(`Models: ${data.models.length}`);
  console.log(`Updated at: ${data.updated_at || "N/A"}`);
  console.log(`Generated at: ${data.generated_at || "N/A"}`);

  if (mergeStats) {
    console.log(`\nMerge stats:`);
    console.log(`  Added:   ${mergeStats.added}`);
    console.log(`  Updated: ${mergeStats.updated}`);
    console.log(`  Unchanged: ${mergeStats.unchanged}`);
  }

  if (validationErrors.length > 0) {
    console.log(`\nValidation errors:`);
    for (const err of validationErrors) {
      console.log(`  - ${err}`);
    }
  } else {
    console.log(`\nValidation: OK`);
  }

  if (staleWarnings.length > 0) {
    console.log(`\nStale warnings:`);
    for (const warning of staleWarnings) {
      console.log(`  - ${warning}`);
    }
  } else {
    console.log(`\nStale check: OK (updated within ${STALE_DAYS} days)`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf("--input");
  const inputPath = inputIndex !== -1 ? args[inputIndex + 1] : null;
  const checkStaleFlag = args.includes("--check-stale");

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Dataset not found: ${DATA_PATH}`);
    process.exit(1);
  }

  const data = loadJson(DATA_PATH);

  // Validate current data.
  let validationErrors = [];
  data.models.forEach((model, index) => {
    validationErrors = validationErrors.concat(validateModel(model, index));
  });

  const staleWarnings = checkStaleFlag || inputPath ? checkStale(data) : [];

  let mergeStats = null;

  if (inputPath) {
    if (!fs.existsSync(inputPath)) {
      console.error(`Snapshot not found: ${inputPath}`);
      process.exit(1);
    }

    const snapshot = loadJson(inputPath);

    if (!Array.isArray(snapshot.models)) {
      console.error(`Snapshot must contain a "models" array.`);
      process.exit(1);
    }

    snapshot.models.forEach((model, index) => {
      validationErrors = validationErrors.concat(validateModel(model, `snapshot:${index}`));
    });

    if (validationErrors.length > 0) {
      console.error(`\nValidation failed. Fix errors before writing.`);
      printReport(data, validationErrors, staleWarnings, null);
      process.exit(1);
    }

    const result = mergeSnapshot(data, snapshot);
    mergeStats = { added: result.added, updated: result.updated, unchanged: result.unchanged };

    const output = {
      ...data,
      generated_at: nowIso(),
      updated_at: nowIso(),
      source: snapshot.source || data.source || "merged",
      models: result.merged,
    };

    saveJson(DATA_PATH, output);
    console.log(`\nWrote updated dataset to ${DATA_PATH}`);
  }

  printReport(loadJson(DATA_PATH), validationErrors, staleWarnings, mergeStats);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
