---
license: Apache-2.0
name: runtime-verification-for-agents
description: |
  Compiling formal invariants (TLA+, Alloy, temporal logic) into runtime monitors that continuously audit agent coordination daemons. The Arbiter pattern: a verification agent that smoke-tests live sessions against proven properties and triggers salvage on violation. NOT FOR application performance monitoring (use observability skills), log aggregation, static analysis, or unit testing.
metadata:
  category: Formal Methods & Verification
  tags:
  - runtime-verification
  - formal-methods
  - arbiter
  - agent-coordination
  - monitors
  - invariants
---

# Runtime Verification for Agents

**Version:** 1.0
**Domain:** Formal Methods, Agent Coordination, Runtime Monitoring
**Lineage:** Port Daddy FORMAL_VERIFICATION_PLAN.md, Section 3 (The Arbiter)

## When to Use This Skill

Load this skill when:

- You have formal invariants (TLA+, Alloy, temporal logic) and need to enforce them at runtime
- You are building an agent coordination daemon and need continuous audit
- You are implementing the Arbiter pattern: an independent agent that monitors others
- You need to decide between synchronous checking and sampled checking
- You are debugging false positive cascades in your monitoring layer
- You need to handle the "who watches the watchman" recursion

Do NOT load this skill for:
- **Application performance monitoring** -- use observability/APM skills
- **Log aggregation** -- use ELK/Loki/Datadog skills
- **Static analysis** -- use linting/type-checking skills
- **Unit testing** -- use TDD skills; runtime verification is complementary, not a substitute

## Core Concept: The Arbiter

The Arbiter is an independent agent that continuously audits a coordination
daemon's state transitions against formal invariants. On violation, it
triggers remediation (salvage, flag, or halt).

```
              Formal Spec (TLA+)
                    |
               [Compilation]
                    |
              Runtime Monitor
               /          \
      Synchronous       Sampled
      (per-call)      (periodic)
          |               |
     PASS / VIOLATE   PASS / VIOLATE
          |               |
          +-------+-------+
                  |
           [Decision Tree]
          /       |       \
      Alert  Auto-Remediate  Halt
```

## Decision Tree 1: Choosing Your Checking Strategy

```
Is the invariant safety-critical (data loss, security breach)?
|
+-- YES --> Is the operation latency-sensitive (<5ms budget)?
|           |
|           +-- YES --> Can you check a weaker precondition synchronously?
|           |           |
|           |           +-- YES --> HYBRID: sync precondition + async full check
|           |           +-- NO  --> SYNCHRONOUS (accept the latency hit)
|           |
|           +-- NO  --> SYNCHRONOUS: check on every state transition
|
+-- NO  --> Is the state space small enough to snapshot cheaply?
            |
            +-- YES --> SAMPLED: poll every 1-5 seconds
            +-- NO  --> EVENT-DRIVEN: subscribe to state-change events
```

**Synchronous:** Runs in the hot path. Budget 0.1-2ms per check. Use for
safety-critical invariants where a single violation is unacceptable.

**Sampled:** Runs on a timer. Violations may persist for one interval before
detection. Use for liveness properties or when sync overhead is unacceptable.

**Hybrid:** Cheap precondition sync, full check async. Use when the full
invariant is expensive but a necessary precondition is cheap.

## Decision Tree 2: Alert vs Auto-Remediate vs Halt

```
Violation detected. What is the blast radius?
|
+-- SINGLE SESSION (one agent affected)
|   |
|   +-- Self-healing? (e.g., stale heartbeat -> reaper fixes it)
|   |   +-- YES --> LOG + ALERT (info). Let existing machinery fix it.
|   |   +-- NO  --> AUTO-REMEDIATE: trigger salvage for affected session.
|   |
+-- MULTI-SESSION (systemic violation)
|   |
|   +-- Could this be a false positive from clock skew or snapshot lag?
|       +-- YES --> RETRY with fresh snapshot. If still violated --> escalate.
|       +-- NO  --> HALT new session creation. Alert operator.
|
+-- DAEMON INTEGRITY (monitor detected corruption)
    --> HALT EVERYTHING. Write to append-only audit log.
        Signal operator via out-of-band channel.
```

## Decision Tree 3: Clock Skew False Positives

```
Monitor reports a temporal ordering violation.
|
+-- Using wall-clock time?
|   +-- YES --> Delta within NTP skew tolerance (<100ms)?
|   |           +-- YES --> FALSE POSITIVE. Suppress. Debug log.
|   |           +-- NO  --> Check for NTP step adjustment.
|   |                       NTP step? Suppress + warn. Else: REAL VIOLATION.
|   +-- NO (HLC / Lamport clocks)
|       +-- Logical component monotonic even if physical is not?
|           +-- YES --> FALSE POSITIVE. Suppress.
|           +-- NO  --> REAL VIOLATION. HLC is broken. HALT.
```

## Trace-Checking Algorithms

| Approach | Latency | Memory | Use Case |
|----------|---------|--------|----------|
| **Online (streaming)** | Per-event | O(formula size) | Synchronous monitors |
| **Offline (batch)** | Post-hoc | O(trace length) | Audit, forensics |
| **Bounded online** | Per-event | O(window size) | Sliding-window properties |

For agent coordination, use **bounded online**:
- **Safety invariants** (NoteMonotonicity): O(1) per session, check every transition
- **Liveness invariants** (CrashRecovery): O(active dead agents), bounded window
- **Temporal ordering**: Ring buffer of last N events, O(N)

**Complexity budget** (100 req/s daemon, 10ms p99 target):
- Per-request monitor: 0.5ms (5% of latency budget)
- Background sweep: 10ms every 1s (1% CPU)
- Total overhead target: < 2%

## Worked Example: Compiling NoteMonotonicity

### The Formal Invariant (TLA+)

From the Port Daddy whitepaper:

```tla+
\* SAFETY: Notes never shrink for active sessions
NoteMonotonicity ==
  \A a \in registered :
    sessions[a] # NULL /\ sessions[a].status = "active"
    => Len(sessions'[a].notes) >= Len(sessions[a].notes)
```

For every registered agent with an active session, the note count in the
next state must be >= the current state. Notes are append-only.

### Step 1: Identify Violating Transitions

- `addNote()` -- safe by construction (only increases count)
- `deleteSession()` -- CASCADE destroys notes (violates if session active)
- Direct SQL `DELETE/UPDATE FROM session_notes` -- bypasses API (corruption)

### Step 2: Choose Strategy

Safety-critical + cheap check (integer comparison) = **synchronous**.

### Step 3: Compile to Runtime Monitor

```typescript
function createNoteMonotonicityMonitor(db: Database) {
  const noteCounts = new Map<string, number>();

  function checkAfterAddNote(sessionId: string): Violation | null {
    const row = db.prepare(
      'SELECT COUNT(*) as count FROM session_notes WHERE sessionId = ?'
    ).get(sessionId) as { count: number };
    const previous = noteCounts.get(sessionId) ?? 0;
    noteCounts.set(sessionId, row.count);
    if (row.count < previous) {
      return { invariant: 'NoteMonotonicity', sessionId,
               previousCount: previous, currentCount: row.count,
               timestamp: Date.now(), trigger: 'addNote' };
    }
    return null;
  }

  function sweep(): Violation[] {
    const violations: Violation[] = [];
    const rows = db.prepare(`
      SELECT s.id as sessionId, COUNT(n.id) as noteCount
      FROM sessions s LEFT JOIN session_notes n ON n.sessionId = s.id
      WHERE s.status = 'active' GROUP BY s.id
    `).all() as Array<{ sessionId: string; noteCount: number }>;
    for (const row of rows) {
      const previous = noteCounts.get(row.sessionId) ?? 0;
      if (row.noteCount < previous)
        violations.push({ invariant: 'NoteMonotonicity', sessionId: row.sessionId,
          previousCount: previous, currentCount: row.noteCount,
          timestamp: Date.now(), trigger: 'sweep' });
      noteCounts.set(row.sessionId, row.noteCount);
    }
    return violations;
  }

  function forget(sessionId: string) { noteCounts.delete(sessionId); }
  return { checkAfterAddNote, sweep, forget };
}
```

### Step 4: Wire Into the Daemon

```typescript
// In sessions.ts -- after INSERT, before return:
const violation = monitor.checkAfterAddNote(sessionId);
if (violation) arbiter.onViolation(violation);

// In server.ts -- background sweep every 5s:
setInterval(() => {
  for (const v of monitor.sweep()) arbiter.onViolation(v);
}, 5000);
```

### Step 5: Remediation Handler

```typescript
function onViolation(v: Violation) {
  auditLog.append({ type: 'INVARIANT_VIOLATION', ...v });
  const session = sessions.get(v.sessionId);
  if (session?.session?.agentId)
    resurrection.enqueue(session.session.agentId, {
      reason: `Arbiter: ${v.invariant} violated`, evidence: v });
  messaging.publish('arbiter-violations', JSON.stringify(v));
  webhooks.fire('arbiter.violation', v);
}
```

### Step 6: Verify the Monitor

**Quality gate:** 100% of injected violations caught, < 2% CPU overhead.

```typescript
// Injection test: direct DELETE bypassing API
db.prepare('DELETE FROM session_notes WHERE sessionId = ?').run(sessionId);
const violations = monitor.sweep();
expect(violations).toHaveLength(1);
expect(violations[0].currentCount).toBeLessThan(violations[0].previousCount);

// Overhead test: <0.5ms per check
const start = performance.now();
for (let i = 0; i < 10_000; i++) monitor.checkAfterAddNote(sessionId);
expect((performance.now() - start) / 10_000).toBeLessThan(0.5);
```

## Failure Modes

### Failure Mode 1: Monitoring Overhead Kills Throughput

**Symptom:** p99 latency spikes after enabling synchronous monitors.

**Root cause:** Checks too expensive for the hot path -- multi-table JOINs,
full table scans, or checking all-session invariants per single-session op.

**Detection:** Track `check_duration_ms` per invariant. Alert if >1ms average.

**Remediation:**
```
Is the slow check safety-critical?
+-- YES --> Cache/precompute state (e.g., in-memory count map, not COUNT(*))
|           If still slow --> HYBRID: cheap sync + expensive async
+-- NO  --> Move to SAMPLED. Accept detection delay.
```

**Prevention:** Budget 0.5ms/sync check. Precompute state. No full scans in sync path.

### Failure Mode 2: False Positive Cascades

**Symptom:** Arbiter triggers salvage on healthy sessions. Death spiral where
remediation triggers further false violations.

**Root causes:**
1. **Clock skew:** Wall-clock goes backward after NTP adjustment
2. **Snapshot inconsistency:** Monitor reads mid-transaction
3. **Stale monitor state:** Cache diverges from DB after crash recovery

**Detection:** Track false positive rate. If >5% of violations not reproducible
on re-check, your monitor has a consistency bug.

**Remediation:**
```
+-- Clock skew     --> Use HLC. Suppress violations where delta < NTP_TOLERANCE.
+-- Snapshot       --> Check after transaction commits, not during.
+-- Stale state    --> Resync from DB on startup, after crashes, and every 60s.
```

**Prevention:** Always double-check before remediating. Single-check triggers
re-check; only double-confirmed triggers salvage.

### Failure Mode 3: The Watchman Crashes (Quis Custodiet)

**Symptom:** Arbiter dies/hangs. No invariants checked. Violations accumulate
silently. System believes it is monitored when it is not.

**Root causes:**
1. Unhandled exception in monitor code (malformed input -> SQL error)
2. Unbounded state growth (tracking every session ever, not just active)
3. Deadlock (monitor lock conflicts with daemon write path)

