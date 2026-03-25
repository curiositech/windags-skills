## BOOK IDENTITY

**Title**: Hierarchical Skills and Skill-based Representation

**Author**: Shiraj Sen, Grant Sherrick, Dirk Ruiken, and Rod Grupen (Laboratory for Perceptual Robotics, University of Massachusetts Amherst)

**Core Question**: How can an autonomous robot build generalizable knowledge about the world through intrinsically motivated interaction, and represent that knowledge in a form that supports both continuous control and discrete symbolic reasoning?

**Irreplaceable Contribution**: This paper uniquely bridges the "representational discontinuity" between continuous sensorimotor control and discrete symbolic reasoning by grounding object knowledge in *control affordances* — representing what objects "are" in terms of the closed-loop control programs they support. Unlike approaches that treat perception and action as separate streams, this work shows how hierarchical composition of primitive controllers (SEARCHTRACK schemas) can simultaneously serve as: (1) executable programs for manipulation, (2) descriptive models of objects, and (3) predictive models for action selection under uncertainty. The connection between Gibsonian affordances, Kantian/Piagetian schemas, and Bayesian inference over control programs is distinctive and profound.

## KEY IDEAS

1. **Control Affordances as Knowledge Primitives**: Objects are not represented by geometric or visual features, but by spatial distributions of *control affordances* — the reliable closed-loop control programs they support. An object "is" the set of SEARCHTRACK schemas that converge when interacting with it, organized spatially. This reverses the typical perception→planning→action pipeline: knowledge emerges from what you can reliably *do*, not what you can passively observe.

2. **Intrinsically Motivated Skill Acquisition**: Domain-general skills emerge from restricting sensorimotor resources and rewarding convergence of tracking controllers on external stimuli. The robot learns SEARCHTRACK schemas (find a signal, track it to convergence) not by being told what tasks matter, but by discovering what control relationships are reliably achievable. Reward comes from the 0→1 transition (transient→convergent), creating a curriculum that builds from simple (track visual motion) to complex (grasp under force control).

3. **Hierarchical Composition Through Nullspace Projection**: Complex skills are learned by sequencing or co-articulating simpler schemas, with subordinate controllers projected into the nullspace of superior ones (c₂ ⊳ c₁ notation). A grasp becomes: track visual features + (track force subject-to maintaining visual tracking). This compositional structure allows schemas to serve as "temporally extended actions" in hierarchical reinforcement learning, and captures the insight that search behavior at one level becomes part of the control signal at another.

4. **Bayesian Affordance Models for Action Selection**: The Bayesian network (Figure 3) models objects O as causes of spatially-related affordances {p, f, r}, where p represents schema convergence states, f represents feature locations/orientations/scales, and r represents spatial relationships between affordances. This generative model supports both recognition (Pr(Oᵢ|observations)) and action selection under partial information (choose actions that maximize information gain about task-relevant affordances before committing to expensive/destructive actions).

5. **The Gap Between Knowing and Doing Under Uncertainty**: Algorithm 1 formalizes how an agent should act when it has learned object models but faces partial information at runtime. Instead of immediately attempting the goal action, compute mutual information between possible exploratory actions and the goal affordance distribution, execute the maximally informative action, update beliefs, and repeat until goal uncertainty drops below threshold. This addresses the critical gap between having a model and using it wisely when observations are incomplete or ambiguous.

## REFERENCE DOCUMENTS

### FILE: control-affordances-as-knowledge-representation.md

```markdown
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

```

### FILE: intrinsic-motivation-for-skill-acquisition.md

```markdown
# Intrinsic Motivation for Skill Acquisition: Learning What to Learn Without Task Supervision

## The Curriculum Problem in Autonomous Learning

How does an agent decide what skills to acquire when it doesn't yet know what tasks it will face? Traditional approaches either:
1. Require explicit task specifications (supervised learning of task-specific policies)
2. Use hand-crafted reward functions that embed designer assumptions about what matters
3. Learn tabula rasa from sparse task rewards (sample-inefficient, prone to local optima)

Sen et al. present a fourth path: **intrinsically motivated learning** that rewards discovering reliable control relationships with the environment, independent of downstream task utility. The key insight is that *convergence of a tracking controller on an external stimulus* is inherently informative—it reveals a stable affordance that might support future tasks.

## The Intrinsic Reward Function: Convergence on External Signals

The reward structure is elegantly simple: a 0→1 state transition (transient to converged) is rewarding **if and only if** the reference signal σ being tracked comes from the external environment, not from internal state or memory.

Why this criterion? Consider two scenarios:

**Scenario 1**: A controller φ|σ_τ tracks a visual motion cue (external signal). When it converges (camera centered on moving object, error dynamics quiescent), that represents a discovered *affordance*—the environment supports this control relationship. The agent has found something it can reliably do in this world.

**Scenario 2**: A controller tracks a memorized configuration or internal setpoint. Convergence here just means "I reached a configuration I already knew." No new information about environmental structure is gained.

The authors note this approach provides "a computational approach to learning concepts analogous to Gibsonian affordances in which the potential for action is explicitly modeled." The environment affords controller c_i precisely when executing c_i produces convergent error dynamics on environmental signals.

## Developmental Contexts: Shaping the Curriculum Through Resource Restriction

The crucial design pattern: **restrict available sensorimotor resources during learning to focus on specific competencies**. 

The simplest context restricts the robot to:
- **Sensors**: Proprioception from pan/tilt head + monocular motion cues (no color, no stereo, no tactile)
- **Effectors**: Pan and tilt motors only (no arm, no hand)

This brutal simplification yields only four possible action types:
- SEARCH_(pt) for motion: φ|σ̃_(pt) (sample pan/tilt configs from learned distribution)
- TRACK_(pt) motion: φ|(u,v)_(pt) (center camera on motion centroid)  
- Concurrent: both simultaneously with priority structures

Within 25 learning trials (Figure 1), the robot acquires a reliable SEARCHTRACK policy: "If motion visible, track it; if not, search by sampling configurations where motion was previously found, loop until detected, then track."

The learned distribution Pr(u_τ | p(φ|σ_τ)=1) (Figure 1b) after 50 presentations captures the long-term statistics of the environment—where do trackable features appear? This is **implicit world modeling**: the agent doesn't build an explicit 3D scene representation, but its search distribution encodes structural regularities (objects tend to be in certain regions, move in certain patterns).

## Hierarchical Scaffolding: Each Stage Enables the Next

Hart's dissertation (cited extensively) describes the full developmental progression:

1. **Stage 1** (described above): Learn to find and track visual motion with head
2. **Stage 2**: Add arm Cartesian control, learn to reach toward tracked visual features  
3. **Stage 3**: Add tactile sensing, learn to maintain contact (SEARCHTRACK for touch)
4. **Stage 4**: Add force control, learn to grasp (maintain force closure) while maintaining visual and tactile tracking
5. **Stage 5**: Learn to manipulate (pick, place, inspect) by sequencing previous schemas

Each stage's learned schemas become primitive actions for the next stage's reinforcement learning. REACHGRASP (Figure 2) sequences:
- Φ|(u,v)_arm: Previously learned visual tracking with arm
- Φ|F_hand: Force tracking with hand, using the arm tracker as its search behavior

The '+' notation in the first schema indicates the agent must learn *which* visual features to track (object centroid? edge? multiple points?) to reliably set up force tracking. This is discovered through trial and error with intrinsic rewards.

## Why Intrinsic Motivation Produces Generalizable Skills

The domain-general nature of SEARCHTRACK schemas emerges from three properties:

**1. Modal abstraction**: The φ|σ_τ notation abstracts over sensory modality. The same algorithmic structure applies to:
- Visual motion tracking: φ|(u,v)_camera  
- Force regulation: φ|F_hand
- Proprioceptive control: φ|q_joints
- Thermal tracking: φ|T_skin (not in paper but theoretically valid)

Agents learn a *pattern of interaction* (orient to find signal, regulate to maintain) that transfers across modalities.

**2. Effector independence**: Different robots with different kinematics can learn the same schemas if they have equivalent sensory and motor resources. The learned distributions Pr(u_τ | convergence) will differ (different arm geometries → different joint configurations for same workspace positions), but the schema structure is invariant.

**3. Context-free**: SEARCHTRACK schemas don't encode task goals ("grasp to pick up" vs "grasp to hand over"). They encode reliable control relationships. Task-specific sequencing happens at the hierarchical composition level.

## The Learning Algorithm: Q-Learning Over Controller States

The state space for learning is the vector of controller states: s = [p₁, p₂, ..., p_n] where each p_i ∈ {X,−,0,1}. Actions are the available schemas (or compositions like concurrent/sequential execution).

Q-learning updates occur on state transitions: when executing schema c causes s_t → s_{t+1}, update Q(s_t, c) based on observed reward and value estimate of s_{t+1}.

**Reward structure**:
- r = +1 for 0→1 transitions on external signal tracking  
- r = 0 otherwise (small negative for time steps could be added)

The learned policy π(s) = argmax_c Q(s,c) encodes: "Given current controller states, which action should I take next to maximize expected future convergence events?"

Figure 1a shows the learned policy as a finite state machine over [p_search, p_track]. The structure is intuitive:
- From [X,X] (nothing known): try concurrent search+track  
- From [X,0] (tracking transiently): continue tracking
- From [1,−] (search succeeded, no track signal): loop search until signal found
- From [1,1] (both converged): mission accomplished, receive reward

## Boundary Conditions: When Does Intrinsic Motivation Fail?

**Sparse affordances**: If the environment rarely affords any controllable relationships (empty space, static features with no trackable signals), intrinsic motivation provides no learning signal. The agent needs *some* structure to discover.

**Deceptive affordances**: Some control relationships converge reliably but are anti-correlated with task success. Example: A robot could learn to reliably track its own hand (always available, always trackable) but this doesn't help with manipulation. The "external signal" criterion mitigates this—internal proprioception isn't rewarded—but doesn't eliminate it entirely.

**Resource restriction brittleness**: The developmental context must be carefully designed. Too restrictive (e.g., only one motor axis) and useful skills can't be learned. Too permissive (all resources available from start) and the state space explodes, learning becomes intractable.

**No task priority**: Intrinsic motivation learns what's learnable, not what's useful. A robot might spend extensive time learning to track shadows or reflections if they're reliably trackable. Task-driven curriculum or human guidance may be necessary to focus learning on affordances relevant to anticipated tasks.

## Implications for Multi-Agent Skill Acquisition

In a WinDAGs context with 180+ skills:

**Skill discovery protocol**: Rather than hand-coding all 180 skills, provide a smaller set of primitive control programs and intrinsic motivation learning algorithms. Agents discover compositions that work reliably in their deployment environments. The skill library becomes *emergent* and *adaptive*.

**Transfer learning framework**: When a new agent joins the system, initialize its search distributions Pr(u_τ | convergence) with aggregated statistics from similar agents. This provides "developmental bootstrapping"—new agents start with the collective experience of the system.

**Automatic skill identification**: Monitor agent learning for frequently-converging schema sequences. If many agents independently discover the same compositional structure (e.g., visual track → force track), promote it to a named skill in the shared library.

**Embodiment-specific adaptation**: Agents with different hardware (different cameras, arm kinematics, end effectors) learn the same high-level schemas but with hardware-specific distributions. The schema "grasp cylindrical object" transfers, but the specific joint configurations and force profiles are adapted.

**Failure mode detection**: If an agent's success rate for a previously-reliable schema drops (convergence events become rare), this signals environmental change or hardware degradation. The orchestrator can route tasks away from degraded agents while they retrain or maintain.

## Connection to Developmental Robotics

The staged resource restriction mirrors human infant development: initially limited motor control (head/eye movements before reaching), progressive acquisition of competencies (visual tracking → reaching → grasping → manipulation), and each stage building on previous achievements.

Piaget's concepts of *assimilation* (responding to new experiences with existing schemas) and *accommodation* (modifying schemas to handle new demands) are computationally instantiated: Q-learning over existing schema spaces is assimilation; learning new hierarchical compositions is accommodation.

The authors' framework operationalizes the developmental hypothesis: intelligence emerges from progressive mastery of sensorimotor contingencies, not from pre-programmed task-specific policies.

## Critical Insight: Intrinsic Motivation Creates Common Ground

For multi-agent coordination without centralized control, the challenge is establishing shared understanding without explicit communication protocols. Intrinsic motivation provides this: **agents that experience similar environments and have similar embodiments will independently discover similar affordance structures**.

This is profound for WinDAGs. If agents A and B both learn in environments containing graspable objects, they'll both discover REACHGRASP schemas (though possibly with different implementation details). When A requests help from B, they share a basis set of control primitives even without prior coordination.

The alternative—hand-coding a shared ontology of 180+ skills—is brittle and requires centralized design. Intrinsically motivated learning makes the skill ontology *emergent from interaction with the world*, automatically adapted to the actual structure of the environment.

```

