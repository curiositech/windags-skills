# Algorithm Families and Patterns: The Canonical Solutions

## Overview: Why These Specific Algorithms

Lynch's book presents algorithms not as isolated curiosities but as representatives of problem classes. Each algorithm answers a fundamental question: **what is the cheapest correct solution given these assumptions?** Understanding the algorithm families means understanding what "cheapest" means in each setting and why cheaper solutions are impossible.

The algorithms are organized around five problem classes: leader election and symmetry breaking; graph structure computation (BFS, shortest paths, MST); consensus and agreement; mutual exclusion and resource allocation; and global coordination (snapshots, logical time). Each class has characteristic techniques and complexity signatures.

## Family 1: Leader Election and Symmetry Breaking

### The Ring Setting

**LCR Algorithm** (Synchronous, known ring, UIDs):
- Each process sends its UID right; discards received UIDs smaller than its own; forwards UIDs larger than its own
- Process that receives its own UID back elects itself leader
- Complexity: O(n²) messages, O(n) rounds (worst case: UIDs arrive in increasing order)

**HS Algorithm** (Synchronous, unknown ring, UIDs):
- Processes "compete" in rounds; each round doubles the distance challenged
- Phase k: each candidate challenges processes within distance 2^k; survivors advance
- Survivors halve each round: n → n/2 → n/4 → ... → 1
- Complexity: O(n log n) messages, O(n) rounds

**Theorem 3.9** (Lower Bound): Any leader election algorithm for a synchronous ring of size n with UIDs and comparison-based operations requires Ω(n log n) messages in the worst case.

The proof: suppose some algorithm uses f(n) messages on a ring of size n. Construct an input where UIDs arrive in the worst possible order for that algorithm. Show f(n) ≥ cn log n using an argument about how many processes must send "challenge" messages.

**Non-comparison-based lower bound**: If UIDs can be used in arbitrary arithmetic (not just compared), then a time-slicing algorithm can elect the process with the smallest UID in O(n) messages. This separates the complexity classes: comparison-based requires Ω(n log n), non-comparison-based requires only O(n). This is a striking example of how assumption changes ("can we do arithmetic on UIDs?") change complexity class.

### General Networks

**FloodMax** (Synchronous, general directed graph, UIDs):
- Every process broadcasts the maximum UID it has ever seen
- After `diam` rounds, each process knows the global maximum UID
- Process with maximum UID elects itself leader

Invariant: "After r rounds, the maximum UID has reached every process that is within distance r of imax, as measured along directed paths in G."

**OptFloodMax** improvement: Only forward a UID if it is strictly larger than any UID previously forwarded on that edge. Reduces messages from O(diam × |E|) to O(|E| + n) in good cases.

Correctness proof via simulation: "We give a proof based on relating the OptFloodMax algorithm formally to the FloodMax algorithm... For any r, 0 < r < diam, after r rounds, the values of the u, max-uid, status, and rounds components are the same in the states of both algorithms."

### Asynchronous Rings

**AsynchLCR**: Same logic as LCR but processes now have FIFO queues instead of single-message buffers. "The main difference is that now each process's send buffer must be able to hold any number (up to n) of messages instead of just a single one. The reason for the difference is that the asynchrony can cause pileups of UIDs at nodes."

**Refined complexity**: Naive analysis gives O(n²(ℓ+d)) time. But pileups cannot form everywhere simultaneously: "although some send buffers and queues can reach size n, this cannot happen everywhere. In order for a pileup to form, some UIDs must travel faster than the worst-case upper bound in order to overtake others. The overall time turns out to be no worse than if the UIDs had all travelled at the same speed." Refined bound: O(n(ℓ+d)).

**PetersonLeader** (Asynchronous, unidirectional ring):
- Processes organized as "active" or "relay"
- Each phase: active processes adopt their counterclockwise neighbor's UID as a "temporary" UID
- A process survives if its own UID is a local maximum (beats both neighbors)
- At least half of active processes become relays each phase → O(log n) phases
- Complexity: O(n log n) messages, O(n(ℓ+d)) time

**Key insight**: Each active process only needs to examine two adjacent candidates, not all n. This local comparison produces global halving—a non-obvious connection between local decisions and global progress.

## Family 2: Graph Structure Computation

### Breadth-First Search

**SynchBFS** (Synchronous):
- Source i₀ sends `search` in round 1 to all outgoing neighbors
- Unmarked process receiving search: mark itself, choose sender as parent, send search to own neighbors
- Complexity: O(diam) rounds, O(|E|) messages

