# Temporal Dynamics of Commitment: When to Decide, When to Refine, When to Abandon

## The Time-Sensitive Nature of Plans

One of the paper's foundational observations is that time matters in a way that traditional planning and decision theory ignore: "It is recognized that the construction of plans takes time. However, these plans have been constructed for a set of future conditions that are known in advance and are frozen. The implicit assumption is that the conditions for which a plan is being formed, the so-called start state, will not change prior to execution" (p. 4).

But of course: **the world doesn't freeze during planning**. And this creates temporal dynamics that are central to resource-bounded reasoning:

- While you plan, opportunities expire
- While you plan, assumptions become invalid
- While you plan, deadlines approach
- While you deliberate, others act

These temporal dynamics are not edge cases. They're the normal condition of any agent operating in a real environment. The architecture must address them directly.

## Three Temporal Phases

The paper implicitly describes three temporal phases in the life of a plan:

### Phase 1: Formation (Deciding to Commit)

"Once the agent has decided to read a certain book today, a means-end problem is posed" (p. 11). The decision to commit creates a temporal boundary — before commitment, the agent is deliberating among alternatives; after commitment, the agent is working within the constraints of the plan.

**Trigger**: Deliberation process concludes (may be triggered by deadline, sufficient information, or opportunity closing)

**Result**: A (possibly partial) plan is adopted

**Temporal pressure**: External deadlines, opportunity windows, assumption decay

For agent systems, this is the "task acceptance" phase. An agent receives "implement OAuth authentication" and decides whether to commit. Factors:
- Is this consistent with existing commitments? (compatibility)
- Do I have resources to execute? (resource bounds)
- Is timing compatible with other plans? (temporal consistency)

Commit too early: foreclosed better options that arise later
Commit too late: miss opportunity or deadline

### Phase 2: Refinement (Progressive Commitment)

"As time goes by, they must be filled in with subplans that are at least as extensive as the agent believes necessary to execute the plan successfully" (p. 11).

The partial plan is progressively refined through means-end reasoning. This isn't a one-time event — it's an ongoing process triggered by approaching deadlines or detected incoherence.

**Trigger**: "Means-end reasoning may occur at any time up to the point at which a plan is in danger of becoming means-end incoherent; at that point it must occur" (p. 12).

**Result**: The plan becomes more detailed, more specific, more committed

**Temporal pressure**: "In danger of becoming means-end incoherent" is a temporal judgment — when is the latest I can refine this plan and still execute successfully?

For agent systems, this creates a scheduling problem: **when must each level of refinement occur?**

Example timeline:
```
T=0:   Commit to "implement OAuth" (high-level goal)
T=10:  Must choose OAuth provider (deadline: need to begin implementation)
T=20:  Must choose implementation library (deadline: need to write code)
T=30:  Must implement (deadline: must complete by T=50)
T=50:  Deadline
```

Refine too early: wasted effort if assumptions change
Refine too late: no time to execute

The "in danger of means-end incoherence" concept provides the temporal trigger: refine when (time to deadline) < (expected time to refine + expected time to execute).

### Phase 3: Maintenance/Abandonment (Revising Commitments)

"What happens when the agent comes to believe that a prior plan of hers is no longer achievable? A full development of this architecture would have to give an account of the ways in which a resource-bounded agent would monitor her prior plans in the light of changes in belief" (p. 14).

Plans must be monitored against changing conditions and potentially abandoned or revised. This monitoring is itself expensive and must be budgeted.

**Trigger**: Belief changes that threaten plan validity, or override mechanism fires on incompatible option

**Result**: Plan is abandoned, revised, or confirmed (Situation 3)

**Temporal pressure**: How long can monitoring be deferred before invalid plan causes failures?

For agent systems, this is the "replanning" phase — often the most expensive because:
- Previous work may be wasted
- Other agents may have dependencies on the abandoned plan
- Time pressure is now greater (deadline closer, less time remaining)

## Temporal Constraints on Deliberation

The filter override mechanism mediates temporal tradeoffs:

"It might be a good strategy for her to reconsider an intention to replace a CRT when an alternative means is proposed. After all, such reconsideration will, on many occasions, save the cost of a new CRT. Of course, there may also be times when this strategy lands Rosie in situations of type 2b or 3, in which her caution doesn't pay" (p. 19).

