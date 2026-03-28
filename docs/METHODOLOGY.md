# Corpus Distillation Methodology

**Purpose**: Design, rationale, and critical analysis of the 3-pass hierarchical knowledge extraction algorithm

**Created**: 2026-02-09

---

## Executive Summary

The corpus distillation pipeline converts books into executable skills using a 3-pass hierarchical extraction:

1. **Pass 1 (Haiku Army)**: Parallel chunk-level extraction -> raw facts
2. **Pass 2 (Sonnet Synthesis)**: Unify chunks -> structured knowledge map
3. **Pass 3 (Sonnet Draft)**: Knowledge map -> SKILL.md

**Key Innovation**: Instead of asking one LLM to "read a 300-page book and make a skill" (hallucination, context limits), we decompose the extraction problem itself into:
- **Parallel extraction** (many small tasks)
- **Serial synthesis** (one large merging task)
- **Template generation** (structured output)

**Cost**: ~$0.14 per 300-page book (~700x cheaper than human expert analysis)

---

## Design History: How We Got Here

### Problem Statement (Jan 2026)

**Goal**: Extract expert knowledge from academic research and professional books to build reusable AI agent skills.

**Challenges**:
1. **Context limits**: Books are 200K+ tokens, exceed single-call context
2. **Hallucination**: Direct "summarize this book" prompts lose detail
3. **Structure loss**: Need decision trees, anti-patterns, NOT narrative summaries
4. **Scale**: 77 books x manual expert analysis = infeasible

### Design Evolution

#### Attempt 1: Single-Call Summarization (Failed)
```
Book (300 pages) -> Sonnet -> SKILL.md
```

**Failure modes**:
- Hallucinated processes not in source material
- Lost critical details (stopping rules, decision criteria)
- Couldn't handle full book context (truncated after 150 pages)
- Generic summaries, not executable skills

#### Attempt 2: Chunked Summarization (Better, Still Flawed)
```
Book -> 10 chunks -> Sonnet summarizes each -> Concatenate -> SKILL.md
```

**Improvements**:
- No hallucination (chunks small enough to read fully)
- Preserved details from all pages

**Remaining issues**:
- Duplication across chunks (same concept mentioned 10 times)
- No coherent structure (10 independent summaries)
- Missed cross-chunk patterns (concept introduced Ch 1, applied Ch 7)

#### Attempt 3: Hierarchical Extraction (Current)
```
Book -> Chunks -> Pass 1 (Haiku parallel) -> Pass 2 (Sonnet merge) -> Pass 3 (Sonnet structure) -> SKILL.md
```

**Key insights**:
1. **Parallelize the cheap part** (Haiku extraction: $0.04)
2. **Serialize the expensive part** (Sonnet synthesis: $0.05)
3. **Separate extraction from structuring** (raw facts -> knowledge map -> skill)

---

## The 3-Pass Algorithm

### Pass 1: Haiku Army (Parallel Extraction)

**Model**: Claude Haiku 4.5 (`claude-haiku-4-5`)
**Concurrency**: 10 parallel calls
**Input**: ~4K token chunks (500-token overlap)
**Output**: JSON with 10 categories per chunk

**Extraction categories**:

| Category | Rationale |
|----------|-----------|
| `processes` | Directly maps to SKILL.md Core Process (decision trees) |
| `decisions` | Heuristics experts use (stopping rules, method selection) |
| `failures` + `aha_moments` | Maps to Anti-Pattern timeline (Novice -> Expert transition) |
| `temporal` | Captures field evolution ("before X, task analysis was ad-hoc") |
| `metaphors` | Shibboleths (how experts conceptualize the domain) |
| `domain_terms` | Vocabulary for skill description/keywords |

**Why Haiku?**
- **Fast**: ~3 seconds per chunk, 10 concurrent = ~3 sec wall-clock for 300-page book
- **Cheap**: $0.80/MTok input vs $3.00 for Sonnet
- **Good enough**: Extraction is mechanical (find claims, find processes), doesn't need reasoning

**Overlap strategy**:
- 500-token overlap between chunks prevents splitting mid-concept
- Allows synthesis to deduplicate ("stopping rule" appears in chunks 3, 4, 5 -> merge)

### Pass 2: Sonnet Synthesis (Unification)

**Model**: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
**Input**: All Pass 1 extractions concatenated (typically 50K-100K tokens)
**Output**: Unified knowledge map (JSON)

