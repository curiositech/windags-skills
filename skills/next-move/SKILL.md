---
license: Apache-2.0
name: next-move
description: |
  Spawns a 5-agent meta-DAG to analyze current project context and produce a predicted DAG of the highest-impact skills to run next. Uses real sub-agent spawning via the Agent tool — each pipeline stage runs as an isolated agent with a focused prompt, feeding structured output forward through the DAG. Activate on: "what should I do", "what's next", "next move", "/next-move", "where should I focus", "what's the highest impact thing right now". NOT for: executing DAGs (use windags-architect), creating skills (use skill-creator), debugging specific issues (use fullstack-debugger).
category: Agent & Orchestration
tags:
  - planning
  - decision-making
  - meta-dag
  - skill-selection
  - context-analysis
  - sub-agents
allowed-tools:
  - Read
  - Grep
  - Glob
  - Agent
  - Bash(git:*)
  - mcp__windags__windags_skill_search
  - mcp__windags__windags_history
user-invocable: true
pairs-with:
  - skill: windags-sensemaker
    reason: Problem classification and halt gate
  - skill: windags-decomposer
    reason: Three-pass decomposition protocol
  - skill: windags-premortem
    reason: Failure pattern scanning
  - skill: task-decomposer
    reason: Breaks recommended moves into executable subtasks
  - skill: skillful-subagent-creator
    reason: Sub-agent prompt design patterns
---

```
 ▌      ▗
▐ ▛▌█▌▚▘▜▘▄▖▛▛▌▛▌▌▌█▌
▞ ▌▌▙▖▞▖▐▖  ▌▌▌▙▌▚▘▙▖
▘
                    ▌ ▘▜ ▜
▌▌▛▘█▌  ▌▌▛▌▌▌▛▘  ▛▘▙▘▌▐ ▐ ▛▘
▙▌▄▌▙▖  ▙▌▙▌▙▌▌   ▄▌▛▖▌▐▖▐▖▄▌
        ▄▌
```

# /next-move

You orchestrate a 5-agent meta-DAG that analyzes project context and produces a predicted DAG of highest-impact next actions. Each pipeline stage runs as an isolated sub-agent via the `Agent` tool with structured JSON flowing forward.

## Execution Architecture: Background Collection + Parallel Search

**The pipeline runs in two layers simultaneously:**

### Layer 1: Background Agents (data collection)
These run immediately via `Agent(run_in_background: true)` so the user isn't waiting:

```
Agent A (background): Context Gathering
  - git status, branch, log, diff
  - CLAUDE.md, package.json
  - CI status (gh), open PRs, open issues
  - skills catalog, project memory
  All 14 signals run in parallel via Promise.all

Agent B (background): Sensemaker
  - Starts as soon as Agent A returns context
  - Classifies problem, sets confidence, checks halt gate
```

### Layer 2: Foreground (ANSI explainer)
While background agents work, immediately print a live status display:

```
Print the /next-move banner, then show:

  Context Gathering  3/14
    [v] git status        8ms
    [v] branch            3ms
    [~] CI status         ...
    [ ] skills catalog
    ...

Update each line as background signals resolve.
When context completes, show:

  Meta-DAG Pipeline
    W0: [~] Sensemaker    ...
    W1: [ ] Decomposer
    ...
```

This ensures the user sees progress immediately — no blank spinner.

### Layer 3: Parallel BM25 Skill Search (after Decomposer)
After the Decomposer outputs subtasks, fan out skill search calls **in parallel** — one per subtask:

```
Decomposer returns 5 subtasks
  ↓
Promise.all([
  windags_skill_search("audit session edge cases"),     → top 10
  windags_skill_search("test refresh handler"),          → top 10
  windags_skill_search("fix race condition in auth"),    → top 10
  windags_skill_search("wire rate limiting"),             → top 10
  windags_skill_search("integration tests"),              → top 10
])
  ↓
Skill Selector LLM receives pre-narrowed candidates (not all 463)
```

