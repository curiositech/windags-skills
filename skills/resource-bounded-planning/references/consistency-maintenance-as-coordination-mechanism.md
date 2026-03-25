# Consistency Maintenance as Coordination Mechanism: How Plans Enable Multi-Agent Coherence

## The Consistency Requirement

The paper states: "Other things being equal, an agent's plans should be consistent, both internally and with her beliefs. Roughly speaking, it should be possible for her plans, taken together, to be executed successfully in a world in which her beliefs are true" (p. 8).

This requirement sounds simple but has profound implications for how agents coordinate, especially in multi-agent environments. The consistency requirement is not just about logical coherence — it's a **coordination mechanism** that enables multiple agents (or multiple commitments within one agent) to work together without constant communication.

## What Consistency Really Means

The paper's definition is deliberately pragmatic: plans are consistent if they *could* be "executed successfully in a world in which her beliefs are true." This is weaker than logical consistency but stronger than mere non-contradiction.

Examples from the paper:

**Inconsistent**: "A plan to spend all of one's cash at lunch is inconsistent with a plan to buy a book that includes an intention to pay for it with cash" (p. 11).

Why inconsistent? Both plans cannot be executed successfully in the same world. If you spend all your cash at lunch, you cannot later pay for a book with cash. The plans are mutually exclusive.

**Potentially Consistent**: The same plan to spend all cash at lunch "is not necessarily inconsistent with a partial plan merely to purchase a book, since the book may be paid for with a credit card" (p. 11).

Why potentially consistent? The partial plan doesn't specify payment method, so execution could avoid the conflict. The plans are not mutually exclusive; there exists a refinement where both succeed.

This distinction is crucial: **consistency checking must account for partiality**. A plan that's inconsistent with a detailed plan might be consistent with the partial plan from which it was derived.

## Internal Consistency: Preventing Self-Interference

Even a single agent can have multiple commitments that must be internally consistent. The paper's example of temporal partiality illustrates this: "An agent may plan to give a lecture from 10 o'clock until noon, to pick up a book at the bookstore on the way back from the lecture, to attend a meeting from 2:00 to 3:30, and to pick up her child at school at 5:00" (p. 10).

These plans are consistent if:
- The lecture location and bookstore location make "on the way back" feasible
- Travel time from bookstore to meeting location fits before 2:00
- Travel time from meeting location to school fits before 5:00
- Each activity doesn't overrun into the next

This is "spatio-temporal" consistency (p. 13) — plans don't overlap in time/space in ways that make execution impossible.

For agent systems, internal consistency checking prevents:

**Resource Conflicts**: A plan to "process entire dataset" that assumes 16GB RAM is inconsistent with simultaneous plan to "run ML model" that needs 12GB RAM if only 16GB is available.

**Temporal Conflicts**: A plan to "complete code review" (estimated 2 hours) starting at 3 PM is inconsistent with a plan to "attend meeting at 4 PM" if the review can't be interrupted.

**State Conflicts**: A plan to "test feature X" is inconsistent with a concurrent plan to "refactor code containing feature X" if tests depend on current implementation.

The paper suggests these checks can be efficient: "one might define a measure of spatio-temporal separation between options and design the compatibility filter so that it rules out all and only those options that overlap inappropriately with already intended actions" using "a polynomial-time constraint-propagation algorithm over intervals" (p. 13).

## Consistency as Implicit Coordination

In multi-agent settings, consistency maintenance becomes a coordination mechanism. If Agent A's plan is consistent with Agent B's plan, they can execute concurrently without coordination. If plans are inconsistent, coordination is required.

**Example 1: File System Operations**

Agent A plans: "Refactor module X by moving functions to new file Y"
Agent B plans: "Analyze all Python files in directory"

Are these consistent?

- If Agent B's plan includes "analyze file Y", there's a potential conflict: Agent B might try to analyze Y before A creates it, or while A is writing it.
- Resolution requires either: (a) temporal ordering (B waits for A), (b) scope limitation (B analyzes only existing files), or (c) communication protocol (B handles missing files gracefully)

