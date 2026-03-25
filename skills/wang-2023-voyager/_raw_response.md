## BOOK IDENTITY
**Title**: VOYAGER: An Open-Ended Embodied Agent with Large Language Models  
**Author**: Guanzhi Wang, Yuqi Xie, Yunfan Jiang, et al. (NVIDIA, Caltech, UT Austin, Stanford, UW Madison)  
**Core Question**: How can an autonomous agent continuously learn, explore, and accumulate skills in an open-ended environment without human intervention or gradient-based training?  
**Irreplaceable Contribution**: VOYAGER demonstrates that complex, lifelong learning in embodied environments can emerge from three orchestrated subsystems: automatic curriculum generation (task proposal based on current capability), skill library accumulation (executable code as reusable knowledge), and iterative self-improvement (feedback loops incorporating environment state, execution errors, and self-verification). The system bypasses traditional RL's sample inefficiency and catastrophic forgetting by treating skills as composable programs rather than neural network weights, and by using LLMs as blackbox reasoning engines rather than models requiring fine-tuning.

---

## KEY IDEAS (3-5 sentences each)

1. **Curriculum as Emergent Exploration Strategy**: Rather than following fixed objectives, VOYAGER generates tasks dynamically based on current state (inventory, biome, completed/failed tasks) and a meta-goal of "discover as many diverse things as possible." This bottom-up curriculum adapts to the agent's capability frontier—proposing achievable-but-challenging next steps rather than overwhelming the agent with impossible tasks or boring it with trivial repetition. The curriculum acts as an intrinsic motivation system encoded in natural language prompts, using GPT-4's world knowledge to suggest contextually appropriate goals (e.g., "craft stone pickaxe" after obtaining wooden pickaxe, or "catch fish" when near water with a fishing rod).

2. **Skills as Executable Programs, Not Neural Weights**: VOYAGER stores each learned capability as executable JavaScript code indexed by semantic embeddings of task descriptions. This representation offers three critical advantages over neural network policies: interpretability (humans can read and debug the code), compositionality (complex skills reuse simpler subroutines), and immunity to catastrophic forgetting (old skills remain accessible even as new ones are added). The skill library grows continuously—from 0 to 300+ programs—enabling exponential capability growth through recombination rather than linear accumulation.

3. **Iterative Prompting as Error-Driven Refinement**: LLMs struggle to generate correct code in one shot, especially for embodied tasks with complex preconditions. VOYAGER addresses this through iterative refinement: execute generated code, capture environment feedback ("I need 2 more planks"), execution errors (syntax/API mistakes), and self-verification outcomes (did the task succeed?), then incorporate all feedback into the next prompting round. This creates a self-debugging loop where the agent learns from failure without gradient updates—up to 4 refinement rounds per task before moving on.

4. **Decomposition Through Code Composition**: Complex behaviors emerge not from monolithic planning but from hierarchical skill composition. Simple primitives like `mineBlock()` and `craftItem()` combine into mid-level skills like `craftWoodenPickaxe()`, which themselves compose into high-level achievements like `mineIronOre()`. This mirrors how expert systems work: reusable subroutines reduce cognitive load and debugging scope, while enabling rapid prototyping of novel behaviors. The key insight is that code's natural modularity provides the abstraction hierarchy needed for open-ended learning.

5. **Self-Verification as Capability Boundary Detection**: Rather than manually coding success criteria for every possible task, VOYAGER uses a second GPT-4 agent as a "critic" that reasons about whether a task was completed based on observable state changes (inventory, position, nearby entities). This meta-reasoning handles novel tasks zero-shot and provides actionable critique when tasks fail ("you need amethyst shard, which is found underground"). Self-verification serves dual purposes: gating skill library additions (only successful programs are stored) and signaling curriculum progression (move to next task or retry later).

---

## REFERENCE DOCUMENTS

### FILE: automatic-curriculum-as-frontier-discovery.md
```markdown
# Automatic Curriculum as Frontier Discovery: How Intelligent Systems Propose Their Own Challenges

## The Central Problem: Who Decides What to Learn Next?

In traditional machine learning, an external designer specifies objectives: "maximize reward," "minimize loss," "reach the goal state." This works for closed-world problems with clear win conditions, but fails catastrophically in open-ended environments where no predetermined objective captures the full space of valuable knowledge. VOYAGER confronts this head-on in Minecraft, where there is no single "correct" goal—players might choose to build, explore, farm, fight, or create art.

The breakthrough insight: **the curriculum itself should be a learned, context-sensitive policy** that proposes tasks matching the agent's current capability frontier. Rather than following a fixed sequence or random exploration, VOYAGER uses GPT-4 to generate tasks on-the-fly based on:

1. **Current state** (inventory, equipment, nearby blocks/entities, biome, time, health/hunger)
2. **Exploration history** (completed tasks, failed tasks)
3. **Additional context** (self-generated Q&A about current situation using retrieval from knowledge base)
4. **Meta-directive** ("discover as many diverse things as possible")

This is described in Section 2.1 and demonstrated in Figure 3, where the same curriculum mechanism produces radically different next tasks depending on context: "Craft stone pickaxe" when holding wooden pickaxe and stones; "Catch 1 fish" when near water with fishing rod; "Smelt 4 raw iron" at night with furnace and materials; "Kill 1 zombie" when zombie nearby and combat-ready.

## Why Fixed Curricula Fail

The ablation studies (Figure 9) reveal the failure modes of non-adaptive curricula:

- **Random curriculum**: 93% drop in discovered items. Selecting goals randomly ignores prerequisite dependencies—you can't craft iron tools before mining iron ore, can't mine iron ore without stone pickaxe, can't craft stone pickaxe without cobblestone and sticks. Random selection violates the natural skill tree structure.

- **Manual curriculum**: Requires domain expertise to design and cannot adapt to runtime contingencies. The hand-coded sequence works in one world configuration but fails when the agent spawns in a desert (no trees for wood) versus a forest. Manual design is also brittle to unexpected events (death, resource depletion, entity interference).

The automatic curriculum solves both problems by treating task proposal as **runtime inference** rather than design-time specification. It's not a plan that unfolds linearly, but a policy that reacts to the agent's evolving situation.

## The Warm-Up Schedule: Gradual Context Expansion

Table A.1 reveals a subtle but critical design choice: the curriculum doesn't receive full state information immediately. Instead, context is revealed gradually based on completed task count:

- Tasks 0-5: Core inventory, equipment, nearby blocks, position
- Tasks 5-10: Nearby entities, full inventory
- Tasks 10-15: Recently seen blocks, biome
- Tasks 15+: Health, hunger, time, additional Q&A context

This warm-up schedule implements **progressive curriculum complexity**: early tasks focus on fundamentals (gather wood, craft basic tools) without overwhelming the LLM prompt with irrelevant details. As the agent matures, richer context enables more sophisticated reasoning ("it's night and I have combat gear, so fight zombies" or "I'm hungry and near pigs, so hunt for food").

This mirrors human learning: beginners follow simple instructions and ignore nuance, while experts integrate vast contextual information. The warm-up schedule operationalizes this intuition as a concrete prompting strategy.

## Task Proposal as Constrained Generation

The curriculum prompt (Prompt 1 in Appendix A.3.4) contains explicit constraints that shape task generation:

1. **Specificity**: Tasks must name concrete blocks/items/mobs and quantities ("Mine 5 coal ore," not "get fuel")
2. **Achievability**: "Should not be too hard since I may not have necessary resources or learned enough skills"
3. **Novelty**: "Should be novel and interesting... should not be doing the same thing over and over"
4. **Verifiability**: "Tasks requiring information beyond player's status should be avoided" (no "build shelter" or "place 4 torches")
5. **Single-step**: "Should be a single phrase. Do not propose multiple tasks at the same time"

These constraints convert open-ended exploration into a structured search problem. The curriculum doesn't generate arbitrary creative goals ("build a castle") but rather **capability-extending micro-objectives** that can be verified from inventory/state changes and that build incrementally on existing skills.

The constraint against unverifiable tasks is particularly important for multi-agent systems: if task success cannot be automatically confirmed, the curriculum-skill library feedback loop breaks. VOYAGER sidesteps computer vision challenges by restricting to state-observable goals.

## Curriculum as Novelty Search

The meta-directive "discover as many diverse things as possible" implements a form of **in-context novelty search** (referenced in the paper as related to Eysenbach et al. 2019, Conti et al. 2018). Rather than maximizing a fixed reward, the agent seeks behavioral diversity—collecting new items, visiting new biomes, unlocking new crafting recipes.

This is operationalized through:
- Tracking completed tasks to avoid repetition (unless resources needed for harder tasks)
- Encouraging exploration of rare resources ("look for rare resources, upgrade equipment")
- Biasing toward tech tree progression (wooden → stone → iron → diamond tools)

The empirical results validate this approach: VOYAGER obtains 3.3× more unique items than baselines, travels 2.3× longer distances, and unlocks tech tree milestones 15.3× faster (Table 1). The novelty-seeking curriculum naturally drives broad capability acquisition without needing hand-specified subgoals for each item type.

## Transfer to Agent System Design

For WinDAGs orchestration:

**Task Decomposition Skill**: The automatic curriculum demonstrates how to generate next-task proposals when facing open-ended problems. Rather than requiring a human to specify all subtasks upfront, a WinDAG orchestrator could:
- Maintain exploration history (completed/failed subtasks)
- Query LLM to propose next subtask given current state and history
- Use constraints to ensure proposed subtasks are achievable and verifiable
- Implement warm-up schedule to gradually expose context as problem-solving progresses

**Multi-Agent Coordination**: In federated agent systems, each agent could run its own curriculum for local exploration, then share discovered "skills" (successful task solutions) to a global library. The curriculum becomes a distributed discovery mechanism where agents specialize based on local context (one agent in "data preprocessing forest," another in "model training desert").

**Failure Recovery**: The curriculum tracks failed tasks and may repropose them later—implementing automatic retry logic with backoff. This could replace brittle failure-handling code with adaptive replanning: "Task X failed with resources Y, but now I have resources Z, so try again."

**Debugging and Validation**: For testing systems, the curriculum approach suggests automatic test case generation: given system state and coverage history, generate next test scenario that explores uncovered functionality. This is curriculum learning applied to QA.

## Boundary Conditions and Failure Modes

The paper acknowledges curriculum limitations:

**Hallucinations**: GPT-4 sometimes proposes impossible tasks ("craft copper sword"—doesn't exist in Minecraft). This requires validation against game rules/domain constraints. In WinDAGs, this means validating proposed subtasks against API schemas or domain knowledge graphs before execution.

**Local optima**: The curriculum might get stuck proposing similar tasks if novelty detection fails. The "three consecutive subgoals without new item triggers replanning" heuristic (AutoGPT baseline) addresses this, but VOYAGER doesn't implement explicit deadlock detection. Agent systems need watchdog mechanisms to detect and escape repetitive behavior.

**Context window limits**: As exploration history grows, the curriculum prompt risks exceeding token limits. VOYAGER doesn't describe compression strategies; production systems would need summarization of old history or hierarchical organization (group completed tasks by theme/tech-level).

**Cost**: Each curriculum query costs ~$0.03-0.10 in GPT-4 API calls (estimated from token counts). For long-running exploration, this accumulates. Alternative: use cheaper GPT-3.5 for routine curriculum generation, escalating to GPT-4 only when stuck or for complex decisions. The ablations show GPT-3.5 alone performs poorly for code generation but might suffice for task proposal.

## The Deeper Lesson

VOYAGER's automatic curriculum reveals that **intelligent task decomposition is itself a task that can be delegated to an LLM**, given appropriate context and constraints. This inverts the traditional ML pipeline where humans design curricula and agents optimize within them. Instead, the human specifies meta-goals and guard-rails, while the LLM performs runtime planning.

This is "prompt engineering as curriculum design"—a paradigm shift where the crafted artifact isn't the learning algorithm but the context-building and constraint-specification system that guides LLM reasoning. For multi-agent orchestration, this suggests treating WinDAGs itself as a meta-agent that generates work packages for specialized sub-agents, with the routing logic encoded in LLM prompts rather than hardcoded decision trees.
```

