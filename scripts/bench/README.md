# Skill Graft Benchmark Suite

Reproduces the head-to-head Sonnet 4.6 vs. Sonnet 4.6 + Skill Graft study published at
[windags.ai/blog/skills-actually-help-the-numbers](https://windags.ai/blog/skills-actually-help-the-numbers).

## What's in here

| File | Purpose |
| --- | --- |
| `dataset.ts` | The 50 senior-engineering prompts (10 categories × 5 prompts each) |
| `runner-skill-graft-v2.ts` | Vanilla vs. Skill-Graft runner. One Sonnet 4.6 call per prompt. `max_tokens: 32768`. Multi-turn loop with on-demand reference loading. |
| `judge-pairs.ts` | Blind A/B judge — randomized first position, 5-criterion rubric, supports any Anthropic or OpenAI model |
| `export-sg-v2.ts` | Bundles run + skill bodies + reference manifests into `skill-graft-bench.json` for the marketing site |

## Quick run

```bash
# 1. Get the repo + tap
git clone https://github.com/curiositech/windags-skills.git
cd windags-skills/scripts/bench

# 2. Install Node deps for the bench runner
pnpm install   # or `npm install` — needs @anthropic-ai/sdk, openai, zod

# 3. Set keys
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...

# 4. Run the bench (50 prompts × 2 conditions, ~25 min on concurrency=4)
pnpm tsx runner-skill-graft-v2.ts --run sg-v2 --concurrency 4

# 5. Judge with Opus 4.7 + gpt-5.5 (or any other models)
pnpm tsx judge-pairs.ts runs/sg-v2 \
  --pair vanilla_v2,skill_graft_v2 \
  --provider anthropic --model claude-opus-4-7 --tag opus-4-7

pnpm tsx judge-pairs.ts runs/sg-v2 \
  --pair vanilla_v2,skill_graft_v2 \
  --provider openai --model gpt-5.5-2026-04-23 --tag gpt-5-5

# 6. Export the bundle
pnpm tsx export-sg-v2.ts runs/sg-v2
```

## Caveat: cascade differences

The published numbers (Opus 4.7 +29 prompt margin, gpt-5.5 +9) used the **full 5-stage cascade**:
BM25 → Tool2Vec embeddings → RRF fusion → cross-encoder rerank → attribution k-NN.

The runner here currently imports `SkillSearchService` from the WinDAGs core package. We're
extracting a standalone version that the public bench can use without the core monorepo. Until
that lands, two reproduction paths:

1. **Full cascade**: clone the private monorepo (not yet open-sourced) and run from there.
2. **BM25-only** (degraded): minor patch to swap `SkillSearchService` for the BM25 logic in
   `mcp-server/index.js`. Numbers will drift a few points but the directionality holds.

Open issue: [windags-skills#1](https://github.com/curiositech/windags-skills/issues/1) — extract
standalone `SkillSearchService` so the bench is fully reproducible from this repo alone.

## What you'll see in the output

After step 5 you'll have one verdicts file per judge under `runs/sg-v2/`:
- `verdicts__opus-4-7__vanilla_v2_vs_skill_graft_v2.json`
- `verdicts__gpt-5-5__vanilla_v2_vs_skill_graft_v2.json`

Each verdict includes the winner, the 5-criterion breakdown, and the judge's reasoning. The
export step bundles these into the JSON the marketing site renders.

## License

Same as the rest of windags-skills: BUSL-1.1. Bench prompts and scoring rubric are open for
reuse and extension.
