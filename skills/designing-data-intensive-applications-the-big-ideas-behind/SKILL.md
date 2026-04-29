---
name: designing-data-intensive-applications-the-big-ideas-behind
description: '### 1. The Fault/Error/Failure Hierarchy NOT for unrelated tasks outside this domain.'
license: Apache-2.0
metadata:
  provenance:
    kind: legacy-recovered
    owners:
    - some-claude-skills
---
## Core Mental Models

### 1. The Fault/Error/Failure Hierarchy
**Principle**: Faults (component deviations) are inevitable; your job is preventing them from becoming failures (user-visible problems).

- **Fault**: Disk fails, network drops packets, process crashes (EXPECT THIS CONSTANTLY)
- **Error**: System detects the fault (checksums fail, timeouts fire, exceptions raised)
- **Failure**: User-visible problem (request fails, data corrupted, service unavailable)

**Design implication**: Build systems where faults are *contained* and *recoverable*. Netflix's Chaos Monkey deliberately injects faults because systems that never practice recovery can't do it when needed. Fault tolerance beats fault prevention.

**How to apply**: Instead of asking "how do we prevent X from failing?", ask "when X fails (it will), how do we ensure users don't notice?" Use supervision trees, circuit breakers, health checks, and automatic failover.

### 2. Load Parameters: The Hidden Dimension
**Principle**: Scalability depends entirely on which parameter dominates your workload—and you often can't predict this without measurement.

Twitter example: 
- 12,000 tweets/sec is easy (writes scale horizontally)
- Distribution to followers is hard (some users have 30M followers = 30M writes per tweet)
- The "fan-out" parameter determined architecture, not write throughput

**Design implication**: "Can your system scale?" is the wrong question. Right questions:
- Which operations matter most to users? (Read latency? Write durability? Query complexity?)
- What's the distribution? (Uniform vs. skewed? 99th percentile vs. median?)
- What happens as key parameters grow 10x? 100x?

**How to apply**: 
1. Instrument everything—track percentiles (p50, p99, p999), not just averages
2. Identify load parameters explicitly (requests/sec, fan-out ratio, data volume, cache hit rate)
3. Design for the tail, not the average (one slow dependency kills your p99)

### 3. Consistency Models Are a Spectrum of Trade-offs
**Principle**: There's no "consistent" vs. "inconsistent"—only different guarantees with different costs.

| Model | What You Get | What You Pay |
|-------|-------------|--------------|
| **Linearizability** | Total order, reads see latest write | Coordination overhead, availability loss, latency penalty |
| **Causal Consistency** | Cause-effect preserved, no time reversal | Tracking dependencies, complex implementation |
| **Eventual Consistency** | High availability, low latency | Read-your-writes fails, concurrent updates conflict, anomalies |

