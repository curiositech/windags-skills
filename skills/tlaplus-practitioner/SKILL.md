---
license: Apache-2.0
name: tlaplus-practitioner
description: 'You MUST use this skill when writing, running, or verifying TLA+ specifications for distributed systems, coordination protocols, or state machine designs. This skill is opinionated and prescriptive — it will push you toward bounded model checking with TLC, concrete worked examples, and measurable quality gates. NOT FOR: general formal methods theory, Coq/Lean/Isabelle proof assistants, SPIN/Promela model checking, or theorem proving without explicit state machines.'
---

# TLA+ Practitioner

## When to Use This Skill

IF the task involves any of these THEN apply this skill:
- Advisory locks with TTL and owner semantics
- Agent lifecycle: register, heartbeat, crash, reap, salvage
- Escrow or bonded state machines (hold, release, forfeit)
- Distributed coordination with crash recovery
- Safety properties ("bad thing never happens")
- Liveness properties ("good thing eventually happens")

IF the task is purely about type systems, proof assistants, or model checking
without state machines THEN stop -- this skill does not apply.

## Decision Tree: What Kind of Spec Do You Need?

```
Is there shared mutable state accessed by multiple agents?
  YES --> Does the state have a TTL or expiration?
  |         YES --> Advisory Lock Pattern (Section 1)
  |         NO  --> Does an agent crash leave orphaned state?
  |                   YES --> Crash-Reap-Salvage Pattern (Section 2)
  |                   NO  --> Escrow State Machine Pattern (Section 3)
  NO --> You probably don't need TLA+. Use unit tests.
```

## Section 1: Advisory Locks with TTL

IF you have a lock with an owner, a TTL, and multiple agents competing THEN verify:
- **Safety**: No two agents hold the same lock simultaneously
- **Liveness**: A crashed holder's lock eventually expires and is acquirable

Key actions: `Acquire(a,l)`, `Release(a,l)`, `Crash(a)`, `Tick`.
Key invariant: `MutualExclusion`. Key liveness: `LockEventuallyFrees` with `WF_vars(Tick)`.
See BondedCommons (Section 4) for a full worked example combining locks + crash recovery.

## Section 2: Crash-Reap-Salvage Lifecycle

IF your system has agents that register, heartbeat, crash silently, get reaped,
and have work salvaged by another agent THEN verify:
- **Safety**: A reaped agent's work is claimed by at most one salvager
- **Safety**: No agent is reaped while still alive (heartbeating)
- **Liveness**: Dead agents eventually enter the salvage queue

Port Daddy mapping:

| TLA+ Concept       | Port Daddy Implementation              |
|---------------------|----------------------------------------|
| `heartbeat[a]`      | `agents.last_heartbeat` column         |
| `status = "stale"`  | `60% of DEAD_THRESHOLDS[status]`       |
| `status = "dead"`   | `DEAD_THRESHOLDS[status]` exceeded     |
| `salvageClaims`     | `resurrection_queue.status = "claimed"` |
| `SingleClaimer`     | `UNIQUE(agent_id)` on resurrection_queue|

## Section 3: Escrow State Machines

IF your system holds a resource in escrow with transitions like:
- `open -> bonded -> released` (happy path)
- `open -> bonded -> forfeited` (violation path)
- `open -> expired` (timeout path)

THEN verify:
- **Safety**: A forfeited bond cannot be released (no double-spend)
- **Safety**: Total value is conserved across transitions
- **Liveness**: Every bond eventually reaches a terminal state

## Section 4: Worked Example -- BondedCommons (Port Daddy)

Port Daddy agents claim ports (advisory locks). Each claim is bonded: the agent
promises to heartbeat. If the agent crashes, the reaper detects missed heartbeats,
marks the agent dead, releases its ports, and enters it into a salvage queue.
Another agent can claim the salvaged work.

The invariant: no port is ever assigned to two live agents simultaneously.