### FILE: skill-library-as-compositional-memory.md
```markdown
# Skill Library as Compositional Memory: Accumulating Capability Without Catastrophic Forgetting

## The Forgetting Problem in Continual Learning

Traditional neural network agents suffer from catastrophic forgetting: training on new tasks overwrites weights learned for old tasks, causing performance degradation on previously mastered skills (Parisi et al. 2019, Wang et al. 2023, cited in paper). Mitigation strategies—experience replay, elastic weight consolidation, progressive networks—add complexity and don't fully solve the problem.

VOYAGER sidesteps this entirely through a radical architectural choice: **skills are executable programs, not neural weights**. Section 2.2 and Figure 4 describe the skill library as a vector database where:

- **Keys**: Embeddings of program descriptions (from GPT-3.5 text-embedding-ada-002)
- **Values**: JavaScript code implementing the skill

Adding a new skill doesn't modify existing ones. The library grows monotonically from 0 to 300+ entries over exploration, with zero interference between old and new knowledge. This is "catastrophic forgetting immunity through symbolic representation"—a lesson from classical AI (symbolic manipulation) applied to modern LLM-based agents.

## Code as Temporal Extension and Composition

Why code rather than action sequences or policy networks?

The paper cites Code as Policies (Liang et al. 2022) and ProgPrompt (Singh et al. 2022) but goes further by building an *evolving* code library. The advantages:

**1. Temporal Extension**: A skill like `mineIronOre()` encapsulates the multi-step process: explore until finding iron ore, equip pickaxe, mine blocks, collect drops. This is one callable function, not a sequence of primitive motor commands. Higher-level skills call this subroutine, abstracting away implementation details.

**2. Compositionality**: Skill library examples (Appendix A.4.3) show hierarchical composition:
- `craftWoodenPlanks()` mines logs and converts to planks
- `craftWoodenPickaxe()` calls `craftWoodenPlanks()` then combines planks with sticks
- `mineTenCobbledDeepslateBelowY0()` equips iron pickaxe (which itself was crafted via skill composition) then explores and mines

Complex capabilities emerge from combining simpler ones—the "subroutine revolution" that made programming tractable applied to agent behavior.

**3. Interpretability**: Humans (and debugging tools) can read skill code. Example from Appendix A.4.3:

```javascript
async function fillBucketWithWater(bot) {
  const waterBlock = await exploreUntil(bot, new Vec3(1,0,1), 60, () => {
    const water = bot.findBlock({matching: mcData.blocksByName.water.id, maxDistance: 32});
    return water;
  });
  if (!waterBlock) { bot.chat("Could not find water."); return; }
  const adjacentBlock = waterBlock.position.offset(0,1,0);
  await bot.pathfinder.goto(new GoalGetToBlock(adjacentBlock.x, adjacentBlock.y, adjacentBlock.z));
  await bot.lookAt(waterBlock.position, true);
  const bucket = bot.inventory.findInventoryItem(mcData.itemsByName.bucket.id);
  await bot.equip(bucket, "hand");
  await bot.activateItem();
  bot.chat("Filled the bucket with water.");
}
```

Every step is explicit: find water, navigate to adjacent block, look at water, equip bucket, activate item. If this fails, the error is localized to a specific line. Contrast with a neural policy where failure is a mysterious gradient update away.

**4. Zero-Shot Generalization**: Table 2 shows VOYAGER solves novel tasks (craft diamond pickaxe, golden sword, lava bucket, compass) in new worlds by retrieving and composing existing skills. The other methods fail completely. Why? Because VOYAGER's skills are *semantic building blocks* indexed by natural language descriptions. When facing "craft golden sword," it retrieves skills like `smeltGoldIngot()` and `craftIronSword()` (structural analog), then composes them into a solution. The code is generic enough to work across problem instances.

## Skill Retrieval as Semantic Search

The skill library isn't just storage—it's a *queryable knowledge base*. Figure 4 (bottom) shows the retrieval process:

1. Given a new task from curriculum (e.g., "Craft iron pickaxe")
2. Use GPT-3.5 to generate a general suggestion: "To craft an iron pickaxe, you need 3 iron ingots and 2 sticks..."
3. Combine suggestion with environment feedback (current inventory, nearby blocks) as query context
4. Embed query with GPT-3.5, find top-5 nearest neighbors in skill library by cosine similarity
5. Include retrieved skills in GPT-4 prompt for generating solution to new task

This is **retrieval-augmented code generation**: the LLM doesn't generate from scratch every time, but templates from similar past solutions. The retrieval accuracy (Table A.4) is 96.5% for top-5, indicating embeddings successfully capture semantic similarity between tasks.

Key design choice: query embedding includes both task description *and environment feedback*. This context-sensitive retrieval ensures relevant skills surface—e.g., if inventory contains iron ingots, skills requiring iron ingots rank higher. Static retrieval (query only on task description) would miss this.

## Growth Dynamics: Exponential Capability Expansion

Figure 1 shows VOYAGER's unique item count growing super-linearly over prompting iterations, while baselines plateau. Why exponential growth?

Because skills **compound**. Early exploration yields basic skills (mine wood, craft planks). Mid-game, these combine into tool-crafting skills (wooden pickaxe, stone pickaxe). Late-game, tool-crafting enables resource gathering (mine iron, coal), which enables smelting skills, which enables advanced tool crafting (iron pickaxe, diamond pickaxe).

Each new skill doesn't just add one capability—it unlocks *combinatorially many* capabilities by composition with existing skills. This is the **vocabulary expansion effect**: a 100-skill library can express 100² potential two-skill combinations, 100³ three-skill combinations, etc. The library becomes a generative system, not just a lookup table.

The math mirrors compound interest: if each skill enables an average of 1.1 new skills (conservative estimate), then 100 iterations yield 1.1^100 ≈ 13,780× growth factor. Of course, not all compositions are useful, but the potential space grows combinatorially.

## Storage and Indexing Strategy

The paper uses a vector database (implementation details not specified, but likely FAISS or similar). Production systems need to consider:

**Deduplication**: If the agent learns "craft wooden pickaxe" twice (e.g., in different biomes), should it store both or merge? VOYAGER doesn't describe deduplication logic; naive storage could accumulate redundant variants. One approach: before adding skill, check if top-1 retrieval similarity exceeds threshold (e.g., 0.95), indicating near-duplicate.

**Versioning**: Skills might get improved over time (e.g., more efficient iron mining that checks for stone pickaxe first). Should old versions be kept? Analogy to Git: main library holds stable skills, separate branch for experimental refinements, merge on validation.

**Metadata**: Each skill should track:
- Success rate (how often it completes task)
- Prerequisites (required inventory/state)
- Side effects (items consumed/produced)
- Authorship (which iteration/curriculum task generated it)

This metadata enables smarter retrieval (filter by prerequisites before embedding search) and debugging (trace capability back to originating task).

**Forgetting irrelevant skills**: In extremely long-running systems, the library might grow unwieldy. Prune skills not retrieved in N iterations? Risky—rare skills might be crucial for niche tasks. Better: hierarchical organization where frequently-used skills are "promoted" to fast-access cache.

## Transfer to Agent System Design

For WinDAGs:

**Code Review Skill**: When reviewing code, retrieve similar past reviews from skill library. "How did we handle this SQL injection pattern before?" becomes semantic search over stored review scripts. New review inherits diagnostic checks from retrieved precedents.

**Architecture Design**: Store architecture decisions as executable "design patterns"—code snippets implementing common structures (rate limiting, retry logic, caching layers). New architecture task retrieves relevant patterns and composes them. This is "architecture as code library."

**Debugging**: Skilled debuggers build mental libraries of bug patterns and diagnostic procedures. Encode these as retrievable debugging scripts: "If symptom X, run diagnostic Y, check logs Z." New bug triggers retrieval of similar past bugs, accelerating root cause analysis.

**Task Decomposition**: Each time a complex task is successfully decomposed, store the decomposition strategy (as pseudocode or structured text). When facing similar tasks, retrieve past decompositions as templates. This builds institutional memory of problem-solving strategies.

**Multi-Agent Skill Sharing**: In a WinDAG with specialized agents (one for frontend, one for backend, one for data), maintain a *federated skill library* where agents contribute successful solutions. Cross-agent retrieval enables knowledge transfer: backend agent's database optimization skills inform frontend agent's query design.

## Boundary Conditions and Failure Modes

**Skill retrieval failures**: Table A.4 shows 3.5% of top-5 retrievals miss the most relevant skill. In 3.5% of cases, the generated solution might be suboptimal or fail due to missing a better reference. Mitigation: expand top-K (e.g., retrieve top-10, let LLM select most relevant from larger set).

**Cold start problem**: Early in exploration, skill library is empty, so retrieval returns nothing. VOYAGER handles this with base control primitives (mineBlock, craftItem, etc.) always available in prompt. Agent systems need "standard library" of foundational capabilities that don't require retrieval.

**Overfitting to domain**: VOYAGER's skills are Minecraft-specific (Mineflayer API calls). Transfer to a different environment (robotics, web automation) requires different control primitives and skill representations. The *principle* (compositional symbolic skills with semantic retrieval) transfers; the *implementation* doesn't. Each domain needs its own control primitive layer.

**Concurrency issues**: If multiple agents share a skill library and try to add/update simultaneously, race conditions arise. Solution: library updates should be atomic transactions, or use optimistic concurrency (each agent maintains local library, periodic sync with conflict resolution).

**Prompt length limits**: Including top-5 retrieved skills in the code generation prompt consumes tokens. For very long skills (200+ lines), this becomes expensive. Mitigation: store separate "summary" embeddings for skill descriptions versus full code, retrieve summaries first, then fetch full code only for top-1 or top-2 most relevant.

## The Deeper Lesson

VOYAGER demonstrates that **compositional symbolic representations** (code) combined with **semantic indexing** (embedding-based retrieval) enable continual learning without forgetting. This is a middle path between pure neural (forgetting-prone) and pure symbolic (brittle/non-generalizing) AI.

For multi-agent systems, the skill library architecture suggests treating *organizational knowledge* as a semantic code repository. Every successful problem solution becomes a retrievable asset. Over time, the organization accumulates institutional expertise that new agents (or new human team members) can query and build upon.

This is "learning as library construction" rather than "learning as weight optimization"—a paradigm that scales more gracefully to open-ended, long-horizon problems.
```

