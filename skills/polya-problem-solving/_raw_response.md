## BOOK IDENTITY
**Title**: *How to Solve It: A New Aspect of Mathematical Method*
**Author**: G. Polya (1945, Second Edition 1957)
**Core Question**: What are the *mental operations* that intelligent problem-solvers actually perform — and can these operations be taught, made explicit, and transferred to new situations?
**Irreplaceable Contribution**: Polya does something almost no one else has done: he watches the *inside* of problem-solving, names what he sees, and builds a teachable vocabulary for it. He is not describing the finished proof — he is describing the scaffolding that was torn down before the proof was published. He shows that mathematical thinking is not mysterious inspiration but a set of identifiable, repeatable, transferable heuristic operations. The book is irreplaceable because it is the only serious systematic attempt to make the process of discovery explicit at the level of specific mental moves, illustrated with enough worked examples to actually teach the moves. No other book does this with Polya's combination of precision, generality, and pedagogical warmth.

---

## KEY IDEAS (3-5 sentences each)

**1. Problem-solving has four phases, and each phase has characteristic failure modes.**
Every serious problem moves through Understanding → Planning → Execution → Review. Rushing from incomplete understanding to execution is the most common failure; it produces work that is technically correct but answers the wrong question. The "Looking Back" phase is almost universally skipped, yet it is where the problem-solver consolidates transferable knowledge and discovers new problems from the one just solved.

**2. The unknown is the master key — always begin by looking at it.**
The single most powerful heuristic Polya offers is deceptively simple: *Look at the unknown. Try to think of a familiar problem having the same or a similar unknown.* This focuses mobilization of prior knowledge on what actually matters and avoids the trap of drowning in data. Almost every successful problem-solving move in the book can be traced back to this operation.

**3. If you cannot solve the proposed problem, find a related problem you can solve.**
Polya systematizes the art of reduction: generalize, specialize, analogize, drop part of the condition, introduce auxiliary elements. The "Inventor's Paradox" — that a more ambitious or more general problem is often easier to solve — is one of the book's deepest insights. A stepping stone in the middle of the creek is the typical structure of a difficult solution.

**4. Heuristic reasoning is not weak reasoning — it is the only reasoning available before the answer is known.**
Polya distinguishes rigorously between heuristic (provisional, plausible, directional) and demonstrative (certain, complete) reasoning. Heuristic reasoning is not a flaw; it is the scaffolding that enables the building to be erected. The danger is not using heuristic reasoning but either confusing it with proof or refusing to use it at all.

**5. Looking back is where learning compounds.**
After solving a problem, the expert asks: Can I check this differently? Can I see it at a glance? Can I use this result or method for another problem? This phase is not optional polish — it is where knowledge becomes organized, cross-linked, and portable. Without it, each problem solved is merely an isolated event rather than a contribution to growing competence.

---

## REFERENCE DOCUMENTS

### FILE: polya-four-phase-problem-solving.md
```markdown
# The Four Phases of Problem-Solving: Polya's Framework for Intelligent Systems

## Why This Framework Matters for Agent Systems

When an AI agent receives a complex task, it faces exactly the same structural challenge that Polya identified in mathematical problem-solving: the gap between what is given and what is required. Polya's four-phase framework is not merely a pedagogical device — it is a structural description of what any intelligent system must do when confronting a non-routine problem. Agents that skip phases, or collapse them together, will reproduce exactly the failure modes Polya documented in human students.

## The Four Phases

Polya identifies four distinct phases, each requiring different mental operations and each with its own characteristic failure modes:

**Phase 1: Understanding the Problem**
**Phase 2: Devising a Plan**
**Phase 3: Carrying Out the Plan**
**Phase 4: Looking Back**

These are not merely sequential steps. They are qualitatively different modes of engagement with the problem. As Polya writes: "We have to shift our position again and again. Our conception of the problem is likely to be rather incomplete when we start the work; our outlook is different when we have made some progress; it is again different when we have almost obtained the solution" (p. 5).

---

## Phase 1: Understanding the Problem

### What It Requires

The most common failure in problem-solving — at all levels — is beginning work before the problem is adequately understood. Polya is emphatic: "It is foolish to answer a question that you do not understand. It is sad to work for an end that you do not desire" (p. 6).

Understanding is not a binary state. It is a progressive clarification that requires actively working with the problem's structure. The key questions that must be answered before devising a plan are:

- **What is the unknown?** What exactly must be produced, found, or decided?
- **What are the data?** What is given, known, or available?
- **What is the condition?** What are the constraints linking the unknown to the data?
- **Is the condition sufficient?** Is the problem well-posed, over-determined, under-determined, or contradictory?

Polya recommends that understanding be demonstrated rather than assumed: "the student should be able to state the problem fluently" and "should also be able to point out the principal parts of the problem" (p. 6). An agent that cannot paraphrase the problem in its own terms has not understood it.

### The Separate Parts of the Condition

A critical understanding move is separating the condition into its constituent parts: "Separate the various parts of the condition. Can you write them down?" (p. 6). Many problems have compound conditions, and the interplay between parts is where the difficulty lives. An agent that treats the condition as a monolithic blob will miss the structure that enables decomposition.

### Notation and Representation

Understanding is materially supported by good representation. "Introduce suitable notation" and "Draw a figure" are not cosmetic suggestions — they are cognitive operations that force clarity. When you name the unknown with a symbol, you must decide what kind of thing it is. When you draw a figure, you must commit to the relationships. The act of representation forces understanding.

Polya notes that good notation should be "unambiguous, pregnant, easy to remember" and that "the order and connection of signs should suggest the order and connection of things" (p. 174). An agent choosing its internal representation of a problem is performing this operation.

### The Hypothetical Figure

One of Polya's most important techniques for understanding problems of construction is to *assume the problem solved* and examine the hypothetical situation. "Draw a hypothetical figure which supposes the condition of the problem satisfied in all its parts" (p. 110). This is not circular reasoning — it is a way of making the problem's structure visible before you can solve it. The judge who examines the hypothesis that the defendant committed the crime is not prejudging; he is structuring his inquiry.

**Agent implication**: Before an agent begins executing a complex task, it should be able to state: (1) what the final output would look like if successful, (2) what inputs are available, (3) what constraints bind the output to the inputs, and (4) whether those constraints are sufficient, redundant, or contradictory.

---

## Phase 2: Devising a Plan

### The Central Achievement

"The main achievement in the solution of a problem is to conceive the idea of a plan" (p. 8). A plan specifies, at minimum in outline, what operations must be performed to connect the data to the unknown. Without a plan, execution is wandering.

Plans rarely arrive complete. Polya describes how a plan may "emerge gradually" or "occur suddenly, in a flash, as a 'bright idea'" (p. 8). The job of the problem-solver during Phase 2 is to *provoke* the arrival of a useful plan by systematically interrogating the problem from multiple angles.

### The Core Planning Heuristics

The most powerful planning question: **Look at the unknown! And try to think of a familiar problem having the same or a similar unknown.**

This focuses the mobilization of prior knowledge. Rather than asking "what do I know that might be relevant?" (which generates an unmanageable search space), asking "what problems have I solved whose unknown resembles this one?" narrows the search to the most structurally similar prior work.

Other key planning heuristics:
- **Do you know a related problem?** — Activates analogical reasoning
- **Here is a problem related to yours and solved before. Could you use it?** — Transfers known solutions
- **Could you restate the problem?** — Enables re-representation
- **If you cannot solve the proposed problem, try to solve first some related problem** — Enables productive reduction
- **Did you use all the data? Did you use the whole condition?** — Checks for missing connections

### The Danger of Premature Specificity

Polya explicitly warns against giving too-specific hints during planning: "Could you apply the theorem of Pythagoras?" is a *bad* hint because it gives the whole secret away, is incomprehensible if the student is far from the solution, is not instructive for future problems, and appears as an unnatural surprise (pp. 16-17).

**Agent implication**: When an orchestrating agent routes a subtask to a specialized skill, it should provide enough context to activate relevant prior patterns, but not so much specificity that the skill becomes a mere executor of a predetermined path. Over-specification kills generalization.

---

## Phase 3: Carrying Out the Plan

### From Inspiration to Verification

"To devise a plan, to conceive the idea of the solution is not easy... To carry out the plan is much easier; what we need is mainly patience" (p. 10).

Carrying out requires converting the plan's outline into verified steps. The key discipline is: **check each step**. Not globally, not at the end — each step, as it is taken.

Polya distinguishes between two ways of verifying a step:
- **Intuitively**: You see so clearly that the step is correct that you have no doubt
- **Formally**: You derive the step according to explicit rules

Both are legitimate. Neither is always sufficient. The ideal is both: "Intuitive insight and formal proof are two different ways of perceiving the truth, comparable to the perception of a material object through two different senses, sight and touch" (p. 53).

### Order of Execution vs. Order of Invention

The order in which steps are executed (synthesis) is typically the reverse of the order in which they were discovered (analysis). This is a critical insight: the final proof or solution will often present steps in an order that obscures how they were found. Understanding this prevents confusion when reading others' solutions and prevents the mistake of trying to discover solutions in the order they will eventually be presented.

### Major and Minor Steps

For complex problems: "If your problem is very complex you may distinguish 'great' steps and 'small' steps, each great step being composed of several small ones. Check first the great steps, and get down to the smaller ones afterwards" (p. 34). This is hierarchical verification — validate the architecture before debugging the implementation.

**Agent implication**: During execution, an agent should verify each step as it proceeds, not defer all verification to the end. When the plan involves multiple scales of operation (high-level strategy, mid-level tactics, low-level operations), verification should proceed top-down: validate the structural soundness of the approach before auditing individual operations.

---

## Phase 4: Looking Back

### The Most Skipped Phase, the Most Valuable

"Even fairly good students, when they have obtained the solution of the problem and written down neatly the argument, shut their books and look for something else. Doing so, they miss an important and instructive phase of the work" (p. 11).

Looking Back is where problem-solving generates compound returns. The four Looking Back questions are:

1. **Can you check the result?** — Verify correctness by independent means
2. **Can you check the argument?** — Verify the reasoning, not just the output
3. **Can you derive the result differently?** — Find alternative paths (robustness)
4. **Can you use the result, or the method, for some other problem?** — Generalize and transfer

### Checking Strategies

Polya enumerates specific checking methods that go beyond "repeat the calculation":
- **Test by specialization**: Does the formula reduce to known correct values in simple cases?
- **Test by dimension**: Do the dimensional units of the result match what they should be?
- **Test by symmetry**: If the problem is symmetric in certain variables, is the solution?
- **Test by variation**: If a parameter increases, does the solution change in the expected direction?
- **Test by analogy**: Does the result match the pattern of analogous simpler problems?

Each of these is an independent line of evidence. "We prefer conviction by two different proofs" (p. 35). Two anchors are safer than one.

### Exploitation: Good Problems Grow in Clusters

"Good problems and mushrooms of certain kinds have something in common; they grow in clusters. Having found one, you should look around; there is a good chance that there are some more quite near" (p. 65).

After solving a problem, the expert systematically derives new problems by:
- Keeping the unknown, changing data/conditions
- Keeping data, changing the unknown
- Interchanging unknown and one datum
- Generalizing, specializing, finding analogies

**Agent implication**: After completing a task, an agent should perform a structured retrospective: (1) validate the output by at least two independent methods, (2) identify what patterns in the solution are transferable, (3) note what auxiliary problems were solved that might be reusable, and (4) identify what related problems are now accessible that were not before.

---

## Failure Modes by Phase

| Phase | Characteristic Failure | Polya's Diagnosis |
|-------|------------------------|-------------------|
| Understanding | Starting without understanding | "The worst may happen if the student embarks upon computations without having understood the problem" |
| Planning | Rushing to compute without a plan | "Generally useless to carry out details without having seen the main connection" |
| Execution | Failing to check each step | "Many mistakes can be avoided if, carrying out his plan, the student checks each step" |
| Looking Back | Skipping review entirely | "Some of the best effects may be lost if the student fails to reexamine and to reconsider the completed solution" |

---

## Implications for Agent Orchestration

In a multi-agent system, the four phases map naturally to different agent roles and handoff points:

- **Understanding**: The orchestrating agent and the task-receiving agent together must establish shared understanding before any subtask is routed. A structured "understanding confirmation" step prevents the most common class of failures.
- **Planning**: The planning phase is where decomposition happens. This is a cognitive phase that should not be rushed into execution. Agents that go directly from task receipt to tool invocation are skipping Phase 2.
- **Execution**: Each skill invocation is a step that should be verified before the next step is taken. The hierarchical structure (major steps first, minor steps second) maps to a staged execution model.
- **Looking Back**: Results should not be returned raw. A post-processing phase that applies multiple validation strategies (correctness, completeness, alternative derivation, transferability) adds robustness and compounds learning over time.

The deepest lesson: **phases require different cognitive modes**. An agent optimized for fast execution will be systematically bad at understanding and looking back. A system that processes all phases identically will be suboptimal at all of them.
```

