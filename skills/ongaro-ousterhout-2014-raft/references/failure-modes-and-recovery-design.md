# Failure Modes and Recovery Design: What Raft Teaches About Resilience

## The Core Philosophy: Design for Failure from the Start

Raft doesn't treat failure as an exception—it's the central design constraint. The paper states in the introduction: "Consensus algorithms allow a collection of machines to work as a coherent group that can survive the failures of some of its members. Because of this, they play a key role in building reliable large-scale software systems" (p. 1).

The key phrase: "survive the failures"—not prevent them, not recover from them as an afterthought, but *survive* them as normal operation. This inverts the typical design process: instead of building the system and then adding error handling, Raft builds failure recovery into the fundamental architecture.

## The Failure Model: What Raft Assumes Can Go Wrong

The paper specifies exactly what failures the system handles: "They ensure safety (never returning an incorrect result) under all non-Byzantine conditions, including network delays, partitions, and packet loss, duplication, and reordering" (p. 2).

This means Raft handles:
- **Server crashes**: Nodes stop responding (fail-stop model)
- **Network partitions**: Some nodes can't communicate with others
- **Message loss**: Packets disappear in transit
- **Message duplication**: Same message arrives multiple times
- **Message reordering**: Messages arrive out of order
- **Arbitrary message delays**: Messages take unpredictably long

Critically, it does *not* handle:
- **Byzantine failures**: Nodes sending malicious or corrupted messages
- **Disk corruption**: State storage becomes corrupted
- **Timing failures**: Clocks skew beyond bounds

Understanding this distinction is crucial: Raft proves you can build reliable coordination *without* solving the harder Byzantine problem, as long as you trust that nodes either work correctly or detectably fail.

## Failure Mode 1: Leader Crashes

This is Raft's primary failure scenario. The paper describes the recovery process: "If a follower receives no communication over a period of time called the election timeout, then it assumes there is no viable leader and begins an election to choose a new leader" (p. 6).

**The design choice**: Don't try to prevent leader failure or immediately detect it. Instead, use a timeout—after not hearing from the leader for a while, assume it failed.

### Why This Works

1. **No distributed failure detection**: Followers don't coordinate to verify the leader is dead—each independently decides based on local timeout
2. **False positives are safe**: If the leader isn't actually dead (just slow), a new election is wasteful but not dangerous
3. **Recovery is automatic**: The system doesn't need external intervention

**The failure mode of the failure mode**: If network delays consistently exceed election timeout, the system churns through leaders unnecessarily. The paper addresses this: "The election timeout should be a few orders of magnitude less than MTBF so that the system makes steady progress" (p. 10).

**Application to agent systems**: When orchestrating tasks, don't build complex health checks—use timeouts. If a task doesn't complete in expected time, assume failure and retry. False positives (killing slow but working tasks) are acceptable if recovery is cheap.

### The Recovery Mechanism: Leader Election

The paper breaks election into clear steps:
1. Follower detects leader failure via timeout
2. Increments term number and becomes candidate
3. Votes for itself and requests votes from others
4. If it gets majority, becomes leader
5. If someone else becomes leader, reverts to follower
6. If neither (split vote), timeout and retry (p. 6)

**What makes this reliable**:
- **Majority quorum**: Can't have two leaders in same term—both would need majority votes
- **Term numbers**: Later terms override earlier ones—prevents stale leaders
- **Randomized timeouts**: Prevents perpetual split votes

**The lesson**: Recovery mechanisms should be *simpler* than normal operation. Elections are more complex than log replication, but they're rare. Optimize for the common case (leader working) while keeping the failure case (election) correct.

## Failure Mode 2: Follower/Candidate Crashes

The paper notes these are simpler: "Follower and candidate crashes are much simpler to handle than leader crashes, and they are both handled in the same way... Raft handles these failures by retrying indefinitely" (p. 10).

**The design choice**: Don't special-case follower failures. The leader just keeps retrying RPCs until the follower comes back.

### Why This Works

1. **Idempotency**: Raft RPCs are designed to be safely retried (p. 10)
2. **Leader drives replication**: Followers are passive—they can crash and restart without disrupting overall system progress
3. **Majority rule**: System continues as long as majority are available

