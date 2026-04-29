# Schedules as Behavioral Envelopes: Why Flexible Commitment Beats Exact Specification

## The Nominal Trajectory Trap

Classical scheduling produces a *nominal plan*: a complete specification of exactly what happens when. Activity A starts at time 14, uses resource R2, ends at time 19. Activity B starts at time 20, uses resource R1, ends at time 27. Every time slot filled, every resource allocated, every decision made.

This feels like thoroughness. It is actually fragility.

The problem: "During execution, a nominal behavior is interpreted as an ideal trajectory to be followed as closely as possible. However, since the schedule does not explicitly represent feasible alternatives, it is difficult to have a clear picture of the impact of the unavoidable deviations from the desired course of action." (p. 2)

Real execution is never nominal. An observation runs long. A resource becomes temporarily unavailable. A higher-priority task preempts. When any of these occur in a nominal-plan system, the schedule is *wrong* — it no longer describes what will happen — and the system must either replan from scratch (expensive) or stumble forward with a broken plan (dangerous).

## The Envelope Alternative

HSTS advocates a different fundamental concept: **"schedules as envelopes of behavior within which the executor is free to react to unexpected events and still maintain acceptable system performance."** (p. 2)

An envelope is not a single trajectory but a *set of legal trajectories*. Instead of specifying that Activity A starts at time 14, the schedule specifies that Activity A starts between time 10 and 20, and that it starts no less than 5 units after Activity C completes. Any concrete execution that satisfies all such constraints is a legal behavior. The executor chooses which legal behavior to follow at runtime, based on what actually happens.

This is a profound philosophical shift: **the goal of scheduling is not to predict the future but to constrain it — to identify the set of possible futures that are all acceptable.**

## The Mechanism: Temporal Flexibility as a Formal Object

HSTS makes temporal flexibility a first-class citizen of its representation. The Temporal Data Base maintains a *time point network* — a constraint graph where each node is a time point (start or end of some activity) and each arc is a metric interval constraint. Rather than fixing each time point to a specific value, HSTS tracks the *range* of possible values for each time point, consistent with all posted constraints.

This range is the formal representation of flexibility. A time point with range [10, 20] can legally occur at any time in that interval. A time point with range [14, 14] is fully committed. The goal of scheduling is to add constraints until the network is *satisfiable* (there exists at least one consistent assignment) and *safe* (no consistent assignment violates any capacity constraint) — not necessarily until every time point is pinned to a single value.

"Maintaining a time point network encompassing the entire token network... encourages a problem solving style that keeps substantial amounts of temporal flexibility at any stage." (p. 13-14)

The key operations:
- **Value commitment**: pin a time point to a specific value. Reduces search space by one dimension per pinned variable. High precision, low flexibility.
- **Constraint posting**: add a precedence or metric constraint between two time points. Reduces the *feasible range* of both, but does not necessarily eliminate all flexibility. Lower precision, higher flexibility preserved.

HSTS demonstrates both mathematically and experimentally that constraint posting preserves more solution space than value commitment for the same amount of search effort. The concrete argument: two activities competing for a single resource, each with n possible start times. Fix one start time: the other has at most n-1 non-conflicting assignments. Post a precedence constraint instead: the total number of consistent start time assignments is O(n²/2) — dramatically more. "Posting a constraint only restricts the range of the problem variables without necessarily decreasing dimensionality. This has the potential of leaving a greater number of variable assignment possibilities." (p. 21)

## Practical Implications: The Commitment Spectrum

This analysis reveals that commitment is not binary (fixed vs. unfixed) but a *spectrum*:

1. **Unbound** — no constraints on a variable. Maximum flexibility, zero information.
2. **Type-constrained** — the variable is known to belong to some set of possible values. For time, this is a wide interval. For resource assignment, this is a subset of possible resources.
3. **Relationally constrained** — the variable is constrained relative to other variables (A before B, A within [d,D] of C). The exact value is unknown but its relationship to other decisions is fixed.
4. **Exactly committed** — the variable is pinned to a single value.

