---
license: Apache-2.0
name: hsts-planning-scheduling
description: Heuristic search-based temporal planning and scheduling for complex multi-constraint environments
category: Research & Academic
tags:
  - planning
  - scheduling
  - constraint-satisfaction
  - temporal-reasoning
  - space-systems
---

# SKILL.md: HSTS — Integrated Planning & Scheduling

Wisdom from Muscettola's HSTS framework for building intelligent systems that unify planning (what to do) and scheduling (when/how to do it). Activates when designing constraint-based agents, solving resource allocation problems, building robust execution systems, or reasoning about commitment under uncertainty.

## DECISION POINTS

### Decision 1: Unified vs. Separated Planning/Scheduling

```
IF domain has resources with time-varying availability
   AND causal goals interact with resource constraints
   AND execution environment is uncertain
   → Use unified state variable approach
   → Model as evolving constraint network

IF problem is purely causal (no resource contention)
   → Classical planning may suffice

IF problem has fixed task structure with only temporal constraints
   → Classical scheduling may suffice

IF you see "planner feeds into scheduler" architecture
   → QUESTION: Is the seam creating coordination debt?
```

### Decision 2: Commitment Level Selection

```
FOR each variable binding decision:
  IF decision is reversible AND more information is coming
    → Post ordering constraint only
    → Example: "A before B" instead of "A at 10:00, B at 11:30"
  
  IF decision resolves high-contention bottleneck (measured via simulation)
    → Commit to specific value now
    → Example: Assign spacecraft antenna to high-priority download
  
  IF tempted to fix exact times early in search
    → STOP: Can ordering relation achieve same progress?
    → Preserve temporal flexibility for executor
```

### Decision 3: Search Focus Priority

```
BEFORE resolving any disjunction:
  1. Run stochastic simulation on current partial solution
  2. Sample 100+ paths without resolving open choices
  3. Count conflicts per resource-time pair
  4. Focus next decision on highest-contention resource

IF search is thrashing (many backtracks, little progress)
  → You're attacking non-bottleneck variables first
  → Re-estimate contention distribution
  → Switch to highest-conflict resource
```

### Decision 4: Domain Modeling Approach

```
IF domain has objects with internal state evolving over time
  → Model each as state variable with transition graph
  → Example: Satellite antenna {idle, tracking, downloading, slewing}

IF domain has shared resources (consumable/reusable)
  → Model resource levels as state variables
  → Track availability windows, not just capacity numbers

IF expert rules exist ("X and Y can't overlap during Z")
  → Encode as compatibility constraints
  → NOT as search pruning hacks
```

## FAILURE MODES

### Anti-Pattern 1: "Nominal Trajectory Planning"
**Detection Rule**: If schedule output is sequence of exact times/actions with no flexibility
**Root Cause**: Confusing schedule with execution plan; over-committing temporal decisions
**Symptom**: Any runtime deviation requires full replanning
**Fix**: Output behavioral envelopes (constraint networks) not nominal sequences
**Timeline**: Becomes critical when execution uncertainty > 5% of plan duration

### Anti-Pattern 2: "Premature Value Commitment"  
**Detection Rule**: If binding variables to specific values before constraints force it
**Root Cause**: Not distinguishing between progress and commitment
**Symptom**: Search space artificially shrunk; solutions exist but aren't found
**Fix**: Post weakest constraint that enables progress; commit only when forced
**Timeline**: Shows up immediately in search statistics (solution quality drops)

### Anti-Pattern 3: "Bottleneck Ignorance"
**Detection Rule**: If resolving disjunctions without measuring which matter most
**Root Cause**: Treating all constraints as equally important
**Symptom**: Search thrashing on easy variables while hard constraints fester
**Fix**: Use stochastic simulation to estimate conflict probability before each decision
**Timeline**: Becomes exponentially worse as problem size grows

### Anti-Pattern 4: "Constraint Network Bloat"
**Detection Rule**: If propagation time grows quadratically with problem size
**Root Cause**: Not respecting module boundaries; monolithic constraint posting
**Symptom**: Solver becomes unusably slow on realistic problems
**Fix**: Decompose into state variable modules; make interaction topology explicit
**Timeline**: Hits performance wall around 50-100 activities

