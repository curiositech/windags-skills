# Model Checking vs. Satisfiability: The Dual Problems of Epistemic Systems

## Two Fundamental Questions

The Big Brother Logic system implements two distinct computational problems that represent opposite directions of reasoning:

**Model Checking (Verification):**
"The user can interact with the cameras, check epistemic properties..."
Given: A configuration (world state) and a formula φ
Question: Does the configuration satisfy φ?

**Satisfiability (Synthesis):**
"The camera can also turn in order to satisfy an epistemic property."
Given: A formula φ and constraints
Question: Can we find a configuration that satisfies φ?

These are dual problems in a precise sense:
- Model checking asks: "Does this design meet requirements?"
- Satisfiability asks: "Can we design something that meets requirements?"

## Model Checking in Detail

The model checking procedure described:

"The positions of the cameras are ﬁxed and we ﬁrst compute the so-called vision sets, that is, for a given camera a, the set of all possible sets of cameras that a can see. The model checking is implemented as follows: from the vision sets and the set of cameras that see the red ball, we browse the inferred Kripke model on the ﬂy and we evaluate the formula."

Breaking this down:

**Input:**
- Physical configuration: camera positions, orientations, ball position, hat assignments
- Epistemic formula φ (e.g., "Ka(Kb(ball_visible))")

**Process:**
1. Compute vision sets for each camera (geometric calculation)
2. Determine which cameras see the ball (geometric + object detection)
3. Build Kripke model (possible worlds + accessibility relations)
4. Traverse model to evaluate φ

**Output:** 
- True/False (does the current configuration satisfy φ?)

This is verification: checking whether a given system meets a specification.

## Why Model Checking Matters

In traditional software testing, we check outputs: "Does f(x) = y?"

In epistemic model checking, we check knowledge states: "Does agent A know that agent B knows X?"

This is higher-order verification. We're not just testing behavior, we're testing what agents know about behavior, and what they know about what others know.

For multi-agent systems, this is critical. Coordination failures often stem from epistemic bugs:
- Agent A thinks B knows X, but B doesn't
- Everyone knows X individually, but there's no common knowledge
- Agent A performed action Y assuming B would observe it, but B couldn't

Model checking epistemic formulas catches these bugs: you can verify "common knowledge of task assignment" or "everyone knows the protocol" before deployment.

## The On-the-Fly Construction

A key implementation detail: "we browse the inferred Kripke model on the ﬂy."

The full Kripke model is exponentially large:
- Each camera has many possible orientations
- Each orientation combination is a possible world
- For n cameras with m possible orientations each: m^n possible worlds

Explicitly constructing this is intractable for large n.

The "on-the-fly" approach:
- Start with the actual world w
- For each agent a, compute which worlds are accessible from w according to a's observations
- Only construct the portion of the model reachable from w by following accessibility relations
- Evaluate φ on this subset

This is lazy evaluation for Kripke models: build only what's needed for this formula in this configuration.

## Satisfiability in Detail

The satisfiability procedure:

"The satisﬁability problem consists in turning the cameras so that a given property is satisﬁed... the satisﬁability problem procedure will modify the angles of the cameras in order to satisfy a speciﬁcation."

**Input:**
- Fixed: camera positions, field-of-view angles, ball position
- Controllable: camera orientations
- Desired: epistemic formula φ

**Process:**
1. Search over possible orientation assignments
2. For each candidate, compute the induced Kripke model
3. Check if φ holds in that model
4. If yes: return the orientation assignment
5. If all candidates exhausted: report unsatisfiable

**Output:**
- Satisfying orientation assignment, or "unsatisfiable"

This is synthesis: constructing a system that meets a specification.

## Why Satisfiability Matters

Satisfiability inverts the typical design process:

**Traditional approach:**
1. Design system architecture
2. Implement it
3. Test whether it meets requirements
4. If not, iterate

**Satisfiability-based approach:**
1. Specify requirements as epistemic formula
2. Automatically synthesize system that meets requirements
3. Deploy synthesized system

This is faster (no iteration) and correct by construction (synthesis guarantees satisfaction).

For agent orchestration, this means:
- Specify "agent A should know X, common knowledge of Y among {agents}"
- Automatically determine information routing that achieves this
- Deploy routing configuration

Rather than manually designing routing and hoping it creates the right knowledge states.

## The Computational Complexity Difference

**Model checking:**
- Input size: Configuration (polynomial in number of agents)
- Formula complexity: Nested epistemic operators (polynomial in formula depth)
- Typical complexity: PSPACE-complete for epistemic logic
- Practical tractability: Often feasible for reasonable system sizes

**Satisfiability:**
- Search space: All possible configurations (exponential in controllable parameters)
- Must model-check each candidate configuration
- Typical complexity: NEXPTIME-complete for epistemic logic
- Practical tractability: Challenging for large systems

This asymmetry is why the demonstration separates them: model checking is the primary feature ("check epistemic properties"), while satisfiability is more limited ("camera can also turn...").

The authors acknowledge: "Eﬃcient algorithms for such features are not yet completely established."

## The Relationship Between the Problems

Model checking and satisfiability are dual in a formal sense:

**Satisfiability as search over model checking:**
- To solve SAT(φ), search configurations C and model-check φ on each
- Found C such that MC(C, φ) = true? Return C
- Exhausted all C without finding one? Return unsatisfiable

**Model checking as special case of satisfiability:**
- MC(C, φ) asks "does C satisfy φ?"
- Equivalent to: "Is C in the set {C' : SAT(φ) produces C'}?"
- Model checking verifies membership; satisfiability finds members

