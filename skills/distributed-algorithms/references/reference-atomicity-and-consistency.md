# Atomicity and Consistency: What Shared State Can and Cannot Do

## The Central Architectural Question

Every distributed system with shared state faces a question that is rarely made explicit: what operations does the shared state support? Lynch's treatment of atomic objects (Chapter 13) and shared memory models (Chapter 9) makes this question central—because the answer determines what coordination problems are solvable and what algorithms are possible.

"In a variable type, the invocations and responses are thought of as occurring together as part of one function application, whereas in the I/O automaton model, inputs and outputs are separate actions (and other actions may occur between them)."

This distinction—between "happening together" and "separate actions with interposition"—is the entire practical content of the word "atomicity."

## The Hierarchy of Variable Types

Variable types are specified by a function f: invocations × values → responses × values. This function encodes what happens when an operation is applied.

### Read/Write Registers

The simplest type:
- `f(read, v) = (v, v)`: return current value, leave unchanged
- `f(write(v), w) = (ack, v)`: return acknowledgment, update to v

Read/write registers are the baseline. Every realistic shared memory system supports them. Their simplicity is also their limitation: critical coordination properties require that decision and action happen atomically, but read/write registers separate these into two distinct operations.

**The consensus impossibility** (FLP, Theorem 12.8) applies exactly at this boundary: "There does not exist a shared memory system using read/write shared variables that implements a consensus algorithm and guarantees 1-failure termination." Any asynchronous consensus algorithm over read/write shared memory must have at least one "bivalent" state reachable from some bivalent initial state, allowing an adversary to prevent decision indefinitely.

**The mutual exclusion requirement** (Theorem 10.33): Any mutual exclusion algorithm using only read/write shared variables requires at least n distinct variables for n processes. The proof: each process must write to an "uncovered" variable (one no other process is simultaneously overwriting) on its way to the critical section. With k-1 variables, if k-1 processes each cover a different variable, the k-th process has no uncovered variable to write—contradiction.

These two results establish the hard floor for read/write registers. Below this floor, algorithms cannot succeed regardless of their cleverness.

### Read-Modify-Write (RMW) Variables

The invocations are all functions h: V → V:
- `f(h, v) = (v, h(v))`: return old value, update with h applied

The process submits a function; the variable atomically applies it and returns the old value. This includes:
- Standard write: h(v) = w (constant function)
- Increment: h(v) = v + 1
- Fetch-and-add: h(v) = v + c
- Test-and-set: h(v) = 1 (always)
- Compare-and-swap: h(v) = u if v = u_expected, else v (conditional swap)

**What changes**: With RMW, TrivialME solves mutual exclusion with a single shared variable: `if x=0 then x:=1 and enter`. The atomicity of the test-and-set means no two processes can both see x=0. The impossibility from Theorem 10.33 does not apply because it assumed only read/write operations.

**Consensus becomes solvable**: With compare-and-swap, process i submits function `h_v` that sets the value to v if the current value is "unknown," otherwise leaves it unchanged. The first process to submit wins; all others see the winning value. This is correct atomic consensus.

**Why atomicity resolves the impossibility**: The FLP proof constructs an adversary that exploits the gap between reading and writing in separate operations. With atomic RMW, this gap disappears—there is no interposition window between "check the value" and "set the value based on the check."

### Snapshot Objects

A snapshot object supports:
- `update(i, w)`: process i updates its component to w
- `snap`: atomically reads all n components and returns the current vector

Snapshots are powerful because they provide a consistent view across all components at a single instant—something that separate reads cannot guarantee.

**UnboundedSnapshot algorithm** (Chapter 13): Each component stores (val, tag) where tag is an unbounded integer. Update: first perform embedded-snap, then increment tag and write (val, tag, embedded-snap-result). Snap: read all components twice.
- If all tags unchanged between two reads: the result is consistent (Observation 1)
- If four different tags seen for some component i: one of i's updates completed entirely within the snap interval; reuse that update's embedded-snap result (Observation 2)

Termination bound: "after 3m + 1 sets of reads, there must either be two consecutive sets with no changes or else some variable x(i) with at least four different tags." This is a clean combinatorial argument: either the system stabilizes or it makes enough updates that we can reuse a completed update's snapshot.

**BoundedSnapshot**: Uses handshake with toggle bits instead of unbounded tags. Before each update, process i reads all acknowledgment bits `y(j).ack(i)` for all j. In the update write, sets `x(i).comm(j) := ¬(y(j).ack(i))` for all j and flips its toggle. During snap: check that communication bits and toggle match between two reads of the same process. If they match, no update occurred between reads.

Why toggle bits are necessary: without them, two consecutive updates by the same process can look identical to a snap, making it impossible to detect the update occurred. Toggle bits provide a simple "I changed since last time" signal.

### The Composition Principle

**Corollary 13.9**: Suppose A is an atomic object guaranteeing I-failure termination and all Bx's are atomic objects guaranteeing I-failure termination. Then Trans(A) (the transformed version of A using Bx's in place of shared variables) is also an atomic object guaranteeing I-failure termination.

This compositionality is the key to building complex systems from simple components. If layer 1 objects are atomic and layer 2 objects use only layer 1 operations, then layer 2 objects are automatically atomic.

**The transformation Trans(A)**: Mechanically replaces direct variable accesses in algorithm A with invocation-response pairs to atomic object automata Bx. Turn functions ensure that at each port, either the system is acting or the user is acting—never both simultaneously. Theorem 13.7 proves the transformation is behaviorally transparent: any fair execution of Trans(A) can be mapped to an equivalent fair execution of the original system by collecting and reordering invocation-response pairs.

