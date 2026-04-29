# Plans as Computational Constraints: The Dual Role in Resource-Bounded Reasoning

## The Fundamental Problem

Resource-bounded agents face a predicament that idealized decision theory cannot address: **deliberation takes time, and the world changes during that time**. As Bratman, Israel, and Pollack observe, "for real agents it takes time to do such computations—and the more complicated they are, the more time it takes. This is a problem because the more time spent on deliberation, the more chance there is that the world will change in important ways—ways that will undermine the very assumptions on which the deliberation is proceeding" (p. 3).

This creates an impossible situation if we view practical reasoning purely as optimization: an agent cannot afford to constantly compute which action maximizes expected utility, because the computation itself consumes the very resource (time) being optimized. Traditional AI planning systems avoided this by assuming "the conditions for which a plan is being formed, the so-called start state, will not change prior to execution" (p. 4), but this assumption fails in any real environment.

## Plans as Both Output and Input

The paper's central insight resolves this: **plans serve a dual role — they are outputs of deliberation but also inputs that constrain future deliberation**. This is not merely an implementation detail; it's the fundamental mechanism by which resource-bounded rationality becomes tractable.

The authors identify three specific ways plans constrain reasoning:

1. **Driving means-end reasoning**: Plans "drive means-end reasoning" by providing "a clear, concrete purpose for reasoning" (p. 7). Once an agent has formed a plan to attend a meeting at 4:00, "she should reason about how to get there by 4:00" rather than reconsidering all possible actions from scratch.

2. **Filtering incompatible options**: Plans "provide constraints on what options need be seriously considered" (p. 7). The agent "need not consider options incompatible with her getting there by 4:00" because consistency with existing plans eliminates vast portions of the option space without explicit deliberation.

3. **Grounding further reasoning**: Plans "influence the beliefs on which further practical reasoning will be based" (p. 7). The agent "can typically ground her further reasoning on the assumption that she will indeed attend the meeting at 4:00."

## Why This Matters for Agent Systems

For multi-agent orchestration systems like WinDAGs, this architectural insight has profound implications:

**Decomposition**: When a WinDAG agent receives a complex task, the act of forming even a partial plan (deciding on high-level approach) immediately constrains what skills need to be considered next. The partial plan doesn't solve the problem, but it transforms an intractable "consider everything" problem into a focused "how do I accomplish X?" problem.

**Coordination**: When multiple agents operate, each agent's plans serve as commitment signals that other agents can rely on for their own planning. If Agent A has committed to producing data in format X by time T, Agent B can plan around this assumption without constantly checking whether A has changed its mind. The stability of plans enables distributed reasoning without constant synchronization.

**Skill Selection**: The 180+ skills in WinDAGs represent an overwhelming option space. If every decision point required evaluating all skills, the system would spend more time in meta-reasoning than actual work. Plans filter this: once you've committed to "refactor this Python module," you're looking at code analysis and transformation skills, not network security audits.

## The Consistency Requirement

The filtering function depends critically on a consistency requirement: "an agent's plans should be consistent, both internally and with her beliefs. Roughly speaking, it should be possible for her plans, taken together, to be executed successfully in a world in which her beliefs are true" (p. 8).

This isn't just logical consistency. It's about practical compatibility: "A plan to spend all of one's cash at lunch is inconsistent with a plan to buy a book that includes an intention to pay for it with cash, but is not necessarily inconsistent with a partial plan merely to purchase a book, since the book may be paid for with a credit card" (p. 11).

For agent systems, this means:

- **Resource Accounting**: Plans implicitly or explicitly allocate resources (time, memory, API calls, budget). New options must be checked against these allocations. A plan to "analyze all files in repository" is inconsistent with a plan to "complete in 5 seconds" if the repository has 10,000 files.

- **Temporal Constraints**: Actions have duration and dependencies. A compatibility filter based on "spatio-temporal separation between options" (p. 13) can efficiently rule out options that overlap inappropriately without deep semantic reasoning.

- **State Assumptions**: Plans implicitly assume certain world states will hold. A plan to "read configuration file X" is incompatible with a plan to "delete all temporary files" if X is a temporary file, but detecting this requires understanding the relationship between actions and state changes.

## Structural Partiality: Deciding Ends Before Means

A crucial implication of the constraint-based view is that **plans should be structurally partial**: "Agents frequently decide upon ends, leaving open for later deliberation questions about means to those ends" (p. 10).

This might seem like procrastination, but it's rational resource management. The authors explain: "In addition to bounded computational resources, agents have bounded knowledge. They are neither prescient nor omniscient: the world may change around them in ways they are not in a position to anticipate. Hence highly detailed plans about the far future will often be of little use, the details not worth bothering about" (p. 9).

For WinDAGs: An orchestration system receives a request to "implement OAuth authentication." A rational response is:
1. **Immediate commitment**: "I will implement OAuth authentication"
2. **Partial decomposition**: "I need to (a) choose OAuth provider, (b) implement token exchange, (c) add middleware"
3. **Deferred details**: Specific library choices, error handling strategies, and test approaches remain unspecified

Why defer? Because:
- The OAuth provider choice might depend on requirements discovered during initial investigation
- Available libraries might have changed by the time implementation begins
- The testing approach depends on what fails during development

Committing too early to these details wastes effort and reduces flexibility. The partial plan provides enough structure to begin work (focused on OAuth, not other auth methods) while preserving adaptability.

## Means-End Coherence as a Forcing Function

Partial plans must eventually be "filled in with subplans that are at least as extensive as the agent believes necessary to execute the plan successfully" (p. 11). This requirement for **means-end coherence** transforms plans from mere commitments into active drivers of reasoning.

"Once the agent has decided to read a certain book today, a means-end problem is posed: how will she get the book? Will she go to the library to borrow a copy of it, or will she stop by the bookstore and purchase one? Once she has formed an intention to read the book, her reasoning can focus on deciding how to do so, rather than on assessing all the options that are currently available" (p. 11).

This is profound: **commitment creates focus**. The partial plan doesn't tell you what to do next, but it tells you what question to answer next. For an orchestration system:

- Without commitment: "I have 180+ skills available. What should I do?" (intractable)
- With partial plan "Refactor module X": "Which refactoring approach achieves my goals?" (tractable subset)

The means-end coherence requirement also provides a **timing signal**: "Means-end reasoning may occur at any time up to the point at which a plan is in danger of becoming means-end incoherent; at that point it must occur" (p. 12). A plan to "submit pull request by EOD" becomes means-end incoherent at 3pm if no code has been written yet. This incoherence triggers focused deliberation: what's the minimal viable path to coherence?

## Implementation Implications

The architecture requires specific mechanisms:

1. **Compatibility Filter**: A computationally efficient process that checks new options against existing plans. "It is essential that the filtering process be computationally efficient relative to deliberation itself" (p. 13). This might use:
   - Temporal constraint propagation (polynomial-time interval algorithms)
   - Resource accounting (simple arithmetic comparisons)
   - Type-based filtering (option category doesn't match plan context)

2. **Means-End Coherence Detector**: A monitor that identifies when partial plans are "in danger of becoming means-end incoherent" (p. 12), triggering focused deliberation. This requires:
   - Time-to-deadline tracking
   - Precondition checking (do I have what I need to proceed?)
   - Progress monitoring (am I on track?)

3. **Plan Library**: "The plan library might be seen as a subset of the agent's beliefs: specifically, her beliefs about what actions would be useful for achieving which effects under specified conditions" (p. 6). This is essentially a skill catalog — but indexed by goals and preconditions, not just capability names.

## The Deeper Insight

The reason this architecture works is that **plans trade optimality for tractability**. An agent with unlimited time could theoretically evaluate all options at every moment and always choose the best. But this agent would never act — it would be stuck in perpetual deliberation.

By committing to plans that constrain future reasoning, the agent accepts that it might miss better options that arise later. But this cost is more than offset by:
- Reduced deliberation time (fewer options considered)
- Faster action (decisions already partially made)
- Cognitive coherence (multiple decisions coordinated through shared plan)

As the authors note: "Other things being equal, an agent's plans should be consistent, both internally and with her beliefs" (p. 8). That "other things being equal" is crucial — when things aren't equal (major unexpected changes), plans can be revised. But the default is stability, because stability is what enables the computational savings that make bounded rationality possible.

For WinDAGs and similar systems, the lesson is clear: **don't architect agents as optimization engines that continuously re-evaluate everything. Architect them as commitment-forming systems that use plans to bound their reasoning and create tractable subproblems.** The partial plan isn't a limitation to be overcome; it's the mechanism that makes intelligent action possible under resource bounds.