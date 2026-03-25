---
license: Apache-2.0
name: resource-bounded-planning
description: Frameworks for designing agents that must reason and act under time pressure, limited computational resources, and changing environments — based on Bratman, Israel, and Pollack's foundational BDI architecture
category: Research & Academic
tags:
  - planning
  - resource-bounds
  - anytime-algorithms
  - bounded-rationality
  - agents
---

# SKILL: Resource-Bounded Planning and Reasoning

## Core Purpose
Design and implement agents that balance deliberation depth against execution urgency — making "good enough" decisions under time pressure while maintaining adaptability to change.

## DECISION POINTS

### 1. Commitment Formation Threshold
```
IF: Domain has recurring decisions + Time pressure exists + Information is incomplete
├─ High uncertainty about environment changes
│  └─ Commit to high-level structure only (defer implementation details)
├─ Moderate uncertainty with recurring patterns  
│  └─ Commit to partial plan with 2-3 refinement checkpoints
└─ Low uncertainty with established patterns
   └─ Commit to detailed plan with monitoring triggers

Cost-Benefit Formula: Commit when (Expected_Deliberation_Savings × Recurrence_Rate) > (Revision_Cost × Uncertainty_Factor)
```

### 2. Filter Override Calibration
```
IF: New incompatible option detected
├─ Expected value > Current plan value + (Override_threshold × Deliberation_cost)
│  └─ TRIGGER: Begin costly reconsideration
├─ Expected value > Current plan value but < Override threshold
│  └─ FILTER: Log opportunity but maintain current commitment  
└─ Expected value ≤ Current plan value
   └─ FILTER: Ignore option completely

Target Override Frequency: 10-20% of detected options (adjust threshold accordingly)
```

### 3. Structural Partiality Levels
```
IF: Planning horizon analysis needed
├─ Execution time < 24 hours
│  └─ Specify to action level (full detail required)
├─ Execution time 1-30 days  
│  └─ Specify to task level (keep method flexibility)
├─ Execution time > 30 days
│  └─ Specify to goal level only (maximum adaptability)

Refinement Trigger: When means-end coherence gap blocks next action OR dependency requires specification
```

### 4. Multi-Agent Consistency Checking
```
IF: Agent coordination required
├─ Shared resource conflicts detected
│  └─ Negotiate commitment revision (cost = deliberation + coordination overhead)
├─ Goal conflicts detected but no resource overlap
│  └─ Maintain separate commitments with monitoring
└─ Complementary goals detected
   └─ Establish consistency constraints (shared assumptions + checkpoint synchronization)

Consistency Check Frequency: Every N actions where N = 1/(Coordination_criticality × Change_rate)
```

## FAILURE MODES

### 1. Perpetual Deliberation (Situation 2b/3)
**Detection Rule**: If deliberation time > 2× action time OR override frequency > 30% of options
**Symptoms**: Constantly reconsidering plans, thrashing between options, missing deadlines
**Diagnosis**: Override threshold too low, filter mechanism too weak
**Fix**: Increase override threshold by 20-30%, strengthen filter criteria, set hard deliberation deadlines

### 2. Brittle Automation (Situation 4a)
**Detection Rule**: If plan execution fails due to assumption violations > 2× per planning cycle
**Symptoms**: Missing significant opportunities, executing invalid plans, inflexible to change
**Diagnosis**: Override threshold too high, monitoring inadequate
**Fix**: Decrease override threshold by 15-25%, add assumption monitoring, implement adaptation triggers

### 3. Premature Specification
**Detection Rule**: If plan details change > 40% before execution OR refinement cost > initial planning cost
**Symptoms**: Wasted computation on obsolete details, reduced flexibility, high revision overhead
**Diagnosis**: Committing to unnecessary detail too early
**Fix**: Defer specification until means-end coherence requires OR execution approaches

### 4. Consistency Cascade Failures
**Detection Rule**: If coordination overhead > 25% of productive work time
**Symptoms**: Agents constantly negotiating, inconsistent assumptions across agents, deadlock states
**Diagnosis**: Consistency requirements too strict OR communication protocols inefficient
**Fix**: Relax non-critical consistency constraints, implement local consistency checking, batch coordination updates

### 5. Analysis Paralysis Spiral
**Detection Rule**: If deliberation cost exceeds action value for same decision type > 3 consecutive times
**Symptoms**: Over-analyzing low-stakes decisions, missing action windows, computational resource waste
**Diagnosis**: Treating all decisions as equally important
**Fix**: Implement decision importance classification, set deliberation budgets per decision class, use satisficing for low-stakes choices

## WORKED EXAMPLES

### Example 1: Multi-Agent Resource Allocation Under Time Pressure

**Scenario**: Three AI agents managing a data center during peak load. Agent A (scheduler), Agent B (resource allocator), Agent C (performance monitor). Sudden 300% traffic spike detected.

**Novice Approach**: Each agent recomputes optimal strategy independently
- Result: 45 seconds deliberation, conflicting resource assignments, system degraded

**Expert Application**:

1. **Commitment Formation** (T+2 seconds):
   - Agent A: Commits to "shed 40% low-priority traffic" (high-level only)
   - Agent B: Commits to "reallocate 60% compute to web tier" (defers specific VM assignments)
   - Agent C: Commits to "monitor latency < 200ms threshold" (specific metric, flexible response)

