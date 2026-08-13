import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(repoRoot, "scripts", "generate-hero.mjs");
const scriptUrl = pathToFileURL(script).href;

function runHero(args, envOverrides = {}) {
  const env = { ...process.env, ...envOverrides };
  delete env.TOGETHER_API_KEY;
  if (Object.prototype.hasOwnProperty.call(envOverrides, "TOGETHER_API_KEY")) {
    if (envOverrides.TOGETHER_API_KEY === undefined) {
      delete env.TOGETHER_API_KEY;
    } else {
      env.TOGETHER_API_KEY = envOverrides.TOGETHER_API_KEY;
    }
  }
  return spawnSync(process.execPath, [script, ...args], {
    cwd: repoRoot,
    env,
    encoding: "utf8",
  });
}

describe("generate-hero secret hygiene", () => {
  test("source does not contain Together key material", () => {
    const src = readFileSync(script, "utf8");
    assert.equal(src.includes("tgp_v1_"), false);
    assert.doesNotMatch(src, /API_KEY\s*=\s*["'][^"']+["']/);
  });
});

describe("generate-hero fail-closed auth", () => {
  test("missing TOGETHER_API_KEY exits 1 and does not call the network", () => {
    const result = runHero(["A title", "blog/example-hero.png"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /TOGETHER_API_KEY/);
    assert.doesNotMatch(result.stderr + result.stdout, /api\.together/);
  });

  test("whitespace-only TOGETHER_API_KEY exits 1", () => {
    const result = runHero(["A title", "blog/example-hero.png"], {
      TOGETHER_API_KEY: "   ",
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /TOGETHER_API_KEY/);
  });

  test("resolveTogetherApiKey rejects empty env", async () => {
    const mod = await import(`${scriptUrl}?t=${Date.now()}`);
    assert.equal(mod.resolveTogetherApiKey({}).ok, false);
    assert.equal(mod.resolveTogetherApiKey({ TOGETHER_API_KEY: "  " }).ok, false);
  });

  test("resolveTogetherApiKey accepts a trimmed env key", async () => {
    const mod = await import(`${scriptUrl}?t=${Date.now()}`);
    const resolved = mod.resolveTogetherApiKey({ TOGETHER_API_KEY: "  test-key  " });
    assert.equal(resolved.ok, true);
    assert.equal(resolved.key, "test-key");
  });
});

describe("generate-hero argument parsing", () => {
  test("missing args print usage and exit 1", () => {
    const result = runHero([]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Usage:/);
  });

  test("parseHeroArgs rejects path traversal and absolute paths", async () => {
    const mod = await import(`${scriptUrl}?t=${Date.now()}`);
    assert.equal(mod.parseHeroArgs(["Title", "../escape.png"]).ok, false);
    assert.equal(mod.parseHeroArgs(["Title", "/tmp/out.png"]).ok, false);
    assert.equal(mod.parseHeroArgs(["", "blog/ok.png"]).ok, false);
    const ok = mod.parseHeroArgs(["Title", "blog/ok-hero.png"]);
    assert.equal(ok.ok, true);
    assert.equal(ok.outputPath, "public/images/blog/ok-hero.png");
  });
});
