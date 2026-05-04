# skill-architect Subagents

Five focused subagents implementing the skill-architect's decision branches. Each is invokable directly via the `Task` tool, or composed by the parent skill into a workflow.

| Agent | Path it implements | Output |
|---|---|---|
| `skill-creator.md` | CREATE | New SKILL.md drafted from raw expert inputs (refuses without examples) |
| `skill-auditor.md` | AUDIT | Structured 7-dimension scoring report with prioritized fixes |
| `activation-debugger.md` | DEBUG | Corrected description + activation regression tests |
| `shibboleth-extractor.md` | EXTRACT | Novice/Expert/Timeline anti-pattern entries from raw expert content |
| `cross-evaluator.md` | (legacy template) | Generic "embody source skill, evaluate target" template |

## When to dispatch which

```
Goal: build a new skill from raw expertise
  → skill-creator   (refuses if expertise is generic; demands examples)

Goal: review an existing skill's quality
  → skill-auditor   (scores 7 dimensions, returns JSON; doesn't rewrite)

Goal: skill exists but isn't activating correctly
  → activation-debugger   (description + NOT-FOR fix only; preserves body)

Goal: I have a postmortem / transcript / engineering blog and want to
      mine it for anti-patterns
  → shibboleth-extractor   (Novice/Expert/Timeline triplets, sourced)

Goal: rewrite a target skill in the voice of a source skill
  → cross-evaluator   (generic template; substitute SOURCE/TARGET)
```

## Composition patterns

### Build-then-audit
```
skill-creator → drafts skills/<id>/SKILL.md
  → skill-auditor → scores it
  → if scores < 7 on any dim: feedback to creator for one revision
```

### Activation triage
```
User: "skill <X> isn't firing"
  → skill-auditor (audit_depth: deep) → reveals undertrigger
  → activation-debugger → fixes description + writes regression tests
```

### Domain-knowledge ingestion
```
You found a great Stripe engineering blog post.
  → shibboleth-extractor (sources: [URL])
  → outputs Novice/Expert/Timeline blocks
  → skill-creator (target: skills/<id>/) merges them into anti-patterns
```

## Difference from `/agents/` at repo root

The repo root `/agents/` directory holds the `/next-move` meta-DAG agents (`sensemaker`, `decomposer`, `skill-selector`, `premortem`, `synthesizer`). Those are pipeline stages.

These agents are **skill-internal** — owned and dispatched by `skill-architect`. They don't appear in the global agent registry and aren't part of any pipeline. They're the meta-skill's hands.

If a user invokes `Task(subagent_type=skill-creator, ...)` directly, that works — but the canonical path is to go through `skill-architect`, which orchestrates the right one based on the user's stated goal.

## Skills loaded by these agents

Each agent's frontmatter lists the skills it consumes (via `skills:` field). The pattern:

- All four operational agents preload `skill-architect` itself (the methodology)
- `skill-creator` additionally preloads `skill-coach` (for the gather-expertise phase)
- `skill-auditor` additionally preloads `skill-grader` (for the scoring rubric)

Agents do not load entire reference catalogs eagerly. They load specific reference files (`description-guide.md`, `scoring-rubric.md`, `antipatterns.md`, `activation-debugging.md`) on demand as their workflow steps require.

## Quality gates for adding a new agent here

A new subagent may join this folder when:

- It implements a path the parent SKILL.md describes (or the parent SKILL.md is updated to add the path)
- Its frontmatter has `name` (matching filename), `description`, `tools`, `model: inherit`, `skills:`
- It has explicit input contract (what payload the orchestrator hands it) and output contract (JSON shape it returns)
- It refuses to operate on insufficient input (e.g., `skill-creator` refuses without expert examples; `activation-debugger` refuses without failing queries)
- It has explicit anti-patterns telling it what *not* to do
- This INDEX.md is updated to list it