### FILE: hierarchical-composition-and-nullspace-projection.md

```markdown
# Hierarchical Composition and Nullspace Projection: Coordinating Multiple Objectives Without Conflict

## The Redundancy Problem in Complex Control

Real-world agents face a fundamental challenge: **they have more degrees of freedom than strictly necessary for most individual tasks**. A robot arm with 7 joints can reach a point with infinitely many configurations. A multi-agent system with 180 skills has vast option spaces for accomplishing most goals. This redundancy is valuable—it provides flexibility, robustness, fault tolerance—but creates a coordination problem: *how do you pursue multiple objectives simultaneously without them interfering?*

The naive approach (weighted sum of objectives) fails because it compromises all objectives—nothing is achieved well. The sequential approach (achieve goal 1, then goal 2, then goal 3) is inefficient and brittle—if achieving goal 2 invalidates goal 1, you're stuck in a loop.

Sen et al. present a principled solution from robotics that transfers directly to agent orchestration: **nullspace projection** combined with explicit priority hierarchies.

## The Mathematics of Nullspace Projection

Consider two control objectives represented as potential functions φ₁ and φ₂, each generating control gradients g₁ = ∂φ₁/∂u and g₂ = ∂φ₂/∂u where u represents control variables (joint angles, task parameters, skill selections).

**Weighted sum approach**: u = α₁g₁ + α₂g₂
- Problem: Both objectives are compromised. If they conflict, you satisfy neither fully.

**Nullspace projection approach**: Define a priority c₂ ⊳ c₁ ("c₂ subject to c₁")
1. Compute the Jacobian J₁ mapping control space to error space for objective 1
2. Find the nullspace N₁ = {u : J₁u = 0} (directions that don't affect objective 1)
3. Project g₂ into N₁: g₂_projected = (I - J₁†J₁)g₂ where J₁† is the pseudoinverse
4. Execute: u = g₁ + g₂_projected

This guarantees: **The superior objective (c₁) is fully satisfied; the subordinate objective (c₂) is achieved as much as possible without compromising c₁.**

The notation c₂ ⊳ c₁ is elegant shorthand for this mathematical operation. Nakamura et al.'s original work (cited in the paper) proved this approach optimal under the constraint that higher-priority tasks must not be degraded.

## SEARCHTRACK Hierarchies: Practical Examples

**Example 1: Concurrent head and arm control** (implicit in developmental stage progression)

Priority: "Visually track object" (head) ⊳ "Reach toward object" (arm)

The arm's reaching controller is projected into the nullspace of the head's visual tracking. This means:
- The head always maintains visual fixation (superior objective)  
- The arm reaches as directly as possible *subject to* not requiring head movements that break visual lock
- If the object moves, the head follows; the arm adapts its trajectory accordingly

Without nullspace projection, the arm and head would "fight"—arm reaching might pull the object out of view, head tracking might reposition in ways that make reaching harder.

**Example 2: REACHGRASP schema** (Figure 2)

The force tracking controller Φ|F_hand is implicitly subordinate to the visual tracking Φ|(u,v)_arm. The hand closure forces are regulated *while maintaining* the arm's positioning of the hand at the visually-tracked grasp location.

This is why the schema sequence notation matters:
1. First achieve Φ|(u,v)_arm (position hand at target)
2. Then activate Φ|F_hand ⊳ Φ|(u,v)_arm (close hand while maintaining position)

The sequential-then-concurrent structure ensures the grasp doesn't "pull away" from the target during closure.

**Example 3: Multi-feature tracking** (the '+' notation)

The radio example mentions the robot might need to track multiple visual features simultaneously to grasp effectively (object centroid, orientation marker, bounding box edge). These are concurrent controllers with priority structure:

Φ|orientation ⊳ Φ|centroid

The arm must track the object's center (can't grasp if positioned wrong), but *subject to that constraint*, also align with the principal axis orientation. If perfect alignment would require moving away from center, alignment is compromised to maintain center tracking.

## Translating to Agent Orchestration: Multi-Objective Skill Execution

Consider a WinDAGs scenario: "Debug the authentication service while maintaining system uptime and preserving user data."

**Three objectives**:
1. Fix the bug (primary task goal)
2. Keep system running (availability constraint)  
3. Don't corrupt data (safety constraint)

**Naive orchestration**: Route to three specialist agents separately, hope their outputs don't conflict. Risk: The debugger's fix might require downtime or database schema changes.

**Nullspace projection orchestration**:
1. Establish priority: safety ⊳ availability ⊳ bug_fix  
2. The "fix bug" skill operates in the nullspace of "preserve data"—only bug fixes that provably maintain data integrity are considered
3. Within that constrained space, operate in the nullspace of "maintain uptime"—only zero-downtime fixes
4. Whatever remains is the feasible solution space for the debugging agent

This is **constraint-propagating orchestration**: higher-priority objectives aren't soft preferences but hard constraints that shrink the action space for lower-priority objectives.

## Implementing Priority Hierarchies in DAG-Based Systems

**Node annotations**: Each DAG node (skill invocation) has:
- `priority_level`: Integer, lower = higher priority  
- `constraints_imposed`: What aspects of state must be preserved
- `constraint_satisfaction`: How this node proves it respects upstream constraints

**Dependency types**:
- **Sequential dependency** (standard): B waits for A to complete
- **Nullspace dependency**: B executes concurrently but projects into A's nullspace  
- **Monitor dependency**: A continuously checks B's constraint satisfaction

**Example DAG**:
```
[monitor_data_integrity] (priority 0, always active)
          ↓ (nullspace dependency)
[maintain_service_uptime] (priority 1, concurrent)
          ↓ (nullspace dependency)  
[diagnose_auth_bug] (priority 2, concurrent)
          ↓ (sequential dependency)
[generate_fix] (priority 3, waits for diagnosis)
          ↓ (nullspace dependency to uptime & integrity)
