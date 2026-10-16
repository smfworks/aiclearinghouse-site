---
slug: "2026-10-16-leave-upsert-approval-on"
title: "Hand the agent the collection tool. Leave upsert approval on."
excerpt: "Expose search as a tool, keep upsert and delete behind approval, and do not treat the in-memory store or scope_filter as production controls. The steps are the October 15 Agent Framework post and the Learn page refreshed the same day."
date: "2026-10-16"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-16-leave-upsert-approval-on"
categories: ["Microsoft", "AI Agents"]
tags: ["Agent Framework", "vector stores", "Python", "approvals"]
readTime: 11
image: "/images/blog/2026-10-16-leave-upsert-approval-on-hero.png"
---

If you are about to copy `never_require` into a production agent, stop. Hand the agent the collection tool. Leave upsert approval on. Eduard van Valkenburg's October 15 Agent Framework post is the Python how-to. I did not install a connector, upsert a record, or call a model on this host. The steps below are the ones that post and the Learn page actually print.

The dated primary is [Vector stores in Agent Framework for Python: familiar foundations, streamlined for agents](https://devblogs.microsoft.com/agent-framework/vector-stores-in-python-agent-framework-familiar-foundations-streamlined-for-agents/). The visible date is October 15th, 2026. `article:published_time` is `2026-10-15T12:10:05+00:00`, which matches the Agent Framework RSS `pubDate` of Thu, 15 Oct 2026 12:10:05 +0000. That is still inside 48 hours of this morning. The byline is Eduard van Valkenburg, Senior Software Engineer. The post says it was partially created with the help of AI, and that an author reviewed and revised it. Prefer the Learn page when the two pages overlap on a knob.

The knob page is [Vector store integrations](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/vector-stores). This run read `ms.date` `2026-10-15T00:00:00Z` and `updated_at` `2026-10-15T11:08:00Z` from the live HTML. The visible last-updated widget is a `local-time` element, so the static HTML I fetched did not print a rendered calendar day. Cite the meta, not a guessed widget date.

The Foundry feed's newest item this morning is [What's new in Microsoft Foundry | September 2026](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-september-2026/). Its `pubDate` is Fri, 16 Oct 2026 02:04:50 +0000. That page is a September catalog, not this how-to. Do not reopen yesterday's catch-target post either.

## Read the experimental warning before you install a connector

The blog says the vector-store APIs remain experimental, and the integration packages are alpha or beta. Use each implementation's documentation for setup and its supported capabilities. Learn says the native Python contracts are experimental, and limited breaking changes might occur before they become stable.

Those contracts live in `agent-framework-core`. They do not require Pydantic, NumPy, pandas, or Semantic Kernel. That is a dependency statement, not a reason to skip the warning. Install with `--pre` when you leave the in-memory store. Do not treat a beta package name as a promise that the API is frozen.

This post stays on the Python steps. The blog's .NET link is a different page. I did not use it here.

## Define the record, then start in memory

Agent Framework starts with your data model, not a database SDK model. Mark the key, data, and vector fields with `VectorStoreField`. `@vectorstoremodel` derives the collection. The blog sample uses a dataclass named `Document`, collection name `documents`, a string key, an indexed `category` data field, a `text` data field, and a vector field with `dimensions=1536` and `distance_function="cosine_similarity"`.

The same sample builds an `InMemoryCollection` with `OpenAIEmbeddingClient(model="text-embedding-3-small")`, calls `ensure_collection_exists()`, then upserts one record whose embedding value is the same sentence as the text. Set `OPENAI_API_KEY` before you run that sample. The records are stored in memory, so they will not survive a restart. OpenAI generates embeddings during both upsert and search. I did not set that key, and I did not run the sample.

Dataclasses are one option. The blog says the same model layer supports Pydantic models, msgspec structs, plain classes, dictionaries, and externally owned types through custom codecs. Learn adds that you use `VectorStoreCollectionDefinition` directly for dictionaries, and `register_vectorstoremodel()` when another package owns the type. Array-like vector values serialize through `tolist()` without adding a NumPy dependency.

