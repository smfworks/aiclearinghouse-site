"""Clean up existing AI News stories that fail the new relevance filter."""

import sys
from pathlib import Path

import yaml

from config import NEWS_DIR
from utils import is_ai_relevant, is_non_ai_noise, BLOCKED_PHRASES


def should_remove(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return False
    parts = text.split("---", 2)
    if len(parts) < 3:
        return False
    try:
        fm = yaml.safe_load(parts[1])
    except Exception:
        return False
    title = fm.get("title", "")
    summary = parts[2].strip()
    combined = f"{title} {summary}".lower()
    if any(phrase in combined for phrase in BLOCKED_PHRASES):
        return True
    if not is_ai_relevant(title, summary):
        return True
    if is_non_ai_noise(title, summary):
        return True
    return False


def main() -> None:
    removed = []
    for path in NEWS_DIR.glob("*.md"):
        if should_remove(path):
            print(f"REMOVE: {path.name}")
            path.unlink()
            removed.append(path.name)
    print(f"\nRemoved {len(removed)} non-AI stories out of {len(list(NEWS_DIR.glob('*.md'))) + len(removed)} total.")


if __name__ == "__main__":
    main()
