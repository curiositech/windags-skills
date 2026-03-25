---
---
license: Apache-2.0
name: kleppmann-data-intensive
description: Comprehensive guide to designing reliable, scalable data systems covering databases, streaming, and consistency
category: Research & Academic
tags:
  - data-systems
  - distributed-systems
  - databases
  - streaming
  - consistency
---

# SKILL: Designing Data-Intensive Systems (Kleppmann)

**Source**: *Designing Data-Intensive Applications* by Martin Kleppmann
**Domain**: Distributed systems, data architecture, reliability engineering
**Applies to**: Building systems where data complexity (not computation) is the bottleneck

## DECISION POINTS

### 1. Consistency Model Selection
```
IF: Strong consistency required (banking, inventory)
  AND: Can tolerate higher latency + coordination overhead
THEN: Use linearizability with synchronous replication

IF: Operations need ordering but not global agreement
  AND: User experience matters more than strict consistency
THEN: Use causal consistency (preserve cause-effect, allow concurrent ops)

IF: High availability required during network partitions
  AND: Can resolve conflicts application-side
THEN: Accept eventual consistency with conflict resolution

IF: Read-your-writes is critical but global consistency isn't
  AND: Users mostly operate on their own data
THEN: Route user reads to leader/use session consistency
```

### 2. Scaling Architecture Decisions
```
IF: tail latency > 500ms + replication lag > 1s
  AND: Cache hit rate < 80%
THEN: Switch to local quorum reads, accept bounded staleness

IF: Write throughput bottleneck identified
  AND: Operations can be partitioned by key
THEN: Implement horizontal partitioning with partition-local transactions

IF: Cross-partition queries frequent
  AND: Eventual consistency acceptable for derived data
THEN: Use CQRS pattern (separate write/read paths)

IF: Coordination overhead dominates response time
  AND: Operations can be made idempotent
THEN: Replace distributed locks with compare-and-set operations
```

### 3. Failure Handling Strategy
```
IF: Component failure detected (timeout/error)
  AND: Operation might have succeeded
THEN: Make operation idempotent, use unique request IDs for retry

IF: Distributed resource coordination required
  AND: Process pauses/network delays possible
THEN: Implement fencing tokens (resource rejects lower-numbered tokens)

IF: Multi-step workflow spans services
  AND: Atomic rollback needed
THEN: Use saga pattern with compensating transactions, not 2PC

IF: Service dependency causing tail latency spikes
THEN: Implement circuit breaker + hedged requests after timeout threshold
```

## FAILURE MODES

### 1. Split-Brain Coordination
**Symptoms**: Two nodes both believe they're the leader, conflicting writes accepted
**Root Causes**: Network partition + inadequate quorum checking + lease expiry race conditions
**Detection Rule**: If you see duplicate primary keys or "impossible" data states after network events
**Fixes (ranked by speed/safety)**:
1. Immediate: Enable fencing tokens, reject operations from stale leaders
2. Short-term: Implement proper quorum (majority must agree on leader)
3. Long-term: Use consensus algorithm (Raft/Paxos) for leader election

### 2. Cascade Failure Amplification
**Symptoms**: Single component failure causes system-wide outage, p99 latency spike across all services
**Root Causes**: Synchronous dependencies + no circuit breakers + retry storms + unbounded queues
**Detection Rule**: If failure rate increases exponentially rather than linearly with initial fault
**Fixes (ranked by speed/safety)**:
1. Immediate: Deploy circuit breakers, implement fail-fast with timeouts
2. Short-term: Add backpressure mechanisms, bound all queues
3. Long-term: Break synchronous dependencies, use asynchronous messaging

### 3. Read-After-Write Disappearing Data
**Symptoms**: User writes data, immediately reads and sees old value, claims "data was lost"
**Root Causes**: Async replication lag + load balancer routes read to stale replica + no session affinity
**Detection Rule**: If user complaints about "lost data" correlate with write-then-read patterns
**Fixes (ranked by speed/safety)**:
1. Immediate: Route user reads to primary for N seconds after write
2. Short-term: Implement read-your-writes consistency with logical timestamps
3. Long-term: Use strongly consistent reads for user-critical paths