**Application to agent systems**: 
- **Design operations to be idempotent**: If an agent crashes mid-task, the orchestrator should be able to retry without checking "did this already partially complete?"
- **Majority quorums prevent single points of failure**: Don't require *all* agents to respond—require enough to make progress

### The Idempotency Principle

The paper states: "Raft RPCs are idempotent, so this causes no harm. For example, if a follower receives an AppendEntries request that includes log entries already present in its log, it ignores those entries in the new request" (p. 10).

This is profound: the system handles "crashed mid-operation" and "never received response" identically to "successfully completed"—just retry.

**Implementation pattern**:
```
BAD:  append_entry(entry) → success/failure
GOOD: append_entries(entries[]) → current_log_state
```

The second version can be called repeatedly with the same entries—the server compares against its current state and only applies new entries.

**For task orchestration**: Design task interfaces so the orchestrator can safely call them multiple times:
```
BAD:  process_document(doc) → result
GOOD: process_document(doc, request_id) → result
```

With request_id, the agent can recognize duplicate requests and return the cached result instead of reprocessing.

## Failure Mode 3: Network Partitions

The paper handles partitions through majority quorums: "They are fully functional (available) as long as any majority of the servers are operational and can communicate with each other and with clients" (p. 2).

**The scenario**: 5 servers split into groups of 3 and 2. The group of 3 can elect a leader and continue. The group of 2 cannot—they don't have majority.

### Why This Prevents Split Brain

With 5 servers, majority is 3. Two separate groups can't *both* have 3 members. This mathematically prevents two leaders from operating simultaneously.

**The cost**: The minority partition becomes unavailable. If you're in the group of 2, you can't make progress.

**The alternative**: Allow both partitions to operate independently, then reconcile when partition heals. But the paper explains why Paxos-like systems avoid this: "There is no widely agreed-upon algorithm for multi-Paxos... Systems such as Chubby have implemented Paxos-like algorithms, but in most cases their details have not been published" (p. 2-3).

Reconciliation after independent operation is *hard*. Raft chooses temporary unavailability over inconsistency risk.

**Application to agent systems**:
- **Prefer unavailability to inconsistency**: If agents can't communicate with the orchestrator, they should stop rather than proceeding with stale state
- **Use majority quorums for coordination**: Don't require all agents to agree—require enough that no other set could also reach agreement

### The CAP Theorem Connection

Though the paper doesn't explicitly mention CAP theorem, Raft clearly chooses:
- **Consistency**: Majority partition makes progress with consistent state
- **Partition tolerance**: System continues during partitions
- **Not full availability**: Minority partition cannot serve requests

The paper notes: "In the common case, a command can complete as soon as a majority of the cluster has responded" (p. 2)—making explicit that availability is limited to the majority.

## Failure Mode 4: Partial Failures in Log Replication

Figure 7 (p. 7) shows that follower logs can diverge from the leader's in complex ways: missing entries, extra uncommitted entries, or both.

**The recovery mechanism**: Leader forces followers to duplicate its log. "To bring a follower's log into consistency with its own, the leader must find the latest log entry where the two logs agree, delete any entries in the follower's log after that point, and send the follower all of the leader's entries after that point" (p. 7).

### Why This Is Safe

The Leader Completeness Property (Figure 3, p. 4) guarantees the leader's log contains all committed entries. Therefore, forcing followers to match the leader can't lose committed data—only uncommitted data.

**The mechanism**:
1. Leader tracks nextIndex for each follower (next entry to send)
2. If AppendEntries fails (consistency check fails), decrement nextIndex and retry
3. Eventually reach a point where logs match
4. Send all entries after that point

**The key insight**: Recovery doesn't require complex reconciliation—it's just "find where we agree, then copy from there forward."

**Application to agent orchestration**:
- **Authoritative state**: The orchestrator's task DAG is authoritative—agents synchronize with it, not peer-to-peer
- **Backward scan to agreement**: If agent state diverges, find the last agreed-upon task completion, then replay forward
- **Discard unconfirmed work**: If an agent completed tasks the orchestrator doesn't know about, discard them—they weren't committed

## Failure Mode 5: Timing Failures and Availability

The paper specifies a timing requirement: "broadcastTime ≪ electionTimeout ≪ MTBF" (p. 10).

