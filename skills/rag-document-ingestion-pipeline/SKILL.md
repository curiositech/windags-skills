---
license: Apache-2.0
name: rag-document-ingestion-pipeline
description: "Build production document ingestion pipelines with chunking, embedding, and vector DB storage. Activate on: document ingestion, chunking strategy, embedding pipeline, vector DB ingestion, RAG indexing. NOT for: LLM prompt design (prompt-engineer), retrieval query logic (ai-engineer), or vector DB ops/migration (vector-database-migration-tool)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - rag
  - embeddings
  - vector-database
  - document-processing
  - chunking
pairs-with:
  - skill: ai-engineer
    reason: RAG retrieval and query logic sits downstream of ingestion
  - skill: data-pipeline-engineer
    reason: ETL patterns for source extraction before chunking
  - skill: vector-database-migration-tool
    reason: Schema and index design for the target vector store
---

# RAG Document Ingestion Pipeline

Build production-grade document ingestion pipelines that chunk, embed, and store documents in vector databases for retrieval-augmented generation.

## Activation Triggers

**Activate on**: "document ingestion", "chunking strategy", "embedding pipeline", "vector DB ingestion", "RAG indexing", "ingest PDFs", "build knowledge base", "semantic chunking", "recursive chunking"

**NOT for**: LLM prompt design or retrieval query tuning (prompt-engineer, ai-engineer), vector DB operational migration (vector-database-migration-tool), or fine-tuning data preparation (fine-tuning-dataset-curator)

## Quick Start

1. **Identify sources** — PDFs, HTML, Markdown, databases, APIs. Use `unstructured` or `docling` for parsing.
2. **Choose chunking strategy** — Recursive character splitting for general text, semantic chunking for domain-specific content, or document-structure-aware chunking for technical docs.
3. **Select embedding model** — `text-embedding-3-large` (OpenAI), `embed-v4` (Cohere), or `BAAI/bge-m3` (local). Match dimensionality to your vector DB plan.
4. **Configure vector DB** — Pinecone (managed), Qdrant (self-hosted or cloud), Weaviate (multi-tenant), or pgvector (Postgres-native).
5. **Run ingestion with observability** — Batch embed, upsert with metadata, validate retrieval quality on a test set.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **Document Parsing** | unstructured, docling, PyMuPDF, markitdown | Handles PDF, DOCX, HTML, Markdown, images with OCR |
| **Chunking** | LangChain splitters, semantic-chunkers, chonkie | Recursive, semantic, markdown-header, code-aware |
| **Embedding Models** | OpenAI text-embedding-3, Cohere embed-v4, BGE-M3, Nomic Embed | Local or API; 256-3072 dimensions |
| **Vector Databases** | Pinecone, Qdrant, Weaviate, pgvector, Milvus | Managed or self-hosted; HNSW or IVF indexing |
| **Orchestration** | LangChain, LlamaIndex, Haystack, custom Python | Pipeline DAGs with retry and checkpointing |

## Architecture Patterns

### Pattern 1: Chunking Decision Tree

```
Document Type?
├── Structured (Markdown, HTML, code)
│   └── Structure-aware chunking (headers, functions)
│       └── Preserve hierarchy as metadata
├── Semi-structured (PDF with tables)
│   └── docling/unstructured → table extraction + text chunking
│       └── Embed tables as markdown, text as paragraphs
└── Unstructured (plain text, transcripts)
    └── Semantic chunking (embedding similarity breakpoints)
        └── Fallback: recursive character split (512-1024 tokens, 10% overlap)
```

### Pattern 2: Production Ingestion Pipeline

```
Sources ──→ [Parser] ──→ [Chunker] ──→ [Enricher] ──→ [Embedder] ──→ [Vector DB]
  │            │            │              │              │              │
  │         unstructured  recursive/    add metadata:   batch embed   upsert with
  │         docling       semantic      source, date,   (batch=256)   namespace
  │                                     section, hash                 partitioning
  │
  └── Dedup by content hash before embedding (saves 30-50% cost)
```

```python
# Production ingestion skeleton
from langchain_text_splitters import RecursiveCharacterTextSplitter
from hashlib import sha256

def ingest_documents(docs: list[str], collection: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=512, chunk_overlap=64,
        separators=["\n\n", "\n", ". ", " "]
    )
    seen_hashes = set()
    chunks = []
    for doc in docs:
        for chunk in splitter.split_text(doc):
            h = sha256(chunk.encode()).hexdigest()[:16]
            if h not in seen_hashes:
                seen_hashes.add(h)
                chunks.append({"text": chunk, "hash": h})
    # Batch embed and upsert
    embeddings = embed_batch([c["text"] for c in chunks], batch_size=256)
    vector_db.upsert(collection, chunks, embeddings)
```

### Pattern 3: Metadata-Enriched Chunks

Always store metadata alongside vectors for filtered retrieval:

```python
metadata = {
    "source": "docs/api-reference.md",
    "section": "Authentication",
    "chunk_index": 3,
    "total_chunks": 12,
    "ingested_at": "2026-03-20T00:00:00Z",
    "content_hash": "a1b2c3d4",
    "token_count": 487,
}
```

## Anti-Patterns

1. **Fixed-size chunking without overlap** — Splits mid-sentence, destroys context. Always use overlap (10-15%) or semantic boundaries.
2. **Embedding everything without deduplication** — Near-duplicate chunks waste storage and degrade retrieval. Hash-dedup or use MinHash for fuzzy dedup.
3. **Ignoring chunk metadata** — Without source, section, and date metadata, you cannot filter, cite, or refresh stale content.
4. **One embedding model for all domains** — Legal text and code have different semantic spaces. Benchmark retrieval quality per domain before committing.
5. **No ingestion idempotency** — Re-running ingestion creates duplicates. Use content hashes as vector IDs for upsert-based idempotency.

## Quality Checklist

- [ ] Chunking strategy matches document structure (not just fixed-size)
- [ ] Chunk sizes benchmarked for retrieval quality (typically 256-1024 tokens)
- [ ] Overlap configured to preserve cross-boundary context
- [ ] Deduplication prevents redundant embeddings
- [ ] Metadata attached to every chunk (source, section, date, hash)
- [ ] Embedding model dimensionality matches vector DB index config
- [ ] Batch embedding with retry logic for API failures
- [ ] Ingestion is idempotent (re-run safe via content-hash IDs)
- [ ] Retrieval quality validated on test queries before production
- [ ] Monitoring: ingestion throughput, embedding latency, DB storage growth
