"""Utility functions for the news agent."""

import re
import hashlib
from datetime import datetime, timezone
from urllib.parse import urlparse

from config import CATEGORY_KEYWORDS, BLOCKED_DOMAINS, BLOCKED_PHRASES, CATEGORIES


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[-\s]+", "-", text).strip("-")
    return text[:80]


def make_slug(title: str, url: str) -> str:
    base = slugify(title) or "story"
    url_hash = hashlib.sha256(url.encode()).hexdigest()[:8]
    return f"{base}-{url_hash}"


def parse_published(entry) -> datetime:
    """Best-effort published date parsing from feed entry."""
    for field in ["published_parsed", "updated_parsed", "created_parsed"]:
        value = getattr(entry, field, None)
        if value:
            try:
                return datetime(*value[:6], tzinfo=timezone.utc)
            except (ValueError, TypeError):
                continue
    return datetime.now(timezone.utc)


def format_iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def summarize(text: str, max_chars: int = 160) -> str:
    """Extract a one-sentence summary from description text."""
    if not text:
        return ""
    # Strip HTML-ish tags and collapse whitespace
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    # Take first sentence if available, else first max_chars chars
    sentences = re.split(r"(?<=[.!?])\s+", cleaned)
    summary = sentences[0] if sentences else cleaned
    if len(summary) > max_chars:
        summary = summary[: max_chars - 3].rsplit(" ", 1)[0] + "..."
    return summary


def categorize(title: str, summary: str) -> str:
    text = f"{title} {summary}".lower()
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw.lower() in text)
        if score:
            scores[category] = score
    if scores:
        return max(scores, key=scores.get)
    return "Product Launches"


def should_skip(url: str, title: str, summary: str) -> bool:
    domain = urlparse(url).netloc.lower()
    if any(blocked in domain for blocked in BLOCKED_DOMAINS):
        return True
    combined = f"{title} {summary}".lower()
    if any(phrase in combined for phrase in BLOCKED_PHRASES):
        return True
    return False


def sanitize_tags(tags: list[str]) -> list[str]:
    """Clean and limit tags."""
    cleaned = []
    for tag in tags:
        tag = re.sub(r"[^\w\s-]", "", tag).strip().lower()
        if tag and len(tag) <= 30 and tag not in cleaned:
            cleaned.append(tag)
    return cleaned[:5]
