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