---

### FILE: polya-look-at-the-unknown.md
```markdown
# Look at the Unknown: The Master Heuristic for Problem Decomposition

## The Single Most Powerful Move

In a book full of useful heuristics, one stands above all others in Polya's treatment. It appears in the "How to Solve It" list, in the dialogue of Part II, and as the organizing center of the dictionary entry on "Look at the Unknown." It is this:

> **Look at the unknown! And try to think of a familiar problem having the same or a similar unknown.**

This is Polya's master heuristic for problem-solving. Understanding why it works — and how to implement it correctly — is one of the most valuable things an intelligent system can do.

---

## Why the Unknown, Not the Data?

Most naive problem-solvers begin with the data. They survey what they have been given and ask: "What can I do with this?" This is the wrong direction. As Polya observes, starting from the data generates an enormous, unfocused search through prior knowledge. Almost anything might be "related" to the data in some sense.

Starting from the unknown focuses the search: "What kind of thing do I need to produce? What operations produce things of that kind? What problems have I solved that produced the same kind of thing?"

Polya explains: "Looking at the unknown, we restrict our choice; we take into consideration only such problems as have the same unknown. And, of course, among the problems having the same unknown, we consider first those which are the most elementary and the most familiar to us" (p. 123).

The unknown defines the *type* of the answer required. Types are the critical constraint. A problem requiring a length has a different family of relevant prior solutions than one requiring an area or an angle or a probability.

---

## The Schematic View

Polya recommends a powerful representational practice: look at the problem *schematically*, attending only to the unknown:

```
"Given . . . . . . . . . . find the length of the line."
"Given . . . . . . . . . . find the angle."
"Given . . . . . . . . . . find the volume of the tetrahedron."
"Given . . . . . . . . . . find the point."
```

The dots obscure the data entirely. This is not intellectual sloppiness — it is a deliberate cognitive move to focus attention on the structural type of the answer. Once you know what *type* of thing you need, you can ask: what is the simplest, most familiar way I know to produce a thing of this type?

For problems to prove (rather than find), the analogous heuristic is: **Look at the conclusion!** The schematic becomes:

```
"If . . . . . . . . . . then the angles are equal."
"If . . . . . . . . . . then the triangles are congruent."
```

---

## The Four Standard Unknown-Types in Elementary Mathematics

Polya provides a beautiful example of how attending to the unknown type immediately generates a plan skeleton:

**(1) Given . . . find the length of a line.**
"The unknown should be obtained as a side of some triangle. It remains to introduce a suitable triangle with three known, or easily obtainable, constituents" (p. 124).

**(2) Given . . . find the angle.**
"The unknown should be obtained as an angle in some triangle. It remains to introduce a suitable triangle" (p. 124).

**(3) Given . . . find the volume of the tetrahedron.**
"The unknown can be obtained if the area of the base and the length of the altitude are known. It remains to find the area of a face and the corresponding altitude" (p. 124).

**(4) Given . . . construct the point.**
"The unknown should be obtained as the intersection of two loci each of which is either a circle or a straight line. It remains to disentangle such loci from the proposed condition" (p. 124).

Each of these is a *plan skeleton* — a partially specified solution strategy that becomes fully specified once the data and conditions are examined. The unknown type gives you the skeleton; the data and conditions give you the flesh.

---

## Mobilizing Prior Knowledge

The question "Look at the unknown" is, at its deepest level, a question about memory and prior knowledge. Polya writes: "Good ideas are based on past experience and formerly acquired knowledge. Mere remembering is not enough for a good idea, but we cannot have any good idea without recollecting some pertinent facts" (p. 9).

The problem-solving process involves what Polya calls *mobilization* and *organization*: activating relevant prior knowledge and combining it into a structure adapted to the current problem. "Look at the unknown" is the key that unlocks mobilization — it gives memory a specific target to search for.

The sequence is:
1. Identify the unknown (its type and characteristics)
2. Search memory for problems with the same or similar unknown
3. Find the most elementary, most familiar match
4. Ask: "Here is a problem related to yours and solved before. Could you use it?"
5. If yes, ask: "Should I introduce some auxiliary element to make its use possible?"

---

## The Difference Between Known and Unknown Unknowns

Polya makes a critical distinction that has profound implications for agent system design:

> "To know or not to know a formerly solved problem with the same unknown may make all the difference between an easy and a difficult problem" (p. 126).

When Archimedes computed the surface area of a sphere, there was no prior solution with the same unknown. He had to invent the approach from scratch — "one of the most notable mathematical achievements" (p. 125). When a student computes the surface area of a sphere today, they just apply Archimedes' result. The problem is now trivial.

This asymmetry is fundamental. **The difficulty of a problem is not inherent — it depends on what relevant prior solutions are accessible.** An agent with a rich, well-organized library of prior solutions can solve problems that would be impossibly hard for an agent with no such library.

The implication: building and maintaining a well-organized library of "solved problems indexed by unknown type" is not merely useful — it is the primary driver of problem-solving capability growth.

---

## When the Unknown Type Has No Match

What happens when no prior solution with the same unknown can be found? Polya recommends falling back to *similar* unknowns:

> "If we are unable to find a formerly solved problem having the same unknown as the problem before us, we try to find one having a *similar* unknown. Problems of the latter kind are less closely related to the problem before us... and therefore less easy to use for our purpose in general, but they may be valuable guides nevertheless" (p. 127).

Archimedes, lacking a solved problem with "surface area of a sphere" as the unknown, worked with the nearest similar unknowns he had: lateral surfaces of cylinders, cones, and frustums. These approximating surfaces became the scaffolding for his construction.

**The hierarchy of search when looking at the unknown:**
1. Exact match: prior problem with identical unknown type
2. Near match: prior problem with structurally similar unknown
3. Analogy: prior problem in a simpler or lower-dimensional analogous domain
4. Construction: invent a new auxiliary problem whose unknown is a stepping stone to the original

---

## Connection to Auxiliary Elements

A critical link: when you find a related problem with the same unknown and want to use it, you often need to introduce *auxiliary elements* to make the connection possible.

Polya's canonical example: you need to find the length of a diagonal of a rectangular parallelepiped (3D). You recall that you can find the side of a right triangle. But there's no triangle in your figure. So you *introduce* one — an auxiliary right triangle whose hypotenuse is the desired diagonal. Then another auxiliary right triangle to find the other leg. The auxiliary elements bridge the gap between the unknown you need and the problem type you know.

> "Should you introduce some auxiliary element in order to make its use possible?" (p. 8)

The introduction of auxiliary elements is not arbitrary — it is *motivated* by the desire to use a specific related problem. The related problem (identified by unknown type) specifies *what kind* of auxiliary element to introduce.

---

## Application to Agent Task Decomposition

For an AI agent system, "Look at the unknown" translates directly into a decomposition strategy:

**Step 1: Characterize the unknown.**
Before invoking any skill or tool, the agent should ask: what is the type and structure of the output required? What are its key properties? What constraints does it satisfy?

**Step 2: Search the skill library by output type.**
Skills can be indexed not just by their names but by the *type of output they produce*. A task requiring "a working implementation of X" maps to a different set of skills than "an explanation of X" or "a test suite for X."

**Step 3: Find the most relevant prior pattern.**
Which skill or skill sequence has produced outputs of the required type in similar contexts? What was the structure of successful solutions in those cases?

**Step 4: Identify the gap and introduce auxiliaries.**
What intermediate outputs (auxiliary unknowns) are needed to bridge from current inputs to the required output type? These become the sub-tasks of the decomposition.

**Step 5: Check that the decomposition uses all data.**
"Did you use all the data?" — After decomposing into sub-tasks, verify that every piece of available information has been assigned to some sub-task. Missing data usually signals a missing subtask.

---

## The Companion Question: Did You Use All the Data?

Polya pairs "Look at the unknown" with a companion check that catches a different kind of error: "Did you use all the data? Did you use the whole condition?" (p. 8).

These questions serve two functions:

1. **During planning**: If part of the data hasn't been connected to the unknown, the plan is incomplete. There is a missing link that needs to be found.

2. **During verification**: If the final answer doesn't depend on some datum that was supposed to be essential, either the datum is redundant (possible) or an error was made in derivation (more likely).

Polya illustrates this beautifully in the parallelepiped problem: a student finds the diagonal of a face (y² = a² + b²) but then gets stuck. The teacher asks "Did you use all the data?" The student notices that c (the height) hasn't appeared in the expression. This signals that a second step is needed — another right triangle involving c. The unused datum points directly to the missing step.

**Agent implication**: After constructing a decomposition plan, audit it: does every input/datum appear in at least one subtask? Does the output of every subtask feed into the final result? Gaps in either direction indicate structural incompleteness.

---

## Summary: The Unknown as Navigation System

The "Look at the unknown" heuristic works because it transforms a vague, open-ended search ("what should I do?") into a targeted retrieval ("what have I done before when I needed to produce something like this?"). It is a navigation system that orients the problem-solver toward relevant prior knowledge.

In a system with 180+ skills, this principle is critical. The challenge is not that there are too few capabilities — it is that there are too many, and activating the right ones requires a principled selection mechanism. "Look at the unknown" provides that mechanism: characterize the output type, search by output type, select the most elementary relevant match, bridge gaps with auxiliary steps.

The quality of a problem-solving system depends critically on:
1. The richness of its indexed solution library
2. The precision with which unknowns can be characterized
3. The ability to introduce auxiliary elements that bridge gaps

All three of these are areas where deliberate design and maintenance compound over time.
```

