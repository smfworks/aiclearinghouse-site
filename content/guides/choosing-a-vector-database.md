---
slug: choosing-a-vector-database
title: "Choosing a Vector Database for RAG Agents"
excerpt: "Pinecone vs Chroma vs Supabase pgvector vs Weaviate. A practical comparison for agent builders who need retrieval that does not become a bottleneck."
category: Guides
tags:
  - vector-db
  - rag
  - comparison
  - infrastructure
order: 3
last_verified: 2026-06-16
---

# Choosing a Vector Database for RAG Agents

## What a vector database actually does

A vector database stores embeddings — numerical representations of text, images, or other content — and finds the most similar ones to a query. For agents, this is the memory layer behind retrieval-augmented generation (RAG). Pick the wrong one and your agent becomes slow, expensive, or forgetful.

This guide compares the databases most commonly used in agent stacks and tells you which to pick for which situation.

---

## Comparison matrix

| Database | Best for | Scaling | Managed | Pricing model | When to choose |
|----------|----------|---------|---------|---------------|----------------|
| **Pinecone** | Production RAG at scale | Excellent | Yes | Usage-based | You want a managed vector store that just works |
| **Chroma** | Prototyping and local-first | Good | Cloud option | Open source / usage | You want open-source with minimal ops |
| **Supabase pgvector** | Full-stack apps | Moderate | Yes | Database pricing | You already use Postgres |
| **Weaviate** | Complex search + GraphQL | Good | Self or cloud | Open source / usage | You need hybrid search and modular AI |
| **Qdrant** | High-performance filtering | Good | Self or cloud | Open source / usage | Metadata filtering is critical |
| **Milvus/Zilliz** | Massive billion-scale datasets | Excellent | Cloud | Usage-based | You operate at very large scale |

---

## Pinecone

Pinecone is the default choice for production RAG agents. It is fully managed, fast, and scales without drama.

**Pros:**
- No index tuning headaches
- Metadata filtering built in
- Hybrid search (sparse + dense vectors)
- Strong uptime and support

**Cons:**
- Costs grow with stored vectors and queries
- Less flexible than self-hosted options
- Vendor lock-in if you depend on proprietary features

**Choose when:** You have real production traffic and want vector search to be someone else’s problem.

---

## Chroma

Chroma is designed for AI developers. It is easy to run locally, has a simple API, and can scale to cloud hosting.

**Pros:**
- Local-first; ideal for development
- Simple Python/JavaScript APIs
- Open-source, no lock-in
- Full-text + vector hybrid search

**Cons:**
- Self-hosted ops are on you
- Managed offering is newer than Pinecone
- Extreme scale may need sharding

**Choose when:** You are building locally, want open-source, and expect moderate scale.

---

## Supabase pgvector

Supabase adds the `pgvector` extension to Postgres, letting you store embeddings alongside your application data.

**Pros:**
- One database for everything
- Strong auth, RLS, and real-time features
- Familiar SQL queries
- Managed hosting available

**Cons:**
- Vector performance good but not best-in-class
- Large-scale similarity search needs tuning
- pgvector can bloat tables with high-dimensional vectors

**Choose when:** You already use Postgres and your vector workload is not the dominant part of your system.

---

## Weaviate

Weaviate is a vector search engine with built-in AI modules, GraphQL interface, and hybrid search.

**Pros:**
- Modular AI integrations
- Strong hybrid and generative search
- Self-hostable and cloud-hosted
- GraphQL is familiar to many frontend teams

**Cons:**
- More complex setup than Chroma
- Smaller community than Pinecone
- Some features feel enterprise-focused

**Choose when:** You need rich search features beyond pure vector similarity and want modular AI integrations.

---

## Decision tree

**1. Do you need a fully managed, production-ready vector store today?**
→ Yes → Pinecone or Weaviate Cloud.

**2. Do you want open-source with minimal ops?**
→ Yes → Chroma.

**3. Do you already run on Postgres?**
→ Yes → Supabase pgvector first; evaluate Pinecone if you hit limits.

**4. Is metadata filtering a core requirement?**
→ Yes → Qdrant, Weaviate, or Pinecone.

**5. Are you building at prototype scale?**
→ Yes → Chroma or Supabase.

---

## Common mistakes

- **Over-engineering scale.** Most agents never need billion-vector databases. Start simple.
- **Ignoring metadata filtering.** Pure vector search is rarely enough; you usually need tags, dates, or ownership filters.
- **Forgetting embedding choice.** The database matters less than the embedding model quality.
- **Neglecting chunking.** Bad chunks make the best database useless.

---

## Quick-start recommendation

For a new agent project, start with **Chroma** locally. When you deploy:

- If you want managed: move to **Pinecone**.
- If you already use Supabase: use **pgvector**.
- If you need advanced search: evaluate **Weaviate**.

**Related:**
- [Services: Pinecone, Chroma, Supabase](/services)
- [Choosing Your First AI Agent](/guides/choosing-your-first-agent)
