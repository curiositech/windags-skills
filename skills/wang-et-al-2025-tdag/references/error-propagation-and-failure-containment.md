# Error Propagation and Failure Containment: Architectural Patterns for Robust Agent Systems

## The Cascading Failure Problem

The TDAG paper's error analysis (Table 3) reveals a striking pattern: Plan-and-Execute (P&E) systems suffer Cascading Task Failure (CTF) at an 8× higher rate than dynamic decomposition systems—34.78% vs 4.35% of all errors.

What is CTF? The paper defines it as "The entire task fails due to the failure of intermediate subtasks, often as a result of error propagation" (Section 5.3).

**Example scenario** (reconstructed from paper's domain):

```
Task: Visit 8 attractions across 3 cities in 7 days

Subtask 1: Book Shanghai→Beijing train, July 1 at 14:40
Subtask 2: Visit Great Wall, July 2
Subtask 3: Visit Forbidden City, July 3
Subtask 4: Book Beijing→Xi'an train, July 4
Subtask 5: Visit Terracotta Army, July 5
Subtask 6: Visit City Wall, July 6
Subtask 7: Book Xi'an→Shanghai flight, July 7
Subtask 8: Return to origin, July 7
```

**Static plan behavior** (P&E):
1. Subtask 1 fails: train G2304 at 14:40 is sold out
2. System executes Subtask 2 anyway: "Visit Great Wall July 2"
3. But agent never arrived in Beijing—agent is still in Shanghai
4. Subtask 2 fails due to geographic impossibility
5. Subtasks 3-8 all fail for same reason
6. **Final score: 0/8 subtasks completed**

**Dynamic plan behavior** (TDAG):
1. Subtask 1 fails: train G2304 at 14:40 is sold out
2. System regenerates Subtask 1': "Book Shanghai→Beijing train, July 1, any time"
3. System successfully books 18:25 train (arrives 00:20 July 2)
4. System regenerates Subtask 2': "Visit Great Wall, July 2 afternoon" (not morning—agent arrives late)
5. Subtasks 2'-8 proceed with updated timing
6. **Final score: 7/8 subtasks completed** (only original Subtask 1 failed)

The difference: static plans treat subtask failures as terminal; dynamic plans treat them as opportunities to replan.

## Why Static Decomposition Propagates Errors

Three architectural properties of static decomposition create CTF vulnerability:

### Property 1: Immutable Subtask Dependencies

In static decomposition, subtasks have **preconditions** that reference *intended* states, not *actual* states:

```python
class Subtask:
    preconditions: List[State]  # What SHOULD be true
    actions: List[Action]
    postconditions: List[State]  # What WILL be true if actions succeed
```

Example:
```python
subtask_2 = Subtask(
    preconditions=["agent_location == 'Beijing'",
                   "current_time == '2023-07-02 08:00'"],
    actions=[visit("Great Wall")],
    postconditions=["visited('Great Wall')"]
)
```

When Subtask 1 fails to move agent to Beijing, `preconditions` are false but **Subtask 2 executes anyway** because preconditions are *assertions about the plan*, not *runtime checks*.

**Why execute with false preconditions?** Because in many static systems, there's no precondition validation—subtasks are generated once and assumed to be sequentially valid.

### Property 2: Non-Revisable Decomposition

The paper contrasts static vs. dynamic decomposition:

**Static**: `(t1, t2, ..., tn) = Decompose(T)` — called once at start
**Dynamic**: `t'_i = Update(t_i, r_1, ..., r_{i-1})` — called after each subtask completion

In static systems, the decomposition function is **not invoked during execution**. Once subtasks are generated, the system has no mechanism to change them based on actual outcomes.

This is an **architectural constraint**, not an algorithmic choice. Static systems typically:
1. Have a planning phase (generate subtasks)
2. Have an execution phase (perform subtasks)
3. No feedback loop from execution → planning

Dynamic systems have a different architecture:
1. Planning and execution are **interleaved**
2. Each execution result is an input to next planning step
3. Continuous loop: plan → execute → observe → replan

### Property 3: Failure Semantics Are Binary

When a subtask fails in a static system, the system has limited options:

**Option A: Continue** — execute next subtask, ignoring failure. Leads to CTF when next subtask depends on the failed one.

**Option B: Abort** — stop entire task. This is what P&E often does, explaining why it performs worse than single-agent ReAct (Table 2: P&E = 42.85, ReAct = 43.02).

**Option C: Retry** — repeat the failed subtask. Works if failure is transient (network error), fails if failure is structural (train doesn't exist).

None of these options address the root problem: **the subtask itself may be unachievable and needs replacement**, not retry.

Dynamic systems add:

**Option D: Replan** — revise the subtask based on current state. This is what TDAG does, preventing CTF.

## Failure Containment Strategies

The paper doesn't explicitly describe these as "containment strategies," but they can be extracted from TDAG's design:

### Strategy 1: Checkpointing State After Each Subtask

Algorithm 1, line 6:
```
r_i ← subagent_i.Execute(t_1, ..., t_i, r_1, ..., r_{i-1})
```

Each subtask execution returns a **result** `r_i`, not just success/failure. This result captures:
- What actions were performed
- What state changes occurred
- What constraints were violated
- What resources were consumed

**Example result structure**:
```python
class Result:
    success: bool
    state_changes: Dict[str, Any]  # e.g., {"agent_location": "Shanghai"}
    constraint_violations: List[str]
    attempted_actions: List[Action]
    errors: List[str]
```

This rich result enables intelligent replanning. If Subtask 1 fails to book the 14:40 train but successfully books the 18:25 train, `r_1` captures:
- `success = False` (didn't get the intended train)
- `state_changes = {"departure_time": "18:25", "arrival_time": "00:20"}`
- `errors = ["Train G2304 sold out"]`

The replanner uses this to generate Subtask 2': "Given agent arrives Beijing at 00:20, visit Great Wall starting 09:00 next day."

### Strategy 2: Stateless Subtask Specifications

Subtasks should specify **goals**, not **actions assuming prior state**:

**Bad (state-dependent)**:
```python
subtask_2 = "Visit the Great Wall starting at 08:00 on July 2"
```
This assumes agent is in Beijing at 08:00.

**Good (goal-oriented)**:
```python
subtask_2 = "After arriving in Beijing, visit the Great Wall. Allocate 4 hours. Consider attraction opening hours (08:00-17:00)."
```
This states what to achieve, not when/how. The subagent determines when/how based on actual arrival time.

TDAG's dynamic update (Equation 6) transforms subtasks from state-dependent to state-aware:
- Original subtask: goal + assumed preconditions
- Updated subtask: goal + actual preconditions from `r_1...r_{i-1}`

### Strategy 3: Graceful Degradation Metrics

The paper's three-level evaluation (Section 3.3) is also a **specification for graceful degradation**:

**Level 1 (Executability)**: Must have. If subtask produces infeasible actions, it's worthless.
**Level 2 (Constraints)**: Should have. If subtask violates budget/time, it's suboptimal but not useless.
**Level 3 (Efficiency)**: Nice to have. If subtask is inefficient, it's suboptimal but still valuable.

This hierarchy guides replanning decisions:

```python
if subtask_failed(level=1):
    # Must replan—current subtask is infeasible
    replanned_subtask = replan(subtask, relax_constraints=[])
elif subtask_failed(level=2):
    # May replan—current subtask violates requirements
    replanned_subtask = replan(subtask, relax_constraints=["budget", "duration"])
elif subtask_failed(level=3):
    # Optional replan—current subtask is just inefficient
    replanned_subtask = subtask  # Accept suboptimal solution
```

**Containment principle**: Level 1 failures escalate to replanning; Level 2/3 failures are tolerated unless critical.

### Strategy 4: Error Classification Drives Recovery Strategy

Table 3's error taxonomy guides recovery:

**Cascading Task Failure (CTF)**: Indicates broken dependencies → replan entire remaining task sequence
**Commonsense Knowledge Errors (CKE)**: Indicates wrong action selection → retry with better tool documentation
**External Information Misalignment (EIM)**: Indicates hallucination → retry with explicit fact-checking
**Constraint Non-compliance (CNC)**: Indicates optimization failure → retry with constraint emphasis

TDAG reduces CTF dramatically (4.35% vs 34.78%) but doesn't eliminate other error types. This reveals:
- Dynamic decomposition solves *structural* failures (dependencies broken)
- But doesn't inherently solve *semantic* failures (wrong tool use, hallucination, constraint reasoning)

**For WinDAGs**: Different error types need different recovery strategies. Don't use one-size-fits-all retry logic.

## Implementing Failure Containment in DAG Systems

The paper's framework suggests treating tasks as **partially-ordered dependency graphs** rather than linear sequences:

### Traditional Linear Decomposition
```
T → [t1] → [t2] → [t3] → [t4] → [t5]
```
If t2 fails, t3-t5 are blocked.

### Dependency-Aware Decomposition
```
        [t2] → [t4]
       ↗      ↗
[t1] →       
       ↘      ↘
        [t3] → [t5]
```
If t2 fails, t3, t5 can still execute (they don't depend on t2).

**TDAG implicitly does this** through dynamic decomposition: when t_i fails, the replanner generates t'_{i+1} based on which prior subtasks succeeded, not based on the original plan.

**Implementation pattern**:

```python
def execute_task_with_containment(task: Task) -> Tuple[Result, Score]:
    completed_subtasks = []
    failed_subtasks = []
    
    subtasks = decompose(task)
    
    while subtasks:
        # Execute subtasks whose dependencies are met
        ready_subtasks = [st for st in subtasks 
                          if dependencies_met(st, completed_subtasks)]
        
        for st in ready_subtasks:
            result = execute_subtask(st)
            
            if result.success:
                completed_subtasks.append((st, result))
                subtasks.remove(st)
            else:
                # Attempt replanning
                replanned = replan_subtask(st, result, completed_subtasks)
                
                if replanned:
                    subtasks.remove(st)
                    subtasks.append(replanned)
                else:
                    # Replanning failed—mark as permanently failed
                    failed_subtasks.append((st, result))
                    subtasks.remove(st)
                    
                    # Remove dependent subtasks (CTF prevention)
                    blocked = [s for s in subtasks if depends_on(s, st)]
                    subtasks = [s for s in subtasks if s not in blocked]
                    failed_subtasks.extend([(s, "Dependency failed") for s in blocked])
    
    return aggregate_results(completed_subtasks, failed_subtasks)
```

**Key properties**:
1. Subtasks execute when dependencies are met, not in fixed order
2. Failed subtasks trigger replanning, not immediate abortion
3. If replanning fails, only dependent subtasks are blocked (explicit CTF prevention)
4. Independent subtasks continue executing

## When Failure Containment Is Harmful

The paper's results show dynamic decomposition is superior in their domain (travel planning with stochastic availability and tight coupling). But there are domains where failure containment is **counterproductive**:

### Domain 1: Strict Sequential Protocols

Example: Medical treatment protocols where step N must complete successfully before step N+1, and any failure requires expert re-evaluation.

**Why containment is bad**: Continuing after a failed step violates safety protocols. Better to abort and alert human.

### Domain 2: All-or-Nothing Transactions

Example: Financial transfers where partial completion leaves system in inconsistent state.

**Why containment is bad**: Executing independent subtasks after a failure may create partial state that's worse than no state change at all.

### Domain 3: Rapidly Changing Environments

Example: Real-time strategy games where state changes every second.

**Why containment is bad**: By the time replanning completes, the state has changed again. Better to use reactive policies (fast heuristics) than deliberative planning (slow optimization).

**For WinDAGs**: Add task metadata indicating whether containment is appropriate:

```python
class Task:
    allow_partial_completion: bool  # Can subtasks succeed independently?
    allow_replanning: bool          # Can subtasks be revised mid-execution?
    safety_critical: bool            # Must human approve after failures?
```

Use this metadata to select execution strategy: dynamic decomposition with containment vs. static plan with immediate abort.

## The Coordination Cost of Failure Containment

Dynamic decomposition isn't free. The paper's approach requires:

**Coordination overhead**:
- Main agent regenerates subtasks after each execution (Algorithm 1, line 11)
- Subagents must communicate structured results (not just success/failure)
- Skill library queries happen per subtask (Section 4.2.2)

**Latency impact**:
- Replanning takes time: LLM inference for update prompt
- State checkpointing takes time: capturing and serializing results
- Skill retrieval takes time: embedding similarity search

The paper doesn't report execution time, but TDAG likely has **higher latency per task** than ReAct or P&E. The benefit: **higher success rate** (49.08 vs 43.02-44.74).

**Trade-off**: Lower throughput (tasks/hour) for higher quality (score/task).

**When is this trade-off acceptable?**
- High-value tasks where failure is expensive
- Low-frequency tasks where latency doesn't matter
- Debugging/exploration phases where understanding failures is priority

**When is it unacceptable?**
- High-volume, low-value tasks (e.g., batch processing millions of records)
- Real-time tasks with strict latency requirements
- Tasks where partial completion has no value (must be all-or-nothing)

## The Human Coordination Analogy

The paper's multi-agent system mirrors human project management:

**Static planning = Waterfall methodology**:
- Plan entire project upfront
- Execute phases sequentially
- Minimal adaptation to problems

**Dynamic planning = Agile methodology**:
- Plan next sprint based on current progress
- Retrospectives after each sprint inform next sprint
- Continuous adaptation

Waterfall fails on complex, uncertain projects for the same reason static decomposition fails on complex, uncertain tasks: **reality diverges from plans, and the system has no mechanism to adapt**.

Agile succeeds by building adaptation into the process: sprint reviews are *expected*, not exceptional. Similarly, TDAG builds replanning into the architecture: subtask updates are *expected*, not exceptional.

**The principle**: In uncertain domains, **treat replanning as the norm, not the exception**. Design systems that assume plans will need revision, not systems that assume plans will execute as written.

## Summary: Containment as Architectural Philosophy

The TDAG paper's core contribution: demonstrate that **error propagation is not inevitable—it's a consequence of architectural choices**.

Static decomposition creates error propagation by:
- Committing to full plan before execution
- Not validating preconditions at runtime
- Treating failure as unexpected exception

Dynamic decomposition prevents error propagation by:
- Deferring planning decisions until needed
- Validating actual state after each step
- Treating failure as expected event that triggers replanning

**For WinDAGs design**: The question isn't "should we support failure containment?" but "what's our default stance?"

- **Default to static**: Good for well-understood, stable domains. Fast but brittle.
- **Default to dynamic**: Good for novel, uncertain domains. Slow but robust.

The paper suggests for complex real-world tasks (where uncertainty is high and stakes are high), **dynamic should be the default**. The 8× reduction in cascading failures (Table 3) is worth the coordination overhead.