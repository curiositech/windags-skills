# Book Distillation Pipeline

Turn books into executable AI agent skills using a 3-pass hierarchical extraction pipeline.

**Cost**: ~$0.14 per 300-page book
**Time**: ~5 minutes wall-clock per book
**Output**: SKILL.md files with decision trees, anti-patterns, and provenance

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set your API key
export ANTHROPIC_API_KEY=sk-ant-...

# Distill a single book into a knowledge map
python distill.py my-book.pdf

# Distill a book all the way to a SKILL.md draft
python distill.py my-book.pdf --output-mode skill-draft

# Process an entire directory
python distill.py ./books/ --output-mode skill-draft
```

## The 3-Pass Pipeline

| Pass | Model | Cost | What It Does |
|------|-------|------|-------------|
| **Pass 1** | Haiku 4.5 | ~$0.04 | Parallel chunk extraction (10 concurrent). Extracts claims, processes, decisions, failures, insights, metaphors, temporal patterns, quotes, domain terms |
| **Pass 2** | Sonnet 4.5 | ~$0.05 | Serial synthesis. Merges, deduplicates, and structures all chunks into a unified knowledge map |
| **Pass 3** | Sonnet 4.5 | ~$0.05 | Generates a publication-ready SKILL.md with decision trees, anti-patterns, and references |

## Output Modes

```bash
# Just chunk-level summaries ($0.04/book)
python distill.py book.pdf --output-mode summary

# Knowledge map — structured JSON ($0.09/book)
python distill.py book.pdf --output-mode knowledge-map

# Full SKILL.md draft ($0.14/book)
python distill.py book.pdf --output-mode skill-draft
```

## Output Files

All outputs go to `./output/` (configurable via `--output-dir`):

```
output/
  my-book_pass1_extractions.json    # Pass 1: per-chunk extraction results
  my-book_knowledge_map.json        # Pass 2: unified knowledge map
  my-book_SKILL.md                  # Pass 3: ready-to-use skill draft
```

## Supported Formats

PDF, DOCX, Markdown, plain text, MHTML, Apple Pages, EPUB, HTML

## Other Scripts

**`generate_skills_from_maps.py`** — Re-run Pass 3 on existing knowledge maps without repeating the expensive Pass 1 & 2:

```bash
python generate_skills_from_maps.py --output-dir ./output
```

**`check_status.py`** — See which books have been processed and what still needs work:

```bash
python check_status.py --dir ./output
```

## Tested Model Versions

- Pass 1: `claude-haiku-4-5` (Haiku 4.5, $0.80/$4.00 per MTok)
- Pass 2/3: `claude-sonnet-4-6` (Sonnet 4.6, $3.00/$15.00 per MTok)

Tested on Sonnet 4.6 (March 2026). The scripts include retry logic and 300s timeouts for large synthesis calls.

## Full Methodology

See [docs/METHODOLOGY.md](../../docs/METHODOLOGY.md) for the complete design rationale, critical analysis, and improvement roadmap.