[deploy_fix] (priority 4, constrained by all above)
```

The nullspace dependencies ensure lower-priority nodes can't violate higher-priority constraints. If [generate_fix] proposes a solution that would violate [maintain_service_uptime], it's automatically projected out—the generator must search within the "feasible fixes that don't require downtime" subspace.

## The Power of "Subject To" Thinking

The ⊳ notation encourages a critical mindset for complex problem-solving: **What are my non-negotiable constraints vs. optimizable objectives?**

Traditional planning treats most goals as soft constraints—maximize utility weighted sum, accept tradeoffs. But real-world engineering has hard constraints:
- Code review *subject to* backward compatibility  
- Performance optimization *subject to* correctness
- Feature addition *subject to* security properties

The nullspace projection framework makes this explicit. When you declare c₂ ⊳ c₁, you're stating: "c₁ is axiomatic; c₂ is best-effort within the space where c₁ holds."

## Failure Modes and Limitations

**Empty nullspace**: If high-priority constraints are contradictory or too restrictive, the nullspace for lower-priority objectives becomes empty. The projection operation yields zero—no action satisfies the constraints.

*Detection*: Monitor the norm ||g₂_projected||. If it's dramatically smaller than ||g₂||, the nullspace is nearly empty.

*Response*: Signal infeasibility to the orchestrator. Either relax constraints (reduce priority of some objectives) or declare the task impossible under current constraints.

**Priority inversion**: If priorities are incorrectly specified (e.g., "optimize performance" given higher priority than "maintain correctness"), nullspace projection will dutifully optimize performance while allowing correctness violations.

*Prevention*: Careful priority assignment based on task semantics. Safety and correctness should almost always be highest priority.

**Computational cost**: Computing pseudoinverses and nullspace projections for high-dimensional systems is expensive. For WinDAGs with 180 skills and complex state spaces, real-time nullspace projection may be prohibitive.

*Mitigation*: Pre-compute nullspaces for common constraint combinations. Cache projection matrices. Use approximate projections for near-real-time response.

**Local optimality**: Nullspace projection finds the best solution *locally* within the current feasible space. It doesn't guarantee global optimality or discover creative solutions that might require temporarily violating low-priority constraints to eventually satisfy high-priority ones better.

*Mitigation*: Combine with hierarchical planning. Use nullspace projection for execution-level control but allow higher-level planners to explore sequences that might temporarily deprioritize objectives if overall trajectory is better.

## Connection to Control Theory: Task Priority Redundancy Resolution

Nakamura et al.'s original work addressed redundant manipulators (more joints than necessary for positioning). The key insight: redundancy is valuable *if* you have a systematic way to exploit it for secondary objectives.

Sen et al. extend this from motor control to cognitive control: a robot with multiple learned schemas has "cognitive redundancy"—many ways to achieve most goals. Nullspace projection exploits this redundancy to simultaneously:
- Achieve primary goals (track target object)
- Maintain secondary constraints (keep object in camera view)  
- Optimize tertiary objectives (minimize joint velocity)

For multi-agent systems, the redundancy is in the skill space: 180+ skills provide multiple paths to most goals. Nullspace projection allows pursuing the goal *subject to* constraints on resource usage, risk, latency, etc.

## Design Pattern: Hierarchical Constraint Propagation

**For WinDAGs orchestrators**:

1. **Identify constraint hierarchy**: Before decomposing a task, list all constraints and priority-order them. Example:
   - P0: Don't corrupt production data (safety)
   - P1: Complete within 5min timeout (availability)  
   - P2: Minimize API calls (cost)
   - P3: Provide detailed logging (observability)

2. **Propagate constraints downward**: Each subgraph/skill invocation inherits constraints from above. The "detailed logging" node (P3) must operate within the constraint space defined by P0-P2.

3. **Project action spaces**: When multiple skills could satisfy a subgoal, project their action spaces through higher-priority constraints. The skill that has the largest remaining feasible space (most freedom to optimize) is preferred.

4. **Monitor constraint violations**: If a subordinate node's projection yields empty space, propagate infeasibility signal upward. Don't silently fail or violate constraints.

5. **Dynamic reprioritization**: Allow runtime priority adjustment based on context. A normally P2 objective might become P0 if system state changes (e.g., "minimize API calls" becomes "don't exceed rate limit" when approaching throttling threshold).

## Relationship to Schema Composition

Nullspace projection explains *how* schemas compose without interference:

- **Sequential composition** (→): First schema completes, second inherits state, no conflict possible
- **Concurrent composition** (⊳): Second schema projects into first's nullspace, explicit conflict resolution  
- **Parallel composition** (||): Only valid when nullspaces don't intersect (truly independent objectives)

The paper's REACHGRASP example (Figure 2) uses sequential (visual track → force track) followed by concurrent (force ⊳ visual). This is optimal: establish the visual reference first (can't grasp what you can't see), then regulate force while maintaining visual lock.

For agent systems: identify which skills can safely parallelize (independent nullspaces) vs. need nullspace projection (overlapping resources) vs. must sequence (output of one is input to other).

## Critical Insight: Nullspace Projection Enables Satisficing Under Multiple Objectives

Herbert Simon's concept of "satisficing" (satisfying + sufficing) describes decision-making under bounded rationality: find solutions that are "good enough" across multiple criteria rather than optimal on any single criterion.

Nullspace projection operationalizes satisficing: **High-priority objectives are fully satisfied; lower-priority objectives are satisficed within the remaining feasible space.**

This is profoundly different from optimization-based approaches that find Pareto-optimal tradeoffs. Nullspace projection has a clear lexicographic priority: no amount of improvement on objective 2 justifies degrading objective 1.

For agent systems operating in uncertain, high-stakes environments (production systems, safety-critical applications), this hard-constraint satisfaction is often more appropriate than soft-constraint optimization. "Don't corrupt data" isn't negotiable; "minimize latency" is optimized subject to that hard constraint.

```

### FILE: bayesian-affordance-models-for-action-selection.md

```markdown
# Bayesian Affordance Models: Object Recognition as Predictive Control

## The Traditional Object Recognition Problem

Standard approaches to object recognition treat it as a classification problem: given sensory input (RGB image, point cloud, feature vector), predict object category or instance ID. The representation is passive—objects are described by geometric properties (shape, size, color) or learned embeddings (deep features, latent codes).

This creates a gap: **knowing what object you're looking at doesn't directly inform how to interact with it**. After recognizing "coffee cup," a separate planning layer must determine grasping affordances, manipulation strategies, etc. The representation doesn't inherently support action selection.

Sen et al. invert this: **represent objects as generative models over the control programs they support**. Recognition becomes: "Given observed controller convergences, which object is most likely present?" Action selection becomes: "Given likely objects and task goals, which control program should I execute next?"

The Bayesian network in Figure 3 formalizes this inversion.

## The Generative Model: Objects Cause Affordances

The network structure encodes causal relationships:

**Object node** O_i ~ Bernoulli(p_object):  
Binary variable, "Is object i present in the environment?"  
*Prior*: Learned from past experience (how often has this object appeared?)

**Affordance state nodes** p_ij ~ Multinomial({X, −, 0, 1}):  
For each affordance j of object i, what's the current controller state?  
*Conditional distribution*: Pr(p_ij | O_i)  
- If O_i = 1 (object present): p_ij has high probability of being trackable (states 0 or 1)
- If O_i = 0 (object absent): p_ij likely in state − (signal unavailable) or X (unknown)

**Feature location nodes** f_ij ~ Gaussian(μ_position, μ_orientation, μ_scale, Σ):  
Where in space (x,y,z), at what orientation (θ), at what scale (sc) does affordance j manifest?  
*Conditional distribution*: Pr(f_ij | O_i, p_ij)  
- If O_i = 1 and p_ij = 1 (object present and affordance tracked): f_ij follows a learned spatial distribution specific to that object and affordance
- The distribution captures natural variation (object can be grasped from slightly different angles, tolerances in positioning)

**Spatial relationship nodes** r_jk ~ Gaussian(μ_relative, Σ_relative):  
Relative distance, orientation, and scale between affordances j and k  
*Conditional distribution*: Pr(r_jk | f_ij, f_ik)  
- Deterministic function of the feature locations (if you know where both affordances are, their relationship is determined)
- Uncertainty in r_jk comes from uncertainty in f_ij and f_ik

## Why This Is a Generative Model

You can *sample* from this network to generate predictions:

1. Sample object presence: O_radio ~ Bernoulli(0.3) → O_radio = 1
2. Sample affordance states conditioned on object:
   - p_yellow_knob | O_radio = 1 → state = 1 (trackable)
   - p_black_antenna | O_radio = 1 → state = 1
   - p_green_base | O_radio = 1 → state = 1  
   - p_grasp_axis | O_radio = 1 → state = 0 (requires positioning)

3. Sample feature locations conditioned on object and states:
   - f_yellow_knob ~ N(μ_knob, Σ_knob) → (x=0.3, y=0.1, z=0.5, θ=0, sc=0.05)
   - f_black_antenna ~ N(μ_antenna, Σ_antenna) → (x=0.32, y=0.15, z=0.8, θ=π/2, sc=0.01)
   - ...

4. Compute spatial relationships from features:
   - r_knob_antenna = f(f_yellow_knob, f_black_antenna) → (Δx, Δy, Δz, Δθ, Δsc)

This generative process predicts: "If the radio is present, I expect to find a yellow trackable feature near (0.3, 0.1, 0.5), a black feature 20cm above at π/2 orientation, and grasping will be possible along the principal axis aligned with both."

## Inference: From Observations to Object Beliefs

**Recognition (evidence → object)**:  
Given observations Z = {z_p, z_f} where:
- z_p = observed controller states (which affordances tracked successfully)
- z_f = observed feature locations (where trackable features were found)

Compute posterior: Pr(O_i | Z) ∝ Pr(Z | O_i) Pr(O_i)

Example: Robot executes visual SEARCHTRACK for green blob, finds one at (0.25, 0.08, 0.12). Also finds yellow circular feature at (0.28, 0.09, 0.48). Spatial relationship between them: Δz ≈ 0.36m, Δθ ≈ aligned.

Query model: Which object is most consistent with {green blob at X1, yellow circle at X2, spatial relationship R}?

If O_radio predicts exactly this configuration (green base at bottom, yellow knob above, 36cm separation), then Pr(O_radio | Z) is high. If O_flashlight predicts only one trackable feature (no green base), then Pr(O_flashlight | Z) is low.

**Action selection (object + goal → next action)**:  
Given likely object Pr(O_i | Z) and goal affordance a_g (e.g., REACHGRASP), predict:

Pr(f_g | Z, p_g) = Σ_i Pr(f_g | O_i, p_g) Pr(O_i | Z)

This is the predicted location distribution for the goal affordance given current evidence and object beliefs. If uncertain (high entropy), execute exploratory actions to reduce uncertainty (see Algorithm 1).

## The Radio Grasping Example: Inference Under Uncertainty

**Initial state**: Robot has learned a model of the radio but hasn't observed it yet.  
**Goal**: Execute REACHGRASP (achieve force closure on the object)  
**Problem**: The grasp affordance f_grasp has high uncertainty (Figure 4 shows multimodal distribution)

Why the uncertainty? The model knows:
- Grasping can occur at multiple positions along the radio's body
- The yellow knob has rotational symmetry (Figure 5d)—if that's the only observed feature, orientation is ambiguous  
- The green base has bilateral symmetry—mirror image grasps are equivalent

**Algorithm 1 execution**:

**Round 1**:
- Compute entropy of grasp posterior: H(f_grasp | priors) = high (multimodal, broad)
- For each possible exploratory action (track yellow knob, track green base, track black antenna, track bounding box):
  - Predict: If I execute this action and observe feature f_i, how much does it reduce H(f_grasp)?
  - Compute mutual information: I(f_grasp ; f_i | evidence)
- Result: Tracking green base has maximal mutual information (Figure 5b shows it most effectively disambiguates grasp locations)
- Execute: SEARCHTRACK green base → observe at (x₁, y₁, z₁)
- Update: evidence ← evidence ∪ {p_green=1, f_green=(x₁, y₁, z₁)}

**Round 2** (Figure 6):
- Recompute entropy: H(f_grasp | evidence with green base) = medium (still uncertain about orientation)
- Most informative next action: track black antenna (breaks rotational symmetry)
- Execute: SEARCHTRACK black antenna → observe at (x₂, y₂, z₂)  
- Update: evidence ← evidence ∪ {p_black=1, f_black=(x₂, y₂, z₂)}
- Recompute entropy: H(f_grasp | evidence with green + black) < ε (threshold)
- Goal posterior is now unimodal and tight → Execute REACHGRASP sampling from Pr(f_grasp | evidence)

## Information-Theoretic Action Selection: Mutual Information

Why mutual information I(f_grasp ; f_i | evidence)?

**Definition**: I(X;Y) = H(X) - H(X|Y) = reduction in uncertainty about X from observing Y

In the grasping context:
- H(f_grasp): Current uncertainty in grasp location (entropy of posterior distribution)
- H(f_grasp | f_i): Expected uncertainty after observing feature i  
- I(f_grasp ; f_i): Expected reduction in uncertainty

**Computing expectation**: We don't know what f_i we'll observe until we search for it, so:

I(f_grasp ; f_i | evidence) = ∫ Pr(f_i | evidence) · [H(f_grasp | evidence) - H(f_grasp | evidence, f_i)] df_i

This requires marginalizing over possible observations—integrate over the predicted distribution of where feature i might be found.

**Practical approximation**: Sample likely feature locations from Pr(f_i | evidence), compute entropy reduction for each, weight by probability, sum. This is computationally expensive but tractable with modern probabilistic programming tools.

## Why This Beats Greedy Action Selection

**Alternative approach 1: Random exploration**  
Try affordances randomly until one works for grasping.  
*Problem*: Inefficient, especially with many possible affordances. Might try antenna, knob, bounding box before green base, wasting time.

**Alternative approach 2: Fixed heuristic**  
Always search for features in a predefined order (e.g., largest feature first).  
*Problem*: Not adaptive to task or evidence. For some objects, smallest feature might be most diagnostic.

**Alternative approach 3: Greedy uncertainty reduction**  
Execute action that maximally reduces entropy over *all* affordances, not specifically the goal.  
*Problem*: Might disambiguate irrelevant features while leaving goal uncertain.

**Mutual information approach**:  
Explicitly optimizes for reducing uncertainty in *task-relevant* affordances given *current evidence*. If grasp location is already well-determined but object identity uncertain, don't waste time on recognition—go for the grasp. If grasp requires knowing orientation and only symmetric features observed, prioritize asymmetric features.

This is **task-directed exploration**: each action is chosen to maximally progress toward executing the goal action, not for general knowledge acquisition.

## Boundary Conditions and Failure Modes

**Model mismatch**: If the learned model is incorrect (radio stored upside-down, parts broken off), observations won't match predictions.  
*Detection*: Low likelihood Pr(Z | all objects)—nothing in the model explains observations well.  
*Response*: Signal novelty, initiate exploration to update model or learn new object representation.

**Aliasing**: Multiple objects might afford similar control programs.  
*Example*: Both "radio" and "toolbox" have trackable knobs, graspable handles, similar size.  
*Mitigation*: The spatial relationships r_jk disambiguate—even if individual affordances are similar, their relative configuration is distinctive.  
*Limitation*: If objects are genuinely ambiguous in their affordances, recognition may remain uncertain. This is actually desirable—forcing a decision when evidence is ambiguous leads to errors.

**Expensive/destructive actions**: Some affordances can't be casually explored.  
*Example*: To verify an object is graspable, you must attempt grasping—which might knock it over or damage it.  
*Solution*: Algorithm 1 explicitly avoids executing the goal action (a_g) until uncertainty is below threshold. "Try grasping to see if it's graspable" is prevented; "observe visual features to infer graspability" is preferred.

**Local minima in exploration**: Mutual information is computed with current model and evidence. If the model is missing critical features, no action will have high mutual information.  
*Example*: If the model doesn't include texture information and texture is actually critical for grasping, all actions will seem equally uninformative.  
*Mitigation*: Ensure models capture diverse affordance types. Periodically inject random exploration to discover out-of-model affordances.

## Implications for Multi-Agent Object Recognition

**Shared object models**: Multiple agents can contribute to and benefit from a common Bayesian affordance model database. When agent A encounters "radio" and executes {green base, black antenna, grasp} sequence, that data updates the shared model, improving agent B's future recognition and action selection.

**Distributed inference**: The Bayesian network factorization allows distributed computation:
- Agent A computes Pr(O_i | observations_A)  
- Agent B computes Pr(O_i | observations_B)
- Combine: Pr(O_i | observations_A, observations_B) ∝ Pr(O_i | observations_A) · Pr(O_i | observations_B) / Pr(O_i)

No need for centralized fusion—agents multiply their posterior beliefs (accounting for the prior).

**Specialization through model refinement**: Different agents might refine models for objects they frequently encounter. Agent specialized in "kitchen tasks" has richer affordance models for kitchen objects (more affordances modeled, tighter spatial distributions). When other agents encounter kitchen objects, they can query the specialist's models.

**Handling model drift**: Objects change over time (wear, damage, reconfiguration). The Bayesian framework supports online updating:
- If observed affordance locations consistently deviate from model predictions, update Pr(f_ij | O_i)  
- If affordances become unreliable (p_ij frequently fails to converge), update Pr(p_ij | O_i) to reflect lower success probability

## Connection to Active Perception

Algorithm 1 is a form of **active perception**: the agent doesn't passively receive sensory input but actively selects actions (sensor positioning, feature tracking attempts) to acquire task-relevant information.

Classical active perception (e.g., "move camera to better view object") is subsumed: executing a SEARCHTRACK schema inherently involves moving sensors (pan/tilt head, arm positioning) to track the target feature. The affordance-based framework unifies sensor control and recognition.

The mutual information criterion provides a principled alternative to heuristics like "maximize image resolution" or "minimize occlusion." Instead: **maximize expected reduction in task-relevant uncertainty.**

## Design Pattern: Affordance-Driven Task Decomposition

For WinDAGs orchestrators planning complex tasks:

**1. Goal specification as affordance**:  
Rather than "grasp radio," specify "achieve p_grasp=1 ∧ f_grasp satisfies task constraints"

**2. Consult affordance model**:  
Query: Pr(p_grasp=1 | current observations) and H(f_grasp | current observations)

**3. If uncertainty high, decompose into exploration subtasks**:  
For each potential exploratory action, compute I(f_goal ; f_exploratory | evidence)  
Create subgraph: explore → update beliefs → recheck → (iterate or execute goal)

**4. If uncertainty low, proceed to execution**:  
Sample goal parameters from Pr(f_goal | evidence), invoke goal skill

**5. Monitor execution**:  
If goal action fails (p_goal doesn't reach 1), evidence contradicts model. Update model or escalate to human.

This pattern makes exploration and exploitation explicit in the task graph, with information-theoretic criteria for transitioning between them.

## Critical Insight: Representation Grounds Recognition in Action

Traditional AI separates "vision" (recognizing objects) from "robotics" (manipulating them). This creates an integration problem: vision researchers optimize for ImageNet accuracy; robotics researchers optimize for grasp success; the representations don't align.

Affordance-based representation dissolves this separation: **recognition is predicting which actions will succeed; acting is executing predictions from recognition.**

For agent systems, this suggests: don't maintain separate "knowledge base" (object properties) and "skill library" (manipulation programs). Instead, the knowledge base *is* a probabilistic model over which skills will succeed in which configurations. Recognition becomes: "query the model for likely objects given observed skill successes/failures." This grounds abstract knowledge in executable, testable predictions.

```

### FILE: information-theoretic-action-selection-under-uncertainty.md

```markdown
# Information-Theoretic Action Selection Under Uncertainty: When to Explore vs. Exploit

## The Core Dilemma: Acting Without Complete Information

Intelligent systems perpetually face a fundamental tension: **you never have complete information, but you must act anyway**. Waiting to gather all relevant data is often impossible (infinite search space), expensive (time/resource constraints), or dangerous (environment changes while you deliberate).

The challenge is deciding: *Which actions should I take to gather information (exploration), and when should I commit to the task-critical action based on current beliefs (exploitation)?*

Sen et al.'s Algorithm 1 (TASKGOAL procedure) provides a principled answer grounded in information theory. The key insight: **use mutual information to quantify the expected value of exploratory actions, execute exploration until task-relevant uncertainty falls below a threshold, then commit to exploitation.**

## Algorithm 1 Walkthrough: Structure and Logic

```
Input: 
  a_g = goal action (e.g., REACHGRASP)
  ε = uncertainty threshold
  E = initial evidence (priors, any observations)