This replaces passing the full 463-skill catalog to the LLM. Faster, cheaper, more accurate.

## Decision Points

### 1. Context Quality Assessment
```
IF git status shows no changes AND no CLAUDE.md exists:
  → Skip to halt gate: "Need more project context"

IF conversation mentions specific task AND files are modified:
  → Proceed with task-focused analysis

IF user says "what should I do" AND no recent commits (>24h):
  → Focus on project maintenance and setup tasks

IF modified files span >3 directories:
  → Flag as potentially scattered focus, proceed with caution
```

### 2. Halt Gate Enforcement (After Sensemaker)
```
IF sensemaker confidence < 0.6:
  → STOP, ask user for clarification
  → Present: "I see [signals] but not sure about [confusion]"

IF classification == "wicked":
  → STOP, present contradictions
  → Ask user to narrow scope

IF halt_reason exists:
  → STOP, present reason
  → Example: "Too many simultaneous auth + UI + DB changes"
```

### 3. Skill Selection Strategy (In Parallel with PreMortem)
```
IF subtask involves code review/audit:
  → Prioritize: code-review-checklist, security-auditor, test-gap-analyzer
  
IF subtask involves new feature creation:
  → Prioritize: feature-implementer, api-designer, test-driven-dev
  
IF subtask involves refactoring:
  → Prioritize: refactor-architect, dependency-mapper, test-maintainer
  
IF subtask involves debugging:
  → Redirect to fullstack-debugger (NOT this skill's domain)
```

### 4. Risk Threshold Decision
```
IF premortem returns HIGH severity risks:
  → Include warning in output: "⚠️ High-risk plan"
  → Suggest human review before execution
  
IF premortem recommends ESCALATE_TO_HUMAN:
  → Present analysis but recommend consultation
  
IF estimated time > 45 minutes:
  → Suggest breaking into smaller chunks
```

### 5. Topology Selection

After synthesizing subtasks, select the best execution topology. This determines HOW the workgroup collaborates, not just WHAT they do.

**The 6 topologies:**

| Topology | When to Use | Key Signal |
|----------|------------|------------|
| **DAG** (default) | Clear sequential/parallel steps, build & ship | "build X then test then deploy" |
| **Team Loop** | Iterative refinement, quality convergence | "keep improving until it's good" |
| **Swarm** | Open-ended exploration, multi-perspective | "research this", "brainstorm approaches" |
| **Blackboard** | Debugging, diagnosis, shared-state problems | "debug this", "figure out why X is broken" |
| **Team Builder** | Unclear scope, greenfield, need to figure out the team first | "I don't know what I need", "new project" |
| **Recurring** | Single task repeating until condition met | "keep running X until Y", "monitor Z" |

**Selection logic:**
- Default to DAG unless signals clearly indicate another topology
- If the user specified a topology (via the AskUserQuestion below), always honor their choice
- Include `topology` and `topologyReason` in the PredictedDAG output
- For non-DAG topologies, describe the execution pattern briefly in the presentation

**For Team Loop predictions**, include: how many rounds, what the exit condition is, what inner DAG runs each round.
**For Swarm predictions**, include: what agents subscribe to, what the seed message is, how convergence is detected.
**For Blackboard predictions**, include: what keys are on the board, which agents read/write what.

### 6. Confidence-Based Presentation
```
IF overall confidence ≥ 0.8:
  → Present as "solid read" with confident language

IF confidence 0.6-0.79:
  → Present as "educated guess", show uncertainty

IF confidence < 0.6:
  → Halt gate should have fired (failsafe check)
```

### 7. Present Prediction + AskUserQuestion (MANDATORY)

After synthesizing the PredictedDAG, present it using the markdown format (banner, topology line, wave table, risks, verdict), then **always call AskUserQuestion**. Do not just print "Accept / Modify / Reject" as text — use the actual tool so the user gets interactive options.

**Presentation format** (note the Topology line):

