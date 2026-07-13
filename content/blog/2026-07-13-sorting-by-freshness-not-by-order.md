---
slug: "2026-07-13-sorting-by-freshness-not-by-order"
title: "Sorting by Freshness, Not by Order: How We Made the Clearinghouse Surface Recent Content First"
excerpt: "Three directory pages — Tips & Tricks, Deployment Recipes, and How-To Guides — now sort by last-verified date descending instead of a static editorial order number. A small change with an outsized impact on what readers see first. Here is what we changed, why, and what it took."
date: "2026-07-13"
author: "Pamela Flannery"
authorKey: "pamela"
series: "clearinghouse"
categories: ["Site Update", "Building in Public", "Content Strategy"]
tags: ["site-update", "freshness", "sorting", "nextjs", "transparency", "content-ops"]
readTime: 6
image: "/images/blog/2026-07-13-sorting-by-freshness-not-by-order.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-13-sorting-by-freshness-not-by-order"
---

# Sorting by Freshness, Not by Order: How We Made the Clearinghouse Surface Recent Content First

SMF Works builds in public. That means when we ship a change to the site, we write about it — not because every tweak deserves a blog post, but because transparency is one of our hallmarks. Readers should know what changed, why, and what trade-offs we accepted.

Today's change is small in code and large in impact: **three directory pages now sort by most-recently-verified content first.**

---

## The Problem

The SMF Clearinghouse has three major directory pages:

- **[Tips & Tricks](/tips/)** — 27 practical habits for working with AI agents
- **[Deployment Recipes](/deployment-recipes/)** — 19 copy-paste setup guides for local AI infrastructure
- **[How-To Guides](/guides/)** — 23 deep-dive articles on agent architecture, evaluation, and security

Each content file carries a frontmatter field called `last_verified` — the date we last confirmed the content is current. Some tips were verified today. Others were last verified 28 days ago. A few older entries date back further.

Until this morning, all three directories sorted by a static `order` field — an integer assigned by an editor when the content was created. The order field was never updated after initial publication. That meant a tip verified today could appear *below* a tip verified a month ago, simply because the older tip had a lower order number.

That is not how a living reference site should work. When a reader lands on `/tips/`, the first thing they see should be the freshest, most recently checked content — not whatever was assigned `order: 1` six months ago.

---

## What We Changed

### Tips & Tricks (`/tips/`)

The `TipsDirectoryClient` component sorted its filtered list by the `order` field:

```ts
// Before
let base = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
```

We replaced that with a sort by `last_verified` descending:

```ts
// After
let base = [...items].sort((a, b) => {
  const aDate = a.last_verified ? new Date(String(a.last_verified)).getTime() : 0;
  const bDate = b.last_verified ? new Date(String(b.last_verified)).getTime() : 0;
  return bDate - aDate;
});
```

Now the page opens with tips verified today — "Log Token Cost Per Task, Not Per Day," "Prefer Cite-or-Abstain Over Confident Guessing," "Separate Draft Autonomy From Send Authority" — and older tips fall below in reverse-chronological order.

### Deployment Recipes (`/deployment-recipes/`)

The `DeploymentRecipesClient` component had no explicit sort at all — it relied on the loader's default sort, which also prioritized `order`. We added a `.sort()` call to the filtered results chain:

```ts
const filtered = items
  .filter((item) => { /* ... search + tag matching ... */ })
  .sort((a, b) => {
    const aDate = a.last_verified ? new Date(String(a.last_verified)).getTime() : 0;
    const bDate = b.last_verified ? new Date(String(b.last_verified)).getTime() : 0;
    return bDate - aDate;
  });
```

Recipes verified today — "Deploy vLLM as an OpenAI-Compatible Server," "Open WebUI + Ollama for a Local Chat Front Door," "LiteLLM Proxy for Multi-Provider Routing" — now appear first.

### How-To Guides (`/guides/`)

The `GuidesDirectoryClient` component used the same `order`-based sort in a `useMemo`:

```ts
// Before
const allSorted = useMemo(() => {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
}, [items]);
```

Same fix — sort by `last_verified` descending:

```ts
// After
const allSorted = useMemo(() => {
  return [...items].sort((a, b) => {
    const aDate = a.last_verified ? new Date(String(a.last_verified)).getTime() : 0;
    const bDate = b.last_verified ? new Date(String(b.last_verified)).getTime() : 0;
    return bDate - aDate;
  });
}, [items]);
```

Guides verified today now lead the directory, followed by 12-day-old entries, then 27-day-old ones.

---

## Why `last_verified` and Not `published_at`

Some content files carry a `published_at` date, but not all do — it was introduced partway through the site's life. `last_verified`, on the other hand, is present on every single content file because it is part of our content schema requirements. It also better reflects what readers care about: not when something was first written, but when it was last confirmed to be accurate.

A tip published in June and re-verified today is more trustworthy than a tip published today and never checked again. Sorting by `last_verified` rewards the discipline of re-verification — which is exactly the behavior we want to encourage in our own content operations.

---

## What About Content Without a `last_verified` Date?

The sort handles missing dates gracefully: entries without `last_verified` get a timestamp of `0`, which pushes them to the bottom of the list. This is intentional — if we have not verified a piece of content, it should not appear above content we have.

---

## The `turbopack.root` Fix

While building, we hit a Turbopack issue: the build failed because Next.js could not infer the workspace root (multiple `package-lock.json` files exist in the parent directory tree). We added `turbopack.root` to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    root: __dirname,
  },
};
```

This was a pre-existing issue that surfaced during the build. Worth noting for anyone else running Next.js 16 with Turbopack in a monorepo-adjacent directory structure.

---

## Files Changed

| File | Change |
|------|--------|
| `components/TipsDirectoryClient.tsx` | Sort by `last_verified` desc instead of `order` asc |
| `components/DeploymentRecipesClient.tsx` | Add `.sort()` by `last_verified` desc to filtered results |
| `components/GuidesDirectoryClient.tsx` | Sort by `last_verified` desc instead of `order` asc |
| `next.config.ts` | Add `turbopack.root` to fix workspace root detection |

All changes committed to `main` and deployed to production via Vercel.

---

## Verification

After deploying, we loaded all three pages live and confirmed the ordering:

- **`/tips/`** — First card: "Log Token Cost Per Task, Not Per Day" (Verified today). Last cards: "Start Small" and "Watch Token Costs" (Verified 28 days ago). ✅
- **`/deployment-recipes/`** — First card: "Deploy vLLM as an OpenAI-Compatible Server" (last_verified: 2026-07-13). Mid-section: recipes from 2026-07-01. Bottom: recipes from 2026-06-15. ✅
- **`/guides/`** — First entries: five guides "Verified today." Next: three "Verified 12 days ago." Then: "Verified 27 days ago." ✅

Build passed. Lint passed (0 new errors). No pre-existing issues worsened.

---

## What This Means for Readers

If you visit the Clearinghouse looking for the most current guidance on working with AI agents, you will now see it first — on all three directory pages. Content that has not been re-verified recently sinks lower. Content that was checked today rises to the top.

This is a small change — three sort functions and a config fix. But it aligns the site with a core principle: **the freshest verified content should be the first content you see.**

---

*To learn more follow @MichaelGannotti on X.