### 4. Phantom Distributed Lock
**Symptoms**: Multiple processes acquire same lock simultaneously, resource corruption occurs
**Root Causes**: Lock service uses timeouts without fencing + GC pauses + network delays exceed lease time
**Detection Rule**: If you see lock violation errors or concurrent modification of "protected" resources
**Fixes (ranked by speed/safety)**:
1. Immediate: Implement fencing tokens, resource validates token before operation
2. Short-term: Use compare-and-set instead of locks where possible
3. Long-term: Redesign to avoid coordination, use immutable data structures

### 5. Thundering Herd Cache Stampede
**Symptoms**: Cache expires, all requests hit database simultaneously, database overloads
**Root Causes**: Cache expiry + no request deduplication + synchronous cache population + high concurrency
**Detection Rule**: If database load spikes correlate with cache miss events
**Fixes (ranked by speed/safety)**:
1. Immediate: Implement cache request coalescing, only one thread populates
2. Short-term: Use probabilistic cache refresh before expiry
3. Long-term: Implement cache warming and gradual expiry spreading

## WORKED EXAMPLES

### Example: E-commerce Inventory Management

**Scenario**: User adds last item to cart, another user tries same item simultaneously

**Decision Process**:
1. **Identify coordination requirement**: Need atomic decrement of inventory count
2. **Assess consistency needs**: Overselling is unacceptable (lost revenue + customer complaints)
3. **Choose approach**: Use linearizable reads/writes for inventory, eventual consistency for recommendations

**Implementation**:
```sql
-- Atomic inventory check with compare-and-set
UPDATE inventory 
SET quantity = quantity - 1, version = version + 1
WHERE product_id = ? AND quantity >= 1 AND version = ?
```

**Novice would miss**: Using SELECT then UPDATE (race condition window)
**Expert catches**: Version field prevents lost updates, quantity check prevents overselling

**Fallback handling**:
- IF update affects 0 rows (item sold out): Return "out of stock" immediately
- IF operation times out: Use fencing token to prevent duplicate decrement
- IF database unavailable: Fail fast rather than queue requests indefinitely

### Example: Social Feed Consistency

**Scenario**: User posts update, immediately checks feed, doesn't see their post

**Decision Process**:
1. **Analyze user expectation**: Seeing own posts matters, seeing others' posts can be delayed
2. **Identify load parameters**: Write fan-out to followers, not write volume
3. **Choose consistency model**: Causal consistency (preserve user's action order)

**Implementation Strategy**:
- Write to user's timeline synchronously (read-your-writes)
- Fan out to followers asynchronously (eventual consistency)
- Use logical timestamps to prevent time-travel anomalies

**Quality validation**:
- User always sees their own posts immediately
- Followers see posts within bounded time (monitor lag)
- No posts appear before their replies

## QUALITY GATES

- [ ] Consistency model explicitly chosen and anomalies catalogued
- [ ] Load parameters identified and instrumented (p99 latency, fan-out ratio, partition skew)
- [ ] Failure modes tested: component failures, network partitions, process pauses
- [ ] Coordination minimized: operations partitioned, idempotency implemented
- [ ] Tail latency measured: p99 and p999 tracked separately from averages
- [ ] Quorum mathematics verified: w + r > n for required consistency level
- [ ] Circuit breakers deployed: timeout and error rate thresholds configured
- [ ] Observability complete: can trace requests across service boundaries
- [ ] Chaos testing implemented: deliberate fault injection in non-production
- [ ] Rollback strategy proven: can revert changes without data loss

## NOT-FOR BOUNDARIES

**This skill should NOT be used for**:
- Pure computational problems (ML training, rendering) → Use parallel-processing patterns instead
- Single-machine applications with local data → Use database-patterns skill instead
- Systems where "eventual consistency" means "never consistent" is acceptable → Use eventual-consistency-design skill instead
- Real-time systems with hard latency bounds → Use real-time-systems skill instead

**Delegate to other skills**:
- For message queue design → Use messaging-patterns skill
- For database schema design → Use data-modeling skill  
- For microservices boundaries → Use service-decomposition skill
- For monitoring/alerting setup → Use observability skill