---

### FILE: polya-auxiliary-problems-and-stepping-stones.md
```markdown
# Auxiliary Problems and Stepping Stones: The Art of Productive Reduction

## The Fundamental Problem of Hard Problems

The defining feature of a genuinely difficult problem is that no direct path from data to unknown is visible. The problem-solver stares at the gap and sees no bridge. What should an intelligent system do when it cannot solve the problem before it?

Polya's answer is systematic and powerful: *change the problem*. Not abandon it — change it. The art of problem-solving is largely the art of finding productive problem variations that serve as stepping stones toward the original goal.

> "Human superiority consists in going around an obstacle that cannot be overcome directly, in devising a suitable auxiliary problem when the original problem appears insoluble. To devise an auxiliary problem is an important operation of the mind" (p. 75).

---

## What Is an Auxiliary Problem?

> "An auxiliary problem is a problem which we consider, not for its own sake, but because we hope that its consideration may help us to solve another problem, our original problem. The original problem is the end we wish to attain, the auxiliary problem a means by which we try to attain our end" (p. 74).

The key relationship: original problem is the *destination*, auxiliary problem is the *stepping stone*. The stepping stone must be both (1) *accessible* — easier to solve than the original — and (2) *useful* — its solution contributes to the solution of the original.

Polya uses a beautiful metaphor: "A stone in the middle of the creek is nearer to me than the other bank which I wish to arrive at and, when the stone is reached, it helps me on toward the other bank" (p. 149).

---

## Types of Auxiliary Problems

### Using the Result

The solution to the auxiliary problem produces a value or structure that directly answers or contributes to answering the original question. Example: finding the diagonal of a rectangular face (auxiliary) in order to find the diagonal of the solid (original). The intermediate result (y² = a² + b²) is used in the next calculation.

### Using the Method

The technique used to solve the auxiliary problem is adapted to solve the original. In the center-of-gravity example, the method of decomposing a triangle into fibers parallel to one side is extended to decompose a tetrahedron into similar fibers. The result of the 2D case matters less than the technique, which carries over.

### Using Both

The richest case: the auxiliary problem's result feeds into the original, and the method of solving the auxiliary problem informs the approach to the original.

> "Of course, in more difficult cases, complications may arise... Especially, it can happen that the solution of the analogous problem cannot be immediately used for our original problem. Then, it may be worth while to reconsider the solution, to vary and to modify it till, after having tried various forms of the solution, we find eventually one that can be extended to our original problem" (p. 91).

---

## How to Generate Useful Auxiliary Problems

Polya provides a systematic taxonomy of problem variation techniques. These are the levers that generate candidate auxiliary problems:

### 1. Generalization

Pass from the specific problem to a more general one. Paradoxically, the general problem is often *easier* to solve because it strips away misleading specific features and exposes the essential structure.

> "The more ambitious plan may have more chances of success... The more general problem may be easier to solve" (p. 121).

**The Inventor's Paradox**: Polya named this observation. A more general problem, by requiring you to identify what's *essential* rather than what's *incidental*, often clarifies the path to solution. Example: "Find a plane that passes through a given line and bisects the volume of a regular octahedron" is solved by generalizing to "Find a plane that bisects a solid with a center of symmetry" — which is trivially solved by passing through the center, and this applies immediately to the octahedron.

### 2. Specialization

Pass from the general problem to a simpler special case. If the general problem resists direct attack, a special case may be accessible and provide a model or an intermediate result.

> "If you cannot solve the proposed problem, try to solve first some related problem. Could you imagine a more accessible related problem?" (p. 10).

The extreme special case is particularly useful because it strips the problem to its essence. In the two-ships problem, specializing to "one ship at rest" makes the solution trivial, and then the general case is solved by a change of reference frame (subtracting the velocity of one ship from both).

### 3. Analogy

Find a structurally similar problem in a simpler or lower-dimensional domain.

> "We are going to discuss one more case... We have to solve the following problem: Find the center of gravity of a homogeneous tetrahedron. Without knowledge of the integral calculus, and with little knowledge of physics, this problem is not easy at all... The corresponding problem in the plane occurs here naturally: Find the center of gravity of a homogeneous triangle" (p. 87).

The 2D analogue becomes the model for the 3D solution. The structural similarity between triangle and tetrahedron means that methods transfer, often point by point.

### 4. Dropping Part of the Condition

Keep the unknown but relax the condition: drop one part of it, solve the easier problem, and observe how the unknown varies as you relax the constraint.

> "Keep only a part of the condition, drop the other part; how far is the unknown then determined, how can it vary?" (p. 8).

This is the technique used in the square-inscription problem (section 18) and the triangle-construction problem. By dropping one constraint, the unknown becomes a *locus* rather than a point — and the solution is found as the intersection of two loci.

### 5. Working Backwards (Analysis)

Start from the desired end state and ask: "From what preceding state could I reach this?" Then ask the same question of that state, and so on, until you reach something known or achievable.

Polya traces this method to the ancient Greek "Treasury of Analysis" (Pappus, ~300 AD): "We start from what is required, we take it for granted, and we draw consequences from it, and consequences from the consequences, till we reach a point that we can use as starting point in synthesis" (p. 142).

Working backwards is cognitively difficult because it requires reasoning in the opposite direction from execution. But it is extremely powerful because it focuses attention on the *necessary* rather than the *possible*.

### 6. Introducing Auxiliary Elements

Add new elements to the problem that bridge the gap between what's known and what's needed. Auxiliary lines in geometry, auxiliary unknowns in algebra, auxiliary lemmas in proofs.

The motivation for auxiliary elements should always be principled: you introduce them because you have identified a related known problem and need to create the structure that makes using it possible. Polya warns: "We may have this or that reason for introducing an auxiliary element, but we should have some reason. We should not introduce auxiliary elements wantonly" (p. 73).

---

## Equivalent vs. Unilateral Reductions

A crucial distinction that affects how confidently the solution of an auxiliary problem transfers back:

**Equivalent (Bilateral) Reduction**: The original problem and the auxiliary problem imply each other. Solving one solves the other. This is the gold standard — the solution of the auxiliary problem is also the solution of the original.

> "Two problems are equivalent if the solution of each involves the solution of the other" (p. 78).

**Unilateral Reduction to a Less Ambitious Problem**: The auxiliary problem is a special case or relaxation. Solving the auxiliary provides a *stepping stone* but not a complete solution. Additional work (a "supplementary remark") is needed to bridge back to the original.

**Unilateral Reduction to a More Ambitious Problem**: The auxiliary problem is more general. If the more ambitious problem can be solved, the original follows as a special case. This is the Inventor's Paradox situation.

**The danger to watch for**: Polya issues a clear warning about chains of reductions that mix narrowing and widening:

> "If, in a series of successive reductions, we pass to a narrower and then again to a wider condition we may lose track of the original problem completely. In order to avoid this danger, we must check carefully the nature of each newly introduced condition: Is it equivalent to the original condition?" (p. 80).

This is a failure mode for agent systems: a chain of task decompositions that alternately over-constrains and under-constrains the problem can produce a final "solution" that has drifted completely away from the original requirements.

---

## Chains of Auxiliary Problems

Polya's most sophisticated discussion of auxiliary problems involves *chains*: a sequence A → B → C → ... → L where each problem is derived from the previous one, until L is directly solvable. The solution then propagates back through the chain.

> "Each problem being equivalent to the preceding, the last problem L must be equivalent to our original problem A. Thus we are able to infer the solution of the original problem A from the problem L which we attained as the last link in a chain of auxiliary problems" (p. 79).

This is the structure of mathematical analysis — the method Pappus described. It is also the structure of multi-step planning in agent systems: a goal is transformed through a sequence of reductions until something executable is reached, and then execution propagates back to satisfy the original goal.

The key discipline: at each step in the chain, verify whether the reduction is equivalent or unilateral. Equivalent reductions are safe; unilateral reductions require that the supplementary work be explicitly accounted for.

---

## The Risk of Auxiliary Problems

Polya is honest about the cost: "We take away from the original problem the time and the effort that we devote to the auxiliary problem. If our investigation of the auxiliary problem fails, the time and effort we devoted to it may be lost" (p. 76).

An agent system must have a selection criterion for auxiliary problems that balances:
- **Accessibility**: How likely is the auxiliary problem to be solvable?
- **Usefulness**: How much does solving the auxiliary contribute to solving the original?
- **Aesthetic appeal**: Is the auxiliary structurally illuminating?
- **Novelty**: If all other criteria are equal, prefer the auxiliary problem that opens new possibilities

Polya suggests: "Sometimes the only advantage of the auxiliary problem is that it is new and offers unexplored possibilities; we choose it because we are tired of the original problem all approaches to which seem to be exhausted" (p. 76).

---

## The Insect and the Mouse

Polya opens the discussion of auxiliary problems with one of the book's most memorable images:

> "An insect tries to escape through the windowpane, tries the same again and again, and does not try the next window which is open and through which it came into the room. A man is able, or at least should be able, to act more intelligently" (p. 74).

The insect has no ability to vary its problem. The mouse has some. The human — and by extension the well-designed agent — can systematically explore the space of problem variations, identify the most promising, and navigate around obstacles that cannot be attacked directly.

A system that retries the same approach to the same problem indefinitely is exhibiting insect-level problem-solving. A system that varies its approach systematically, tracks what variations have been tried, and escalates to more fundamental reformulations when all direct approaches fail is exhibiting something closer to human intelligence.

---

## Application to Agent System Design

**Decomposition as auxiliary problem generation**: When an orchestrating agent receives a complex task, the planning phase should generate candidate auxiliary problems (sub-tasks) using the variation techniques above. The selected decomposition is a chain of auxiliary problems.

**The stepping-stone structure**: Complex tasks should be decomposed not into arbitrary sub-tasks but into sub-tasks where each one's output is a necessary stepping stone to the next. The chain should be audited: are the reductions equivalent or unilateral? If unilateral, what supplementary work closes the gap?

**Fallback strategy hierarchy**: When a direct approach fails, the agent should have an ordered hierarchy of problem variation strategies to attempt:
1. Restate the problem (try different representations)
2. Drop part of the condition (simplify)
3. Specialize to an extreme case
4. Find an analogous problem in a simpler domain
5. Generalize (seek the essential structure)
6. Work backwards from the desired output

**Guard against drift**: In long chains of reductions, regularly verify that the current sub-task, if solved, actually contributes to the original goal. The danger of unilateral reductions compounding is that the agent may solve a chain of problems perfectly while drifting away from the original requirement.

**Exploit successful solutions**: When an auxiliary problem is solved, immediately ask: can this result or method be used elsewhere? "Good problems and mushrooms of certain kinds have something in common; they grow in clusters" (p. 65).
```

