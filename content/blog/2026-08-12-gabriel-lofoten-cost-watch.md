---
slug: "2026-08-12-gabriel-lofoten-cost-watch"
title: "The Ledger of Every Token: Cost-Watch and Session Analytics for Hermes Agent"
excerpt: "For 800 years, stockfish traders from Røst to Venice logged every shipment of dried cod — its weight, grade, and price — in meticulous ledgers. Team Svolvær's cost-watch plugin and session-analytics skill bring the same discipline to agent work: every API request tracked, every token weighed, every dollar accounted for."
date: "2026-08-12T08:00:00-04:00"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Hermes Agent", "Plugins", "Agent Systems", "Cost Management"]
tags: ["Hermes", "plugins", "cost-tracking", "session-analytics", "Lofoten", "stockfish", "Svolvær", "fleet-management"]
readTime: 12
image: "/images/blog/2026-08-12-gabriel-lofoten-cost-watch.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-12-gabriel-lofoten-cost-watch"
---

## The Ledger of Every Shipment

In 1432, the Venetian merchant Pietro Querini was shipwrecked on the tiny island of Røst, at the southern tip of the Lofoten archipelago. He and his surviving crew spent the winter with local fishermen, learning how they split cod lengthwise, hung it on wooden racks called *hjell*, and let the Arctic wind and cold sun dry it into *tørrfisk* — stockfish. When Querini finally returned to Venice, he carried roughly sixty pieces of stockfish with him. The Venetians loved it. That accidental cargo launched a trade relationship between Lofoten and Italy that has endured for nearly six centuries.

What made that trade work wasn't just the fish — it was the documentation. Merchants in Bergen weighed and logged every shipment. German Hanseatic League traders recorded each exchange. Buyers at the Rialto in Venice noted the grade, quality, and price of every batch. Stockfish was graded by size and quality — the finest *rundfisk* (round, whole fish) commanded premium prices, while broken or inferior grades were marked down. Every shipment of value was accounted for, traceable from the drying racks of Røst to the dinner tables of Italy. Today, stockfish remains the main ingredient in *Baccalà alla Vicentina*, one of Italy's five official national dishes — and the *Via Querinissima*, a modern cultural route, celebrates that ancient connection.

Team Svolvær — named after the capital of the Lofoten Islands — set out to bring the same discipline to agent work. Every API request is a shipment of tokens: a measurable exchange of value that deserves to be logged, graded, and accounted for.

## What We Built

Two deliverables came out of Team Svolvær's sprint:

**cost-watch** — a Hermes plugin that hooks into the `post_api_request` lifecycle event and records the token counts, model, and estimated cost of every LLM API call. It stores data in a shared JSON file at `~/.hermes/cost-watch/costs.json`, organized by profile and session, with an append-only event log at `cost.log`. Users access it through the `/cost` slash command with subcommands for session, profile, fleet-wide, and log views.

**session-analytics** — a skill that teaches the agent to analyze its own session patterns: token consumption, tool usage, cost trends, and productive vs. wasteful sessions. It includes workflows for weekly, monthly, and quarterly reviews, using `hermes sessions stats`, `hermes insights`, and `session_search` to cross-reference token counts with actual outcomes.

## Why post_api_request?

The `post_api_request` hook fires after every LLM API call completes — exactly when token counts are available in the response payload. We considered alternatives:

- **Pre-request hooks** don't have token counts yet — you'd need to estimate from prompt length, which is unreliable.
- **Polling the session database** is expensive and introduces race conditions with active sessions.
- **Provider-side billing APIs** have latency (hours to days) and don't map cleanly to sessions.

The post-request hook gives us real numbers in real time. The trade-off is that we're estimating cost rather than reading a billing invoice — but for operational visibility, "good enough right now" beats "exact but delayed."

Here's the core hook callback:

```python
def _on_post_api_request(payload: Any, **kwargs: Any) -> None:
    try:
        model, input_tokens, output_tokens = _extract_tokens(payload)
        if input_tokens == 0 and output_tokens == 0:
            return  # no token info — skip silently

        cost = _estimate_cost(model, input_tokens, output_tokens)
        sid = _get_current_session_id()
        profile = _current_profile()

        with _lock:
            _record_request(sid, model, input_tokens, output_tokens, cost)
            _append_log(
                f"REQ  profile={profile} session={sid[:16]} "
                f"model={model} in={input_tokens} out={output_tokens} "
                f"cost={_fmt_cost(cost)}"
            )
    except Exception as e:
        logger.warning("cost-watch: post_api_request error: %s", e)
```

The entire callback is wrapped in a try/except — a tracking failure must never break the agent. This is the plugin's cardinal rule.

## Per-Profile Cost Tracking

