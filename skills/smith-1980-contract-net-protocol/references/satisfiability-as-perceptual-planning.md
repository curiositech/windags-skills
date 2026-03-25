# Satisfiability as Perceptual Planning: Arranging Sensors to Achieve Epistemic Goals

## Beyond Model Checking: The Inverse Problem

Most applications of epistemic logic focus on model checking: given a configuration of agents and their observations, does property φ hold? The Big Brother Logic system implements something more ambitious: **given a desired epistemic property φ, arrange the agents so that φ becomes true**.

As the authors describe: "The satisﬁability problem consists in turning the cameras so that a given property is satisﬁed... For more information about the procedure for the satisﬁability problem, the reader may refer to [1]."

And in the demonstration architecture: "the satisﬁability problem procedure will modify the angles of the cameras in order to satisfy a speciﬁcation."

This transforms epistemic logic from a descriptive tool (does agent A know X?) into a prescriptive tool (how should we position agents so that A knows X?).

## The Controllable vs. Fixed Distinction

The key architectural constraint is the distinction between what can be changed and what cannot:

"Cameras are located in the plane... with ﬁxed position and angle of view, but rotating freely."

**Fixed**: Camera positions, field of view angles
**Controllable**: Camera orientations (rotation)

This asymmetry is realistic. In deployed sensor networks:
- You can't move the sensors (installation is permanent)
- You can't change their sensing capabilities (hardware is fixed)
- You can control where they point (orientation is adjustable)

The satisfiability problem must work within these constraints: find an orientation assignment that makes φ true, or determine that no such assignment exists.

## What Makes a Epistemic Property Satisfiable?

Consider different types of epistemic goals:

**Type 1: Simple observation**
- Goal: "Camera a sees the ball"
- Satisfiable if: The ball is within range of a's field of view
- Solution: Point a toward the ball

**Type 2: Knowledge about others' observations**
- Goal: "Camera a knows that camera b sees the ball"  
- Satisfiable if: a can observe b, and b can be pointed at the ball
- Solution: Point a toward b, point b toward ball, ensure a can determine b's orientation

**Type 3: Distributed knowledge**
- Goal: "It's distributed knowledge among {a, b} that c sees the ball"
- Satisfiable if: Either a or b can observe c, and c can see the ball
- Solution: Point c at ball, point at least one of {a, b} toward c

**Type 4: Common knowledge**
- Goal: "It's common knowledge among {a, b} that c sees the ball"
- Satisfiable if: a and b can mutually observe each other observing c, and c can see ball
- Solution: Point c at ball, point a at both b and c, point b at both a and c, creating mutual observation of observation

The complexity increases with epistemic nesting depth. Type 4 requires careful geometric arrangement where agents can observe each other's observations.

## The Restriction to Epistemic Formulas

Importantly: "We here restrict the language by avoiding constructions ab since we can not move the ball."

The satisfiability problem can only control what's controllable—camera orientations. It cannot move the ball or other objects. So formulas like "ab" (camera a sees ball) can only be made true if the ball happens to be positioned where a can see it by rotating.

This is a crucial constraint for any planning problem: you can only control the variables you can actually modify. The satisfiability solver must work within the degrees of freedom available.

For agent systems: clearly distinguish between:
- **Controllable variables**: What the system can change (task assignment, agent allocation, attention)
- **Exogenous variables**: What the system must work around (available resources, external events, user inputs)

## Geometric Satisfiability Checking

The computational problem is geometric in nature:

Given:
- Fixed positions P = {p1, ..., pn} for n cameras
- Fixed field-of-view angles FOV = {fov1, ..., fovn}
- Position of objects (ball, other landmarks)
- Desired epistemic property φ

Find:
- Orientations O = {θ1, ..., θn} such that the configuration satisfies φ

Or determine that no such assignment exists.

The vision sets play a crucial role: "from the vision sets and the set of cameras that see the red ball, we browse the inferred Kripke model on the ﬂy."

The vision sets (all possible combinations of what each camera could see) define the search space. The satisfiability algorithm searches over this space for an assignment that makes φ true in the resulting Kripke model.

## The Computational Challenge

This is not a simple constraint satisfaction problem because:

1. **Epistemic nesting**: Evaluating whether "a knows that b knows that c sees the ball" requires modeling nested accessibility relations
2. **Interdependence**: Changing a's orientation affects what a knows, which affects whether properties about a's knowledge hold
3. **Common knowledge**: Checking common knowledge requires fixpoint computation (does everyone know, does everyone know everyone knows, etc.)
4. **Geometric constraints**: Valid orientations must respect physical limitations

The authors note this is an active research area: "Eﬃcient algorithms for such features are not yet completely established."

## Contrast with Traditional Path Planning

Traditional robot planning: Find a sequence of actions (move forward, turn left, grab object) that achieves a goal state (robot at target location with object).

Epistemic planning: Find a configuration of observations that achieves a knowledge state (agent A knows property X, or it's common knowledge that Y).

The difference:
- Traditional planning operates in state space (physical configurations)
- Epistemic planning operates in knowledge space (epistemic configurations)

But in the Big Brother Logic, epistemic planning grounds out in geometric planning: to achieve knowledge states, we manipulate physical orientations.

This is the bridge between abstract epistemic logic and concrete control problems.

## Application to Agent System Orchestration

**1. Task Assignment as Epistemic Planning**

In a multi-agent system, assigning tasks to agents can be viewed as an epistemic planning problem:

Goal: Every task is assigned to an agent who knows how to execute it, and knows that no other agent is executing it.

This is an epistemic property. The satisfiability question: how should we route tasks (assign agents' "attention") to achieve this knowledge state?

**2. Sensor Allocation**

In systems where agents control sensing resources (database queries, API calls, monitoring streams):

Goal: Agent A knows the status of service X, agents {B, C} have distributed knowledge about the dependency graph.

The satisfiability problem: which agents should monitor which resources (point their "cameras") to achieve this epistemic state?

**3. Information Architecture Design**

When designing what information agents should have access to:

Goal: It's common knowledge among frontend agents that the backend API contract is X.

Satisfiability question: how should we structure information sharing (observability) so this becomes common knowledge?

**4. Debugging Epistemic Failures**

When coordination fails, it's often an epistemic failure: agents don't know what they need to know.

The satisfiability solver can diagnose: "Given our current observable architecture, is it even possible for agent A to know property X?"

If unsatisfiable, the architecture must change—no amount of tuning will fix an epistemic impossibility.

## The Limits: What Can't Be Satisfied by Orientation Alone

Some epistemic properties are unsatisfiable given fixed positions:

**Impossible due to position constraints:**
- "Camera a sees region R" where R is outside a's maximum range
- "Cameras {a, b} mutually observe each other" where they're positioned back-to-back

**Impossible due to object constraints:**
- "Camera a sees the ball" if the ball is behind an obstacle from a's position
- "It's common knowledge that the ball is red" if no camera can see the ball

**Impossible due to epistemic depth:**
- "It's common knowledge among all cameras that X" if some cameras can't observe others
- Complex nested knowledge that requires observation chains that don't exist

The satisfiability solver must detect these impossibilities and report "unsatisfiable" rather than searching forever.

For agent systems: distinguish between:
- **Satisfiable but not yet satisfied**: Need to reconfigure
- **Unsatisfiable given architecture**: Need to redesign
- **Satisfiable in principle but computationally intractable**: Need to approximate

## Example: Achieving Common Knowledge Through Mutual Observation

Let's trace through a concrete satisfiability problem:

**Goal**: Make it common knowledge among {a, b, c} that the ball is at position P.

**Requirements for common knowledge:**
1. All cameras must know ball is at P
2. All must know that all know
3. All must know that all know that all know
4. Etc.

**Geometric solution:**
1. Position a, b, c such that all can see position P
2. Point all three cameras so they can see:
   - Position P (to observe the ball)
   - The other two cameras (to observe their orientations)
3. Ensure all cameras can determine from observation that others are also looking at P

If the fixed positions allow this arrangement, the satisfiability solver finds orientations that achieve it. If not (e.g., cameras are positioned so they can't all see P and each other), it reports unsatisfiable.

## The Planning Aspect

"Turning the cameras so that a given property is satisﬁed" is a form of planning:

**Planning domain**: Orientation assignments
**Actions**: Rotate camera a to angle θ
**Goal**: Epistemic formula φ
**Plan**: Sequence of rotations that achieves φ

In the demonstration, this appears instantaneous (the system computes the satisfying assignment and moves cameras there), but conceptually it's a planning problem.

For complex environments with:
- Occlusions (moving objects that block views)
- Moving targets (ball that moves)
- Dynamic agents (cameras that move)

The planning problem becomes temporal: find a sequence of actions over time that achieves and maintains the epistemic property.

The authors note this as future work: "As a long-term project, we plan to build a logical framework for planning involving temporal and epistemic properties (that is, epistemic properties may be invariants, objectives etc.)."

## Design Implications for WinDAGs

**1. Epistemic Goal Specification**

Allow specifying desired knowledge states as part of task requirements:
- "This task requires agent A to know X and agent B to know Y"
- "This workflow requires common knowledge among {agents} that phase 1 is complete"

The orchestrator then solves the satisfiability problem: how to route information so these knowledge states hold?

**2. Capability vs. Accessibility**

An agent might have the capability to observe something (has the right sensor/skill) but lack accessibility (not positioned correctly, not assigned to monitor that data source).

The satisfiability framework distinguishes:
- Fixed capabilities (like camera position and FOV)
- Controllable access (like camera orientation)

Apply to agents: distinguish what agents can potentially know from what they currently know.

**3. Epistemic Impossibility Detection**

Before executing a task plan, check epistemic satisfiability: "Given our agent architecture, can the required knowledge states be achieved?"

If unsatisfiable, the task plan is flawed at the architectural level, not just the execution level.

**4. Minimal Sufficient Observation**

The satisfiability solver finds *any* configuration that achieves φ. But often we want the *minimal* configuration:
- Fewest cameras actively observing (save energy/attention)
- Minimal field-of-view coverage (reduce noise)
- Simplest observation structure (easier to verify)

This adds optimization to satisfiability: find the least-cost configuration achieving φ.

**5. Robust Satisfiability**

In uncertain environments, satisfiability should be robust to perturbations:
- If camera orientation is slightly off, does φ still hold?
- If an object moves slightly, does the epistemic property break?

This suggests "robust satisfiability": find configurations where φ holds in a neighborhood of possible states, not just a single point.

## The Fundamental Contribution

The Big Brother Logic system demonstrates that epistemic properties—abstract statements about knowledge—can be achieved through concrete manipulation of perceptual configurations. Knowledge is not mystical; it's determined by what agents can observe, and what they can observe is determined by controllable parameters.

This makes epistemic logic actionable. Rather than just describing what agents know, we can *design* what they know by designing their observational access.

For multi-agent orchestration, this is profound: coordination problems are often epistemic problems in disguise. By framing them as satisfiability problems over epistemic formulas, we can systematically solve them by manipulating information architecture.

The cameras-in-plane scenario is a concrete instantiation, but the principle generalizes: whenever you have controllable information access (what data sources agents monitor, what messages they receive, what other agents they observe) and desired knowledge properties, you have an epistemic satisfiability problem.

Solving it means finding the information architecture that achieves the epistemic goals—or determining that no such architecture exists within your constraints.