This means:
- **broadcastTime**: How long to send message to all nodes and get responses
- **electionTimeout**: How long to wait before assuming leader failure
- **MTBF**: Mean time between failures for a single server

**If broadcastTime ≥ electionTimeout**: System becomes unstable—leaders can't send heartbeats fast enough, causing unnecessary elections

**If electionTimeout ≥ MTBF**: System spends most of its time in recovery rather than normal operation

The paper provides concrete ranges: "The broadcast time may range from 0.5ms to 20ms, depending on storage technology. As a result, the election timeout is likely to be somewhere between 10ms and 500ms. Typical server MTBFs are several months or more" (p. 10).

**Application to agent systems**:
- **Measure actual latencies**: Don't guess at timeouts—measure how long operations actually take
- **Set timeouts with headroom**: If average operation takes 100ms, don't set timeout to 105ms—use 500ms or 1s
- **Tune based on failure frequency**: If tasks rarely fail, aggressive timeouts cause unnecessary retries

## The Deep Principle: Fail-Fast vs. Fail-Safe

Raft makes an important design choice: it's fail-fast. The paper states: "They do not depend on timing to ensure the consistency of the logs: faulty clocks and extreme message delays can, at worst, cause availability problems" (p. 2).

**Fail-fast**: If something goes wrong (timing violations, communication failures), the system becomes unavailable rather than returning potentially incorrect results.

**Fail-safe**: System continues operating with degraded functionality or potentially stale data.

Raft chooses fail-fast for consensus (safety over availability) but the paper notes: "However, availability (the ability of the system to respond to clients in a timely manner) must inevitably depend on timing" (p. 10).

**Application**: For agent systems handling critical operations (security audits, financial transactions), fail-fast is appropriate. For best-effort operations (recommendations, optimizations), fail-safe might be better.

## Recovery Design Patterns from Raft

### Pattern 1: Retry with Idempotency
- Make operations safe to retry
- Retry indefinitely until success or definitive failure
- Example: Leader retrying AppendEntries to followers

### Pattern 2: Timeout-Based Failure Detection
- Don't try to perfectly detect failures
- Use timeouts that are "long enough" most of the time
- Accept false positives as acceptable cost
- Example: Election timeout to detect leader failure

### Pattern 3: Authoritative Recovery
- Designate one source of truth (the leader)
- Followers synchronize with leader, not peer-to-peer
- Simple unidirectional recovery
- Example: Follower logs forced to match leader's log

### Pattern 4: Majority Quorums
- Require majority agreement for committed state
- Prevents split-brain without perfect coordination
- Accept minority partition unavailability
- Example: Leader needs majority to commit entries

### Pattern 5: Monotonic Versioning
- Use increasing version numbers (term numbers)
- Later versions automatically supersede earlier ones
- No need to compare complex state
- Example: Server with higher term converts leader to follower

## Testing Failure Recovery

The paper describes extensive testing: "We used our Raft implementation to measure the performance of Raft's leader election algorithm... we repeatedly crashed the leader of a cluster of five servers and timed how long it took to detect the crash and elect a new leader" (p. 15).

**The methodology**:
1. Create worst-case conditions (different log lengths)
2. Synchronize timing to maximize contention
3. Run many trials (1000+)
4. Measure percentiles, not just averages

**Application to agent testing**:
- **Create pathological scenarios**: Don't just test typical failures—test worst cases
- **Measure recovery time distributions**: Know your p50, p95, p99 recovery times
- **Test at scale**: Run hundreds of failure injections to find rare failure modes

## The Profound Lesson: Recovery as Primary Concern

The paper's deepest insight is architectural: **failure recovery isn't added to the system—it IS the system**.

Raft doesn't have a "normal operation" mode with bolted-on failure handling. The core operations (leader election, log replication) *are* the failure recovery mechanisms. The system is always in a state of recovering from the last failure or preparing for the next one.

For agent orchestration: Design the system assuming agents fail frequently. Don't build a perfect orchestrator and then add error handling—build an orchestrator where error handling is the primary logic.

**Concrete example**:
```
BAD approach:
  try:
    result = agent.execute(task)
    return result
  except Failure:
    # Complex recovery logic

GOOD approach:
  while not result:
    result = try_execute_with_timeout(task)
    if not result:
      wait_and_retry()
```

The second version treats failure as the default case—success is just "the retry that worked."