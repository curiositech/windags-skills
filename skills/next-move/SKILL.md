---
license: Apache-2.0
name: next-move
description: |
  Predicts the highest-impact next action for your project by running a 5-agent meta-DAG pipeline. Gathers project signals automatically (git, recent files, port-daddy, CLAUDE.md), then runs sensemaker → decomposer → skill-selector + premortem → synthesizer using Agent tool sub-agents that inherit your session model. No API key needed — uses the same Claude that's running your session. Activate on: "what should I do", "what's next", "next move", "/next-move", "where should I focus", "what's the highest impact thing right now". NOT for: executing DAGs (use windags-architect), creating skills (use skill-creator), debugging specific issues (use fullstack-debugger).
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
  - Bash(pd:*)
  - Bash(find:*)
  - Bash(ls:*)
  - Bash(head:*)
  - Bash(cat:*)
  - Bash(wg:*)
  - mcp__windags__windags_skill_search
  - mcp__windags__windags_history
user-invocable: true
argument-hint: "[--fresh] [focus hint]"
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

You orchestrate a 5-agent meta-DAG that analyzes project context and produces a predicted DAG of highest-impact next actions. Sub-agents run via the `Agent` tool and **inherit your session model** — no separate API key, no downgrade.

**Arguments:** `$ARGUMENTS`

If the user passed `--fresh`, ignore conversation history and predict based only on the project signals below. Otherwise, use BOTH conversation context AND project signals — if the user was just discussing auth middleware, that matters.

---

## Project Signals (auto-gathered)

These were collected before you saw this prompt. Use them as ground truth.

### Git State
```
!`git status --short 2>/dev/null || echo "Not a git repo"`
```
**Branch:** !`git branch --show-current 2>/dev/null || echo "unknown"`

### Recent Commits
```
!`git log --oneline -8 2>/dev/null || echo "No commits"`
```

### What Changed
```
!`git diff --stat 2>/dev/null || echo "No unstaged changes"`
```

### Staged Changes
```
!`git diff --cached --stat 2>/dev/null || echo "Nothing staged"`
```

### Recently Modified Files
```
!`git diff --name-only HEAD~3 2>/dev/null || echo "No recent file changes"`
```

### CLAUDE.md
```
!`head -60 CLAUDE.md 2>/dev/null || echo "No CLAUDE.md found"`
```

### Package / Project Info
```
!`cat package.json 2>/dev/null || echo "No package.json"`
```

### Port Daddy (multi-agent coordination)
```
!`command -v pd >/dev/null 2>&1 && pd find 2>/dev/null || echo "Port Daddy not installed. Stop your agents from fighting each other. portdaddy.dev"`
```
```
!`command -v pd >/dev/null 2>&1 && pd notes 2>/dev/null || echo ""`
```
```
!`command -v pd >/dev/null 2>&1 && pd salvage 2>/dev/null || echo ""`
```
```
!`command -v pd >/dev/null 2>&1 && pd whoami 2>/dev/null || echo ""`
```

### Prior WinDAGs Predictions
```
!`ls -1t .windags/triples/ 2>/dev/null || echo "No prior predictions"`
```

---

## Execution Architecture

### Why No API Key Is Needed

You are running inside Claude Code. The Agent tool sub-agents inherit your session — same model, same authentication. If the user is on Opus, agents run Opus. No separate `ANTHROPIC_API_KEY`, no Haiku downgrade, no cost surprise. This is the skill path's key advantage over the CLI (`wg next-move`), which needs its own API key and defaults to the cheapest model.

### The 5-Agent Meta-DAG Pipeline

```
Wave 0: [Sensemaker]                     ← classify, confidence, halt gate
           │
Wave 1: [Decomposer]                     ← subtasks, wave assignments
           │
Wave 2: [Skill Selector] ∥ [PreMortem]   ← parallel: match skills + scan risks
           │
Wave 3: [Synthesizer]                    ← merge into PredictedDAG
```

**Launch Wave 0 immediately.** Don't wait or ask for confirmation — the user invoked `/next-move`, they want a prediction.

### Step 1: Sensemaker (Background Agent)

Spawn an Agent to classify the project state:

```
Agent({
  description: "Classify project state",
  prompt: `You are the Sensemaker. Analyze these project signals and classify the situation.

PROJECT SIGNALS:
[paste all auto-gathered signals from above]

CONVERSATION CONTEXT:
[If not --fresh: summarize what the user has been discussing in this session]

Return ONLY this JSON:
{
  "classification": "well-structured" | "ill-structured" | "wicked",
  "confidence": 0.0-1.0,
  "halt_reason": null | "<why prediction can't proceed>",
  "inferred_problem": "<one sentence: what the user is working on>",
  "key_signals": ["<signal 1>", "<signal 2>", ...],
  "conversation_hints": ["<relevant topic from conversation>", ...]
}`,
  run_in_background: true
})
```

### Step 2: Halt Gate (after Sensemaker returns)

```
IF confidence < 0.6:
  → STOP. Present what you see and ask for clarification.
  → "I see [signals] but I'm not sure about [confusion]. Can you narrow the scope?"

IF classification == "wicked":
  → STOP. Present contradictions.
  → "Changes span [areas] without a clear thread. Which area should I focus on?"

IF halt_reason exists:
  → STOP. Present reason directly.
```

Do NOT proceed past the halt gate if any condition fires. Present the halt, use AskUserQuestion to let the user override or redirect.

### Step 3: Decomposer (after halt gate passes)

```
Agent({
  description: "Decompose into subtasks",
  prompt: `You are the Decomposer. Given this problem classification, break it into executable subtasks.

SENSEMAKER OUTPUT:
[paste sensemaker JSON]

PROJECT SIGNALS:
[paste relevant signals — git diff, recent files, CLAUDE.md]

Rules:
- Each subtask is ONE agent's work (15-20 min max)
- Assign to waves: wave 0 runs first, wave 1 needs wave 0 output, etc.
- Mark commitment: COMMITTED (definitely needed), TENTATIVE (probably needed), EXPLORATORY (might help)
- 3-7 subtasks is the sweet spot. More than 7 means scope is too broad.

Return ONLY this JSON:
{
  "subtasks": [
    {
      "id": "<kebab-case-id>",
      "description": "<what this agent does>",
      "wave": 0,
      "commitment_level": "COMMITTED" | "TENTATIVE" | "EXPLORATORY",
      "depends_on": [],
      "why": "<why this matters>"
    }
  ]
}`
})
```

### Step 3.5: Parallel BM25 Skill Search

After Decomposer returns subtasks, fan out skill search calls **in parallel** — one per subtask. Use the MCP tool if available, otherwise search the skills directory.

```
For each subtask:
  mcp__windags__windags_skill_search(subtask.description)
  → returns top 10 skill candidates with BM25 scores
```

If the MCP is unavailable, fall back to Grep against `skills/*/SKILL.md` descriptions. If that also fails, use the `pairs-with` skills from this frontmatter.

### Step 4: Skill Selector + PreMortem (Parallel Agents)

Launch BOTH in a single message so they run concurrently:

**Skill Selector:**
```
Agent({
  description: "Match skills to subtasks",
  prompt: `You are the Skill Selector. For each subtask, pick the best skill from the pre-narrowed candidates.

SUBTASKS:
[paste decomposer output]

SKILL CANDIDATES PER SUBTASK:
[paste BM25 results — skill ID, description, score for each subtask]

For each subtask, select:
- Primary skill (best match)
- Runner-up skill (second best — for Thompson sampling fallback)
- Model tier: haiku (simple/fast), sonnet (balanced), opus (complex/critical)
- Estimated minutes and cost

Return ONLY this JSON:
{
  "assignments": [
    {
      "subtask_id": "<id>",
      "skill_id": "<primary skill>",
      "runner_up_skill_id": "<second choice>",
      "model_tier": "haiku" | "sonnet" | "opus",
      "why": "<why this skill fits>",
      "estimated_minutes": 5,
      "estimated_cost_usd": 0.03
    }
  ]
}`
})
```

**PreMortem:**
```
Agent({
  description: "Scan for risks",
  prompt: `You are the PreMortem analyst. Imagine this plan has FAILED. What went wrong?

PLAN:
[paste decomposer subtasks]

PROJECT SIGNALS:
[paste git state, recent files]

