## BOOK IDENTITY

**Title**: Plans and Resource-Bounded Practical Reasoning

**Author**: Michael E. Bratman, David J. Israel, Martha E. Pollack

**Core Question**: How can resource-bounded agents make rational decisions and act effectively when deliberation itself takes time and the world changes during reasoning?

**Irreplaceable Contribution**: This paper provides the foundational architecture for understanding how partial plans serve as *computational constraints* on reasoning, not just outputs of it. Unlike decision theory (which assumes completed alternatives) or traditional AI planning (which assumes a frozen world during computation), this work recognizes that **the primary function of plans is to limit the scope of future deliberation**. The insight that plans must be "reasonably stable" yet "revisable" — and that this tension is mediated by explicit filter override mechanisms — is unique. No other work so clearly articulates how commitment to plans is fundamentally a resource management strategy for bounded agents.

## KEY IDEAS (3-5 sentences each)

1. **Plans as Deliberation Constraints**: Plans don't just produce action; they constrain future practical reasoning by (a) driving means-end analysis toward concrete purposes, (b) filtering out incompatible options to narrow deliberation scope, and (c) providing assumptions for further reasoning. This dual role — as both output of reasoning and input that limits further reasoning — is what makes plans essential for resource-bounded agents who cannot constantly reconsider everything.

2. **Structural Partiality as a Feature, Not a Bug**: Plans should be structurally partial (deciding ends while leaving means open) because agents have bounded knowledge and the world changes unpredictably. Acting on partial plans allows commitment to high-level goals while deferring low-level details until more information is available. This contrasts sharply with traditional hierarchical planners that use partial plans only as intermediate representations, not as bases for action.

3. **The Stability-Revisability Tension**: Plans must be stable enough to actually constrain deliberation (otherwise they provide no computational savings), yet revisable enough to respond to unexpected changes (otherwise agents become brittle). This tension cannot be eliminated but must be *managed* through filter override mechanisms that encode when reconsideration is worthwhile. The architecture explicitly represents this tradeoff rather than pretending it can be solved.

4. **Filter Override as Meta-Reasoning**: The filter override mechanism embodies the agent's sensitivity to problems and opportunities — the conditions under which incompatible options should trigger reconsideration of existing plans. This mechanism must be carefully calibrated: overly cautious agents waste time deliberating about insignificant changes; overly bold agents miss important opportunities. The paper shows that even well-designed agents will sometimes deliberate when they shouldn't (Situations 2b, 3) and fail to deliberate when they should (Situation 4a) — this is unavoidable, not a design flaw.

5. **Means-End Coherence as a Forcing Function**: Once an agent commits to a (partial) plan, the demand for means-end coherence creates well-defined subproblems for further reasoning. Rather than facing the entire space of possible actions, the agent now faces the specific question: "How will I achieve this committed end?" This transforms open-ended deliberation into focused problem-solving, making practical reasoning tractable.

## REFERENCE DOCUMENTS

### FILE: plans-as-computational-constraints.md

```markdown
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

```

### FILE: filter-override-mechanisms.md

```markdown
# Filter Override Mechanisms: Managing the Stability-Revisability Tension

## The Core Dilemma

The paper confronts a fundamental tension in resource-bounded agency: "There thus exists a tension between the stability that plans must exhibit to play their role in focusing practical reasoning and the revocability that must also be inherent in them, given that they are formed on the basis of incomplete information about the future" (p. 15).

This tension cannot be eliminated. It can only be managed. And the management mechanism is what the authors call the "filter override mechanism."

## Why Stability Is Non-Negotiable

Plans only provide computational leverage if they're stable: "If an agent constantly reconsiders her plans, they will not limit her deliberation in the way they need to for a resource-bounded agent" (p. 8). 

Consider a WinDAG agent tasked with "add logging to all API endpoints." If the agent:
- 9:00 AM: Commits to using library L1
- 9:05 AM: Reconsiders, switches to library L2
- 9:10 AM: Reconsiders again, switches to L3
- 9:15 AM: Reconsiders...

The agent spends all its time deliberating about logging frameworks and never actually implements logging. The plan's purpose — to bound deliberation and enable action — has been defeated.

Yet plans cannot be irrevocable either. The agent might discover at 9:05 that L1 has a critical security vulnerability, or that the codebase already uses L2 extensively, making L1 integration far more expensive than anticipated. Refusing to reconsider would be irrational rigidity.

## The Filter Override Architecture

The paper's solution introduces two parallel processes within the filtering component:

1. **Compatibility Filter**: Efficiently checks whether new options are consistent with existing plans. Incompatible options are normally blocked.

2. **Filter Override Mechanism**: "encodes the agent's sensitivities to problems and opportunities in her environment—that is, the conditions under which some portion of her existing plans is to be suspended and weighed against some other option" (p. 15).

The interaction is carefully specified:
- Options that pass the compatibility filter → go to deliberation
- Options that fail compatibility but trigger override → go to deliberation (with the conflicting plan also reconsidered)
- Options that fail compatibility and don't trigger override → blocked, no deliberation

This architecture makes explicit what is usually implicit: **not every incompatibility should trigger reconsideration**. The filtering process is doing real computational work by deciding what deserves the expensive operation of deliberation.

## The Six Situations: A Taxonomy of Outcomes

The paper provides a remarkable taxonomy of what can happen when a new option is proposed. This isn't abstract theory — it's a systematic analysis of the decision points in practical reasoning.

### Situation 1: Cautious and Pays

"Rosie arrives and discovers that the problem with the video display is caused by the contrast on the terminal being turned off... Rosie's deliberation leads her to change her plan: she drops her intention to replace the CRT, and instead forms an intention to fix the malfunction by adjusting the contrast. Not only is this new option superior to the CRT-replacement, but it is sufficiently superior to outweigh the costs of reconsideration" (p. 17).

**Analysis**: The override fired correctly. Deliberation cost < benefit of new option.
**For agent systems**: These are the cases your override mechanism exists to catch. A code review agent discovers the "bug" is actually a feature flag being off. Reconsideration cost: 30 seconds. Benefit: hours saved not debugging functional code.

### Situation 2b: Cautious and Doesn't Pay

"Rosie discovers that the existing CRT is repairable... Her deliberation results in a decision to repair rather than replace. And, indeed, repairing is a slightly better option. However, instead of deliberating, Rosie could have simply gone ahead with her intention to replace the CRT, and proceeded more quickly to her next task. Given this cost of her deliberation, her caution doesn't pay in this case" (p. 17).

**Analysis**: Override fired, but shouldn't have. Deliberation cost > benefit of new option.
**For agent systems**: A refactoring agent stops to consider a marginally better variable naming scheme. The deliberation takes 5 minutes, the naming improvement saves 30 seconds of future confusion. The override was too sensitive.

### Situation 3: Cautious and Doesn't Pay (No Change)

"Replacing the CRT is the superior option... Hence, when Rosie reconsiders, she decides not to change her prior intention, but instead to go ahead and replace the CRT. Here again Rosie is cautious, and her caution doesn't pay" (p. 18).

**Analysis**: Override fired, deliberation occurred, original plan confirmed. Pure computational waste.
**For agent systems**: A test generation agent reconsiders its testing strategy because a new edge case appears. After analysis, original strategy is still best. Time spent deliberating could have been spent writing tests.

### Situation 4: Bold and Pays

"Despite this new information, Rosie does not reconsider her prior plan to replace the CRT. And, in fact, even had she reconsidered, she would have stuck with her prior plan, since the type of CRT she brought with her is superior. Rosie has been bold, and her boldness has paid off" (p. 18).

**Analysis**: Override didn't fire. Original plan was best. No wasted deliberation.
**For agent systems**: The ideal case. An optimization agent sticks with its chosen algorithm despite hearing about a new approach, and the original choice is validated. Commitment enabled progress.

### Situation 4a: Bold and Doesn't Pay (Would Have Been Worth It)

"Had Rosie reconsidered, she would have found the new CRT to be slightly superior... the deliberation is relatively easy and does not interfere in any serious way with Rosie's other activities. In this case, then, Rosie's boldness doesn't pay" (p. 18).

**Analysis**: Override didn't fire, but should have. A better option was missed and checking would have been cheap.
**For agent systems**: A deployment agent misses that a configuration option changed, leading to suboptimal performance. Checking would have been fast, benefit would have been real.

### Situation 4b: Bold and Doesn't Pay (But Would Have Cost More)

"The deliberation would have precluded important activities of Rosie's, in which case, despite the slight superiority of the new CRT, Rosie's boldness pays" (p. 18).

**Analysis**: Override didn't fire, a better option exists, but checking would have been too expensive.
**For agent systems**: An agent misses a 5% optimization opportunity, but investigating it would have taken 2 hours. The agent correctly prioritized shipping over perfection.

## The Critical Insight About Suboptimality

Situation 4b reveals something profound: "In both cases, the agent performs an action that is inferior to a known alternative... So in both cases there is a kind of suboptimality. However, Situation 4b differs from Situation 4a in the following respect: in 4b, the combination of deliberation and the change of intention, taken together, is inferior to simply going ahead with the original intention. So it is no criticism of a well-designed agent that she ends up in Situation 4b" (p. 19).

This demolishes the naive notion that agents should always choose the best option. Sometimes **choosing the best option costs more than the benefit gained**. A well-designed agent must be comfortable with bounded suboptimality when the cost of achieving optimality exceeds the benefit.

For multi-agent orchestration:
- Don't architect systems that assume perfect information
- Don't architect systems that continuously re-optimize
- Don't architect systems that treat any suboptimality as failure

Instead: architect systems that manage the deliberation-action tradeoff explicitly, understanding that sometimes "good enough plus fast" beats "optimal plus slow."

## Calibration: The Irreducible Design Challenge

"A filter override mechanism must be carefully designed to embody the right degree of sensitivity to the problems and opportunities that arise in her environment. If the agent is overly sensitive, willing to reconsider her plans in response to every unanticipated event, then her plans will not serve sufficiently to limit the number of options about which she must deliberate. On the other hand, if the agent is not sensitive enough, she will fail to react to significant deviations from her expectations" (p. 16).

The paper then shows that this calibration faces fundamental tradeoffs:

**The Caution-Boldness Tradeoff**: "As we try to avoid caution that doesn't pay, we run an increased risk of boldness that doesn't pay. And, of course, the opposite is true as well: as we try to avoid boldness that doesn't pay, we run an increased risk of undesirable cautiousness" (p. 20).

**Example: The Expensive CRT Strategy**: "Suppose that CRTs are very expensive, and Rosie knows this. It might be a good strategy for her to reconsider an intention to replace a CRT when an alternative means is proposed. After all, such reconsideration will, on many occasions, save the cost of a new CRT. Of course, there may also be times when this strategy lands Rosie in situations of type 2b or 3, in which her caution doesn't pay... Nonetheless, this strategy might, on balance, be a good one" (p. 19).

This is sophisticated: the override mechanism is evaluated statistically over many decisions, not per-decision. A good override strategy accepts that it will sometimes trigger unnecessarily (Situations 2b, 3) because the alternative — being too bold — would miss too many important reconsiderations (Situation 4a).

## Implementation Strategies

The paper suggests concrete approaches for implementing filter override mechanisms:

### 1. Domain-Specific Sensitivity Rules

"The filter override mechanism encodes the agent's sensitivities to problems and opportunities" (p. 15). These could be:

- **Cost thresholds**: Reconsider if new option saves > X resources
- **Risk thresholds**: Reconsider if current plan has > Y failure probability
- **Priority thresholds**: Reconsider if new option addresses higher-priority goal

For WinDAGs: Override rules might include:
```
IF new_option.security_impact = CRITICAL THEN override
IF new_option.cost_saving > 50% THEN override  
IF current_plan.deadline_risk = HIGH AND new_option.reduces_risk THEN override
IF new_option.type = MINOR_OPTIMIZATION THEN don't_override
```

### 2. Learning from Experience

"One might ultimately want the filter override mechanism to be capable of being altered by the agent herself: if she realizes that she is spending too much time in fruitless deliberation, she should raise the sensitivity thresholds in the override mechanism; and, if she notices too many missed opportunities, she should lower the thresholds" (p. 19, footnote 10).

This suggests meta-reasoning: the agent monitors its own decision-making patterns and adjusts override sensitivity based on observed outcomes. An agent that notices pattern of Situation 2b/3 outcomes should become more bold. An agent hitting Situation 4a repeatedly should become more cautious.

### 3. Context-Dependent Calibration

The CRT example shows that good override strategies are domain-sensitive. The right sensitivity depends on:
- Resource costs in the domain (CRTs are expensive → be cautious about replacements)
- Similarity between options (CRTs are similar → be bold about alternatives)
- Time pressure (deadline approaching → be bold to avoid deliberation delays)
- Criticality (safety-critical system → be cautious about any changes)

For agent systems: override mechanisms should not be one-size-fits-all. A code review agent might be:
- Cautious about security changes (high cost of errors)
- Bold about style changes (low cost of suboptimality)
- Moderate about refactoring (depends on code criticality)

## The Deeper Architecture Lesson

The filter override mechanism makes explicit something usually hidden: **rational agency requires explicit policies about when to be rational**.

This sounds paradoxical, but it's not. Full rationality (deliberate about everything) is computationally intractable. Bounded rationality requires deciding when to deliberate and when to act on existing commitments. The filter override mechanism is that decision procedure.

For multi-agent systems:
- Don't just build deliberation mechanisms (most systems do this)
- Don't just build commitment mechanisms (planning systems do this)
- Build override mechanisms that mediate between them (almost no systems do this explicitly)

The override mechanism is where the resource-boundedness of the agent is most directly confronted. It's the mechanism that says: "Yes, there might be better options. No, I'm not going to look for them. Here's why."

## Failure Modes and Their Diagnostics

The taxonomy provides diagnostic categories for agent failures:

**If agent is slow/ineffective**: 
- Check if too many Situation 2b/3 outcomes (overly cautious, wasting time in reconsideration)
- Consider raising override thresholds or tightening override conditions

**If agent is missing opportunities/making poor choices**:
- Check if too many Situation 4a outcomes (overly bold, missing improvements)
- Consider lowering override thresholds or broadening override conditions

**If agent is unstable/thrashing**:
- Likely problem with plan stability (overrides firing too frequently)
- Plans aren't providing the filtering function they should

The brilliance of this framework is that it turns "the agent isn't working well" into actionable diagnostic categories with specific architectural interventions.

```