---

### FILE: polya-heuristic-vs-demonstrative-reasoning.md
```markdown
# Heuristic Reasoning: The Indispensable Scaffold Before the Proof

## The Two Faces of Mathematical Thinking

Polya begins his book with a striking observation:

> "Mathematics has two faces; it is the rigorous science of Euclid but it is also something else. Mathematics presented in the Euclidean way appears as a systematic, deductive science; but mathematics in the making appears as an experimental, inductive science" (p. viii).

This distinction is the book's deepest philosophical contribution. Published mathematics hides the process by which it was discovered. The finished proof is clean, linear, and certain. The path to the proof was messy, provisional, and navigated by guesswork, analogy, induction, and plausible inference. 

Polya's term for the reasoning used *before* the proof is found: **heuristic reasoning**.

> "Heuristic reasoning is reasoning not regarded as final and strict but as provisional and plausible only, whose purpose is to discover the solution of the present problem" (p. 113).

---

## What Heuristic Reasoning Is Not

Heuristic reasoning is not:
- **Guessing randomly**: It is disciplined inference from partial information
- **Being sloppy**: It is deliberately provisional, which requires understanding what makes it provisional
- **A fallback for weak thinkers**: It is the *only* tool available to strong thinkers before the answer is known

The confusion between heuristic and demonstrative reasoning is one of the most dangerous failures in intellectual practice:

> "Heuristic reasoning is good in itself. What is bad is to mix up heuristic reasoning with rigorous proof. What is worse is to sell heuristic reasoning for rigorous proof" (p. 114).

---

## The Scaffolding Metaphor

Polya uses a construction metaphor that perfectly captures the relationship:

> "We need heuristic reasoning when we construct a strict proof as we need scaffolding when we erect a building" (p. 113).

The scaffolding is essential. Without it, the building cannot be constructed. But once the building stands, the scaffolding is removed. The finished building shows no trace of the scaffolding — and this is appropriate. But if you want to understand *how buildings are constructed*, you need to understand scaffolding.

The same applies to mathematics and to reasoning generally. If you want to understand *how solutions are found*, you need to understand heuristic reasoning. If you want to verify that a solution is correct, you need demonstrative reasoning.

The mistake of mathematics education, as Polya saw it, was presenting only the finished building (the proof) and never showing the scaffolding (the process). Students who only see finished proofs develop no ability to construct new ones.

---

## The Heuristic Syllogism

Polya identifies the fundamental pattern of heuristic inference. He calls it the **heuristic syllogism** and contrasts it with the classical demonstrative syllogism:

**Demonstrative (Modus Tollens):**
```
If A is true, then B is also true.
B is false.
Therefore, A is false.
```

**Heuristic:**
```
If A is true, then B is also true.
B is true.
Therefore, A becomes MORE CREDIBLE.
```

The difference is profound. In the demonstrative syllogism, the conclusion is certain and fully supported by the premises. In the heuristic syllogism, the conclusion is a *shift in probability* — a change in the level of confidence. "A becomes more credible" is not "A is true."

The critical feature: the *direction* of the shift (A becomes more credible, not less) is expressed and implied by the premises. But the *magnitude* of the shift is not fully determined by the premises. Two reasonable people can honestly disagree about *how much* more credible A becomes, because their backgrounds, unstated reasons, and experience differ.

This is why heuristic reasoning is neither arbitrary nor certain. It is structured, directional inference under uncertainty.

---

## Signs of Progress as Heuristic Inference

One of Polya's most insightful contributions is his analysis of "signs of progress" — the signals that tell a problem-solver they are on the right track before they have the answer.

He analyzes how Columbus and his crew reasoned from signs (birds, floating vegetation, sandpipers) to the inference "we are approaching land." Each sign was a heuristic syllogism:

```
If we are approaching land, we often see birds.
Now we see birds.
Therefore, probably, we are approaching land.
```

Polya notes: "Without the word 'probably' the conclusion would be an outright fallacy" (p. 198). Columbus's companions had been disappointed before — birds had appeared without land. But when the signs multiplied — birds, floating cane, a worked piece of wood, a green reed — "everyone breathed afresh and rejoiced."

The pattern: heuristic conclusions accumulate. Each new confirming sign increases credibility. Each sign that fails to appear decreases it. The problem-solver navigates by a running score of plausibility, not by certainty.

**Clearly expressible signs of progress** map directly to the heuristic operations in Polya's list:
- Successfully using one more datum → progress on "Did you use all the data?"
- Taking into account one more clause of the condition → progress on "Did you use the whole condition?"
- Finding a simpler analogous problem → progress on "Do you know a related problem?"
- Making contact with a relevant known theorem → progress on "Do you know a theorem that could be useful?"

**Less clearly expressible signs** — the felt sense that "it looks good" or "something is still missing that spoils the harmony" — may be similarly connected to more obscure cognitive operations, though Polya acknowledges these are harder to articulate.

---

## Induction: The Engine of Discovery

Polya distinguishes induction (discovering general laws from particular instances) from mathematical induction (a proof technique). The names are unfortunate, he notes, because "there is very little logical connection between the two processes" (p. 114).

Induction is the primary engine of mathematical discovery. Polya demonstrates this with the beautiful example of the sum of consecutive cubes:

A problem-solver notices: 1³ + 2³ + 3³ + 4³ = 100 = 10². Does this happen often? Investigation reveals a pattern in the bases of the squares (1, 3, 6, 10, 15) — they are triangular numbers, the partial sums of consecutive integers. The conjecture emerges:

1³ + 2³ + 3³ + ... + n³ = (1 + 2 + 3 + ... + n)²

This is discovered by induction. It is then proved by mathematical induction — a completely different process.

The discovery and the proof are separate acts. The discovery is exploratory, experimental, and heuristic. The proof is systematic, deductive, and certain. **Both are necessary. Neither is sufficient alone.**

> "In mathematics as in the physical sciences we may use observation and induction to discover general laws. But there is a difference. In the physical sciences, there is no higher authority than observation and induction but in mathematics there is such an authority: rigorous proof" (p. 118).

---

## Analogy as Plausible Inference

Analogy is one of the most powerful heuristic tools. Polya devotes one of the book's longest dictionary entries to it:

> "Analogy is a sort of similarity. Similar objects agree with each other in some respect, analogous objects agree in certain relations of their respective parts" (p. 86).

Analogy differs from mere similarity in its structural character. The rectangle is *analogous* to the rectangular parallelepiped because the relations among the rectangle's sides (each parallel to one other, perpendicular to the rest) have the same structure as the relations among the parallelepiped's faces. The analogy is a *correspondence of relations*, not just a resemblance of features.

**Reasoning by analogy** follows the heuristic syllogism pattern:
```
If the triangle and the tetrahedron are analogous in many respects,
And the center of gravity of the triangle has property P,
Then probably the center of gravity of the tetrahedron also has property P.
```

This is not proof. But it is strong enough to guide investigation, and when the analogy is tight and many-faceted, the probability is high enough to act on.

Polya notes: "It would be foolish to regard the plausibility of such conjectures as certainty, but it would be just as foolish, or even more foolish, to disregard such plausible conjectures" (p. 91).

---

## Examine Your Guess

One of the book's most practically important sections is titled "Examine Your Guess." Polya illustrates with a vivid psychological example: Mr. John Jones, who develops a suspicion about his boss and then "becomes blind to all signs pointing in the opposite direction," eventually making a real enemy of the director.

> "The trouble with Mr. John Jones is that he behaves like most of us. He never changes his major opinions... He never doubts them, or questions them, or examines them critically" (p. 99).

The antidote is not to avoid guessing — it is to systematically examine guesses rather than accepting them. The proper process:

1. **Form the guess explicitly**: Don't let vague impressions drive behavior. Make the conjecture precise enough that it can be examined.
2. **Realize what the guess implies**: What would be true if the guess were correct? What would be false?
3. **Test against special cases**: Does the conjecture hold in the simplest, most accessible instances?
4. **Look for disconfirming evidence**: Actively seek the "opposite signs" that Jones ignored.
5. **Revise in light of evidence**: A guess that survives examination is more credible; one that fails must be revised or abandoned.

> "No idea is really bad, unless we are uncritical. What is really bad is to have no idea at all" (p. 99).

---

## Checking Results: Multiple Independent Lines of Evidence

Polya's extended discussion of "Can you check the result?" translates heuristic epistemology into practical verification:

> "We desire to convince ourselves of the presence or of the quality of an object, we like to see and to touch it. And as we prefer perception through two different senses, so we prefer conviction by two different proofs" (p. 36).

The specific checking techniques Polya recommends all exploit the heuristic syllogism structure:

**Test by specialization**: If the formula yields the correct answer for a known special case, this confirms (but does not prove) its general correctness.

**Test by dimension**: If the dimensional analysis of a physical formula is consistent, this is strong (but not conclusive) evidence of correctness.

**Test by symmetry**: If a result is supposed to be symmetric in certain variables, and is, this is confirming evidence.

**Test by variation**: If increasing a positive parameter should increase the result, and does, this confirms but does not prove correctness.

Each test is a heuristic syllogism. Each passing test increases credibility. Failing a test is conclusive (demonstrative) — it definitively refutes the result. Passing a test is only probabilistic — it strengthens but does not establish.

> "Two proofs are better than one. 'It is safe riding at two anchors'" (p. 36).

---

## Reductio Ad Absurdum: Heuristic in Service of Proof

Polya's treatment of reductio ad absurdum (proof by contradiction) is illuminating because it shows how heuristic thinking can be disciplined into rigorous proof.

The key move: when you suspect something is impossible, *assume it is possible* and derive consequences until a contradiction appears. This is heuristic thinking (assuming an unproven hypothesis) harnessed to a demonstrative purpose (finding a definitive contradiction).

> "We have to examine the hypothetical situation in which all parts of the condition are satisfied, although such a situation appears extremely unlikely" (p. 183).

The procedure is "open-minded": you don't start by deciding that the situation is impossible. You set up the hypothetical situation as if it might be real, examine it seriously, and let the examination reveal the impossibility. This is epistemically honest and methodologically powerful.

---

## Applications to Agent System Design

**Embrace provisional conclusions**: An agent that refuses to act without certainty will be paralyzed in all real-world contexts. An agent that acts on heuristic conclusions while tracking their provisional status is far more capable.

**Explicit confidence tracking**: The heuristic syllogism pattern suggests that confidence should be tracked as a running quantity that is updated by confirming and disconfirming evidence. Each step in a reasoning chain should update confidence in the overall conclusion.

**Multiple validation channels**: The "two anchors" principle means verification should never rely on a single check. A system that validates outputs through multiple independent methods (different test strategies, different derivation paths, analogical checks, dimensional checks) is far more reliable than one that relies on a single validation step.

**Distinguish discovery from verification**: The process of finding a solution (heuristic) and the process of verifying it (demonstrative) are different cognitive modes. Systems should explicitly separate these phases rather than collapsing them. A solution found by heuristic means requires demonstrative verification before it is accepted as final.

**Examine guesses before acting on them**: When a system generates a hypothesis or plan, it should be explicitly examined before implementation. Make the hypothesis precise, derive its implications, test against known cases, actively seek disconfirming evidence. The Mr. Jones failure mode — uncritical confirmation bias — is a common AI failure mode as well.

**Track signs of progress**: During problem-solving, explicitly monitor whether the signs-of-progress heuristics are firing. Are more data being used? Are more conditions being satisfied? Is a simpler analogous problem becoming visible? These signals provide ongoing guidance even before the final answer is found.
```

