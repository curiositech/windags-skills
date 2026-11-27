---
license: Apache-2.0
name: skill-architect
description: Create, audit, improve, and test Agent Skills. Use when writing a SKILL.md, turning expert workflows into reusable instructions, debugging wrong or missing activation, designing start and stop conditions, measuring skill behavior, or preparing a skill for WinDAGs grafting. NOT for routine use of an existing skill, general agent runtime debugging, or MCP server implementation.
allowed-tools: Read,Write,Edit,Bash,Grep,Glob
metadata:
  category: Productivity & Meta
  tags:
    - architect
    - create-skill
    - improve-skill
    - skill-audit
    - skill
    - ai
    - design
    - agents
  pairs-with:
    - skill: skill-creator
      reason: The architect designs skill structure; the creator guides implementation following those patterns
    - skill: skill-grader
      reason: Grading feedback identifies architectural weaknesses that the architect addresses
    - skill: skill-documentarian
      reason: Documentation standards complement architectural design for complete skill delivery
  argument-hint: "[skill-path-or-name] [action: create|audit|improve|debug]"
  io-contract:
    kind: deliverable
    produces:
      - kind: skill-design
        description: >-
          Complete SKILL.md with progressive disclosure architecture, decision trees, anti-patterns, and reference file
          catalog for new or redesigned skills
        format: markdown
      - kind: audit-report
        description: >-
          Activation failure diagnosis, description tightening recommendations, false-positive boundary analysis, and
          progressive disclosure restructuring plan
        format: markdown
      - kind: refactor-plan
        description: >-
          Step-by-step skill improvement roadmap covering description formula application, shibboleth extraction,
          line-count reduction, and anti-pattern encoding
        format: markdown
      - kind: expertise-extraction
        description: >-
          Domain knowledge engineering output (protocol analysis, repertory grids, decision trees) converted into
          skill-ready shibboleths and anti-patterns
        format: markdown
category: Productivity & Meta
tags:
  - skill
  - architect
  - skill-audit
  - activation
  - progressive-disclosure
  - skill-grafting
---

# Skill Architect

Turn a recurring task or failure into a skill an agent can select, execute, and verify. Capture the choices an experienced practitioner makes under uncertainty, including what would change their mind.

## Start when

The request concerns authoring, auditing, repairing, or distributing an Agent Skill and identifies a bundle or a repeatable job to teach. Resolve an existing skill's real entrypoint, source revision, and installed target before editing. For a new skill, use a real task, a prior run, or a domain source to anchor the first example. If the task or authority is unclear, inspect what is available and name the specific missing input before proposing changes.

## Stop when

- **Complete** when the requested bundle or audit is present, the applicable structural and behavioral checks have run, and the result records the revision, checks, and evidence. For a WinDAGs retrieval change, verify the indexed input and inspect search and graft results with held-out requests.
- **Handoff** when the agreed artifact and evidence reach a named next step. State the producer, consumer, artifact path or ID, and the consumer's first validation.
- **Blocked** when a required input, permission, or acceptance check is unavailable after reasonable recovery. Record the last verified state, what would unblock it, and whether a draft or partial result is usable. A missing or stale check cannot support completion.

Start and stop conditions belong in the skill body so an agent can consult them after grafting. Use runtime-enforced constraints in the host tool or schema where an operation needs a guarantee. A retrieval score and an instruction heading confer no authority to act.

## Choose the work

| What you observe | What to do |
| --- | --- |
| A repeatable job has no skill | Capture the job, inputs, outcome, two genuinely different examples, and the practitioner decisions. Build the smallest useful version. |
| A skill loads but produces weak results | Reproduce a failure with the existing revision. Find the first missed or wrong decision and revise that instruction or verification step. |
| Direct invocation works but unnamed requests miss or route to a neighbor | Test the intended catalog, inspect resolution and the description, then compare ranking and loading on realistic positives and near misses. |
| A skill is consumed by a subagent or another workflow stage | State the inputs, tools, output artifact, and downstream check. Make required and optional dependencies clear. |
| Copies disagree | Compare entrypoint and bundle contents at installed, canonical, and relevant branch revisions. Preserve independent improvements and local changes. Record the chosen source and sync scope. |

## Build or improve the bundle

1. **Define the deliverable and a check for it.** Capture the starting state, output, inputs, tools, freshness requirements, and the earliest observation that would invalidate success. Collect realistic positive requests and adjacent requests that need something else. Freeze some as an evaluation set before tuning.
2. **Find relevant skills and actual capabilities.** Search the current catalog using the task as a user would phrase it. Read a candidate when its supported operations fit. Compare likely neighbors and inspect the relevant tool, schema, and source versions. Use [knowledge engineering](references/knowledge-engineering.md) when the expert decision is tacit.
3. **Write discovery metadata and the core workflow.** Put a concise job, natural language callers use, and meaningful exclusions in `description`. Keep start and stop checks, consequential decisions, recovery, and the output contract in `SKILL.md`. Describe prerequisites and postconditions at each important handoff. Move optional depth into files that each have a reason to load.
4. **Make checks executable where useful.** Start with prose. Ship a script when it removes repeated work or gives a reliable check. Read or run the actual command against a fixture and verify flags, inputs, outputs, exit behavior, and recovery. Include required files in the bundle. Use Mermaid when branches, state, or dependencies are clearer in a diagram. Check renderer behavior when the rendered result matters.
5. **Evaluate before and after.** Check structure and references. Compare retrieval, loading, instruction use, and outcome separately. Run baseline and candidate with the same inputs. Include a no-skill baseline when measuring contribution and an explicit invocation when isolating execution. Recheck cases that could pass on stale evidence or reject a valid equivalent.
6. **Deliver evidence and release deliberately.** Record the changed files, scope, and outcomes. Refresh the WinDAGs vector when applicable. Verify the intended installed or packaged bundle before calling it available. Preserve the known-good version when a validation or distribution gate is unresolved.

