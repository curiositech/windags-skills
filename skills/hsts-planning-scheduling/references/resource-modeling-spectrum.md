# The Resource Modeling Spectrum: From Binary Availability to Complex State Representation

## Why Resource Modeling Is Not Just About Counting

Classical scheduling textbooks define a resource as something that can be in one of two states: available (idle) or in use (occupied). A machine has capacity 1; once one job occupies it, others must wait. This model is sufficient for simple manufacturing scenarios with interchangeable machine states.

It is catastrophically insufficient for the real world.

The Hubble Space Telescope's tape recorder is a resource. But its relevant state is not just "available" or "in use." It also tracks how many bytes are stored, what instrument most recently wrote to it, whether it is currently reading out data, and whether a dump-to-Earth communication is in progress. These state details matter causally: a new read-out can only proceed if the remaining tape capacity exceeds the data to be written; a dump-to-Earth renews capacity but requires a communication window; reading out and dumping simultaneously is forbidden.

Classical scheduling cannot represent any of this. It can tell you "tape recorder is busy" but not *why* it's busy, not *how much* capacity remains, and not *when* it will be free (because that depends on how much data needs to be dumped, which depends on how much was written, which depends on the sequence of observations).

HSTS's state variable approach dissolves this limitation by giving resources the same rich representational treatment as any other system component.

## The Resource Type Taxonomy

HSTS distinguishes resources along three dimensions, yielding a comprehensive taxonomy:

**Single vs. Multiple Capacity**: A single-capacity resource can serve one unit of work at a time. A multiple-capacity resource has a budget of capacity (bytes, watts, connection slots) that can be partially consumed.

**Single vs. Multiple User**: A single-user resource can be occupied by only one activity at a time. A multiple-user resource supports simultaneous use by multiple activities (subject to aggregate capacity constraints).

**Renewable vs. Non-Renewable**: A renewable resource's capacity is restored after use (power from solar cells recharges; tape clears after communication). A non-renewable resource's capacity permanently decreases after use (propellant, food).

The combinations yield distinct modeling requirements:

| Type | Example | Representation |
|------|---------|----------------|
| Single capacity, single user, renewable | Drill machine | Atomic state variable with binary value range |
| Multiple capacity, single user, renewable | Tape recorder | Atomic state variable with numeric capacity argument |
| Multiple capacity, single user, non-renewable | Fuel tank | Atomic state variable, no renewal value |
| Multiple capacity, multiple user, renewable | Airport refueling pool | Aggregate state variable |
| Multiple capacity, multiple user, non-renewable | Food supply | Aggregate state variable, capacity only decreases |

## Atomic State Variables for Single-User Resources

The atomic state variable represents a resource that can be used by at most one activity at a time. Its value at any moment completely describes the resource's relevant state.

The tape recorder example is instructive precisely because it shows how much information can be packed into atomic state variable values:

- `STORED(?C)`: tape recorder idle, storing ?C bytes
- `READ-OUT(?I, ?D, ?C)`: instrument ?I is writing ?D bytes to a tape already holding ?C bytes
- `DUMP-TO-EARTH(?C)`: communicating ?C bytes to Earth, resetting tape to empty

Each value is a complete description of the tape recorder's current operational situation. Duration constraints are bound to the arguments: READ-OUT duration depends on `?D` (data volume) and communication rate; DUMP-TO-EARTH duration depends on `?C` and the available communication link's bandwidth.

Feasibility checking is structural: an insertion of READ-OUT(`?I`, `?D`, `?C`) is infeasible if `?D + ?C > MAX-C` for any assignment of the unbound arguments. This check is automatic from the type system — no special-purpose capacity constraint is needed. The value type's argument domain encodes the capacity constraint.

This is a general principle: **make capacity constraints implicit in value type definitions rather than explicit as separate capacity rules.** When a resource's relevant state is fully captured in its value vocabulary and argument domains, feasibility checking reduces to type consistency checking — a uniform, compositional operation.

## Aggregate State Variables for Multiple-User Resources

The aggregate state variable handles pools of individually indistinguishable resources supporting simultaneous use.

The construction: an aggregate state variable's value is a list of (atomic-value, counter) pairs, summarizing how many atomic resources in the pool are currently in each possible atomic state. For a pool of 10 CPU units, the aggregate value `{(IN_USE, 7), (IDLE, 3)}` means 7 are running jobs and 3 are idle.

Aggregate compatibilities specify capacity increments and decrements:

```
[contains([0,0],[0,0]) <σ, Capacity(POOL), {(OPER, INC(+cj)), (IDLE, INC(-cj))}>]
```

This says: while activity OPj is in progress, the aggregate state variable must simultaneously contain a sequence starting and ending with OPj, in which the OPER count increases by cj and the IDLE count decreases by cj. The aggregate capacity tracking is automatic from the type propagation mechanism.

Consistency checking: compute the aggregate value at each timeline point by summing all active capacity increments/decrements from all overlapping activities. The network is inconsistent when any counter becomes negative (more capacity consumed than available).

The elegant feature: inconsistency from capacity over-subscription can sometimes be resolved *without backtracking*, by inserting additional capacity-generating tokens. In the airport refueling example, if too many planes need refueling simultaneously, the solution might be to bring in additional refueling equipment — a forward planning move rather than a backward repair move. "In case the system model allows the generation of capacity (i.e., contains aggregate compatibilities with INC(-x) entries), inconsistencies can be resolved without backtracking by posting additional compatibilities that provide the missing capacity." (p. 16)

