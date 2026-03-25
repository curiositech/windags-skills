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