**Design implication**: Choose based on which failures your application can tolerate. Banking transactions need linearizability (lost writes = lost money). Social feeds tolerate eventual consistency (stale likes don't matter). Shopping carts need causal consistency (adding item then viewing cart must preserve order).

**How to apply**:
- Start by listing which anomalies would be user-visible bugs vs. minor annoyances
- Accept eventual consistency where anomalies are harmless (analytics, recommendations)
- Use strong consistency only where coordination is unavoidable (unique constraints, account balances)
- Prefer causal consistency as the sweet spot (preserves intuition without killing performance)

### 4. Immutability Enables Time Travel
**Principle**: If data is append-only and transformations are deterministic, you can replay the past to fix the future.

Mutable databases: Bug corrupts data → Rollback loses legitimate updates → Manual cleanup hell
Immutable logs: Bug corrupts derived view → Replay events through fixed code → Derived view automatically corrects

**Design implication**: Separate "source of truth" (immutable event log) from "derived views" (indexes, caches, aggregations). Views can have bugs, be discarded, or reconstructed—the log is sacred.

**How to apply**:
- Store events (user registered, order placed), not current state (user table, order total)
- Make transformations deterministic (same input → same output, no random(), no timestamps)
- Use log compaction to prevent infinite growth while preserving history
- Add new features by creating new derived views from existing logs (no migration risk)

### 5. Coordination Is the Enemy of Scale
**Principle**: Every time components must synchronize (locks, consensus, distributed transactions), you pay a latency/availability penalty. Minimize coordination, don't optimize it.

**Why coordination hurts**:
- Two-phase commit: One slow/failed node blocks everyone (amplifies tail latency)
- Consensus algorithms: Require majority quorum (network partition loses availability)
- Distributed locks: Timing assumptions fail (process pauses, clocks drift, network delays)

**Design implication**: The best coordination is no coordination. Partition data so operations are local. Use idempotent operations so retries are safe. Accept conflicts and resolve them application-side.

**How to apply**:
- Partition by key so related data co-locates (user's posts on same node)
- Design for idempotence (increment counter → set counter to value with timestamp)
- Use fencing tokens to detect stale operations (resource rejects lower-numbered tokens)
- Choose single-leader replication to reduce coordination (only leader coordinates writes)

---

## Decision Frameworks

### Architecture Selection
```
IF: Operations can be partitioned with minimal cross-partition coordination
  AND: Horizontal scaling is required
THEN: Consider partitioned/sharded architecture with partition-local transactions

IF: Strong consistency is required across all operations
  AND: Scale requirements are moderate
THEN: Consider single-leader replication with synchronous followers

IF: Historical debugging and schema evolution are critical
  AND: Storage costs are acceptable
THEN: Consider event sourcing with immutable logs and derived views

IF: You need both fast writes and complex queries
THEN: Separate write path (log/queue) from read path (indexed views) [CQRS pattern]

IF: Network partitions must not cause data loss
  AND: Temporary unavailability is acceptable
THEN: Choose consistency over availability (CP in CAP theorem)

IF: User-visible downtime is unacceptable
  AND: Temporary inconsistencies are tolerable
THEN: Choose availability over consistency (AP in CAP theorem)
```

### Failure Handling
```
IF: Operation might be retried (network timeout, crash, uncertainty)
THEN: Make it idempotent (use unique request IDs, compare-and-set, fencing tokens)

IF: Distributed locks are required (resource coordination)
THEN: Use fencing tokens (resource rejects operations from lower epoch numbers)

IF: Component might fail mid-operation
THEN: Design for crash recovery (write-ahead log, checkpoint + replay)

IF: Multiple replicas exist
THEN: Use quorum reads/writes (w + r > n ensures overlap) to tolerate failures

IF: Cascading failures are possible
THEN: Implement circuit breakers, timeouts, backpressure, and rate limiting
```

### Performance Optimization
```
IF: Latency percentiles (p99, p999) are problematic
THEN: Look for head-of-line blocking, tail amplification in multi-stage requests

IF: Throughput is high but some requests are very slow
THEN: Measure load parameters—likely skew (hot keys, unbalanced partitions)

IF: Caching isn't helping
THEN: Check cache invalidation strategy (is data being invalidated too aggressively?)

IF: Database queries are slow
THEN: Before adding indexes, check if read pattern matches data model (might need denormalization)

IF: Write throughput is the bottleneck
THEN: Batch writes, use append-only structures, partition to parallelize
```

---

## Reference Documentation

| File | When to Load |
|------|--------------|
| `fault-tolerance-through-architecture.md` | Designing for component failures, understanding fault/error/failure distinctions, implementing supervision trees or health checks |
| `load-parameters-and-scalability.md` | Performance tuning, capacity planning, understanding why scaling isn't working, identifying hidden bottlenecks like fan-out or skew |
| `immutability-determinism-and-debuggability.md` | Implementing event sourcing, debugging production issues, enabling schema evolution without downtime, building auditable systems |
| `consistency-models-and-coordination-costs.md` | Choosing consistency guarantees, debugging race conditions or anomalies, understanding CAP theorem trade-offs, evaluating database options |
| `distributed-transactions-and-coordination.md` | Implementing distributed transactions, coordinating across multiple services, understanding consensus algorithms, avoiding two-phase commit pitfalls |
| `operational-realities-and-failure-modes.md` | Preparing for production, understanding real-world failure modes (network partitions, clock skew, process pauses), incident post-mortems |

---

## Anti-Patterns

### 1. The "Eventually Consistent" Hand-Wave
**Mistake**: Claiming "eventual consistency is fine" without defining WHEN consistency is achieved or WHAT anomalies are acceptable.

**Why it fails**: Users don't accept "your cart will eventually show the item you added" or "your password change will eventually take effect." Some operations demand immediate consistency.

**Correct approach**: Explicitly enumerate which anomalies are tolerable. Use causal consistency or stronger models for user-critical paths. Eventual consistency is a design choice with specific failure modes, not a magic bullet.

### 2. Distributed Transactions as the Default
**Mistake**: Using two-phase commit or distributed locks for cross-service coordination because "we need ACID guarantees."

**Why it fails**: Distributed transactions amplify tail latency (one slow participant blocks all), reduce availability (coordinator failure blocks all), and create deadlock risks. They're the most expensive coordination mechanism.

**Correct approach**: Partition data to avoid cross-partition transactions. Use sagas (compensating transactions) for multi-step workflows. Accept temporary inconsistency where safe. Reserve distributed transactions for truly unavoidable cases.

### 3. Timestamp-Based Ordering at Scale
**Mistake**: Using `System.currentTimeMillis()` or database timestamps to order events across multiple machines.

**Why it fails**: Clocks drift (even NTP synchronized clocks can be 100ms off), leap seconds exist, VMs pause unpredictably. "Last write wins" with timestamps causes silent data loss when clocks are wrong.

**Correct approach**: Use logical clocks (Lamport timestamps, vector clocks) for ordering. If physical timestamps are needed, use version vectors or consensus-based coordination (like Google Spanner's TrueTime).

### 4. The "Just Cache It" Reflex
**Mistake**: Adding caching layers without addressing cache invalidation strategy, assuming caches solve scalability problems.

**Why it fails**: Cache invalidation is one of the hardest problems in CS. Stale caches cause consistency bugs. Cache stampedes amplify load during invalidation. Caches add complexity without addressing root causes.

**Correct approach**: First optimize data models and indexes. If caching is needed, decide: time-based expiry (simple, tolerates staleness) or invalidation-based (complex, better consistency). Monitor cache hit rates and invalidation patterns.

### 5. Read-After-Write Without Guarantees
**Mistake**: Assuming that after a write succeeds, subsequent reads will reflect it—especially in multi-datacenter or leader-follower setups.

**Why it fails**: Asynchronous replication means followers lag. Load balancers route reads to different replicas. Users read from stale replicas and see their writes "disappear."

**Correct approach**: Provide read-your-writes consistency where needed: route user's reads to leader, use logical timestamps (read only replicas ahead of user's last write), or accept staleness with user feedback ("changes may take a moment to appear").

### 6. Ignoring Tail Latency
**Mistake**: Optimizing for average latency or median (p50), ignoring p99 and p999.

**Why it fails**: If a user request hits 10 backend services, and each has 1% chance of being slow, the user has 10% chance of a slow request. Tail latency dominates user experience in multi-service architectures.

**Correct approach**: Always measure and optimize percentiles, especially p99. Use hedged requests (send duplicate after timeout), limit queue sizes (fail fast instead of queueing), and identify stragglers (slow disks, GC pauses).

---

## Shibboleths

### Surface-Level Understanding Says:
- "We use microservices for scalability"
- "Eventual consistency means it'll be consistent eventually"
- "NoSQL databases are faster than SQL"
- "We'll just add more servers if we need to scale"
- "Strong consistency is always better"

### Deep Internalization Shows:
- "We partitioned by user ID so operations rarely need cross-partition coordination, but we're monitoring skew because some power users create hot partitions"
- "We accept eventual consistency for the feed because reading your own posts from a stale replica is annoying but not a bug, but checkout uses linearizable reads because 'item sold out after I added it to cart' is unacceptable"
- "We chose Cassandra for write-heavy workloads with predictable query patterns, but kept Postgres for relational data needing complex queries—the tool matches the job"
- "Horizontal scaling requires partitionable workloads; our bottleneck is coordination overhead from distributed transactions, so adding servers won't help"
- "We use causal consistency because it preserves happens-before relationships users expect without the coordination cost of linearizability"

### Tells Someone Has Internalized Kleppmann:
1. **They discuss trade-offs, not solutions**: "We chose X because Y was more important than Z, but we're monitoring for cases where that assumption breaks"
2. **They name specific consistency anomalies**: "We can tolerate read skew but not write skew in this workflow"
3. **They identify load parameters**: "Our scaling bottleneck isn't requests/sec, it's the p99 latency caused by fan-out to 50 downstream services"
4. **They design for failure**: "We added chaos testing because we discovered our failover procedure had never actually been exercised in production"
5. **They question timing assumptions**: "We can't use distributed locks here because we can't assume processes won't pause for GC or network delays won't exceed our timeout"
6. **They separate concerns**: "Our event log is the source of truth; the materialized views (cache, search index, API responses) are all derived and can be rebuilt"

### Red Flags (Hasn't Internalized):
- Treating "consistency" as a binary property
- Assuming clocks are synchronized or monotonic
- Using "transactions" and "distributed transactions" interchangeably
- Believing "eventual consistency" has no failure modes
- Thinking scalability means "add more servers"
- Proposing distributed locks without fencing tokens or discussing lease expiry edge cases

---

## Quick Reference: Key Patterns

**Idempotence**: Operations that can be safely retried (use unique request IDs, compare-and-set)
**Fencing Tokens**: Monotonic tokens that prevent stale operations from corrupting resources
**Quorum Consensus**: w + r > n guarantees overlap between write and read quorums
**Event Sourcing**: Immutable log as source of truth, derived views can be rebuilt
**CQRS**: Separate write path (optimized for updates) from read path (optimized for queries)
**Saga Pattern**: Multi-step workflows with compensating transactions instead of distributed locks
**Circuit Breaker**: Stop calling failing services to prevent cascading failures
**Hedged Requests**: Send duplicate requests after timeout to reduce tail latency

---

**Usage Note**: This skill provides mental models for reasoning about data-intensive systems. When facing a specific design decision, consult the relevant reference document for deeper analysis of trade-offs, failure modes, and implementation patterns.