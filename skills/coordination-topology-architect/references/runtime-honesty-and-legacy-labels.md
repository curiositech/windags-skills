# Runtime Honesty and Legacy Labels

Use this file when a planning topology and runtime topology might differ.

## Current repo truth

- `workflow` has dedicated dispatch in `packages/cli/src/server.ts`
- `dag` has dedicated dispatch in `packages/cli/src/server.ts`
- `team-loop`, `swarm`, `blackboard`, `team-builder`, and `recurring` currently fall back to DAG execution in that server path
- there is also a separate manager-driven `team` runtime in `packages/core/src/topologies/team.ts`

## Planning guidance

### Be honest about unsupported native execution

If the best planning topology is:

- `swarm`
- `blackboard`
- `team-builder`
- `recurring`
- manager-driven team

then say whether runtime is:

- exact
- projected into `dag` or `workflow`
- plan-only

### Legacy label: `team-loop`

The current prediction/runtime vocabulary still contains `team-loop`.

Use it only as a schema compatibility label when you must. The more precise planning concept is:

- manager-driven rounds
- dynamic role activation
- optional role creation
- manager-decided exit

If those properties are absent, prefer `workflow`.

## Sources

- `packages/cli/src/server.ts`
- `packages/core/src/topologies/team.ts`
- `packages/core/src/context/next-move-prompt.ts`
