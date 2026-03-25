# Top-Down Quest Decomposition vs. Bottom-Up Skill Chaining: The Architectural Choice That Determines Capability Limits

## The Combinatorial Explosion Problem

When building intelligent systems from primitive skills, you face a fundamental architectural choice: how do you enable complex behaviors?

**Bottom-Up (Skill Chaining)**: Start with basic skills, combine them in all possible ways, accumulate the combinations as new skills, repeat.

**Top-Down (Quest Decomposition)**: Start with a desired complex behavior, decompose it into subtasks, learn missing components on-demand.

The ASD paper demonstrates why this choice matters profoundly: "Prior works primarily focus on combining pre-acquired skills to create more complex behaviors. In such approaches, the so-called 'new skills' are assembled from an existing library of basic skills rather than developed from scratch. Consequently, the potential skill space is constrained by the foundation of the initial skill set."

The key insight: **"For example, a robot proficient only in 'pushing' would be unable to acquire the skill of 'grasping' within the confines of skill assembly."**

No amount of combining "push" variations creates "grasp." Bottom-up chaining can't transcend its primitive basis. Top-down decomposition can identify "grasping" as a missing capability and trigger learning it from scratch.

## Bottom-Up: The Seductive Trap of Completeness

Bottom-up skill assembly seems appealing because it promises completeness. If you have primitives P = {p₁, p₂, ..., pₙ} and can compose them, you can create:

- All sequences: p₁→p₂, p₂→p₁, p₁→p₂→p₃, ...
- All conditionals: if(condition) p₁ else p₂
- All loops: while(condition) p₁
- All compositions: C = {all programs over P}

This feels mathematically satisfying. You have a complete basis and a composition operator. Surely you can build anything?

**The problem**: The composition space C is astronomically large, but also fundamentally limited. You can only build behaviors that are *compositions* of your primitives. If grasping isn't in P and isn't decomposable into P elements, it will never emerge from C.

### Practical Consequences of Bottom-Up

The paper cites several works using bottom-up approaches [4,8,9]:
- SayCan: "decomposes the task into actionable low-level actions"
- BOSS: "chain existing skills"
- DIAL: "stack skills to complete new tasks"

These work well when:
1. The primitive skill library is rich enough
2. The target task is indeed decomposable into primitives
3. The number of useful combinations is manageable