**Detection:**
- **Heartbeat canary:** Arbiter publishes heartbeat every N seconds; daemon
  alerts if no heartbeat within 2N seconds
- **Self-check invariant:** "I am running" is always the first check

**Remediation:**
```
Heartbeat missed.
+-- PID alive?
|   +-- YES --> Hung. SIGTERM, wait 5s, SIGKILL. Restart + resync.
|   +-- NO  --> Crashed. Restart immediately. Check crash log.
+-- After restart: full sweep immediately.
+-- 3+ crashes in 10 min: HALT new sessions. Alert operator.
    Do NOT keep restarting -- fix the bug first.
```

**Prevention:** try/catch every check. Bound state with LRU. Separate DB
connection (WAL mode). Meta-monitor must be trivially simple -- just a
`setInterval` checking a timestamp. Complex meta-monitors create infinite regression.

## Anti-Patterns

**1. Checking Everything Synchronously.** Partition by criticality: safety-critical
gets sync, liveness gets sampled, statistical gets offline batch.

**2. Monitors That Mutate State.** Monitors observe and report. Remediation is
separate. A monitor that "fixes" violations is a participant, not an observer --
it introduces its own bugs and triggers other monitors.

**3. Unbounded Monitor State.** Track only active sessions. `forget()` on end.
Hard cap with LRU eviction. Cold-start from DB if needed.

**4. Alert Fatigue.** Severity tiers + suppression policies. Low-severity
accumulates into hourly digests. Only high-severity triggers immediate alerts.

**5. Happy-Path-Only Testing.** Every monitor needs injection tests: direct SQL
bypassing API, concurrent races, clock manipulation, simulated crash recovery.

## Quality Gates

| Gate | Criterion | Verification |
|------|-----------|-------------|
| Correctness | 100% of injected violations caught | >= 10 injection scenarios |
| No false positives | Zero on 24h clean run | Load test against healthy daemon |
| Overhead | < 2% CPU, < 0.5ms/sync check | Benchmark with/without monitor |
| Crash resilience | Recovers from own crash | Kill mid-sweep, verify resync |
| State bounded | Memory O(active sessions) | 24h churn test, measure RSS |
| Watchman health | Canary detects death within 2x interval | Kill monitor, verify alert |

## Compiling Any TLA+ Safety Invariant

1. **Identify state variables** referenced by the invariant
2. **Identify actions** that can modify those variables
3. **Per action**, determine if sync check is feasible (< 0.5ms)
4. **Compile** into `(previous, current) -> Violation | null`
5. **Wire** into action path (sync) or background sweep (sampled)
6. **Define remediation**: log, alert, salvage, or halt
7. **Write injection tests** that bypass the API
8. **Measure overhead** against quality gates

### Port Daddy Invariant Reference

| Invariant | Strategy | State | Remediation |
|-----------|----------|-------|-------------|
| NoteMonotonicity | Sync + sweep | noteCount/session | Salvage |
| EscrowInvariant | Sync (per Begin) | escrow/session | Reject Begin |
| CrashRecovery | Sampled (5s) | dead agent times | Trigger reaper |
| HeartbeatFreshness | Sampled (10s) | heartbeat/agent | Mark stale/dead |
| FileClaimConsistency | Sync (per claim) | claims/file | Alert on conflict |

## The Arbiter as a Port Daddy Agent

The Arbiter registers as an agent, sends heartbeats, and writes violation
notes. If it crashes, the reaper detects it and enqueues it for salvage:

```bash
pd agent register --agent arbiter-001 \
  --identity myproject:arbiter:main --purpose "Invariant monitoring"
pd begin --agent arbiter-001 --purpose "Monitoring against formal invariants"
```

The recursion terminates because the reaper is a simple timer with no
invariant checks of its own -- the ground truth that must be correct by
inspection, not by monitoring.
