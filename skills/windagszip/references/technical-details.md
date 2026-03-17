# WinDAGSZip Technical Details

## Chunk Taxonomy

The chunker identifies 12 semantic chunk types:

| Type | Ablatable | Notes |
|------|-----------|-------|
| FRONTMATTER_FIELD | Some | Name/description: never. Category/tags: sometimes. |
| SECTION | No | Structural anchors |
| SUBSECTION | No | Structural anchors |
| COMPOUND | Yes | Paragraph + code block bonded together |
| PARAGRAPH | Yes | Prose content |
| LIST_BLOCK | Yes | Complete list (ablated as unit) |
| LIST_ITEM | No | Part of list block (not ablated independently) |
| CODE_BLOCK | Yes | Code examples |
| MERMAID | Yes | Diagram blocks |
| REFERENCE | Yes | External reference files (often >1000 tokens) |
| YAML_PAIRS_WITH | No | Routing metadata (never remove) |
| YAML_TAG | No | Too small to embed meaningfully |

**Compound units**: A paragraph ending with `:` or containing "here's", "for example" bonds to the next code block. Ablated together, never separately.

---

## Embedding Model

- **Model**: all-MiniLM-L6-v2 (384 dimensions)
- **Size**: ~90MB Python (sentence-transformers), ~23MB ONNX int8 (bundleable)
- **Why sufficient**: Comparing chunks within the same document does not require SOTA embeddings. Topical proximity makes even small models effective.

## Similarity Computation

- L2-normalize all embeddings
- Cosine similarity via matrix multiplication
- Degenerate embeddings (empty/tiny chunks) get norm guards to avoid NaN

## Clustering Algorithm

- Build adjacency graph: edge when similarity > threshold
- BFS connected components
- Within each component, canonical = highest token count (most complete version)
- Redundant = everything else in the component

## Dependencies

```bash
# Python (CLI / research)
pip install sentence-transformers numpy

# Node.js (production bundling with WinDAGs)
# @huggingface/transformers with ONNX int8 model (~23MB)
```

---

## Rate-Distortion Theory

This tool implements the **rate-distortion** framework from information theory:
- **Rate** = tokens consumed in context window
- **Distortion** = quality drop from compression
- **R(D) curve** = Pareto frontier: minimum tokens for a given quality level
- **Knee of the curve** = optimal compression point

The embedding pass is free (zero API cost). The graded eval pass traces the R(D) curve with real behavioral measurements. Together they map the full compression landscape for any skill.

---

## Worked Example

```
$ python embed_ablate.py web-weather-creator --generate

======================================================================
  Redundancy Analysis: web-weather-creator
======================================================================
  Total chunks:    94
  Ablatable:       87
  Total tokens:    13,009
  Threshold:       0.70

  Redundancy clusters: 7
  Redundant tokens:   3,276 (25%)

  Cluster 1 (avg sim: 0.847, redundant tokens: 2,127)
    KEEP [reference   ] 1821tk  Full CSS layering reference...
    CUT  [code_block  ]  312tk  .aurora-container { position...
    CUT  [code_block  ]  287tk  .atmosphere-layer { position...
    CUT  [compound    ]  198tk  Here's how fog works: ...
    ...

  Generated 8 redundancy-guided variants → ablations/web-weather-creator
```

Result: 25% token savings from embeddings alone. Zero API cost.

---

## Script Inventory

All scripts live in `tools/skill-compression/` from the repo root:

| Script | Purpose |
|--------|---------|
| `embed_ablate.py` | Embedding-based redundancy analysis and variant generation |
| `eval_judge.py` | LLM-judged quality eval (sonnet executor + haiku grader) |
| `chunker.py` | Semantic chunker producing 12 chunk types from SKILL.md |
| `ablation.py` | Brute-force single-chunk ablation and R-D curve computation |
| `eval_quality.py` | Static/manual quality scoring (no API calls) |
| `bootstrapper.py` | Test suite bootstrapping for new skills |
| `run_ablation_eval.py` | Orchestrates ablation + eval pipeline end-to-end |
| `visualize_umap.py` | UMAP visualization of chunk embedding space |
| `visualize_post2.py` | Blog post visualization generator |
