---
license: Apache-2.0
name: vector-database-migration-tool
description: 'Migrate vector data between Pinecone, Qdrant, Weaviate, pgvector with re-embedding and schema mapping. Activate on: vector DB migration, switch vector database, re-embed collection, migrate embeddings. NOT for: initial ingestion (rag-document-ingestion-pipeline), embedding model training (ai-engineer).'
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: Data & Analytics
tags:
  - vector-database
  - migration
  - embeddings
  - schema-mapping
pairs-with:
  - skill: rag-document-ingestion-pipeline
    reason: Source and target ingestion patterns feed migration design
  - skill: data-pipeline-engineer
    reason: ETL orchestration for large-scale vector migrations
---

# Vector Database Migration Tool

Migrate vector collections between Pinecone, Qdrant, Weaviate, and pgvector with schema mapping, optional re-embedding, and zero-downtime cutover strategies.

## Activation Triggers

**Activate on**: "migrate vectors", "switch from Pinecone to Qdrant", "re-embed collection", "vector DB migration", "move embeddings to pgvector", "change embedding model", "vector schema migration"

**NOT for**: First-time document ingestion (rag-document-ingestion-pipeline), embedding model fine-tuning (ai-engineer), or vector search query optimization (ai-engineer)

## Quick Start

1. **Audit source** — Export schema, index config, metadata fields, vector dimensions, and total record count from the source DB.
2. **Map schema** — Translate field names, data types, and index settings to the target DB's format. Handle dimension mismatches if re-embedding.
3. **Choose strategy** — Direct copy (same embedding model) or re-embed (new model). Re-embedding requires access to original text.
4. **Run migration** — Stream records in batches (1000-5000), transform, upsert to target. Checkpoint progress for resumability.
5. **Validate and cutover** — Compare record counts, run retrieval quality tests on both DBs, then switch traffic.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **Source/Target DBs** | Pinecone, Qdrant, Weaviate, pgvector, Milvus, Chroma | Any-to-any migration support |
| **Re-embedding** | OpenAI, Cohere, BGE, Nomic | When switching embedding models |
| **Schema Mapping** | Custom Python, Pydantic transforms | Field renaming, type coercion, metadata reshaping |
| **Orchestration** | Python asyncio, Apache Airflow, Prefect | Batched streaming with checkpoints |
| **Validation** | Recall@k comparison, cosine similarity checks | Before/after retrieval quality |

## Architecture Patterns

### Pattern 1: Direct Copy (Same Embedding Model)

```
Source DB ──→ [Stream Batches] ──→ [Transform Schema] ──→ [Upsert Target]
   │              │                       │                      │
   │          scroll/paginate        map fields,            batch upsert
   │          batch_size=2000        rename keys,           with retry
   │                                 coerce types
   └── Checkpoint: last_offset stored in Redis/file for resumability
```

```python
# Direct migration: Qdrant → pgvector
import asyncio
from qdrant_client import QdrantClient

async def migrate_direct(source_url: str, pg_conn: str, collection: str):
    qdrant = QdrantClient(url=source_url)
    offset = load_checkpoint(collection)  # Resume support

    while True:
        records, next_offset = qdrant.scroll(
            collection, offset=offset, limit=2000, with_vectors=True
        )
        if not records:
            break

        rows = [(r.id, r.vector, json.dumps(r.payload)) for r in records]
        await pg_upsert_batch(pg_conn, rows)  # INSERT ... ON CONFLICT
        save_checkpoint(collection, next_offset)
        offset = next_offset
```

### Pattern 2: Re-embedding Migration

```
Source DB ──→ [Extract Text + Metadata] ──→ [New Embedder] ──→ [Target DB]
   │                    │                         │                  │
   │              pull original text          batch embed        upsert with
   │              from payload/metadata       new dimensions     new vectors
   │
   └── CRITICAL: original text must be stored in source metadata
       If not available, extract from document store separately
```

### Pattern 3: Zero-Downtime Cutover

```
Phase 1: Dual-write (new records go to both DBs)
Phase 2: Backfill (migrate historical data to target)
Phase 3: Shadow read (query both, compare results, log diffs)
Phase 4: Cutover (switch reads to target, stop writes to source)
Phase 5: Decommission (archive source after 7-day bake period)
```

## Anti-Patterns

1. **Big-bang migration without checkpointing** — A failure at record 950,000 of 1,000,000 means restarting from zero. Always checkpoint batch offsets.
2. **Skipping retrieval validation** — Record counts match but recall@10 dropped 15%. Always run the same test queries against both DBs and compare.
3. **Re-embedding without original text** — If source metadata lacks the original text, you cannot re-embed. Verify text availability before planning a re-embed migration.
4. **Ignoring dimension mismatches** — Copying 1536-dim vectors into a 1024-dim index silently truncates or errors. Validate dimensions match, or plan for re-embedding.
5. **No rollback plan** — Keep the source DB running and queryable until the target is validated in production for at least one week.

## Quality Checklist

- [ ] Source audit completed: record count, dimensions, metadata schema, index type
- [ ] Schema mapping documented and tested on sample batch
- [ ] Migration is resumable via checkpointed offsets
- [ ] Batch size tuned for target DB rate limits (typically 1000-5000)
- [ ] Re-embedding path verified: original text accessible in source metadata
- [ ] Record count matches between source and target after migration
- [ ] Retrieval quality validated: recall@k on test queries within 2% of source
- [ ] Dual-write or shadow-read phase used for zero-downtime cutover
- [ ] Rollback plan documented: source DB retained for minimum 7 days post-cutover
- [ ] Cost estimated: re-embedding API calls, target DB storage, migration compute time
