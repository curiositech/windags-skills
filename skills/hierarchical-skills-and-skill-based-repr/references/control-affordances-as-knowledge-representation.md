# Control Affordances as Knowledge Representation: Grounding Object Models in Executable Programs

## The Representational Discontinuity Problem

Robot systems face a fundamental challenge that agent architectures inherit: the "representational discontinuity" between continuous control (sensorimotor programs operating in real-time with feedback loops) and discrete symbolic reasoning (planning, object recognition, task decomposition). Traditional approaches treat these as separate layers—perception extracts symbolic features, planning operates on discrete states, control executes motor commands. This separation creates brittle systems where control knowledge cannot inform planning, and planning cannot leverage the structure inherent in sensorimotor interaction.

Sen et al. propose a radical alternative: **represent objects not by their geometric properties or visual features, but by the distribution of control programs they afford**. An object "is" the set of closed-loop controllers that reliably converge when interacting with it, organized spatially. A coffee cup is not "cylindrical with a handle at orientation θ"; it is "affords visual tracking at location (x₁,y₁,z₁), affords force tracking (grasping) along axis θ relative to the visual feature, affords proprioceptive tracking when lifted against gravity." Knowledge is grounded in *what you can reliably do*, not what you can passively observe.

## Control Primitives: The Atomic Units

The foundation is the **control primitive** c ≡ φ|σ_τ, combining:
- A potential function φ (defines a control objective)
- A feedback signal σ (sensory input being regulated)  
- Motor resources τ (effectors that execute control gradients)

The "control gradient" ∂φ/∂τ provides reference inputs that drive effectors to minimize the potential. Critically, the *error dynamics* of this closed-loop system create a natural discrete abstraction: p(c) ∈ {X, −, 0, 1} representing unknown, signal unavailable, transient (converging), and converged states.

This discrete logic over continuous control is the bridge. A collection of n primitives defines a discrete state space s_k = [p₁, ..., p_n]_k where planning algorithms can operate, but each state element directly corresponds to the convergence status of an executable control law.

## SEARCHTRACK Schemas: Orienting and Maintaining

Two controller types share potentials and effectors but differ in feedback source:

**TRACK** (φ|σ_τ): Uses external environmental signal σ as reference. A 0→1 transition (convergence) is intrinsically rewarding when σ comes from the external world. This embodies Gibson's insight: the environment "affords" controller c_i when executing it produces reliable convergence. Affordance is not a property of objects alone or agents alone, but of the *control relationship* between them.

**SEARCH** (φ|σ̃_τ): Uses sampled reference σ̃ drawn from learned distributions over effector configurations where TRACK has previously succeeded: Pr(u_τ | p(φ|σ_τ) = 1). Initially uniform, this distribution captures long-term statistics of where trackable features are found. SEARCH "orients" the sensorimotor system to discover affordances.

The learned behavior (Figure 1) sequences these: attempt concurrent SEARCH+TRACK → if target found, continue tracking → if not, loop SEARCH sampling from the success distribution until target appears. The notation Φ|σ_τ denotes a complete SEARCHTRACK program—find signal σ using resources τ, then maintain tracking.

## Hierarchical Composition: Skills as Building Blocks

Simple SEARCHTRACK schemas compose hierarchically (Figure 2). The REACHGRASP schema sequences:
1. Φ|(u,v)_arm (track visual features with arm Cartesian controller)  
2. Φ|F_hand (track force signal with hand closure)

The '+' notation indicates multiple visual features may need tracking simultaneously (object centroid, orientation markers). Crucially, when used hierarchically, *schemas become search behaviors for higher-level controllers*. The visual tracker that's a goal at one level becomes the orienting action that discovers force-trackable affordances at the next.

Concurrent composition uses nullspace projection: c₂ ⊳ c₁ means "execute c₂ subject to maintaining c₁," achieved by projecting c₂'s control gradient into the nullspace of c₁'s Jacobian. This allows multiple objectives to be pursued simultaneously without conflict, with clear priority structure.

## Objects as Spatial Distributions Over Affordances

An object O_i is represented as a spatial distribution over N_i control affordances (Figure 3 Bayesian network):
- **p_ij**: Multinomial variable representing controller state for affordance j of object i  
- **f_ij**: Spatial blob (position x,y,z, orientation θ, scale sc) where affordance j manifests
- **r_jk**: Relative spatial relationships (distance, orientation, scale) between affordances j and k

