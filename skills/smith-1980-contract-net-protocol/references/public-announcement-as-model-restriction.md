# Public Announcements as Model Restriction: How Communication Eliminates Possible Worlds

## The Radical Insight: Communication Constrains Rather Than Adds

In most treatments of multi-agent communication, we think of messages as *adding information*: agent A sends data to agent B, and now B knows something it didn't before. The epistemic logic framework implemented in Big Brother Logic offers a fundamentally different perspective.

As the authors describe: "After the positions of the cameras are ﬁxed, the position of the ball is ﬁxed and the hats are ﬁxed, she can make public announcements of a property φ... The current model M is replaced by the updated model M^φ that is the subgraph of M made up of the worlds u such that M, u |= φ."

This is not adding information—it's **eliminating possible worlds**. The model becomes smaller, more constrained, more definite. Communication reduces uncertainty not by adding facts but by cutting away incompatible possibilities.

## The Kripke Model Structure

To understand this, we need to understand what "the model M" represents. In epistemic logic, a Kripke model consists of:

- A set of possible worlds (different ways things might actually be)
- For each agent, an accessibility relation (which worlds the agent considers possible)
- A valuation (which atomic propositions are true in which worlds)

The actual world is one point in this model, but agents don't know which point. Their knowledge consists of narrowing down the possibilities.

In the Big Brother Logic system, "we browse the inferred Kripke model on the ﬂy." The model M0 represents "all possible angle assignments to the cameras." Each world in M0 corresponds to a different configuration of where the cameras are pointing.

An agent (camera) knows a proposition φ if φ is true in *all* worlds that agent considers possible. If there's even one possible world where ¬φ holds, the agent doesn't know φ.

## What Public Announcement Does

When formula φ is publicly announced:

**Before**: Model M contains worlds where φ is true and worlds where φ is false
**After**: Model M^φ contains *only* worlds where φ is true

The worlds where φ is false are simply deleted. They are no longer under consideration.

**Crucially, this happens for all agents simultaneously**. Every agent eliminates the same worlds. This is what makes the announcement "public"—not just that everyone hears it, but that everyone knows everyone heard it, knows everyone eliminated the same worlds, knows everyone knows everyone eliminated the same worlds, and so on.

This is how public announcement creates common knowledge in a single step.

## Example: The Hat Puzzle

The demonstration can "simulate the muddy children puzzle and the prisoners' puzzle." Let's trace through how public announcement would work in a variant:

Setup:
- Three cameras: a, b, c
- Some cameras wear hats, some don't
- Each camera can see the others but not itself
- Question: Does each camera know whether it wears a hat?

Initial epistemic state:
- 2^3 = 8 possible worlds (each camera either has hat or not)
- Camera a can see b and c, so a can distinguish 4 possibilities: {b has hat, c has hat}, {b has hat, c no hat}, {b no hat, c has hat}, {b no hat, c no hat}
- But a cannot distinguish between {a has hat, b has hat, c has hat} and {a no hat, b has hat, c has hat}—they look identical from a's viewpoint

Public announcement 1: "At least one camera wears a hat"

This eliminates the world {no one has hat}. Now M^φ contains 7 worlds instead of 8.

If exactly one camera has a hat, that camera still doesn't know which one—suppose a has the hat but b and c don't. From a's perspective, a sees b and c without hats, which is compatible with either "a has hat" or "a no hat" (if a no hat, then the announcement would be false, but a might not realize this).

Public announcement 2: "No one announced they know whether they have a hat"

This is the clever part. If only one camera had a hat, it would have deduced it from announcement 1 (since it sees no other hats). The fact that no one announced knowledge means there must be multiple hats.

This announcement doesn't directly state a fact—it states that a certain epistemic condition holds, and this constrains the model further.

After several rounds, cameras deduce their hat status not from direct observation but from the pattern of who knows what when.

## The Formula as a Restriction Operator

Mathematically, the announcement operator [φ] acts as a filter:

- M^φ = {w ∈ M : M, w ⊨ φ}

It's a subset operation on the model. The critical properties:

1. **Idempotence**: Announcing φ twice has the same effect as announcing once
2. **Monotonicity**: If φ implies ψ, then M^φ ⊆ M^ψ  
3. **Knowledge accumulation**: After announcing φ, it becomes common knowledge
4. **Irreversibility**: Worlds once eliminated cannot be recovered (unless using belief revision)

## Contrast with Private Communication

Private communication (agent a tells agent b that φ) is fundamentally different:

- Only b's accessibility relation changes
- Other agents don't know b learned φ
- No common knowledge is created
- The model structure becomes asymmetric

The Big Brother Logic focuses on public announcements because they create common knowledge, which enables the coordination patterns discussed earlier.

For agent systems: private messages are cheaper but less powerful for coordination. Public announcements (broadcast messages, shared state updates) are expensive but enable stronger coordination.

## The Interaction Between Observation and Announcement

Here's where the camera scenario becomes sophisticated. The demonstration has two phases:

**Initialization phase**: Cameras are positioned, ball is placed, hats are added/removed
**Communication phase**: Formulas are announced

