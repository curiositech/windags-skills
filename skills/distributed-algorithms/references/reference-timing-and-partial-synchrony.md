# Timing and Partial Synchrony: When Real Time Enters the Picture

## The Three Timing Models

Lynch organizes distributed systems along a timing spectrum:

**Synchronous**: "Processors execute in lock-step rounds. This is the simplest model to describe, to program, and to reason about." All processes take steps simultaneously; all messages are delivered before the next round. No real timing required—only logical round numbers.

**Asynchronous**: "Processors take steps in an arbitrary order, at arbitrary relative speeds. It is harder to program than the synchronous model because of the extra uncertainty." No timing assumptions at all. Algorithms must work regardless of step ordering or message delays. "Algorithms designed for the asynchronous model are general and portable."

**Partially synchronous**: "The most realistic, but they are also the most difficult to program. Algorithms designed using knowledge of the timing of events can be efficient, but they can also be fragile in that they will not run correctly if the timing assumptions are violated."

The choice of timing model is not primarily a theoretical abstraction—it is an engineering commitment. Every algorithm that uses timeouts, heartbeats, or bounded message delivery implicitly operates in a partially synchronous model. Making this explicit forces you to state the bounds, verify that your infrastructure can maintain them, and prove that your algorithm is correct (or fails gracefully) when they are violated.

## The Formal Timed Models

### MMT (Minimum-Maximum-Time) Automata

A boundmap assigns `[lower(C), upper(C)]` to each task C:
- `lower(C)`: minimum time between when task C becomes enabled and when an action in C fires
- `upper(C)`: maximum time (task must fire within this time of becoming enabled, unless it becomes disabled first)

Constraints: `0 < lower(C) ≤ upper(C) < ∞`

An execution is **admissible** if:
- Time is unbounded (no Zeno behavior: infinitely many actions in finite time)
- Finite executions terminate only when no task is enabled

The admissibility condition prevents two pathologies: (1) infinite action sequences in finite time, and (2) algorithms that stop arbitrarily before completing. Both would be physically unrealizable.

**Example—Channel Automaton** (Example 23.1.1):
Task `rec` with `lower(rec) = 0`, `upper(rec) = d`. The oldest message in the queue must be delivered within d time units. This models a reliable network channel with bounded delivery time.

Admissible executions: Any sequence where deliveries occur within d of arrival.
Non-admissible: Deliveries after d, or finite traces with pending messages.

**Example—Timeout Automaton** (Example 23.1.2):
Task `step` with `[l₁, l₂]` and task `timeout` with `[0, l]`. Process counts k steps, then fires timeout. In admissible execution, timeout occurs in interval `[kl₁, kl₂ + l]`.

The uncertainty in timeout time is `k(l₂ - l₁) + l`. As k grows (more steps counted), uncertainty grows proportionally. This is the "stretching" phenomenon.

### GTA (General Timed Automata)

More expressive than MMT: includes `now` (current absolute time) and `first(C)`, `last(C)` (deadline bounds) directly in the state. Time-passage actions `v(t)` advance `now` by t, subject to the constraint that no task's deadline is violated.

The transformation **gen(A,b)** converts any MMT automaton to GTA: "Theorem 23.4: If (A,b) is any MMT timed automaton, then gen(A,b) is a general timed automaton. Moreover, attraces(A,b) = attraces(gen(A,b))."

**What gen adds to state**:
- `now`: current time
- For each task C: `first(C)` (earliest time to fire), `last(C)` (deadline)

**Preconditions on time-passage**: Cannot advance time past any enabled task's deadline.
**Preconditions on task fires**: Cannot fire task C before `now ≥ first(C)`.

**Why GTA is more expressive**: MMT can only bound the oldest message in a queue (one bound for the entire queue). GTA can store per-message deadlines in state: each queue entry carries its own (message, deadline) pair. This enables per-message SLAs that MMT cannot express (Example 23.2.2).

**Why GTA can be pathological**: Example 23.2.3 shows a GTA with no admissible executions. Process sends infinitely with send intervals approaching 0, creating Zeno behavior where no admissible execution exists. MMT avoids this by requiring uniform lower bounds on tasks. GTA's extra expressiveness comes with this risk.

## The L Parameter: Quantifying Timing Uncertainty

Define **L = l₂/l₁** = ratio of maximum step time to minimum step time. L = 1 means deterministic timing; L > 1 introduces uncertainty.

**The stretching phenomenon**: "In order to be sure that a certain amount of real time, say t, has elapsed, a process counts its own steps, and it must count enough steps so that even if the steps take the smallest amount of time possible, real time t must have elapsed; thus, the number of steps must be at least t/l₁. But these steps could in fact take the largest amount of time possible, l₂, for a total real time of at least (t/l₁)l₂ = Lt."

Concretely: to wait for time t using step counting, you need to count t/l₁ steps. But those steps take time l₂ each, so you actually wait time L·t. The real wait is L times the intended wait.

**This is not an algorithm flaw—it is a fundamental property of counting under uncertainty.** Any algorithm that uses step counting to measure real time will experience the L factor. The only escapes are:
- External clock with bounded accuracy (reduces L toward 1)
- Relaxed timing requirements (accept uncertainty in the deadline)
- Use bounded real-time clocks (requires different model)

**The L factor compounds in hierarchies**: If agents run on cloud VMs with step ratio L₁ ≈ 2 (scheduling jitter), and the network has delivery ratio L₂ ≈ 1.5 (network jitter), the effective L for algorithms combining both is L₁ × L₂ ≈ 3. Each layer of uncertainty multiplies.

## FischerME: A Case Study in Timing-Critical Correctness

FischerME is the cleanest example of an algorithm whose correctness depends entirely on timing: