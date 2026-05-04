---
license: Apache-2.0
name: skill-architect
description: Design, create, audit, and improve Claude Agent Skills with expert-level progressive disclosure. Use when building new skills, reviewing existing skills, debugging activation failures, encoding domain expertise, designing skills for subagent consumption, or understanding platform constraints and distribution surfaces. NOT for general Claude Code features, runtime debugging, non-skill coding, or MCP server implementation.
allowed-tools: Read,Write,Edit,Bash,Grep,Glob
argument-hint: '[skill-path-or-name] [action: create|audit|improve|debug]'
metadata:
  category: Productivity & Meta
  tags:
    - architect
    - create-skill
    - improve-skill
    - skill-audit
  pairs-with:
    - skill: skill-creator
      reason: The architect designs skill structure; the creator guides implementation following those patterns
    - skill: skill-grader
      reason: Grading feedback identifies architectural weaknesses that the architect addresses
    - skill: skill-documentarian
      reason: Documentation standards complement architectural design for complete skill delivery
category: Agent & Orchestration
tags:
  - skill
  - architect
  - ai
  - design
  - ui
  - agents
---

# Skill Architect: The Authoritative Meta-Skill

The unified authority for creating expert-level Agent Skills. Encodes the knowledge that separates a skill that *merely exists* from one that *activates precisely, teaches efficiently, and makes users productive immediately*.

## Philosophy

**Great skills are progressive disclosure machines.** They encode real domain expertise (shibboleths), not surface instructions. They follow a three-layer architecture: lightweight metadata for discovery, lean SKILL.md for core process, and reference files for deep dives loaded only on demand.

## Decision Points

### Action Branch Selection

```
Query analysis:
├─ Contains "new skill" OR "create skill" → CREATE path
├─ Contains "audit" OR "review" OR "improve existing" → AUDIT path
├─ Contains "won't activate" OR "false positive" → DEBUG path
├─ Contains "subagent" OR "orchestration" → SUBAGENT-DESIGN path
└─ Contains example expertise but no skill → EXTRACT path
```

### CREATE Path Decision Tree

```
User expertise level:
├─ Has domain examples → Guide through 6-step process
│  ├─ Has working code → Initialize with scripts first
│  └─ No working code → Start with reference gathering
├─ Has general idea only → Use knowledge engineering methods
│  ├─ Technical domain → Apply protocol analysis
│  └─ Business domain → Use repertory grid technique
└─ Template request → Refuse (NOT for templates without expertise)
```

### AUDIT Path Decision Tree

```
Skill performance issue:
├─ Never activates → Description analysis + trigger testing
│  ├─ Description too vague → Apply formula: [What][When]NOT[Exclusions]
│  ├─ Missing shibboleths → Add domain-specific anti-patterns
│  └─ Catalog competition → Check overlap with existing skills
├─ False positives → Boundary tightening
│  ├─ Missing NOT clause → Add explicit exclusions
│  └─ Description too broad → Split into focused skills
└─ Poor user experience → Progressive disclosure analysis
   ├─ SKILL.md >500 lines → Move depth to references
   └─ Missing decision trees → Convert prose to Mermaid flowcharts
```

### SUBAGENT-DESIGN Path Decision Tree

```
Subagent consumption context:
├─ Preloaded skills (2-5 core) → Standard operating procedures
├─ Dynamic selection → Catalog + filtering logic
└─ Execution-time → Protocol compliance patterns
```

## Failure Modes

### Schema Bloat
**Detection**: SKILL.md >500 lines, reference files unused, agent takes >30 seconds to respond
**Symptoms**: Slow activation, user confusion, context window exhaustion
**Fix**: Move depth to `/references`, create lazy-loading index in SKILL.md
**Timeline**: Became critical with context window limits in 2024

### False Activation Cascade
**Detection**: Skill activates on queries containing ANY keyword from domain, NOT clause missing
**Symptoms**: User gets wrong skill 80%+ of time, productivity drops
**Fix**: Add NOT clause with 3-5 explicit exclusions, test with negative cases
**Root cause**: Undertrigger bias leads to overly broad descriptions as compensation

### Phantom Tool Reference
**Detection**: SKILL.md references files that don't exist, scripts fail on execution
**Symptoms**: Agent wastes tool calls, user sees "file not found" errors
**Fix**: Run `check_self_contained.py`, delete references or create missing files
**Common source**: Copy-paste from other skills without adapting file paths

### Shibboleth Poverty
**Detection**: No anti-patterns section, LLM gives 2019 advice for 2025 problems
**Symptoms**: Expert users reject skill output, temporal knowledge gaps
**Fix**: Add 2-3 anti-patterns using Novice/Expert/Timeline template
**Example**: Recommending React classes instead of hooks, or CLIP for counting tasks

### Eager Loading Anti-Pattern
**Detection**: Instructions like "read all reference files before starting"
**Symptoms**: Context overflow, slow performance, irrelevant information
**Fix**: Replace with specific loading conditions: "Read X when dealing with Y"
**Architecture violation**: Breaks progressive disclosure model

### Background-Agent Git Sweep
**Detection**: Skill instructions tell the agent to `git add -A`, `git add .`, or otherwise stage by pattern; or omit any guidance and assume the agent will figure it out
**Symptoms**: A background skill agent's commit contains files it did not author. `git log --oneline` no longer matches the diff. Foreground work ships under a misleading message; or worse, a foreground agent's half-finished work ships unintentionally
**Fix**: Encode the discipline from `docs/adr/0001-background-agent-git-discipline.md` directly in the generated skill: long-running work runs in a git worktree (Rule 1), staging is by explicit path (Rule 2), a `git status --porcelain` check fires before every commit (Rule 3)
**Triggering incident**: windags-skills `bb34efa` (2026-05-03) — skill-creator's `git add -A` swept up a v2.10.0 release commit's 8 staged files into a single-skill commit

## Coordination Discipline

Skills that author or modify files in a shared repository MUST inherit the rules in `docs/adr/0001-background-agent-git-discipline.md`. The short version, for skills generated under this skill-architect:

1. **Worktree for long-running work.** Any skill whose typical run takes >10s between "start" and "commit" MUST instruct the agent to create a git worktree (`git worktree add ../$repo-$skill-$task`) and do its work there. Never edit the user's main checkout in the background.
2. **No `git add -A`, ever.** Generated skills MUST stage by explicit path. Pattern-based staging (`git add -A`, `git add .`, `git add -u`) belongs in interactive scripts the user runs themselves, never in agent prompts.
3. **Pre-commit dirty-tree check.** Before any `git commit`, the skill instructs the agent to run `git status --porcelain` and abort with a clear "unrecognized files: …" message if anything dirty was authored elsewhere.
4. **Lock when sharing a tree.** If by exception two agents must share one tree, serialize through `port-daddy acquire_lock <repo>:git:write`.

This is non-negotiable for the CREATE branch. `skill-creator` enforces it in its own operating instructions and propagates it into every skill it drafts.

## Worked Examples

### Example 1: Creating Database Migration Skill

**User request**: "Help me create a skill for database migrations"

**Step 1 - Gather examples**: Expert provides 3 real migration scenarios:
- Schema change with zero downtime
- Data backfill with rollback plan  
- Index creation on large table

**Step 2 - Extract shibboleths**: 
- Novice: "Just run ALTER TABLE"
- Expert: "Migration requires: forward script + rollback script + traffic analysis + gradual rollover"
- Timeline: Pre-2020 migrations were often manual; modern practice requires automation + monitoring

**Step 3 - Design decision tree**:
```
Migration type:
├─ Schema change → Zero-downtime strategy required
├─ Data transformation → Backfill + validation pipeline  
└─ Index/constraint → Size analysis + batching strategy
```

**Step 4 - Create progressive disclosure**:
- SKILL.md: Core decision tree + 2 anti-patterns
- `references/strategies.md`: Detailed techniques per migration type
- `scripts/migration_planner.py`: Generates rollback scripts

**What novice would miss**: No rollback planning, no performance impact analysis
**What expert catches**: Always plan rollback first, test on production-sized data, monitor key metrics during migration

