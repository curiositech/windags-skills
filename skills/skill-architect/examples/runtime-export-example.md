# Runtime Export Example

## Repo copy

In the repo copy, keep runtime intent under `metadata.runtime` unless native top-level fields are strictly required by the target runtime.

## Export decision

Promote intent into native top-level fields only when the runtime copy actually needs:

- `context` and `agent` for forked execution
- `hooks` for lifecycle automation
- `paths` for path-scoped activation
- `shell` for PowerShell preprocessing
- `when_to_use` for additional runtime activation context

## Example rule

- Repo copy: document the intent first.
- Runtime export: project that intent into the native Claude Code frontmatter surface.

This keeps the library validator clean without forgetting the real runtime capability.
