# Plans as Coordination Intelligence: Encoding Context and Control

## Plans vs. Hierarchies: The Division of Labor

The hierarchical structure of HTA answers "what must be achieved" while plans answer "when, why, and under what conditions." Annett et al (1971) state: "Although tasks are often proceduralised, that is the sub-goals have to be attained in a sequence, this is by no means always the case."

This separation is crucial for intelligent systems. The sub-goal hierarchy provides the logical dependencies (achieving goal X requires achieving sub-goals A, B, and C) while plans provide the control logic (do A first, then B only if condition Z holds, and C in parallel with B).

Consider this distinction:
- **Hierarchy says**: "To operate radiator line, you must operate control panel, control cross welder, and control seam welder"
- **Plan says**: "Do these operations in sequence, and if cross welder piles up, interrupt to clear, then resume"

The hierarchy is static logical structure. The plan is dynamic control logic. Both are necessary; neither is sufficient.

## The Six Basic Plan Types and Their Semantics

Shepherd (2001) catalogs six fundamental plan patterns:

### 1. Fixed Sequence (S1)
**Syntax**: Do X then Y then Z  
**Semantics**: Sub-goals must execute in specified order; each must complete before next begins  
**Use case**: Steps with dependencies (can't test system before you build it)  
**Agent implication**: Sequential dependencies in DAG; downstream nodes wait for upstream completion

### 2. Contingent Sequence (S2)
**Syntax**: If condition C then do X, else do Y  
**Semantics**: Sub-goal selection depends on runtime conditions  
**Use case**: Branching based on system state, error conditions, or external events  
**Agent implication**: Conditional edges in DAG; need runtime evaluation of condition C

### 3. Parallel Sequence (S3)
**Syntax**: Do X and Y and Z together  
**Semantics**: Sub-goals execute concurrently; all must complete for super-ordinate goal success  
**Use case**: Independent sub-goals that can overlap (gather data from multiple sources)  
**Agent implication**: Parallel branches in DAG; requires coordination at merge point

### 4. Free Sequence (S4)
**Syntax**: Do X, Y, Z in any order  
**Semantics**: Sub-goals are order-independent; any completion sequence is valid  
**Use case**: Tasks with no interdependencies (collect three independent pieces of information)  
**Agent implication**: Any topological ordering of these nodes is valid; optimizer can choose sequence

### 5. Cyclical Plan
**Syntax**: Do X then Y then Z, repeat until condition C  
**Semantics**: Sub-goal sequence repeats until exit condition satisfied  
**Use case**: Iterative refinement, monitoring loops, trial-and-error approaches  
**Agent implication**: Loop structure in DAG; needs condition evaluation for exit

### 6. Selection Plan
**Syntax**: Choose one of X or Y or Z  
**Semantics**: Exactly one sub-goal executes; others are alternatives  
**Use case**: Multiple strategies for achieving goal; pick most appropriate  
**Agent implication**: Exclusive branches in DAG; selection logic needed upfront

Real plans combine these primitives. From the chemical incident example, Plan 2.2:
```
Do 2.2.1 (send officer to scene)
then 2.2.2 (officer arrives)  
then 2.2.3 (search scene)
Until [suspects] or [hazards]
then exit
```

This combines:
- Fixed sequence (2.2.1 → 2.2.2 → 2.2.3)
- Cyclical (repeat search until condition)
- Selection (exit on suspects OR hazards)

## Plans Encode Three Types of Intelligence

### 1. Sequencing Intelligence: Temporal Constraints

Some sub-goals must precede others due to:
- **Causal dependencies**: Output of A is input to B
- **Physical constraints**: Must open door before walking through
- **Resource constraints**: Must acquire lock before critical section
- **State dependencies**: System must be in state S before action X is valid

Plan notation makes these explicit: "1 then 2 then 3" vs "1 and 2 and 3" vs "1 or 2 or 3"

For multi-agent systems, sequencing intelligence determines:
- Which skills can run in parallel
- Which must serialize
- What synchronization points exist
- Where agents must coordinate handoffs

### 2. Conditional Intelligence: Context-Dependent Behavior

Some sub-goals only make sense under specific conditions:
- **State-dependent**: "If system is in error state then diagnose, else monitor"
- **Resource-dependent**: "If budget remains then optimize, else proceed with current solution"
- **Risk-dependent**: "If hazard detected then escalate, else continue normal operation"
- **Information-dependent**: "If suspects present then question, else search more"

The chemical incident plan shows sophisticated conditional logic:
```
Plan 2.3: If [hazards] then 2.3.1 (identify hazard)
         If [suspects] then 2.3.2 (capture) then 2.3.3 (question)
         Then 2.3.4 (inform control)
         Else exit
```

This encodes: hazard identification is independent of suspects, but suspect questioning depends on capture, and control is always informed if any action was taken, but exit immediately if neither hazards nor suspects found.

For agents, conditional intelligence means:
- Not every sub-goal in hierarchy executes in every instance
- Runtime conditions determine actual execution path
- Agents need ability to evaluate conditions
- Plan structure must be traversable, not just declared

### 3. Prioritization Intelligence: What Matters When

Some sub-goals can interrupt others:
- **Emergency conditions**: Safety-critical sub-goals preempt normal operation
- **Time-sensitive events**: Deadlines force reordering
- **Opportunity windows**: External events create brief windows for action
- **Resource availability**: Scarce resources becoming available triggers waiting sub-goals

The notation "Do 2.1 at any time if appropriate" in the chemical incident plan indicates: hospital notification can interrupt normal information gathering flow because casualty report is time-critical.

For agents, prioritization intelligence requires:
- Monitoring for interrupt conditions while executing normal plans
- Ability to suspend current sub-goal and resume later
- Priority levels for different sub-goals
- Deadlock prevention when multiple interrupts conflict

## Plans Make Error Recovery Explicit

Plans specify not just success paths but error paths. Consider the VCR programming task (table sixteen in source). Plan 4.4 says "Wait for 5 seconds." This seems odd—why encode waiting?

Because if user doesn't wait, the system won't accept start time input. The plan makes explicit: there's a timing constraint. Failure mode: "Fail to wait" (error A1). Consequence: "Start time not set." Recovery: "Task 4.5" (press Off button to proceed to finish time anyway).

The plan structure reveals:
- What can go wrong (violating plan constraints)
- What happens when it does (consequences)
- How to recover (alternative paths or retry)

For agent systems, this means plans should encode:
- **Success conditions**: When to proceed to next sub-goal
- **Failure conditions**: When current sub-goal cannot be satisfied
- **Recovery paths**: Alternative sub-goals or retry strategies
- **Exit conditions**: When to abandon this branch and report failure upward

## Dynamic Plans: When Control Logic Changes at Runtime

Most HTA examples show static plans—the control logic is fixed at design time. But real systems often need dynamic plans where control logic adapts:

**Learning-based adaptation**: "If previous attempt using strategy A failed, try strategy B next time"

**Resource-based adaptation**: "If compute budget exceeded, switch from exhaustive search to heuristic search"

**Performance-based adaptation**: "If throughput drops below threshold, increase parallelism"

**Context-based adaptation**: "If user expertise level is high, skip confirmation steps"

Annett (2004) proposes "dynamic programmable task models" as future extension. The idea: plans that modify themselves based on:
- Performance history
- Environmental conditions  
- Resource availability
- Learned policies

For agent orchestration, this suggests:
- Plans as executable code, not just declarations
- Plans that contain adaptation logic
- Monitoring that feeds back to plan modification
- Meta-plans that select among alternative plans

## The Missing Piece: Why Plans Matter

Miller & Vicente (2001) critique HTA for lacking representation of "causal understanding" and "why certain approaches work." But plans actually encode much of this:

**Causal understanding is in sequencing constraints**: "Must X before Y" implies X causes precondition for Y

**Strategic understanding is in contingent plans**: "If A then X else Y" implies understanding that approach depends on context

**Resource understanding is in parallel vs sequential**: "Do X and Y together" implies they don't compete for resources; "Do X then Y" may imply they do

**Risk understanding is in optional steps**: "Do X, optionally do Y, then Z" implies Y is refinement or verification, not essential

What plans don't encode well:
- **Deep causal models**: Why does X cause Y? Through what mechanism?
- **Physical constraints**: What spatial/temporal/resource relationships exist?
- **Trade-off spaces**: Why is plan P1 better than P2 under conditions C?

Plans give you the "what to do when," but not always the "why it works." For intelligent agents, this means plans should be augmented with:
- Precondition/postcondition specifications (what X achieves)
- Resource requirements (what X consumes/produces)
- Uncertainty estimates (how confident are we in X's success)
- Trade-off annotations (why we chose X over alternatives)

## Practical Implications for Agent Orchestration

When translating HTA plans to agent execution:

**Fixed sequences become dependency chains**: SubgoalX.output → SubgoalY.input

**Conditional plans become routing logic**: Evaluate condition C, route to appropriate skill invocation

**Parallel plans become concurrent tasks**: Launch multiple agents, synchronize at barrier

**Cyclical plans become monitoring loops**: Execute subgoal, check condition, decide continue/exit

**Selection plans become decision nodes**: Evaluate selection criteria, invoke chosen skill

**Free sequence plans become optimization problems**: Find lowest-cost ordering of independent sub-goals

The key insight: plans are executable specifications of coordination. They're not documentation of how things currently work; they're programs for how agents should behave. The plan syntax maps naturally to:
- Workflow languages (BPEL, BPMN)
- Process calculi (CSP, π-calculus)
- Dataflow graphs (Apache Beam, TensorFlow)
- Reactive programming (Rx, reactive streams)

## When Plans Break Down: Limits of Hierarchical Control

HTA assumes hierarchical control where super-ordinate goals govern subordinates through plans. This breaks down when:

**Emergent coordination**: System behavior arises from local agent interactions, not central plan. Example: ant colony optimization, market dynamics, stigmergy.

**Reactive agents**: Agents respond to immediate stimuli without consulting plan. Example: subsumption architecture, behavior-based robotics.

**Negotiation-based coordination**: Agents bargain for resources or task assignments rather than following predetermined plan. Example: contract net protocol, auction-based allocation.

**Opportunistic problem-solving**: Agents exploit unexpected opportunities that weren't in original plan. Example: creative design, exploratory programming.

For these cases, HTA provides initial structure but runtime coordination uses different mechanisms. The hierarchy remains useful for:
- Defining what needs to be achieved (goal structure)
- Identifying coordination points (where agents interact)
- Analyzing failure modes (what could go wrong)

But actual execution may follow emergence rather than plan.

## Meta-Lesson: Coordination Requires Explicit Control Logic

The separation of hierarchy (logical structure) and plans (control logic) is HTA's deepest contribution. Many system representations conflate these:
- Flowcharts show sequences but hide goal structure
- Entity-relationship diagrams show objects but hide processes
- Sequence diagrams show interactions but hide goal satisfaction

HTA maintains both simultaneously. The hierarchy provides stable logical framework. Plans provide flexible control that can be modified without restructuring hierarchy.

For agent systems: don't bake control flow into your system architecture. Represent goals hierarchically, encode plans separately, allow plans to evolve. The goal of "analyze security vulnerabilities" remains stable even as the plan for how to do it changes from "rule-based scanning" to "LLM-based analysis" to "hybrid approach."

Plans are where system intelligence lives. They're not bureaucratic overhead—they're executable knowledge about coordination. Get the plans right, and the system exhibits intelligent behavior. Get them wrong, and even correct sub-goals executed correctly produce system failure.

The quality of an agent orchestration system is largely determined by the quality of its plan representation and execution.