Learn's in-memory store is process-local and uses a linear scan. Use it for development and tests. Do not leave `InMemoryCollection` as the production store. The blog says you can swap that collection for another implementation without changing the rest of the sample. That swap is a type change, not a free pass on the connector's limits. Read the row before you swap.

## If the vectors already exist, say so

Learn's precomputed sample passes `generate_vectors=False`. The comment on that page says the sample already has vectors, so generation is disabled explicitly. Filter values are ordinary data. No Python source is parsed or executed.

`embeddings_options` and `embeddings_options_by_field` are mutually exclusive. Pass `embeddings_options` to `upsert()` when every generated vector field should get the same provider options. Use the by-field argument when they should not. Upsert embedding options require generated vectors. They cannot be combined with `generate_vectors=False`.

For a query, pass `embeddings_options` to `search()` or `create_vector_search_tool()`. Agent Framework supplies the selected vector field's declared dimensions and rejects a conflicting `dimensions` value before it calls the embedding provider. Search embedding options require a local embedding generator. They are ignored when you supply a precomputed query vector.

Do not invent a dimension. The Learn samples use `dimensions=3` and `dimensions=2` as illustrations. The history sample on the same page uses `1536`. The blog sample also uses `1536` with `text-embedding-3-small`. Those numbers belong to the samples that print them. They are not a universal default.

## Expose search as a tool, with an enum when the choices are known

`create_vector_search_tool` wraps a searchable collection. The blog says you can control its name, description, result shape, filters, and approval behavior. Put a `Param` inside a `Filter` or `FilterGroup` and the helper exposes it as a typed argument the model can supply.

The blog's short sample uses a `Literal` of `engineering`, `operations`, and `product`, marks it `required=False`, and filters `category` with `eq`. The resulting tool always accepts a natural-language query and optionally accepts `category`. The `Literal` values become an enum in the tool schema. If the model omits the optional parameter, that filter is omitted. More complex tools can compose several parameters through `FilterGroup`.

Learn's hotel sample does the same job with a longer category enum and a float `min_rating` bounded from 0 to 5. Use `Literal` when the allowed values are known. Do not invent a third enum. That blog sample does not show an approval dict. The approval default lives on the context-provider section, not in that short tool snippet.

## If the app owns the collection, leave the approval defaults alone

Use `VectorCollectionContextProvider` when your application owns the collection and the data model. Learn says the provider adds generated CRUD and search tools. Upsert and delete require approval by default. Get and search do not.

The blog describes the same provider as the higher-level experience when an agent needs more than one focused search tool. It can add upsert, get, delete, and search tools, together with instructions for using them. You can expose a read-only knowledge collection, let an agent manage records with approvals, scope the available data, or replace the default search with specialized tools. Embedding setup stays specific to the operation. Ingestion can use document embedding options while search uses query embedding options. Generated tools forward those settings to the same collection.

The Learn sample sets `approval_mode={"upsert": "never_require"}` so a scripted interaction can run unattended. The comment on that page says omitted mapping entries keep their safe defaults, and that delete still requires approval. Get and search remain read-only. That dict is the sample's unattended-script setting. Do not copy `never_require` into a production how-to. If a person should see the write before it lands, leave the default.

The same sample uses `OpenAIChatClient(model="gpt-5.4-nano")` and the instruction "Do not invent stored notes." I did not call that model. Follow the instruction anyway. If the tool did not return a note, the agent does not get to write one into the answer.

## Do not treat scope_filter as a lock

Pass `scope_filter` to group records for the generated tools. Learn says do not treat the filter as an authorization boundary or an atomic backend guarantee. Search tools passed through `additional_search_tools` keep their own filters, so apply an equivalent filter to each custom tool when a collection is shared.

The sample sets `scope_filter=None` because that process-local collection holds only the sample's records. That is a lab convenience. It is not a pattern for a shared store. If two tenants can reach the same collection, the filter line is not the lock. Authorize in the application, and use scoped credentials or a namespace. The page says that in the history section. It applies here too, because the collection-provider warning is the same shape.

