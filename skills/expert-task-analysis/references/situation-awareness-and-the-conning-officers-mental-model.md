# Situation Awareness: Building and Maintaining a Mental Model Under Time Pressure

## The Mental Picture as Primary Instrument

The most sophisticated cognitive achievement in pier-side ship-handling is not any individual action — it is the ongoing maintenance of an accurate "mental picture" of the tactical situation. Grassi's thesis refers to this repeatedly, always in language that suggests it is the foundation on which all decision-making rests:

> "With the conning officer positioned on the bridgewing, he begins to make a mental picture of situation by identifying pertinent visual cues. By walking to both sides of the ship and viewing the surrounding area, the conning officer not only gains visual references to neighboring ships, but he is also able to assess the environmental effects." (p. 63)

The mental picture is not a snapshot — it is a dynamic model that integrates:
- The ship's current position relative to the pier, neighboring vessels, channel markers, and navigational hazards
- The ship's current velocity vector (speed, direction, rate of rotation)
- The environmental forces acting on the ship (wind direction and magnitude, current direction and strength)
- The predicted trajectory given current helm and engine settings
- The available room to maneuver in each direction
- The locations and states of all team members and external resources (tug, harbor pilot, line handlers)

This mental model must be continuously updated as each of these elements changes. And it must be accurate enough to support confident, time-critical decisions — "swing the stern now" or "back down harder" — with minimal tolerance for error.

## How the Mental Model Is Built

The mental model is constructed through structured observation. Before any maneuvering begins, the conning officer performs a deliberate assessment:

**Position assessment**:
> "goal: Determine_Distance_Between_Bow_And_Closest_Obstruction
>   [select: Visually judge distance
>            Use distance reported by surface radar
>            Receive estimated distance from bow watch
>            Confer with commanding officer, pilot, or OOD]" (p. 63)

Each dimension of the tactical situation is assessed through multiple channels and cross-referenced. The result is not a precise measurement — it is a *calibrated estimate* with known uncertainty bounds. The expert knows "the bow is about 50 feet from the pier, plus or minus 10" rather than needing to know "47.3 feet."

**Environmental assessment**:
The conning officer physically repositions — walks to both bridge wings — to get views that update different aspects of the mental model. The port bridge wing gives the best view of the mooring side; the starboard bridge wing provides a different perspective. Physical repositioning is not incidental; it is a deliberate data acquisition strategy.

**Reference frame establishment**:
Before the ship moves, the conning officer establishes reference points that will serve as fixed anchors for subsequent motion assessment:

> "Used to determine the forward or aft motion of the ship. The conning officer will select a fixed point on the pier, such as a crate or paint marking, and will watch to see if it develops some sort of relative motion." (CCI Table 8)

The reference point converts absolute motion (hard to perceive from aboard a moving object) into relative motion (easy to perceive). This is a deliberate cognitive strategy, executed at the beginning of the evolution, that pays dividends throughout.

## How the Mental Model Is Maintained

Once established, the mental model must be updated continuously. This happens through:

**Recurring monitoring cycles**: The GOMS model explicitly flags `Complete_Assessment_Of_Ship's_Movement/Position` as a recurring goal — it appears multiple times throughout the evolution, not once. This is because the mental model's accuracy degrades over time as conditions change. Regular, systematic refresh is required.

**Anticipatory monitoring**: Before ordering an action, the conning officer predicts the expected response. After ordering the action, they monitor for the predicted response. If the actual response deviates from the predicted response, this is a signal that either the mental model is wrong or something unexpected has happened in the environment.

> "After giving these orders, the conning officer observes the response of the ship by visually watching the space between the pier and the stern. If after a few moments there is no noticeable change, or if the stern begins to swing in towards the pier, the conning officer will make adjustments to his engines." (p. 66)

The structure here is: **command → predict → observe → compare → adjust**. The comparison step is where the mental model is tested and updated.

**Distributed sensing**: The conning officer does not monitor the entire situation alone. The bow watch reports distances. The stern watch reports distances. The navigator provides position reports. The OOD monitors for surface contacts. The pilot provides local knowledge. The total mental picture is assembled from multiple distributed observers, each monitoring a specific slice of the environment.

> "The conning officer has the ability to verify the accuracy of his visual assessment on distances in a variety of ways. One way is to ask the officers stationed on the bow and stern to visually estimate the distances from their vantage point." (p. 63)

The distributed sensing network functions as a extended perceptual system — the conning officer's mental model is fed by sensors at different locations than the conning officer's physical position.

## The Moment When Mental Model and Reality Diverge

The most dangerous moment in pier-side ship-handling is when the conning officer's mental model diverges from the actual situation — when they believe the stern has cleared the pier but it hasn't, when they believe the rate of swing is manageable but it has accelerated, when they believe the tug is available but it has lost its line.

