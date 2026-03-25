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