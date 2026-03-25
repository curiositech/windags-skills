## BOOK IDENTITY
**Title**: Distributed Algorithms
**Author**: Nancy Lynch
**Core Question**: What can be computed in distributed systems — systems where processors execute concurrently, communicate by message-passing or shared memory, and may fail — and at what cost?
**Irreplaceable Contribution**: Lynch is the only textbook that achieves all four simultaneously: rigorous formal proofs, a unified automata-theoretic framework, comprehensive coverage of synchronous/asynchronous/partially-synchronous models, and impossibility results that function as engineering constraints rather than academic curiosities. The book proves *why* certain distributed problems cannot be solved, giving practitioners a principled basis for knowing when to stop trying and when to relax assumptions instead.

---

## KEY IDEAS

1. **The Multidimensional Design Space**: Every distributed system occupies a point in a four-dimensional space: communication method (shared memory vs. message passing), timing model (synchronous vs. asynchronous vs. partially synchronous), failure model (stopping vs. Byzantine), and problem class (consensus, resource allocation, leader election, etc.). Algorithm design is the art of matching algorithms to points in this space, and moving to an adjacent point can change whether a problem is solvable at all.

2. **Impossibility Results Are Engineering Constraints**: The FLP impossibility (consensus impossible with one crash failure in asynchronous systems), the n > 3f requirement for Byzantine agreement, the Ω(n log n) lower bound for leader election — these are not academic curiosities. They tell you when to stop debugging and start relaxing assumptions. An engineer who doesn't know these bounds will spend weeks trying to build something provably impossible.

3. **Formal Models Enable Correct Reasoning**: "A rigorous treatment is especially important in the area of distributed algorithms because of the many subtle complications that arise. Without such care, it is difficult to avoid mistakes." Informal reasoning about concurrent systems fails at the intersection of interleaving, timing, and failure. State machines, invariant assertions, and simulation relations are not optional formalism — they are the minimum tools needed to reason correctly.

4. **Modularity Through Hierarchical Abstraction**: The transformation theorem (Theorem 13.7) proves that atomic objects compose: if each layer implements its interface atomically, the composed system is atomic. This enables multi-layer system design where correctness at each level is proven once and inherited by all higher levels. The synchronizer (Chapter 16), logical time (Chapter 18), and atomic objects (Chapter 13) all provide this abstraction boundary.

5. **The Tradeoffs Are Precise and Quantifiable**: Relaxing from 1-agreement to k-agreement divides round complexity by k. Adding timing bounds changes consensus from impossible to achievable in Ld + (f−1)d time. Using Byzantine-tolerant primitives costs a factor of n over crash-tolerant ones. Every relaxation has a measurable benefit — and every added power has a measurable cost.

---

## REFERENCE DOCUMENTS

### FILE: impossibility-results-as-engineering-constraints.md
```markdown
# Impossibility Results as Engineering Constraints

## Why This Matters More Than Any Positive Result

Lynch's book contains dozens of algorithms, but its most practically important content is negative: proofs that certain things *cannot* be done. These impossibility results are not academic defeats. They are engineering constraints — the distributed systems equivalent of the second law of thermodynamics. A practitioner who doesn't know them will waste weeks attempting the impossible.

The fundamental principle: **Impossibility results tell you when to stop trying and which assumption to relax instead.**

---

## The FLP Impossibility: Consensus With Even One Failure

**Theorem 21.2** (paraphrased from Lynch): "There is no algorithm in the asynchronous broadcast model with a reliable broadcast channel that solves the agreement problem and guarantees 1-failure termination."

This result — independently proved by Fischer, Lynch, and Paterson in 1985 — is the most important impossibility result in distributed computing. It says:

> "Such impossibility results have practical implications for distributed applications in which agreement is required. These include database systems requiring agreement on whether transactions commit or abort, communication systems requiring agreement on message delivery, and process control systems requiring agreement on fault diagnoses. The impossibility results imply that **no purely asynchronous algorithm can work correctly.**"

The proof uses a *valence argument*. A system state is **bivalent** if both decision values (0 and 1) are reachable from it; **univalent** if only one is. Every correct algorithm must start bivalent (by validity) and end univalent (by agreement). The impossibility shows that any algorithm that makes a decisive step can be delayed by an adversarial scheduler to appear indistinguishable from a crashed process, making the decisive step unsafe.

**What this constrains in practice:**
- You cannot build a purely asynchronous system that always terminates AND always agrees when even one process can crash
- Every real consensus system (Paxos, Raft, PBFT, Zookeeper) circumvents this by adding timing assumptions, randomization, or weaker termination guarantees

**The five escape routes Lynch identifies:**
1. **Randomization** (BenOr algorithm): Achieves agreement with probability 1, not certainty
2. **Failure detectors**: Add an external oracle that (eventually) correctly identifies failed processes
3. **k-agreement**: Allow up to k distinct decision values instead of exactly 1
4. **Approximate agreement**: Allow decisions within ε of each other instead of exactly equal
5. **Partial synchrony**: Assume timing bounds exist even if unknown — enough to detect failures eventually

---

## The Byzantine General's Constraint: n > 3f

For Byzantine failures (processes can behave arbitrarily, not just crash), Lynch proves:

**Theorem 6.27**: Byzantine agreement is impossible if n ≤ 3f.

The proof is a masterpiece of reduction. The base case (Lemma 6.26): three processes cannot reach Byzantine agreement with one fault. Proof by contradiction using a "hexagon construction":

1. Construct two copies of a 3-process algorithm in a hexagon where processes have local names
2. Start one copy with input 0, one with input 1
3. From processes 2 and 3's viewpoint: process 4 is faulty → must decide 0
4. From processes 1' and 2''s viewpoint: process 4 is faulty → must decide 1
5. From processes 3 and 1'''s viewpoint: process 2 is faulty → must agree, but 3 says 0 and 1' says 1

The inductive step (Theorem 6.27): partition n processes into three groups of size ≈ n/3. Each group simulates a single process of the three-process protocol. Apply the 3-vs-1 proof to get a contradiction.

**What this constrains in practice:**
- You need more than three times as many processes as you want to tolerate Byzantine failures
- If you have 5 skills and 2 are Byzantine, you cannot guarantee consensus — you need at least 6+1=7 honest processes, or 9+ total (with n > 3f = 3×3 = 9)
- This is not a constant-factor overhead — it's a factor-of-3 minimum requirement

**The connectivity corollary (Theorem 6.29)**: Byzantine agreement in non-complete graphs requires conn(G) > 2f *in addition to* n > 3f. The graph must be 2f+1 connected. This follows from Menger's theorem: two nodes must be connected by ≥ 2f+1 node-disjoint paths so that Byzantine nodes cannot isolate a subgraph.

**What this constrains in network design:**
- For f=3 Byzantine tolerance, you need 7+ node-disjoint paths between any two critical components
- Mesh networks and multi-path routing exist partly to satisfy this topological requirement

---

## Leader Election: The Ω(n log n) Lower Bound

**Theorem 15.12**: Any algorithm for leader election in a ring of unknown size n requires Ω(n log n) messages, even with bidirectional communication and infinite UID space.

The proof is architecturally elegant. Define operations on "lines" of processes:
- **C(L)**: supremum of messages sent in any input-free execution of line L
- **Claim 15.15**: Among any three disjoint lines L, M, N from a recursive construction, at least one join of two lines requires ≥ (n/2) log n messages

The proof constructs an infinite family of lines where each line of size 2^r requires > r · 2^(r-2) messages, then wraps a line into a ring.

**What this constrains:**
- Any leader election protocol in a ring *must* spend Ω(n log n) messages — no algorithm can do better
- The PetersonLeader algorithm achieves this bound with ≈ 2n log n messages (factor 2 constant)
- Attempting to build a "smarter" algorithm that discovers the leader in fewer messages is provably futile

**The synchronous lower bound (Theorems 3.9, 3.11)** also proves Ω(n log n) in the synchronous model, showing the bound is not an artifact of asynchrony.

---

## Mutual Exclusion: The n-Variable Lower Bound

**Theorem 10.33**: Any n-process mutual exclusion algorithm requires at least n distinct shared variables (registers), even with unbounded variable size and multi-writer registers allowed.

The proof uses a Pigeonhole argument on *covering states*:
- Show every process must write some variable that is not "covered" by another process
- If fewer than n variables exist, some two processes must cover the same variable
- Construct an adversarial execution where this creates indistinguishable states for a third process
- Force the third process into an impossible position

**What this constrains:**
- Cannot solve n-process coordination with fewer than Θ(n) state variables
- This is fundamental, not an implementation artifact
- With 180 skills competing for resources, expect minimum coordination state of Θ(180) bits/variables

---

## Shortest Paths: The Exponential Asynchronous Cost

**Theorem 15.21**: The asynchronous Bellman-Ford algorithm has worst-case message complexity Ω(2^n) and time complexity Ω(2^n · d).

The proof constructs a weighted graph where processes are forced to iteratively refine distance estimates, creating an exponential cascade. The synchronous Bellman-Ford runs in O(n) rounds. The asynchronous version can be exponentially worse.

**What this constrains:**
- Not all asynchronous algorithms are better than synchronous equivalents
- Some problems inherently benefit from synchronization's "all-at-once" view
- Systems that refine estimates iteratively (cost estimators, resource allocators) can trigger exponential message cascades if unregulated

---

## The Consensus Round Lower Bound With Timing Uncertainty

**Theorem 25.17**: No algorithm can guarantee f-failure termination in partially synchronous systems where processes decide strictly before time Ld + (f−1)d.

Here L = ℓ₂/ℓ₁ is the *timing uncertainty ratio* (ratio of max to min step time), d is the maximum message delivery time.

**The proof strategy:**
1. Lemma 25.18: Prove a "bad combination" (two executions differing only in one process's view, one 0-valent, one 1-valent, ≤ f−1 failures) cannot exist if the algorithm is correct
2. Lemma 25.19: Prove this bad combination *must* exist via a chain argument
3. Contradiction: Implies no correct algorithm exists that decides before Ld + (f−1)d

**What this constrains:**
- Even in partially synchronous systems, you cannot decide faster than Ld + (f−1)d
- Higher timing uncertainty (larger L) forces slower consensus
- Measuring and bounding L in real systems directly determines achievable consensus speed

---

## The Commit Problem: 2n-2 Messages Are Necessary

**Theorem 7.25** (message complexity lower bound for distributed commit): Any commit algorithm requires at least 2n−2 messages in failure-free executions, even for weak termination.

**Key lemma (7.26)**: "For every two processes i and j, i affects j in patt(a₁)" — every process must influence every other process for validity.

The proof shows: if process i doesn't affect j, construct an execution where i's input changes from 1 to 0, i fails immediately, j never sees i's true value or failure. J cannot distinguish this from the failure-free case. Validity requires j to decide 1, violating correctness.

**What this constrains:**
- With 180 skills in a commit protocol, at minimum 2(180)−2 = 358 messages must be exchanged in *every* failure-free execution
- Information about all agents' votes must propagate to all other agents — no agent can be left uninformed
- Budget at least 358 message slots even when optimistically assuming no failures

---

## How to Apply These Constraints

When a distributed coordination task fails to meet its requirements:

1. **Check the impossibility bound first**: Does the requirement violate a proven impossibility? If so, no amount of engineering will help — you must relax the requirement.

2. **Identify which assumption to relax**:
   - Cannot achieve consensus? Add timing assumptions (partial synchrony) or use randomization
   - Cannot tolerate Byzantine failures with current n? Increase redundancy above 3f
   - Cannot reach agreement fast enough? Check whether Ld + (f−1)d is feasible with your timing bounds; if not, reduce L by bounding step times

3. **Use the escape routes deliberately, not accidentally**: Real systems (Paxos, Raft, PBFT) each choose a specific escape route. Knowing which one you're using — and why — enables principled debugging when it fails.

4. **Lower bounds as complexity budgets**: Ω(n log n) for leader election means budget n log n communication slots. Ω(2n−2) for commit means budget 2n−2 message slots. Lower bounds are the minimum you will spend; actual algorithms spend more.

---

## The Meta-Principle

Lynch states it plainly about impossibility results: "the impossibility results can help to tell designers when to stop trying to build something."

This is the most pragmatic statement in the book. Impossibility results are not the end of the story — they are the *beginning* of the correct story. They define the problem space that admits solutions, and every productive algorithm design starts with understanding which impossibility bounds constrain the problem.
```

---

### FILE: timing-models-and-their-consequences.md
```markdown
# Timing Models and Their Consequences

## The Choice That Changes Everything

Lynch organizes the entire book around timing assumptions — not problem types, not communication mechanisms. This organization reflects a deep truth: the timing model is the single most consequential architectural decision in a distributed system. It determines what problems are solvable, what algorithms are correct, and what complexity is achievable.

> "The deepest distinctions among the models seem to be based on timing assumptions."

---

## The Three Models and What They Enable

### Synchronous Systems

"We assume that components take steps simultaneously, that is, that execution proceeds in synchronous rounds."

**What this buys you:**
- Simplest model to reason about
- Round-based algorithms with clean termination conditions
- Lower bounds proved in synchronous model apply to asynchronous model (contrapositive: if impossible synchronously, impossible asynchronously)
- Impossibility results are stronger: they carry over to asynchronous settings

**What it costs:**
- "Impossible or inefficient to implement the synchronous model in many types of distributed systems"
- Requires tight coupling: all processors wait for the slowest in each round
- Sensitive to network delays that violate round boundaries

**Key algorithms enabled**: FloodMax (leader election in O(diam) rounds), SynchBFS (spanning tree in O(diam) rounds), SynchGHS (MST in O(n log n) rounds), synchronous consensus (EIGStop, EIGByz in f+1 rounds)

**Complexity landmark**: Synchronous Bellman-Ford runs in O(n−1) rounds, O((n−1)|E|) messages. This becomes exponential in the asynchronous model.

---

### Asynchronous Systems

"Separate components take steps in an arbitrary order, at arbitrary relative speeds."

**What this buys you:**
- Maximum portability: algorithms work across any infrastructure latency
- "Allows the programmer to ignore specific timing considerations. Since the asynchronous model assumes less about time...algorithms designed for the asynchronous model are general and portable"
- Natural model for internet-scale systems

**What it costs:**
- "Sometimes does not provide enough power to solve problems efficiently, or even to solve them at all"
- FLP impossibility: cannot solve consensus with even one crash failure
- Algorithms must handle arbitrary message delays, making proof more complex
- Some problems (shortest paths) go from O(n) to exponential complexity

**The pileup problem** (AsynchLCR): "each process's send buffer must be able to hold any number (up to n) of messages instead of just a single one. The reason for the difference is that the asynchrony can cause pileups of UIDs at nodes."

This reveals a principle: asynchrony not only changes correctness — it changes the *data structures* required for correct implementation.

**Complexity landmarks**:
- Leader election in ring: O(n log n) messages (PetersonLeader), time O(n(l+d))
- MST (GHS algorithm): O(n log n + |E|) messages, O(n log n(l+d)) time
- Bellman-Ford shortest paths: Ω(2^n) worst-case messages

**The fairness assumption** replaces synchrony's round structure: "For each process i, we assume that one of the following holds: [finite execution with no enabled actions, or infinite with infinitely many locally controlled actions or infinitely many disabled points]." Fairness guarantees eventual progress without guaranteeing specific timing.

---

### Partially Synchronous Systems

"Some restrictions on the relative timing of events, but execution is not completely lock-step."

Lynch identifies this as "most realistic, but they are also the most difficult to program" and notes they are "fragile in that they will not run correctly if the timing assumptions are violated."

**The MMT model**: Each task has bounds [ℓ₁, ℓ₂] on step time. Channels have delivery time in [0, d]. The timing uncertainty ratio L = ℓ₂/ℓ₁ is the key parameter.

**What this buys you:**
- Consensus becomes achievable (unlike pure asynchrony)
- Failure detection becomes implementable (use timeouts)
- "Eventually synchronous" systems: even if bounds aren't initially known, once established, algorithms can exploit them

**What it costs:**
- Consensus requires time Ld + (f−1)d (Theorem 25.17)
- Algorithms are fragile: if timing assumptions are violated, correctness breaks
- L multiplicatively stretches time complexity

**The key insight about L**: From Example 23.1.3, the timing uncertainty doesn't just add constant overhead — it multiplies:
- "Report time: ℓ + ℓ₂ + L·ℓ"
- L appears multiplicatively in complexity bounds throughout Part IV

**The partially synchronous consensus bound**: No algorithm can decide before time Ld + (f−1)d. This means:
- If your system has ℓ₁ = 1ms, ℓ₂ = 100ms (L=100), d = 50ms, f = 3 failures: minimum time = 100×50 + 2×50 = 5100ms
- Reducing L (bounding step times more tightly) directly reduces consensus latency

---

## What Changes Between Models

### Mutual Exclusion
- **Synchronous**: Rounds simplify reasoning; algorithms designed for asynchronous also work
- **Asynchronous**: Peterson, Bakery algorithms; n variables required (Theorem 10.33); O(n) time typically
- **Partially synchronous**: Fischer's mutex (Chapter 24) exploits timing to avoid long waits

### Leader Election in Rings
- **Synchronous**: LCR algorithm, O(n²) messages; FloodMax in O(diam) rounds
- **Asynchronous**: PetersonLeader, O(n log n) messages (optimal by Theorem 15.12); time O(n(l+d))
- The synchronous to asynchronous transformation preserves message count but changes time structure

### Consensus
- **Synchronous, stopping failures**: f+1 rounds sufficient and necessary (FloodSet/EIGStop)
- **Synchronous, Byzantine failures**: f+1 rounds, but requires n > 3f
- **Asynchronous, any failures**: Impossible (FLP)
- **Partially synchronous**: Possible, requires Ld + (f−1)d time

### Spanning Trees
- **Synchronous**: SynchBFS in O(diam) rounds, O(|E|) messages
- **Asynchronous**: AsynchSpanningTree in O(diam(l+d)) time, O(|E|) messages
- The timing anomaly (Chapter 15): even though spanning tree is built along BFS shortest paths, broadcast on the spanning tree may take O(n(l+d)) — longer than O(diam(l+d)) — because the tree height can exceed the graph diameter

---

## The Synchronizer: Bridging the Gap

Synchronizers (Chapter 16) allow synchronous algorithms to run in asynchronous networks, with bounded overhead. The basic idea:

> "The synchronizer problem is to 'implement' the GlobSynch automaton with an asynchronous network algorithm, with one process at each node of the underlying graph G and a reliable FIFO send/receive channel in each direction on each edge."

Three implementations:
- **Alpha synchronizer**: Local flooding; O(|E|) messages per round, O(d) time per round
- **Beta synchronizer**: Tree-based convergcast/broadcast; O(n) messages per round, O(h·d) time per round (h = tree height, up to n)
- **Gamma synchronizer**: Hybrid; cluster-local Beta, cluster-to-cluster Alpha; O(k·|E|/n) per round for appropriate k

The key theorem (Theorem 16.11): Any asynchronous algorithm solving the k-session problem requires time T(A) > (k−1) · diam · d. This shows synchronizers add *inherent* overhead proportional to diameter — not just a constant factor.

**Correctness of synchronizers requires a subtle observation** (Lemma 16.1): The GlobSynch-to-LocSynch simulation doesn't use a simulation *relation* (which would preserve event order); it uses *partial order reordering*. Events can be reordered as long as causal dependencies (send before receive, same-process ordering) are preserved. Individual processes cannot detect the reordering.

---

## Logical Time: A Third Path

Chapter 18 introduces logical time as an alternative to synchronizers:

> "In our asynchronous network model, there is no built-in notion of real time. It is, however, possible to impose a notion of logical time by means of special protocols... Logical times need not have any particular relationship to real time. However, the logical times of different events are required to respect all the possible dependencies among the events."

**Theorem 18.1 (the key theorem)**: Any execution α with a logical-time assignment Itime looks to every process like another fair execution α' in which events occur in logical-time order.

The four properties of valid logical-time assignments:
1. No two events get the same time (uniqueness)
2. Logical times at each process strictly increase (local causality)
3. Send time < receive time (message causality)
4. Only finitely many events before any time t (boundedness)

**LamportTime algorithm**: Each process maintains a scalar clock. On any event, increment. On send, attach clock. On receive, update to max(local, received) + 1. Cost: O(1) per message.

**Application to global snapshots**: The CountMoney problem (Example 18.3.1) shows how logical time enables consistent global snapshots without halting:
- Define a logical time t
- Each process records its state "at time t" by collecting all events with logical time ≤ t
- The result is a consistent global snapshot — all processes agree on what happened before time t

This solves a fundamental problem: how to observe a distributed system's state without stopping it. The answer is to define "now" via logical time rather than wall-clock time.

---

## Choosing the Right Model

| Question | Answer | Implication |
|----------|--------|-------------|
| Are all processors tightly coupled with synchronized clocks? | Yes → synchronous | Use round-based algorithms; enjoy simplest correctness proofs |
| Can message delays be arbitrarily long? | Yes → asynchronous | Use fairness-based algorithms; accept FLP impossibility constraints |
| Do processors have bounded (but unknown) step times? | Yes → eventually synchronous | Use timeout-based failure detection; design for Ld + (f−1)d consensus time |
| Do processors have bounded and known step times? | Yes → fully synchronous | Exploit precise timing for efficiency |
| Are Byzantine failures possible? | Yes → need n > 3f regardless | Budget for factor-of-3 redundancy |

**The fragility warning**: Partially synchronous algorithms are "fragile in that they will not run correctly if the timing assumptions are violated." This is practical advice: if you design for ℓ₂ = 100ms and a GC pause causes ℓ₂ = 1000ms, your algorithm may fail. Explicitly measure and monitor the parameters your algorithm relies on.

**The portability advice**: "Algorithms designed for the asynchronous model are general and portable." If you don't need the performance gains of timing assumptions, stay asynchronous. The correctness is more robust.

---

## The Most Important Table

| Model | Consensus Solvable? | Leader Election Cost | Spanning Tree | Mutual Exclusion |
|-------|--------------------|--------------------|--------------|-----------------|
| Synchronous | Yes, f+1 rounds | O(diam) rounds | O(diam) rounds | Simple |
| Asynchronous | No (FLP) | Ω(n log n) messages | O(|E|) messages | n variables required |
| Partially synchronous | Yes, Ld+(f-1)d time | Similar to async | Similar to async | Fischer's timing-based |

The table tells the design story: moving from synchronous to asynchronous loses consensus solvability. Partially synchronous restores it, at the cost of timing-dependent bounds.
```