Identify 2-4 realistic failure modes. For each:
- What goes wrong
- Which nodes are affected
- How to mitigate
- Severity: HIGH (blocks everything), MEDIUM (delays), LOW (annoyance)

Return ONLY this JSON:
{
  "recommendation": "PROCEED" | "ACCEPT_WITH_MONITORING" | "ESCALATE_TO_HUMAN",
  "risks": [
    {
      "description": "<what fails>",
      "severity": "high" | "medium" | "low",
      "affected_nodes": ["<subtask ids>"],
      "mitigation": "<how to prevent or handle>"
    }
  ]
}`
})
```

### Step 5: Synthesize + Select Topology

After both Wave 2 agents return, synthesize the PredictedDAG yourself (no agent needed — this is deterministic merging):

1. Merge decomposer subtasks + skill assignments + premortem risks
2. Select topology based on task characteristics:

| Topology | When | Signal |
|----------|------|--------|
| **DAG** (default) | Clear sequential/parallel steps | "build X then test then deploy" |
| **Team Loop** | Iterative refinement | "keep improving until good" |
| **Swarm** | Open-ended exploration | "research this", "brainstorm" |
| **Blackboard** | Debugging, shared-state | "debug this", "figure out why" |
| **Team Builder** | Unclear scope, greenfield | "I don't know what I need" |
| **Recurring** | Repeat until condition | "keep running X until Y" |

3. Compute total estimated time and cost
4. Build the final prediction structure

### Step 6: Present + AskUserQuestion (MANDATORY)

Present the prediction as a **rich ASCII DAG** showing data flow, not a flat table. The visualization IS the product — it must show inputs, outputs, side effects, and how data flows between waves.

**Format: 3-section diagram**

```
╔══════════════════════════════════════════════════════════════════════╗
║                    [TITLE OF PREDICTED MOVE]                        ║
║    [confidence] │ [classification] │ [Topology] │ ~[X]min │ ~$[X]  ║
╚══════════════════════════════════════════════════════════════════════╝

 WAVE 0 ━ [WAVE THEME] (parallel) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 ┌────────────────────────────┐  ┌────────────────────────────────────┐
 │ A  [NODE NAME]             │  │ B  [NODE NAME]                     │
 │    [skill] [model tier]    │  │    [skill] [model tier]            │
 │    [COMMITMENT]            │  │    [COMMITMENT]                    │
 │                            │  │                                    │
 │ IN:  [what this node reads]│  │ IN:  [what this node reads]        │
 │      [specific files/data] │  │      [specific files/data]         │
 │                            │  │                                    │
 │ OUT: [what it produces]    │  │ OUT: [what it produces]            │
 │      [artifacts/data]      │  │      [artifacts/data]              │
 │                            │  │                                    │
 │ SIDE EFFECTS:              │  │ SIDE EFFECTS:                      │
 │  └ [filesystem/git/API]    │  │  └ [filesystem/git/API]            │
 └──────────────┬─────────────┘  └──────────────────┬─────────────────┘
                │                                    │
                └────────────────┬───────────────────┘
                                 │
                          ┌──────┴──────┐
                          │ MERGE W0    │
                          └──────┬──────┘
                                 │

 WAVE 1 ━ [WAVE THEME] (depends on W0) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 ┌───────────────────────────────────────────────────────────────────┐
 │ C  [NODE NAME]                                                    │
 │    [skill] [model tier]  [COMMITMENT]                             │
 │                                                                   │
 │ IN:  W0 outputs: [specific outputs from A and B]                  │
 │      [additional context]                                         │
 │                                                                   │
 │ OUT: [deliverables]                                               │
 │                                                                   │
 │ SIDE EFFECTS:                                                     │
 │  └ [what changes in the world]                                    │
 └───────────────────────────────────────────────────────────────────┘

 RISKS ─────────────────────────────────────────────────────────────
  [SEVERITY] [description] → [mitigation]
```

