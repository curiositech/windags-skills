# Discovering Appropriate Skill Granularity: How LLMs Implicitly Know What Makes a Good Skill

## The Granularity Problem in Skill Libraries

When building a skill library for an intelligent agent, one of the hardest questions is: **what's the right level of abstraction for a skill?**

Too coarse (high-level): "Clean the kitchen" as a single skill
- Difficult to learn (long horizon, complex)
- Difficult to compose (can't reuse sub-components)
- Difficult to debug (which part failed?)

Too fine (low-level): "Activate joint 3 by 0.1 radians" as a skill
- Enormous combinatorial space
- Difficult to reason about (too many skills to manage)
- Difficult to compose (must chain hundreds of micro-actions)

The right level: "Pick up cube," "open drawer," "place object"
- Learnable through RL (reasonable horizon)
- Composable (can chain into complex tasks)
- Semantic (humans understand what they mean)

But who decides this granularity? Traditional approaches rely on human designers specifying the primitive action set. The ASD framework demonstrates something remarkable: **LLMs, when prompted appropriately, naturally propose skills at semantically meaningful granularity without explicit instruction about abstraction levels.**

## Evidence: The Proposed Task List

Table 2 shows 24 tasks proposed by the LLM over successive iterations:

**Manipulation primitives** (atomic actions):
1. Reach cube A
2. Reach cube B
3. Reach the plate
4. Pick up cube A
5. Pick up cube B
8. Pick up the plate
13. Gripper open/close toggle

**Object interactions** (single-step manipulations):
6. Slide cube A to target position
7. Open the drawer
9. Place plate onto target position
14. Slide cube B to table edge
17. Push drawer to partially open position

**Precision positioning** (contact-aware actions):
15. Align end-effector over drawer handle without opening
16. Navigate gripper above cube B without touching
18. Position cube A before drawer handle without blocking
20. Move end-effector over cube A
21. Push cube A and cube B close together
22. Move to target position without interacting with objects

**Composed tasks** (requiring multiple primitives):
11. Align cube A and cube B to target positions apart
12. Close drawer with cube A inside
23. Put cube A into drawer
24. Stack cube A on top of cube B

## Implicit Granularity Principles

Analyzing the proposed tasks reveals implicit principles the LLM follows:

### Principle 1: Atomic and Independent

From the paper: "We encourage the LLM to propose tasks that are meaningful, atomic, independent, and incremental."

The LLM proposes "pick up cube A" and "pick up cube B" as separate tasks, not "pick up any cube" parameterized by object ID. This seems redundant from a programming perspective—why not write `pick_up(object_id)` once?

**The reason**: The LLM prioritizes semantic distinctness over parametric completeness. Each task should be independently understandable and learnable. "Pick up cube A" is a complete instruction; "pick up" alone is incomplete.

However, the LLM doesn't enumerate all possible combinations:
- Proposes "reach cube A" and "reach cube B"
- Does NOT propose "reach cube C," "reach cube D," etc.
- Does NOT propose "reach cube A then cube B," "reach cube B then cube A"

**The selection heuristic**: The LLM proposes enough instances to cover semantic variety (different object types: cube vs. plate) without exhaustive parametric enumeration (all cube instances).

### Principle 2: Single-Step Interactions

Most proposed tasks involve single-phase interactions:
- "Pick up" (grasp)
- "Slide" (push to target)
- "Open" (pull handle)
- "Place" (release at target)

The LLM does NOT propose:
- "Pick up and then place" (two-phase)
- "Open drawer and grasp object inside" (sequential)
- "Slide cube A while picking up cube B" (parallel)

These compound actions appear later as quests that get decomposed (tasks 23, 24).

**Why this matters**: Single-step granularity matches what RL can feasibly learn in one training run. Multi-step tasks require either:
- Very long horizon RL (sample inefficient, often fails)
- Hierarchical decomposition (the quest mechanism)

The LLM implicitly understands this boundary: propose tasks that are learnable, defer complex tasks to decomposition.

### Principle 3: Semantic Meaningfulness to Humans

Every proposed task is interpretable:
- "Slide cube to target" — humans understand this
- "Gripper toggle" — clear meaning
- "Align end-effector over drawer handle" — specific spatial relationship

The LLM does NOT propose:
- "Maximize joint velocity variance"
- "Minimize state entropy"
- "Achieve diverse gripper configurations"

These are valid unsupervised RL objectives [10-13] that discover skills through information-theoretic criteria. But they yield non-interpretable behaviors: an RL agent might learn to wiggle the gripper in place because it maximizes velocity variance.

**The ASD philosophy**: Skills should have semantic meaning. If you can't describe the task in natural language to a human, it's not a good skill for a library.

### Principle 4: Incremental Complexity

The task proposal order shows progression:

**Phase 1 (Tasks 1-3)**: Reaching
- Reach cube A, reach cube B, reach plate
- Simplest tasks: just move end-effector to target

**Phase 2 (Tasks 4-5)**: Grasping
- Pick up cube A, pick up cube B
- Builds on reaching, adds gripper control

**Phase 3 (Tasks 6-9)**: Manipulation
- Slide cube, open drawer, pick up plate, place plate
- More complex interactions requiring contact dynamics

**Phase 4 (Tasks 11-12, 23-24)**: Composition
- Align two objects, close drawer with object inside, put cube in drawer, stack cubes
- Require chaining previous skills

The LLM doesn't jump straight to "stack cubes" in task 1. It builds up capability progressively, proposing more complex tasks only after simpler ones are attempted.

**Why**: The LLM uses feedback about previous task outcomes to calibrate difficulty. From the paper: "The LLM will be informed about tasks that could not be completed so that it will have a sense of the limits of the learning agent."

When task 23 ("put cube in drawer") fails, the LLM doesn't immediately propose "put three cubes in drawer while balancing plate." It understands the failure indicates the boundary of current capabilities.

### Principle 5: Semantic Diversity Over Parametric Exhaustiveness

The LLM proposes:
- Reach cube A
- Reach cube B
- Reach plate

But NOT:
- Reach cube C
- Reach cube D
- Reach every possible object

**Why this is smart**: The skill library isn't meant to be exhaustive. It's meant to demonstrate capability variety. Once you can reach cube A and cube B, you've proven "reaching objects" capability. No need to enumerate all instances.

Similarly:
- Proposes "slide cube A" and "slide cube B"
- Does NOT propose "slide at 45-degree angle," "slide slowly," "slide while rotating"

The LLM understands that skills should vary semantically (slide vs. grasp vs. open) not parametrically (slide at N degrees for all N).

**Implication for orchestration**: Agent systems should maintain skill libraries organized by semantic clusters (manipulation, navigation, perception) rather than parametric variations (pick_with_force_1, pick_with_force_2, ...).

## How the LLM Knows: Implicit Task Ontology

LLMs are trained on vast corpora of human language describing tasks and actions. This training embeds an implicit ontology of task structure:

**From task descriptions in text**:
- Instructional content (recipes, DIY guides, programming tutorials)
- Task decompositions (project plans, procedural documentation)
- Action descriptions (robot programming forums, manipulation research papers)

The LLM has seen thousands of examples like:
- "First, reach for the object. Then, grasp it. Finally, lift it."
- "To open a drawer: locate the handle, grasp the handle, pull toward you."
- "Breaking down the task: (1) approach, (2) grasp, (3) manipulate."

This exposure creates implicit knowledge about:
- **Typical granularity**: "Grasp" is a task unit; "flex finger joint 2" is too fine
- **Common compositions**: "Pick and place" is a standard pattern
- **Semantic boundaries**: "Reach" and "grasp" are distinct; "reach-while-grasping" is weird
- **Learnability**: Humans describe tasks at learnable chunks (you teach "tie your shoes," not "contract muscle fiber 17")

When prompted to propose tasks for a robot, the LLM retrieves this ontology and generates proposals matching human task structure.

## Comparison to Alternative Approaches

### Unsupervised Skill Discovery [10-13]

Methods like DIAYN, Variational Intrinsic Control (VIC):
- Learn skills by maximizing diversity (distinguishable state visitation patterns)
- No semantic meaning: skills might be "wiggle randomly," "spin in place," "wave arm"
- High entropy, low interpretability
- Difficult to compose: which skill do you chain after "wiggle randomly"?

**ASD advantage**: All proposed tasks are semantically meaningful. No skills emerge that humans can't understand and reuse.

**Limitation**: Unsupervised methods might discover skills humans wouldn't think of. ASD is bounded by human task ontology embedded in LLM training data.

### Manual Skill Specification [2, 3]

Systems like SayCan rely on humans defining primitive skills:
```python
primitives = ["pick", "place", "push", "pull", "open", "close"]
```

This ensures skills are meaningful and composable, but:
- **Effort**: Requires human to analyze domain and specify primitives
- **Completeness**: Might miss important primitives (e.g., forget "slide")
- **Generalization**: Primitives designed for one domain don't transfer

**ASD advantage**: LLM proposes primitives automatically based on environment description. Scales to new domains without redesigning primitive sets.

**Limitation**: LLM might propose inappropriate tasks if environment description is insufficient.

### Bottom-Up Skill Chaining [4, 8, 9]

Methods that start with basic primitives and combine them:
- Assumes primitives exist and are sufficient
- Chains them to create composite skills
- "Pick → move → place" = "relocate object"

**Problem**: If "pick" isn't in primitives, you can't discover it through chaining.

**ASD advantage**: Doesn't require pre-existing primitives. Can propose "pick" as a novel skill to learn from scratch.

**Limitation**: Learning from scratch is slower than chaining existing skills.

## Boundary Conditions: When Granularity Discovery Fails

### Insufficient Environment Description

The LLM proposes tasks based on text descriptions of the environment. If the description is incomplete or inaccurate, granularity suffers:

**Example**: Environment has a drawer, but description doesn't mention it's spring-loaded.

LLM proposes: "Open drawer" (single-step task)

Reality: Opening spring-loaded drawer requires "grasp handle → pull to overcome spring → hold while reaching for object → release slowly"

The task is actually multi-step but was proposed as single-step due to incomplete environment knowledge.

**Mitigation**: Include environmental constraints in descriptions. Better yet, use multimodal LLMs that can observe the environment directly [27].

### Misconceptions About Robot Capabilities

From the paper: "Some of the tasks are not appropriately proposed due to LLM's misconception of... the robot's capabilities."

**Example** (Task 19): "Swap positions of cube A and cube B without grasping"

This is extremely difficult for a robotic arm—requires precisely controlled pushing, predicting cube motion, coordinating multiple pushes. Far beyond "atomic" skill level.

The LLM proposed it because:
- Textually, it sounds atomic ("swap without grasping")
- Humans might do this easily (slide objects by hand)
- LLM doesn't deeply understand robot manipulation constraints

**Mitigation**: Provide feedback about failed tasks. The paper does this: "LLM will be informed about tasks that could not be completed so that it will have a sense of the limits."

After task 19 fails, the LLM should learn that manipulation-without-grasping is difficult and avoid proposing similar tasks.

### Over-Specification

Task 10: "Close the drawer"

The paper marks this as inappropriately proposed because the drawer is always initialized as closed. The LLM misconceived the environment state.

But even if the drawer started open, "close the drawer" is questionable granularity:
- If "open drawer" was learned, "close drawer" is likely similar (inverse motion)
- Learning it separately doubles the skill library for marginal benefit
- Better: learn "toggle drawer state" or parameterize "open_drawer(direction)"

**The tension**: Semantic meaningfulness says "close" and "open" are distinct tasks. Parametric efficiency says they're one task with a direction parameter.

ASD chooses semantic distinctness. This is defensible but not obviously correct.

### Under-Specification

Task 15: "Align end-effector center over the drawer handle without opening or closing the drawer"

This is extremely specific—almost over-specified. Why propose this task?

Possible reason: The LLM is building toward "open drawer" and wants to break it into sub-skills:
1. Locate handle (perception)
2. Align end-effector (positioning)
3. Grasp handle (contact)
4. Pull (manipulation)

But this micro-decomposition might be too fine. "Open drawer" could be learned as a monolithic skill without breaking into these sub-steps.

**The granularity question**: When is breaking a task into sub-skills helpful vs. adding unnecessary complexity?

## Design Principles for Skill Granularity in Agent Systems

### Principle 1: Semantic Boundaries Over Parametric Completeness

Organize skills by meaning, not by parameter values:

**Good**:
```python
skills = {
    "pick_up_object": Policy(...),
    "place_object": Policy(...),
    "slide_object": Policy(...),
}
```

**Bad**:
```python
skills = {
    "pick_with_force_1": Policy(...),
    "pick_with_force_2": Policy(...),
    "pick_with_force_3": Policy(...),
}
```

Parametric variations should be handled by a single skill with parameters, not separate skills.

### Principle 2: Single-Phase Interaction as Default Granularity

Most skills should involve one phase of interaction:
- Contact (reach, touch)
- Grasp (pick, hold)
- Manipulation (push, pull, open)
- Release (place, drop)

Multi-phase interactions should be composed from single-phase skills:
- "Pick and place" = pick + move + place
- "Open and retrieve" = open + reach in + grasp + extract

Exception: If a multi-phase interaction has irreducible coordination requirements (e.g., "balance while walking"), it might need to be a single skill.

### Principle 3: Learnability as Granularity Constraint

A skill should be learnable in reasonable time/samples:

**Heuristic**:
- Single-phase manipulation: ~2000 RL episodes (as in ASD paper)
- Multi-phase manipulation: ~10,000 RL episodes
- Long-horizon tasks: decompose rather than learn monolithically

If a proposed skill consistently fails to learn within budget, it's too complex → decompose.

If a proposed skill learns trivially (< 100 episodes), it might be too simple → consider combining with other skills.

### Principle 4: Use Task Proposal Feedback Loop

The ASD paper's approach: propose task → attempt learning → inform LLM of outcome → adjust subsequent proposals.

This creates adaptive granularity: the LLM learns over time what's too hard, too easy, or inappropriate for the robot.

For orchestration systems:
- Track which composed DAGs succeed/fail
- Feed back to LLM: "Task X failed because sub-skill Y wasn't sufficient"
- LLM adjusts future decompositions: "Break Y into finer sub-skills" or "Provide more specific parameters for Y"

### Principle 5: Maintain Semantic Diversity, Not Exhaustive Coverage

Don't try to fill every cell of a parameter space:

**Good diversity**:
- Pick up cube (rigid object)
- Pick up plate (flat object)
- Pick up cloth (deformable object)

**Bad exhaustiveness**:
- Pick up cube A
- Pick up cube B
- Pick up cube C
- ... (for all cubes in environment)

The first set shows the skill generalizes across object properties. The second set is redundant—once you can pick up cube A, you can likely pick up cube B.

Exception: If object-specific skills are needed (e.g., cube A is heavy, requires different grasp force), then object-specific skills are appropriate.

## Implementation for WinDAG Systems

### Skill Library Organization

```python
class SkillLibrary:
    def __init__(self):
        # Organize by semantic category
        self.skills = {
            "manipulation": ["pick", "place", "slide", "push"],
            "navigation": ["reach", "move_to", "align"],
            "perception": ["detect_object", "track_object"],
            "tool_use": ["open_drawer", "close_drawer"],
        }
        
    def propose_new_skill(self, task_description):
        # LLM proposes task
        proposal = LLM.propose_task(
            environment_context=self.get_context(),
            existing_skills=self.get_skill_names(),
            previous_failures=self.get_failure_history(),
        )
        
        # Check granularity
        if self.is_too_complex(proposal):
            return self.decompose_task(proposal)
        elif self.is_too_simple(proposal):
            return self.suggest_combination(proposal)
        else:
            return proposal
    
    def is_too_complex(self, proposal):
        # Heuristic: task description mentions multiple phases
        phases = count_action_verbs(proposal.description)
        return phases > 2
    
    def is_too_simple(self, proposal):
        # Heuristic: task is very similar to existing skill
        for skill in self.skills.values():
            if semantic_similarity(proposal, skill) > 0.95:
                return True
        return False
```

### Adaptive Granularity Learning

```python
class GranularityLearner:
    def __init__(self):
        self.learning_outcomes = []  # Track successes/failures
    
    def record_outcome(self, task, outcome):
        self.learning_outcomes.append({
            "task": task,
            "success": outcome.success,
            "learning_time": outcome.time,
            "sample_efficiency": outcome.samples,
        })
    
    def get_granularity_feedback(self):
        # Analyze patterns in outcomes
        too_complex_tasks = [
            o for o in self.learning_outcomes
            if not o["success"] and o["learning_time"] > threshold
        ]
        
        too_simple_tasks = [
            o for o in self.learning_outcomes
            if o["success"] and o["learning_time"] < threshold_low
        ]
        
        return {
            "decompose": [o["task"] for o in too_complex_tasks],
            "combine": [o["task"] for o in too_simple_tasks],
        }
```

### Task Proposal with Granularity Constraints

```python
def propose_task_with_granularity(llm, environment, skill_library, granularity_learner):
    # Get feedback from previous learning
    feedback = granularity_learner.get_granularity_feedback()
    
    # Prompt LLM with granularity guidance
    prompt = f"""
    Propose a new task for the robot to learn.
    
    Environment: {environment.description}
    Existing skills: {skill_library.get_skill_names()}
    
    Granularity guidelines:
    - Propose single-phase interactions (reach, grasp, manipulate, release)
    - Avoid multi-step sequences (those will be decomposed separately)
    - Previous tasks that were too complex: {feedback["decompose"]}
    - Previous tasks that were too simple: {feedback["combine"]}
    
    Task:
    """
    
    return llm.generate(prompt)
```

## The Deeper Lesson: Semantic Understanding Enables Appropriate Abstraction

The ASD paper demonstrates that LLMs, trained on human language, have internalized human intuitions about task granularity. They "know" that:
- "Grasp" is a good skill unit
- "Flex finger joint 2" is too low-level
- "Make breakfast" is too high-level

This knowledge comes from exposure to how humans describe tasks in language. It's not explicit (no one taught the LLM "skills should be single-phase interactions"). It's implicit in the distributional patterns of task descriptions in text.

For multi-agent orchestration systems, this suggests: **semantic grounding (through language) provides better abstractions than optimization-based decomposition (through algorithms).**

An algorithm might decompose "make breakfast" into: "move arm to cupboard → open cupboard → grasp plate → move plate to counter → ..." (hundreds of steps).

A language-grounded system decomposes it into: "get plate → prepare eggs → toast bread" (semantic units).

The second decomposition is more robust, more reusable, and more understandable—because it matches human conceptual structure.

The challenge: ensuring the semantic understanding aligns with physical reality. LLMs know human task ontology but may not deeply understand robot constraints. The feedback loop (informing LLM of failures) is critical for grounding semantic understanding in physical capability.