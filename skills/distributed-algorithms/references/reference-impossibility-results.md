# Impossibility Results: What Cannot Be Built and Why It Matters

## The Core Principle

Nancy Lynch opens *Distributed Algorithms* with a deceptively practical statement: impossibility results "can help to tell designers when to stop trying to build something." This reframes impossibility proofs from academic exercises into engineering guidance. Before spending months building a distributed coordination mechanism, you should know whether the mechanism is theoretically achievable under your actual assumptions.

The field is organized around a higher degree of uncertainty than other computing domains: unknown number of processors, unknown network topology, independent inputs at different locations, several programs executing at once at different speeds, uncertain message delivery times, unknown message ordering, and processor and communication failures. Each combination of these uncertainties creates a different solvability landscape. The impossibility results map that landscape.

## The FLP Impossibility: Asynchronous Consensus

The most famous impossibility result in distributed computing (Fischer, Lynch, Paterson 1985, formalized throughout Chapters 12 and 21) states:

**There is no algorithm in the asynchronous model that solves the agreement problem and guarantees 1-failure termination.**

The proof proceeds by showing that any asynchronous consensus algorithm must contain a "bivalent" state—a state from which both decision value 0 and decision value 1 remain reachable. By carefully scheduling which process takes the next step, an adversary can always move from one bivalent state to another, preventing any process from safely committing to a decision. Even a single process failure is enough to make this impossible, because the adversary can impersonate a failed process simply by causing its messages to arrive very late.

This impossibility transfers from shared memory to asynchronous networks: "There is no algorithm in the asynchronous broadcast model with a reliable broadcast channel that solves the agreement problem and guarantees 1-failure termination." The proof chains from shared memory impossibility via a network-to-shared-memory transformation.

### What This Means in Practice

This result does not say consensus is impossible. It says consensus is impossible **under pure asynchrony with any stopping failures**. Each path around the impossibility corresponds to an additional engineering assumption:

1. **Randomization**: Ben-Or's algorithm solves consensus with probability 1 in asynchronous networks. "The agreement problem cannot be solved at all in the presence of process failures in the nonrandomized model, but can be solved easily (with probability 1) in the randomized model." The adversary controls scheduling but cannot control random coin flips. For any stage s, with probability at least 1/2ⁿ, all processes choose the same random value, eventually forcing agreement. The probability of failure after s stages is (1 - 1/2ⁿ)ˢ → 0.

2. **Failure detection**: A perfect failure detector—a module that reliably reports which processes have stopped—breaks the impossibility because it eliminates the adversary's ability to impersonate a slow process as a failed one. PerfectFDAgreement works by having processes stabilize their view of the world: each maintains a vector of known initial values and a set of known failures, broadcasts continuously, and decides when its view has been ratified by all non-failed processes. The failure detector in the partially synchronous setting is implemented via timeouts: declare a process failed if no message arrives within time Ld + d (where L is timing uncertainty and d is message latency).

3. **Partial synchrony**: In a partially synchronous model where message delivery and process steps are bounded (even by unknown bounds), consensus becomes solvable. The cost is Ld + (f−1)d minimum time, where L = upper/lower timing bound ratio, d is a timing constant, and f is failures tolerated.

4. **Relaxed agreement**: k-agreement (all processes decide from at most k distinct values) is solvable with f < k stopping failures. The trivial algorithm: have the k "designated" processes broadcast their initial values; every process decides on the first value it receives. Works because k > f guarantees at least one designated process is non-faulty.

5. **Approximate agreement**: Instead of exact consensus, require processes to decide within ε of each other. The ConvergeApproxAgreement algorithm runs multiple rounds, each round having processes collect n-f values, remove the top f and bottom f, and average the remaining. Width reduces by factor 1/(f+1) per round. Requires n > 3f processes.

## Symmetry Impossibility: No Leader Without Identity

**Theorem 3.1 (Lynch Chapter 3)**: There is no deterministic leader election algorithm for anonymous synchronous rings.

