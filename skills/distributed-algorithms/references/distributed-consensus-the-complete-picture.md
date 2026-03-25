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