# Claude Code Runtime

This reference captures the official Claude Code runtime surface that matters when authoring `some_claude_skills`.

## Official docs

- Skills: https://code.claude.com/docs/en/skills
- Subagents: https://code.claude.com/docs/en/sub-agents
- Hooks: https://code.claude.com/docs/en/hooks
- Channels: https://code.claude.com/docs/en/channels
- Desktop scheduled tasks: https://code.claude.com/docs/en/desktop-scheduled-tasks
- Cloud scheduled tasks: https://code.claude.com/docs/en/web-scheduled-tasks

## Discovery and loading

- Skills can live at enterprise, personal, project, and plugin scope.
- Nested `.claude/skills/` directories are auto-discovered when work happens inside matching subdirectories.
- Skills in `--add-dir` directories are also discovered.
- Live skill edits are picked up within a running session once the watched directory already exists.
- `.claude/commands/` still work, but custom commands are effectively skills now.

Loading remains progressive:

- Description metadata is present for discovery.
- `SKILL.md` body loads only when invoked.
- Supporting files are read or executed only when needed.

## Official frontmatter surface

Claude Code supports more top-level fields than this repo allows by default:

- `name`
- `description`
- `when_to_use`
- `argument-hint`
- `disable-model-invocation`
- `user-invocable`
- `allowed-tools`
- `model`
- `effort`
- `context`
- `agent`
- `hooks`
- `paths`
- `shell`

Repo stance:

- Know the full runtime.
- Keep repo copies minimal.
- Promote extra fields only in runtime-export copies or truly runtime-bound skills.

## Naming and description

- `name` may use lowercase letters, numbers, and hyphens only, up to 64 characters.
- Numbers are allowed.
- `description` and `when_to_use` are combined and truncated in the skill listing at 1,536 characters.
- `description` should front-load the actual trigger context.

## Invocation control

- `disable-model-invocation: true` makes the skill user-invoked only.
- `user-invocable: false` hides the skill from the `/` menu while still allowing model invocation.
- `paths` limits automatic loading to matching files.

## String substitution

Supported substitutions:

- `$ARGUMENTS`
- `$ARGUMENTS[N]`
- `$0`, `$1`, ...
- `${CLAUDE_SESSION_ID}`
- `${CLAUDE_SKILL_DIR}`

Use `${CLAUDE_SKILL_DIR}` when bundled scripts or assets must be referenced regardless of the current working directory.

## `!` preprocessing

- Inline `!command` and fenced ````!` blocks run before Claude sees the skill body.
- The command output replaces the preprocessing block in the rendered prompt.
- This is preprocessing, not a normal model tool call.
- Skills can set `shell: powershell`, but that requires `CLAUDE_CODE_USE_POWERSHELL_TOOL=1`.
- Managed or policy-driven environments may disable skill shell execution with `disableSkillShellExecution`.

Use preprocessing only when runtime sampling actually improves the task.

## Lifecycle and compaction

- Invoked skill content remains in the conversation after invocation.
- Claude does not repeatedly re-read the file on later turns.
- After compaction, Claude reattaches the most recent invocation of each skill.
- Up to 5,000 tokens per skill are reattached with a 25,000-token combined budget.

This is why long `SKILL.md` files silently lose tail content in long sessions.

## Hooks

- Skills and subagents can define hooks in frontmatter.
- Hook scope is limited to the lifetime of the active skill or subagent.
- Hooks are for deterministic lifecycle automation, not for compensating for vague instructions.

## Forked skills

- `context: fork` runs a skill as a task prompt in a subagent context.
- The forked subagent does not inherit parent conversation history.
- The `agent` field chooses the executing subagent type.
- If `agent` is omitted, Claude uses `general-purpose`.

Use fork only when isolation or independent reasoning materially helps.

## Subagents with skills

- Subagents can preload skills through a `skills` field.
- Preloaded skill content is injected in full at startup.
- Subagents do not inherit parent-session skills automatically.

## Visual output

Claude Code explicitly supports bundled scripts that generate visual artifacts such as HTML and open them in a browser.

Use this when:

- the artifact is naturally interactive
- visual inspection materially improves review quality
- the rendered view is part of the deliverable

Do not add browser-open artifacts by default.
