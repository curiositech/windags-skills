# Agents Index

Five Claude Code subagents — one per meta-DAG stage. These are invokable via the `Task` tool when you want to run a single stage of the `/next-move` pipeline directly, without the full orchestration.

| Agent | Purpose | Output schema |
|---|---|---|
| `sensemaker.md` | Classify the problem, score validity, decide whether to halt | `schemas/sensemaker-output.schema.json` |
| `decomposer.md` | Break the inferred problem into 3-7 subtasks with dependencies | `schemas/decomposer-output.schema.json` |
| `skill-selector.md` | Match each subtask to a primary + runner-up skill from the catalog | (inline contract — see file) |
| `premortem.md` | Identify failure modes, severities, and mitigations | `schemas/premortem-output.schema.json` |
| `synthesizer.md` | Assemble the final `PredictedDAG` from upstream outputs | `schemas/predicted-dag.schema.json` |

## When to Invoke an Agent Directly

The full pipeline (`/next-move`) runs all five in sequence. Invoke an agent directly when:

- You already have upstream output and want to re-run only a downstream stage (e.g., new PreMortem on an existing decomposition).
- You're debugging a single stage's behavior in isolation.
- You want to spot-check classification or risk analysis without full prediction.

For normal use, run `/next-move` and let the pipeline orchestrate.

## When NOT to Invoke an Agent Directly

- **Don't** chain them by hand to recreate the pipeline — the orchestrator handles wave parallelism, skill narrowing, and triple storage that direct chains miss.
- **Don't** invoke from inside a node that's *already running* under the pipeline — you'll deadlock against the parent's halt gate.
- **Don't** use these as substitutes for `windags-sensemaker`, `windags-decomposer`, etc. (those are skills loaded into pipeline-time prompts; these are subagents for direct dispatch).

## Difference From `prompts/`

- `prompts/<stage>.md` = the system prompt the pipeline injects when it spawns each stage. Loaded into LLM context by the orchestrator.
- `agents/<stage>.md` = a Claude Code subagent definition with frontmatter (`name`, `tools`, `model`). Invokable by `Task(subagent_type=<stage>, ...)`.

The agent definitions reference the prompt files for their substantive instructions, so depth lives in one place.

## Difference From `windags-<stage>` Skills

- `skills/windags-sensemaker/`, `skills/windags-decomposer/`, etc. = standalone skills that the pipeline loads into agent prompts at runtime. They're knowledge artifacts.
- `skills/next-move/agents/<stage>.md` = subagent definitions specific to the `/next-move` pipeline. They're *dispatch* artifacts.

The two are complementary. An agent definition pulls a skill body for expertise; a skill body alone can't be dispatched as a subagent.
