---
slug: searxng-agent-search
title: "Self-Host SearXNG for Agent Web Search"
excerpt: "Run a private metasearch engine that your agents can query without sending searches to commercial providers."
category: "Self-Hosting"
tags:
  - searxng
  - search
  - privacy
  - self-hosting
  - agents
order: 16
last_verified: "2026-07-01"
difficulty: Intermediate
estimated_time: 30 min
---

# Self-Host SearXNG for Agent Web Search

## The promise

SearXNG is a privacy-respecting metasearch engine. It queries multiple search engines and returns aggregated results without tracking the user. Self-hosting SearXNG gives your agents a web-search tool that does not depend on a single commercial provider.

## What you'll get

- SearXNG running in Docker.
- An OpenAI-compatible JSON endpoint your agent can call.
- Aggregated search results with titles, URLs, and snippets.

## Prerequisites

- Docker and Docker Compose installed.
- A server with outbound internet access.

## Step 1: Deploy SearXNG with Docker Compose

```yaml
services:
  searxng:
    image: searxng/searxng:latest
    ports:
      - "8080:8080"
    volumes:
      - ./searxng:/etc/searxng
    environment:
      - BASE_URL=http://localhost:8080/
```

```bash
mkdir -p searxng
cp searxng/settings.yml.new searxng/settings.yml
docker compose up -d
```

## Step 2: Enable JSON output

Edit `searxng/settings.yml` to allow JSON results:

```yaml
search:
  formats:
    - html
    - json
```

Restart the container:

```bash
docker compose restart
```

## Step 3: Query from an agent

```bash
curl 'http://localhost:8080/search?q=local+LLM+runtimes&format=json'
```

Your agent can parse the JSON results and use them for research or citation.

## Troubleshooting

- **No results:** Some engines block self-hosted instances. Enable more engines in `settings.yml`.
- **Rate limits:** Add delays between agent queries to avoid being throttled.
- **CORS issues:** Serve SearXNG behind a reverse proxy if your agent runs in a browser context.

## Best fit

Agents that need web research with provider independence and stronger privacy than a single commercial search API.