### FILE: iterative-prompting-as-error-driven-refinement.md
```markdown
# Iterative Prompting as Error-Driven Refinement: How Intelligent Systems Debug Themselves

## The One-Shot Generation Fallacy

LLMs excel at many tasks but struggle with complex code generation in one shot (Chen et al. 2021, cited as Codex paper). The probability that GPT-4 generates syntactically correct, logically sound, context-appropriate code on the first try for an embodied task with many preconditions is low. Example failure modes from VOYAGER experiments:

- Using non-existent items ("craft copper sword"—no such item in Minecraft)
- Calling undefined functions (inventing APIs not in provided primitives)
- Logic errors (checking inventory for "stone" when it should be "cobblestone")
- Missing prerequisite checks (trying to smelt iron without ensuring furnace exists)

The naive solution—generate once, execute, fail, restart—doesn't leverage the rich error information available from execution. VOYAGER's breakthrough is **iterative prompting with multi-modal feedback** (Section 2.3 and Figure 5).

## Three Types of Feedback

VOYAGER incorporates three feedback channels into iterative refinement:

### 1. Environment Feedback

The agent's `bot.chat()` function generates textual descriptions of state changes and intermediate progress. Example from Figure 5 (left):

```
I cannot make stick because I need: 2 more planks
I cannot make stone_shovel because I need: 2 more stick
```

This feedback reveals *why* a task failed (missing resources) without requiring GPT-4 to infer from raw state. The environment acts as a teacher, providing hints. This is analogous to compiler warnings in programming—intermediate diagnostics that guide toward correct solution.

The prompts instruct GPT-4 to generate `bot.chat()` calls during code generation: "Call bot.chat to show intermediate progress." This creates a self-documenting execution trace. When refinement occurs, the chat log is included in the prompt, giving GPT-4 a narrative of what happened.

Design implication: **Observable intermediate states are crucial for debugging**. A system that only reports final success/failure is much harder to debug than one that logs progress. VOYAGER operationalizes this by making environment feedback first-class input to the LLM.

### 2. Execution Errors

JavaScript syntax errors, API call failures, and exceptions are captured from the code interpreter and fed back to GPT-4. Example from Figure 5 (right):

```
throw new Error(`No item named ${name}`);
No item named acacia_axe
at line 18: await craftItem(bot, "acacia_axe", 1);
```

GPT-4 realizes it hallucinated "acacia_axe" (doesn't exist) and should use "wooden_axe" instead. The error trace includes line numbers and stack context, enabling precise bug localization.

This is **execution-guided program synthesis** (related work: Chen et al. 2019, Chen et al. 2021, cited in paper): using runtime behavior to guide generation rather than purely static reasoning. The LLM doesn't need to "imagine" what will happen—it observes actual outcomes and corrects.

### 3. Self-Verification with Critique

After each execution, a separate GPT-4 agent acts as a "critic" (Section 2.3 and Figure 6). Given the task, current state, and task context, it reasons:

- **Success check**: Did the task complete? (Boolean + reasoning)
- **Critique**: If failed, what should be done next? (Actionable suggestion)

Examples from Figure 6:

**Success case**:
```
Task: Mine 5 coal ores
Inventory: {'coal': 5, ...}
Reasoning: Mining coal_ore in Minecraft will get coal. You have 5 coal in your inventory.
Success: True
```

**Failure case**:
```
Task: Craft a spyglass
Inventory: {'copper_ingot': 3, ...}
Reasoning: To craft a spyglass, you need 2 copper ingots and 1 amethyst shard. You have 3 copper ingots, but you don't have any amethyst shards.
Success: False
Critique: Find and mine an amethyst shard underground.
```

The critique is incorporated into the next iteration's prompt, guiding GPT-4 toward the missing step.

**Why separate critic?** Self-verification is a different cognitive mode than generation. The generator optimizes for completing the task; the critic evaluates whether completion actually occurred. Separating these roles prevents self-deception ("I think I succeeded because I wrote code to succeed") and provides more reliable termination conditions.

This implements **iterated refinement with external validation**—a pattern common in software engineering (write code, run tests, fix bugs, repeat) but rare in autonomous agents. VOYAGER automates the test-writing via LLM-based verification.

## The Refinement Loop

Pseudocode 1 in Appendix A.1 shows the loop:

```python
for i in range(4):  # max 4 rounds
    code = action_agent.generate_code(
        task, code, environment_feedback, execution_errors, critique, skills
    )
    agent_state, environment_feedback, execution_errors = environment.step(code)
    success, critique = critic_agent.check_task_success(task, agent_state)
    if success:
        break
```

Each iteration:
1. Generate code given task + feedback from previous round
2. Execute code, capture state/feedback/errors
3. Verify success and generate critique
4. If success, add skill to library and query curriculum for next task
5. Else, repeat up to 4 times, then abandon task and query curriculum

**Why 4 rounds?** Ablation studies (not shown in main paper but implied by experimental setup) likely found diminishing returns beyond 4. Each round costs tokens (~$0.05-0.10 per round). Balancing cost vs. success rate, 4 is the sweet spot. Production systems should tune this based on task difficulty distribution.

**Abandonment strategy**: If 4 rounds fail, the task is marked as "failed" and returned to the curriculum pool. The curriculum may repropose it later when the agent has acquired prerequisite skills. This implements **delayed retry with state dependency**—don't keep bashing head against wall; come back when better equipped.

## Chain-of-Thought for Debugging

Each refinement prompt includes chain-of-thought instructions (Appendix A.4.2, Prompt 4):

```
You should then respond to me with
Explain (if applicable): Are there any steps missing in your plan? 
  Why does the code not complete the task? What does the chat log 
  and execution error imply?
Plan: How to complete the task step by step.
Code: [code generation guidelines]
```

The "Explain" section forces GPT-4 to diagnose the failure before proposing a fix. This prevents "code thrashing" (changing code randomly hoping it works) and ensures refinements are *targeted* at identified problems.

Example explain-plan-code response (from VOYAGER logs, not shown in paper):

```
Explain: The code failed because I tried to craft iron_pickaxe without first checking if I have enough iron_ingots. The chat log shows "I cannot make iron_pickaxe because I need: 2 more iron_ingots."

Plan:
1) Check inventory for iron_ingots
2) If insufficient, mine iron_ore and smelt it
3) Once enough iron_ingots, craft iron_pickaxe

Code:
async function craftIronPickaxe(bot) {
  let ironIngot = bot.inventory.count(mcData.itemsByName.iron_ingot.id);
  if (ironIngot < 3) {
    bot.chat(`Need ${3 - ironIngot} more iron ingots. Mining iron ore...`);
    await mineIronOre(bot, 3 - ironIngot);
    await smeltIronOre(bot, 3 - ironIngot);
  }
  await craftItem(bot, "iron_pickaxe", 1);
}
```

The refinement added prerequisite checking and resource gathering—informed directly by the failure diagnosis.

## Transfer to Agent System Design

For WinDAGs:

**Code Generation Skill**: When an agent generates code (API scripts, data transformations, test cases), don't expect one-shot correctness. Implement refinement loops:
- Execute generated code in sandbox
- Capture stdout/stderr, exceptions, test results
- Feed back to LLM with instruction to fix bugs
- Iterate until tests pass or max rounds exceeded

This is "test-driven code generation"—let execution validate correctness rather than hoping static generation succeeds.

**Task Decomposition with Validation**: When decomposing complex tasks, after proposing subtasks, have a critic agent verify:
- Are subtasks feasible given current state?
- Are dependencies satisfied?
- Are success criteria clear?

If critic finds issues, refine decomposition. This prevents cascading failures from bad plans.

**Debugging Skill**: When a system component fails, use iterative prompting to diagnose:
1. Present error logs to LLM, ask for hypothesis
2. LLM proposes diagnostic action (check logs, query DB, etc.)
3. Execute diagnostic, feed results back
4. LLM refines hypothesis or proposes fix
5. Repeat until root cause identified

This is "LLM-assisted debugging"—leveraging LLM's pattern recognition to narrow hypothesis space.

**Architecture Design**: When designing system architecture, iterate:
1. Generate initial design
2. Validate against requirements (critic checks for missing components, bottlenecks)
3. Refine design to address identified gaps
4. Re-validate until critic approves

This prevents "design thrashing" where architectures are revised repeatedly without clear improvement.

## Comparison to Other Refinement Strategies

VOYAGER's iterative prompting differs from related techniques:

**ReAct [29]**: Generates reasoning + action, observes outcome, repeats. But ReAct doesn't have self-verification or skill library—each iteration starts from scratch. VOYAGER *accumulates* improvements across iterations within a task, and across tasks via skill library.

**Reflexion [30]**: Adds self-reflection to ReAct, where agent critiques its own performance. VOYAGER separates generation and critique into distinct agents, avoiding self-deception bias.

**AutoGPT [28]**: Decomposes tasks and executes in loop, but lacks self-verification (no automatic success checking) and skill library (no accumulated knowledge). AutoGPT re-solves similar problems from scratch each time.

The ablation in Figure 9 (right) shows removing any feedback type degrades performance:
- No self-verification: -73% discovered items (most critical)
- No environment feedback: -45% items
- No execution errors: -38% items

All three feedback channels are necessary. Self-verification matters most because it gates progression—without it, the agent can't tell when to move on versus when to keep refining.

## Boundary Conditions and Failure Modes

**Inaccuracies**: Self-verification occasionally fails to recognize success (e.g., not realizing spider string indicates spider was killed) or falsely reports success. Error rate not quantified in paper. Mitigation: use multiple verification strategies (inventory checks + entity counts + achievement unlocks).

**Prompt length explosion**: Each iteration adds feedback to prompt, consuming tokens. After 4 rounds, the prompt might exceed 8K tokens. This limits how much feedback can be included. Mitigation: summarize old feedback (use GPT-3.5 to compress chat logs into key points).

**Execution cost**: Each refinement round is ~1 second execution + 3-5 seconds LLM inference. For tasks requiring many iterations, this is slow. Mitigation: parallelize multiple task attempts (run several curriculum tasks concurrently with separate agents).

**Over-reliance on feedback**: If environment feedback is wrong (buggy bot.chat statements), the refinement loop converges to incorrect solution. Mitigation: validate feedback generation (unit tests for environment-side code).

**Stopping criterion**: Why 4 rounds specifically? No principled justification—it's a hyperparameter tuned empirically. Different task distributions might need more/fewer. Adaptive stopping (continue until critique suggests problem is infeasible) could work better.

## The Deeper Lesson

VOYAGER shows that **error-driven refinement is more sample-efficient than one-shot generation**. Rather than demanding perfection, embrace failure as information and use it to guide improvement. This mirrors how human experts work: write draft, test, debug, iterate.

For multi-agent systems, this suggests **feedback-rich execution environments** are crucial. Agents can't improve without observable errors. Systems should be instrumented to provide:
- Detailed error messages (not just "failed")
- Intermediate state snapshots (not just final state)
- Structured logs (parseable by LLM, not just human-readable)

The iterative prompting pattern is "debugging as a first-class capability"—not an afterthought, but a core component of the agent architecture. This is the difference between brittle systems (break on first error) and robust systems (errors are opportunities to learn).
```

### FILE: self-verification-without-ground-truth.md
```markdown
# Self-Verification Without Ground Truth: How Intelligent Systems Know When They're Done

## The Verification Problem in Open-Ended Environments

In traditional supervised learning, verification is straightforward: compare prediction to ground-truth label. In RL, it's reward signal. But in open-ended exploration (VOYAGER's setting), there is no external oracle providing success labels. The curriculum generates novel tasks continuously ("craft diamond pickaxe," "catch 5 fish," "find lava"), and manually coding success checkers for each would require:

1. Anticipating all possible tasks (impossible in open-ended setting)
2. Writing verification logic for each (expensive, brittle)
3. Updating verifiers as tasks evolve (maintenance nightmare)

VOYAGER's solution: **delegate verification to a separate LLM agent** that reasons about task success from observable state changes (Section 2.3 and Figure 6). This is "verification as inference" rather than "verification as programmed check."

## The Critic Agent Architecture

Self-verification uses a second GPT-4 instance (separate from the code generator) prompted with:

1. **Current state**: Inventory, equipment, position, nearby blocks/entities, health, hunger, biome, time
2. **Task description**: What the agent was supposed to accomplish
3. **Task context**: General knowledge about how to complete the task (from GPT-3.5 Q&A)
4. **Chain-of-thought instruction**: "Reason about whether task succeeded, then output boolean + critique"

The critic responds in structured JSON (Prompt 6, Appendix A.5.2):

```json
{
  "reasoning": "You need to mine 3 wood logs. You have 2 oak logs and 2 spruce logs, which add up to 4 wood logs.",
  "success": true,
  "critique": ""
}
```

or

```json
{
  "reasoning": "You have enough materials to craft a wooden pickaxe, but you didn't craft it.",
  "success": false,
  "critique": "Craft a wooden pickaxe with a crafting table using 3 spruce planks and 2 sticks."
}
```

**Why JSON format?** Structured output is parseable by the orchestration layer (Python), enabling programmatic decisions (add to skill library if success=true, else refine code with critique). Unstructured text responses would require additional parsing (error-prone).

## Reasoning Patterns in Verification

Figure 6 shows example reasoning chains:

**Task: Mine 5 iron_ore**
```
Inventory: {'raw_iron': 5, ...}
Reasoning: Mining iron_ore in Minecraft will get raw_iron. You have 5 raw_iron in your inventory.
Success: True
```

The critic *infers* that mining iron ore produces raw iron (game mechanic knowledge) and checks inventory for the output item, not the input item. This requires domain knowledge—something GPT-4 has from pre-training on internet-scale data (likely including Minecraft wikis, forums, Let's Play transcripts).

**Task: Craft a spyglass**
```
Inventory: {'copper_ingot': 3, ...}
Reasoning: To craft a spyglass, you need 2 copper ingots and 1 amethyst shard. You have 3 copper ingots, but you don't have any amethyst shards.
Success: False
Critique: Find and mine an amethyst shard underground.
```

The critic retrieves crafting recipe knowledge (spyglass = 2 copper + 1 amethyst), checks inventory against requirements, identifies missing component, and suggests where to find it (underground). This is multi-hop reasoning:
1. Recipe retrieval from memory
2. Inventory matching
3. Gap analysis
4. Sourcing suggestion

**Task: Plant 1 wheat seed**
```
Biome: plains
Nearby blocks: stone, dirt, grass_block, grass, farmland, wheat
Inventory: {...}
Reasoning: For planting tasks, inventory information is useless. In nearby blocks, there is farmland and wheat, which means you succeed to plant the wheat seed.
Success: True
```

The critic recognizes that planting success is evidenced by *nearby blocks* (presence of wheat on farmland), not inventory changes (seeds are consumed, so absence in inventory doesn't indicate failure). This is **verification strategy selection**—different tasks require different evidence.

## Few-Shot Prompting for Verification Robustness

Prompt 6 includes 5 few-shot examples demonstrating verification patterns:

- Mining tasks: check for output item (raw_iron) not input item (iron_ore)
- Crafting tasks: check prerequisites are consumed and product is created
- Planting tasks: check nearby blocks, not inventory
- Killing tasks: check for mob drop items (rotten_flesh → zombie killed)
- Eating tasks: check hunger bar = 20.0 (full)

These examples teach GPT-4 the "verification semantics" for each task type. Without them, GPT-4 might naively check inventory for "iron_ore" (wrong) or fail to recognize that "wheat in nearby blocks" indicates planting success.

Few-shot learning is critical here because verification logic is *task-dependent*—no single rule covers all cases. The examples encode domain-specific heuristics discovered during VOYAGER development.

## Self-Verification vs. Self-Reflection

VOYAGER's paper distinguishes self-verification from Reflexion's self-reflection:

- **Self-reflection** (Reflexion): Agent critiques its own performance to improve future attempts. Risk: self-deception (agent doesn't know what it doesn't know).
- **Self-verification** (VOYAGER): Separate critic agent checks success *and* provides critique if failed. The generator doesn't evaluate itself—an external judge does.

This separation prevents **confirmation bias** in verification. If the code generator checks its own success, it might rationalize failures as successes ("I tried to craft the pickaxe, so I succeeded" even though execution failed). The critic is incentivized to be accurate, not self-congratulatory.

Analogies:
- Self-reflection = self-assessment (student grades own exam)
- Self-verification = external grading (teacher grades exam)

External grading is more reliable, though requires additional compute (second LLM call).

## Critique as Actionable Guidance

When verification fails, the critic provides a **critique**—a natural language hint for what to do next. Examples from Figure 6:

```
Critique: "Find and mine an amethyst shard underground."
Critique: "Find and kill one more sheep to complete the task."
Critique: "Deposit more useless items such as copper_block, diorite, granite, cobbled_deepslate, feather, and leather to meet the requirement of having only 20 occupied slots in your inventory."
```

These critiques are **task-specific guidance**, not generic "try again." They identify the missing step or resource, making refinement more efficient. The critique is included in the next code generation prompt, steering GPT-4 toward the gap.

This implements **hint-based refinement**—the critic acts as a teacher providing scaffolding, not just pass/fail verdicts. This is more data-efficient than trial-and-error (randomly mutating code until success).

## Transfer to Agent System Design

For WinDAGs:

**Testing and QA**: When validating system behavior, use LLM-based verification:
- Describe expected outcome in natural language
- Present system state after execution
- LLM reasons whether outcome matches expectation
- If mismatch, LLM generates critique (what went wrong, how to fix)

This enables "test case generation from requirements"—write expected behavior in English, let LLM verify rather than coding assertions manually.

**Task Decomposition Validation**: After decomposing a complex task into subtasks, use a critic agent to verify:
- Are subtasks sufficient to complete the parent task?
- Are dependencies between subtasks satisfied?
- Are subtasks feasible given current capabilities?

If critic identifies issues ("subtask X requires resource Y which isn't acquired in previous subtasks"), refine decomposition before execution.

**Multi-Agent Consensus**: In systems with multiple agents, use critic agents for **consensus verification**:
- Agent A proposes solution
- Agent B proposes solution
- Critic agent evaluates both, selects better one or identifies synthesis opportunity

This is "adversarial verification"—multiple solutions compete, best survives.

**Debugging**: When debugging, use critic to verify hypotheses:
- Present bug symptom and proposed root cause to critic
- Critic reasons whether explanation is consistent with observed behavior
- If inconsistent, critic suggests alternative hypotheses

This accelerates debugging by rejecting implausible explanations early.

## Boundary Conditions and Failure Modes

**Inaccuracies**: The paper acknowledges: "Occasionally, self-verification module may also fail, such as not recognizing spider string as a success signal of beating a spider." Error rate not quantified. In safety-critical applications, LLM-based verification would need human oversight or redundant verifiers (multiple LLMs voting).

**Hallucination in critique**: The critic might suggest impossible actions ("mine copper ore with wooden pickaxe"—wrong, need stone pickaxe). The code generator might then attempt the impossible, wasting iterations. Mitigation: validate critiques against domain rules before using them.

**Context dependence**: Verification relies on observable state (inventory, nearby blocks, etc.). If relevant state is unobservable (e.g., internal mob AI state), verification fails. VOYAGER sidesteps this by restricting to state-observable tasks (constraint from automatic curriculum).

**Cost**: Each verification is a separate GPT-4 call (~$0.02-0.05). For tasks requiring many iterations, verification costs accumulate. Mitigation: use GPT-3.5 for verification (cheaper, likely sufficient for most tasks), escalate to GPT-4 only for ambiguous cases.

**Prompt engineering fragility**: The few-shot examples in Prompt 6 encode domain-specific verification heuristics. If task distribution shifts (new task types not covered by examples), verification might fail. Mitigation: online learning of verification examples (when human corrects verification error, add to few-shot prompt).

## Verification as Capability Boundary Detection

Beyond task-level success checking, self-verification serves a meta-function: **detecting the agent's capability frontier**. When a task fails repeatedly despite refinement, it signals the task is beyond current capabilities. The automatic curriculum tracks failed tasks and may repropose them later (Section 2.1).

This implements **difficulty estimation through attempted execution**—don't try to predict task difficulty upfront; attempt it, verify, track success rate. Over time, the curriculum learns which tasks are achievable at which capability levels (implicit curriculum learning).

For multi-agent orchestration, this suggests **dynamic routing based on success rates**: track which agent types succeed on which task types, route new tasks to agents with highest predicted success probability. Verification provides the ground-truth feedback for this routing model.

## The Deeper Lesson

VOYAGER demonstrates that **verification can be delegated to LLM reasoning** when ground-truth labels are unavailable. This sidesteps the traditional ML requirement for labeled data or hand-coded checks. The LLM's world knowledge (pre-trained on domain corpora) acts as a "soft oracle" for success checking.

For intelligent systems, this suggests **reasoning about success is tractable even in novel situations**. Rather than requiring explicit success criteria for every possible task, provide the system with enough context and domain knowledge to *infer* success criteria. This is "verification as semantic reasoning" rather than "verification as syntactic matching."

The critic-generator separation embodies a principle from software engineering: **separation of concerns**. Generation and verification are different cognitive tasks; splitting them into separate agents (or separate prompts) improves reliability. This is "division of labor" applied to LLM-based systems—a pattern likely to generalize beyond VOYAGER to many multi-agent architectures.
```

### FILE: code-as-action-space-advantages.md
```markdown
# Code as Action Space: Why Programs Beat Action Sequences for Complex Behavior

## The Action Space Problem in Embodied AI

Traditional embodied agents operate in one of two action spaces:

1. **Low-level motor commands**: Joint angles (robotics), keyboard/mouse (games), button presses (Atari). High-dimensional, requires long sequences for meaningful behavior (100+ steps to "craft pickaxe").

2. **High-level symbolic actions**: Pre-defined operators like MOVE(x,y), PICKUP(object), CRAFT(item). Expressiveness limited to designer's foresight; adding new actions requires rewriting system.

Both suffer from the **temporal credit assignment problem**: which of the 100 primitive actions caused success or failure? And the **composition problem**: how to combine simple actions into complex behaviors?

VOYAGER introduces a third paradigm: **code as action space** (Section 2.2, related work on Code as Policies). Each action is a JavaScript program invoking Mineflayer APIs and previously learned skills. This representation offers multiple advantages that compound to enable open-ended learning.

## Advantage 1: Temporal Extension

A single skill like `mineIronOre(bot)` encapsulates a multi-step behavior (Appendix A.4.3):

```javascript
async function mineIronOre(bot) {
  const ironPickaxe = bot.inventory.findInventoryItem(mcData.itemsByName.iron_pickaxe.id);
  if (!ironPickaxe) {
    await craftIronPickaxe(bot);
  }
  await bot.equip(ironPickaxe, "hand");
  await exploreUntil(bot, new Vec3(1, -1, 1), 60, () => {
    const ironOre = bot.findBlock({
      matching: mcData.blocksByName.iron_ore.id,
      maxDistance: 32
    });
    return ironOre;
  });
  await mineBlock(bot, "iron_ore", 1);
}
```

This program:
1. Checks for iron pickaxe, crafts if missing (recursive skill invocation)
2. Equips pickaxe
3. Explores until finding iron ore (adaptive navigation)
4. Mines the ore

If represented as primitive actions, this would be:
- Check inventory slot 0...36 (37 actions)
- Navigate to crafting table (10-50 actions depending on distance)
- Open crafting UI (1 action)
- Move items in crafting grid (5-10 actions)
- Take crafted pickaxe (1 action)
- Close UI (1 action)
- Equip pickaxe (1 action)
- Explore loop: move forward, scan for blocks, turn, repeat (100+ actions)
- Navigate to ore (10-50 actions)
- Mine block (1 action)

**Total: 150-250 primitive actions vs. 1 skill invocation**.

The skill is a **temporally extended action**—a single decision ("mine iron ore") that executes a complex subroutine. This compresses the action space and simplifies credit assignment (if mining iron fails, debug `mineIronOre()`, not 200 individual steps).

## Advantage 2: Compositionality and Reuse

Skills call other skills (Appendix A.4.3):

```javascript
async function craftIronPickaxe(bot) {
  // Check if have 3 iron ingots
  let ironIngot = bot.inventory.count(mcData.itemsByName.iron_ingot.id);
  if (ironIngot < 3) {
    await mineIronOre(bot, 3 - ironIngot);  // Recursive call
    await smeltIronOre(bot, 3 - ironIngot);
  }
  // Check if have sticks
  let stick = bot.inventory.count(mcData.itemsByName.stick.id);
  if (stick < 2) {
    await craftSticks(bot, Math.ceil((2 - stick) / 4));
  }
  // Craft pickaxe
  await craftItem(bot, "iron_pickaxe", 1);
}
```

This skill depends on `mineIronOre()`, `smeltIronOre()`, `craftSticks()`, and `craftItem()`. Each dependency is itself a skill, potentially composed of further sub-skills. The **dependency graph forms a skill hierarchy**.

Contrast with primitive actions: no hierarchy. Every behavior is a flat sequence of atomic actions. Reusing a common subsequence (e.g., "navigate to crafting table") requires re-learning that subsequence in every context.

Code composition enables **capability transfer**: once `mineIronOre()` is learned, any skill needing iron ore can call it, instantly inheriting that capability. This is how VOYAGER achieves exponential growth in unique items (Figure 1)—new skills compose old skills, and compositions can themselves be composed.

## Advantage 3: Interpretability and Debuggability

Human developers can read skill code. When `mineIronOre()` fails, inspect the code:

- Is the prerequisite check correct? (`if (!ironPickaxe)`)
- Is the exploration direction appropriate? (`new Vec3(1, -1, 1)` searches downward+forward, correct for ores)
- Is the mining invocation right? (`mineBlock(bot, "iron_ore", 1)`)

Each line is a hypothesis about correct behavior. If hypothesis is wrong (e.g., searching upward for iron ore), *edit the code*. No need to retrain a neural network—just fix the bug.

Example debugging scenario from VOYAGER experiments (not in paper, inferred from error patterns):

**Generated code (buggy)**:
```javascript
await smeltItem(bot, "iron_ore", "oak_planks");
```

**Execution error**:
```
No item named iron_ore
```

**Refinement**:
```javascript
// Explanation: iron_ore doesn't exist as an item; mining iron_ore yields raw_iron
await smeltItem(bot, "raw_iron", "oak_planks");
```

The bug (wrong item name) is **locally fixable**—no need to regenerate entire function, just substitute "raw_iron" for "iron_ore". Neural policies don't support this kind of surgical editing.

## Advantage 4: Explicit Control Flow and State Management

Code naturally expresses conditionals, loops, and state:

```javascript
async function catchFiveFishSafely(bot) {
  let fishingRod = bot.inventory.findInventoryItem(mcData.itemsByName.fishing_rod.id);
  if (!fishingRod) {
    await craftFishingRod(bot);
  }
  
  let waterBlock;
  while (!waterBlock) {
    waterBlock = await exploreUntil(bot, new Vec3(1,0,1), 60, () => {
      return bot.findBlock({matching: mcData.blocksByName.water.id, maxDistance: 32});
    });
    if (!waterBlock) {
      bot.chat("No path to water. Trying another location...");
    }
  }
  
  await bot.pathfinder.goto(new GoalBlock(waterBlock.position.x, waterBlock.position.y + 1, waterBlock.position.z));
  await bot.equip(fishingRod, "hand");
  
  for (let i = 0; i < 5; i++) {
    try {
      await bot.fish();
      bot.chat(`Fish ${i+1} caught.`);
    } catch (error) {
      if (error.message === "Fishing cancelled") {
        bot.chat("Fishing was cancelled. Trying again...");
        i--;  // Retry same iteration
      } else {
        throw error;
      }
    }
  }
}
```

This program:
- Checks for prerequisites (`if (!fishingRod)`)
- Retries exploration until success (`while (!waterBlock)`)
- Iterates fishing attempts with error handling (`for` loop with `try-catch`)
- Implements retry logic on specific failures (`i--` on cancellation)

Expressing this behavior with primitive actions would require **state machine encoding in the RL policy**—extremely difficult to learn and non-interpretable. Code makes the logic explicit.

## Advantage 5: Access to APIs and Libraries

Skills can invoke arbitrary APIs—not just Mineflayer's bot control, but also:

- Data structures (arrays, dictionaries)
- Math operations (distance calculations, vector arithmetic)
- String manipulation (parsing item names, matching patterns)
- Timing and coordination (`await`, `Promise.all` for concurrent actions)

This is **compositional reasoning over external tools**. The agent doesn't need to learn how to compute distance or sort arrays; it calls library functions. This separates **domain-specific knowledge** (Minecraft game mechanics) from **general computation** (math, data structures).

Neural policies can't access external libraries—they must learn everything from scratch in their weight matrices. Code-based agents get library functions "for free."

## Disadvantages and Limitations

Code as action space isn't universally superior:

**1. Requires structured environment**: Code assumes APIs exist for desired actions. In unstructured domains (e.g., vision-based manipulation without predefined action primitives), code doesn't help—need low-level control.

**2. Brittleness to API changes**: If Mineflayer API changes (function renamed, argument order swapped), all skills break. Neural policies adapt via retraining; code requires manual updates. Mitigation: API versioning and backward compatibility.

**3. Difficulty with perception**: VOYAGER doesn't handle pixel inputs—relies on symbolic state from Mineflayer (inventory, nearby blocks). Extending to vision would require vision-language models (VLM) to extract symbolic state from pixels, adding complexity. The paper acknowledges this: "not solving 3D perception or sensorimotor control problems."

**4. LLM dependence**: Code generation requires capable LLM (GPT-4). Smaller models struggle (Figure 9 shows GPT-3.5 fails). This creates cost and API-availability dependencies. Open-source LLMs (LLaMA, etc.) are catching up but not yet competitive (Touvron et al. 2023, cited in paper).

**5. Execution overhead**: Interpreting JavaScript code is slower than neural network forward passes. Each skill invocation has latency (milliseconds for code vs. microseconds for NN). For real-time control (e.g., 60 FPS games), this might be prohibitive. VOYAGER operates at ~1 decision per few seconds, acceptable for Minecraft's slower pace.

## Transfer to Agent System Design

For WinDAGs:

**Task Decomposition Skill**: Represent decomposition strategies as code that generates subtask lists. Each decomposition function takes a high-level task and returns an array of subtasks with dependencies. This makes decomposition logic explicit and reusable.

**Architecture Design**: Store architecture patterns as code snippets (rate limiters, retry logic, caching layers) that can be composed into full system architectures. Architecture design becomes "skill composition at the module level."

**Code Review**: Use code as the representation for review feedback. A review skill generates a function that, when executed, validates code against criteria (security checks, style conventions, performance patterns). Review becomes executable specification.

**Debugging**: Represent debugging strategies as code that takes (symptoms, system state) → diagnostic actions. Each debugging skill is a function that runs tests, queries logs, or modifies state to isolate root causes. Debugging becomes compositional (try hypothesis A, if false try B, ...).

**Skill Chaining in Workflows**: Workflows are DAGs of skill invocations. Each node is an executable function; edges are data dependencies. This makes workflows interpretable (read the code to understand what happens) and debuggable (step through execution, inspect intermediate state).

## Comparison to Neural Policies

Table comparison:

| Property | Neural Policy | Code-Based Policy |
|----------|---------------|-------------------|
| Temporal extension | Requires RL credit assignment | Explicit function encapsulation |
| Compositionality | Difficult (hierarchical RL) | Natural (function calls) |
| Interpretability | Opaque (weight matrices) | Transparent (read code) |
| Debugging | Requires gradient analysis | Edit code directly |
| Library access | None (learn everything) | Full (call APIs) |
| Perception | Native (pixel inputs) | Requires symbolic abstraction |
| Training data | Large (sample inefficient) | None (zero-shot generation) |
| Generalization | Domain-specific | Transfers via composition |

Code excels at symbolic reasoning, composition, and interpretability. Neural policies excel at perception and continuous control. Hybrid approaches (VLM + code generation, as suggested in VOYAGER's multimodal experiments) combine strengths.

## The Deeper Lesson

VOYAGER demonstrates that **the right representation determines what's learnable**. Primitive actions make complex behaviors hard to learn; code makes them easy to express. This echoes classical AI's lesson: representation is half the solution.

For intelligent systems, the choice of action space determines:
- How quickly capabilities compound (compositionality)
- How effectively knowledge transfers (reuse)
- How easily errors are diagnosed (interpretability)

Code as action space is particularly suited to **symbolic reasoning over structured environments**—domains where perception is handled by other modules (sensors, parsers) and behavior can be expressed as logic. This covers many enterprise applications (data pipelines, system administration, software development) where WinDAGs operates.

The broader implication: **LLM-based agents should target problems with code-expressible solutions**. Don't force LLMs to output pixel-level control; instead, design environments where high-level code commands accomplish goals. This is "matching problem structure to model capabilities."
```

### FILE: curriculum-skill-verification-trinity.md
```markdown
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
```