```tla
---- MODULE BondedCommons ----
EXTENDS Integers, FiniteSets, TLC

CONSTANTS
    Agents,         \* e.g., {"a1", "a2", "a3"}
    Ports,          \* e.g., {9001, 9002}
    MaxTTL,         \* e.g., 5
    DeadThreshold   \* e.g., 3

VARIABLES
    portOwner,      \* [Ports -> Agents \cup {""}]
    heartbeat,      \* [Agents -> 0..MaxTTL]
    agentStatus,    \* [Agents -> {"alive", "stale", "dead", "salvaged"}]
    salvageQueue,   \* SUBSET Agents
    clock

vars == <<portOwner, heartbeat, agentStatus, salvageQueue, clock>>

TypeOK ==
    /\ portOwner \in [Ports -> Agents \cup {""}]
    /\ heartbeat \in [Agents -> 0..MaxTTL]
    /\ agentStatus \in [Agents -> {"alive", "stale", "dead", "salvaged"}]
    /\ salvageQueue \subseteq Agents
    /\ clock \in 0..MaxTTL

Init ==
    /\ portOwner = [p \in Ports |-> ""]
    /\ heartbeat = [a \in Agents |-> 0]
    /\ agentStatus = [a \in Agents |-> "alive"]
    /\ salvageQueue = {}
    /\ clock = 0

ClaimPort(a, p) ==
    /\ agentStatus[a] = "alive"
    /\ portOwner[p] = ""
    /\ portOwner' = [portOwner EXCEPT ![p] = a]
    /\ heartbeat' = [heartbeat EXCEPT ![a] = clock]
    /\ UNCHANGED <<agentStatus, salvageQueue, clock>>

Heartbeat(a) ==
    /\ agentStatus[a] = "alive"
    /\ heartbeat' = [heartbeat EXCEPT ![a] = clock]
    /\ UNCHANGED <<portOwner, agentStatus, salvageQueue, clock>>

ReleasePort(a, p) ==
    /\ agentStatus[a] = "alive"
    /\ portOwner[p] = a
    /\ portOwner' = [portOwner EXCEPT ![p] = ""]
    /\ UNCHANGED <<heartbeat, agentStatus, salvageQueue, clock>>

Crash(a) ==
    /\ agentStatus[a] = "alive"
    /\ agentStatus' = [agentStatus EXCEPT ![a] = "stale"]
    /\ UNCHANGED <<portOwner, heartbeat, salvageQueue, clock>>

Reap(a) ==
    /\ agentStatus[a] = "stale"
    /\ clock - heartbeat[a] >= DeadThreshold
    /\ agentStatus' = [agentStatus EXCEPT ![a] = "dead"]
    /\ salvageQueue' = salvageQueue \cup {a}
    /\ portOwner' = [p \in Ports |->
        IF portOwner[p] = a THEN "" ELSE portOwner[p]]
    /\ UNCHANGED <<heartbeat, clock>>

Salvage(claimer, dead) ==
    /\ agentStatus[claimer] = "alive"
    /\ dead \in salvageQueue
    /\ agentStatus[dead] = "dead"
    /\ agentStatus' = [agentStatus EXCEPT ![dead] = "salvaged"]
    /\ salvageQueue' = salvageQueue \ {dead}
    /\ UNCHANGED <<portOwner, heartbeat, clock>>

Tick ==
    /\ clock < MaxTTL
    /\ clock' = clock + 1
    /\ UNCHANGED <<portOwner, heartbeat, agentStatus, salvageQueue>>

Next ==
    \/ \E a \in Agents, p \in Ports : ClaimPort(a, p)
    \/ \E a \in Agents : Heartbeat(a)
    \/ \E a \in Agents, p \in Ports : ReleasePort(a, p)
    \/ \E a \in Agents : Crash(a)
    \/ \E a \in Agents : Reap(a)
    \/ \E a1, a2 \in Agents : a1 /= a2 /\ Salvage(a1, a2)
    \/ Tick

\* ---- INVARIANTS (Safety) ----
NoDoubleClaim ==
    \A p \in Ports :
        portOwner[p] /= "" => agentStatus[portOwner[p]] \in {"alive", "stale"}

DeadOwnsNothing ==
    \A a \in Agents :
        agentStatus[a] \in {"dead", "salvaged"} =>
            \A p \in Ports : portOwner[p] /= a

\* ---- TEMPORAL PROPERTIES (Liveness) ----
StaleEventuallyReaped ==
    \A a \in Agents :
        (agentStatus[a] = "stale") ~> (agentStatus[a] = "dead")

Spec == Init /\ [][Next]_vars /\ WF_vars(Tick)
====
```

### Running BondedCommons

```bash
# BondedCommons.cfg
cat > BondedCommons.cfg << 'EOF'
CONSTANTS
    Agents = {"a1", "a2", "a3"}
    Ports = {9001, 9002}
    MaxTTL = 5
    DeadThreshold = 2
INIT Init
NEXT Next
INVARIANTS
    TypeOK
    NoDoubleClaim
    DeadOwnsNothing
PROPERTIES
    StaleEventuallyReaped
EOF

java -cp tla2tools.jar tlc2.TLC BondedCommons -workers auto
```

### Quality Gate

You are done when TLC explored >1M distinct states with zero violations, you
tested with at least 3 agents and 2 resources, and you intentionally weakened
an invariant and confirmed TLC catches it.

## Running TLC: Decision Tree

