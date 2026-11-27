---
license: Apache-2.0
name: multi-agent-coordination
description: |
  Coordinate agents working in parallel on a shared repository. Use for Git worktree isolation, file ownership, handoffs, shared resource contention, task decomposition, and integration conflicts. NOT for single-agent behavior, infrastructure selection, or DAG topology design.
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: AI & Agents
  tags:
    - multi-agent
    - coordination
    - git-worktree
    - parallel
    - isolation
    - conflict-resolution
    - swarming
    - orchestration
  pairs-with:
    - skill: agentic-infrastructure-2026
      reason: Infrastructure layer that multi-agent coordination runs on top of
    - skill: always-on-agent-architecture
      reason: Always-on agents need coordination when running in parallel
    - skill: agentic-patterns
      reason: Individual agent patterns compose into multi-agent coordination
category: Agent & Orchestration
tags:
  - multi
  - agent
  - coordination
  - git
  - ai
  - dag
---

# Multi-Agent Coordination

You are an expert in coordinating multiple AI agents working simultaneously on shared codebases and projects. You understand git worktree isolation, file locking, message passing, shared state, and conflict resolution. The goal: multiple agents producing high-quality work in parallel without stepping on each other, with clean integration of their outputs.

---

## When to Use

**Use for:**
- Running multiple AI agents in parallel on the same repository
- Designing git worktree isolation strategies for agent sandboxing
- Building file locking and resource coordination systems
- Implementing message passing between concurrent agents
- Resolving merge conflicts from parallel agent work
- Decomposing tasks for optimal parallel agent execution
- Assigning shared service ports, database instances, and provider quotas

**Do NOT use for:**
- Single-agent behavior and tool use (use agentic-patterns)
- Choosing agent frameworks (use agentic-infrastructure-2026)
- Building DAG topologies (use next-move or windags-architect)
- Git basics or branching strategy (use git-best-practices)

---

## The Coordination Problem

When multiple agents work on the same codebase simultaneously, three things go wrong:

1. **File conflicts**: Two agents edit the same file, producing incompatible changes
2. **Resource contention**: Agents compete for ports, API quotas, build tools, test databases
3. **Semantic conflicts**: Agents produce individually correct changes that are collectively broken (e.g., Agent A renames a function, Agent B calls the old name)

The solution is a layered isolation strategy:

```
+-----------------------------------------------+
|          Coordination Layer                    |
|  (task decomposition, dependency awareness)    |
+-----------------------------------------------+
|          Isolation Layer                       |
|  (git worktrees, file locks, port claims)      |
+-----------------------------------------------+
|          Communication Layer                   |
|  (message passing, shared state, events)       |
+-----------------------------------------------+
|          Integration Layer                     |
|  (merge strategy, conflict resolution, tests)  |
+-----------------------------------------------+
```

---

## Git Worktree Isolation

The industry-standard pattern for multi-agent development. Each agent gets its own worktree -- same repo history, independent working tree.

### How It Works

```
main repo (.git)
  |
  +-- worktree-agent-1/  (branch: feat/auth-module)
  |     task: "implement OAuth login"
  |     files: independent working copy
  |
  +-- worktree-agent-2/  (branch: feat/api-tests)
  |     task: "write API integration tests"
  |     files: independent working copy
  |
  +-- worktree-agent-3/  (branch: feat/db-schema)
        task: "design user table migration"
        files: independent working copy
```

### Worktree Lifecycle

```bash
#!/bin/bash
# create-agent-worktree.sh

TASK_ID=$1
BRANCH_NAME="agent/${TASK_ID}"
WORKTREE_DIR="${HOME}/coding/tmp/${TASK_ID}"

# Create branch and worktree from current main
git branch "${BRANCH_NAME}" main
git worktree add "${WORKTREE_DIR}" "${BRANCH_NAME}"

echo "Agent worktree ready at ${WORKTREE_DIR}"
echo "Branch: ${BRANCH_NAME}"
```

```bash
#!/bin/bash
# cleanup-agent-worktree.sh

TASK_ID=$1
BRANCH_NAME="agent/${TASK_ID}"
WORKTREE_DIR="${HOME}/coding/tmp/${TASK_ID}"

# Git refuses removal if the worktree contains uncommitted changes.
git worktree remove "${WORKTREE_DIR}"

# Optionally delete branch after merge
# git branch -d "${BRANCH_NAME}"
```

### Worktree Integration Strategy

```
Phase 1: PARALLEL WORK
  Agent 1 ──work──> commit(s) on branch agent/task-1
  Agent 2 ──work──> commit(s) on branch agent/task-2
  Agent 3 ──work──> commit(s) on branch agent/task-3

Phase 2: SEQUENTIAL MERGE (order matters)
  main ← merge agent/task-1 (no conflicts, clean)
  main ← merge agent/task-2 (possible conflicts with task-1)
  main ← merge agent/task-3 (possible conflicts with task-1+2)

Phase 3: VALIDATION
  Run full test suite on merged main
  If tests fail → identify which merge caused it → fix or revert
```

### Merge Order Optimization

