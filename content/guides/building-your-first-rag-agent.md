---
slug: building-your-first-rag-agent
title: "Building Your First RAG Agent: A Step-by-Step Guide"
excerpt: "Build a retrieval-augmented generation agent from scratch. Pick a model, chunk documents, store embeddings, and answer questions grounded in your data."
category: Guides
tags:
  - rag
  - tutorial
  - beginner
  - embeddings
order: 6
last_verified: 2026-06-16
---

# Building Your First RAG Agent: A Step-by-Step Guide

## What you will build

A simple RAG agent that can answer questions from a set of documents. It will:

1. Load documents
2. Split them into chunks
3. Create embeddings
4. Store them in a vector database
5. Retrieve relevant chunks for a question
6. Generate an answer with citations

By the end, you will understand how the pieces fit together and where to upgrade.

---

## Architecture

```
Documents → Chunker → Embedder → Vector DB
                                       ↑
Question → Embedder → Similarity search → LLM → Answer + sources
```

The RAG pattern is the same whether you use Python, JavaScript, or a no-code tool. The components change; the architecture does not.

---

## Step 1: Pick your stack

For a first agent, use the simplest stack that works:

| Component | Beginner choice | Why |
|-----------|-----------------|-----|
| **Documents** | PDFs or Markdown files | Easy to inspect |
| **Chunker** | Recursive text splitter | Simple and effective |
| **Embedder** | OpenAI `text-embedding-3-small` or local `nomic-embed-text` | Cheap, reliable |
| **Vector DB** | Chroma | Runs locally, simple API |
| **LLM** | GPT-4o-mini or local Qwen3.5 | Fast and cheap |
| **Framework** | LangChain or LlamaIndex | Handles boilerplate |

---

## Step 2: Prepare your documents

Good RAG starts with clean source material.

- Convert PDFs to text using Unstructured, PyMuPDF, or your own parser.
- Strip headers, footers, and repeated navigation text.
- Fix obvious OCR errors.
- Save as plain text or Markdown.

Garbage in, garbage out. A good chunker cannot fix corrupted source text.

---

## Step 3: Chunk intelligently

Chunking is the most underrated part of RAG. Bad chunks lose context.

**Rules of thumb:**
- Target 300–500 tokens per chunk.
- Keep related paragraphs together.
- Add overlap between chunks (50–100 tokens).
- Preserve headings as metadata.
- Do not split tables or code blocks in the middle.

```python
# Example chunking parameters
chunk_size = 500
chunk_overlap = 100
separator = "\n\n"
```

---

## Step 4: Create and store embeddings

Embeddings turn text into vectors. The same query and chunk vectors can be compared for similarity.

```python
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader

loader = TextLoader("documents.txt")
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
chunks = splitter.split_documents(docs)

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings)
```

If you want local embeddings, swap `OpenAIEmbeddings` for Ollama embeddings:

```python
from langchain_ollama import OllamaEmbeddings
embeddings = OllamaEmbeddings(model="nomic-embed-text")
```

---

## Step 5: Retrieve relevant chunks

When a question arrives, embed it and search the vector database.

```python
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
results = retriever.invoke("How do I reset my API keys?")
```

Start with the top 5 chunks. Increase if answers need more context. Decrease if results are noisy.

---

## Step 6: Generate the answer

Pass the retrieved chunks and the question to the LLM with explicit instructions.

```python
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

llm = ChatOpenAI(model="gpt-4o-mini")
qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
answer = qa.invoke("How do I reset my API keys?")
```

A better prompt includes:

- Answer only from the provided context.
- Cite the source document.
- Say "I don't know" if the context does not contain the answer.
- Keep the answer concise.

---

## Step 7: Add citations

Trustworthy RAG agents show their work.

```python
# Add source metadata during chunking
for chunk in chunks:
    chunk.metadata["source"] = chunk.metadata.get("source", "unknown")
    chunk.metadata["page"] = chunk.metadata.get("page", "n/a")
```

Then include source titles and page numbers in the response. This prevents hallucinated claims and lets users verify.

---

## Where to upgrade next

| Upgrade | Why |
|---------|-----|
| Hybrid search | Combine vector + keyword for better recall |
| Reranker | Move the best chunks to the top |
| Metadata filtering | Filter by date, author, or tag before search |
| Query rewriting | Expand or rewrite questions for better retrieval |
| Multi-modal | Add images, audio, or video to the knowledge base |
| Evaluation | Measure answer correctness and retrieval accuracy |

---

## Common first-build mistakes

- **Chunks too big.** Large chunks dilute relevance.
- **Chunks too small.** Tiny chunks lose context.
- **No citation.** Users cannot trust the answer.
- **Ignoring duplicates.** The same content in many chunks wastes context window.
- **Skipping evaluation.** You will not know if changes help or hurt.

---

## First-week checklist

- [ ] Load and clean 3–5 real documents
- [ ] Chunk with overlap and headings
- [ ] Create embeddings (local or cloud)
- [ ] Store in Chroma or your chosen vector DB
- [ ] Ask 10 real questions
- [ ] Review which chunks were retrieved
- [ ] Tune chunk size and top-k
- [ ] Add citations
- [ ] Show a teammate and collect feedback

**Related:**
- [Choosing a Vector Database](/guides/choosing-a-vector-database)
- [Services: Unstructured, Chroma, Pinecone](/services)