### FILE: structural-partiality-and-hierarchical-commitment.md

```markdown
# Structural Partiality and Hierarchical Commitment: How Decomposition Enables Bounded Reasoning

## The Case for Partial Plans

Traditional AI planning systems used partial plans "only as intermediate representations in the plan formation process" (p. 10, footnote 6). The goal was always to produce a complete, detailed plan before execution began. But Bratman, Israel, and Pollack argue that **acting on the basis of partial plans** is not a limitation — it's a rational strategy for resource-bounded agents.

The argument rests on two observations about bounded agents:

1. **Bounded Knowledge**: "Agents have bounded knowledge. They are neither prescient nor omniscient: the world may change around them in ways they are not in a position to anticipate. Hence highly detailed plans about the far future will often be of little use, the details not worth bothering about" (p. 9).

2. **Bounded Computation**: Constructing detailed plans takes time. "It is recognized that the construction of plans takes time" (p. 4), and that time could be spent on more productive activities — like actually executing the plan or working on other tasks.

The combination creates a compelling argument: if you don't know what the future holds, and it's expensive to plan for every contingency, then **defer detailed planning until you have better information and more pressing need**.

## Two Types of Partiality

The paper distinguishes two forms of partiality:

### Temporal Partiality

"Plans may be temporally partial, accounting for some periods of time and not for others. An agent may plan to give a lecture from 10 o'clock until noon, to pick up a book at the bookstore on the way back from the lecture, to attend a meeting from 2:00 to 3:30, and to pick up her child at school at 5:00; she may not yet have decided what to do between 3:30 and the time she leaves for her child's school" (p. 10).

This is straightforward: I know what I'm doing from 10-12, 2-3:30, and at 5:00. The gap from 3:30-5:00 is unplanned. Maybe I'll prepare for tomorrow's meeting, maybe I'll return email, maybe an opportunity will arise. Planning now would be premature.

### Structural Partiality

"More important for our purposes is the potential for structural partiality in plans. Agents frequently decide upon ends, leaving open for later deliberation questions about means to those ends" (p. 10).

This is more subtle and more powerful. **I commit to a goal before I know how to achieve it**. I decide "I will get that book today" before deciding whether to buy it or borrow it, before deciding which bookstore or which library, before deciding how to get there.

The plan is partial not because it has temporal gaps, but because it's **hierarchically incomplete**. The high-level structure is fixed ("get book today") while low-level details remain unspecified.

## Why Structural Partiality Matters for Agent Systems

Consider a WinDAG agent receiving: "Implement user authentication for the web application."

A **complete plan** would specify:
- Which authentication scheme (OAuth, JWT, session-based)
- Which OAuth provider (Google, GitHub, Auth0)
- Which libraries (passport.js, next-auth, custom)
- Database schema for user records
- Middleware placement in the application
- Error handling strategy
- Test coverage approach
- Documentation updates needed

Planning all of this upfront has severe problems:

1. **Many decisions depend on information not yet available**: The best OAuth provider depends on what's already in package.json. The database schema depends on existing user table structure. The testing approach depends on what breaks during implementation.

2. **The world changes during planning**: By the time you've researched all OAuth providers, a new one may have launched or an existing one may have deprecated an API.

3. **Detailed plans are fragile**: A complete plan assumes specific preconditions. If any assumption is violated (library doesn't work as documented, existing code has unexpected constraints), the entire plan must be reconsidered.

4. **Planning is expensive**: Researching all these decisions takes hours. Many of those decisions won't matter (maybe the OAuth provider choice is essentially arbitrary for this use case).

A **structurally partial plan** might be:
```
1. Implement user authentication [COMMITTED]
   1.1. Choose authentication approach [DEFERRED]
   1.2. Implement chosen approach [DEFERRED]
   1.3. Add tests [DEFERRED]
```

Or perhaps one level deeper:
```
1. Implement user authentication [COMMITTED]
   1.1. Use OAuth [COMMITTED]
   1.2. Choose OAuth provider [DEFERRED]
   1.3. Implement OAuth flow [DEFERRED]
   1.4. Add tests [DEFERRED]