This duality appears throughout computer science:
- Type checking (verification) vs. type inference (synthesis)
- Testing (check specific input) vs. fuzzing (find satisfying input)
- Validation (does design meet spec?) vs. synthesis (create design meeting spec)

## Restricted Satisfiability

The demonstration restricts the satisfiability problem: "We here restrict the language by avoiding constructions ab since we can not move the ball."

This acknowledges that not all variables are controllable. The satisfiability problem can only manipulate camera orientations, not ball position.

More generally, satisfiability must distinguish:
- **Free variables**: Can be set arbitrarily by the solver
- **Constrained variables**: Must respect constraints
- **Fixed variables**: Cannot be changed

The restriction "avoiding constructions ab" means formulas can't require the ball to be in a specific position—that's a fixed variable.

This is realistic: in deployed systems, some aspects are configurable (agent task assignments, communication routing) while others are fixed (available resources, external events).

Satisfiability for epistemic properties must work within the controllable degrees of freedom.

## Combining Model Checking and Satisfiability

An interesting workflow:

1. **Synthesis**: Use satisfiability to find initial configuration
2. **Verification**: Use model checking to verify it meets additional properties
3. **Refinement**: If verification fails, add constraints and re-synthesize
4. **Deployment**: Once verified, deploy configuration

This combines synthesis (automatic design) with verification (checking invariants).

Example in agent systems:
1. Synthesize task routing so each agent knows its assignment
2. Verify that the routing also achieves load balance (not part of synthesis spec)
3. If unbalanced, add load constraints and re-synthesize
4. Deploy verified routing

## Limitations and Open Problems

The authors identify several challenges:

**1. Scalability:**
"Eﬃcient algorithms for such features are not yet completely established."

As the number of agents and controllable parameters grows, satisfiability becomes intractable. Current algorithms don't scale to hundreds of agents.

**2. Dynamic environments:**
"We plan to build a logical framework for planning involving temporal and epistemic properties."

Current satisfiability finds static configurations. For dynamic environments (moving objects, mobile agents), need temporal planning—sequences of actions achieving epistemic goals over time.

**3. Probabilistic observation:**
Current framework assumes perfect observation (camera sees exactly what's in its FOV). Real sensors have noise, occlusion, failure rates.

Extending to probabilistic epistemic logic would require:
- Model checking: "What's the probability agent A knows X?"
- Satisfiability: "Find configuration where P(common knowledge of Y) > 0.95"

**4. Optimization:**
Satisfiability finds *any* configuration satisfying φ. Often we want *optimal*:
- Minimize number of cameras actively observing (energy)
- Maximize field-of-view coverage (robustness)
- Minimize epistemic nesting depth (simpler knowledge structure)

This requires combining satisfiability with optimization—find satisfying configuration that minimizes cost function.

## Application to Multi-Agent Orchestration

**Model Checking for Orchestration:**

Before deploying an agent workflow:
- Check: "Does every agent know its task?"
- Check: "Is it common knowledge which agent handles failures?"
- Check: "Can agent A infer agent B's state from observations?"

These are epistemic properties of the workflow design. Model checking verifies them.

**Satisfiability for Orchestration:**

Given requirements:
- "Agent A must know X before starting task T"
- "Common knowledge among {agents} of system state"
- "Distributed knowledge sufficient to detect failures"

Automatically synthesize:
- Information routing (which messages go where)
- Observation architecture (which agents monitor which others)
- Communication protocol (what to announce publicly vs. privately)

The synthesis produces an orchestration design guaranteed to meet epistemic requirements.

**Combined Workflow:**

1. Specify epistemic requirements as formulas
2. Use satisfiability to synthesize initial orchestration
3. Use model checking to verify additional properties (performance, security)
4. Iterate until fully verified
5. Deploy with confidence that epistemic invariants hold

## The Interplay with Other Concepts

**Vision sets enable model checking:**
Computing vision sets once allows efficient model checking for multiple formulas—the geometry is precomputed, only epistemic evaluation varies per formula.

**Public announcements complicate satisfiability:**
If announcements can be made, satisfiability must consider: which announcements, in which order, to achieve φ? This adds a temporal dimension.

**Observable observation affects both:**
When agents can observe each other's observations, the epistemic structure becomes richer. Model checking must track higher-order knowledge; satisfiability must position agents for mutual observation.

**Distributed vs. common knowledge:**
Model checking can verify "is this distributed knowledge?" or "is this common knowledge?" Satisfiability can synthesize configurations creating one or the other—different geometric requirements.

## The Fundamental Tradeoff

Model checking is tractable but passive:
- Can verify designs
- Can't create designs
- Requires human creativity to propose designs to check

Satisfiability is powerful but expensive:
- Can create designs automatically
- Correct by construction
- But computationally intensive, may not scale

The practical path: use satisfiability for small, critical subsystems where correctness is paramount. Use model checking for larger systems designed manually.

Or: use satisfiability to generate candidate designs, model checking to verify them, and human judgment to select among verified candidates.

## Conclusion: Verification and Synthesis as Complementary Tools

The Big Brother Logic demonstrates both verification (model checking epistemic properties) and synthesis (satisfying epistemic properties by configuration).

For agent systems, both are valuable:

**Model checking** answers: "Did we design this correctly?" It's quality assurance for epistemic architecture.

**Satisfiability** answers: "How should we design this?" It's automated design for epistemic requirements.

Together, they enable principled engineering of multi-agent systems where knowledge distribution is not an accident of implementation but a designed, verified property of the architecture.

The demonstration makes these abstract capabilities concrete: you can interact with physical cameras, check whether they achieve epistemic properties, and watch the system automatically configure them to satisfy requirements.

This is epistemic logic made actionable—not just a formalism for describing knowledge, but a tool for designing and verifying knowledge architecture in multi-agent systems.