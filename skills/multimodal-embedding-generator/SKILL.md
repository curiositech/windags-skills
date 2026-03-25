---
license: Apache-2.0
name: multimodal-embedding-generator
description: "Generate cross-modal embeddings with CLIP, SigLIP, and ImageBind for text-image-audio search. Activate on: multimodal search, text-to-image search, cross-modal embeddings, CLIP embeddings, visual search. NOT for: text-only embeddings (ai-engineer), image classification (computer-vision-pipeline)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - multimodal
  - embeddings
  - clip
  - cross-modal-search
  - siglip
pairs-with:
  - skill: clip-aware-embeddings
    reason: Shared CLIP foundation for visual-semantic alignment
  - skill: rag-document-ingestion-pipeline
    reason: Multimodal embeddings feed into vector DB ingestion
  - skill: computer-vision-pipeline
    reason: Image preprocessing before embedding extraction
---

# Multimodal Embedding Generator

Generate unified embeddings across text, images, and audio using CLIP, SigLIP, and ImageBind for cross-modal retrieval and search.

## Activation Triggers

**Activate on**: "multimodal search", "text-to-image search", "image-to-text retrieval", "cross-modal embeddings", "CLIP embeddings", "visual search engine", "SigLIP", "ImageBind", "find similar images by description"

**NOT for**: Text-only embedding and RAG (ai-engineer), image classification or object detection (computer-vision-pipeline), or image generation from text (image-generation-workflow-engine)

## Quick Start

1. **Define modalities** — Which cross-modal searches do you need? Text-to-image, image-to-text, audio-to-text, or all combinations.
2. **Select model** — SigLIP for text-image (best accuracy/speed), CLIP for broad compatibility, ImageBind for 6-modality coverage.
3. **Preprocess inputs** — Resize images to model input size, tokenize text, resample audio to 16kHz.
4. **Generate embeddings** — Batch encode through the chosen model, normalize to unit vectors.
5. **Index and search** — Store in a vector DB with modality metadata, query with any modality.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **Text-Image** | SigLIP, CLIP (ViT-L/14, ViT-bigG), OpenCLIP | SigLIP preferred for 2026: better zero-shot accuracy |
| **6-Modality** | ImageBind (Meta) | Text, image, audio, depth, thermal, IMU |
| **Local Inference** | transformers, open_clip, torch | GPU or MPS (Apple Silicon) |
| **API-Based** | Voyage AI multimodal, Cohere embed-v4 | Managed, no GPU needed |
| **Indexing** | Pinecone, Qdrant, Weaviate, pgvector | Same vector DB for all modalities |

## Architecture Patterns

### Pattern 1: Unified Multimodal Index

```
Text ──→ [SigLIP Text Encoder] ──┐
                                  ├──→ [Normalize] ──→ [Vector DB]
Image ──→ [SigLIP Vision Encoder]─┘        │              │
                                       L2 normalize    single index,
                                       to unit sphere  modality in metadata

Query (any modality) ──→ [Encode] ──→ [Vector DB Search] ──→ Results (any modality)
```

```python
# SigLIP cross-modal embedding
from transformers import AutoProcessor, AutoModel
import torch

model = AutoModel.from_pretrained("google/siglip-large-patch16-384")
processor = AutoProcessor.from_pretrained("google/siglip-large-patch16-384")

def embed_image(image):
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        emb = model.get_image_features(**inputs)
    return torch.nn.functional.normalize(emb, dim=-1).squeeze().numpy()

def embed_text(text: str):
    inputs = processor(text=text, return_tensors="pt", padding=True)
    with torch.no_grad():
        emb = model.get_text_features(**inputs)
    return torch.nn.functional.normalize(emb, dim=-1).squeeze().numpy()

# Same vector space: cosine similarity works across modalities
```

### Pattern 2: ImageBind 6-Modality Pipeline

```
Modalities:
  Text ───────┐
  Image ──────┤
  Audio ──────┤
  Depth ──────┼──→ [ImageBind Encoder] ──→ [Shared 1024-dim Space] ──→ [Vector DB]
  Thermal ────┤
  IMU ────────┘

Use case: "Find the video clip that sounds like this audio sample"
         Audio query → ImageBind → nearest neighbors → returns video/image/text matches
```

### Pattern 3: Hybrid Text + Visual RAG

```
Document with images
    ├── Text chunks ──→ [Text Embedder] ──────────→ [Vector DB: text namespace]
    └── Figures/diagrams ──→ [SigLIP Vision] ──→ [Vector DB: image namespace]

Query ──→ [Text Embed] ──→ search text namespace ──┐
      └──→ [Vision Embed] ──→ search image namespace──┼──→ [Rerank + Fuse] ──→ Answer
                                                       │
                                                  reciprocal rank fusion
```

## Anti-Patterns

1. **Mixing embedding models in one index** — CLIP and SigLIP produce incompatible vector spaces. Never mix models in a single collection.
2. **Skipping normalization** — Cross-modal similarity requires L2-normalized vectors. Without normalization, cosine similarity is meaningless.
3. **Using CLIP for production without evaluating SigLIP** — SigLIP (2024+) outperforms CLIP on most benchmarks with sigmoid loss. Default to SigLIP unless you need CLIP ecosystem compatibility.
4. **Ignoring image preprocessing** — Feeding raw high-res images without center-crop and resize to model input dimensions wastes compute and degrades quality.
5. **No modality metadata** — Without tagging vectors by modality, you cannot filter searches to "find images matching this text" vs "find text matching this image."

## Quality Checklist

- [ ] Embedding model chosen based on benchmark comparison for target domain
- [ ] All vectors L2-normalized before storage
- [ ] Image preprocessing matches model training config (size, crop, normalization)
- [ ] Text tokenization uses the model's paired tokenizer (not a generic one)
- [ ] Modality stored as metadata on each vector for filtered retrieval
- [ ] Cross-modal retrieval tested: text-to-image recall@10, image-to-text recall@10
- [ ] Batch embedding pipeline handles failures gracefully (retry, skip, log)
- [ ] Latency profiled: embedding generation < 50ms per item on target hardware
- [ ] Single embedding model per vector collection (no mixing)
- [ ] Storage cost estimated: dimensions x records x 4 bytes x safety margin
