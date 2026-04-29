# Desires as Search Space Not Commands: The Deliberation Structure Before Commitment

## The Fundamental Confusion About Desires

When building goal-driven agent systems, there's a persistent confusion between *desires* (potential goals to consider) and *intentions* (committed goals driving action). Many systems treat goals as a flat queue: when a goal arrives, either execute it or reject it. This architecture makes every goal a command, forcing immediate commitment or rejection.

Móra et al. make a crucial distinction that changes how we should architect goal-directed systems: "Desires are related to the state of affairs the agent eventually wants to bring about. But desires, in the sense usually presented, does not necessarily drive the agent to act. That is, the fact of an agent having a desire does not mean it will act to satisfy it" (p. 16).

Instead, desires constitute the *option space* for deliberation. Before deciding what to do, the agent needs a set of candidate goals to reason about. Desires are "the set of states among which the agent chooses what to do" (p. 16). They're inputs to a decision process, not outputs.

This reframes agent architecture: You need two distinct layers. The desires layer accumulates possible goals with associated conditions and attributes. The intentions layer contains committed goals that actually drive planning and action. Between them sits deliberation—a reasoning process that selects from desires based on beliefs about achievability, importance, urgency, and consistency.

## Why Desires Need Not Be Consistent

A powerful consequence of this separation: "since agents are not committed to their desires, they need not to be consistent, neither with other desires nor with other mental states" (p. 16). This is psychologically accurate (humans simultaneously desire incompatible things) and computationally necessary.

Consider a multi-objective system: maximize throughput, minimize latency, minimize cost, maximize reliability. These objectives are mathematically inconsistent—you can't simultaneously achieve all optima. But they're all legitimate desires. The agent doesn't pick one and discard others; it deliberates over *trade-offs*, selecting an achievable subset or compromise.

If we forced desires to be consistent, we'd need to resolve conflicts at input time: "Should I even consider this goal given my other goals?" But we don't yet know which other goals we'll commit to—that's what deliberation determines. Forcing early consistency either rejects valid options prematurely or requires sequential dependency analysis that's as expensive as deliberation itself.

The authors formalize this freedom: "Definition 2 (Desires Set). The desires of an agent is a set of sentences of the form D = {holds_at(des(D, Ag, P, Atr), P) ← Body}" (p. 17). There's no consistency requirement. Desires can include:
- des(_, robot, battery_charged, [importance: 0.9])
- des(_, robot, package_delivered, [importance: 0.8])

Even if charging requires returning to base and delivery requires staying in field—these contradict. But both remain valid desires until deliberation.

## Conditional Desires and Contextual Relevance

The definition allows desires with bodies: "Desire clauses may be facts, representing states the agent may want to achieve whenever possible, or rules, representing states to be achieved when a certain condition holds" (p. 17). This is subtle but critical.

A fact desire like "holds_at(des(d1, ag, warm, [0.5]), T)" means "always consider warmth as a potential goal." But a rule desire like "holds_at(des(d2, ag, seek_shelter, [0.9]), T) ← holds_at(bel(ag, storm_approaching), T)" means "shelter becomes a relevant consideration when you believe a storm is approaching."

This implements *context-sensitive goal activation*. The desires layer doesn't grow unboundedly—irrelevant desires (whose preconditions are false) don't enter deliberation. But the agent doesn't forget them either. When context changes (storm warning arrives), previously irrelevant desires automatically become eligible.

For implementation: Store desires as rules (facts are rules with empty bodies). During deliberation, compute *eligible desires*—those whose bodies are satisfied by current beliefs: "We call eligible desires at a time T the set D' = {des(D, Ag, P, A) = [(holds_at(des(D, Ag, P, A), T) ← Body) ∈ D] ∧ Now ≤ T ∧ (B ⊨ Body) ∧ {B ∪ TAx} ⊭ holds_at(bel(Ag, P), T)}" (Definition 6, p. 19).

The last condition is rationality: don't consider desires already satisfied. If you believe the battery is charged, "desire battery charged" shouldn't enter deliberation—it's moot.

## Attributes as Deliberation Metadata

Desires carry attributes: "D is the desire identification, P is a property, T is a time point, Ag is an agent identification and A is list of attributes" (p. 17). The paper mentions "urgency, importance or priority" as examples.

This is the key to preference-based deliberation. When multiple desire subsets are achievable, attributes determine which to commit to. The paper implements a specific preference relation: "R <_Pref S (R is less preferred than S) if the biggest value for importance occurring in S and not occurring in R is bigger than the biggest value for importance occurring in R and not occurring in S; if there is no such biggest value in S, than R is less preferred than S if S has more elements than R" (Definition 7, p. 20).

Translation: Prefer satisfying more important desires first. Among equally important options, prefer satisfying more desires. This is lexicographic ordering: importance dominates quantity, but quantity is the tiebreaker.

But the framework is general. You could define attributes for:
- **Urgency/Deadlines**: Prefer desires with earlier deadlines among equal importance
- **Resource Requirements**: Prefer cheaper desire sets when importance is equal  
- **Risk**: Prefer desires with higher probability of success
- **Stakeholder**: Prefer desires from higher-authority requestors

The preference relation can incorporate multiple attributes with custom logic. What's critical is that attributes are *metadata for deliberation*, not properties of the desired states themselves. The desire "package delivered" doesn't inherently have importance 0.8—that's the agent's current prioritization, which might change.

## The Eligible → Candidate → Intention Pipeline

The paper defines a three-stage selection process:

**Stage 1: Eligible Desires** (Definition 6) filters the full desire set to contextually relevant, unsatisfied desires. This is pure filtering based on belief state—no deliberation yet.

