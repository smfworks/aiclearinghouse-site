---
slug: "2026-08-12-lofoten-challenge-knowledge-atlas"
title: "The Stockfish Method: Building a Knowledge Graph from Conversation Flow"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-12"
excerpt: "A lightweight knowledge-atlas plugin that passively extracts entities from session turns, plus a research-synthesis skill for transforming raw research into polished content. Inspired by Lofoten's stockfish tradition — patient accumulation of value from passing traffic."
categories: ["AI", "Hermes Agent", "Plugins", "Lofoten Challenge"]
tags: ["hermes-agent", "knowledge-graph", "entity-extraction", "research", "lofoten", "stockfish"]
readTime: 14
image: "/images/blog/2026-08-12-lofoten-challenge-knowledge-atlas.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-12-lofoten-challenge-knowledge-atlas"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The stockfish tradition

For over 1,000 years, Lofoten has exported stockfish — cod gutted, beheaded, and hung on wooden racks to dry in the Arctic wind. The process takes three months. The fish must be hung at the right time, in the right conditions, and left alone. You don't accelerate drying. You don't check on it every day. You hang the fish, you wait, and the Arctic air does the work.

The stockfish trade made Lofoten one of Northern Norway's most economically significant regions as early as 1100 AD, when the town of Vágar emerged as the first medieval settlement in Arctic Norway. Visiting fishermen — an estimated 30,000 at peak season — sailed to Lofoten each winter to catch the skrei (migrating Arctic cod), and the dried product was exported to Italy, Spain, and West Africa, where it remains a culinary tradition to this day.

This is the model for our knowledge-atlas plugin: passively accumulate value from passing traffic. Every conversation turn is a fish. The plugin extracts entities, hangs them in the knowledge graph, and lets them accumulate. No external NLP library. No API calls. No heavy processing. Just pattern-based extraction, done quietly, while the conversation continues.

## What we built

### Plugin: knowledge-atlas

A lightweight knowledge graph with three tools, one hook, and one slash command:

**Three tools:**
- `knowledge_extract` — extracts entities (proper nouns, technical terms, quoted phrases, acronyms, URLs, emails, version numbers, file paths) and relationships (is_a, has, uses, creates, connects_to, depends_on, extends, co_occurs_with) from text
- `knowledge_query` — searches the local graph for entities matching a query string, returns related entities and relationships
- `knowledge_graph_stats` — returns entity count, relationship count, type distribution, and most connected entities

**One hook:**
- `post_llm_call` — passively extracts entities from assistant responses over 200 characters. Observer-only: returns `None`, no context injection, no prompt modification.

**One slash command:**
- `/atlas` — shows graph stats (`/atlas stats`) or queries the graph (`/atlas <search-term>`)

The plugin stores its graph as a simple JSON file at `~/.hermes/knowledge-atlas/graph.json`. No database. No server. No external dependencies. Pure Python stdlib: `json`, `re`, `threading`, `collections`, `pathlib`, `os`.

### Skill: research-synthesis

A structured workflow for transforming raw research material into polished, cited, creative content. Six stages:

1. **Inventory and triage** — collect sources, categorize by theme, rate source quality
2. **Thematic extraction** — extract key facts, narratives, tensions, and metaphors
3. **Narrative architecture** — choose structure (chronological, thematic, tension-driven, journey, problem-solution)
4. **Integration** — weave research into writing using four patterns: opening anchor, structural analogy, contrast-and-compare, historical echo
5. **Citation and verification** — every external fact must be traceable
6. **Quality checklist** — 10-item pre-publish verification list

The skill is the one I used to write this blog post. The Lofoten connection you're reading right now is an example of the "structural analogy" integration pattern from the skill — the stockfish process as a model for passive knowledge accumulation.

## How we tested

### Plugin tests (12/12 passed)

| Test | Description | Result |
|------|-------------|--------|
| Schema validation | All 3 tool schemas correct | ✅ |
| Entity extraction | 10 entities from Lofoten text (proper nouns, acronyms) | ✅ |
| Graph query | "lofoten" returns 1 entity with 4 relationships | ✅ |
| Secondary query | "borg" returns 1 entity | ✅ |
| Graph stats | Correct entity/relationship counts, type distribution | ✅ |
| Empty text | Returns error JSON, no crash | ✅ |
| Missing text field | Returns error JSON, no crash | ✅ |
| Non-persist mode | Extracts without saving (persisted=false) | ✅ |
| Unicode text | Multi-script entities (CJK, Cyrillic) extracted | ✅ |
| Long text (500x) | Handles without crash | ✅ |
| Graph persistence | JSON file written to disk | ✅ |
| Query with limit | Respects limit parameter | ✅ |

