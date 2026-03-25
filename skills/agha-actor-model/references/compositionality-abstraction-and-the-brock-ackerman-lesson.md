# Compositionality, Abstraction, and the Brock-Ackerman Lesson for Agent Systems

## The Fundamental Problem

Chapter 7 addresses what Agha considers one of the hardest problems in concurrent system design: how do you reason about the behavior of a composite system from the behaviors of its parts? This is the *compositionality* problem, and it has a surprising negative result that every agent system designer must understand.

## What Compositionality Requires

A compositional semantics is one where "the meaning of a system can be derived from the meanings of its constituent parts." (p. 98) In sequential programming, this works cleanly: the meaning of `S1; S2` is determined by the meanings of S1 and S2 individually.

In concurrent systems, compositionality is much harder because when systems are combined, their events *interleave* — and the interleaving creates behaviors that cannot be predicted from the parts in isolation.

"The requirements of compositionality have resulted in proposed denotational models which retain substantial operational information. The reason for this is as follows. Composition in concurrent systems is achieved by inter-leaving the actions of the systems that are composed: thus the denotations for a system require the retention of information about the intermediate actions of the system." (p. 98-99)

## The Brock-Ackerman Anomaly: Why History Is Not Enough

The most important negative result in Chapter 7 is the demonstration that *history relations* — mappings from input sequences to output sequences — are insufficient to characterize concurrent system behavior.

Agha constructs two actor systems, S1 and S2, that have *identical history relations*: for any sequence of inputs, they produce exactly the same distribution of possible outputs. By any input-output criterion, they are equivalent.

He then constructs a third system U and shows that when S1 is composed with U, and S2 is composed with U, the *resulting systems have different history relations*.

"The Brock-Ackerman anomaly demonstrates the insufficiency of the history relation in representing the behavior of actor systems." (p. 165)

### The mechanism of the anomaly

The difference between S1 and S2:
- S1's internal actor (p1) **waits** for two inputs before forwarding both
- S2's internal actor (p2) **forwards each input** as it arrives

These produce identical external behavior in isolation. But when composed with U — which sends a third message conditioned on receiving a first — S1 and S2 produce different results because S2's forwarding enables U to react to the first message while S1's buffering delays this.

The anomaly arises because *interaction history is causal*: having produced one output changes what outputs are possible in the future. The history relation ignores this — it only records what inputs mapped to what outputs, not the timing of those mappings.

### What this means for agent equivalence

**A system cannot be characterized by its input-output history alone.** Two agent systems that appear identical from the outside may behave differently when composed with new agents. This has profound consequences:

1. **Testing is insufficient**: You cannot test an agent in isolation and conclude it will behave correctly in composition. You must test it in the contexts in which it will actually be used.

2. **Behavioral contracts must capture more than I/O**: An agent's interface specification must include information about *when* outputs are produced relative to inputs, not just *what* outputs are produced.

3. **Observational equivalence is the correct equivalence**: Agha's solution is *observation equivalence* — two systems are equivalent if no composition with any third system can distinguish them. This is a stronger, compositionally sound notion of equivalence.

## Observation Equivalence: The Right Abstraction

"Two configurations are observation equivalent to degree n if they have the same observable transitions at the n-th level of the tree." (p. 169)

Observation equivalence is defined inductively over a tree of possible transitions. Two systems are observation equivalent if:
- They produce the same outputs in response to the same inputs
- After producing each output, they are observation equivalent in all subsequent behavior
- This holds to arbitrary depth

This captures *causal* information that history relations lose: the equivalence tracks how producing one output changes the system's state and future behavior.

### The tree of transitions

