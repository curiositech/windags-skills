# The Unified Planning-Scheduling Model: State Variables as the Foundation

## The Core Insight: The Divide Is Artificial

Classical AI systems split the management of complex operations into two sequential phases. First, **planning**: determining *how* the system achieves different goal types, producing a library of plan templates through the concatenation of elementary actions. Second, **scheduling**: taking those templates, instantiating them for a specific set of requests, and assigning each action a time slot with exclusive resource usage.

This separation feels clean. In practice, it is "not possible or beneficial" in a wide variety of complex applications.

The failure appears at the seams. During scheduling, it is frequently necessary to make planning decisions — for example, when two sequential operations require the same drilling machine with different drill bits, the scheduler must plan the setup activity (switching bits), even though this setup is "not justified by the achievement of a primary goal but depends exclusively on how other activities are sequenced on a resource." Conversely, planning can benefit enormously from scheduling information — if you know which resources will be heavily loaded, you might prefer a process plan that avoids them, even if it is slightly more steps. Classical systems cannot support this bidirectional coupling without expensive re-architecturing.

The deeper problem is representational: classical planning systems (following the STRIPS tradition) represent the world as a flat list of predicates or a first-order theory, treat actions as instantaneous transitions between states of "indeterminate durations," and provide no structured way to reason about resources over time. Classical scheduling systems model resources carefully but keep "no information about a resource state beyond its availability" — they cannot track *which* drill bit is mounted, *why* an instrument is in a warm state, or *what causal justification* exists for a particular configuration. Both traditions sacrifice something essential.

## The Unifying Principle: Dynamical Systems and State Vectors

HSTS resolves this by recognizing that "a domain can always be described as a dynamical system." A dynamical system is defined by:

- **State**: the internal memory of past history
- **Input**: actions directly controlled by an external agent  
- **Behavior**: the observable evolution of state over time

The key modeling choice in HSTS is to decompose both input and state as **finite-dimensional vectors of values evolving over continuous time**. Each element of the vector is a **state variable** — a system property that can assume exactly one value at any given moment.

This is a careful middle path between the two traditions:

- Like classical scheduling, it decomposes the domain into discrete trackable quantities whose evolution over time can be reasoned about explicitly.
- Like classical planning, it supports rich value descriptions (full predicates with typed arguments, not just binary available/in-use), causal justifications, and multi-valued state.

The power is in the combination. Consider the HST telescope's pointing device. Its state variable `state(POINTING-DEVICE)` can take values:
- `UNLOCKED(?T)`: pointing toward target ?T without active tracking
- `LOCKED(?T)`: actively tracking target ?T
- `LOCKING(?T)`: in the process of acquiring a lock on ?T
- `SLEWING(?T1, ?T2)`: transitioning direction between targets

These are not binary. They are not "just" resource capacities. They are rich descriptors of physical reality, parameterized by typed arguments (the `?T` variables range over the set of known celestial targets), and they carry causal structure — the transitions between them are constrained, the durations depend on physical parameters (angular separation, slewing rate), and each value requires certain conditions from *other* state variables (for example, `LOCKED(?T)` requires that `visibility(?T)` has value `VISIBLE` throughout its duration).

This is qualitatively different from anything achievable in pure planning or pure scheduling.

## State Variables as Universal Primitives

The state variable model generalizes cleanly across the full range of resource and state types:

**Single-user, binary resources** (classical scheduling): A machine that is either `OPERATING` or `IDLE` maps directly to a single-valued state variable with a binary range. Exactly the classical scheduling case.

**Complex state resources**: The HST tape recorder tracks `state(TAPE-RECORDER)` with values like `READ-OUT(?I, ?D, ?C)` — reading `?D` bytes from instrument `?I` onto a tape already containing `?C` bytes. The numeric argument `?C` tracks capacity usage dynamically. This would require an entirely separate resource accounting mechanism in classical scheduling.

**Multi-user resources** (aggregate state variables): When multiple activities share a pooled resource, an aggregate state variable tracks `{(OPER, n1), (IDLE, n2)}` — how many units of the pool are in each state. Requesting capacity increments or decrements the counters. Conflicts are detected when a counter goes negative. This handles airport refueling capacity, electric power budgets, and transportation cargo space — all using the same mechanism.

**Process sequencing**: Some state variable values naturally follow each other without a persistent intermediate state. A reconfiguration of a telescope instrument might go through a specific sequence of intermediate states. HSTS supports "sequence constraints" — compatibility conditions that require not a single value but a *contiguous sequence* of values from a specified set to occur on a state variable within a given time window.

## Compatibilities: Encoding Causal Structure in the Model

Every value on every state variable comes with a **compatibility specification** — an AND/OR graph of temporal constraints that must be satisfied by any legal system behavior containing that value. A compatibility has the form: