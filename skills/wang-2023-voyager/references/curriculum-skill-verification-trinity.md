# The Curriculum-Skill-Verification Trinity: Architecture for Open-Ended Learning

## Three Subsystems, One Capability Loop

VOYAGER's architecture (Figure 2) consists of three components that form a **capability accumulation loop**:

1. **Automatic Curriculum**: Proposes next task based on current state and exploration progress
2. **Skill Library**: Stores successful solutions as retrievable code programs
3. **Iterative Prompting with Self-Verification**: Generates and refines code using feedback, validates success

Each component is necessary; removing any one breaks the loop (ablations in Figure 9). The trinity implements a **discover-learn-validate-advance cycle** that drives continual improvement.

## The Loop in Action

Pseudocode from Appendix A.1 shows the orchestration:

```python
while True:
    # Curriculum: Propose next task
    exploration_progress = curriculum_agent.get_exploration_progress()
    task = curriculum_agent.propose_next_task(agent_state, exploration_progress)
    
    # Iterative Prompting: Solve task
    for i in range(4):
        skills = skill_manager.retrieve_skills(task, environment_feedback)
        code = action_agent.generate_code(task, code, environment_feedback, execution_errors, critique, skills)
        agent_state, environment_feedback, execution_errors = environment.step(code)
        success, critique = critic_agent.check_task_success(task, agent_state)
        if success:
            break
    
    # Skill Library: Store if successful
    if success:
        skill_manager.add_skill(code)
        curriculum_agent.add_completed_task(task)
    else:
        curriculum_agent.add_failed_task(task)
```

The loop creates a **flywheel effect**: each successful task adds a skill, which enables harder tasks, which add more skills, which enable even harder tasks. Growth is super-linear (Figure 1) because skills compose.

## Information Flow Between Components

### Curriculum → Skill Library

Curriculum provides task descriptions that become skill embeddings. When `add_skill(code)` is called, the system:
1. Prompts GPT-4 to generate description of the code (Prompt 5: "Describe this function in 6 sentences")
2. Embeds description with GPT-3.5
3. Stores (embedding → code) pair in vector DB

The curriculum's task vocabulary defines the skill library's indexing space. If curriculum only proposes mining tasks, library only contains mining skills. **Diversity of curriculum drives diversity of library**.

### Skill Library → Iterative Prompting

Skill retrieval (Figure 4) provides context for code generation:
1. Curriculum proposes "Craft iron pickaxe"
2. GPT-3.5 generates general plan: "Need 3 iron ingots + 2 sticks..."
3. Combine plan + environment feedback (inventory, nearby blocks) as query
4. Retrieve top-5 relevant skills: `mineIronOre()`, `smeltIronIngot()`, `craftSticks()`, `craftWoodenPickaxe()`, `craftStoneSword()`
5. Include retrieved skills in GPT-4 prompt for generating new skill

Retrieved skills serve as **templates** and **subroutines**. If `craftIronPickaxe()` needs iron ingots, it can call `mineIronOre()` (retrieved skill) rather than reinventing iron mining.

### Self-Verification → Curriculum

Verification outcome gates curriculum progression:
- **Success**: Task marked completed, skill added to library, curriculum proposes harder task
- **Failure**: Task marked failed, curriculum may repropose later or skip to different task

Failed tasks form a **frontier of infeasibility**—capabilities the agent can't yet achieve. As the library grows, old failures become feasible (e.g., "craft diamond pickaxe" fails early, succeeds after learning iron mining and diamond mining).

This implements **curriculum with backtracking**: don't abandon hard tasks permanently; revisit when capabilities improve.

### Environment → All Components

Environment provides state observations that inform:
- **Curriculum**: Current inventory/biome/entities determine next task proposal
- **Skill Library**: Environment feedback included in retrieval query (context-sensitive retrieval)
- **Self-Verification**: Agent state after execution determines task success

The environment is the **ground truth** that closes the loop—all reasoning (curriculum, verification, code generation) is ultimately validated by execution outcomes.

## Why the Trinity is Necessary

Ablation studies (Figure 9) quantify the necessity of each component:

**Without Automatic Curriculum** (random or manual curriculum):
- Random: 93% drop in discovered items (violates prerequisite dependencies)
- Manual: 55% drop (doesn't adapt to agent's situation)

The curriculum's adaptation to agent state is critical for efficient exploration. Fixed curricula waste time on impossible or trivial tasks.

**Without Skill Library**:
- Agent plateaus after ~80 items (Figure 9)
- Complex tasks require re-solving subproblems from scratch each time
- No knowledge accumulation across tasks

The skill library enables **compositional capability growth**—new skills build on old. Without it, each task is solved in isolation, limiting complexity.

**Without Self-Verification** (most critical):
- 73% drop in discovered items (largest single ablation effect)
- Agent can't tell when tasks succeed, so keeps refining indefinitely or moves on prematurely
- No reliable signal for skill library additions

Self-verification is the **bottleneck** on learning—without it, the agent is blind to its own performance.

## Design Principles for Multi-Component Architectures

VOYAGER's trinity embodies several architectural principles:

### 1. Separation of Concerns

Each component has a distinct responsibility:
- Curriculum: **what** to do next
- Skill Library: **how** to do things (accumulated knowledge)
- Verification: **whether** it worked

This separation enables independent improvement. Upgrading the curriculum (e.g., better task selection heuristics) doesn't require changing skill library or verification logic.

In software engineering terms: **loose coupling, high cohesion**. Components interact through narrow interfaces (task descriptions, skill code, success booleans) rather than shared state.

