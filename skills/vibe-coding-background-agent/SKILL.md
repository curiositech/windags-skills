---
license: Apache-2.0
name: vibe-coding-background-agent
description: |
  Build background AI agents that run alongside developers during vibe coding sessions, proactively helping without being asked. Covers file watcher architecture, event queue design, LLM router for triage, action executors, permission models (silent vs. approval-required), non-intrusive suggestion UX, and editor integration (VS Code, Cursor background agents, Claude Code hooks). Activate on 'background agent', 'vibe coding assistant', 'proactive AI helper', 'file watcher agent', 'ambient coding intelligence', 'background coding agent', 'auto-fix agent'. NOT for: chat-based AI (use prompt-engineer), long-running daemons (use daemon-development), real-time human collaboration (use cooperative-vibe-coding).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: AI & Agents
  tags:
    - background-agent
    - vibe-coding
    - file-watcher
    - proactive-ai
    - ambient-intelligence
    - developer-experience
    - automation
    - event-driven
    - editor-integration
  pairs-with:
    - skill: always-on-agent-architecture
      reason: Background agents are a specialization of always-on agents with IDE-specific lifecycle
    - skill: daemon-development
      reason: The agent process itself is a daemon that needs graceful lifecycle management
    - skill: cooperative-vibe-coding
      reason: Background agents are AI participants in collaborative vibe coding sessions
    - skill: multi-agent-coordination
      reason: Multiple background agents need coordination to avoid conflicts and redundant work
category: Code Quality & Testing
tags:
  - background-agents
  - vibe-coding
  - automation
  - continuous
  - monitoring
---

# Vibe Coding Background Agent

You build AI-powered background agents that observe developer workflow and proactively offer help without breaking flow state. You know the architectural stack: file watchers → event triage → action execution → permission gates → suggestion UX. The north star: **the best background agent is one you forget is there until it saves you 10 minutes.**

## DECISION POINTS

### Event Triage Matrix
```
IF event.type === 'file:saved' AND event.ext === '.ts'
  → run-typecheck (immediate, silent)
  
IF event.type === 'file:saved' AND isTestFile(event.path)
  → run-related-tests (immediate, silent)
  
IF event.type === 'build:error' AND confidence > 0.8
  → suggest-fix (immediate, requires-approval)
  
IF event.type === 'build:error' AND confidence <= 0.8
  → queue-for-batch-analysis (background, silent)
  
IF event.type === 'git:branch-switch'
  → cancel-all-running + prefetch-context (immediate, silent)
  
IF event.type === 'deps:changed' AND has-lockfile
  → generate-types + security-scan (background, notify)
```

### Permission Decision Tree
```
Action has side effects?
├─ NO → silent execution
│   └─ Examples: run-tests, typecheck, fetch-docs, lint-check
└─ YES → Check determinism
    ├─ Deterministic & reversible → notify-after
    │   └─ Examples: auto-format, generate-types
    └─ Non-deterministic OR irreversible → requires-approval
        └─ Examples: suggest-fix, auto-commit, npm-publish
```

### Cost vs Confidence Matrix
```
                    CONFIDENCE
           Low (<0.6)        High (>0.8)
Cost  Low  | queue-batch   | execute-immediate  |
      High | require-human | execute-with-notify |
```

### Suggestion Timing
```
IF keystroke-rate > 60/min → queue-suggestions
IF idle-time > 5s AND queue-length > 0 → flush-queue
IF context-switch (file-open, branch-switch) → immediate-delivery
IF flow-state (typing-streak > 2min) → defer-non-critical
```

## FAILURE MODES

### Race Condition Cascade
- **Symptoms**: Multiple actions running on same file, conflicting outputs, test flake
- **Detection Rule**: If 2+ actions with same dedupeKey within 1s, you've hit this
- **Fix**: Implement proper debouncing with awaitWriteFinish: {stabilityThreshold: 200}

### Permission Creep
- **Symptoms**: Agent asking approval for everything OR doing dangerous things silently
- **Detection Rule**: If approval-rate > 40% OR any git/deploy commands in silent-list, you've hit this
- **Fix**: Review permission policy, move destructive actions to blocked-list

### LLM Cost Explosion  
- **Symptoms**: Monthly bill > $100, agent slower than human, constant API rate limits
- **Detection Rule**: If LLM-calls-per-hour > 50 OR cost-per-session > $2, you've hit this
- **Fix**: Add deterministic rules for 80% of events, hard budget caps with kill-switch

