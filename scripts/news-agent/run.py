"""Main entry point for the SMF Clearinghouse AI News agent."""

import logging
import subprocess
import sys
from pathlib import Path

from fetch import fetch_all_stories
from publish import add_new_stories, enforce_cap
from config import REPO_ROOT, STORIES_PER_RUN

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)


def run_git_command(args: list[str]) -> None:
    result = subprocess.run(
        ["git", *args],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        logger.error(f"git {' '.join(args)} failed: {result.stderr}")
        sys.exit(1)
    if result.stdout:
        logger.info(result.stdout.strip())


def main() -> None:
    logger.info("Fetching AI news stories...")

    stories = list(fetch_all_stories(limit_per_feed=15))
    logger.info(f"Fetched {len(stories)} candidate stories")

    # Sort newest first, prefer newer stories
    stories.sort(key=lambda s: s["published_at"], reverse=True)

    written = add_new_stories(stories)
    logger.info(f"Wrote {len(written)} new stories")

    if not written:
        logger.info("No new stories to publish. Exiting.")
        return

    deleted = enforce_cap()
    logger.info(f"Removed {len(deleted)} old stories to maintain cap")

    # Git commit and push
    run_git_command(["config", "user.name", "SMF News Agent"])
    run_git_command(["config", "user.email", "news-agent@smfworks.com"])
    run_git_command(["add", "content/ai-news/"])

    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    if not status.stdout.strip():
        logger.info("No changes to commit.")
        return

    run_git_command(["commit", "-m", f"news: update AI news feed (+{len(written)} stories, -{len(deleted)} old)"])
    run_git_command(["push", "origin", "main"])
    logger.info("News feed updated and pushed.")


if __name__ == "__main__":
    main()
