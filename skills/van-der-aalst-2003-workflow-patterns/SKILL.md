---
license: Apache-2.0
name: van-der-aalst-2003-workflow-patterns
description: Apply the foundational taxonomy of workflow control patterns to evaluate, design, and debug complex coordination systems. Based on the seminal "Workflow Patterns" research establishing pattern-based expressiveness evaluation.
category: Research & Academic
tags:
  - workflow
  - patterns
  - process-modeling
  - orchestration
  - bpm
---

# SKILL: Workflow Patterns - Systematic Coordination Design

## When to Use This Skill

Activate when encountering coordination complexity beyond simple sequential task execution: multi-agent orchestration, parallel processing with synchronization, conditional routing, iterative refinement, or system evaluation for workflow capability.

## Decision Points

### Pattern Selection Tree

**IF** designing coordination structure:

1. **Sequential dependency only?**
   - Yes → Pattern 1: Sequence
   - No → Continue to branching analysis

2. **Multiple parallel branches needed?**
   - All branches required → Pattern 2: AND-split/join
   - Conditional subset → Pattern 6: OR-split (need runtime branch determination)
   - Exactly one branch → Pattern 4: XOR-split/join

3. **Synchronization requirements?**
   - Wait for all branches → AND-join or OR-join
   - First completion wins → Pattern 9: Discriminator
   - N out of M completions → Pattern 8: N-out-of-M-join

4. **Decision timing?**
   - Process determines → XOR-split (internal condition)
   - External event determines → Pattern 16: Deferred choice
   - Runtime data determines → OR-split

5. **Iteration needed?**
   - Fixed structure loop → Use sequence + XOR back-edge
   - Dynamic/arbitrary cycles → Pattern 10: Arbitrary cycles
   - Multiple concurrent instances → Pattern 12: Multiple instances

### System Evaluation Decision Tree

**IF** evaluating orchestration systems:

1. **Map required patterns** → List all coordination structures your domain needs
2. **Test basic patterns** → Sequence, AND-split/join, XOR-split/join (if these fail, stop)
3. **Test advanced branching** → OR-split, discriminator, N-out-of-M (most systems fail here)
4. **Test structural patterns** → Cycles, multiple instances, implicit termination
5. **Test interactions** → Combine patterns your workflow uses together
6. **Measure complexity** → >10x workaround complexity = unsupported

**Decision criteria:**
- Natural implementation = supported
- Workaround required = capability gap
- External code needed = wrong architecture
- Race conditions appear = semantic mismatch

## Failure Modes

### 1. OR-Split Confusion (Symptom: Wrong branches activate)
**Detection**: OR-split activates all branches instead of runtime-determined subset, or requires manual branch selection
**Root cause**: System conflates OR-split with AND-split or lacks runtime evaluation capability
**Fix**: Implement true OR-split with condition evaluation at runtime, or redesign using multiple XOR-splits

### 2. Discriminator Race Conditions (Symptom: Multiple completions processed)
**Detection**: "First wins" logic processes multiple completions, late arrivals not ignored, state corruption on near-simultaneous finish
**Root cause**: Missing atomic completion detection or lack of proper discriminator semantics
**Fix**: Implement atomic first-completion detection with explicit late-arrival ignoring, use proper discriminator pattern not AND-join

### 3. Deferred Choice Polling (Symptom: Active waiting for external events)
**Detection**: System polls for external conditions instead of event-driven activation, high CPU usage during wait states
**Root cause**: No event-driven external choice mechanism, treating deferred choice as sequence + condition check
**Fix**: Implement event-based deferred choice with proper external stimulus handling, avoid polling-based workarounds

### 4. Cycle Termination Deadlocks (Symptom: Infinite loops or stuck processes)
**Detection**: Workflows with cycles never terminate naturally, require manual intervention, or deadlock on exit conditions
**Root cause**: No implicit termination support or cycle exit condition evaluation
**Fix**: Implement proper cycle semantics with exit conditions, use state-based termination detection

### 5. Pattern Interaction Failures (Symptom: Unexpected behavior when patterns combine)
**Detection**: Individual patterns work but combinations crash, undefined behavior at interaction boundaries
**Root cause**: Ad-hoc pattern implementations without unified execution model
**Fix**: Use systems with formal execution semantics (Petri nets, process algebras) or explicitly test all pattern combinations

## Worked Examples

### Example 1: Multi-Agent Code Review Orchestration

**Scenario**: Code review requiring parallel analysis (security, performance, style) with first-completion wins logic and iterative refinement.

**Pattern identification**:
- AND-split: Parallel agent execution
- Discriminator: First satisfactory review wins
- Arbitrary cycles: Revision loops
- Cancellation: Abort remaining agents when one succeeds

**Decision walkthrough**:
1. **Need parallel branches?** Yes → multiple review agents
2. **All branches required?** No → discriminator pattern (first success wins)
3. **Iteration needed?** Yes → arbitrary cycles for revisions
4. **External events?** Yes → human reviewer can trigger revision

**Expert insight**: DAG-based orchestrators fail here because they cannot express discriminator + cycles combination. Need state machine or Petri net model.

**Novice mistake**: Using AND-join instead of discriminator, causing system to wait for all agents even after first success.

### Example 2: Dynamic Pipeline with Conditional Stages

**Scenario**: Data processing pipeline where downstream stages depend on upstream results and data characteristics determine stage activation.

**Pattern identification**:
- OR-split: Runtime determination of active stages
- OR-join: Synchronize variable number of active branches
- Deferred choice: External quality check determines retry vs. proceed

**Decision walkthrough**:
1. **Branching logic?** Runtime data determines → OR-split
2. **Synchronization?** Must wait for activated branches only → OR-join
3. **Decision timing?** External quality service → deferred choice

**Expert insight**: OR-split/OR-join combination requires the join to know which branches were activated by the split. Many systems lack this state tracking.

**Novice mistake**: Using XOR-split with manual branch tracking instead of true OR-split, losing semantic clarity and introducing bugs.

### Example 3: Competitive Agent Auction with Fallback

**Scenario**: Multiple agents bid on task, first acceptable bid wins, with timeout fallback to direct assignment.

**Pattern identification**:
- AND-split: Parallel agent activation
- Discriminator: First acceptable bid
- Deferred choice: Timeout vs. bid acceptance
- Cancellation region: Abort auction on timeout

**Decision walkthrough**:
1. **Parallel execution?** Yes → AND-split for simultaneous bidding
2. **Completion semantics?** First acceptable → discriminator
3. **External event handling?** Timeout can interrupt → deferred choice
4. **Cleanup needed?** Cancel pending bids → cancellation region

**Expert insight**: This requires discriminator inside deferred choice inside cancellation region. Pattern interaction complexity eliminates most orchestrators.

**Novice mistake**: Manual timeout handling instead of proper deferred choice, creating race conditions between bid acceptance and timeout.

## Quality Gates

- [ ] All required coordination patterns identified and mapped to specific taxonomy entries
- [ ] System evaluation tests actual pattern implementation, not just feature claims  
- [ ] Pattern combinations tested for workflows using multiple patterns together
- [ ] Workaround complexity measured (>10x baseline = unsupported)
- [ ] Decision points explicitly modeled (who/what decides routing at each choice point)
- [ ] Synchronization semantics verified (what triggers join completion)
- [ ] Cancellation boundaries defined with cleanup semantics
- [ ] External event handling mechanisms identified for deferred choice patterns
- [ ] Cycle termination conditions specified for iterative patterns
- [ ] Implementation gaps documented as architecture information (not just limitations)

## NOT-FOR Boundaries

**This skill is NOT for**:
- Data flow design → Use data pipeline patterns instead
- User interface workflows → Use UI state management patterns
- Sequential scripting → Use basic programming constructs
- Database transaction design → Use ACID transaction patterns
- Error handling → Use exception handling patterns
- Performance optimization → Use performance analysis skills
- Domain modeling → Use domain-driven design patterns

**Delegate to other skills**:
- Task logic design → Use domain-specific problem solving skills
- Agent capability design → Use agent architecture skills
- Data transformation → Use data processing pipeline skills
- System monitoring → Use observability and monitoring skills
- Security coordination → Use security architecture patterns

**Boundary indicator**: If you're designing WHAT agents do (task logic), use domain skills. If you're designing HOW agents coordinate (control flow), use this skill.