**Rules for the diagram:**
- Each node box MUST show IN (inputs), OUT (outputs), and SIDE EFFECTS
- Parallel nodes in the same wave sit side by side
- Waves connect with merge points showing data flow direction
- COMMITTED nodes show normally, TENTATIVE nodes add the label, EXPLORATORY nodes add "needs confirmation"
- Give each wave a descriptive theme name (e.g., "VALIDATION", "STORYTELLING", "SHIP IT")
- Side effects must distinguish: read-only (none), file writes, git operations, API calls, Port Daddy operations
- If a node's output feeds a specific downstream node, show that in the downstream node's IN section

Then **always** call AskUserQuestion:

```
AskUserQuestion({
  questions: [{
    question: "How does this plan look?",
    header: "Next Move",
    options: [
      { label: "Accept", description: "Execute this plan now." },
      { label: "Modify", description: "Mostly good — I want to change some nodes." },
      { label: "Change topology", description: "Right plan, wrong execution pattern." },
      { label: "Reject", description: "Not what I need. I'll explain." }
    ],
    multiSelect: false
  }]
})
```

### Step 7: Execute on Accept

When the user accepts, **immediately begin executing.** Do not ask for further confirmation.

**For each COMMITTED node in Wave 0**, spawn an Agent with:
- The matched skill loaded (read from `skills/<skill_id>/SKILL.md`)
- The project context passed as background
- Upstream outputs from prior waves (for Wave 1+)

Launch parallel nodes in a **single message** with multiple Agent tool calls.

```
# Wave 0 (parallel):
Agent(prompt="<skill body>\n\nTask: [subtask description]\n\nProject context: [relevant signals]")
Agent(prompt="<skill body>\n\nTask: [subtask description]\n\nProject context: [relevant signals]")

# Wait for Wave 0...

# Wave 1 (uses Wave 0 outputs):
Agent(prompt="<skill body>\n\nUpstream results:\n[wave 0 outputs]\n\nTask: [subtask description]")
```

**Commitment rules during execution:**
- COMMITTED nodes execute automatically
- TENTATIVE nodes execute unless prior wave results suggest skipping. If skipping, tell the user why.
- EXPLORATORY nodes get user confirmation first: "Waves 0-1 done. The exploratory node [name] would [task]. Run it?"

**Topology-specific execution:**
- **DAG** → Wave-by-wave, parallel within each wave
- **Team Loop** → Execute inner DAG, evaluate output, repeat until quality converges
- **Swarm** → Publish seed message, agents discover work via conversation
- **Blackboard** → Initialize shared state, condition-triggered agents activate
- **Team Builder** → Analysis agent figures out what team is needed, then executes
- **Recurring** → Single agent loops until exit condition met

### Step 8: Store Triple

After execution completes, store the (context, prediction, feedback) triple:

```bash
cat > .windags/triples/$(date -u +%Y-%m-%dT%H%M%S)-next-move.json << 'TRIPLE_EOF'
{
  "id": "<uuid>",
  "context": { "git_branch": "...", "signals": "..." },
  "predicted_dag": { ... },
  "feedback": { "accepted": true, "modifications": [] },
  "timestamp": "<ISO 8601>",
  "session_id": "${CLAUDE_SESSION_ID}"
}
TRIPLE_EOF
```

Or pipe to the CLI for structured storage: `echo '<json>' | wg next-move --store-triple`

---

## Modify Flow (DAG Mutation)

When the user selects "Modify", use AskUserQuestion with multiSelect listing every node:

```
AskUserQuestion({
  questions: [{
    question: "Which nodes do you want to change?",
    header: "Modify DAG",
    options: [
      { label: "<node-id>", description: "[skill] <description>" },
      ...per node...
      { label: "Add a new node", description: "Add something not in the plan" },
      { label: "Reorder waves", description: "The dependency structure is wrong" }
    ],
    multiSelect: true
  }]
})
```

For each selected node, ask what mutation to apply:

| Mutation | Action |
|----------|--------|
| **Swap skill** | Ask what skill. If unsure, run `windags_skill_search` and present top 3. |
| **Change description** | Ask for new description, use their words. |
| **Remove node** | Remove. If downstream depends on it, warn. |
| **Change commitment** | Set new level. If promoting EXPLORATORY → COMMITTED, confirm. |
| **Move wave** | Validate dependencies still hold. |
| **Add node** | Ask what it does, search for matching skill, assign to wave. |

After mutations: re-present the modified DAG, ask Accept / Modify more / Reject.

