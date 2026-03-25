# Minimal Primitives, Maximum Expressiveness: Design Lessons from Actor Language Theory

## The Expressiveness-Efficiency Tradeoff Resolved

Agha opens the thesis with a tension that has defined programming language design for decades:

> "There are two different sorts of objectives one can emphasize in the design of a programming language: efficiency in execution, and expressiveness... A programming language that maximized efficiency would not necessarily lead to the specification of programs with the best performance. This is simply because the programmer may end up spending more time figuring out how to express rather than what to express." (p. 1-2)

The resolution is not to pick one over the other, but to identify a **minimal set of primitives** that is both computationally complete (can express anything) and simple enough to reason about. Everything else is derived — built from the primitives, provably equivalent to some primitive combination.

This principle — minimal primitives, maximal expressiveness through derivation — is one of the most important engineering lessons in the thesis.

## The Minimal Actor Language Kernel

Agha proves that all actor computation can be expressed using just five kinds of constructs:

1. **Behavior definitions** — templates that associate a behavior schema with an identifier (not creating any actor; purely declarative)
2. **New expressions** — create actors from behavior templates, returning the mail address
3. **Send commands** — create tasks (messages in flight)
4. **Receptionist declarations** — specify which actors can receive external communications
5. **External declarations** — specify which actors outside the system can be communicated with

That is the entire kernel. No loops. No global variables. No sequential composition. No synchronization primitives. No garbage collection declarations.

Everything else — higher-order functions, lazy evaluation, eager evaluation, co-routines, continuations, sequential composition, mutual recursion — can be derived from these five constructs.

## Derivation, Not Addition

The key methodological insight is the difference between **primitive** and **derived** constructs:

> "In the next chapter, we will define some new linguistic constructs, but these constructs will not be foundational; they can be defined using a minimal actor language. Such extensions to a minimal language demonstrate the power of the primitive actor constructs." (p. 32-33)

When a higher-level construct can be derived from primitives, it does not need to be added to the semantics. It is syntactic sugar — useful for expressiveness, irrelevant for theoretical analysis.

This is important for WinDAGs design: the orchestration system should have a minimal kernel of primitives, and all higher-level coordination patterns (parallel fan-out, sequential pipelines, conditional routing, retry logic, etc.) should be derived from those primitives. This makes the system:
- Easier to reason about formally
- Easier to test (test the primitives, trust the derivations)
- More extensible (new patterns can be added without changing the kernel)
- More maintainable (fewer special cases)

## The Customer Pattern as Universal Continuation

The **customer** is arguably the most important derived construct in the actor model. It is how actors implement what functional programming calls continuations — the "rest of the computation" that follows the current step.

In sequential programming, continuations are implicit in the call stack. In actor programming, they must be made explicit because there is no shared stack.

The customer pattern:
1. When actor A needs the result of actor B to continue its computation, A creates a new actor C (the customer)
2. C's behavior is parameterized by A's "continuation" — what A needs to do once it has B's result
3. A sends B a message containing the task and C's address
4. A specifies its replacement (immediately becoming free to process the next message)
5. B eventually sends its result to C
6. C carries out A's continuation using B's result

This pattern turns every "blocking call" into a non-blocking delegated continuation. The actor A is never blocked — it always specifies its replacement and is immediately available. The waiting is done by C, a purpose-built single-use actor that exists only to receive one message and act on it.

> "The actor originally receiving the request delegates most of the processing required by the request to a large number of actors, each of whom is dynamically created. Furthermore, the number of such actors created is in direct proportion to the magnitude of the computation required." (p. 55)

## Sequential Composition: Derived, Not Primitive

The absence of sequential composition from the kernel is initially surprising. In virtually every other programming model, sequencing is primitive. Agha's explanation is precise:

> "The order of these actions is immaterial because there is no changing local state affecting these actions. Furthermore, the order in which two communications are sent is irrelevant because, even if such an order was specified, it would not necessarily correspond to the order in which the communications were subsequently received." (p. 81)

Since there is no shared state, and since the arrival order of messages is nondeterministic anyway, specifying that two sends should happen in a particular order is **vacuous** — the receiver will process them in an indeterminate order regardless.

Sequential composition is meaningful only when there is a **causal dependency** — when the result of one operation is needed as input to the next. In that case, the customer pattern creates the necessary sequencing:

