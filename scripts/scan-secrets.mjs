#!/usr/bin/env node
/**
 * Fail-closed scan for high-confidence live credential material.
 * Documentation placeholders such as sk_live_... or ghp_\\w+ are allowed.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FORBIDDEN = [
  { name: "together_key", re: /tgp_v1_[A-Za-z0-9_-]{16,}/ },
  { name: "github_pat", re: /ghp_[A-Za-z0-9]{20,}/ },
  { name: "github_fine_grained", re: /github_pat_[A-Za-z0-9_]{20,}/ },
  { name: "stripe_live", re: /sk_live_[A-Za-z0-9]{16,}/ },
  { name: "aws_access_key", re: /AKIA[0-9A-Z]{16}/ },
  {
    name: "private_key_block",
    re: /-----BEGIN (?:(?:RSA|EC|OPENSSH|DSA) )?PRIVATE KEY-----\s+[A-Za-z0-9+/=\n\r]{64,}\s*-----END/,
  },
];

const SKIP_SUFFIXES = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".woff",
  ".woff2",
  ".ico",
  ".pdf",
  ".mp4",
  ".lock",
]);

function trackedFiles() {
  const out = execFileSync("git", ["ls-files", "-z"], { cwd: repoRoot });
  return out
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .filter((rel) => !SKIP_SUFFIXES.has(path.extname(rel).toLowerCase()));
}

export function scanContents(rel, text) {
  const hits = [];
  for (const rule of FORBIDDEN) {
    if (rule.re.test(text)) {
      hits.push({ file: rel, rule: rule.name });
    }
  }
  return hits;
}

export function scanRepository() {
  const hits = [];
  for (const rel of trackedFiles()) {
    const abs = path.join(repoRoot, rel);
    let text;
    try {
      text = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    hits.push(...scanContents(rel, text));
  }
  return hits;
}

const invokedDirectly =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (invokedDirectly) {
  const hits = scanRepository();
  if (hits.length) {
    console.error("Secret scan failed. High-confidence credential material found:");
    for (const hit of hits) {
      console.error(`  ${hit.rule}: ${hit.file}`);
    }
    process.exit(1);
  }
  console.log(`Secret scan passed (${trackedFiles().length} tracked text files).`);
}
