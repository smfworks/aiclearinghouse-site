---
slug: "2026-07-16-active-memory-consolidation-sleep-pass-praxis"
title: "Active Memory Consolidation: The Sleep Pass Pattern in Praxis"
excerpt: "How Praxis v0.28 ships a background 'sleep' pass that replays, connects, and compresses agent memory into cross-cutting insights — using BM25 retrieval, no embedding model required, and governed as a READ-risk operation."
date: "2026-07-16"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Memory Systems", "Open Source"]
tags: ["agent-memory", "consolidation", "bm25", "praxis", "sleep-pass", "rag"]
readTime: 15
image: "/images/blog/2026-07-16-active-memory-consolidation-sleep-pass-praxis-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-16-active-memory-consolidation-sleep-pass-praxis"
---

Most agent memory systems are passive: you embed a chunk once, store it, and retrieve it later by similarity. That works for documents. It fails for an agent that runs hundreds of cycles across days, because the raw trace grows without bound while the *signal* — the patterns, the decisions, the cross-references — never gets distilled.

Praxis v0.28 shipped a different pattern this week. Instead of passive RAG over a growing heap, a background **consolidation pass** periodically replays recent memory, extracts structured metadata, finds connections between items that don't obviously belong together, synthesizes one cross-cutting insight, and re-rates salience. The metaphor is borrowed from the GCP "Always-On Memory Agent" research: this is the agent's brain during sleep. It shipped as five slices across `feat(memory)` commits `5a98771` through `1b695e0`.

This post walks through the actual implementation — the tier model, the consolidator algorithm, the governance gating, the retrieval path, and the honest engineering trade-offs. Every code block is from `hybridagent/` at v0.28.3.

## The problem: memory hoarding

A naive agent memory is append-only. Every cycle writes a summary. After a week you have hundreds of episodic entries, most of them stale, none of them connected. Recall returns the most *similar* item to your query, which is rarely the most *relevant* one — the decision that mattered was three days ago and got buried under forty routine tool-call logs.

The failure mode has a name in the Praxis codebase: **summarize-not-hoard**. The `Memory.add_durable()` method enforces it with a hard cap:

```python
# hybridagent/memory.py
_MAX_DURABLE_CHARS = 280

def add_durable(self, text: str, kind: str, provenance: str,
                salience: float = 1.0,
                expires_at: float | None = None) -> MemoryItem:
    # Enforce summarize-not-hoard: durable entries are concise.
    clipped = text if len(text) <= _MAX_DURABLE_CHARS else text[:_MAX_DURABLE_CHARS] + "…"
    item = MemoryItem(text=clipped, tier=Tier.DURABLE, kind=kind,
                      provenance=provenance, salience=salience,
                      expires_at=expires_at)
```

280 characters. A durable memory is a *tweet-length fact*, not a transcript. Private bodies are never stored durably — only concise summaries plus provenance. This is a deliberate constraint: it forces the agent (or the operator) to compress before persisting, and it makes the durable tier scannable by a human in seconds.

## Three tiers, one recall path

Praxis splits memory into three tiers, each with different retention:

| Tier | Lifetime | Contents | Persistence |
|------|----------|----------|-------------|
| `working` | One cycle | Current task state | In-process only, cleared each cycle |
| `episodic` | Days–weeks | Summaries of interactions/outcomes with provenance | SQLite, decays after 90 days if low-salience |
| `durable` | Indefinite | Facts, preferences, decisions, learned skills, **insights** | SQLite, explicit `expires_at` only |

```python
class Tier(str, Enum):
    WORKING = "working"
    EPISODIC = "episodic"
    DURABLE = "durable"
```

The critical design choice: **there is one recall path**. `Memory.recall(query)` ranks across `durable + episodic` together. Insights produced by consolidation are not in a separate namespace — they're durable memories with `kind="insight"`, surfaced through the same `recall()` call as any other fact.

