"""Fetch and parse RSS feeds for AI news."""

import logging
from typing import Iterator

import feedparser
import requests

from config import FEEDS
from utils import parse_published, summarize, categorize, should_skip, make_slug, format_iso, sanitize_tags

logger = logging.getLogger(__name__)


def fetch_feed(url: str, timeout: int = 30) -> feedparser.FeedParserDict | None:
    """Fetch a single feed, falling back to direct HTTP if feedparser fails."""
    try:
        parsed = feedparser.parse(url, request_headers={"User-Agent": "SMF-News-Agent/1.0"})
        if parsed.entries:
            return parsed
    except Exception as e:
        logger.warning(f"feedparser failed for {url}: {e}")

    try:
        response = requests.get(url, timeout=timeout, headers={"User-Agent": "SMF-News-Agent/1.0"})
        response.raise_for_status()
        return feedparser.parse(response.content)
    except Exception as e:
        logger.warning(f"HTTP fetch failed for {url}: {e}")
        return None


def extract_story(entry, feed_url: str) -> dict | None:
    """Normalize a feed entry into our story format."""
    title = getattr(entry, "title", "").strip()
    link = getattr(entry, "link", "").strip()
    if not title or not link:
        return None

    # Prefer media_content, then summary, then description, then content
    raw_description = (
        getattr(entry, "summary", "")
        or getattr(entry, "description", "")
        or ""
    )
    summary = summarize(raw_description)

    if should_skip(link, title, summary):
        return None

    published_dt = parse_published(entry)

    tags = []
    if hasattr(entry, "tags"):
        for tag in entry.tags:
            term = getattr(tag, "term", "")
            if term:
                tags.append(term)
    tags = sanitize_tags(tags)

    source = getattr(entry, "source", {}).get("title", "") if hasattr(entry, "source") else ""
    if not source:
        source = feed_url.split("/")[2].replace("www.", "").split(".")[0].capitalize()

    return {
        "slug": make_slug(title, link),
        "title": title,
        "url": link,
        "source": source,
        "published_at": format_iso(published_dt),
        "category": categorize(title, summary),
        "tags": tags,
        "summary": summary,
    }


def fetch_all_stories(limit_per_feed: int = 10) -> Iterator[dict]:
    """Yield stories from all configured feeds."""
    seen_urls = set()
    for feed_url in FEEDS:
        feed = fetch_feed(feed_url)
        if not feed:
            logger.warning(f"Could not fetch feed: {feed_url}")
            continue

        entries = getattr(feed, "entries", [])[:limit_per_feed]
        for entry in entries:
            story = extract_story(entry, feed_url)
            if not story:
                continue
            if story["url"] in seen_urls:
                continue
            seen_urls.add(story["url"])
            yield story
