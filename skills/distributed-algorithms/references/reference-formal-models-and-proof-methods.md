# Formal Models and Proof Methods: How to Reason About Algorithms That Cannot Be Traced

## The Fundamental Problem

"Even though the code for an algorithm may be short, the fact that many processors execute the code in parallel, with steps interleaved in some undetermined way, implies that there are many different ways in which the algorithm can behave, even for the same inputs. Thus, it is generally impossible to understand the algorithm by predicting exactly how it will execute."

This single observation is the intellectual foundation of Lynch's entire book. In sequential programming, you understand a program by tracing its execution. In distributed programming, this is provably insufficient—even counterproductive, because you will convince yourself that "it works" by examining a few orderly executions while missing the chaotic interleavings that expose bugs.

The alternative: "For a distributed algorithm, instead of understanding everything about its behavior, the best that we usually can do is to understand certain selected properties of its behavior."

Lynch's formal machinery is designed to prove these selected properties rigorously, across all possible interleavings, without tracing any specific execution.

## The I/O Automaton Model

The foundational model of the book is the **I/O automaton**: a state machine with typed actions (inputs, outputs, internal), a transition relation, and a task partition that governs fairness.

Key structural elements:
- **States**: All possible system configurations
- **Actions**: External (inputs from the environment, outputs to the environment) and internal
- **Transitions**: (state, action, state) triples defining possible steps
- **Tasks**: Equivalence classes of locally-controlled actions; fairness requires each task gets infinitely many opportunities

**Composition**: Multiple automata compose by sharing actions. If automaton A has output action `send_i` and automaton B has input action `send_i`, the composition A ∥ B synchronizes on that action. Composition is the mechanism for:
- Combining process automata with channel automata
- Combining processes with their shared variables
- Combining an algorithm with its environment (user automata)

**Why composition matters**: In synchronous systems, you can reason about individual components and get global correctness. In distributed systems, the interactions between components are as important as the components themselves. Composition formalizes these interactions.

**Hiding**: After composing, you can hide internal actions (make them invisible to external observers). This enables the abstraction hierarchy: high-level specification, mid-level protocol, low-level implementation, each hiding internal details.

## The Shared Memory Model: Locality Constraints

For shared memory systems, the challenge is modeling how processes interact through variables without allowing unrealistic behaviors. Lynch's solution is elegant: model the entire system as a single I/O automaton with **locality restrictions**.

"We sidestep all these issues by just modelling the entire system as one big I/O automaton A. We capture the process and variable structure within automaton A by means of some locality restrictions on the events."

The locality restrictions:
1. **For local computation**: Only the state of process i can change in a step of process i
2. **For variable access**: Only the state of process i and the value of variable x can change in a step where process i accesses variable x
3. **Enablement is local**: Whether a step is enabled depends only on process i's state, even though the result may depend on the variable's value

The third restriction is subtle and important: "if π is associated with process i and variable x, then whether or not π is enabled should depend only on the state of process i, although the resulting changes may also depend on the value of x." This means processes commit to an access (make a "bid") without knowing the outcome in advance. The atomicity guarantee ensures no other step can interpose between the decision to access and the access itself.

**Variable types** formalize what operations are available on shared state:
- **Read/write registers**: `f(read, v) = (v, v)`, `f(write(v), w) = (ack, v)`
- **Read-modify-write**: `f(h, v) = (v, h(v))` where h is any function V → V
- **Compare-and-swap**: `f(cas(u,v), w) = (w, v) if u = w, else (w, w)`
- **Test-and-set**: `f(test-and-set, v) = (v, 1)`

The choice of variable type is architectural. With read/write registers: mutual exclusion requires n variables; consensus is impossible under asynchrony. With read-modify-write: mutual exclusion requires 1 variable; consensus becomes solvable. This gap cannot be bridged algorithmically—only by changing the hardware/infrastructure.

## The Network Model: Synchronous and Asynchronous

**Synchronous networks**: Computation proceeds in discrete rounds. In each round, every process simultaneously: (1) sends messages to its neighbors, (2) receives messages from its neighbors, (3) performs local computation. "This is the simplest model to describe, to program, and to reason about."

The state machine for a synchronous process has:
- A state set including the initial state
- A `msgs_i` function mapping (current state, neighbor set) → messages to send
- A `trans_i` function mapping (current state, received messages) → new state

An execution is a sequence of states and round vectors. Safety properties are proven by finding invariant assertions that hold at every round; liveness properties are proven by showing that in every possible execution, progress is made toward the goal.

**Asynchronous networks**: "Processors take steps in an arbitrary order, at arbitrary relative speeds. It is harder to program than the synchronous model because of the extra uncertainty." In asynchronous networks, there are no rounds. Any process can take a step at any time. Messages can be delayed arbitrarily (but must eventually be delivered, under fairness).

The key challenge: "Invariant assertion proofs work for asynchronous networks just as well as for synchronous networks; the main difference is that now the method must be applied at a finer granularity, to reason about individual events rather than about rounds."

**Partially synchronous networks**: "The most realistic, but they are also the most difficult to program." A boundmap assigns `[lower(C), upper(C)]` bounds to each task C, meaning: no action in task C can fire before lower(C) time units have elapsed, and C must fire before upper(C) time units have elapsed (if still enabled). This replaces the fairness condition of asynchronous models with timed execution constraints.

## Proof Method 1: Invariant Assertions

An invariant assertion is a predicate P on states such that: (1) P holds in every initial state, and (2) for every transition (s, π, s'), if P(s) then P(s').

If P is an invariant, then P holds in every **reachable state**—every state that can occur in any execution, under any interleaving, starting from any initial state.

**Example from Peterson's Two-Process Algorithm** (Chapter 10):

Assertion 10.5.1: "In any reachable system state, if flag(i) = 0, then pc_i ∈ {leave-exit, rem, set-flag}."

Assertion 10.5.2: "In any reachable state, if process i has passed the test (pc_i ∈ {check-flag, crit, leave-exit}) and process i is in T-D ∪ C ∪ E, then turn ≠ i."

Together, these two assertions imply mutual exclusion: if both processes were in the critical section, both would have passed the test, so both would need turn ≠ i and turn ≠ j simultaneously—impossible since turn is a single value.

**Example from Timing-Aware Systems** (Chapter 23):

In partially synchronous systems, invariants must include timing information. The key invariant for FischerME (Assertion 24.2.2):

"In any reachable state, if pc_i = check and turn = i and pc_j = set, then first(check_i) > last(main_j)"

Where `first(check_i)` is the earliest time process i's check step can fire, and `last(main_j)` is the latest time process j's main step will fire. The invariant says: if i has set turn to itself and is about to check, and j is still in the set phase, then i's check will necessarily happen *after* j's set completes. This timing relationship is what makes the algorithm correct—and its proof requires reasoning about the `first` and `last` components of the GTA state.

**The inductive proof structure**:
1. Prove P holds in all initial states (base case)
2. For each action π, prove: P(s) ∧ (s, π, s') → P(s') (inductive step)
3. Often need auxiliary invariants Q (stronger than P) to make the induction go through; prove P ∧ Q together

The difficulty is discovering the right invariant. In simple algorithms, the invariant is natural. In complex algorithms like GHS (asynchronous MST), "at the present time, no simple proof is known"—the invariants are complex enough that multiple published proofs exist without a consensus on the clearest.

## Proof Method 2: Simulation Relations