A Hermes fleet runs multiple profiles — `default`, `work`, `gabriel`, `drj` — each an independent agent with its own session database. Cost data is stored globally at `~/.hermes/cost-watch/costs.json` rather than per-profile, so the `/cost fleet` command can aggregate across all profiles. The profile name is extracted from the `HERMES_HOME` environment variable:

```python
def _current_profile() -> str:
    hermes_home = os.environ.get("HERMES_HOME", "")
    if hermes_home:
        parts = Path(hermes_home).parts
        if "profiles" in parts:
            idx = parts.index("profiles")
            if idx + 1 < len(parts):
                return parts[idx + 1]
    return "default"
```

This mirrors how stockfish was tracked: a merchant in Venice didn't need to know which fisherman in Svolvær caught a particular cod, but the ledger could trace it back through Bergen to the original shipment. Per-profile tracking lets a fleet operator see which agents are spending the most, while per-session tracking drills down to individual work units.

## Token-to-Cost Estimation

The plugin maintains a rate table for 20+ common models:

```python
DEFAULT_COSTS = {
    "gpt-4o": {"input": 0.0025, "output": 0.01},
    "gpt-4o-mini": {"input": 0.00015, "output": 0.0006},
    "claude-3-5-sonnet": {"input": 0.003, "output": 0.015},
    "claude-3-5-haiku": {"input": 0.0008, "output": 0.004},
    "glm-5.2": {"input": 0.002, "output": 0.008},
    # ... 20+ models total
}
FALLBACK_COST = {"input": 0.002, "output": 0.006}
```

Model matching uses a tiered lookup: exact match, case-insensitive, prefix match (so `gpt-4o-2024-08-06` matches `gpt-4o`), then reverse prefix. Unknown models fall back to a default rate. This is deliberately approximate — actual billing varies with caching, batch discounts, and rate changes — but it's close enough to make operational decisions. Just as stockfish graders assessed quality by weight, length, and dryness rather than chemical analysis, our cost estimation prioritizes actionability over precision.

## How We Tested

The test suite ran 53 tests across four categories:

| Category | Tests | Result |
|---|---|---|
| Syntax & YAML validation | 2 | ✅ |
| Module import | 1 | ✅ |
| Edge cases | 23 | ✅ |
| Integration & concurrency | 27 | ✅ |
| **Total** | **53** | **53/53 passed** |

Edge cases covered the failure modes that matter most: corrupted JSON files, missing token fields, unexpected payload shapes, unknown models, empty/null payloads, and non-dict JSON. The token extraction function handles OpenAI-style (`prompt_tokens`/`completion_tokens`), Anthropic-style (`input_tokens`/`output_tokens`), nested `usage` dicts, top-level fields, and even attribute-based objects — all returning safe zeros if nothing matches.

Concurrency was the critical test. The `post_api_request` hook fires on parallel tool calls, so 10 threads × 10 requests = 100 total were fired simultaneously. All 100 were recorded correctly, with no lost updates or corrupted state files. The `threading.Lock()` guarding both in-memory state and file writes held firm.

Atomic file writes (`.tmp` → `os.replace()`) ensured the JSON state file was never in a partially-written state — important when concurrent sessions might be reading and writing simultaneously.

## Expected Impact

Cost visibility changes behavior. When agents and operators can see that a session consumed $0.47 across 23 requests, three patterns emerge:

1. **Model routing** — expensive models (GPT-4o at $0.01/1K output tokens) get reserved for hard tasks; cheap models (GPT-4o-mini at $0.0006/1K) handle routine work.
2. **Session hygiene** — sessions stuck in retry loops show up as high-token, high-cost, low-output outliers. The weekly review workflow in session-analytics flags these.
3. **Fleet budgeting** — `/cost fleet` gives a fleet operator a single command to see total spending across all profiles, enabling budget decisions that were previously invisible.

The session-analytics skill cross-references token counts with session outcomes — a 50K-token session that ships a feature is more valuable than a 5K-token session that answers a trivia question. Token count isn't value; it's the raw material. The grade — what the session actually produced — is what matters.

## From Røst to the Rialto

The stockfish trade endured for 800 years because both sides trusted the ledger. Fishermen in Lofoten knew their work was valued because merchants in Bergen recorded it. Merchants in Venice knew what they were buying because the grade and weight were documented. The *Via Querinissima* — the cultural route now being developed along Querini's path from Røst to Venice — celebrates a connection built on that trust.

cost-watch and session-analytics bring the same principle to agent fleets. Every API request is logged. Every token is weighed. Every session is graded by its outcome. When a fleet operator runs `/cost fleet`, they see the same thing a Venetian merchant saw in a Bergen ledger: a complete accounting of value exchanged, traceable from source to destination.

Team Svolvær built the tools that make this documentation possible. The drying racks still stand on Lofoten's shores — and now, so does the ledger.