---

### FILE: polya-decomposing-and-recombining.md
```markdown
# Decomposing and Recombining: The Cognitive Architecture of Problem Structure

## The Core Operation

Almost every non-trivial problem-solving move Polya describes comes down to a two-phase operation: *decomposition* (breaking the whole into parts for individual examination) and *recombination* (assembling parts into a new whole better adapted to the problem). Together these form the engine of productive thinking.

> "You examine an object that touches your interest or challenges your curiosity... You decompose the whole into its parts, and you recombine the parts into a more or less different whole" (p. 104).

This description applies equally to problems (what you are trying to solve), to solutions (the arguments you construct), and to the knowledge base (the previously solved problems and theorems you bring to bear).

---

## The Danger of Premature Decomposition

Polya issues an early warning that applies directly to agent systems:

> "If you go into detail you may lose yourself in details. Too many or too minute particulars are a burden on the mind. They may prevent you from giving sufficient attention to the main point, or even from seeing the main point at all. Think of the man who cannot see the forest for the trees" (p. 105).

The correct order is not "decompose first, then understand." It is "understand the whole, then identify which details deserve examination, then decompose selectively."

The practical sequence:
1. Understand the problem as a whole — its aim, its main point
2. Identify which parts are most likely essential
3. Examine those parts in detail
4. Proceed to finer detail only as necessary

> "Let us, first of all, understand the problem as a whole... Let us go into detail and decompose the problem gradually, but not further than we need to" (p. 105).

This "lazy decomposition" principle — decompose only as far as necessary, not as far as possible — is important. Maximal decomposition is often counterproductive, destroying the structural relationships that make the problem tractable.

---

## The Principal Parts of a Problem

Every problem has *principal parts* — the elements that must be explicitly identified before decomposition can proceed intelligently.

For **problems to find**:
- **The unknown**: What must be produced or determined?
- **The data**: What is given or available?
- **The condition**: What constraints link the unknown to the data?

For **problems to prove**:
- **The hypothesis**: What is assumed?
- **The conclusion**: What must be established?

These are not interchangeable. You cannot treat the unknown as if it were data, or the condition as if it were the unknown. Understanding the role of each principal part is prerequisite to intelligent decomposition.

Polya's key questions always target the principal parts first:
> "What is the unknown? What are the data? What is the condition?" (p. 3)
> "What is the hypothesis? What is the conclusion?" (p. 157)

---

## The Three-Way Classification of Decomposition Strategies

Polya provides a formal classification of how new problems can be generated from old ones by selective preservation and change of principal parts:

**Strategy 1: Keep the unknown, change data and conditions.**
This generates problems with the same output type. The "Look at the Unknown" heuristic exploits this: familiar problems with the same unknown often have relevant methods or results that transfer.

> "Keeping the unknown, we try to keep also some data and some part of the condition, and to change, as little as feasible, only one or two data and a small part of the condition" (p. 106).

The minimal-change version of this: keep the unknown and keep *part* of the condition, dropping the other part. This relaxes the constraint and makes the problem easier while preserving its character.

**Strategy 2: Keep the data, change the unknown.**
This generates stepping-stone problems. You look for something that can be derived from the available data and will be useful in finding the original unknown.

> "The new unknown should be both accessible and useful... If nothing better presents itself, it is not unreasonable to derive something from the data that has some chance of being useful" (p. 107).

This is the "Could you derive something useful from the data?" heuristic. The stepping stone is a new unknown that is (1) obtainable from the current data and (2) useful in obtaining the original unknown.

**Strategy 3: Change both unknown and data.**
More radical, and used when more conservative variations have failed. One important special case: interchange the unknown with one of the data.

> "An interesting way of changing both the unknown and the data is interchanging the unknown with one of the data" (p. 108).

This generates problems where what was sought becomes given and what was given becomes sought — often a productive transformation.

---

## Separating the Parts of the Condition

One of the most practically important decomposition moves is: **separate the various parts of the condition**. When the condition is compound (has multiple clauses), examining each clause independently often reveals structure that is invisible when the condition is treated as a whole.

The square-inscription problem (section 18) illustrates this beautifully:
- The condition has four parts: each vertex on a specific side
- Drop all but one vertex constraint → the square can vary freely, the unconstrained vertex describes a *locus*
- Drop all but two vertex constraints → the locus is further constrained
- The full problem: find the intersection of loci derived from the parts of the condition

The general principle: **when you drop part of the condition, the unknown goes from fully determined to partially free**. The range of variation of the unknown under the partial condition is itself a geometrically or structurally meaningful object (a locus, a set, a region). The intersection of such objects under different partial conditions gives the solution of the full problem.

Polya notes: "Even if the unknown is not a mathematical object... it may be useful to consider, to characterize, to describe, or to list those objects which satisfy a certain part of the condition imposed upon the unknown by the proposed problem" (p. 109).

---

## Defining Terms: The Hidden Decomposition

Going back to the definition of a technical term is a form of decomposition that is easy to overlook. When a problem involves a derived notion (parabola, sphere, isosceles triangle), the definition of that notion encodes relationships that must be introduced into the problem's structure.

Polya's example: "Construct the point of intersection of a given straight line and a parabola of which the focus and the directrix are given."

The word "parabola" is intimidating. But applying the definition — "the locus of points equidistant from the focus and directrix" — transforms the problem into: "Construct a point P on the line such that PF = PQ" (where F is the focus and Q the foot of the perpendicular to the directrix). The technical term has been *deflated* into a direct geometric condition.

> "The typical procedure: We introduce suitable elements into the conception of the problem. On the basis of the definition, we establish relations between the elements we introduced. If these relations express completely the meaning, we have used the definition. Having used its definition, we have eliminated the technical term" (p. 97).

This is critical for agent systems: when a task involves technical terms, jargon, or domain concepts, the first decomposition move should be to apply the definitions of those terms. This replaces opaque vocabulary with transparent relationships.

**The deeper principle**: words have no explanatory power in themselves. Power resides in the facts they reference. "Going back to definitions" is the operation of looking through words to the facts that make them meaningful.

---

## Notation as Cognitive Infrastructure

Decomposition and recombination are enormously aided by good notation. Polya devotes substantial attention to notation because it is not cosmetic — it is a cognitive tool that determines what relationships are visible.

The key properties of good notation:
1. **Unambiguous**: The same symbol never denotes two different objects in the same inquiry
2. **Pregnant**: The notation expresses the relationships among objects, not just their names
3. **Mnemonic**: The signs remind you of the objects and vice versa
4. **Ordered**: The order and connection of signs suggests the order and connection of things

The most powerful feature: **notation can exploit second meanings** — the connotations that symbols acquire from their history of use. Letters at the beginning of the alphabet (a, b, c) suggest constants; letters at the end (x, y, z) suggest variables. Roman capitals suggest points, small letters lines, Greek letters angles. When notation is chosen consistently with these conventions, the relationships become visible at a glance rather than requiring explicit reconstruction.

> "A good sign should be easy to remember and easy to recognize; the sign should immediately remind us of the object and the object of the sign" (p. 173).

---

## Symmetry: Decomposition's Structural Constraint

When a problem is symmetric — has interchangeable parts — the decomposition and recombination must respect this symmetry. Violating symmetry in the decomposition introduces spurious distinctions that contaminate the solution.

Polya's example: constructing a triangle given one angle (α), the altitude from its vertex, and the perimeter (p). When introducing p into the figure, attempts that treat the two equal sides differently (Figs. 9 and 10) "appear clumsy." The reason: "our problem is symmetric with respect to b and c. But b and c do not play the same role in our figures 9, 10; placing the length p we treated b and c differently; the figures 9 and 10 spoil the natural symmetry of the problem with respect to b and c" (p. 72).

The symmetric solution: place p so that b and c appear on opposite sides of the base, maintaining the natural symmetry. This forces the introduction of isosceles triangles — familiar, useful auxiliary elements.

> "Try to treat symmetrically what is symmetrical, and do not destroy wantonly any natural symmetry" (p. 204).

---

## Recombination: The Creative Phase

After decomposition comes recombination — finding a new whole that is better adapted to the problem. This is the creative step, and it is where difficulty lives.

Polya's honest assessment: "Difficult problems demand hidden, exceptional, original combinations, and the ingenuity of the problem-solver shows itself in the originality of the combination" (p. 105).

However, for simpler problems, "certain usual and relatively simple sorts of combinations, sufficient for simpler problems, which we should know thoroughly and try first" (p. 105) are usually adequate. The classification of strategies (keep unknown/change data, keep data/change unknown, change both) provides the systematic framework for generating candidate recombinations.

The insect returns: "An insect tries to escape through the windowpane, tries the same hopeless thing again and again, and does not try the next window which is open" (p. 209). The mouse tries different bars. The human systematically varies the approach. The difference is not effort — it is *systematic variation*.

---

## Application to Agent Task Architecture

**Task intake as principal-parts identification**: The first operation when an agent receives a task should be explicitly identifying the principal parts: What is the unknown (output type and specifications)? What are the data (inputs available)? What is the condition (constraints on the output)?

**Condition decomposition before skill selection**: Before routing to any skill, separate the condition into its parts and examine each independently. This reveals whether the task is a single-step or multi-step problem, and which constraints are the binding ones.

**Definition application as first decomposition**: When the task involves technical terms, immediately apply their definitions to transform opaque requirements into explicit structural conditions.

**Symmetry preservation**: In decomposing a task, respect any symmetries present in the original problem. Sub-tasks that break natural symmetry may introduce spurious distinctions and complicate recombination.

**Lazy decomposition**: Do not decompose maximally. Decompose until you can see the next productive step, then execute, then reassess. Over-decomposition can destroy the structural relationships that make the problem tractable.

**Notation standards**: The internal representation chosen for a complex task should exploit the "second meaning" principle — use established conventions that carry implicit relational information, rather than arbitrary identifiers that must be looked up.
```

---

### FILE: polya-mobilization-organization-progress.md
```markdown
# Progress in Problem-Solving: Mobilization, Organization, and the Bright Idea

## The Question Behind the Framework

How does a problem-solver make progress? This is Polya's deepest question, and the answer shapes everything else in the book. Progress is not random — it has describable structure. Understanding that structure enables an intelligent system to recognize when it is progressing, diagnose when it is stuck, and take targeted action to restart movement.

Polya's analysis of progress distinguishes two fundamental components — mobilization and organization — and a distinctive phenomenon — the bright idea — that marks sudden large advances.

---

## Mobilization: Extracting Relevant Prior Knowledge

> "In order to solve a problem, we must have some knowledge of the subject-matter and we must select and collect the relevant items of our existing but initially dormant knowledge. There is much more in our conception of the problem at the end than was in it at the outset; what has been added? What we have succeeded in extracting from our memory" (p. 162).

At the start of working on a problem, most of the knowledge relevant to its solution is *dormant* — present in memory but not yet active, not yet connected to the problem. Progress requires waking this knowledge, drawing it into active engagement with the problem.

Polya calls this *mobilization*. It is not passive recall — it is targeted extraction driven by the problem's structure. The questions and suggestions of the "How to Solve It" list are primarily mechanisms for mobilization: they give memory specific targets to search.

**What gets mobilized:**
- Formerly solved problems (indexed by unknown type, by subject, by method)
- Known theorems (indexed by conclusion type, by subject matter)
- Definitions of technical terms (the explicit structural facts behind vocabulary)
- General patterns (analogies, symmetries, special cases)

The "Look at the unknown" heuristic is the most efficient mobilization trigger: it focuses memory search on the highest-relevance category (problems with the same output type).

**The dormancy trap**: Knowledge that cannot be mobilized is practically useless. A student who has learned many theorems but cannot access them when they are needed has been educated to retain information, not to use it. The ability to mobilize knowledge — to recognize that a current problem is related to a prior solution — is a distinct competence that must be explicitly cultivated.

---

## Organization: Combining What Has Been Mobilized

Mobilization alone is insufficient:

> "In order to solve a problem, however, it is not enough to recollect isolated facts, we must combine these facts, and their combination must be well adapted to the problem at hand. Thus, in solving a mathematical problem, we have to construct an argument connecting the materials recollected to a well adapted whole. This adapting and combining activity may be termed organization" (p. 162).

Organization is the constructive phase: taking mobilized pieces and fitting them together into a structure that connects data to unknown. This is the phase where creativity appears most visibly — the recombination of familiar elements into a novel structure.

But Polya is careful not to mystify organization. It proceeds by systematic variation: trying different combinations, examining them from different angles, modifying failed attempts. "Mobilization and organization can never be really separated. Working at the problem with concentration, we recall only facts which are more or less connected with our purpose, and we have nothing to connect and organize but materials we have recollected and mobilized" (p. 162).

They are two aspects of a single integrated process. As organization reveals gaps (missing data, unused conditions), it triggers new mobilization. As mobilization brings new elements to bear, it creates new organizational possibilities.

---

## Variation as the Engine of Progress

Progress requires seeing the problem from new angles. "Desiring to proceed from our initial conception of the problem to a more adequate, better adapted conception, we try various standpoints and we view the problem from different sides" (p. 162).

This is why staring at the same formulation of a problem, without variation, rarely produces progress. Memory retrieval is associative — different formulations activate different associations. A problem that appears impenetrable from one angle may become transparent from another.

Variation also keeps attention alive: "We are easily tired by intense concentration of our attention upon the same point. In order to keep the attention alive, the object on which it is directed must unceasingly change" (p. 211).

When progress stalls, the prescription is clear: set yourself a new question about the problem. The new question "unfolds untried possibilities of contact with our previous knowledge, it revives our hope of making useful contacts" (p. 211).

**The specific variations available:**
- Restate the problem in different terms
- Go back to definitions
- Generalize or specialize
- Find analogies in simpler domains
- Drop part of the condition
- Introduce auxiliary elements
- Work backwards from the goal

Each variation is a new angle of attack, activating different mobilization pathways.

---

## Foreseeing the Solution

As progress accumulates, something distinctive happens: the solution becomes increasingly visible before it is complete.

> "As we progress toward our final goal we see more and more of it, and when we see it better we judge that we are nearer to it... Solving a mathematical problem we may foresee, if we are lucky, that a certain known theorem might be used, that the consideration of a certain formerly solved problem might be helpful, that going back to the meaning of a certain technical term might be necessary. We do not foresee such things with certainty, only with a certain degree of plausibility" (p. 163).

This foresight is heuristic, not certain. But it is real progress — it means the architecture of the solution has become visible even if the details are not yet worked out. The problem-solver who can say "I think the key is to introduce a certain auxiliary triangle" has made significant progress even before finding the triangle.

The development of foresight skill — the ability to recognize productive directions before they are certain — is one of the most important competences a problem-solver can develop.

---

## The Bright Idea

Polya's richest concept: the *bright idea* (Einfall in German). 

> "We may advance steadily, by small imperceptible steps, but now and then we advance abruptly, by leaps and bounds. A sudden advance toward the solution is called a bright idea, a good idea, a happy thought, a brain-wave" (p. 163).

What is a bright idea, structurally? "An abrupt and momentous change of our outlook, a sudden reorganization of our mode of conceiving the problem, a just emerging confident prevision of the steps we have to take in order to attain the solution" (p. 163).

The bright idea is not random. It is preceded by sustained preparation — mobilization of relevant knowledge, organization of partial structures, variation of the problem's presentation. The conditions that favor bright ideas:

1. **Prolonged engagement**: "Only such problems come back improved whose solution we passionately desire, or for which we have worked with great tension; conscious effort and tension seem to be necessary to set the subconscious work going" (p. 207).

2. **Strategic relaxation**: Sometimes the bright idea arrives not during intense work but after a rest. "The next day, after a good night's rest, I looked again into the question and soon hit upon an analogous theorem in plane geometry" (p. 196). Subconscious processing continues during rest.

3. **Responsive to signs**: The problem-solver who is alert to signs of progress — partial connections, emerging symmetries, activated analogies — will recognize the bright idea when it arrives. The hunter who notices traces sees game that others miss.

Polya uses Aristotle's definition of "sagacity" as an early description of the bright idea: "Sagacity is a hitting by guess upon the essential connection in an inappreciable time" (p. 83). The example Aristotle gives: "observing that the bright side of the moon is always toward the sun, you may suddenly perceive why this is; namely, because the moon shines by the light of the sun." This is the restructuring of a familiar observation into a deeper understanding — the illumination of the essential connection.

---

## Subconscious Work

Polya takes subconscious processing seriously as a real phenomenon relevant to problem-solving:

> "It often happens that you have no success at all with a problem; you work very hard yet without finding anything. But when you come back to the problem after a night's rest, or a few days' interruption, a bright idea appears and you solve the problem easily" (p. 206).

The evidence of subconscious work: a problem returns to consciousness essentially clarified, much nearer to solution than when it left. Something continued working without conscious direction.

The practical implications:
- There is a limit beyond which forcing conscious reflection is counterproductive. "Take counsel of your pillow" is not laziness — it is respect for the processing that happens below the level of conscious attention.
- But subconscious work is not passive. It requires prior investment: "conscious effort and tension seem to be necessary to set the subconscious work going" (p. 207).
- And it should not be relied on to rescue incomplete work: "it is desirable not to set aside a problem to which we wish to come back later without the impression of some achievement; at least some little point should be settled... when we quit working" (p. 207).

---

## Diagnosis: Recognizing Where Progress Is Failing

Polya introduces the concept of "diagnosis" — a closer characterization of where a student's (or system's) problem-solving is breaking down. The four-phase framework provides the diagnostic structure:

| Phase | Characteristic Failure Mode |
|-------|------------------------------|
| Understanding | Insufficient concentration; starts without clarity on what is required |
| Devising a plan | Either rushes into computation without a plan, or waits passively for inspiration |
| Carrying out | Carelessness; fails to check each step |
| Looking back | Doesn't check result at all; accepts the first answer obtained |

> "Failure to check the result at all is very frequent; the student is glad to get an answer, throws down his pencil, and is not shocked by the most unlikely results" (p. 62).

Good diagnosis is specific: not "the agent failed" but "the agent failed at Phase 2, specifically at mobilizing relevant prior solutions by their unknown type." This specificity enables targeted remediation.

---

## How the Questions Serve Progress

Every question and suggestion in Polya's list can be understood as an intervention targeted at a specific aspect of progress:

**Questions targeting mobilization**:
- "Have you seen it before?"
- "Do you know a related problem?"
- "Do you know a theorem that could be useful?"
- "Look at the unknown! Try to think of a familiar problem..."

**Questions targeting organization**:
- "Could you use it? Could you use its result? Could you use its method?"
- "Should you introduce some auxiliary element?"

**Questions targeting completeness**:
- "Did you use all the data?"
- "Did you use the whole condition?"
- "Have you taken into account all essential notions?"

**Questions targeting variation**:
- "Could you restate the problem?"
- "Could you imagine a more accessible related problem?"

**Questions targeting foresight**:
- "Is it possible to satisfy the condition?"
- "Is the condition sufficient to determine the unknown?"

The questions are not arbitrary — each addresses a specific bottleneck in the progress process. Used well, they don't just prompt action; they diagnose what kind of action is needed.

---

## Applications to Agent System Design

**Progress monitoring as explicit system state**: An agent system should maintain explicit progress state that tracks: (1) what has been mobilized (relevant prior knowledge activated), (2) what has been organized (partial structures assembled), (3) what variations have been attempted (angles of attack tried), and (4) what foresight has emerged (partial outlines of the solution visible).

**Variation as unstuck mechanism**: When progress stalls, the agent should have a systematic protocol for generating new variations of the problem: restate, generalize, specialize, analogize, drop conditions, introduce auxiliaries, reverse direction. The protocol should track which variations have been tried to avoid cycling.

**Preparation for bright ideas**: Sustained engagement, tracking partial progress, maintaining a record of what has been tried — these prepare the ground for synthesis. A system that records its partial progress in structured form can return to a problem with more useful context than one that discards intermediate states.

**Diagnostic specificity**: Failure analysis should identify not just that a task failed but *which phase* failed and *which specific progress operation* was the bottleneck. This enables targeted improvement.

**Subconscious analogue**: In multi-agent systems, an agent that has been working on a problem may benefit from "sleeping" — routing the problem to a different agent or different skill set, which brings fresh mobilization pathways to bear. The fresh perspective is the system-level analogue of subconscious work.

**Determination and engagement**: Polya notes that motivation matters: "A student wishing seriously to help the student should, first of all, stir up his curiosity, give him some desire to solve the problem" (p. 63). The agent-level analogue: problems that connect to the agent's core objectives (high-relevance, high-impact) receive more exploratory processing than peripheral problems. Priority routing affects the depth of engagement.
```

---

### FILE: polya-looking-back-and-knowledge-compounding.md
```markdown
# Looking Back: How Problem-Solving Compounds into Expertise

## The Neglected Phase

Polya is unambiguous: the Looking Back phase is the most neglected part of problem-solving, and its neglect is one of the most wasteful habits in intellectual work.

> "Even fairly good students, when they have obtained the solution of the problem and written down neatly the argument, shut their books and look for something else. Doing so, they miss an important and instructive phase of the work. By looking back at the completed solution, by reconsidering and reexamining the result and the path that led to it, they could consolidate their knowledge and develop their ability to solve problems" (p. 11).

The verb "consolidate" is key. Looking back is not repetition — it is *consolidation*. The same solution, reviewed with the questions Polya proposes, becomes integrated into a more organized knowledge structure. Without consolidation, each problem solved is an isolated event. With it, each problem solved becomes a building block.

---

## The Four Looking-Back Questions

**1. Can you check the result?**

The question is not "did you get an answer?" but "is the answer correct?" These are different. An answer can be produced without being correct.

Polya provides a rich taxonomy of checking strategies that go far beyond "repeat the calculation":

*Specialization*: Does the formula give the correct answer in known simple cases? If the formula for the volume of a frustum gives the correct answer when the upper base shrinks to zero (becoming a pyramid) and when the two bases are equal (becoming a prism), this is strong evidence of correctness.

*Dimensional analysis*: Does the dimensional structure of the result match what it should be? A formula for volume must have dimension (length)³, not (length)² or (length).

*Symmetry*: If the problem is symmetric in certain variables, is the result? The diagonal of a rectangular parallelepiped should be symmetric in a, b, and c — does your formula have this property?

*Variation*: If a positive parameter increases, does the result change in the expected direction? The diagonal should increase if any of a, b, c increases.

*Analogy*: Does the result have the form predicted by the analogous simpler problem? The 3D diagonal formula should be analogous to the 2D distance formula.

Each of these checks is a heuristic syllogism (a confirming instance increases credibility) rather than a proof. But passing many independent checks greatly increases confidence. "It is safe riding at two anchors" (p. 36).

**2. Can you check the argument?**

Checking the result and checking the argument are different operations. A result can sometimes be verified even when the argument that produced it is flawed. And an argument can be structurally sound while making a computational error at a late step.

Checking the argument focuses on the logical structure of the derivation: does each step follow validly from the premises? Are all the data and conditions used? Was any step justified by an assumption not explicitly stated?

A powerful checking strategy: "Did you use all the data? Did you use the whole condition?" If the result doesn't depend on some datum that was supposed to be essential, something is wrong — either in the derivation or in the problem statement.

**3. Can you derive the result differently?**

Two independent derivations of the same result provide much stronger evidence of correctness than one derivation alone. They also illuminate the result from different angles, deepening understanding.

> "We desire to convince ourselves of the validity of a theoretical result by two different derivations as we desire to perceive a material object through two different senses. Having found a proof, we wish to find another proof as we wish to touch an object after having seen it" (p. 36).

This question also motivates the search for simpler, more illuminating arguments. Often the first proof found is not the best:

> "Not entirely satisfied with our derivation of the result, we wish to improve it, to change it. Therefore, we study the result, trying to understand it better, to see some new aspect of it. We may succeed first in observing a new interpretation of a certain small part of the result" (p. 37).

The process of seeking a better argument often yields genuine new insights — new interpretations of sub-expressions, new structural relationships, new connections to other results.

**4. Can you use the result, or the method, for some other problem?**

This is the generative question — the one that transforms a solved problem into a productive resource.

> "Good problems and mushrooms of certain kinds have something in common; they grow in clusters. Having found one, you should look around; there is a good chance that there are some more quite near" (p. 65).

The specific ways to generate new problems from a solved one:

*Use the result directly*: Apply the formula or theorem to related problems. The diagonal formula applies immediately to finding the circumradius of a rectangular parallelepiped, the lateral edges of certain pyramids, distances in coordinate geometry.

*Use the method*: Apply the problem-solving technique to analogous problems. The technique of introducing auxiliary right triangles applies to many problems involving lengths in 3D.

*Vary the data systematically*: Keep the unknown, change the data; or keep the data, make one datum the unknown. The relation established by the solution can be exploited in multiple directions.

*Generalize*: What is the general principle of which this problem is a special case?

*Specialize*: What interesting special cases follow from the general result?

*Analogize*: What analogous problem in a different domain has a similar structure?

---

## Knowledge Organization Through Looking Back

The deep purpose of Looking Back is not just validation — it is the organization of knowledge for future use.

Polya describes two dangers for problem-solvers without good Looking-Back habits:

**Isolation**: Each problem solved remains separate, not connected to others. Knowledge is a bag of disconnected facts rather than a network of related insights. Retrieval is difficult because there is no structure to index into.

**Fragility**: Connections between facts are not reinforced by use. Facts learned are forgotten. The only antidote is the kind of active consolidation that Looking Back provides.

Looking Back builds the connections:
- This result is a special case of that general theorem
- This method is an application of that general principle  
- This problem is analogous to that simpler problem
- This formula reduces to that known formula as a parameter varies

These connections are what make knowledge *mobilizable* — accessible when a new problem calls for it.

---

## Testing by Multiple Angles: A Worked Example

Polya devotes an extended discussion in section 14 to demonstrating what substantive Looking Back looks like. After obtaining the diagonal formula for a rectangular parallelepiped:

```
x = √(a² + b² + c²)
```

He asks a series of checking questions, each exploiting a different structure:

1. "Did you use all the data? Do all data a, b, c appear in your formula?" — Yes, all three appear.

2. "Our problem is symmetric with respect to a, b, c. Is your formula symmetric?" — Yes, it is unchanged when a, b, c are permuted.

3. "Our problem is analogous to finding the diagonal of a rectangle. Is your result analogous to that result?" — Yes: the 2D formula x = √(a² + b²) extends naturally to 3D by adding c².

4. "If c decreases to 0, the parallelepiped becomes a parallelogram. Does your formula reduce to the 2D formula when c = 0?" — Yes.

5. "If c increases, the diagonal increases. Does your formula show this?" — Yes: ∂x/∂c > 0.

6. "If all dimensions are multiplied by 12, the diagonal should also multiply by 12. Does your formula show this?" — Yes: scale invariance holds.

> "An intelligent student cannot help being impressed by the fact that the formula passes so many tests. He was convinced before that the formula is correct because he derived it carefully. But now he is more convinced, and his gain in confidence comes from a different source; it is due to a sort of 'experimental evidence'" (p. 13).

The cumulative effect is not just increased confidence in this result — it is the acquisition of a *checking methodology* that can be applied to any formula in similar problems.

---

## The Euler Method: Checking Arguments by Using All Data

Polya's most elegant checking technique works for proofs as well as computational results: verify that every part of the hypothesis is actually used.

If a theorem has three essential hypothesis clauses, then each clause should appear at least once in the proof. If the proof seems to go through without using clause 3, something is wrong — either clause 3 is not actually essential (and the theorem is stronger than stated), or a step relying on clause 3 was implicitly assumed without acknowledgment.

This technique works because *a well-stated problem uses all its data*. Any data item that doesn't appear in the solution is either redundant (indicating the problem is imperfectly stated) or signals a gap in the argument.

The checking procedure: "Does the proof use the first part of the hypothesis? Where does it use it? Where does it use the second part? Where the third?" (p. 63).

---

## Indirect Proof and Looking Back

Polya's discussion of reductio ad absurdum contains a beautiful illustration of productive Looking Back. After finding a proof by contradiction, he asks: can the proof be reorganized?

The original proof started from an impossible assumption and derived a contradiction. On Looking Back, Polya extracts a positive, direct proof by identifying the elements of the reductio argument that are *unconditionally true* — independent of the false assumption. These elements are reorganized into a direct argument that proves the same result without the cognitive difficulties of reasoning from a false premise.

> "Looking back at the reasoning... we may perceive that this much is doubtless true: If a set of numbers with one or two digits is written so that each of the ten figures occurs just once, then the sum of the set is of the form 9(t+5). Thus, this sum is divisible by 9" (p. 186).

The contradiction came from the fact that 100 is not divisible by 9. The indirect proof is reorganized into: "the sum must be divisible by 9, but 100 is not, therefore the puzzle has no solution." The reductio structure disappears; the direct insight remains.

This is a model for productive Looking Back in formal reasoning: after finding a proof or argument by whatever means, seek a cleaner, more direct presentation that preserves the insight while dropping the scaffolding.

---

## Applications to Agent System Design

**Looking Back as a non-optional pipeline stage**: In any agent system pipeline, a structured validation and consolidation stage should be mandatory after task completion. This stage is not a single check — it is a multi-method review using at least two independent validation strategies.

**The validation strategy hierarchy**:
1. Specialization test: Does the result hold in the simplest, most accessible special cases?
2. Dimensional/type consistency: Does the output have the right structure/type/format?
3. Symmetry/invariance: Does the output respect symmetries present in the input?
4. Boundary behavior: Does the output behave correctly as inputs vary toward extreme values?
5. Analogical consistency: Does the output match the pattern expected from analogous simpler problems?

**Alternative derivation as robustness check**: For high-stakes outputs, the system should attempt at least one independent derivation or construction of the result. Convergence of two independent approaches provides much stronger confidence than any single approach alone.

**Generative exploitation**: After completing a task, the system should ask: what related tasks does this solution make accessible? What new capabilities has this solution demonstrated? What patterns from this solution should be indexed for future use?

**Knowledge indexing**: Completed solutions should be stored with metadata that enables future mobilization: output type, domain, method used, key structural features, analogy relationships. The investment in good indexing pays dividends every time a future problem activates a relevant stored solution.

**The "used all data" audit**: After completing a task, verify that every piece of provided information was incorporated. Missing data usually signals missing steps. Unused data in a well-stated problem is a red flag.

**Compounding**: The value of a good Looking-Back practice is not just the correctness of the current output — it is the compound return over many tasks. Systems that consolidate, organize, and index their solutions improve over time. Systems that treat each task as isolated do not.
```

