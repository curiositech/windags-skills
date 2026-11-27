# ADR 0001: Background-agent git discipline

**Status:** Accepted
**Date:** 2026-05-03
**Deciders:** Erich Owens
**Triggering incident:** windags-skills `bb34efa` (2026-05-03)

## Context

The windags-skills repo has multiple agents writing concurrently — sometimes deliberately (skill-creator drafts new skills in the background while a foreground agent edits the MCP server), sometimes accidentally (interactive sessions overlap). On 2026-05-03 a foreground agent had eight files staged for a v2.10.0 release commit. A background `skill-creator` agent finished writing a new skill, ran `git add -A` followed by `git commit` to record its single skill, and swept up all eight staged files into its commit. Its message — "skills: cdn-cache-control-headers (wave-4 grounded)" — described one new directory but the diff covered 1,386 insertions across ten unrelated files. The agent then pushed, so the misleading message landed on origin/main and could not be amended without a force-push to a public branch.

The cost was bounded this time (correct code reached origin under the wrong message; the v2.10.0 tag annotation calls out the mismatch). The next time it happens it could be worse: a background agent could ship half-finished foreground work, or stale foreground work could sweep up a half-finished skill the user did not approve.

The root cause is **`git add -A` (and `git add .`) in agents that share a working tree**. Both commands stage every dirty file the agent did not write, with no way for the agent to know whose work it is taking responsibility for.

## Decision

Background agents that create or modify files in a shared repository MUST follow these rules. The rules are listed in priority order — earlier rules supersede later ones.

### Rule 1 — Repository work runs in a linked Git worktree

Give each repository task a dedicated linked worktree under `~/coding/tmp/` and a feature branch. Verify the worktree root, branch and Git metadata before the first write or after resuming. Git gives each worktree its own checkout and staging index. The agent commits inside its worktree, pushes when authorized, and hands off the branch and validation results to the integration owner.

### Rule 2 — `git add -A` and `git add .` are forbidden in agents

Agents that edit files MUST stage by explicit path: `git add path/to/file1 path/to/file2`. Pattern-based staging (`git add -A`, `git add .`, `git add -u`, `git add ':(glob)**'`) is forbidden because it stages edits beyond the paths the agent owns.

If an agent does not know what paths to stage, that is a symptom — the agent should have tracked its own writes and is missing instrumentation, not entitled to sweep the working tree.

### Rule 3 — Pre-commit dirty-tree check

Before committing, an agent MUST run `git status --porcelain` and verify that every modified-but-unstaged file (`?? ` and ` M ` lines) is one the agent itself produced. If an unfamiliar file appears, the agent MUST abort the commit with a clear message naming the unfamiliar paths. The user (or a coordinator) decides whether the foreign file is in-scope.

A default-on `pre-commit` hook that runs this check belongs in any repo with multiple agents writing to it.

### Rule 4 — Explicit ownership and handoff

Use the host's collaboration channel or the pull request to confirm each agent's branch, expected edit paths, and handoff. Give one owner responsibility for staging, committing, and pushing from each worktree. Resolve overlapping edits during integration after workers report their validation results.

### Rule 5 — Push only what you tagged

If a release tag points to a specific tree, the push command MUST be `git push origin <tag>` and not `git push --follow-tags` or `git push origin <branch>` from an agent that did not generate the branch state. Branches are shared mutable state across agents; tags are content-addressed and safe.

## Consequences

**Positive.** Multi-agent collisions become structurally impossible (Rule 1) or loudly self-reporting (Rules 2 + 3). Commit messages match diffs again. `git log --oneline` becomes a reliable record of intent.

**Negative.** Worktrees cost disk space and add an integration step. Agents need to track their changed paths.

**Migration.** Review any agent prompts and scripts that stage files. Replace bulk staging with explicit owned paths. Apply the same worktree and handoff rules to generated agents.

## Implementation hooks

- **skill-architect SKILL.md** (this repo) carries a "Coordination Discipline" section that points here and a "Background Agent Hygiene" failure-mode entry. Generated subagents inherit the rule as a quality gate.
- **skill-creator subagent** (`skills/skill-architect/agents/skill-creator.md`) carries the rule explicitly in its operating instructions so freshly-spawned skill-drafting agents do not need to discover it.

## Alternatives considered

**Pre-commit hook only, no behavior rules.** Rejected: a hook that rejects commits is a foot-gun for interactive users and easy to `--no-verify` past. The rules need to be in the agent's *prompt*, not just in the repo's hooks.

**File-level locks via flock.** Rejected: the unit of conflict is "the staging area," which is repo-global, not per-file. flock per file does not prevent `git add -A` from picking up unlocked files.

**Force-push amendments.** Rejected: amending public history loses signatures, breaks downstream pulls, and the user has explicitly forbidden force-push to main without authorization.

**No discipline; manually clean up after collisions.** Rejected: the cleanup is destructive (force-push, reset --hard) or imperfect (this ADR is the imperfect path), and the failure mode compounds as agent count grows.
