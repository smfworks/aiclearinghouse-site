# SMF Clearinghouse — Next-Level Roadmap

**Goal:** Evolve the site from a useful directory into the definitive AI destination — richer media, deeper interactivity, stronger trust signals, and built-in distribution.

**Status:** Phase 1 visual foundation shipped (2026-06-15). News agent operational. Ready to tackle items sequentially.

---

## Phase 2: Media & Rich Content Layer

### 1. Agent Comparison Videos
- 60–90 second narrated walkthroughs of high-value matchups:
  - Claude Code vs Cursor
  - Cline vs GitHub Copilot
  - v0 vs Lovable
  - OpenHands vs Devin
  - Perplexity vs ChatGPT (research mode)
- Tools: MiniMax video generation, HeyGen for voiceover, or FLUX/screen-capture hybrid.
- Output: `public/videos/agents/<matchup>.mp4`
- Embed on dedicated comparison pages and agent detail pages.

### 2. Audio Explainers
- 2–3 minute audio clips per major section:
  - "What is an AI agent?"
  - "Local vs cloud runtime"
  - "How to choose a coding agent"
  - "What does 'open source' actually mean here?"
- Tools: MiniMax speech tool.
- Output: `public/audio/<topic>.mp3`
- Add play button on guide pages and hub.

### 3. Ambient Hero Motion
- Replace static homepage hero with subtle looping video or Lottie animation of connected AI nodes.
- Keep dark, premium feel; no loud motion.
- Fallback to static PNG for reduced-motion users.
- Output: `public/videos/hero-loop.mp4` or Lottie JSON.

### 4. Deployment Recipe Video Walkthroughs
- One short screen/animated video per recipe:
  - Ollama + CUDA
  - Open WebUI
  - Cline + local model
  - Microsoft Scout
  - OpenClaw
- Embed directly under each recipe.

---

## Phase 3: Interactive & Data-Driven Upgrades

### 5. Live / Auto-Updated Stats
- Real-time or scheduled data where possible:
  - LLM pricing from provider APIs
  - GitHub stars for open-source agents
  - Latest release dates from changelogs / RSS
- Display on homepage as a live ticker.
- Source cache in `data/live-stats.json` refreshed by cron or workflow.

### 6. Comparison Tables
- Sortable side-by-side agent comparison.
- Columns: price, runtime, context length, open source, multi-platform, provider agnostic, benchmark scores, last updated.
- URL: `/agents/compare?a=claude-code&b=cursor`
- Builds the "retrieval engine" Morgan identified in cold-start trust work.

### 7. Benchmark Visualizations
- Charts for:
  - Price per million tokens across LLMs
  - Context window sizes
  - Agent benchmark scores (SWE-bench, etc.)
- Use lightweight SVG charts or a small charting library (Recharts / Chart.js).
- Keep dark theme consistency.

### 8. "Best For" Decision Flow
- Interactive quiz:
  - "I want to ___" (code, build UI, research, self-host, automate)
  - "My budget is ___" (free, $20/mo, enterprise)
  - "I want to run ___" (cloud, local, hybrid)
- Recommend an agent + deployment recipe.
- Output: results page with CTA to agent detail or recipe.

---

## Phase 4: Trust & Freshness Signals

### 9. Expanded Freshness Badges
- Already partial. Expand to show:
  - Last tested date
  - Last updated date from source
  - Version freshness indicator

### 10. Cost-Per-Run Estimates
- Per agent: approximate cost per task or per hour.
- Per LLM: price per 1M input/output tokens.
- Display on detail pages and comparison tables.

### 11. Prominent Failure Mode Callouts
- "Honest limitations" section already exists. Elevate it:
  - Visual warning badge
  - Collapsible edge-case list
  - Link to community workarounds or alternative agents

### 12. Gold Thread Case Studies
- One vetted integration or real run log per agent.
- Format: problem → tool → result → gotcha.
- Builds trust legibility per Morgan's cold-start insight.

---

## Phase 5: Content Depth

### 13. The Lab Experiments
- Short experiment posts:
  - Local model shootouts
  - Prompt injection tests
  - Hardware speed tests
  - Multi-agent workflow tests
- Embed video/audio where possible.
- URL: `/lab/<experiment>`

### 14. Curated Alternatives Pages
- Top replacement picks for major tools:
  - Cursor alternatives
  - ChatGPT alternatives
  - GitHub Copilot alternatives
- Each page has comparison table + video + audio.

### 15. Weekly Clearinghouse Newsletter
- Auto-curated from AI News + new agents + top experiments.
- Signup CTA on homepage and news page.
- Deliver via email or RSS.

---

## Phase 6: Social / Distribution Layer

### 16. Dynamic Share Cards
- OG image already exists for homepage.
- Next: per-section cards and per-agent cards with dynamic stats.
- Could generate at build time or with `@vercel/og`.

### 17. RSS Feed for AI News
- Since the news agent already curates, expose `/ai-news/feed.xml`.
- Enables newsletter syndication and reader apps.

### 18. Newsletter Signup
- "Get the weekly clearinghouse" CTA.
- Store emails via form endpoint or ConvertKit/Mailchimp integration.

---

## Execution Order (Recommended)

1. **Comparison tables** — highest visitor utility, strongest differentiation.
2. **Audio explainers** — fast to produce, makes guides feel premium.
3. **Benchmark visualizations** — builds trust with data.
4. **Decision flow** — turns browsing into action.
5. **Agent comparison videos** — biggest wow factor, more production time.
6. **Dynamic share cards + RSS** — distribution multiplier.
7. **Live stats + The Lab** — ongoing freshness engine.

---

## Files Created

- `roadmap-next-level.md` (this file)
- Visual foundation: `components/HubClient.tsx`, `components/AgentCard.tsx`, `components/AgentDetail.tsx`, `components/HeroBackground.tsx`, `components/AINewsClient.tsx`
- Assets: `public/images/clearinghouse-hero.png`, `public/images/clearinghouse-og.png`, `public/images/agents-hero.png`, `public/images/guides-hero.png`, `public/images/news-hero.png`, `public/images/agents/*.svg`
- Agent infrastructure: `scripts/news-agent/`, `.github/workflows/news-agent.yml`

---

_Last updated: 2026-06-15 by Pamela_