A simulation relation from automaton A to automaton B is a relation R ⊆ states(A) × states(B) such that:
1. For every initial state s₀ of A, there exists an initial state u₀ of B with (s₀, u₀) ∈ R
2. For every transition (s, π, s') of A and every u with (s, u) ∈ R, there exists a sequence of transitions of B starting from u that results in state u' with (s', u') ∈ R and the same external actions as π

If such a relation exists, then every trace of A is a trace of B. This means: if B is correct, then A is correct. Simulation relations are the primary tool for:

- **Proving optimizations correct**: OptFloodMax is proven correct by showing it simulates FloodMax (Assertion 4.1.7: "For any r, 0 < r < diam, after r rounds, the values of the u, max-uid, status, and rounds components are the same in both algorithms.")

- **Proving implementations against specifications**: A concrete algorithm with explicit data structures is related to an abstract specification automaton

- **Proving one model simulates another**: The transformation Trans(A) from shared memory algorithms to systems using atomic objects is proven correct by showing the transformed system simulates the original (Theorem 13.7)

- **Proving modular compositions**: If A simulates B and C simulates D, and the compositions A ∥ C and B ∥ D are compatible, then A ∥ C simulates B ∥ D

**Example—TicketME and InfiniteTicketME** (Chapter 13):

TicketME uses tickets modulo n (bounded memory). InfiniteTicketME uses unbounded integer tickets (trivially correct by direct correspondence with a queue). The simulation relation f maps:
- Ticket values in TicketME to ticket values in InfiniteTicketME via: `ticket_i ↔ ticket_i_unbounded mod n`
- Granted value: `granted ↔ granted_unbounded mod n`

The key proof: when process i checks `ticket_i = granted` in TicketME, this holds iff the corresponding comparison holds in InfiniteTicketME. This is true because the unbounded algorithm maintains the invariant that tickets differ by at most n, so the modulo mapping is injective in the relevant range.

**Why simulation relations scale**: Instead of proving 180 skills compose correctly by exhaustive analysis, you need only prove pairwise simulation relations (each skill simulates its specification) and then compose them. The composition theorem handles the rest.

## Proof Method 3: Indistinguishability Arguments

Two system states s and s' are **indistinguishable to process i** if:
- Process i's state is identical in s and s'
- All shared variables have the same values in s and s'
- All messages in transit to i are the same

If two executions are indistinguishable to process i through some point, and i is non-faulty in both, then i makes the same decisions in both.

Indistinguishability is the primary tool for impossibility proofs:

1. Assume algorithm A exists
2. Construct execution α₀ where some process p "should" decide 0
3. Construct execution α₁ where the same process "should" decide 1
4. Show α₀ and α₁ are indistinguishable to p (p sees exactly the same local events)
5. By indistinguishability, p makes the same decision in both
6. Contradiction: p should decide 0 in α₀ and 1 in α₁

**Example—The n Variables Lower Bound** (Chapter 10):

To show mutual exclusion needs n read/write variables for n processes, the proof constructs a sequence of states where processes "cover" variables (are about to write). The covering argument:

- Assume only k-1 variables
- Construct state where processes 1..k-1 each cover a distinct variable
- Let state be indistinguishable to process k from the idle state
- Run process k to the critical section (possible since k sees idle-looking state)
- Let processes 1..k-1 overwrite their covered variables
- Process k's "evidence" of entering the critical section is erased
- Run some process j to the critical section—j doesn't see k's evidence, so j can also enter
- Both j and k in critical section—violation

**Example—Consensus Impossibility** (FLP-style, Chapters 12, 21):

The adversary maintains a schedule that always moves from one bivalent state to another:
- Initial state is bivalent (with appropriate initial values, both decisions are reachable)
- From any bivalent state, there must be a "critical" step: a step that, if taken, would move to a univalent state
- But if that step involves a process that might "fail," the adversary can delay the step indefinitely without the other processes knowing whether the process failed or is just slow
- This delay maintains bivalence forever
- Result: no process can safely commit to a decision

## Proof Method 4: Lower Bounds via Adversarial Execution Construction

For complexity lower bounds, the proof technique is:
1. Assume an algorithm A achieves complexity C
2. Construct an adversarial input or schedule that forces A to use more than C resources
3. Derive a contradiction

**Example—Leader Election Lower Bound: Ω(n log n) Messages** (Chapter 15):

Define **lines**: linear compositions of processes with FIFO channels. Define **C(L)** = maximum messages sent in any input-free execution of line L.

Lemma 15.13: At least one process can send a message without receiving one. (Else in some ring, no messages are sent, so no process learns its UID, so no leader can be elected—contradiction.)

Lemma 15.14: For every r ≥ 0, there's an infinite collection of disjoint lines where each line of 2ʳ nodes has C(L) > r·2^(r-2).

Proof by induction: Given three disjoint lines L, M, N from the collection, consider all six joins (join(L,M), join(M,L), etc.). Construct four rings from these joins. By indistinguishability arguments, if any ring elected a leader, some other ring must also elect a leader—contradiction. This forces at least one join to use Ω(log n) messages, giving the inductive step.

Conclusion: For a ring of size n = 2ʳ, the lower bound is C(L) > r·2^(r-2) = Ω(n log n). Since wrapping a line into a ring can only increase message count, rings need Ω(n log n) messages.

**The proof technique generalizes**: Whenever you can construct a family of configurations at increasing sizes, define a measure of "communication required" and prove by induction that this measure grows with size. The four-ring argument is the key leverage: it forces a contradiction if any communication budget is too small.

## The Logical Time Transformation

Logical time assigns a total order to events in an asynchronous execution while respecting causality. Four properties define a valid logical time assignment:
1. **Uniqueness**: No two events share a logical time
2. **Local monotonicity**: Each process's events have strictly increasing logical times
3. **Causal respect**: Send event logical time < receive event logical time
4. **Finiteness**: Only finitely many events have logical time < any bound

**Theorem 18.1** (The Reordering Theorem): "Any fair execution α with a logical-time assignment ltime looks to every process like another fair execution α' in which the ltimes behave like real times—that is, in which events occur in the order of their ltimes."

This is a powerful tool: you can reason about asynchronous executions as if they were synchronous, by using logical time as the notion of "when." The CountMoney example shows this: in an asynchronous banking system, you cannot take an instantaneous snapshot. But you can choose a logical time threshold t, have each process record its state when it first crosses t, and the resulting collection is guaranteed to be a consistent snapshot of some reachable system state.

LamportTime implements logical clocks with no synchronization overhead: `clock := max(clock, received_clock) + 1` on every receive. This ensures causal respect at zero algorithm cost—it does not delay any events or change the algorithm's behavior. It only adds a labeling.

## Timed Execution Models and Proof Adaptation

In partially synchronous systems, the proof methods adapt with one critical addition: **the state must include timing information**.

The GTA (General Timed Automaton) model adds to each state:
- `now`: current absolute time
- `first(C)`, `last(C)`: earliest and latest times for each task C

**Preconditions on time passage**: Cannot pass time beyond any task's deadline: `now + t < last(C)` for all enabled tasks C

**Preconditions on actions**: Cannot fire action in task C before `now ≥ first(C)`

Invariant proofs in this setting must handle five types of steps: individual process actions, channel deliveries, time-passage steps, and inputs/outputs. Timing invariants relate the `first` and `last` components of state to each other and to data state.

**Example—FischerME timing invariant** (Chapter 24):

The key invariant (paraphrased): "If process i has set turn := i and is waiting to check (pc_i = check), and process j is still in the set phase (pc_j = set), then the earliest time i can check is after the latest time j will write."

This prevents the bad interleaving: j sets turn := j *after* i sets turn := i but *before* i checks. The timing constraint ensures i's check happens after j's write—so i will see turn = j, not turn = i, and will not enter the critical section.

Simulation proofs in timed settings must additionally show that timing deadlines are preserved: `u.last(timeout) ≥ s.last(dec) + (s.count - 1) × l₂ + l` (from Chapter 23, Example 23.3.3). The simulation relation itself becomes a set of inequalities relating timing components across the implementation and specification states.

## Putting It Together: A Complete Proof Strategy

For any distributed algorithm problem:

1. **Choose the right model**: synchronous, asynchronous, or partially synchronous? shared memory or message passing? What variable types or channel properties?

2. **Define correctness formally**: as a trace property (what sequences of input/output actions are acceptable?), with separate safety and liveness components

3. **Design the algorithm**: construct the state machine, transition relations, and fairness conditions

4. **Prove safety** (using invariants): identify state properties that must hold always, prove by induction on steps

5. **Prove liveness** (using fairness + progress arguments): assume fair execution, identify progress milestones, show system cannot be stuck at each milestone

6. **Prove complexity**: count messages or time in worst-case executions; use amortized analysis for algorithms like GHS

7. **Establish lower bounds**: use indistinguishability, covering, or adversarial construction to show no algorithm can do better

8. **Prove optimizations correct** (using simulation): relate optimized algorithm to baseline via simulation relation

This methodology does not scale by skipping steps. The complexity of distributed algorithms—and the subtlety of their failures—makes every step necessary. The book demonstrates this on every major algorithm, from the simple FloodMax to the intricate GHS.