## BOOK IDENTITY

**Title**: BDI Models and Systems: Reducing the Gap  
**Author**: Michael C. Móra, José G. Lopes, Rosa M. Viccari, and Helder Coelho  
**Core Question**: How can we bridge the gap between powerful formal logical models of rational agents (Beliefs-Desires-Intentions) and practical computational systems that actually implement intelligent behavior?

**Irreplaceable Contribution**: This paper uniquely demonstrates how to make BDI agent theory *executable* by grounding it in Extended Logic Programming (ELP) with explicit negation and paraconsistent semantics. Unlike most BDI formalizations that remain theoretical specifications, this work provides operational semantics—actual proof procedures and revision mechanisms—that allow the same model to serve as both formal specification AND reasoning engine. It shows that the gap between theory and implementation isn't fundamental but stems from choosing logical formalisms without computational grounding.

## KEY IDEAS (3-5 sentences each)

1. **The Theory-Implementation Gap is a Formalism Problem**: Most BDI logics lack operational models (proof procedures, reasoning mechanisms) that make them computational. The authors argue you can either extend existing BDI logics with operational semantics OR choose a formalism that's already both expressive and computational. They take the second path, using Extended Logic Programming, demonstrating that the "gap" isn't inevitable—it's a consequence of using logics designed for specification rather than computation.

2. **Explicit Negation Enables Intentional Reasoning**: Normal logic programs represent absence implicitly (closed-world assumption), but mental states require explicit representation of negative information—"I believe X does NOT hold" differs from "I don't believe X holds." Extended Logic Programming adds explicit negation, allowing agents to represent contradictory desires, detect conflicts, and reason about what they actively intend NOT to happen. This distinction is crucial for modeling pro-attitudes where conflict is natural.

3. **Paraconsistent Semantics Makes Contradiction Productive**: When desires conflict (as they naturally do before deliberation), you need semantics that assign meaning to contradictory programs rather than making everything trivially true. The WFSX paraconsistent semantics lets agents detect contradictions, minimally revise beliefs/intentions to restore consistency, and use this revision mechanism to perform defeasible and abductive reasoning. Contradiction becomes a signal for deliberation rather than catastrophic failure.

4. **Commitment Requires Computational Constraints, Not Just Axioms**: The authors model commitment not as logical axioms about "intention persistence" but as constraints in the revision mechanism—adopted intentions become part of the consistency requirements for adopting new intentions. This makes commitment *operational*: new intentions are only adopted if they don't contradict existing ones. Revision is triggered by specific conditions (time exceeded, action executed, more important desires become eligible) rather than continuous re-evaluation.

5. **Preference Over Revisions Enables Practical Deliberation**: When multiple subsets of desires are jointly achievable, agents need preference criteria beyond logical consistency. The authors implement this through a preference graph over revisions: prefer satisfying more important desires first, then maximize the number of desires satisfied. This isn't just a tie-breaker—it's computational deliberation encoded in the revision structure, allowing agents to make rational choices without exhaustive search.

## REFERENCE DOCUMENTS

### FILE: computational-commitment-through-revision-constraints.md

