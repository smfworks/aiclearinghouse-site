# SMF Clearinghouse — Roadmap to The Definitive AI Destination

**Date:** 2026-06-15
**Context:** Baseline site built today with 22 agents, 9 services, 12 deployment recipes, 6 guides, 11 tips, 6 benchmarks, autonomous AI News agent, and fully redesigned UI across every section.
**Goal:** Move from "comprehensive AI clearinghouse" to **the definitive destination** for AI builders, buyers, researchers, and operators.

---

## 1. Today's Baseline (What We Shipped)

| Section | Status | Strengths | Remaining Gap |
|---------|--------|-----------|---------------|
| **Homepage** | Strong | Search, directory grid, featured spotlight, live counts | No dynamic "what's new" pulse, no hero video |
| **Agents** | Excellent | 22 agents, per-agent colors, cross-links, structured detail cards | Missing agent logos/avatars, no embedded demos |
| **Guides** | Excellent | 6 rewritten, deep, formatted bookmark-worthy guides | Still using shared hero image; no diagrams |
| **Services** | Excellent | 9 evaluated services with provider/pricing cards | No screenshots of dashboards, no integration diagrams |
| **Deployment Recipes** | Excellent | 12 tested runbooks with steps, difficulty, time | No terminal screenshots, no before/after visuals |
| **Tests/Benchmarks** | Excellent | 6 benchmarks with SVG charts and results tables | No actual recorded logs/terminal captures |
| **Tips** | Excellent | 11 practical, structured tips | No quick-reference cards or printable formats |
| **AI News** | Good foundation | Citizen Free Press-style feed, category grouping | Needs real RSS population via GitHub Actions |
| **Self-Hosting / Use Cases / Alternatives / Deals / Safety / Lab / Changelog** | Improved with colored cards | Consistent directory styling | Content is still thinner than core sections |
| **LLMs / Skills** | Existing | Functional | Not yet visually or editorially elevated |

**Content count:** ~248 files, ~12,000 lines of markdown.
**Build status:** Clean static export, no BAILOUT, pushed to GitHub/Vercel.

---

## 2. What Makes a Site "Definitive"?

A definitive destination must be:

1. **Authoritative** — every claim is tested, dated, and sourced
2. **Useful** — visitors leave with something they can apply today
3. **Alive** — it updates constantly and rewards repeat visits
4. **Beautiful** — visual trust signals that this is a premium resource
5. **Fast** — no friction between question and answer
6. **Connected** — every page leads naturally to the next
7. **Trustworthy** — honest limitations, no vendor puffery

The baseline already nails #1, #2, and #6. Tomorrow we go after #3, #4, #5, and #7.

---

## 3. Media & Visual Strategy

### A. Every section needs its own visual identity

Right now the site has a strong dark theme but few original visuals. A definitive site needs:

| Section | Visual Asset Type | Purpose |
|---------|-------------------|---------|
| **Homepage** | Hero video or animated SVG | Establish "this is the future of AI tools" |
| **Agents** | Per-agent SVG avatars / icons | Instant recognition, shareability |
| **Guides** | SVG diagrams per guide | Turn frameworks into memorable visuals |
| **Recipes** | Terminal screenshots + architecture diagrams | Prove the commands actually work |
| **Tests** | Terminal/video captures + charts | Show, don't tell |
| **Services** | Dashboard/product screenshots | Visual proof of capability |
| **Tips** | Illustrated cards / social carousels | Make tips shareable |
| **AI News** | Source favicons + category icons | Dense, scannable identity |

### B. Generated vs. authentic visuals

- **Use generated images for:** hero backgrounds, concept illustrations, agent avatars, guide diagrams
- **Use authentic screenshots for:** recipe outputs, service dashboards, test results
- **Use SVG for:** charts, architecture diagrams, icons (scalable, fast)
- **Avoid:** generic stock photos, watermarked assets, broken image links

### C. Brand visual system to define

