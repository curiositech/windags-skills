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