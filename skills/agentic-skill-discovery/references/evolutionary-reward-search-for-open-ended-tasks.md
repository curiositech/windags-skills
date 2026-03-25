# Evolutionary Reward Search for Open-Ended Tasks: When the Fitness Function Itself Must Be Discovered

## The Traditional Reward Engineering Bottleneck

Reinforcement learning's power comes with a notorious requirement: someone must design a reward function that precisely encodes the desired behavior. This is notoriously difficult. As the ASD paper references [14, 19], reward engineering is often harder than solving the task itself.

Classic RL assumes:
- Task is specified: "open this drawer"
- Success criteria are clear: drawer_position.x > 0.08
- Reward function is hand-crafted: `reward = drawer_position.x - effort_penalty`

Eureka [14] partially automates this: use an LLM to generate candidate reward functions, evolve them based on performance. This works remarkably well for *predetermined tasks* where success is objectively measurable.

But Eureka assumes you can measure "performance" to guide evolution. For open-ended skill discovery, this assumption breaks: **you don't know in advance what "good performance" means for a task the LLM just invented.**

The ASD framework extends evolutionary reward search to open-ended tasks by simultaneously evolving both reward functions AND success functions. This is architecturally fascinating and reveals deep insights about search in unbounded spaces.

## The Evolutionary Loop: Generating and Refining Reward Functions

Algorithm 1 in the paper details the policy-learning function:

```python
def Policy_Learning(environment, robot, task, P_rew, f_succ, K):
    survivors = []
    f_rew_best = null
    
    for k in 1 to K:  # Evolution steps
        # Generate N_rew reward function candidates
        F_rew = {LLM(P_rew ⊕ f_rew_best, env, robot) for _ in range(N_rew)}
        
        best_score = -∞
        
        for f_rew in F_rew:  # Parallel evaluation
            π = RL_Train(env, f_succ, f_rew, robot)
            score = f_succ(π)
            
            if score > 0:
                survivors.append(π)
            
            if score > best_score:
                best_score = score
                f_rew_best = f_rew
        
    return survivors
```

### Key Architectural Choices

**1. Elitism with Mutation**

The best-performing reward function `f_rew_best` is carried over to the next generation and used to prompt the LLM for mutations:

```python
LLM(P_rew ⊕ f_rew_best, env, robot)
```

This is classical evolutionary strategy: keep the best, mutate it, see if mutations improve.

**Why this works**: Reward function space is vast but structured. Small perturbations to a working reward function are more likely to yield another working function than random sampling.

**Example trajectory** (from RAG experiments, implicit in Table 2):
- Generation 1: `reward = -distance(gripper, cube)` [fitness: 0.2]
- Generation 2: `reward = -distance(gripper, cube) + 10*is_grasped` [fitness: 0.6]
- Generation 3: `reward = -distance(gripper, cube) + 10*is_grasped - 0.1*effort` [fitness: 0.8]

Each generation adds refinement: sparse reward for grasping, penalty for excessive motion.

**2. Parallel Evaluation**

The paper trains N_rew=3 reward functions in parallel per generation, with K=3 generations, yielding 9 total training runs per task.

This parallelism is critical for two reasons:

**Computational efficiency**: The paper uses Isaac Sim with 4096 parallel environments. Training 9 policies simultaneously utilizes GPU compute that would otherwise be idle.

**Hedging against local optima**: Some reward functions lead to local optima (e.g., gripper hovers near cube but doesn't grasp). Evaluating multiple candidates increases the probability that at least one finds the global optimum.

**3. Survivor Collection**

Any policy achieving `score > 0` (i.e., passes the success function at least once) is collected as a "survivor." These become skill options in the library.

**Why collect all survivors, not just the best?**

- **Diversity**: Different reward functions may produce qualitatively different behaviors that all solve the task. Keeping multiple options provides robustness.
- **Future composition**: When chaining skills, having multiple options allows selecting the one that best matches the context.
- **Uncertainty**: The "best" reward function according to success rate might not be truly best—success functions can be wrong (false positives).

The paper demonstrates this empirically: Table 2 shows multiple survivor options per task (e.g., task 1 has 4 true positive options).

**4. Early Syntax Checking**

Before launching expensive RL training, the framework validates that generated code is syntactically correct:

```python
F_rew = {f_rew ← LLM(...) | SyntaxCheck(f_rew) = true}
```

This prevents common LLM errors:
- Importing unavailable libraries
- Syntax errors (mismatched parentheses, undefined variables)
- Type errors (wrong tensor dimensions)

From the paper: "Instead of directly launching RL and feeding back LLMs all kinds of execution errors at the end as in Eureka [14], we carry out early syntax checks and loop until the function generations meet certain requirements."

**Why this matters**: RL training takes ~6 hours per reward function. If the LLM generates syntactically invalid code, you waste 6 hours before discovering the error. Syntax checking upfront saves massive compute.

**The trade-off**: Syntax checking doesn't catch semantic errors (code that runs but does the wrong thing). Those only surface after RL training. But catching syntax errors eliminates a large class of failures cheaply.

## The Success Function: Providing Training-Time Feedback

The evolutionary loop requires a fitness function to select survivors. The ASD framework uses the success function for this:

```python
score = f_succ(π)  # Fitness = success rate of policy π
```

The success function is generated by the LLM, similar to reward functions, but with different structure:

**Reward function** (dense, called every timestep):
```python
def reward(obs):
    distance = torch.norm(obs['ee_pos'] - obs['cube_pos'])
    grasp_reward = 10.0 if obs['gripper_closed'] > 0.8 else 0.0
    return -distance + grasp_reward
```

**Success function** (sparse, called at episode end):
```python
def success(obs):
    cube_lifted = obs['cube_pos'][2] > 0.05  # Cube 5cm above table
    gripper_closed = obs['gripper_closed'] > 0.8
    return cube_lifted and gripper_closed