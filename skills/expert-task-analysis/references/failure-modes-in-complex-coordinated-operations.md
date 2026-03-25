# Failure Modes in Complex Coordinated Operations

## The Structural Conditions That Create Risk

Naval pier-side ship-handling is a high-stakes coordinated operation that the thesis uses as a lens for understanding how complex procedural tasks fail. The conditions that make pier-side operations dangerous are precisely the conditions that make any complex multi-agent operation dangerous:

1. **Physical irreversibility**: Actions that cannot be undone — once the ship has too much momentum toward the pier, it cannot stop in time
2. **Multi-agent interdependence**: The conning officer's success depends on the helmsman, lee helmsman, line handlers, engineering watch, tugboat, harbor pilot, and harbor control all performing correctly
3. **Environmental variability**: Wind, current, and other vessels create unpredictable forces that invalidate static plans
4. **Temporal pressure**: The relevant timescales (seconds for rudder response, minutes for momentum dissipation) are compressed relative to the decision cycle of most management interventions
5. **Information degradation under stress**: The practitioners who most need good information are the ones whose cognitive capacity to process it is most constrained

Understanding how these conditions combine to produce failures is essential for designing agent systems that are robust to the same pressures.

## Failure Mode 1: Momentum Mismanagement

The thesis identifies the central challenge of mooring as managing the ship's inability to stop quickly:

> "The biggest challenge is being able to control the ship's momentum through the water. A ship's inability to respond quickly, if at all, to engine and rudder orders at very slow speeds and in shallow water, greatly reduces its maneuverability alongside a pier. Unlike parking a car, the ship driver cannot just put on the brakes and stop the ship. It takes a great deal of time for a ship to come to a complete stop. For instance, the distance it takes an aircraft carrier, doing 20 knots, to stop dead in the water is over 1,000 yards." (p. 39)

This failure mode — **delayed response creating irreversible commitment** — appears in many agent system contexts:
- A deployment pipeline with long execution times where errors are discovered only after irreversible changes
- A data processing pipeline that commits records before validation completes
- An infrastructure provisioning agent that begins resource allocation before verifying requirements

The ship's solution is to **start the deceleration process far earlier than intuition suggests is necessary** — to begin slowing down at 100 yards, not at 50 yards, because the ship cannot respond instantly to the order to stop. The expert builds in lead time for the system's response latency.

For agent systems: **Actions with long lead times or high commitment costs must be initiated far earlier in the decision process than immediate-response actions.** Task models should explicitly specify "begin deceleration now so that the effect materializes when needed" rather than "reduce speed when distance equals X."

## Failure Mode 2: Loss of Steerageway

A specific critical threshold exists below which standard control mechanisms stop working:

> "Below a certain speed, oftentimes considered to be 1 knot, a rudder is unable to overcome the forces working on the ship. This is known as a ship losing 'steerageway.' When the ship has lost steerageway, its heading can no longer be controlled by the rudder alone." (p. 26-27)

This is a **regime change failure** — a threshold at which the operating model switches from one domain to another. Above the threshold, the standard control mechanism (rudder) works. Below the threshold, a different control mechanism (propeller differential) is required.

The failure mode occurs when practitioners do not recognize that they are approaching the threshold and continue trying to use the standard mechanism in a regime where it has stopped working. An experienced conning officer recognizes the signs of approaching steerageway loss and proactively transitions to the alternative control mechanism. A novice continues turning the wheel while the ship continues drifting toward the pier.

For agent systems: **Every task model should identify regime boundaries** — thresholds at which standard methods become ineffective and alternative methods must be activated. The agent should monitor for approach to these boundaries and trigger proactive method switching, not reactive failure recovery.

## Failure Mode 3: Incomplete Model of the Environment

The thesis's discussion of environmental forces reveals how incomplete environmental models lead to systematic errors:

> "A common rule of thumb used by conning officers is that 1 knot of current is equal to 15 knots of wind." (p. 28)

This heuristic encodes a critical insight: current forces are much stronger than they appear relative to wind forces (because water density is much higher than air density). A conning officer who underestimates current by treating it as equivalent to wind will systematically under-compensate and drift toward hazards.

The thesis shows how experts build environmental awareness proactively:

> "Assess_Environmentals_And_Ship_Surroundings ... Determine_Wind_Direction_And_Speed ... Determine_Current" (GOMS model, p. 62)

This assessment occurs at the beginning of the approach, not in response to drift. The expert builds their environmental model *before* they need to act on it, so they can incorporate it into their planning rather than reacting to its effects.

For agent systems: **Environmental modeling must precede action planning, not follow problem detection.** An agent that discovers during execution that a critical environmental parameter was not accounted for will be in reactive mode — always behind. An agent that actively models the environment before beginning action can incorporate uncertainty into its planning.

## Failure Mode 4: Communication Protocol Breakdown

The thesis specifies communication protocols at a level of detail that reveals their importance to the failure mode landscape:

> "Like standard rudder and engine commands, orders given to line handling stations are given in a specific sequence. In order to prevent confusion, each order given by the conning officer to the line handling stations should be succinct, clear, and consistent. Because misunderstanding or ambiguity can quickly lead to disaster, there must be no possibility of an order being misinterpreted." (p. 31)

The five-step confirmation protocol (determine → issue → receive repeat-back → verify execution → receive execution report) exists specifically to catch the failure mode of an order being misheard, misunderstood, or not executed.

The most dangerous communication failures are those where the receiver *believes* they understood correctly but didn't. The repeat-back protocol catches this: if the helmsman repeats back "left 15 degrees rudder" when the conning officer ordered "left 30 degrees rudder," the error is caught before execution.

For agent systems: **Critical operations should use structured acknowledgment protocols, not fire-and-forget messaging.** An agent that sends an action request and assumes it will be executed is vulnerable to the class of failures where execution was partial, incorrect, or not performed at all. The confirmation protocol is an anti-corruption layer.

## Failure Mode 5: Over-Reliance on a Single Expert

The thesis describes the bridge watch team structure, which includes multiple experienced personnel:

> "The Commanding Officer... is in charge of the entire watch section... The Harbor Pilot, a master in ship-handling, is very familiar with the local channel conditions." (p. 6, 32)

The co-presence of the commanding officer, the harbor pilot, and the conning officer on the bridge during critical evolutions is not redundant in the sense that any one of them could be absent. It is redundant in the sense that each brings different knowledge:
- **Conning officer**: detailed knowledge of the ship's specific handling characteristics
- **Harbor pilot**: detailed knowledge of local channel conditions, current patterns, local traffic habits
- **Commanding officer**: final authority, strategic oversight, deepest experience on this specific vessel

> "Despite the many years of ship driving experience, the pilot is not necessarily an expert on the ship's handling characteristics. Therefore, it is imperative that the commanding officer and conning officer, who are familiar with the ship's characteristics, work together with the pilot during pier side evolutions." (p. 32)

The failure mode here is **single-source knowledge dependency** — relying on one person or one system for all the knowledge required to navigate a complex situation. Each expert has deep knowledge in their domain and blind spots outside it. The team structure ensures that no single blind spot can cause a failure.

For agent systems: **Complex tasks requiring multiple knowledge domains should be structured with explicit knowledge specialization.** Agent teams should have identified domain experts, with clear protocols for when each expert's judgment is required and how disagreements between experts are resolved.

## Failure Mode 6: The Assumption of Nominal Conditions

The most insidious failure mode in the thesis — and in agent systems — is acting as if nominal conditions hold when they do not.

The tug boat discovery in the validation is an instance of this. The initial model assumed nominal conditions (no tug needed, sufficient time and space to maneuver the ship alone). Real practitioners rejected this assumption because their experience had taught them that nominal conditions are the exception, not the rule:

> "Due to the severe consequences of damaging the ship, it is very rare any type of pier side ship-handling would be conducted without the assistance of a tugboat." (p. 50)

The model was technically correct for nominal conditions. Real operations virtually never use nominal conditions. The gap between "technically correct for the specified scenario" and "appropriate for actual operating conditions" is the failure mode.

For agent systems: **Every nominal-condition assumption must be explicitly stated and then tested by asking: how often are these conditions actually met in deployment?** Assumptions that are rarely met in practice should either be relaxed in the model or treated as preconditions that must be verified before the model applies.

## Failure Mode 7: Checklist Completion as Substitute for Readiness

The thesis describes elaborate checklists that must be completed before pier-side evolutions:

> "Each of the ship's departments have a check list that outlines, in detail, everything they are required to do to get the ship ready for sea." (p. 36)

The checklists are valuable. But the thesis also reveals their limitation: the commanding officer and conning officer must interpret the checklist reports, not just receive them. The GOMS model shows: