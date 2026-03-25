# Hierarchical Abstraction as the Foundation of Scalable Problem Solving

## The Scalability Crisis in Complex Domains

When a problem has many components, many constraints, and many possible states, any algorithm that reasons about all of it simultaneously faces catastrophic combinatorial explosion. The number of possible schedules for the Hubble Space Telescope — with tens of thousands of annual observation requests, six scientific instruments, multiple communication links, power constraints, thermal constraints, and pointing constraints — is astronomically large. No exact algorithm can search it.

The practical answer to combinatorial explosion is **hierarchical decomposition**: solve the problem at an abstract level first, making decisions about overall structure without worrying about every detail, then refine those decisions into detail-level solutions. But this only works if the framework genuinely supports it — if abstraction levels are real, if information flows correctly between levels, and if heuristics developed for sub-problems compose without requiring redesign.

HSTS implements this through a layered architecture: the Domain Description Language (DDL) allows models to be specified at multiple levels of abstraction connected by refinement descriptors, the Temporal Data Base (TDB) maintains communicating token network layers corresponding to each abstraction level, and the problem-solving strategy stages decisions across levels.

## What Abstraction Means in HSTS

In HSTS, abstraction is not vagueness — it is a formally specified relationship between levels. The DDL allows state variables at abstract levels to **aggregate** those at more detailed levels. A refinement descriptor maps abstract value occurrences to networks of detailed values, explicitly specifying the correspondence between start/end times of abstract tokens and those of the detailed tokens they expand into.

This is important: the refinement is not merely "this abstract action corresponds to this sequence of detailed actions." It specifies the *temporal relationships* between abstract and detailed descriptions. When an abstract-level observation token is refined into a detail-level sequence of instrument reconfiguration, pointing, exposure, and readout, the system knows exactly how the timing of the abstract token constrains the timing of the detailed tokens.

For the HST domain, the two-level hierarchy works as follows:

**Abstract level**: Models telescope availability, overall reconfiguration time between observations, and target visibility windows. State variables at this level are coarse: a single state variable for telescope availability, one for each target's visibility. Decisions at this level concern *which* observations to schedule and in *what overall order*.

**Detail level**: Models each telescope subsystem separately — pointing device state, each instrument's operational state, data communication links, tape recorder state. Decisions at this level concern *how* to execute each scheduled observation, including all intermediate configuration states.

The critical insight is that the abstract level can sequence observations efficiently — making the "which and in what order" decisions — without knowing the detailed mechanics of every instrument reconfiguration. The detailed mechanics are handled at the detail level, which gets handed a set of sequencing decisions from the abstract level and must find implementable reconfiguration paths for each.

## Information Flow Between Levels

The two levels exchange information in both directions, and the quality of this bidirectional communication is what makes the hierarchy genuinely useful rather than just a convenient fiction.

**Abstract to detail**: When an observation is sequenced at the abstract level, it is "communicated to the detail level for insertion in the detail plan/schedule" in the form of a token subnetwork obtained from expanding the abstract token's refinement specification. Preferences about how goals should be achieved (e.g., "achieve all goals as soon as possible") are also communicated.

**Detail to abstract**: The detail level communicates back "additional temporal constraints on abstract observations to more precisely account for the reconfiguration delays." This is crucial: the abstract level's estimate of reconfiguration time may be approximate (it only knows overall telescope slewing rate), while the detail level's actual execution may find that a particular instrument configuration takes longer than expected. The corrected timing feeds back up, allowing the abstract level to refine its sequencing decisions.

This bidirectional flow prevents a common failure mode of hierarchical planning: the abstract level makes decisions based on optimistic estimates, the detail level cannot implement them, and the whole system fails because there's no mechanism to propagate that failure back up. In HSTS, difficulty at the detail level translates into tighter temporal constraints at the abstract level, which the abstract level can then use to make better sequencing choices.

## The Composability Test for Heuristics

A hierarchical framework is only as good as its heuristics' ability to compose. The HST experiments provide a compelling test of this. Three models of increasing complexity were used — SMALL (pointing device + one instrument), MEDIUM (SMALL + a second instrument), LARGE (MEDIUM + data communication).

The heuristics for SMALL were developed to handle: synchronization among WFPC components, telescope pointing management, and interaction between instrument state and pointing.

To solve MEDIUM problems, "it is sufficient to extend the domain of applicability of SMALL's heuristics to obtain a complete set of heuristics for MEDIUM." For example, the heuristic that prevents WF and PC detectors from being simultaneously operational was straightforwardly modified to handle the same condition for the FOS instrument's two detectors. The *structure* of the constraint was identical; only the components it referred to changed.

For LARGE, the MEDIUM heuristics were used without change, with additional heuristics added specifically for data communication and instrument-to-communication interactions (e.g., "prevent scheduling an observation on an instrument if data from the previous observation has not yet been read out of its data buffer").

The key measurement: "the average CPU time spent implementing each compatibility remains relatively stable" across SMALL, MEDIUM, and LARGE. This is the quantitative signature of genuine composability. Total CPU time grows approximately as the sum of the sub-problem efforts — not combinatorially, not even super-linearly.