> "The command S = S₁; S₂ is executed concurrently with other commands at the same level. To execute S₁, the actions implied by the command are executed, including the creation of a customer to handle the reply from g. When this customer receives the reply from g, it carries out the other actions implied by S₁ as well as executing S₂." (p. 83)

**Key insight**: Sequentiality is not a property of commands; it is a property of data dependencies. If two operations share no data dependency, they can (and should) run concurrently. Sequential composition should be used only where it is logically necessary.

## Delayed and Eager Evaluation from Primitives

Chapter 4 demonstrates that even complex evaluation strategies — lazy evaluation (call-by-need), eager evaluation, delayed evaluation — are derivable from the primitive actor constructs.

**Delayed evaluation**: An expression `delay e` denotes the mail address of the actor representing `e`, rather than its computed value. The actor exists but hasn't been sent the message to evaluate itself yet. When the value is needed, the actor is sent an evaluate message.

**Eager evaluation**: Concurrent with creating an actor that will eventually need an expression's value, immediately send the expression an evaluate message. This way, by the time the actor needs the value, it may already have been computed. The computation runs speculatively in parallel.

> "Another mechanism by which the available parallelism in an actor language can be exploited is by schemes for eager evaluation... one can create an actor with the mail addresses of some expressions (which have not necessarily been evaluated) as its acquaintances. So far, this is similar to how one would implement call-by-need. However, for eager evaluation we concurrently send the expression... a request to evaluate itself." (p. 95-96)

The distinction between lazy and eager evaluation is entirely captured by when you send the evaluate message — not by any structural change to the system. This is the power of deriving from primitives: different evaluation strategies are different temporal patterns of message-sending, not different language features.

## The Universe of Actors: Uniformity All the Way Down

Agha's most radical application of the minimality principle is the **universe of actors model**: everything, including integers, booleans, and operations, is an actor.

> "When an integer is sent a message to 'evaluate' itself, it simply replies with itself... Each integer, n, may be sent a request to add itself to another integer. The integer would then reply with the sum of the two integers." (p. 85)

The integer `3` is an actor. The expression `3 + 5` is a message from actor `3` asking actor `5` to add itself to `3`. The result is the actor `8`.

This is not a performance optimization — it is a theoretical demonstration that the actor model is uniform: there are no special cases, no primitive types that exist outside the actor framework. Everything is an actor with a mail address and a behavior.

The practical consequence: in a well-designed actor-based system, there is no need for special handling of "primitive" versus "complex" objects. The same message-passing infrastructure handles simple values and complex computations uniformly.

## Implications for Agent System Design

**Kernel specification for WinDAGs**: WinDAGs should have a formally specified kernel of primitives: the minimum set of operations that all other patterns are built from. Candidates include: create_skill, send_message, register_continuation, and declare_external. All higher-level patterns (workflow templates, retry logic, fan-out, etc.) should be defined as compositions of these primitives.

**Continuation management**: The customer pattern should be explicitly supported in WinDAGs. When skill A needs the output of skill B to continue its computation, WinDAGs should create a continuation object (analogous to a customer actor) that carries A's pending state, and pass it to B as part of the task. When B completes, it sends its result to the continuation.

**Lazy skill invocation**: WinDAGs should support lazy skill invocation — the ability to "reserve" a skill invocation by creating its input message, but delay actually sending it until the result is needed. This enables speculative parallelism where downstream tasks begin setting up while upstream tasks are still running.

**Eager skill pre-computation**: For skills whose inputs can be determined in advance (even if they're not yet needed), WinDAGs should support sending the invocation message immediately and letting the skill run speculatively. If the result is ultimately needed, it's already available.

**Deriving patterns from primitives**: WinDAGs' library of workflow patterns (scatter-gather, sequential pipeline, conditional branching, retry with backoff, etc.) should be documented as derivations from the kernel primitives. This serves as both documentation and a correctness argument: each pattern's behavior is predictable because it's built from well-understood primitives.

**No special-casing**: The uniformity principle suggests that WinDAGs should treat all skills, agents, and orchestration logic as instances of the same underlying actor model. There should not be "special" orchestration logic that operates outside the messaging framework. Even the orchestrator itself is an actor.