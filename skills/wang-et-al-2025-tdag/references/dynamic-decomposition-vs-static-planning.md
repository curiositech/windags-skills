# Dynamic Decomposition vs. Static Planning: Why Early Commitment Kills Complex Problem Solving

## The Core Problem with Static Planning

When an intelligent system faces a complex, multi-step task, the intuitive approach is to break it down: decompose the problem into subtasks, assign each to a specialist, execute sequentially. This is the foundation of nearly every task planning system from hierarchical task networks to modern LLM-based agents.

Yet this paper demonstrates a critical failure mode: **static decomposition—deciding all subtasks upfront—creates brittle execution chains where early failures cascade catastrophically through the entire task sequence.**

The TDAG framework shows that in travel planning tasks involving 5-8 interconnected steps across multiple cities, the Plan-and-Execute (P&E) baseline exhibits Cascading Task Failure (CTF) rates of 34.78% compared to just 4.35% for dynamic decomposition—nearly an order of magnitude difference (Table 3). More striking: P&E often *underperforms* even single-agent ReAct approaches, which don't decompose at all, scoring 42.85 versus 43.02 average points.

## What Is Cascading Task Failure?

Consider this scenario from the paper's travel planning domain:

```
Subtask 1: Book train from Shanghai to Beijing, departing 14:40
Subtask 2: Arrive Beijing at 20:30, visit the Great Wall
Subtask 3: Visit Forbidden City
Subtask 4: Return to Shanghai by train
```

In static decomposition, these subtasks are fixed at planning time. If Subtask 1 fails—perhaps the 14:40 train is unavailable—the system has three bad options:

1. **Proceed anyway**: Subtask 2 assumes 20:30 arrival but the agent never boards a train. The plan becomes nonsensical.
2. **Abort entirely**: Throw away Subtasks 2-4 even though visiting the Great Wall tomorrow would work fine.
3. **Retry forever**: Keep attempting the 14:40 train, never considering the 18:25 alternative that would merely delay the Great Wall visit by a few hours.

The paper's error analysis reveals P&E systems predominantly choose option 2—complete abortion—resulting in 0% task completion even when 75% of the work could succeed with minor replanning.

## Dynamic Decomposition: Replanning as First-Class Operation

TDAG's solution is deceptively simple but architecturally profound. Task decomposition is *not* a one-time planning phase but an **ongoing process that updates based on execution results**:

```
t'_i = Update(t_i, r_1, r_2, ..., r_{i-1})
```

Where `t'_i` is the revised i-th subtask and `r_1...r_{i-1}` are the actual results of completed subtasks (Equation 6).

In the train booking example, when Subtask 1 fails, the system doesn't execute Subtask 2 blindly. Instead:

1. **Execution feedback**: "Train G2304 at 14:40 is fully booked"
2. **Dynamic update**: Main agent receives this result and regenerates Subtask 2: "Bob arrives in Beijing by train G2305 at 22:45 on July 8th. Adjust the Beijing itinerary to start the next morning."
3. **Cascade prevention**: Later subtasks remain executable; the Great Wall visit shifts to July 9th morning instead of July 8th evening.

The paper's Algorithm 1 shows this explicitly: after each subtask execution (line 6), the task list is updated (line 11), not just marked complete/incomplete.

## Why This Matters for Agent Orchestration Systems

### 1. Error Containment Boundaries

In static systems, errors have **task-wide scope**—any failure potentially invalidates the entire plan. Dynamic decomposition creates **subtask-scoped errors** with contained blast radius. The system asks: "Given what actually happened in steps 1-3, what should step 4 become?" not "Does step 4 match the original plan?"

For WinDAGs or similar orchestration systems, this suggests:
- **Don't**: Generate complete task graphs upfront with fixed edges
- **Do**: Generate next-subtask proposals after each subtask completes, consuming actual execution traces

### 2. The Replan Decision Is Itself a Coordination Problem

TDAG uses a "main agent" to perform decomposition updates (line 11, Algorithm 1). This is a coordinator role distinct from executors. The coordinator:
- Receives execution results from subagents
- Decides if replanning is needed
- Generates updated subtask specifications
- Routes them to appropriate (possibly new) subagents

This maps to orchestration patterns where:
- **Executors** are skills/agents that perform atomic actions
- **Coordinators** are meta-agents that observe execution traces and revise plans
- **Communication** flows bidirectionally: coordinators send tasks, executors return structured results (not just success/failure)

### 3. Context Management Through Decomposition

The paper notes that single-agent ReAct approaches suffer from "excessive irrelevant contexts" degrading LLM performance. But naive decomposition doesn't solve this—P&E performs worse than ReAct despite using subagents.

The difference: **dynamic decomposition allows context refinement at each step**. When generating Subtask i, the main agent has access to:
- Original task specification
- Actual results r_1 through r_{i-1}
- Environmental state changes caused by those results

This allows generating subtask descriptions that are *contextually precise*—"Bob is now in Beijing at 22:45 on July 8th" vs. the original plan's "Bob should arrive at 20:30." Subagents receive accurate context without needing the full task history.

For multi-agent orchestration:
- Subagents should receive **current state summaries**, not full execution logs
- Coordinators maintain the full history and synthesize it into fresh, accurate context per subtask
- Each subtask description should reflect *reality*, not *original intentions*

## When Static Planning Is Acceptable

The paper's generalization experiments (Section 5.5) show TDAG excels even in "monotonous" tasks like TextCraft (73.5% success vs. ADAPT's 52%). But TextCraft and WebShop don't exhibit the same CTF vulnerability. Why?

**Static planning works when:**

1. **Subtasks are loosely coupled**: Failure in subtask i doesn't invalidate subtask i+1's preconditions
2. **Environment is deterministic**: Executing action A reliably produces state B
3. **Failure recovery is local**: Retrying a subtask eventually succeeds without changing the overall plan

Travel planning violates all three:
- Booking train X at time T1 is a hard precondition for arriving at city Y at time T2
- Ticket availability is stochastic
- If train X is unavailable, no amount of retrying helps; you need a *different plan*

**For WinDAGs skill design**: Classify problems along these dimensions. Use static decomposition for deterministic, loosely-coupled tasks (e.g., "analyze these 10 files" where file order doesn't matter). Reserve dynamic decomposition for tightly-coupled, stochastic workflows (e.g., "debug this system" where each finding changes what to investigate next).

## Implementation Pattern: The Update Mechanism

The paper doesn't detail the Update function's internals, but Section 4.1 implies it's an LLM prompt that:

**Inputs:**
- Original subtask specification t_i
- Execution results r_1...r_{i-1} from previous subtasks
- (Implicitly) the original task T for goal context

**Outputs:**
- Revised subtask t'_i that:
  - Achieves the same *goal* as t_i (visit the Great Wall)
  - Adjusts *constraints* based on reality (start time is now 09:00 not 08:00)
  - Updates *preconditions* (agent is in Beijing Railway Hotel, not at train station)

For orchestration systems, implement this as a **replanning skill** that:

```python
def replan_subtask(
    original_subtask: Task,
    completed_subtasks: List[Task],
    execution_results: List[Result],
    original_goal: Task
) -> Task:
    """
    Given actual execution history, rewrite the next subtask
    to maintain goal feasibility under current conditions.
    """
    prompt = f"""
    Original plan: {original_subtask}
    What actually happened: {execution_results}
    
    Rewrite the next subtask to:
    1. Still work toward the goal: {original_goal}
    2. Account for actual current state
    3. Preserve intent while adjusting constraints
    
    If the original subtask is now impossible, propose an alternative
    that achieves the same purpose.
    """
    return llm.generate(prompt)
```

## The Measurement Problem

Perhaps the most important contribution isn't the TDAG architecture but **Figure 3's revelation**: binary scoring shows no statistically significant difference between methods (scores ~28-32%) while fine-grained evaluation reveals a 20% performance gap (ReAct: 43.02, TDAG: 49.08).

This has profound implications:

**Binary evaluation creates an optimization mirage.** Researchers compare Method A (30% success) vs. Method B (31% success), conclude they're equivalent, and miss that Method B completes 65% of subtasks while Method A completes 40%.

**For agent system development:**
- Instrument partial completion tracking from day one
- Don't wait until "the whole task works" to measure progress
- Report distributions: "what % of runs complete ≥80% of subtasks?" not just "what % complete 100%?"

The paper's three-level evaluation (Executability → Constraint Satisfaction → Efficiency) provides a template:
- **Level 1**: Are individual actions valid? (train exists, time is consistent)
- **Level 2**: Do actions satisfy requirements? (budget not exceeded, attractions visited)
- **Level 3**: Is the solution optimized? (minimize time/cost)

Systems score 60 points for Level 1, 20 for Level 2, 20 for Level 3, with higher levels only evaluated if lower levels pass (Section 3.3).

**This prevents a critical measurement artifact**: a system that generates beautiful, efficient itineraries with impossible train schedules scores 0 despite demonstrating planning capability. A system that generates valid but inefficient itineraries scores 60. Binary evaluation would score both 0 (failure), hiding a massive capability difference.

## Connection to DAG Orchestration

WinDAGs likely represents tasks as directed acyclic graphs where nodes are skills and edges are data dependencies. The TDAG paper suggests:

**Don't**: Build the entire DAG upfront
**Do**: Build a meta-DAG where:
- **Execute subtask i** → **Evaluate result** → **Replan subtasks i+1...n** → **Execute subtask i+1**

Each "Replan" node consumes execution history and generates new subtask specifications. The DAG grows and mutates during execution.

This is feasible because:
1. Each subtask completes before the next is fully specified (sequential execution within complexity levels)
2. The coordinator maintains global state while executors work locally
3. Subtask boundaries provide natural checkpoints for replanning decisions

## Boundary Conditions: When Dynamic Decomposition Adds Overhead

**Unnecessary replanning costs tokens and latency.** If subtask success rate is >95%, dynamic updates rarely trigger—you pay planning overhead for minimal benefit.

**Highly parallel tasks don't benefit.** If subtasks 2-10 can all run simultaneously independent of subtask 1, dynamic decomposition adds sequencing constraints that hurt performance.

**Small task spaces.** If there are only 3 possible plans and you can enumerate them upfront, replanning is overkill—just try plan A, then plan B, then plan C.

The paper's travel planning domain has:
- ~20% base success rate (Table 2, baseline methods)
- Sequential dependencies (can't visit city B before traveling there)
- Combinatorial plan space (83 attractions, 15 cities, 4749 routes)

This is the *ideal* use case for dynamic decomposition. Scale it back when these conditions don't hold.

## Summary: The Architectural Principle

**Static decomposition treats planning as a one-time compilation step that generates an execution plan.**

**Dynamic decomposition treats planning as continuous interpretation where each execution step provides feedback that reshapes subsequent plans.**

For complex, uncertain, tightly-coupled tasks, compilation fails and interpretation succeeds. The cost is coordination overhead; the benefit is robustness to reality's refusal to match predictions.