---

### FILE: polya-expert-intuition-and-signs-of-progress.md
```markdown
# Expert Intuition and Signs of Progress: How Intelligent Systems Navigate Under Uncertainty

## The Navigator's Problem

A ship's navigator in the era before GPS cannot see the destination. Navigation required reading *signs* — star positions, water color, bird species, floating debris, cloud formations, depth soundings. Each sign was imperfect evidence. None was conclusive. Together, they provided a continuously updated estimate of position and heading.

Polya uses Columbus's navigation to the New World as his central metaphor for problem-solving under uncertainty. The detailed account of the October 11, 1492 entry in Columbus's log — sandpipers, a green reed, a worked piece of wood, floating plants — illustrates how expert practitioners read the accumulating signs that indicate approach to a solution.

> "When we are working intensely, we watch eagerly for signs of progress as Columbus and his companions watched for signs of approaching land" (p. 191).

Understanding how experts read these signs — and how to systematically develop that ability — is one of Polya's deepest contributions.

---

## The Structure of a Sign

Every sign of progress has the same logical structure — the heuristic syllogism:

```
If we are approaching land, we often see birds.
Now we see birds.
Therefore, probably, we are approaching land.
```

The "probably" is essential. Without it, the conclusion would be a fallacy (the sign could be present without the condition being true). With it, the conclusion is reasonable, directional, and probabilistic — a shift in credibility rather than a proof.

Polya's critical insight: **signs of progress in problem-solving have exactly this structure**. Each successful problem-solving operation — using one more datum, accounting for one more clause of the condition, finding a simpler analogous problem, recognizing a familiar structure — is a sign that the solution is being approached.

Each sign increases the credibility of the hypothesis "I am on the right track." The cumulative effect of many signs is high confidence even in the absence of proof.

---

## The Taxonomy of Signs

Polya provides a remarkable analysis: **signs of progress correspond exactly to the operations in the "How to Solve It" list**. When a typical useful operation succeeds, its success is a sign of progress.

**Signs corresponding to mobilization operations:**
- Recalling a formerly solved problem related to the current one → sign of approaching a plan
- Identifying a theorem whose conclusion matches the goal → sign of finding the main argument
- Finding a simpler analogous problem → sign of approaching the essential structure

**Signs corresponding to organizational operations:**
- Introducing an auxiliary element that bridges a gap → sign of finding the key connection
- Successfully using one more datum → sign of completing the chain from data to unknown
- Taking one more clause of the condition into account → sign of satisfying the full requirement

**Signs corresponding to completeness operations:**
- Each datum appearing in the emerging solution → sign of a well-structured argument
- All conditions being addressed by the construction → sign of correctness

**Signs corresponding to structural operations:**
- The result exhibiting expected symmetry → sign of correctness
- The formula reducing to the known simpler result as a parameter vanishes → sign of correctness
- Dimensional consistency → sign of correctness

> "To each mental operation clearly conceived corresponds a certain sign clearly expressible. Our list, appropriately read, lists also signs of progress" (p. 200).

---

## Less Articulable Signs

Beyond the clearly expressible signs, Polya acknowledges a class of more intuitive signals:

> "When we work intently, we feel keenly the pace of our progress: when it is rapid we are elated; when it is slow we are depressed. We feel such differences quite clearly without being able to point out any distinct sign" (p. 200).

These less articulable signs may be connected to "more obscure, mental activities — perhaps with activities whose nature is more 'psychological' and less 'logical'" (p. 201). Descriptions like "well-balanced," "harmonious," "something is still lacking" capture real structural features of incomplete solutions — but the features being tracked are harder to make explicit.

The experienced expert develops sensitivity to these signals. A sense that "the argument doesn't quite feel right" often correctly identifies a gap before the gap is precisely located. This is not mysticism — it is a sensitivity to structural features that haven't been fully articulated yet.

Polya's prescription: take these signals seriously, but never stop scrutinizing them. "Trust, but keep your eyes open. Trust but look. And never renounce your judgment" (p. 195).

---

## How Signs Guide Action

Signs have pragmatic value: they guide the allocation of attention and effort.

When signs are positive and multiplying, the problem-solver gains confidence and moves with increasing momentum — like Columbus's crew as the signs accumulated on October 11. When signs are absent or contradictory, the approach should be reconsidered.

> "Their absence may warn us of a blind alley and save us time and useless exertion; their presence may cause us to concentrate our effort upon the right spot" (p. 201).

But Polya is honest about the fallibility of signs: "I once abandoned a certain path for lack of signs, but a man who came after me and followed that path a little farther made an important discovery — to my great annoyance and long-lasting regret" (p. 202).

Signs can deceive. The appropriate response is not to ignore them (which would leave the problem-solver navigating blind) but to hold them provisionally, remain open to revision, and periodically reconsider whether accumulated signs might be misread.

---

## The Anatomy of Inspiration

What Polya calls a "bright idea" (Einfall) — the sudden advance toward a solution — is often described in mystical terms. Polya demystifies it without diminishing it.

The bright idea is not random. It has prerequisites:
- Sustained engagement with the problem (building up relevant activated knowledge)
- Systematic variation (creating new angles of attack)
- Attention to partial progress (tracking what has been learned)
- Sensitivity to signs (reading the signals of approach)

And it has a distinctive phenomenology: a sudden *reorganization* of the conception of the problem. Not a new piece of information added — a restructuring of the whole picture that makes the path visible.

Aristotle called this "sagacity": "a hitting by guess upon the essential connection in an inappreciable time" (p. 83). The moonlight example: a contemporary of Aristotle who had noticed that the bright side of the moon always faces the sun, and then suddenly *sees* that the moon's varying phases are the shadow patterns of an illuminated sphere — this is a restructuring of observation into understanding. The data were available before; the connection was not visible. Then, suddenly, it is.

The bright idea is not manufactured — it *arrives*. But it arrives when the conditions are right:
- Sufficient relevant knowledge has been mobilized
- The problem has been examined from multiple angles
- The problem-solver is attentive enough to recognize the insight when it emerges

"Past ages regarded a sudden good idea as an inspiration, a gift of the gods. You must deserve such a gift by work, or at least by a fervent wish" (p. 207).

---

## The Expert Advantage: Reading Faint Traces

What distinguishes the expert from the novice in reading signs of progress?

> "It takes experience to interpret the signs correctly. Some of Columbus's companions certainly knew by experience how the sea looks near the shore and so they were able to read the signs which suggested that they were approaching land... The expert knows more signs than the inexperienced, and he knows them better; his main advantage may consist in such knowledge" (p. 201).

The expert hunter notices traces that the novice cannot see. The expert problem-solver notices partial connections, emerging patterns, and structural similarities that the novice overlooks. This sensitivity is built by:

1. Solving many problems and carefully noting what signs appeared before the solution
2. Attending to Looking-Back questions after each solution (what were the key structural features?)
3. Building a rich indexed library of solved problems (enabling faster pattern recognition)
4. Deliberately practicing sign-reading (attending explicitly to the heuristic signals during work)

> "The main advantage of the exceptionally talented may consist in a sort of extraordinary mental sensibility. With exquisite sensibility, he feels subtle signs of progress or notices their absence where the less talented are unable to perceive a difference" (p. 202).

This sensitivity can be partly cultivated through deliberate practice. It is not purely innate.

---

## Calibration: Trusting Signs Without Being Captured by Them

The great danger: over-trusting signs. Mr. Jones (from the "Examine Your Guess" entry) developed a suspicion and became blind to disconfirming evidence. Columbus's companions saw birds and thought they were near land — but were repeatedly disappointed before they actually arrived.

The appropriate stance: **trust signs, but maintain calibrated uncertainty**. A confirming sign increases credibility; it does not establish certainty. A disconfirming sign decreases credibility; it does not refute.

The ideal is active sign-seeking rather than passive sign-receiving: deliberately look for signs that would disconfirm the current approach, not just signs that confirm it. This is the intellectual equivalent of testing the limits of a formula rather than just verifying that it works in the cases already checked.

> "Always follow your inspiration — with a grain of doubt" (p. 201).

The agent-level implication: confidence should be modeled explicitly, updated by both confirming and disconfirming evidence, and never allowed to converge to certainty on the basis of heuristic evidence alone.

---

## Application to Agent System Design

**Explicit progress tracking**: Agent systems should maintain an explicit progress state that logs which signs of progress have been observed. This state enables both internal guidance (is this approach working?) and external reporting (how far along is the solution?).

**Sign taxonomy implementation**: The taxonomy of signs can be implemented as a checklist that is evaluated periodically during complex tasks:
- Have more data been connected to the unknown?
- Have more conditions been accounted for?
- Has a simpler analogous problem been identified?
- Has a relevant prior solution been found?
- Is the emerging solution exhibiting expected symmetry/invariance?

**Multi-method confidence scoring**: Confidence in an emerging solution should be based on multiple independent signal types, not just the subjective sense that "it looks right." A solution that passes five independent checks is more reliable than one that passes one check very well.

**Active disconfirmation**: For high-stakes tasks, the agent should explicitly attempt to disconfirm its current approach before committing to it