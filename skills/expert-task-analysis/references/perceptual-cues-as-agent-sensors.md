# Perceptual Cues as Agent Sensors: What Experts Observe and Why It Matters for System Design

## The Conning Officer as a Sensing System

A skilled conning officer maneuvering a naval vessel to a pier is, at one level of description, a sophisticated biological sensor array. At any given moment during the evolution, they are simultaneously processing:

- **Visual signals**: separation between ship and pier, rate of swing of bow and stern, state of mooring lines, direction flags are blowing, wake pattern around channel buoys, position of fixed landmarks, angle of fenders
- **Auditory signals**: engine sounds accelerating or decelerating, EOT bell acknowledgment, crackling tension in mooring lines, sound of wind in the rigging
- **Tactical signals**: reports from bow watch, stern watch, engineering officer, line handling stations, radio communications from harbor control and tugboats
- **Proprioceptive signals**: the physical sensation when the ship makes contact with fenders ("Physically feel ship make contact with fenders/camel", CCI Table 13)

The expert is not consciously attending to all of these simultaneously in the way that one might read items on a checklist. They have developed an **automatic background monitoring system** — a distributed attentional architecture that flags relevant changes for conscious attention while allowing familiar, expected signals to pass through without interrupting foreground processing.

Understanding this perceptual architecture is essential for building capable agent systems in dynamic environments. The agent must emulate not just the procedures (what to do) but the sensing system (what to observe and when).

## The Structure of Expert Perceptual Monitoring

Analysis of the Critical Cue Inventories in the thesis reveals a consistent structure to expert perceptual monitoring across different aspects of the task. Expert observation is:

### Relative, Not Absolute

Almost no cue in the thesis involves absolute measurement. The expert is almost always measuring *change* or *comparison*:
- "The conning officer will visually watch the **space between** the edge of ship and the edge of the pier. As the space **gets larger** it indicates that the ship is moving away from the pier." (CCI Table 8, p. 107) — *change*
- "If the brow is currently in place and is approximately 16 feet in length, the conning officer can then determine an initial distance for the open space before the ship begins to move is **around 16 feet.**" (CCI Table 9, p. 108) — *comparison to known reference*

This relative structure is not accidental. In an environment of continuous motion, absolute positions are less informative than rates of change. An expert who knows the ship is 50 feet from the pier has less actionable information than one who knows the gap is closing at 2 feet per minute.

For agent systems: **design observation functions to return rates of change and comparisons, not just current values.** An agent that monitors "current distance = 47 feet" is less capable than one that monitors "distance decreasing at rate X; at current rate, contact in T seconds."

### Multi-Modal and Redundant

Every critical state assessment in the thesis involves multiple independent signals from different sensory channels. Consider the assessment of whether engines have started (CCI Table 15):
- Look at status board (visual, formal)
- Hear engines start up (auditory, informal)
- See smoke from smoke stack (visual, informal)

Or the assessment of wind direction and speed (CCI Table 2):
- Read anemometer (instrument)
- Observe wind bird direction (visual)
- Observe flag and pennant behavior (visual + auditory — "quick, succinct whipping noises usually indicate a strong wind")
- Observe wake patterns on water (visual)

The redundancy is functional, not merely informational. In conditions where one channel is degraded (heavy rain obscuring visual signals, engine noise masking auditory signals), the other channels provide continuity of awareness. Expert practitioners have developed this multi-modal monitoring precisely because operational environments are unpredictable about which signals will be available.

For agent systems: **critical state assessments should always specify multiple sensor pathways, with explicit fallback logic.** A state assessment that can only be made through one observation channel is fragile.

### Calibrated Against Known References

Experts do not estimate distances in a vacuum — they calibrate their estimates against objects with known dimensions. The thesis provides explicit examples:

> "Usually, the conning officer will compare the distance of the space with a known visual reference, such as the ship's brow, which is the metal walkway used by personnel to embark and disembark the ship. For example, if the brow is currently in place and is approximately 16 feet in length, the conning officer can then determine an initial distance for the open space before the ship begins to move is around 16 feet." (p. 108)

The expert is not doing this as a deliberate methodological choice in the moment — it is an automatic perceptual strategy learned through experience. They have calibrated their visual distance estimation against many reference objects over many evolutions.

For agent systems: **perception functions should include calibration parameters** — known-dimension reference objects that allow the agent to ground its estimates in objective measurements. This is especially important for agents operating in novel environments where their prior calibration may not apply.

### Anchored to Fixed Points for Trend Detection

One of the most sophisticated perceptual techniques in the thesis is the use of fixed reference points to detect motion:

> "The conning officer will select a fixed point on the pier, such as a crate or paint marking, and will watch to see if it develops some sort of relative motion. For example, if the conning officer chooses an empty box on the pier and it appears to drift forward, then the conning knows the ship is moving backward or aft." (CCI Table 8, p. 107)

This technique — selecting a fixed external reference and tracking its apparent motion — is elegant because it converts a measurement problem (how fast is the ship moving?) into a detection problem (is that fixed point moving?). Detection of motion is something the human visual system does automatically and reliably. The expert has learned to exploit this automatic capability for a navigation purpose.

For agent systems: **design sensors to exploit the same efficiency.** Where an agent needs to detect drift or change, anchor to a fixed reference and monitor relative position rather than attempting to compute absolute velocity.

### Proactive Rather Than Reactive

The timing of cue assessment in the thesis is striking: most cue checks occur *before* the event they are designed to detect. The conning officer assesses environmental conditions at the beginning of an evolution, not in response to problems. They check that all engines are online before giving engine orders, not when an engine fails to respond.

