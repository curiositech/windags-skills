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

### 5. Confidence-Based Presentation
```
IF overall confidence ≥ 0.8:
  → Present as "solid read" with confident language
  
IF confidence 0.6-0.79:
  → Present as "educated guess", show uncertainty
  
IF confidence < 0.6:
  → Halt gate should have fired (failsafe check)
```

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

**Step 4 - Parallel Agents**:
- **Skill Selector**: Matches "audit-session-edge-cases" → `code-review-checklist` (structured audit approach)
- **PreMortem**: Returns "PROCEED" with low-severity risk about potential race conditions

**Decision**: No high risks, proceed with plan

**Step 5 - Final Output**:
```
## Predicted Next Move: Complete JWT Edge Case Audit

**0.85 confidence** | well-structured | ~8 min | ~$0.12

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
- [ ] Output format matches expected PredictedDAG structure for downstream consumption

## Step 7: Execute on Accept

When the user accepts the prediction (via AskUserQuestion or conversationally), **immediately begin executing Wave 0.** Do not wait for further confirmation.

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

### If User Says "Modify"

Ask what to change. Common modifications:
- Swap a skill: "Use security-auditor instead of code-review-checklist for the audit"
- Skip a node: "Don't bother with the exploratory research node"
- Reorder: "Do the tests before the refactor"
- Add a node: "Also run a performance check after the fix"

Apply the modification, re-present the plan briefly, then execute.

### If User Says "Reject"

Ask what they actually want. Their response becomes a user hint — re-run the pipeline from Step 1 with their input as the highest-priority signal.

---

## NOT-FOR Boundaries

**This skill should NOT be used for:**

- **Creating new skills** → Use `skill-creator` or `skill-architect` for skill development
- **Debugging specific technical issues** → Use `fullstack-debugger` for error diagnosis
- **Understanding project architecture** → Use `codebase-cartographer` for structural analysis
- **Making constitutional AI decisions** → Use `windags-avatar` for ethical/constitutional questions
- **Long-term project planning** → This is for "next 30-45 minutes", use roadmap tools for longer horizons
- If user asks "what skills should I create" → Hand off to `skill-architect`