**Convergecast**: After BFS tree is established, information can flow from leaves to root:
- Each leaf sends "done" to parent when it completes local computation
- Each internal node waits for "done" from all children, then computes aggregate, sends to parent
- This pattern supports: sum, max, min, count, and any associative aggregation over all nodes

**AsynchBFS** (Asynchronous):
- Processes maintain `dist` and `parent`; update when better estimate arrives
- Cannot terminate (no way to know when corrections are complete)
- May receive distance estimates out of order; must accept any estimate that improves current best
- Complexity: O(n|E|) messages (each edge can carry O(n) updates), O(diam·n(ℓ+d)) time

**LayeredBFS** vs **HybridBFS**: Trade-offs between messages and time:
- LayeredBFS: O(|E|+n·diam) messages, O(diam²(ℓ+d)) time
- HybridBFS(m): O(m|E|+n·diam/m) messages, O(diam²(ℓ+d) + diam·m(ℓ+d)) time
- Choosing m = √(diam) balances both

### Shortest Paths

**BellmanFord** (Synchronous): Process i maintains `dist` = shortest known path from source.
- Round r: broadcast `dist`; on receive, update `dist` if `received + edge_weight < dist`
- After n-1 rounds: all `dist` values are correct shortest path distances

**Non-obvious complexity**: "It takes 2 rounds for the correct distance, 2, from i₀ to i to stabilize, since the path along which that distance is realized has two edges. However, the diameter is only 1." This example shows that BellmanFord needs n-1 rounds (path length) not diam rounds (topological distance). Weighted distances don't respect unweighted diameter.

**AsynchBellmanFord disaster**: In adversarial asynchronous scheduling with specific graph structure (chains with parallel paths at doubling weights), each node can generate Ω(2ⁿ) distance estimates. "The original ARPANET routing algorithm (1969-1980) used this algorithm; bad graphs could cause routing oscillation for minutes." The O(nⁿ) upper bound is essentially tight for adversarial schedules.

### Minimum Spanning Tree

**SynchGHS** (Synchronous):
- Level-based: level-k components have at least 2^k nodes; at most log n levels
- Each component finds its Minimum Weight Outgoing Edge (MWOE) via convergecast
- Components with same level merge along MWOE; components with different levels: smaller absorbed by larger
- Per-level time: O(n) rounds (must synchronize all nodes to same level)
- Total: O(n log n) rounds, O(n log n + |E|) messages

**Why O(n) rounds per level, not O(diam)**: A component at level k might span many nodes; the leader at one end needs to coordinate with members at the other end. "All the computation for the round has completed" requires at least one full traversal of the component, which can be diameter n in the worst case.

**Key Lemma 4.3**: "Let e be an edge of smallest weight in the set of edges with exactly one endpoint in component C. Then there is a spanning tree for G that includes all component edges and e, and this tree is of minimum weight among all spanning trees including those component edges."

This lemma is the mathematical foundation for all MST algorithms: the MWOE of any component is safe to add to the MST-in-progress.

**Unique MST**: "With distinct edge weights, there's exactly one MST." This uniqueness, combined with the component digraph having exactly one cycle (Lemma 4.5), ensures that the merging process converges without ambiguity.

**GHS** (Asynchronous): Three difficulties compared to SynchGHS:
1. Component identification: process i queries neighbor j; j might be in same component but not know it yet. Solution: use (core_edge_weight, level) pair as component ID; if j's level ≥ i's level and ID differs, j is definitely in different component; otherwise wait.
2. Exponential growth: one big component absorbing single-node components repeatedly. Solution: merge only equal-level components; absorb smaller into larger.
3. Concurrent searches: while C searches for MWOE, smaller C gets absorbed. Solution: careful test-accept-reject protocol.

**GHS complexity**: O(n log n + |E|) messages, O(n log n(ℓ+d)) time. "At the present time, no simple proof is known."—an honest assessment that complexity and correctness are genuinely hard to establish simultaneously for this algorithm.

## Family 3: Consensus Algorithms

### Stopping Failures

**FloodSet** (Synchronous, stopping failures):
- Each process maintains W = set of all values seen so far
- Each round: broadcast W; on receive, take union with all received sets
- After f+1 rounds: decide `singleton(W)` if |W|=1, else decide default value v₀