```
Safety only?  --> INVARIANTS in .cfg, no fairness needed
Liveness too? --> PROPERTIES in .cfg + Spec with WF/SF fairness
Deadlock only? --> tlc2.TLC Spec -deadlock -workers auto
```

### Bounding Parameters

| Parameter  | Start Small | Medium | Production |
|------------|-------------|--------|------------|
| Agents     | 2           | 3      | 4          |
| Resources  | 1           | 2      | 3          |
| MaxTTL     | 3           | 5      | 8          |
| States     | ~10K        | ~500K  | >1M        |

IF TLC runs >10 min THEN reduce MaxTTL first (exponential), resources second,
agents last (need >= 2 for concurrency bugs).

## Interpreting Counterexamples

```
INVARIANT violation?
  YES --> TypeOK false? --> Actions produce out-of-range values. Tighten guards.
          Domain invariant false? --> Race condition in Acquire/Claim. Strengthen guard.
PROPERTY violation?
  YES --> Lasso trace ("back to state N"). System loops without progress.
          Fix: add WF_vars(Action) or SF_vars(Action) fairness.
DEADLOCK?
  YES --> No Next action enabled. Add stuttering step or use -deadlock flag.
```

## Failure Modes

### FM1: State Space Explosion (OutOfMemoryError)

**Symptom**: Billions of states within seconds. **Diagnosis**: Unbounded types.
**Fix**: Use `0..MaxVal` not `Nat`. Add symmetry: `Symmetry == Permutations(Agents)`.

### FM2: Liveness Fails Despite Correct Logic

**Symptom**: Lasso counterexample where everything "looks right."
**Diagnosis**: Missing fairness. TLC considers traces where enabled actions never fire.
**Fix**: `Spec == Init /\ [][Next]_vars /\ WF_vars(Tick) /\ WF_vars(\E a \in Agents : Reap(a))`
Use WF first. SF only when enabling condition flickers on/off.

### FM3: Invariant Violation on a "Correct" State

**Symptom**: TLC flags violation but state looks fine visually.
**Diagnosis**: TypeOK too narrow, or you split an atomic action into two steps exposing
an intermediate state. TLA+ actions are atomic -- if two variables must update together,
they belong in one action.

### FM4: Unexpected Deadlock

**Symptom**: No `Next` action enabled. **Diagnosis**: Clock hit MaxTTL and all agents
are terminal. **Fix**: Add `Done == (\A a \in Agents : agentStatus[a] \in {"dead", "salvaged"}) /\ UNCHANGED vars` or use `-deadlock` flag.

## Anti-Patterns (Novice vs Expert)

**Modeling implementation details** -- Novice writes SQL schemas in TLA+. Expert
models state transitions: `portOwner \in [Ports -> Agents]`, not table DDL.

**One giant Next action** -- Novice puts everything in one disjunction. Expert
decomposes into named actions (ClaimPort, Crash, Reap) so counterexamples are readable.

**Skipping TypeOK** -- Novice omits type invariant, gets mysterious counterexamples.
Expert writes TypeOK first; it catches 80% of spec bugs. It is the TLA+ equivalent
of TypeScript types.

**Unbounded model checking** -- Novice uses `Nat` or `Seq(S)` without bounds. TLC
chokes. Expert bounds everything: `0..MaxN`, `Len(seq) <= MaxLen`.

**Specs after the code ships** -- Novice verifies post-hoc. Expert writes specs during
design when uncertainty is highest. The best time to write BondedCommons is before
implementing the reaper.

## Safety vs Liveness Quick Reference

| Type     | TLA+ Keyword | Meaning                          | Needs Fairness? |
|----------|-------------|----------------------------------|-----------------|
| Safety   | `INVARIANT` | Bad thing never happens          | No              |
| Liveness | `PROPERTY`  | Good thing eventually happens    | Yes (WF/SF)     |

IF safety only THEN use INVARIANTS, skip fairness. Simpler and faster.
IF liveness THEN use `~>`, `<>`, or `[]<>` operators and declare fairness in Spec.

## Quality Gates Checklist

- [ ] TypeOK passes as invariant
- [ ] At least one domain safety invariant passes
- [ ] TLC explored >1M states with 0 violations
- [ ] Tested with >= 3 agents (2 is insufficient for many coordination bugs)
- [ ] Intentionally broke an invariant, confirmed TLC catches it
- [ ] Liveness properties verified with declared fairness (if applicable)
- [ ] .cfg committed alongside .tla
- [ ] Constants documented with bound rationale

## File Organization

```
specs/
  BondedCommons.tla    # Specification
  BondedCommons.cfg    # TLC config (constants, invariants, properties)
  BondedCommons.md     # Human explanation + counterexample guide
```

Always keep `.tla` and `.cfg` together. The `.cfg` is not optional.