### Example 2: Monolithic vs Layered Skill Design

**Scenario**: User wants single "web development" skill covering React + Node + deployment

**Analysis**: This violates focused expertise principle

**Trade-off decision**:
- **Monolithic approach**: One skill, broad triggers, 1000+ line SKILL.md
  - Pro: Single activation, seems simpler
  - Con: False positives, poor progressive disclosure, activation conflicts
- **Layered approach**: 3 focused skills (`react-patterns`, `node-api-design`, `deployment-pipelines`)
  - Pro: Precise activation, expert-level depth, reusable components
  - Con: User must understand skill boundaries

**Expert choice**: Always choose layered. Better to have precise activation on narrower domains than broad activation with poor results.

**Implementation**: Create 3 separate skills, each with strong NOT clauses to prevent overlap

### Example 3: Debugging Activation Failure

**User report**: "My skill never activates even with obvious queries"

**Diagnostic process**:

**Step 1 - Test explicit queries**:
```
Query: "Help me plan a database migration" 
Expected: db-migration-skill activates
Actual: No skill activated
```

**Step 2 - Analyze description**:
Original: "Database utilities and migration help"
Problem: Too vague, no trigger keywords, no NOT clause

**Step 3 - Apply formula**:
Fixed: "Plans database schema migrations with rollback strategies and zero-downtime deployment. Use for ALTER TABLE, data backfills, index creation on production systems. NOT for database design, query optimization, or backup strategies."

**Step 4 - Test negative cases**:
```
Query: "How do I optimize this SQL query?"
Expected: db-migration-skill does NOT activate  
Actual: Still activates (needs stronger NOT clause)
```

**Final fix**: Add explicit exclusion for "query optimization" and test with 5 positive + 5 negative cases.

## Quality Gates

- [ ] SKILL.md exists and is under 500 lines
- [ ] Frontmatter contains required `name` and `description` fields
- [ ] Description follows `[What][When to use]NOT[Exclusions]` formula
- [ ] At least 2 anti-patterns using Novice/Expert/Timeline template
- [ ] All file references in SKILL.md actually exist in skill directory
- [ ] Core process uses Mermaid diagram (flowchart/sequence/state)
- [ ] References section lists each file with 1-line loading condition
- [ ] Test with 5 positive queries that should activate skill
- [ ] Test with 5 negative queries that should NOT activate skill
- [ ] Scripts execute successfully with clear error handling
- [ ] If the skill stages or commits files: no `git add -A`, no `git add .`, no `git add -u`; long-running runs use a git worktree; a `git status --porcelain` dirty-tree check precedes every commit (see ADR 0001)

## Subagents

This skill ships with five focused subagents in `agents/` — one per decision branch above. Dispatch directly via `Task(subagent_type=<name>, ...)` or compose them into workflows. See `agents/INDEX.md` for full routing guide.

| Agent | Path | Output |
|---|---|---|
| `skill-creator` | CREATE | Drafts new SKILL.md from expert inputs (refuses without examples) |
| `skill-auditor` | AUDIT | 7-dimension scoring report (JSON) with prioritized fixes |
| `activation-debugger` | DEBUG | Corrected description + activation regression tests |
| `shibboleth-extractor` | EXTRACT | Novice/Expert/Timeline anti-patterns from raw content |
| `cross-evaluator` | (template) | Generic source-embodies-target evaluation |

Each agent has explicit input/output contracts in its frontmatter and refuses to operate on insufficient input — a `skill-creator` invoked without worked examples returns `status: blocked` rather than producing a generic template.

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- General Claude Code features (slash commands, MCP server implementation)
- Runtime debugging of non-skill code (use domain-specific debugging skills)
- Template generation without real domain expertise to encode
- Creating catch-all skills that cover entire domains
- Quick fixes to existing working skills (use targeted improvement skills)

**Delegate to these skills instead**:
- For MCP server implementation → `mcp-server-builder`
- For general code debugging → `debug-master` 
- For API documentation → `api-documentarian`
- For testing strategies → `test-architect`