Why f+1 rounds? By pigeonhole, in f+1 rounds with at most f failures, at least one round has zero failures. In that round, all active processes simultaneously synchronize their W sets. After that, W stays identical.

Complexity: O((f+1)n²) messages, O((f+1)n³b) bits where b = bits per value.

**OptFloodSet** simulation proof:
- OW_i(r) ⊆ W_i(r): optimized set is subset of original
- If |W_i| = 1 then OW_i = W_i: when decision is determined, sets must match
- Therefore: FloodSet correctness implies OptFloodSet correctness
- Message reduction: 2n² messages (two per pair per process, not n² per round)

**EIG (Exponential Information Gathering)**: Encode full communication history in a labeled tree.
- Tree has f+2 levels; root is unlabeled, nodes at level k are labeled by k-length sequences of distinct process indices
- Node labeled i₁...iₖ represents: "iₖ told me (via i₁→...→iₖ₋₁) that i₁'s input is v"
- After f+1 rounds, all communication chains are captured
- Correctness proof: any value v appearing at process i came via a path not containing i (Lemma 6.12)

### Byzantine Failures

**EIGByz** (Synchronous, Byzantine failures, n > 3f):
- Same EIG tree structure, but now must handle lying processes
- Strategy: for each non-leaf node, take majority of children's `newval`
- A node is "common" if all non-faulty processes agree on its newval
- Key: nonfaulty process indices form a "path covering"—every root-to-leaf path has ≥1 nonfaulty node
- Agreement proof: majority over common nodes propagates to root (Lemma 6.18-6.20)

**Why n > 3f?** With 2f+1 non-faulty processes among n > 3f total, any majority of n-f is majority non-faulty. This ensures that lying processes cannot swing majorities at EIG tree nodes.

**PolyByz**: Reduces exponential communication to polynomial by using "consistent broadcast" as a primitive. Achieves O(n³) messages and O(n³ log n) bits—polynomial rather than exponential. Cost: 2(f+1) rounds instead of f+1.

### Asynchronous Setting

**Ben-Or's Randomized Algorithm** (Asynchronous, stopping failures):
Each stage:
- Round 1: Each process broadcasts its value; collects n-f values
  - If some value v appears > n/2 times: set preference to v; send (2, v)
  - Else: set preference to null; send (2, null)
- Round 2: Collect n-f round-2 messages
  - If some value v appears > f times in round-2 messages: decide v
  - Else: if some non-null v present: set preference to v; else flip fair coin

**Correctness**: Agreement and validity hold unconditionally (any execution). Termination holds with probability 1: with probability ≥ 1/2ⁿ per stage, all processes choose the same value. After s stages, P(not yet decided) ≤ (1 - 1/2ⁿ)ˢ → 0.

**The adversary cannot prevent termination** because the coin flips are independent of the adversary's scheduling choices. "To obtain the strongest result, we want to allow the adversary to be as powerful as possible; thus, we assume that, when making its decisions about who takes the next step and when, it has complete knowledge of the past execution, including information about process states and past random choices." Even against this omniscient adversary, the algorithm terminates.

### k-Agreement and Approximate Agreement

**FloodMin** (k-Agreement, synchronous, stopping failures):
- Each process maintains `min-val` = minimum seen so far; broadcasts each round
- Runs for ⌊f/k⌋ + 1 rounds (fewer rounds than FloodSet's f+1!)
- At most k distinct values remain after this many rounds (by counting failures)

**Time-decision tradeoff**: "Roughly speaking, allowing k decision values rather than just one divides the running time by k." This is a clean exchange: weakening the agreement condition (allowing k≠1 outcomes) reduces latency by a factor of k.

**Lower bound for k-agreement**: ⌊f/k⌋ rounds are necessary (Theorem 7.14). The proof uses the **Bermuda Triangle**: a k-dimensional simplex where vertices represent execution configurations and Sperner's Lemma guarantees a "rainbow simplex" (all k+1 colors present) in any valid coloring. The rainbow simplex corresponds to a violation of k-agreement. This proof technique—from algebraic topology—is one of the most sophisticated in the book.

**ConvergeApproxAgreement** (Approximate agreement, Byzantine failures):
- Each round: collect n-f values; remove f smallest and f largest; take mean
- Width reduces by factor ≤ f/(n-2f-1) per round
- After O(log(width/ε)) rounds: all values within ε of each other
- Requires n > 3f

## Family 4: Mutual Exclusion Algorithms

### Read/Write Variables

**Peterson's Two-Process Algorithm**: