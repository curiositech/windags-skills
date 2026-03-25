---
license: Apache-2.0
name: wang-2023-voyager
description: Mental models and decision frameworks for building autonomous agents that continuously learn, explore, and accumulate skills in open-ended environments without human supervision
category: Research & Academic
tags:
  - embodied-agents
  - open-ended-learning
  - skill-library
  - llm-agents
  - exploration
---

# VOYAGER: Open-Ended Learning Through Autonomous Exploration

## Decision Points

### Task Difficulty Assessment → Curriculum Action

**IF** proposed task requires skills/items agent doesn't have:
- **AND** prerequisites are 1-2 steps away → Accept task, decompose into subtasks
- **AND** prerequisites are 3+ steps away → Reject, request easier task
- **AND** prerequisites are unclear → Request task with more specific requirements

**IF** proposed task is similar to recently completed tasks:
- **AND** success rate on similar tasks >80% → Request harder variation
- **AND** success rate 50-80% → Accept task (skill consolidation zone)
- **AND** success rate <50% → Request easier task

**IF** task involves completely new domain (new biome/tool/mechanic):
- **AND** agent has foundational skills → Accept, expect high iteration count
- **AND** agent lacks foundations → Reject, build prerequisites first

### Skill Retrieval → Context Selection

**IF** current task has clear semantic match in library (similarity >0.85):
- Use top 3 matches as primary context
- Add 1-2 compositional skills that were used together previously

**IF** current task has partial matches (similarity 0.6-0.85):
- Use top 1 exact match + 2-3 related skills
- Include error patterns from previous failures on similar tasks

**IF** current task has no good matches (similarity <0.6):
- Use foundational skills (movement, inventory management, basic crafting)
- Include domain-specific APIs relevant to task context

### Code Generation Failure → Refinement Strategy

**IF** code has syntax/runtime errors:
- Use error message + stack trace as refinement prompt (1-2 iterations usually sufficient)

**IF** code runs but fails verification:
- Compare expected vs actual state changes
- Use environment feedback in next iteration prompt
- **IF** same failure repeats 2+ times → Add explicit debugging prints

**IF** code times out or loops infinitely:
- Add timeout guards and progress checks
- Break complex operations into smaller steps
- **IF** still failing → Decompose task into subtasks

## Failure Modes

### Anti-Pattern 1: "Curriculum Treadmill"
**Symptoms**: Agent gets stuck proposing/failing same difficulty tasks repeatedly  
**Detection**: Success rate flat for 10+ tasks, no new skills added to library  
**Fix**: Force curriculum to propose easier tasks to rebuild confidence, or harder tasks to break through plateau  

### Anti-Pattern 2: "Context Overflow"  
**Symptoms**: Code generation degrades as library grows, LLM context filled with irrelevant skills  
**Detection**: Recent success rate declining despite library growth, retrieval returning low-similarity matches  
**Fix**: Improve semantic indexing, add recency weighting to retrieval, compress old skills into documentation  

### Anti-Pattern 3: "Infinite Refinement"  
**Symptoms**: Agent spends 4+ iterations on tasks that should succeed in 1-2 attempts  
**Detection**: High iteration count with repeated similar errors, no progress between attempts  
**Fix**: Better error categorization, early termination for unsolvable tasks, task decomposition  

### Anti-Pattern 4: "Skill Hoarding"  
**Symptoms**: Library fills with hyper-specific skills that never get reused  
**Detection**: Low skill reuse rate, many skills with usage_count=1  
**Fix**: Encourage more general skill patterns, merge similar skills, add skill cleanup process  

### Anti-Pattern 5: "Verification Drift"  
**Symptoms**: Agent claims success for tasks that obviously failed  
**Detection**: Self-verification approval rate >90% but manual inspection shows failures  
**Fix**: Add objective success criteria, cross-check with environment state, improve verification prompts  

## Worked Examples

### Example: "Smelt Iron Ore" Task Walkthrough

**Initial State**: Agent has iron ore in inventory, knows location of coal

**Step 1: Task Proposal**
- Curriculum agent checks inventory, sees iron ore
- Proposes "smelt 8 iron ore into iron ingots" (appropriately challenging)
- Difficulty assessment: ACCEPT (has materials, understands smelting concept)