- Hero illustration style (abstract geometric? photorealistic? isometric?)
- Agent avatar generator (consistent faceless icons vs. brand logos)
- Chart color palette for tests/benchmarks
- Diagram language (boxes, arrows, colors for local/cloud/agent/model)
- Thumbnail templates for social sharing

---

## 4. Video & Audio Strategy

### A. Embedded explainers (short form)

For each high-traffic section, create a 60–90 second embedded video:

- **Homepage:** "What is SMF Clearinghouse?" (60s)
- **Guides / Evaluating an Agent:** "How to evaluate an AI agent in 14 days" (90s)
- **Tests:** "We tested 4 coding agents. Here's what happened." (90s)
- **Tips:** "5 rules for safe agent workflows" (60s)
- **Recipes:** "Deploy Ollama on macOS in 15 minutes" (walkthrough)

**Production approach:** Use HyperFrames/screen capture + voiceover, or synthetic avatar if budget allows.

### B. Audio / podcast potential

- Weekly 10-minute "AI Clearinghouse Update" audio summary
- Read-aloud versions of top guides
- Interview format with founders of featured agents/services

### C. Accessibility benefit

- Every video needs captions
- Every guide should have a downloadable PDF option
- Every chart needs alt text / data table

---

## 5. Content Depth — Next Level by Section

### Agents Directory
- [ ] Add agent logos/avatars (SVG, consistent)
- [ ] Add embedded demo links or video walkthroughs
- [ ] Add "pricing calculator" interactive widget
- [ ] Add comparison matrix export (PDF/CSV)
- [ ] Add user-submitted reviews/ratings
- [ ] Expand to 30+ agents (Cody, Tabnine, Codeium, Amazon Q, Gemini Code Assist, etc.)
- [ ] Add "agent pairings" — which agents work well together

### Guides
- [ ] Add SVG diagrams for every framework (decision trees, rubrics, cost models)
- [ ] Add downloadable checklist PDFs
- [ ] Add interactive calculators (cost, hardware sizing)
- [ ] Add real case studies with anonymized team stories
- [ ] Add "common stack combinations" — guide cross-links as recommended reading paths

### Services
- [ ] Add real screenshots from each service dashboard
- [ ] Add architecture diagrams showing where each service fits
- [ ] Add integration code snippets (MCP configs, API examples)
- [ ] Add honest pricing comparisons side-by-side
- [ ] Expand to 15–20 services

### Deployment Recipes
- [ ] Add terminal screenshots at each step
- [ ] Add architecture diagrams (before/after)
- [ ] Add "expected output" screenshots
- [ ] Add one-click deploy buttons where possible
- [ ] Add estimated cost widgets
- [ ] Add difficulty filters and learning paths

### Tests / Benchmarks
- [ ] Record actual terminal sessions as video/GIFs
- [ ] Add raw log downloads for transparency
- [ ] Add reproducibility sections (exact prompts, repos, commits)
- [ ] Add leaderboard index across all benchmarks
- [ ] Add community-submitted benchmark proposals

### Tips
- [ ] Convert tips into printable social cards
- [ ] Add "tip of the day" widget on homepage
- [ ] Create tip playlists by role (beginner, CTO, security, etc.)
- [ ] Add short video versions

### AI News
- [ ] Get GitHub Actions workflow live with real RSS feeds
- [ ] Add source favicons
- [ ] Add trending / most-clicked tracking
- [ ] Add daily/weekly newsletter export
- [ ] Add "yesterday's top 5" sidebar

---

## 6. Interactive & Trust Features

### Interactive tools to build
- [ ] **Agent matcher:** answer 5 questions → get recommended agent stack
- [ ] **Cost calculator:** estimate monthly LLM/agent spend
- [ ] **Hardware recommender:** what GPU/laptop for local models
- [ ] **Stack builder:** drag-and-drop agent + model + infra + services
- [ ] **Prompt evaluator:** paste prompt, get safety/risk score