```

The commitment to "OAuth" rules out session-based auth and JWT, dramatically narrowing the option space for future decisions. But the specific provider remains open, because that decision benefits from information gathered during implementation setup.

## The Consistency Constraint and Structural Partiality

Recall the earlier example: "A plan to spend all of one's cash at lunch is inconsistent with a plan to buy a book that includes an intention to pay for it with cash, but is not necessarily inconsistent with a partial plan merely to purchase a book, since the book may be paid for with a credit card" (p. 11).

This reveals a crucial interaction: **the more partial a plan, the more compatible it is with other plans**. 

- Highly specific plan ("buy book with cash") → many potential conflicts
- Partial plan ("buy book") → fewer conflicts, because payment method left open

For agent systems, this suggests a strategy: **commit to structure before committing to details**. 

If Agent A commits to "produce report" without specifying format, Agent B can commit to "consume report" without conflict, because they can coordinate on format later. If Agent A prematurely commits to "produce report in XML", and Agent B commits to "consume JSON report", you have conflicts that could have been avoided.

The partiality of plans is not just about deferring work — it's about **maximizing compatibility and minimizing premature constraints** that limit future flexibility.

## Means-End Coherence as Progressive Refinement

While plans can be partial, they cannot be arbitrarily partial forever. The demand for means-end coherence creates a forcing function: "as time goes by, they must be filled in with subplans that are at least as extensive as the agent believes necessary to execute the plan successfully" (p. 11).

The trigger is temporal: "Means-end reasoning may occur at any time up to the point at which a plan is in danger of becoming means-end incoherent; at that point it must occur" (p. 12).

This creates a natural rhythm for hierarchical decomposition:

**Phase 1: High-Level Commitment**
- Agent receives goal: "Implement authentication"
- Forms partial plan: [Implement authentication] → triggers compatibility check against existing plans
- If compatible, moves to execution phase

**Phase 2: Progressive Refinement**
- Time passes. Deadline approaches or precondition checked.
- Detector: "Plan to implement authentication is means-end incoherent without approach"
- Triggers means-end reasoning: What authentication approaches are available?
- Result: Refined plan [Implement authentication → Use OAuth] 

**Phase 3: Continued Refinement**
- More time passes. Implementation phase begins.
- Detector: "Plan to use OAuth is means-end incoherent without provider"
- Triggers means-end reasoning: Which OAuth provider?
- Result: [Implement authentication → Use OAuth → Use GitHub OAuth]

**Phase 4: Execution**
- Concrete actions now specified enough to execute
- Implementation proceeds with fully specified subplan

Each refinement step:
1. Is triggered by approaching means-end incoherence (temporal pressure)
2. Operates on a narrowed option space (previous commitments filter)
3. Produces a more specific but still potentially partial plan
4. Preserves compatibility with commitments made by other agents

## The Information-Availability Argument

One of the paper's most important insights is buried in the discussion of bounded knowledge: **detailed planning is often premature because the information needed for good decisions isn't available yet**.

Consider the authentication example. Key information becomes available progressively:

- **After inspecting package.json**: "Oh, we already use Google APIs extensively" → GitHub OAuth is more compatible
- **After attempting first OAuth integration**: "This library doesn't handle token refresh well" → different library needed
- **After implementing basic flow**: "Our frontend architecture doesn't support the redirect flow we planned" → need to adjust approach

Each piece of information was *unknowable* before beginning execution. You can't determine library quality by reading docs — you must attempt integration. You can't identify frontend architecture constraints without examining the codebase.

This means **planning is not just expensive; premature detailed planning is often wasteful** because it makes decisions with poor information that must be revisited later.

The structurally partial plan sidesteps this: it defers decisions until information is available to make them well. It's not procrastination — it's rational information-gathering.

## Implementation for Agent Orchestration

For a system like WinDAGs, this suggests an architecture where:

### 1. Plans Are Explicitly Hierarchical

Each plan node has:
- Commitment status: [COMMITTED | DEFERRED | COMPLETED]
- Abstraction level: [GOAL | APPROACH | METHOD | ACTION]
- Children: More specific subplans (possibly empty if DEFERRED)
- Preconditions: What must be true to refine this node
- Deadline: When means-end coherence becomes threatened

Example:
```
Plan Node: "Implement authentication"
  Status: COMMITTED
  Level: GOAL
  Children: [DEFERRED]
  Preconditions: { None }
  Deadline: 2 hours from now
  
  [Time passes, deadline approaches]
  
Plan Node: "Implement authentication"  
  Status: COMMITTED
  Level: GOAL
  Children: [
    Node: "Use OAuth"
      Status: COMMITTED
      Level: APPROACH
      Children: [DEFERRED]
      Preconditions: { package.json inspected }
      Deadline: 1.5 hours from now
  ]
```

### 2. Means-End Reasoning Is Triggered, Not Continuous

Rather than constantly elaborating plans, the system:

- Monitors plans for means-end coherence threats
- When deadline approaches or precondition met, triggers means-end reasoning
- Means-end reasoning operates on the partial plan, proposing refinements
- Refinements are filtered for compatibility with other plans
- Surviving refinements go to deliberation

This is **event-driven decomposition**, not depth-first expansion. Plans are refined just-in-time, not speculatively.

### 3. Compatibility Checking Respects Partiality

When Agent A has partial plan "implement authentication" and Agent B proposes "modify user database schema", compatibility checking must handle the partiality:

- **Definitely compatible**: If authentication plan specifies "no database changes" → clear conflict
- **Definitely incompatible**: If schema changes break existing auth code → clear conflict  
- **Uncertain**: If authentication plan is partial and might or might not need schema changes → ???

The paper's consistency requirement suggests: **treat partial plans conservatively for compatibility**. If Agent A's plan *might* need schema changes, and Agent B wants to modify schema, this is a potential conflict requiring coordination or deliberation, even if the plans might ultimately be compatible.

Better to coordinate early (when plans are partial and flexible) than discover conflicts late (when plans are detailed and committed).

### 4. Skill Selection Is Hierarchical

The 180+ skills in WinDAGs naturally form a hierarchy:
- High-level: "implement feature", "refactor module", "debug issue"
- Mid-level: "add authentication", "optimize database queries", "trace error source"
- Low-level: "generate OAuth code", "add database index", "inspect stack trace"

Early in plan execution, high-level skills are selected to form partial plans. As plans refine, more specific skills become relevant. The structural partiality of plans naturally mirrors the hierarchical structure of skills.

## Failure Modes of Insufficient Partiality

What happens if plans are too detailed too early?

**Brittleness**: Complete plans depend on many assumptions. When any assumption is violated, the entire plan must be reconsidered. A partial plan is more robust because fewer commitments mean fewer potential violations.

**Wasted Effort**: Detailed planning for situations that never arise. You spend an hour choosing between OAuth providers, then discover the existing codebase already has OAuth code that just needs to be configured.

**Thrashing**: Detailed plans made with poor information are frequently wrong, leading to constant replanning. This is exactly what the paper warns against with "overly cautious" override mechanisms (Situations 2b and 3) — too much deliberation, not enough action.

**Coordination Failures**: If Agent A commits to detailed plans prematurely, Agent B must work around those details rather than coordinating on approach. Early detailed commitment reduces collaborative flexibility.

## The Deeper Principle: Commitment as a Spectrum

The paper reveals that commitment isn't binary. Between "no commitment" and "fully specified plan" lies a spectrum of structural partiality:

- No commitment: "I might work on authentication"
- Goal commitment: "I will work on authentication" 
- Approach commitment: "I will work on authentication using OAuth"
- Method commitment: "I will implement GitHub OAuth using next-auth library"
- Action commitment: "I will add next-auth to package.json with version 4.22.0"

Each level of commitment:
- Narrows future option space more than the previous level
- Provides more constraint for compatibility checking
- Requires more information to commit rationally
- Is harder to revise without wasted effort

Rational decomposition involves moving down this spectrum at the right pace — fast enough to make progress, slow enough to gather information, careful enough to preserve flexibility.

For agent systems: **make decomposition decisions explicit**. Don't just have "task queue." Have hierarchically structured partial plans where commitment level and refinement status are first-class concepts. This makes the system's reasoning transparent and debuggable in ways that flat task lists cannot provide.

```

### FILE: deliberation-as-expensive-operation.md