**Why Sonnet?**
- **Reasoning**: Needs to merge 10+ mentions of "stopping rule" into one coherent definition
- **Deduplication**: Recognizes same concept expressed differently across chunks
- **Structuring**: Builds relationships between concepts
- **Context**: 200K context handles full extraction set

### Pass 3: Skill Draft (Template Generation)

**Model**: Claude Sonnet 4.5 (originally Opus, downgraded for cost)
**Input**: Knowledge map JSON from Pass 2
**Output**: SKILL.md markdown

**Template design principles**:
- **Decision trees**: Executable by agents (if X then Y, not narrative)
- **Anti-patterns**: Learns from failures, not just successes
- **Exclusions**: Prevents misuse (skill X is NOT for domain Y)

---

## Critical Analysis: What Works

### Strengths

1. **Parallel Extraction -> Cost Efficiency**: 10 concurrent Haiku calls = 3 seconds wall-clock (vs 30 seconds serial). $0.04 for Pass 1 (vs $0.15 if using Sonnet).

2. **Hierarchical Structure Prevents Hallucination**: Haiku extracts facts present in text (not creative). Sonnet merges real extractions (not inventing). Final skill grounded in source material.

3. **Semantic Chunking Preserves Context**: 500-token overlap prevents concept splitting. Paragraph boundaries = natural semantic units.

4. **Structured JSON Forces Completeness**: Can't skip required sections. Validates output programmatically (JSON parse). Enables unattended pipeline automation.

5. **Separates Extraction from Structuring**: Pass 2 knowledge map is reusable (could generate tutorial, blog post, NOT just skill). Can re-run Pass 3 with different templates.

---

## Critical Analysis: What Doesn't Work

### Weaknesses

1. **Meta-Skill Classification is Post-Hoc**: We don't know if a book will yield a useful skill UNTIL after distillation. Some books distill beautifully (Lakatos -> failure triage framework), others produce generic summaries.

2. **Sonnet 4.5 Sometimes Misses Nuance**: Opus catches subtleties like "rolling wave planning" that Sonnet glosses over. Trade-off: save ~$2 across 28 books but lose ~10% quality.

3. **Template Rigidity**: Same SKILL.md template for all knowledge types. Different knowledge types need different structures (decision trees vs. protocol sequences vs. ranked hierarchies).

4. **Overlap Redundancy**: 500-token overlap = 12.5% of each chunk repeated. Acceptable because preventing concept splitting is more important than the ~$0.005 extra cost.

5. **No Multi-Book Synthesis**: Each book distilled independently. Missing cross-book patterns only visible when synthesizing ACROSS books.

---

## Potential Improvements

### 1. Adaptive Template Selection (Medium Effort, High Value)
Choose SKILL.md structure based on knowledge map content type (decision trees, hierarchies, protocols).

### 2. Cross-Book Synthesis (High Effort, High Value)
Pass 4 that merges related knowledge maps to discover integration patterns humans miss.

### 3. Validation Pass (Low Effort, Medium Value)
Pass 3.5 that checks skill quality before finalization. Catches malformed decision trees, missing sections.

### 4. Interactive Distillation (High Effort, Very High Value)
Multi-turn agent for Pass 2/3 that reads source material when unsure, resolving ambiguities.

---

## Economics

| Metric | Value |
|--------|-------|
| Books processed | 77 |
| Average cost per book | $0.14 |
| Total pipeline cost | ~$10.78 |
| Human review (7 core skills) | ~$350 |
| Total project cost | ~$361 |
| Equivalent expert analysis | ~$38,500 (77 books x $500/book) |
| **Cost reduction** | **99%** |

### Pipeline vs. Alternatives

| Dimension | Corpus Distillation | Human Expert | RAG On-Demand |
|-----------|---------------------|--------------|---------------|
| **Cost** | $0.14/book | $500-2000/book | $0 upfront, $0.05-0.10/query |
| **Speed** | 5 min/book | 8-20 hrs/book | 5-10 sec/query |
| **Scale** | 77 books in 6 hours | 77 books in 6 months | N/A |
| **Hallucination** | Grounded in text | Expert bias | Chunk-limited |
| **Nuance** | Misses 10% subtleties | Catches all nuance | Query-dependent |

**Verdict**: Corpus distillation for bulk, human review for refinement.

---

**Document Version**: 1.0
**Last Updated**: 2026-02-09