Several features of the expert's approach are specifically designed to catch divergence before it becomes catastrophic:

**Multiple independent confirmations for high-consequence states**: The closer the ship gets to the pier, the more frequently the conning officer checks the critical distances and the more independent channels they use. Assessment frequency scales with consequence.

**Explicit comparison with expectations**: After every action, there is a monitoring pause to confirm the action produced the expected effect. Deviation from expectation is a divergence signal.

**Physical repositioning for fresh perspective**: Moving from bridge wing to pilot house and back provides a new viewing angle on the same situation — sometimes revealing aspects of the situation that were invisible from the previous position.

**Consultation with independent observers**: Asking the stern watch, the bow watch, the OOD, and the pilot for their assessment provides independent data points that can reveal divergence the conning officer's primary perspective misses.

**Conservative assessment bias**: When uncertain, the conning officer assumes worse conditions than observed — more current, less clearance, faster momentum. This creates a built-in margin between actual conditions and the threshold for corrective action.

## What "Anticipate" Means in Expert Practice

The thesis uses the word "anticipate" in a specifically technical sense:

> "He must be able to anticipate what action must be taken next and immediately recognize when something appears incorrect." (p. 36)

Anticipation in expert ship-handling is not prediction of the future from scratch. It is the recognition that the current state of the mental model implies a specific trajectory — and that if the trajectory is followed without intervention, a specific undesired state will result. Anticipation is the recognition of an *implication* of the current mental model.

This is why the mental model must include not just current state but *dynamics* — not just "where is the ship" but "where is the ship going and at what rate." A ship that is 50 feet from the pier and moving away is in a very different situation than a ship that is 50 feet from the pier and moving toward it at 2 knots. The state description is identical in one dimension; the dynamic state is opposite.

Expert anticipation is computationally efficient because it doesn't reason from first principles at each moment — it maintains a running estimate of the trajectory and monitors for deviations from an acceptable trajectory. When the trajectory begins to approach an unacceptable region, intervention is triggered before the boundary is crossed.

## Agent System Implications

### Situational Awareness as a First-Class Concern

Most agent task specifications focus on *what to do*. The ship-handling expert's practice suggests that *maintaining an accurate model of the current situation* is at least as important as knowing what to do. An agent with perfect procedural knowledge but inaccurate situation assessment will execute the right actions at the wrong times or in the wrong conditions.

For complex agent tasks, the specification should include:
- What model of the current state the agent maintains
- How frequently the model is updated
- Which signals trigger model updates
- How the agent detects divergence between its model and actual state
- What the agent does when divergence is detected

### The Command-Predict-Observe-Compare-Adjust Loop

The conning officer's monitoring pattern — command → predict → observe → compare → adjust — is a universal pattern for reliable action in uncertain environments. For agent skills that invoke external actions (API calls, database writes, file system operations, external service calls), this loop should be explicitly implemented:

1. **Command**: Invoke the action
2. **Predict**: Specify the expected outcome (in the skill specification, not improvised at runtime)
3. **Observe**: Monitor the actual outcome through channels independent from the action invocation
4. **Compare**: Detect deviation between predicted and observed
5. **Adjust**: Invoke correction protocol when deviation exceeds threshold

Most agent implementations do only steps 1 and 3. Steps 2, 4, and 5 are where reliability is built.

### Distributed Sensing and Aggregation

The conning officer's distributed sensing network — bow watch, stern watch, navigator, OOD, pilot — maps onto a multi-agent sensing architecture. In agent systems, this corresponds to:
- Parallel information gathering from multiple specialized sources
- A synthesis agent that aggregates and reconciles the gathered information
- A confidence weighting scheme that accounts for the reliability of each source in the current context
- An escalation protocol when sources disagree beyond a threshold

The synthesis function — building a coherent situational model from multiple partial, sometimes conflicting inputs — is not trivial. It is one of the more cognitively demanding aspects of the conning officer's role, and it requires explicit design in agent systems.

### Conservative Bias When Uncertain

The expert's tendency to assume worse conditions than observed when uncertain is a specific epistemic policy that can be directly implemented: when multiple channel readings disagree about a state, use the more conservative (more dangerous) estimate for planning purposes.

This policy has a cost: sometimes it leads to more cautious action than necessary, wasting time or resources. But its benefit — avoiding the catastrophic consequence of acting on an overly optimistic estimate — typically justifies the cost in high-consequence domains.

For agent systems operating in consequential domains, the uncertainty-to-action policy should be explicit: "when uncertain about [state X], assume [more conservative value] for the purpose of planning [action Y]."