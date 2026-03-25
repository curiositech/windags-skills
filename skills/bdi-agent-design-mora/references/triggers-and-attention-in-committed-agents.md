# Triggers and Attention in Committed Agents: When Should Deliberation Happen?

## The Commitment-Deliberation Tradeoff

A fundamental tension in rational agent design: Commitment is computationally necessary (can't constantly reconsider every decision), but blind commitment is irrational (must respond to changing circumstances). Móra et al. identify this precisely: "As we have seen, weighing motivations and beliefs means finding inconsistencies in competing desires, checking valid desires according to beliefs and intentions, resolving constraints... very expensive reasoning activities. It is now necessary to define when the agent should perform this process" (p. 23).

Too frequent deliberation: The agent spends all its time deciding what to do rather than doing anything. The computational cost of deliberation defeats the purpose of having commitments. As the authors note: "it is not enough to state that an agent should revise its intentions when it believes a certain condition holds... as this suggests that the agent needs to verify its beliefs constantly" (p. 23).

Too infrequent deliberation: The agent rigidly pursues obsolete intentions despite new information making them unnecessary, impossible, or superseded by more important goals. It becomes blind to opportunities and unresponsive to threats.

The solution requires a *trigger mechanism*: Specific conditions that signal "deliberation is warranted." These triggers must be:
1. **Computationally cheap to monitor**: No expensive reasoning just to decide whether to reason
2. **Semantically justified**: Trigger only when beliefs change in ways that undermine current commitments
3. **Integrated with existing mechanisms**: Not an ad-hoc bolt-on but part of the agent's core architecture

## Triggers as Integrity Constraints in Belief Maintenance

Móra et al.'s elegant solution: Implement triggers as *integrity constraints* in the belief base. The agent already maintains belief consistency (updates beliefs as new information arrives, resolving contradictions). Trigger conditions are constraints that become violated when deliberation is needed. Violation detection is a byproduct of routine belief maintenance.

Definition 14 (Trigger from Intentions) specifies: "We add to B the following trigger constraints: (? ← Now > T, not rev_int) for each (int_that(I, Ag, P, A); int_to(I, Ag, Act, A)) ∈ I" (p. 23).

Translation: For every intention with deadline T, there's a constraint saying "contradiction if the deadline passes without triggering reconsideration." The revisable literal rev_int starts false. When Now > T becomes true (time advances), the constraint is violated unless rev_int becomes true.

During belief revision (which happens continuously as beliefs update), the system detects: "We identify such contradiction by testing if rev_int is in the selected revision for the beliefs set, i.e., if it has to have its truth value modified in order to restore consistency. The intention revision process is triggered when one of these constraints is violated" (p. 23).

This is architecturally beautiful: The expensive deliberation process isn't invoked by polling ("check every cycle if reconsideration is needed") but by *exception* ("contradiction detected during routine maintenance"). The trigger is passive—only fires when relevant beliefs change.

## Standard Triggers: Completion and Impossibility

Definition 14 provides two basic triggers:

**1. Time Exceeded**: "(? ← Now > T, not rev_int)" — If current time exceeds the intended time for a property/action, reconsider. This catches:
- Goals with deadlines (intended by time T, now it's past T)
- Time-stamped intentions (intended at specific time, that time has passed)
- Persistence failures (intended property should hold "until further notice," implying reconsideration periodically)

**2. Action Executed**: "(? ← happens(E, Ti, Tf), act(E, Act), not rev_int) for each int_to(I, Ag, Act, A) ∈ I" — If an intended action has occurred, reconsider. This catches:
- Successful completion (action done, check if goal achieved)
- Side effects of execution (action completed but had unexpected consequences)
- Enabling conditions for subsequent intentions (action was a subgoal, now consider next steps)

These are the "standard" reconsideration conditions found in most BDI models (Cohen & Levesque, Rao & Georgeff, etc.): Reconsider when an intention is satisfied or believed impossible.

But the authors recognize these are insufficient: "As we have seen before, this characterization of intentions may lead to some fanatical behavior. Therefore, we need to adopt additional constraints that will avoid those unwanted behaviors" (p. 24).

## Non-Standard Triggers: Superseding Desires

The key insight: "the same reasons that originated intentions may be used to break commitment associated to them" (p. 24). If desires are the source of intentions (deliberation selects among desires), changes in the desire landscape should trigger reconsideration.

Definition 15 (Trigger Constraints from Desires) adds two types:

**1. High-Priority Desire Becomes Eligible**: "For every des(D, Ag, P, A) ← Body ∈ D and not in D' with importance A bigger than the biggest importance in intentions, we define a trigger constraint: ? ← Body, not rev_int" (p. 24).

Suppose current intentions have max importance 0.7. There's a desire des(emergency_shutdown, [0.95]) ← sensor_critical that wasn't eligible during last deliberation (sensor wasn't critical). Now sensor becomes critical—the desire's precondition activates. The constraint fires: "Contradiction! A much more important desire is now eligible."

This implements *context-sensitive reprioritization*. The agent doesn't constantly check "are there more important things to do?" (expensive). Instead, the arrival of conditions making high-priority desires relevant automatically triggers reconsideration (cheap—detected during belief update).

**2. Previously Infeasible Desire Becomes Feasible**: "For each des(D, Ag, P, A) ∈ (D' - D'_C) with importance A bigger than the biggest importance in intentions, we define a trigger constraint: ? ← C1, ..., Cn, not rev_int, where Ci (1 ≤ i ≤ n) are the conditions the agent could not bring about when selecting the candidate desires set" (p. 24).

This is subtle. Suppose during deliberation, desire Des1 (importance 0.8) was eligible but not adopted because the agent couldn't find actions to achieve it (abduction failed—some precondition C couldn't be satisfied). Current intentions have max importance 0.6.

Later, condition C becomes true (external event or consequence of other actions). Now Des1 is achievable. The trigger fires: "A previously impossible but important desire is now feasible."

The agent doesn't maintain a "watch list" of infeasible desires and poll their preconditions. Instead, when desires are rejected during deliberation, the *conditions causing rejection* are recorded as trigger constraints. If those conditions change, reconsideration is automatically triggered.

## What NOT to Trigger On

Critically, the authors specify what does NOT trigger reconsideration: "Notice that there are no triggers for those desires that were eligible but that were ruled out during the choice of a revision. This is so because they had already been evaluated and they have been considered less important than the other desires. Therefore, it is of no use to trigger the whole process again (i.e., to shift the agent's attention) to re-evaluate them" (p. 24).

If Desire A (importance 0.5) and Desire B (importance 0.7) both were eligible and achievable, but deliberation chose B, there's no trigger for A's conditions. Why? A was already considered—it's simply less important. Until something changes about *relative* importance (B becomes impossible, or a >0.7 desire emerges), re-evaluating the A vs B choice is pointless.

This prevents thrashing: Low-priority desires whose conditions fluctuate don't cause constant reDeliberation. The filter: Only trigger when new information genuinely changes the deliberation outcome.

## The Attention Mechanism

The trigger system implements a notion of *attention*—what the agent focuses its (limited) deliberative capacity on. Bratman's notion: "Commitment should be broken when the reasons for it are superseded." The authors operationalize this: Focus shifts when:
- Current commitments complete/fail (standard triggers)
- Much more important issues arise (high-priority desire activation)
- Previously impossible important issues become possible (feasibility trigger)

Between these events, attention remains stable—the agent pursues its intentions without distraction. This is cognitively realistic (humans don't reconsider every decision constantly) and computationally necessary (deliberation is expensive).

The architecture: Desires persist in memory, but only *salient* desires—those whose triggers fire—cause attention shifts. Salience is dynamic: A desire can be non-salient (agent isn't thinking about it) then become salient (trigger fires) then non-salient again (handled or condition goes away).

## Example: Robot Attention Shifts

Example 16 (p. 25) demonstrates: The robot initially intends to store object a. Its triggers include:
- Time trigger: ?← Now > T_store, not rev_int (if storage action deadline passes)
- Completion trigger: ?← happens(E, Ti, Tf), act(E, store(a)), not rev_int (if store(a) executes)
- Battery trigger: ?← holds_at(bel(rbt, ¬bat_charged), T), not rev_int (from battery desire precondition)

While executing store(a), a sense_low_bat event occurs. This updates beliefs: holds_at(bel(rbt, ¬bat_charged), now). The battery trigger fires—contradiction detected. rev_int must flip to true to restore consistency.

This signals deliberation. The robot reconsiders, finds battery desire (importance 0.9) now eligible and more important than storage (0.5). Deliberation selects battery charging, drops storage.

Attention shifted from "focus on storage" to "focus on battery" not because the robot constantly asked "should I still store?" but because a specific belief change (battery status) violated a trigger constraint.

## Implementation Pattern for WinDAG Systems

For orchestration systems, this trigger architecture suggests:

**1. Declarative Trigger Specification**: When adopting a goal/plan, declare its triggers as constraints:
```python
class Commitment:
    def __init__(self, goal, plan, triggers):
        self.goal = goal
        self.plan = plan
        self.triggers = triggers  # List of (condition, trigger_fn) pairs

commitment = Commitment(
    goal="deploy_service",
    plan=deployment_steps,
    triggers=[
        ("plan.deadline < now", reconsider_deployment),
        ("plan.completed", reconsider_deployment),
        ("security_alert.severity > 0.9", reconsider_deployment),
    ]
)
```

**2. Integrate with Event Stream**: Don't poll triggers. As events arrive (time ticks, sensor updates, messages), check if any active trigger conditions now hold:
```python
class TriggerMonitor:
    def __init__(self, commitments):
        self.commitments = commitments
        self.active = True
    
    def on_event(self, event):
        for c in self.commitments:
            for condition, trigger_fn in c.triggers:
                if self.evaluate(condition, event):
                    trigger_fn(c)
                    # Deliberation invoked
```

**3. Prioritize Trigger Evaluation**: Not all conditions need checking on every event. Use event types to filter:
- Time events only check time-based triggers
- Belief updates only check belief-dependent triggers
- Message arrivals only check communication triggers

This keeps monitoring overhead low—each event only evaluates relevant triggers.

**4. Batch Trigger Firings**: If multiple triggers fire simultaneously (e.g., multiple goals deadline at once), batch them into a single deliberation cycle rather than invoking deliberation repeatedly. Collect all triggered rev_int literals, perform one revision.

**5. Hierarchical Triggers**: For complex plans with subgoals, triggers can be hierarchical. A high-level goal has triggers for major condition changes; subgoals have fine-grained triggers. Only propagate subgoal triggers upward if they invalidate the high-level plan.

## Boundary Conditions: When Triggers Aren't Enough

This trigger mechanism assumes:

**1. Relevant Conditions Are Observable**: Triggers depend on detectable belief changes. If important conditions are hidden or delayed, triggers won't fire when they should. Mitigation: Include time-based periodic triggers as backstops ("reconsider every N time units even if no other trigger").

**2. Trigger Conditions Are Stable**: If conditions oscillate rapidly (e.g., sensor noise), triggers might fire constantly. Mitigation: Add hysteresis—trigger only if condition persists for threshold duration.

**3. Deliberation Completes Quickly Enough**: If deliberation takes so long that multiple triggers accumulate, the system falls behind. Mitigation: Bound deliberation time (anytime algorithms, best-so-far solutions).

**4. No Critical Conditions Missed**: The trigger set must be complete—all genuinely important condition changes must have triggers. If a critical condition isn't covered, the agent will blindly persist with obsolete intentions. Mitigation: Careful trigger design, possibly with conservative (over-sensitive) defaults.

**5. Trigger Evaluation Is Cheap**: The whole point is efficient monitoring. If evaluating trigger conditions is itself expensive, you haven't saved computation. Mitigation: Triggers should be simple belief queries, not complex reasoning.

## Lessons for Agent Orchestration

The trigger-based commitment architecture teaches:

**Attention is a Scarce Resource**: Don't waste it re-evaluating stable commitments. Focus deliberative capacity on situations where reconsideration genuinely matters.

**Exception-Based Over Polling**: Implement "reconsider when necessary" as exception handling (constraint violation) rather than polling (check every cycle). This is more efficient and compositional.

**Encode Justifications as Triggers**: When adopting a commitment, record *why* it was adopted (which beliefs supported it, which desires it satisfies). Changes invalidating those justifications become triggers. This connects commitment to its origins, enabling rational reconsideration.

**Deliberation Is Triggered, Not Scheduled**: Don't run deliberation on a fixed clock. Run it when the information state changes in ways that matter. This adapts computational effort to environmental dynamics.

**Tiered Trigger Sensitivity**: Not all condition changes warrant full deliberation. Critical triggers (safety violations, high-priority goal emergence) invoke immediate reconsideration. Minor triggers might set flags for lazy deliberation (next cycle). This prioritizes responsiveness.

The deeper lesson: Rational agency isn't constant reasoning—it's *selective* reasoning. Triggers are the selection mechanism, determining when costly deliberation is justified. Without triggers, you get either continuous expensive deliberation (computationally infeasible) or rigid commitment (behaviorally inadequate). With well-designed triggers, you get adaptive behavior with bounded computational cost—the hallmark of practical rationality in resource-bounded agents.