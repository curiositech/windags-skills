# Checkpoint Storage Adapters

Adapter contract:
- `save(checkpoint)` writes atomically.
- `load(runId)` returns the latest compatible checkpoint.
- `list(runId)` supports audit and debugging views.
- `cleanup(runId)` removes superseded snapshots safely.

Prefer append-only writes plus periodic compaction over in-place mutation.
