# How Serial Processing and Memory Limits Shape Problem-Solving Behavior

## The Invariant Characteristics

Simon and Newell identify the "few, and only a few, gross characteristics of the human information-processing system [that] are invariant over task and problem solver" (p. 148):

1. **Serial processing**: "essentially one-process-at-a-time, not in parallel fashion"
2. **Process timing**: "Elementary processes take tens or hundreds of milliseconds"
3. **Limited short-term memory**: "A few symbols" (~7 items)
4. **Slow long-term storage**: "The time required to store a symbol in that memory is of the order of seconds or tens of seconds"
5. **Fast long-term retrieval**: Access to essentially infinite memory with rapid retrieval

These constraints—particularly the serial nature and memory limits—**force specific problem-solving strategies** that would not be necessary for different architectures.

## Progressive Deepening vs. Scan-and-Search

The most striking example of constraint-driven strategy is in chess:

"De Groot found that the tree of move sequences explored by players did not originate as a bushy growth, but was generated, instead, as a bundle of spindly explorations, each of them very little branched. After each branch had been explored to a position that could be evaluated, the player returned to the base position to pick up a new branch for exploration" (p. 153).

This is "progressive deepening"—exploring one line deeply, returning to base, trying another.

But this isn't the optimal strategy! "The progressive deepening strategy is not imposed on the player by the structure of the chess task environment. Indeed, one can show that a different organization would permit more efficient search" (p. 153).

The more efficient strategy is **scan-and-search**:
1. Select the most promising node from all nodes explored so far
2. Explore a few continuations from that node
3. Evaluate new nodes and add to candidate list
4. Return to step 1

This avoids commitment to a single line and allows flexible redirection.

## Why Humans Don't Use the Better Strategy

"We can see now that the progressive deepening strategy is a response to limits of short-term memory... To the human problem solver, with his limited short-term memory, this [scan-and-search] strategy is simply not available. To use it, he would have to consume large amounts of time storing in his long-term memory information about the nodes he had visited" (p. 153).

**The strategy humans use reveals their constraints more clearly than the strategy they would use if unconstrained.**

A computer program (MATER) using scan-and-search "appears a good deal more efficient than the progressive deepening strategy" (p. 153), but humans can't use it because:
- Scan-and-search requires maintaining a priority queue of nodes
- Each node must be remembered with enough context to resume from it
- This exceeds short-term memory capacity (~7 items)
- Storing to long-term memory is too slow (seconds per symbol)

Progressive deepening only requires remembering:
- The current position (in external memory—the chessboard)
- One base position to return to
- The evaluation of the current branch

This fits within human memory constraints.

## Implications for Agent Architecture

If your agent system has different computational constraints than humans, **it should use different strategies**.

**If agents have:**
- Unlimited working memory → Use scan-and-search
- Fast long-term memory storage → Explore wider trees
- Parallel processing → Evaluate multiple branches simultaneously
- Perfect memory → Never lose track of explored paths

**But if agents have:**
- Limited context windows → Use progressive deepening
- High memory access costs → Minimize node revisiting
- Serial token generation → Avoid excessive backtracking

The optimal orchestration strategy depends on computational constraints, not task structure alone.

## The External Memory Exploitation Pattern

"In those problems where information about the current node is preserved in an external memory, they tend to proceed almost always from the current knowledge state, and back up to an earlier node only when they find themselves in serious trouble" (p. 153).

When external memory is available (a chessboard, a written problem state, a code file), humans exploit it:
- Current state maintained externally
- Short-term memory freed for evaluation and planning
- Backtracking happens only on failure

For WinDAGs:
- The workflow DAG itself is external memory
- Current execution state is explicitly maintained
- Agents can "proceed from current state" without memory overhead
- Backtracking (re-planning) happens on failure signals

This is **alignment with human constraint-based strategies**—not because the system has human constraints, but because external state representation provides similar benefits.

