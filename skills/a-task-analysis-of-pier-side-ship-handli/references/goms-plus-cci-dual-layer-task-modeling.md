# Dual-Layer Task Modeling: GOMS Procedures + Critical Cue Inventories

## The Problem GOMS Solves

The GOMS (Goals, Operators, Methods, Selection Rules) framework, developed by Card, Moran, and Newell, provides a rigorous notation for decomposing expert task performance into hierarchical goal structures. As Grassi explains:

> "GOMS is a useful method for describing a specific task through the specification of the procedures a user must perform to successfully complete the task. GOMS is based on the principle that behavior can be described as a model using four constructs: Goals, Operators, Methods, and Selection Rules." (p. 17)

The four constructs map cleanly onto a hierarchical task decomposition:
- **Goals**: Desired final states ("Get Ship Safely Underway From Pier")
- **Operators**: Actions or subgoals used to achieve goals (engine orders, rudder commands, line-handling orders)
- **Methods**: Procedural sequences of operators ("give verbal rudder order: direction + angle + verbal delivery + confirmation + execution check")
- **Selection Rules**: Conditions under which one method is chosen over alternatives ("Use Left Rudder if moored on port side")

This creates a model that looks like a well-structured program: a tree of conditional procedures with explicit branching logic. It is readable, modifiable, and teachable. For systems design purposes, it is excellent.

The GOMS approach offers specific advantages for agent system design:

> "GOMS is also quite flexible. Allowing easy modifications to its structure and layout once changes occur, GOMS affords flexibility for the various stages of refinement during the knowledge elicitation process." (p. 18-19)

This flexibility is critical in agent systems where task definitions evolve as understanding deepens.

## The Problem GOMS Cannot Solve

Despite its power, GOMS has a fundamental limitation that the thesis identifies precisely:

> "One area in particular is GOMS' inability to predict problem-solving behavior. What this means is that although it can predict what the sequence of operators will be for a given task and present it in a structured manner, it has problems explaining what the expert was thinking when accomplishing each task." (p. 19)

More specifically:

> "A GOMS model may show that an expert ship driver may take the action of shifting his rudder because he observed the distance between the ship and pier decreasing. However, what the GOMS model fails to show is what perceptual cues or implicit knowledge the conning officer was using to determine the change in distance." (p. 19-20)

This is the critical gap. GOMS shows *what* was done and *what triggered the decision* at the level of abstract state description ("distance decreasing"). But it does not show *how the operator perceives* whether the distance is decreasing — what they look at, what they compare it to, what sensory signal tells them the trend has crossed a threshold.

For a human trainee, this means they know they should act when "the distance starts decreasing" but have no idea what that looks like from a bridge wing fifty feet above the waterline. For an AI agent, it means the decision tree has a leaf node that says "IF distance_decreasing THEN shift_rudder" but no specification of what observable signals constitute "distance_decreasing" in the actual environment.

## The Critical Cue Inventory as Complementary Layer

The solution the thesis proposes is a **Critical Cue Inventory** (CCI) that supplements the GOMS model:

> "Critical Cue Inventories (CCI) were then developed to supplement the GOMS model by providing a list of the cues used along with detailed descriptions of why the cue was used and how it was visually or audibly identified." (Abstract, p. v)

Each CCI entry consists of:
1. **The cue category** (what type of signal)
2. **A description** of what the expert actually observes
3. **Why this cue is used** (what state of the world it indicates)
4. **How it is identified** (the specific perceptual operation)

Consider the CCI entry for assessing whether the ship's stern is clear of the pier:

> "Used to determine distance between stern of ship and pier. The conning officer will get an estimated initial distance between stern and pier by looking at the space between the edge of the stern and the side of the pier. Usually, the conning officer will compare the distance of the space with a known visual reference, such as the ship's brow, which is the metal walkway used by personnel to embark and disembark the ship. For example, if the brow is currently in place and is approximately 16 feet in length, the conning officer can then determine an initial distance for the open space before the ship begins to move is around 16 feet." (p. 108)

This is extraordinarily specific. It describes:
- **What to look at** (the open space between the edge of the stern and the side of the pier)
- **How to calibrate the perception** (compare to a known reference: the brow, ~16 feet)
- **What the observation means** (an estimate of clearance distance)

Without this CCI entry, a trainee (human or AI) has no way to operationalize the abstract instruction "check that the stern is clear."

## The Architecture: How the Two Layers Interlock

The thesis demonstrates a specific integration architecture that is directly applicable to agent system design:

**Layer 1: GOMS Procedure Tree**
- Hierarchical goal decomposition
- Selection rules for branching
- Explicit operator sequences
- Annotations (italics in the thesis) marking where CCI entries apply

**Layer 2: Critical Cue Inventory**
- Indexed to specific GOMS nodes (each CCI is titled with the Phase and Subgoal it applies to)
- Describes the perceptual operations that *enable* the GOMS decisions
- Multiple cue options for the same state (redundancy and fallback)

This architecture appears throughout the task analysis. For example, the GOMS model contains: