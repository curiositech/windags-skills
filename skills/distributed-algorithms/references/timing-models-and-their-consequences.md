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