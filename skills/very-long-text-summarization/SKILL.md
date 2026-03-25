---
name: very-long-text-summarization
license: Apache-2.0
description: Summarizes very long texts (books, handbooks, biographies, codebases) using hierarchical multi-pass extraction with cheap model armies. Produces structured knowledge maps, not just summaries. Use when processing 50+ page documents, professional handbooks, career biographies, or any text too large for a single context window. Activate on "summarize book", "summarize handbook", "long document", "extract knowledge", "distill text", "professional biography". NOT for short text summarization (&lt;10 pages), real-time chat summarization, or code documentation (use technical-writer).
allowed-tools: Read,Write,Edit,Bash,Grep,Glob
argument-hint: '[file-path-or-url] [output: summary|knowledge-map|skill-draft]'
metadata:
  category: Content & Writing
  tags:
    - very
    - long
    - text
    - summarize-book
    - summarize-handbook
  pairs-with:
    - skill: research-craft
      reason: Long-text summarization supports research synthesis of academic papers and books
    - skill: llm-router
      reason: Multi-pass summarization uses model routing to assign cheap models for extraction passes
    - skill: cost-optimizer
      reason: Hierarchical summarization of large texts requires cost-aware model selection
category: AI & Machine Learning
tags:
  - summarization
  - long-context
  - text-processing
  - llm
  - compression
---

# Very Long Text Summarization

Processes texts too large for a single context window using hierarchical multi-pass extraction with armies of cheap models. Produces structured knowledge maps, indexed summaries, and skill drafts — not just prose compression.

## Decision Points

**1. Output Mode Selection**
```
If user wants quick understanding for meeting prep:
  → Use SUMMARY mode (2-pass: Haiku army → Sonnet synthesis)
  
If user needs machine-readable knowledge for downstream processing:
  → Use KNOWLEDGE-MAP mode (2-pass with full structured extraction)
  
If user wants to convert handbook expertise into Claude skill:
  → Use SKILL-DRAFT mode (3-pass: add Opus refinement)
```

**2. Document Size Assessment**
```
If < 20 pages (< 40K tokens):
  → Skip this skill, use direct summarization
  
If 20-200 pages (40K-400K tokens):
  → Standard 3-pass pipeline, 4K chunks with 500-token overlap
  
If 200+ pages (400K+ tokens):
  → Large document mode: 8K chunks, 1K overlap, parallel batch processing
```

**3. Quality vs Cost Trade-off**
```
If budget < $0.05:
  → Haiku-only mode: single pass extraction, no synthesis
  
If budget $0.05-0.20:
  → Standard mode: Haiku extraction → Sonnet synthesis
  
If budget > $0.20 AND output is skill-draft:
  → Premium mode: Add Opus refinement pass
```

**4. Iteration Threshold**
```
If knowledge map has < 80% concept coverage on first pass:
  → Run second extraction pass with focused prompts on gaps
  
If extracted processes have < 3 decision points each:
  → Re-extract with decision-focused template
  
If < 5 failure modes identified in technical text:
  → Run failure-mining pass with anti-pattern detection
```

## Failure Modes

**Schema Bloat**
- **Symptoms**: Knowledge map has 50+ concepts, 20+ processes, extraction takes 10+ minutes
- **Diagnosis**: Over-extraction without prioritization, treating every detail as key knowledge
- **Fix**: Add importance scoring in Pass 1, filter to top 20% concepts in Pass 2

**Chunking Amnesia**
- **Symptoms**: Duplicate concepts with different names, missing cross-references, fragmented processes
- **Diagnosis**: No overlap between chunks, semantic boundaries ignored
- **Fix**: Increase overlap to 25% of chunk size, use semantic chunking on headings

**Attention Dilution**
- **Symptoms**: Generic summaries, missed domain expertise, no decision trees extracted
- **Diagnosis**: Context window exceeded, prompt too generic for domain
- **Fix**: Shorter chunks (3K tokens), domain-specific extraction templates

**Traceability Gap**
- **Symptoms**: Can't verify extracted claims, no source linking, impossible to fact-check
- **Diagnosis**: Extraction lacks chunk IDs, no index mapping back to source
- **Fix**: Mandatory chunk_id tagging, build searchable index in Pass 2

**False Convergence**
- **Symptoms**: First pass looks complete but missing critical knowledge on deeper review
- **Diagnosis**: Stopped iteration too early, acceptance criteria too low
- **Fix**: Multi-validator approach, check coverage against domain taxonomy

## Worked Examples

**Example 1: Technical Handbook with Cost/Quality Trade-off**

Document: "PostgreSQL Administration Handbook" (450 pages, $0.30 budget)

**Pass 1 Decision**: 450 pages = ~900K tokens = ~225 chunks. At $0.001/chunk = $0.225 for Haiku army. Budget allows standard mode.

**Chunking Strategy**: Semantic chunking on section headings (##). Average chunk: 4K tokens, 500 overlap.

**Pass 1 Extraction** (parallel, 3 seconds wall time):
- Chunk 23 extracts: "Process: Index tuning → Check query plans → Identify missing indexes → Create with CONCURRENTLY"
- Chunk 47 extracts: "Failure: Index bloat → Symptoms: slow queries despite covering index → Fix: REINDEX CONCURRENTLY"
- Chunk 89 extracts: "Decision: VACUUM frequency → If writes > 1000/min: daily VACUUM → If writes < 100/min: weekly"

**Pass 2 Synthesis** (Sonnet, $0.08):
Merges 225 chunk extractions into knowledge map with:
- 34 core concepts (connection pooling, WAL, MVCC...)
- 12 processes (backup, recovery, tuning...)
- 18 expertise patterns ("DBAs monitor cache hit ratio daily", "Novices over-index")
- Index maps topics to chunk IDs for traceability

**Quality Check**: Coverage analysis shows 15 failure modes identified, 12 processes have ≥3 decision points each. Meets acceptance criteria.

**Total Cost**: $0.30, **Output**: 47-page knowledge map with full traceability.

**Example 2: Dense Legal Text Showing Chunking Failure**

Document: "Federal Tax Code Section 1031" (78 pages of dense legal text)

**First Attempt - Fixed Chunking**: 4K token chunks on hard boundaries.
- Chunk 12 ends mid-sentence: "...exchange of property held for productive use in trade or business or for investment..."
- Chunk 13 starts: "...except stock in trade or other property held primarily for sale..."
- **Result**: "Exchange property" and "held primarily for sale" extracted as separate concepts, missing the critical exception relationship.

**Failure Detection**: Knowledge map shows "exchange property" and "sale property" as unrelated concepts. Cross-reference validation fails.

**Fix - Semantic Chunking**: Split on subsection boundaries (numbered paragraphs).
- Chunk 12: Complete subsection on like-kind exchanges
- Chunk 13: Complete subsection on exclusions
- 500-token overlap preserves cross-references between subsections

**Result**: Correctly extracts "Like-kind exchange applies EXCEPT when property held primarily for sale" as single integrated rule.

**Example 3: Codebase Extraction Result**

Document: Ruby on Rails codebase (500 files, 50K lines)

**Challenge**: Code spans multiple files, architectural patterns emerge across modules.

**Approach**: 
- **Pass 1**: Extract from each major module (controllers/, models/, lib/)
- **Template**: Focus on patterns, not syntax: "What architectural decisions does this code reveal?"

**Pass 1 Results**:
- Controllers extract: "Pattern: Fat model, thin controller → Business logic in models, controllers handle HTTP"
- Models extract: "Decision: ActiveRecord vs service objects → If complex business logic: extract to service → If simple CRUD: keep in model"
- Lib extract: "Failure: God objects → Symptom: class > 200 lines → Fix: extract concerns or service objects"

**Pass 2 Synthesis**: 
- Identifies Rails architectural patterns
- Maps decision points: when to extract services, when to use concerns
- Builds expertise pattern: "Rails experts keep controllers under 50 lines, extract complex queries to scopes"

**Output**: Architecture knowledge map showing Rails expertise patterns, not code documentation.

## Quality Gates

**Knowledge Map Completeness**
- [ ] ≥15 core concepts identified with definitions
- [ ] ≥80% of document sections represented in concept map
- [ ] Each concept has ≥2 relationships to other concepts
- [ ] Cross-references between concepts are bidirectional

**Process Extraction Validation**
- [ ] Each process has ≥3 decision points with explicit conditions
- [ ] Process steps are ordered and actionable
- [ ] ≥5 failure modes identified with symptoms and fixes
- [ ] Decision trees have complete branches (no orphan conditions)

**Traceability Verification**
- [ ] Every extracted claim links to source chunk ID
- [ ] Index covers ≥90% of extracted topics
- [ ] Can trace any concept back to specific document section
- [ ] Chunk overlap preserves cross-boundary concepts

**Expertise Pattern Quality**
- [ ] ≥10 novice/expert distinctions identified
- [ ] Temporal evolution patterns captured (before/after changes)
- [ ] Domain-specific metaphors and mental models extracted
- [ ] Shibboleths and insider knowledge preserved

**Cost/Quality Optimization**
- [ ] Total cost within specified budget
- [ ] Processing time <5 minutes for documents <500 pages
- [ ] Quality score >80% on domain expert validation
- [ ] No critical knowledge gaps identified in spot-checks

## NOT-FOR Boundaries

**Use other skills instead:**

**For short documents (<10 pages)**: 
- Use direct LLM summarization — this skill's multi-pass overhead isn't justified

**For real-time chat summarization**: 
- Use `conversation-synthesizer` — this skill is designed for static documents, not live streams

**For code documentation generation**: 
- Use `technical-writer` — this skill extracts architectural knowledge, not API docs

**For research paper analysis**:
- Use `research-craft` — this skill handles single long documents, not multi-document synthesis

**For meeting transcripts**:
- Use `meeting-synthesizer` — this skill assumes structured text, not conversational flow

**When NOT to iterate further:**
- Budget exhausted and minimum viable extraction achieved
- Domain expert validation confirms no critical gaps
- Output meets user's stated use case requirements
- Diminishing returns: additional passes yield <10% improvement