Agha formalizes this using Asynchronous Communication Trees (ACTs, analogous to Milner's communication trees but for asynchronous systems). Each configuration is represented as a tree where:
- Branches labeled with receptionist addresses represent possible inputs
- Branches labeled with external actor addresses represent possible outputs
- Silent branches represent internal transitions
- The tree is infinite, capturing all possible evolutions

Observation equivalence requires the trees to be bisimilar to arbitrary depth.

## Abstraction Through Receptionists

The practical tool Agha provides for abstraction is the *receptionist* concept. By designating which actors interface with the outside world, a programmer controls the *level of granularity* at which a system's behavior is described.

"The concept of a receptionist is defined to limit the interface of a system to the outside." (p. 147)

The abstraction hierarchy works as follows:

**Fine-grained view**: x is a receptionist accepting individual FETCH and STORE messages. The system must be analyzed at the level of individual memory operations.

**Coarse-grained view**: r is a receptionist accepting higher-level "assign" and "show balance" operations. Individual FETCH/STORE operations are internal and invisible.

**Even coarser view**: Multiple operations from the same user are grouped into *transactions* through the account-receptionist pattern. The system is analyzable at the level of complete user sessions.

"One can construct arbitrarily complex systems so that their behavior is increasingly abstract. There is no pre-determined level of 'atomicity' for all actor systems. Instead, it is the programmer who determines the degree of abstraction; the concept of receptionists is simply a mechanism to permit greater modularity and hence procedural and data abstraction." (p. 149)

This is a crucial insight: **abstraction level is a design choice, not a fixed property**. By choosing what to expose as the interface, you determine what must be reasoned about.

## Transaction Nesting for Atomic Behavior

The bank account with overdraft protection demonstrates how to implement *nested transactions* — groups of operations that appear atomic to the outside:

The account-receptionist prevents interleaving of requests from different users. While one user's transaction is in progress, requests from other users are buffered. When the transaction completes (a "release" message is received), the buffer is drained.

"An analysis of the behavior of this system can thus be done by considering the overall results of transactions from each machine without having to consider all the possible orders in which the requests from different machines may be received." (p. 149)

This is the actor-model foundation of transactional semantics: not a global lock manager, but a carefully designed receptionist that controls access and buffers concurrent requests.

## Rules for Composition

Agha provides formal rules for composing two actor systems (§7.2.4):

When composing systems c1 and c2:
1. All receptionists of the composed system come from receptionists of c1 or c2
2. Actors that were receptionists only because they served as external actor stubs may no longer be receptionists
3. All external actors of the composed system come from external actors of c1 or c2
4. Actors that were external but correspond to receptionists in the other system are no longer external

The composition mechanism is pure message-passing: external actors in one system become forwarding actors pointing to receptionists in the other. No meta-level coordinator is needed.

"The composition of two programs is carried out by mapping them to the initial configurations they define and composing these configurations using the rules of composition." (p. 156)

## Application to WinDAGs System Design

### The Brock-Ackerman warning for WinDAGs

When evaluating whether two WinDAGs agent configurations are interchangeable, I/O equivalence testing is not sufficient. You must test them in composition with realistic orchestration patterns, not just in isolation.

Specifically: if agent version B produces the same outputs as agent version A for all test inputs, that does NOT guarantee B can replace A in a running system without behavioral changes. The timing of when B produces its outputs relative to its inputs may differ from A, and downstream agents may be sensitive to this timing difference.

**Recommendation**: Define behavioral contracts for WinDAGs agents that include:
- Not just what outputs are produced, but when (relative to which inputs)
- What the agent's state is after producing each output (what subsequent inputs it will accept and how it will respond)

### Observation equivalence as the agent upgrade criterion

Two WinDAGs agent implementations should be considered safely interchangeable if and only if they are observation equivalent: no realistic orchestration pattern can distinguish their behavior. This is a stronger criterion than I/O equivalence but the correct one.

### Receptionist-based modularity

In WinDAGs, each skill should have a clearly defined *interface surface* — the messages it accepts from the outside. Internal implementation details (how the skill decomposes a task, what sub-skills it calls, how it maintains state) should be hidden.

When a skill is updated or replaced, the guarantee is that its receptionist interface is preserved. The internal changes are not observable by callers.

### Transaction grouping for atomic multi-skill operations

When a complex operation requires multiple skills to execute atomically (their combined effect must appear as a single transaction):
1. Create a transaction coordinator that serves as the receptionist for the entire operation
2. The coordinator accepts a single "perform transaction" message
3. Internally, it orchestrates the sub-skills
4. It buffers any new incoming requests until the transaction completes
5. It emits a single result and resumes normal operation

This implements atomic multi-skill transactions without a global lock manager.

### Abstraction levels for debugging

The receptionist model suggests WinDAGs should support multiple levels of observability:
- **Fine-grained**: Individual skill invocations and their timings (for debugging)
- **Transaction-level**: The inputs and outputs of complete sub-plans (for monitoring)
- **Goal-level**: High-level outcomes (for reporting)

Each level is a different "receptionist boundary" — a different choice of what to expose and what to hide.

## Boundary Conditions

**When is the Brock-Ackerman anomaly NOT a concern?**

- For purely deterministic, synchronous computations with no nondeterministic choices, history relations ARE sufficient
- For systems where composition is never needed (standalone agents that never combine with others)
- For systems where timing differences are genuinely irrelevant to all consumers of outputs

**The cost of observation equivalence**

Full observation equivalence checking is undecidable in general. In practice, it must be approximated — either through bounded testing (equivalence to depth n for some finite n) or through structural proofs (if the implementations have provably identical state machines, they are observation equivalent). This is harder than simple I/O testing, but the Brock-Ackerman anomaly shows that I/O testing is simply wrong, regardless of the cost of the alternative.