## The Five-Second Storage Rule

"The time required to store a symbol in [long-term] memory is of the order of seconds or tens of seconds" (p. 149).

This explains why humans can't easily:
- Remember arbitrary symbol sequences
- Maintain multiple simultaneous search branches
- Freely switch between distant parts of problem space

And why humans do:
- Write things down
- Use external representations
- Work incrementally from current state
- Chunk related information together

For agent systems with fast storage:
- Caching orchestration patterns is cheap
- Maintaining multiple hypotheses is feasible
- Exploring diverse approaches in parallel is viable

But for LLM-based agents with context limitations:
- "Storing" means including in prompt (expensive)
- Multiple hypotheses compete for context space
- External tools (memory systems, file storage) become critical

## The Seven-Symbol Bottleneck

"The evidence for the seven-symbol capacity of short-term memory, from immediate recall experiments" (p. 149).

This creates the fundamental bottleneck in human problem solving. You can only "hold in mind" about 7 things at once. This forces:

1. **Chunking**: Combining related items into single units
2. **Offloading**: Using external representations
3. **Simplification**: Working with abstractions rather than details
4. **Sequential processing**: Can't compare 10 options simultaneously

For LLM agents:
- Context windows are larger but still finite
- Attention mechanisms may have effective "working memory" limits
- Long contexts degrade performance (the "lost in the middle" problem)
- Chunking and abstraction remain valuable

## Strategy Follows Architecture

"For a system to be adaptive means that it is capable of grappling with whatever task environment confronts it. Hence, to the extent a system is adaptive, its behavior is determined by the demands of that task environment rather than by its own internal characteristics" (p. 149).

But this must be qualified: **Adaptation happens within architectural constraints.**

The task environment shapes behavior, but only through the filter of computational constraints. Two systems with different architectures, both fully adaptive, will exhibit different behaviors on the same task.

## Design Principles for Orchestration Systems

**1. Match strategy to computational profile**

Don't blindly copy human problem-solving strategies. Use progressive deepening if memory is limited, scan-and-search if it's not.

**2. Exploit architectural advantages**

If your agents have:
- Perfect memory → Maintain complete search history
- Parallel execution → Explore multiple paths simultaneously
- Fast storage → Cache aggressively

**3. Compensate for architectural weaknesses**

If your agents have:
- Limited context → Use external memory (files, databases)
- Serial processing → Prioritize ruthlessly
- Slow execution → Invest in better heuristics

**4. Recognize constraint-driven behaviors**

When debugging agents:
- "Why did it backtrack here?" → Memory limit reached?
- "Why didn't it try this path?" → Not in current context?
- "Why this search order?" → Constraint-optimal?

**5. Design skills that respect constraints**

Skills should:
- Minimize working memory requirements
- Support incremental processing
- Enable external state maintenance
- Facilitate cheap backtracking

## Boundary Conditions

This analysis applies when:
- Computational constraints significantly affect strategy choice
- Alternative strategies exist with different resource profiles
- Tasks are complex enough that constraints matter

It doesn't apply when:
- Problems are trivial (fit entirely in working memory)
- Only one strategy is viable regardless of constraints
- External factors dominate (e.g., API rate limits)

## The Deeper Lesson

"These properties—serial processing, small short-term memory, infinite long-term memory with fast retrieval but slow storage—impose strong constraints on the ways in which the system can seek solutions to problems in larger problem spaces. A system not sharing these properties... might seek problem solutions in quite different ways" (p. 149).

**Architecture determines strategy space. Constraints enable prediction.**

If you know an agent's computational constraints, you can predict:
- Which strategies it will favor
- Which it cannot use at all
- Where it will struggle
- How to compensate

For WinDAG orchestration:
- Understand the computational profile of your agent system
- Design orchestration strategies that align with that profile
- Don't assume human-optimal strategies are agent-optimal
- Exploit advantages, compensate for limitations