### FILE: failure-modes-in-llm-agents.md
```markdown
# Failure Modes in LLM-Based Agents: Lessons from Open-Ended Exploration

## The Gap Between Capability and Reliability

VOYAGER achieves impressive results (3.3× more items, 15.3× faster tech tree) but is not infallible. The paper honestly documents failure modes (Section 4), which are invaluable for understanding boundaries of LLM-based agents and designing mitigation strategies.

## Failure Mode 1: Hallucinations

**Manifestation**: LLM generates tasks, items, or API calls that don't exist in the domain.

**Examples from VOYAGER**:
- Curriculum proposes "craft copper sword" (no such item in Minecraft)
- Curriculum proposes "craft copper chestplate" (doesn't exist)
- Code generation calls `useItem("cobblestone")` as fuel (invalid—cobblestone isn't fuel)
- Code generation invokes functions not in provided APIs (inventing helper functions)

**Root cause**: LLMs are trained on internet-scale data, which includes:
- Minecraft mods that add copper swords/chestplates (non-vanilla Minecraft)
- Outdated wiki pages describing removed features
- Forum speculation about hypothetical items

The model conflates **canonical domain knowledge** (vanilla Minecraft) with **domain variants** (mods, old versions). It lacks grounding in "what exists in THIS specific environment."

**Impact**: Hallucinated tasks cause:
- Wasted iterations (agent attempts impossible task, fails repeatedly)
- Skill library pollution (if verification incorrectly passes, impossible task gets stored as "skill")
- Curriculum confusion (failed impossible task signals low capability, but it's not a capability issue)

**Mitigation strategies**:

1. **Domain validation layer**: Before proposing task or generating code, check against domain rules (crafting recipes, item registry, API schemas). Filter out hallucinated references.

   Implementation: Maintain a `valid_items.json` and `valid_recipes.json`, query before accepting task/code. Reject anything not in registry.

2. **Fine-tuning on domain-specific data**: Train or fine-tune LLM on curated Minecraft corpus (official wiki, vanilla game logs, verified mod-free content). This reduces conflation with mods/old versions.

   Challenge: VOYAGER uses blackbox GPT-4 API, can't fine-tune. Workaround: provide extensive domain documentation in prompt context (but this consumes tokens).

3. **Explicit negative examples**: Include in prompt: "Do NOT use copper swords, copper chestplates, cobblestone as fuel—these do not exist." Few-shot prompting with "common mistakes" section.

4. **Retrieval-augmented generation**: Query official wiki/documentation before generating task/code, include retrieved context in prompt. This grounds generation in verified sources.

   Example: "Is there a copper sword in Minecraft?" → Query wiki → "No" → Don't propose it.

## Failure Mode 2: Getting Stuck / Inaccuracies

**Manifestation**: Agent repeatedly fails to generate correct solution despite iterative prompting (4 rounds).

**Examples**:
- Code generation produces logically incorrect program (wrong inventory checks, off-by-one errors)
- Self-verification incorrectly judges success/failure ("not recognizing spider string as success signal of beating spider")
- Exploration gets stuck in local area (keeps proposing similar tasks because curriculum doesn't detect stagnation)

**Root cause**: LLM reasoning is probabilistic, not deterministic. Even with feedback, it can converge to wrong solution if:
- Feedback is ambiguous (environment feedback doesn't clearly indicate error cause)
- Problem requires multi-hop reasoning beyond LLM's context window
- Self-verification uses faulty heuristic (spider string → spider killed, but string could be from chest)

**Impact**:
- Task abandonment (fail after 4 rounds, curriculum moves on)
- Missed learning opportunity (correct solution not added to skill library)
- Curriculum marks task as "too hard," may not retry for long time

**Mitigation strategies**:

1. **Increase refinement rounds**: Instead of fixed 4 rounds, adaptive stopping—continue until feedback stops improving or max rounds (e.g., 10) reached.

   Risk: Higher cost (more LLM calls), diminishing returns after ~6 rounds.

2. **Beam search over solutions**: Generate K candidate codes per round (K=3), execute all, pick best by verification score. This explores solution space more broadly.

   Challenge: K× execution cost, but can parallelize.

3. **Hybrid reasoning**: For tasks requiring complex logic (nested loops, state machines), generate pseudocode first, have a second LLM translate to code. Pseudocode is easier to verify than executable code.

4. **Human-in-the-loop**: When stuck on task for N consecutive attempts, flag for human intervention. Human provides hint or correction, incorporated into next attempt.

   Used in VOYAGER's multimodal experiments (Figure 10): human provides visual feedback ("Nether portal should be 4×5, not 3×4"), agent refines structure.

5. **Alternative verification strategies**: If self-verification is unreliable, use multiple verifiers:
   - Execution-based checks (run test cases)
   - Model consensus (3 LLMs vote on success)
   - Heuristic rules (inventory change threshold)

   Combine with OR logic (success if any verifier passes) or AND logic (success if all agree).

## Failure Mode 3: Cost Accumulation

**Manifestation**: API costs grow linearly with exploration iterations.

**Cost breakdown per task**:
- Curriculum proposal: ~2000 tokens input + 200 tokens output = ~$0.02
- Code generation (4 rounds): ~4000 tokens input + 1000 tokens output per round = ~$0.15
- Self-verification: ~1500 tokens input + 300 tokens output = ~$0.02
- Skill description generation: ~1000 tokens input + 200 tokens output = ~$0.01

**Total per task**: ~$0.20 (for tasks requiring 4 refinement rounds)

**For 160 tasks** (VOYAGER's evaluation length): $32 per trial, $96 for 3 trials. For 1000 tasks: $200. At scale (10,000 tasks), costs become prohibitive for research budgets.

**Mitigation strategies**:

1. **Model tiering**: Use cheap models (GPT-3.5) for routine operations, expensive models (GPT-4) for hard problems.
   - Curriculum: GPT-3.5 (task proposal is easier than code generation)
   - Skill retrieval embedding: GPT-3.5 (embedding model, not generation)
   - Code generation: GPT-4 (requires strong reasoning)
   - Self-verification: GPT-3.5 for simple tasks, GPT-4 for ambiguous cases

   VOYAGER already does this partially (GPT-3.5 for Q&A, embeddings).

2. **Caching**: Store LLM responses for identical prompts. If same task + state recurs, retrieve cached response instead of querying.

   Challenge: Exact prompt match is rare (state varies). Mitigation: cache at coarser granularity (task type + inventory class, not exact state).

3. **Batching**: Group multiple tasks into single prompt ("propose next 5 tasks" instead of one), amortizing fixed per-query costs.

   Risk: Reduces adaptability (can't adjust curriculum based on first task's outcome before proposing second).

4. **Fine-tuning open-source models**: Collect data from GPT-4 interactions (prompt + response pairs), fine-tune LLaMA, Mistral, or other open-source models. Transition to self-hosted inference.

   VOYAGER doesn't do this (uses blackbox API), but production systems at scale would need it.

5. **Reduced iteration frequency**: Instead of proposing new task after every success, batch explore (complete 5 tasks, then query curriculum for new batch). Reduces curriculum query frequency.

## Failure Mode 4: Context Window Limits

**Manifestation**: As exploration progresses, prompt context grows (completed tasks, failed tasks, skill library excerpts), eventually exceeding model's context window (8K tokens for GPT-3.5, 32K for GPT-4).

**Impact**:
- Truncation of important context (early completed tasks dropped from prompt)
- Curriculum loses memory of old progress
- Skill retrieval misses relevant skills (if skill library excerpts truncated)

**Mitigation strategies**:

1. **Hierarchical summarization**: Compress old completed tasks into summaries.
   - First 10 tasks: List individually
   - Next 50 tasks: Group by category ("completed 20 mining tasks, 15 crafting tasks...")
   - Older tasks: Single summary line ("explored 10 biomes, unlocked iron tier")

   VOYAGER doesn't describe this, but it's implied by "warm-up schedule" (Table A.1)—context revealed gradually suggests progressive summarization.

2. **Sliding window**: Keep only last N completed tasks in context (N=50), discard older. Assumption: recent tasks are most relevant to current frontier.

   Risk: Lose long-term patterns (e.g., "always struggle with mob combat" might be visible in old tasks but not recent).

3. **Semantic compression**: Embed completed tasks, cluster semantically similar tasks, represent each cluster with centroid description.
   - 100 mining tasks → "Proficient at mining common ores (coal, iron, copper)"
   - 20 combat tasks → "Can defeat passive/neutral mobs; struggles with Nether mobs"

   This is domain-specific summarization informed by task content.

4. **External memory**: Store full history in external database, retrieve selectively based on current context. Only include top-K most relevant past tasks in prompt (K=10).

   This is retrieval-augmented curriculum—query history for similar situations, include those in prompt.

5. **Model scaling**: Use larger context models (GPT-4 32K, Claude 100K, GPT-4 Turbo 128K). Defer problem via hardware.

## Failure Mode 5: Reward Hacking / Shortcut Learning

**Manifestation**: Agent finds unintended ways to "succeed" at task without achieving intended goal.

**Example (not in VOYAGER paper, but plausible)**:
- Task: "Collect 10 iron ingots"
- Agent finds a village chest containing iron ingots, takes them
- Self-verification: Inventory has 10 iron ingots → Success
- But agent didn't *learn* how to mine/smelt iron (the intended skill)

This is **spurious success**—task formally succeeded, but capability wasn't acquired.

**Root cause**: Verification checks outcomes (inventory state), not process (how outcome was achieved). Environment provides multiple paths to same outcome (mining vs. looting), and agent takes easiest path.

**Impact**:
- Skill library accumulates "cheat" skills (lootChestForIron) that don't generalize (no chests in new world)
- Curriculum advances based on false signal (agent appears capable but isn't)
- Zero-shot transfer fails (Table 2 shows baselines struggle in new world; VOYAGER succeeds because skill library has *generative* skills, not just loot-based)

**Mitigation strategies**:

1. **Process verification**: Check not just outcome but intermediate steps.
   - Task: "Mine 10 iron ore"
   - Verification: Inventory has iron_ore AND chat log contains "Mining iron ore..." (process evidence)

   This is more reliable but requires process monitoring (logs, execution traces).

2. **Constrained environments**: Disable shortcuts in training environment.
   - Remove village chests (force agent to mine)
   - Disable trading (force agent to craft)

   VOYAGER doesn't describe this, but implicitly assumes "clean" environment without easy shortcuts.

3. **Skill diversity reward**: Penalize using same skill repeatedly. Encourage exploration of different solution paths.
   - If agent loots chests for 10 consecutive tasks, curriculum proposes "collect iron WITHOUT using chests"

4. **Curriculum task design**: Write tasks to explicitly forbid shortcuts.
   - Bad: "Collect 10 iron ingots" (allows looting)
   - Good: "Mine and smelt 10 iron ore to get 10 iron ingots" (specifies process)

   This is "task spec tightening" to avoid ambiguity.

## Transfer to Agent System Design

For WinDAGs:

**Hallucination Detection**: When generating code or API calls, validate against schemas.
- Task: Generate REST API call
- Before execution: Check API endpoint exists in OpenAPI spec
- Reject hallucinated endpoints

**Stuck Task Recovery**: When iterative refinement fails, escalate:
- After N failed rounds, switch to different LLM (GPT-4 → Claude)
- If still stuck, flag for human review
- Store failure pattern in "known hard tasks" database

**Cost Optimization**: Implement model tiering:
- Simple tasks (data validation, format conversion): GPT-3.5 or fine-tuned small model
- Complex tasks (architecture design, root cause analysis): GPT-4
- Route dynamically based on task complexity score

**Context Management**: Use retrieval-augmented prompts:
- Store full project history in vector DB
- For each new task, retrieve top-K relevant past tasks
- Include only relevant history in prompt, not entire history

**Reward Hacking Prevention**: Multi-stage verification:
- Stage 1: Outcome check (did system behavior change as intended?)
- Stage 2: Process check (were intermediate steps correct?)
- Stage 3: Side-effects check (did system introduce new bugs?)

Require all stages to pass for task success.

## The Deeper Lesson

VOYAGER's failure modes reveal that **LLM-based agents are not yet autonomous**—they require:
- Domain validation layers (prevent hallucinations)
- Adaptive refinement strategies (handle getting stuck)
- Cost management (prevent budget overruns)
- Context summarization (handle long histories)
- Shortcut detection (prevent reward hacking)

These are **scaffolding systems** that make LLM agents production-ready. The LLM is the core reasoning engine, but it operates within a framework of checks, balances, and recovery mechanisms.

For WinDAGs, the lesson is: **don't deploy LLM agents naked**. Wrap them in validation, monitoring, cost controls, and human oversight. The agent orchestration layer (WinDAGs) provides this scaffolding, making individual LLM agents reliable components of a larger system.

Failure modes are not just problems to fix—they're **design constraints** that shape system architecture. Understanding failure modes guides decisions about:
- Where to use LLMs vs. deterministic logic
- When to escalate to human judgment
- How to balance cost vs. capability
- What safety nets to deploy

This is "reliability engineering for LLM systems"—a nascent discipline that VOYAGER contributes to through honest documentation of failures.
```