> "It is important to mention again that the brief phase is crucial to the success of the conning officer. The conning officer only begins to learn how to be a good ship handler when he fully understands what is going on around him." (p. 57)

Expert performance involves **building and maintaining a mental model of the entire system state**, not monitoring reactively for failures. The expert knows roughly how the current is running before they need to compensate for it, because they assessed it during approach. They know the status of all engines before beginning the evolution.

For agent systems: **continuous background monitoring is not overhead — it is the capability that makes reliable action possible.** Agents that monitor only in response to events will consistently lag behind the state of the environment.

## The Architecture of a Complete Sensor Suite

Aggregating across the 15 Critical Cue Inventories in the thesis, a complete picture emerges of what an expert ship-handler monitors during pier side evolutions. Organizing these by type:

**Environmental State Sensors**
- Wind direction and speed (multi-modal: anemometer, wind bird, flag behavior, wake pattern)
- Current direction and speed (multi-modal: pier piling wakes, fender behavior, floating object motion, tide charts)

**Ship State Sensors**
- Position relative to pier (bow, stern, amidships separation)
- Rate of change of position (closing rate, opening rate)
- Heading and rate of turn
- Speed through water and over ground
- Propulsion status (engine indicators, EOT, smoke, sound, water churning at stern)
- Steering status (rudder angle indicator, visual confirmation)

**Inter-agent Status Sensors**
- Tugboat position and status
- Line handling station readiness
- Pilot presence and advisory communication
- Harbor control clearance
- Bow/stern watch position reports

**Environmental Context Sensors**
- Other vessel traffic on intended course
- Pier alignment and berth readiness markers
- Fender position and behavior
- Mooring line tension

**System Integrity Sensors**
- All stations manned and ready (formal reports)
- Checklist completion status
- Navigation position fix (navigator's reports)

What is remarkable about this list is its combination of **formally monitored signals** (official reports from watch stations, instrument readings) and **informally monitored signals** (the sound of wind in the rigging, the appearance of smoke from a smokestack, the behavior of floating debris). Expert practitioners have learned that the informal signals are often more timely and more directly observable than the formal ones.

For agent systems, this suggests maintaining a hybrid sensor architecture: **formal sensors for reliable, structured data and informal sensors for rapid, approximate environmental awareness.** The formal sensors provide precision; the informal sensors provide speed.

## Sensor Failure and Degraded Operations

The thesis's treatment of emergency responses (loss of steering, loss of propulsion, loss of gyrocompass) reveals how expert practitioners manage sensor failures:

**Loss of gyrocompass**:
> "Although this is the primary means for monitoring the ship's heading, the conning officer must shift to using the magnetic compass, which is normally located next to the gyrocompass repeater." (p. 35)

The response is immediate fallback to secondary sensor — with the critical observation that the backup is co-located with the primary for rapid transition. The expert does not need to search for the backup; it is positioned to support seamless transition.

**Loss of steering**:
> "The response of the conning officer is to immediately shift to the stand by steering unit. If the rudder still does not respond, an alarm is sounded in the after steering station where the personnel immediately take local control of the rudder." (p. 34)

Multi-stage fallback: primary fails → secondary activated → if secondary fails → tertiary activated. Each fallback has a different mechanism and operator (bridge vs. after steering room), ensuring that a failure mode that eliminates one mechanism does not necessarily eliminate all.

For agent systems: **sensor architecture should include explicitly designed fallback chains**, with degraded-mode operations specified for each level of sensor unavailability. An agent that loses its primary sensor should not fail — it should gracefully degrade to secondary sensors with appropriate reduction in confidence.

## The Role of Position in Determining What Can Be Observed

One of the most practically important insights in the thesis is that the expert's physical position determines what they can observe — and the expert actively manages their position to maintain observational access to the most important signals:

> "Goal: Position_Yourself_On_Bridgewing ... [select: Port side Bridge wing ...if moored on port side / Starboard Bridge wing ...if moored on starboard side]" (GOMS model, p. 62)

And later, when the ship is moving out from the pier:
> "As the conning officer begins to maneuver the ship out of the pier he will move inside the bridge and position himself on the centerline of the ship. The centerline... provides the optimal vantage point for the conning officer to conduct the remainder of the evolution from." (p. 73)

The expert moves between positions — bridgewing for close-proximity work (where lateral clearance matters), centerline for channel transit (where heading accuracy matters). These are not arbitrary preferences; they are calibrated choices about which signals are most important at which phase and what physical position provides best access to those signals.

For agent systems operating with multiple data sources: **the "position" concept translates to attention allocation.** Which data sources should the agent prioritize at each phase of the task? Which monitoring bandwidth should be allocated to which signals? A task model should include explicit attention allocation guidance, not just procedure guidance.

## Boundary Conditions

The perceptual cue framework in this thesis is most directly applicable when:
- The agent operates in a physically real or richly simulated environment
- Multiple independent signals encode the same underlying state variables
- Expert practitioners have developed stable, learnable perceptual patterns
- The agent needs to make decisions under sensor uncertainty or degradation

The framework is less applicable when:
- All relevant state is perfectly observable through a single structured interface
- The environment is fully deterministic with no sensor noise
- There is no perceptual skill component to the task (pure information processing)

The central lesson: **agent capabilities are bounded by sensor design.** A procedurally capable agent with inadequate sensing will fail systematically in ways that are invisible during procedure-focused testing but emerge immediately in deployment. Sensor design is not an implementation detail — it is a first-class architectural concern.