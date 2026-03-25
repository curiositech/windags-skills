# Abstraction, Compositionality, and the Open System Problem

## The Core Challenge

Chapter 7 of Agha's thesis addresses what is arguably the hardest problem in concurrent system design: **how do you reason about the behavior of a complex system built from simpler parts, when those parts can interact in arbitrary ways?**

In sequential programming, this is solved by the principle of compositionality: the meaning of a program is built from the meanings of its parts. But concurrency breaks this in a fundamental way — the interactions between components depend on timing, ordering, and the environment in which they're deployed. The same component can behave differently depending on what it's composed with.

## The Assignment Example: Why Atomicity Is Not the Answer

Agha opens Chapter 7 with a precise example of the failure of naive compositionality. Consider two concurrent commands:
- S₁: x := x + 1
- S₂: x := 2 * x

Starting from x = 2, the sequential compositions give either x = 6 (S₁ then S₂) or x = 5 (S₂ then S₁). But concurrent execution can also yield x = 3 or x = 4 — states reachable only when the two commands overlap in time and share intermediate register states.

The standard fix is **atomicity**: declare that the assignment command cannot be interrupted. This restores compositionality by fixing the granularity of interleaving.

But atomicity has a fatal flaw:
> "The problem with the atomicity solution is that it fixes the level of granularity or detail which must be retained by the meaning function. Thus, if the assignment command is atomic, one must retain information about each and every transformation caused by an assignment in a program. This necessarily means that one can not abstract away the operational details to any higher degree." (p. 146-147)

Atomicity locks in one level of abstraction. The programmer cannot define a higher-level "atomic transaction" that subsumes many smaller operations. Every reasoning step must descend to the level of individual assignments.

## The Actor Solution: Programmer-Defined Abstraction Levels

Agha's solution is elegant: **the programmer chooses the level of abstraction by choosing which actors serve as receptionists**.

> "There is no pre-determined level of 'atomicity' for all actor systems. Instead, it is the programmer who determines the degree of abstraction; the concept of receptionists is simply a mechanism to permit greater modularity and hence procedural and data abstraction." (p. 149)

The same bank account example can be reasoned about at multiple levels:
- **Low level**: interleaving of individual FETCH and STORE operations on variables
- **Medium level**: interleaving of complete deposit/withdrawal transactions
- **High level**: interleaving of complete sessions (one user's full interaction with a money machine)

Each level is correct. The programmer chooses the level appropriate to the problem. This is not a compromise — it is a recognition that **abstraction is a design decision, not a fixed property of the system**.

## Receptionists as Interface Contracts

The receptionist concept is Agha's mechanism for defining system interfaces:
> "The receptionists are the only actors that are free to receive communications from the outside. Since actor systems are dynamically evolving and open in nature, the set of receptionists may also be constantly changing." (p. 48)

This is a capability-based interface model. External actors can only communicate with receptionists. Everything inside the system that is not a receptionist is completely hidden — not hidden by convention or access control, but hidden by the physical impossibility of knowing its address.

When a communication containing a mail address is sent to an external actor, that address becomes "known" to the outside, and the corresponding actor becomes a new receptionist. **The set of receptionists is dynamic** — it grows as the system reveals its internal structure through the messages it sends.

## External Actors: Composition Through Message-Passing

The complementary concept is **external actors** — actors whose behavior is defined outside the current system but whose addresses are known within it:
> "Communications may be sent to actors outside an actor system... we allow the ability to declare a sequence of identifiers as external." (p. 48-49)

During development, an external actor is compiled as a **buffer** that holds all messages sent to it until the actual actor it represents is connected. When two independently developed modules are composed, each module's external actors become "replaced" with the actual actors from the other module.

This is composition by message-passing:
> "Independent systems are connected by sending some external actors in each module a communication to become forwarding actors which simply send their mail to some receptionists in the other module." (p. 154)

No synchronization point is needed. No shared memory. No coordination mechanism. Two independently developed agent systems can be connected at runtime by sending a single message to each side.

## The Brock-Ackerman Anomaly: Why History Is Not Enough

The most technically important result in Chapter 7 is the Brock-Ackerman anomaly. Agha constructs two actor systems, S₁ and S₂, with **identical input-output history relations** — given the same inputs, they produce the same sets of possible outputs. By the standard definition of behavioral equivalence, they should be interchangeable.

They are not.

When each is composed with a third system U, the composed systems S₁||U and S₂||U have **different** input-output histories. The same component, in the same environment, produces different behaviors — even though it appeared equivalent when observed in isolation.

The intuition: S₁ and S₂ differ in *when* during their computation they send their output. S₁ waits for two inputs before forwarding both; S₂ forwards each input as it arrives. From outside, in isolation, you can't tell the difference — both eventually produce both outputs. But when composed with a system that can send additional inputs *between* the two outputs, the timing difference becomes observable.

> "The problem with the history relation is that it ignores the open, interactive nature of systems which may accept communications from the outside and send communications out at any stage. Having sent a communication, the system is in a different set of possible configurations than it was before it did so." (p. 165-166)

**The lesson**: You cannot characterize a concurrent system by its history alone. You must track its **interactive potential** — what it is ready to accept at each moment in its evolution, not just what it ultimately produces.

## Observation Equivalence: The Right Level of Abstraction

The correct equivalence relation for concurrent systems is **observation equivalence**: two systems are equivalent if no sequence of external interactions can distinguish them.

> "After all, if it is impossible to observe the difference between two configurations despite any interaction one may have with the systems involved, then there is no point discriminating between the two systems." (p. 169)

This is defined inductively: two systems are observation-equivalent to depth n if they have the same observable behavior in all interaction sequences of length ≤ n. Two systems are equivalent if this holds for all n.

This is strictly more discriminating than history equivalence (it distinguishes S₁ and S₂ in the Brock-Ackerman example) and strictly weaker than implementation equivalence (it ignores internal differences that have no external effect).

## Application to WinDAGs

**Skill interface design**: Every skill in WinDAGs should define its **receptionists** (the input ports through which it accepts tasks) and its **external actors** (the other skills or services it will call). This interface definition is the skill's compositionality contract.

**Modular workflow construction**: Workflows should be composable by connecting the external actors of one sub-workflow to the receptionists of another. The connection protocol is "send a message telling the external actor buffer to forward to the target receptionist." No workflow-level synchronization is needed.

**Abstraction levels in orchestration**: The orchestrator should reason at the level of **skills**, not the level of individual messages within a skill. Skills are "receptionists" from the orchestrator's perspective. What happens inside the skill is hidden. This is the actor model's abstraction principle applied to agent orchestration.

**Testing and equivalence**: Two implementations of the same skill are equivalent (and therefore safely interchangeable) if they are observation-equivalent — if no sequence of inputs can produce different outputs. The Brock-Ackerman anomaly warns: **don't just test final outputs, test the interactive behavior**. A skill that produces correct results but in a different timing pattern may behave incorrectly when composed with other skills.

**Dynamic capability registration**: As skills discover new capabilities (e.g., a research skill that finds a useful external API it didn't know about), they should be able to register new "receptionists" dynamically. The set of skills in WinDAGs should be extensible at runtime without requiring the entire system to be reconfigured.

**The history trap**: Do not evaluate skill equivalence by recording input-output pairs and comparing them. Two skills that appear equivalent in isolation may be substitutable in some workflows but not others. The correct evaluation is observation equivalence, which requires testing interactive behavior across all possible compositions — which in practice means property-based testing and formal specification.