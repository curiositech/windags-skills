---
license: Apache-2.0
name: cooperative-vibe-coding
description: |
  Cooperative vibe coding across machines — real-time collaborative development with humans and AI agents. Covers current tools (Live Share, Code With Me, Zed, Cursor multiplayer, tmux), git-based async patterns, AI agent coordination, and the aspirational future of multi-human multi-agent development. Activate on: "pair programming", "vibe coding together", "collaborative coding", "mob programming", "remote pairing", "code together", "multiplayer coding", "Live Share", "Code With Me", "ensemble programming", "cooperative development". NOT for: building a real-time collaboration ENGINE (use real-time-collaboration-engine), git workflow mechanics (use git-best-practices), single-user AI coding assistance (use prompt-engineer).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Development Workflow & Collaboration
  tags:
    - collaboration
    - pair-programming
    - vibe-coding
    - multiplayer
    - remote
    - live-share
    - cooperative
    - agents
    - mob-programming
    - ensemble
  pairs-with:
    - skill: multi-agent-coordination
      reason: Agents as collaborative participants, not just tools
    - skill: git-best-practices
      reason: Git is the coordination layer for async collaboration
    - skill: real-time-collaboration-engine
      reason: The technical infrastructure (CRDTs/OT) enabling real-time editing
    - skill: ipc-communication-patterns
      reason: How machines communicate during collaborative sessions
    - skill: always-on-agent-architecture
      reason: Persistent agents as always-available pair programming partners
category: Code Quality & Testing
tags:
  - pair-programming
  - collaboration
  - vibe-coding
  - workflow
  - methodology
---

# Cooperative Vibe Coding

Cooperative vibe coding scales Andrej Karpathy's "vibe coding" to multiple humans and AI agents working on the same codebase simultaneously across machines. Choose sync vs async collaboration modes based on team constraints and coordinate multiple AI agents without conflicts.

## DECISION POINTS

### 1. Sync vs Async Mode Selection

**Team Size ≤ 2, Same Timezone:**
- If high-complexity/unfamiliar code → Real-time collaboration (Live Share/Zed)
- If independent features → Parallel worktrees + 30min sync points
- If production-critical → True pair programming with shared screen

**Team Size 3-5, Mixed Timezones:**
- If <4hr overlap → Async: PR-based with detailed commit messages
- If 4-6hr overlap → Hybrid: 2hr sync blocks + async handoffs
- If >6hr overlap → Mob programming with 10min rotations

**Team Size >5:**
- Always async with clear ownership boundaries
- Use AI agents for parallelization, humans for coordination

### 2. AI Agent Coordination Strategy

**Single Feature, Multiple Devs:**
```
If feature can split cleanly:
  → Each dev gets worktree + dedicated agent
  → File-level claims prevent conflicts
  
If feature is intertwined:
  → One shared agent, multiple human reviewers
  → Driver controls agent, navigator reviews output
```

**Multiple Features, Multiple Agents:**
```
If features share interfaces:
  → Designate interface owner, others depend on them
  → Sync interface changes before implementing
  
If features are independent:
  → Full isolation via worktrees/branches
  → Integration branch for final merge
```

### 3. Tool Selection Matrix

| Scenario | Primary Tool | Voice | Why |
|----------|--------------|-------|-----|
| 2 devs, Windows+Mac, <2hr session | VS Code Live Share | Discord/Zoom | Universal compatibility |
| 2-4 devs, all Mac/Linux, >2hr | Zed | Built-in | Lowest latency, native voice |
| Terminal-heavy workflow | tmux/SSH | External | Zero editor lag |
| Cross-timezone async | Git + Loom | Async video | Time-shifted collaboration |
| AI-heavy session | Cursor/Claude Code | External | AI-native editors |

## FAILURE MODES

### "Merge Conflict Hell"
**Symptoms:** Integration takes longer than development, constant git conflicts, agents overwriting each other
**Diagnosis:** No file-level coordination, sync points too infrequent (>45min), overlapping worktree scopes
**Fix:** Implement file claiming (Port Daddy/manual), reduce sync to 25min, use `git worktree` for true isolation

### "Spectator Sport Pairing"  
**Symptoms:** Long silences, one person passive, AI generates everything while humans watch
**Diagnosis:** No active collaboration protocol, unclear driver/navigator roles, agents doing too much
**Fix:** 25min rotation timer, navigator must review AI output aloud, limit agent scope to functions not features

### "Tool Configuration Spiral"
**Symptoms:** 30+ minutes setting up Live Share, audio issues, extension conflicts, "it works on my machine"
**Diagnosis:** Over-optimization for perfect setup vs. practical collaboration
**Fix:** 5-minute setup rule - if tools don't work quickly, fall back to screen share + voice

### "Latency Death Spiral"
**Symptoms:** Frustrated typing, cursor lag >500ms, constant "wait, what did you just do?", productivity drops
**Diagnosis:** Too many concurrent editors, poor network conditions, wrong tool for bandwidth
**Fix:** Check network (ping test), reduce active collaborators to 2-3, switch to screen share if lag persists

### "Context Fragmentation"
**Symptoms:** Frequent "wait, what are we building again?", duplicate work, misaligned implementation approaches
**Diagnosis:** No shared mental model, insufficient sync points, parallel work without coordination
**Fix:** Start each session with 5min goal alignment, document decisions in shared notes, 30min status checks

## WORKED EXAMPLES

### Scenario 1: 4 Devs, 3 Timezones, Authentication Feature

**Setup:** Alice (US West), Bob (US East), Chen (EU), David (Asia). Building JWT auth system with login/logout/refresh endpoints.

**Decision Process:**
- Timezone overlap analysis: Alice+Bob have 8hr overlap, Chen has 4hr with both, David has 2hr with Chen only
- Feature complexity: Auth requires shared types, middleware patterns - moderately intertwined
- Tool selection: Mix of sync and async due to timezone constraints

**Session Structure:**
```bash
# Day 1: Alice + Bob (sync block, 2 hours)
# Set up auth architecture, define interfaces

git checkout -b feature/auth-system
# Create shared types and middleware stubs
# Alice: middleware/auth.ts, Bob: routes/auth.ts
# Sync every 30min, commit WIP to shared branch

# Handoff to Chen (async)
git commit -m "WIP: auth middleware scaffolded, routes stubbed
- AuthMiddleware interface defined in types/auth.ts  
- validateJWT() needs implementation
- TODO: Chen implement token refresh logic in refresh.ts"
```

**Chen's Session (4 hours later):**
```bash
git pull origin feature/auth-system
# Chen works alone with Claude agent
claude "implement JWT refresh token logic, follow patterns in middleware/auth.ts"
# Chen tests, commits with detailed message for David
git commit -m "Refresh token implemented
- Added refreshJWT() to middleware/auth.ts
- Created /auth/refresh endpoint  
- TODO: David add logout cleanup + session management"
```

**Integration Issues Caught:**
- Alice's middleware expected `userId` field, Bob's routes provided `user_id` (snake_case vs camelCase)
- Detected during Chen's session when TypeScript failed
- Fixed by Chen, documented in commit message

**What Novice Would Miss:** No coordination protocol, each dev working in isolation, merge conflicts on shared files, interface mismatches discovered late.

**What Expert Catches:** Clear handoff messages, interface alignment checks, timezone-aware sync points, WIP commits that enable async collaboration.

### Scenario 2: Real-time Debugging Session (Agent Deadlock)

**Setup:** Two devs + two AI agents hit deadlock during real-time collaboration. Both agents trying to modify same function simultaneously.

**Symptoms Detected:**
```bash
# Terminal output shows conflict:
[Claude-A] Modifying src/utils/validation.ts lines 23-45
[Claude-B] Modifying src/utils/validation.ts lines 30-50  
[Git] error: Your local changes would be overwritten by merge
[LiveShare] Conflict in validation.ts
```

**Expert Decision Process:**
1. **Immediate:** Stop both agents (`Ctrl+C` in both terminals)
2. **Diagnose:** Check `git status` and Live Share file locks - both agents claimed overlapping ranges  
3. **Recover:** Alice takes manual control, Bob's agent moves to different file
4. **Prevent:** Implement file-level agent claiming going forward

**Recovery Sequence:**
```bash
# Alice (taking control)
git stash  # Save Claude-A's work
# Bob 
git checkout HEAD src/utils/validation.ts  # Discard Claude-B's changes

# Coordination
Alice: "I'll finish validation.ts manually, can your agent work on auth.ts instead?"
Bob: "Yes, redirecting Claude to authentication logic"

# Resume with isolation
# Alice: manual coding on validation.ts
# Bob's Claude: working on src/middleware/auth.ts
# Sync point in 25min to review both changes
```

**What Novice Would Miss:** Panic, try to force-merge conflicts, restart entire session, blame tools.

**What Expert Catches:** Quick isolation, manual override of agents, clear communication, prevention protocol for future.

## QUALITY GATES

Before starting any cooperative coding session:

- [ ] **Voice channel established and tested** - can both parties hear clearly without lag?
- [ ] **Work scope defined in 1 sentence** - "We're implementing X feature with Y constraints"  
- [ ] **File ownership mapped** - who/which agent touches which directories/files?
- [ ] **Sync cadence agreed** - every 25min for real-time, daily for async handoffs
- [ ] **AI agent boundaries set** - which agent works where, who reviews output?
- [ ] **Conflict resolution protocol ready** - who breaks ties on technical decisions?

During the session:

- [ ] **Changes committed every 30min max** - no work exists only in memory/unsaved files
- [ ] **Integration tested before handoff** - if async, does the code build/run for next person?
- [ ] **Decision rationale documented** - why did we choose approach X over Y?

After the session:

- [ ] **Deliverable completed or next session scheduled** - no dangling incomplete work
- [ ] **Shared context updated** - README, docs, or team notes reflect what was built

## NOT-FOR BOUNDARIES

**Do NOT use cooperative vibe coding for:**

- **Building collaboration infrastructure itself** - For implementing CRDTs, operational transform, or real-time sync engines → use `real-time-collaboration-engine`
- **Git workflow design decisions** - For branching strategies, PR templates, merge policies → use `git-best-practices`  
- **Solo AI prompt engineering** - For optimizing prompts for single-user coding → use `prompt-engineer`
- **Code review processes** - For establishing review standards and approval workflows → use `code-review-standards`
- **Team onboarding or training** - For teaching junior developers → use dedicated mentorship approaches

**When to delegate instead:**
- Complex merge conflicts involving 5+ files → escalate to git expert or architectural review
- Performance issues with collaboration tools → IT support or tool vendor
- Team communication breakdown → team lead or manager intervention
- Large-scale refactoring across multiple teams → architectural planning session