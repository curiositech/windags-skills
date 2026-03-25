# Multi-Timeline Preprocessing: Handling Concurrency Through State Augmentation

## The Challenge: Temporal Planning Without Temporal Reasoning

SHOP2's operators are fundamentally non-temporal: each operator represents an instantaneous state transition. As the authors note: "SHOP2's operators are at least as expressive as Level 2 actions in PDDL, but SHOP2 does not explicitly support the durative actions in Level 3 of PDDL, nor does SHOP2 have an explicit mechanism for reasoning about durative and concurrent actions" (p. 390).

Yet SHOP2 needed to compete in temporal planning domains where actions have durations and can execute concurrently. How do you handle temporal reasoning without temporal logic?

The solution is **Multi-Timeline Preprocessing (MTP)**: a technique for encoding temporal information within non-temporal state representations. The key insight: **instead of one global time, maintain many local times—one for each dynamic property in the world**.

## The Core Idea: Read-Times and Write-Times

For each property P that changes over time (e.g., the location of a plane, the fuel level of a vehicle), MTP maintains two timestamps in the current state:

- **write-time(P)**: The last time any action modified P's value
- **read-time(P)**: The last time any action's precondition depended on P's value

These timestamps enable reasoning about temporal dependencies:

**Two actions can execute concurrently if and only if they don't conflict**. A conflict occurs when:
- One action writes property P while another reads P, OR
- One action writes property P while another writes P

The timestamps let SHOP2 detect these conflicts. An action A can start at time T only if:
- T ≥ write-time(P) for all properties P that A reads
- T ≥ read-time(P) for all properties P that A writes

## The MTP Algorithm

Figure 10 presents MTP as a preprocessing transformation applied to PDDL operators. For each operator o:

1. **Add temporal parameters**: Add ?start (when action begins) and ?duration (how long it takes)

2. **Compute duration**: In the precondition, add an assignment computing ?duration based on the action's parameters. Example: refueling duration = (capacity - current_fuel) / refuel_rate

3. **Compute start time**: In the precondition, compute ?start as the maximum of:
   - write-time(P) for all dynamic properties P in the precondition  
   - read-time(P) for all dynamic properties P in the effects
   
   This ensures the action doesn't start before it's safe to do so.

4. **Update write-times**: For each property P modified by the action, add an effect: write-time(P) := ?start + ?duration. This records when P was last modified.

5. **Update read-times**: For each property P accessed by the action (whether in precondition or effects), add an effect: read-time(P) := max(read-time(P), ?start + ?duration). This records when P was last accessed.

## Example: The Refuel Operator

Figure 11 shows a complete MTP-transformed operator for refueling. Let's analyze it:

```lisp
(:operator (!refuel ?plane ?city ?start ?duration)
  ; Preconditions
  ((aircraft ?plane)
   (city ?city)
   (at ?plane ?city)
   (fuel ?plane ?fuel-level)
   (capacity ?plane ?fuel-cap)
   (refuel-rate ?plane ?rate)
   ; Compute duration
   (assign ?duration (/ (- ?fuel-cap ?fuel-level) ?rate))
   ; Get timestamps for fuel (property being written)
   (write-time fuel ?plane ?t1)
   (read-time fuel ?plane ?t3)
   ; Get timestamps for location (property being read)
   (write-time at ?plane ?t2)
   (read-time at ?plane ?t4)
   ; Compute earliest start time
   (assign ?start (eval (max ?t1 ?t2 ?t3)))
   (assign ?end (eval (+ ?start ?duration)))
   ; Update location's read-time (refuel depends on location)
   (assign ?new-value (eval (max ?t4 ?end))))
```

The refuel action:
- **Reads** the plane's location (must be at ?city)
- **Writes** the plane's fuel level (changes it to ?fuel-cap)

Therefore:
- ?start must be ≥ max(?t1, ?t2, ?t3) where:
  - ?t1 = write-time(fuel) — can't start before last fuel modification
  - ?t2 = write-time(location) — can't start before last location change
  - ?t3 = read-time(fuel) — can't start before last action that depended on fuel

The effects update timestamps:
```lisp
; Delete old values
((fuel ?plane ?fuel-level)
 (write-time fuel ?plane ?t1)
 (read-time fuel ?plane ?t3)
 (read-time at ?plane ?t4))
; Add new values
((fuel ?plane ?fuel-cap)
 (write-time fuel ?plane ?end)
 (read-time fuel ?plane ?end)
 (read-time at ?plane ?new-value))
```

Notice: write-time(fuel) becomes ?end (the time refueling finishes), and read-time(at) becomes max(?t4, ?end) (updating the access time for location).

## Enabling Concurrency

The refuel operator can execute concurrently with other actions if those actions don't create conflicts. Consider:

**Concurrent with refueling**:
- Another plane's actions (different ?plane, so different properties)
- Loading passengers onto this plane (depends on location, not fuel, so no write conflict on fuel)