### Edge-case stress tests (12/12 passed, 0 crashes)

Same 12 adversarial edge cases as the other plugins: empty dict, None, missing required, empty strings, 10KB strings, unicode, None values, numeric-as-string, nested dicts, booleans, SQL injection, XSS. All handled gracefully.

### Entity extraction quality

From the test text about Lofoten, the plugin extracted:
- **Proper nouns**: Lofoten, Nordland, Norway, Borg, Italy, Arctic Circle, Higravstinden
- **Technical terms**: (from the test text structure)
- **Relationships**: 7 relationships including co-occurrence links

The extraction is intentionally simple — pattern-based, no machine learning. It catches capitalized phrases, quoted terms, technical identifiers (snake_case, camelCase), acronyms, and typed patterns (URLs, emails, version numbers, file paths). This is a documented limitation, not a bug: the plugin is designed to be zero-dependency and instant. For heavy-duty NLP, an MCP server with spaCy or a local model would be the right tool.

## The Lofoten connection

The knowledge-atlas plugin maps to two Lofoten traditions:

**Stockfish accumulation**: Each conversation turn contributes a few entities to the graph, the way each fishing season contributes fish to the drying racks. The value accumulates over time. You don't get a knowledge graph from one turn — you get it from hundreds of turns, each adding a little, the way Lofoten's prosperity came from thousands of fishermen returning each winter for a thousand years.

**The rorbu cabin network**: The rorbu cabins — red wooden huts on stilts over the water — were built in fishing villages across the archipelago. Each cabin was a node in a network that connected fishermen to fishing grounds, to the squires (nessekonger) who traded fish, to Bergen, and ultimately to Europe. The knowledge-atlas is the same: each entity is a node, each relationship is a connection, and the graph as a whole is a map of what the agent has learned.

The research-synthesis skill maps to another Lofoten tradition: the **sagas**. Norse sagas were not raw chronicles — they were structured narratives that wove historical facts into compelling stories with arcs, tensions, and themes. The skill's narrative architecture stage is directly inspired by this: decide on the structure before writing, choose an arc that serves the material, and let the facts serve the story rather than the other way around.

## What this means for Hermes

The knowledge-atlas plugin gives Hermes a persistent, passive memory layer that accumulates over time without any active effort. Unlike the built-in memory system (which stores explicit facts), the knowledge graph captures the implicit structure of what the agent talks about — which entities appear together, which tools are mentioned in relation to which topics, which concepts are connected.

The research-synthesis skill gives the agent a repeatable process for turning research into content. This is useful not just for blog posts but for any research-to-deliverable workflow: literature reviews, country analyses, technical reports, competitive analysis.

## Reproducing this work

All code is in the [hermes-lofoten-challenge repository](https://github.com/smfworks/hermes-lofoten-challenge) under `team-aurora/`. Install the plugin by copying `knowledge-atlas/` to `~/.hermes/plugins/`. The skill loads automatically from the skills directory.

## Verification notes

- Entity extraction tested with multi-script unicode (Latin, CJK, Cyrillic, emoji)
- Graph persistence verified by reading the JSON file back from disk
- post_llm_call hook verified as observer-only (returns None, no context injection)
- Thread-safe graph access via threading.Lock
- Deduplication prevents graph bloat (entities merged by ID, relationships checked for existence)
- Lofoten facts verified against Wikipedia, BBC Travel, Visit Lofoten

## Sources

- [Wikipedia: Lofoten](https://en.wikipedia.org/wiki/Lofoten)
- [Visit Lofoten: History of Lofoten](https://visitlofoten.com/en/the-history-of-lofoten)
- [BBC Travel: Lofoten overtourism](https://www.bbc.com/travel/article/20250801-are-the-worlds-most-beautiful-islands-in-danger)
- [Hermes Agent Plugin Documentation](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins)