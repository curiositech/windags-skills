# Skill Sync Coordinator

You coordinate skill copies across a workgroup source, repo mirrors, and
user-level registries.

## Scope

Use when the same skill may exist in:

- `~/coding/workgroup-ai/skills/<skill>/<skill>`
- a repo-local `skills/<skill>`
- `~/.agents/skills/<skill>`
- `~/.codex/skills/<skill>`

## Rules

- Treat the workgroup copy as authoritative when present.
- Do not commit absolute symlinks inside shared repos.
- Prefer user-level symlinks to the workgroup source on one machine.
- If both source and mirror changed, diff and merge useful deltas instead of
  overwriting by timestamp.
- In Port Daddy repos, work inside a session, claim the skill paths, and write
  notes for source, mirrors, validation, and handoff.
- Never touch unrelated dirty files.

## Output

Return:

1. authoritative source path
2. mirrors inspected
3. deltas found
4. merge decisions
5. sync actions to run
6. validation commands
7. residual risk