---

### FILE: failure-models-and-fault-tolerance.md
```markdown
# Failure Models and Fault Tolerance

## Failures Are Not All the Same

Lynch's treatment of failures is the most detailed in any distributed algorithms textbook because failure model choice is as consequential as timing model choice. The wrong failure assumption in either direction — assuming too few failures or assuming the wrong type — leads to either broken systems or unnecessarily expensive ones.

The book's core taxonomy:

**Stopping failures (crash failures)**:
> "At any point during the execution of the algorithm, a process might simply stop taking steps altogether. In particular, a process might stop in the middle of a message-sending step; that is, at the round in which the process stops, only a subset of the messages the process is supposed to send might actually be sent."

**Byzantine failures**:
> "A process might fail not just by stopping, but by exhibiting arbitrary behavior. This means that it might start in an arbitrary state, not necessarily one of its start states; might send arbitrary messages, not necessarily those specified by its msgs function; and might perform arbitrary state transitions, not necessarily those specified by its trans function."

---

## Stopping Failures: Solvable But Expensive

### What You Can Guarantee

The FloodSet algorithm (Section 6.2.1) proves stopping-failure consensus is solvable:

Each process maintains a set W of all values it has seen. For f+1 rounds, broadcast W, then add received values to W. Decide: if |W| = 1, decide that value; else decide default v₀.

**Why f+1 rounds?** 
- With f potential failures, in the worst case, f processes fail in the first f rounds
- By round f+1, there must exist one round r (1 ≤ r ≤ f+1) where no process fails
- **Lemma 6.1 (The "Good Round" Lemma)**: "If no process fails during a particular round r, then all nonfaulty processes have the same W after round r."
- In that round, all nonfaulty processes broadcast their current W and receive all W's — identical W's result
- After round r, W is stable (Lemma 6.2); all nonfaulty processes decide the same (Lemma 6.3)

**Correctness conditions are weakened compared to perfect systems**:
- **Agreement**: "No two processes decide on different values" (applies to all non-faulty)
- **Validity**: "If all processes start with the same initial value v ∈ V, then v is the only possible decision value"
- **Termination**: "All nonfaulty processes eventually decide"

### The Efficiency Frontier

FloodSet is correct but expensive (O(n³b) bits where b = value size). OptFloodSet (Section 6.2.2) optimizes by only broadcasting when new information arrives:

> "Instead of broadcasting all values, each process broadcasts at most two values total: Round 1: broadcast initial value. First round r ≥ 2 where you learn a new value: broadcast that value."

**Complexity**: O(n²b) bits (cubic reduced to quadratic — a significant gain for large value spaces).

**Why it's correct** (Proof via simulation, Section 6.2.2): The proof doesn't reprove all invariants from scratch. Instead:
1. Prove reference correct algorithm (FloodSet)
2. Prove simulation relation: OptFloodSet and FloodSet have identical state components after r rounds
3. Conclude: OptFloodSet inherits FloodSet's correctness

This is the "simulation proof for optimization safety" pattern that appears throughout the book.

### The EIGStop Tree Structure

For certain applications, EIGStop (Exponential Information Gathering) provides a complementary approach. Each process builds a labeled tree T_{n,f} where:
- Root labeled λ (empty string)
- Node at level k has n-k children labeled with strings of distinct process indices
- val(x)_i = "what process i learned that the processes in x's label said"

**Why the tree?** It captures all possible information propagation paths. If process i is nonfaulty and relays value v in round k, all other nonfaulty processes receive it. The tree structure ensures no reliable propagation path is missed.

**Complexity**: O(2^(n^(f+1))(f+1)) bits — exponential in f. For large f, EIGStop is worse than FloodSet. But its structure enables Byzantine generalizations.

---

## Byzantine Failures: The Factor-of-Three Cost

### Why Byzantine Is Categorically Harder

The key difference from stopping failures:

**Stopping failures**: Faulty processes go silent. You can distinguish "didn't hear from i" (might be failed) from "heard from i" (definitely not failed). Waiting f+1 rounds gives a clean round.

**Byzantine failures**: Faulty processes send arbitrary messages. You cannot distinguish a faulty process sending wrong data from a non-faulty process with genuinely different input. No "good round" technique works.

This leads to the fundamental bound:

**Theorem 6.27**: Byzantine agreement requires n > 3f.

**Proof by reduction**: Partition n processes into three groups of size ≤ f. Each group simulates a single process. Apply the three-process impossibility:

In the three-process case (Lemma 6.26):
- Execution α₁: processes 1, 2 nonfaulty (input 1), process 3 faulty → must decide 1
- Execution α₂: processes 2, 3 nonfaulty (input 0), process 1 faulty → must decide 0  
- Execution α₃: processes 1, 3 nonfaulty (inputs 1, 0), process 2 faulty → must agree!
- But process 1 sees same messages in α₃ as in α₁ → decides 1
- Process 3 sees same messages in α₃ as in α₂ → decides 0
- **Contradiction**

This indistinguishability argument — adversary crafts messages so processes cannot distinguish scenarios — is the deep reason Byzantine tolerance is fundamentally more expensive.

### The EIGByz Algorithm

The Byzantine generalization of EIGStop adds two changes:

1. **Discard malformed messages** (treat them as null)
2. **Decision via majority voting bottom-up**:
   - For each leaf x (at level f+1): newval(x) := val(x)
   - For each internal node x: newval(x) := majority value among children

**Why majority voting works** (Lemma 6.16): If a node x has a label ending in a nonfaulty process, all nonfaulty processes agree on newval(x). Proved by induction:
- Base (leaves): All nonfaulty i agree on val(xi) when x doesn't contain i (nonfaulty i sends same message to all)
- Inductive step: At least n−f > 2f children (since n > 3f) are "correct"; majority rule selects common value

**The n > 3f condition becomes necessary at each level**:
- At level 0: 1 child needed to be common
- At level 1: majority among n children requires n−f > f, i.e., n > 2f
- At level f+1: majority among n−f children requires n−2f > f, i.e., **n > 3f**

**Complexity**: O(2^(n^(f+1))(f+1)) bits — same exponential as EIGStop. This is the price of Byzantine tolerance without additional structure.

### Polynomial Byzantine Consensus: PolyByz

EIGByz's exponential communication is often impractical. PolyByz (Section 6.3.3) achieves polynomial communication via **consistent broadcast**:

> "Consistent broadcast ensures: (1) Nonfaulty messages are accepted by all nonfaulty processes within 1 round, (2) No false messages are ever accepted, (3) If any process accepts a message, all nonfaulty processes accept it within 1 more round."

Implementation via echo: Process i broadcasts (m, i, r). Others echo at round r+1 if they received. Accept when ≥ n−f echoes received.

**PolyByz complexity**: O(n³ log n) bits vs. O(2^(n^(f+1))(f+1)) for EIGByz. The reduction from exponential to polynomial comes at cost of doubling the round count: 2(f+1) rounds vs. f+1.

**The TurpinCoan wrapper**: For general (non-binary) Byzantine consensus, reduce to binary:
1. Round 1-2: All agents broadcast their value; if ≥ 2f+1 agree it's high, vote 1; else vote 0
2. Rounds 3-(f+1)+2: Run PolyByz binary agreement
Total: f+3 rounds, O(n²b + n³ log n) bits

---

## Authenticated Byzantine Failures: Breaking the n > 3f Barrier

Section 6.2.4 introduces authenticated failures (digital signatures). With authentication:

> "A faulty process cannot lie about what another process sent."

This changes everything. With signatures, EIGStop + signatures solves Byzantine agreement with:
- **No n > 3f requirement** (needs only n > f like stopping failures)
- f+1 rounds (same as stopping failures)
- O(2^(n^(f+1))(f+1)) bits (same exponential, but lower base case)

**Why authentication helps**: In EIGByz, the majority voting is needed because a faulty process can claim "Process j told me v" when j said no such thing. With signatures, this claim is verifiable — faulty processes can only lie about their *own* state, not about what others sent.

**Practical implication**: If your system has TLS/HTTPS between all components, you effectively have authentication. This means you can achieve Byzantine tolerance with n > f instead of n > 3f — a factor-of-3 reduction in required redundancy.

---

## Failure Detectors: Oracles for Partial Synchrony

Chapter 21 introduces failure detectors as a formalization of what partial synchrony provides:

> "The failure detector is modelled as a separate I/O automaton that outputs inform-stopped(j)_i events."

**PerfectFDAgreement** (Theorem 21.8): Using a perfect failure detector, the agreement problem is solvable with wait-free termination.

Algorithm: Each process i maintains a stable vector (val, stopped) where val[k] is i's known value of k's initial input, and stopped tracks failed processes. Decision occurs when ratified ∪ stopped = {1,...,n}.

**Correctness**: Once process i reaches its final (w_final, I_final), every non-failed process eventually learns it, adopts it (since it dominates), broadcasts back, entering ratified_i. Once ratified ∪ stopped = {1,...,n}, decision is safe.

**The lattice structure**: (w, I) ≤_d (w', I') iff w' ⊇ w and I' ⊇ I. Data only increases — values are added, stopped set grows. This monotonicity guarantees convergence.

**The real practical insight**: Failure detectors model timeouts. A timeout-based failure detector with timeout T eventually correctly suspects all crashed processes (after they fail) and may incorrectly suspect slow processes. As long as eventually the timing bound holds (partial synchrony), suspicions stabilize to correctness.

---

## Failure Models in Practice: A Decision Framework

**Selecting the right failure model**:

1. **Can processes return wrong answers or send corrupted data?**
   - Yes → Byzantine model; need n > 3f or authentication
   - No → Stopping model; need n > f

2. **Can network messages be dropped or corrupted?**
   - Yes (and unlimited) → Coordinated attack impossibility (Chapter 5); consensus impossible
   - Yes (but bounded) → Partially synchronous model with link failures; see Chapter 22
   - No → Standard reliable channel model

3. **What is the maximum number of failures you need to tolerate?**
   - f failures → Need n > 3f (Byzantine) or n > f (stopping) processors
   - Budget: factor-of-3 cost for Byzantine, factor-of-1 for stopping

4. **Do you need exact or approximate agreement?**
   - Exact → FLP constraints; need timing assumptions or randomization
   - Approximate (within ε) → Approximate agreement algorithm; works with n > 3f asynchronously
   - k distinct values → k-agreement; need f < k for TrivialKAgreement

**Complexity comparison table**:

| Algorithm | Rounds | Bits | Failure Model | n Requirement |
|-----------|--------|------|---------------|---------------|
| FloodSet | f+1 | O((f+1)n³b) | Stopping | None |
| OptFloodSet | f+1 | O(n²b) | Stopping | None |
| EIGStop | f+1 | O(2^(n^(f+1))(f+1)) | Stopping | None |
| EIGByz | f+1 | O(2^(n^(f+1))(f+1)) | Byzantine | n > 3f |
| PolyByz | 2(f+1) | O(n³ log n) | Byzantine | n > 3f |
| EIGStop+Sigs | f+1 | O(2^(n^(f+1))(f+1)) | Auth Byzantine | None |
| BenOr (random) | Expected O(1/ε) | High | Stopping | n > 3f |
| PerfectFDAgreement | Unbounded | Unbounded | Stopping + FD | None |
```

---

### FILE: formal-proof-methods-for-distributed-systems.md
```markdown
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
```

---

### FILE: synchronization-primitives-and-atomic-objects.md
```markdown
# Synchronization Primitives and Atomic Objects

## The Power Hierarchy of Synchronization

Lynch establishes a clear hierarchy of synchronization primitives, each with different computational power:

1. **Read/Write registers** (weakest): Can only read or write one variable per atomic step
2. **Read-Modify-Write (RMW)** (medium): Atomically read, compute new value, write — in one step
3. **Compare-and-Swap (CAS)**, **Test-and-Set**, **Fetch-and-Add** (specialized): Optimized for specific patterns
4. **Snapshot objects** (composite): Atomically read all components of a vector simultaneously

The computational difference between these is not constant-factor — moving up the hierarchy enables qualitatively new capabilities.

---

## Why Read/Write vs. Read-Modify-Write Is a Phase Transition

**Mutual exclusion with read/write**: Requires n distinct shared variables (Theorem 10.33). The proof:
- Every process must write a variable "uncovered" by others
- If fewer than n variables exist, two processes cover the same variable
- An adversarial construction makes states indistinguishable to a third process

**Mutual exclusion with read-modify-write**: Requires only 1 variable (TrivialME):

```
// TrivialME:
Try: if RMW(x, 0, 1) = 0:  // atomically check x=0, set x=1
         enter critical region
     else:
         spin

Exit: x := 0
```

This is trivially correct because the RMW operation atomically checks availability and claims the resource.

**Why this is a phase transition**: The factor-of-n reduction in required variables is not just efficiency — it enables qualitatively different algorithms. With read/write, you need Θ(n) variables and Θ(n) time complexity (e.g., PetersonNP's exponential O(2^n) worst case). With RMW, one variable and O(1) time for acquisition.

**The impossibility theorem bridges them** (Theorem 13.11):

> "Cannot implement read-modify-write atomic objects from read/write using 1-failure termination."

Proof: Assume system B implements RMW from read/write. Apply Trans() to RMWAgreement algorithm A (which guarantees 1-failure termination on RMW). Result: Trans(A) uses only read/write variables. Contradiction: Trans(A) would solve agreement with 1-failure termination in read/write model, violating Theorem 12.8 (impossible).

This proves RMW is strictly more powerful than read/write — not just more efficient.

---

## The Mutual Exclusion Algorithm Landscape

Lynch presents a progression from simple to sophisticated:

### DijkstraME: First But Unfair (O(ln), No Lockout-Freedom)

```
Stages: flag=1 "interested", flag=2 "competing"
Stage 1: flag(i) := 1; wait until turn=i or no competitor has flag=1
         if turn ≠ i: flag(i) := 0; wait until turn=i; repeat
Stage 2: flag(i) := 2; check all others for flag≠2
         if any has flag=2: restart from Stage 1
```

**Time (Theorem 10.7)**: O(ln) where l = max step time, n = number of processes

**Failure mode**: "One user can be repeatedly granted access while other users trying to gain access are forever prevented from doing so." Process 1 can cycle while Process 2 waits forever.

**Why unfair**: The turn variable is updated to the "winner" of Stage 1 competition. If Process 1 keeps winning Stage 1, it keeps entering. Process 2 has no recourse.

### Peterson2P: Fair But Only for Two Processes

The key insight of Peterson2P is non-obvious:

> "Setting `turn := i` *gives the other process the resource*. If both set turn to themselves, the one who set it *last* wins."

```
Process i:
  flag(i) := 1
  turn := i           // Give priority to opponent
  wait for: flag(ī)=0 OR turn≠i
  critical region
  flag(i) := 0
```

**Time (Theorem 10.14)**: c + O(l) where c = critical section time

**Lockout-freedom**: 2-bounded bypass (Lemma 10.12): While i waits, ī enters critical region at most twice.

**Proof**: ī can only pass i by setting turn := ī; can only do this once per trying region entry. Since there are 2 processes, ī can't "lap" i.

### PetersonNP: Fair But Exponential Time

Generalizing Peterson2P to n processes using n-1 competition levels:

```
At level k, process i:
  flag(i) := k
  turn(k) := i
  wait for: (∀j≠i: flag(j)<k) OR turn(k)≠i
```

**Time (Theorem 10.16)**: O(2^n · c + 2^n · n · l) — exponential in n!

**Why exponential**: Process that "loses" level k must cycle back and restart. At each level, a process might cycle O(n) times. n levels compound multiplicatively: recurrence T(k) < 2T(k+1) + c + (3n+4)l solves to 2^n factor.

**The fix — Tournament algorithm** (Section 10.5.3): Use tree structure instead of linear levels:
- Logarithmic depth instead of linear
- Time bound O((n-1)c + O(n²l)) instead of exponential
- **Tradeoff**: No bounded bypass guarantee (but DijkstraME doesn't have it either)

### Bakery Algorithm: FIFO With Unbounded Variables

```
Process i:
  choosing(i) := 1
  number(i) := 1 + max_j number(j)  // Get a ticket
  choosing(i) := 0
  for j≠i:
    wait for choosing(j)=0           // Wait for j to get their ticket
    wait for number(j)=0 or (number(i),i) < (number(j),j)
  critical region
  number(i) := 0
```

**Key property**: "FIFO after a wait-free doorway." If i completes the doorway (getting a ticket) before j enters the trying region, then i enters the critical section before j.

**Doorway is wait-free**: A process won't get stuck even if all others fail. This is a crucial property — the Bakery algorithm degrades gracefully under failures.

**Time (Section 10.6)**: (n-1)c + O(n²l) — polynomial.

**The unbounded variable problem**: number(i) grows without bound. Cannot use wraparound (unlike TicketME) because the algorithm checks number(j)=0 to mean "j exited," not "j has ticket 0."

**TicketME (Section 10.9)** solves this via simulation:
- InfiniteTicketME (unbounded): trivially correct
- TicketME: uses modular arithmetic (tickets mod n)
- Simulation relation: states correspond when ticket values equal modulo n
- Invariant: granted < next < granted+n ensures outstanding tickets are distinct mod n

### The Lower Bound on Variable Values

**Theorem 10.41**: Any algorithm using a single read-modify-write variable and guaranteeing bounded bypass requires that variable to have ≥ n distinct values.

**Theorem 10.44**: Any algorithm guaranteeing lockout-freedom requires ≥ √n values (approximately).

**The gap**: Upper bound for lockout-freedom = ⌈n/2⌉ + k values (BufferMainME algorithm). Lower bound ≈ √n. This gap remains an open research problem as of Lynch's writing.

---

## Atomic Objects: The Abstraction Layer

### What Makes an Object "Atomic"?

**Theorem 13.1 (paraphrased)**: An atomic object guarantees **well-formedness** (operations properly paired invocation-response) and **atomicity** (there exists a total order of non-overlapping operations that produces all observable traces).

**Critical distinction**: Atomicity does not require operations to execute in real-time order — only that a *serialization point* exists within each operation's interval where it "appears to occur atomically."

**Lemma 13.10** (the most practically important lemma in Chapter 13):

> "If every execution with no incomplete operations satisfies atomicity, then every execution (including those with incomplete operations) satisfies atomicity."

**Why surprising**: You only need to check atomicity on *complete* executions. Crashes that kill operations mid-execution don't affect atomicity of completed operations. This dramatically simplifies proofs.

### Variable Types as Operation Contracts

A variable type is:
- **Invocations**: set of allowed operations
- **Responses**: set of possible results
- **Function f**: (invocation, value) → (response, new_value)

**Register**:
```
f(read, v) = (v, v)              // Return current value, unchanged
f(write(v), w) = (ack, v)        // Return ack, set to v
```

**RMW (Read-Modify-Write)**:
```
f(h, v) = (v, h(v))             // Return old value, apply h atomically
```

**Compare-and-Swap (CAS)**:
```
f(CAS(u,v), w) = (w, v if u=w else w)  // Conditional update
```

**Test-and-Set**:
```
f(TAS, v) = (v, 1)              // Return old, set to 1
```

**Fetch-and-Add**:
```
f(F&A(u), v) = (v, v+u)         // Return old, add u
```

The function f captures the *atomicity guarantee* — the contract between the object and its callers.

### Snapshot Algorithms: Reading Many Variables Atomically

The snapshot problem: read n variables simultaneously, getting a consistent view (as if all reads occurred at the same instant).

**UnboundedSnapshot** (Section 13.3.2):

The key insight: "Before an update process i writes to x(i), it first executes its own embedded-snap subroutine. When it writes its value and tag in x(i), it also places the result of its embedded-snap in x(i)."

**Algorithm**:
```
snap():
  while true:
    read all x(i) → tags₁      // First scan
    read all x(i) → tags₂      // Second scan
    
    if tags₁ = tags₂ everywhere:
      return values from second scan  // Consistent
    
    if any x(i) has 4 different tags seen:
      return embedded-snap from 3rd tag  // Update contained within our interval
```

**Why 4 tags implies containment** (Observation 2, Section 13.3.2):

If snap sees tags t₁, t₂, t₃, t₄ from the same variable in sequence:
- Update producing t₃ begins *after* update producing t₂ completes
- That completion is *after* snap begins (snap saw t₁)
- Update producing t₃ ends *before* update producing t₄ begins
- Snap sees t₄ (so t₄ existed before snap ends)
- Therefore: t₃ update is sandwiched entirely within snap interval

This is a beautiful argument: the snapshot sees an update from "inside" its own interval, so that update's embedded snapshot is valid at the correct time.

**Complexity**: O(m²) accesses (where m = number of variables).

**BoundedSnapshot**: Replaces unbounded tags with handshake bits + toggle bits. Each pair (updater i, snapper j) has a 1-bit handshake channel:

```
updater i:
  flip comm(j) to differ from y(j).ack(i)  // Signal new update

snapper j:
  read comm, set ack ← comm  // Acknowledge receipt
```

Toggle bit ensures consecutive updates by same process produce distinguishable values even with 1-bit handshakes.

**Result**: Fully bounded storage, same O(m²) time. The bounded version is production-safe.

---

## The Composition Theorem: Why Layers Work

### Theorem 13.7 (The Transformation Theorem)

If algorithm A uses shared variables x₁,...,xₖ, and you replace each xᵢ with an atomic object implementation Bᵢ, then:

1. Users of the system cannot observe any difference (indistinguishability)
2. If the original system was fair and each Bᵢ guarantees I-failure termination, the new system is also fair

**Why this enables layered design**:
- Prove the lowest-level primitives (registers) are atomic: once
- Prove each higher-level algorithm using those primitives: once per level
- The composition theorem guarantees correctness propagates upward: automatically

**Corollary 13.9**: If A is an atomic object and each Bᵢ is an atomic object, then Trans(A) (A with Bᵢ substituted for xᵢ) is also an atomic object guaranteeing I-failure termination.

**Practical example** (three layers):
- Layer 0: Single-writer/single-reader registers (hardware primitives)
- Layer 1: Multi-writer registers via Bloom algorithm (O(1) time, bounded)
- Layer 2: Snapshot objects via BoundedSnapshot (O(m²) time, bounded)
- Layer 3: Business logic using snapshots (reserve, allocate, etc.)

Each layer's correctness proof is independent. Composition is automatic.

### The Turn Function: Preventing Concurrent Invocations

The transformation theorem requires a **turn function** to prevent deadlock:

> "For each port i, there is a function turn_i that, for any finite execution α, yields either system or user, indicating whose turn it is to take the next step."

**Why this is necessary**: Without turn functions:
- User sends invocation to object
- Object is waiting for response from another object
- User tries to send another invocation
- Deadlock: object cannot respond while waiting, user cannot proceed

The turn function ensures: if system (object) is waiting to deliver response, user cannot send new invocations. Mutual exclusion on ports prevents the deadlock.

**Practical implication**: In any layered system, you need an explicit discipline that prevents a caller from issuing a new request while waiting for a response. This is often implicit (blocking calls), but must be explicit in non-blocking designs.

---

## The Multi-Writer Register Problem

### VitanyiAwerbuch: General Solution

For m writers and p readers using n × n registers (one per pair):

```
WRITE(v) at port i:
  read all x(i,j) for all j
  k ← max tagpair found
  write all x(j,i): val←v, tag←(k+1), index←i

READ at port i:
  read all x(i,j) for all j
  find max tagpair = (tag, index)
  return associated val
  // Propagate: write same value to all x(j,i)
```

**Atomicity proof** (Lemma 13.16): Define partial order:
- π ≺ φ iff tagpair(π) < tagpair(φ), OR
- tagpair(π) = tagpair(φ) AND π is WRITE, φ is READ

**Key claims**:
- Tagpairs are monotone non-decreasing per variable (Claim 13.18)
- Each WRITE gets distinct tagpair (Claim 13.19)
- All WRITEs totally ordered by tagpair
- Each READ returns value of latest WRITE in order

**Complexity**: O(n) operations per step (read/write n registers each).

### Bloom Algorithm: Optimal for 2 Writers

For exactly 2 writers, Bloom achieves O(1) time with bounded registers:

**Key idea**: Two registers with 1-bit tags. Process 1 makes tags "unequal" on write; Process 2 makes tags "equal" on write. Readers choose register based on tag sum:
- Sum = 1 → Process 1's register is newer
- Sum = 0 → Process 2's register is newer

**Proof via simulation** (Lemma 13.26): Relate to IntegerBloom algorithm where tags are integers. The simulation relation: bit-valued tag = second-lowest-order bit of integer tag. Show that:
- When Process 1 writes (tag ← t+1), if t is odd, then second-lowest bits of t and t+1 differ ✓
- When Process 2 writes (tag ← t+1), if t is even, then second-lowest bits are equal ✓

**Advantage**: O(1) time per operation, bounded 2|V|-sized registers. Optimal for 2-writer case.

---

## Resource Allocation: Beyond Mutual Exclusion

Chapter 11 generalizes mutual exclusion to multi-resource problems. The key insight:

**Resource graph**: Nodes = resources, edges connect resources needed by same process.

**Coloring algorithm**: Color the resource graph such that adjacent nodes (resources used by the same process) get different colors. Acquire resources in color order (smallest to largest).

**Why coloring prevents deadlock** (from proof):
> "If process i waits for a resource held by process j, then j could only be delayed by waiting for a resource that is strictly larger (in the resource ordering) than the one for which i is waiting; since there are only finitely many processes, the one that holds the largest resource is not blocked."

**The waiting chain length bound**: Equals the number of colors (chromatic number of resource graph). Fewer colors = shorter chains = better performance.

**Symmetry breaking requirement** (Theorem 11.2):

> "There is no symmetric solution to the Dining Philosophers problem."

Proof: "Consider an execution α that begins with all processes in the same process state...proceeding 'round robin.' By induction, all processes are in the same state after r rounds. But progress says some process eventually enters C. This implies all other processes also enter C at the same round. Contradiction to exclusion property."

**LehmannRabin randomized algorithm** breaks symmetry without asymmetry:
- Each process randomly chooses which fork to try first
- With probability ≥ 1/16 per attempt, some adjacent pair successfully coordinates
- Terminates with probability 1 (not certainty — valid fair executions exist where no one enters)

The algorithm guarantees: well-formedness always, exclusion always, progress *with probability 1* (not certain). The randomness is in performance, not safety.
```

---