Merge in dependency order, not completion order:

1. Build dependency graph from agent task dependencies
2. Topological sort (dependencies merge first)
3. Within same dependency level, merge the agent with fewest file overlaps first (fewer conflicts)
4. Always run tests after each merge, not just at the end

---

## File Locking and Resource Coordination

### Worktree Ownership and Handoffs

The coordinator gives each concurrent worker a task, linked worktree, feature branch, and expected file scope. Use the current host's collaboration channel or a shared record to publish the assignments, discoveries, and handoff evidence. A file assignment coordinates intent. Git worktrees isolate edits, and the integration owner checks that the resulting branches still compose.

For example, give one worker ownership of the OAuth routes and another ownership of integration tests in a separate worktree. Agree on the middleware interface before either worker edits. At handoff each worker provides its branch, changed paths, validation evidence, and any unresolved dependencies.

### File-Level Locking Strategy

Keep ownership advisory when assignments and isolated worktrees are sufficient. For a non-mergeable shared resource, use an existing lock mechanism with an explicit owner, resource, purpose, and bounded lease. An in-memory map only coordinates participants in the same process. A lock shared between processes requires a common transactional or atomic store.

1. **claim(agentId, paths[])**: Check all paths for existing locks by other agents. If conflicts exist, return them with a suggested resolution. Otherwise, claim all paths atomically.
2. **release(agentId)**: Release locks on completion. After an interruption, verify current ownership and preserve unfinished edits before recovering an expired lease.
3. **Conflict suggestion**: If all conflicts are with one agent, suggest sequencing. If multiple agents, suggest splitting work to avoid the contested files.

---

## Task Decomposition for Parallel Agents

The quality of parallel agent work depends entirely on how you decompose the task.

### The Independence Principle

Maximize independence between agent tasks. The ideal decomposition has:
- **Zero file overlap**: Each agent touches different files
- **Clear interfaces**: Agents agree on function signatures / API contracts upfront
- **Unidirectional dependencies**: Agent B reads Agent A's output, not vice versa

### Decomposition Strategies

```
Strategy 1: BY MODULE (best for feature work)
+--------+  +--------+  +--------+
| Agent 1|  | Agent 2|  | Agent 3|
| Auth   |  | API    |  | UI     |
| Module |  | Routes |  | Pages  |
+--------+  +--------+  +--------+
     Zero file overlap, clean interfaces

Strategy 2: BY LAYER (best for cross-cutting changes)
+--------------------------------------+
| Agent 1: Schema/Types (runs first)   |
+--------------------------------------+
| Agent 2: Backend  | Agent 3: Frontend |
| (after Agent 1)   | (after Agent 1)   |
+--------------------------------------+
     Phase 1 defines contracts, Phase 2 implements in parallel

Strategy 3: BY CONCERN (best for quality/maintenance)
+--------+  +---------+  +--------+
| Agent 1|  | Agent 2 |  | Agent 3|
| Feature|  | Tests   |  | Docs   |
| Code   |  | for feat|  | for feat|
+--------+  +---------+  +--------+
     Feature agent leads, test/doc agents follow

Strategy 4: SCOUT + BUILDERS (best for unknown territory)
+-------------------------------------------+
| Scout Agent: Explore codebase, map files, |
| identify patterns, write plan             |
+-------------------------------------------+
          |  plan output  |
     +----v----+     +----v----+
     | Builder |     | Builder |
     | Agent 1 |     | Agent 2 |
     +---------+     +---------+
```

### The Task Coupling Matrix

Before assigning tasks to parallel agents, build the coupling matrix:

```
              Task A    Task B    Task C    Task D
Task A          -       HIGH      LOW       NONE
Task B        HIGH        -       LOW       NONE
Task C        LOW       LOW        -        HIGH
Task D        NONE      NONE     HIGH         -

Optimal grouping:
  Wave 1: [Task A + Task B] sequential, [Task C + Task D] sequential
  But A/B and C/D can run in parallel because NONE coupling between groups
```

| Coupling Level | File Overlap | Can Parallelize? | Strategy |
|---------------|-------------|-------------------|----------|
| NONE | 0 files shared | Yes, freely | Assign to separate agents |
| LOW | Config/types only | Yes, with contract | Define shared types first |
| HIGH | Core files shared | No | Sequence or merge carefully |
| CRITICAL | Same function | Never | Single agent only |

---

## Message Passing Between Agents

### Event Types

Agents communicate through four event types:

| Event | Purpose | Example |
|-------|---------|---------|
| `discovery` | Share findings that affect other agents | "User model uses soft-delete, not DELETE" |
| `completion` | Signal that work is done and branch is ready | "API types defined on branch agent/user-types" |
| `conflict` | Flag that two agents need the same resource | "Both need to modify src/auth/middleware.ts" |
| `request` | Ask another agent for something | "Need AuthMiddleware type exported before I can proceed" |

### The Shared Context Document

For simpler coordination, agents read/write a shared markdown document (e.g., `.windags/coordination.md`) with four sections: **Active Agents** (who, what task, status, files claimed), **Discoveries** (findings that affect other agents), **Contracts** (agreed function signatures / API interfaces), and **Blocked** (who is waiting on whom). Each agent reads this before starting and updates it as they work.

