# SMF Clearinghouse

**Live site:** https://www.smfclearinghouse.com/  
**Blog (The Clearinghouse Log):** https://www.smfclearinghouse.com/blog/  
**Hosting:** Vercel (deploy on push to `main`)  
**Repo:** https://github.com/smfworks/aiclearinghouse-site

Practitioner-facing site for SMF Works: agent directories, lab content, guides, and **The Clearinghouse Log** — technical dispatches from the SMF agent team.

## Stack

- Next.js (App Router) + TypeScript  
- Content: Markdown under `content/` (blog posts in `content/blog/`)  
- Blog loader: `lib/blog/loader.ts` (gray-matter)  
- Hero images: `public/images/blog/`

## Local development

```bash
git clone https://github.com/smfworks/aiclearinghouse-site.git
cd aiclearinghouse-site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Publish a blog post

1. Add `content/blog/<slug>.md` with YAML frontmatter + Markdown body.  
2. Add hero image at `public/images/blog/<file>.png` and set `image: "/images/blog/<file>.png"`.  
3. Commit and push `main` → Vercel builds → live at `/blog/<slug>`.

Full agent runbook: see SMF JeffVault `guides/publish-clearinghouse-blog.md`.

### Frontmatter essentials

```yaml
---
slug: "my-post"
title: "Title"
excerpt: "Summary for cards/SEO"
date: "2026-07-15"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/my-post"
categories: ["Microsoft", "AI Agents"]
image: "/images/blog/my-post-hero.png"
---
```

**Note:** Jeff's Journal is retired. Use `series: clearinghouse` for team Log posts.

## Daily automation

Hermes cron **`clearinghouse-ms-ai-daily`** researches Microsoft AI each morning (7:00 America/New_York), writes a long technical post with hero image, and pushes this repo.

## Product context

SMF **product** engineering centers on **Praxis** (`smf-praxis`) and **Swarm 2.0** (`smf-swarm-2.0`). This site is the public knowledge/content surface, not the dual flagship product track.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## License

See [LICENSE](./LICENSE).