```python
def recall(self, query: str, k: int = 5) -> list[MemoryItem]:
    """Rank durable+episodic memory by BM25 relevance to query, then
    re-rank by salience, recency, and prior access."""
    now = time.time()
    pool = [it for it in (self.durable + self.episodic)
            if not (it.expires_at and it.expires_at <= now)]
    if not pool:
        return []
    index = BM25Index.build((str(i), it.text) for i, it in enumerate(pool))
    relevance = dict(index.search(query, k=len(pool)))
    candidates: list[tuple[float, int, MemoryItem]] = []
    for i, item in enumerate(pool):
        rel = relevance.get(str(i), 0.0)
        if rel <= 0.0:
            continue  # shares no query term -> not a match
        age_days = max(0.0, (now - item.ts) / 86400.0)
        freshness = 1.0 / (1.0 + age_days / 30.0)
        score = rel + item.salience + (0.1 * item.access_count) + freshness
        candidates.append((score, i, item))
    candidates.sort(key=lambda t: (-t[0], t[1]))
    ...
```

The final score is `BM25_relevance + salience + 0.1 × access_count + freshness`. BM25 handles lexical relevance; salience is a governance signal (consolidation bumps it); access_count rewards items the agent keeps reaching for; freshness is a soft decay over 30-day windows. No embeddings, no vector DB, no GPU.

## BM25 over an agent's own memory

The retrieval backbone is a 97-line pure-stdlib BM25 implementation in `hybridagent/bm25.py`. It exists because an agent's memory corpus is *tiny* — maybe a few hundred items — and BM25 is strong at exact-term and rare-term matching on small corpora where an embedding model is overkill and a vector index is operational overhead.

One detail matters: Praxis uses the **Lucene-style IDF** variant, not classic Okapi:

```python
def _idf(self, term: str) -> float:
    df = self._df.get(term, 0)
    return math.log(1 + (self.n - df + 0.5) / (df + 0.5))
```

Classic Okapi IDF is `log((N - df + 0.5)/(df + 0.5))`, which goes *negative* when a term appears in more than half the documents. On a small agent corpus where common words dominate, that would zero out good matches. The `log(1 + ...)` form is always non-negative, so the ranker behaves sensibly even when your entire memory is 40 items and "praxis" appears in 25 of them.

The index is cheap to build per query — `BM25Index.build()` is called fresh in every `recall()`. No invalidation, no persistence, no background reindex. The trade-off is O(N) per query; the win is zero moving parts.

## The consolidation pass: four operations, one report

`hybridagent/consolidation.py` is 349 lines and exposes one public method: `MemoryConsolidator.run()`. A pass does four things, in order:

1. **Extract metadata** — entities and topics per item, written to the `memory_items` table.
2. **Find connections** — pairwise relationships across the window, capped at `max_connections` (default 5).
3. **Synthesize one insight** — a cross-cutting pattern no single memory states alone, written as a durable `kind="insight"` item.
4. **Re-rate salience** — bounded, monotonic bumps for connected and recently-recalled items.

```python
def run(self, re_consolidate_after: float | None = None) -> ConsolidationReport:
    report = ConsolidationReport()
    window = self._select_window(re_consolidate_after)
    report.items_reviewed = len(window)
    if len(window) < self.min_items:
        report.skipped_reason = f"too few unconsolidated ({len(window)} < {self.min_items})"
        return report

    ts = time.time()
    ids = [w["id"] for w in window]

    if self.extract_metadata:
        self._extract_metadata(window)
    conns = self._find_connections(window)
    report.connections_made = len(conns)
    insight_id = self._synthesize_insight(window, conns, ts)
    if insight_id is not None:
        report.insights_written = 1
    if self.rerate_salience:
        report.salience_rerated = self._rerate(window, conns)
    self.store.mark_consolidated(ids, ts=ts)
    return report
```

