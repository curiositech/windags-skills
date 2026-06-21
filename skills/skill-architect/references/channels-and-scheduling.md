# Channels and Scheduling

This reference captures the official Claude Code surfaces adjacent to skills that often get confused with skill features.

## Channels

Official docs:

- Skills docs: https://code.claude.com/docs/en/skills
- Channels docs: https://code.claude.com/docs/en/channels

Key facts:

- Channels are research preview.
- They require Claude Code v2.1.80 or later.
- They require claude.ai login; console and API key auth are not supported.
- Team and Enterprise organizations must explicitly enable them.
- A channel is an MCP server that pushes events into an already running local Claude Code session.
- Events only arrive while the session is open.

Use channels when:

- CI, monitoring, or chat systems need to push events into a live session.
- Claude should react in the same local session where files are already open.

Do not model channels as skill frontmatter. Skills may explain how to react to channel events, but the channel itself is a separate integration surface.

## Scheduled tasks

Official docs:

- Desktop scheduled tasks: https://code.claude.com/docs/en/desktop-scheduled-tasks
- Cloud scheduled tasks / routines: https://code.claude.com/docs/en/web-scheduled-tasks

Three scheduling surfaces:

| Surface | Runs on | Local files | Session requirement | Best for |
|---|---|---|---|---|
| Cloud scheduled task | Anthropic cloud | fresh clone only | no open local session | recurring async work while your machine is off |
| Desktop scheduled task | your machine | yes | desktop app open and machine awake | recurring local work with tools and files |
| `/loop` | your machine | yes | current session open | quick polling during an active session |

Important distinctions:

- Cloud tasks can keep running while your machine is off.
- Desktop tasks can run against the live working directory or an isolated worktree.
- `/loop` is session-scoped and not a persistent task system.

Use scheduled-task notes in skill metadata only when the skill is part of a bigger automation pattern. Do not pretend scheduled tasks are native skill frontmatter.
