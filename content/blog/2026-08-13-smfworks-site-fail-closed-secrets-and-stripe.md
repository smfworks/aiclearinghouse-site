---
slug: "smfworks-site-fail-closed-secrets-and-stripe"
title: "Same Key, Second Site: Fail-Closed Heroes and a Stripe Placeholder"
excerpt: "smfworks.com shipped the same hardcoded Together.ai key plus a checkout path that would send Stripe the literal price_example. The hardening PR closes both."
date: "2026-08-13"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
canonicalUrl: "https://www.smfclearinghouse.com/blog/smfworks-site-fail-closed-secrets-and-stripe"
categories: ["Security", "Payments", "Production Hardening"]
tags: ["secrets", "stripe", "fail-closed", "smfworks", "ci"]
readTime: 7
image: "/images/blog/2026-08-13-smfworks-site-hardening.svg"
---

`smfworks/smfworks-site` at kickoff SHA `44ddcabdade7` had the same P0 as Clearinghouse: `scripts/generate-hero.mjs` held a live Together.ai key. Oversight issue [#2](https://github.com/smfworks/smfworks-site/issues/2) had been open since 2026-07-30.

It also had a quieter fail-open on the newsletter checkout path.

## Original state

| Surface | Before |
|---------|--------|
| Hero generator | Hardcoded Together.ai key |
| Tests | None |
| CI | None |
| `SECURITY.md` | Missing |
| `.env.example` | Documented in SETUP.md, not in the repo |
| `app/api/checkout/route.ts` | `price: process.env.STRIPE_PRICE_ID \|\| 'price_example'` |

Book checkout already rejected a missing or mismatched `priceId`. Newsletter checkout did not. If `STRIPE_SECRET_KEY` was set in Vercel and `STRIPE_PRICE_ID` was not, Stripe would receive the string `price_example`.

JWT issue/validate routes already failed closed without `SMF_JWT_*`. That pattern was the right one.

## Decision

Same hero-script contract as Clearinghouse: env only, fail closed, path-safe output, secret-scan CI. Plus:

```ts
const priceId = (process.env.STRIPE_PRICE_ID || '').trim();
if (!priceId || priceId === 'price_example') {
  return NextResponse.json(
    { error: 'STRIPE_PRICE_ID is required' },
    { status: 503 }
  );
}
```

No placeholder price ever reaches Stripe.

## What changed

PR: [smfworks/smfworks-site#3](https://github.com/smfworks/smfworks-site/pull/3)

```text
6d55d3a  fix: fail-closed Together.ai key handling
e328d39  fix: keep secret-scan fixtures from matching live-key regex
```

Verification on this machine:

```text
node --test tests/*.test.mjs   # 8 passed
node scripts/scan-secrets.mjs  # passed (911 tracked text files after git add)
```

The first scanner revision flagged `lib/google-sheets.ts` because it contains PEM *header strings* used to strip a runtime key. There is no key body in the file. The scanner now requires a PEM header plus a 64-character body before it fails.

## Remaining limits

- Rotate the Together.ai key. History is not rewritten.
- `lib/books.ts` still has `price_book*_placeholder` fallbacks for catalog display. Book *checkout* already validates the posted price against the catalog. That leftover is documented, not silently expanded in this PR.
- Success/cancel URLs still take `Origin` from the request. Inherited. Not part of this diff.
- README previously said `pnpm`; the lockfile and scripts are npm. The README now matches the repo.

## Lesson

Two copies of a generator is two copies of a secret. Deduplicating later is fine. Fail-closed env reads and a CI scan are the controls that stop the third copy.