Repeat until goal succeeds:
  1. Compute posterior over goal region: Pr(f_g | evidence, p_g)
  2. Compute entropy: H_g = H(f_g | evidence, p_g)
  
  3. If H_g < ε:
       Execute goal action with parameters sampled from posterior
       Update evidence with result
       
  4. Else (too uncertain to commit):
       For all exploratory actions not yet tried:
         Compute mutual information I_a = I((f_g|evidence); (f_i|evidence))
       Select a_next = argmax I_a
       Execute a_next
       Observe result f_next
       Update evidence with observed feature and controller state
```

The algorithm has three critical components:

**Uncertainty quantification**: Entropy H(f_g | evidence) measures how uncertain the posterior distribution is. High entropy = many plausible configurations, low confidence in any specific value. Low entropy = posterior is peaked around a specific configuration, high confidence.

**Exploration criterion**: Mutual information I(f_g ; f_i) measures how much observing affordance i is expected to reduce uncertainty about the goal affordance g. This is not about general knowledge—it's specifically task-directed.

**Exploitation threshold**: ε is the acceptable uncertainty level for executing the goal action. Too small = over-cautious, explores when already sufficient information. Too large = reckless, executes with insufficient information.

## Why Entropy as the Uncertainty Measure?

Entropy H(X) = -Σ p(x) log p(x) for discrete distributions, or -∫ p(x) log p(x) dx for continuous, captures "spread" of a distribution:

**Low entropy examples**:
- Unimodal Gaussian with small variance: nearly certain about value
- Uniform distribution over tiny region: uncertain within region, but region is small
- Dirac delta: H = 0, perfect certainty

**High entropy examples**:
- Uniform distribution over large region: every value equally plausible, no information
- Multimodal distribution: multiple incompatible hypotheses, unresolved ambiguity  
- Heavy-tailed distribution: outliers are plausible, high uncertainty about tail behavior

For the grasp posterior in Figure 5d (rotational symmetry around knob), entropy is high because:
- Multiple orientations equally plausible (symmetric feature)
- Wide spatial spread (uncertain which of several symmetric grasp points)
- Multimodal (different objects in model predict different configurations)

After observing green base (Figure 6), entropy drops because:
- Eliminates some objects (those without green base)
- Breaks some symmetries (green base is asymmetric, provides orientation cue)  
- Tightens spatial distribution (relative positions of green base and grasp points constrain each other)

**Alternative uncertainty measures**:
- Variance: Only captures spread, not multimodality. A bimodal distribution with tight peaks has low variance per mode but high uncertainty overall.
- Maximum probability: Ignores tail uncertainty. You might be 60% confident in one hypothesis but 40% spread across many alternatives—max probability = 0.6 suggests moderate confidence, but true uncertainty is higher.
- Ensemble disagreement: For model ensembles, variance across predictions. Doesn't apply to single Bayesian model.

Entropy correctly captures both spread and multimodality, making it the right choice for quantifying "how uncertain is this distribution?"

## Mutual Information: Quantifying Information Gain

Definition: I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = H(X) + H(Y) - H(X,Y)

Interpretation: Reduction in uncertainty about X from observing Y (symmetric: also reduction in uncertainty about Y from observing X).

**For action selection**: I(f_goal ; f_exploratory | evidence)

This is saying: "If I execute the exploratory action and observe where the feature is (or that it's not present), how much does that reduce my uncertainty about where the goal affordance is?"

**Computing in practice**:

```
I(f_g ; f_i | evidence) = H(f_g | evidence) - E_{f_i ~ Pr(f_i|evidence)}[H(f_g | evidence, f_i)]
```

The expectation is over possible observations: we don't yet know what f_i we'll observe, so we must average over all possibilities weighted by their probability.

**Example calculation** (simplified):

Suppose:
- Current entropy of grasp location: H(f_grasp | evidence) = 3.2 bits
- If we observe green base at location A (prob 0.4): H(f_grasp | evidence, green@A) = 1.8 bits
- If we observe green base at location B (prob 0.3): H(f_grasp | evidence, green@B) = 2.1 bits  
- If we observe green base at location C (prob 0.2): H(f_grasp | evidence, green@C) = 2.5 bits
- If green base not found (prob 0.1): H(f_grasp | evidence, no_green) = 3.0 bits

Expected entropy after exploring green base:
E[H | green] = 0.4×1.8 + 0.3×2.1 + 0.2×2.5 + 0.1×3.0 = 2.05 bits

Mutual information:
I(f_grasp ; f_green | evidence) = 3.2 - 2.05 = 1.15 bits

Similarly compute for yellow knob, black antenna, bounding box. Whichever has highest mutual information (largest expected reduction) is chosen.

## Why Mutual Information > Other Heuristics

**Alternative 1: Maximize observation likelihood**  
Choose action most likely to succeed (highest Pr(p_i=1 | evidence)).  
*Problem*: Observing a highly likely but uninformative feature doesn't help. If you're already certain an affordance exists, confirming it adds no information.

**Alternative 2: Minimize execution cost**  
Choose cheapest action (fastest, least resource-intensive).  
*Problem*: Cheap but uninformative actions waste time. Better to execute one expensive informative action than ten cheap useless ones.

**Alternative 3: Maximize model uncertainty**  
Choose action with highest H(f_i | evidence) (most uncertain feature).  
*Problem*: That feature might be irrelevant to the goal. Disambiguating an uncertain but task-irrelevant feature doesn't help accomplish the task.

**Alternative 4: Greedy goal uncertainty**  
Choose action that maximally reduces H(f_goal) if observation matches model expectation.  
*Problem*: Doesn't account for probability of different observations. Might choose an action that dramatically reduces uncertainty *if* you observe X, but X is very unlikely, and likely observations provide little information.

**Mutual information**:  
- Accounts for both informativeness (how much does observation reduce goal uncertainty) AND likelihood (weight by probability of each possible observation)
- Specifically targets task-relevant uncertainty (f_goal), not general knowledge
- Robust to irrelevant features (if f_i is independent of f_goal, I(f_goal ; f_i) ≈ 0)

## The Threshold ε: Balancing Caution and Decisiveness

The uncertainty threshold ε determines when to stop exploring and commit to the goal action.

**Setting ε too low** (overly cautious):
- Continues exploring even when sufficient information available  
- Wastes time/resources on marginal information gain
- Risks environment changing while deliberating (object moved, state invalidated)
- Example: ε = 0.01 bits might require observing every affordance to near-certainty before grasping

**Setting ε too high** (reckless):
- Attempts goal action with insufficient information  
- High failure rate, requires retries (which might not be possible if action is destructive)
- Example: ε = 5 bits might attempt grasping when posterior is still multimodal and broad

**Adaptive threshold** (task-dependent):
- Low stakes task (picking up a toy): higher ε acceptable, failures are cheap
- High stakes task (grasping a fragile antique): lower ε required, failure is costly  
- Time-critical task: start with higher ε, reduce over time if failures occur
- Irreversible actions: very low ε (gather extensive information before committing)

**Empirical tuning**: The paper doesn't specify ε value, but the radio example shows:
- After 1 exploration action: H still high, continue exploring  
- After 2 exploration actions: H < ε, proceed to grasp
This suggests ε is set such that 1-3 exploratory actions are typically sufficient, balancing efficiency and reliability.

## Handling Action Failure: The Retry Loop

Algorithm 1's outer loop continues "until p(a_g) = 1" (goal action succeeds). This handles:

**Failure mode 1: Model mismatch**  
Goal action executed with sampled parameters, but those parameters were incorrect (model wrong or observations noisy).  
*Response*: Goal action fails (p(a_g) remains 0 or transitions to −). Algorithm continues, updates evidence with failure observation, explores further to resolve model mismatch.

**Failure mode 2: Environmental change**  
Object moved/changed between exploration and exploitation.  
*Response*: Goal action fails. Re-exploration with updated evidence should detect the change (previously-tracked features no longer where expected).

**Failure mode 3: Execution noise**  
Goal action was correctly parameterized but failed due to control noise, sensor error, external disturbance.  
*Response*: Retry with same or slightly perturbed parameters. If repeated failures, increase evidence uncertainty (reduce confidence in previous observations) and re-explore.

The algorithm doesn't explicitly distinguish these failure modes—it simply continues the explore-exploit loop until success. This is robust but potentially inefficient (might re-explore when a simple retry would suffice).

**Extension**: Add failure mode diagnosis. If goal action fails but observations still match model (p(exploratory) = 1 for previously-tracked affordances), likely execution noise → retry. If observations no longer match model (p(exploratory) ≠ 1), likely environmental change or model mismatch → re-explore.

## Computational Complexity and Practical Approximations

**Full Bayesian inference**:
- Compute posteriors: Pr(f_g | evidence) requires marginalizing over all objects and affordance configurations
- Compute mutual information: requires integrating over all possible observations
- For continuous state spaces and complex models, this is intractable in closed form

**Approximations used in practice**:

1. **Particle filtering**: Represent posteriors as weighted particle sets {(f^(i), w^(i))}. Entropy estimated from particle distribution. Mutual information approximated by reweighting particles for each hypothetical observation.

2. **Gaussian approximations**: Assume posteriors are Gaussian, track mean and covariance. Entropy of multivariate Gaussian: H = 0.5 log((2πe)^k |Σ|). Mutual information computed analytically for Gaussian conditionals.

3. **Sampling-based approximation**: 
   - Sample N possible observations from Pr(f_i | evidence)  
   - For each sample, compute H(f_g | evidence, f_i = sample)
   - Average: E[H | f_i] ≈ (1/N) Σ_n H(f_g | evidence, f_i = sample_n)
   - Mutual information: H(f_g | evidence) - E[H | f_i]

4. **Greedy action selection without full expectation**: Assume observation will match model expectation (highest probability outcome), compute information gain for that case only. Faster but less robust to surprises.

The paper doesn't specify which approximation they use, but given the complexity of the radio model (multivariate Gaussians over spatial features, multinomial over controller states), likely Gaussian approximations or particle filtering.

## Implications for Multi-Agent Coordination

**Distributed exploration**: Multiple agents can explore different affordances in parallel:
- Agent A executes action i, observes f_i  
- Agent B executes action j, observes f_j
- Both update shared Bayesian model with their observations  
- Information gain is additive: I(f_g ; f_i, f_j) = I(f_g ; f_i) + I(f_g ; f_j | f_i) (chain rule)

**Challenge**: Coordinating which agent explores what to avoid redundancy.

**Solution**: Shared information state. Before acting:
1. Each agent computes I(f_g ; f_i | current_shared_evidence)  
2. Agents communicate their intended actions
3. Orchestrator assigns actions to maximize total information gain without duplication

**Asynchronous operation**: If communication is expensive/delayed:
- Each agent optimistically assumes others are gathering information on other affordances
- Execute local I-maximizing action
- Periodically sync evidence with other agents, recompute mutual information, adjust plans

**Specialization**: Some agents might be better suited for certain exploratory actions:
- Vision specialist: fast at visual SEARCHTRACK, prioritize visual affordances  
- Manipulation specialist: better at tactile/force exploration, handle those affordances
- Allocate actions based on both information gain AND agent capability

## Connection to Active Learning and Optimal Experimental Design

Algorithm 1 is a form of **optimal experimental design**: each exploratory action is an "experiment" that produces data (observations), and we choose experiments to maximize information gain about parameters of interest (goal affordance location).

**Classical experimental design** (Fisher, Box): choose experimental conditions to maximize Fisher information, minimize parameter variance, or maximize mutual information between parameters and observations.

**Active learning** in machine learning: choose which data points to label to maximally improve model accuracy, often using uncertainty sampling or query-by-committee.

**Sen et al.'s contribution**: Apply these ideas to embodied action selection. The "experiments" are sensorimotor interactions (execute SEARCHTRACK schemas), "observations" are controller convergence and feature locations, "parameters" are affordance distributions in the world model.

The framework naturally handles:
- **Multi-modal posteriors**: Entropy accounts for multiple hypotheses, mutual information helps disambiguate  
- **Structured dependencies**: Bayesian network captures spatial relationships between affordances
- **Action costs**: Could extend to penalize expensive exploratory actions (trade-off information gain vs. execution cost)

## Boundary Conditions: When Does Information-Theoretic Selection Fail?

**Assumption 1: Model completeness**  
Algorithm assumes the Bayesian model contains the true object. If encountering a novel object not in the model, all actions will have near-zero mutual information (nothing in the model explains observations).  
*Mitigation*: Monitor total likelihood Pr(Z | all objects). If very low, signal novelty, initiate model learning rather than continuing Algorithm 1.

**Assumption 2: Independent observations**  
Mutual information computation assumes observing f_i provides information about f_g through the Bayesian network structure. If observations are corrupted by common-cause noise (e.g., camera calibration error affects all visual features), information gain is overestimated.  
*Mitigation*: Model common noise sources in the Bayesian network (shared latent variables for systematic errors).

**Assumption 3: Consistent environment**  
Algorithm assumes environment is static during exploration. If the object moves or changes, early observations become stale, mutual information calculations based on outdated evidence are incorrect.  
*Mitigation*: Time-decay evidence weights (older observations contribute less to posterior). Monitor for inconsistencies (new observations contradict old ones), trigger re-exploration if detected.

**Assumption 4: Accurate entropy estimation**  
For high-dimensional continuous spaces, estimating entropy is hard. Particle filters need many particles to capture multimodal distributions; Gaussian approximations fail for non-Gaussian posteriors.  
*Impact*: Might stop exploring too early (underestimate entropy) or too late (overestimate). Not catastrophic—Algorithm 1 includes retry loop—but inefficient.

**Assumption 5: Goal action is non-exploratory**  
Algorithm treats goal action as terminal (succeeds or fails, then reassess). If the goal action itself provides informative observations (e.g., attempting grasp reveals previously-unknown force profiles), should be incorporated into exploration loop.  
*Extension*: Allow goal action to be exploratory if expected information gain exceeds risk of failure.

## Design Pattern: Information-Gain-Driven Task Decomposition

For WinDAGs orchestrators:

**1. Identify task-critical parameters**: What must be known to execute the goal skill successfully?  
- Example: "deploy security patch" requires knowing current system version, patch compatibility, deployment window availability

**2. Model parameter uncertainty**: Represent knowledge as probability distributions, compute entropy.  
- Use historical data, Bayesian priors, or expert estimates

**3. Enumerate information-gathering skills**: What actions can reduce parameter uncertainty?  
- Query version API (fast, certain, but might be incorrect)
- Parse config files (slower, more reliable)  
- Test in staging environment (expensive, definitive)

**4. Compute mutual information**: For each information-gathering skill, estimate I(critical_params ; skill_observation).

**5. Build adaptive exploration subgraph**:
```
while H(critical_params) > threshold:
    skill_next = argmax_{skills not yet tried} I(critical_params ; skill_output)
    execute skill_next
    update beliefs with skill output
```

**6. Execute goal skill**: Once uncertainty acceptable, proceed with task-critical action using parameters sampled from posterior.

**7. Handle failure**: If goal skill fails, increase uncertainty (evidence was misleading), re-enter exploration loop.

This pattern makes information-gathering explicit in the orchestration graph, with formal criteria for sufficiency.

## Critical Insight: Uncertainty Quantification Enables Safe Autonomy

The profound contribution of Algorithm 1 is making uncertainty *first-class*:

Traditional systems:
- Execute actions based on "best estimate" of parameters  
- No representation of confidence or uncertainty
- Failures are surprising, no mechanism to anticipate them

Information-theoretic approach:
- Explicitly quantify "how certain am I?"  
- Recognize when uncertainty is too high for safe action
- Gather information specifically to reduce task-relevant uncertainty
- Proceed only when confidence exceeds threshold

For autonomous agent systems operating in high-stakes environments (production systems, safety-critical applications, real-world robotics), this is essential. **You can't make reliable decisions without knowing how reliable your information is.**

The framework provides:
- **Predictable behavior**: Agents don't randomly "try things and see"—they systematically reduce uncertainty  
- **Failure prevention**: By refusing to act when uncertain, prevent many failures
- **Introspection**: Agents can report "I need more information about X before I can proceed"
- **Justified decisions**: Information-theoretic criteria are auditable—why did the agent explore A before B? Because I(goal ; A) > I(goal ; B).

This bridges the gap between "knowing" (having a model) and "doing" (acting in the world): the bridge is quantified uncertainty and information-driven exploration.

```

### FILE: hierarchical-abstraction-for-problem-decomposition.md

```markdown
# Hierarchical Abstraction for Problem Decomposition: Compositional Solutions to Complex Tasks

## The Combinatorial Explosion Problem

Complex tasks present a fundamental challenge: the space of possible action sequences grows exponentially with task length. If you have N primitive actions and need a sequence of length L, there are N^L possible sequences to consider. For even modest N and L, exhaustive search is impossible.

Traditional approaches address this through:
- **Hand-coded task decomposition**: Humans manually break tasks into subtasks (brittle, doesn't generalize)  
- **Hierarchical planning**: Learn or specify task hierarchies (requires domain knowledge, hard to transfer)
- **Flat reinforcement learning**: Learn end-to-end policies (sample-inefficient, doesn't exploit structure)

Sen et al. present a different approach: **acquire hierarchical skills through progressive composition of simpler skills, where each level's learned programs become primitive actions for the next level**. This creates a "bootstrap" curriculum where complexity emerges from reusing and recombining previously-learned components.

## The Developmental Progression: Building Complexity Incrementally

The key insight is that complex skills are rarely learned from scratch in a flat action space. Instead, they emerge through stages:

**Stage 1: Basic orienting** (Figure 1)  
- **Resources**: Pan/tilt head, monocular camera, motion detection
- **Learned skill**: SEARCHTRACK for visual motion—find moving objects, center camera on them
- **State space**: [p_search, p_track] ∈ {X,−,0,1}² (4 controller states)  
- **Outcome**: Reliable policy for maintaining visual fixation on motion cues

**Stage 2: Reaching** (not detailed in paper but cited from Hart's dissertation)  
- **Resources**: Stage 1 skills + arm Cartesian control  
- **Learned skill**: REACH toward visually-tracked features—extend arm to touch objects while maintaining visual track
- **State space**: [p_search_visual, p_track_visual, p_search_reach, p_track_reach] (16 states)
- **Outcome**: Coordinate head and arm to reach toward moving/tracked objects

**Stage 3: Grasping** (Figure 2)  
- **Resources**: Stage 2 skills + force/tactile sensing + hand closure control
- **Learned skill**: REACHGRASP—sequence visual tracking + force tracking to achieve prehension  
- **State space**: Compositions of visual SEARCHTRACK, reach, and force SEARCHTRACK (complex but structured)
- **Outcome**: Reliable grasping of objects given initial visual detection

**Stage 4: Manipulation** (mentioned but not detailed)  
- **Resources**: Stage 3 skills + proprioceptive control + torque sensing  
- **Learned skills**: Pick, place, inspect, reorient  
- **State space**: Compositions of Stage 3 grasping with motion control and object state tracking
- **Outcome**: Task-level manipulation capabilities

Each stage:
1. Treats previous stage's learned skills as primitive actions  
2. Introduces new sensorimotor resources (sensors/effectors)
3. Learns how to compose primitives + new resources to achieve more complex goals
4. Produces new skills that become primitives for the next stage

## The Mathematics of Composition: Sequential and Concurrent

**Sequential composition** (→):  
Skill₂ → Skill₁ means "execute Skill₁ to completion, then execute Skill₂ using resulting state"

In the REACHGRASP schema (Figure 2):
Φ|F_hand → (Φ|(u,v)_arm + Φ|other_visual_features)

Interpretation: "First track visual features with the arm (potentially multiple features simultaneously, hence the '+'), *then* activate force tracking with the hand."

The sequential structure ensures preconditions are met: you can't track grasping forces until the hand is positioned at the object, which requires visual tracking first.

**Concurrent composition** (⊳ or +):  
Skill₂ ⊳ Skill₁ means "execute Skill₂ subject to maintaining Skill₁" (nullspace projection)  
Skill₁ + Skill₂ means "execute both simultaneously with priority Skill₁"

The difference is subtle: ⊳ emphasizes subordination (Skill₂ projects into Skill₁'s nullspace), + emphasizes parallelism (both active, with priority).

In REACHGRASP:
Φ|F_hand ⊳ Φ|(u,v)_arm (implicit after sequential phase)

Once force tracking activates, it must maintain the arm's visual tracking—can't pull the hand away from the visually-tracked location while closing. The force controller is projected into the nullspace of the visual tracking controller.

**Conditional composition** (implicit in learned policies):  
The policy learned through Q-learning includes conditionals: "If p_visual = 1 (visual tracking converged) AND p_reach = 0 (reaching in progress), THEN activate force tracking."

The finite state machine structure (Figure 1) encodes these conditionals as state transitions: different controller states lead to different action selections.

## Why Hierarchical Composition Reduces Search Space

Consider learning REACHGRASP from scratch with a flat action space:

**Flat approach**:
- Primitive actions: {pan_left, pan_right, tilt_up, tilt_down, move_arm_x+, move_arm_x-, ..., close_hand, open_hand}  
- Suppose 20 primitive actions
- REACHGRASP requires ~50 primitive actions in sequence (position head, position arm, close hand while maintaining positions)
- Search space: 20^50 ≈ 10^65 possible sequences

**Hierarchical approach**:
- Stage 1 learns: SEARCHTRACK_visual (explores 4² = 16 state space, converges in ~25 trials)  
- Stage 2 learns: REACH (treats SEARCHTRACK_visual as 1 action, explores ~4³ = 64 state space with 3 new controllers)
- Stage 3 learns: REACHGRASP (treats REACH as 1 action + SEARCHTRACK_force as new action, explores ~4² = 16 state space for sequencing)

Total exploration: 16 + 64 + 16 = 96 states explored (vs. 10^65)

The exponential explosion is avoided because:
1. Each stage explores a small space (≤64 states)  
2. Learned skills compress many primitives into single high-level actions
3. Hierarchical state abstraction (discrete controller states) makes planning tractable

## Temporal Abstraction: Skills as "Macro-Actions"

In reinforcement learning terminology, the learned schemas are **options** or **macro-actions**: temporally extended actions that:
- Have initiation conditions (when can this skill start?)  
- Follow an internal policy (how does the skill execute?)
- Have termination conditions (when does the skill complete?)

SEARCHTRACK_visual is an option:
- **Initiation**: Can start from any state (always available)  
- **Policy**: If motion visible → TRACK; if not → SEARCH by sampling from learned distribution; repeat until convergence  
- **Termination**: p_track = 1 (tracking converged) OR timeout/failure

When REACHGRASP uses SEARCHTRACK_visual as a component:
- It doesn't reason about individual pan/tilt commands  
- It treats "visually track object" as an atomic action that succeeds or fails
- The internal complexity of SEARCHTRACK is abstracted away

This is **temporal abstraction**: reasoning at the timescale of skills (seconds) rather than primitives (milliseconds). Planning is more efficient because fewer decisions are needed—"should I track the object?" vs. "should I pan left 2 degrees?"

## State Abstraction: Controller States as Discrete Symbols

The controller state logic p(c) ∈ {X,−,0,1} provides **state abstraction**: continuous sensorimotor state (joint angles, image pixels, force readings) is abstracted to discrete controller convergence status.

**Why this matters**:
- **Compact representation**: A 7-DOF arm has continuous joint angles (∞ states), but p(REACH) has 4 states  
- **Generalization**: Different joint configurations that all satisfy "reach converged" are treated equivalently
- **Symbolic reasoning**: Discrete states enable planning algorithms (Q-learning, value iteration) that don't work in continuous spaces

The paper notes this abstraction is "natural" because it emerges from error dynamics—not hand-coded state features. The 0→1 transition happens when the control error genuinely becomes small, which correlates with task-relevant conditions (hand at target, force at setpoint).

## Hierarchical State Representation

The state space for a hierarchical skill is the vector of controller states for all active controllers:

For REACHGRASP:
s = [p_search_visual, p_track_visual, p_search_reach, p_track_reach, p_search_force, p_track_force]

Each element is discrete {X,−,0,1}, so |S| ≤ 4^6 = 4096 states.

But structure reduces this:
- Sequential dependencies: p_force only activates after p_visual = 1 (many combinations never occur)  
- Learned policy: RL discovers efficient paths through state space, doesn't visit all combinations

The **abstraction hierarchy**:
- **Level 0**: Raw sensors/effectors (10^6+ dimensional)  
- **Level 1**: Primitive controllers (e.g., p_track_visual ∈ {X,−,0,1})
- **Level 2**: Skill states (e.g., s_REACHGRASP = [p_visual, p_force])  
- **Level 3**: Task states (e.g., "object grasped" = p(REACHGRASP) = 1)

Higher levels are exponentially more compact than lower levels, making high-level reasoning tractable.

## The Composition Lattice: Systematic Exploration of Skill Combinations

While not explicitly visualized in the paper, the developmental progression implies a **composition lattice**: a structure of possible skill combinations.

**Level 0** (primitives): {pan, tilt, move_arm, close_hand, ...}

**Level 1** (basic SEARCHTRACK): {Φ|motion_pt, ...}

**Level 2** (combining modalities): {Φ|motion_pt + Φ|position_arm, ...}

**Level 3** (sequential): {Φ|position_arm → Φ|force_hand, ...}

Each level combines or sequences lower-level skills. The lattice structure means:
- Many compositions are possible (combinatorial)  
- But only some are useful (lead to intrinsic reward)
- RL explores the lattice, discovers which combinations achieve convergence
- Successful combinations become "named" skills (e.g., REACHGRASP) for future use

This lattice structure is similar to:
- **Programming language composition**: Expressions compose to statements, statements to functions, functions to programs
- **Skill trees in video games**: Basic skills unlock, combinations unlock advanced skills
- **Concept hierarchies in knowledge graphs**: Low-level concepts compose to high-level concepts

## Implications for Multi-Agent Task Decomposition

**For WinDAGs with 180+ skills**:

**Design principle 1: Skill hierarchy metadata**  
Each skill should be annotated with:
- **Level**: How many composition stages from primitives?  
- **Components**: Which sub-skills does it use?
- **Resources**: What sensors/effectors does it require (inherited from components)?
- **Preconditions**: What must be true to initiate? (Encoded as controller states of dependencies)
- **Postconditions**: What's guaranteed upon termination? (Controller state of this skill)

This metadata enables:
- **Automatic decomposition**: Given task goal "grasp object," orchestrator sees REACHGRASP requires {visual SEARCHTRACK, force SEARCHTRACK}, which require {motion detection, force sensing}, etc.
- **Resource allocation**: If two agents both need "visual SEARCHTRACK," they need cameras—orchestrator can identify resource conflicts
- **Failure diagnosis**: If REACHGRASP fails, check which component failed (visual tracking? force tracking?) and route to specialist

**Design principle 2: Progressive specialization**  
New agents start by learning level-1 skills (basic SEARCHTRACK). As they master those, they're exposed to level-2 challenges (composition). Mastery of level-2 unlocks level-3.

This mirrors Sen et al.'s developmental stages and provides:
- **Curriculum learning**: Don't throw hard problems at novice agents  
- **Incremental capability**: Agents become progressively more useful (basic skills → advanced skills)
- **Fault tolerance**: If an advanced agent fails, fall back to basic agents executing decomposed subtasks

**Design principle 3: Compositional skill discovery**  
Rather than hand-coding all 180 skills, seed with ~30 primitive skills and let agents discover compositions:
- Agent A accidentally discovers visual_track → force_track achieves grasping  
- Promotes this to "REACHGRASP" skill in shared library
- Other agents can now invoke REACHGRASP by name
- Further compositions build on REACHGRASP (pick, place, etc.)

The skill library becomes **emergent and adaptive**: reflects the actual compositional structure discovered through interaction, not predetermined by designers.

## Boundary Conditions: When Does Hierarchical Composition Fail?

**Assumption 1: Composability**  
Not all skills compose usefully. Trying to sequence incompatible skills (e.g., "track moving object" → "maintain static gripper position") creates conflicts.  
*Mitigation*: The nullspace projection mechanism (⊳) handles some conflicts, but fundamentally incompatible objectives can't be composed. Need compositional type-checking: does Skill₂'s precondition match Skill₁'s postcondition?

**Assumption 2: Monotonic progress**  
The developmental progression assumes each stage's skills remain useful in later stages. If Stage 2 learning invalidates Stage 1 skills (e.g., completely different sensory modality), hierarchy breaks down.  
*Mitigation*: Careful curriculum design to ensure earlier skills are subsumed, not replaced. SEARCHTRACK_visual remains useful even after learning REACHGRASP.

**Assumption 3: Discrete convergence**  
The discrete controller states {X,−,0,1} assume clear convergence. For tasks with continuous quality (e.g., "optimize performance"), convergence is ambiguous—when is optimization "done"?  
*Mitigation*: Extend discrete logic to include "good enough" thresholds or continuous quality metrics alongside discrete convergence.

**Assumption 4: Limited hierarchy depth**  
The paper shows 4 levels (primitives → SEARCHTRACK → REACH → REACHGRASP). Deep hierarchies (10+ levels) might suffer from:
- Compounding abstractions that lose critical details  
- Long chains where failure at any level cascades upward
- Credit assignment problem (which low-level action caused high-level failure?)

*Mitigation*: Bounded hierarchy depth (5-7 levels typical in human expertise). Use "chunking" to collapse frequently-used subsequences into new primitives.

**Assumption 5: Stationary environment**  
Skills learned in Stage N assume Stage N-1 skills remain reliable. If the environment changes such that basic skills degrade, hierarchical skills built on them fail.  
*Detection*: Monitor primitive skill success rates; if they drop, retrain bottom-up rather than trying to patch high-level skills.

## Connection to Human Skill Acquisition

The developmental stages mirror human motor learning:

**Infants** (Stage 1): Learn basic orienting—track moving objects with eyes/head before developing reaching ability.

**Toddlers** (Stage 2): Learn reaching—extend arm toward visually-tracked objects, initially without fine motor control.

**Children** (Stage 3): Learn grasping—combine visual tracking, reaching, and force regulation for prehension.

**Adults** (Stage 4): Learn manipulation—grasp becomes automatic, enabling higher-level skills like tool use.

The progression is:
1. **Skills at level N automatize** through practice (require less conscious attention)
2. **Freed cognitive resources** enable learning level N+1 skills that build on N  
3. **Level N+1 skills initially require conscious composition** ("reach, then close hand")
4. **With practice, compositions "chunk" into single skills** (reaching and grasping become one fluid motion)

Sen et al.'s framework computationalizes this: Stage 1 skills become automatic (learned policy stored, executes without search), freeing computational resources (no longer need to explore Stage 1 state space) for Stage 2 learning.

## Design Pattern: Hierarchical Skill Graphs

For WinDAGs orchestrators, represent skills as a directed acyclic graph (DAG):

**Nodes**: Individual skills  
**Edges**: Compositional dependencies (uses-as-component)

**Example** (simplified REACHGRASP):
```
[primitives: pan, tilt, move_arm, close_hand, sense_force]
           ↓ (composed into)
