# Architecture Patterns

## Command / Query / Event Split

Use commands for intent, queries for current truth, and events for transition history.

- Commands should be idempotent where possible.
- Queries should return enough snapshot data for the UI to render without inference.
- Events should be typed, versioned, and replayable.

## Projection Stores

The UI should keep projection stores, not runtime-authoring stores.

- contract inputs: what the user chooses
- backend snapshot: what the runtime says is true
- layout state: what windows are open and where they live

Do not let one store own all three.

## Migration Rule

If two incompatible models exist, choose one as canonical immediately and make the other import-only migration glue.

The active editing path should never support both indefinitely.