```markdown
# Deliberation as Expensive Operation: The Central Resource Management Challenge

## The Cost That Changes Everything

Most theories of rational agency treat deliberation as free. Decision theory assumes you can compute expected utilities. Planning assumes you can search option spaces. But Bratman, Israel, and Pollack insist on a fact that changes everything: **deliberation takes time**.

"For real agents it takes time to do such computations—and the more complicated they are, the more time it takes. This is a problem because the more time spent on deliberation, the more chance there is that the world will change in important ways—ways that will undermine the very assumptions on which the deliberation is proceeding" (p. 3).

This isn't a minor implementation detail. It's the central challenge that the entire architecture is designed to address. If deliberation were free, agents could continuously recompute optimal actions. The world would never change faster than the agent could react. But deliberation is expensive — and this fact drives the entire theory of plans, filtering, and override mechanisms.

## Three Costs of Deliberation

The paper identifies multiple ways deliberation is expensive:

### 1. Direct Time Cost

"The more time spent on deliberation, the more chance there is that the world will change" (p. 3). While you're deciding which authentication approach to use, your teammate has already implemented a conflicting approach. While you're choosing between libraries, the deadline has passed.

For agent systems: every moment spent in deliberation is a moment not spent executing. In a system with 180+ skills, uncontrolled deliberation about which skill to use next could consume more time than executing the skill.

### 2. Opportunity Cost

The Rosie examples make this explicit. In Situation 2b, "instead of deliberating, Rosie could have simply gone ahead with her intention to replace the CRT, and proceeded more quickly to her next task" (p. 17).

The cost isn't just the deliberation time itself — it's what else could have been accomplished in that time. If deliberation takes 10 minutes to save 5 minutes on the current task, but the next task is time-critical, the deliberation has negative value.

For agent systems: this suggests that deliberation costs must be evaluated in context. The same deliberation might be worthwhile during low-priority maintenance work but unacceptable when approaching a deadline.

### 3. Assumption Invalidation

"The world may change in important ways—ways that will undermine the very assumptions on which the deliberation is proceeding" (p. 3). This is more subtle: deliberation doesn't just consume time; it becomes invalid if it takes too long.

You begin deliberating about how to optimize database query Q. While you deliberate, the database schema changes. Your deliberation is now based on false assumptions. Not only have you wasted time deliberating, but the conclusions are wrong.

For agent systems: long deliberations are risky even if you "have time" because the world model they're based on may decay during the deliberation itself.

## Implications for Agent Architecture

If deliberation is expensive, then **the primary architectural challenge is deciding when to deliberate and when to act on existing commitments**. This is exactly what the plan-filter-override architecture addresses:

### Plans Reduce Deliberation Frequency

"A major role of the agent's plans is to constrain the amount of further practical reasoning she must perform" (p. 1, abstract).

Without plans: at each moment, the agent faces the question "what should I do?" and must deliberate over all possibilities.

With plans: most of the time, the agent faces the question "what does my plan say to do next?" and can act without deliberation.

The computational savings are dramatic. Consider a WinDAG agent with 180 skills. At each decision point:
- Without plans: evaluate all 180 skills against current situation (expensive)
- With partial plan "I'm implementing OAuth": evaluate skills relevant to OAuth implementation (~15 skills, much cheaper)
- With refined plan "I'm using GitHub OAuth with next-auth": execute next step (near-free)

The more refined the plan, the less deliberation needed. This is why means-end coherence drives progressive refinement — each refinement further reduces future deliberation cost.

### Filtering Prevents Deliberation

"The compatibility filter checks options to determine compatibility with the agent's existing plans. Options deemed compatible are surviving options. Surviving options are passed along to the deliberation process" (p. 13).

The filtering process has a critical property: it must be "computationally efficient relative to deliberation itself" (p. 13). The whole point of filtering is to avoid the expensive operation (deliberation) by using cheap checks (compatibility tests).

This is why the paper suggests specific filtering strategies:
- "Spatio-temporal separation between options" can be checked using "a polynomial-time constraint-propagation algorithm over intervals" (p. 13)
- Type-based filtering: does this option category even make sense given current plan?
- Resource accounting: simple arithmetic to check if option would violate resource constraints

All of these are *cheap relative to deliberation*. That's the selection criterion. If your compatibility filter is as expensive as deliberation, it's not doing its job.

### Override Mechanisms Make Deliberation Selective

The override mechanism answers: "Given that this option is incompatible with my current plan, is it worth deliberating about whether to change my plan?"

This is meta-reasoning about whether to engage in object-level reasoning. And the paper is explicit that even this meta-reasoning must be efficient: the override mechanism "encodes the agent's sensitivities" (p. 15) — it's not doing full cost-benefit analysis, it's checking against encoded rules.

Examples of efficient override checks:
- Cost saving > threshold (simple comparison)
- Risk level = CRITICAL (simple attribute check)
- Resource consumption > budget * safety_margin (simple arithmetic)

These checks are fast enough to run on every incompatible option without consuming significant resources.

## The Deliberation-Action Tradeoff

The taxonomy of six situations is really a taxonomy of how the deliberation-action tradeoff can play out:

| Situation | Deliberated? | Was Deliberation Worth It? |
|-----------|--------------|----------------------------|
| 1         | Yes          | Yes (changed plan, benefit > cost) |
| 2b        | Yes          | No (changed plan, benefit < cost) |
| 3         | Yes          | No (kept plan, pure waste) |
| 4         | No           | N/A (would have kept plan anyway) |
| 4a        | No           | Would have been worth it |
| 4b        | No           | Would not have been worth it |

The agent's performance depends on the *distribution* across these situations over many decisions. A well-designed agent:
- Maximizes situations 1 and 4 (correct decisions about when to deliberate)
- Minimizes situations 2b, 3, and 4a (errors about when to deliberate)
- Accepts some occurrence of situation 4b (missed optimizations that would have cost more to find)

This framing is crucial for agent system design because it provides **actionable metrics**. You can instrument an agent to track:
- How often it deliberates
- How often deliberation leads to plan changes
- How much benefit those changes provide
- How much the deliberation cost

Then adjust override mechanisms to improve the distribution.

## Anytime Deliberation and Commitment Points

The paper implies but doesn't explicitly develop the idea of "commitment points" — moments when deliberation must complete and action must begin.

For resource-bounded agents, deliberation must be **anytime** — capable of being interrupted and yielding whatever answer has been computed so far. Because:

1. **Deadlines are real**: The plan to "submit pull request by EOD" has a hard deadline. If deliberation about implementation approach continues until 4:59 PM, there's no time to actually implement.

2. **Better information arrives**: While deliberating about library choice, you discover the codebase already uses a particular library. Continuing deliberation is pointless.

3. **Opportunities expire**: While deliberating about which OAuth provider to use, your teammate implements Google OAuth. The deliberation is now moot.

This suggests agent systems need explicit commitment points:
- Time-based: "deliberate until time T, then commit to best option found so far"
- Information-based: "deliberate until condition C is known, then commit based on C"
- Progress-based: "deliberate until N options evaluated, then commit to best of N"

The partial plan structure naturally creates commitment points: when means-end coherence is threatened, deliberation must complete (or the plan must be abandoned).

## Metareasoning About Deliberation

The filter override mechanism is really a metareasoning system: reasoning about whether to engage in reasoning. The paper suggests this can itself be expensive: "if an agent constantly reconsiders her plans, they will not limit her deliberation in the way they need to" (p. 8).

But there's a hierarchy here:

**Level 0: Action**
- Cost: varies by action
- Benefit: makes progress toward goals

**Level 1: Object-level deliberation (choosing between actions)**  
- Cost: can be very high (search, optimization, evaluation)
- Benefit: better action choice

**Level 2: Meta-deliberation (deciding whether to deliberate)**
- Cost: must be low (simple rules and checks)
- Benefit: avoids unnecessary level-1 deliberation

**Level 3: Meta-meta-reasoning (adjusting meta-deliberation rules)**
- Cost: occasional, background process
- Benefit: improves level-2 decisions over time

The architecture places most of the computational budget at level 0 (action) and level 1 (deliberation when necessary). Level 2 (override mechanisms) must be *cheap* to avoid eating into that budget. Level 3 (learning better override rules) can happen asynchronously as a background optimization.

For agent systems, this means:
- Don't make meta-reasoning complex (defeats the purpose)
- Do make meta-reasoning tunable (so it can improve over time)
- Don't meta-reason about meta-reasoning in real-time (too expensive)
- Do collect data that allows offline analysis of metareasoning quality

## The Deeper Insight: Reasoning Itself Is an Action

Perhaps the deepest insight is that deliberation is not somehow "outside" the agent's action space. Deliberation is itself an action the agent performs — one that consumes resources (time, attention, memory) and produces outcomes (decisions, or sometimes, no decision if interrupted).

This means deliberation must be subject to the same rational constraints as other actions:
- Don't deliberate when the cost exceeds the benefit
- Don't deliberate when you lack the information to decide well
- Don't deliberate when time would be better spent gathering information through action
- Do deliberate when the stakes are high and good options are available

The BDI architecture makes this explicit by modeling the deliberation process itself as a component that can be invoked or not invoked. Deliberation isn't automatic — it's a choice, mediated by the filtering and override mechanisms.

For agent systems, this reframes the design question. Instead of "how do we make the agent deliberate well?", ask:

1. **When should the agent deliberate at all?** (filtering and override mechanisms)
2. **How much should it deliberate?** (commitment points and anytime algorithms)
3. **What should it deliberate about?** (means-end reasoning on partial plans)
4. **How should it learn to deliberate better?** (meta-level adjustments based on performance)

These questions admit concrete engineering answers. And the answers produce agents that, as the paper promises, are capable of "real-time behavior in certain restricted dynamic domains" (p. 4, footnote 2) — behavior that's impossible if deliberation is treated as a free operation.

```

### FILE: consistency-maintenance-as-coordination-mechanism.md