### Anti-Pattern 5: "Expert Knowledge as Hardcoded Heuristics"
**Detection Rule**: If domain knowledge exists as ad-hoc search pruning rules
**Root Cause**: Encoding constraints implicitly instead of declaratively
**Symptom**: Knowledge invisible to debugging; doesn't compose across modules
**Fix**: Express expert rules as formal compatibility constraints with causal semantics
**Timeline**: Maintenance nightmare emerges when domain complexity grows

## WORKED EXAMPLES

### Example 1: Satellite Mission Planning

**Scenario**: Mars orbiter with 2 instruments (camera, spectrometer), 1 antenna, 4 GB storage. Plan 8-hour observation session with data downlink.

**Novice Approach**: 
1. Plan observation sequence first
2. Schedule exact start times  
3. Add downlink at end
*Fails when storage constraint discovered late*

**Expert HSTS Approach**:
1. Model state variables: storage_level, antenna_state, instrument_states
2. Run stochastic simulation: storage fills to 95% probability by hour 3
3. **Decision**: Storage is bottleneck, not antenna time
4. Commit to downlink at hour 3 (value commitment for bottleneck)
5. Leave observation ordering flexible (constraint posting for non-bottleneck)
6. Output: behavioral envelope with storage invariant + flexible observation sequence

**Alternative Path Shown**: If simulation revealed antenna conflicts instead of storage, would commit to antenna schedule first, leave storage management flexible.

### Example 2: Manufacturing Job Shop

**Scenario**: 5 jobs, 3 machines, delivery deadlines. Machine M2 has 50% uptime, others 90%.

**Novice Approach**: Schedule assuming all machines available; handle breakdowns reactively.

**Expert HSTS Approach**:
1. Model machine_availability as time-varying state variable
2. Stochastic simulation: M2 unavailable 40% of time slots
3. **Trade-off Analysis**: 
   - Option A: Route critical jobs around M2 (safer, longer makespan)
   - Option B: Use M2 with backup plans (shorter nominal, replanning risk)
4. **Decision**: Critical path jobs avoid M2; non-critical use M2 with ordering constraints only
5. Output: schedule robust to M2 failures without pessimistic assumption about availability

**What Expert Catches**: M2 unreliability creates secondary bottleneck at other machines when jobs reroute. Plans for cascade effects.

## QUALITY GATES

Schedule is valid and complete when:

- [ ] All state variables have legal transitions throughout timeline
- [ ] No resource oversubscription in any sampled execution path  
- [ ] All goals reachable within temporal flexibility bounds
- [ ] Bottleneck resources identified with >90% confidence via simulation
- [ ] Constraint network admits multiple execution paths (not nominal trajectory)
- [ ] Module interactions explicit and bounded in complexity
- [ ] Search focused on measured conflicts, not assumed priorities
- [ ] Expert domain knowledge encoded as testable compatibility constraints
- [ ] System degrades gracefully under 20% execution deviation
- [ ] Computational cost scales linearly with number of state variables

**Automated Validation Signals**:
- Stochastic simulation runs complete without contradiction
- Constraint propagation converges in bounded time
- Multiple distinct solutions exist in final envelope
- Module coupling metrics within acceptable bounds

## NOT-FOR BOUNDARIES

**This skill should NOT be used for**:
- Pure optimization problems without temporal/resource constraints → Use mathematical programming instead
- Real-time reactive control → Use control theory instead  
- Simple project management with known task durations → Use critical path method instead
- Problems where optimal solution required → Use complete search methods instead
- Domains where expert knowledge unavailable → Use machine learning approaches instead

**Delegation Rules**:
- For route planning: use `path-planning-algorithms` instead
- For resource allocation without time: use `constraint-satisfaction-methods` instead  
- For predictive analytics: use `time-series-forecasting` instead
- For execution monitoring: use `plan-execution-monitoring` instead

**Boundary Signals**: If you're spending more effort encoding the domain than solving instances, consider whether classical OR methods might suffice for your use case.