**Step 2: Skill Retrieval**
- Query library for "smelt" → finds `smeltCoal()` (similarity 0.72)
- Query for "furnace" → finds `lightFurnace()`, `collectFromFurnace()` (similarity 0.68, 0.64)
- Context: Include these 3 skills + basic inventory management

**Step 3: Code Generation (Iteration 1)**
```javascript
async function smeltIronOre(bot) {
    // Generated code tries to use furnace without coal
    await bot.pathfinder.goto(...furnaceLocation);
    await bot.clickWindow(bot.currentWindow.slots[0]); // Place iron ore
    // Missing: check for coal, light furnace
}
```

**Step 4: Execution + Feedback**
- Environment: "Furnace not lit, smelting failed"
- Self-verification: "I placed iron ore but furnace didn't start smelting"

**Step 5: Code Generation (Iteration 2)**  
```javascript
async function smeltIronOre(bot) {
    await collectCoal(bot); // Reused skill
    await bot.pathfinder.goto(...furnaceLocation);
    await lightFurnace(bot); // Reused skill
    // Place iron ore and coal in correct slots
    await waitForSmelting(bot);
}
```

**Step 6: Success + Library Addition**
- Task succeeds, code added to library with embedding
- Curriculum notes success, proposes next challenge: "craft iron sword"

**Expert vs Novice**: Novice would retry without coal indefinitely; expert recognizes furnace lighting as prerequisite and reuses existing skills.

### Example: "Build Castle" - Task Decomposition

**Initial State**: Agent has basic building blocks, intermediate construction skills

**Step 1: Curriculum Reasoning**
- Task too complex for single program
- Difficulty assessment: REJECT, request decomposition
- Counter-proposal: "build castle foundation 10x10"

**Step 2: Skill Composition Pattern**
- Foundation task uses `digArea()`, `placeBlocks()`, `checkInventory()`
- Success enables next subtask: "build castle walls"
- Each subtask builds on previous: foundation → walls → roof → details

**Progressive Difficulty**: Each castle component increases architectural complexity while reusing spatial reasoning skills.

## Quality Gates

**Task Completion Criteria**:
- [ ] Code executes without runtime errors
- [ ] Environment state matches task requirements (verified objectively)  
- [ ] Self-verification check passes with specific reasoning
- [ ] Resource usage is reasonable (no infinite loops/resource waste)
- [ ] Code reuses existing library skills where appropriate (>50% of functionality from library)

**Skill Library Health**:
- [ ] New skills added only after successful task completion
- [ ] Skill embeddings have semantic coherence (similar tasks cluster together)
- [ ] Library growth rate matches learning rate (new skills enable harder tasks)
- [ ] Skill reuse rate >30% (skills get used in multiple contexts)
- [ ] No dead code (skills unused for >50 tasks get flagged for cleanup)

**System Progress Indicators**:
- [ ] Success rate maintains 60-80% (difficulty calibrated correctly)
- [ ] Task diversity increasing over time (not stuck in local optima)
- [ ] Agent can complete tasks it couldn't attempt 20 tasks ago
- [ ] Curriculum proposals align with agent capability (not too easy/hard)
- [ ] Error recovery time decreasing (faster debugging through experience)

## NOT-FOR Boundaries

**Do NOT use VOYAGER for**:
- **Real-time control systems** requiring <100ms response (use reactive policies instead)
- **Safety-critical applications** where code bugs cause physical harm (use formal verification instead)  
- **Environments without rich state feedback** where verification is impossible (use reward-based RL instead)
- **Single-task optimization** where you want maximum performance on fixed objective (use specialized algorithms instead)
- **Domains where LLMs lack knowledge** like cutting-edge scientific equipment (use human experts instead)

**Delegate to other approaches**:
- For **supervised learning with abundant data** → use `deep-learning-training.md`
- For **multi-agent coordination** → use `swarm-intelligence.md` 
- For **real-time strategy** → use `mcts-planning.md`
- For **mathematical reasoning** → use `formal-verification.md`
- For **human-AI collaboration** → use `interactive-learning.md`

VOYAGER excels at **open-ended single-agent learning** in environments with rich feedback, executable actions, and compositional task structure. Stay within these boundaries for best results.