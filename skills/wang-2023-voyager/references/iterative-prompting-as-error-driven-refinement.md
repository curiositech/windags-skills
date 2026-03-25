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