**Stage 2: Candidate Desires** (Definition 10) finds subsets of eligible desires that are jointly achievable: "We call candidate desires set any set D'_C = {des(D, Ag, P, A) = (des(D, Ag, P, A) ∈ D') ∧ (P' ∪ Δ ⊭ ⊥)]" where P' is an abductive framework and Δ is an abduced course of action.

This is the core deliberation: For each subset R of eligible desires, can we abduce a sequence of actions that would satisfy all desires in R without contradiction? "The agent believes it is possible to satisfy all of its desires (if it can abduce actions that satisfy all desires and satisfy all constraints)" (p. 21).

The preference relation determines which candidate sets to prefer. There may be multiple—the revision mechanism explores minimal preferred revisions.

**Stage 3: Primary Intentions** (Definition 11) are the desires from a selected candidate set: "The primary intentions of an agent is the set {int_that(D, Ag, P, A) = des(D, Ag, P, A) ∈ Des'_C)}" (p. 22).

Once selected, they gain commitment properties (see previous document). But they start as desires.

## Implementation Architecture for WinDAG Systems

This suggests a specific agent architecture:

**Desire Accumulator**: A working memory for candidate goals. Skills can post desires with attributes. External events can trigger conditional desires (rules). No consistency enforcement at this layer—accumulate everything potentially relevant.

**Eligibility Filter**: Before deliberation, evaluate desire rule bodies against current beliefs. Tag desires as eligible/ineligible. This is cheap—just belief querying.

**Achievability Analysis**: For eligible desires, perform abductive reasoning: "Can I find actions satisfying these desires jointly?" This requires domain knowledge (action models) and search. The authors use Event Calculus with abduction over happens/act predicates.

**Preference-Based Selection**: When multiple candidate sets exist, apply preference relation. This could be a scoring function, constraint optimization, or the revision preference graph approach. Output is one (or more) candidate sets ranked by preference.

**Commitment**: Adopt top-ranked candidate set as intentions. Install as constraints for subsequent planning/acting. Register trigger conditions for reconsideration.

The desire layer is persistent across deliberation cycles—desires don't vanish when not selected. They might become eligible later (context change) or be selected in a future cycle (higher-priority desires completed).

## Avoiding Premature Commitment: Deliberation Scheduling

One subtlety: When does deliberation occur? Continuously re-evaluating would be expensive and defeat the purpose of commitment. The paper addresses this through trigger mechanisms (covered in previous document), but there's a design tension.

Too frequent deliberation: "It is... necessary to define, along with those conditions, a mechanism that triggers the reasoning process without imposing a significant additional burden on the agent" (p. 23). If every new desire or belief change triggers full deliberation, the system spends all time deciding and no time acting.

Too infrequent deliberation: "The agent's normal behavior would be to weigh its competing desires and beliefs, selecting its intentions... until successful accomplishment, impossibility... or until some of his other desires that were not selected before would become eligible" (p. 24). If deliberation never happens, new important goals are ignored and the agent becomes rigid.

The balance: Maintain desires continuously but deliberate on a schedule or when triggered by:
1. **Intention completion/failure**: Major commitment resolved, re-evaluate priorities
2. **High-importance desire activation**: Conditional desire with importance exceeding current intentions becomes eligible
3. **Significant belief change**: Achievability of current intentions compromised
4. **Explicit request**: External command to reconsider priorities

Between deliberations, new desires accumulate and existing desires update their eligibility, but intentions remain stable.

## The Broader Lesson: Separate Objective Space from Solution

The desire/intention distinction reflects a general principle: Separate the *space of objectives* from the *committed solution*. Many systems conflate these:

- **Task queues** treat every arriving task as a commitment (or rejection decision)
- **Optimization solvers** work with fixed objective functions, no notion of selecting among objectives
- **Reactive planners** map observations directly to actions, no explicit goal layer

The BDI architecture provides a middle layer: goals (desires) that persist over time, can be reasoned about, selected from, and revised independently of the action/planning layer. This separation enables:

- **Multi-objective reasoning**: Maintain incompatible objectives, deliberate over trade-offs
- **Context sensitivity**: Objectives activate/deactivate as beliefs change without replanning
- **Graceful overload**: When under-resourced, select objective subset rather than fail/thrash
- **Justification**: Explain why goals were adopted or rejected (deliberation trace)

For WinDAG orchestration: When designing task decomposition or skill selection, distinguish "possible tasks to consider" from "committed execution plan." The skills capability database is like the desire set—the full space of options. Route selection and orchestration logic performs deliberation—choosing a feasible, preferred subset to commit to.

The gap many systems have: They jump from "here's a request" to "execute this plan" without an explicit deliberation layer that considers alternatives, checks feasibility, and applies preferences. Building that layer means implementing something like the desire → eligible → candidate → intention pipeline.

## When This Model Doesn't Apply

This desire-based deliberation architecture makes sense when:
- **Multiple persistent objectives** that need prioritization and trade-off reasoning
- **Objectives may be temporarily unachievable** requiring deferral
- **Changing context** affects goal relevance and achievability
- **Resources constrain** how many objectives you can pursue simultaneously

It's less appropriate for:
- **Purely reactive systems** where every stimulus demands immediate response
- **Single-objective optimization** where the goal is fixed and only the path varies  
- **Tightly real-time control** where deliberation latency is prohibitive
- **Fully specified plans** where the task is execution monitoring, not goal selection

Even in complex systems, different layers might use different models. Low-level control loops don't deliberate over desires. But higher-level orchestration (What should this system work on now? What are the priorities given current state?) benefits from the explicit desire layer.

The key insight: If your system has anything resembling "goals that compete for resources," formalizing them as desires (not immediate commands) and implementing selection deliberation will clarify the architecture and expose design choices currently implicit in ad-hoc control logic.