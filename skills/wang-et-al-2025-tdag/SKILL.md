---
license: Apache-2.0
name: wang-et-al-2025-tdag
description: Architectural patterns for building agent systems that dynamically decompose complex tasks, generate specialized subagents just-in-time, and prevent cascading failures through adaptive replanning.
category: Research & Academic
tags:
  - tdag
  - task-decomposition
  - dag
  - llm-agents
  - planning
---

# SKILL: TDAG Dynamic Task Decomposition Framework

**Source**: TDAG: A Multi-Agent Framework based on Dynamic Task Decomposition and Agent Generation (Wang et al.)

**Description**: Architectural patterns for building agent systems that dynamically decompose complex tasks, generate specialized subagents just-in-time, and prevent cascading failures through adaptive replanning.

**Activate when**: Designing multi-agent systems, debugging cascading failures, evaluating complex task performance, managing agent context, or building systems with unpredictable subtask dependencies.

---

## DECISION POINTS

### Architecture Selection Decision Tree

```
IS your task multi-step with >5 sequential dependencies?
├─ NO  → Use single-agent ReAct (sufficient for simple tasks)
└─ YES → Are later steps dependent on earlier outcomes?
    ├─ NO  → Use static Plan-and-Execute (predictable workflow)
    └─ YES → DYNAMIC DECOMPOSITION required
        │
        ├─ Can you enumerate all possible subtask types upfront?
        │   ├─ YES → Pre-defined agent roles OK
        │   └─ NO  → Just-in-time agent generation required
        │
        ├─ Do agents need >20 tools or >10 info sources per subtask?
        │   ├─ NO  → Standard context provision
        │   └─ YES → Subtask-specific context refinement required
        │
        └─ Is task completion rate <40%?
            ├─ NO  → Binary evaluation sufficient
            └─ YES → Fine-grained subtask metrics required
```

### Failure Recovery Strategy Selection

| Failure Type | Detection Signal | Recovery Strategy |
|--------------|------------------|-------------------|
| Cascading Task Failure | Later subtasks fail with "invalid assumption" errors | STOP execution → Reassess from current state → Generate new decomposition |
| LLM Capability Limit | Model explicitly states inability or produces nonsensical output | Retry with simplified subtask OR delegate to human |
| External Info Misalignment | Correct tool used with wrong parameters | Regenerate subtask-specific tool documentation → Retry |
| Invalid State Constraint | Execution proceeds but violates user requirements | Backtrack to last valid state → Add constraint validation |

### Replanning Trigger Conditions

```
TRIGGER immediate replanning IF:
├─ Current subtask output contradicts assumptions in remaining planned subtasks
├─ External API returns unavailable/changed data that invalidates downstream plans
├─ User constraints discovered that weren't captured in original decomposition
├─ Two consecutive subtasks fail with same error type
└─ Execution time exceeds 2x estimated duration (indicates wrong approach)

DO NOT replan IF:
├─ Single subtask fails but downstream tasks remain valid
├─ Minor parameter adjustments can fix current subtask
├─ Failure is due to transient external service issues (retry first)
```

---

## FAILURE MODES

### Rubber Stamp Decomposition
**Detection**: Planning agent generates same 5-7 step template regardless of task specifics
**Symptom**: High Cascading Task Failure rates (>30%) because generic plans don't match actual task constraints
**Root Cause**: Static decomposition treats all tasks in domain as identical structure
**Fix**: Generate decomposition after analyzing current task's unique constraints and dependencies

### Schema Bloat Paralysis
**Detection**: Agents frequently select wrong tools despite having correct capabilities
**Symptom**: External Information Misalignment errors with messages like "used BookingAPI with FlightAPI parameters"
**Root Cause**: Providing all 50+ tools to every agent creates cognitive load in option filtering
**Fix**: Generate subtask-specific tool documentation containing only relevant 3-5 tools with enriched context

### Binary Evaluation Blindness
**Detection**: Two architectures show identical ~30% success rates but vastly different user satisfaction
**Symptom**: Cannot distinguish between "accomplished nothing" vs "completed 8/10 subtasks" failures
**Root Cause**: Pass/fail metrics hide incremental progress on complex tasks
**Fix**: Implement subtask-level completion tracking alongside binary outcomes

### Premature Skill Crystallization
**Detection**: Agent executes cached "successful" approaches that fail in current context
**Symptom**: High confidence execution of invalid solutions because they worked previously
**Root Cause**: Treating real-world skills like deterministic game strategies that work universally
**Fix**: Store skills with rich contextual metadata; validate preconditions before execution

### Agent Role Prison
**Detection**: System frequently hits "no suitable agent for this subtask" errors
**Symptom**: Forcing subtasks into predefined agent roles creates capability gaps
**Root Cause**: Pre-defining agent roles assumes complete knowledge of task space
**Fix**: Generate agents with roles derived from current subtask requirements, not organizational chart

---

## WORKED EXAMPLES

### Example 1: Hotel Booking Decomposition

**Initial Task**: "Book 3-night hotel in Tokyo for family of 4, budget $200/night, near Shibuya, check-in March 15"

**Static Approach (Plan-and-Execute) - FAILS**:
```
Planned Steps:
1. Search hotels near Shibuya
2. Filter by family rooms and budget
3. Select hotel with best rating
4. Book for March 15-18
5. Confirm booking

Execution Reality:
✓ Step 1: Found 15 hotels near Shibuya
✓ Step 2: 3 hotels meet criteria
✗ Step 3: Highest rated hotel selected (Hotel A)
✗ Step 4: Hotel A unavailable March 15-17 (but agent doesn't know this when planning)
✗ Step 5: Booking fails → CASCADE FAILURE
```
**Why it failed**: Steps 4-5 planned assuming Hotel A availability, but selection in Step 3 didn't check availability.

**TDAG Dynamic Approach - SUCCEEDS**:
```
Decompose: "Find available family hotels near Shibuya for March 15-18, budget $200/night"
│
├─ Generate SearchAgent with tools: [HotelSearch, AvailabilityCheck, DistanceCalculate]
├─ Execute: Returns 3 hotels with confirmed March 15-18 availability
├─ Current State: [Hotel X: $180/night available, Hotel Y: $195/night available, Hotel Z: $200/night available]
│
└─ Decompose: "Select optimal hotel from verified available options and complete booking"
    │
    ├─ Generate BookingAgent with tools: [HotelCompare, BookingSubmit, PaymentProcess]  
    ├─ Execute: Selects Hotel Y (best value), completes booking
    └─ Result: SUCCESS - Family room booked, $195/night, 2 blocks from Shibuya station
```

**Key Differences**:
- Static: Step 3 selection without availability check → cascade failure
- Dynamic: Availability verified before selection → no invalid assumptions
- Static: 5 predefined steps → rigid execution
- Dynamic: 2 state-dependent decompositions → adaptive to reality

### Example 2: Research Task with Context Management

**Task**: "Compare carbon footprint of train vs flight for Shanghai-Beijing route, including lifecycle emissions"

**Context Bloat Approach (Universal Agent) - FAILS**:
```
Agent receives full context:
- 50 transportation APIs (flight, train, bus, car, bike, boat)
- 30 emissions databases (lifecycle, operational, per-passenger, freight)
- 40 comparison frameworks (financial, time, comfort, environmental)
- 25 geographic tools (distances, routes, elevation, weather)

Error Pattern:
✗ Selects FlightEmissions API but passes train route parameters
✗ Uses LifecycleCarbon tool with BusTransport data format
✗ Compares per-passenger flight emissions with freight train emissions
```
**Failure Mode**: External Information Misalignment - correct tools, wrong parameters due to cognitive overload.

**TDAG Context Precision - SUCCEEDS**:
```
Decompose: "Gather Shanghai-Beijing transportation options and base emissions data"
│
├─ Generate TransportResearcher with refined tools:
│   - Tools: [ChinaRailAPI, DomesticFlightAPI, RouteDistance] (3 tools only)
│   - Context: "Focus on Shanghai-Beijing corridor, passenger transport only"
├─ Execute: Returns train options (4.5h, 120g CO2/km) and flight options (2h, 180g CO2/km)
├─ Current State: Base transport data confirmed for specific route
│
└─ Decompose: "Calculate lifecycle emissions for confirmed transport options"
    │
    ├─ Generate EmissionsAnalyst with refined tools:
    │   - Tools: [LifecycleTransport, InfrastructureCarbon, FuelUpstream] (3 tools only)
    │   - Context: Pre-populated with Shanghai-Beijing route data, passenger context
    ├─ Execute: Train lifecycle: 140g CO2/km, Flight lifecycle: 250g CO2/km
    └─ Result: SUCCESS - Comprehensive comparison with lifecycle methodology
```

**Trade-off Analysis**:
| Factor | Universal Agent | TDAG Context Precision |
|--------|-----------------|----------------------|
| Tool Selection Errors | High (7/10 attempts) | Low (1/10 attempts) |
| Context Relevance | 20% relevant | 95% relevant |
| Completion Time | 45 minutes (including retries) | 12 minutes |
| Result Accuracy | Partial/inconsistent | Complete/methodologically sound |

---

## QUALITY GATES

Task decomposition is complete when:

- [ ] **Replan Trigger Validation**: Each planned subtask includes explicit conditions that would trigger replanning (availability changes, constraint violations, assumption breaks)
- [ ] **Context Precision Check**: Each subagent receives ≤10 tools and all provided context directly relates to their specific subtask
- [ ] **State Dependency Mapping**: Later subtasks explicitly depend on actual outcomes (not predicted outcomes) of earlier subtasks
- [ ] **Failure Containment Design**: Single subtask failure cannot invalidate more than 1 downstream subtask without triggering decomposition reassessment
- [ ] **Progress Measurement**: System tracks subtask completion rates, not just binary task success, enabling partial progress visibility
- [ ] **Agent Role Justification**: Each generated agent's role and capabilities derive from specific current subtask needs, not generic organizational structure
- [ ] **Cascading Failure Prevention**: No subtask execution proceeds based on assumptions about previous subtasks that haven't been validated against actual results
- [ ] **Dynamic Adaptation Verification**: System demonstrates ability to change planned approach mid-execution when current state differs from initial assumptions
- [ ] **Error Category Classification**: Failures are categorized (CTF, LLM, EIM, ISC) to enable architectural improvement rather than just retry logic
- [ ] **Context Validation**: All information provided to agents has been verified as relevant and current for their immediate decision-making needs

---

## NOT-FOR BOUNDARIES

**Do NOT use TDAG patterns for**:
- **Single-step tasks**: Simple queries, direct API calls, straightforward transformations → Use basic ReAct instead
- **Deterministic workflows**: Code compilation, mathematical computation, rule-based validation → Static planning works fine
- **Real-time systems**: Live trading, autonomous vehicle control, emergency response → Latency of decomposition planning unacceptable
- **Highly stable domains**: Payroll processing, regulatory compliance, established manufacturing → Process optimization more valuable than flexibility
- **Resource-constrained environments**: Edge devices, strict API limits, minimal compute → Multiple agent overhead too expensive

**Delegate to other skills**:
- For **simple tool usage**: Use `function-calling-best-practices` instead
- For **prompt optimization**: Use `prompt-engineering-fundamentals` instead  
- For **single-agent debugging**: Use `llm-reasoning-optimization` instead
- For **deterministic planning**: Use `workflow-automation-patterns` instead
- For **real-time decision making**: Use `streaming-decision-systems` instead

**TDAG is specifically for**: Complex, multi-step tasks with uncertain subtask dependencies where early commitment to plans creates cascading failure risks and where adaptability matters more than execution efficiency.