## The Transportation Planning Domain as an Aggregate Resource Case Study

The "bare base" transportation planning domain is a rich illustration of aggregate resource reasoning. The goal: transform a bare runway into a functioning airport. Resources include:

- Refueling capacity (aggregate: number of planes that can be refueled simultaneously)
- Unloading capacity (aggregate: rate at which incoming cargo can be processed)
- Sleeping space (aggregate: number of personnel that can be quartered)
- Airport throughput (aggregate: total arrival/departure rate)

Each resource is represented as an aggregate state variable with capacity that increases as equipment and personnel arrive. The remarkable feature: **resource creation and resource consumption interact**. Bringing in refueling units increases refueling capacity, which allows more planes to arrive, which increases throughput, which allows faster delivery of more refueling units. This is a positive feedback loop — a cascade of capacity amplification.

Classical scheduling cannot represent this. Resources have fixed capacities; they do not generate additional capacity. HSTS's aggregate state variables, with their capacity-generating compatibilities (INC(-x) entries), naturally model this feedback:

```
[contains([0,0],[0,0]) 
  <σ, Capacity(REFUELING), {(AVAILABLE, INC(-1)): on arrival of refueling unit}>]
```

Each arriving refueling unit generates one unit of refueling capacity. The planner can reason about the *sequence* of resource arrivals, optimizing for rapid capacity amplification.

"The arrival of these additional units must be carefully coordinated to avoid chaotic situations and negative consequences on the overall outcome of the mission." (p. 4)

This coordination is exactly what the aggregate state variable representation — with its capacity tracking and compatibility constraints — enables.

## Synchronization and Temporal Flexibility in Resource Allocation

A critical feature of HSTS's resource representation: resource allocations inherit the temporal flexibility of the tokens that request them.

"As with atomic state variables, each transition between time line tokens belongs to the HSTS-TDB time point network. Therefore, the synchronization of the requests for capacity allows a certain degree of flexibility regarding the actual start and end of the use of a resource." (p. 17)

What this means concretely: when activity A requests resource R from time [10, 20] to time [15, 30] (a flexible interval), the resource allocation is also flexible. The resource is not reserved at a specific time; it is reserved *within the window*. Other activities' resource requests can coexist in the same window as long as the aggregate constraints are not violated for any possible assignment of times.

This is more than an optimization nicety. It is what makes the behavioral envelope approach practical for resource-constrained problems. Without flexible resource allocations, any temporal flexibility in the activity network would be immediately consumed by the need to assign fixed time slots to resources. The flexible representation preserves temporal freedom throughout the constraint-posting process.

The tradeoff: "Testing that the requested amount does not exceed available capacity still requires a total ordering of start and end times on the time line." (p. 17)

When you actually need to *verify* that a resource is not over-subscribed at a specific time, you must resolve the temporal flexibility into a specific ordering. This is why CPS's stochastic simulation is necessary — it generates many possible total orderings and checks capacity for each, estimating the *probability* of over-subscription without requiring commitment to a specific ordering.

## Implications for Agent System Resource Modeling

For a WinDAG orchestration system, the resource modeling spectrum has direct implications:

**Model agent capabilities as state variables, not just availability flags.** An agent is not just "available" or "busy." It may be WARMING_UP (loading a model), PROCESSING(?task), RATE_LIMITED, AWAITING_CLARIFICATION, or DEGRADED (running on reduced capacity). Each state has different duration characteristics, different compatibility constraints, and different implications for downstream tasks. Tracking only availability discards information that is often crucial for scheduling.

**Use aggregate state variables for shared computational resources.** GPU memory, API rate limits, database connection pools, and parallel processing capacity are all aggregate resources. Model them with capacity tracking that supports both consumption (each agent invocation) and renewal (API rate limit windows reset, GPU memory is freed after processing).

**Exploit capacity-generation for dynamic scaling.** If your agent system can spawn new agent instances on demand (e.g., cloud compute), model this as capacity generation — a compatibility that increases the aggregate capacity of the relevant agent pool. The orchestration system can then reason about *when* to scale up (before a predicted bottleneck) rather than *after* capacity is exhausted.

**Synchronize resource allocations with workflow flexibility.** When an agent's invocation time is flexible (it can start anytime in a 10-minute window), its resource reservation should be equally flexible. Don't convert temporal flexibility into rigid reservations any earlier than necessary.

## Boundary Conditions: When Simple Resource Models Suffice

The rich resource modeling of HSTS is justified when:

1. **Resource state beyond availability is causally relevant**: The drill-bit example, tape recorder capacity, instrument reconfiguration state. If the only thing that matters about a resource is whether it's busy or free, classical binary availability suffices.

2. **Resource capacity is dynamic (consumable, renewable, or generatable)**: Fixed-capacity, always-renewable resources can be modeled simply. Dynamic capacity requires the richer model.

3. **Multiple activities compete for the same resource in overlapping time windows**: If activities are always strictly sequential on each resource, availability tracking suffices.

For agent systems with simple, fixed-capacity, non-stateful resources (e.g., a web search API with only a rate limit), classical capacity tracking is adequate. The HSTS-level richness is warranted when the resource has meaningful internal state that affects what can be done with it and when.