The override decision is fundamentally temporal: **Is there time to deliberate and still execute successfully?**

If deadline is far: deliberate freely (temporal slack allows exploration)
If deadline is near: be bold (no time for deliberation, commit to current plan)

This suggests **time-dependent override thresholds**:

```
override_threshold(time_to_deadline):
    if time_to_deadline > SLACK:
        return LOW_THRESHOLD   # deliberate readily
    elif time_to_deadline > MINIMUM:
        return MEDIUM_THRESHOLD  # deliberate selectively
    else:
        return HIGH_THRESHOLD   # commit and execute
```

For agent systems, this could be explicit: override mechanisms take time pressure as input and adjust sensitivity accordingly.

## Commitment Timing and Information Value

The paper's argument for partial plans reveals a timing principle: **commit when information value exceeds delay cost**.

Early commitment (before information available):
- Benefit: Start execution earlier
- Cost: Decisions made with poor information, likely to need revision

Late commitment (after information available):
- Benefit: Decisions made with good information, less revision needed
- Cost: Delayed start, potentially miss deadline

The optimal timing depends on:
1. **Information arrival rate**: How quickly does relevant information become available?
2. **Information value**: How much does better information improve decisions?
3. **Delay cost**: How much does waiting cost (opportunity, deadline pressure)?
4. **Revision cost**: How expensive is it to change course if early commitment is wrong?

For agent systems implementing OAuth:

**Commit to "use OAuth" immediately** because:
- Information needed for this decision is available now (requirements are known)
- Waiting doesn't improve this decision
- Commitment narrows future option space (valuable filtering)

