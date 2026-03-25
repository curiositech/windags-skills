# Reasoning Failure Modes and Recovery Strategies in Multi-Step Problem Solving

## The Taxonomy of Reasoning Failures

The authors conducted detailed manual error analysis on 50 incorrect outputs from LaMDA 137B on math word problems, categorizing failures by what would be needed to fix them. This reveals a structured taxonomy of failure modes that orchestration systems must handle:

**Category 1: Calculator errors only (8% of errors)**
The reasoning chain is completely logically correct except for arithmetic mistakes. Example from the paper: "The produced chain of thought could be made correct just by running the equation through an external calculator, instead of asking the model to do the computation."

This is the shallowest failure mode—the semantic understanding is perfect, the logical structure is perfect, only the mechanical execution of arithmetic is wrong. Solution: augment with external calculator. Indeed, "the solve rate of chain-of-thought prompting for LaMDA 137B GSM8K went up from 14.3% to 17.3% when we added a Python program as an external calculator."

**Category 2: Symbol mapping errors (16% of errors)**
The reasoning logic is correct, but numbers from the problem are incorrectly mapped to equations. The paper defines this precisely: "the chain of thought is correct except for the number symbols, and it could be made totally correct by modifying only the equations and not the words."

Example: Problem asks about work over 50 weeks, 15 hours per week as coach. Model writes "15 x 30 = 450 hours as a coach" instead of "15 x 50." The reasoning structure—multiply hours per week by number of weeks—is correct. The symbolic instantiation is wrong.

**Category 3: One step missing errors (22% of errors)**
The reasoning is correct except that one logical step was skipped. The model correctly performs step 1, correctly performs step 3, but step 2 is implicit or missing entirely. These "could be rewritten to be correct by adding in an additional reasoning step."

Example from the paper: Question asks how many total instructions for two recipes (one with 20, one with twice as many). Model correctly identifies second recipe has 40 instructions, but outputs "So Kelian has to read 40 instructions" instead of "40 + 20 = 60 instructions." One addition step is missing.

**Category 4: Semantic understanding errors (54% of errors)**
These are fundamental failures—the model misunderstands what the problem is asking or makes claims that violate basic world knowledge. "27 of 50 (54%) would require substantial edits to make into a correct chain of thought. Almost all cases here involved some error in semantic understanding."

Example: "Gretchen has 110 coins. There are 30 more gold coins than silver coins. How many gold coins does Gretchen have?"
Model: "There are 110 - 30 = 80 silver coins. So there are 80 silver coins and 110 - 80 = 30 gold coins."

The model doesn't understand that this requires solving a system of equations where gold + silver = 110 and gold = silver + 30. This isn't a missing step or symbol error—it's a failure of problem comprehension.

**Category 5: Incoherent chain-of-thought errors (16% of errors, subset of semantic errors)**
The reasoning chain contains statements that don't follow from previous statements or violate basic logic. "8 of the 27 also had incoherent chain of thoughts, meaning that some statements in the generated chain of thought did not follow from prior ones or violated basic world knowledge."

## Implications for Agent System Error Handling

This taxonomy is directly actionable for orchestration systems. Different failure modes require different recovery strategies:

### Recovery Strategy 1: Augment with Specialized Tools (for Calculator Errors)

When reasoning is correct but execution is flawed, add external tools. The paper demonstrates this with calculators for arithmetic, but the principle generalizes:

**Error detection**: Parse the reasoning chain, extract formal operations (arithmetic, logical inferences, data lookups), verify them with authoritative tools.

**Automatic correction**: If verification reveals errors but the reasoning structure is sound, replace incorrect results with correct ones and regenerate downstream steps.

**Tool selection**: Different reasoning domains need different tools:
- Arithmetic: Python eval or symbolic math systems
- Logical inference: theorem provers or SAT solvers
- Factual claims: knowledge base lookups
- Data operations: SQL or pandas for structured data

Implementation: An orchestration system should wrap reasoning agents with verification layers that check formal operations against ground truth tools, automatically correcting shallow computational errors without requiring full re-reasoning.

### Recovery Strategy 2: Symbol Mapping Verification (for Symbol Errors)

Symbol mapping errors are subtle—the logical template is correct, but instantiation is wrong. Detection requires:

**Entity tracking**: Maintain explicit mapping of entities/values from problem to reasoning chain
**Consistency checking**: Verify that each symbolic reference correctly maps back to problem constraints
**Cross-reference validation**: When a number appears in reasoning, trace it back to problem statement or prior computation

Example implementation:
```
Problem: "works 50 weeks a year, 15 hours per week"
Reasoning: "15 x 30 = 450"
Verification: Check that 30 appears in problem → NO
             Check that 30 was computed earlier → NO
             Flag: Symbol 30 has no grounding
```

**Recovery**: When symbol mapping errors are detected, prompt for re-generation with explicit instruction: "Your reasoning structure is correct, but verify that all numbers in your equations appear in the problem or were computed in previous steps."

### Recovery Strategy 3: Missing Step Insertion (for One-Step-Missing Errors)

When reasoning has correct start and end points but skips intermediate steps, recovery involves:

**Gap detection**: Analyze reasoning chain for logical leaps—places where the conclusion of one step doesn't directly follow from its premises without additional inference.

**Step generation**: Prompt the model to "fill in the gap" between step N and step N+1: "You concluded X from premise Y, but this requires an intermediate step. What computation or inference is needed?"

**Validation**: Verify the inserted step is logically necessary and sufficient to bridge the gap.

