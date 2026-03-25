# Learning and Problem Space Construction: The Frontier of the Theory

## The Acknowledged Gap

"Critics of the problem-solving theory we have sketched above complain that it explains too little... More serious, it explains behavior only after the problem space has been postulated—it does not show how the problem solver constructs his problem space in a given task environment" (p. 154).

The theory successfully explains:
- How search proceeds **within** a problem space
- What information guides selective search
- How architectural constraints shape strategy

But it doesn't explain:
- How problem spaces are **constructed** from task environments
- How solvers **learn** to construct appropriate spaces
- How representation choice happens

**This is the central open problem.**

## Why Problem Space Construction Matters

"How, when he is faced with a cryptarithmetic problem, does he enter a problem space in which the nodes are defined as different possible assignments of letters to numbers? How does he become aware of the relevance of arithmetic operations for solving the problem? What suggests the 'most-constrained-column-first' heuristic to him?" (p. 154).

Every time a human or agent encounters a novel task, they must:
1. Decide what constitutes a "state" in the problem space
2. Determine what "operators" are available
3. Select relevant knowledge and skills
4. Construct heuristics for search

**None of this is explained by the search theory.** The search theory begins after these choices are made.

## The Tennis Tournament Insight

"Consider the following example: An elimination tournament, with 109 entries... How should the pairings be arranged to minimize the total number of individual matches that will have to be played?" (p. 154).

Natural representation: space of possible tournament brackets (combinatorially explosive)
Better representation: space of match sequences (large but has solution property)
Insight: Any sequence has exactly 108 matches (108 eliminations for 109 → 1)

With the right representation, **search is unnecessary**—the answer is implicit in the structure.

"There are many 'trick' problems of this kind where selection of the correct problem space permits the problem to be solved without any search whatsoever" (p. 154).

**The real problem-solving happened in the representation choice, not the search.**

## Six Information Sources for Construction

Simon and Newell identify sources a problem solver can draw on:

### 1. Task Instructions
"The task instructions themselves, which describe the elements of the environment more or less completely, and which may also provide some external memory" (p. 155).

The problem description suggests representation:
- "Assign digits to letters" → assignment space
- "Find path through network" → graph space
- "Optimize query" → transformation space

### 2. Direct Prior Experience
"Previous experience with the same task or a nearly identical one. (A problem space available from past experience may simply be evoked by mention of the task.)" (p. 155).

If you've solved cryptarithmetic before, you retrieve the assignment-space representation immediately.

### 3. Analogical Experience
"Previous experience with analogous tasks, or with components of the whole task" (p. 155).

"The form of the external array in this task is sufficient to evoke in most subjects the possible relevance of arithmetic processes and arithmetic properties (odd, even, and so on)" (p. 155).

Arithmetic homework → cryptarithmetic representation

### 4. General-Purpose Programs
"Programs stored in long-term memory that generalize over a range of tasks" (p. 155).

Means-ends analysis, constraint satisfaction, hill-climbing—these are **representation-independent strategies** that work across many problem spaces.

GPS demonstrates this: separate task descriptions from the means-ends procedure.

### 5. Construction Meta-Programs
"Programs stored in long-term memory for combining task instructions with other information in memory to construct new problem spaces and problem-solving programs" (p. 155).

Procedures for representation building:
- "If task involves ordering, use sequence space"
- "If task involves selection, use subset space"
- "If task involves assignment, use mapping space"

### 6. Search-Time Information
"Information accumulated while solving a problem, which may suggest changing the problem space. (In particular, it may suggest moving to a more abstract and simplified planning space.)" (p. 155).

As you search, you learn:
- This representation isn't working (too hard to search)
- This abstraction might help (plan in simplified space)
- This decomposition looks promising (hierarchical space)

## Evidence: Two Simulation Programs

### General Game Playing Program (GGPP)
"A General Game Playing Program... when given the instructions for a card or board game... is able, by interpreting these instructions, to play the game—at least legally if not well" (p. 156).

GGPP constructs problem spaces from:
- Task instructions (rules of the game)
- General knowledge (what "cards" and "moves" mean)
- Combination processes (merge game-specific and general knowledge)

"These programs put us into somewhat the same position with respect to the generation of problem spaces that LT did with respect to problem solving in a defined problem space: that is to say, they demonstrate that certain sets of information-processing mechanisms are sufficient to do the job" (p. 156).

### Aptitude Test Taker
"The Aptitude Test Taker... derives its information from worked-out examples of items on various kinds of aptitude tests... in order to construct its own programs capable of taking the corresponding tests" (p. 156).

Learns representation from examples:
- Letter series → sequence pattern space
- Analogies → relationship mapping space
- Number series → arithmetic transformation space

**These programs show that problem space construction is programmable**—it's not magic, it's another information process.

## Planning as Problem Space Construction

"In several of the tasks that have been studied... subjects are often observed to be working in terms more abstract than those that characterize the problem space they began with" (p. 156).

Subjects construct **planning spaces**—simplified, abstract representations for high-level solution structure.

"Programs have been written, in the context of GPS, that are also capable of such abstracting and planning, hence are capable of constructing a problem space different from the one in which the problem solving begins" (p. 156).

Planning is simultaneous with search—the problem space evolves during problem solving.

## The Production System Hypothesis

"A development of the past few years in computer language construction has created an interesting possible solution to this difficulty. We refer to the languages known as production systems" (p. 156).

Production: **condition → action**
- If condition is satisfied, execute action
- If not, try next production
- Productions are independent—can be added incrementally

"The attraction of a production system for our present concerns—of how a complex program could develop step by step—is that the individual productions are independent of each other's structures, and hence productions can be added to the system one by one" (p. 157).

### Why This Matters for Learning

"In a new task environment, a subject learns to notice conditions and make discriminations of which he was previously unaware (a chessplayer learns to recognize an open file, a passed pawn, and so on). Each of these new discriminations can become the condition part of a production, whose action is relevant to that condition" (p. 157).

Learning = Adding productions:
- Learn to recognize pattern → new condition
- Learn effective response → new action  
- Link them → new production
- Add to system → capability grows

**Problem space construction emerges from accumulated productions.**

### Connection to Stimulus-Response

"We do not wish to push the analogy too far, for productions have some complexities and subtleties of structure that go beyond stimulus-response ideas, but we do observe that linking a condition and action together in a new production has many similarities to linking a stimulus together with its response" (p. 157).

Key difference: "In the production, it is the condition—that is, the tests—and not the stimulus itself that is linked to the response. In this way, the production system illuminates the problem of defining the effective stimulus" (p. 157).

You don't learn "when I see X, do Y"—you learn "when I detect condition C, do Y."

Condition C might be:
- "Most constrained column" (cryptarithmetic)
- "Opponent threatens mate" (chess)
- "Function has no null check" (code review)

These are **learned abstractions**, not raw stimuli.

## Implications for Agent Learning

### 1. Skill Accumulation as Production Learning

Each new skill in a WinDAG system can be viewed as a production:
- Condition: task characteristics that suggest this skill
- Action: execute the skill

Learning = acquiring skills = adding productions

But also:
- Learning better conditions (when to invoke skill)
- Learning better compositions (skill sequences as productions)
- Learning abstractions (patterns that trigger strategies)

### 2. Representation Learning from Examples

The Aptitude Test Taker approach:
- Show agent examples of solved tasks
- Agent induces representation from examples
- Agent constructs programs using that representation

For WinDAGs:
- Show successful orchestration traces
- Induce patterns (when task type X, use skill sequence Y)
- Build orchestration templates

### 3. Incremental Problem Space Construction

Don't require complete problem space before starting:
- Begin with initial representation
- Search reveals inadequacies
- Refine representation
- Continue search

The human data shows: "The human subjects appeared able to move back and forth between concrete and abstract objects without treating the latter as belonging to a separate problem space" (p. 156).

Fluid movement between representations, not commitment to single space.

### 4. Meta-Learning: Learning to Construct Spaces

Beyond learning specific representations, learn **construction strategies**:
- "For assignment tasks, use mapping space"
- "For optimization tasks, try transformation space"
- "When space is too large, look for abstraction"

These meta-strategies are transferable across domains.

## Open Research Questions

Simon and Newell acknowledge: "We cannot pursue this idea here beyond noting its affinity to some classical stimulus-response notions" (p. 157).

What remains unknown:
1. **How are effective conditions discovered?** 
   - How do you learn what patterns matter?
2. **How is knowledge organized for retrieval?**
   - How do you find relevant productions among thousands?
3. **How are abstractions formed?**
   - How do you move from concrete to abstract representations?
4. **How is transfer achieved?**
   - How do representations from one domain help in another?

## Design Principles for Learning Systems

**1. Enable Incremental Capability Growth**

Architecture should support:
- Adding new productions without rewriting existing ones
- Refining conditions without breaking actions
- Extending representations without invalidating searches

Production systems provide this naturally.

**2. Learn from Successes and Failures**

Both provide information:
- Success: this representation worked, these skills composed well
- Failure: this representation was wrong, this decomposition failed

Capture both. Build productions that encode: "For tasks like X, avoid strategy Y"

**3. Provide Example-Based Learning**

Show, don't just tell:
- Trace successful orchestrations
- Annotate key decisions
- Explain why representations were chosen

Learning from examples (Aptitude Test Taker) seems more tractable than learning from scratch.

**4. Support Representation Evolution**

Don't lock into initial problem space:
- Monitor search progress
- Detect representation inadequacy (excessive search, repeated failure)
- Trigger re-representation
- Continue with refined space

**5. Build Meta-Knowledge**

Accumulate knowledge about:
- Which representations work for which task types
- Which skills compose well
- Which decomposition strategies are fruitful
- Which heuristics transfer across domains

This meta-knowledge accelerates problem space construction for new tasks.

## Boundary Conditions

This approach to learning applies when:
- Tasks have recurring structure (patterns exist to learn)
- Examples are available (successes to learn from)
- Incremental improvement is possible (don't need perfect solution immediately)
- Representation matters (choice significantly affects difficulty)

It's less applicable when:
- Every task is completely novel
- No examples exist
- Representation is obvious or fixed
- Performance must be perfect immediately

## The Fundamental Challenge

"The initial question we asked in our research was: 'What processes do people use to solve problems?' The answer we have proposed is: 'They carry out selective search in a problem space that incorporates some of the structural information of the task environment.' Our answer now leads to the new question: 'How do people generate a problem space when confronted with a new task?'" (p. 154).

**The theory has been successful enough to reveal the next frontier.**

For agent systems:
- We can build orchestration that searches skill-composition spaces
- We need to learn how to construct those spaces for novel tasks
- This is the key capability that separates narrow AI from general problem-solving