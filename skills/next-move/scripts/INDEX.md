# Scripts Index

Runnable utilities for working with `/next-move` data on disk. Each script is self-contained — no skill-loading, no LLM calls.

| File | What it does | Usage |
|---|---|---|
| `replay-triple.sh` | Display a stored prediction without re-running the pipeline | `./replay-triple.sh <triple-id\|latest\|--list>` |
| `validate-prediction.sh` | JSON-Schema validate a `PredictedDAG` file | `./validate-prediction.sh <file.json\|->` |
| `dump-attribution.ts` | Inspect attribution DB (observation count, mean quality, k-NN preview) | `tsx skills/next-move/scripts/dump-attribution.ts <skill-id> ["<task>"]` |

## Prerequisites

| Tool | Required for | Install |
|---|---|---|
| `jq` | replay, validate (fallback) | `brew install jq` |
| `ajv-cli` | full JSON-Schema validation | `npm install -g ajv-cli ajv-formats` |
| `tsx` | dump-attribution.ts | `pnpm add -g tsx` (or via the workspace) |

The shell scripts run from any directory; `dump-attribution.ts` resolves imports relative to the workspace root.

## When to Use Each

- **Just stored a triple, want to see it again** → `replay-triple.sh latest`
- **Generated a prediction by hand, need to confirm shape** → `validate-prediction.sh prediction.json`
- **Wondering if a skill has any historical data** → `dump-attribution.ts <skill-id>`
- **Debugging why a skill keeps getting picked** → `dump-attribution.ts <skill-id> "<the kind of task>"` — shows k-NN neighbors

## Why These Aren't `wg` Subcommands

These are diagnostic tools, not user flows. Folding them into the CLI grows surface area without enough leverage. Keeping them as scripts means:
- They compose with shell pipelines.
- Updating one doesn't require a CLI release.
- The implementation stays inspectable in the skill folder.

If a script grows enough demand to be a CLI command, promote it then.