```
## Predicted Next Move: [Title]

**[0.X confidence]** | [type] | **[Topology Name]** | ~[X] min | ~$[X.XX]
[If non-DAG: one sentence explaining the topology choice]

### Execution Plan
[wave table or topology-specific layout]

### Watch Out For
[risks]
```

Then call AskUserQuestion:

```
AskUserQuestion({
  questions: [{
    question: "How does this plan look?",
    header: "Next Move",
    options: [
      {
        label: "Accept",
        description: "Start executing immediately."
      },
      {
        label: "Modify",
        description: "Mostly good — I want to adjust some nodes."
      },
      {
        label: "Change topology",
        description: "Right plan, wrong execution pattern. I'll pick the topology."
      },
      {
        label: "Reject",
        description: "Not what I need. I'll explain what I want."
      }
    ],
    multiSelect: false,
  }]
})
```

When the user responds:
- **Accept** → proceed to Step 8 (execute)
- **Modify** → ask what to change, adjust, re-present briefly, then execute
- **Change topology** → present topology picker (see below), then re-present with new topology
- **Reject** → ask what they want, re-run pipeline with their input as user hint

### Topology Override Flow

If the user selects "Change topology", present:

```
AskUserQuestion({
  questions: [{
    question: "Which execution pattern should this workgroup use?",
    header: "Pick Topology",
    options: [
      { label: "DAG", description: "Wave-parallel: agents in sequential/parallel waves, feed-forward" },
      { label: "Team Loop", description: "Iterative: inner DAG repeats until quality converges" },
      { label: "Swarm", description: "Exploratory: agents discover work via pub/sub, emergent convergence" },
      { label: "Blackboard", description: "Diagnostic: specialists read/write a shared board" },
      { label: "Team Builder", description: "Meta: figure out what team is needed first, then execute" },
      { label: "Recurring", description: "Loop: single agent repeats until exit condition met" },
    ],
    multiSelect: false,
  }]
})
```

After they pick, restructure the prediction to match. For example, switching from DAG to Team Loop means:
- The wave table becomes the inner DAG that repeats
- Add an exit condition (ask the user: "What quality threshold should stop the loop?")
- Add an evaluator skill to judge convergence

Record the topology change in the triple as a modification.

## Failure Modes

### 1. Agent Timeout Cascade
**Detection**: Sub-agent call hangs >30s or returns timeout error
**Diagnosis**: MCP server overload, complex prompt, or Claude Code session limit
**Fix**: 
- Retry with simplified prompt (remove context history)
- Fall back to single-agent analysis if multiple agents timing out
- Present partial results: "Got through sensemaker, decomposer failed"

### 2. Null/Malformed JSON Outputs
**Detection**: Sub-agent returns non-JSON or missing required fields
**Diagnosis**: Prompt injection, context overflow, or model confusion
**Fix**:
- Show raw output to user for debugging
- Retry with stricter prompt format enforcement
- Fall back to manual interpretation if JSON parsing fails repeatedly

### 3. MCP Catalog Unavailable
**Detection**: `windags_skill_search` call returns error or empty results
**Diagnosis**: MCP server not configured or skill catalog not indexed
**Fix**:
- Fall back to hardcoded skill list from frontmatter `pairs-with`
- Warn user: "Using limited skill catalog, consider MCP setup"
- Proceed with degraded skill matching (broader categories)

### 4. Halt Gate False Positives
**Detection**: User disagrees with halt decision, provides override context
**Diagnosis**: Sensemaker too conservative or missed user-specific context
**Fix**:
- Allow user to override: "Proceed anyway? I'll use lower confidence"
- Log override for calibration learning
- Continue with explicit uncertainty markers

### 5. Skill Mismatch Patterns
**Detection**: User consistently rejects/modifies skill assignments
**Diagnosis**: BM25 search returning irrelevant results or selection logic flawed
**Fix**:
- Ask user for preferred skill: "What would you use instead?"
- Record correction for learning signal
- Offer runner-up skill as immediate alternative

