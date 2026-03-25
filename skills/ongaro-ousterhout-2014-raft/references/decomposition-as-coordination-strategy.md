# Decomposition as Coordination Strategy: Lessons from Raft

## The Central Insight

Raft demonstrates that **how you decompose a problem determines whether distributed agents can coordinate effectively**. The paper's most distinctive contribution isn't the consensus algorithm itself—it's the methodical demonstration that decomposition is a design choice with measurable consequences for understandability, correctness, and implementability.

The authors write: "We had several goals in designing Raft... But our most important goal—and most difficult challenge—was understandability. It must be possible for a large audience to understand the algorithm comfortably" (p. 3). This isn't aspirational rhetoric—they used understandability as the **deciding criterion** when evaluating alternative designs.

## Decomposition Strategy: Separating Leader Election, Log Replication, and Safety

Raft decomposes consensus into three relatively independent subproblems:

1. **Leader election**: Choose a coordinator when the current one fails
2. **Log replication**: The leader accepts commands and forces followers to agree
3. **Safety**: Ensure that committed entries persist across leadership changes

This contrasts sharply with Paxos, which "first defines a protocol capable of reaching agreement on a single decision... then combines multiple instances of this protocol to facilitate a series of decisions" (p. 2). The difference isn't just pedagogical:

- **Paxos decomposition**: Single-decree → multi-decree (vertical composition)
- **Raft decomposition**: Election ⊥ Replication ⊥ Safety (horizontal separation)

The authors explain why Paxos's approach fails: "Single-decree Paxos is dense and subtle: it is divided into two stages that do not have simple intuitive explanations and cannot be understood independently" (p. 2). The foundation is so complex that everything built on it inherits that complexity.

## Why This Decomposition Works

The Raft decomposition succeeds because:

1. **Each component has a clear purpose** expressible in a single sentence
2. **Dependencies flow in one direction**: Election → Leader → Replication → Safety
3. **Failure modes are isolated**: Election problems don't corrupt log replication
4. **Implementation can proceed incrementally**: You can build and test each piece separately

The paper reveals this thinking explicitly: "The first technique is the well-known approach of problem decomposition: wherever possible, we divided problems into separate pieces that could be solved, explained, and understood relatively independently" (p. 3).

## Application to Multi-Agent Systems

### 1. Task Decomposition in DAG Orchestration

When WinDAGs decomposes a complex task into subtasks, **the decomposition strategy determines coordination complexity**:

**Bad decomposition** (Paxos-like):
- Task A produces intermediate state
- Task B and C both need to understand A's internal structure
- Task D must reconcile potentially inconsistent outputs from B and C
- Every agent needs global knowledge to validate its role

**Good decomposition** (Raft-like):
- Task A produces a well-defined output contract
- Task B and C operate independently on different aspects
- Task D simply aggregates results according to a clear protocol
- Each agent needs only local knowledge plus interface specifications

The Raft lesson: **Decompose by minimizing the semantic surface area between components**, not by theoretical elegance or load balancing.

### 2. Leader Election vs. Democratic Consensus

Raft's strong leadership model teaches that **asymmetric coordination is often simpler than symmetric negotiation**. The leader:
- Makes unilateral decisions about log ordering
- Resolves conflicts by forcing followers to match its state
- Centralizes complexity in one role while keeping follower logic simple

For agent orchestration: When multiple agents need to coordinate on shared state, having one "orchestrator agent" that makes binding decisions may be simpler than having all agents negotiate. The cost is single-point-of-failure risk, but Raft shows this can be mitigated with rapid leader replacement rather than eliminating the leader role.

### 3. State Space Reduction Through Constraints

Raft's constraints dramatically reduce possible system states:
- **No log holes**: Entries are always contiguous
- **Leader Append-Only**: Leaders never delete or overwrite their own entries
- **Unidirectional flow**: Log entries only flow from leader to followers

Each constraint eliminates entire classes of edge cases. The paper notes: "Our second approach was to simplify the state space by reducing the number of states to consider, making the system more coherent and eliminating nondeterminism where possible" (p. 3).

**Application to agent systems**: When designing task dependencies in a DAG:
- **No orphan tasks**: Every task except the root must have a parent whose completion is verified
- **No retroactive invalidation**: Once a task is marked complete, downstream tasks can rely on it
- **Forward-only execution**: Tasks cannot re-execute unless explicitly marked for retry

These constraints don't limit capability—they prevent pathological states that would require complex recovery logic.

## The Failure Mode: Elegant but Incomprehensible Decomposition

The paper documents exactly how "elegant" decomposition fails. Initially, they tried a ranking system for leader election: "each candidate was assigned a unique rank, which was used to select between competing candidates" (p. 6). This is theoretically clean—it deterministically resolves conflicts.

But: "We found that this approach created subtle issues around availability... We made adjustments to the algorithm several times, but after each adjustment new corner cases appeared" (p. 6).

The problem wasn't correctness—it was **emergent complexity from interactions between the ranking system and other components**. The decomposition created tight coupling in disguise.

They replaced it with randomized timeouts: "Eventually we concluded that the randomized retry approach is more obvious and understandable" (p. 6). Randomization isn't elegant, but it decouples components by making them indifferent to coordination timing.

## Measuring Decomposition Quality

The user study provides empirical evidence that decomposition quality is measurable. Students who learned Raft scored 4.9 points higher (out of 60) than those who learned Paxos, despite 15 of 43 having prior Paxos experience and the Paxos lecture being 14% longer.

More importantly: "An overwhelming majority of participants reported Raft would be easier to implement and explain (33 of 41 for each question)" (p. 14).

This suggests **decomposition quality predicts implementation success**. For agent systems: if agents struggle to explain their role in the system, the decomposition is probably wrong.

## Design Heuristics from Raft

1. **Separate concerns by failure mode**: Leader election failures are different from replication failures—handle them in different components
2. **Make dependencies explicit and unidirectional**: Raft's leader → followers flow eliminates circular dependencies
3. **Isolate complexity in specialized components**: Put the hard stuff (leader election) in one place; keep everything else simple (followers just replicate)
4. **Optimize decomposition for the implementer, not the theorist**: Raft's three-part split isn't the most mathematically elegant, but it's what humans can understand

## Boundary Conditions: When This Decomposition Doesn't Apply

The Raft decomposition assumes:
- **Clear leadership is acceptable**: Some systems require symmetric peers (e.g., blockchain consensus)
- **Operations are sequential**: Raft's log is totally ordered; systems needing causal consistency might need different decomposition
- **Failure detection is reliable enough**: If nodes can't reliably detect leader failure, election churns

The authors acknowledge this: "Raft's strong leadership approach simplifies the algorithm, but it precludes some performance optimizations. For example, Egalitarian Paxos (EPaxos) can achieve higher performance under some conditions with a leaderless approach" (p. 16).

## Implication for WinDAGs

When decomposing complex problems into skills/agents:

1. **Evaluate decompositions by understandability first**: Can each agent explain its role without reference to implementation details of other agents?
2. **Prefer asymmetric coordination**: One orchestrator + many workers is often simpler than peer-to-peer negotiation
3. **Constrain state space**: Prohibit pathological states rather than handling them
4. **Measure decomposition quality**: If agents frequently need to coordinate about edge cases, the boundaries are wrong

The deepest lesson: **Decomposition is not about dividing work—it's about dividing understanding**. Raft proves that when humans can understand each piece independently, they build more reliable systems.