---

## Conflict Resolution

### Conflict Classification

| Conflict Type | Description | Resolution |
|--------------|-------------|------------|
| **Additive** | Both agents added different things to same file | Keep both, order logically |
| **Semantic** | Conflicting design decisions | Resolver agent evaluates both approaches |
| **Structural** | Same code modified differently (rename vs modify) | Escalate to human review |

### The Resolver Agent Pattern

When merge conflicts are too complex for heuristics, a dedicated resolver agent reviews:

```
Agent 1 output ──┐
                  ├──> Resolver Agent ──> Unified output
Agent 2 output ──┘         |
                           v
                    "Agent 1's auth middleware is correct,
                     but Agent 2's error handling is better.
                     Combining both with Agent 1's structure
                     and Agent 2's try/catch pattern."
```

---

## Real-World Multi-Agent Architectures

| Tool | Isolation | Coordination | Max Agents |
|------|-----------|-------------|------------|
| **Cursor 2.0** | Git worktrees per agent | Background agents, conflict detection | 8 |
| **Claude Code Task** | Isolated context per sub-agent | Parent/child, results summarized back | Unbounded |
| **ccswarm** | Git worktrees + Claude CLI | Template scaffolding, coordinator agent | Configurable |
| **WinDAGs** | ProcessExecutor / WorktreeExecutor | Wave-based (parallel within wave, serial across waves) | Per-wave |

---

## Resource Coordination Beyond Files

### Port Management

Use the operating system's dynamic port allocation when the service supports it and pass the assigned port to its dependent tests. For a service that needs a fixed port, use a distinct setting for each worktree, record the owner and endpoint, and let the service bind that port before sharing it. Handle bind failures by selecting another permitted port. A port scan alone does not reserve anything.

### Database Isolation

```bash
# Each agent gets its own test database
createdb "testdb_agent_${TASK_ID}"

# Run migrations in isolation
DATABASE_URL="postgres://localhost/${TASK_ID}" npx prisma migrate deploy

# Cleanup after agent finishes
dropdb "testdb_agent_${TASK_ID}"
```

### API Quota Coordination

Shared rate limiter across agents: maintain a global token budget, allocate fair shares per agent. When budget is low, each agent gets `remaining / activeAgentCount` tokens. Track per-agent usage to prevent any single agent from starving others.

---

## Anti-Patterns

### Anti-Pattern: Shared Working Directory
**What it looks like**: Multiple agents editing files in the same directory
**Why wrong**: Race conditions, overwritten changes, corrupted state
**Instead**: One worktree per agent, always.

### Anti-Pattern: Optimistic Concurrency Without Merge Strategy
**What it looks like**: "Just let them all work, we'll merge later"
**Why wrong**: Merge conflicts scale quadratically with agent count; 8 agents can produce dozens of conflicts
**Instead**: Decompose tasks to minimize file overlap. Build the coupling matrix first.

### Anti-Pattern: Coordinator Agent Bottleneck
**What it looks like**: One "manager" agent that reviews every decision from every worker agent
**Why wrong**: Serializes all work through one context window, negating parallelism
**Instead**: Coordinator sets contracts upfront, workers execute independently, coordinator reviews only at integration.

### Anti-Pattern: No Dead Agent Detection
**What it looks like**: Agent crashes mid-task, its files stay locked, its worktree sits abandoned
**Why wrong**: Other agents can't claim those files, work stalls
**Instead**: Use a bounded lease or a liveness heartbeat. Check the owner and preserve its worktree before reclaiming an expired resource.

### Anti-Pattern: Ignoring Semantic Conflicts
**What it looks like**: All merges succeed (no git conflicts), but the code is broken
**Why wrong**: Git only detects textual conflicts, not logical ones (renamed function + caller of old name)
**Instead**: Run full test suite after every merge. Semantic conflicts show up as test failures.

---

## Quality Checklist

```
[ ] Task decomposition analyzed for file overlap (coupling matrix)
[ ] Each agent has isolated worktree or sandbox
[ ] File ownership recorded in the current coordination channel
[ ] Resource coordination in place (ports, databases, API quotas)
[ ] Message passing mechanism defined (events, shared doc, or notes)
[ ] Merge order determined by dependency graph
[ ] Conflict resolution strategy chosen (automated + escalation)
[ ] Dead agent detection and salvage process in place
[ ] Full test suite runs after integration merge
[ ] Semantic conflict detection beyond textual merge
[ ] Coordination overhead measured (<20% of total agent time)
[ ] Rollback plan: can revert any single agent's contribution
```

---

**Core insight**: The hardest part of multi-agent coordination is not the git mechanics -- it is decomposing work so that agents are truly independent. Time spent on task decomposition and coupling analysis saves 10x the time you would spend resolving conflicts.

**Use with**: agentic-infrastructure-2026 (framework selection) | agentic-patterns (individual agent behavior) | always-on-agent-architecture (long-running coordinated agents)
