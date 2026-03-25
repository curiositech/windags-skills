# Formal Proof Methods for Distributed Systems

## Why Informal Reasoning Fails

Lynch's most repeated warning:

> "A rigorous treatment is especially important in the area of distributed algorithms because of the many subtle complications that arise. Without such care, it is difficult to avoid mistakes."

And more specifically:

> "Even though the code for an algorithm may be short, the fact that many processors execute the code in parallel, with steps interleaved in some undetermined way, implies that there are many different ways in which the algorithm can behave, even for the same inputs."

The problem is not that distributed systems are complex — it's that they are *combinatorially* complex. A sequential program with n lines has at most n! orderings of execution; a distributed system with k processes each executing n steps has k^n possible interleavings, many of which reveal bugs invisible to testing.

Formal proof methods are not optional formalism. They are the minimum tools required to reason correctly about concurrent systems.

---

## The Three Proof Methods

Lynch advocates three proof styles, each appropriate for different properties:

1. **Operational proofs**: Ad hoc arguments about executions
2. **Invariant assertion proofs**: Systematic inductive assertions about reachable states
3. **Simulation proofs**: Relating one algorithm to another

> "Invariant assertions are the single most important formal tool for reasoning about the correctness of asynchronous algorithms."

---

## Method 1: Invariant Assertions

### The Basic Pattern

An invariant is a property P of system states that:
- Holds in all initial states (base case)
- Is preserved by every transition (inductive step)
- Therefore holds in every reachable state

**Formal structure**:
```
Assertion P(s):
  [Property about state variables]

Proof by induction on execution steps:
  Base: P holds in s₀ (initial state)
  Inductive step: If P(s), then for any transition t: P(t(s))
    Case t = transition_type_1: [argument that P preserved]
    Case t = transition_type_2: [argument that P preserved]
    ...
  Conclusion: P holds in all reachable states
```

### DijkstraME: The Canonical Example

The DijkstraME algorithm uses two-stage flags:
- flag=1: "might be interested"
- flag=2: "definitely trying"

**Mutual exclusion proof requires three auxiliary assertions** (Section 10.3.3):

**Assertion 10.3.2**: "At most one process has its flag set to 2 and has the turn variable set to its index."

**Assertion 10.3.3**: "If process i has flag set to 2 and turn set to i, then no other process can enter the critical region without first setting turn."

**Assertion 10.3.4**: "The mutual exclusion property." (Follows from 10.3.2 and 10.3.3.)

Note: The main correctness property (10.3.4) *follows from* auxiliary invariants (10.3.2, 10.3.3). Neither auxiliary invariant directly states mutual exclusion, but together they imply it. This is the standard pattern: you need stronger auxiliary invariants to induct on.

**Operational proof vs. assertional proof**: The book presents both styles for DijkstraME (Sections 10.3.2 and 10.3.3). The operational proof is shorter; the assertional proof is longer but:
- Each assertion is independently verifiable
- The chain of reasoning is explicit
- Induction is clear

"The assertional proof is *longer but clearer*: each assertion is independently verifiable, the chain of reasoning is explicit."

### Peterson2P: Cleaner Invariants

Peterson2P uses a non-obvious flag semantics: setting turn := i *gives the other process priority*.

**Assertion 10.5.2** (key invariant): "If process i has 'won' (reached leave-try), then turn ≠ i."

This invariant is non-obvious because:
- i sets turn := i (seems like claiming priority)
- But if both processes set turn, the *last setter* has lower priority
- This is opposite of intuitive expectation

Once you have 10.5.2, mutual exclusion follows: if both i and ī reach leave-try simultaneously, both must have turn ≠ i simultaneously — impossible since turn can only have one value.

**The construction method**: To find good invariants:
1. Run the algorithm mentally for several steps
2. Observe what properties persist
3. Generalize to an assertion
4. Verify inductively

---

## Method 2: Simulation Relations

### The Concept

A simulation relation f maps states of one algorithm B to states of another algorithm A, such that:
- f relates initial states
- If f relates states, then every step of B can be "matched" by steps of A, preserving f

This proves: every behavior of B is a behavior of A. If A is correct, B is too.

**Formal definition**: f is a simulation relation from B to A if:
1. For all initial states s₀ of B: f(s₀) is an initial state of A
2. For all reachable states s, s' of B with s -π→ s': there exists a sequence of steps from f(s) to some state t' such that f(s') = t'

### OptFloodMax → FloodMax (Chapter 4)

**Setup**: FloodMax is simple but sends redundant messages. OptFloodMax optimizes by only sending when max-uid changes. How to prove OptFloodMax is correct without re-proving all invariants?

**Simulation proof** (Section 4.1.2):

