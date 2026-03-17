# Changelog

## [iter-3] 2026-03-10 — Cross-evaluation by skill-architect

**Evaluator**: skill-architect (iter-2)

### Changes

**SKILL.md**
- Added NOT clause to description: "NOT for general coding help, debugging runtime errors, building MCP servers, writing Claude hooks, or creating plugins"
- Added `metadata.tags` to frontmatter for discoverability
- Added Mermaid flowchart of the core create/test/review/improve loop after the intro
- Extracted Description Optimization Steps 1-3 detail to `references/description-optimization.md`; SKILL.md now contains concise steps with a pointer to the reference
- Compressed Claude.ai and Cowork sections (trimmed redundancy, tightened prose) to bring SKILL.md under 500 lines
- Removed the redundant "Repeating one more time the core loop" section at the bottom
- Updated reference index to include `references/description-optimization.md` with when-to-consult guidance
- Reference index now uses a table format for clarity

**New files**
- `references/description-optimization.md` — Detailed guidance on writing trigger eval queries, how skill triggering works, train/test split logic, score interpretation, description quality checklist

**Fixed**
- `EVALUATION.md` — Removed trailing `**` from reference at line 112 (markdown bold artifact that caused phantom detection)
- `references/troubleshooting.md` — Added note on false positive phantom references from `check_self_contained.py`

### Validation status after changes
- SKILL.md line count: 489 (was 526, now under 500 limit)
- Description NOT clause: present
- Phantom references: reduced (EVALUATION.md artifact fixed; analyzer.md false positive documented)

---

## [iter-2] 2026-03-09 — Self-evaluation by skill-creator

**Evaluator**: skill-creator (self)

### Changes

- Description rewritten to be imperative and "pushy"
- `run-1/` path level added throughout workspace layout and output paths (bug fix for aggregate_benchmark.py)
- Workspace layout ASCII diagram added
- Grader subagent prompt template added under Step 4
- `agents/grader.md` steps 7 and 8 reordered (metrics read before writing results)
- `agents/analyzer.md` mode-selector note added at top
- Reference section updated with eval-viewer, troubleshooting.md, eval-patterns.md
- `references/troubleshooting.md` created
- `references/eval-patterns.md` created

---

## [iter-1] 2026-03-07 — Initial snapshot

**Source**: Anthropic official skill-creator (commit b0cbd3df)