2. **Consistency Check** (T+3 seconds):
   - Shared assumption: Traffic spike temporary (< 30 min)
   - Constraint: No agent action should block others' execution
   - Checkpoint: Reassess at T+10 minutes

3. **Execution with Refinement** (T+4 to T+600):
   - Agent A starts shedding traffic immediately (acts on partial plan)
   - Agent B refines allocation as A's actions free up capacity
   - Agent C detects threshold breach at T+180, triggers coordinated adjustment

4. **Override Decision** (T+300):
   - New option detected: Emergency capacity from partner DC (high value but high deliberation cost)
   - Override threshold analysis: Expected value (300 units) > Current plan (200) + (50 threshold × 40 deliberation cost) = 2200
   - Decision: Filter the option (below threshold), maintain current commitments

**Measurable Outcomes**: 
- System stabilized at T+240 seconds (vs. T+420 with recomputation)
- Override triggered only once (8% of detected options)
- Coordination overhead: 12% of total response time

### Example 2: Hierarchical Task Decomposition in Software Development

**Scenario**: AI coding assistant planning implementation of new feature. Requirements partially specified, 2-week deadline, dependencies uncertain.

**Trade-off Analysis**:

**Option 1**: Fully specify all implementation details upfront
- Pro: Clear execution path
- Con: 80% of details likely to change, high revision cost
- Expected cost: 40 hours planning + 60 hours revision = 100 hours

**Option 2**: Commit only to architecture, defer all implementation
- Pro: Maximum flexibility  
- Con: Cannot parallelize work, means-end coherence gaps block progress
- Expected cost: 10 hours planning + 120 hours sequential implementation = 130 hours

**Expert Choice - Option 3**: Structural partiality with refinement triggers
- Commit immediately: API interface design, data model schema
- Defer: Implementation algorithms, UI details, error handling specifics  
- Refinement triggers: When frontend team needs UI specs (Week 1), when testing reveals performance issues

**Execution**:
1. **T+0**: Form partial plan (4 hours)
   - Commit: RESTful API with 6 endpoints, PostgreSQL schema
   - Defer: Caching strategy, authentication details, frontend components

2. **T+3 days**: First refinement trigger
   - Means-end coherence gap: Frontend blocked on authentication flow
   - Refine: OAuth integration details (2 hours)
   - Still defer: Caching, error handling

3. **T+8 days**: Performance monitoring trigger  
   - Assumption violation: API response time > 500ms
   - Override decision: Deliberation cost (8 hours) vs. Performance value (high) → Trigger override
   - Add: Redis caching layer, refactor 3 endpoints

**Quality Results**:
- Total planning time: 14 hours (vs. 100 or 130)
- Requirements changes handled: 7 (with minimal rework due to deferred details)
- Delivery: On schedule with 95% requirements satisfaction

## QUALITY GATES

**Planning Quality Checklist**:
- [ ] Commitment level explicitly specified (high-level/task-level/action-level)
- [ ] Filter override threshold quantified with cost-benefit formula
- [ ] Structural partiality justified (what deferred and why)
- [ ] Refinement triggers identified with objective criteria
- [ ] Assumption monitoring mechanisms in place
- [ ] Deliberation budget set and tracked
- [ ] Override frequency target established (10-20% baseline)
- [ ] Consistency constraints defined for multi-agent scenarios
- [ ] Failure mode detection rules implemented
- [ ] Plan revision cost estimated and acceptable

**Execution Quality Checklist**:
- [ ] Acting on partial plans while continuing refinement
- [ ] Override decisions documented with threshold calculations
- [ ] Deliberation interruption occurring at deadlines
- [ ] Means-end coherence gaps triggering appropriate refinement
- [ ] Consistency violations detected within 1 cycle
- [ ] Filter mechanism blocking > 70% of incompatible options
- [ ] Revision frequency within expected range for uncertainty level

**Calibration Quality Indicators**:
- [ ] Override frequency 10-20% (if >30%: threshold too low; if <5%: too high)
- [ ] Deliberation cost < 25% of total task time
- [ ] Plan revision frequency matches environmental change rate ±20%
- [ ] Coordination overhead < 20% of productive work time
- [ ] Assumption violations caught before execution failure

## NOT-FOR BOUNDARIES

**This skill is NOT for**:
- **Complete information scenarios**: Use classical decision theory instead
- **Single-shot decisions with unlimited time**: Use optimization algorithms instead  
- **Deterministic environments with fixed requirements**: Use traditional planning instead
- **Systems where deliberation cost is negligible**: Use search-based approaches instead
- **Perfect coordination requirements**: Use centralized control instead

**Delegate to other skills when**:
- **Probabilistic reasoning needed**: Use [bayesian-reasoning] for uncertainty quantification
- **Game-theoretic scenarios**: Use [strategic-interaction] for multi-agent competition
- **Real-time control systems**: Use [control-theory] for continuous feedback loops
- **Knowledge representation**: Use [knowledge-engineering] for complex domain modeling
- **Learning from experience**: Use [reinforcement-learning] for policy improvement over time

**Warning signs you're misapplying this skill**:
- Spending more time on meta-reasoning about planning than on planning itself
- Treating all decisions as equally resource-constrained  
- Applying override mechanisms to deterministic rule-following
- Using structural partiality when complete specification is both possible and stable
- Implementing BDI architecture for single-threaded, batch processing tasks