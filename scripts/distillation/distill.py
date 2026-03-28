#!/usr/bin/env python3
"""
Corpus Distillation Pipeline

Three-pass hierarchical extraction of expert knowledge from books:
  Pass 1: Haiku army (parallel) — chunk extraction
  Pass 2: Sonnet synthesis — merge + structure
  Pass 3: Sonnet refinement (optional) — skill draft

Usage:
  python distill.py <input-file> [--output-mode summary|knowledge-map|skill-draft]
  python distill.py ./books/  # Process all files in directory

Supports: PDF, DOCX, Markdown, plain text, MHTML, Apple Pages, EPUB, HTML
Requires: pip install -r requirements.txt

Cost estimate: ~$0.14 per 300-page book
"""

import sys
import os
import json
import asyncio
import argparse
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional

# ============================================================================
# Logging Utility
# ============================================================================

def log(msg):
    """Print with immediate flush for background tasks."""
    print(msg, flush=True)
    sys.stdout.flush()

# ============================================================================
# Text Extraction
# ============================================================================

def extract_text_from_pdf(path: str) -> str:
    """Extract text from PDF using PyMuPDF (fitz)."""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        print("Install PyMuPDF: pip install pymupdf")
        sys.exit(1)

    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text() + "\n\n"
    doc.close()
    return text


def extract_text_from_docx(path: str) -> str:
    """Extract text from DOCX."""
    try:
        from docx import Document
    except ImportError:
        print("Install python-docx: pip install python-docx")
        sys.exit(1)

    doc = Document(path)
    return "\n\n".join(p.text for p in doc.paragraphs if p.text.strip())


def extract_text_from_mhtml(path: str) -> str:
    """Extract text from MHTML (web archive) files."""
    import email
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        print("Install BeautifulSoup: pip install beautifulsoup4")
        sys.exit(1)

    raw = Path(path).read_bytes()
    msg = email.message_from_bytes(raw)

    html_parts = []
    if msg.is_multipart():
        for part in msg.walk():
            ct = part.get_content_type()
            if ct == 'text/html':
                charset = part.get_content_charset() or 'utf-8'
                payload = part.get_payload(decode=True)
                if payload:
                    html_parts.append(payload.decode(charset, errors='replace'))
            elif ct == 'text/plain' and not html_parts:
                charset = part.get_content_charset() or 'utf-8'
                payload = part.get_payload(decode=True)
                if payload:
                    html_parts.append(payload.decode(charset, errors='replace'))
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            charset = msg.get_content_charset() or 'utf-8'
            html_parts.append(payload.decode(charset, errors='replace'))

    full_html = "\n".join(html_parts)

    if '<html' in full_html.lower() or '<body' in full_html.lower():
        soup = BeautifulSoup(full_html, 'html.parser')
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            tag.decompose()
        text = soup.get_text(separator='\n\n', strip=True)
    else:
        text = full_html

    return text


def extract_text_from_pages(path: str) -> str:
    """Extract text from Apple Pages files (.pages is a zip archive)."""
    import zipfile
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        print("Install BeautifulSoup: pip install beautifulsoup4")
        sys.exit(1)

    text_parts = []

    try:
        with zipfile.ZipFile(path, 'r') as z:
            names = z.namelist()

            for candidate in ['index.xml', 'Index/Document.iwa', 'preview.pdf']:
                if candidate in names:
                    if candidate.endswith('.pdf'):
                        import tempfile
                        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
                            tmp.write(z.read(candidate))
                            tmp_path = tmp.name
                        text = extract_text_from_pdf(tmp_path)
                        os.unlink(tmp_path)
                        return text
                    elif candidate.endswith('.xml'):
                        xml_content = z.read(candidate).decode('utf-8', errors='replace')
                        soup = BeautifulSoup(xml_content, 'html.parser')
                        text_parts.append(soup.get_text(separator='\n\n', strip=True))

            if not text_parts:
                for name in names:
                    if name.endswith('.xml') or name.endswith('.txt'):
                        try:
                            content = z.read(name).decode('utf-8', errors='replace')
                            if len(content) > 100:
                                soup = BeautifulSoup(content, 'html.parser')
                                extracted = soup.get_text(separator='\n', strip=True)
                                if len(extracted) > 50:
                                    text_parts.append(extracted)
                        except Exception:
                            continue

            if not text_parts:
                for name in names:
                    if 'preview' in name.lower() and name.endswith('.pdf'):
                        import tempfile
                        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
                            tmp.write(z.read(name))
                            tmp_path = tmp.name
                        text = extract_text_from_pdf(tmp_path)
                        os.unlink(tmp_path)
                        if text.strip():
                            return text
    except zipfile.BadZipFile:
        raise ValueError(f"File {path} is not a valid .pages (zip) archive")

    if not text_parts:
        raise ValueError(
            f"Could not extract text from {path}. "
            "Apple Pages .iwa format is proprietary. "
            "Please export as PDF or DOCX from Pages and re-add."
        )

    return "\n\n".join(text_parts)


def extract_text_from_epub(path: str) -> str:
    """Extract text from EPUB file."""
    try:
        from ebooklib import epub
        from bs4 import BeautifulSoup
    except ImportError:
        print("Install libraries: pip install ebooklib beautifulsoup4")
        sys.exit(1)

    book = epub.read_epub(path)
    text_parts = []

    for item in book.get_items():
        if item.get_type() == 9:  # EBOOKLIB_TYPE_DOCUMENT
            content = item.get_content().decode('utf-8', errors='replace')
            soup = BeautifulSoup(content, 'html.parser')
            for tag in soup(['script', 'style', 'nav']):
                tag.decompose()
            text = soup.get_text(separator='\n', strip=True)
            if text.strip():
                text_parts.append(text)

    if not text_parts:
        raise ValueError(f"Could not extract text from EPUB: {path}")

    return "\n\n".join(text_parts)


def extract_text(path: str) -> str:
    """Extract text from any supported format."""
    ext = Path(path).suffix.lower()
    if ext == '.pdf':
        return extract_text_from_pdf(path)
    elif ext == '.docx':
        return extract_text_from_docx(path)
    elif ext in ('.md', '.txt', '.text'):
        return Path(path).read_text(encoding='utf-8', errors='replace')
    elif ext == '.mhtml':
        return extract_text_from_mhtml(path)
    elif ext == '.pages':
        return extract_text_from_pages(path)
    elif ext == '.epub':
        return extract_text_from_epub(path)
    elif ext in ('.htm', '.html'):
        try:
            from bs4 import BeautifulSoup
        except ImportError:
            print("Install BeautifulSoup: pip install beautifulsoup4")
            sys.exit(1)
        html = Path(path).read_text(encoding='utf-8', errors='replace')
        soup = BeautifulSoup(html, 'html.parser')
        for tag in soup(['script', 'style', 'nav', 'footer']):
            tag.decompose()
        return soup.get_text(separator='\n\n', strip=True)
    else:
        raise ValueError(f"Unsupported file format: {ext}. Supported: .pdf, .docx, .md, .txt, .mhtml, .pages, .html")


# ============================================================================
# Chunking
# ============================================================================

def count_tokens_approx(text: str) -> int:
    """Approximate token count (1 token ~ 4 chars for English)."""
    return len(text) // 4


def semantic_chunk(text: str, max_tokens: int = 4000, overlap_tokens: int = 500) -> list[dict]:
    """Split text into overlapping chunks on paragraph boundaries."""
    max_chars = max_tokens * 4
    overlap_chars = overlap_tokens * 4

    paragraphs = text.split('\n\n')
    chunks = []
    current = ""
    chunk_id = 0

    for para in paragraphs:
        if count_tokens_approx(current + para) > max_tokens and current:
            chunks.append({
                "id": chunk_id,
                "text": current.strip(),
                "tokens": count_tokens_approx(current),
            })
            chunk_id += 1
            current = current[-overlap_chars:] + "\n\n" + para
        else:
            current += "\n\n" + para if current else para

    if current.strip():
        chunks.append({
            "id": chunk_id,
            "text": current.strip(),
            "tokens": count_tokens_approx(current),
        })

    return chunks


# ============================================================================
# Pass 1: Haiku Extraction (Parallel)
# ============================================================================