### Trust signals
- [ ] "Last verified" date on every page (already present)
- [ ] Methodology callouts on every benchmark and review
- [ ] "We are not sponsored by any vendor" statement
- [ ] Editorial process page explaining how content is made
- [ ] Public changelog of site updates
- [ ] Raw data downloads (benchmark scores, agent specs CSV)

---

## 7. Growth & Community Features

- [ ] **Newsletter signup** for weekly AI digest
- [ ] **RSS feed** for the whole site and per-section feeds
- [ ] **Twitter/X cards** for every page (already need meta images)
- [ ] **Open Graph images** auto-generated per page
- [ ] **GitHub Discussions** integration for community Q&A
- [ ] **Submit a tool/agent/service** form
- [ ] **Community benchmark submissions** with verification
- [ ] **Weekly changelog post** summarizing site updates

---

## 8. Technical & Performance

- [ ] Lighthouse audit and fix performance/accessibility scores
- [ ] Image optimization pipeline (WebP, responsive sizes)
- [ ] OG image generation at build time
- [ ] Search index improvements (currently only title/excerpt)
- [ ] Sitemap + structured data (Schema.org)
- [ ] Analytics dashboard for top pages and outbound clicks
- [ ] A/B test homepage variants
- [ ] Edge caching strategy for Vercel

---

## 9. 30 / 60 / 90 Day Roadmap

### Days 1–30: Media + Trust Foundation
1. Define visual identity system (hero style, agent avatars, chart palette)
2. Generate or commission homepage hero visual/video
3. Add per-agent SVG avatars
4. Add source favicons to AI News
5. Add OG image generation for all pages
6. Create editorial process / about page
7. Fix any remaining Lighthouse issues
8. Add newsletter signup component
9. Get AI News GitHub Actions workflow live

### Days 31–60: Interactive Tools + Deep Content
1. Build agent matcher tool
2. Build cost calculator widget
3. Add diagrams to all 6 guides
4. Add screenshots to all 12 deployment recipes
5. Expand agents to 30+
6. Add first 3 embedded explainer videos
7. Add raw data downloads for benchmarks
8. Add submit-a-tool form

### Days 61–90: Community + Scale
1. Launch community benchmark submissions
2. Weekly AI newsletter from news feed
3. Podcast/audio summaries
4. Stack builder interactive tool
5. GitHub Discussions integration
6. Analytics-driven content expansion
7. A/B test homepage and guide landing pages
8. Consider sponsorship model that preserves independence

---

## 10. Immediate Tomorrow Priorities (Recommended)

If we only do three things tomorrow, these have the highest impact:

1. **Homepage hero video/visual + OG images** — First impression defines whether people stay.
2. **Agent avatars + per-agent diagrams** — Makes the directory instantly more credible and shareable.
3. **AI News GitHub Actions workflow** — Makes the site alive with daily updates, creating a reason to return.

---

## 11. Content Assets to Create

| Asset | Quantity | Owner | Priority |
|-------|----------|-------|----------|
| Homepage hero visual/video | 1 | Pamela | Critical |
| Open Graph image template | 1 + per-page | Pamela | Critical |
| Agent SVG avatars | 30+ | Pamela | High |
| Guide diagrams | 6 | Pamela | High |
| Recipe terminal screenshots | 12 | Pamela | High |
| Service dashboard screenshots | 9 | Pamela | High |
| Test terminal recordings | 6 | Pamela | Medium |
| Tips social cards | 11 | Pamela | Medium |
| Audio summaries of top guides | 6 | Pamela | Medium |
| Weekly newsletter template | 1 | Pamela | Medium |

---

## 12. Measurement

Track weekly:
- Total pages / total word count
- Lighthouse performance score
- Build time
- Outbound link clicks (especially AI News and agent websites)
- Newsletter signups
- Time on page for guides and benchmarks
- Returning visitor rate

---

**Conclusion:** The baseline is strong. The next level is not more text — it is trust, beauty, motion, interactivity, and a living feed. We turn the clearinghouse into a destination people check daily, cite in meetings, and share in Slack.
