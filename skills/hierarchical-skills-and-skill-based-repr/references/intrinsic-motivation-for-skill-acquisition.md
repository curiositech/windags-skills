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