**Incomplete operations don't break correctness** (Lemma 13.10): If a process fails mid-operation, the partial execution does not corrupt the system state. The atomicity is preserved because:
1. Remove the stop event → get a failure-free execution
2. Extend to fair execution (Theorem 8.7: fair extension always exists)
3. In the fair extension, all operations complete
4. The complete execution satisfies atomicity
5. Atomicity is prefix-closed → original execution satisfies atomicity

This is why well-designed distributed systems can tolerate process failures without leaving shared state in inconsistent intermediate states.

## The Impossibility Propagation

The most powerful technique in Chapter 13 is using composition to propagate impossibilities:

**Theorem 13.11**: There does not exist a shared memory system using read/write shared variables that implements a read-modify-write atomic object and guarantees 1-failure termination.

Proof: Suppose such an implementation B exists.
1. Take consensus algorithm A that uses RMW (exists, from Chapter 12)
2. Apply transformation Trans(A) using B: get a consensus algorithm using only read/write variables
3. But Theorem 12.8 says no such algorithm exists with 1-failure termination
4. Contradiction—B cannot exist

This is **meta-reasoning**: we prove B is impossible not by direct analysis of B, but by showing that B's existence would contradict an already-established impossibility. This technique transfers broadly: if you can show that implementing primitive X would enable solving problem Y, and Y is impossible, then X is impossible to implement.

## Serialization and Atomicity: Formal Definition

Atomicity (Definition 13.1) is defined in terms of existence of a total order on operations:

An execution satisfies atomicity if there exists a total order T on completed operations such that:
1. **Finite predecessors**: Each operation has finitely many predecessors in T
2. **Causality respect**: If operation op₁'s response precedes op₂'s invocation in real time, then op₁ precedes op₂ in T
3. **Correctness**: The sequence of operations in T order is a valid trace of the abstract variable type (returns correct values per the type's function f)

This definition captures the intuition of "appears to happen instantaneously at some point between invocation and response." The point can be chosen flexibly (any point in the interval), but must be consistent with causal ordering and type-correct.

**Lemma 13.16** gives a practical proof technique for atomicity via partial orders:

To prove an algorithm implements an atomic object, define a partial order ≺ on operations satisfying:
1. Finite predecessors under ≺
2. Compatibility with causality (response-before-invocation implies ≺ order)
3. Total order on writes (distinct serialization points)
4. Correct return values (each read returns value of preceding write in ≺ order)

If these four conditions hold, the execution is atomic. This is constructive: finding the partial order is the proof.

**Example—VitanyiAwerbuch Algorithm** (Chapter 13):

n² shared variables x(i,j) where x(i,j) is readable only by process i, writable only by process j. Each x(i,j) contains (val, tag, index).

WRITE(v)ᵢ:
1. Read all x(i,j) to find max tag k
2. Write to all x(j,i): val := v, tag := k+1, index := i

READ(i):
1. Read all x(i,j); find (v, k, j) with max (tag, index)
2. Write to all x(j,i) (propagate best information)
3. Return v

Partial order: operation π ≺ operation φ if tagpair(π) < tagpair(φ).

Claim 13.19 proves tags are strictly increasing for writes (by monotone reading before writing). Claim 13.21 proves reads return values from maximum tagpair predecessor. Together: the partial order satisfies all four conditions of Lemma 13.16 → the algorithm is atomic.

## Consistency Levels in Distributed Systems

Lynch's treatment implicitly defines a spectrum of consistency guarantees:

**Sequential consistency** (from simulation): An execution is sequentially consistent if there exists a sequential execution of the abstract type that explains all operations' return values. Weaker than atomicity because it does not require the sequential order to respect real-time precedence.

**Linearizability / Atomicity**: Sequential consistency + real-time respect. This is Lynch's primary definition. Also called "Herlihy-Wing linearizability" in the research literature.

**Causal consistency**: A weaker version where the order only needs to respect causal dependencies (messages and process order), not all real-time precedences. Lynch mentions this implicitly through logical time (Chapter 18).

**Eventual consistency**: Not formally defined in Lynch but implied by stabilization arguments in asynchronous algorithms: the system state "eventually" reflects all updates, but no guarantee about when.

The practical hierarchy: for designing correct distributed systems, linearizability is the target. For performance at scale (or under network partitions), weaker consistency levels may be accepted—but with careful analysis of what correctness properties they still allow.

## Atomicity in Practice: What Architecture Must Provide

The theory gives clear guidance on what infrastructure must provide for different coordination tasks:

| Coordination Task | Required Atomicity | Minimum Shared State |
|-------------------|-------------------|----------------------|
| Mutual exclusion (deterministic) | None (read/write) | n variables |
| Mutual exclusion (RMW) | RMW | 1 variable |
| Consensus (fail-stop) | Read/write + failure detection | n variables + FD |
| Consensus (Byzantine) | Signed messages | n > 3f processes |
| Snapshot | Read/write | n variables with unbounded tags |
| Bounded snapshot | Read/write + toggle | n variables with 2-bit tags |

The progression down this table represents increasing hardware cost but decreasing algorithmic complexity. Teams choosing between strong primitives (expensive hardware, simple software) and weak primitives (cheap hardware, complex software) can use this table to make that trade-off explicit.

**Key principle**: "When we rewrite the algorithm in this way, the agreement condition mentioned in Example 9.1.1 is no longer guaranteed." (Chapter 9)—This is the punchline of the entire atomic objects chapter. When you remove atomicity from a coordination algorithm, correctness breaks. Not degrades—breaks. You cannot patch around the absence of atomicity with clever software. You must either provide atomic primitives or accept that certain properties cannot be guaranteed.