## Worked Examples

### Example 1: Auth Refactor in Progress
**Context**: User on `feature/jwt-refresh` branch, 3 modified files in `src/auth/`, conversation mentions "edge cases"

**Step 1 - Context Gathering**:
```bash
git status --short
# M  src/auth/session.ts
# M  src/auth/middleware.ts  
# A  src/auth/refresh-handler.ts
```

**Step 2 - Sensemaker Output**:
```json
{
  "classification": "well-structured",
  "confidence": 0.85,
  "halt_reason": null,
  "inferred_problem": "Complete JWT refresh auth refactor with edge case validation"
}
```

**Decision**: Confidence ≥ 0.6 AND classification != "wicked" → Proceed

**Step 3 - Decomposer Output**:
```json
{
  "subtasks": [
    {
      "id": "audit-session-edge-cases",
      "description": "Review session.ts for token expiry and refresh edge cases",
      "commitment_level": "COMMITTED"
    },
    {
      "id": "test-refresh-handler", 
      "description": "Add comprehensive tests for refresh-handler.ts",
      "commitment_level": "COMMITTED"
    }
  ]
}
```

**Step 3.5 - Parallel BM25 Search** (runs immediately after decomposer):
```
windags_skill_search("Review session.ts for token expiry and refresh edge cases")
  → [code-review-checklist (0.82), security-auditor (0.71), test-automation-expert (0.65), ...]

windags_skill_search("Add comprehensive tests for refresh-handler.ts")
  → [vitest-testing-patterns (0.88), test-automation-expert (0.79), playwright-e2e-tester (0.61), ...]
```
Both searches run in parallel — total time = max(search1, search2), not sum.

**Step 4 - Parallel Agents** (Skill Selector + PreMortem):
- **Skill Selector**: Receives pre-narrowed candidates, picks `code-review-checklist` for audit (was top BM25 hit, confirmed by LLM)
- **PreMortem**: Returns "PROCEED" with low-severity risk about potential race conditions

**Decision**: No high risks, proceed with plan

**Step 5 - Final Output**:
```
## Predicted Next Move: Complete JWT Edge Case Audit

**0.85 confidence** | well-structured | **DAG** | ~8 min | ~$0.12

### Execution Plan
| Wave | Node | Skill | What It Does | Status |
|------|------|-------|--------------|--------|
| 0 | audit-session-edge-cases | `code-review-checklist` | Systematic edge case review of session.ts | LOCKED IN |
| 1 | test-refresh-handler | `test-driven-dev` | Comprehensive test coverage for refresh logic | LOCKED IN |
```

**What novice would miss**: Recognizing the auth context and choosing audit-focused skills over generic code analysis

**What expert catches**: The branch name + file pattern + conversation signals = focused auth work needing validation

### Example 2: Scattered Changes (Halt Gate Trigger)
**Context**: 8 modified files across `frontend/`, `backend/`, `database/`, user says "what should I do"

**Sensemaker Output**:
```json
{
  "classification": "wicked", 
  "confidence": 0.45,
  "halt_reason": "Changes span too many domains without clear connection"
}
```

**Decision**: Classification == "wicked" → HALT

**Output to User**:
```
I see changes across frontend, backend, and database but can't find a coherent thread connecting them. 

**Scattered signals:**
- Frontend: 3 component files modified
- Backend: 2 API routes changed  
- Database: Schema migration pending

**What I need**: Which of these changes are related? Or should we focus on completing one area first?
```

## Quality Gates

- [ ] All 4 sub-agents returned valid JSON with required fields
- [ ] Halt gate was properly enforced (confidence ≥ 0.6, not wicked, no halt_reason)
- [ ] Each subtask has skill assignment with reasoning ("why" field populated)
- [ ] Wave dependencies are logically sound (no circular dependencies)
- [ ] Total estimated time is reasonable (≤ 45 minutes suggests good scoping)
- [ ] PreMortem identified at least 1 risk or returned "no significant risks"
- [ ] All skill IDs exist in catalog (either from MCP search or fallback list)
- [ ] Commitment levels appropriately distributed (not all EXPLORATORY)
- [ ] Cost estimate includes both time and monetary projections
- [ ] Output includes `topology` and `topologyReason` fields
- [ ] Topology choice matches task characteristics (not always defaulting to DAG)
- [ ] AskUserQuestion called with topology override option