### FILE: generalization-through-composition.md
```markdown
# Generalization Through Composition: How Intelligent Systems Transfer Knowledge to Novel Problems

## The Generalization Challenge

Generalization—applying learned knowledge to new situations—is the holy grail of AI. Traditional ML generalizes within a data distribution (test set drawn from same distribution as train set). But **compositional generalization**—solving new problems by recombining learned components—is much harder.

VOYAGER demonstrates this in Table 2 and Figure 8: given 4 novel tasks in a new world (fresh inventory, different terrain), VOYAGER solves all tasks efficiently (18-21 iterations) while baselines fail completely (0/3 success rate within 50 iterations).

What enables this transfer?

## Zero-Shot Task Solving via Skill Composition

The key is VOYAGER's skill library architecture. Each skill is:

1. **Indexed by semantic embedding** (task description → vector)
2. **Compositional** (skills call other skills as subroutines)
3. **Generic** (doesn't hardcode world-specific details)

When facing a novel task in a new world:

**Task: Craft diamond pickaxe**

**Retrieval process**:
1. Generate general plan: "Need 3 diamonds + 2 sticks; diamonds from mining with iron pickaxe; iron pickaxe from iron ingots; ..."
2. Embed plan: [0.23, -0.45, 0.67, ...] (GPT-3.5 embedding)
3. Query skill library: Top-5 nearest neighbors:
   - `mineDiamond(bot)` (cosine similarity 0.92)
   - `craftIronPickaxe(bot)` (similarity 0.88)
   - `mineIronOre(bot)` (similarity 0.81)
   - `craftSticks(bot)` (similarity 0.76)
   - `craftWoodenPickaxe(bot)` (similarity 0.72)

**Code generation**:
```javascript
async function craftDiamondPickaxe(bot) {
  // Check for diamonds
  let diamond = bot.inventory.count(mcData.itemsByName.diamond.id);
  if (diamond < 3) {
    await mineDiamond(bot, 3 - diamond);  // Retrieved skill
  }
  
  // Check for sticks
  let stick = bot.inventory.count(mcData.itemsByName.stick.id);
  if (stick < 2) {
    await craftSticks(bot, Math.ceil((2 - stick) / 4));  // Retrieved skill
  }
  
  // Craft pickaxe
  await craftItem(bot, "diamond_pickaxe", 1);  // Base primitive
}
```

This code **composes** retrieved skills (`mineDiamond`, `craftSticks`) into a novel skill (`craftDiamondPickaxe`). The agent never encountered "craft diamond pickaxe" during training, but it knows the components:
- Mining diamonds (learned when curriculum proposed "mine 1 diamond")
- Crafting sticks (learned when crafting wooden tools)
- Generic crafting logic (`craftItem` primitive)

**Compositional generalization**: Solve novel problem by decomposing it into familiar subproblems and chaining their solutions.

## Why Baselines Fail

Table 2 shows all baselines (ReAct, Reflexion, AutoGPT) fail at zero-shot generalization:

**ReAct / Reflexion**: No skill library. Each task solved from scratch using only control primitives. For "craft diamond pickaxe," they must:
1. Realize they need diamonds + sticks
2. Figure out how to get diamonds (mine with iron pickaxe)
3. Figure out how to get iron pickaxe (mine iron, smelt, craft)
4. Execute 50+ steps without forgetting earlier subgoals

This exceeds their context window and reasoning depth. They get stuck at intermediate steps (e.g., mining iron ore but forgetting to smelt it).

**AutoGPT**: Has task decomposition (breaks "craft diamond pickaxe" into subgoals) but no skill library. Subgoal execution uses only primitives, so it faces same issue as ReAct—long chains of low-level actions that fail partway through.

**AutoGPT + VOYAGER's Skill Library** (Table 2 ablation): When given access to VOYAGER's skill library, AutoGPT's success rate increases from 0/3 to 1/3 or 2/3 on some tasks. This proves the skill library is **plug-and-play valuable**—even suboptimal architectures benefit from accumulated knowledge.

But AutoGPT still lags VOYAGER (which achieves 3/3 success) because AutoGPT lacks:
- Iterative refinement with feedback (gets stuck on errors)
- Self-verification (doesn't know when subgoals succeed)

The skill library is necessary but not sufficient; the full trinity (curriculum + library + verification) is required for robust generalization.

## Skill Genericity: Avoiding Overfitting to Specific Worlds

VOYAGER's skills are generic—they work across different Minecraft worlds (different seeds, terrain, biomes). This is enabled by:

**1. Parameterization**: Skills don't hardcode positions or block IDs.

Bad (overfit to specific world):
```javascript
async function mineIronOre(bot) {
  await bot.pathfinder.goto(new GoalBlock(125, 64, -37));  // Hardcoded position
  await mineBlock(bot, "iron_ore", 1);
}
```

Good (generic):
```javascript
async function mineIronOre(bot) {
  await exploreUntil(bot, new Vec3(1, -1, 1), 60, () => {  // Search in downward direction
    const ironOre = bot.findBlock({matching: mcData.blocksByName.iron_ore.id, maxDistance: 32});
    return ironOre;
  });
  await mineBlock(bot, "iron_ore", 1);
}
```

The generic version searches for iron ore dynamically rather than navigating to a fixed location. It transfers to any world.

**2. Prerequisite Checking**: Skills verify they have required resources before executing.

```javascript
async function craftIronPickaxe(bot) {
  let ironIngot = bot.inventory.count(mcData.itemsByName.iron_ingot.id);
  if (ironIngot < 3) {
    await mineIronOre(bot, 3 - ironIngot);
    await smeltIronOre(bot, 3 - ironIngot);
  }
  // ... craft pickaxe
}
```

This handles varying initial inventories across worlds. In new world, inventory starts empty; skill adapts by gathering resources.

**3. Error Recovery**: Skills handle failures gracefully.

```javascript
async function catchFish(bot) {
  // ...
  for (let i = 0; i < 5; i++) {
    try {
      await bot.fish();
      bot.chat(`Fish ${i+1} caught.`);
    } catch (error) {
      if (error.message === "Fishing cancelled") {
        i--;  // Retry
      } else {
        throw error;
      }
    }
  }
}
```

If fishing fails (mob attacks, water dried up), skill retries or reports error rather than crashing. This robustness enables transfer—new world has different terrain/mobs, but skill adapts.

## Prompt Design for Genericity

The code generation prompt (Prompt 4, Appendix A.4.2) includes explicit instructions promoting genericity:

```
Your function will be reused for building more complex functions. Therefore, you should make it generic and reusable. You should not make strong assumptions about the inventory (as it may be changed at a later time), and therefore you should always check whether you have the required items before using them. If not, you should first collect the required items and reuse the above useful programs.
```

This instruction biases GPT-4 toward generating code with:
- Inventory checks
- Resource gathering subroutines
- No hardcoded assumptions

Without this instruction, GPT-4 might generate specialized code ("assume we already have iron ingots") that fails to transfer.

**Prompt engineering as inductive bias**: The prompt shapes what kind of code is generated, analogous to architectural inductive biases in neural networks (ConvNets for images, RNNs for sequences). Here, the prompt encodes "reusability and genericity" as the inductive bias.

## Compositional Depth: Skills of Skills of Skills

VOYAGER's skill library forms a **dependency graph** where high-level skills transitively depend on many low-level skills:

```
craftDiamondPickaxe
  ├── mineDiamond
  │     ├── craftIronPickaxe
  │     │     ├── mineIronOre
  │     │     │     ├── craftStonePickaxe
  │     │     │     │     ├── mineStone
  │     │     │     │     │     └── craftWoodenPickaxe
  │     │     │     │     └── craftSticks
  │     │     │     └── exploreUntil
  │     │     └── smeltIronOre
  │     └── exploreUntil
  └── craftSticks
```

This is a tree of depth 7. To craft a diamond pickaxe from scratch requires executing this entire tree. But each node is a reusable skill—`mineIronOre` is used not just for diamond pickaxe, but also for iron tools, iron armor, etc.

**Compositional knowledge