**Assertion 4.1.7**: "For any r, 0 < r < diam, after r rounds, the values of the u, max-uid, status, and rounds components are the same in the states of both algorithms."

**Proof by induction on r**:
- Base (r=0): Both start with max-uid = own UID, status = unknown ✓
- Inductive step: If max-uid is the same after r rounds, then messages sent in round r+1 are the same (OptFloodMax sends only when max-uid changes, but FloodMax always sends — however, if max-uid didn't change, FloodMax's message is a duplicate of the previous round's, which recipients already have)

**Conclusion**: OptFloodMax produces identical max-uid values at each process at each round. FloodMax is correct. Therefore OptFloodMax is correct.

**The meta-pattern**:
> "The method we just used to prove the correctness of OptFloodMax is often useful for proving the correctness of 'optimized' versions of distributed algorithms. First, an inefficient but simple version of the algorithm is proved correct. Then a more efficient but more complicated version of the algorithm is verified by proving a formal relationship between it and the simple algorithm."

This is proof reuse: don't prove everything from scratch. Prove the reference correct once; prove optimizations via simulation.

### TicketME → InfiniteTicketME (Chapter 10)

**Setup**: InfiniteTicketME uses unbounded tickets (provably correct, trivially). TicketME uses modular arithmetic (tickets wrap around mod n). How to prove wraparound doesn't cause problems?

**Simulation relation f**: States of TicketME and InfiniteTicketME correspond when ticket values are equal modulo n.

**Key invariant** (Lemma 10.45): "Non-null tickets form interval [granted, next)" with granted < next < granted+n.

This invariant ensures all outstanding tickets are distinct modulo n. When a ticket wraps, old tickets have been granted. So (ticket = granted mod n) checks work correctly.

**The simulation then shows**: Every TicketME trace is a trace of InfiniteTicketME (with modular reinterpretation). InfiniteTicketME satisfies FIFO mutual exclusion. Therefore TicketME satisfies FIFO mutual exclusion.

### Transformation Theorems: Simulation at Scale

Chapter 13's **Theorem 13.7** is the most powerful simulation result:

> "If α is any execution of Trans(A) × U, then there exists an execution α' of A × U such that (1) α and α' are indistinguishable to U, and (2) if α is fair and every object Bₓ guarantees I-failure termination, then α' is also fair."

**What this means**: Replace any shared variable x in algorithm A with an atomic object implementation Bₓ. Users cannot observe the difference.

**Proof construction**:
1. **Serialization**: For each completed operation, insert a serialization point within its interval
2. **Event movement**: Move invocation/response pairs to their serialization points (valid because "process i performs no locally controlled actions while waiting for response")
3. **Incomplete operations**: Remove invocations with no response ("if process i performs incomplete operation, it does nothing after. It doesn't matter if i stops just before issuing invocation, while waiting, or just after receiving response")
4. **Replace**: All invocation/response pairs now occur consecutively at serialization points → replace with atomic variable access

**The composition corollary (Corollary 13.9)**:

> "If A and all Bₓ's are atomic objects guaranteeing I-failure termination, then Trans(A) is also an atomic object guaranteeing I-failure termination."

This enables multi-layer composition: prove Layer N atomic once; compose it with Layer N+1; the composition is automatically atomic. This is the theoretical foundation for hierarchical system design.

---

## Method 3: Indistinguishability Arguments

Indistinguishability is the key tool for impossibility proofs. Two executions are indistinguishable to process i if i sees the same sequence of local events (states, transitions) in both.

**Definition 9.3**: "States s and s' are indistinguishable to process i if the state of process i, the state of Uᵢ, and the values of all the shared variables are the same in s and s'."

### The Chain Argument Pattern (For Impossibility)

The standard impossibility proof pattern (used in FLP, Byzantine agreement, mutual exclusion):

1. **Construct chain**: Build a sequence exec(p₀) → exec(p₁) → ... → exec(pₙ) where:
   - exec(p₀): some starting condition forces one decision
   - exec(pₙ): different starting condition forces different decision
2. **Indistinguishability at each link**: Every consecutive pair (exec(pᵢ), exec(pᵢ₊₁)) looks identical to some process qᵢ
3. **Decision propagation**: By indistinguishability, qᵢ makes the same decision in both execs
4. **Contradiction**: The chain forces the same decision in exec(p₀) and exec(pₙ), but the starting conditions force different decisions

**Consensus round lower bound proof sketch** (from Theorem 6.31-6.33):
- exec(p₀): all processes start with 0, no failures → must decide 0
- exec(pₙ): all processes start with 1, no failures → must decide 1
- Build chain where each consecutive pair differs only in one process's initial value, with that process potentially crashed
- At each link, the potentially-crashed process looks the same (same local state), so the decision must be the same
- But the endpoints force different decisions → contradiction

**Key insight**: "Use failures strategically to make two different scenarios look the same to a process that hasn't failed yet."

### The Bivalence Argument Pattern

From Chapter 25 (partial synchrony consensus lower bound):

**Definitions**:
- **0-valent state**: Only 0 is "fff-reachable" (reachable via fast, failure-free extension)
- **1-valent state**: Only 1 is fff-reachable
- **Bivalent state**: Both 0 and 1 are fff-reachable

**The proof structure** (Theorem 25.17):
1. **Lemma 25.18**: "Bad combination" (one 0-valent and one 1-valent execution, ≤f−1 failures, distinguishable to ≤1 process) cannot exist
   - If it did: processes not in the distinguishing set see same history → must decide same value
   - But 0-valent and 1-valent executions force different values → contradiction
2. **Lemma 25.19**: "Bad combination must exist"
   - Start with any bivalent execution (must start bivalent by validity)
   - Gradually modify message deliveries; find two consecutive states where valence changes
   - This change = the bad combination
3. **Conclusion**: 25.18 says can't exist; 25.19 says must exist → algorithm A cannot exist

This is a "proof by impossible configuration" — more powerful than direct impossibility proofs because it applies to any correct algorithm.

---

## The Role of Fairness in Liveness Proofs

Safety properties (invariants) hold in all executions. Liveness properties require fairness:

> "The progress condition assumes that the execution of the system is fair...on the other hand, we do not need to assume fairness in order to require that the system guarantee well-formedness or mutual exclusion."

**What fairness means formally** (Section 10.2): "For each process i, one of the following holds: finite execution with no enabled actions, or infinite execution with infinitely many locally controlled actions or infinitely many disabled points."

**The fairness proof pattern** (Lemma 16.3, synchronizer):
1. Suppose task T never executes (violating liveness)
2. Then T's precondition is perpetually enabled
3. Invoke fairness for T's enabling tasks: eventually they execute, producing inputs for T
4. By channel fairness: inputs eventually arrive
5. Now T can execute → contradiction with assumption T never executes

**Liveness requires fairness at every layer**: If a task requires another task to complete first, both must be fair. In a composed system, fairness must hold at the message-channel level, process level, and task level simultaneously.

---

## Timing-Aware Invariants

In partially synchronous systems (Chapters 23-25), invariants extend to include timing:

**Standard invariant** (asynchronous):
```
Inv(state variables only)
Proof: induction on number of steps
```

**Timing-aware invariant** (partially synchronous):
```
Inv(state variables AND deadline variables)
Proof: induction on steps, considering:
  - Discrete actions: test, set, check (affect state variables)
  - Time-passage actions v(t): change "now" but not state variables
```

**Fischer's Mutual Exclusion** (Chapter 24) uses:

**Assertion 24.2.2**: "If two agents both want resource, one's check deadline is after the other's set deadline."

This timing invariant prevents race conditions that state invariants cannot capture. A process can complete its "set" before another's "check" deadline — the timing ensures no overlap is possible.

**The key technique**: Prove that timing inequalities are preserved across all transitions, including time-passage. When a "set" action occurs, update deadline variables appropriately. When a "check" action occurs, verify that deadline conditions hold.

---

## Practical Applications of Formal Methods

### Verification Hierarchy

For a distributed system with n processes, correctness verification requires:

1. **Safety verification** (invariants): Hold in all executions; prove by induction over transitions
2. **Liveness verification** (fairness + progress): Hold in fair executions; prove by showing T's enabling conditions eventually occur
3. **Timing verification** (timed invariants): Hold in all admissible timed executions; prove by tracking deadline variables

Each level is independently verifiable. Composition (Corollary 13.9) ensures that if each layer's verification passes, the composed system's verification passes.

### What to Verify First

**Priority order for distributed systems**:
1. **Mutual exclusion / safety** (no two processes in critical section simultaneously)
2. **Progress** (some process always eventually completes)
3. **Fairness** (each process eventually completes, not just some)
4. **Timing bounds** (processes complete within bounded time)

Each higher level requires the lower levels. Don't verify timing bounds before verifying safety — a system that allows double-entry has no meaningful timing properties.

### Common Invariant Patterns

**Resource exclusivity**:
```
∀resource r, |{i : skill_i holds r}| ≤ 1
```

**Information monotonicity** (FloodSet/FloodMax):
```
W(r) ⊆ W(r+1) (sets only grow)
max-uid(r) ≤ max-uid(r+1) (maximum only increases)
```

**Termination well-foundedness**:
```
After decision, state is absorbing (decision doesn't change)
```

**Causal ordering** (Lamport time):
```
If event π causally precedes φ, then Itime(π) < Itime(φ)
```

These patterns cover the majority of distributed algorithm correctness properties.