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

### Rule 1 — Long-running background work runs in a git worktree

Any agent that takes longer than ~10 seconds between "start work" and "commit" MUST do its work in a separate git worktree (`git worktree add ../$repo-$agent-$task`). This makes the work physically incapable of colliding with concurrent foreground edits because the working trees are disjoint. The agent commits inside its worktree, optionally pushes a feature branch, and a human (or a coordinator) merges back to main.

**This is the strong form of the discipline. Prefer it whenever feasible.**

### Rule 2 — `git add -A` and `git add .` are forbidden in agents

Agents that edit files in a shared working tree (CI runners, fleet bots, skill-creators, audit jobs) MUST stage by explicit path: `git add path/to/file1 path/to/file2`. Pattern-based staging (`git add -A`, `git add .`, `git add -u`, `git add ':(glob)**'`) is forbidden because it cannot distinguish "files the agent wrote" from "files a different agent staged five seconds ago."

If an agent does not know what paths to stage, that is a symptom — the agent should have tracked its own writes and is missing instrumentation, not entitled to sweep the working tree.

### Rule 3 — Pre-commit dirty-tree check

Before committing, an agent MUST run `git status --porcelain` and verify that every modified-but-unstaged file (`?? ` and ` M ` lines) is one the agent itself produced. If an unfamiliar file appears, the agent MUST abort the commit with a clear message naming the unfamiliar paths. The user (or a coordinator) decides whether the foreign file is in-scope.

A default-on `pre-commit` hook that runs this check belongs in any repo with multiple agents writing to it.

### Rule 4 — Coordination lock for shared trees

When two agents share a working tree by design (rare; almost always Rule 1 is the better answer), they MUST serialize through a lock keyed on `<repo>:git:write`. Port Daddy's `acquire_lock` is the reference implementation. The lock holder owns the staging area + commit + push for the duration of the lock; everyone else queues. Locks expire after 5 minutes by default — long-running work belongs in a worktree, not under a long-held lock.

### Rule 5 — Push only what you tagged

If a release tag points to a specific tree, the push command MUST be `git push origin <tag>` and not `git push --follow-tags` or `git push origin <branch>` from an agent that did not generate the branch state. Branches are shared mutable state across agents; tags are content-addressed and safe.

## Consequences

**Positive.** Multi-agent collisions become structurally impossible (Rule 1) or loudly self-reporting (Rules 2 + 3). Commit messages match diffs again. `git log --oneline` becomes a reliable record of intent.

**Negative.** Worktrees cost disk space and add a "merge back to main" step. Agents that previously could "just commit" now need a small bookkeeping layer — a list of paths they touched. For one-off interactive sessions this overhead is unwelcome; the rules apply specifically to *background* and *long-running* agent work.

**Migration.** Existing agents in this repo that use `git add -A` are non-compliant: skill-creator (per the triggering incident), any fleet bot under `~/coding/port-daddy/fleet/`, and any wave-grounded research scripts. The skill-architect skill (this repo) ships these rules as part of its definition; agents derived from it inherit the discipline. Agents not derived from it need an audit pass.

## Implementation hooks

- **skill-architect SKILL.md** (this repo) carries a "Coordination Discipline" section that points here and a "Background Agent Hygiene" failure-mode entry. Generated subagents inherit the rule as a quality gate.
- **skill-creator subagent** (`skills/skill-architect/agents/skill-creator.md`) carries the rule explicitly in its operating instructions so freshly-spawned skill-drafting agents do not need to discover it.
- **port-daddy** (separate repo) is the runtime that exposes `acquire_lock` and `coordination_preflight`. Rule 4 depends on it being available; Rule 1 does not.

## Alternatives considered

**Pre-commit hook only, no behavior rules.** Rejected: a hook that rejects commits is a foot-gun for interactive users and easy to `--no-verify` past. The rules need to be in the agent's *prompt*, not just in the repo's hooks.

**File-level locks via flock.** Rejected: the unit of conflict is "the staging area," which is repo-global, not per-file. flock per file does not prevent `git add -A` from picking up unlocked files.

**Force-push amendments.** Rejected: amending public history loses signatures, breaks downstream pulls, and the user has explicitly forbidden force-push to main without authorization.

**No discipline; manually clean up after collisions.** Rejected: the cleanup is destructive (force-push, reset --hard) or imperfect (this ADR is the imperfect path), and the failure mode compounds as agent count grows.
