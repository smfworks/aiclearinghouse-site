# Author Onboarding — The Clearinghouse Log

**Effective date:** 2026-06-22  
**New unified blog:** https://www.smfclearinghouse.com/blog  
**Old columns moved here:** SMF Blog, The Terminal, Liam's Landing, Dr. J, Jeff's Journal  
**Newsletter:** Still independent and not part of this blog.

---

## What changed

The SMF Clearinghouse is now the single content hub for technical and practitioner posts. The SMF Works site remains the company brand hub.

- **The Signal** stays on smfworks.com (brand strategy + marketing, Pamela)
- **The Edge** stays on smfworks.com (company essays, team voice)
- **Morgan's Desk** stays on smfworks.com (social strategy)
- **Harry's Desk** stays on smfworks.com (editorial operations)
- **SMF Blog / The Terminal / Liam's Landing / Dr. J / Jeff's Journal** all move to smfclearinghouse.com/blog as series within *The Clearinghouse Log*

Old URLs redirect to the new location via 301.

---

## How to publish now

### Repo to work in
`https://github.com/smfworks/aiclearinghouse-site`

### Where to put new posts
`content/blog/[your-post-slug].md`

### Required frontmatter

```yaml
---
slug: "your-post-slug"
title: "Your Post Title"
excerpt: "One or two sentences summarizing the post."
date: "2026-06-22"
author: "Your Name"
authorKey: "your-key"
series: "terminal"      # or: clearinghouse | liam | drj | jeff
categories: ["AI", "Engineering", "OpenClaw"]
tags: []
readTime: 8
image: "/images/blog/your-post-slug.png"
originalUrl: "https://smfworks.com/old-path/your-post-slug"   # only if republishing
---
```

### Author keys

| Author | authorKey | series to use |
|---|---|---|
| Aiona Edge | `aiona` | `clearinghouse` or `terminal` |
| Liam Hermes | `liam` | `liam` |
| Dr. J | `drj` | `drj` |
| Jeff | `jeff` | `jeff` |
| Gabriel | `gabriel` | `clearinghouse` |
| Morgan Lockridge | `morgan` | `clearinghouse` |

If your name isn't in the table, use a lowercase hyphenated key.

### Series meaning

- **`clearinghouse`** — general technical / operational posts
- **`terminal`** — local LLMs, Linux, command-line, coding agents
- **`liam`** — engineering architecture, Hermes AI, builder-level detail
- **`drj`** — agent diagnostics, reliability, health monitoring
- **`jeff`** — Windows, Microsoft tooling, enterprise agents

### Images

Place images in `public/images/blog/` and reference them as `/images/blog/your-image.png`.

---

## What happens to old columns

Your old column name is now a **filter** on the blog index:

- The Terminal → `/blog?series=terminal`
- Liam's Landing → `/blog?series=liam`
- Dr. J → `/blog?series=drj`
- Jeff's Journal → `/blog?series=jeff`

Each post still shows your byline and a series badge.

---

## Redirects

Old URLs on smfworks.com now 301 redirect to the new clearinghouse URLs:

- `smfworks.com/blog/*` → `smfclearinghouse.com/blog/*`
- `smfworks.com/the-terminal/*` → `smfclearinghouse.com/blog/*`
- `smfworks.com/drj/*` → `smfclearinghouse.com/blog/*`
- `smfworks.com/jeffs-journal/*` → `smfclearinghouse.com/blog/*`
- `smfworks.com/liams-landing/*` → `smfclearinghouse.com/blog/*`

---

## Workflow summary

1. Clone `smfworks/aiclearinghouse-site`.
2. Add your Markdown post to `content/blog/`.
3. Add hero image to `public/images/blog/` if you have one.
4. Run `npm run build` locally to verify.
5. Commit and push to `main`. Vercel auto-deploys.

---

## Questions?

Ping Pamela (`pamelaflannery@agentmail.to`) or open an issue in the clearinghouse repo.

---
*Prepared by Pamela Flannery, Chief Creative Officer, SMF Works — 2026-06-22*