```markdown
# Computational Commitment Through Revision Constraints: How Intentions Filter Future Intentions

## The Problem: Making Commitment Operational

One of the deepest challenges in building rational agent systems is making the notion of *commitment* operational. Philosophical and logical accounts of intention typically describe commitment as a property that distinguishes intentions from mere desires: "Intentions involve a characteristic commitment—both to the intended end and to the means one believes will achieve it" (Bratman, quoted throughout BDI literature). But how does this become something a running system actually *does*?

The traditional approach in BDI logics is to define commitment through axioms describing when intentions persist or are reconsidered. These are *descriptive*—they characterize what an idealized rational agent would do. But as Móra et al. observe, "the logical formalisms used to define the models do not have an operational model that support them. By an operational model we mean proof procedures that are correct and complete with respect to the logical semantics, as well as mechanisms to perform different types of reasoning needed to model agents" (p. 12).

This paper's central insight is that commitment becomes operational when you implement it as *constraints in a revision process*. Rather than axioms that describe persistence, you have computational mechanisms that enforce consistency requirements. Adopted intentions become part of the logical program's integrity constraints—new intentions must not contradict existing ones or the revision fails.

## Extended Logic Programming as the Computational Substrate

The authors ground their BDI model in Extended Logic Programming (ELP) with the Well-Founded Semantics eXtended for explicit negation (WFSX). This choice is critical. ELP provides three features essential for operational commitment:

**1. Explicit Negation for Mental States**: Normal logic programs only have negation-as-failure (implicit negation)—"not P" means "cannot prove P." But mental states require explicit representation of negative information. An agent believing "the door is NOT open" differs fundamentally from an agent failing to believe "the door is open." The first is positive information; the second is absence. 

As the authors state: "This extension allows us to explicitly represent negative information (like a belief that a property P does not hold, or an intention that a property Q should not hold) and increases the expressive power of the language" (p. 12). An intention might be "ensure property P does NOT hold"—you cannot represent this with implicit negation alone.

**2. Paraconsistent Semantics for Deliberation**: When an agent has conflicting desires (which is natural before deliberation), the logical program becomes contradictory. Classical logic makes contradictory theories trivial—everything becomes provable. The WFSX paraconsistent semantics assigns meaning to contradictory programs: "When we introduce negative information, we may have to deal with contradictory programs. The ELP framework... provides a mechanism to determine how to minimally change a logic program in order to remove contradictions" (p. 12).

This isn't just fault tolerance—it's the computational mechanism for deliberation itself. The agent detects contradictions in candidate intention sets, then systematically revises the program to restore consistency, exploring alternative commitments.

**3. Revision Mechanisms for Non-Monotonic Reasoning**: ELP provides a well-defined revision procedure that "changes the truth value of revisable literals in a minimal way and in all alternative ways of removing contradiction" (p. 14). The user designates which literals are revisable (desires to potentially abandon, actions to potentially abduce). The revision mechanism explores minimal changes, producing all alternative consistent programs.

Crucially, you can define *preference orders* over revisions using a labeled DAG. This lets you encode deliberation strategies: "Sometimes, it may be necessary to state that we do not only want the minimal revisions provided by the formalism, but also that we prefer revisions that have a certain fact only after finding that no other revisions including other facts exist" (p. 14).

## Intentions as Consistency Constraints

The operational model of commitment emerges from Definition 4 (Intentions Set), particularly condition 5: An intention set I is valid only if "¬∃(P' ∪ Δ ⊨ ⊥)", where P' is the abductive framework containing beliefs, time axioms, and "IC(I) is set of constraints generated by intentions" (p. 18).

What are these intention-generated constraints? For every adopted intention "int_that(I, Ag, P, A)" requiring property P at time T, there's a constraint: "holds_at(bel(Ag, P), T) ←" (must be satisfied). For every adopted intention to perform action Act, there's a constraint requiring that action happens.

These aren't suggestions—they're integrity constraints. The logical program is contradictory if they're violated. When selecting new intentions (either from desires or as plan refinements), the agent performs abduction with these constraints active. As Definition 12 (Relative Intentions) states: "A planning process... will generate a set of temporal ordered actions I_R that achieve i, such B ∪ TAx ∪ I_P ∪ I_R is non-contradictory" (p. 22).

The non-contradiction condition operationalizes commitment: "The non-contradiction condition enforces again the notion of commitment, i.e., once an intention is adopted it constrains the adoption of new intentions" (p. 23).

## The Side-Effect Problem and Constraint-Based Solutions

This approach elegantly solves Bratman's "side-effect problem": An agent intending to do α and believing α implies β need not intend β. Classical logical closure would make all logical consequences of intentions also be intentions—but humans don't work this way.

The authors solve this by distinguishing the *intentions set* (explicitly adopted commitments) from *believed consequences*. Side effects of intended actions are consequences in the Event Calculus model but aren't in the intentions set I. As they note: "an agent does not intend the side-effects of its intentions, as the side-effects are not in the intentions set" (p. 18, footnote 4).

But the side-effect problem has a second part: side effects shouldn't *prevent* intention adoption unless they directly contradict existing intentions. The EC axiom for holds_at embodies this: "if actions that make contradictory properties hold in fact just cancel each other... If we allowed for this kind of situations to raise contradictions, we would be making the agent preclude intentions that have contradictory consequences, but that are not directly contradictory with each other" (p. 22).

Only when an action required by a new intention would terminate a property that's itself an intention does a constraint violation occur, triggering revision. This fine-grained control comes from making constraints computational rather than axiomatic.

## Triggered Revision: When to Reconsider Commitment

A committed agent shouldn't constantly re-evaluate intentions—that wastes the computational savings commitment provides. But blind commitment to failed or superseded intentions is irrational. The model addresses this through *trigger constraints* that raise contradictions under specific conditions, forcing revision.

Definition 14 (Trigger from Intentions) adds to beliefs: "(?← Now > T, not rev_int) for each (int_that(I, Ag, P, A); int_to(I, Ag, Act, A)) ∈ I" (p. 23). If time expires or an intended action executes, a contradiction arises unless rev_int (a revisable literal) becomes true. The agent detects this during routine belief maintenance: "Whenever the agent revises its beliefs and one of the conditions for revising beliefs hold, a contradiction is raised. We identify such contradiction by testing if rev_int is in the selected revision for the beliefs set" (p. 23).

More subtly, Definition 15 adds triggers from desires: If a previously-ineligible desire (more important than current intentions) becomes eligible due to changed beliefs, this raises a contradiction forcing reconsideration. "The first constraint trigger is formed by the pre-conditions of those desires that were not eligible and that are more important than those that were evaluated... if the pre-conditions of such desires become true... it is necessary to re-evaluate desires and beliefs" (p. 24).

This implements Bratman's insight that commitment should be broken when the reasons for it are superseded: "we take the stance that the same reasons that originated intentions may be used to break commitment associated to them" (p. 24).

## Application to Agent System Design

For multi-agent orchestration systems, this model provides concrete design patterns:

**Intention as Filter Architecture**: Store adopted intentions as active constraints in the agent's knowledge base. When planning (task decomposition, skill selection), perform abductive reasoning with these constraints enforcing consistency. This prevents the system from generating plans that conflict with existing commitments without explicit reconsideration.

**Lightweight Commitment Monitoring**: Don't poll "are my intentions still valid?" Instead, embed trigger constraints in the belief maintenance system. Contradictions during routine updates signal when reconsideration is needed. The rev_int pattern provides a clean API: normal operation preserves rev_int = false; contradiction in presence of trigger literals flips it, signaling the deliberation subsystem.

**Preference-Ordered Deliberation**: When selecting from multiple candidate intention sets (different ways to satisfy desires), implement preference as a revision graph. The graph structure encodes "try to satisfy all desires first (bottom level); if that fails, try dropping less important desires before more important ones (subsequent levels)." This is more efficient than generate-and-test over the power set.

**Graceful Degradation Under Conflict**: When new high-priority goals arrive that conflict with current activities, the revision mechanism automatically finds minimal changes. Instead of "drop everything" or "ignore new goals," the system computes which current intentions to abandon to accommodate more important new ones, preferring smaller changes.

## Boundary Conditions and Limitations

This model makes several assumptions that limit its applicability:

**Assumes Consistent Belief Maintenance**: The model doesn't address belief revision—it assumes beliefs are kept consistent externally. For real systems, you'd need to integrate belief revision (the authors mention Alferes, Pereira work as compatible approaches).

**Computationally Expensive Deliberation**: Revision over logic programs, especially with preference graphs, can be expensive. The model is appropriate for deliberation (infrequent intention selection) but not for reactive response. The authors don't address hybrid architectures with separate reactive and deliberative layers.

**Single-Agent Perspective**: The model defines one agent's cognitive structure. Multi-agent coordination, communication, joint intentions require extensions. The commitment mechanism would need to account for commitments to other agents, not just internal consistency.

**Static Preference Structures**: The preference graph over desires is defined a priori. Real agents might need to learn or dynamically adjust preferences. The model provides the mechanism but not the meta-level reasoning about preferences themselves.

**Action-Effect Axiomatization Required**: The Event Calculus requires explicit initiates/terminates axioms for all actions. In open domains, this is a significant knowledge engineering burden. The model works best in structured environments with well-defined action models.

## The Deeper Lesson: Operational Semantics for Rationality

The fundamental contribution isn't the specific BDI formalization but the *methodology*: Bridge the theory-practice gap by choosing formalisms with operational semantics from the start, rather than treating computation as an afterthought. As the authors argue: "Instead of defining a new BDI logic or choosing an existing one, and extending it with an operational model, we define the notions of belief, desires and intentions using a logical formalism that is both well-defined and computational" (p. 12).

This inverts the typical approach in AI. Usually: (1) define idealized rational behavior logically, (2) prove theorems about it, (3) try to implement something "inspired by" the theory. The gap emerges because step 3 requires reinventing operational semantics, often abandoning formal properties. 

The alternative: (1) choose a formalism with both logical semantics and proof theory, (2) define rationality concepts within it, (3) the implementation *is* the formal model executing. There's no gap because there's no translation step—the formal model is already computational.

For WinDAG systems: When designing cognitive capabilities (goal management, commitment tracking, conflict resolution), favor representations that are directly executable rather than requiring interpretation. Logic programming with well-defined semantics, production systems with proven control algorithms, constraint solvers with sound propagation—these provide both formal specification and operational implementation.

The lesson applies beyond BDI agents: Any intelligent system component bridging deliberation and execution benefits from representations where formal properties and computational behavior aren't separate concerns but unified through operational semantics.
```

### FILE: desires-as-search-space-not-commands.md

```markdown
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
```

### FILE: abduction-as-intention-feasibility-check.md

