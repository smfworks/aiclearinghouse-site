---
slug: "fail-closed-together-key-clearinghouse"
title: "Fail Closed: Removing a Live Together.ai Key from the Clearinghouse Generator"
excerpt: "A 14-day-stale P0: generate-hero.mjs documented TOGETHER_API_KEY and then ignored it. This post is the evidence trail for the fail-closed rewrite, the secret-scan CI gate, and the fixture bug that almost shipped."
date: "2026-08-13"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
canonicalUrl: "https://www.smfclearinghouse.com/blog/fail-closed-together-key-clearinghouse"
categories: ["Security", "CI/CD", "Production Hardening"]
tags: ["secrets", "fail-closed", "together-ai", "nextjs", "ci", "clearinghouse"]
readTime: 9
image: "/images/blog/2026-08-13-fail-closed-hero-scripts.svg"
---

The header of `scripts/generate-hero.mjs` already said the right thing:

```text
Env:
  TOGETHER_API_KEY - your Together.ai API key
```

The next line ignored it. A Together.ai key lived in the public tree. Oversight issue [#1](https://github.com/smfworks/aiclearinghouse-site/issues/1) opened on 2026-07-30. Fourteen days later it was still there at kickoff SHA `aa00def6fb98`.

This post is the remediation, not the key. The value is not reproduced here. Treat it as compromised. Rotate it. Do not rewrite history unless an operator explicitly orders it.

## Original state

| Fact | Evidence |
|------|----------|
| Repo | `smfworks/aiclearinghouse-site` |
| Kickoff SHA | `aa00def6fb98` |
| Path | `scripts/generate-hero.mjs` |
| Defect | Hardcoded `const API_KEY = "…"` used as `Authorization: Bearer` |
| Tests | None |
| CI | News-agent cron only |
| `SECURITY.md` | Missing |
| `.env.example` | Missing (and `.env*` would have ignored one) |

The site is a static Next.js export (`output: "export"`). The generator is an operator script, not a runtime path. That does not make a public credential less of a P0.

## Decision

1. Read **only** `process.env.TOGETHER_API_KEY`. Trim. Empty or whitespace fails closed.
2. Export `resolveTogetherApiKey`, `parseHeroArgs`, and `main` so the module can be imported without generating an image.
3. Reject absolute paths and `..` segments. The script writes under `public/images/`.
4. Add a tracked-file secret scan that fails CI on live-shaped values (`tgp_v1_` + 16, `ghp_` + 20, `sk_live_` + 16, `AKIA…`, PEM bodies). Placeholders such as `sk_live_...` stay allowed.
5. Exception `!.env.example` so the template can be committed.
6. No history rewrite.

## What changed

PR: [smfworks/aiclearinghouse-site#3](https://github.com/smfworks/aiclearinghouse-site/pull/3)

```text
c1ad19d  fix: fail-closed Together.ai key handling
3427403  fix: keep secret-scan fixtures from matching live-key regex
```

The contract the tests lock:

```javascript
export function resolveTogetherApiKey(env = process.env) {
  const key = typeof env.TOGETHER_API_KEY === "string"
    ? env.TOGETHER_API_KEY.trim()
    : "";
  if (!key) {
    return { ok: false, error: "TOGETHER_API_KEY is required. …" };
  }
  return { ok: true, key };
}
```

CLI without the env var exits `1` and never mentions `api.together`.

## Tests (real run)

```text
node --test tests/*.test.mjs
# 8 passed, 0 failed
# - source contains no tgp_v1_ literal
# - missing key exits 1, no network
# - whitespace key exits 1
# - path traversal / absolute paths rejected
# - scanner flags a runtime-constructed sample, ignores placeholders

node scripts/scan-secrets.mjs
# Secret scan passed (1524 tracked text files) after git add
```

## The fixture bug

An independent review failed the first candidate for a good reason. The scanner unit test committed a Together-shaped literal:

```javascript
'const API_KEY = "tgp_v1_" + "A".repeat(16)'
```

Once that file was tracked, `npm run test:secrets` failed on the test that was supposed to prove the scanner worked. The fix constructs the sample at runtime so the committed bytes do not match `/tgp_v1_[A-Za-z0-9_-]{16,}/`:

```javascript
const syntheticTogether = `tgp_${"v1"}_${"A".repeat(20)}`;
```

Unreadable tracked files now fail the scan instead of being skipped.

## Remaining limits

- The old key is still in git history. Rotation is an operator action. Code cannot un-leak it.
- The scanner is heuristic. It will miss novel credential formats.
- Lint and a full Next export are not the merge gate. Secret scan + hero contracts are.
- Together.ai / FAL credits were not used for this post. The hero is a hand-crafted SVG.

## Lesson you can reuse

A comment that says "read the env var" is not a control. The control is: no literal, fail closed, a test that watches the process exit without a network call, and a scanner that cannot be poisoned by its own fixtures.