This result validates the claim that HSTS "displays both features of a modular and scalable planning/scheduling framework":
1. Heuristics can be assembled by combining independently developed components with little or no modification.
2. Computational effort grows approximately as the sum of the efforts for component sub-problems.

## Why This Works: Locality of Interactions

The computational composability is not accidental — it is a consequence of the *locality of interactions* in the domain model. Each instrument's internal configuration constraints primarily interact with other variables of the same instrument and with the shared pointing device. They do not create dense constraint webs across all subsystems simultaneously.

When the domain model makes this locality explicit — by structuring state variables as belonging to specific system components, with compatibilities that specify which other state variables they interact with — the heuristics can exploit that locality. A heuristic that resolves the internal constraints of WFPC doesn't need to know about FOS. A heuristic that manages the pointing state doesn't need to know the internal details of either instrument.

The framework's representational choices enforce this discipline. Because every compatibility explicitly names the state variable it constrains, and because state variables are organized into system components, the dependency structure is visible and tractable. An agent solving a sub-problem can focus on the relevant portion of the constraint network without getting lost in irrelevant interactions.

## Multi-Level Token Networks

At the TDB level, the multi-level structure is implemented through "a number of communicating layers, each corresponding to a level of abstraction in the HSTS-DDL system model." Each layer has its own set of tokens and its own time line for each state variable at that level. The layers communicate through refinement links: when an abstract token is refined, an instance of the refinement specification is associated to it, and the detail tokens created by the refinement are entered in the detail layer.

Crucially, the time point network spans *all* layers — the temporal constraints between abstract tokens and between detail tokens, and between abstract and detail tokens, are all represented in a single unified temporal constraint graph. This means that constraint propagation at either level automatically affects the feasible windows at the other level. A tighter timing at the detail level (because a reconfiguration took longer than expected) immediately propagates upward to tighten the abstract-level time windows of the affected observation.

## Implications for Agent System Design

**For orchestration hierarchy design**: Any agent orchestration system handling complex tasks should implement at least two levels of abstraction: a *planning* level that makes high-level decomposition decisions without worrying about implementation details, and an *execution* level that handles the specifics of each subtask. The critical requirement is that information flows *both ways* — execution-level difficulties must be expressible as tighter constraints at the planning level.

**For skill composition**: The composability result from HST has a direct analog in agent skill systems. If skills are designed with explicit interfaces (what state variables they affect, what temporal constraints they impose), then combinations of skills can be planned without knowing the internal implementation of each skill. The planning level only needs to know the abstract effect; the execution level handles the detail. A skill that "books a flight" at the planning level expands into "check availability, select seat, enter payment, confirm" at the execution level, with the detail-level constraints (minimum processing times, payment confirmation delays) feeding back up as temporal constraints on the abstract booking action.

**For scaling from prototype to production**: The HSTS experiments show a path from SMALL to LARGE that is both principled and empirically validated. An agent system that is built modularly — with explicit state variable specifications, explicit compatibility constraints, and heuristics that exploit domain locality — can scale from a prototype domain to a production domain by adding components and extending heuristics, without requiring fundamental redesign. This is a valuable empirical claim: **scalability must be built into the representation, not retrofitted into the search**.

**For heuristic libraries**: The HST experience suggests that agent system heuristics should be stored as modular, composable components organized around the system components they govern, not as monolithic procedures that reason about the whole problem. When a new component is added to the system, you add heuristics for that component and extend existing heuristics where the new component interacts with old ones — but you don't rewrite the existing heuristics.

**For local vs. global reasoning**: The failure mode of min-conflict repair on multi-bottleneck problems is a warning about the limits of purely local heuristics. When multiple constraints interact globally — when resolving one conflict necessarily creates another — any algorithm that only looks at local conflict measures will fail to converge. Multi-agent systems that manage complex shared resources need at least some global view of constraint structure, even if local heuristics handle the details.

## Boundary Conditions

Hierarchical decomposition requires that the abstract level be a meaningful simplification — that it actually omits detail in a way that makes the high-level problem tractable, while the retained information is sufficient for making good high-level decisions.

If the abstract level omits too little (the abstract problem is almost as hard as the full problem), the hierarchy provides no benefit. If it omits too much (abstract decisions frequently cannot be implemented at the detail level), the overhead of failure and replanning exceeds the savings from the abstraction.

The HSTS approach requires explicit refinement descriptors that specify the temporal relationship between abstract and detail actions. These descriptors must be designed by domain experts and maintained as the domain model evolves. In rapidly changing domains, keeping refinement descriptors current is a non-trivial maintenance burden.

Additionally, bidirectional information flow between levels creates the possibility of oscillation: the abstract level makes a decision, the detail level rejects it and feeds back a tighter constraint, the abstract level makes a different decision, the detail level rejects that too. Managing the convergence of this process — ensuring that the bidirectional communication converges to a consistent solution rather than cycling — requires careful design of the feedback mechanism.