```markdown
# Abduction as Intention Feasibility Check: How Rational Agents Avoid Impossible Commitments

## The Rationality Constraint: Intending the Possible

A core principle of rational agency is that agents shouldn't commit to goals they believe are impossible to achieve. As Móra et al. state in their non-triviality condition: "an agent should not intend something it believes is already satisfied or that will be satisfied with no efforts by the agent" (p. 18). More fundamentally, condition 5 in Definition 4 requires: "¬∃(P' ∪ Δ ⊨ ⊥)" where P' includes beliefs and temporal axioms, meaning the agent must believe there exists a course of actions consistent with achieving the intended state.

This raises an implementation question: How does an agent *check* if a goal is achievable before committing? In real environments, you can't exhaustively verify reachability—the state space is too large, actions have uncertain effects, and the environment changes. But you need *some* feasibility check or the agent commits to fantasy goals.

The paper's answer: Use abductive reasoning to hypothesize a course of actions that would satisfy the goal. If abduction succeeds (finds a consistent explanation), the goal is provisionally feasible. If it fails (no consistent explanation exists), the goal is currently impossible given beliefs.

## Abduction in Extended Logic Programming

The authors define abduction formally: "Abductive reasoning consists of, given a theory T and a set of observations O, to find a theory Δ such that T ∪ Δ ⊨ O and T ∪ Δ is consistent" (p. 14). In the ELP context, an abductive framework is "P' is a tuple ⟨P, Abd, IC⟩, where P is an extended logic program, Abd is the set of abducible literals and IC is the set of integrity constraints. An observation O has an abductive explanation Δ iff P' ∪ Δ ⊨ O and P ⊨ Δ" (p. 14).

Translation for agent architectures: Given a goal G (the observation to explain), the agent's beliefs and action models (the theory P), and integrity constraints (including already-adopted intentions), find a set of hypothesized action occurrences Δ (from the abducible predicates) such that executing those actions would achieve G without contradiction.

The abducible predicates in this model are: "Abd = {happens(E, Ti, Tf), act(E, Act)}" (from Definition 10, p. 21). These represent hypothetical events: "happens(e1, 0, 5)" means "suppose event e1 occurs from time 0 to 5", and "act(e1, move_to(loc2))" means "e1 is an execution of the move_to(loc2) action."

The integrity constraints IC include:
1. **Intention constraints**: For each existing intention int_that(I, Ag, P, A), there's a constraint "holds_at(bel(Ag, P), T) ←" requiring P hold at time T
2. **Desire constraints**: For each candidate desire, "holds_at(bel(Ag, P), T) ← not unsel(D)" requiring P hold if desire D is selected (not unselected)
3. **Event coherence**: Events must have associated actions, valid time intervals, no duplicate occurrences (see EC constraints, p. 15-16)

Abduction searches for values of abducible literals that satisfy all constraints. If it succeeds, Δ is a "plan sketch"—a hypothetical sequence of actions that would achieve the goal.

## Abduction vs. Planning: The Crucial Difference

It's critical to understand: This is NOT full planning. The paper uses abduction for *feasibility checking*, not plan execution. The difference:

**Planning** produces a detailed, executable sequence of actions with preconditions verified, resources allocated, and contingencies handled. Planning is expensive—you explore a search space of action sequences, prune infeasible branches, and optimize over multiple criteria.

**Abduction** produces a hypothetical explanation: "If these actions were to occur in this order, the goal would be achieved." It doesn't verify executability, acquire resources, or handle execution failures. It's a consistency check: "Is there a conceivable path to this goal given what I believe?"

The authors are explicit about this role: "In order to know if a given property P holds at time T, the EC checks what properties remain valid after the execution of the actions that happened before T. We are now ready to define the agent's model" (p. 16, emphasis added). The Event Calculus allows reasoning about hypothetical action consequences, not actual execution.

This separation is architecturally important. During deliberation (selecting intentions), the agent needs to quickly evaluate many candidate goal sets. Expensive planning for each candidate would make deliberation intractable. Abductive feasibility checking is cheaper—it asks "is there any explanation?" not "what is the best plan?"

Once intentions are adopted, *then* the agent invokes full planning: "Once the agent adopts its intentions, it will start planning to achieve those intentions" (p. 22). Planning elaborates the abstract action hypotheses from abduction into executable plans with resource allocation, contingencies, etc.

## How Abduction Works in the Candidate Desires Selection

Definition 10 (Candidate Desires Set) shows abduction in action. The agent has a set D' of eligible desires. For each subset R ⊆ D', it attempts to find a revision (minimal change to revisable literals) such that:

1. **All desires in R are satisfied**: For each des(D, Ag, P, A) in R, the constraint "holds_at(bel(Ag, P), T) ← not unsel(D)" must hold
2. **Existing intentions remain satisfied**: Constraints IC(I) from current intentions must hold
3. **The program is consistent**: P' ∪ Δ ⊭ ⊥ (no contradiction)

The revision mechanism searches over values for literals in Abd (actions to abduce) and "unsel(D)" literals (desires to unselect). At the bottom level of the preference graph, "Rev(bottom) = {happens(E, Ti, Tf), act(E, A)}" (Definition 9, p. 20)—try to find actions satisfying all eligible desires.

If revision succeeds without changing any unsel(D) literals (they all remain false), all eligible desires are jointly achievable—there exists an abduced action sequence Δ satisfying them all. That's a candidate desires set.

If revision requires some unsel(D) to become true, those desires must be dropped to restore consistency. The preference graph guides which to drop: less important ones first, fewer if possible. Multiple revisions might exist (multiple candidate sets), each with a different subset of desires satisfied.

## Example: Warehouse Robot Feasibility Checking

Consider the warehouse robot example (Example 5, continued in 13, 16). Initially it has desires:
- des(d1, rbt, stored(a), [0.5]) — store object a
- No battery desire yet (precondition "low battery" not believed)

Eligible desires: {des(d1, ...)}. Abduction attempts: Find Δ such that holds_at(bel(rbt, stored(a)), T) given beliefs that initiates(E, Tf, bel(rbt, stored(O))) ← happens(E, Ti, Tf), act(E, store(O)).

Solution: Δ = {happens(e1, now, now+5), act(e1, store(a))}. If event e1 (a store(a) action) happens, stored(a) will hold. No contradiction—feasible. The desire is adopted as primary intention: I_P = {int_that(i1, rbt, bel(rbt, stored(a)), [0.5])}.

Later, a sense_low_bat event occurs. This makes the battery desire eligible:
- des(d2, rbt, bat_charged, [0.9])

Now eligible desires: {d1 (still not completed), d2 (newly eligible)}. Abduction attempts to find Δ satisfying both. But beliefs include:
- initiates(E, Tf, bel(rbt, bat_charged)) ← happens(E, Ti, Tf), act(E, charge)
- initiates(E, Tf, bel(rbt, stored(a))) ← happens(E, Ti, Tf), act(E, store(a))

And from EC axioms plus typical action models, charge requires being at base, store requires being at storage location—these are mutually exclusive at the same time. Moreover, the robot has limited battery, so it can't store *then* charge—it would run out of power.

Abduction at bottom level fails (cannot satisfy both). Revision must unselect one desire. The preference graph has:
- Rev(bottom) = {happens, act} — try all desires
- Rev(level1) = {unsel(d1)} ∪ Rev(bottom) — drop d1 (importance 0.5)
- Rev(level2) = {unsel(d2)} ∪ Rev(bottom) — drop d2 (importance 0.9)

Prefer revisions with fewer unsel changes first, less important desires first. Revision at level1 succeeds: unsel(d1) = true drops the storage desire, Δ = {happens(e2, t1, t2), act(e2, charge)} satisfies battery desire. Candidate set: {d2}.

The agent adopts int_that(i2, rbt, bat_charged, [0.9]), dropping the storage intention. Example 16 shows the robot now charges instead of storing.

This is abduction performing feasibility+prioritization: "Can I achieve both? No. Can I achieve the more important one? Yes, by abducing the charge action."

## Boundary Conditions: When Abduction Is Insufficient

Abduction-based feasibility checking has several limitations:

**1. Completeness of Action Models**: Abduction relies on initiates/terminates axioms in the Event Calculus. If action effects are incompletely specified, abduction may spuriously succeed (abduce an action whose negative side effects aren't modeled) or fail (not find achievable goals because enabling actions aren't in the model).

The authors assume: "The EC allows us to reason about the future, by hypothetically assuming a sequence of actions represented by happens= and act= predicates and verifying which properties would hold" (p. 16). This requires comprehensive action models—a significant knowledge engineering burden in open domains.

**2. Resource and Timing Abstraction**: The simple EC formulation doesn't model resource consumption, continuous quantities, or complex temporal constraints. An abduced action sequence might be infeasible due to resource limits (not enough fuel, memory, etc.) or timing (action A takes so long that deadline for B is missed).

Handling this requires richer models. Some options:
- Extend EC with resource fluents (consumable quantities)
- Add explicit time arithmetic constraints
- Perform abduction, then validate the sketch with a resource-aware planner

**3. Probabilistic and Uncertain Effects**: Abduction in ELP is purely logical—actions deterministically initiate/terminate properties. Real actions have uncertain effects. Abduction says "if this action occurs, the goal will hold" but doesn't handle "this action has 70% success probability."

Combining abduction with probabilistic reasoning (Bayesian networks, Markov models) is an open research problem. One approach: Abduce a plan sketch, then evaluate its probability using a probabilistic model.

**4. Scalability**: Abduction is a search problem. In the worst case, it's intractable (depending on theory structure). The ELP framework provides optimization, but for large action spaces or deeply nested goals, abduction may be too slow for online deliberation.

Mitigations:
- Restrict abducibles (only certain actions are abducible)
- Use heuristics to guide search (domain-specific abduction strategies)
- Cache abduction results (memoize feasible goal-action mappings)
- Hierarchical abduction (abduce abstract actions, refine later)

**5. Reactive vs. Deliberative Context**: Abduction is appropriate during deliberation (low-frequency, high-deliberation), not reactive response. If a situation demands immediate action (emergency), there's no time for abductive feasibility checking. The agent needs pre-compiled reactive policies.

The paper's architecture assumes a deliberative layer (where abduction happens) and an execution layer (where plans run). Purely reactive agents don't fit this model.

## Application to WinDAG Agent Systems

For orchestration systems with 180+ skills, abduction provides a feasibility check for skill chains:

**Goal**: "Analyze code for security vulnerabilities"  
**Abducibles**: Skill invocations (code_scan, dependency_check, taint_analysis, ...)  
**Beliefs**: Skill preconditions (code_scan requires source code file, taint_analysis requires call graph, ...)  
**Integrity Constraints**: Goals to achieve (vulnerabilities identified), resource limits (time budget, memory), consistency (don't invoke conflicting skills simultaneously)

**Abduction Query**: Find skill invocation sequence that achieves goal while satisfying constraints.

If abduction succeeds, produce a skill chain: [fetch_code → parse → build_call_graph → taint_analysis → vulnerability_report]. If it fails (e.g., source code unavailable, no skill can produce required intermediate artifacts), reject the goal as infeasible.

This prevents the orchestrator from attempting impossible task decompositions. Without feasibility checking, it might assign skills that can't produce the required results, wasting resources and failing opaquely.

Implementation sketch:

```python
class OrchestrationAbduction:
    def __init__(self, skill_registry, belief_base):
        # skill_registry: maps skills to preconditions/effects
        # belief_base: current environment state
        
    def check_goal_feasibility(self, goal, constraints):
        """
        Returns: (feasible: bool, skill_chain: List[Skill] | None)
        """
        abducibles = self._get_candidate_skills(goal)
        
        for skill_sequence in self._generate_sequences(abducibles):
            if self._simulate_execution(skill_sequence, goal, constraints):
                return (True, skill_sequence)
        
        return (False, None)
    
    def _simulate_execution(self, skills, goal, constraints):
        """Event Calculus simulation: would these skills achieve goal?"""
        state = self.belief_base.copy()
        
        for skill in skills:
            # Check preconditions
            if not skill.preconditions_satisfied(state):
                return False
            
            # Apply effects (initiates/terminates)
            state.update(skill.effects())
            
            # Check constraints (time, resources, ...)
            if not constraints.check(state):
                return False
        
        # Goal achieved?
        return goal.satisfied(state)
