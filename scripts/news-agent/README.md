# SMF Clearinghouse AI News Agent

Autonomous agent that curates AI news headlines and publishes them to the clearinghouse site.

## How it works

- Runs on GitHub Actions every 6 hours (4x daily)
- Fetches RSS/Atom feeds from a wide net of AI/tech sources
- Categorizes each story into one of: Models, Agents, Product Launches, APIs, Open Source, Regulation, Security, Deals, Hardware
- Writes one Markdown file per story in `content/ai-news/`
- Adds a one-sentence summary to each story
- Enforces a 100-story cap by deleting oldest stories
- Commits and pushes to `main`; Vercel auto-redeploys

## Manual run

```bash
cd scripts/news-agent
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

## Adding sources

Edit `config.py` and add RSS/Atom feed URLs to `FEEDS`.

## Tuning categorization

Edit `CATEGORY_KEYWORDS` in `config.py`.

## File format

Each story becomes:

```markdown
---
slug: unique-slug
 title: "Headline"
url: "https://source.com/article"
source: "Source Name"
published_at: "2026-06-15T18:00:00Z"
category: "Models"
tags:
  - openai
  - gpt-5
order: 1
---

One-sentence summary.
```