## If the problem is a growing transcript, say what compaction does not do

`VectorStoreHistoryProvider` persists the conversation in a searchable collection and loads a compacted working set. The blog says that when `include_search_tool=True`, the agent also receives a tool for searching the complete scoped transcript. The active context can stay bounded. The agent retrieves an older decision when it needs it, instead of carrying every prior message on every turn.

Learn is more precise about the limit. Compaction reduces only the history loaded into model context. If you enable the search tool, it searches the full scoped transcript. Application, tenant, agent, source, and session identifiers prevent accidental overlap. They do not authorize access. The page says the application must still authorize access and use scoped credentials or namespaces.

The history sample sets those identifiers to `release-planning`, `contoso`, and `release-assistant`, uses `SlidingWindowStrategy(keep_last_groups=2, preserve_system=True)`, and turns the search tool on. The chat client is again `gpt-5.4-nano`. Those labels are not an authorization scheme. I did not open the GitHub sample file the blog links.

## Pick the package from the Learn table

Install with `--pre`. Do not assume keyword-hybrid. Learn's native table names in-memory, Azure AI Search, Azure Cosmos DB for NoSQL, Azure DocumentDB, DuckDB, MongoDB, Oracle AI Database, PostgreSQL with pgvector, Qdrant, Redis, and SQL Server. The blog's integration list names the same stores, and it writes the Oracle row as Oracle AI Database 26ai. The in-memory store ships in `agent-framework-core`. The others are separate packages.

Azure AI Search is the row that says dense vector and keyword-hybrid. The package is `agent-framework-azure-ai-search`, beta, with experimental vector APIs. The same row says one top-level dense vector field per query, and that some thresholds, hybrid text-recall controls, strict post-filtering, and permissions require a supporting preview SDK or API and `allow_preview=True`.

Several other rows say keyword and hybrid search are not supported. That includes Cosmos DB for NoSQL, DocumentDB, DuckDB, MongoDB, Oracle, PostgreSQL with pgvector, Qdrant, Redis, and SQL Server. If the workload needs keyword-hybrid, start on the Azure AI Search row. Do not discover that limit after you have upserted a week of records into a store that cannot do it.

Read the Key limitations column before you swap. SQL Server requires Python 3.10–3.14. On Python 3.15 or later, `agent-framework-postgres` uses pure-Python Psycopg because compatible binary wheels are not published, so the host must provide `libpq`. I did not install that package. The other rows have their own version floors, key types, and unsupported filters. The table is the list. Do not reconstruct it from the blog's swap sentence.

The two connector families are not interchangeable with Semantic Kernel. A store can have both connectors and still be a different contract. Read the Agent Framework package column, not the Semantic Kernel link, when you are writing Agent Framework code.

## Do not install an Agent Framework package for a Semantic Kernel-only store

Learn says these do not currently have a native Agent Framework connector: Azure Cosmos DB for MongoDB vCore, Chroma, Faiss, Pinecone, Weaviate, plus planned Elasticsearch and SQLite. Neon Serverless Postgres says to use the Postgres implementation. If the store you already run is on that list, keep using Semantic Kernel's connector, or move to a native row. Do not pip-install a package name you invented for a store the table marks as Semantic Kernel-only.

Vector store integration is not yet available in Agent Framework for Go. That sentence is the Learn page. Do not draft a Go how-to from the Python samples.

The blog points at runnable samples under `python/samples/02-agents/vector_stores` and at `vector_store_history_provider.py`. This run did not fetch those files. Use the pages above for the knobs. Open the sample tree when you are ready to run one, and use the connector README for setup. I did not time an upsert, and I do not have a score to report.

Leave upsert approval on until you have a reason, written down, to turn it off. The Learn sample's reason is an unattended script. A shared collection is not that script.

If the collection is shared, where are you enforcing the tenant boundary, given that `scope_filter` is not one?