**Theorem 11.2**: There is no symmetric solution to the Dining Philosophers problem.

Both proofs use the same inductive argument: in a symmetric execution where all processes run identical code and start in identical states, all processes must make the same decision at every step. If any process elects itself leader, all must—violating the exactly-one-leader requirement. If any process grabs a fork, all must—violating mutual exclusion.

This is a **structural impossibility**, not an algorithmic oversight. It transfers to any system with identical agents arranged in a symmetric topology. The engineering implications are concrete:

- If your agent system requires one authoritative decision-maker, agents must have unique identifiers, or different initial states, or different code, or you must use randomization.
- Breaking symmetry via randomization works: each process samples a random value and the local maximum wins. LubyMIS demonstrates this for the maximal independent set problem—any execution is guaranteed to produce an independent set (deterministic correctness), while termination time is O(log n) in expectation.
- Breaking symmetry via ordering works: RightLeftDP has odd-indexed processes grab their right fork first and even-indexed processes grab their left fork first. Maximum waiting chain length drops from n-2 to 3, giving time bound O(c + ℓ) independent of n.

## Register Impossibility: Memory Cannot Be Compressed

**Theorem 10.33**: Any mutual exclusion algorithm using only read/write shared variables requires at least n distinct variables for n processes.

The proof constructs an adversarial execution using the "covering" technique: if process i always writes to variables already covered by other processes, then other processes can overwrite i's "vote," making the state indistinguishable from a state where i never competed. To prevent this erasure, each process must write to at least one variable that no other process is simultaneously overwriting.

The formal machinery:
- **Covering**: Process i "covers" variable x if i is about to write to x and has not yet written
- **Lemma 10.36**: Every process that reaches the critical section must write to an uncovered variable
- By Pigeonhole: with k-1 variables, if k-1 processes each cover one variable, the k-th process has no uncovered variable to write to—contradiction

This is a **quantitative impossibility**: not just "cannot be done with few variables" but "exactly n variables required, no more, no less." The bound is tight.

What breaks this impossibility? Atomicity. With read-modify-write (RMW) operations, TrivialME solves mutual exclusion with a single shared variable: `if x=0 then x:=1 and enter critical section`. Why? Because the test and set happen atomically—there is no window between "check if x is 0" and "set x to 1" during which another process can interleave.

This is the deepest lesson of the impossibility: **atomicity of data operations directly determines solvability.** The question "what operations does the shared state support?" is not an implementation detail. It is a fundamental architectural question that determines which coordination problems are solvable and which are not.

## Byzantine Impossibility: Why 3f+1 Is Necessary

**Theorem 6.27**: Byzantine agreement (consensus tolerating f processes with arbitrary misbehavior) is impossible if n ≤ 3f.

The proof for n=3, f=1 is instructive. Suppose process 3 is Byzantine and claims different initial values to processes 1 and 2. Process 1 hears from process 2 (value 1) and from process 3 (value 0, claimed). Process 2 hears from process 1 (value 1) and from process 3 (value 1, claimed differently). Both processes see valid-looking scenarios where they should decide differently, but they must agree. By constructing three overlapping "worlds" with consistent local views that force different decisions, the impossibility is derived.

Why 3f+1 works: With n > 3f, you have 2f+1 non-faulty processes, which is a majority among any group of n-f. Majority voting on an EIG (Exponential Information Gathering) tree—a labeled tree encoding the full communication history—produces agreement.

The connectivity analogue: **Byzantine agreement in a general network graph G requires conn(G) > 2f.** This is both necessary and sufficient. The necessity proof: if conn(G) ≤ 2f, we can construct two groups of processes with only 2f "gateway" processes between them; the Byzantine processes can control these gateways and create contradictory views for the two groups.

**The engineering implications are immediate**:
- To tolerate f Byzantine agents, deploy 3f+1 total replicas (not 2f+1 as for crash faults)
- Ensure your network graph has connectivity > 2f (remove any f nodes and the graph remains connected)
- The difference between crash fault tolerance (f+1 processes needed) and Byzantine fault tolerance (3f+1 processes needed) is a 3× hardware cost—justified only when you genuinely cannot trust agent correctness

