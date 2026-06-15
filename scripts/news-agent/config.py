"""Configuration for the SMF Clearinghouse AI News agent."""

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
NEWS_DIR = REPO_ROOT / "content" / "ai-news"
MAX_STORIES = 100
STORIES_PER_RUN = 25

CATEGORIES = [
    "Models",
    "Agents",
    "Product Launches",
    "APIs",
    "Open Source",
    "Regulation",
    "Security",
    "Deals",
    "Hardware",
]

CATEGORY_KEYWORDS = {
    "Models": ["model", "gpt", "llm", "foundation model", "checkpoint", "weights", "training run", "benchmark"],
    "Agents": ["agent", "coding agent", "autonomous", "claude code", "cursor", "aider", "copilot", "codex"],
    "Product Launches": ["launch", "releases", "ships", "announces", "introduces", "new product", "workspace", "canvas"],
    "APIs": ["api", "sdk", "endpoint", "developer platform", "integration"],
    "Open Source": ["open source", "github", "huggingface", "ollama", "released on", "MIT license", "apache"],
    "Regulation": ["regulation", "ai act", "policy", "congress", "eu", "white house", "executive order"],
    "Security": ["security", "prompt injection", "jailbreak", "vulnerability", "audit", "safety"],
    "Deals": ["funding", "raised", "acquisition", "merger", "series", "investment"],
    "Hardware": ["gpu", "tpu", "nvidia", "apple silicon", "chip", "inferencing hardware"],
}

# Wide net of AI/tech RSS feeds
FEEDS = [
    # Company blogs
    "https://openai.com/news/rss.xml",
    "https://www.anthropic.com/news/rss.xml",
    "https://blog.google/products/ai/rss/",
    "https://ai.googleblog.com/feeds/posts/default",
    "https://www.microsoft.com/en-us/research/research-area/artificial-intelligence/rss/",
    "https://ollama.com/blog/rss.xml",
    "https://huggingface.co/blog/feed.xml",
    "https://blog.deepmind.com/rss.xml",
    "https://perplexity.ai/hub/blog/rss.xml",
    "https://elevenlabs.io/blog/rss.xml",

    # Tech publications
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    "https://arstechnica.com/ai/feed/",
    "https://www.wired.com/tag/artificial-intelligence/feed/",
    "https://www.zdnet.com/article/rss.xml",
    "https://www.engadget.com/ai/feed.xml",

    # AI-focused outlets
    "https://venturebeat.com/category/ai/feed/",
    "https://www.artificialintelligence-news.com/feed/",
    "https://www.marktechpost.com/feed/",
    "https://www.unite.ai/feed/",
    "https://analyticsindiamag.com/feed/",

    # General science/tech
    "https://www.reuters.com/technology/artificial-intelligence/rss.xml",
    "https://www.ft.com/artificial-intelligence?format=rss",
    "https://www.bloomberg.com/feeds/technology/news.rss",
]

BLOCKED_DOMAINS = [
    "spam-site.example",
]

BLOCKED_PHRASES = [
    "sponsored",
    "paid post",
    "advertorial",
]
