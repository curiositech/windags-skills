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