[SEARCHTRACK_visual: Φ|motion_pt]  
[SEARCHTRACK_force: Φ|F_hand]
           ↓ (composed into)
[REACH: SEARCHTRACK_visual + move_arm]
           ↓ (composed into)
[REACHGRASP: REACH → SEARCHTRACK_force]
```

**Query 1: What primitives does REACHGRASP need?**  
Traverse DAG downward, collect all leaf nodes: {pan, tilt, move_arm, close_hand, sense_force}

**Query 2: If visual sensing fails, what skills are affected?**  
Traverse DAG upward from SEARCHTRACK_visual: {REACH, REACHGRASP, any skill built on those}

**Query 3: How to decompose a task "grasp object X"?**  
Find REACHGRASP in DAG, traverse downward to generate execution plan:
1. Execute SEARCHTRACK_visual (decompose to pan/tilt primitives)  
2. Execute REACH (uses output of step 1 + move_arm primitives)
3. Execute SEARCHTRACK_force (close_hand + sense_force primitives)

This DAG structure makes compositional relationships explicit, enabling automatic decomposition and resource analysis.

## Critical Insight: Abstraction Hierarchies Enable Bounded Rationality

The profound contribution is showing how **bounded rationality** (effective decision-making with limited computational resources) emerges from hierarchical abstraction:

**Without hierarchy**: Agent must reason over raw sensor/effector space (millions of dimensions, continuous, real-time). Intractable for real-world tasks.

**With hierarchy**: Agent reasons at the level of discrete skill states (tens of states, symbolic, temporally extended). High-level planning is tractable; low-level execution is handled by learned policies.

This is **information hiding**: Higher levels don't need to know *how* lower-level skills work, only *what they achieve*. When planning a grasp, you don't reason about individual joint angles—you reason about "the REACHGRASP skill will position the hand and close it."

For multi-agent systems, this extends to inter-agent reasoning: Agent A doesn't need to understand Agent B's internal implementation of skill X, only that X has certain preconditions and postconditions. The hierarchy provides **interfaces** for coordination without requiring full mutual transparency.

This bridges the gap between **symbolic planning** (discrete, logical, high-level) and **continuous control** (real-valued, dynamic, low-level): hierarchical skills provide the discrete symbols that planning operates over, while grounding those symbols in executable continuous controllers. The "symbol grounding problem" is solved by making symbols correspond to convergence states of feedback controllers.

```

### FILE: failure-modes-in-complex-control-systems.md

```markdown
# Failure Modes in Complex Control Systems: Recognizing and Recovering from Breakdown

## The Brittleness of Complex Systems

Complex systems composed of many interacting components face a paradox: **the same compositional structure that enables sophisticated behavior also creates novel failure modes**. As Sen et al.'s hierarchical skills demonstrate, a level-3 skill (REACHGRASP) depends on level-2 skills (REACH, SEARCHTRACK_force), which depend on level-1 skills (SEARCHTRACK_visual), which depend on primitives (motor controllers, sensors). Failure can occur at any level, propagate upward or downward, and manifest in non-obvious ways.

The paper doesn't explicitly enumerate failure modes, but the structure of the system implies several critical vulnerabilities that any multi-agent orchestration system must address.

## Failure Mode 1: Sensor Degradation / Signal Loss

**Description**: A feedback signal σ required by a TRACK controller becomes unavailable or unreliable.

**In the paper's framework**: Controller state transitions from 0 or 1 (tracking) to − (signal unavailable) or X (unknown).

**Manifestation**:
- Visual SEARCHTRACK fails because lighting changed (object no longer visible)  
- Force SEARCHTRACK fails because contact was lost (hand slipped)
- Proprioceptive tracking fails because sensor malfunction (encoder failure)

**Propagation**:
- **Upward**: If SEARCHTRACK_visual fails (p = −), then REACH (which depends on it) cannot proceed. REACHGRASP (which sequences REACH) fails at an early stage.
- **Sideways**: If REACHGRASP was part of a larger manipulation sequence (pick, place, inspect), the entire sequence stalls.

**Detection**: Monitor controller states. Transition to '−' is a clear signal of signal loss.

**Recovery strategies**:

1. **Re-search**: If SEARCH action is available, attempt to re-acquire signal by sampling from learned distribution Pr(u_τ | convergence_history). This is built into the SEARCHTRACK schema (Figure 1)—if tracking fails, loop back to search.

2. **Alternative modality**: If visual tracking fails, try tactile or proprioceptive tracking. Requires having redundant sensory modalities for the same affordance.

3. **Graceful degradation**: If signal loss is persistent, report failure upward. Don't retry indefinitely. The paper's Algorithm 1 implicitly handles this—if exploratory actions repeatedly fail to converge, eventually either succeed with partial information or timeout.

4. **Model update**: If signal loss is consistent across multiple attempts, update the Bayesian model to reflect lower reliability: Pr(p_ij = 1 | O_i) decreases for that affordance.

**Prevention**: Proactive monitoring of signal quality before committing to actions that depend on it. If signal-to-noise ratio is degrading, switch modalities or abort early rather than waiting for complete failure.

## Failure Mode 2: Controller Non-Convergence / Oscillation

**Description**: A controller remains in state 0 (transient) without reaching 1 (converged), or oscillates between states.

**In the paper's framework**: The 0→1 transition never occurs, or occurs then reverts to 0 repeatedly.

**Causes**:
- **Control gains mistuned**: Oscillation from overly aggressive feedback  
- **Conflicting objectives**: Nullspace projection fails if objectives are not truly in each other's nullspace (see Failure Mode 4)
- **Environmental disturbance**: External forces preventing convergence (object being moved by another agent, wind on a mobile robot)
- **Model mismatch**: The potential function φ doesn't match actual system dynamics (wrong kinematics, unmodeled friction)

**Manifestation**:
- Visual tracker oscillates around target, never settling  
- Force controller hunts for target force, alternately overshooting and undershooting
- Arm reaches for object but path planning causes oscillation around obstacles

**Propagation**:
- **Timeouts**: Higher-level skills waiting for convergence eventually timeout, triggering failure cascades  
- **Resource exhaustion**: Oscillation wastes actuator energy, risks hardware damage from repeated high-frequency movements
- **Downstream degradation**: Even if the oscillating controller eventually converges, the delay disrupts timing for sequential skills

**Detection**: 
- Monitor time in state 0. If duration exceeds expected (learned from historical data), flag oscillation.  
- Monitor control output variance. High variance suggests oscillation/hunting.
- Check error signal frequency spectrum. High-frequency components indicate oscillation rather than smooth convergence.

**Recovery strategies**:

1. **Gain adjustment**: Reduce feedback gains to dampen oscillation. This sacrifices speed for stability.

2. **Replanning**: If obstacle-induced oscillation, trigger replanner to find alternative path.

3. **Switch controllers**: If current potential function φ is problematic, switch to alternative (e.g., from visual servoing to position-based control).

4. **Force timeout**: After N oscillation cycles or T seconds, declare failure and propagate upward rather than continuing indefinitely.

**Prevention**: 
- Extensive testing of control gains across operating conditions  
- Adaptive control that adjusts gains based on observed error dynamics
- Conservative gain scheduling: start with underdamped gains, increase only if convergence is too slow

## Failure Mode 3: Hierarchical Fragility / Cascading Failures

**Description**: Failure at a lower level causes failures to cascade upward through dependent skills.

**In the paper's framework**: If primitive controllers fail, SEARCHTRACK schemas fail; if SEARCHTRACK fails, REACH fails; if REACH fails, REACHGRASP fails; if REACHGRASP fails, entire manipulation task fails.

**Example cascade** (from paper's hierarchy):
1. Pan motor controller develops friction (primitive failure)  
2. SEARCHTRACK_visual cannot maintain track (schema failure)  
3. REACH cannot position arm at target (level-2 failure)