```markdown
# Consistency Maintenance as Coordination Mechanism: How Plans Enable Multi-Agent Coherence

## The Consistency Requirement

The paper states: "Other things being equal, an agent's plans should be consistent, both internally and with her beliefs. Roughly speaking, it should be possible for her plans, taken together, to be executed successfully in a world in which her beliefs are true" (p. 8).

This requirement sounds simple but has profound implications for how agents coordinate, especially in multi-agent environments. The consistency requirement is not just about logical coherence — it's a **coordination mechanism** that enables multiple agents (or multiple commitments within one agent) to work together without constant communication.

## What Consistency Really Means

The paper's definition is deliberately pragmatic: plans are consistent if they *could* be "executed successfully in a world in which her beliefs are true." This is weaker than logical consistency but stronger than mere non-contradiction.

Examples from the paper:

**Inconsistent**: "A plan to spend all of one's cash at lunch is inconsistent with a plan to buy a book that includes an intention to pay for it with cash" (p. 11).

Why inconsistent? Both plans cannot be executed successfully in the same world. If you spend all your cash at lunch, you cannot later pay for a book with cash. The plans are mutually exclusive.

**Potentially Consistent**: The same plan to spend all cash at lunch "is not necessarily inconsistent with a partial plan merely to purchase a book, since the book may be paid for with a credit card" (p. 11).

Why potentially consistent? The partial plan doesn't specify payment method, so execution could avoid the conflict. The plans are not mutually exclusive; there exists a refinement where both succeed.

This distinction is crucial: **consistency checking must account for partiality**. A plan that's inconsistent with a detailed plan might be consistent with the partial plan from which it was derived.

## Internal Consistency: Preventing Self-Interference

Even a single agent can have multiple commitments that must be internally consistent. The paper's example of temporal partiality illustrates this: "An agent may plan to give a lecture from 10 o'clock until noon, to pick up a book at the bookstore on the way back from the lecture, to attend a meeting from 2:00 to 3:30, and to pick up her child at school at 5:00" (p. 10).

These plans are consistent if:
- The lecture location and bookstore location make "on the way back" feasible
- Travel time from bookstore to meeting location fits before 2:00
- Travel time from meeting location to school fits before 5:00
- Each activity doesn't overrun into the next

This is "spatio-temporal" consistency (p. 13) — plans don't overlap in time/space in ways that make execution impossible.

For agent systems, internal consistency checking prevents:

**Resource Conflicts**: A plan to "process entire dataset" that assumes 16GB RAM is inconsistent with simultaneous plan to "run ML model" that needs 12GB RAM if only 16GB is available.

**Temporal Conflicts**: A plan to "complete code review" (estimated 2 hours) starting at 3 PM is inconsistent with a plan to "attend meeting at 4 PM" if the review can't be interrupted.

**State Conflicts**: A plan to "test feature X" is inconsistent with a concurrent plan to "refactor code containing feature X" if tests depend on current implementation.

The paper suggests these checks can be efficient: "one might define a measure of spatio-temporal separation between options and design the compatibility filter so that it rules out all and only those options that overlap inappropriately with already intended actions" using "a polynomial-time constraint-propagation algorithm over intervals" (p. 13).

## Consistency as Implicit Coordination

In multi-agent settings, consistency maintenance becomes a coordination mechanism. If Agent A's plan is consistent with Agent B's plan, they can execute concurrently without coordination. If plans are inconsistent, coordination is required.

**Example 1: File System Operations**

Agent A plans: "Refactor module X by moving functions to new file Y"
Agent B plans: "Analyze all Python files in directory"

Are these consistent?

- If Agent B's plan includes "analyze file Y", there's a potential conflict: Agent B might try to analyze Y before A creates it, or while A is writing it.
- Resolution requires either: (a) temporal ordering (B waits for A), (b) scope limitation (B analyzes only existing files), or (c) communication protocol (B handles missing files gracefully)

The consistency check surfaces this need for coordination.

**Example 2: Resource Allocation**

Agent A plans: "Use GPU for training"
Agent B plans: "Use GPU for inference"

If only one GPU available, plans are inconsistent. The consistency check forces:
- Explicit temporal coordination (A uses GPU 9-10 AM, B uses 10-11 AM)
- Resource allocation (A gets GPU 0, B gets GPU 1)
- Priority resolution (A has priority, B waits)

Without consistency checking, both agents might attempt GPU access simultaneously, leading to failures or degraded performance.

## The Compatibility Filter as Consistency Checker

The "compatibility filter" (p. 13) is essentially a consistency checker that runs when new options are proposed. It asks: "Would this new option be consistent with my existing plans?"

The paper emphasizes this must be efficient: "It is essential that the filtering process be computationally efficient relative to deliberation itself" (p. 13). This suggests a hierarchy of consistency checks:

### Fast Checks (Always Run)

- **Type compatibility**: Is this option category compatible with current plan category? (Check: refactoring vs. testing — potentially conflicting)
- **Resource disjointness**: Do options require mutually exclusive resources? (Check: both need exclusive file lock)
- **Temporal overlap**: Do options overlap in time? (Check: O(log n) interval tree lookup)

### Moderate Checks (Run When Fast Checks Pass)

- **Resource sufficiency**: Are there enough resources for both? (Check: sum of memory requirements < available memory)
- **Causal independence**: Do options affect each other's preconditions? (Check: does option A delete what option B reads?)
- **Goal compatibility**: Do options serve conflicting goals? (Check: option A optimizes for speed, option B optimizes for memory)

### Expensive Checks (Run Only When Necessary)

- **Detailed execution simulation**: Can both plans actually execute in same world?
- **Constraint satisfaction**: Is there any schedule satisfying all constraints?
- **Semantic analysis**: Do plans have subtle interactions requiring deep reasoning?

The architecture works because **most inconsistencies are caught by fast checks**. Only when fast checks are inconclusive do you need expensive analysis.

## Imperfect Filters and Their Consequences

The paper acknowledges that consistency checking cannot be perfect: "Such filters may be 'leaky', in that they sometimes let through options that are in fact incompatible, or they may be 'clogged', in that they sometimes block options that are in fact compatible" (p. 14).

This is pragmatically important:

**Leaky Filters (False Negatives)**: An incompatible option passes the filter and reaches deliberation. The agent might:
- Discover the incompatibility during deliberation (expensive but not catastrophic)
- Commit to the incompatible option and discover conflict during execution (more expensive, requires replanning)
- Never discover the incompatibility if execution somehow works anyway (lucky)

**Clogged Filters (False Positives)**: A compatible option is blocked by the filter. The agent:
- Misses a potentially good option (opportunity cost)
- Never knows the option was viable (invisible failure)

The tradeoff: make filters more precise (fewer errors) at the cost of more computation, or make filters more conservative (faster but blocks more) accepting more false positives.

For agent systems, this suggests:
- **Error in favor of false positives** when deliberation is expensive (better to block a compatible option than waste time deliberating about incompatible ones)
- **Error in favor of false negatives** when opportunities are rare (better to occasionally deliberate about incompatible options than miss rare compatible ones)
- **Tune based on observation** (track how often filter errors occur and adjust thresholds)

## Consistency and Structural Partiality

The interaction between consistency and partiality is subtle but important:

"A plan to spend all of one's cash at lunch is inconsistent with a plan to buy a book that includes an intention to pay for it with cash, but is not necessarily inconsistent with a partial plan merely to purchase a book" (p. 11).

This means: **the more partial a plan, the more compatible it is with other plans**, because partial plans have fewer commitments that could conflict.

For multi-agent coordination:

**High-Level Coordination**: Agents coordinate on goals and approaches (high-level partial plans) early, when flexibility is maximal and compatibility checking is easiest.

**Progressive Refinement**: As each agent refines its partial plans, it checks consistency with other agents' plans at corresponding levels of detail.

**Late Binding**: Low-level details (which library to use, which variable names to choose) are deferred until execution, minimizing coordination overhead.

Example:
- Agent A commits: "I will implement authentication" 
- Agent B commits: "I will implement user profiles"
- Consistency check at this level: probably compatible (different domains)

Later:
- Agent A refines: "I will store user data in 'users' table"
- Agent B refines: "I will store user data in 'profiles' table"  
- Consistency check: incompatible! (schema conflict)

If both agents had committed to detailed plans immediately, the conflict might have been discovered late (expensive) or never (catastrophic). By coordinating on partial plans first, they can discover conflicts when resolution is easier.

## Consistency Across Abstraction Levels

The paper doesn't explicitly discuss this, but the architecture implies that consistency must be maintained across different levels of abstraction:

**Goal-Level Consistency**: High-level goals should be non-conflicting
- "Optimize for speed" vs. "Optimize for memory" → potentially inconsistent
- "Implement feature X" vs. "Implement feature Y" → probably consistent unless X and Y conflict

**Approach-Level Consistency**: Chosen approaches should be compatible
- "Use OAuth for auth" vs. "Use session-based auth" → inconsistent if both for same system
- "Use REST API" vs. "Use GraphQL" → inconsistent if client expects one

**Method-Level Consistency**: Specific methods should not interfere
- "Use library L1 version 2.0" vs. "Use library L1 version 3.0" → dependency conflict
- "Modify file F" vs. "Delete file F" → temporal conflict

For agent systems: consistency checking must operate at the appropriate abstraction level. Don't check method-level consistency when plans are still at the goal level (premature and expensive). Do check goal-level consistency immediately (cheap and prevents high-level conflicts).

## Monitoring and Consistency Maintenance

Plans can become inconsistent after formation due to belief changes: "What happens when the agent comes to believe that a prior plan of hers is no longer achievable? A full development of this architecture would have to give an account of the ways in which a resource-bounded agent would monitor her prior plans in the light of changes in belief" (p. 14).

This monitoring is itself expensive, creating another tradeoff:
- **Continuous monitoring**: Always consistent, but expensive
- **Periodic monitoring**: Cheaper, but inconsistencies may persist
- **Event-driven monitoring**: Monitor only when beliefs change, but requires efficient change detection

For multi-agent systems, consistency monitoring becomes a communication challenge:

**Push-Based**: Agents broadcast when plans change, others check consistency
- Pro: Immediate detection of inconsistencies
- Con: Communication overhead, all agents must process all broadcasts

**Pull-Based**: Agents periodically query others' plans and check consistency
- Pro: Lower communication overhead
- Con: Delayed detection, potential for acting on inconsistent assumptions

**Hybrid**: Broadcast major changes, poll for details
- Pro: Balance of timeliness and overhead
- Con: Complexity of deciding what's "major"

## Consistency as Architectural Principle

The deeper insight is that consistency maintenance is not just a correctness criterion — it's an architectural principle that enables bounded agents to coordinate:

1. **Filtering function**: Consistency checks eliminate options without expensive deliberation
2. **Coordination signal**: "My plan is consistent with yours" means we can proceed independently  
3. **Problem detection**: Inconsistency signals need for communication or replanning
4. **Resource management**: Consistent plans don't waste resources on conflicting actions

For WinDAGs and similar systems: **make consistency checking explicit and first-class**. Don't assume plans are consistent; check actively. Don't make consistency checks expensive; use hierarchical approximations. Don't ignore inconsistencies; treat them as coordination requirements.

The consistency requirement transforms distributed decision-making from intractable (every agent must consider every other agent's detailed plans) to tractable (agents maintain compatible high-level plans and coordinate only when refinements create conflicts).

```

### FILE: failure-modes-of-resource-bounded-reasoning.md

```markdown
# Failure Modes of Resource-Bounded Reasoning: What Can Go Wrong and Why

## The Taxonomy of Failure

Most frameworks for rational agency identify success: the agent achieves its goals. Bratman, Israel, and Pollack's framework is distinctive in identifying *six different failure modes* that arise specifically from resource-boundedness. These aren't implementation bugs — they're *inherent to bounded rationality* and cannot be fully eliminated, only managed.

The paper's taxonomy (Table 1, p. 16) describes situations involving incompatible options. Extended, we can identify systematic failure patterns:

## Category 1: Excessive Deliberation (The Cautious Failures)

### Failure Mode 1: Deliberation That Leads to Insignificant Changes (Situation 2b)

**Description**: "Rosie discovers that the existing CRT is repairable... Her deliberation results in a decision to repair rather than replace. And, indeed, repairing is a slightly better option. However, instead of deliberating, Rosie could have simply gone ahead with her intention to replace the CRT, and proceeded more quickly to her next task" (p. 17).

**What went wrong**: The override mechanism triggered when it shouldn't have. The deliberation cost exceeded the benefit gained from choosing the better option.

**Why it's insidious**: The agent made a locally optimal decision (repair is better than replace) but a globally suboptimal one (deliberation + repair is worse than just replacing).

**Diagnostic**: Track deliberation time vs. benefit gained from plan changes. If you see many cases where deliberation takes 10 minutes to gain a 2-minute improvement, your override mechanism is too sensitive.

**For agent systems**: This manifests as "analysis paralysis." An agent spends 5 minutes choosing between libraries that differ by 3% performance, or deliberates extensively about variable naming, or reconsiders its testing strategy when the difference is negligible.

**Fix**: Raise override thresholds for low-stakes decisions. If estimated benefit < N * deliberation_cost, don't override.

### Failure Mode 2: Deliberation That Confirms Original Plan (Situation 3)

**Description**: "Replacing the CRT is the superior option... Hence, when Rosie reconsiders, she decides not to change her prior intention, but instead to go ahead and replace the CRT. Here again Rosie is cautious, and her caution doesn't pay" (p. 18).

**What went wrong**: The override mechanism triggered, deliberation occurred, and the conclusion was "do what I was already planning to do." Pure wasted computation.

**Why it's worse than Situation 2b**: At least in 2b, the agent got *something* from deliberation (a marginally better option). Here, the agent gets *nothing* — it spends resources to confirm what it already knew.

**Diagnostic**: Track deliberations that don't result in plan changes. If deliberation frequently (>30%?) results in confirming the original plan, your override mechanism is triggering on false alarms.

**For agent systems**: An agent reconsiders its implementation approach, spends time evaluating alternatives, and concludes "my original approach was best." This happens when override rules are too coarse — they detect potential problems that aren't actual problems.

**Fix**: Add preconditions to override rules. Don't just check "new option has property X," check "new option has property X *and* property X wasn't already satisfied by current plan."

### Common Cause: Overly Sensitive Override Mechanism

Both Situations 2b and 3 stem from overriding too frequently: "If the agent is overly sensitive, willing to reconsider her plans in response to every unanticipated event, then her plans will not serve sufficiently to limit the number of options about which she must deliberate" (p. 16).

The paper is explicit: **even a well-designed agent will sometimes end up in these situations**. The goal is not to eliminate them but to minimize their frequency relative to productive deliberation (Situation 1).

## Category 2: Missed Opportunities (The Bold Failures)

### Failure Mode 3: Missing Worthwhile Improvements (Situation 4a)

**Description**: "Had Rosie reconsidered, she would have found the new CRT to be slightly superior... the deliberation is relatively easy and does not interfere in any serious way with Rosie's other activities. In this case, then, Rosie's boldness doesn't pay" (p. 18).

**What went wrong**: The override mechanism didn't trigger when it should have. A better option was available, checking would have been cheap, but the agent didn't check.

**Why it happens**: Override thresholds are too high, or override conditions are too narrow, so opportunities that should be recognized aren't.

**Diagnostic**: This is hard to detect automatically because the agent never knows about the missed opportunity. It requires external observation: "Why didn't the agent consider X, which was clearly better?"

**For agent systems**: An agent misses that a new library version fixes a bug it's working around, or doesn't notice that a better API endpoint exists, or fails to recognize that a simpler implementation approach is possible.

**Fix**: This is the hardest failure to address because you must know about opportunities to encode rules for recognizing them. Strategies:
- Periodic background scans for improvements (when resources available)
- Learning from post-mortems (when better approach was found later)
- Explicit opportunity notifications (other agents or monitoring systems broadcast relevant changes)

### The Tradeoff Problem

"As we try to avoid caution that doesn't pay, we run an increased risk of boldness that doesn't pay. And, of course, the opposite is true as well: as we try to avoid boldness that doesn't pay, we run an increased risk of undesirable cautiousness" (p. 20).

This is fundamental: you cannot simultaneously minimize Situations 2b/3 (excessive caution) and Situation 4a (excessive boldness). Tightening override conditions reduces false positives (excessive deliberation) but increases false negatives (missed opportunities). Loosening conditions does the reverse.

The design challenge is finding the sweet spot for a particular domain and workload.

## Category 3: Premature Commitment Failures

### Failure Mode 4: Detailed Planning with Poor Information

The paper discusses this implicitly in its argument for partial plans: "highly detailed plans about the far future will often be of little use, the details not worth bothering about" (p. 9).

**What goes wrong**: The agent commits to detailed plans too early, before information needed for good decisions is available. When reality diverges from assumptions, detailed plans must be abandoned or heavily revised.

**Example**: An agent plans detailed implementation of authentication:
- Library L1, version 1.2.3
- Database schema with columns X, Y, Z
- Token expiration policy P
- Error handling strategy E

Then discovers during implementation:
- Library L1 has a critical bug in version 1.2.3
- Database already has a users table with different schema
- Security requirements mandate different expiration policy
- Existing error handling infrastructure doesn't support strategy E

The detailed plan was worthless. Worse, commitment to the detailed plan may have foreclosed better options that emerged later.

**For agent systems**: This manifests as "planning paralysis" followed by "replanning churn." The agent spends extensive time planning details, then spends more time revising the plan when assumptions are violated. Total time (planning + replanning) exceeds what would have been needed with a partial plan and just-in-time refinement.

**Fix**: Embrace structural partiality. Commit to high-level structure (goals and approaches) but defer details until:
- Information needed for good decisions becomes available
- Time pressure requires commitment (means-end coherence threatens)
- Execution reaches the point where details matter

## Category 4: Insufficient Monitoring Failures

### Failure Mode 5: Acting on Invalidated Plans

The paper notes: "What happens when the agent comes to believe that a prior plan of hers is no longer achievable?" (p. 14).

**What goes wrong**: The world changes in ways that invalidate plan assumptions, but the agent doesn't detect this and continues executing an invalid plan.

**Example**: An agent plans to "fetch data from API endpoint E." While the agent is executing earlier parts of its plan, endpoint E is deprecated and disabled. The agent attempts to fetch from E and fails.

**Why it happens**: Monitoring is expensive. Continuously checking all assumptions of all plans is computationally intractable. So agents monitor selectively or periodically — and can miss changes.

**For agent systems**: 
- Plans assume file F exists; F is deleted by another process
- Plans assume service S is available; S goes down
- Plans assume data format D; D changes

**Fix**: 
- **Precondition checking**: Before executing each step, verify critical preconditions
- **Error handling**: When execution fails, identify which assumptions were violated
- **Event-driven monitoring**: Subscribe to notifications about relevant changes
- **Periodic validation**: Periodically (low frequency) check that critical assumptions still hold

## Category 5: Coordination Failures

The paper doesn't extensively discuss multi-agent coordination failures, but they're implied by the consistency requirement.

### Failure Mode 6: Concurrent Modification Conflicts

**What goes wrong**: Multiple agents have plans that are individually consistent but collectively incompatible due to implicit assumptions about exclusivity.

**Example**: 
- Agent A plans: "Refactor module M"
- Agent B plans: "Add tests for module M"
- Both plans seem consistent (different activities, different outputs)
- But: A's refactoring changes interfaces that B's tests depend on
- B's tests fail because they're written against the old interface

The plans were consistent at abstract level (different domains) but inconsistent at detailed level (shared dependencies).

**For agent systems**: Classic concurrent modification problems:
- Two agents modify the same file
- Two agents allocate the same resource
- Two agents make assumptions about system state that become mutually inconsistent

**Fix**:
- **Lock-based coordination**: Agents acquire locks on resources before modifying
- **Version-based coordination**: Agents tag plans with version assumptions and fail fast if versions mismatch
- **Hierarchical coordination**: Agents coordinate at abstract level before refining plans
- **Transaction-based coordination**: Agents treat plan execution as transactions that can be rolled back

### Failure Mode 7: Starvation and Priority Inversion

**What goes wrong**: An agent's plans are consistently overridden or delayed by other agents' higher-priority plans, leading to starvation.

**Example**: 
- Agent A has low-priority task "write documentation"
- Agents B, C, D constantly have higher-priority tasks
- Agent A never executes because it's always preempted

**Why it's subtle**: Each individual preemption is rational (B's task is more important than A's). But the cumulative effect is that A's task never completes, even though it's still important.

**For agent systems**: Background maintenance tasks, optimization work, or technical debt reduction may be perpetually deferred in favor of feature work.

**Fix**:
- **Age-based priority boost**: Tasks increase in priority over time
- **Guaranteed time slices**: Each agent gets minimum percentage of resources
- **Explicit starvation detection**: Monitor task age and force execution of starved tasks

## Category 6: Meta-Level Failures

### Failure Mode 8: Expensive Meta-Reasoning

The paper warns: "It is essential that the filtering process be computationally efficient relative to deliberation itself" (p. 13).

**What goes wrong**: The mechanisms designed to reduce deliberation cost (filtering, override checking) themselves become expensive, negating their purpose.

**Example**: A compatibility filter that runs complex constraint satisfaction to check consistency. The filter takes longer than the deliberation it's meant to avoid.

**For agent systems**: Over-engineered meta-reasoning:
- Complex heuristics for skill selection that take longer than trying a skill
- Elaborate cost-benefit analysis of deliberation that costs more than the deliberation
- Sophisticated override mechanisms that require extensive computation

**Fix**:
- **Use simple, fast filters**: Prefer polynomial-time checks over NP-hard optimization
- **Use approximate filters**: Accept false positives/negatives for speed
- **Profile meta-reasoning**: Measure time spent in filtering, override checking, monitoring
- **Budget meta-reasoning**: Allocate fixed time/resource budget to meta-level processes

## The Impossibility Result

The paper's deepest insight is that **you cannot eliminate these failures**. Even in the idealized case mentioned in footnote 9 (p. 19), where an agent "is disposed to deliberate about an incompatible option when and only when that deliberation would lead to a worthwhile change," the agent would need to know the outcome of deliberation *before* deliberating — which is impossible.

The failures are not bugs; they're **inherent features of bounded rationality**. The goal is not perfection but acceptable failure rates:

- Keep Situations 2b, 3, 4a below some threshold (< 20% of deliberations?)
- Maximize Situations 1, 4 (productive deliberations and productive commitments)
- Accept Situation 4b (suboptimality when checking would cost more than benefit)

## Diagnostic Framework

For agent system designers, the paper provides a diagnostic framework:

**If agent is slow/inefficient**:
- Measure: How often does deliberation lead to plan changes?
- If rarely: Situations 2b, 3 are frequent (overly cautious)
- Fix: Tighten override conditions, raise thresholds

**If agent is making poor choices**:
- Measure: How often do post-mortems reveal better options were available?
- If often: Situation 4a is frequent (overly bold)
- Fix: Loosen override conditions, lower thresholds, add opportunity detection

**If agent is unstable/thrashing**:
- Measure: How often does the agent abandon plans?
- If very often: Plans aren't stable (override mechanism too sensitive)
- Fix: Plans aren't providing filtering function; dramatically raise override thresholds

**If agent is rigid/brittle**:
- Measure: How often do plans fail due to invalid assumptions?
- If often: Insufficient monitoring or insufficiently revisable plans
- Fix: Add monitoring, lower override thresholds for critical assumptions

The framework transforms vague "the agent isn't working well" into specific, measurable failure modes with targeted architectural interventions.

```

