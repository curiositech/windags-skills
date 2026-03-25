---
license: Apache-2.0
name: distributed-algorithms
description: Foundational distributed computing algorithms for consensus, coordination, and fault tolerance
category: Research & Academic
tags:
  - distributed-algorithms
  - consensus
  - coordination
  - fault-tolerance
  - theory
---

# SKILL.md — Distributed Algorithms (Lynch)

license: Apache-2.0
```yaml
name: distributed-algorithms-lynch
description: >
  Reasoning framework for distributed systems design, correctness, and
  impossibility — grounded in Lynch's formal automata-theoretic treatment.
  Covers synchronous/asynchronous/partially-synchronous models, failure
  models, consensus, and impossibility results as engineering constraints.
version: 1.0
activation_triggers:
  - distributed systems design or architecture questions
  - consensus, leader election, or coordination problems
  - "is this possible?" questions about distributed guarantees
  - fault tolerance and replication design
  - debugging liveness or safety violations in distributed systems
  - CAP theorem, FLP, Byzantine fault tolerance mentions
  - questions about consistency models (linearizability, serializability)
  - concurrent/shared-memory synchronization hierarchy questions
  - formal verification of distributed protocols
  - questions about timeouts, clocks, and timing assumptions
```

---

## When to Use This Skill

Load this skill when someone is:

- **Designing** a distributed protocol and needs to know what's achievable
- **Debugging** a distributed system that "should work" but doesn't — often because they're attempting something impossible
- **Evaluating** claims that a system tolerates f failures, achieves consensus, or provides strong consistency
- **Choosing** between architectural options where the right choice depends on the timing or failure model
- **Proving** (or needing to prove) correctness of a concurrent or distributed algorithm
- **Hitting a wall** — when more engineering effort isn't fixing a fundamental problem

**Signal phrases**: "eventually consistent," "we can't get all nodes to agree," "our leader election is flaky," "we need linearizability," "how many failures can we tolerate," "is this CAP-related?"

---

## Core Mental Models

### 1. The Four-Dimensional Design Space

Every distributed algorithm lives at a point defined by:

| Dimension | Options | Effect on Solvability |
|-----------|---------|----------------------|
| **Communication** | Shared memory / Message passing | Changes primitive power; most results translate via simulation |
| **Timing** | Synchronous / Asynchronous / Partially synchronous | *Most* consequential — determines what's provably achievable |
| **Failure model** | None / Crash / Omission / Byzantine | Determines n > kf thresholds and algorithm complexity |
| **Problem class** | Consensus / Election / Broadcast / Allocation | Different hardness in each timing+failure combination |

**Practical implication**: Before writing a line of code, identify where you are in this space. Moving even one dimension can flip a problem from unsolvable to trivial — or vice versa.

---

### 2. Impossibility Results Are Engineering Constraints

The foundational negative results are not academic — they are the most useful theorems in the book:

- **FLP (Fischer-Lynch-Paterson)**: Consensus is *impossible* in a fully asynchronous system with even one crash failure
- **Byzantine threshold**: Consensus with Byzantine failures requires n > 3f processes
- **Leader election lower bound**: Any leader election algorithm requires Ω(n log n) messages

These mean: *if you are in that regime and your protocol isn't working, no amount of debugging will fix it.* The correct response is to relax an assumption — add a timeout (partial synchrony), strengthen failure detection, reduce the failure tolerance requirement.

---

### 3. Formal Models Are the Minimum Viable Reasoning Tool

Informal reasoning about concurrent systems fails — systematically and silently. Lynch's warning:

> "Without such care, it is difficult to avoid mistakes."

The tools that work: **state machines** (I/O automata), **invariant assertions**, **simulation relations**, **execution traces**. Informal prose about distributed behavior is unreliable at the intersection of interleaving, timing, and failure modes. Use formal reasoning whenever correctness matters — not as gold-plating but as the minimum that actually works.

---

### 4. Modularity Through Atomic Abstraction