In the initialization phase, agents acquire knowledge through observation (geometric perception). In the communication phase, they acquire knowledge through announcement (explicit communication).

But these interact in complex ways. Consider:

- Initial state: a can see b and c
- Announcement: "The ball is in the northeast quadrant"
- If a sees c pointing northeast, a can now deduce that c sees the ball
- This deduction wasn't possible before the announcement

The announcement doesn't directly tell a anything about c's observations, but by constraining the possible worlds (eliminating those where the ball isn't in the northeast), it makes a's observation of c more informative.

This is the interaction between **ontic facts** (where things are) and **epistemic facts** (what agents know). Announcements about ontic facts change epistemic possibilities.

## Implementation: On-the-Fly Model Checking

The authors note: "we browse the inferred Kripke model on the fly and we evaluate the formula."

This is important: they don't enumerate all possible worlds explicitly. The possible world space is exponential in the number of cameras and their possible orientations. Instead, they compute reachability: given the current world w and agent a's observational constraints, which worlds are accessible to a?

When a formula is announced, worlds are filtered lazily: the next model-checking operation only considers worlds compatible with all previous announcements.

This is a practical implementation pattern: don't maintain the full Kripke model explicitly. Maintain the current world and compute accessibility relations on demand, filtered by announced constraints.

## The Limits: Mixing Ontic and Epistemic Actions

The authors identify a key limitation: "In order to being able to mix ontic and communicative actions, we plan to allow use revision instead of public announcement and belief instead of knowledge."

The problem: announcements are permanent constraints in the knowledge model. But if actions can change the world, previously announced facts might become false.

Example sequence:
1. Announce: "The ball is at position X"
2. (Someone moves the ball)
3. Agents still believe "the ball is at position X" because it's been announced

The model M^φ has been restricted by φ, but if φ was "ball at X" and the ball has moved, the restricted model is now incorrect.

Solutions require moving from:
- **Knowledge** (absolutely true belief) to **Belief** (can be mistaken)
- **Public announcement** (permanent) to **Belief revision** (retractable)

This is the difference between static epistemic logic (facts don't change) and dynamic epistemic logic with belief revision (facts can change, beliefs must update).

## Design Implications for Agent Systems

**1. Use Announcements to Create Epistemic Invariants**

When certain facts should be commonly known and won't change, broadcast them publicly. This creates stable common knowledge that enables coordination.

Example in WinDAGs: "The current task queue contains tasks T1, T2, T3" announced to all agents means everyone knows the queue state, everyone knows everyone knows it, enabling decentralized decisions about task claiming.

**2. Model Announcement History as Constraints**

Track not just current state but the sequence of announcements. Each announcement permanently constrains the possibility space (until revision).

Implementation: maintain a log of announced formulas. Model-checking or planning algorithms should respect the conjunction of all announced constraints.

**3. Distinguish Retractable and Irretractable Announcements**

Some announcements represent permanent facts: "Agent A's ID is 12345"
Others represent transient facts: "Agent A is currently idle"

The first can use pure public announcement (permanent model restriction).
The second needs belief revision (temporary model restriction, subject to updates).

**4. Leverage Announcement for Synchronization**

Public announcements create common knowledge in one step. Use this for synchronization points:

- Announce "Phase 1 complete" — all agents know all agents know this
- Announce "Switching to strategy B" — all agents switch simultaneously
- Announce "Agent C has failed" — all agents update their plans consistently

Without public announcement, achieving this synchronization requires multiple message rounds and explicit acknowledgments.

**5. Be Aware of Announcement Costs**

In distributed systems, broadcast is expensive:
- Network bandwidth (message to all agents)
- Processing cost (all agents must update their models)
- Coordination overhead (ensuring all agents receive)

Use public announcement when common knowledge is genuinely needed, not as a default communication pattern.

**6. Model-Restriction vs. Information-Addition Semantics**

Traditional agent messaging: "Here's a new fact"
Public announcement semantics: "Here's a constraint on possible worlds"

The second is more powerful for reasoning about knowledge, but requires maintaining a model of possibilities. 

For WinDAGs: when epistemic properties matter (does everyone know X? does anyone know Y?), use announcement semantics. When just sharing data, use simpler message-passing.

## The Deep Pattern

The fundamental insight is that **uncertainty is a space, and communication carves it down**. Before communication, many possibilities are live. After communication, fewer possibilities remain. Knowledge increases not by accumulation but by elimination.

This inverts the usual mental model of learning as adding to a knowledge base. Instead, learning is constraining a possibility space until only the truth remains.

For agent systems reasoning about their own knowledge and others' knowledge, this model-restriction semantics is essential. It makes epistemic reasoning precise: checking whether an agent knows φ means checking whether φ holds in all worlds accessible to that agent—checking whether all possibilities compatible with their observations satisfy φ.

The Big Brother Logic demonstrates this concretely: agents (cameras) have geometric observations that constrain possibilities, and public announcements further constrain them, until epistemic properties (common knowledge, distributed knowledge) can be verified.