```

The key: Abduction is cheap hypothesis checking, not full planning. It answers "is this goal feasible in principle?" not "what is the optimal plan?"

## The Deeper Lesson: Rationality Requires Possibility Checking

The broader lesson transcends BDI agents: Rational commitment requires feasibility checking. Before allocating resources to a goal (time, compute, tokens), verify it's achievable. Systems that blindly accept all requests and attempt impossible tasks waste resources and degrade performance.

The challenge: Full planning is too expensive for every potential goal. The solution: Use a lightweight consistency check (abduction, constraint satisfaction, reachability analysis) to filter out obvious impossibilities before investing in detailed planning.

This applies to:
- **Task schedulers**: Check if deadlines are feasible before accepting tasks
- **Query planners**: Verify query is answerable before executing expensive joins
- **Code generators**: Check if specification is implementable before generating (avoid hallucinated APIs)
- **Multi-agent systems**: Verify joint goals are achievable before committing to cooperation

The pattern: Use a weaker, cheaper reasoning method (abduction, SAT solving, graph reachability) as a "gate" before expensive reasoning (planning, execution, learning). Accept only goals that pass the gate.

Móra et al. show that abduction is a natural fit for this gate in BDI architectures: It operates on the same belief/action representation, provides yes/no feasibility answers, and integrates with the revision mechanism for handling conflicts. The specific technique might differ in other architectures, but the principle—check feasibility before commitment—is universal for rational agents.
```

### FILE: revision-mechanisms-as-non-monotonic-deliberation.md

```markdown
# Revision Mechanisms as Non-Monotonic Deliberation: How Rational Inconsistency Drives Choice

## The Problem: Deliberation Is Conflict Resolution

A deep challenge in building practical rational agents is that deliberation fundamentally involves reasoning with inconsistency. Before committing to intentions, an agent has conflicting desires—states of affairs that cannot all be achieved simultaneously. Classic logical frameworks make contradictory theories useless (explosion: from ⊥ prove anything). Yet deliberation *requires* entertaining contradictory possibilities before choosing among them.

Móra et al. solve this by building their BDI model on Extended Logic Programming with paraconsistent semantics (WFSX). The crucial move: "When we introduce negative information, we may have to deal with contradictory programs. The ELP framework, besides providing the computational proof procedure for theories expressed in its language, also provides a mechanism to determine how to minimally change a logic program in order to remove contradictions" (p. 12).

This isn't just fault tolerance—it's the *computational realization of deliberation itself*. The agent:
1. Represents conflicting desires as a (potentially contradictory) logic program
2. Detects contradictions through the paraconsistent semantics
3. Uses revision to systematically explore minimal consistent subsets
4. Selects preferred revisions based on desire attributes

Deliberation becomes a *revision search process*: Find minimal changes to the program that restore consistency, prefer changes that preserve more important information.

## Paraconsistent Semantics: Giving Meaning to Contradiction

The Well-Founded Semantics eXtended for explicit negation (WFSX) is paraconsistent: It assigns meaning to contradictory programs without making everything provable. Key insight: Distinguish *local* contradiction (a specific literal is both provable and refutable) from *global* inconsistency (the entire theory is useless).

WFSX_P (the paraconsistent version) allows queries to have truth values even when the program contains contradictions. A literal L can be:
- **True**: L is provable (L ∈ I for interpretation I)
- **False**: not L is provable (not L ∈ I)
- **Contradictory**: Both L and ¬L are provable (L ∈ I and ¬L ∈ I)
- **Undefined**: Neither L nor ¬L is provable

This granularity matters for agents: If desires A and B conflict (both provably should hold, but they're mutually exclusive given action models), the contradiction is isolated to those literals. Other reasoning remains valid—the agent doesn't "lose its mind" due to conflicting desires.

The authors use this to detect when intention selection is impossible: "P' ∪ Δ ⊨ ⊥" in Definition 4 (p. 18) means the abduced actions Δ, combined with beliefs and existing intentions, entail a contradiction. This triggers revision.

## Revision as Minimal Theory Change

The ELP revision mechanism is formally defined: Given a contradictory program P and a set Rev of revisable literals, compute alternative programs P' that differ minimally from P in the truth values of literals in Rev, such that P' is consistent (p. 14).

**Revisable literals** are those the agent is willing to change to restore consistency. In the BDI model:
- During intention selection: "unsel(D)" literals (whether to unselect desire D) and abducible predicates "happens/act" (which actions to abduce)
- During belief updates: "rev_int" literal (whether to trigger intention reconsideration)

**Minimality** is defined set-theoretically: A revision is minimal if no proper subset of its changes would also restore consistency. This implements the principle of *minimal mutilation*: Change as little as possible.

The revision mechanism produces *all* minimal revisions. When multiple exist, the agent must choose. This is where preference enters.

## Preference Graphs: Encoding Deliberation Strategy

The authors extend basic revision with *preference ordering* over revisions using a labeled DAG (Definition 9, p. 20-21). The graph structure encodes "try these revisions before those."

For intention selection from desires, the graph is:
- **Bottom level**: Rev(bottom) = {happens(E, Ti, Tf), act(E, A)} — abduce actions, don't unselect desires
- **Level i**: Rev(i) = {unsel(Di)} ∪ Rev(bottom) where Di has importance rank i — unselect desires of rank i
- **Edges**: i → bottom for all i; if Des(rank_j) is less important than Des(rank_i), then level_i → level_j

Graph semantics: Try revisions at descendant nodes before ancestors. At bottom, try to satisfy all eligible desires by finding actions. If impossible, move to level 1: drop the least important desire. If still impossible, level 2: drop next-least important, etc.

Within a level, if multiple minimal revisions exist (e.g., two equally unimportant desires, can drop either), all are generated. The agent can then apply secondary criteria (e.g., "prefer more desires satisfied" from Definition 7).

This graph structure is **deliberation logic encoded as revision preferences**. Instead of a procedural algorithm ("sort desires by importance, greedily select until conflict"), the same strategy emerges from the graph's declarative structure.

## Defeasible and Abductive Reasoning Through Revision

The paper identifies two forms of non-monotonic reasoning implemented via revision:

**Defeasible Reasoning**: Rules are default—normally hold but can be overridden. "A defeasible rule is a rule of the form Normally if A then B. ELP allows us to express defeasible reasoning... To remove contradiction, we revise the truth value of revisable literals in the body of the defeasible rules" (p. 14).

In the BDI model, desires are defeasible: "holds_at(des(D, Ag, P, A), T) ← Body" normally generates an intention, but if it conflicts with higher-priority desires, the desire is defeated (unsel(D) becomes true, blocking the rule).

**Abductive Reasoning**: Explain observations by hypothesizing causes. "An observation O has an abductive explanation Δ iff P' ∪ Δ ⊨ O and P ⊨ Δ" (p. 14). The agent makes observations (goals to achieve), hypothesizes actions (abducibles) that would cause those goals, checks consistency.

When selecting candidate desires (Definition 10, p. 21), the agent performs abduction: Explain each desired property by finding a happens/act sequence that would cause it. If no consistent explanation exists for all desires, revise by dropping some.

This unifies defeasible and abductive reasoning under a single mechanism: revision with preference graphs. The same computational machinery handles both "what should I believe/intend by default?" (defeasible) and "what actions would explain/achieve this?" (abductive).

## The Revision-Based Deliberation Algorithm

Synthesizing the definitions, here's the deliberation algorithm:

```
Algorithm: Select Intentions from Desires
Input: D (desires), B (beliefs), I (current intentions), TAx (time axioms)
Output: I_P (primary intentions), Δ (abduced action sketch)

