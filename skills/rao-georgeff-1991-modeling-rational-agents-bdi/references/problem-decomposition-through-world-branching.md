# Problem Decomposition as Branch Selection in Belief-Goal-Intention Worlds

## The Implicit Theory of Decomposition

While the BDI paper focuses on formalizing beliefs, goals, and intentions, it contains an implicit but powerful theory of how complex problems are decomposed:

**Complex problems exist as multiple branching possibilities in belief-worlds. Problem-solving is the progressive selection of branches through the belief→goal→intention hierarchy.**

This isn't explicitly stated in the paper, but it emerges from the formalism's structure. Let's make it explicit and explore its implications for agent systems.

## The Three-Stage Selection Process

### Stage 1: Belief-Accessible Worlds (Epistemic Branching)

At the belief level, the agent doesn't know:
- Which world she's actually in (multiple possible worlds)
- Which future will occur (multiple branches in each world)

This represents **full problem space**:

```
Belief-World b₁:
  t₀ → Branch A: Use Algorithm 1 → succeeds
            ↳ Branch B: Use Algorithm 1 → fails
            ↳ Branch C: Use Algorithm 2 → succeeds
            ↳ Branch D: Use Algorithm 2 → fails

Belief-World b₂:
  t₀ → Branch E: Use Algorithm 1 → fails  
            ↳ Branch F: Use Algorithm 2 → succeeds
```

The agent believes: "Either I'm in world b₁ (where Algorithm 1 might work) or world b₂ (where only Algorithm 2 works)."

**This is epistemic uncertainty about problem structure.**

### Stage 2: Goal-Accessible Worlds (Desirability Pruning)

Goal-worlds are sub-worlds of belief-worlds. The agent selects branches that lead to desired outcomes:

```
Goal-World g₁ (g₁ ⊑ b₁):
  t₀ → Branch A: Use Algorithm 1 → succeeds
            ↳ Branch C: Use Algorithm 2 → succeeds

Goal-World g₂ (g₂ ⊑ b₂):
  t₀ → Branch F: Use Algorithm 2 → succeeds
```

Notice:
- Failure branches (B, D, E) are pruned
- Only success branches remain
- But both algorithms are still possible (optionality preserved)

**This is desirability filtering over the problem space.**

The agent now represents: "I want to succeed, which means either Algorithm 1 works (if I'm in world b₁) or Algorithm 2 works (if I'm in b₂)."

### Stage 3: Intention-Accessible Worlds (Commitment Selection)

Intention-worlds are sub-worlds of goal-worlds. The agent commits to specific branches:

```
Intention-World i₁ (i₁ ⊑ g₁):
  t₀ → Branch A: Use Algorithm 1 → succeeds

Intention-World i₂ (i₂ ⊑ g₂):
  t₀ → Branch F: Use Algorithm 2 → succeeds
```

Now:
- Only one algorithm per world
- The agent has committed to attempting Algorithm 1 in world-context b₁, Algorithm 2 in world-context b₂

**This is commitment-based selection.**

The agent now represents: "I will attempt Algorithm 1 (if b₁ is actual) or Algorithm 2 (if b₂ is actual), depending on which world I'm actually in."

## Problem Decomposition Emerges from This Structure

A complex problem is one with many belief-branches. Decomposition is the process of:

1. **Identify alternatives** (multiple branches in belief-worlds)
2. **Evaluate alternatives** (prune to goal-worlds based on desirability)
3. **Commit to approach** (prune to intention-worlds based on commitment strategy)

Each stage reduces optionality:
- **Beliefs**: "Many things might happen"
- **Goals**: "I want some of those things"
- **Intentions**: "I'm committed to attempting specific things"

## Application to WinDAGs: Hierarchical Skill Decomposition

Consider a complex request: "Analyze the security vulnerabilities in this codebase."

### Belief-World Structure

```
Belief-World b:
  t₀ → Branch 1: Invoke comprehensive_security_audit skill
           ↳ → succeeds in 2 hours with deep analysis
           ↳ → fails (skill unavailable)
       
       Branch 2: Decompose into [static_analysis, dynamic_analysis, dependency_check]
           ↳ → succeeds in 1 hour with good coverage
           ↳ → static_analysis fails (syntax errors)
           
       Branch 3: Decompose into [pattern_matching, manual_review]
           ↳ → succeeds in 4 hours with manual effort
           ↳ → succeeds in 3 hours if expert available
```

