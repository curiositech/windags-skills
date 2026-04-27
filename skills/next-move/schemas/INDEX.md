# Schemas Index

Machine-readable contracts for every output `/next-move` produces. Use these to validate before storing or presenting.

| File | Validates | Used by |
|---|---|---|
| `predicted-dag.schema.json` | Top-level `PredictedDAG` output of the pipeline | `validatePredictedDAG()` in `packages/core/src/context/validate-prediction.ts` |
| `triple.schema.json` | A complete `NextMoveTriple` saved to `.windags/triples/` | `TripleStore.save()` |
| `human-feedback.schema.json` | The `HumanFeedback` portion of a triple | Approval flow, modify flow |
| `sensemaker-output.schema.json` | Sensemaker JSON contract | Pipeline stage 1 |
| `decomposer-output.schema.json` | Decomposer JSON contract | Pipeline stage 2 |
| `premortem-output.schema.json` | PreMortem JSON contract | Pipeline stage 3 (parallel with skill selector) |

## Authoritative Source

These schemas are derived from `packages/core/src/types/next-move.ts`. When you change a TypeScript type, regenerate the schema. The TypeScript types are the source of truth.

## Validation Discipline

- **Always validate before saving a triple.** Bad data in `.windags/triples/` poisons the attribution loop.
- **Always validate before presenting.** Half-formed JSON wastes the user's time and erodes trust.
- **Validate Sensemaker/Decomposer output before passing to the next stage.** Cascade failures are harder to debug than a single failed stage.

## Schema vs. Template

- A **schema** says what's *valid*.
- A **template** is a *starting point*.

Templates live in `templates/` and are the empty form you'd fill in. Schemas are the rules that say whether a filled-in form is acceptable.
