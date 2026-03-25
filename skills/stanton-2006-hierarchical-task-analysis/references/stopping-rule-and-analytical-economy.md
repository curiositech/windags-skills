# The P×C Stopping Rule and the Principle of Analytical Economy

## The Problem That Won't Go Away

Annett et al (1971) identified knowing when to stop the analysis as "one of the most difficult features of task analysis." Thirty years later, Stammers & Astley (1987) confirmed "the stopping rule has remained a problem area for HTA." This persistence reveals something deep: the stopping problem is not a defect of HTA but an inherent challenge in modeling complex systems.

The original formulation is deceptively simple: Continue decomposition only where (Probability of failure) × (Cost of failure) is unacceptable. Stop when P×C reaches an acceptable threshold. If you can perform the sub-goal adequately at the current level of description, further decomposition wastes analytical effort.

## Why Simple Rules Are Hard to Apply

The P×C criterion appears quantitative but operates qualitatively. As Annett (2004) clarifies: "it is important to think of the P×C criterion as a statement of principle rather than an exact calculation." Why can't analysts just calculate P and C?

1. **Probability is often unknown**: For novel systems or rare events, failure probability must be estimated from expert judgment, analogy to similar systems, or theoretical analysis. The precision is illusory.

2. **Cost is multidimensional**: Failure might cost time, money, safety, reputation, or mission success. How do you multiply "medium probability" by "financial loss plus safety risk plus reputational damage"?

3. **Context determines acceptability**: A 10% failure probability might be catastrophic for aircraft landing gear but acceptable for a suggestion algorithm. "Acceptable" depends on application domain, regulatory environment, and risk tolerance.

4. **Decomposition changes estimates**: You don't know the true P or C until you've decomposed the sub-goal, but you're trying to decide whether to decompose. It's a chicken-and-egg problem.

Piso (1981) proposed a pragmatic escape: "continue the analysis until the sub-goal is clear to both the analyst and subject matter expert(s)." This shifts from quantitative calculation to shared understanding. The stopping point is where further detail doesn't change anyone's comprehension or decision-making.

## The Deeper Principle: Error Variance and Analytical Leverage

Annett (2004) reveals what P×C really measures: "The top-down systems approach taken by HTA enables the analyst to identify and deal first with factors generating the largest error variance."

This is the key insight. System performance has variance—sometimes things go well, sometimes poorly. That variance comes from multiple sources: human error, equipment failure, environmental conditions, coordination breakdowns. Not all sources contribute equally.

The P×C rule directs analytical effort toward high-variance components. If a sub-goal has:
- Low P, Low C: Skip it. Even if it fails occasionally, consequences are minor.
- High P, Low C: Might skip. Frequent failures matter only if they cascade.
- Low P, High C: Analyze deeply. Rare but catastrophic failures need prevention.
- High P, High C: Definitely analyze. This is where system performance breaks down.

For intelligent agent systems, this translates directly: focus decomposition and error analysis on sub-goals where agent performance is uncertain (high P) and where errors have cascading effects (high C). Don't over-engineer robust sub-goals that fail rarely and recover easily.

## Alternative Stopping Heuristics

Various practitioners have proposed simpler stopping rules:

**Clarity criterion** (Piso, 1981): Stop when the sub-goal is clear to analyst and experts. Problem: "clear" is subjective and may reflect familiarity rather than adequacy.

**Capability criterion**: Stop when sub-goal matches a known capability (skill, trained procedure, system function). Problem: Encourages stopping at available solutions rather than required functions.

**Atomicity criterion**: Stop when further decomposition produces trivial operations ("press button," "read value"). Problem: Can lead to over-specification of well-understood sub-goals.

**Design-decision criterion** (Shepherd, 2001): Stop when reaching sub-goals where design decisions need evaluation. Continue decomposition where performance problems are suspected.

**Communication criterion**: Stop at level where coordination between agents must be specified. Problem: May stop too early for complex autonomous coordination.

Each heuristic emphasizes different purposes. The multiplicity of stopping rules reflects HTA's use across diverse applications—training design needs different granularity than error prediction.

## Practical Guidance: When to Stop in Agent Systems

For orchestrating AI agents with specialized skills:

**Stop when sub-goal maps to a skill**: If "analyze code for security vulnerabilities" is an available skill in your system, stop there. Don't decompose into "tokenize code, build AST, check for SQL injection patterns..." unless the skill fails or you're designing a new skill.

**Stop when coordination is specified**: If sub-goal requires multiple agents, decompose until you can specify: which agent owns this sub-goal, what information they need from whom, what they produce for whom, when they can start, and what signals completion.