## Step 8: Execute on Accept

When the user accepts the prediction (via AskUserQuestion or conversationally), **immediately begin executing.** Do not wait for further confirmation.

**Execution varies by topology:**
- **DAG** → Launch Wave 0 agents in parallel, proceed wave-by-wave
- **Team Loop** → Launch the inner DAG, evaluate output, repeat if not converged
- **Swarm** → Publish seed message, let agents discover and react
- **Blackboard** → Initialize the board, let condition-triggered agents activate
- **Team Builder** → Run analysis, assemble team, then execute with recommended topology
- **Recurring** → Launch the single agent, check exit condition, repeat

### Execution Rules

1. **Wave 0 agents launch immediately.** For each COMMITTED node in Wave 0, spawn an Agent with:
   - The node's `role_description` as the task
   - The matched skill loaded (if available — read from `skills/<skill_id>/SKILL.md`)
   - The project context passed as background
   - The working directory set to the project root

2. **Parallel nodes in the same wave launch in a single message.** Use multiple Agent tool calls in one response so Claude Code runs them concurrently.

3. **Wait for Wave N to complete before launching Wave N+1.** When all Wave 0 agents return, review their outputs, then spawn Wave 1 agents. Pass upstream outputs to downstream agents as context.

4. **TENTATIVE nodes execute unless Wave 0 results suggest skipping.** Check if earlier wave outputs change the picture. If they do, tell the user: "Based on Wave 0 results, I'm skipping [node] because [reason]. Proceeding with [remaining nodes]."

5. **EXPLORATORY nodes get user confirmation before executing.** Present what was learned so far: "Waves 0-1 are done. The exploratory node [name] would [description]. Run it? Or are we good?"

6. **Store the triple after execution completes.** Write the full (context, prediction, feedback) triple to `.windags/triples/` via Bash:
   ```bash
   cat > .windags/triples/$(date -u +%Y-%m-%dT%H%M%S)-<slug>.json << 'EOF'
   { "id": "...", "context": ..., "predicted_dag": ..., "feedback": { "accepted": true, "modifications": [] }, "timestamp": "..." }
   EOF
   ```

### Example: Executing a 3-Wave DAG

After user accepts:

```
# Wave 0 (parallel) — spawn both in a SINGLE message:
Agent(prompt="<skill: code-review-checklist>\n\nAudit src/auth/session.ts for token refresh edge cases...")
Agent(prompt="<skill: test-automation-expert>\n\nReview test coverage for src/auth/refresh-handler.ts...")

# Wait for both to return...

# Wave 1 — uses Wave 0 outputs:
Agent(prompt="<skill: refactoring-surgeon>\n\nBased on the audit findings:\n<wave-0-output>\n\nFix the identified edge cases...")

# Wave 2 (parallel, TENTATIVE) — confirm first:
# "Wave 1 fixed 3 edge cases. The TENTATIVE error-handling node would add retry guards. Run it?"
# If yes:
Agent(prompt="<skill: error-handling-patterns>\n\nAdd retry guards for the token refresh flow...")
```

### If User Says "Modify" — DAG Mutation Flow

First, ask WHICH nodes to modify using AskUserQuestion with multiSelect. List every node from the prediction:

```
AskUserQuestion({
  questions: [{
    question: "Which nodes do you want to change?",
    header: "Modify DAG",
    options: [
      // One option per node in the DAG:
      { label: "audit-test-suite", description: "[test-automation-expert] Audit test suite for flaky patterns" },
      { label: "trace-race-conds", description: "[fullstack-debugger] Trace race conditions in auth middleware" },
      { label: "fix-timing-issues", description: "[refactoring-surgeon] Fix identified timing issues" },
      { label: "Add a new node", description: "I want to add something that's not in the plan" },
      { label: "Reorder waves", description: "The dependency structure is wrong" },
    ],
    multiSelect: true,
  }]
})
```

For each selected node, ask what mutation to apply using AskUserQuestion:

```
AskUserQuestion({
  questions: [{
    question: "What should change about 'audit-test-suite'?",
    header: "Mutate Node",
    options: [
      { label: "Swap skill", description: "Use a different skill for this subtask" },
      { label: "Change description", description: "The task description is wrong — I'll specify" },
      { label: "Remove it", description: "Skip this node entirely" },
      { label: "Change commitment", description: "Make it COMMITTED / TENTATIVE / EXPLORATORY" },
      { label: "Move to different wave", description: "It should run earlier or later" },
    ],
    multiSelect: false,
  }]
})
```

**Mutation types and how to handle them:**

| Mutation | What to do |
|----------|-----------|
| **Swap skill** | Ask: "What skill should handle this instead?" If they name one, use it. If unsure, call `windags_skill_search` with their description and present top 3. |
| **Change description** | Ask: "What should this node do instead?" Use their words as the new `role_description`. |
| **Remove node** | Delete the node. If downstream nodes depend on it, warn: "Node X depends on this. Remove both, or reassign X's dependency?" |
| **Change commitment** | Set the new level. If promoting EXPLORATORY → COMMITTED, confirm: "This will execute automatically. Sure?" |
| **Move to different wave** | Ask which wave. Validate dependencies still hold — a node can't move earlier than its dependencies. |
| **Add new node** | Ask: "What should the new node do?" Call `windags_skill_search` to match a skill. Ask which wave (or auto-assign based on dependencies). |
| **Reorder waves** | Present the current wave structure. Ask what the correct ordering is. Recompute dependencies. |

**After all mutations are applied:**

1. Re-present the modified DAG briefly (just the wave table, not the full banner)
2. Call AskUserQuestion again: "Modified plan ready. Accept / Modify more / Reject"
3. On Accept → execute the modified DAG via Step 7

**Record modifications in the triple:**
```json
{
  "feedback": {
    "accepted": true,
    "modifications": [
      { "type": "swap_skill", "node": "audit-test-suite", "from": "test-automation-expert", "to": "security-auditor" },
      { "type": "remove", "node": "add-retry-guards" }
    ]
  }
}
```

These modification records feed the learning loop — if users consistently swap a skill for a particular subtask type, future predictions should use the preferred skill directly.

### If User Says "Reject"

Ask what they actually want. Call AskUserQuestion:

```
AskUserQuestion({
  questions: [{
    question: "What should I focus on instead?",
    header: "Redirect",
    options: [
      { label: "Different problem", description: "I want to work on something else entirely — I'll describe it" },
      { label: "Same problem, different approach", description: "Right problem, wrong plan — let me explain" },
      { label: "Not now", description: "I don't want a prediction right now" },
    ],
    multiSelect: false,
  }]
})
```

- **Different problem** → Ask for their description, re-run pipeline with it as the user hint
- **Different approach** → Ask what approach they want, re-run decomposer + skill selector with their constraints
- **Not now** → Stop. Record rejection in triple for calibration learning.

---

## NOT-FOR Boundaries

**This skill should NOT be used for:**

- **Creating new skills** → Use `skill-creator` or `skill-architect` for skill development
- **Debugging specific technical issues** → Use `fullstack-debugger` for error diagnosis
- **Understanding project architecture** → Use `codebase-cartographer` for structural analysis
- **Making constitutional AI decisions** → Use `windags-avatar` for ethical/constitutional questions
- **Long-term project planning** → This is for "next 30-45 minutes", use roadmap tools for longer horizons
- If user asks "what skills should I create" → Hand off to `skill-architect`