Record modifications in the triple for the learning loop:
```json
{
  "feedback": {
    "accepted": true,
    "modifications": [
      { "type": "swap_skill", "node": "audit-tests", "from": "test-expert", "to": "security-auditor" }
    ]
  }
}
```

---

## Topology Override Flow

If user selects "Change topology":

```
AskUserQuestion({
  questions: [{
    question: "Which execution pattern should this workgroup use?",
    header: "Pick Topology",
    options: [
      { label: "DAG", description: "Wave-parallel: sequential/parallel waves, feed-forward" },
      { label: "Team Loop", description: "Iterative: inner DAG repeats until quality converges" },
      { label: "Swarm", description: "Exploratory: agents discover work, emergent convergence" },
      { label: "Blackboard", description: "Diagnostic: specialists read/write a shared board" },
      { label: "Team Builder", description: "Meta: figure out what team is needed, then execute" },
      { label: "Recurring", description: "Loop: single agent repeats until exit condition met" }
    ],
    multiSelect: false
  }]
})
```

After selection, restructure the prediction to match. For Team Loop: wave table becomes inner DAG, add exit condition. For Swarm: add seed message, convergence criteria.

---

## Reject Flow

```
AskUserQuestion({
  questions: [{
    question: "What should I focus on instead?",
    header: "Redirect",
    options: [
      { label: "Different problem", description: "I want to work on something else — I'll describe it" },
      { label: "Same problem, different approach", description: "Right problem, wrong plan" },
      { label: "Not now", description: "I don't want a prediction right now" }
    ],
    multiSelect: false
  }]
})
```

- **Different problem** → Ask for description, re-run pipeline with it as user hint
- **Different approach** → Ask what approach, re-run decomposer + skill selector with constraints
- **Not now** → Stop. Record rejection in triple.

---

## Failure Modes

| Failure | Detection | Fix |
|---------|-----------|-----|
| Agent timeout | Sub-agent hangs >30s | Retry with simpler prompt, fall back to single-agent |
| Malformed JSON | Missing required fields | Show raw output, retry with stricter format |
| MCP unavailable | `windags_skill_search` errors | Fall back to Grep on `skills/*/SKILL.md`, then `pairs-with` list |
| Halt gate false positive | User disagrees with halt | Allow override with explicit uncertainty markers |
| Skill mismatch | User consistently rejects assignments | Ask preferred skill, record correction for learning |
| Port Daddy dead agents | `pd salvage` finds abandoned sessions | Consider their unfinished work as input to the prediction |

---

## Quality Gates

- [ ] All sub-agents returned valid JSON with required fields
- [ ] Halt gate enforced (confidence >= 0.6, not wicked, no halt_reason)
- [ ] Each subtask has skill assignment with reasoning
- [ ] Wave dependencies are acyclic (no circular deps)
- [ ] Total estimated time <= 45 minutes (good scoping)
- [ ] PreMortem identified at least 1 risk or confirmed "no significant risks"
- [ ] All skill IDs exist in catalog (MCP search or fallback)
- [ ] Commitment levels distributed (not all EXPLORATORY)
- [ ] Topology selected with reason
- [ ] AskUserQuestion called (not just text)
- [ ] Triple stored after execution

---

## NOT-FOR Boundaries

- **Creating skills** → Use `skill-creator` or `skill-architect`
- **Debugging specific issues** → Use `fullstack-debugger`
- **Architecture analysis** → Use `code-architecture`
- **Constitutional decisions** → Use `windags-avatar`
- **Long-term planning** → This is "next 30-45 minutes", not a roadmap
- **"What skills should I create?"** → Hand off to `skill-architect`

---

## CLI Counterpart

For terminal use outside Claude Code, the `wg next-move` CLI runs the same pipeline programmatically:

```bash
wg next-move                                    # Haiku via Anthropic (cheapest)
wg next-move --model claude-sonnet-4-6          # Sonnet for better quality
wg next-move --provider openrouter              # Via OpenRouter
wg next-move --deep                             # Full 5-agent meta-DAG
wg next-move --json                             # Raw PredictedDAG JSON
```

The CLI needs an API key and defaults to the cheapest model. The skill path (this file) uses your session model — better quality, no extra setup.