An intelligent agent should move along this spectrum *as slowly as the problem requires*. Premature commitment (jumping to step 4 before sufficient information exists) is one of the most common failure modes in complex scheduling. It creates artificial conflicts — situations that appear to require backtracking but would not arise if commitment had been deferred.

The HST scheduler exploits this at every level: observations are assigned to *windows* before being assigned to *times*; instruments are sequenced before their detailed reconfiguration is planned; abstract decisions (which observations to attempt) are made before detail decisions (exact reconfiguration sequences) are forced.

## Token Types as Commitment Levels

HSTS operationalizes the commitment spectrum through three token types:

**CONSTRAINT-TOKEN**: represents an indefinite sequence of values from some type set. Maximum flexibility — literally says "something from this set will happen here, I don't know what yet." The starting state of any timeline.

**SEQUENCE-TOKEN**: represents a sequence of values from a constrained type set. Intermediate commitment — the *set* of values is constrained, but their exact ordering and timing within the sequence is free.

**VALUE-TOKEN**: represents a single specific value occurrence. Full commitment at the value level (though the timing may still be flexible — a value token can have unresolved start/end times).

Token insertion — placing a value token into a constraint token's time slot — corresponds to the planning decision of *what* happens in that interval, while leaving *when exactly* it happens still flexible. This decomposition of commitment into independent dimensions (what / when / how long) is a key source of HSTS's efficiency.

## Implications for Agent Orchestration

For a multi-agent orchestration system, behavioral envelopes translate to **execution contracts with built-in slack**:

**Don't over-specify agent invocations.** Instead of "Call the CodeReview agent at step 3, allocate it 30 seconds, expect output format X," specify "Call the CodeReview agent after the StaticAnalysis agent completes and before the SecurityAudit agent starts; allocate it between 20 and 60 seconds depending on file size; accept output format X or Y."

**Represent workflow state as ranges, not points.** A task manager that tracks "step 3 is complete" is less robust than one that tracks "step 3 is complete, and the estimated remaining time for steps 4-7 is between 45 and 90 minutes." The range representation supports better resource allocation and conflict prediction.

**Separate the commitment to invoking an agent from the commitment to how it invokes.** An orchestration system can decide *that* a code review will happen (insert the token) long before it decides *exactly when* and *with what parameters* (pin the time points and argument values). Keeping these decisions separate allows later information to inform earlier commitments without requiring rollback.

**Preserve flexibility in multi-step pipelines.** When designing a sequence of agent invocations, resist the temptation to specify inter-step timing constraints more tightly than the actual domain requires. Each unnecessary tight constraint is a potential source of cascading failure.

## Behavioral Envelope and Robustness

The envelope view has a direct robustness dividend. If execution deviates from the nominal within the envelope, no replanning is needed — the deviation is legal. Only when execution threatens to exit the envelope must the system respond. This creates a natural tiered response:

- **Within envelope**: continue, no action needed
- **Near envelope boundary**: monitor more closely, prepare contingencies
- **Outside envelope**: trigger replanning or fallback procedures

Classical nominal plans have no such tiering. Any deviation is equally "wrong." The envelope provides a formal basis for graceful degradation.

## Boundary Conditions

The behavioral envelope approach has limits:

**Tight deadlines reduce flexibility to zero.** If an activity has a non-negotiable due date and its duration is fully determined, the start time is completely fixed. The envelope collapses to a point. The approach still works but provides no advantage over value commitment in these cases.

**Verifying envelope membership requires constraint satisfaction.** Checking whether a proposed execution is within the envelope means checking whether it satisfies all posted constraints — which can be computationally expensive for large networks. The benefit must outweigh this verification cost.

**Executors must be capable of leveraging flexibility.** An envelope schedule is only useful if the execution system can actually choose among the legal behaviors at runtime. A rigid executor that follows a fixed script will not benefit from temporal flexibility in the plan.

For agent orchestration, the practical implication: design agent interfaces to accept flexible invocation specifications (time windows, parameter ranges) rather than only exact specifications. The planning layer can then exploit flexibility; the execution layer can exploit it too.