EXTRACTION_PROMPT = """You are extracting structured knowledge from a book chunk for a knowledge engineering pipeline.

Analyze this text and extract the following. Return ONLY valid JSON, no markdown fences.

{
  "summary": "2-3 sentence summary of this section",
  "key_claims": ["list of factual claims or assertions"],
  "processes": ["any step-by-step procedures described"],
  "decisions": ["any decision points or heuristics mentioned"],
  "failures": ["any failures, mistakes, or anti-patterns described"],
  "aha_moments": ["any insights, realizations, or conceptual breakthroughs"],
  "metaphors": ["any metaphors or mental models used"],
  "temporal": ["any 'things changed when...' or 'before X, after Y' patterns"],
  "quotes": ["notable direct quotes worth preserving (max 3)"],
  "domain_terms": ["domain-specific vocabulary or jargon"]
}

If a category has no relevant content, use an empty array [].

TEXT TO ANALYZE:
"""


async def extract_chunk(client, chunk: dict, semaphore: asyncio.Semaphore) -> dict:
    """Extract knowledge from a single chunk using Haiku."""
    async with semaphore:
        try:
            response = await client.messages.create(
                model="claude-haiku-4-5",
                max_tokens=2000,
                messages=[{
                    "role": "user",
                    "content": EXTRACTION_PROMPT + chunk["text"][:16000]
                }]
            )

            text = response.content[0].text.strip()
            if text.startswith('{'):
                extraction = json.loads(text)
            else:
                start = text.find('{')
                end = text.rfind('}') + 1
                if start >= 0 and end > start:
                    extraction = json.loads(text[start:end])
                else:
                    extraction = {"summary": text, "parse_error": True}

            return {
                "chunk_id": chunk["id"],
                "extraction": extraction,
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            }
        except Exception as e:
            return {
                "chunk_id": chunk["id"],
                "extraction": {"error": str(e)},
                "input_tokens": 0,
                "output_tokens": 0,
            }


async def pass1_extract(client, chunks: list[dict], max_concurrent: int = 10) -> list[dict]:
    """Pass 1: Parallel Haiku extraction across all chunks."""
    semaphore = asyncio.Semaphore(max_concurrent)
    tasks = [extract_chunk(client, chunk, semaphore) for chunk in chunks]
    results = await asyncio.gather(*tasks)
    return sorted(results, key=lambda r: r["chunk_id"])


# ============================================================================
# Pass 2: Sonnet Synthesis
# ============================================================================

SYNTHESIS_PROMPT = """You are synthesizing extracted knowledge from multiple book chunks into a structured knowledge map.

You will receive chunk-level extractions from a book. Merge, deduplicate, and organize them into this structure. Return ONLY valid JSON.

{
  "document_summary": "1-2 paragraph executive summary of the entire book's key contributions",

  "core_concepts": [
    {"concept": "name", "definition": "what it means", "relationships": ["connects to X because..."]}
  ],

  "processes": [
    {"name": "process name", "steps": ["ordered steps"], "decision_points": ["choices"], "common_mistakes": ["what goes wrong"]}
  ],

  "expertise_patterns": [
    {"pattern": "what experts do differently", "novice_mistake": "what novices do", "aha_moment": "the bridging insight"}
  ],

  "temporal_evolution": [
    {"period": "date range", "paradigm": "what was believed", "change_trigger": "what caused shift"}
  ],

  "key_metaphors": [
    {"metaphor": "how practitioners think about X", "maps_to": "the underlying structure"}
  ],

  "anti_patterns": [
    {"name": "anti-pattern name", "description": "what it looks like", "why_wrong": "fundamental reason", "fix": "correct approach"}
  ],

  "notable_quotes": ["direct quotes worth preserving"],

  "domain_vocabulary": [
    {"term": "word", "definition": "what it means in this domain"}
  ]
}

CHUNK EXTRACTIONS:
"""


async def _call_with_streaming(client, model: str, max_tokens: int, content: str, retries: int = 5) -> object:
    """Call the API using streaming to prevent connection drops on large payloads.

    Non-streaming calls to Sonnet frequently drop the connection when the response
    takes >30s to generate. Streaming keeps the connection alive with incremental chunks.
    Falls back to retry on transient errors.
    """
    for attempt in range(retries):
        try:
            # Use sync streaming via run_in_executor since async streaming
            # has the same httpx connection issues
            import anthropic as _anthropic
            sync_client = _anthropic.Anthropic(
                api_key=client.api_key,
                max_retries=3,
                timeout=300.0,
            )

            collected = []
            with sync_client.messages.stream(
                model=model,
                max_tokens=max_tokens,
                messages=[{"role": "user", "content": content}]
            ) as stream:
                for text in stream.text_stream:
                    collected.append(text)

            # Get the final message with usage stats
            final = stream.get_final_message()
            # Patch the text content with the streamed text
            final.content[0].text = "".join(collected)
            return final

        except Exception as e:
            err_str = str(e).lower()
            if "connection" in err_str or "disconnected" in err_str or "timeout" in err_str:
                wait = 2 ** attempt
                log(f"   Connection error (attempt {attempt + 1}/{retries}), retrying in {wait}s...")
                await asyncio.sleep(wait)
                if attempt == retries - 1:
                    raise
            else:
                raise


async def pass2_synthesize(client, extractions: list[dict]) -> dict:
    """Pass 2: Sonnet merges all extractions into a knowledge map."""
    extraction_text = json.dumps(
        [e["extraction"] for e in extractions if "error" not in e.get("extraction", {})],
        indent=1
    )

    if len(extraction_text) > 150000:
        extraction_text = extraction_text[:150000] + "\n... (truncated)"

    response = await _call_with_streaming(
        client, "claude-sonnet-4-6", 8000,
        SYNTHESIS_PROMPT + extraction_text
    )

    text = response.content[0].text.strip()
    try:
        start = text.find('{')
        end = text.rfind('}') + 1
        knowledge_map = json.loads(text[start:end])
    except (json.JSONDecodeError, ValueError):
        knowledge_map = {"raw_synthesis": text, "parse_error": True}

    return {
        "knowledge_map": knowledge_map,
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
    }


# ============================================================================
# Pass 3: Skill Draft
# ============================================================================

SKILL_DRAFT_PROMPT = """You are skill-architect — the authoritative meta-skill for creating expert-level Agent Skills.

## Your Philosophy

Great skills are progressive disclosure machines. They encode REAL domain expertise (shibboleths), not surface instructions. They follow a three-layer architecture:
1. **Lightweight metadata** (YAML frontmatter) for discovery and activation
2. **Lean SKILL.md** (<500 lines) for core process — decision trees, not prose
3. **Reference files** for deep dives, loaded only on demand

## What Separates Great Skills from Mediocre Ones

- **Decision trees, not prose**: Every core process must be executable branches (if X then Y), not narrative explanation
- **Shibboleths**: Anti-patterns that reveal whether someone has deeply internalized the expertise vs. read the summary. Include the Novice/Expert/Timeline template
- **Progressive disclosure**: SKILL.md gives the 80% case. Reference files handle the 20%
- **Mermaid diagrams**: Use flowchart, sequence, or state diagrams for complex processes — they're rendered natively
- **Strong NOT-FOR boundaries**: Explicit exclusions prevent false activation. Formula: [What it does][When to use it]. NOT for [3-5 explicit exclusions]
- **Temporal knowledge**: When paradigms shifted, what changed, what the pre-shift mistake looks like ("Before 2024, everyone used X; now Y because Z")

## The SKILL.md Template

```markdown
---
name: [lowercase-hyphenated — derived from domain, not book title]
description: "[What it does] [When to use]. NOT for [exclusions]."
category: [one of: Code Quality & Testing, Research & Academic, Architecture & Design, Agent & Orchestration, DevOps & Infrastructure, Frontend & UI, Data & Analytics, Security & Compliance, Productivity & Meta]
tags: [3-7 domain keywords]
allowed-tools: Read
---

# [Skill Name — Human-Readable Title]

[One sentence: what this skill enables an agent to DO, not what the book is ABOUT]

## When to Use

✅ **Use for:**
- [Specific scenario 1 — concrete enough to match against]
- [Specific scenario 2]
- [Specific scenario 3]

❌ **NOT for:**
- [Adjacent domain this doesn't cover — with reason]
- [Common confusion — what people think this covers but it doesn't]
- [Related skill that handles this instead]

## Core Process

[Decision trees using Mermaid flowcharts or indented branch notation]

```mermaid
flowchart TD
    A[Entry condition] --> B{Decision point}
    B -->|Path 1| C[Action + rationale]
    B -->|Path 2| D[Different action]
```

[Additional decision trees for sub-processes]

## Anti-Patterns

### [Anti-Pattern Name]
**Novice behavior**: [What beginners do wrong]
**Expert behavior**: [What practitioners actually do]
**Timeline**: [When the field shifted — "Before X (year), ... After X, ..."]
**Detection rule**: [How to spot this in practice]

[Repeat for 2-5 anti-patterns — these are the shibboleths]

## Reference Files

| File | When to Load |
|------|-------------|
| `references/[topic].md` | [Specific condition that triggers loading] |

## Quality Gates

- [ ] [Verification step specific to this domain]
- [ ] [Another verification step]
```

## Shibboleths Section (REQUIRED)

After the Anti-Patterns section, include a **## Shibboleths** section. This is NOT optional — it's what separates a skill someone will trust from one they'll ignore.

Shibboleths are the tells that reveal whether someone has **deeply internalized** the source material vs. just read the summary. Structure it as two lists:

**They have internalized it if they:**
- [Spontaneous behavior that reveals deep understanding — "spontaneously asks X before doing Y"]
- [Treats X as Y rather than Z — the non-obvious reframe]
- [Becomes suspicious when they see pattern P — knows why it's a trap]
- [Can name the specific failure mode, not just "be careful"]

**They have only read the summary if they:**
- [Uses the key term as a generic label rather than a precise concept with specific conditions]
- [Thinks the lesson is "[too-vague platitude]" — misses the precise mechanism]
- [Cannot distinguish between legitimate case A and trap case B]
- [Treats the methodology as stylistic rather than substantive]

Draw these from `expertise_patterns` (expert vs. novice behavior) and `key_metaphors` (how practitioners actually think vs. how outsiders describe it).

## Reference Files Section (REQUIRED)

List 3-6 reference files the skill should have. For each, provide:
- A filename following the pattern `references/[specific-topic].md`
- A one-line loading condition: "When [specific situation that triggers this reference]"
- A 2-3 sentence description of what the reference would contain

These reference files are where the DEPTH lives. The SKILL.md gives the 80% decision tree. The references handle:
- Deep-dive explanations of specific decision branches
- Worked examples with step-by-step walkthroughs
- Edge cases and boundary conditions
- Historical context that matters for specific situations
- Protocol details too long for the main skill

## Critical Quality Requirements

1. **SKILL.md must be under 500 lines** — move depth to references/
2. **At least 2 anti-patterns** using Novice/Expert/Timeline template
3. **Decision trees, not paragraphs** — if an agent reads this, it must know what to DO
4. **Temporal knowledge** — include when paradigms shifted and why
5. **Description follows the formula**: [What][When]NOT[Exclusions]
6. **Source attribution** in References section with book title and author
7. **Shibboleths section** — the internalized-vs-skimmed test (see above)
8. **Reference file stubs** — at least 3, with loading conditions and content descriptions

## What to Extract from the Knowledge Map

From `core_concepts` → Decision trees in Core Process
From `processes` → Mermaid flowcharts with branch points
From `expertise_patterns` → Anti-Patterns section (novice_mistake → expert behavior) AND Shibboleths
From `anti_patterns` → Additional Anti-Patterns with detection rules
From `temporal_evolution` → Timeline annotations throughout
From `key_metaphors` → Shibboleths (how experts actually think about the domain)
From `domain_vocabulary` → Tags in frontmatter + terms in description
From `notable_quotes` → Epigraphs or inline citations that anchor key claims

## What to DISCARD

- Narrative summaries (agent doesn't need motivation)
- Case studies (extract the decision rule, discard the story)
- Historical context beyond paradigm shifts
- Author's pedagogical structure (reorganize for execution, not comprehension)

Now create a production-quality SKILL.md from this knowledge map:

"""


async def pass3_skill_draft(client, knowledge_map: dict) -> str:
    """Pass 3: Generate a SKILL.md from the knowledge map."""
    response = await _call_with_streaming(
        client, "claude-sonnet-4-6", 8000,
        SKILL_DRAFT_PROMPT + json.dumps(knowledge_map, indent=2)
    )
    return response.content[0].text


# ============================================================================
# Pass 3b: Reference File Generation
# ============================================================================

REFERENCE_GEN_PROMPT = """You are expanding reference file stubs from a SKILL.md into full reference documents.

You will receive:
1. A SKILL.md that was just generated from a book's knowledge map
2. The knowledge map itself (containing the deep extracted knowledge)

Your job: for each reference file mentioned in the SKILL.md's "Reference Files" table, generate a complete, standalone reference document.

## Requirements for each reference file

- **Self-contained**: A reader loading this reference should understand it without re-reading the SKILL.md
- **Decision-tree dense**: Use Mermaid diagrams, indented branch notation, tables — NOT prose paragraphs
- **Worked examples**: Include at least one concrete example showing the concept applied
- **Loading condition**: Start with a 1-line reminder of WHEN this reference should be loaded
- **Source grounding**: Cite the specific concept from the source material (author, idea)
- **Length**: 80-200 lines each. Long enough to be useful, short enough to fit in context

## Output format

Return a JSON object where keys are filenames (e.g., "references/counterexample-taxonomy.md") and values are the full markdown content of each reference file.

Return ONLY valid JSON, no markdown fences around the outer object.

Example:
{
  "references/example-topic.md": "# Example Topic\\n\\n> Load when: [condition]\\n\\n## Core Framework\\n\\n...",
  "references/another-topic.md": "# Another Topic\\n\\n> Load when: [condition]\\n\\n..."
}

## Inputs

### SKILL.md
"""


async def pass3b_generate_references(client, skill_md: str, knowledge_map: dict) -> dict:
    """Pass 3b: Generate reference file contents from the skill and knowledge map."""
    prompt = (
        REFERENCE_GEN_PROMPT
        + skill_md
        + "\n\n### Knowledge Map\n"
        + json.dumps(knowledge_map, indent=2)
    )

    response = await _call_with_streaming(client, "claude-sonnet-4-6", 16000, prompt)

    text = response.content[0].text.strip()
    try:
        start = text.find('{')
        end = text.rfind('}') + 1
        references = json.loads(text[start:end])
    except (json.JSONDecodeError, ValueError):
        references = {"_raw_output": text, "_parse_error": True}

    return {
        "references": references,
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
    }


# ============================================================================
# Main Pipeline
# ============================================================================

async def distill_file(
    filepath: str,
    output_dir: str,
    output_mode: str = "knowledge-map",
    max_concurrent: int = 10,
) -> dict:
    """Run the full distillation pipeline on a single file."""
    try:
        import anthropic
    except ImportError:
        print("Install dependencies: pip install -r requirements.txt")
        sys.exit(1)

    client = anthropic.AsyncAnthropic(
        max_retries=5,
        timeout=300.0,
    )
    filename = Path(filepath).stem

    log(f"\n{'='*60}")
    log(f"Distilling: {filepath}")
    log(f"Output mode: {output_mode}")
    log(f"{'='*60}")

    # Extract text
    log(f"\nExtracting text...")
    text = extract_text(filepath)
    total_tokens = count_tokens_approx(text)
    log(f"   {total_tokens:,} tokens ({total_tokens // 500} pages approx)")

    # Chunk
    log(f"\nChunking...")
    chunks = semantic_chunk(text)
    log(f"   {len(chunks)} chunks")

    # Pass 1: Haiku extraction
    log(f"\nPass 1: Haiku army ({len(chunks)} parallel extractions)...")
    extractions = await pass1_extract(client, chunks, max_concurrent)
    p1_input = sum(e["input_tokens"] for e in extractions)
    p1_output = sum(e["output_tokens"] for e in extractions)
    p1_cost = (p1_input * 0.80 + p1_output * 4.00) / 1_000_000
    errors = sum(1 for e in extractions if "error" in e.get("extraction", {}))
    log(f"   Done. {len(extractions) - errors} succeeded, {errors} errors")
    log(f"   Cost: ${p1_cost:.4f} ({p1_input:,} in + {p1_output:,} out)")

    # Save Pass 1 output
    p1_path = os.path.join(output_dir, f"{filename}_pass1_extractions.json")
    with open(p1_path, 'w') as f:
        json.dump(extractions, f, indent=2)
    log(f"   Saved: {p1_path}")

    if output_mode == "summary":
        summaries = [e["extraction"].get("summary", "") for e in extractions if "error" not in e.get("extraction", {})]
        result = {"summaries": summaries, "pass1_cost": p1_cost}
        result_path = os.path.join(output_dir, f"{filename}_summary.json")
        with open(result_path, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"\nSummary saved: {result_path}")
        print(f"   Total cost: ${p1_cost:.4f}")
        return result

    # Pass 2: Sonnet synthesis
    log(f"\nPass 2: Sonnet synthesis...")
    synthesis = await pass2_synthesize(client, extractions)
    p2_cost = (synthesis["input_tokens"] * 3.00 + synthesis["output_tokens"] * 15.00) / 1_000_000
    log(f"   Cost: ${p2_cost:.4f}")

    # Save Pass 2 output
    p2_path = os.path.join(output_dir, f"{filename}_knowledge_map.json")
    with open(p2_path, 'w') as f:
        json.dump(synthesis["knowledge_map"], f, indent=2)
    log(f"   Saved: {p2_path}")

    if output_mode == "knowledge-map":
        total_cost = p1_cost + p2_cost
        print(f"\nKnowledge map saved: {p2_path}")
        print(f"   Total cost: ${total_cost:.4f}")
        return {"knowledge_map": synthesis["knowledge_map"], "total_cost": total_cost}

    # Pass 3: Skill draft
    log(f"\nPass 3: Skill draft generation...")
    skill_md = await pass3_skill_draft(client, synthesis["knowledge_map"])

    # Save skill draft
    p3_path = os.path.join(output_dir, f"{filename}_SKILL.md")
    with open(p3_path, 'w') as f:
        f.write(skill_md)

    p3_cost = 0.05  # Approximate
    log(f"   Saved: {p3_path}")

    # Pass 3b: Reference file generation
    log(f"\nPass 3b: Generating reference files...")
    ref_result = await pass3b_generate_references(client, skill_md, synthesis["knowledge_map"])
    p3b_cost = (ref_result["input_tokens"] * 3.00 + ref_result["output_tokens"] * 15.00) / 1_000_000
    log(f"   Cost: ${p3b_cost:.4f} ({ref_result['input_tokens']:,} in + {ref_result['output_tokens']:,} out)")

    references = ref_result["references"]
    if "_parse_error" not in references:
        # Save each reference file
        refs_dir = os.path.join(output_dir, f"{filename}_references")
        os.makedirs(refs_dir, exist_ok=True)
        for ref_filename, ref_content in references.items():
            # Normalize path — strip leading "references/" if present
            clean_name = ref_filename.replace("references/", "").replace("/", "_")
            ref_path = os.path.join(refs_dir, clean_name)
            with open(ref_path, 'w') as f:
                f.write(ref_content)
            log(f"   Saved: {ref_path}")
        log(f"   {len(references)} reference files generated")
    else:
        log(f"   Warning: Could not parse reference output. Raw saved.")
        raw_path = os.path.join(output_dir, f"{filename}_references_raw.md")
        with open(raw_path, 'w') as f:
            f.write(references.get("_raw_output", ""))

    total_cost = p1_cost + p2_cost + p3_cost + p3b_cost
    log(f"\nAll passes complete!")
    log(f"   Skill: {p3_path}")
    log(f"   Total cost: ${total_cost:.4f}")

    return {"skill_draft": skill_md, "references": references, "knowledge_map": synthesis["knowledge_map"], "total_cost": total_cost}


