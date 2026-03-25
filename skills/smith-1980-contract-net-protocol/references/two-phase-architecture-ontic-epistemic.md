# Two-Phase Architecture: Separating Ontic Actions from Epistemic Actions

## The Architectural Division

The Big Brother Logic demonstration enforces a clear separation between two types of interaction:

"The interaction is divided in two phases:

| Phase | Turn cameras | Move ball | Add/remove hats | Check property | Announce formula |
|-------|--------------|-----------|-----------------|----------------|------------------|
| Initialization | X | X | X | X | |
| Communication | | | | X | X |

This isn't just a UI design choice—it reflects a fundamental distinction in multi-agent systems between **ontic actions** (changing the world) and **epistemic actions** (changing knowledge about the world).

## Ontic vs. Epistemic Actions

**Ontic actions** change facts about the world:
- Moving the ball changes its position
- Adding a hat changes which cameras wear hats
- Rotating a camera changes what it currently observes

These actions modify the actual world state. If we model the world as having properties like "ball_at_position(X, Y)" or "camera_wearing_hat(A)", ontic actions change the truth values of these properties.

**Epistemic actions** change what agents know without changing world facts:
- Announcing "the ball is in the northeast quadrant" doesn't move the ball
- Checking a property doesn't alter anything
- Public announcement eliminates possible worlds from consideration but doesn't change the actual world

These actions modify knowledge states. They change which possible worlds agents consider live, but they don't change which world is actual.

## Why Separation Matters

The two-phase architecture enforces: first establish the world state (initialization), then reason about knowledge of that state (communication).

This prevents problematic sequences like:
1. Announce "the ball is at position (5, 3)"
2. Move the ball to position (7, 2)
3. Cameras still believe it's at (5, 3) because that was announced

The separation ensures announcements describe a stable world state rather than a changing one.

## The Challenge of Mixing Phases

The authors explicitly identify this limitation: "In order to being able to mix ontic and communicative actions, we plan to allow use revision instead of public announcement and belief instead of knowledge."

Why is mixing problematic? Because public announcements permanently restrict the model:
- M^φ eliminates all worlds where φ is false
- This restriction is permanent (in standard epistemic logic)
- If φ was "ball at X" but the ball moves, the model is now wrong

The agents continue believing φ (it was announced, therefore common knowledge) even though φ is no longer true.

## Solutions: Belief Revision and Dynamic Epistemic Logic

The authors point toward two solutions:

**1. Belief instead of knowledge**
- Knowledge is true belief that cannot be false
- Belief can be mistaken
- Agents have beliefs that can be revised when contradicted

**2. Revision instead of announcement**
- Announcement permanently adds φ to common knowledge
- Revision updates beliefs when new evidence arrives
- AGM belief revision or similar frameworks

With these extensions:
1. Announce "ball at X" → agents believe ball at X
2. Move ball to Y
3. Sensor observation contradicts "ball at X" → agents revise belief to "ball at Y"

This requires a more sophisticated epistemic framework than simple Kripke models with public announcements.

## Dynamic Epistemic Logic

The formal framework for mixing ontic and epistemic actions is called Dynamic Epistemic Logic (DEL). It includes:

- Ontic updates: model transformations that change facts
- Epistemic updates: model transformations that change knowledge
- Product updates: combinations of both

In DEL, an action is a pair (preconditions, effects) where:
- Preconditions are epistemic (what must be known for action to be applicable)
- Effects can be ontic (change world), epistemic (change knowledge), or both

Example action: "Agent A picks up the ball if A sees it"
- Precondition: KA(ball_at_X) (A knows where ball is)
- Effect: ball_held_by(A) AND ¬ball_at_X (world change)
- Epistemic effect: Everyone observing A sees the pickup (knowledge change)

The Big Brother Logic demonstration implements a subset of DEL: pure epistemic actions (announcements) after a fixed ontic state (initialization). Full DEL would allow interleaving.

## Temporal Dimension: Sequences of Actions

The two-phase architecture is also sequential in time:
- Phase 1 happens first (setup the world)
- Phase 2 happens after (reason about it)

For dynamic environments, we need temporal reasoning:
- At time t0: ball at position P1
- At time t1: announce "ball at P1" (creates knowledge)
- At time t2: move ball to P2 (invalidates previous announcement)
- At time t3: cameras observe discrepancy, revise beliefs

This requires epistemic temporal logic: formulas can reference knowledge at different times, and knowledge evolution over time.

The authors acknowledge this: "As a long-term project, we plan to build a logical framework for planning involving temporal and epistemic properties (that is, epistemic properties may be invariants, objectives etc.)."

## Epistemic Invariants vs. Temporary Knowledge

The two-phase distinction maps to:

**Invariants** (things that don't change after initialization):
- Camera positions
- Field of view angles
- Object identities

These can be known permanently—no revision needed.

**Temporary facts** (things that change):
- Camera orientations (controllable)
- Object positions (if movable)
- Observable properties (hats can be added/removed)

Knowledge of these requires ongoing observation or revision when they change.

For agent system design: distinguish invariant knowledge (configuration, capabilities, identities) from transient knowledge (state, status, current values). Invariants can be announced once; transients require continuous updating.

## The Cost of Dynamic Updates

Mixing ontic and epistemic actions has computational costs:

**Static model (two-phase):**
- Build model once during initialization
- Perform epistemic reasoning on stable model
- No need to rebuild after each action

**Dynamic model (mixed actions):**
- After each ontic action, model must be updated
- Vision sets may change (if cameras or objects moved)
- Accessibility relations may change (if observations change)
- Epistemic properties must be re-evaluated

This is why the demonstration separates phases: it makes the epistemic reasoning tractable by reasoning over a fixed configuration.

## Application to Agent Orchestration

**1. Separate Configuration from Operation**

Like the initialization/communication split:
- Configuration phase: Deploy agents, assign capabilities, establish communication channels
- Operation phase: Execute tasks, coordinate, share information

Treat configuration as ontic (setting up the world), operation as epistemic (reasoning within that world).

**2. Immutable Infrastructure**

Some aspects of agent systems should be immutable during operation:
- Agent identities and capabilities (initialization-time fixed)
- Security policies (rarely changed)
- Communication topology (stable)

Others are dynamic:
- Task assignments (continually updated)
- Agent state (constantly changing)
- Knowledge and beliefs (evolving with observations)

The two-phase model suggests: make the immutable aspects truly immutable, so reasoning about them is simplified.

**3. Checkpoint-and-Execute Pattern**

For complex operations:
1. Checkpoint: Establish stable world state, announce invariants
2. Execute: Perform actions assuming checkpointed invariants
3. Re-checkpoint: When world changes significantly, establish new stable state

This creates discrete phases where epistemic reasoning is tractable (during execution within a checkpoint) versus continuous adaptation (re-checkpointing when the world shifts).

**4. Belief Invalidation Triggers**

In systems that mix ontic and epistemic:
- Monitor for ontic actions that invalidate epistemic states
- When detected, trigger belief revision
- Propagate revisions to affected agents

Example: If agent A's knowledge depends on "service X is healthy," and service X fails (ontic action), trigger revision of A's beliefs.

**5. Epistemic Preconditions for Actions**

Following DEL, make epistemic preconditions explicit:
- Action "delegate task T to agent A" requires "knows(orchestrator, capable(A, T))"
- If epistemic precondition not met, action is blocked
- This prevents acting on outdated or incorrect beliefs

## The Muddy Children Puzzle Pattern

The demonstration can simulate "the muddy children puzzle and the prisoners' puzzle." These are classic epistemic puzzles with a specific pattern:

1. **Initialization**: Establish who has mud (ontic fact)
2. **Observation**: Children observe others but not themselves
3. **Announcement**: "At least one child has mud" (epistemic action)
4. **Reasoning**: Children deduce their state from others' responses
5. **Iterated elimination**: Multiple rounds of reasoning

This is pure epistemic reasoning over a fixed ontic state. The children don't wash (no ontic actions after initialization), they just reason.

The two-phase architecture is perfect for this: initialize the mud configuration, then perform epistemic actions (announcements, reasoning) without ontic changes.

But real-world scenarios rarely have this property. If children could wash their faces (ontic action), the epistemic reasoning must account for this possibility.

## Future Direction: Integrated Ontic-Epistemic Planning

The authors' long-term vision: "build a logical framework for planning involving temporal and epistemic properties."

This would enable:
- Plans with both ontic and epistemic goals
- Actions that deliberately change knowledge states
- Temporal epistemic properties as invariants ("always everyone knows X") or objectives ("eventually common knowledge of Y")

Example integrated plan:
1. Rotate camera A to observe region R (ontic action)
2. Wait for A to observe (time passes)
3. This creates KA(contents(R)) (epistemic effect)
4. Announce contents(R) publicly (epistemic action)
5. Creates common knowledge of contents(R) (epistemic goal achieved)

Each step has both ontic and epistemic aspects, tightly integrated.

## Philosophical Implications

The two-phase architecture reflects a deeper philosophical point: **the world and knowledge of the world are distinct**.

- Ontic: What is actually true
- Epistemic: What is believed/known to be true

These can diverge:
- Something can be true but unknown (ball is at X, no camera sees it)
- Something can be believed but false (announced "ball at X," actually at Y)

Multi-agent systems must track both:
- The actual state (ground truth)
- Each agent's believed state (may differ from ground truth, may differ from each other)

The two-phase architecture forces explicit management of this distinction: first establish ground truth (initialization), then manage beliefs about it (communication).

Systems that blur this distinction—where agents' beliefs are treated as facts, or where facts change without belief updates—exhibit epistemic bugs that are hard to diagnose.

## Practical Takeaway for Agent Systems

The Big Brother Logic's two-phase architecture teaches:

**Separate what changes from what's known about what changes.**

In implementation:
- Maintain ground truth state separately from agents' belief states
- Track which agents know which facts
- When ground truth changes (ontic action), explicitly propagate updates to relevant belief states
- When beliefs change (epistemic action), don't confuse this with ground truth changing

This separation makes the system's epistemic architecture visible and debuggable. You can ask:
- What's the actual state?
- What does agent A believe the state is?
- Why do they differ?

Without this separation, epistemic bugs manifest as coordination failures that seem mysterious—agents acting on inconsistent views without any way to diagnose why their views diverged.

The two-phase model is a simplification (real systems need mixed ontic-epistemic dynamics), but it's a clarifying simplification that makes epistemic reasoning tractable. Start with the two-phase model, then carefully add dynamic mixing only where necessary, with explicit belief revision mechanisms.