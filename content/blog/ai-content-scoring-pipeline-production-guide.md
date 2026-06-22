---
slug: "ai-content-scoring-pipeline-production-guide"
title: "Building an AI Content Scoring Pipeline: A Production Guide to Multi-Gate Quality Control"
excerpt: "Most AI-generated content pipelines have no quality gate. Here's how we built a multi-dimensional scoring system that catches 35% of content before it publishes — with code, production data, and the failures that shaped it."
date: "2026-05-28"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "clearinghouse"
categories: ["AI", "Engineering", "Tutorial", "The Edge"]
tags: []
readTime: 12
image: "/images/blog/ai-content-scoring-pipeline-production-guide.png"
originalUrl: "https://smfworks.com/blog/ai-content-scoring-pipeline-production-guide"
canonicalUrl: "https://www.smfclearinghouse.com/blog/ai-content-scoring-pipeline-production-guide"
---
# Building an AI Content Scoring Pipeline: A Production Guide to Multi-Gate Quality Control

Here's the problem with AI-generated content pipelines: **there's usually no quality gate between generation and publication.**

The LLM writes it. The scheduler posts it. Done. If the content is bad — vague, repetitive, off-brand, or just noise — it's already live before anyone notices.

At SMF Works, we publish 13 pieces of content daily across X, blog, and video. That's 91 pieces per week. Manual review doesn't scale. So we built something that does: a multi-dimensional content scoring pipeline that evaluates every piece before it goes out.

This post walks through exactly how it works — the architecture, the scoring dimensions, the gate logic, the production data, and the failures that shaped it.

## The Core Problem

Content quality isn't one thing. A post can be well-written but off-brand. It can be accurate but boring. It can be engaging but duplicate something you posted yesterday.

Single-score quality metrics collapse these distinct failure modes into one number. That number tells you something went wrong, but not *what* or *where*.

We needed a system that:
1. Scores content across multiple independent dimensions
2. Makes pass/fail decisions at each gate
3. Produces actionable failure reasons (not just "bad score")
4. Runs fast enough to gate a cron-driven pipeline

## Architecture Overview

```
┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Content      │───▶│  Scoring    │───▶│  Gate Logic  │───▶│  Decision    │
│  Generator    │    │  Protocol   │    │  (8 gates)   │    │  APPROVE /   │
│  (LLM)        │    │  (5 dims)   │    │              │    │  REVISE /    │
└──────────────┘    └─────────────┘    └──────────────┘    │  KILL        │
                                                          └─────────────┘
```

Three stages, zero ambiguity:

1. **Scoring Protocol** — evaluates the content across 5 dimensions, returns a `ScoringResult` with hard score, soft score, gate results, and failure reason
2. **Gate Logic** — applies 8 binary pass/fail gates with weights
3. **Decision** — routes content to APPROVE, REVISE, or KILL based on cumulative gate results

## The Five Scoring Dimensions

Each piece of content is evaluated on a 0–1 scale across five dimensions:

| Dimension | What it measures | Weight | Threshold |
|-----------|-----------------|--------|-----------|
| **Clarity** | Is the writing clear and accessible? | 0.2 | 0.6 |
| **Substance** | Does it teach something specific? | 0.3 | 0.7 |
| **Differentiation** | Is it distinct from recent output? | 0.2 | 0.5 |
| **Timeliness** | Is it relevant now? | 0.15 | 0.5 |
| **Engagement Velocity** | Will it generate interaction? | 0.15 | 0.4 |

The thresholds aren't equal. **Substance has the highest weight (0.3) and highest threshold (0.7)** because a post that's clear but empty is worse than a post that's dense but rough. We'd rather revise for clarity than kill for substance.

## The Eight Gates

Gates are binary — they pass or they don't. Each has a weight that contributes to the overall hard score.

```python
# From our scoring protocol
GATE_WEIGHTS = {
    "media_uploaded": 1.5,      # Was media uploaded to platform?
    "media_url_valid": 1.5,    # Is the media URL verified?
    "posted": 2.0,              # Did the post reach the platform?
    "content_correct": 1.5,     # Does content match intent?
    "on_time": 0.5,             # Was it within schedule window?
    "platform_format_valid": 1.0, # Does it respect platform limits?
    "link_present": 0.5,        # Required link included?
    "no_duplicate": 0.5,        # Not a duplicate of recent post?
}
# Total weight: 9.0
```

A post that passes all 8 gates scores 1.0 (9.0/9.0). A post that fails `posted` (weight 2.0) and `content_correct` (weight 1.5) loses 3.5/9.0 = 0.39, scoring 0.61.

### Hard Score vs. Soft Score

- **Hard score** = sum of passed gate weights / total weight. All-or-nothing per gate. You either uploaded the media or you didn't.
- **Soft score** = hard score with partial credit adjustments. A post that succeeded but violated platform format rules gets `hard_score × 0.85`. A post that published without media gets `hard_score × 0.9`.

Why two scores? Hard score for the gate decisions. Soft score for trend analysis and optimization. You don't REVISE a post because its soft score dipped 5%. You REVISE because a gate failed.

## The ScoringResult Data Structure

```python
@dataclass
class GateResult:
    name: str           # e.g. "platform_format_valid"
    passed: bool        # True or False
    reason: str         # Human-readable explanation
    weight: float       # Gate weight (e.g. 1.0)

@dataclass
class ScoringResult:
    hard_score: float           # 0.0-1.0, all-or-nothing per gate
    soft_score: float           # 0.0-1.0, partial credit adjustments
    gates: list[GateResult]     # Per-gate results
    fail_reason: str            # Primary failure reason (empty if passed)
    trajectory_summary: str     # Compressed execution trajectory
```

Every scoring run produces one of these. The downstream decision logic only needs `hard_score` and `fail_reason`.

## Production Results: What We Learned from 173 Sessions

We tagged 173 social posting sessions with gate-level results. Here's what the data showed:

| Failure Pattern | Sessions Affected | Gate(s) Failed | Root Cause |
|----------------|-------------------|---------------|------------|
| `who_can_reply_invalid` | 79 (46%) | `posted` | Postiz API rejects invalid enum values. Must use `"everyone"` |
| `media_upload_failure` | 69 (40%) | `media_uploaded`, `media_url_valid` | Raw filesystem paths passed instead of uploaded URLs |
| `rate_limited` | 45 (26%) | `posted` | Batch posting hits API rate limits |
| `post_too_long` | 17 (10%) | `platform_format_valid` | @MorganSMFWorks (280-char) can't handle long-form |
| `integration_not_found` | 17 (10%) | `posted` | Integration IDs go stale after disconnections |

**Baseline scores on our validation set:**
- Average hard score: **0.829**
- Average soft score: **0.814**
- Perfect scores: 6/35 (17%)
- At least one gate failure: 29/35 (83%)

83% of sessions had at least one gate failure. That's the optimization surface.

## The Three Fixes That Move the Needle

### 1. Media Upload Hygiene (weight: 3.0)

**The problem:** 40% of sessions passed raw filesystem paths to Postiz instead of uploading media first and using the returned URL.

**The fix:** Always upload before referencing. The scoring pipeline now enforces this as two gates:

```python
# Pre-flight check before posting
def preflight_media_check(media_path: str) -> str:
    """Upload media to Postiz, return verified URL."""
    if media_path.startswith("http"):
        # Already a URL — verify it's a Postiz URL
        if "uploads.postiz" in media_path or "postiz" in media_path:
            return media_path  # Valid
        # It's an external URL — upload it first
        return upload_to_postiz(media_path)
    # It's a filesystem path — MUST upload first
    return upload_to_postiz(media_path)
```

**Expected impact:** `media_uploaded` and `media_url_valid` gates go from ~60% pass rate to ~95%. That's +0.33 on hard score.

### 2. Platform Routing (weight: 1.0)

**The problem:** 10% of sessions posted long-form content to @MorganSMFWorks, which has a 280-character limit (no X Premium).

**The fix:** Route by estimated character count before generation:

```python
def route_to_account(content: str) -> str:
    """Route content to the correct X account based on length."""
    char_count = len(content)
    if char_count > 280:
        return "@smfworks"    # X Premium — 25,000 chars
    return "@MorganSMFWorks"   # Standard — 280 chars
```

**Expected impact:** `platform_format_valid` gate goes from ~90% to ~99%. That's +0.09 on hard score.

### 3. Rate-Limit Handling (weight: 2.0)

**The problem:** 26% of sessions hit Postiz rate limits during batch posting.

**The fix:** Stagger posts with exponential backoff:

```python
import time
import random

def staggered_post(posts: list[dict], base_delay: float = 2.0) -> list:
    """Post with jittered delays to avoid rate limits."""
    results = []
    for i, post in enumerate(posts):
        if i > 0:
            delay = base_delay * (1 + random.random())  # 2-4s base
            time.sleep(delay)
        result = create_post(post)
        results.append(result)
    return results
```

**Expected impact:** `posted` gate rate-limit failures drop from 26% to ~5%. That's +0.42 on hard score.

## The Full Pipeline in Practice

Here's what the complete scoring + gate + decision flow looks like in production:

```python
def score_and_route(content: dict) -> tuple[str, ScoringResult]:
    """
    Score content, evaluate gates, route to APPROVE/REVISE/KILL.
    """
    # 1. Score across 5 dimensions
    result = scorer.score(content, task_config)
    
    # 2. Apply gate logic
    if result.hard_score >= 0.9:
        # All critical gates passed — publish
        return "APPROVE", result
    elif result.hard_score >= 0.7:
        # Most gates passed but some need attention — revise
        return "REVISE", result
    else:
        # Multiple critical failures — kill
        return "KILL", result

# Production routing from our cron jobs
for post in batch:
    decision, result = score_and_route(post)
    if decision == "APPROVE":
        publish(post)
    elif decision == "REVISE":
        revised = revise_with_feedback(post, result.fail_reason)
        decision2, result2 = score_and_route(revised)
        if decision2 == "APPROVE":
            publish(revised)
        else:
            log_failure(revised, result2)
    else:
        log_failure(post, result)
```

## What the Optimizer Does Next

This is where SkillOpt comes in. The scoring pipeline produces the loss function. The optimizer tunes the generation prompts to maximize that function.

The training data we just tagged — 138 train, 35 val — feeds into the SkillOpt harness. Each run produces a `ScoringResult`. The optimizer adjusts prompt parameters to push the hard score toward 1.0.

The target: from 0.829 baseline to **0.95+** within the first optimization cycle.

## Key Takeaways

1. **Multi-gate scoring > single-score quality metrics.** Eight binary gates with weights give you actionable failure reasons, not mystery numbers.
2. **The top 3 fixes address 76% of failures.** Media upload hygiene, platform routing, and rate-limit handling — these aren't theoretical. They came from 173 sessions of production data.
3. **Hard scores for decisions, soft scores for trends.** You don't REVISE on a soft score dip. You REVISE when a gate fails.
4. **Score the pipeline, not just the content.** Half our gates (media_uploaded, media_url_valid, posted, on_time) are about the *delivery mechanism*, not the content itself. A brilliant post that fails to publish scores 0.0 on `posted`.
5. **Every failure is training data.** The 83% failure rate isn't bad news — it's the optimization surface. Each failed gate is a signal the optimizer can learn from.

## Try It Yourself

The scoring protocol is open-source and framework-agnostic. You don't need Postiz or any specific tool — just define your gates, your weights, and your decision thresholds.

Start with these questions:
- What are the distinct ways your content pipeline can fail?
- Which failures are *delivery* failures vs. *content* failures?
- What's the weight of each? (What matters more — publishing on time, or publishing correct content?)
- What's your decision threshold? When do you REVISE vs. KILL?

The answers give you your gate definitions. The production data gives you the training signal. The optimizer closes the loop.

---

*This post is part of The Edge — deep technical dives from SMF Works. If you're building AI content pipelines, you need quality gates before publication, not after. The scoring protocol and gate framework are available in our SkillOpt repository.*