The consistency check surfaces this need for coordination.

**Example 2: Resource Allocation**

Agent A plans: "Use GPU for training"
Agent B plans: "Use GPU for inference"

If only one GPU available, plans are inconsistent. The consistency check forces:
- Explicit temporal coordination (A uses GPU 9-10 AM, B uses 10-11 AM)
- Resource allocation (A gets GPU 0, B gets GPU 1)
- Priority resolution (A has priority, B waits)

Without consistency checking, both agents might attempt GPU access simultaneously, leading to failures or degraded performance.

## The Compatibility Filter as Consistency Checker

The "compatibility filter" (p. 13) is essentially a consistency checker that runs when new options are proposed. It asks: "Would this new option be consistent with my existing plans?"

The paper emphasizes this must be efficient: "It is essential that the filtering process be computationally efficient relative to deliberation itself" (p. 13). This suggests a hierarchy of consistency checks:

### Fast Checks (Always Run)

- **Type compatibility**: Is this option category compatible with current plan category? (Check: refactoring vs. testing — potentially conflicting)
- **Resource disjointness**: Do options require mutually exclusive resources? (Check: both need exclusive file lock)
- **Temporal overlap**: Do options overlap in time? (Check: O(log n) interval tree lookup)

### Moderate Checks (Run When Fast Checks Pass)

- **Resource sufficiency**: Are there enough resources for both? (Check: sum of memory requirements < available memory)
- **Causal independence**: Do options affect each other's preconditions? (Check: does option A delete what option B reads?)
- **Goal compatibility**: Do options serve conflicting goals? (Check: option A optimizes for speed, option B optimizes for memory)

### Expensive Checks (Run Only When Necessary)

- **Detailed execution simulation**: Can both plans actually execute in same world?
- **Constraint satisfaction**: Is there any schedule satisfying all constraints?
- **Semantic analysis**: Do plans have subtle interactions requiring deep reasoning?

The architecture works because **most inconsistencies are caught by fast checks**. Only when fast checks are inconclusive do you need expensive analysis.

## Imperfect Filters and Their Consequences

The paper acknowledges that consistency checking cannot be perfect: "Such filters may be 'leaky', in that they sometimes let through options that are in fact incompatible, or they may be 'clogged', in that they sometimes block options that are in fact compatible" (p. 14).

This is pragmatically important:

**Leaky Filters (False Negatives)**: An incompatible option passes the filter and reaches deliberation. The agent might:
- Discover the incompatibility during deliberation (expensive but not catastrophic)
- Commit to the incompatible option and discover conflict during execution (more expensive, requires replanning)
- Never discover the incompatibility if execution somehow works anyway (lucky)

**Clogged Filters (False Positives)**: A compatible option is blocked by the filter. The agent:
- Misses a potentially good option (opportunity cost)
- Never knows the option was viable (invisible failure)

The tradeoff: make filters more precise (fewer errors) at the cost of more computation, or make filters more conservative (faster but blocks more) accepting more false positives.

For agent systems, this suggests:
- **Error in favor of false positives** when deliberation is expensive (better to block a compatible option than waste time deliberating about incompatible ones)
- **Error in favor of false negatives** when opportunities are rare (better to occasionally deliberate about incompatible options than miss rare compatible ones)
- **Tune based on observation** (track how often filter errors occur and adjust thresholds)

## Consistency and Structural Partiality

The interaction between consistency and partiality is subtle but important:

"A plan to spend all of one's cash at lunch is inconsistent with a plan to buy a book that includes an intention to pay for it with cash, but is not necessarily inconsistent with a partial plan merely to purchase a book" (p. 11).

This means: **the more partial a plan, the more compatible it is with other plans**, because partial plans have fewer commitments that could conflict.

For multi-agent coordination:

**High-Level Coordination**: Agents coordinate on goals and approaches (high-level partial plans) early, when flexibility is maximal and compatibility checking is easiest.

**Progressive Refinement**: As each agent refines its partial plans, it checks consistency with other agents' plans at corresponding levels of detail.

**Late Binding**: Low-level details (which library to use, which variable names to choose) are deferred until execution, minimizing coordination overhead.

Example:
- Agent A commits: "I will implement authentication" 
- Agent B commits: "I will implement user profiles"
- Consistency check at this level: probably compatible (different domains)

Later:
- Agent A refines: "I will store user data in 'users' table"
- Agent B refines: "I will store user data in 'profiles' table"  
- Consistency check: incompatible! (schema conflict)

If both agents had committed to detailed plans immediately, the conflict might have been discovered late (expensive) or never (catastrophic). By coordinating on partial plans first, they can discover conflicts when resolution is easier.

## Consistency Across Abstraction Levels

The paper doesn't explicitly discuss this, but the architecture implies that consistency must be maintained across different levels of abstraction:

**Goal-Level Consistency**: High-level goals should be non-conflicting
- "Optimize for speed" vs. "Optimize for memory" → potentially inconsistent
- "Implement feature X" vs. "Implement feature Y" → probably consistent unless X and Y conflict

**Approach-Level Consistency**: Chosen approaches should be compatible
- "Use OAuth for auth" vs. "Use session-based auth" → inconsistent if both for same system
- "Use REST API" vs. "Use GraphQL" → inconsistent if client expects one

**Method-Level Consistency**: Specific methods should not interfere
- "Use library L1 version 2.0" vs. "Use library L1 version 3.0" → dependency conflict
- "Modify file F" vs. "Delete file F" → temporal conflict

For agent systems: consistency checking must operate at the appropriate abstraction level. Don't check method-level consistency when plans are still at the goal level (premature and expensive). Do check goal-level consistency immediately (cheap and prevents high-level conflicts).

## Monitoring and Consistency Maintenance

Plans can become inconsistent after formation due to belief changes: "What happens when the agent comes to believe that a prior plan of hers is no longer achievable? A full development of this architecture would have to give an account of the ways in which a resource-bounded agent would monitor her prior plans in the light of changes in belief" (p. 14).

This monitoring is itself expensive, creating another tradeoff:
- **Continuous monitoring**: Always consistent, but expensive
- **Periodic monitoring**: Cheaper, but inconsistencies may persist
- **Event-driven monitoring**: Monitor only when beliefs change, but requires efficient change detection

For multi-agent systems, consistency monitoring becomes a communication challenge:

**Push-Based**: Agents broadcast when plans change, others check consistency
- Pro: Immediate detection of inconsistencies
- Con: Communication overhead, all agents must process all broadcasts

**Pull-Based**: Agents periodically query others' plans and check consistency
- Pro: Lower communication overhead
- Con: Delayed detection, potential for acting on inconsistent assumptions

**Hybrid**: Broadcast major changes, poll for details
- Pro: Balance of timeliness and overhead
- Con: Complexity of deciding what's "major"

## Consistency as Architectural Principle

The deeper insight is that consistency maintenance is not just a correctness criterion — it's an architectural principle that enables bounded agents to coordinate:

1. **Filtering function**: Consistency checks eliminate options without expensive deliberation
2. **Coordination signal**: "My plan is consistent with yours" means we can proceed independently  
3. **Problem detection**: Inconsistency signals need for communication or replanning
4. **Resource management**: Consistent plans don't waste resources on conflicting actions

For WinDAGs and similar systems: **make consistency checking explicit and first-class**. Don't assume plans are consistent; check actively. Don't make consistency checks expensive; use hierarchical approximations. Don't ignore inconsistencies; treat them as coordination requirements.

The consistency requirement transforms distributed decision-making from intractable (every agent must consider every other agent's detailed plans) to tractable (agents maintain compatible high-level plans and coordinate only when refinements create conflicts).