### FILE: temporal-dynamics-of-commitment.md

```markdown
# Temporal Dynamics of Commitment: When to Decide, When to Refine, When to Abandon

## The Time-Sensitive Nature of Plans

One of the paper's foundational observations is that time matters in a way that traditional planning and decision theory ignore: "It is recognized that the construction of plans takes time. However, these plans have been constructed for a set of future conditions that are known in advance and are frozen. The implicit assumption is that the conditions for which a plan is being formed, the so-called start state, will not change prior to execution" (p. 4).

But of course: **the world doesn't freeze during planning**. And this creates temporal dynamics that are central to resource-bounded reasoning:

- While you plan, opportunities expire
- While you plan, assumptions become invalid
- While you plan, deadlines approach
- While you deliberate, others act

These temporal dynamics are not edge cases. They're the normal condition of any agent operating in a real environment. The architecture must address them directly.

## Three Temporal Phases

The paper implicitly describes three temporal phases in the life of a plan:

### Phase 1: Formation (Deciding to Commit)

"Once the agent has decided to read a certain book today, a means-end problem is posed" (p. 11). The decision to commit creates a temporal boundary — before commitment, the agent is deliberating among alternatives; after commitment, the agent is working within the constraints of the plan.

**Trigger**: Deliberation process concludes (may be triggered by deadline, sufficient information, or opportunity closing)

**Result**: A (possibly partial) plan is adopted

**Temporal pressure**: External deadlines, opportunity windows, assumption decay

For agent systems, this is the "task acceptance" phase. An agent receives "implement OAuth authentication" and decides whether to commit. Factors:
- Is this consistent with existing commitments? (compatibility)
- Do I have resources to execute? (resource bounds)
- Is timing compatible with other plans? (temporal consistency)

Commit too early: foreclosed better options that arise later
Commit too late: miss opportunity or deadline

### Phase 2: Refinement (Progressive Commitment)

"As time goes by, they must be filled in with subplans that are at least as extensive as the agent believes necessary to execute the plan successfully" (p. 11).

The partial plan is progressively refined through means-end reasoning. This isn't a one-time event — it's an ongoing process triggered by approaching deadlines or detected incoherence.

**Trigger**: "Means-end reasoning may occur at any time up to the point at which a plan is in danger of becoming means-end incoherent; at that point it must occur" (p. 12).

**Result**: The plan becomes more detailed, more specific, more committed

**Temporal pressure**: "In danger of becoming means-end incoherent" is a temporal judgment — when is the latest I can refine this plan and still execute successfully?

For agent systems, this creates a scheduling problem: **when must each level of refinement occur?**

Example timeline:
```
T=0:   Commit to "implement OAuth" (high-level goal)
T=10:  Must choose OAuth provider (deadline: need to begin implementation)
T=20:  Must choose implementation library (deadline: need to write code)
T=30:  Must implement (deadline: must complete by T=50)
T=50:  Deadline
```

Refine too early: wasted effort if assumptions change
Refine too late: no time to execute

The "in danger of means-end incoherence" concept provides the temporal trigger: refine when (time to deadline) < (expected time to refine + expected time to execute).

### Phase 3: Maintenance/Abandonment (Revising Commitments)

"What happens when the agent comes to believe that a prior plan of hers is no longer achievable? A full development of this architecture would have to give an account of the ways in which a resource-bounded agent would monitor her prior plans in the light of changes in belief" (p. 14).

Plans must be monitored against changing conditions and potentially abandoned or revised. This monitoring is itself expensive and must be budgeted.

**Trigger**: Belief changes that threaten plan validity, or override mechanism fires on incompatible option

**Result**: Plan is abandoned, revised, or confirmed (Situation 3)

**Temporal pressure**: How long can monitoring be deferred before invalid plan causes failures?

For agent systems, this is the "replanning" phase — often the most expensive because:
- Previous work may be wasted
- Other agents may have dependencies on the abandoned plan
- Time pressure is now greater (deadline closer, less time remaining)

## Temporal Constraints on Deliberation

The filter override mechanism mediates temporal tradeoffs:

"It might be a good strategy for her to reconsider an intention to replace a CRT when an alternative means is proposed. After all, such reconsideration will, on many occasions, save the cost of a new CRT. Of course, there may also be times when this strategy lands Rosie in situations of type 2b or 3, in which her caution doesn't pay" (p. 19).

The override decision is fundamentally temporal: **Is there time to deliberate and still execute successfully?**

If deadline is far: deliberate freely (temporal slack allows exploration)
If deadline is near: be bold (no time for deliberation, commit to current plan)

This suggests **time-dependent override thresholds**:

```
override_threshold(time_to_deadline):
    if time_to_deadline > SLACK:
        return LOW_THRESHOLD   # deliberate readily
    elif time_to_deadline > MINIMUM:
        return MEDIUM_THRESHOLD  # deliberate selectively
    else:
        return HIGH_THRESHOLD   # commit and execute
```

For agent systems, this could be explicit: override mechanisms take time pressure as input and adjust sensitivity accordingly.

## Commitment Timing and Information Value

The paper's argument for partial plans reveals a timing principle: **commit when information value exceeds delay cost**.

Early commitment (before information available):
- Benefit: Start execution earlier
- Cost: Decisions made with poor information, likely to need revision

Late commitment (after information available):
- Benefit: Decisions made with good information, less revision needed
- Cost: Delayed start, potentially miss deadline

The optimal timing depends on:
1. **Information arrival rate**: How quickly does relevant information become available?
2. **Information value**: How much does better information improve decisions?
3. **Delay cost**: How much does waiting cost (opportunity, deadline pressure)?
4. **Revision cost**: How expensive is it to change course if early commitment is wrong?

For agent systems implementing OAuth:

**Commit to "use OAuth" immediately** because:
- Information needed for this decision is available now (requirements are known)
- Waiting doesn't improve this decision
- Commitment narrows future option space (valuable filtering)

**Defer "which OAuth provider" initially** because:
- Information needed is not yet available (haven't inspected codebase)
- Inspection during setup will reveal which providers already have libraries
- This decision can wait until implementation begins

**Defer "which error handling strategy" until implementation** because:
- Information needed is not available until attempting integration
- Different providers have different failure modes
- This decision can wait until errors are encountered

The structural partiality of plans enables this just-in-time decision making.

## The Stability-Revisability Tension Over Time

Plans must be "reasonably stable, i.e., they should be relatively resistant to reconsideration and abandonment" (p. 8). But they must also be revisable when circumstances change. These two requirements create temporal dynamics:

**Early in plan lifetime**: Should be more revisable
- Less committed effort (less sunk cost)
- More time to adapt (less deadline pressure)
- Less coordination cost (fewer dependencies)

**Late in plan lifetime**: Should be more stable
- Significant committed effort (high revision cost)
- Less time to adapt (approaching deadline)
- High coordination cost (others depend on this plan)

This suggests **time-dependent stability**:

```
should_reconsider(plan, new_option, current_time):
    time_invested = current_time - plan.start_time
    time_remaining = plan.deadline - current_time
    
    # Early: reconsider readily
    if time_invested < EARLY_PHASE:
        return override_threshold = LOW
    
    # Late: resist reconsideration
    if time_remaining < LATE_PHASE:
        return override_threshold = HIGH
    
    # Middle: standard reconsideration
    return override_threshold = MEDIUM
