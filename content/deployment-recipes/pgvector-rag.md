---
slug: pgvector-rag
title: Self-Hosted pgvector for RAG Applications
excerpt: Add persistent memory to your AI agents with PostgreSQL and pgvector. The essential database layer for retrieval-augmented generation.
category: Database
tags:
  - postgresql
  - pgvector
  - rag
  - vector-database
  - embeddings
  - memory
  - self-hosting
order: 6
last_verified: 2026-06-15
---

# Self-Hosted pgvector for RAG Applications

## The promise

AI agents without memory are amnesiacs. Every conversation starts from zero. Retrieval-Augmented Generation (RAG) fixes this by giving agents access to a knowledge base they can query in real time. pgvector is the simplest way to add that memory — it turns PostgreSQL into a vector database, letting you store embeddings and search by semantic similarity.

This recipe sets up PostgreSQL with the pgvector extension, then connects it to an agent framework (OpenClaw, LangChain, or raw Python) for document retrieval.

## What you'll get

- PostgreSQL 16 with pgvector extension
- A table for document embeddings with metadata
- Semantic search via cosine similarity
- Integration example with Python and Ollama
- Docker deployment option

## Prerequisites

- Docker installed (recommended) OR PostgreSQL 16+ installed locally
- 2GB RAM minimum (4GB recommended)
- Basic SQL knowledge

## Step 1: Start PostgreSQL with pgvector (Docker)

```bash
docker run -d \
  --name pgvector \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=ragdb \
  -v pgvector-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  ankane/pgvector:latest
```

Wait 10 seconds for initialization, then verify:

```bash
docker exec -it pgvector psql -U postgres -d ragdb -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
```

You should see one row with `extname = vector`.

## Step 2: Create the documents table

Connect to the database:

```bash
docker exec -it pgvector psql -U postgres -d ragdb
```

Create the table:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(768),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

The `VECTOR(768)` dimension matches nomic-embed-text embeddings. Adjust if using a different model.

Exit psql: `\q`

## Step 3: Generate embeddings with Ollama

Pull an embedding model:

```bash
ollama pull nomic-embed-text
```

Create a Python script `embed.py`:

```python
import requests
import json

def get_embedding(text):
    response = requests.post(
        'http://localhost:11434/api/embeddings',
        json={
            'model': 'nomic-embed-text',
            'prompt': text
        }
    )
    return response.json()['embedding']

# Test
text = "Retrieval-Augmented Generation gives AI agents access to external knowledge."
embedding = get_embedding(text)
print(f"Embedding length: {len(embedding)}")  # Should be 768
```

Run:

```bash
python embed.py
```

## Step 4: Store documents with embeddings

Create `store.py`:

```python
import psycopg2
import requests

# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="ragdb",
    user="postgres",
    password="yourpassword"
)
cur = conn.cursor()

def get_embedding(text):
    response = requests.post(
        'http://localhost:11434/api/embeddings',
        json={'model': 'nomic-embed-text', 'prompt': text}
    )
    return response.json()['embedding']

# Sample documents
docs = [
    "Ollama runs large language models locally on consumer hardware.",
    "pgvector adds vector similarity search to PostgreSQL.",
    "RAG combines retrieval systems with text generation models.",
    "Local LLMs keep data private by avoiding cloud APIs.",
]

for doc in docs:
    embedding = get_embedding(doc)
    cur.execute(
        "INSERT INTO documents (content, embedding) VALUES (%s, %s)",
        (doc, embedding)
    )

conn.commit()
print(f"Stored {len(docs)} documents")
conn.close()
```

Run:

```bash
pip install psycopg2-binary requests
python store.py
```

## Step 5: Query by semantic similarity

Create `query.py`:

```python
import psycopg2
import requests

conn = psycopg2.connect(
    host="localhost",
    database="ragdb",
    user="postgres",
    password="yourpassword"
)
cur = conn.cursor()

def get_embedding(text):
    response = requests.post(
        'http://localhost:11434/api/embeddings',
        json={'model': 'nomic-embed-text', 'prompt': text}
    )
    return response.json()['embedding']

# Ask a question
question = "How can I keep my AI data private?"
question_embedding = get_embedding(question)

# Find most similar documents
cur.execute("""
    SELECT content, 1 - (embedding <=> %s::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> %s::vector
    LIMIT 3;
""", (question_embedding, question_embedding))

results = cur.fetchall()
print(f"Question: {question}\n")
for content, similarity in results:
    print(f"[{similarity:.3f}] {content}")

conn.close()
```

Run:

```bash
python query.py
```

You should see the "Local LLMs keep data private" document ranked highest.

## Step 6: Integrate with an agent

### OpenClaw

Add a skill that queries pgvector:

```typescript
// In your OpenClaw skill
async function retrieveContext(query: string): Promise<string> {
  const embedding = await getEmbedding(query);
  const result = await pgClient.query(
    "SELECT content FROM documents ORDER BY embedding <=> $1::vector LIMIT 3",
    [embedding]
  );
  return result.rows.map(r => r.content).join("\n---\n");
}
```

### LangChain

```python
from langchain_community.vectorstores import PGVector
from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(model="nomic-embed-text")

vectorstore = PGVector(
    connection_string="postgresql://postgres:yourpassword@localhost:5432/ragdb",
    embedding_function=embeddings,
    collection_name="documents"
)

# Add documents
vectorstore.add_texts(docs)

# Query
results = vectorstore.similarity_search("How to keep data private?", k=3)
```

## Maintenance

### Backup the database

```bash
docker exec pgvector pg_dump -U postgres ragdb > ragdb-backup.sql
```

### Monitor disk usage

Embeddings consume space:
- 768-dimensional float = ~3KB per document
- 1 million documents = ~3GB

Monitor with:

```bash
docker exec pgvector psql -U postgres -d ragdb -c "
  SELECT pg_size_pretty(pg_total_relation_size('documents'));
"
```

### Vacuum after bulk inserts

```bash
docker exec pgvector psql -U postgres -d ragdb -c "VACUUM ANALYZE documents;"
```

## Troubleshooting

### "extension vector does not exist"

The pgvector image was not used. Ensure you started the container with `ankane/pgvector:latest`.

### "dimension does not match"

Your embedding model outputs a different dimension than your table. Check:

```python
print(len(embedding))  # Should match VECTOR(N) in your table
```

Common dimensions:
- nomic-embed-text: 768
- mxbai-embed-large: 1024
- bge-large-en: 1024

### Slow queries on large datasets

Add more IVF lists:

```sql
DROP INDEX documents_embedding_idx;
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 1000);  -- Increase for millions of docs
```

Or use HNSW index (faster, more memory):

```sql
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
```

## Best fit

Anyone building AI applications that need persistent memory: chatbots that remember past conversations, research assistants that recall papers, coding agents that know your codebase. pgvector is the pragmatic choice when you already know PostgreSQL and don't want to learn a specialized vector database.
