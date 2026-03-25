# Perception as the Foundation of Agent Knowledge: Geometric Constraints on Epistemic States

## Core Insight

In most discussions of multi-agent knowledge, we abstract away from *how* agents acquire information, focusing instead on what they know once they have it. The Big Brother Logic framework inverts this: knowledge is fundamentally and exclusively derived from geometric perception. An agent knows something if and only if its perceptual apparatus—characterized by position, orientation, and field of view—allows it to observe it.

This grounding has profound implications for agent system design. As the authors demonstrate, when perception has geometric constraints, "for a given camera a, the set of all possible sets of cameras that a can see" (the "vision sets") becomes the basis for computing all possible knowledge states. This is not merely an implementation detail—it's a foundational architectural principle.

## Why Geometric Grounding Matters

In traditional epistemic logic, we might say "agent A knows proposition p" without specifying the mechanism. But in perceptually-grounded systems, knowledge arises from:

1. **Physical position**: Where is the sensing apparatus located?
2. **Orientation**: What direction is it facing?
3. **Field of view**: What geometric region can it observe?
4. **Line of sight**: What obstacles block observation?

The authors' system uses "cameras positioned in the plane, with fixed position and angle of view, but rotating freely." This creates a tractable but non-trivial epistemic space. Each camera has limited perception, but within those limits, perfect perception—they can see exactly what's in their field of view.

## The Vision Set Computation

The technical innovation here is computing vision sets: "for a given camera a, the set of all possible sets of cameras that a can see." This might seem circular—how can we know what a camera *could* see without knowing where it's pointing? The answer lies in geometric analysis.

Given:
- Fixed positions of all cameras
- Fixed field of view angles
- Free rotation capability

We can compute: for each camera A, enumerate all possible subsets of other cameras that could simultaneously be within A's field of view for *some* orientation. This creates a finite set of "possible observation configurations."

From this foundation, epistemic reasoning becomes tractable. If camera A can see cameras B and C in the current configuration, A knows everything that's true in all possible worlds consistent with "B and C are visible to A." This includes reasoning about what B and C themselves can observe.

## Implications for Agent System Design

**1. Perceptual Capability as Architectural Constraint**

When designing agent systems, we typically think of agents as having abstract "knowledge" that they share via messages. The geometric grounding suggests a different architecture: agents should be designed with explicit models of their perceptual limitations.

For a WinDAGs agent system, this means:
- Each agent should maintain a model of what it can and cannot observe
- The orchestration layer should reason about which agents are *positioned* (metaphorically or literally) to acquire needed information
- Task decomposition should consider perceptual accessibility, not just computational capability

**2. Uncertainty from Partial Observability**

In the demonstration, "we first compute the so-called vision sets, that is, for a given camera a, the set of all possible sets of cameras that a can see." This acknowledges that even with perfect sensors, partial observability creates epistemic uncertainty.

An agent that can see cameras B and C but not D faces fundamental uncertainty about what D knows. This isn't noise or sensor error—it's structural uncertainty from geometric constraints.

For agent orchestration: when decomposing problems, consider whether sub-agents will have the perceptual access needed to coordinate. If agent A must verify what agent B discovered, but A cannot observe B's workspace, no amount of computational power resolves the epistemic gap.

**3. The Difference Between Seeing and Knowing**

The system distinguishes between primitive observations and derived knowledge:
- Primitive: "a1a2" (camera a1 sees camera a2)
- Derived: "Ka(a2b)" (camera a1 knows that camera a2 sees the ball)

The derived knowledge requires reasoning: "If I see camera a2 pointed toward region R, and the ball is in region R, then a2 must see the ball, therefore I know that a2 sees the ball."

This is observing another agent's observation capability. In agent systems, this translates to: agents should model not just world state, but other agents' access to world state.

**4. Fixed vs. Controllable Perception**

The cameras have "fixed position and angle of view, but rotating freely." Position is immutable, orientation is controllable. This asymmetry is realistic: agents are often deployed in fixed configurations but can control their attention.

The satisfiability problem leverages this: "turning the cameras so that a given property is satisfied." Given a desired epistemic state (e.g., "camera A should know that camera B sees the intruder"), the system computes camera orientations that achieve it.

For agent systems: distinguish between immutable architectural constraints (which agents exist, what data sources they can access) and controllable attention (which data they're currently processing, which other agents they're monitoring).

## Boundary Conditions and Limitations

**When This Model Breaks Down:**

1. **Sensor Uncertainty**: The model assumes perfect perception within the field of view. Real sensors have noise, occlusion, and recognition failures. Extending this to probabilistic perception requires moving from knowledge to belief, as the authors acknowledge: "we plan to allow use revision instead of public announcement and belief instead of knowledge."

2. **Dynamic Environments**: The demonstration has two phases—initialization (move cameras, ball, hats) and communication (announcements only). Mixing ontic actions (changing the world) and epistemic actions (changing knowledge) in the same framework is noted as future work.

3. **Computational Tractability**: Vision set computation is tractable for cameras in a plane with fixed positions. For mobile agents in 3D space, or for very large numbers of agents, the possible world space may explode.

4. **Semantic Interpretation**: The model reasons about geometric visibility, but real perceptual systems require semantic interpretation. Knowing "there is a red object in view" differs from "there is an intruder in view"—the latter requires classification, which can fail.

## The Deep Lesson for Agent Systems

The fundamental teaching is this: **epistemic states are not abstract labels but consequences of perceptual architecture.** When designing multi-agent systems, don't ask "what does agent A know?" in the abstract. Ask:

- What can A perceive, given its position and sensors?
- What must A infer from those perceptions?
- Can A observe other agents' observations?
- How does A's uncertainty derive from its observational limits?

The authors demonstrate that when you ground knowledge in geometric perception, epistemic reasoning becomes concrete, computable, and architecturally constrained. This is the opposite of treating knowledge as magical information that agents "just have." It makes the epistemic architecture explicit and therefore debuggable, analyzable, and designable.

For orchestration systems: the routing of tasks should consider not just "which agent can solve this" but "which agent can *observe* enough to solve this, and can other agents verify their observations?" The perceptual architecture constrains the epistemic possibilities, which in turn constrains effective coordination strategies.