import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scannerUrl = pathToFileURL(path.join(repoRoot, "scripts", "scan-secrets.mjs")).href;

describe("scan-secrets", () => {
  test("flags a Together live key and ignores documentation placeholders", async () => {
    const { scanContents } = await import(`${scannerUrl}?t=${Date.now()}`);
    const live = scanContents(
      "scripts/generate-hero.mjs",
      'const API_KEY = "tgp_v1_AAAAAAAAAAAAAAAA";',
    );
    assert.equal(live.some((hit) => hit.rule === "together_key"), true);

    const docs = scanContents(
      "docs/example.md",
      "Set STRIPE_SECRET_KEY=sk_live_... and never commit ghp_\\w+ patterns.",
    );
    assert.equal(docs.length, 0);

    const pemStrip = scanContents(
      "lib/google-sheets.ts",
      'pemKey.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "");',
    );
    assert.equal(pemStrip.length, 0);
  });
});