The atomicity composition theorem (Theorem 13.7): if each layer atomically implements its interface, the composed system is atomic. This enables:

- Prove correctness at layer N once
- All higher layers inherit it
- Replace implementations without re-proving upper layers

This is why atomicity/linearizability is the right correctness condition for building composable systems. Weaker conditions (sequential consistency, eventual consistency) don't compose cleanly.

---

### 5. Every Tradeoff Is Quantifiable

Relaxations have measurable, provable benefits:

- k-set agreement (allow k distinct values) → round complexity divides by k
- Adding timing bounds → consensus achievable in Ld + (f−1)d time
- Crash vs. Byzantine tolerance → Byzantine costs a factor of n in message complexity
- Synchronous vs. asynchronous → same problem can be O(f) rounds vs. impossible

When someone says "we'll just relax consistency a bit," the Lynch framework demands: *which relaxation, by exactly how much, and what do you gain?*

---

## Decision Frameworks

### When someone asks "can we solve X in our distributed system?"

```
1. Identify timing model: Is there a bound on message delay? Process speed?
   → Synchronous: most problems solvable
   → Asynchronous: check impossibility results FIRST
   → Partially synchronous: consensus achievable, with caveats

2. Identify failure model: What failures must be tolerated?
   → Crash: n > 2f for most consensus variants
   → Byzantine: n > 3f required, no exceptions

3. Check known impossibility results:
   → Async + any crash failure + consensus = IMPOSSIBLE (FLP)
   → Byzantine + n ≤ 3f = IMPOSSIBLE
   → If impossible, ask: which assumption can we relax?

4. If possible: what are the complexity costs?
   → Time complexity: rounds or real-time bounds?
   → Message complexity: O(n²) or O(n log n)?
   → Is that acceptable for the use case?
```

---

### When a distributed protocol "isn't working"

```
If the system seems correct but non-terminating (liveness issue):
  → Check: are you in an asynchronous model with failures? (→ FLP applies)
  → Check: is your failure detector strong enough? (eventually perfect ◇P?)
  → Check: are timing assumptions actually met in deployment?

If the system terminates but produces wrong values (safety issue):
  → Check: is your failure threshold n > 2f (crash) or n > 3f (Byzantine)?
  → Check: are atomic operations actually atomic? (linearizability)
  → Formalize executions as state traces; find the invariant violation

If behavior is inconsistent across nodes:
  → Check: which consistency model are you actually implementing?
  → Linearizability ≠ sequential consistency ≠ eventual consistency
  → These do not compose interchangeably
```

---

### When choosing a consistency/coordination model

```
Need strong composability?           → Linearizability (atomic objects)
Need only single-object correctness? → Sequential consistency (weaker, cheaper)
Tolerating staleness?                → Eventual consistency (but: no FLP escape
                                        without also giving up something else)
Need consensus specifically?         → Must be partially synchronous at minimum;
                                        identify failure detector class needed
```

---

### When designing for fault tolerance

```
f failures to tolerate:
  Crash stop    → need n > 2f, use crash-tolerant consensus (Paxos-family)
  Byzantine     → need n > 3f, use BFT protocol (cost: O(n) factor overhead)
  
Failure detector availability:
  Perfect P     → synchronous system or unrealistic assumption
  Eventually ◇P → achievable in partially synchronous systems; sufficient for consensus
  
If you can't afford n > 3f:
  → Reduce f (tolerate fewer failures)
  → Use cryptographic authentication to convert Byzantine → authenticated Byzantine
    (reduces to n > 2f with authentication)
```

---

## Reference Files

Load these on demand based on what's needed:

| File | When to Load |
|------|-------------|
| `references/impossibility-results-as-engineering-constraints.md` | Someone is attempting something that might be provably impossible; FLP, Byzantine thresholds, or lower bounds are relevant; need to justify stopping or changing approach |
| `references/timing-models-and-their-consequences.md` | Choosing between synchronous/asynchronous/partially-synchronous architectures; timeouts and failure detectors are in scope; "why does consensus work here but not there?" |
| `references/failure-models-and-fault-tolerance.md` | Designing fault-tolerant systems; evaluating how many failures a system can handle; Byzantine vs. crash fault distinction matters |
| `references/distributed-consensus-the-complete-picture.md` | Consensus, Paxos, Raft, leader election, atomic broadcast, or any agreement protocol is under discussion; need the complete problem taxonomy |
| `references/formal-proof-methods-for-distributed-systems.md` | Proving correctness; finding subtle bugs via formal reasoning; invariant-based arguments; simulation relations needed |
| `references/synchronization-primitives-and-atomic-objects.md` | Shared-memory concurrency; compare-and-swap power hierarchy; wait-free vs. lock-free; building atomic objects from weaker primitives |
| `references/algorithm-design-patterns-and-canonical-problems.md` | Need a known algorithm for a canonical problem (broadcast, election, snapshot); looking for a design pattern; connecting a new problem to a known one |

---

## Anti-Patterns

These are mistakes Lynch's framework directly prevents:

**1. Trying to solve consensus in a pure async system**
Spending weeks tuning a consensus protocol that will never terminate under failures. FLP says: relax the timing model, don't add more retries.

**2. Under-counting processes needed for Byzantine tolerance**
Assuming n > 2f suffices when Byzantine failures are possible. The correct threshold is n > 3f. Systems with n = 3 tolerating 1 Byzantine fault are unsound.

**3. Treating consistency models as interchangeable**
Mixing linearizable and sequentially consistent components assuming the result is linearizable. Atomicity composes; weaker conditions don't.

**4. Informal reasoning about interleaving**
Writing prose arguments about why "this can't happen" in concurrent execution. Informal concurrent reasoning fails silently. The fix: state machines and invariant assertions.

**5. Conflating safety and liveness failures**
Treating a liveness bug (system halts) the same as a safety bug (system produces wrong result). They have different causes, different impossibility results, and different fixes.

**6. Ignoring the failure detector requirement**
Implementing consensus in a "partially synchronous" system without specifying what failure detector is available and whether it's sufficient (◇P is the minimum for consensus).

**7. Assuming relaxed consistency is "free"**
Choosing eventual consistency to escape CAP/FLP constraints without accounting for what application-level invariants now become the programmer's problem.

---

## Shibboleths

**How to tell if someone has actually internalized Lynch vs. just read the summary:**

✓ **Internalized**: When told "our consensus is broken," their first question is "what's your timing model and failure model?" — not "what algorithm are you using?"

✓ **Internalized**: They know FLP is about *asynchronous* systems specifically, and immediately ask "so what synchrony assumption does your system actually make?" rather than concluding "consensus is impossible."

✓ **Internalized**: They distinguish between the *possibility* result (can we solve this at all?) and the *complexity* result (at what cost?) as two separate questions requiring separate answers.

✓ **Internalized**: When someone says "we use eventual consistency," they ask "eventual consistency of *what*? Under what conflict resolution rule? With what convergence guarantee?" — not just nod.

✓ **Internalized**: They know the synchronizer doesn't make async systems synchronous — it provides a *simulation* that preserves certain properties, and they know which properties are and aren't preserved.

---

**How to spot someone who only read the summary:**

✗ They cite FLP as a reason consensus is "basically impossible" without specifying the async model assumption.

✗ They say "Byzantine fault tolerance requires 3x the nodes" without knowing *why* 3f+1 and not 2f+1 (the triangle argument: can't distinguish which third is lying).

✗ They treat "linearizable" and "serializable" as synonyms.

✗ They believe adding more replicas always increases fault tolerance (it does for availability; for Byzantine tolerance it requires n > 3f which is a different constraint).

✗ They argue informally that "the race condition can't happen in practice" rather than proving it can't happen via invariant.

---

*Load reference files from the table above when deeper treatment of a specific topic is needed.*