### 2. Feedback Loops at Multiple Timescales

- **Fast loop (within-task)**: Iterative prompting refines code over 4 rounds (seconds to minutes)
- **Medium loop (across tasks)**: Curriculum proposes new task after each success/failure (minutes)
- **Slow loop (across sessions)**: Skill library accumulates over 100+ tasks (hours)

Multiple timescales prevent thrashing (don't abandon task after one failure) while maintaining progress (don't get stuck on one task forever).

### 3. Blackbox LLM Interaction

All three components query LLMs via API (GPT-4, GPT-3.5) without gradient updates. This has implications:

**Advantages**:
- No training data required (zero-shot or few-shot prompting)
- Model improvements (GPT-4 → GPT-4.5) benefit system automatically
- Interpretable prompts (read the prompt to understand reasoning)

**Disadvantages**:
- Cost scales with queries (curriculum + code generation + verification = $0.05-0.15 per task)
- Latency from API calls (seconds per query)
- Dependence on external service (OpenAI API availability)

The architecture assumes **LLMs-as-a-service** rather than **LLMs-as-weights**. This is a strategic bet on foundation model providers maintaining superior capabilities.

### 4. Symbolic State Representation

VOYAGER operates on symbolic state (inventory lists, entity names, block types) rather than raw pixels. This enables:
- Curriculum reasoning about state ("have stone pickaxe → propose mining iron")
- Skill retrieval based on state ("near water + have fishing rod → retrieve fishing skills")
- Verification based on state changes ("iron_ingot count increased → mining succeeded")

The symbolic representation is a **bottleneck abstraction**—it hides perceptual complexity but limits tasks to those expressible symbolically. This trade-off is acceptable for many domains (WinDAGs' software tasks are inherently symbolic).

## Transfer to Agent System Design

For WinDAGs orchestration:

**Multi-Agent Orchestration**:
- **Router Agent** (curriculum equivalent): Decides which specialized agent handles next subtask
- **Skill Library** (shared across agents): Stores reusable solutions (API call patterns, data transformations, validation checks)
- **Validator Agent** (verification equivalent): Checks if subtask succeeded, gates progression to next subtask

The trinity becomes a **distributed capability accumulation system** where agents contribute to shared library and router adapts task allocation based on success history.

**Task Decomposition**:
- **Decomposer** (curriculum): Breaks complex task into subtasks
- **Solution Library** (skill library): Stores how subtasks were solved previously
- **Integration Validator** (verification): Checks if subtask solutions compose correctly

The trinity enables **hierarchical planning**: high-level decomposition, low-level execution, mid-level validation.

**Failure Recovery**:
- **Recovery Planner** (curriculum): Proposes recovery actions based on failure mode
- **Recovery Playbook** (skill library): Stores recovery procedures for common failures
- **Recovery Validator** (verification): Confirms recovery restored system to good state

The trinity implements **self-healing systems** where failures trigger adaptive recovery rather than manual intervention.

**Continuous Improvement**:
- **Opportunity Detector** (curriculum): Identifies optimization opportunities (slow queries, redundant code)
- **Optimization Library** (skill library): Stores refactorings and performance improvements
- **Regression Checker** (verification): Ensures optimizations don't break functionality

The trinity drives **iterative refinement** of deployed systems.

## Scaling Considerations

As the system runs longer:

**Curriculum complexity**: As exploration progress grows (100+ completed tasks), the prompt size increases. Mitigation:
- Summarize old tasks ("completed 50 mining tasks" instead of listing each)
- Group tasks hierarchically (tech tree levels)
- Prune irrelevant history (tasks from early exploration may not inform current frontier)

**Skill library size**: 300+ skills means retrieval searches larger space. Mitigation:
- Hierarchical indexing (cluster skills by domain, search cluster first)
- Caching frequent retrievals (top-10 most-used skills always included)
- Skill pruning (remove skills not retrieved in N tasks)

**Verification reliability**: As tasks become more complex, verification reasoning becomes harder. Mitigation:
- More few-shot examples in verification prompt
- Multi-model voting (GPT-4 + Claude + PaLM vote on success)
- Human-in-loop for ambiguous cases

**Cost accumulation**: Each task costs ~$0.10 in API calls. For 1000 tasks, that's $100. At scale (10,000 tasks), costs become prohibitive. Mitigation:
- Use GPT-3.5 for routine operations (curriculum, retrieval), GPT-4 for hard problems (code generation, verification)
- Cache LLM responses (same prompt → same response, lookup before querying)
- Fine-tune open-source models on collected data (bootstrapping toward self-sufficiency)

## The Deeper Lesson

VOYAGER's trinity demonstrates that **emergent intelligence requires orchestrated subsystems**, not monolithic models. No single component (curriculum, library, verification) produces open-ended learning; the interaction creates it.

This is a **systems-level architecture** for intelligence: multiple specialized components with clear interfaces and feedback loops. It echoes biological intelligence (perception, memory, decision-making as separate but coordinated brain systems) and software engineering (microservices over monoliths).

For WinDAGs, the lesson is: **don't expect one giant model to do everything**. Instead, compose specialized agents (planners, executors, validators) that communicate through structured protocols. The orchestration is where intelligence emerges.

The trinity also reveals that **learning is a loop, not a pipeline**. Traditional ML: data → train → deploy. VOYAGER: propose → solve → verify → store → propose harder task. The loop never terminates; each cycle builds on the last. This is **lifelong learning as architectural property**, not algorithmic trick.