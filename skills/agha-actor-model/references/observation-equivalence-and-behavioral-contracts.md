# Observation Equivalence and Behavioral Contracts for Agent Skills

## The Substitutability Problem

A practical question that arises constantly in agent orchestration: **when can one skill be substituted for another?** When is it safe to replace skill A with skill B without changing the observable behavior of the system?

The naive answer — "when they produce the same outputs for the same inputs" — is provably insufficient. Agha's analysis of observation equivalence and the Brock-Ackerman anomaly shows exactly why, and provides the correct answer.

## Three Levels of Equivalence, Ordered by Strength

**Level 1: Implementation equivalence (strongest)**: Two skills are equivalent if they use the same algorithm, the same data structures, the same internal representations. This is too strong — we routinely want to swap implementations without caring about internal differences.

**Level 2: Direct relabeling equivalence**: Two configurations are equivalent if they differ only in the names (mail addresses) of their internal actors. This captures the intuition that the labeling scheme is arbitrary. But it is still too strong — it distinguishes two configurations that differ only by a garbage-collectible unused actor.

**Level 3: Observation equivalence (Agha's proposal)**: Two systems are equivalent if no external observer can distinguish them through any sequence of interactions. This is the weakest equivalence that still guarantees substitutability.

> "After all, if it is impossible to observe the difference between two configurations despite any interaction one may have with the systems involved, then there is no point discriminating between the two systems." (p. 169)

## The Brock-Ackerman Anomaly: Why History Isn't Enough

The Brock-Ackerman anomaly is a clean proof that there exists a level of equivalence weaker than observation equivalence but stronger than history equivalence, and that this gap is not bridgeable.

**Setup**: Two actor systems S₁ and S₂ that both have a receptionist D which, upon receiving a message, sends two copies to an internal actor P:
- P₁ (in S₁): accumulates both messages before sending either to the external actor e
- P₂ (in S₂): sends each message to e as it receives it

**Fact**: S₁ and S₂ have identical history relations. Given any sequence of input messages to D, the set of possible output sequences from e is the same for both systems.

**Proof of non-substitutability**: Compose each system with U, which sends each message to e and also sends `5 * k₁` to e after the first message:

- In S₁||U: P₁ waits for two inputs, so when U sends the second message and then `5*k₁`, P₁ has already buffered both original messages. The output is determined only by the original inputs.
- In S₂||U: P₂ forwards the first message immediately. U sees this output and sends `5*k₁` to e before P₂ has sent the second copy. The second copy of the original message and `5*k₁` can then arrive at P₂ in either order, producing different outputs.

**Result**: M(S₁||U) ≠ M(S₂||U) even though M(S₁) = M(S₂).

> "The Brock-Ackerman anomaly demonstrates the insufficiency of the history relation in representing the behavior of actor systems... The problem with the history relation is that it ignores the open, interactive nature of systems which may accept communications from the outside and send communications out at any stage." (p. 165-166)

## What the Anomaly Teaches About Testing

The Brock-Ackerman anomaly has an immediately practical implication for how agent skills should be tested:

**Input-output testing is insufficient for concurrent skills**. You cannot establish skill equivalence (and therefore skill substitutability) by testing that both skills produce the same outputs for the same inputs. Two skills can pass every input-output test you run and still behave differently when deployed in a real system with concurrent interactions.

The correct test is **interactive testing**: present each skill with the same sequence of inputs, interleaved with additional inputs that arrive between outputs. Observe whether the two skills produce the same outputs in the same sequence under all such interleavings.

This is precisely the definition of observation equivalence: equivalence to all depths of interaction.

## Observation Equivalence: Formal Definition

Agha defines observation equivalence inductively:

Two configurations are observation-equivalent to depth 0 if they can't be immediately distinguished by any single observable action.

Two configurations are observation-equivalent to depth n if, for every observable action (external input or external output), the configurations that result after that action are observation-equivalent to depth n-1.

Two configurations are observation-equivalent if they are observation-equivalent to all finite depths.

This is defined as a tree structure: the **Asynchronous Communication Tree (ACT)** of a configuration is a tree whose branches represent possible observable actions, and whose nodes represent the resulting configurations.

> "A configuration can be extensionally defined using the tree of events specified above. The definition is inductive — two configurations are observation equivalent to degree n if they have the same observable transitions at the n-th level of the tree." (p. 169)

## Three Kinds of Observable Actions

In the ACT formalism, there are exactly three kinds of observable transitions from a configuration:

1. **Input**: A message arrives from the outside to a receptionist. This changes the configuration by adding the message as a pending task.

2. **Output**: A message is sent from an actor in the population to an external actor. This is an observable effect — the external actor receives the message.

3. **Internal action**: A task is processed entirely within the system. This changes the internal configuration but is not directly observable.

Two systems are observation-equivalent if they have the same tree of observable inputs and outputs — if no external observer can tell them apart by sending messages and observing responses.

## Composition Preserves Observation Equivalence

The key property that makes observation equivalence practically useful:

> "observation equivalence is a congruence relation for all operations except the '+' operator." (p. 186)

This means: if skill A and skill A' are observation-equivalent, then any system containing A can have A replaced by A' and the observable behavior of the entire system is preserved. This is the formal guarantee of substitutability.

(The exception for '+' is a technical limitation related to the sum operator for nondeterministic choice; it does not affect the practical substitutability claim for most real-world compositions.)

## The "Current Status" Principle

One of Agha's most nuanced observations:

> "Internally, the change has already occurred, whether or not we have observed its external manifestation — i.e., whether or not the communication sent has been received. On the one hand, until we observe the effects of the change, there is uncertainty, from the external perspective, as to whether the change has already occurred." (p. 170)

This is a precise statement about the relationship between internal state and external observability. A skill's internal state may have changed — it may have made a decision, updated its knowledge, or committed to a course of action — before that change is visible to external observers. External observers can only reason about the **history of observable events**, not about the full internal state.

This has implications for reasoning about concurrent agent behavior: external reasoning about what a skill "knows" or "has decided" must be based only on observed communications, not assumptions about its internal processing.

## Application to WinDAGs

**Skill substitutability contracts**: Skills in WinDAGs should be defined by their observation equivalence class, not by their implementation. Two skills are interchangeable if and only if they are observation-equivalent. The skill registry should include test suites that verify observation equivalence at sufficient depth.

**Testing strategy**: WinDAGs skill tests should include **interleaved interaction tests**, not just input-output tests. Test skill A and skill B with the same inputs, but also send follow-up messages between outputs to test whether the timing of outputs affects subsequent behavior.

**Behavioral contracts over signatures**: A skill's "interface" should not just specify its input/output types (this is the history relation). It should specify its **interactive contract**: what it is ready to accept at each point in its execution, and how its readiness changes after each output. This is the observation-equivalence contract.

**Version compatibility**: When a skill is updated, the new version is backward-compatible if and only if it is observation-equivalent to the old version. If the timing of outputs changes (even if the final outputs are the same), the new version may be incompatible with some workflows — exactly the Brock-Ackerman scenario.

**Debugging methodology**: When a workflow produces unexpected results after a skill is updated, don't just check that the skill produces the same outputs for the same inputs. Check whether the **timing** of outputs has changed. A skill that now sends output A before output B (when it used to send B before A) may break workflows that send additional inputs between the two outputs.

**Composition verification**: Before deploying a composition of two skills, WinDAGs should verify that the composition behaves as expected under all observable interaction sequences — not just under "happy path" sequential execution. This requires model checking or property-based testing of the composed system.

**The open system principle in testing**: Skills should be tested as open systems — tested with unexpected inputs arriving at unexpected times, not just with the well-formed sequential inputs of the happy path. A skill that is correct in isolation may fail when deployed in a system where other skills send it messages concurrently.