**Not concurrent with refueling**:
- Flying this plane (reads location AND writes location, conflicting with refuel's read of location)
- Another refuel on the same plane (both write fuel)
- Boarding that depends on fuel level (reads fuel while refuel writes fuel)

The paper explains: "a boarding operator and a fly operator on the same plane may not overlap, because the boarding operator requires that the plane be located in a particular city and the fly operator changes the location of the plane" (p. 391).

But refueling CAN overlap with boarding because: refuel reads location but doesn't write it, and boarding reads location but doesn't write it, and neither reads nor writes the other's properties (fuel vs. passenger list).

## Partial-Order Plans from Totally-Ordered Execution

A subtle point: SHOP2 still plans in execution order (totally ordered), but the timestamps encode a partial-order plan.

When SHOP2 adds action A at simulation time T, it computes A's actual start time based on timestamps. If A's computed start time is earlier than T, it means A can start while other actions are still running—creating concurrent execution.

The sequence of actions in SHOP2's plan is totally ordered (A is added before B), but their execution times may overlap (A.start < B.start < A.end), resulting in a partially-ordered plan.

Example: 
1. SHOP2 adds refuel(plane1) at simulation time T=0, which computes start=0, duration=10, end=10
2. SHOP2 adds board(person1, plane1) at simulation time T=0, which computes start=0, duration=1, end=1
3. The plan execution: refuel and board both start at T=0, board finishes at T=1, refuel finishes at T=10

SHOP2 added board after refuel (totally ordered planning), but they execute concurrently (partially ordered execution).

## Boundary Conditions and Limitations

**Expressiveness**: MTP can represent any temporal plan where actions have durations and preconditions/effects are instantaneous (PDDL Level 3). It cannot represent:
- Actions with continuous effects (resource consumption over time)
- Actions with preconditions that must hold throughout execution (over-all constraints)
- Explicit synchronization constraints beyond read/write dependencies

**Scalability**: Every property gets two timestamps, doubling state size. In large state spaces, this overhead could be significant. The paper doesn't discuss performance implications.

**Optimality**: MTP computes valid start times (ensuring safety), but not necessarily optimal ones. An action starts "as soon as possible given dependencies," but this greedy scheduling may not minimize total makespan. The sort-by construct can help guide toward better schedules.

**Manual Transformation**: The paper notes: "In principle, MTP could be automated—but in practice, we have always done it by hand, because it only needs to be done once for each planning domain" (p. 390). This suggests MTP is somewhat labor-intensive and error-prone, though straightforward for someone who understands the technique.

## Application to Agent Systems

For WinDAG orchestration with concurrent agents:

**Task-Level Timestamps**: Maintain timestamps for each task's inputs and outputs:
```python
class TaskState:
    outputs: Dict[str, Any]  # Task outputs
    output_write_times: Dict[str, float]  # When each output last changed
    input_read_times: Dict[str, float]  # When each input was last read
```

**Dependency Tracking**: When agent A produces output X and agent B consumes X:
- Update output_write_times[X] when A finishes
- Check output_write_times[X] when B starts (B can't start until X is written)
- Update input_read_times[X] when B starts (for tracking what depends on X)

**Concurrent Execution**: Two tasks can run concurrently if:
```python
def can_run_concurrently(task_a, task_b):
    # Check for write-write conflicts
    if task_a.outputs.keys() & task_b.outputs.keys():
        return False
    # Check for read-write conflicts
    if task_a.outputs.keys() & task_b.inputs.keys():
        return False
    if task_b.outputs.keys() & task_a.inputs.keys():
        return False
    return True
```

**Pipeline Parallelism**: In code generation workflows:
- Generate schema (writes: schema.json)
- Generate API handlers (reads: schema.json, writes: handlers.ts)
- Generate tests (reads: schema.json, handlers.ts, writes: tests.ts)
- Generate docs (reads: schema.json, handlers.ts, writes: docs.md)

The orchestrator can identify that tests and docs can run concurrently (both read schema and handlers, neither writes what the other reads), even though all tasks depend on schema.

**Resource Contention**: Extend MTP to handle resources:
```python
# A resource is "written" when acquired, "read" when its availability is checked
resource_write_times = {}  # When resource was acquired
resource_read_times = {}   # When resource availability was checked

def can_acquire_resource(resource, current_time):
    return current_time >= resource_write_times.get(resource, 0)
```

## The Profound Insight: State Augmentation as Mechanism Extension

MTP demonstrates a powerful meta-pattern: **You can extend a formalism's expressiveness by augmenting what you represent in states**, rather than modifying the reasoning mechanism.

SHOP2's planning algorithm didn't change to handle temporal domains. The algorithm still does state-based forward planning with methods and operators. But by augmenting states with temporal metadata (timestamps), the same planning mechanism gains temporal reasoning capabilities.

This pattern appears throughout computer science:
- **Type systems**: Augment values with type metadata; same runtime mechanism handles typed and untyped code
- **Garbage collection**: Augment memory blocks with reachability metadata; same allocation mechanism handles automatic memory management
- **Database transactions**: Augment records with version/timestamp metadata; same storage mechanism handles ACID properties

For agent systems: Rather than building specialized orchestration mechanisms for every new requirement (temporal planning, resource management, cost optimization, fault tolerance), consider **augmenting the state representation** with appropriate metadata and letting existing mechanisms handle the augmented state.

This is more maintainable than proliferating specialized mechanisms, and often more efficient because the core mechanisms remain simple and fast.

## Key Takeaway: Timestamps as a Universal Coordination Mechanism

The deepest lesson from MTP: **Timestamps are a universal mechanism for reasoning about dependencies and enabling concurrency**.

In distributed systems, this is Lamport timestamps and vector clocks. In databases, this is MVCC (Multi-Version Concurrency Control). In MTP, this is read-times and write-times for each property.

The common thread: By making time explicit in state representations, you can reason about what can safely happen when, without complex global synchronization.

For agent orchestration: Don't try to build a centralized scheduler that understands all dependencies. Instead, give each task/skill a timestamp interface:
- What are my input dependencies? (What do I read?)
- What are my output effects? (What do I write?)
- When were my dependencies last modified? (Read-times)
- When will my outputs be available? (Write-times)

The orchestrator uses these timestamps to detect conflicts and enable parallelism, without understanding the semantic content of dependencies. This scales far better than centralized reasoning about all possible interactions.