**Defer "which OAuth provider" initially** because:
- Information needed is not yet available (haven't inspected codebase)
- Inspection during setup will reveal which providers already have libraries
- This decision can wait until implementation begins

**Defer "which error handling strategy" until implementation** because:
- Information needed is not available until attempting integration
- Different providers have different failure modes
- This decision can wait until errors are encountered

The structural partiality of plans enables this just-in-time decision making.

## The Stability-Revisability Tension Over Time

Plans must be "reasonably stable, i.e., they should be relatively resistant to reconsideration and abandonment" (p. 8). But they must also be revisable when circumstances change. These two requirements create temporal dynamics:

**Early in plan lifetime**: Should be more revisable
- Less committed effort (less sunk cost)
- More time to adapt (less deadline pressure)
- Less coordination cost (fewer dependencies)

**Late in plan lifetime**: Should be more stable
- Significant committed effort (high revision cost)
- Less time to adapt (approaching deadline)
- High coordination cost (others depend on this plan)

This suggests **time-dependent stability**:

```
should_reconsider(plan, new_option, current_time):
    time_invested = current_time - plan.start_time
    time_remaining = plan.deadline - current_time
    
    # Early: reconsider readily
    if time_invested < EARLY_PHASE:
        return override_threshold = LOW
    
    # Late: resist reconsideration
    if time_remaining < LATE_PHASE:
        return override_threshold = HIGH
    
    # Middle: standard reconsideration
    return override_threshold = MEDIUM
```

For agent systems: An agent that has spent 5 minutes on a plan should reconsider more readily than an agent that has spent 5 hours, all else being equal.

## Deadline-Driven Refinement

The means-end coherence requirement creates **temporal forcing functions**:

"Means-end reasoning may occur at any time up to the point at which a plan is in danger of becoming means-end incoherent; at that point it must occur" (p. 12).

"In danger of" is a temporal statement. A plan to "submit PR by 5 PM" with empty implementation becomes means-end incoherent when:
- Current time + minimum implementation time > 5 PM

This creates a **refinement schedule**: deadlines propagate backward through the plan hierarchy, creating latest-possible-times for each refinement.

For agent systems with plan "Deploy feature F by Friday":

```
Deploy F by Friday 5 PM
  ├─ Test F by Friday 2 PM [latest: Fri 2 PM - 3hr test time = Fri 11 AM]
  │   └─ Implement F by Friday 11 AM [latest: Fri 11 AM - 4hr impl time = Fri 7 AM]
  │       └─ Design F by Friday 7 AM [latest: Fri 7 AM - 1hr design time = Fri 6 AM]
  │           └─ [Refinement must occur by Fri 6 AM or plan incoherent]
  └─ Review F by Friday 4 PM [latest: Fri 4 PM - 1hr review time = Fri 3 PM]
```

Each "latest" time is when that subplan must be refined or the parent plan becomes incoherent. This schedule is computable from:
- Deadline (5 PM Friday)
- Duration estimates (3hr testing, 4hr implementation, etc.)
- Dependencies (testing requires implementation)

Agent systems can use this to schedule refinement activities: "I must decide implementation approach by Friday 6 AM. That's T hours away. Begin means-end reasoning at T-1 hours to ensure timely decision."

## Opportunity Windows and Temporal Logic

Options have temporal properties:

**Expiring opportunities**: "While deliberating about which OAuth provider to use, your teammate implements Google OAuth" (Failure Modes paper, p. X).

The option "use Google OAuth" has temporal bounds:
- Available from: now
- Available until: teammate commits to alternative
- Cost if delayed: none (until commitment)
- Cost if too late: incompatible plans, coordination conflict

**Time-varying cost**: Some options become more expensive over time:
- "Fix bug B" is cheap now, expensive after release
- "Refactor module M" is cheap now, expensive after others depend on M
- "Choose authentication approach" is cheap now, expensive after implementation begins

Override mechanisms should account for temporal properties:

```
should_override(option, current_plan):
    if option.expires_at < current_time + min_deliberation_time:
        # Expiring opportunity: consider even if marginal
        return TRUE
    if option.cost_increases_over_time and time_to_deadline > threshold:
        # Do now while cheap, or never
        return TRUE
    # ... standard override logic
```

## Temporal Patterns in Multi-Agent Coordination

When multiple agents coordinate, temporal dynamics create patterns:

**Concurrent Execution**: Agents A and B execute independent plans simultaneously. Requires temporal non-overlap of shared resources.

**Sequential Execution**: Agent B waits for Agent A to complete. Requires A's deadline < B's start time.

**Interleaved Execution**: Agents A and B alternate using shared resource. Requires coordination protocol and temporal scheduling.

**Hierarchical Execution**: Agent B executes subtask for Agent A. Requires B's deadline < A's means-end coherence threat time.

For WinDAGs orchestrating 180+ skills across multiple agents:

**Temporal coordination overhead scales with plan precision**:
- High-level plans ("implement authentication", "update tests") → minimal coordination needed, can execute concurrently
- Detailed plans (specific file edits, specific function changes) → extensive coordination needed, may require serialization

This argues for **late binding of temporal coordination**: coordinate on high-level schedules early, refine coordination as plans refine, commit to precise schedules only when execution imminent.

## Anytime Deliberation and Interruption

The paper doesn't discuss this explicitly, but the temporal dynamics imply that deliberation must be interruptible:

**Deadline interruption**: "I've been deliberating about which library to use, but the deadline is now so close that I must commit to something and begin implementation."

**Information interruption**: "While deliberating about OAuth providers, I discovered the codebase already has provider P configured, so I'll use P."

**Opportunity interruption**: "While deliberating about implementation approach, a teammate offered to pair program, which is valuable and time-sensitive, so I'll defer the deliberation."

For agent systems, this suggests:
- Deliberation should have timeboxes ("spend max 10 minutes choosing library")
- Deliberation should checkpoint ("after 5 minutes, current best option is X")
- Deliberation should be resumable ("if interrupted, can continue from checkpoint")
- Plans should specify commitment points ("must decide by time T")

## The Deeper Temporal Principle

The architecture's temporal insight is: **commitment is a temporal resource management strategy**. By committing to plans, agents:

1. **Defer detailed decisions** to when information is better
2. **Frontload constraint propagation** (early commitment narrows later option space)
3. **Enable temporal parallelism** (committed plans allow independent execution)
4. **Manage deliberation budget** (commitment limits what must be reconsidered)

Time is the ultimate resource bound. You can't get more time. You can only allocate it wisely. The plan-filter-override architecture is fundamentally a time allocation mechanism: time spent planning, time spent deliberating, time spent executing, time spent monitoring.

For agent systems: **Make temporal dynamics explicit**. Don't just track what the agent is doing; track when decisions must be made, when refinements must occur, when monitoring must happen, when commitments become irreversible. Treat time as a first-class constraint, not an afterthought.