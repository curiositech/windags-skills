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