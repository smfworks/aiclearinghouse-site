"""Write stories to markdown files and enforce the 100-link cap."""

import re
import logging
from pathlib import Path
from datetime import datetime, timezone

import yaml

from config import NEWS_DIR, MAX_STORIES, STORIES_PER_RUN
from utils import format_iso

logger = logging.getLogger(__name__)


def load_existing_stories() -> list[dict]:
    stories = []
    if not NEWS_DIR.exists():
        return stories
    for path in NEWS_DIR.glob("*.md"):
        try:
            text = path.read_text(encoding="utf-8")
            if not text.startswith("---"):
                continue
            parts = text.split("---", 2)
            if len(parts) < 3:
                continue
            frontmatter = yaml.safe_load(parts[1])
            stories.append({
                "path": path,
                "published_at": frontmatter.get("published_at", "1970-01-01T00:00:00Z"),
                "url": frontmatter.get("url", ""),
            })
        except Exception as e:
            logger.warning(f"Failed to read {path}: {e}")
    return stories


def write_story(story: dict) -> Path:
    NEWS_DIR.mkdir(parents=True, exist_ok=True)
    path = NEWS_DIR / f"{story['slug']}.md"
    tags = story.get("tags", []) or []
    # Escape quotes in title/source/summary
    safe_title = story['title'].replace('"', '\\"')
    safe_source = story['source'].replace('"', '\\"')
    safe_summary = story.get('summary', '').replace('"', '\\"').strip()

    content = f"""---
slug: {story['slug']}
title: "{safe_title}"
url: "{story['url']}"
source: "{safe_source}"
published_at: "{story['published_at']}"
category: "{story['category']}"
tags:
{chr(10).join(f'  - "{tag}"' for tag in tags) if tags else '  - ai-news'}
order: 1
---

{safe_summary}
"""
    path.write_text(content, encoding="utf-8")
    return path


def add_new_stories(new_stories: list[dict]) -> list[Path]:
    existing = load_existing_stories()
    existing_urls = {s["url"] for s in existing}

    written = []
    for story in new_stories:
        if story["url"] in existing_urls:
            continue
        path = write_story(story)
        written.append(path)
        existing_urls.add(story["url"])
        if len(written) >= STORIES_PER_RUN:
            break

    return written


def enforce_cap() -> list[Path]:
    stories = load_existing_stories()
    if len(stories) <= MAX_STORIES:
        return []

    # Sort oldest first
    stories.sort(key=lambda s: s["published_at"])
    to_delete = stories[:-MAX_STORIES]
    deleted = []
    for s in to_delete:
        s["path"].unlink()
        deleted.append(s["path"])
    return deleted