### UI Notification Spam
- **Symptoms**: Developer ignoring all suggestions, dismissal rate > 80%, complaints about interruptions
- **Detection Rule**: If visible-notifications > 3 OR dismissal-rate > 70%, you've hit this
- **Fix**: Reduce to 1 visible notification, batch related items, respect flow-state

### Stale Context Poisoning
- **Symptoms**: Suggestions for old file versions, fixes that don't apply, outdated test failures
- **Detection Rule**: If suggestion-age > 5min OR file-modified after suggestion-created, you've hit this
- **Fix**: TTL all suggestions (5min max), invalidate on file-change events

## WORKED EXAMPLES

### Example 1: Type Generation Pipeline
**Scenario**: Developer saves `schema.prisma` file with new User model

**Event Flow**:
1. File watcher detects `prisma` extension → deterministic rule match
2. Action: `generate-types` (background, notify-after permission)  
3. Execute: `npx prisma generate` with 30s timeout
4. Success → show toast: "Types generated for User model"
5. Background: queue `run-typecheck` to validate generated types
6. If typecheck fails → promote to approval-required suggestion with diff

**Novice Miss**: Would run full test suite, not just type generation
**Expert Catch**: Chains related actions (generate → validate) with proper permission escalation

### Example 2: Test Failure Auto-Triage  
**Scenario**: Developer saves `auth.ts`, 3 tests fail in `auth.test.ts`

**Decision Process**:
1. Event: `file:saved` + `test:failed` within 2s window
2. Confidence analysis:
   - Test failures contain line numbers from saved file → confidence = 0.9
   - Error messages mention recently changed function → confidence = 0.95
3. High confidence → immediate notification tier
4. Show persistent toast: "3 auth tests failed - likely caused by recent changes"
5. Include 1-click action: "Show diff + suggested fixes"

**Trade-offs Navigated**:
- Could run auto-fix (faster) vs suggest-fix (safer) → chose safer due to test failures
- Could show all 3 failures vs batched summary → chose batched to avoid noise
- Could interrupt immediately vs wait for pause → waited 5s for natural pause

### Example 3: Background Context Prefetch
**Scenario**: Developer switches to `feature/payments` branch

**Agent Response**:
1. Git hook fires: `post-checkout` event
2. Cancel all running actions (old context invalid)
3. Background tasks (silent execution):
   - Fetch README and recent commits for branch context  
   - Index new/changed files for semantic search
   - Pre-warm relevant documentation (Stripe API docs based on import analysis)
4. Status bar update: "Context ready for payments feature"
5. If indexing finds potential issues (missing env vars) → queue for next pause

**Context Switch Intelligence**:
- Read-only checkout (git log, file browsing) → minimal activity
- Checkout + immediate editing → full context preparation
- Branch age > 7 days → extra security/dependency scanning

## QUALITY GATES

- [ ] **Debouncing configured**: File watcher uses awaitWriteFinish with 200ms stability threshold
- [ ] **Exclusions in place**: node_modules, .git, dist, build directories excluded from watching  
- [ ] **Permission model explicit**: Every action categorized as silent/notify/approval/blocked
- [ ] **LLM budget enforced**: Hard cap at 50 calls/hour with visible spend tracking
- [ ] **Suggestion TTL active**: All suggestions expire after 5 minutes or file modification
- [ ] **Flow state detection**: Agent queues notifications during active typing (>60 keystrokes/min)
- [ ] **Related-only execution**: Tests run only for files that import/are imported by changed file
- [ ] **Graceful cancellation**: Branch switch or manual cancel kills all background processes
- [ ] **Max 3 visible**: Notification UI limits to 3 concurrent items to prevent banner blindness
- [ ] **Engagement tracking**: Agent logs acceptance/dismissal rates for automatic tuning

## NOT-FOR BOUNDARIES

**This skill is NOT for:**
- Chat-based AI where user explicitly asks questions → use `prompt-engineer` instead
- System daemon deployment with launchd/systemd → use `daemon-development` instead  
- Real-time collaborative editing sessions → use `cooperative-vibe-coding` instead
- Job queue infrastructure like BullMQ or Celery → use `background-job-orchestrator` instead
- Long-running batch processing (>10 min) → use `workflow-orchestration` instead
- Security-critical operations requiring audit trails → use `secure-automation` instead

**Delegate to other skills when:**
- Agent needs to persist state across machine restarts → use `daemon-development`
- Multiple agents need coordination and conflict resolution → use `multi-agent-coordination`
- Background work involves human approval workflows → use `human-in-loop-automation`
- Performance monitoring and alerting required → use `observability-implementation`