"""Configuration for the SMF Clearinghouse AI News agent."""

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
NEWS_DIR = REPO_ROOT / "content" / "ai-news"
MAX_STORIES = 200
STORIES_PER_RUN = 25

# Strong AI/ML/agent keywords a story must mention in title + summary to be included.
# Terms are intentionally specific to AI/ML. Consumer tech (iPhone, AirPods, etc.) is excluded.
AI_KEYWORDS = [
    # Core AI/ML
    "ai", "artificial intelligence", "machine learning", "deep learning",
    "neural network", "neural net", "transformer", "diffusion model", "diffusion",
    "multimodal", "foundation model", "large language model", "llm",
    "language model", "vision model", "speech model", "embedding model",
    "generative ai", "gen ai", "text-to-image", "text-to-video", "image generation",
    "video generation", "3d generation", "synthetic data",

    # Agents & applications
    "agent", "ai agent", "autonomous agent", "coding agent", "ai coding",
    "agentic", "agentic workflow", "agentic rl",
    "autonomous", "self-driving", "humanoid robot", "robotics", "autonomous vehicle",
    "rag", "retrieval augmented", "knowledge graph",
    "computer vision", "vision model", "image recognition", "object detection",

    # Models & companies
    "chatgpt", "gpt", "gpt-4", "gpt-4o", "gpt-5", "claude", "gemini", "llama",
    "mistral", "anthropic", "openai", "deepmind", "google ai", "microsoft ai",
    "huggingface", "hugging face", "ollama", "cohere", "perplexity", "ai2",
    "elevenlabs", "replicate", "baseten", "modal", "together ai", "fireworks ai",
    "xai", "grok", "qwen", "glm", "reasoning model", "coder model",

    # Open source / community
    "open source", "open-source", "github", "huggingface hub",

    # Tools & frameworks
    "copilot", "codex", "cursor", "aider", "replit", "tabnine", "github copilot",
    "pytorch", "tensorflow", "jax", "keras", "onnx", "vllm", "sglang",

    # Training & inference infra
    "training run", "pretraining", "pre-training", "fine-tuning", "finetuning",
    "rlhf", "preference optimization", "dpo", "ppo", "distillation", "quantization",
    "kv cache", "mixture of experts", "moe", "long context", "context window",
    "model serving", "inference stack", "inference optimization", "ai accelerator",
    "ai chip", "gpu cluster", "training cluster", "ai data center", "ai cloud",

    # Safety / governance / business / evaluation
    "alignment", "ai safety", "ai governance", "ai policy", "ai regulation",
    "ai ethics", "prompt injection", "jailbreak", "red team", "red teaming",
    "model evaluation", "llm benchmark", "agent benchmark", "ai benchmark",
    "benchmarking", "evaluation",
    "ai investment", "ai startup", "ai company", "ai funding", "ai unicorn",
]

# Phrases that mark a story as non-AI tech/business/consumer noise we should drop.
# These are independent of AI keywords: even if "AI" is mentioned elsewhere, the story is clearly off-topic.
NON_AI_PHRASES = [
    # Consumer hardware / products
    "iphone", "ipad", "airpods", "apple watch", "macbook", "vision pro",
    "camera airpods", "foldable iphone", "oura ring", "smartphone era",

    # Non-tech lifestyle / social
    "contraceptive", "dating app", "match group", "tinder", "bumble",
    "happy humans", "slowtech", "user-controlled algorithms",
    "keep kids off social media",

    # Telecom / satellites / drones (without AI context)
    "satellite network", "starlink", "jio", "drone contract", "defense contract",
    "radio communication in space", "satellite spectrum",

    # General finance / markets (without AI context)
    "earnings", "outlook disappoints", "shares set to fall", "stock takes a dive",
    "stock underperforms", "debt rejig", "debt restructuring", "software appetite",
    "pac is bringing", "tech worker-backed pac", "big tech's",
    "ipo", "first week after ipo", "merger", "spacex-tesla merger",
    "tops 1 trillion", "ma deals", "e-commerce", "profits", "fintech expansion",
    "payment systems", "antitrust probe", "regulatory probe", "private jet crash",
    "premarket movers", "fed rate hike", "fed keeping rates steady",
    "stock gauge", "bear market", "equities rally", "us stock futures",
    "asml", "chip tool", "nuclear reactor design",
    "rally is being powered by", "available for preorder", "struggling car parts stock",
    "public company valued for its ai potential", "new ai biz has a plan",

    # Consumer / lifestyle / celebrity fluff using AI as garnish
    "smart speaker", "home speaker", "turn off ai in your",
    "wants tech without ai", "ai digital clone", "wellness app featuring",
    "queer eye", "karamo brown",

    # General corporate / non-AI
    "shrinks board", "cements control", "killed in private jet crash",
    "takes on zelda", "interactive ar experiences", "ar glasses",
    "ad-backed streaming", "500 plan for pros", "challenges adobe",
]

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

    # General science/tech — AI-specific feeds only
    "https://www.reuters.com/technology/artificial-intelligence/rss.xml",
    "https://www.ft.com/artificial-intelligence?format=rss",
]

BLOCKED_DOMAINS = [
    "spam-site.example",
]

BLOCKED_PHRASES = [
    "sponsored",
    "paid post",
    "advertorial",
]