## The Round Lower Bound: Why f+1 Rounds Are Necessary

**Theorem 6.33**: Any synchronous consensus algorithm tolerating f stopping failures requires at least f+1 rounds.

The proof constructs a chain of "regular runs"—executions where at most k processes fail by round k. Two regular runs with the same inputs are related by indistinguishability: by removing messages one at a time (replacing with null), you can connect any regular run to any other while maintaining regularity. Since indistinguishable processes must decide the same value, validity forces all regular runs with identical inputs to reach the same decision. But with f rounds, you can construct regular runs with opposite inputs that are indistinguishable to every process—contradiction with validity.

The FloodSet algorithm achieves exactly f+1 rounds: every process maintains a set W of seen values, broadcasts W each round, and decides after f+1 rounds. The key lemma: in f+1 rounds with at most f failures, there is at least one failure-free round. In that round, all active processes simultaneously update their W sets to be identical. Once identical, they stay identical. So all surviving processes decide the same value.

## The MST Threshold: Information Cannot Propagate Faster Than Structure

**For spanning tree computation**: O(diam) rounds suffice for BFS in synchronous networks. But **O(n) rounds per level** are needed for MST construction in synchronous networks, not O(diam). The reason: processes must verify that all members of a component have reached the same level before attempting to merge. A diameter-bound would leave some processes unaware of the current component structure. This synchronization requirement is structural, not algorithmic.

In asynchronous networks, the same algorithm (GHS) achieves O(n log n) messages for MST. The impossibility of doing better is harder to establish—"at the present time, no simple proof is known" for the correctness of GHS—suggesting that the complexity analysis of asynchronous graph algorithms is genuinely harder than synchronous analysis.

## Timing Impossibility: The L Factor Cannot Be Eliminated

In partially synchronous systems with timing uncertainty L = upper_step_time / lower_step_time:

**Theorem 25.17**: Any consensus algorithm with f-failure termination requires time at least Ld + (f−1)d.

The proof uses a four-lemma chain:
1. Lemma 25.18 shows a certain bad combination (adjacent 0-valent and 1-valent states indistinguishable to one process) cannot exist
2. Lemma 25.19 shows this combination must exist in any algorithm
3. Lemma 25.20 derives existence of a bivalent state
4. Lemma 25.21 extends to a maximally bivalent state, reconstructing the bad combination—contradiction

The L factor appears because detecting that a process has failed (versus merely being slow) requires waiting L·d time. A process that should respond within d might legitimately take up to Ld steps. Until Ld time passes, you cannot distinguish "failed" from "slow."

The PSynchAgreement algorithm achieves Ld + (2f+2)d, which matches the lower bound up to an O(fd) gap. This gap remains an open problem.

**Engineering consequence**: Every consensus protocol you build has an unavoidable latency floor of Ld + (f−1)d. If you need faster decisions, you must either reduce L (tighten process speed variation, accept stronger synchrony assumptions), reduce d (improve network latency), or reduce f (tolerate fewer failures). There is no algorithm that avoids this.

## A Unified View of What the Impossibility Results Teach

The impossibility results collectively define the **solvability frontier** of distributed computing:

| Problem | Constraint | Impossibility |
|---------|-----------|---------------|
| Consensus | Asynchrony + 1 crash failure | Impossible (FLP) |
| Consensus | n ≤ 3f Byzantine | Impossible |
| Leader election | Anonymous ring | Impossible |
| Mutual exclusion | < n read/write variables | Impossible |
| Mutual exclusion | Symmetric processes | Impossible |
| Consensus | < f+1 rounds | Impossible |
| k-agreement | f ≥ k crash failures | Impossible |

Each impossibility has a corresponding "escape route" that restores solvability by changing one assumption. The art of distributed systems design is knowing which escape route matches your actual infrastructure—because assuming stronger synchrony than you have, or weaker fault assumptions, will cause your "proven correct" algorithm to fail in production.