They fail when:
1. A required capability isn't in the library (can't emerge)
2. The compositional search space explodes (can't search)
3. The task requires learning, not just planning (can't discover)

The ASD paper's empirical evidence: many proposed tasks (Table 2) cannot be solved by composition alone. They require genuinely new policies:
- Task 4: "Pick up cube A" — requires grasping policy
- Task 7: "Open the drawer" — requires pull-with-contact policy
- Task 8: "Pick up the plate" — requires flat-grasp policy

These can't be assembled from "reach" and "touch" primitives. They require reinforcement learning to discover the right contact dynamics, grip forces, and motion trajectories.

## Top-Down: Generating Capabilities On-Demand

The ASD framework inverts the paradigm: "Given a quest selected from the failure pool generated during the skill discovery phase, an LLM is tasked with decomposing it into a sequence of subtasks."

Process:
1. Complex task fails to learn as monolithic policy
2. LLM decomposes into subtask sequence
3. For each subtask:
   - If similar skill exists in library → retrieve it
   - If no similar skill exists → learn it on-demand
4. Chain the subtask policies to complete the quest

Example from Table 3: "Stack cube A on top of cube B"

Decomposition:
```
1. Pick up cube A  [retrieve from library]
2. Place cube A on top of cube B carefully, aligning surfaces  [learn on-demand]
```

The first subtask already exists (Task 4 from Table 2). The second subtask is novel—it requires the specific skill of precise vertical placement while maintaining horizontal alignment. This gets learned as a new skill.

**Critical architectural detail**: "As for learning of the ith on-demand skill, since its initial state is reset as the final state of the last stacked skill πᵢ₋₁, i.e., s⁰ᵢ = sᵀᵢ₋₁ ∼ ρ^πᵢ₋₁, we initialize the policy weights from the last learned skill rather than randomly, πᵢ ← πᵢ₋₁."

This is crucial for learning efficiency. The on-demand skill starts from a relevant initial state (holding the cube) and with relevant initial policy (pickup behaviors that work). This dramatically reduces the learning required compared to starting from scratch.

### Why Top-Down Avoids Combinatorial Explosion

Bottom-up must enumerate: push-push, push-reach, push-push-push, push-reach-push, reach-push-reach, ...

The combination count grows factorially: n primitives, k-length sequences = n^k possibilities.

Top-down reasons: "To stack, I need to (1) hold the object, (2) position it above the target, (3) lower it gently."

The decomposition depth is logarithmic in task complexity, not factorial. The LLM's semantic understanding prunes the search space by orders of magnitude.

**The pruning power comes from semantic reasoning**: The LLM knows "stacking" involves "holding" which involves "grasping." It doesn't consider "stacking via pushing" unless that's semantically plausible.

## The Hybrid: Retrieve When Possible, Learn When Necessary

The ASD framework isn't pure top-down—it combines retrieval with on-demand learning:

```python
for task in decomposed_tasks:
    k_star = argmax_k Sim(task, k)  # Find most similar skill
    if k_star != null and Sim(task, k_star) >= tau and Z[k_star] != empty:
        policies = Z[k_star]  # Retrieve existing skill
    else:
        policies = Policy_Learning(task | state)  # Learn on-demand
```

This hybrid strategy gets the best of both worlds:
- **Efficiency**: Reuse existing skills when applicable
- **Capability**: Learn new skills when necessary
- **Compositionality**: Chain both retrieved and learned skills

The similarity threshold τ is critical. Too low → retrieve irrelevant skills that fail in execution. Too high → never retrieve, always learn from scratch (slow, redundant).

The paper doesn't specify τ but implies it's high: "We retrieve previously verified skill specifications." Only validated, reliable skills are candidates for retrieval.

## Empirical Evidence: Quests Completed Through Decomposition

Table 3 shows two quest completions:

**Quest 1: Stack cube A on top of cube B**
- Subtask 1: Pick up cube A [⊳ retrieved, 1/2 fast-pass, 0/22 slow-pass]
- Subtask 2: Place carefully, aligning surfaces [3/3 fast-pass, 0/3 slow-pass]

The notation "1/2" means: 1 policy option, attempted with 2 success functions. The "⊳" indicates retrieval from the existing library.

Interestingly, subtask 1 shows "1/2 fast-pass, 0/22 slow-pass"—this seems to indicate that the retrieved skill didn't work perfectly in the new context. This reveals a boundary condition: retrieved skills may need adaptation when used in decomposed quests.

**Quest 2: Put cube A on top of the plate**
- Subtask 1: Pick up cube A [⊳ retrieved]
- Subtask 2: Place cube A on top of the plate [3/3 fast-pass, 0/3 slow-pass]

The decomposition is simpler here—just pick-and-place. But note: this quest appears as Task 9 in Table 2, where it shows 3/1/3/1 (3 true positive, 1 false positive, 3 true negative, 1 false negative). The direct learning achieved some success.

**Why bother with decomposition if direct learning can work?**

1. **Sample efficiency**: Decomposed learning leverages existing skills, reducing exploration
2. **Reliability**: Chaining validated skills is more trustworthy than monolithic policies
3. **Transferability**: Learned subtask skills can be reused in other quests
4. **Interpretability**: Decomposed execution is easier to debug and understand

## The Role of LLM in Decomposition

The LLM performs semantic task analysis to generate subtask sequences. From the paper: "Given a quest selected from the failure pool, an LLM is tasked with decomposing it into a sequence of subtasks, thereby establishing a hierarchical RL framework."

The LLM must reason about:
- **Temporal ordering**: What must happen before what?
- **Causal dependencies**: What preconditions must be satisfied?
- **Semantic coherence**: Do the subtasks together accomplish the goal?
- **Learnability**: Are the subtasks simple enough to learn individually?

This is sophisticated reasoning that would be difficult to hand-code. The LLM leverages its training on human task descriptions to infer plausible decompositions.

**Example**: For "stack cube A on cube B," the LLM must recognize:
- Stacking requires the cube to be in-hand (precondition: grasping)
- Stacking requires positioning above target (precondition: reaching)
- Stacking requires gentle placement (action: controlled lowering)

The decomposition "pick up → place carefully" captures this reasoning.

## Contrast with Hierarchical RL

Traditional hierarchical reinforcement learning (HRL) learns both high-level policy (which subtask) and low-level policies (how to do subtask) through exploration.

The ASD framework differs:
- **High-level policy is generated by LLM**, not learned
- **Low-level policies are learned via RL**, not programmed
- **Decomposition is task-specific**, not a general hierarchy

This hybrid approach leverages LLM strengths (semantic reasoning, task understanding) while avoiding LLM weaknesses (precise control, motor coordination).

### Why Not Learn the Decomposition?

You could imagine an RL agent learning: "When I want to stack, first I should grasp, then I should lift, then I should place."

The problem: learning good decompositions requires exponentially more data than learning individual skills. The space of possible decompositions is huge, and most decompositions fail catastrophically (e.g., "to stack: first push, then open drawer").

The LLM provides semantic priors that prune this space to plausible decompositions. This is few-shot meta-learning: the LLM has seen thousands of task descriptions during pretraining and can generalize decomposition patterns.

## Design Principles for DAG-Based Orchestration

For a WinDAG system coordinating multiple agents through DAGs:

### 1. Explicit Representation of Missing Capabilities

When a complex task fails, don't just retry or give up. Decompose it and identify which component is missing:

```python
def handle_task_failure(task, skill_library):
    decomposition = LLM.decompose(task)
    for subtask in decomposition:
        if not skill_library.has_similar(subtask, threshold=tau):
            missing_skills.append(subtask)
    
    if missing_skills:
        for skill in missing_skills:
            learn_on_demand(skill, prerequisites=prior_subtasks)
```

This makes capability gaps explicit rather than hidden in monolithic failure.

### 2. Stateful Skill Initialization

When learning skill πᵢ that follows skill πᵢ₋₁, initialize from πᵢ₋₁'s weights:

```python
def learn_conditional_skill(skill, prior_policy):
    initial_state_distribution = run_prior_policy_to_completion(prior_policy)
    new_policy = copy_weights(prior_policy)  # Initialize from prior
    return RL_train(new_policy, initial_states=initial_state_distribution)
```

This encodes the assumption: skills in a sequence are related. The prior policy's behaviors are relevant starting points.

### 3. Decomposition Depth Control

Don't decompose indefinitely. Set a maximum decomposition depth (e.g., 3 levels):

- **Level 0**: Original quest (e.g., "clean the kitchen")
- **Level 1**: Major phases (e.g., "wash dishes," "wipe counters," "sweep floor")
- **Level 2**: Atomic actions (e.g., "pick up plate," "scrub plate," "rinse plate")

If a Level 2 subtask can't be learned, it may be:
- Actually atomic (no further decomposition)
- Beyond current capabilities (needs new primitives)
- Incorrectly specified (LLM decomposition error)

### 4. Failure Mode Analysis

When decomposed execution fails, diagnose where:

```python
def execute_quest(decomposition, skill_library):
    for i, subtask in enumerate(decomposition):
        policy = skill_library.get(subtask)
        success = execute(policy)
        if not success:
            return QuestFailure(
                failed_subtask=subtask,
                failed_at_step=i,
                prior_context=[decomposition[:i]],
                error_mode=classify_failure(policy, subtask)
            )
```

This enables targeted learning: if step 3 fails, focus on improving that subtask's policy, not re-learning the entire quest.

### 5. Validate Decompositions Before Learning

Before launching expensive on-demand learning, validate the decomposition:

```python
def validate_decomposition(decomposition):
    # Check temporal ordering
    for i in range(len(decomposition)-1):
        if not postcondition(decomposition[i]).satisfies(precondition(decomposition[i+1])):
            return False, f"Step {i} doesn't enable step {i+1}"
    
    # Check completeness
    if not achieves_goal(decomposition):
        return False, "Decomposition doesn't achieve quest goal"
    
    return True, "Valid decomposition"
```

The LLM can generate plausible-sounding but incorrect decompositions. Validation catches errors before wasting compute on learning.

## Boundary Conditions: When Decomposition Fails

### Truly Monolithic Skills

Some skills can't be meaningfully decomposed. "Balance on one foot" isn't usefully decomposed into "shift weight → lift foot → maintain stability"—the skill is the coordination itself, not the sequence.

For such skills:
- Direct learning is necessary
- Decomposition adds overhead without benefit
- The LLM should recognize this and not decompose (challenging)

### Incorrect Decompositions

The LLM can propose decompositions that don't actually work:
- Wrong temporal order (place cube → grasp cube)
- Missing critical steps (grasp → release, without "move to target")
- Impossible transitions (state after step 1 doesn't enable step 2)

Detection strategy:
- **Dry-run simulation**: Execute decomposition with existing skills, check if quest goal is achieved
- **Precondition checking**: Verify postconditions satisfy next step's preconditions
- **Human review**: For high-stakes quests, have human validate decomposition

### Over-Decomposition

Decomposing too finely creates overhead:
- "Move arm to cube" → "Activate joint 1 → activate joint 2 → ..."

The atomic level should be at the skill abstraction layer, not motor commands. The LLM must understand the appropriate granularity.

### Context Dependence

The same quest may require different decompositions in different contexts:
- "Stack cubes" in open space → pick → place
- "Stack cubes" in cluttered space → pick → navigate → place

The decomposition must be context-aware. The LLM needs sufficient environmental information to generate appropriate decompositions.

## The Deeper Architectural Principle: Capability-Driven Learning

The shift from bottom-up to top-down is really a shift from **exploration-driven** to **capability-driven** learning:

**Exploration-Driven** (bottom-up):
- "Try all combinations of what we can do"
- Driven by possibility (what's mechanically feasible)
- Leads to exhaustive search, many useless skills

**Capability-Driven** (top-down):
- "Identify what we need to do, learn it if we can't"
- Driven by necessity (what's required for goals)
- Leads to targeted learning, useful skills

The ASD framework demonstrates this shift: the LLM proposes *meaningful* tasks (capability targets), the system learns them on-demand, and accumulates a library of *useful* skills rather than exhaustive combinations.

For multi-agent orchestration, this suggests:
- Don't pre-generate all possible workflows
- Maintain a library of proven workflows
- When a new request arrives, decompose it
- Learn missing components on-demand
- Accumulate the successful workflow for future reuse

The system becomes more capable over time not by exploring all possibilities but by accumulating solutions to actual problems.

## Implementation for WinDAG Systems

For a DAG-based orchestration system:

**Quest Decomposition Service**:
```python
class QuestDecomposer:
    def __init__(self, llm, skill_library):
        self.llm = llm
        self.library = skill_library
    
    def decompose(self, quest):
        # LLM generates decomposition
        subtasks = self.llm.generate_subtasks(
            quest=quest,
            context=self.library.get_context(),
            max_depth=3
        )
        
        # Validate decomposition
        valid, error = self.validate(subtasks)
        if not valid:
            # Try again with error feedback
            subtasks = self.llm.generate_subtasks(
                quest=quest,
                context=self.library.get_context(),
                max_depth=3,
                previous_error=error
            )
        
        return subtasks
    
    def validate(self, subtasks):
        # Check temporal ordering, preconditions, etc.
        ...
```

**On-Demand Learning Orchestrator**:
```python
class OnDemandLearner:
    def execute_quest(self, quest, skill_library):
        decomposition = self.decomposer.decompose(quest)
        learned_skills = []
        
        for i, subtask in enumerate(decomposition):
            # Try retrieval first
            skill = skill_library.retrieve_similar(subtask, tau=0.9)
            
            if skill is None:
                # Learn on-demand
                prior_policy = learned_skills[-1].policy if learned_skills else None
                skill = self.learn_skill(
                    subtask,
                    prior_policy=prior_policy,
                    context=learned_skills
                )
                skill_library.add(skill)
            
            learned_skills.append(skill)
        
        # Return composed quest policy
        return ComposedPolicy(learned_skills)
```

This architecture enables true autonomous capability expansion: the system can tackle tasks beyond its current skill library by decomposing them and learning missing components on-demand.

The capability frontier expands not through exhaustive exploration but through targeted learning driven by meaningful goals.