async def main():
    parser = argparse.ArgumentParser(description="Corpus Distillation Pipeline")
    parser.add_argument("input", help="File path or directory of files to distill")
    parser.add_argument("--output-mode", choices=["summary", "knowledge-map", "skill-draft"],
                        default="knowledge-map", help="Output mode (default: knowledge-map)")
    parser.add_argument("--output-dir", default="./output", help="Output directory (default: ./output)")
    parser.add_argument("--max-concurrent", type=int, default=10,
                        help="Max concurrent Haiku calls (default: 10)")

    args = parser.parse_args()
    os.makedirs(args.output_dir, exist_ok=True)

    input_path = Path(args.input)

    if input_path.is_dir():
        SUPPORTED = ('.pdf', '.docx', '.md', '.txt', '.text', '.mhtml', '.pages', '.html', '.htm', '.epub')
        files = sorted([
            str(f) for f in input_path.iterdir()
            if f.suffix.lower() in SUPPORTED
        ])
        log(f"Found {len(files)} files to process")
        for filepath in files:
            try:
                await distill_file(filepath, args.output_dir, args.output_mode, args.max_concurrent)
            except Exception as e:
                log(f"\nError processing {filepath}: {e}")
    elif input_path.is_file():
        await distill_file(str(input_path), args.output_dir, args.output_mode, args.max_concurrent)
    else:
        log(f"Not found: {args.input}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
