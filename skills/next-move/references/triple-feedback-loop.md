# Triple Feedback Loop

Every prediction `/next-move` makes is stored as a triple in `.windags/triples/`. Triples carry the user's eventual feedback, and that feedback shapes future predictions. Used well, this is the difference between a skill that gets sharper over time and one that stays at version-zero accuracy forever.

## What's in a Triple

```
{
  id: UUID,
  context: ContextSnapshot,          // git state, CLAUDE.md, modified files, conversation summary
  predicted_dag: PredictedDAG,       // the prediction
  feedback: HumanFeedback | null,    // null until the user accepts/rejects/modifies
  timestamp: ISO 8601,
  session_id: string
}
```

`HumanFeedback` is the learning signal:
- `accepted: boolean` — did the user run the plan as predicted?
- `modifications: string[]` — what they changed (skill swapped, node deleted, topology overridden)
- `rating: 1–5` — overall usefulness
- `notes: string` — free-text
- `structuredModifications: DAGMutation[]` — machine-parseable mutations

The schema is in `schemas/triple.schema.json` and `schemas/human-feedback.schema.json`.

## Three Ways Triples Improve Predictions

### 1. Attribution k-NN at Skill Selection Time

When the Skill Selector LLM is choosing a primary skill, the cascade's Stage 5 reads the attribution DB. The DB is populated from triples — each accepted prediction adds positive signal for the skills it used; each rejection or modification adds negative signal.

The math: for the current task, k-NN finds the most similar past tasks (by context embedding), then the average attribution score for each candidate skill on those similar tasks adjusts the cascade ranking.

**Implication**: a skill that's lexically perfect but historically gets swapped out for a better one will get demoted on similar future tasks. The Skill Selector will see a different shortlist.

### 2. Topology Calibration

When the user systematically overrides `team-loop` to `workflow` (or vice versa), the topology classifier learns. The `topologyReason` field captures the human-supplied justification. Aggregated across triples, this informs which problem-shapes get which topology.

**Implication**: don't fight the user's topology corrections. Record them as `structuredModifications` of type `topology_change` and let the next prediction adapt.

### 3. Halt-Gate Calibration

When the user halts the pipeline at low confidence — and a follow-up clarification produces a confident prediction — that's signal that the halt was right. When the user complains the halt was unnecessary, the threshold may be too aggressive.

**Implication**: triples with `accepted: false` and `notes` mentioning clarification → keep current halt thresholds. Triples where the user re-prompted with `--fresh` and got a confident plan → consider tightening the multi-thread detection.

## Reading Triples at Prediction Time

The `RecentlyUsedTracker` reads triples to surface skills used in the last few sessions. That's already wired. But a richer read is possible:

```typescript
// At Sensemaker stage — pseudocode
const recentTriples = await store.list({ limit: 20, hasFeedback: true });
const acceptanceRate = recentTriples.filter(t => t.feedback?.accepted).length / recentTriples.length;
const commonModifications = aggregateModifications(recentTriples);
```

Use the aggregated signal to inform — not override — the prediction:
- Low acceptance rate → start with `commitment_level: 'TENTATIVE'` more often.
- A specific skill keeps getting swapped → demote it manually in this prediction.
- A topology keeps getting overridden → propose the override target as the planning topology.

## Reading Triples at Modification Time

When the user selects "Modify" in the approval flow:
1. Show them the most-recent 3 triples for similar tasks (matched by context embedding).
2. Highlight what *those* users modified — "Last 3 times this kind of task came up, the user swapped `vitest-testing-patterns` for `playwright-e2e-tester`."
3. Don't auto-apply; surface as a hint.

This turns the triple store into a memory system the user can see.

## Triples are Privacy-Sensitive

Triples capture:
- Repo file paths (potentially proprietary)
- CLAUDE.md content (often private)
- Conversation summaries (always private)
- Skill choices (less sensitive)

**Default: triples stay local in `.windags/triples/`.** Never upload by default. The remote server (when wired) accepts opt-in telemetry only, and even then anonymizes by hashing repo paths, redacting CLAUDE.md, and stripping conversation summaries unless the user explicitly opts to "full" telemetry.

See `CLAUDE.md` and the project memory for the privacy posture: private-first, future opt-in `--share`.

## Triple Quality Signals

Not all triples are equally useful for learning. Weight them:

| Triple state | Useful for |
|---|---|
| `feedback === null` | Useless until feedback arrives |
| `feedback.accepted === true, rating ≥ 4` | Strong positive signal — this prediction shape worked |
| `feedback.accepted === false, modifications.length > 0` | Strongest signal — user kept the spirit but fixed specifics |
| `feedback.accepted === false, modifications.length === 0` | The plan was fundamentally wrong — useful for halt-gate calibration |
| `feedback.accepted === true, rating ≤ 2` | Suspicious — user accepted but didn't like it. Note for review. |

Predictions older than 30 days are weighted less in the k-NN — recency bias is intentional. Skill quality changes; codebases change; people's preferences shift. A good prediction from 3 months ago may be a bad prediction now.

## What NOT to Do With Triples

- **Don't show triples in the UI by default.** They contain the conversation summary which the user already saw. Showing them again is noise.
- **Don't bulk-replay triples.** Re-running every past prediction wastes tokens and produces no new signal.
- **Don't train a meta-LLM on triples without explicit consent.** Even local fine-tuning is opt-in.
- **Don't compute Elo from triples.** Skills aren't competing in pairwise matches; the rating is per-prediction, not per-skill.
- **Don't overwrite a triple when the user revises feedback.** Append a new triple linked by `parent_id` (when added) or by session — preserve history.

## Triple Store Operations

Available on `TripleStore`:

```typescript
store.save(triple)              // create or update
store.get(id)                   // fetch by ID
store.list(filter)              // recent N matching filter
store.count()                   // total count (used for context signals)
```

Read more in `packages/core/src/context/triple-store.ts`. The store is filesystem-backed (one JSON file per triple in `.windags/triples/`) for simplicity and grep-ability. SQLite migration is on the roadmap when triple counts cross ~10k.

## Quality Gate

After a prediction runs:
- [ ] Triple saved with full context (not abbreviated).
- [ ] If user provided feedback, all four `HumanFeedback` fields populated.
- [ ] If user modified the plan, `structuredModifications` captures the diff (not just prose).
- [ ] If a halt fired, no triple was stored (halts shouldn't pollute training data).
- [ ] If the prediction was a `/next-move --fresh`, the prior conversation isn't leaked into `conversation_summary`.