### FILE: distributed-consensus-the-complete-picture.md
```markdown
# Distributed Consensus: The Complete Picture

## What Is Consensus?

Consensus is the problem of getting a set of processes to agree on a single value. It is the central problem of distributed computing because so many other problems reduce to it: database commit/abort, leader election, replicated state machines, distributed locking.

The basic specification:
- **Agreement**: No two processes decide different values
- **Validity**: Every decided value was some process's initial value
- **Termination**: All nonfaulty processes eventually decide

These three requirements seem simple. Their interaction with failures and timing is where the complexity lives.

---

## The Complete Complexity Landscape

### Synchronous, Stopping Failures: Solvable

**Algorithm**: FloodSet (f+1 rounds), OptFloodSet (f+1 rounds, optimized)

**Key lemma (Lemma 6.1)**: "If no process fails during a particular round r, then all nonfaulty processes have the same W after round r."

With f potential failures, at worst f processes fail in the first f rounds. Round f+1 is guaranteed failure-free. This "good round" makes all views identical, enabling agreement.

**Round lower bound** (from Theorem 6.31-6.33): Consensus requires ≥ f+1 rounds. The proof uses a chain of executions where consecutive executions differ only in one process's initial value (with that process potentially crashed), and indistinguishability propagates the decision along the chain until the endpoint decisions must match — but they were forced to be 0 and 1 respectively.

**Complexity**:
- FloodSet: f+1 rounds, O((f+1)n²) messages, O((f+1)n³b) bits (cubic in n for b-bit values)
- OptFloodSet: f+1 rounds, 2n² messages, O(n²b) bits (quadratic)

**Optimality**: Both rounds and message count are optimal up to constants.

### Synchronous, Byzantine Failures: Solvable With n > 3f

**The fundamental constraint**: n > 3f processes are required.

**The f+1 round lower bound holds here too** (plus f+1 for Byzantine, though the proof is more complex).

**EIGByz algorithm**: Uses an n-level labeled tree where each node records what one set of processes "told another set of processes." Decision via majority voting bottom-up. Requires n > 3f for the majority to work at every tree level.

**PolyByz**: Achieves the same with O(n³ log n) bits instead of exponential, at cost of 2(f+1) rounds.

**Authentication shortcut**: With digital signatures, n > 3f drops to n > f (same as stopping failures). Authentication prevents false attribution.

### Asynchronous, Any Failures: Impossible (FLP)

**Theorem 21.2** (Lynch's version of FLP): No algorithm in the asynchronous broadcast model solves agreement and guarantees 1-failure termination.

**Why**: The adversarial scheduler can always delay any decisive step, making it look like the deciding process crashed. Any algorithm that makes a decisive step creates two indistinguishable scenarios — one where the decision was correct, one where it was wrong.

**The practical consequence**: Every practical consensus system must leave the purely asynchronous model. The choices:

1. **Add timing bounds** (Paxos, Raft): Use heartbeats and leader election timeouts → partial synchrony
2. **Add randomization** (BenOr): Accept probabilistic termination
3. **Weaken termination** (eventual consistency): Accept that sometimes processes don't agree
4. **Use failure detectors** (PBFT): Add an oracle that eventually correctly identifies failures

### Partially Synchronous: Solvable With Time Cost

**Theorem 25.17**: Any algorithm deciding before time Ld + (f−1)d cannot guarantee f-failure termination.

Here L = ℓ₂/ℓ₁ (timing uncertainty ratio), d = max message delivery time.

**Proof structure** (four nested lemmas):
1. Lemma 25.18: "Bad combination" (one 0-valent + one 1-valent execution, ≤f−1 failures, distinguishable to ≤1 process) implies contradiction with assumed time bound
2. Lemma 25.19: Bad combination must exist in any correct algorithm
3. Lemma 25.20: Produces a single bivalent execution with the required properties
4. Lemma 25.21: Strengthens to include maximality, giving two extensions with opposite valences

**PSynch consensus algorithm**: Uses the partial synchrony timing to implement a failure detector (processes that don't respond within time bounds are suspected). With a working failure detector, the PerfectFDAgreement algorithm solves consensus.

**The algorithm A for eventual partial synchrony** (Section 25.6.3):
- Processes execute "stages," each "owned" by a different process
- The owner proposes a value; others lock it if they haven't seen a conflicting proposal
- **Locking mechanism prevents conflicts**: Claim 25.29 proves "if process i decides on value v at stage s, then at the end of every stage > s, at least f+1 processes have locks on v." This prevents any other value from being proposed.
- **Requires n > 2f** (more restrictive than stopping failures' n > f) because eventual synchrony needs a larger safety margin

---

## The Escape Routes in Detail

### Escape Route 1: Randomization (BenOr)

**Algorithm** (n > 3f required):

Stage s:
1. Round 1: Broadcast ("first", s, my_value). Wait for n-f messages. If all same v: set y := v; else y := null.
2. Round 2: Broadcast ("second", s, y). Wait for n-f messages. Decide:
   - If ≥ n-2f processes sent same v ≠ null: set x := v; if first decision, output v
   - Else: x := random bit ∈ {0,1}

**Key lemma (Lemma 21.5)**: "With probability at least ½, all nonfaulty processes choose the same value of x at the end of stage s."

**Proof**: Define "good value" — the value that would cause all processes to coordinate in Round 2.
- If unique good value exists: only processes with that value can send non-null "second" messages → others randomize → choose good value with probability ≥ 1/2
- If no good value (all null): all processes randomize → choose same with probability ≥ 1/2^(n-f)

**Termination**: Probability of agreement by stage s grows exponentially: 1 - (1 - 1/2)^s → 1. Expected number of stages until agreement is O(1).

**The catch** (Example 21.3.1): There exist *fair executions where BenOr never decides*. Consider round-robin scheduling where all processes always make the same random choice — a fair execution that stays split forever. This execution has probability 0 of occurring infinitely often, but it exists.

**What BenOr guarantees**: Agreement *with probability 1* — not with certainty. Termination is guaranteed almost surely, not surely.

### Escape Route 2: Failure Detectors (PerfectFDAgreement)

**Model**: Add a failure detector automaton that outputs `inform-stopped(j)_i` — process i is told that j has stopped.

**Algorithm**:
- Each process i maintains: val (vector of known initial values), stopped (set of failed processes), ratified (set that confirmed current state)
- i broadcasts (val, stopped) repeatedly; updates both when hearing from others
- Decision: when ratified ∪ stopped = {1,...,n}

**Convergence via lattice** (proof):
- (val, stopped) forms a lattice: (w, I) ≤ (w', I') iff w' ⊇ w and I' ⊇ I
- Data only increases (monotone)
- Finite lattice → eventually converges to (w_final, I_final)
- Once converged, every non-failed process learns and confirms it
- When all non-failed processes confirm, ratified ∪ stopped = {1,...,n} → decision safe

**Wait-free termination**: No process needs to wait for another's decision. Each process independently converges.

### Escape Route 3: k-Agreement (TrivialKAgreement)

**Specification**: Processes decide on at most k distinct values (instead of exactly 1).

**Algorithm** (when f < k): Only processes P₁, ..., Pₖ broadcast their values. Every process decides on the first value received.

**Why this works**: With f < k failures, at least one of P₁,...,Pₖ survives. All surviving processes know that survivor's value. At most k values can be decided (one per broadcasting process). This satisfies k-agreement.

**Lower bound** (Theorem 21.10): Cannot solve k-agreement with k-failure termination. The proof reduces to the FLP argument: if you can tolerate k failures in k-agreement, then by partition into two groups (each of size ≥ k), two groups can decide different values, giving k+1 or more distinct decisions.

**Timing complexity** (Chapter 7, synchronous): Running FloodMin for ⌊f/k⌋ + 1 rounds achieves k-agreement in the synchronous model. This means relaxing from 1-agreement to k-agreement reduces round complexity by factor k. The lower bound (Theorem 7.3) shows ⌊f/k⌋ + 1 is tight.

**The Bermuda Triangle proof** (Section 7.1.3): The k-agreement lower bound proof uses a k-dimensional simplex ("Bermuda Triangle") where:
- Vertices correspond to different input configurations
- Sperner's lemma (from algebraic topology!) guarantees a tiny simplex with all k+1 colors
- This tiny simplex represents a decision contradiction

> "As you might expect, the ideas of the proof are derived from those used for ordinary agreement, but they are a good deal more advanced and more interesting. In fact, they take us into the realm of algebraic topology."

### Escape Route 4: Approximate Agreement (AsyncApproxAgreement)

**Specification**: Processes decide on values within ε of each other (instead of exactly equal).

**Application**: Clock synchronization, distributed optimization, parameter averaging.

**Algorithm** (n > 3f, asynchronous):

Stage 0 (initialization):
- Each process broadcasts val
- Collects n-f values, sets val := median(W)
- Establishes known initial range width d₀

Stages 1, 2, ..., S:
- Broadcast val, collect n-f values into W
- val := mean(select(W)) where select removes f extreme values from each end
- At stage S (computed from n, f, ε, d₀), decide

**Contraction lemma** (Lemma 21.11): "Each stage shrinks the width by factor ≥ (f+1)/(n-f)."

**Proof**: Suppose at stage s-1, values are in [min, max] with width d. At stage s, any two processes i, j collect n-f values each. By pigeonhole, at least one collected value in each subset is in the range [min, min + (f+1)/(n-f) · d]. The mean of n-f values shifts into this contracted range.

**Termination**: After S = log_{(n-f)/(f+1)}(d₀/ε) stages, width < ε. S is computed before execution begins; all processes decide at stage S.

**Why n > 3f is needed**: If n ≤ 3f, the contraction factor (f+1)/(n-f) ≥ 1 — no contraction occurs. The algorithm fails to converge.

**Theorem 21.12 (impossibility for n < 2f)**: If n < 2f, approximate agreement is impossible asynchronously. The proof partitions n processes into two groups, each sending f processes' values. If groups are separated by more than ε, they can be made indistinguishable from groups with unanimous input. This forces both to decide their own value → values differ by more than ε.

---

## Consensus in the Distributed Database Context

Chapter 7 presents the **distributed commit problem** as a consensus variant with asymmetric validity:

- **Validity condition 1**: If any process starts with 0 (abort), then 0 is the only possible decision
- **Validity condition 2**: If all processes start with 1 (commit) and there are no failures, then 1 is the only possible decision

This captures: "abort is always safe; commit is only possible if all agree."

**Two-Phase Commit (2PC)**: The classic solution.
- Phase 1: Coordinator gathers votes
- Phase 2: Coordinator broadcasts decision

**2PC is blocking**: If coordinator crashes after gathering votes but before broadcasting, other processes cannot proceed. They don't know if the coordinator decided to commit (and they must commit to maintain atomicity) or abort.

**The specific deadlock** (Section 7.3.2):
> "Suppose that all processes except for 1 start with input 1, but process 1 fails before sending any messages. Then no other process ever learns process 1's initial value, so, because of the validity condition, no process can decide 1. On the other hand, no process can decide 0, since as far as any other process can tell, it might be that process 1 has already decided 1 just before failing."

**Three-Phase Commit (3PC)**: Non-blocking solution.
- Phase 1: Coordinator gathers votes
- Phase 2: Coordinator broadcasts "pre-commit" (if all voted yes) or "abort"
- Phase 3: Coordinator broadcasts "commit" if all acknowledged pre-commit

After coordinator failure, a new coordinator can determine whether to commit (at least one process got "pre-commit" acknowledgment → safe to commit) or abort (no one got "pre-commit" → safe to abort).

**Time complexity**: O(3n) rounds worst case, but guarantees progress even when coordinator fails.

**Message lower bound** (Theorem 7.25): ≥ 2n−2 messages required in any commit algorithm, even in failure-free runs.

**Proof** (Lemma 7.26): Every process must influence every other. If process i doesn't affect j, construct execution where i's input changes and i fails, j can't tell the difference, and j decides wrong value.

---

## How All the Models Connect

The complete consensus picture, hierarchically:

```
Synchronous + Stopping Failures
  → Solvable: f+1 rounds (optimal)
  → FloodSet, OptFloodSet, EIGStop

Synchronous + Byzantine Failures  
  → Solvable: f+1 rounds, n > 3f (both necessary)
  → EIGByz, PolyByz, TurpinCoan + binary

Partially Synchronous + Stopping Failures
  → Solvable: Ld + (f-1)d time (optimal)
  → PSynchFD + PerfectFDAgreement, Algorithm A for eventual synchrony

Asynchronous + Stopping Failures
  → Impossible (FLP)
  → Escape routes: BenOr, k-agreement, approximate agreement, failure detectors

Asynchronous + Byzantine Failures
  → Impossible (FLP + n ≤ 3f)
  → Same escape routes, with n > 3f constraint
```

The most important transitions:
- **Synchronous → Asynchronous**: Consensus goes from solvable to impossible
- **Asynchronous → Partially synchronous**: Consensus becomes solvable again, with time cost
- **Stopping → Byzantine**: Requires factor-of-3 more processes
- **Deterministic → Randomized**: Impossible becomes probable

Understanding these transitions is more valuable than knowing any specific algorithm — the transitions define the landscape of what's achievable.
```

---

### FILE: algorithm-design-patterns-and-canonical-problems.md
```markdown
# Algorithm Design Patterns and Canonical Problems

## The Canonical Problem Set

Lynch identifies a small set of fundamental distributed problems that recur across different system models and applications. Mastering these canonical problems means mastering the building blocks for most real distributed systems.

| Problem | What It Solves | Canonical Algorithm | Key Complexity |
|---------|---------------|---------------------|----------------|
| Leader Election | Select unique coordinator | PetersonLeader (async ring) | Ω(n log n) messages |
| BFS/Spanning Tree | Build communication tree | SynchBFS / AsynchSpanningTree | O(|E|) messages |
| Shortest Paths | Optimal routing | BellmanFord (sync), Async exponential worst case | O((n-1)|E|) sync |
| MST | Efficient broadcast infrastructure | SynchGHS / GHS | O(n log n + |E|) messages |
| Maximal Independent Set | Resource allocation | LubyMIS (randomized) | O(log n) expected rounds |
| Consensus | Agreement on value | FloodSet, EIGByz, BenOr | f+1 rounds (or impossible) |
| Mutual Exclusion | Serialize resource access | Peterson, Bakery, TicketME | n variables minimum |
| Resource Allocation | Multi-resource access | Coloring, LehmannRabin | Color-bounded chains |
| Global Snapshot | Observe consistent state | ChandyLamport / LogicalTimeSnapshot | O(diam) time |
| Reliable Broadcast | Guaranteed delivery | EIGStop / PolyByz | f+1 rounds |

The power of this canonical set: when you face a new distributed problem, ask "which canonical problem does this reduce to?" The reduction tells you both the algorithm and the lower bounds.

---

## Pattern 1: Explore → Aggregate → Decide

The most fundamental pattern in distributed algorithms. Used for BFS, spanning trees, convergecast, and consensus.

### Structure

1. **Explore (Broadcast)**: Root sends query outward; each node forwards to unvisited neighbors
2. **Aggregate (Convergecast)**: Leaves report results; each node aggregates children's reports and sends to parent
3. **Decide**: Root receives all results, makes decision, broadcasts if needed

### BFS as Infrastructure

**SynchBFS algorithm**:
```
Process i₀ (root): mark self, send "search" to all neighbors
At each round:
  If i is unmarked and receives search:
    mark self; choose sender as parent
    send search to all neighbors
    report: send to parent at next round
```

"The motivation for constructing such a tree comes from the desire to have a convenient structure to use as a basis for broadcast communication."

**Applications enabled by BFS tree**:
- **Broadcast**: Piggyback message on search tree → O(|E|) messages
- **Convergecast** (global aggregation): Sum, min, max of distributed inputs → O(|E|) messages
- **Leader election via BFS**: All processes run BFS in parallel; compute max UID; elect → O(n · |E|) messages
- **Diameter computation**: All processes run BFS; compute max distance → O(n · |E|) messages

**Time**: O(diam) rounds (synchronous), O(diam(l+d)) time (asynchronous)
**Messages**: O(|E|) (each edge carries exactly one search message)

### The Timing Anomaly (Non-obvious)

In asynchronous systems, the broadcast on a BFS tree may take O(n(l+d)) time even though the tree was built in O(diam(l+d)) time. Why?

"There is an interesting timing anomaly: if the tree is produced using the AsynchSpanningTree algorithm, then the time complexity of the broadcast is O(n(l+d)); it is not necessarily O(diam(l+d)), even though the AsynchSpanningTree algorithm itself takes time bounded by the diameter."

The reason: the tree's height may exceed the graph diameter. BFS constructs the tree based on which nodes respond first (asynchrony), not necessarily along shortest paths. A tree with height n has broadcast time O(n(l+d)).

**Lesson for distributed systems**: The path that builds a tree is not necessarily the path that uses it efficiently. Measure actual tree height, not graph diameter, for broadcast complexity.

---

## Pattern 2: Competition + Hierarchy

For problems requiring a single winner (leader election, mutual exclusion) in a large system, competition algorithms typically:
1. Let all candidates compete
2. Eliminate losers efficiently
3. Repeat with remaining candidates

The key insight: reducing candidates by a constant fraction each round gives O(log n) rounds.

### LCR: Linear Ring Election

In a unidirectional ring, each process forwards its UID clockwise. If it receives a UID larger than its own, it forwards the larger UID. If it receives its own UID back, it's the leader.

**Message complexity**: O(n²) in worst case (each of n UIDs travels n steps)

**Time**: O(n(l+d)) asynchronous (refined from naive O(n²(l+d)))

The refined analysis uses the "impossible global states" argument: while some send buffers can reach size n (pileups), this cannot happen everywhere simultaneously. To form a pileup, some UIDs must travel faster than the worst-case upper bound to overtake others. This conservation argument gives O(n) total steps across all buffers.

### PetersonLeader: Optimal O(n log n) Messages

The key innovation: processes dynamically transition between **active** and **relay** modes.

**Phase structure**:
- Each active process sends its UID to the 2nd process clockwise (skipping 1)
- Compare with UIDs of 2 counterclockwise active neighbors
- If own UID is largest among the 3: adopt it, stay active
- If not: become relay (just forward messages)

**Why this halves the active count per phase**: The process with the local maximum among any 3 consecutive processes stays active. Any process that isn't a local maximum becomes a relay. At least half of any set of 3 consecutive processes is eliminated.

**Phase count**: log n (active processes halved each phase)
**Messages per phase**: 2 per process = 2n per phase
**Total**: O(n log n) messages

**Time bound** (Theorem 15.8): O(n(l+d)) despite O(log n) phases

The refined time analysis (Claim 15.9): "If processes i and j both active at phase p, some process k ≠ i,j active