The orchestrator believes all three approaches are possible, with various success/failure branches.

### Goal-World Structure

```
Goal-World g (g ⊑ b):
  t₀ → Branch 1: comprehensive_security_audit succeeds (ideal outcome)
       Branch 2: [static_analysis, dynamic_analysis, dependency_check] succeeds (acceptable outcome)
```

Pruning decisions:
- Branch 1 failure case removed (not a goal to fail)
- Branch 2 failure case removed
- Branch 3 kept only if under time pressure

The goal-world represents: "I want comprehensive audit if possible, otherwise good-enough decomposed approach."

### Intention-World Structure

```
Intention-World i (i ⊑ g):
  t₀ → Branch 2: Attempt [static_analysis, dynamic_analysis, dependency_check]
```

Commitment decision:
- Comprehensive audit might be unavailable → too risky
- Decomposed approach balances coverage and reliability
- Commit to this specific plan

The intention-world represents: "I will attempt the three-skill decomposition."

## The Formalism Reveals: Decomposition is NOT Binary

Traditional decomposition views it as a single decision: "Should I decompose or not?"

The BDI structure reveals **three distinct questions**:

**Question 1 (Belief)**: Is decomposition possible?
- Are the sub-skills available?
- Can they combine to solve the problem?
- What are the failure modes?

**Question 2 (Goal)**: Is decomposition desirable?
- Does it achieve the outcome I want?
- Are there better alternatives?
- What are the trade-offs?

**Question 3 (Intention)**: Am I committed to this decomposition?
- Have I selected this over alternatives?
- Will I persist if initial steps fail?
- What's my commitment strategy?

An agent might believe decomposition is possible (multiple branches in belief-world), decide it's desirable (include it in goal-world), but not yet commit to it (not yet in intention-world because deliberation continues).

## The Non-Primitive Event Mapping

The paper briefly mentions: "Non-primitive events map to non-adjacent time points, thus allowing us to model the partial nature of plans."

This is crucial for decomposition. A non-primitive event like "secure_codebase" maps from t₀ to t₁₀, say, without specifying all intermediate steps.

**Belief-world**: Contains multiple ways to decompose secure_codebase:
- secure_codebase = [static_analysis, fix_issues]
- secure_codebase = [penetration_test, remediation]
- secure_codebase = [comprehensive_audit, apply_patches]