**Continue when error propagation is unclear**: If you can't predict how this sub-goal's failure affects super-ordinate goals, decompose further. Error analysis requires understanding failure modes.

**Continue when workload is uncertain**: If you can't estimate time, cognitive demand, or resource requirements, decompose further. Workload assessment requires measurable components.

**Continue when multiple implementations exist**: If sub-goal could be satisfied by different strategies with different trade-offs, decompose until you can compare alternatives.

**Stop when further detail provides no decision leverage**: If decomposing further won't change your design decisions, allocation choices, or error mitigations, stop. Detail for its own sake wastes time.

## The Three-Pass Strategy

Experienced analysts use iterative refinement:

**First pass—Rough outline**: Decompose each super-ordinate goal into 3-8 immediate sub-ordinates. Aim for logical groupings that "feel right." Don't worry about completeness. This creates the skeleton.

**Second pass—Critical path analysis**: Identify sub-goals on the critical path for system success. These are high-C (cost) components. Decompose these first, even if you're unsure about P.

**Third pass—Error-prone areas**: Identify sub-goals where performance is uncertain, novel, or historically problematic. These are high-P (probability) components. Decompose these next.

Subsequent passes focus on specific analytical purposes: one pass for interface requirements, one for team coordination, one for error prediction. Each pass may extend decomposition in different branches based on its focus.

## Managing Uneven Depth: The Beauty of Hierarchical Representation

HTA explicitly permits and encourages uneven decomposition depth. The hierarchical diagram or list clearly shows which sub-goals are developed further (have children) and which are terminal (underlined in diagrams, marked "//" in tables).

In Stanton's emergency response example:
- Sub-goal 1 "Receive notification" stops at level 1 (single step, low P, low C)
- Sub-goal 2 "Gather information" extends to level 3 (coordination required, error-prone)
- Sub-goal 4 "Clean up chemical spillage" would extend much deeper (high P, high C, complex procedure)

This uneven development reflects analytical economy. The representation doesn't force artificial balance. An intelligent observer can see where complexity resides by noting decomposition depth.

For DAG-based orchestration, uneven depth maps naturally:
- Shallow sub-goals → single skill invocations, low coordination overhead
- Deep sub-goals → complex sub-DAGs, careful orchestration required
- The hierarchy visually communicates system complexity distribution

## The Stopping Rule as Design Constraint

Interestingly, the P×C rule can guide system design, not just analysis. If a sub-goal has unacceptably high P×C but can't be decomposed further (atomic operation), you have four options:

1. **Reduce P**: Improve reliability through better design, training, automation, or error-proofing
2. **Reduce C**: Add error recovery, graceful degradation, or redundancy so failures cost less
3. **Eliminate sub-goal**: Redesign super-ordinate goal to avoid this sub-goal entirely
4. **Accept risk**: Document the unacceptable P×C and manage it through other means (insurance, procedures, monitoring)

For agent systems: if a required skill has high failure probability (model errors, hallucinations, edge cases) and high failure cost (produces wrong output that propagates through system), you need:
- Better skills (reduce P)
- Verification steps (reduce C through early detection)
- Alternative approaches (eliminate problematic sub-goal)
- Human-in-loop (accept risk but contain it)

The stopping rule becomes a risk identification tool. Unacceptable P×C that can't be decomposed further is a system vulnerability that demands mitigation.

## Meta-Lesson: Know What You're Optimizing For

The persistent difficulty with the stopping rule stems from asking "when should I stop?" without specifying "stop for what purpose?"

Training design needs decomposition until procedures are specified and learning objectives clear. Error prediction needs decomposition until failure modes can be identified. Interface design needs decomposition until information requirements are specified. Team coordination needs decomposition until communication patterns are clear.

There is no universal stopping point because HTA serves multiple purposes. The framework accommodates this by making the stopping decision explicit (underline, double-slash) rather than hiding it. Future analysts can see where you stopped and why, and extend if needed for different purposes.

For intelligent systems, the lesson is: decompose your problem representation to the level your current analysis requires. Don't over-specify because it seems more thorough. Don't under-specify because you want to finish quickly. Stop where you have enough information to make good decisions, and be prepared to extend later if new questions arise.

The goal hierarchy is a living document that exists only in its latest revision. Stopping is temporary. The question is not "did I stop at the right place?" but "does this level of detail support the decisions I need to make now?"

That's analytical economy: investing effort where it produces insight, stopping where further detail provides diminishing returns.