This is a *generative model*: object presence O_i *causes* spatially-organized affordances. The model predicts: "If this is a radio, you should find a yellow trackable feature at location f₁, a black feature at f₂ with relationship r₁₂ to the first, and reach goals for grasping at f₃ aligned with the object's principal axis."

The representation is **functional**—it describes objects by their potential for supporting action. The radio model (Figure 4) doesn't encode "plastic case with knobs"; it encodes the distribution of visual SEARCHTRACK convergences (yellow knob, black antenna, green base, bounding box) and REACHGRASP convergences spatially organized around them.

## Why This Matters for Agent Systems

For WinDAGs-style multi-agent orchestration:

1. **Transferable primitives**: SEARCHTRACK schemas are domain-general. The same Φ|σ_τ structure applies whether tracking visual motion, force signals, or abstract state variables. Agents can share a common vocabulary of control programs across diverse skills.

2. **Compositional reasoning**: Hierarchical composition means planning can operate at multiple levels of abstraction. High-level planners reason about "grasp object," medium-level about "sequence visual tracking then force tracking," low-level about "sample pan/tilt configurations from success distribution."

3. **Grounded symbols**: The discrete states {X,−,0,1} are not arbitrary labels but emerge from continuous dynamics. When an orchestrator reasons about "affordance p_ij available," it's reasoning about the predicted convergence of a specific closed-loop controller—executable, testable, falsifiable.

4. **Learning from interaction**: The intrinsic reward (convergence on external signals) means agents can acquire affordance models through self-supervised exploration. No human needs to label "this is graspable"—the agent discovers grasping is possible by trying controllers and observing convergence.

## Boundary Conditions and Limitations

**When does this representation fail?**

- **Non-manipulable knowledge**: Abstract concepts (political systems, mathematical theorems) don't afford sensorimotor control programs. This framework is powerful for embodied interaction but doesn't extend to purely symbolic domains.

- **Novel affordances**: The model assumes affordances arise from composing known primitives. Truly novel control relationships (new physics, new effector types) require expanding the primitive basis set.

- **Computational scaling**: Bayesian inference over spatial distributions with continuous variables becomes expensive with many objects and affordances. The radio example has 5 affordances; a kitchen scene might have hundreds.

- **Ambiguity from symmetry**: The rotational symmetry around the circular knob (Figure 5d) shows how ambiguous features create multimodal posterior distributions. The model correctly represents uncertainty but doesn't resolve it until asymmetric features are observed.

**Critical design choice**: The developmental context (restricted sensorimotor resources) shapes what primitives are learned. Different restrictions yield different basis sets. There's no "universal" set of primitives—they're a function of the agent's embodiment and learning history.

## Connection to Classical Schema Theory

The term "schema" has deep roots (Kant's mapping concepts to percepts, Piaget's accommodation/assimilation). This work's distinctive contribution is making schemas *executable and composable*. Unlike Drescher's discrete cause-effect schemas or Nilsson's teleo-reactive programs, these schemas:
- Operate in continuous state spaces with continuous time
- Explicitly manage redundant sensorimotor resources through nullspace projection  
- Generate their own discrete abstractions through error dynamics rather than requiring hand-coded discretization
- Support both forward simulation (Bayesian generative model) and policy execution (controller sequences)

The authors cite Lyons' Robot Schema (RS) language as a precursor, but emphasize their framework *learns* the coordinated control programs rather than requiring manual specification.

## Implications for Multi-Agent Orchestration

In a DAG-based orchestration system:

**Skill decomposition**: Each node could represent a SEARCHTRACK schema rather than a monolithic function. Dependencies in the DAG mirror hierarchical composition—REACHGRASP depends on visual SEARCHTRACK and force SEARCHTRACK.

**Resource management**: The τ (effector resources) and σ (sensory resources) parameters make resource conflicts explicit. Concurrent execution of schemas requires nullspace projection or explicit arbitration.

**Failure detection**: The discrete states {X,−,0,1} provide natural health monitoring. If a schema remains in '0' (transient) beyond expected duration, or transitions to '−' (signal unavailable), downstream nodes should be notified.

**Knowledge sharing**: Multiple agents with similar embodiments (e.g., different robot arms) can share learned affordance distributions Pr(u_τ | p(φ|σ_τ)=1). Transfer learning becomes: "Here's where grasping points have been found historically; start your exploration there."

**Adaptive routing**: The mutual information action selection (Algorithm 1) could guide which specialist agent to query next. Route to the agent that maximizes information gain about task-critical affordances given current evidence.