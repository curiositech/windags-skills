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