---
license: Apache-2.0
name: fine-tuning-dataset-curator
description: "Prepare high-quality datasets for LLM fine-tuning with filtering, deduplication, augmentation, and RLHF data formatting. Activate on: fine-tuning data, training data curation, RLHF dataset, data quality filtering, SFT dataset. NOT for: model training infrastructure (ai-engineer), prompt engineering without fine-tuning (prompt-engineer)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - fine-tuning
  - dataset-curation
  - rlhf
  - data-quality
  - sft
pairs-with:
  - skill: ai-engineer
    reason: Fine-tuned models deploy through AI engineer pipelines
  - skill: data-pipeline-engineer
    reason: Large-scale data extraction and transformation before curation
  - skill: llm-evaluation-harness
    reason: Evaluate fine-tuned model quality on curated test sets
---

# Fine-Tuning Dataset Curator

Prepare, filter, deduplicate, and format high-quality datasets for supervised fine-tuning (SFT), RLHF, and DPO training of language models.

## Activation Triggers

**Activate on**: "fine-tuning dataset", "training data preparation", "RLHF data", "DPO pairs", "SFT data", "data quality filtering", "dedup training data", "curate instruction dataset", "preference data"

**NOT for**: Model training loop implementation (ai-engineer), prompt optimization without fine-tuning (prompt-engineer), or general ETL pipelines (data-pipeline-engineer)

## Quick Start

1. **Define the task** — What behavior should the fine-tuned model exhibit? Write 10 gold-standard examples by hand first.
2. **Collect raw data** — Scrape, export from logs, use existing datasets, or generate synthetic examples with a stronger model.
3. **Filter and clean** — Remove duplicates, low-quality entries, PII, and off-topic examples. Target quality over quantity.
4. **Format for training** — Convert to the target format: chat-ml for SFT, chosen/rejected pairs for DPO, reward signals for RLHF.
5. **Validate** — Hold out 10-15% for evaluation, verify distribution balance, run a small training test before full fine-tune.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **Quality Filtering** | fasttext classifiers, perplexity scoring, regex rules | Remove noise before it poisons the model |
| **Deduplication** | MinHash (datasketch), exact hash, SimHash | Near-dedup critical for training stability |
| **Augmentation** | LLM-generated paraphrases, backtranslation, persona variation | 3-5x dataset size with diversity |
| **Format Conversion** | chat-ml, Alpaca, ShareGPT, OpenAI JSONL | Match target training framework |
| **PII Removal** | presidio, regex, spaCy NER | Legal requirement for most training data |
| **RLHF/DPO Prep** | Preference pair generation, reward model labeling | Chosen/rejected pairs with margin scoring |

## Architecture Patterns

### Pattern 1: SFT Data Curation Pipeline

```
Raw Sources ──→ [Extract] ──→ [Filter] ──→ [Dedup] ──→ [Augment] ──→ [Format] ──→ [Validate]
    │               │            │            │            │              │            │
  logs, docs    parse to     quality       MinHash      paraphrase    chat-ml     hold-out
  APIs, CSVs    instruction/ scoring       near-dedup   via LLM       or JSONL    eval set
                response     remove <                   persona                   distribution
                pairs        threshold                  variation                 check
```

```python
# Quality filtering pipeline
import hashlib
from datasketch import MinHash, MinHashLSH

def curate_sft_dataset(raw_examples: list[dict]) -> list[dict]:
    # Step 1: Basic quality filters
    filtered = []
    for ex in raw_examples:
        instruction, response = ex["instruction"], ex["response"]
        if len(response.split()) < 10:          # Too short
            continue
        if len(response.split()) > 2000:         # Too long (likely garbage)
            continue
        if instruction.strip() == "":            # Empty instruction
            continue
        if response.count("\n") > 50:            # Excessive formatting
            continue
        filtered.append(ex)

    # Step 2: Near-deduplication with MinHash
    lsh = MinHashLSH(threshold=0.8, num_perm=128)
    deduped = []
    for i, ex in enumerate(filtered):
        mh = MinHash(num_perm=128)
        for word in ex["response"].split():
            mh.update(word.encode("utf-8"))
        if not lsh.query(mh):  # No near-duplicate found
            lsh.insert(f"doc_{i}", mh)
            deduped.append(ex)

    # Step 3: Format for training
    formatted = []
    for ex in deduped:
        formatted.append({
            "messages": [
                {"role": "user", "content": ex["instruction"]},
                {"role": "assistant", "content": ex["response"]}
            ]
        })
    return formatted
```

### Pattern 2: DPO Preference Pair Generation

```
Instruction ──→ [Generate N responses] ──→ [Score/Rank] ──→ [Select Pairs]
                      │                         │                  │
                  temperature=0.8            human eval         chosen: best
                  N=4 responses per          or LLM judge       rejected: worst
                  instruction                or heuristic        margin > threshold

Output format (DPO):
{
  "prompt": "Explain quantum computing",
  "chosen": "Quantum computing uses qubits...",    # High-quality response
  "rejected": "Quantum computing is computers..."  # Lower-quality response
}
```

### Pattern 3: Synthetic Data Augmentation

```
10 Gold Examples ──→ [LLM Generator] ──→ [Quality Filter] ──→ 500 Examples
                          │                      │
                     "Generate 50            remove duplicates,
                      variations of          score perplexity,
                      this instruction       human spot-check
                      with different          10% sample
                      personas and
                      complexity levels"
```

## Anti-Patterns

1. **Quantity over quality** — 1,000 high-quality examples outperform 50,000 noisy ones. Filter aggressively; a model trained on garbage outputs garbage.
2. **No deduplication** — Duplicate or near-duplicate examples cause the model to memorize specific phrasings instead of learning patterns. Always dedup.
3. **Ignoring distribution balance** — If 80% of your data is one category, the model will be biased. Track category distribution and balance or weight accordingly.
4. **Training on the eval set** — Accidentally including test examples in training data produces inflated metrics. Deduplicate between train/eval splits.
5. **Skipping PII removal** — Training on data with real names, emails, and phone numbers bakes PII into model weights. Use presidio or spaCy NER to scrub before training.

## Quality Checklist

- [ ] Gold-standard examples written by hand (minimum 10) before scaling
- [ ] Raw data filtered: minimum response length, maximum length, non-empty instructions
- [ ] Near-deduplication applied (MinHash threshold 0.8 or tighter)
- [ ] Train/eval split with deduplication across splits (no leakage)
- [ ] PII removed from all examples (names, emails, phone numbers, addresses)
- [ ] Distribution balanced across categories/topics (or intentionally weighted)
- [ ] Format matches target training framework (chat-ml, Alpaca, OpenAI JSONL)
- [ ] Augmented data quality-checked via spot-sampling (10% human review)
- [ ] DPO pairs have sufficient quality margin between chosen and rejected
- [ ] Final dataset stats documented: size, categories, avg tokens, quality score distribution