The window is bounded (`window_size` default 20 — GCP's reference used 10; 20 is safer for noisier agent traces) and only pulls items that haven't been consolidated yet (`list_unconsolidated`). A minimum threshold (`min_items` default 3 — GCP used 2; 3 cuts noise from tiny passes) skips runs that would burn an LLM call to extract metadata from two items.

### The insight synthesis prompt

The insight step is where the "sleep" metaphor earns its keep. The prompt asks the LLM to find a pattern that no single memory states alone:

```python
def _insight_prompt(self, window: list[dict], conns: list[_Conn]) -> str:
    lines = [f"[#{w['id']}] {w['text']}" for w in window]
    conn_lines = [f"- #{c.from_id} -> #{c.to_id}: {c.relationship}"
                  for c in conns] or ["(no connections found)"]
    return (
        "Given these memories and the connections found between them, "
        "synthesize ONE cross-cutting insight — a pattern, theme, or "
        "implication that no single memory states alone. Be concrete, "
        "not generic. 1-2 sentences max.\n\n"
        "Memories:\n" + "\n".join(lines) + "\n\nConnections:\n"
        + "\n".join(conn_lines) + "\n\nInsight:"
    )
```

The resulting insight is written as a normal durable memory with `kind="insight"` and `salience=0.8`, and the connections that produced it are linked back via `insight_id`:

```python
item = self.memory.add_durable(
    text, kind="insight", provenance=f"consolidation:{ts:.0f}",
    salience=0.8,
)
insight_id = getattr(item, "id", None)
if insight_id is not None:
    for c in conns:
        self.store.add_memory_connection(
            c.from_id, c.to_id, c.relationship,
            insight_id=insight_id, created_at=ts)
```

This is the key reuse decision: insights flow back through the same `recall()` path as any other durable fact. No new retrieval namespace, no special "insight query" endpoint. When the agent next recalls context for a goal, the synthesized insight competes on equal footing with human-written facts — ranked by BM25 + salience + recency.

### Salience re-rating is bounded and monotonic

The `_rerate()` method is deliberately conservative. It only ever *bumps* salience, never down-rates, and the bumps are small:

```python
def _rerate(self, window: list[dict], conns: list[_Conn]) -> int:
    """+0.1 per connection received, +0.05 per access since last pass.
    Monotonic (never down-rates). Hard cap at 1.0."""
    ...
    for w in window:
        mid = w["id"]
        old_salience = float(w.get("salience", 1.0))
        bump = 0.0
        if conn_by_id.get(mid, 0):
            bump += 0.1 * conn_by_id[mid]
        if w.get("access_count", 0) > 0 and (
                last_consolidated is None or
                w.get("last_access_ts", 0) > last_consolidated):
            bump += 0.05
        if bump > 0:
            self.store.update_memory_salience(mid, old_salience + bump)
            bumped += 1
    return bumped
```

+0.1 per connection (an item the consolidator linked to other items is probably important), +0.05 if it was recalled since the last pass (an item the agent keeps reaching for is probably important). The store clamps at 1.0. There is no decay here — decay is handled separately by `decay_episodic()` and `purge_expired()`, which are explicit retention-policy methods the operator controls. Consolidation only sharpens; it never silently forgets.

## Governance: READ-risk, off by default

This is the part that most "agent memory" posts skip. Consolidation runs an LLM in the background on the agent's own memory. That is a governance decision, not just a feature flag.

Praxis classifies the consolidation pass as **READ-risk** — it reads memory, writes local insight and connection rows, has no external effect. It does not get routed through the `SEND`/`DESTRUCTIVE` approval gate. But it still ships **off by default** in v0.28.0:

```python
# hybridagent/config.py
_CONSOLIDATION_DEFAULTS = {
    "enabled": False,            # v0.28.0 ships off-by-default; flip after dogfood
    "intervalMinutes": 30,
    "windowSize": 20,            # max memories per pass (GCP used 10; 20 is safer)
    "minItemsToConsolidate": 3,  # GCP used 2; 3 reduces noise from tiny passes
    "rerateSalience": True,      # Gap D - bump connected/recalled items
    "extractMetadata": True,     # Gap C - entities/topics on the window
    "maxConnections": 5,
}
```

The daemon tick that drives it is a cheap no-op when disabled — one config read, one timestamp check, return:

```python
# hybridagent/daemon.py
def _consolidation_tick(self) -> None:
    """Gated by agents.consolidation.enabled (default off in v0.28.0).
    When off, this method is a cheap no-op."""
    try:
        from .config import get_consolidation_config
        cc = get_consolidation_config()
    except Exception:
        return
    if not cc.get("enabled", False):
        return
    ...
```

Two more guards live in the tick:

1. **It defers when there's pending work.** If the task queue has `pending` or `retry` items, the tick reschedules for 60 seconds out. Consolidation never starves the user-facing loop.
2. **It backs off on error.** A failed pass (LLM timeout, malformed JSON, store error) reschedules at `min(interval, 300s)` so a broken pass doesn't immediately retry and burn tokens.

```python
# Don't starve the task queue — defer if work is pending/running.
if self.manager is not None and (
    self.manager.list(status="pending") or self.manager.list(status="retry")
):
    self._next_consolidation_ts = now + 60.0
    return
```

The operator turns it on with one CLI command, and the runtime flip of `extractMetadata` takes effect on the next tick without a daemon restart:

```bash
praxis consolidation enable
praxis consolidation status
praxis consolidation run    # trigger one pass immediately
```

## Honest failure is a design constraint

Every LLM call in the consolidator is wrapped to *never raise*. Malformed JSON, network timeout, empty response — all of them produce a report with `skipped_reason` set and a log line, then the pass continues with whatever it got. The tests pin this explicitly:

```
test_consolidation_malformed_metadata_json_does_not_block
test_consolidation_malformed_connections_json_still_writes_insight
test_consolidation_empty_insight_response_skips_insight
test_consolidation_rerates_salience_bounded_monotonic
test_consolidation_connection_to_self_rejected
test_consolidation_respects_max_connections_cap
test_consolidation_json_parser_strips_fences_and_prose
```

The JSON parser tolerates the real-world failure modes of LLM output — ``` ```json ``` fences, trailing prose, list-vs-dict confusion:

```python
@staticmethod
def _parse_json_list(raw: str) -> Any:
    """Strict JSON parse with fence-stripping. Returns the parsed value,
    or raises ValueError (caller catches and skips)."""
    text = raw.strip()
    if text.startswith("```"):
        inner = text.split("```", 2)
        if len(inner) >= 2:
            body = inner[1]
            if body.lower().startswith("json"):
                body = body[4:]
            text = body.strip()
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1 or end < start:
        raise ValueError("no JSON array found in LLM response")
    return json.loads(text[start:end + 1])
```

A connection to self (`from_id == to_id`) is rejected. Connections to IDs outside the window are rejected. Duplicate `(from_id, to_id, relationship)` triples are rejected by a `UNIQUE` constraint in SQLite. Deleting a memory cascades to its connections (`FK ON DELETE CASCADE`); deleting an insight `SET NULL`s the `insight_id` column rather than cascading (you keep the connection, you lose the provenance). These are not edge cases — they're test-pinned behaviors.

## The full loop, end to end

Putting it together, the Praxis agent loop is now:

```
perceive → plan → govern → act/draft → reflect → consolidate
                                          ↑
                            recall() injects durable+episodic
                            context into the system prompt
```

Consolidation is the *sixth* step, not the fifth. It runs *after* reflect, in the background, on a timer, gated off by default. When it fires:

```
1. select window (≤20 unconsolidated items, skip if <3)
2. extract entities + topics per item      → memory_items metadata
3. find pairwise connections (≤5)          → memory_connections table
4. synthesize ONE insight (1-2 sentences)  → durable, kind="insight", salience 0.8
5. re-rate salience (+0.1 per conn, +0.05 if recalled)
6. mark window consolidated (idempotent)
```

The next time the agent handles a goal, `recall_context()` prepends the top-k memories to the system prompt — including any insights consolidation produced. The agent doesn't know which facts were human-written and which were synthesized. They compete on the same ranking.

## Trade-offs, stated honestly

This pattern is not free. The costs:

| Cost | Mitigation in Praxis |
|------|---------------------|
| LLM calls per pass (3: metadata, connections, insight) | Bounded window (20), bounded interval (30 min), bounded connections (5). Off by default. |
| Insights can be wrong and compete with real facts | `kind="insight"` is labelled; `recall_context()` surfaces the kind inline: `- (insight) ...`. Operator can delete. |
| BM25 misses semantic matches an embedding would catch | Embedding-based RAG (`hybridagent/rag.py`) is a separate path for the KB; BM25 is for the agent's *own* memory. They coexist. |
| Consolidation can amplify a wrong salience bump | Bumps are monotonic but tiny (+0.1, +0.05) and clamped at 1.0. Decay is a separate explicit operator. |
| Background LLM cost is invisible to the user | `consolidation_status()` surfaces `items_reviewed`, `connections_made`, `insights_written`, `salience_rerated`, `skipped_reason` on the dashboard and CLI. |

The biggest honest limitation: **I have not run this in production for months.** v0.28.3 ships it off-by-default with the comment `# flip after dogfood`. The defaults are conservative because the right cadence, window size, and connection cap for a real workload are unknown. The GCP reference numbers (window=10, min=2) were tuned for their workload, not ours. Treat the defaults as a starting point, not a recommendation.

## What this is not

This is not a vector database replacement. Praxis has `hybridagent/rag.py` and `hybridagent/embeddings.py` for semantic retrieval over an external knowledge base — that's a different problem with different scale (thousands of documents, not hundreds of memory items). Consolidation operates on the agent's *own* memory, where the corpus is small enough that BM25 is the right tool and embeddings would add operational cost without clear benefit.

This is also not a substitute for explicit retention policy. `purge_expired()` (for items with `expires_at`), `decay_episodic()` (for low-salience old entries), and `forget_by_provenance()` (for right-to-be-forgotten) are all separate methods the operator calls deliberately. Consolidation sharpens signal; it does not decide what to forget.

## Verifying it yourself

The whole thing is testable without an LLM key. The consolidator takes a `_LLMLike` Protocol (a duck of `LLMClient`), so tests pass a fake returning canned JSON:

```bash
cd ~/smf-praxis
python3 -m pytest tests/test_consolidation.py -q          # 969 lines, ~45 tests
python3 -m pytest tests/test_memory_search.py -q          # BM25 recall
python3 -m hybridagent.cli eval                           # 40/40 capability + safety
```

The schema additions (the `memory_connections` table, the `entities`/`topics`/`last_consolidated_at` columns) are additive — no migration, no behavior change to existing memory until you flip `enabled=true`.

## Takeaways for builders

If you're building an agent that runs more than a handful of cycles:

1. **Passive RAG over an append-only log degrades.** The heap grows; signal doesn't. A consolidation pass that replays, connects, and compresses is the structural fix.
2. **BM25 is the right retrieval backbone for an agent's own memory.** The corpus is tiny, exact-term matching matters, and you avoid embedding-model operational overhead. Save embeddings for the external KB.
3. **Synthesized insights should compete on the same ranking as human-written facts.** A separate "insight namespace" means the agent never surfaces them. Write insights as normal durable memories with a `kind` label and let `recall()` rank them.
4. **Consolidation is a governance decision.** It runs an LLM in the background on your agent's memory. Classify the risk, gate it behind a flag, ship it off-by-default, and make the cost visible.
5. **Honest failure is non-negotiable.** Every LLM call in the pass must be wrapped to never raise. Malformed JSON skips the step; the pass continues with what it got. Pin this with tests.
6. **Bounded, monotonic salience bumps.** Only ever sharpen, never silently forget. Let decay be an explicit operator the operator controls.

The code is at `github.com/smfworks/smf-praxis` under `hybridagent/consolidation.py`, `hybridagent/memory.py`, and `hybridagent/bm25.py`. The phase plan that scoped the five slices is `praxis-consolidation-phase-plan.md` in the repo. The GCP research that motivated it is cited in the consolidation module docstring.

— Liam