The paper's finding that 22% of errors were one-step-missing suggests this is a high-ROI recovery strategy. Many near-correct reasoning chains can be salvaged with targeted step insertion.

### Recovery Strategy 4: Full Re-Reasoning (for Semantic Errors)

When the model fundamentally misunderstands the problem (54% of errors), shallow fixes don't work. Recovery options:

**Decompose differently**: If the model can't grasp the full problem, break it into explicit sub-questions that isolate the conceptual confusion.

Example: Instead of "How many gold coins does Gretchen have if she has 110 total coins and 30 more gold than silver?"

Decompose to:
1. "If Gretchen has X silver coins and 30 more gold coins, how many gold coins does she have? (Express in terms of X)"
2. "If gold + silver = 110, and gold = X + 30, what equation relates X to 110?"
3. "Solve for X"

**Route to more capable agent**: The paper shows semantic understanding errors decrease dramatically with scale (62B→540B fixed 30% of semantic errors). If an agent makes semantic errors, route to higher-capacity agent.

**Provide explicit analogies**: Include a solved example structurally similar to the target problem in the prompt, making the problem type recognizable.

### Strategy 5: Detect and Abort (for Incoherent Reasoning)

When reasoning chains become incoherent—statements don't follow from previous statements—continuing is worse than restarting. Implement real-time coherence monitoring:

**Coherence scoring**: For each reasoning step, check:
- Does the conclusion follow logically from premises?
- Are claims consistent with world knowledge?
- Do entities maintain consistent properties across steps?

**Early stopping**: If coherence drops below threshold, abort and retry with different decomposition or routing.

Example of incoherent reasoning from the paper:
"The percentage of students in hip-hop is the percentage in hip-hop minus the percentage in contemporary minus the percentage in jazz. So the percentage is (25 + 20) - (25 + 20) = 100%."

This should be detectable: the logical form "X = X - Y - Z therefore X = 100%" is incoherent. Coherence monitoring catches this before wasting more compute.

## Hierarchical Recovery: Matching Strategy to Failure Depth

The taxonomy suggests a hierarchical recovery protocol:

**Level 1 (Shallowest)**: Verify formal operations with external tools (catches 8% of errors)
**Level 2**: Verify symbol mappings and entity consistency (catches additional 16%)
**Level 3**: Check for missing steps and insert if possible (catches additional 22%)
**Level 4**: Detect semantic understanding failures, re-route or decompose differently (needed for remaining 54%)

An efficient orchestration system attempts shallow fixes first (cheap, fast) before escalating to expensive strategies (re-routing to stronger models, full problem re-decomposition).

## Proactive Error Prevention

Beyond recovery, the failure taxonomy guides prevention:

**For calculator errors**: Always route arithmetic operations to external calculators, don't rely on LLM computation
**For symbol mapping errors**: Use structured prompts that require explicit entity tracking ("Let's define our variables: X = silver coins, Y = gold coins...")
**For missing step errors**: Prompt for explicit step-by-step reasoning with verification ("After each step, check: have I answered the sub-question?")
**For semantic errors**: Ensure agents are above capability threshold for task complexity before attempting

## Designing Verification Checkpoints

The paper's error analysis suggests specific verification checkpoints to insert in reasoning chains:

**After initial problem representation**: Verify the model correctly understood what the problem asks. Ask: "What question are we answering? What information are we given?"

**After each symbolic operation**: Verify all symbols trace to problem givens or prior computations. Verify operations are arithmetically correct (external calculator).

**Before final answer**: Verify the answer satisfies problem constraints. Ask: "Does this answer make sense given what we know? Let's check..."

**Coherence at every step**: Verify each statement follows logically from previous statements.

## Empirical Calibration: Learning Failure Rates

The paper reports that 46% of incorrect reasoning chains were "almost correct" (Categories 1-3) while 54% had fundamental errors (Categories 4-5). An orchestration system should maintain empirical failure-rate profiles:

For each (agent_capability, task_type, complexity_level):
- Track: % calculator errors, % symbol errors, % missing-step errors, % semantic errors
- This profile determines optimal recovery strategy

Example: If Agent_X on math problems of complexity Y has 30% calculator errors but only 5% semantic errors, invest in calculator augmentation. If Agent_X has 50% semantic errors, route to more capable agent instead.

## The Correction Cascade

The paper's addition of external calculator demonstrates correction cascades: "We propagate the external calculator results from one equation to the following equations via string matching."

This principle generalizes: When you correct an error at step N, you must:
1. Identify all downstream steps that depend on step N's output
2. Regenerate those steps with the corrected value
3. Re-verify the corrected reasoning chain end-to-end

Implementation: Maintain a dependency graph of reasoning steps. When correcting step N, invalidate and regenerate all steps in the transitive closure of N's dependents.

## Success Indicators: Learning What Correct Reasoning Looks Like

The paper reports: "Of 50 random examples where the model returned the correct final answer, all of the generated chains of thought were also logically and mathematically correct except two that coincidentally arrived at the correct answer."

This 96% correspondence between correct reasoning and correct answers (for this task type) is important. It means:

**Correct reasoning is highly predictive of correct answers**: You can use reasoning chain quality as a proxy for answer correctness, enabling verification without ground truth.

**But the reverse isn't always true**: Correct answers occasionally come from incorrect reasoning (2% in this study). Don't assume reasoning is correct just because the answer is.

For orchestration systems: Implement reasoning chain quality scoring. Learn signatures of correct reasoning chains from successful examples. Use these signatures to evaluate new reasoning chains even when you don't have ground truth answers.