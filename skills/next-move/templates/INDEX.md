# Templates Index

Skeletal outputs to fill in. Templates encode the *shape* of valid output. Schemas (in `schemas/`) encode the rules. Use templates as starting points; validate the result against the schema.

| File | Use when |
|---|---|
| `predicted-dag.template.json` | Constructing a `PredictedDAG` from scratch (rare — usually the Synthesizer produces this) |
| `halt-gate-response.template.md` | Pipeline halted; need to render a halt response to the user |
| `modify-record.template.json` | Capturing a structured mutation when the user edits a prediction |
| `triple.template.json` | Storing a triple (rare — usually `TripleStore.save()` constructs this) |

## Workflow

1. Copy the template.
2. Fill in placeholders (marked `<<...>>`).
3. Validate against the matching schema in `schemas/`.
4. Save / present.

If the template doesn't match what you need, the schema is the source of truth — don't bend the template, look at the schema and construct directly.