1. Compute eligible desires D':
   D' = {des ∈ D | preconditions satisfied, not already believed achieved}

2. Construct abductive framework:
   P' = ⟨B ∪ TAx ∪ I, Abd={happens, act}, IC(I) ∪ IC(D')⟩
   where IC(D') = {holds_at(bel(Ag, P), T) ← not unsel(D) | des(D, _, P, _) ∈ D'}

3. Construct preference graph:
   - Rev(bottom) = {happens, act}
   - For each importance level i: Rev(i) = {unsel(D) | importance(D) = i} ∪ Rev(bottom)
   - Edge structure: prefer bottom, then lower importance

4. Perform revision:
   Minimal_Revisions = revise(P', Revisables={happens, act, unsel(D)}, PrefGraph)

5. Select preferred revision:
   Best_Revision = select_by_secondary_criteria(Minimal_Revisions)
   // E.g., prefer more desires satisfied among equal importance

6. Extract intentions:
   D'_C = {des(D, Ag, P, A) ∈ D' | unsel(D) = false in Best_Revision}
   I_P = {int_that(D, Ag, P, A) | des(D, Ag, P, A) ∈ D'_C}
   Δ = {happens/act literals in Best_Revision}

7. Return (I_P, Δ)
```

The expensive step is revision (step 4)—searching for consistent assignments to revisable literals. But the preference graph prunes search: Explore preferred levels first, backtrack to less preferred only if necessary.

## Example: Robot Deliberation Through Revision

Return to warehouse robot (Example 16, p. 25). After sensing low battery:

**Eligible desires**: 
- D' = {des(d1, rbt, stored(a), [0.5]), des(d2, rbt, bat_charged, [0.9])}

**Preference graph**:
- Rev(bottom) = {happens, act}
- Rev(level_low) = {unsel(d1)} ∪ Rev(bottom) (d1 has importance 0.5)
- Rev(level_high) = {unsel(d2)} ∪ Rev(bottom) (d2 has importance 0.9)
- Edges: level_low → bottom, level_high → bottom (prefer bottom)

**Revision search**:

1. Try bottom level: Abduce actions satisfying both desires
   - Need: happens(e1, ...), act(e1, charge) for bat_charged
   - Need: happens(e2, ...), act(e2, store(a)) for stored(a)
   - But: charge requires at_base, store requires at_storage (mutually exclusive given single-location robot)
   - **Contradiction detected** (cannot satisfy IC(D') for both)

2. Move to next level: level_low (drop d1)
   - Set unsel(d1) = true (defeats storage desire)
   - Now IC(D') requires only bat_charged
   - Abduce: happens(e1, t1, t2), act(e1, charge)
   - Check: Consistent with beliefs (robot can reach charger)
   - **Success**: Revision found

3. No need to explore level_high (already have revision at preferred level)

**Output**:
- D'_C = {des(d2, rbt, bat_charged, [0.9])} (d1 dropped)
- I_P = {int_that(i2, rbt, bat_charged, [0.9])}
- Δ = {happens(e1, t1, t2), act(e1, charge)}

The robot commits to charging, drops storage intention. This emerges from revision mechanics—no explicit procedural code saying "if conflict, prefer higher importance."

## Hybrid Revision: Mixing Defeasible and Abductive

A subtle point: Revision simultaneously handles multiple reasoning modes. In the desire selection:

- **Abduction**: Finding happens/act literals that explain desired properties
- **Defeasibility**: Defeating desires (unsel literals) that cause conflicts

These interact: Dropping a desire (defeasible) changes which properties need explaining (abductive). If Des1 and Des2 conflict, you can either:
- Drop Des1 (set unsel(d1) = true), then abduce actions for Des2
- Drop Des2 (set unsel(d2) = true), then abduce actions for Des1

Both are valid revisions. Preference determines which to prefer (importance of Des1 vs Des2).

The revision mechanism doesn't distinguish these reasoning modes—it just searches for consistent assignments to revisable literals. The problem formulation (which literals are revisable, what constraints they participate in) determines the reasoning flavor.

This unification is powerful: You can mix multiple reasoning forms (defeasible rules, abductive hypotheses, belief revision, temporal reasoning) in a single framework, with consistent semantics.

## Implementation Considerations for Agent Systems

For WinDAG orchestration, revision-based deliberation suggests specific architectural patterns:

**1. Maintain a Contradiction-Tolerant Knowledge Base**: Don't reject inconsistent information at input—accept it and use contradiction detection as a signal. When skill outputs conflict (skill A says "vulnerability found," skill B says "no vulnerability"), don't crash or arbitrarily pick one. Record both, detect contradiction, trigger reconciliation.

**2. Define Revisable vs. Non-Revisable**: Clearly distinguish beliefs/intentions that are negotiable from those that are fixed. In a WinDAG system:
- **Revisable**: Skill selection (which skills to invoke), goal prioritization (which objectives to pursue), hypothesized facts (abduced intermediate results)
- **Non-Revisable**: User constraints (security policy), physical laws (system architecture facts), verified results (test outcomes)

This prevents revision from "explaining away" hard constraints to avoid contradictions.

**3. Implement Preference as Constraint Priorities**: Many constraint-solving systems support soft constraints with priorities (e.g., Answer Set Programming with weak constraints, SMT solvers with MaxSMT). These can implement preference graphs: Hard constraints are non-negotiable (integrity constraints), soft constraints are defeatable (desire rules), priorities define preference.

**4. Cache Revisions**: Revision search can be expensive. If the same or similar conflicts recur, cache the computed revisions. When Desires A, B conflict, remember "drop B, abduce action C" as a solution. If A, B recur later, reuse the solution (if beliefs haven't invalidated it).

**5. Incremental Revision**: When beliefs change slightly, avoid full revision. Compute a *delta*: Which parts of the previous revision are still valid? Only revise invalidated parts. This requires maintaining a dependency structure (which revised literals depend on which beliefs).

**6. Bounded Revision**: For time-critical decisions, set a budget (max search nodes, time limit). If revision doesn't complete, fall back to heuristic policies (e.g., "drop all low-priority goals, keep high-priority"). This trades optimality for responsiveness.

## When Revision-Based Deliberation Applies

This approach excels when:
- **Conflicts are expected and frequent**: Domains where contradictory requirements are normal (multi-stakeholder systems, over-subscribed resources)
- **Preferences are complex**: Simple priority rankings aren't enough; trade-offs depend on context
- **Explanations matter**: Need to justify why goals were dropped (audit trail for revision decisions)
- **Logical structure is rich**: Constraints involve implications, negations, quantifiers (not just flat scoring)

It's less suitable for:
- **Purely numerical optimization**: If deliberation is just "maximize utility function," use optimization solvers, not logic programming
- **Real-time reactive control**: Revision search latency is too high for tight control loops
- **Domains with weak structure**: If there are no clear constraints/rules, just preferences, ranking/scoring is simpler

The sweet spot: Complex, over-constrained problems where finding *any* feasible solution is non-trivial, and multiple feasible solutions exist with different trade-offs. This describes many orchestration/planning problems in agent systems.

## The Deeper Lesson: Contradiction as Computational Resource

The profound insight: Contradiction is not a failure mode—it's a *computational resource*. Classical logic treats contradiction as error (everything becomes provable). But in deliberation, contradiction signals "these options are incompatible; choice is required."

Paraconsistent semantics + revision mechanisms turn contradiction into a driver for search: Detect conflicts, systematically explore resolutions, prefer minimal mutilations. This is more principled than ad-hoc conflict resolution (e.g., "last update wins," "majority vote," "user resolves").

For WinDAG systems: Embrace contradiction at the design level. When skills produce conflicting outputs, when goals are over-constrained, when beliefs are inconsistent—don't treat these as crashes. Treat them as signals that deliberation is needed. Implement revision mechanisms to systematically explore and resolve conflicts based on declared preferences.

This requires a mindset shift: Instead of "my system must never be inconsistent" → "my system uses inconsistency as information." The architecture must *expect* contradiction and have well-defined responses (revision procedures) rather than *fear* contradiction and add defensive checks that prevent reasoning when conflicts arise.

Móra et al. demonstrate that this shift is feasible: BDI agents built on paraconsistent logic with revision mechanisms are both formally well-defined and practically implementable. The gap between theory and implementation narrows when the theory is designed from the start to be computational, with inconsistency as a feature rather than a bug.
```

### FILE: triggers-and-attention-in-committed-agents.md

```markdown
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
```

### FILE: preference-over-consistency-restoring-revisions.md

```markdown
# Preference Over Consistency-Restoring Revisions: Encoding Deliberation Policy in Search Structures

## The Multiplicity Problem in Conflict Resolution

When an agent detects conflicting desires or constraints, consistency must be restored. But typically there are *multiple* ways to restore consistency—different subsets of desires could be satisfied, different actions could be abduced. How should the agent choose?

Móra et al. identify this clearly: "In general, there may be more than one subset of the eligible desires that are jointly achievable. Therefore, we should indicate which of these subsets are preferred to be adopted as intentions" (p. 20). The ELP revision mechanism finds *all* minimal ways to restore consistency. That's good—it explores the full solution space. But an agent must commit to one solution to act.

The naive approach: Enumerate all minimal revisions, score them according to utility, pick the best. But this is expensive—revision search already explores combinations, and scoring them all might be as costly as finding them.

The elegant approach: Encode preferences *in the revision process itself*, guiding search toward preferred solutions. This is what the preference graph (Definition 9) achieves. Instead of "find all solutions then filter," it's "search for solutions in preference order."

## The Preference Graph Structure

A preference graph is a labeled DAG where:
- **Nodes** are *revision levels*, each associated with a set of revisable literals: Rev(level_i) = {some revisables} ∪ Rev(parent_levels)
- **Edges** define preference order: child → parent means "try parent level before child"
- **Root** is a distinguished node (bottom) representing the most preferred revision

The semantics (from section 2.1, p. 14-15): "Rules like the one above for Level_0 state that we want to consider revisions for Level_0 only if, for some rule body, its levels have been considered and there are no revisions at any of those levels."

Translation: The revision mechanism tries to find consistent programs using only literals from the most preferred (lowest in graph) levels. If impossible, it explores less preferred levels. This implements best-first search over the revision space, pruning branches that require changing highly preferred literals.

## Desire Selection Preference Graph

For intention selection (Definition 9, p. 20-21), the graph is:

**Bottom level**: Rev(bottom) = {happens(E, Ti, Tf), act(E, A)}  
Meaning: The most preferred solutions involve only abducing actions—don't unselect any desires. Try to satisfy all eligible desires by finding a plan.

**Level i (for each importance rank i)**: Rev(level_i) = {unsel(D) | importance(D) = i} ∪ Rev(bottom)  
Meaning: If bottom level fails, permit dropping desires of importance rank i. The literals in this level are "unsel(D)" for desires D with that importance, plus all literals from lower levels (actions).

**Edge structure**: 
- level_i → bottom (for all i): Try bottom before any desire-dropping level
- level_i → level_j if importance(i) < importance(j): Try dropping less important desires before more important

This encodes the deliberation policy: "Maximize desires satisfied, prioritizing by importance." The graph structure makes this policy explicit and drives the search algorithm.

## How Preference Guides Search

The revision algorithm (from [Damásio, Nejdl, Pereira 1994], referenced p. 14) works:

1. Start at leaves of preference graph (most preferred levels)
2. Attempt to find a consistent program using only literals in those levels
3. If successful, return that revision (it's optimal according to preference)
4. If impossible, mark those levels as failed, move to next level in graph
5. Repeat until a revision is found or all levels exhausted

For the desire selection graph:

**Step 1**: Try Rev(bottom)—abduce actions satisfying all eligible desires  
If successful: All desires become intentions (best case)  
If fails: Some desires are mutually incompatible

**Step 2**: Try Rev(level_min), where level_min corresponds to least important desires  
Now can abduce actions AND set unsel(D_min) = true for least important desires  
If successful: Drop only least important desires, keep all others  
If fails: Even dropping least important isn't enough

**Step 3**: Try Rev(level_next), next importance level  
Can drop desires up to this importance level  
Continue until a consistent subset is found

This is much more efficient than enumerating all subsets of desires and scoring them. The graph prunes search: Once you find a solution at level L, you don't explore higher (less preferred) levels at all.

## The Preference Relation as Graph Compilation

The preference graph *compiles* the preference relation (Definition 7) into search structure. Definition 7 states: "R <_Pref S (R is less preferred than S) if the biggest value for importance occurring in S and not occurring in R is bigger than the biggest value for importance occurring in R and not occurring in S; if there is no such biggest value in S, than R is less preferred than S if S has more elements than R" (p. 20).

This is lexicographic preference: Importance is primary criterion, cardinality (number of desires satisfied) is tiebreaker. The graph encodes this:

- **Importance**: Levels correspond to importance ranks. Edges ensure low-importance levels are tried before high-importance.
- **Cardinality**: Within a level, the revision mechanism finds *minimal* changes. Dropping one desire (minimal) is preferred over dropping two (non-minimal).

So the graph structure naturally implements the preference relation. You don't need separate code to evaluate preference—the search algorithm using the graph will find preferred revisions first.

## Secondary Criteria and Tiebreaking

Even with the preference graph, multiple minimal revisions might exist at the same level. Example: Two desires d1, d2 both have importance 0.5. They conflict. The revision mechanism can either:
- Set unsel(d1) = true, satisfy d2
- Set unsel(d2) = true, satisfy d1

Both are minimal revisions at the same preference level. The graph doesn't distinguish them. This is where secondary criteria apply.

The authors note: "if an agent were to choose between d1={des(_, Ag, b, [0.5])} and d2={des(_, Ag, c, [0.5])}, based only on the importance of desires and maximization of desires satisfied, it would not prefer either of them. And, indeed, according to the preference relation, we have that neither (d1 <_Pref d2) nor (d2 <_Pref d1)" (Example 8, p. 20).

When the preference relation is indifferent, the agent can:
1. **Choose arbitrarily**: Pick any minimal revision (non-deterministic choice)
2. **Apply secondary criteria**: Urgency, resource cost, stakeholder priority, etc.
3. **Return all ties**: Present multiple options to a higher-level decision maker

The paper leaves this open: "When multiple candidate sets exist (different ways to satisfy desires), apply preference relation. This could be a scoring function, constraint optimization, or the revision preference graph approach" (implied throughout section 4.1).

For WinDAG systems: Implement secondary preference as a scoring function applied to tied minimal revisions. The preference graph does the heavy lifting (pruning most of the space), then scoring resolves final ties.

## Example: Incremental Preference Levels

Consider desires with importance levels 0.3, 0.5, 0.7, 0.9:

**Graph**:
```
bottom → (abduce actions, keep all)
  ↓
level_03 → (drop 0.3 desires, keep 0.5, 0.7, 0.9)
  ↓
level_05 → (drop 0.3, 0.5 desires, keep 0.7, 0.9)
  ↓
level_07 → (drop 0.3, 0.5, 0.7 desires, keep 0.9)
  ↓
level_09 → (drop all if necessary)
```

**Search**: 
1. Try bottom: Satisfy all desires? If yes → done (optimal)
2. If no, try level_03: Drop only 0.3 desires? If yes → done (second-best)
3. If no, try level_05: Drop 0.3 and 0.5? If yes → done
4. Continue...

Each level adds more freedom (more literals are revisable). The graph ensures we add freedom gradually, trying most constrained (preferred) levels first.

## Compositional Preference: Combining Criteria

The preference graph framework is compositional—you can combine multiple preference dimensions. Suppose you want:
1. Prefer more important desires
2. Among equally important, prefer less resource-expensive desires
3. Among equal cost, prefer desires from higher-authority stakeholders

Implement this with a multi-dimensional graph:

**Dimension 1 (Importance)**: Main spine of graph, as above

**Dimension 2 (Cost)**: Within each importance level, sub-levels for cost brackets:
```
level_imp09 → level_imp09_low_cost → level_imp09_med_cost → level_imp09_high_cost
```

**Dimension 3 (Stakeholder)**: Within cost sub-levels, further refinement

This creates a hierarchical preference structure. Search explores in lexicographic order: importance dominates cost dominates stakeholder. The graph structure encodes the priority, the algorithm traverses it.

## Generalizing Beyond Desires: Belief Revision Preferences

Though the paper focuses on intention selection, the preference mechanism applies to any revision problem. For belief revision (handling contradictory information):

**Bottom level**: Keep all beliefs (most preferred—don't drop anything)

**Level i**: Drop beliefs from source i (e.g., sensor readings vs. prior knowledge)

**Edges**: Prefer keeping high-reliability sources, drop low-reliability first

This implements *trust-based belief revision*: When information conflicts, prefer more reliable sources. The same revision machinery, different preference graph.

Similarly for plan repair: When a plan becomes infeasible, the preference graph could encode "prefer replanning over abandoning the goal; prefer local repairs over full replanning; prefer cheaper repairs over expensive."

The lesson: Preference graphs are a general mechanism for encoding search strategies in revision problems. Not specific to BDI desires.

## Implementation for WinDAG Orchestration

For skill composition/orchestration:

**Scenario**: Multiple skills can achieve a goal (e.g., "analyze code quality"). Skills have attributes: importance (how critical their analysis is), cost (time/tokens), dependencies (what artifacts they need).

**Preference Graph**:
```
bottom → (invoke all relevant skills)
  ↓
level_optional → (drop optional skills, keep critical)
  ↓
level_expensive → (drop expensive skills if over budget)
  ↓
level_critical → (drop even critical if absolutely necessary)
```

**Search**: Try to compose all skills. If over budget/time, drop optional ones first. If still infeasible, drop expensive ones. Only in extremis drop critical skills.

**Implementation**:
```python
class SkillOrchestrationRevision:
    def __init__(self, skills, constraints):
        self.skills = skills
        self.constraints = constraints  # time, memory, etc.
        self.preference_graph = self._build_graph()
    
    def _build_graph(self):
        # Create levels based on skill importance
        levels = {
            'bottom': [s for s in self.skills],
            'drop_optional': [s for s in self.skills if s.importance > 0.5],
            'drop_expensive': [s for s in self.skills if s.importance > 0.7 or s.cost < threshold],
            'drop_critical': [s for s in self.skills if s.importance >= 0.9],
        }
        edges = [
            ('drop_optional', 'bottom'),
            ('drop_expensive', 'drop_optional'),
            ('drop_critical', 'drop_expensive'),
        ]
        return PreferenceGraph(levels, edges)
    
    def select_skills(self):
        for level in self.preference_graph.traverse():
            candidate_skills = self.preference_graph.get_level(level)
            if self._check_feasibility(candidate_skills):
                return candidate_skills
        return None  # No feasible solution
```

This automates skill selection under constraints, preferring richer analysis when possible, gracefully degrading when resource-limited.

## Boundary Conditions

Preference graphs work well when:

**1. Preferences Have Structure**: If preferences are arbitrary (no clear levels/ordering), encoding them in a graph is hard. Best suited for hierarchical or lexicographic preferences.

**2. Levels Are Not Too Granular**: If every desire has unique importance (100 distinct levels), the graph becomes a linear chain with no pruning benefit. Works best when importance clusters into a manageable number of levels (<10).

**3. Revision Is Tractable**: The graph guides search but doesn't eliminate search. If the underlying revision problem is intractable (huge state space), the graph helps but doesn't solve it. Need additional techniques (heuristics, anytime search, abstraction).

**4. Preferences Are Static During Search**: The graph encodes a fixed preference order. If preferences change dynamically (e.g., based on partial search results), the graph would need rebuilding. Static preferences are easier.

## The Deeper Insight: Policy as Data Structure

The profound lesson: **Deliberation policy can be declaratively specified as a data structure (graph), then executed by a generic algorithm (revision search)**. You don't write procedural code like:

```python
def select_intentions(desires):
    # Try all desires
    if feasible(desires):
        return desires
    # Drop least important
    for d in sorted(desires, key=lambda x: x.importance):
        subset = desires - {d}
        if feasible(subset):
            return subset
    # etc.
```

Instead, you specify the preference graph declaratively, and the revision algorithm interprets it:

```python
def select_intentions(desires):
    graph = build_preference_graph(desires)
    return revision_search(program, graph)
```

This separation of policy (graph) and mechanism (search) is powerful:
- **Modular**: Change policy without changing algorithm
- **Analyzable**: Formally verify properties of policies (e.g., guarantee important desires are never dropped if feasible)
- **Reusable**: Same algorithm works for different problems (desires, beliefs, plans) with different graphs
- **Debuggable**: Trace which graph levels were explored, why certain revisions were chosen

For WinDAG systems: When designing decision-making components (task decomposition, skill selection, resource allocation), favor declarative specification of preferences (graphs, constraints, scoring functions) over procedural logic. This makes the system's priorities explicit, auditable, and reconfigurable without code changes.

Móra et al. demonstrate that this approach bridges theory and practice: The preference graph is both a formal specification (precisely defines preference semantics) and an operational implementation (directly drives the search algorithm). No gap between "what we want" and "how to compute it."
```

### FILE: event-calculus-as-operational-time-and-action-model.md

```markdown
# Event Calculus as Operational Time and Action Model: Making Temporal Reasoning Executable

## Why BDI Agents Need Temporal Reasoning

Beliefs, desires, and intentions are fundamentally temporal: "I desire that property P holds *at time T*." "I intend to execute action A *at time T*." "I believe property P initiated *at T1* and persisted *until T2*." Without temporal reasoning, an agent can't represent durative goals, reason about action consequences over time, or detect when commitments are obsolete.

But temporal reasoning is notoriously complex. Temporal logics (LTL, CTL, interval logics) are expressive but often undecidable or computationally expensive. Planning formalisms (STRIPS, PDDL) handle time but are specialized for planning, not general reasoning.

Móra et al. solve this by adopting the *Event Calculus* (EC), a logic programming formalism for time and actions. Their key insight: "When we reason about pro-attitudes like desires and intentions, we need to deal with properties that should hold at an instant of time and with actions that should be executed at a certain time. Therefore... we need to have a logical formalism that deals with actions and time" (p. 15).

The EC provides exactly this: A declarative specification of how actions initiate/terminate properties, how properties persist over time, and how to query what holds when. Crucially, EC has *operational semantics*—it's executable through logic programming, not just a specification language.

## The Event Calculus: Core Predicates

The version used in the paper (a modification of Kowalski & Sergot's original EC) has five main predicates:

**happens(E, Ti, Tf)**: Event E occurs from time Ti to time Tf  
Events have *duration* (not instantaneous). E is an event identifier (allows multiple occurrences of same action type).

**act(E, A)**: Event E is an execution of action A  
Links events to action types. The same action can have multiple events: happens(e1, 0, 5), happens(e2, 10, 15), act(e1, move), act(e2, move) — two move actions at different times.

**initiates(E, T, P)**: Event E initiates property P at time T  
After E occurs, P becomes true (if it wasn't already). T is typically the end time of E (effects take hold after action completes).

**terminates(E, T, P)**: Event E terminates property P at time T  
After E occurs, P becomes false (if it was true).

**holds_at(P, T)**: Property P holds at time T  
The query predicate—does P hold at a given time? This is defined in terms of initiates/terminates/happens.

The EC axioms (p. 15) define holds_at using these predicates:

```
holds_at(P, T) ← 
    happens(E, Ti, Tf),
    initiates(E, TP, P),
    TP < T,
    TP >= Ti,
    persists(TP, P, T).

persists(TP, P, T) ← 
    not clipped(TP, P, T).

clipped(TP, P, T) ← 
    happens(C, Tci, Tcf),
    terminates(C, TC, P),
    TC >= Tci,
    not out(TC, TP, T).

out(TC, TP, T) ← 
    (T ≤ TC); (TC < TP).
```

Translation: Property P holds at time T if there's an earlier event that initiated P, and P wasn't clipped (terminated by another event) between initiation and T.

## Example: Warehouse Robot Actions

From Example 5 (p. 18-19), the robot's action model:

**Charging Initiates Battery Charged**:
```
initiates(E, Tf, bel(rbt, bat_charged)) ← 
    happens(E, Ti, Tf),
    act(E, charge).
```
When a charge action completes (at Tf), property bel(rbt, bat_charged) becomes true.

**Low Battery Terminates Battery Charged**:
```
terminates(E, T, bel(rbt, bat_charged)) ← 
    happens(E, T, T),
    act(E, sense_low_bat).
```
A sense_low_bat event (instantaneous, Ti = Tf = T) terminates the bat_charged property.

**Storing Initiates Stored**:
```
initiates(E, Tf, bel(rbt, stored(O))) ← 
    happens(E, Ti, Tf),
    act(E, store(O)).
```

**Input Events**:
```
happens(e, t, t).
act(e, input(o)).
```
An input event occurred at time t (object o placed on input counter).

Query: "holds_at(bel(rbt, stored(o)), 10)?" — Is object o stored at time 10?

Reasoning:
1. Was there an event initiating stored(o) before time 10? 
2. If so, was it clipped (terminated) before 10?
3. If initiated and not clipped, then yes.

This reasoning is *automatic*—query the EC program, get an answer.

## Explicit vs. Implicit Negation for Properties

The paper introduces a subtle but important distinction (p. 15):

```
holds_at(¬P, T) ← ¬holds_at(P, T).
¬holds_at(P, T) ← not holds_at(P, T).
```

First rule: If you can prove P does NOT hold (explicit negation), then ¬P holds.  
Second rule: If you cannot prove P holds (implicit negation), then you can prove ¬holds_at(P, T).

This supports two kinds of negative information:
- **Closed-world**: "I don't believe the door is open" (absence of evidence) — not holds_at(open, T)
- **Open-world**: "I believe the door is NOT open" (evidence of absence) — holds_at(¬open, T)

For mental states, this matters. An intention "ensure the door is NOT open" (holds_at(¬open, T)) differs from "I don't intend the door open" (not holds_at(int_that(..., open, ...), T)). The EC supports both.

## Abductive Reasoning Over Time

The EC allows two modes:

**Deductive (Prediction)**: Given known events, deduce what properties hold.  
Example: "These actions happened. Does property P hold now?"  
Query: happens(e1, 0, 5), act(e1, move_to(loc2)), initiates(e1, 5, at(loc2)), holds_at(at(loc2), 10)?  
Answer: Yes (assuming no intervening events terminated at(loc2)).

**Abductive (Explanation/Planning)**: Given a desired property, abduce events that would cause it.  
Example: "I want property P at time T. What actions would achieve this?"  
Observation: holds_at(bel(rbt, stored(a)), 10) ←  
Abduce: Δ = {happens(e1, 7, 9), act(e1, store(a))}  
Explanation: If a store(a) action happens between 7-9, stored(a) holds at 10.

This is how the BDI model uses EC for feasibility checking (see earlier document on abduction). The agent abduces happens/act literals that would make desired properties hold, checking if a course of actions exists achieving the goals.

## Operational Semantics Through Logic Programming

The EC axioms are *logic program clauses*—they execute via SLD resolution with negation-as-failure (or more sophisticated mechanisms like WFSX). This makes EC operational:

1. **Define action models**: Write initiates/terminates rules for domain actions
2. **Assert events**: State which events occurred (happens/act facts)
3. **Query properties**: Ask holds_at(P, T)?
4. **Get answers**: Logic programming engine computes truth values

No separate "temporal reasoner" needed—the EC axioms *are* the reasoner, executed by the LP engine.

The authors emphasize: "The EC allows us to reason about the future, by hypothetically assuming