## Avoid these failure modes

- **A dressed-up tutorial.** A skill that repeats familiar knowledge uses context without improving decisions. Keep the unusual signal, viable alternatives, a practitioner example, and the check that resolves it. Put broad background in a reference only when a decision depends on it.
- **A green check with the wrong scope.** A successful command can refer to last week's revision or an unrelated path. Verify the artifact, revision, and invariant. Accept a relocated or renamed check if its current evidence is equivalent.
- **A relevant match with missing capability.** A skill can rank highly while lacking the required tool permission, input, or operation. Evaluate retrieval and execution separately and name what the skill can support.
- **A reference nobody can find.** Link bundled resources from the entrypoint with a concise load condition. Test the exported bundle from its published shape. Run visual validation separately from diagram syntax checks where renderability matters.

## Validate

Run the bundle's [structural validator](scripts/validate_skill.py) with `--strict` and its [reference checker](scripts/check_self_contained.py) with `--include-orphans`. Use the [Mermaid validator](scripts/validate_mermaid.py) on changed diagrams. Verify each new executable on representative inputs and a failure case. Match evaluation depth to the behavior that changed and report any unmeasured stage.

For a deterministic audit, name finding IDs, evidence location, severity, and expected results for passing and failing fixture inputs. Use strict schemas at machine-to-machine boundaries only where the host actually validates them.

## Load only what the task needs

Open a reference when the workflow calls for deeper guidance. The WinDAGs source runtime can expose these conditions from the [reference index](references/INDEX.md).

| When | Open |
| --- | --- |
| Scope includes authority, stop rules, stale evidence, or handoffs | [Start and stop conditions](references/start-stop-conditions.md), [composition patterns](references/skill-composition.md) |
| WinDAGs search, vectors, or grafting changes | [WinDAGs grafting](references/windags-grafting.md). This bundle supplies [positive embedding requests](references/tool2vec-queries.json) and [held-out routing cases](references/graft-evaluation.json). |
| You need a before-and-after test or a defensible claim | [Evaluation evidence](references/skill-evaluation-evidence.md), [scoring rubric](references/scoring-rubric.md), [independent evaluation agent](agents/cross-evaluator.md) |
| A skill is missed, misrouted, or shadowed by a neighbor | [Description guide](references/description-guide.md), [activation debugging](references/activation-debugging.md) |
| Expert knowledge is hard to articulate | [Knowledge engineering](references/knowledge-engineering.md), [worked anti-patterns](references/antipatterns.md) |
| The task requires a new bundle or repeatable tools | [Scaffolder](scripts/init_skill.py), [self-contained tools](references/self-contained-tools.md) |
| A diagram clarifies branching, sequencing, or state | [Visual artifacts and Mermaid](references/visual-artifacts.md) |
| You are choosing an extension, distributing, or maintaining a bundle | [Extension taxonomy](references/claude-extension-taxonomy.md), [plugin architecture](references/plugin-architecture.md), [lifecycle](references/skill-lifecycle.md) |
| You are handing work to a subagent | [Subagent design](references/subagent-design.md), [subagent template](references/subagent-template.md) |
| An external tool boundary is justified | [MCP packaging template](references/mcp-template.md) |
| The goal includes cross-repo distribution or sync | [Advanced structure and sync](references/advanced-structure-and-sync.md), [sync planning template](templates/skill-sync-plan.md), [migration planning script](scripts/migration_planner.py) |
| A recurring review needs structured inputs | [Operating-surface auditor](scripts/audit_skill_operating_system.py), [sync schema](schemas/skill-sync-plan.schema.json), [scorecard](templates/skill-scorecard.json), [visual decision board](templates/visual-decision-board.md) |
| The host needs a separate runtime export or agent role | [Runtime export example](examples/runtime-export-example.md), [runtime frontmatter](templates/runtime-export-frontmatter.yaml), [agent index](agents/INDEX.md) |
| You need a second worked refactor pattern | [Structural upgrade example](examples/structural-upgrade-example.md) |
| Specialized roles are needed | [Activation debugger](agents/activation-debugger.md), [builder](agents/skill-creator.md), [auditor](agents/skill-auditor.md), [elicitation agent](agents/shibboleth-extractor.md), [affordance planner](agents/affordance-planner.md), [sync coordinator](agents/sync-coordinator.md) |
| Inspect host-specific features and discovery before packaging | [Claude Code runtime](references/claude-code-runtime.md), [channels and scheduling](references/channels-and-scheduling.md), [preflight](scripts/preflight.sh), [reference index generator](scripts/index_references.py) |
| Read distribution-specific background | [Expertise elicitation](references/expertise-elicitation.md), [legacy guide](references/guide.md), [strategy index](references/strategies.md) |