**Goal-world**: Selects decompositions that achieve security (pruning those that don't)

**Intention-world**: Commits to a specific decomposition with specific primitive actions

The formalism naturally represents **hierarchical abstraction**:
- High-level: intend(secure_codebase)
- Mid-level: intend([static_analysis, fix_issues])
- Low-level: intend(run_static_analyzer), intend(parse_results), intend(generate_patches)

Each level is a different granularity of the time-tree branching structure.

## Coordination Without Central Control

Here's a profound implication: **Multiple agents can each have their own belief/goal/intention worlds for the same objective, without requiring a central controller.**

Agent A believes:
- Branch 1: I handle security_audit
- Branch 2: Agent B handles it

Agent A's intention-world:
- Branch 1 only (committed to doing it herself)

Agent B believes:
- Branch 1: I handle security_audit
- Branch 2: Agent A handles it

Agent B's intention-world:
- Branch 2 only (believes A is handling it)

**Coordination emerges** from:
1. Compatible belief-worlds (both agents believe similar branching structures)
2. Complementary intention-worlds (A commits to Branch 1, B commits to "wait for A")
3. Communication that aligns these (A announces intention, B updates beliefs)

No central controller needs to understand the full branching structure. Each agent maintains their own partial view.

For WinDAGs: This suggests a **distributed orchestration pattern** where each agent:
- Maintains beliefs about task structure (branching possibilities)
- Selects goals based on local objectives
- Commits to intentions based on coordination signals
- Updates beliefs based on observed actions of others

## Failure as Branch Discovery

When an intended action fails, the agent moves to a different branch than intended:

**Intended**: i contains Branch A (success path)

**Observed**: Actually moved to Branch B (failure path)

This is **new information** that updates belief-worlds:

**Before**: BEL(optional(Branch A succeeds))

**After**: BEL(¬succeeded(Branch A)) ∧ BEL(observed(Branch B))

This triggers:
1. Belief revision (update world model)
2. Possible goal revision (if single-minded: drop goal if now believed impossible)
3. Possible intention revision (if open-minded: reconsider if still desirable)

**Decomposition implication**: When a sub-task fails, it's not just "task failed, try alternative." It's:

1. Update belief about which world we're in
2. Prune branches now believed impossible
3. Re-evaluate remaining goal-branches
4. Re-commit to new intention-branch

For WinDAGs orchestration, this means failure handling should:

```python
def handle_subtask_failure(self, failed_task, error):
    # 1. Belief update: learn about world structure
    self.beliefs.remove_branch(f"{failed_task}_succeeds")
    self.beliefs.add_observation(f"{failed_task}_failed: {error}")
    
    # 2. Check if overall goal is still achievable
    if not self.beliefs.any_path_to_goal():
        # Single-minded commitment: drop if impossible
        self.intentions.clear()
        return IMPOSSIBLE
    
    # 3. Replan: find alternative branch in goal-world
    alternative_branches = self.goals.find_branches_to(target_state)
    
    # 4. Commit to new intention-branch
    if alternative_branches:
        self.intentions.select(best_alternative(alternative_branches))
        return REPLAN
    else:
        # Open-minded commitment: reconsider goal
        return RECONSIDER_GOAL
```

## The Temporality of Decomposition

Because the formalism uses time-trees, decomposition is **temporally situated**:

**At t₀**: Agent believes multiple decompositions are possible (many branches)

**At t₁** (after attempting first sub-task): Some branches are pruned (attempted routes revealed)

**At t₂** (after second sub-task): Further pruning

The agent's **view of the problem evolves** as she acts. Decomposition is not a one-time plan formation, but an ongoing process of branch-selection-through-action.

This fits situated agent systems where:
- The environment provides feedback
- Sub-task results inform further decomposition
- Replanning happens continuously

Traditional planning: "Decompose fully upfront, then execute."

BDI decomposition: "Commit to initial branches, observe results, prune impossible branches, select next branches."

## Practical Pattern: Progressive Commitment

```python
class ProgressiveDecompositionAgent:
    def __init__(self):
        self.belief_branches = set()  # All possible decompositions
        self.goal_branches = set()    # Desirable decompositions
        self.intention_branch = None  # Currently committed decomposition
    
    def solve(self, problem):
        # Stage 1: Epistemic - identify all possible approaches
        self.belief_branches = self.generate_all_decompositions(problem)
        
        # Stage 2: Desirability - filter to good approaches
        self.goal_branches = {
            b for b in self.belief_branches 
            if self.satisfies_constraints(b)
        }
        
        # Stage 3: Commitment - select one approach
        self.intention_branch = self.select_best(self.goal_branches)
        
        # Stage 4: Execution - act on first step
        first_task = self.intention_branch.first_step()
        result = self.execute(first_task)
        
        # Stage 5: Revision - update based on result
        if result.failed:
            # Prune this branch from beliefs
            self.belief_branches.remove(self.intention_branch)
            # Reconsider goals (might still be achievable via other branches)
            self.goal_branches = {
                b for b in self.belief_branches
                if self.satisfies_constraints(b)
            }
            # Recommit to new branch
            if self.goal_branches:
                self.intention_branch = self.select_best(self.goal_branches)
                return RETRY
            else:
                return IMPOSSIBLE
        else:
            # Continue with this branch
            return CONTINUE
```

This pattern implements the BDI structure:
- Beliefs = full option space
- Goals = filtered option space
- Intentions = committed option
- Action = branch traversal
- Update = branch pruning

## The Meta-Lesson for Orchestration

The BDI formalism reveals that **decomposition is not a function from problems to sub-problems**. It's a **multi-stage filtering process** over a branching possibility space:

1. **Generate** the branching structure (belief-worlds)
2. **Filter** based on desirability (goal-worlds)  
3. **Commit** to specific branches (intention-worlds)
4. **Execute** and observe which branch is actual (action)
5. **Revise** the structure based on observations (belief update)

For WinDAGs, this suggests:
- Don't just ask "How should I decompose this task?"
- Ask: "What are all possible decompositions?" (belief)
- Then: "Which would achieve my objectives?" (goal)
- Then: "Which will I commit to attempting?" (intention)
- Then: "What did I learn from trying?" (revision)

The architecture is **progressive commitment through branch selection**, not one-shot decomposition.