```

For agent systems: An agent that has spent 5 minutes on a plan should reconsider more readily than an agent that has spent 5 hours, all else being equal.

## Deadline-Driven Refinement

The means-end coherence requirement creates **temporal forcing functions**:

"Means-end reasoning may occur at any time up to the point at which a plan is in danger of becoming means-end incoherent; at that point it must occur" (p. 12).

"In danger of" is a temporal statement. A plan to "submit PR by 5 PM" with empty implementation becomes means-end incoherent when:
- Current time + minimum implementation time > 5 PM

This creates a **refinement schedule**: deadlines propagate backward through the plan hierarchy, creating latest-possible-times for each refinement.

For agent systems with plan "Deploy feature F by Friday":

```
Deploy F by Friday 5 PM
  ├─ Test F by Friday 2 PM [latest: Fri 2 PM - 3hr test time = Fri 11 AM]
  │   └─ Implement F by Friday 11 AM [latest: Fri 11 AM - 4hr impl time = Fri 7 AM]
  │       └─ Design F by Friday 7 AM [latest: Fri 7 AM - 1hr design time = Fri 6 AM]
  │           └─ [Refinement must occur by Fri 6 AM or plan incoherent]
  └─ Review F by Friday 4 PM [latest: Fri 4 PM - 1hr review time = Fri 3 PM]
```

Each "latest" time is when that subplan must be refined or the parent plan becomes incoherent. This schedule is computable from:
- Deadline (5 PM Friday)
- Duration estimates (3hr testing, 4hr implementation, etc.)
- Dependencies (testing requires implementation)

Agent systems can use this to schedule refinement activities: "I must decide implementation approach by Friday 6 AM. That's T hours away. Begin means-end reasoning at T-1 hours to ensure timely decision."

## Opportunity Windows and Temporal Logic

Options have temporal properties:

**Expiring opportunities**: "While deliberating about which OAuth provider to use, your teammate implements Google OAuth" (Failure Modes paper, p. X).

The option "use Google OAuth" has temporal bounds:
- Available from: now
- Available until: teammate commits to alternative
- Cost if delayed: none (until commitment)
- Cost if too late: incompatible plans, coordination conflict

**Time-varying cost**: Some options become more expensive over time:
- "Fix bug B" is cheap now, expensive after release
- "Refactor module M" is cheap now, expensive after others depend on M
- "Choose authentication approach" is cheap now, expensive after implementation begins

Override mechanisms should account for temporal properties:

```
should_override(option, current_plan):
    if option.expires_at < current_time + min_deliberation_time:
        # Expiring opportunity: consider even if marginal
        return TRUE
    if option.cost_increases_over_time and time_to_deadline > threshold:
        # Do now while cheap, or never
        return TRUE
    # ... standard override logic
```

## Temporal Patterns in Multi-Agent Coordination

When multiple agents coordinate, temporal dynamics create patterns:

**Concurrent Execution**: Agents A and B execute independent plans simultaneously. Requires temporal non-overlap of shared resources.

**Sequential Execution**: Agent B waits for Agent A to complete. Requires A's deadline < B's start time.

**Interleaved Execution**: Agents A and B alternate using shared resource. Requires coordination protocol and temporal scheduling.

**Hierarchical Execution**: Agent B executes subtask for Agent A. Requires B's deadline < A's means-end coherence threat time.

For WinDAGs orchestrating 180+ skills across multiple agents:

**Temporal coordination overhead scales with plan precision**:
- High-level plans ("implement authentication", "update tests") → minimal coordination needed, can execute concurrently
- Detailed plans (specific file edits, specific function changes) → extensive coordination needed, may require serialization

This argues for **late binding of temporal coordination**: coordinate on high-level schedules early, refine coordination as plans refine, commit to precise schedules only when execution imminent.

## Anytime Deliberation and Interruption

The paper doesn't discuss this explicitly, but the temporal dynamics imply that deliberation must be interruptible:

**Deadline interruption**: "I've been deliberating about which library to use, but the deadline is now so close that I must commit to something and begin implementation."

**Information interruption**: "While deliberating about OAuth providers, I discovered the codebase already has provider P configured, so I'll use P."

**Opportunity interruption**: "While deliberating about implementation approach, a teammate offered to pair program, which is valuable and time-sensitive, so I'll defer the deliberation."

For agent systems, this suggests:
- Deliberation should have timeboxes ("spend max 10 minutes choosing library")
- Deliberation should checkpoint ("after 5 minutes, current best option is X")
- Deliberation should be resumable ("if interrupted, can continue from checkpoint")
- Plans should specify commitment points ("must decide by time T")

## The Deeper Temporal Principle

The architecture's temporal insight is: **commitment is a temporal resource management strategy**. By committing to plans, agents:

1. **Defer detailed decisions** to when information is better
2. **Frontload constraint propagation** (early commitment narrows later option space)
3. **Enable temporal parallelism** (committed plans allow independent execution)
4. **Manage deliberation budget** (commitment limits what must be reconsidered)

Time is the ultimate resource bound. You can't get more time. You can only allocate it wisely. The plan-filter-override architecture is fundamentally a time allocation mechanism: time spent planning, time spent deliberating, time spent executing, time spent monitoring.

For agent systems: **Make temporal dynamics explicit**. Don't just track what the agent is doing; track when decisions must be made, when refinements must occur, when monitoring must happen, when commitments become irreversible. Treat time as a first-class constraint, not an afterthought.

```

## SKILL ENRICHMENT

**Task Decomposition Skills**:
- Apply structural partiality principles: decompose to goals/approaches first, defer implementation details until information available
- Use means-end coherence as forcing function: decompose further when execution timeline threatens coherence
- Check compatibility at each decomposition level: ensure subtasks don't conflict before detailed planning

**Planning & Architecture Design**:
- Design for partial plans as first-class entities, not just intermediate representations
- Create explicit commitment levels in task specifications (goal committed, approach deferred, etc.)
- Build override mechanisms into orchestration logic to decide when replanning is worthwhile

**Debugging & Root Cause Analysis**:
- Use failure taxonomy to diagnose: Is this excessive deliberation (2b, 3)? Missed opportunity (4a)? Premature commitment?
- Trace temporal dynamics: When was decision made? Was information available? Was timing appropriate?
- Identify filter/override miscalibration: Are incompatibilities being caught? Are overrides firing appropriately?

**Code Review & Refactoring**:
- Apply consistency checking: Does this change conflict with plans in progress? With partially-implemented features?
- Consider temporal partiality: Should this refactoring be detailed now or deferred until more context available?
- Check means-end coherence: Does codebase have enough structure to execute planned features?

**Multi-Agent Coordination**:
- Implement explicit compatibility checking between agent plans
- Use hierarchical coordination: align high-level plans early, refine coordination as plans refine
- Build filter override mechanisms into coordination protocols

**Resource Management**:
- Treat deliberation as resource-consuming operation with cost/benefit tradeoffs
- Monitor deliberation patterns to detect overly cautious/bold behavior
- Adjust meta-reasoning based on observed deliberation effectiveness

**Testing & Validation**:
- Test filter mechanisms for both false positives (blocked compatible options) and false negatives (allowed incompatible options)
- Validate override mechanisms produce acceptable distribution across six situations
- Verify temporal dynamics: Do refinements occur at appropriate times? Are commitments stable enough?

**Skill Selection & Routing**:
- Use partial plans to filter skill space: only consider skills relevant to current committed goals
- Implement compatibility checking: does proposed skill conflict with skills in execution?
- Build override detection: when should skill selection be reconsidered despite existing plan?

## CROSS-DOMAIN CONNECTIONS

**Agent Orchestration**: 
The BDI architecture provides a complete framework for orchestrating multiple AI agents. Each agent maintains beliefs (about world state and other agents), desires (goals to achieve), and intentions (committed plans). The filtering and override mechanisms enable agents to coordinate without constant communication — consistency checking against partial plans allows independent execution with bounded coordination overhead. For WinDAGs specifically, this maps to: beliefs = system state and capability models, desires = user requests and system goals, intentions = committed execution plans with deferred details.

**Task Decomposition**: 
The paper's treatment of structural partiality and means-end coherence provides a principled approach to hierarchical decomposition. Rather than expanding all details immediately (traditional hierarchical planning), decompose to the level necessary for means-end coherence and defer further detail. This "just-in-time decomposition" matches how humans actually break down complex tasks — commit to approach before finalizing implementation details. For agent systems, this means task queues should support hierarchical partial tasks, not flat lists.

**Failure Prevention**: 
The six-situation taxonomy provides a diagnostic framework that traditional error handling lacks. Instead of "something went wrong," identify whether failure was: excessive deliberation (situations 2b, 3), missed opportunity (4a), invalid assumptions (monitoring failure), or coordination conflict. Each failure mode has specific preventive measures. This transforms debugging from "fix this instance" to "adjust architectural parameters to reduce failure mode frequency."

**Expert Decision-Making**: 
The paper reveals how experts achieve bounded rationality: not by optimal decision-making but by using commitments to limit decision scope. Experts form plans early (sometimes on incomplete information), use these plans to filter options aggressively, and override selectively when stakes are high. The filter override mechanism formalizes expert intuition about when to stick with a plan vs. reconsider. For agent systems, this suggests encoding domain expertise not as decision procedures but as override conditions.

**Knowledge Representation**:
Plans are not just action sequences — they're commitment structures that carry semantic weight. A plan represents "I've decided this approach" which constrains future decisions through consistency requirements. This is richer than traditional plan representations. For agent systems, plans should be first-class objects with explicit commitment levels, compatibility constraints, temporal properties, and override conditions.

**System Design Patterns**:
The architecture pattern here — data stores (beliefs, desires, plans) plus processes operating on them (means-end reasoner, opportunity analyzer, filter, override, deliberation) — is a powerful template. It separates "what I know/want/intend" from "how I reason about it," enabling modular design where reasoning processes can be swapped or improved independently. This maps naturally to event-driven architectures where state changes trigger reasoning processes.