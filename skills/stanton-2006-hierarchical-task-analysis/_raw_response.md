## BOOK IDENTITY

**Title**: Hierarchical Task Analysis: Developments, Applications and Extensions

**Author**: Neville A. Stanton

**Core Question**: How can complex human-system goals be decomposed into analyzable sub-goal hierarchies that enable systematic design, error prevention, training specification, and performance improvement?

**Irreplaceable Contribution**: This book provides the definitive account of HTA's theoretical foundations, practical applications, and extensions over 37 years of continuous use. What makes it irreplaceable is its explicit articulation of the three governing principles that make HTA work, its honest confrontation with the "stopping rule" problem, and its demonstration that a goal-based (not task-based) decomposition framework can serve as a universal substrate for multiple forms of analysis. Unlike generic task analysis texts, this reveals HTA as a theory of performance grounded in control theory and goal-directed behavior, not just a notation system.

## KEY IDEAS

1. **HTA is goal-based systems analysis, not task description**: The fundamental insight is that HTA describes what a system must achieve (goals and sub-goals) rather than how people currently do things. This neutrality with respect to solutions enables the same analysis to support multiple applications: training design, error prediction, interface evaluation, and function allocation. The analysis represents a sub-goal hierarchy, not a procedural sequence.

2. **Plans are control structures that govern sub-goal triggering**: Plans specify the conditions under which sub-goals are activated, not just sequences. They encode decision logic, contingencies, parallel operations, and exit conditions. This makes HTA a model of system control, not just a flowchart. Plans contain the contextual intelligence about when and why particular sub-goals matter.

3. **The P×C stopping rule embodies a principle of analytical economy**: Analysis should continue only where (Probability of failure) × (Cost of failure) is unacceptable. This "statement of principle" directs analytical effort toward high-error-variance components rather than exhaustive decomposition. Stopping when sub-goals are "adequate" prevents over-specification while focusing on system-critical elements.

4. **The three governing principles create analytical discipline**: (1) Operations are defined by goals measured in real terms; (2) Operations decompose into sub-operations with measurable performance criteria; (3) The relationship is hierarchical inclusion, not just temporal sequence. These principles prevent HTA from degenerating into procedural lists and maintain focus on goal achievement rather than activity description.

5. **HTA serves as a framework for extended analysis, not an end in itself**: The sub-goal hierarchy is a starting point for error prediction (SHERPA), workload assessment, interface design, team coordination analysis, and function allocation. The tabular format enables systematic annotation of each sub-goal with information requirements, error modes, allocation decisions, and design constraints. HTA's endurance comes from its role as analytical infrastructure.

## REFERENCE DOCUMENTS

### FILE: goal-decomposition-as-problem-solving-substrate.md

```markdown
# Goal Decomposition as Problem-Solving Substrate: How HTA Enables Multi-Purpose Analysis

## The Core Insight: Describing What, Not How

The most profound contribution of Hierarchical Task Analysis is frequently misunderstood: HTA does not describe tasks. It describes sub-goal hierarchies. As Annett et al state in their original 1971 specification: "At the highest level we choose to consider a task as consisting of an operation and the operation is defined in terms of its goal." This distinction—between describing activities and describing purposes—is what makes HTA universally applicable across domains and analytical purposes.

Duncan (1972) emphasized that "a task description should not be biased in terms of any particular solution." This neutrality is deliberate and essential. When analyzing a video cassette recorder interface, HTA describes goals like "set recording time" rather than procedures like "press three buttons in sequence." The goal-based description remains valid regardless of whether the interface uses buttons, dials, voice commands, or direct time manipulation. The solution space remains open.

## Why Goal-Based Description Matters for Intelligent Systems

For multi-agent orchestration systems, this principle has immediate implications. When a WinDAGs agent receives a complex objective, the question is not "what sequence of skills should I invoke?" but rather "what sub-goals must be satisfied to achieve this objective?" The goal hierarchy provides the logical structure; the plans provide the control logic for when and how sub-goals are triggered.

Consider Stanton's example of emergency services responding to a hazardous chemical incident. The overall goal "Deal with chemical incident" decomposes into:
- 1. Receive notification
- 2. Gather information about incident  
- 3. Make decision about nature of incident
- 4. Deal with chemical incident (if hazard)
- 5. Resolve incident

Plan 0 specifies: "Wait until 1 then do 2 then 3 - If [hazard] then 4 then 5 then exit - Else exit"

Notice what this representation captures that a procedural task list cannot:
1. **Conditional logic**: Sub-goal 4 only triggers if a hazard condition is detected
2. **Multiple agents**: Police Control, Fire Control, Hospital, and Police Officer each have roles in different sub-goals
3. **System-level view**: The analysis spans organizational boundaries
4. **Exit conditions**: The analysis explicitly models when to stop

An intelligent agent system needs precisely this information. If you only had a procedural list "do A, then B, then C," you couldn't adapt when conditions change. The goal hierarchy with plans provides the decision structure for dynamic coordination.

## The Hierarchical Inclusion Relationship

The third governing principle states: "The important relationship between operations and sub-operations is really one of inclusion; it is a hierarchical relationship. Although tasks are often proceduralised, that is the sub-goals have to be attained in a sequence, this is by no means always the case."

This principle prevents a critical error: confusing hierarchical decomposition with temporal sequence. In the chemical incident example, sub-goal 2.1 "Hospital informs police control of casualty" can happen at any time during sub-goal 2 "Gather information about incident." The plan specifies: "Do 2.1 at any time if appropriate."

For agent systems, this means:
- **Parallel execution**: Some sub-goals can run concurrently (marked with + or "and")
- **Event-driven triggering**: Some sub-goals activate based on conditions, not sequences
- **Flexible ordering**: Some sub-goals can be satisfied in any order (marked with : or "any of")

The hierarchical inclusion relationship means that satisfying a super-ordinate goal requires satisfying all its immediate sub-ordinates, but the sequence and timing are governed by the plan, not by the decomposition structure itself.

## Sub-Goal Templates: Making Implicit Patterns Explicit

Ormerod & Shepherd (2004) formalized patterns that experienced analysts recognize intuitively. They identified sub-goal templates (SGTs) that recur across domains:

**Action Templates**:
- Activate: Make a subunit operational (switch from 'off' to 'on')
- Adjust: Regulate rate of operation while maintaining 'on' state
- Deactivate: Make subunit non-operational

**Exchange Templates**:
- Enter: Record a value in a specified location
- Extract: Obtain value of a specified parameter

**Navigation Templates**:
- Locate: Find location of target value or control
- Move: Go to given location and search it
- Explore: Browse through set of locations

**Monitoring Templates**:
- Detect: Compare system state against target to determine need for action
- Anticipate: Compare state against target to determine readiness for known action
- Transition: Compare rate of change during state transition

For agent orchestration, these templates provide a vocabulary for skill classification. A "locate" sub-goal requires search capabilities; an "anticipate" sub-goal requires predictive modeling; an "adjust" sub-goal requires continuous control. The templates help agents understand what kind of capability each sub-goal demands.

## Plans as Control Structures: Beyond Sequential Thinking

Miller, Galanter, and Pribram's (1960) TOTE (Test-Operate-Test-Exit) units directly influenced HTA's conception of plans. A TOTE unit embeds feedback: test if goal is satisfied, if not perform operation, test again, exit when satisfied.

HTA represents six basic plan types:

1. **Fixed sequence**: "Do 1 then 2 then 3" (linear, deterministic)
2. **Contingent sequence**: "If condition X then do 2, else do 3" (branching)
3. **Parallel sequence**: "Do 1 and 2 and 3 together" (concurrent)
4. **Free sequence**: "Do 1, 2, 3 in any order" (order-independent)
5. **Cyclical**: "Do 1 then 2 then 3 then repeat until condition" (iterative)
6. **Selection**: "Choose one of 1, 2, 3, 4" (exclusive choice)

Real plans often combine these types. For the police officer sub-goal 2.3 "Report nature of incident," Plan 2.3 specifies:
```
If [hazards] then 2.3.1
If [suspects] then 2.3.2 then 2.3.3
Then 2.3.4 then exit
Else exit
```

This combines contingent branching (if hazards/suspects), sequential constraints (2.3.2 must precede 2.3.3), and an unconditional step (2.3.4 always executes if any prior path was taken).

For DAG-based agent systems, plans map naturally to execution graphs where:
- Nodes represent sub-goals (skills to invoke)
- Edges represent dependencies and sequencing constraints
- Edge labels represent conditions for traversal
- The plan specifies the traversal strategy

## The Framework Enables Multiple Analyses

Stanton demonstrates that once the sub-goal hierarchy and plans exist, the same representation supports:

**Error Prediction (SHERPA)**: Each bottom-level sub-goal is classified by type (Action, Retrieval, Checking, Communication, Selection) and analyzed for credible error modes. For "Start-up column 10," potential errors include: operation omitted (A8), operation incomplete (A9), right operation on wrong object (A6).

**Function Allocation**: Each sub-goal is evaluated for assignment to human, computer, or human-computer collaboration. Marsden & Kirby use criteria like task complexity, frequency, criticality, and required knowledge to determine allocation.

**Interface Design**: Stammers & Astley extend tabular format to capture information flow (→ from system to human, ← from human to system), information assumed (prerequisite knowledge), and task classification (monitoring, procedure, fault diagnosis, etc.).

**Team Coordination**: Annett et al analyze which agents handle which sub-goals, communication patterns (send/receive information, discussion), and coordination patterns (collaboration, synchronization).

**Workload Assessment**: By estimating duration, frequency, and cognitive demand for each sub-goal, analysts can identify bottlenecks and overload conditions.

The power comes from analyzing the same goal hierarchy from multiple perspectives. A sub-goal might be low-error-risk but high-workload, or assigned to wrong agent, or missing required information. The tabular format allows systematic annotation.

## When This Framework Applies (and When It Doesn't)

HTA assumes goal-directed behavior. It works when:
- System purpose can be articulated as goals
- Goals can be decomposed into sub-goals
- Performance criteria exist for goal satisfaction
- Control logic governs sub-goal triggering

HTA struggles with:
- **Opportunistic behavior**: When actors respond to situations without clear goals
- **Exploratory activity**: When the goal is to discover what goals should be
- **Purely reactive systems**: When there's no goal beyond "respond to inputs"
- **Highly emergent coordination**: When system behavior arises from local interactions without hierarchical structure

Miller & Vicente (2001) note HTA doesn't naturally represent:
- Physical object relationships and constraints
- Causal propagation through system
- Multiple simultaneous purposes that conflict
- Deep domain knowledge and why certain approaches work

For agent systems, this means HTA provides the "what must be achieved and when" structure, but needs complementary representations for "why it works this way" (domain models), "what objects exist and how they relate" (system architecture), and "how constraints propagate" (dependency analysis).

## Implications for Agent Orchestration

When a complex task enters WinDAGs:

1. **First pass: Goal decomposition**: What is the overall objective? What sub-objectives must be satisfied? This creates the hierarchical structure.

2. **Second pass: Plan specification**: Under what conditions is each sub-goal triggered? What must complete before what? What can run in parallel? This creates the control logic.

3. **Third pass: Skill mapping**: For each bottom-level sub-goal, what capability is required? This maps to available skills in the system.

4. **Fourth pass: Agent assignment**: Which agent has required capabilities? Are there coordination constraints? This creates the execution plan.

5. **Fifth pass: Error analysis**: Where can things go wrong? What are consequences? What recovery is possible? This creates the resilience strategy.

The goal hierarchy serves as the organizing structure for all subsequent analysis. Without it, you have a flat collection of skills with no organizing principle. With it, you have a system model that can be analyzed, optimized, and executed.

## The Meta-Lesson: Decomposition Strategy Matters

HTA succeeds because it decomposes by purpose (goals) rather than by activity (tasks), time (sequences), or agent (roles). This creates a representation that:
- **Transcends implementation**: Same goal structure, different realization strategies
- **Supports multiple analyses**: Error, workload, allocation, coordination all use same substrate
- **Scales hierarchically**: Refine where needed, stop where adequate
- **Captures control logic**: Plans encode the intelligence about when goals matter

For building intelligent systems, the lesson is: decompose your problem space by the objectives that must be achieved, then layer in the control logic for how those objectives coordinate. Don't start with "here's a sequence of things to do." Start with "here's what must be accomplished, and here's when each part matters."

The sub-goal hierarchy is your system's logical architecture. Everything else—skills, agents, interfaces, error handling—organizes around it.
```

### FILE: stopping-rule-and-analytical-economy.md

```markdown
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
```

### FILE: plans-as-coordination-intelligence.md

```markdown
# Plans as Coordination Intelligence: Encoding Context and Control

## Plans vs. Hierarchies: The Division of Labor

The hierarchical structure of HTA answers "what must be achieved" while plans answer "when, why, and under what conditions." Annett et al (1971) state: "Although tasks are often proceduralised, that is the sub-goals have to be attained in a sequence, this is by no means always the case."

This separation is crucial for intelligent systems. The sub-goal hierarchy provides the logical dependencies (achieving goal X requires achieving sub-goals A, B, and C) while plans provide the control logic (do A first, then B only if condition Z holds, and C in parallel with B).

Consider this distinction:
- **Hierarchy says**: "To operate radiator line, you must operate control panel, control cross welder, and control seam welder"
- **Plan says**: "Do these operations in sequence, and if cross welder piles up, interrupt to clear, then resume"

The hierarchy is static logical structure. The plan is dynamic control logic. Both are necessary; neither is sufficient.

## The Six Basic Plan Types and Their Semantics

Shepherd (2001) catalogs six fundamental plan patterns:

### 1. Fixed Sequence (S1)
**Syntax**: Do X then Y then Z  
**Semantics**: Sub-goals must execute in specified order; each must complete before next begins  
**Use case**: Steps with dependencies (can't test system before you build it)  
**Agent implication**: Sequential dependencies in DAG; downstream nodes wait for upstream completion

### 2. Contingent Sequence (S2)
**Syntax**: If condition C then do X, else do Y  
**Semantics**: Sub-goal selection depends on runtime conditions  
**Use case**: Branching based on system state, error conditions, or external events  
**Agent implication**: Conditional edges in DAG; need runtime evaluation of condition C

### 3. Parallel Sequence (S3)
**Syntax**: Do X and Y and Z together  
**Semantics**: Sub-goals execute concurrently; all must complete for super-ordinate goal success  
**Use case**: Independent sub-goals that can overlap (gather data from multiple sources)  
**Agent implication**: Parallel branches in DAG; requires coordination at merge point

### 4. Free Sequence (S4)
**Syntax**: Do X, Y, Z in any order  
**Semantics**: Sub-goals are order-independent; any completion sequence is valid  
**Use case**: Tasks with no interdependencies (collect three independent pieces of information)  
**Agent implication**: Any topological ordering of these nodes is valid; optimizer can choose sequence

### 5. Cyclical Plan
**Syntax**: Do X then Y then Z, repeat until condition C  
**Semantics**: Sub-goal sequence repeats until exit condition satisfied  
**Use case**: Iterative refinement, monitoring loops, trial-and-error approaches  
**Agent implication**: Loop structure in DAG; needs condition evaluation for exit

### 6. Selection Plan
**Syntax**: Choose one of X or Y or Z  
**Semantics**: Exactly one sub-goal executes; others are alternatives  
**Use case**: Multiple strategies for achieving goal; pick most appropriate  
**Agent implication**: Exclusive branches in DAG; selection logic needed upfront

Real plans combine these primitives. From the chemical incident example, Plan 2.2:
```
Do 2.2.1 (send officer to scene)
then 2.2.2 (officer arrives)  
then 2.2.3 (search scene)
Until [suspects] or [hazards]
then exit
```

This combines:
- Fixed sequence (2.2.1 → 2.2.2 → 2.2.3)
- Cyclical (repeat search until condition)
- Selection (exit on suspects OR hazards)

## Plans Encode Three Types of Intelligence

### 1. Sequencing Intelligence: Temporal Constraints

Some sub-goals must precede others due to:
- **Causal dependencies**: Output of A is input to B
- **Physical constraints**: Must open door before walking through
- **Resource constraints**: Must acquire lock before critical section
- **State dependencies**: System must be in state S before action X is valid

Plan notation makes these explicit: "1 then 2 then 3" vs "1 and 2 and 3" vs "1 or 2 or 3"

For multi-agent systems, sequencing intelligence determines:
- Which skills can run in parallel
- Which must serialize
- What synchronization points exist
- Where agents must coordinate handoffs

### 2. Conditional Intelligence: Context-Dependent Behavior

Some sub-goals only make sense under specific conditions:
- **State-dependent**: "If system is in error state then diagnose, else monitor"
- **Resource-dependent**: "If budget remains then optimize, else proceed with current solution"
- **Risk-dependent**: "If hazard detected then escalate, else continue normal operation"
- **Information-dependent**: "If suspects present then question, else search more"

The chemical incident plan shows sophisticated conditional logic:
```
Plan 2.3: If [hazards] then 2.3.1 (identify hazard)
         If [suspects] then 2.3.2 (capture) then 2.3.3 (question)
         Then 2.3.4 (inform control)
         Else exit
```

This encodes: hazard identification is independent of suspects, but suspect questioning depends on capture, and control is always informed if any action was taken, but exit immediately if neither hazards nor suspects found.

For agents, conditional intelligence means:
- Not every sub-goal in hierarchy executes in every instance
- Runtime conditions determine actual execution path
- Agents need ability to evaluate conditions
- Plan structure must be traversable, not just declared

### 3. Prioritization Intelligence: What Matters When

Some sub-goals can interrupt others:
- **Emergency conditions**: Safety-critical sub-goals preempt normal operation
- **Time-sensitive events**: Deadlines force reordering
- **Opportunity windows**: External events create brief windows for action
- **Resource availability**: Scarce resources becoming available triggers waiting sub-goals

The notation "Do 2.1 at any time if appropriate" in the chemical incident plan indicates: hospital notification can interrupt normal information gathering flow because casualty report is time-critical.

For agents, prioritization intelligence requires:
- Monitoring for interrupt conditions while executing normal plans
- Ability to suspend current sub-goal and resume later
- Priority levels for different sub-goals
- Deadlock prevention when multiple interrupts conflict

## Plans Make Error Recovery Explicit

Plans specify not just success paths but error paths. Consider the VCR programming task (table sixteen in source). Plan 4.4 says "Wait for 5 seconds." This seems odd—why encode waiting?

Because if user doesn't wait, the system won't accept start time input. The plan makes explicit: there's a timing constraint. Failure mode: "Fail to wait" (error A1). Consequence: "Start time not set." Recovery: "Task 4.5" (press Off button to proceed to finish time anyway).

The plan structure reveals:
- What can go wrong (violating plan constraints)
- What happens when it does (consequences)
- How to recover (alternative paths or retry)

For agent systems, this means plans should encode:
- **Success conditions**: When to proceed to next sub-goal
- **Failure conditions**: When current sub-goal cannot be satisfied
- **Recovery paths**: Alternative sub-goals or retry strategies
- **Exit conditions**: When to abandon this branch and report failure upward

## Dynamic Plans: When Control Logic Changes at Runtime

Most HTA examples show static plans—the control logic is fixed at design time. But real systems often need dynamic plans where control logic adapts:

**Learning-based adaptation**: "If previous attempt using strategy A failed, try strategy B next time"

**Resource-based adaptation**: "If compute budget exceeded, switch from exhaustive search to heuristic search"

**Performance-based adaptation**: "If throughput drops below threshold, increase parallelism"

**Context-based adaptation**: "If user expertise level is high, skip confirmation steps"

Annett (2004) proposes "dynamic programmable task models" as future extension. The idea: plans that modify themselves based on:
- Performance history
- Environmental conditions  
- Resource availability
- Learned policies

For agent orchestration, this suggests:
- Plans as executable code, not just declarations
- Plans that contain adaptation logic
- Monitoring that feeds back to plan modification
- Meta-plans that select among alternative plans

## The Missing Piece: Why Plans Matter

Miller & Vicente (2001) critique HTA for lacking representation of "causal understanding" and "why certain approaches work." But plans actually encode much of this:

**Causal understanding is in sequencing constraints**: "Must X before Y" implies X causes precondition for Y

**Strategic understanding is in contingent plans**: "If A then X else Y" implies understanding that approach depends on context

**Resource understanding is in parallel vs sequential**: "Do X and Y together" implies they don't compete for resources; "Do X then Y" may imply they do

**Risk understanding is in optional steps**: "Do X, optionally do Y, then Z" implies Y is refinement or verification, not essential

What plans don't encode well:
- **Deep causal models**: Why does X cause Y? Through what mechanism?
- **Physical constraints**: What spatial/temporal/resource relationships exist?
- **Trade-off spaces**: Why is plan P1 better than P2 under conditions C?

Plans give you the "what to do when," but not always the "why it works." For intelligent agents, this means plans should be augmented with:
- Precondition/postcondition specifications (what X achieves)
- Resource requirements (what X consumes/produces)
- Uncertainty estimates (how confident are we in X's success)
- Trade-off annotations (why we chose X over alternatives)

## Practical Implications for Agent Orchestration

When translating HTA plans to agent execution:

**Fixed sequences become dependency chains**: SubgoalX.output → SubgoalY.input

**Conditional plans become routing logic**: Evaluate condition C, route to appropriate skill invocation

**Parallel plans become concurrent tasks**: Launch multiple agents, synchronize at barrier

**Cyclical plans become monitoring loops**: Execute subgoal, check condition, decide continue/exit

**Selection plans become decision nodes**: Evaluate selection criteria, invoke chosen skill

**Free sequence plans become optimization problems**: Find lowest-cost ordering of independent sub-goals

The key insight: plans are executable specifications of coordination. They're not documentation of how things currently work; they're programs for how agents should behave. The plan syntax maps naturally to:
- Workflow languages (BPEL, BPMN)
- Process calculi (CSP, π-calculus)
- Dataflow graphs (Apache Beam, TensorFlow)
- Reactive programming (Rx, reactive streams)

## When Plans Break Down: Limits of Hierarchical Control

HTA assumes hierarchical control where super-ordinate goals govern subordinates through plans. This breaks down when:

**Emergent coordination**: System behavior arises from local agent interactions, not central plan. Example: ant colony optimization, market dynamics, stigmergy.

**Reactive agents**: Agents respond to immediate stimuli without consulting plan. Example: subsumption architecture, behavior-based robotics.

**Negotiation-based coordination**: Agents bargain for resources or task assignments rather than following predetermined plan. Example: contract net protocol, auction-based allocation.

**Opportunistic problem-solving**: Agents exploit unexpected opportunities that weren't in original plan. Example: creative design, exploratory programming.

For these cases, HTA provides initial structure but runtime coordination uses different mechanisms. The hierarchy remains useful for:
- Defining what needs to be achieved (goal structure)
- Identifying coordination points (where agents interact)
- Analyzing failure modes (what could go wrong)

But actual execution may follow emergence rather than plan.

## Meta-Lesson: Coordination Requires Explicit Control Logic

The separation of hierarchy (logical structure) and plans (control logic) is HTA's deepest contribution. Many system representations conflate these:
- Flowcharts show sequences but hide goal structure
- Entity-relationship diagrams show objects but hide processes
- Sequence diagrams show interactions but hide goal satisfaction

HTA maintains both simultaneously. The hierarchy provides stable logical framework. Plans provide flexible control that can be modified without restructuring hierarchy.

For agent systems: don't bake control flow into your system architecture. Represent goals hierarchically, encode plans separately, allow plans to evolve. The goal of "analyze security vulnerabilities" remains stable even as the plan for how to do it changes from "rule-based scanning" to "LLM-based analysis" to "hybrid approach."

Plans are where system intelligence lives. They're not bureaucratic overhead—they're executable knowledge about coordination. Get the plans right, and the system exhibits intelligent behavior. Get them wrong, and even correct sub-goals executed correctly produce system failure.

The quality of an agent orchestration system is largely determined by the quality of its plan representation and execution.
```

### FILE: hta-as-springboard-for-specialized-analysis.md

```markdown
# HTA as Springboard for Specialized Analysis: The Framework Pattern

## The Central Value Proposition

Staples (1993) reports on HTA use in nuclear reactor design where "the sub-goal hierarchy was produced through reviews of contemporary operating procedures, discussions with subject matter experts, and interviews with operating personnel." Crucially, this HTA was then used for: error analysis, interface design verification, training procedures, operating procedures, workload assessment, and communication analysis.

One analysis, six applications. This is HTA's leverage: invest once in goal decomposition, reuse for multiple analytical purposes. Stanton captures this: "HTA was never meant to be the end point in the analyses, just the start."

## Why Sub-Goal Hierarchies Enable Multiple Analyses

The sub-goal representation is analytically neutral. It describes what must be achieved without prescribing:
- **How**: Implementation strategy remains open
- **Who**: Agent assignment remains unspecified  
- **When**: Absolute timing remains flexible
- **Where**: Physical location remains abstract

This neutrality creates a substrate for specialized annotation. The tabular format provides the mechanism: additional columns capture analysis-specific information while preserving the sub-goal structure.

Consider the evolution of tabular formats:

**Original (Annett 1971)**: Description | I/F difficulties | Action difficulties

**Shepherd (1976)**: Super-ordinate | Task component | Reason for stopping | Performance notes

**Stammers & Astley (1987)**: + Information flow | Information assumed | Task classification

**Gramopadhye & Thaker (1998)**: + Allocation | Human input | Computer input | Coordination | Cognitive demand | Errors | Consequences | Duration | Frequency | Who | Knowledge | Skill level | Complexity | Criticality

Each extension adds analytical capability without changing the core sub-goal hierarchy. The framework accommodates new analyses by adding columns, not restructuring the hierarchy.

## Five Major Extension Patterns

### Pattern 1: Error Analysis (SHERPA)

**Core idea**: Each sub-goal has credible error modes determined by task type.

**Process**:
1. Classify each bottom-level sub-goal: Action, Retrieval, Checking, Communication, Selection
2. For each type, identify credible errors from taxonomy (e.g., Action errors: A1-operation too long/short, A2-mistimed, A3-wrong direction, etc.)
3. Estimate error probability (H/M/L) and criticality (H/M/L)
4. Assess recovery possibility
5. Propose design remedies

**Example** (VCR programming):
- Sub-goal 1.2 "Check clock time"
- Error C1: Omit to check clock → Consequence: VCR clock may be incorrect → Recovery: None → P: Low, C: High → Remedy: Automatic clock setting via radio signal

**Why hierarchy matters**: Errors propagate upward. If "check clock" fails (1.2), then "prepare VCR" fails (1), then entire programming task fails (0). The hierarchy traces error impact.

**Agent system implication**: For each skill invocation, what error modes are credible? What happens if this skill fails? Can we detect failure? Can we recover? Error analysis requires the goal context that hierarchy provides—knowing what a sub-goal is trying to achieve tells you what it means to fail.

### Pattern 2: Interface Requirements (Stammers & Astley)

**Core idea**: Each sub-goal requires information input, produces information output, and assumes prerequisite knowledge.

**Added columns**:
- Information flow to interface (→)
- Information flow from interface (←)
- Information assumed (prerequisite knowledge)
- Task classification (monitoring, procedure, fault diagnosis, decision making, problem solving, operation)

**Example** (coal preparation plant):
- Sub-goal 2 "Run plant normally"
- Info flow: ← plant operation & monitoring, → control information
- Assumed: knowledge of plant flows and operational procedures
- Classification: operation + monitoring

**Why hierarchy matters**: Information flows between levels. Sub-goal 2.3 might produce output that becomes input to sub-goal 2.4. The hierarchy traces information dependencies.

**Agent system implication**: What information does each skill need? What does it produce? What domain knowledge must agents possess? Interface requirements are about information architecture—the hierarchy shows information flow from sensing (bottom) through processing (middle) to decision (top).

### Pattern 3: Function Allocation (Marsden & Kirby)

**Core idea**: Each sub-goal can be assigned to human, computer, or human-computer collaboration based on capabilities and constraints.

**Process**:
1. Decompose until sub-goals are allocation candidates (just before implementation details)
2. For each sub-goal, evaluate criteria: complexity, frequency, consequences of error, required expertise, need for judgment, workload, etc.
3. Assign: H (human only), H-C (human with computer support), C-H (computer with human oversight), C (computer only)
4. Review overall allocation for job satisfaction, error potential, workload balance, cost-effectiveness
5. Iterate if conflicts found

**Example** (brewery production):
- Sub-goal 1.1 "Forecast demand": Assigned H (requires judgment about market conditions)
- Sub-goal 1.2.2 "Adjust for production min/max": Assigned C (algorithmic constraint checking)
- Sub-goal 1.3.5 "Negotiate with suppliers": Assigned H (requires relationship management)

**Why hierarchy matters**: Allocation at wrong level causes problems. Allocate too high (entire super-ordinate goal to human or computer) and you miss opportunities for collaboration. Allocate too low (individual button presses) and you over-specify implementation. The hierarchy lets you find the right level.

**Agent system implication**: Which sub-goals map to AI skills? Which need human oversight? Which need human-AI collaboration? Allocation analysis reveals where automation helps, where it hinders, and where hybrid approaches work best. The hierarchy shows allocation patterns—maybe all "monitoring" sub-goals are automated but "decision-making" sub-goals need human confirmation.

### Pattern 4: Team Coordination (Annett et al)

**Core idea**: Each sub-goal involves specific team members engaged in communication and coordination activities.

**Added information**:
- Team member assignment per sub-goal
- Communication: send information, receive information, discussion
- Coordination: collaboration (work sharing), synchronization (timing)
- Teamwork description (narrative of interaction pattern)

**Example** (anti-submarine warfare):
- Sub-goal 1.1.2.2 "Check chart for known feature"
- Team members: Sonar operator, Active Sonar Director, Principal Warfare Officer, Officer of Watch, Action Picture supervisor, Electronic Warfare team, Radar team, Missile Director
- Communication: Sonar operator → Director → PWO calls "Chart check, poss. sub BRG/RG" → Officer plots → Director directs Sonar Controller → All check and report results
- Coordination: Parallel checking (Electronic Warfare, Radar, Visual all check simultaneously)

**Why hierarchy matters**: Coordination happens at different levels. Super-ordinate goal "Identify threats" requires continuous information sharing. Sub-goal "Check chart" requires synchronous multi-agent action. The hierarchy shows where tight coordination is needed vs. loose coupling.

**Agent system implication**: Which agents own which sub-goals? What information flows between them? Where must they synchronize? Where can they work independently? Team analysis reveals the coordination architecture—not just "these agents collaborate" but specifically how and when.

### Pattern 5: Workload Assessment

**Core idea**: Each sub-goal has duration, frequency, and cognitive demand that accumulates to total workload.

**Added columns**:
- Duration (time estimate)
- Frequency (how often performed)
- Cognitive demand (low/medium/high)
- Physical demand
- Concurrent activities

**Analysis**:
- Sum duration × frequency for total time load
- Identify peaks where multiple high-demand sub-goals occur simultaneously
- Find bottlenecks where critical path is overloaded
- Assess if human/agent has capacity

**Why hierarchy matters**: Workload propagates upward but distributes downward. If super-ordinate goal has 10 sub-goals, workload is sum of subordinates. But some subordinates may be parallel (divide workload) vs. sequential (add workload). The hierarchy with plans shows workload distribution.

**Agent system implication**: What's the computational budget? Where are processing bottlenecks? Can we parallelize high-workload sub-goals? Should we allocate more resources or simplify requirements? Workload analysis identifies where system will struggle before you deploy.

## The Extension Pattern: Systematic Annotation

All five extensions follow the same pattern:

1. **Take sub-goal hierarchy as given**: Don't restructure; analyze existing decomposition
2. **Add analytical columns/annotations**: Extend tabular format or create complementary representation
3. **Analyze each sub-goal systematically**: Work through hierarchy level by level
4. **Trace relationships through hierarchy**: How do errors/information/workload propagate?
5. **Synthesize findings at super-ordinate levels**: What do subordinate analyses imply for super-ordinates?
6. **Propose interventions**: Based on analysis, what should change?

This systematic approach is why HTA enables rigorous analysis. You're not hand-waving about "possible errors" or "workload concerns"—you're analyzing each sub-goal against explicit criteria and tracing implications through structure.

## Combining Multiple Analyses: The Mega-Table

Gramopadhye & Thaker (1998) demonstrate combining allocations, information requirements, errors, consequences, duration, frequency, agent assignment, knowledge requirements, skill level, complexity, and criticality in one table.

Why do this? Because design decisions interact:
- **Allocation affects workload**: Assigning sub-goal to computer changes cognitive demand on human
- **Errors affect interface**: High-error sub-goals need better information display  
- **Complexity affects allocation**: Highly complex sub-goals may need human judgment
- **Frequency affects criticality**: Frequent low-consequence errors may accumulate to high overall cost

The mega-table makes trade-offs visible. Example: Sub-goal X is high complexity, high criticality, high frequency. Analysis shows:
- Should assign to experienced operator (allocation)
- Needs comprehensive information display (interface)
- High error potential (needs verification step)
- Creates workload peak when concurrent with sub-goal Y (needs scheduling)

Without combined view, you optimize locally and create problems globally. With combined view, you see system-level patterns.

For agent orchestration: don't analyze error prediction separately from workload separately from allocation. Analyze together. The sub-goal that's high-error-risk might also be high-workload, suggesting you should either allocate to more capable agent or decompose further to reduce complexity.

## When Extensions Conflict: The Design Trade-Off Problem

Different analyses recommend different solutions:

**Error analysis says**: Decompose sub-goal X further to identify specific error modes  
**Workload analysis says**: Sub-goal X is already creating bottleneck; further decomposition increases coordination overhead

**Allocation analysis says**: Assign sub-goal Y to human for judgment  
**Interface analysis says**: Information required for sub-goal Y not available in human-accessible form

**Team analysis says**: Sub-goal Z requires synchronization of three agents  
**Performance analysis says**: Synchronization overhead makes sub-goal Z too slow

These conflicts are features, not bugs. They reveal design trade-offs that must be explicitly resolved:
- Accept higher error risk to maintain workload?
- Redesign information architecture to enable human allocation?
- Loosen synchronization requirements or allocate more time?

The sub-goal hierarchy provides a common framework for negotiating trade-offs. Rather than arguing abstractly about "reliability vs. efficiency," you argue concretely about "sub-goal 2.3.4 needs tighter error checking, but that adds 200ms latency—can we afford it in the context of super-ordinate goal 2.3's timing requirements?"

## The Limitation: Analysis Depth vs. Analysis Breadth

You can analyze deeply (many extensions on small hierarchy) or broadly (few extensions on large hierarchy) but not both exhaustively. The analytical space is too large.

Practical approach:
1. **First pass**: Broad, shallow analysis across entire hierarchy to identify hot spots
2. **Second pass**: Deep analysis on critical sub-goals identified in first pass
3. **Third pass**: Validate that deep analysis conclusions don't create problems elsewhere

This is analytical economy again: focus effort where it matters. Not every sub-goal needs error prediction, workload assessment, interface specification, and allocation analysis. But high-P×C sub-goals might need all of them.

## Meta-Lesson: Reusable Structure Enables Analytical Leverage

Software engineering has design patterns. HTA's contribution is an analytical pattern: decompose problem into goal hierarchy, then apply systematic analytical extensions.

This pattern transfers beyond ergonomics:
- **Software architecture**: Decompose system into modules (hierarchy), then analyze coupling (information flow), failure modes (error analysis), performance (workload), deployment (allocation)
- **Project planning**: Decompose project into work packages (hierarchy), then analyze dependencies (plans), risks (errors), resource needs (workload), assignments (allocation)
- **Business process**: Decompose process into activities (hierarchy), then analyze data flow (information), bottlenecks (workload), automation opportunities (allocation), quality risks (errors)

The pattern is: create neutral logical structure, then layer analytical perspectives. The structure provides stability; the perspectives provide insight.

For AI agent orchestration, this means: invest in clean goal decomposition upfront, then you can:
- Route tasks to appropriate agents (allocation)
- Predict failure modes (error analysis)
- Estimate compute requirements (workload)
- Design monitoring and observability (information flow)
- Optimize coordination (team analysis)

All from the same sub-goal hierarchy. That's leverage. That's why HTA endures after 37 years. The framework enables analytical flexibility without requiring analytical reinvention.
```

### FILE: three-governing-principles-of-goal-based-systems.md

```markdown
# The Three Governing Principles: Theoretical Foundations of Goal-Based System Analysis

## Why Principles Matter

Annett et al (1971) ground HTA in explicit theoretical principles, not heuristic guidelines. They write: "the methodology is based upon a theory of human performance" and propose "three questions as a test for any task analysis method": Does it lead to positive recommendations? Does it apply to more than a limited range? Does it have theoretical justification?

Many contemporary methods fail these tests. They provide notation without theory, or domain-specific techniques without transfer. HTA succeeds because its three principles create analytical discipline that transcends specific applications.

Understanding these principles is essential for intelligent system design because they reveal *why* goal-based decomposition works, not just *how* to do it.

## Principle 1: Operations Defined by Goals in Real Terms

**Statement**: "At the highest level we choose to consider a task as consisting of an operation and the operation is defined in terms of its goal. The goal implies the objective of the system in some real terms of production units, quality or other criteria."

**What this means**: Every operation exists to achieve a goal measurable by objective criteria. You describe what the operation achieves, not what it does.

**Example contrast**:
- Task description: "Press button A, wait 3 seconds, press button B"
- Goal description: "Set recording start time to desired value"

The task description is procedural. The goal description is purposeful. The goal remains constant even if implementation changes (voice interface, direct time manipulation, scheduled recording from EPG).

**Theoretical grounding**: Goals provide stable anchoring points in a changing system. Miller, Galanter & Pribram (1960) argued behavior is organized by goals, not reflexes or stimulus-response chains. HTA operationalizes this by requiring every operation have an explicit, measurable goal.

**The "real terms" requirement**: Goals must be observable and verifiable. Not "understand the situation" but "identify hazard type and location." Not "make good decision" but "select action that reduces incident severity while maintaining safety margins." Real terms means someone can test whether goal is satisfied.

### Implications for Agent Systems

When designing agent skills, the first principle demands:
- **Every skill has explicit success criteria**: Not "analyze the code" but "identify all SQL injection vulnerabilities with <5% false positive rate"
- **Criteria are measurable**: Either objectively (test coverage ≥90%) or through defined evaluation (security expert review confirms findings)
- **Goals are outcome-focused**: Not "run static analysis tools" but "produce validated list of security issues"

This changes how you think about agent capabilities. Instead of cataloging what tools agents can use, you catalog what goals they can achieve. Skills become goal-achievement capabilities, not function invocations.

Practical consequence: When a complex task arrives, you decompose it by asking "what goals must be achieved?" not "what functions should we call?" The goal structure determines the skill invocation pattern, not vice versa.

## Principle 2: Hierarchical Decomposition with Performance Standards

**Statement**: "The operation can be broken down into sub-operations each defined by a sub-goal again measured in real terms by its contribution to overall system output or goal, and therefore measurable in terms of performance standards and criteria."

**What this means**: Every goal decomposes into sub-goals, and every sub-goal inherits the requirement for measurable performance standards. The hierarchy isn't arbitrary—sub-goals must logically contribute to super-ordinate goals.

**The measurement cascade**: If super-ordinate goal is "respond to chemical incident within 30 minutes with zero injuries," then subordinate goals like "identify hazard" must have compatible standards: "identify hazard type within 5 minutes with 95% accuracy." Sub-goal performance standards aggregate to determine super-ordinate goal achievement.

**Theoretical grounding**: This implements means-end analysis from problem-solving theory. To achieve end E, identify means M₁, M₂, ..., Mₙ that collectively produce E. Then recursively apply to each means. The hierarchy represents the means-end tree.

### The Contribution Criterion

Each sub-goal must contribute to its super-ordinate. This prevents spurious decomposition:

**Invalid**: "To write software" → "Learn Python" + "Take vacation" + "Write code"  
(Taking vacation doesn't contribute to writing software)

**Valid**: "To write software" → "Specify requirements" + "Design architecture" + "Implement code" + "Test system"  
(Each contributes; satisfying all four achieves super-ordinate)

The contribution test: If sub-goal X fails, can super-ordinate goal Y succeed? If yes, X doesn't contribute. If no, X is necessary (though perhaps not sufficient).

### Implications for Agent Systems

The second principle demands:
- **Hierarchical skill composition**: Complex skills decompose into simpler skills
- **Success propagation**: If all sub-skills succeed, super-skill succeeds
- **Failure propagation**: If any critical sub-skill fails, super-skill may fail
- **Performance estimation**: Super-skill performance is function of sub-skill performance

Example: "Code review" skill decomposes into:
- "Check style compliance" (measurable: violations per 1000 lines)
- "Identify logic errors" (measurable: defects found vs. ground truth)
- "Assess test coverage" (measurable: percentage coverage)
- "Evaluate documentation" (measurable: documentation score)

Overall "code review quality" is composite of these four. If you can estimate each sub-skill's performance, you can estimate overall performance. This enables:
- **Predictive scheduling**: "This task requires X minutes based on subtask estimates"
- **Resource allocation**: "This subtask is bottleneck; allocate more capable agent"
- **Quality assurance**: "Subtask Y has high error rate; add verification step"

The hierarchy lets you reason about system performance from component performance. That's powerful for orchestration.

## Principle 3: Hierarchical Inclusion, Not Procedural Sequence

**Statement**: "The important relationship between operations and sub-operations is really one of inclusion; it is a hierarchical relationship. Although tasks are often proceduralised, that is the sub-goals have to be attained in a sequence, this is by no means always the case."

**What this means**: The hierarchy represents logical necessity (must have X to achieve Y), not temporal ordering (do X before Y). Sequencing is specified separately in plans.

**The inclusion relationship**: Super-ordinate goal G includes sub-ordinates A, B, C means: achieving G requires achieving A AND B AND C. But it doesn't specify when or in what order.

**Why this matters**: It separates logical structure (what's needed) from execution strategy (how to get it). The same logical structure supports multiple execution strategies:
- Sequential: A → B → C (if dependencies exist)
- Parallel: A ∥ B ∥ C (if independent)
- Conditional: A, maybe B, then C (if B depends on conditions)
- Iterative: repeat A, B, C until done (if refinement needed)

**Theoretical grounding**: This reflects the distinction between declarative (what must be true) and procedural (how to make it true) knowledge. The hierarchy is declarative; plans are procedural.

### The Anti-Proceduralization Principle

HTA deliberately resists proceduralization at the hierarchical level. The hierarchy should be stable across different execution contexts. Plans change; hierarchy doesn't.

Example: "Prepare meal" decomposes into:
- Get ingredients
- Prepare ingredients
- Cook ingredients
- Serve meal

This decomposition is stable whether you're making breakfast (15 minutes, simple) or dinner party (3 hours, complex). What changes is the plans:
- Breakfast plan: Sequential (get → prepare → cook → serve)
- Dinner party plan: Parallel (prepare multiple dishes simultaneously) with synchronization (serve all together)

Same hierarchy, different plans. This is only possible because hierarchy doesn't encode sequencing.

### Implications for Agent Systems

The third principle demands:
- **Separation of logical and temporal structure**: DAG structure (logical) is separate from execution schedule (temporal)
- **Plan flexibility**: Same task decomposition, multiple execution strategies
- **Optimization opportunities**: If sub-goals are independent (no sequential constraint), optimizer can reorder for efficiency
- **Adaptation support**: When context changes, revise plan but maintain hierarchy

Example: "Analyze codebase for vulnerabilities" decomposes into:
- Parse code structure
- Identify data flows
- Check for vulnerability patterns
- Validate findings

Logical inclusion: Need all four for complete analysis.

Execution strategies:
- **Fast mode**: Sequential pass, pattern matching only
- **Thorough mode**: Iterative refinement, manual validation
- **Parallel mode**: Multiple agents analyze different modules simultaneously
- **Incremental mode**: Analyze changed files only, reuse previous results

Same hierarchy, four different plans. Agent orchestrator can select appropriate plan based on:
- Time available
- Quality requirements
- Resource availability
- Codebase characteristics

This flexibility is only possible because logical structure (hierarchy) doesn't constrain temporal structure (plan).

## How Principles Interact: The Unified Theory

The three principles form a coherent theory of goal-directed systems:

**Principle 1** grounds operations in observable goals  
→ Enables objective evaluation of success/failure

**Principle 2** establishes hierarchical means-end decomposition  
→ Enables compositional reasoning about system performance

**Principle 3** separates logical structure from execution strategy  
→ Enables flexible adaptation and optimization

Together they provide:
- **Analytical rigor**: Every claim about system is grounded in measurable goals
- **Compositional structure**: Complex systems understood through simpler components
- **Execution flexibility**: Same logical structure, multiple realization strategies
- **Error localization**: Failures traced through goal hierarchy to root cause

## What These Principles Rule Out

Understanding what the principles prevent is as important as what they enable:

**Ruled out**: Pure activity description without goals  
**Because**: Principle 1 requires measurable goals

**Ruled out**: Flat (non-hierarchical) task lists  
**Because**: Principle 2 requires means-end decomposition

**Ruled out**: Fixed procedural sequences  
**Because**: Principle 3 requires logical inclusion without temporal constraints

**Ruled out**: Subjective success criteria  
**Because**: Principle 1 requires "real terms" measurement

**Ruled out**: Single-level analysis  
**Because**: Principle 2 requires hierarchical refinement

These constraints force analytical discipline. You can't wave hands about "the system should work well"—you must specify measurable goals. You can't dump all tasks in flat list—you must identify logical dependencies. You can't hard-code single execution path—you must separate logical from temporal structure.

## When Principles Don't Apply: Boundary Conditions

The three principles assume goal-directed behavior. They don't apply well to:

**Reflexive/reactive systems**: Behavior triggered by stimuli without goal mediation (e.g., thermostat, simple control loops)

**Exploratory behavior**: Goal is to discover what goals should be (research, creative design)

**Emergent systems**: System-level behavior arises from local interactions without hierarchical goal structure (swarms, markets)

**Purely data-driven systems**: Processing driven by data arrival, not goal achievement (streaming systems)

For agent systems, this means HTA works best for:
- Task-oriented problems with clear objectives
- Systems where success is definable and measurable  
- Problems decomposable into sub-problems
- Situations requiring coordinated goal-directed action

HTA works less well for:
- Open-ended exploration ("find something interesting")
- Emergent coordination (market-based agent systems)
- Pure data transformation (ETL pipelines)
- Real-time reactive control (continuous motor control)

## Meta-Lesson: Theory Enables Transfer

The three principles are why HTA transfers across domains. They're not specific to nuclear power plants or emergency response or VCR programming. They apply to any goal-directed system:
- Software development (goals: working code, passing tests, documentation)
- Medical diagnosis (goals: identify condition, prescribe treatment, monitor recovery)
- Business processes (goals: customer satisfaction, profitability, compliance)
- Scientific research (goals: validated findings, reproducible methods, published results)

For building intelligent agent systems, the lesson is: ground your decomposition strategy in theoretical principles, not heuristics. Don't say "we decompose tasks this way because it seems to work." Say "we decompose by goals because goals provide stable, measurable, hierarchical structure that enables compositional reasoning and flexible execution."

Principles → Structure → Analysis → Design. That's the chain. HTA's three principles create structure that enables analysis that informs design.

When you're building a multi-agent orchestration system and someone asks "why do we decompose tasks this way?", you can point to theoretical foundations:
- Goals enable measurable success criteria (Principle 1)
- Hierarchical decomposition enables compositional performance reasoning (Principle 2)
- Logical inclusion without temporal constraints enables execution flexibility (Principle 3)

That's not just methodology. That's engineering discipline grounded in theory. That's why HTA endures.
```

### FILE: failure-modes-and-error-variance.md

```markdown
# Failure Modes and Error Variance: Designing Systems That Anticipate Breakdown

## The Central Challenge: Everything That Can Go Wrong, Will

Annett (2004) identifies error variance as a core concern: "The top-down systems approach taken by HTA enables the analyst to identify and deal first with factors generating the largest error variance." This deceptively simple statement contains a profound insight about complex system design.

Error variance is the statistical spread in system performance—sometimes it works perfectly, sometimes it fails catastrophically. That variance comes from somewhere. HTA's contribution is a systematic method for locating sources of error variance and directing mitigation effort toward high-impact sources.

## The Three-Column Error Framework (Original HTA)

Annett et al (1971) proposed analyzing each sub-goal for potential difficulties in the perception-action-feedback cycle:

**I/F column (Input/Feedback)**: Can the operator perceive necessary information? Is feedback adequate to detect success/failure?

**A column (Action)**: Can the operator perform required actions? Are controls accessible and understandable?

The questions they proposed:
- "Can the operator detect when to act?"
- "Can the operator determine what action is needed?"
- "Can the operator perform the action?"
- "Can the operator tell if the action succeeded?"

These simple questions reveal potential error sources. If answer is "no" or "sometimes" or "with difficulty," you've found error variance.

Example (operating a nuclear reactor):
- Sub-goal: "Detect pressure anomaly"
- I/F difficulty: Pressure gauge in peripheral vision, easy to miss → High error probability
- A difficulty: None, purely perceptual task
- Implication: Redesign to make anomaly salient (alarm, central display, predictive warning)

## SHERPA: Systematic Error Taxonomy

Stanton extended HTA with Systematic Human Error Reduction and Prediction Approach (SHERPA). The innovation: each task type has associated error modes:

### Action Errors (A1-A10)
- A1: Operation too long/short
- A2: Operation mistimed
- A3: Operation in wrong direction
- A4: Operation too much/too little
- A5: Misalign
- A6: Right operation on wrong object
- A7: Wrong operation on right object
- A8: Operation omitted
- A9: Operation incomplete
- A10: Wrong operation on wrong object

### Retrieval Errors (R1-R3)
- R1: Information not obtained
- R2: Wrong information obtained  
- R3: Information retrieval incomplete

### Checking Errors (C1-C6)
- C1: Check omitted
- C2: Check incomplete
- C3: Right check on wrong object
- C4: Wrong check on right object
- C5: Check mistimed
- C6: Wrong check on wrong object

### Communication Errors (I1-I3)
- I1: Information not communicated
- I2: Wrong information communicated
- I3: Information communication incomplete

### Selection Errors (S1-S2)
- S1: Selection omitted
- S2: Wrong selection made

The taxonomy systematizes error prediction. For each sub-goal:
1. Classify task type (Action/Retrieval/Checking/Communication/Selection)
2. Consider all error modes for that type
3. Judge which are credible (possible given system design and context)
4. Estimate probability (H/M/L) and criticality (H/M/L)
5. Assess recovery possibility
6. Propose remediation

### Example: VCR Programming Analysis

From Stanton (2003), sub-goal "4.3 Set start time":

**Task type**: Information entry (I)

**Credible errors**:
- I1: No time entered → Consequence: No programme recorded → P: Low, C: High → Recovery: None
- I2: Wrong time entered → Consequence: Wrong programme recorded → P: Low, C: High → Recovery: None

**Remediation**: Replace keypad time entry with analogue clock dial interface. Makes time selection visual and immediate rather than abstract and error-prone.

Notice the analytical chain:
1. Goal hierarchy identifies "set start time" as necessary sub-goal
2. SHERPA identifies credible error modes (I1, I2)
3. Probability/criticality analysis shows both are unacceptable (low P but high C)
4. Recovery analysis shows no automatic recovery
5. Design implication: Change interface modality to reduce error probability

This is systematic, not intuitive. You're not guessing what might go wrong; you're working through a taxonomy of known error types.

## The Error Cascade Problem

Hellier et al (2001) analyzed chemical analysis procedures and found that errors cascade through goal hierarchies. An error in "calibrate instrument" (bottom level) propagates to "measure sample concentration" (middle level) propagates to "determine treatment requirement" (top level).

The hierarchy reveals three cascade patterns:

### 1. Amplification
Bottom-level error has magnified impact at higher levels.

Example: 
- Error: Misread scale by 10% (low consequence at task level)
- Propagation: Incorrect concentration → wrong treatment dose (high consequence at system level)

### 2. Accumulation
Multiple independent low-probability errors combine to create high-probability failure.

Example:
- Error A: Forgot to check temperature (P=0.05)
- Error B: Used wrong reagent (P=0.05)  
- Error C: Miscalculated dilution (P=0.05)
- Combined: At least one error occurs with P = 1-(0.95)³ = 0.14 (much higher)

### 3. Critical path
Single error in critical sub-goal causes complete super-ordinate failure.

Example:
- Sub-goal "Secure chemical spill area" is critical for super-ordinate "Respond to incident"
- If securing fails, entire response fails regardless of how well other sub-goals execute
- Critical path sub-goals deserve disproportionate error mitigation effort

The hierarchy makes these patterns visible. Flat task lists hide error propagation. Hierarchical representation shows impact.

## Recovery Analysis: What Happens After Error?

For each identified error, SHERPA asks: "What recovery is possible?"

**Immediate recovery**: Error detectable and correctable without leaving current sub-goal
- Example: "Press wrong button → Immediate visual feedback → Press correct button"

**Subsequent recovery**: Error detectable at later sub-goal; can backtrack and correct
- Example: "Set wrong recording time → Notice during confirmation step → Return to time-setting"

**No recovery**: Error undetectable or uncorrectable within task; requires external intervention
- Example: "VCR clock wrong → Recording fails → Must reprogram and re-record"

Recovery possibilities determine criticality. High-P/high-C errors with no recovery are design disasters. High-P/high-C errors with immediate recovery are manageable.

Design for recovery:
- **Visibility**: Make errors obvious when they occur
- **Reversibility**: Allow undo/redo operations
- **Confirmation**: Require explicit confirmation for high-consequence actions
- **Checkpoints**: Insert verification steps before commitment points

## The Six Design Strategies from Error Analysis

Kirwan & Ainsworth (1992) synthesize error analysis into design strategies:

### 1. Error Prevention
Make the error impossible.
- Example: Mechanical interlocks prevent inserting cassette backward
- Agent system: Type systems prevent invalid function calls

### 2. Error Reduction  
Make the error unlikely.
- Example: Defaults to sensible values reduce wrong-input errors
- Agent system: Pre-validation of inputs before skill invocation

### 3. Error Detection
Make the error visible when it occurs.
- Example: "Check engine" light signals malfunction
- Agent system: Assertions and invariant checking during execution

### 4. Error Recovery
Make correction easy after detection.
- Example: "Undo" button reverses action
- Agent system: Transaction rollback, state snapshots

### 5. Error Tolerance
Make system function despite error.
- Example: Redundant sensors continue operation if one fails
- Agent system: Fallback skills, graceful degradation

### 6. Error Containment
Prevent error propagation to other sub-goals.
- Example: Circuit breakers isolate electrical faults
- Agent system: Exception boundaries, failure isolation

For each sub-goal with high P×C error modes, apply strategies in order. Prevention is best but not always possible. Containment is last resort but essential for system resilience.

## Error Prediction vs. Error Discovery: Two Complementary Approaches

SHERPA is predictive: identify potential errors before system operation. This enables design-time mitigation.

But prediction has limits. Novel systems, complex interactions, and rare edge cases may have unpredictable errors.

Hellier et al (2001) used HTA for error discovery: observe actual system operation, note errors, trace to sub-goals. This enables operational-time learning.

Combined approach:
1. **Design phase**: Use SHERPA to predict credible errors, design mitigations
2. **Operation phase**: Observe and document actual errors  
3. **Refinement phase**: Update error taxonomy with discovered errors, improve mitigations
4. **Iteration**: Feed operational experience back to design for next version

The goal hierarchy provides stable framework for accumulating error knowledge across design-operation cycles.

## Team Errors: Coordination Failure Modes

Annett et al (2000) extend error analysis to team tasks. New error modes emerge:

**Communication errors**:
- Information not sent when needed
- Information sent but not received
- Information received but misunderstood
- Information delayed beyond usefulness

**Coordination errors**:
- Agents work on wrong sub-goals (misaligned priorities)
- Agents duplicate effort (lack of awareness)
- Agents create conflicting outputs (lack of synchronization)
- Agents fail to hand off (dropped responsibility)

Example (emergency response):
- Sub-goal: Police officer reports hazard to control
- Communication error I1: Officer fails to report → Control doesn't dispatch fire service → Hazard uncontained
- Coordination error: Fire service dispatched but police haven't secured scene → Fire service enters unsafe area

Team error analysis requires understanding sub-goal ownership and information dependencies. HTA's team extension (see section 5 of source) makes these explicit in tabular format.

For multi-agent systems:
- Which agent owns each sub-goal?
- What information must flow between agents?
- What synchronization points exist?
- What happens if communication fails?

## The P×C Rule Revisited: Error Variance Edition

The stopping rule (P×C) is really an error variance rule. Continue decomposition where error variance is unacceptably high.

High error variance = High P (uncertainty about success) × High C (impact when failure occurs)

The top-down approach means you identify highest-variance components first:
- At top level: Which super-ordinate goals have highest error variance?
- At next level: Which sub-goals contribute most to that variance?
- Continue until you identify error sources at operational level

Then mitigate highest-variance sources first. Classic Pareto principle: 80% of error variance likely comes from 20% of sub-goals. Find that 20%, fix it.

For agent orchestration:
- Which skills have highest failure rates? (High P)
- Which skill failures have worst cascading effects? (High C)  
- Prioritize improving those skills or adding verification/recovery

## Failure Mode Effects Analysis (FMEA) Integration

HTA naturally supports FMEA:
- **Failure mode**: Error type from taxonomy (A1-A10, R1-R3, etc.)
- **Failure effect**: Consequence on super-ordinate goal
- **Failure probability**: Estimate of P
- **Failure severity**: Estimate of C
- **Risk Priority Number**: P × C (or more complex formula)

The hierarchy provides structure for tracing effects. Bottom-level failure modes propagate to middle-level failure effects propagate to top-level system impacts.

Standard FMEA asks: "How can this component fail?" HTA asks: "How can this sub-goal fail to be achieved?" The framing is goal-oriented rather than component-oriented, which better captures functional failures.

## Design Implications: The Error-Aware System

Error analysis transforms from retrospective ("what went wrong") to prospective ("what could go wrong") to design-oriented ("how do we prevent/detect/recover").

The error-aware system:
1. **Knows its failure modes**: Error taxonomy for each sub-goal
2. **Monitors for errors**: Instrumentation detects anomalies
3. **Recovers gracefully**: Fallback strategies for predicted errors
4. **Learns from failures**: Operational errors update predictions
5. **Degrades safely**: Unpredicted errors contained, don't cascade

For intelligent agents, this means:
- **Every skill has error modes defined**: Not just "might fail" but "fails in these specific ways"
- **Orchestrator monitors execution**: Detects when skill outputs don't match expectations
- **Recovery strategies exist**: Alternative skills, retry logic, escalation to human
- **Failure telemetry collected**: Which skills fail, under what conditions, with what consequences
- **Adaptation over time**: High-error skills get replaced or improved

## Meta-Lesson: Design for Failure, Not Just Success

Traditional task analysis describes nominal operation—what should happen when everything works. HTA's error extensions describe failure modes—what actually happens when things break.

This shift from ideal to real, from normative to descriptive, from success-focused to failure-aware is essential for robust systems.

In multi-agent orchestration:
- Don't just plan the happy path ("agent A calls skill X, result flows to agent B...")
- Plan the failure paths ("if skill X fails, then try skill Y, if both fail, escalate to human")
- Design error detection into the execution flow
- Provide recovery mechanisms at multiple levels

The goal hierarchy provides the structure. The error taxonomy provides the failure modes. The recovery analysis provides the mitigations. Together they enable systems that anticipate breakdown and respond intelligently rather than catastrophically.

That's the difference between fragile systems that work only when everything goes right and resilient systems that work even when things go wrong. Error variance isn't an unfortunate side effect—it's a design consideration that shapes system architecture.
```

### FILE: the-gap-between-knowing-and-doing.md

```markdown
# The Gap Between Knowing and Doing: Information, Knowledge, and Executable Understanding

## The Understated Problem in HTA Applications

Stammers & Astley (1987) added an "Information Assumed" column to their interface design analysis. This seemingly minor addition addresses a profound problem: systems fail not because procedures are wrong but because operators lack prerequisite knowledge to execute procedures.

Their coal preparation plant analysis shows:
- Sub-goal: "Start-up plant"
- Information assumed: "Start-up procedure" (must memorize order: C10, R2, C12)
- Sub-goal: "Run plant"  
- Information assumed: "Knowledge of plant flows and operational procedures"
- Sub-goal: "Fault diagnosis"
- Information assumed: "Some understanding of faults"

Notice: these aren't information needs (what must be displayed) but knowledge prerequisites (what must be already known). The distinction matters enormously for system design.

## Three Types of Knowledge Requirements

### 1. Procedural Knowledge: How to Execute

Knowing the sequence of actions. "Press button A, wait for indicator B, then press button C."

This is what traditional task analysis captures well. HTA plans encode procedural knowledge: "Do 1 then 2 then 3."

**Agent parallel**: Skill execution knowledge. How to invoke a function, what parameters it expects, what output format it produces.

**Problem**: Procedures work only when you understand why steps exist and when variations are needed. Rote execution breaks down under novelty.

### 2. Domain Knowledge: Why Things Work

Understanding the underlying system. "Pressing button A opens valve V, which allows flow from reservoir R1 to R2, which balances pressure."

This is largely absent from traditional HTA but critical for:
- Adapting procedures to unusual situations
- Diagnosing failures when procedures don't work
- Anticipating consequences of actions
- Making trade-off decisions

**Agent parallel**: Domain models. Understanding what code constructs do, what security vulnerabilities mean, why certain patterns are problematic.

**Problem**: Domain knowledge is vast. Which parts are essential for which sub-goals? HTA doesn't specify this systematically.

### 3. Strategic Knowledge: When to Apply What

Knowing which procedure or approach fits which situation. "If pressure rising rapidly use emergency shutdown sequence. If rising slowly use controlled reduction procedure."

This is encoded partially in plans (conditional logic) but plans assume you can evaluate conditions. Strategic knowledge is knowing what "rising rapidly" means, why it matters, what's at stake.

**Agent parallel**: Task-appropriate skill selection. Knowing when deep analysis is needed vs. quick heuristic, when to escalate to human vs. proceed autonomously.

## The Annotation Problem: Capturing Knowledge Requirements

Bruseberg & Shepherd (1997) propose annotating each sub-goal with knowledge requirements. But this is harder than it sounds:

**Explicit knowledge**: Can be stated in words/symbols. "The sequence is C10, R2, C12."
- Captured in procedures, manuals, training materials
- Can be externalized (written down, programmed)
- Transferable through instruction

**Tacit knowledge**: Acquired through experience, difficult to articulate. "You can feel when the system is about to fail."
- Captured in expertise, intuition, pattern recognition
- Resists externalization
- Transferable through apprenticeship, practice

**Implicit knowledge**: Assumed as background, not consciously considered. "The plant operates according to thermodynamic principles."
- Often cultural or domain-standard
- Becomes visible only when absent (novices don't have it)
- Transferable through enculturation

HTA can annotate explicit knowledge ("must know X") but struggles with tacit and implicit. Yet these are often where critical breakdowns occur.

## The Training Design Implication

HTA was originally developed for training specification. The logic:
1. Decompose task into sub-goals
2. For each sub-goal, identify required knowledge/skills  
3. Design training to develop those knowledge/skills
4. Sequence training to match task hierarchy

This works beautifully when knowledge requirements are explicit and procedural. But consider:

**Sub-goal**: "Make decision about nature of incident"  
**Knowledge required**: "Understanding of hazard types, propagation patterns, severity indicators, available resources, risk trade-offs, regulatory constraints"

How do you train that? Not by memorizing procedures. You need:
- **Conceptual instruction**: What are hazard types? How do they propagate?
- **Case-based learning**: Here are 50 incidents, analyze each  
- **Simulation**: Practice decision-making under realistic conditions
- **Feedback**: Experts critique your decisions, explain better alternatives
- **Reflection**: Articulate your decision rationale, identify gaps

The sub-goal hierarchy guides training scope (what needs to be learned) but doesn't specify training method (how to learn it). That requires deeper analysis of knowledge types.

Patrick et al (1986) recognized this and proposed augmenting HTA with:
- **Knowledge prerequisites**: What must be already known
- **Skill components**: What capabilities must be developed
- **Learning objectives**: What mastery criteria apply
- **Training methods**: What instructional approaches fit

This transforms HTA from task description to learning architecture.

## The Interface Design Implication

Stammers & Astley's insight: interfaces must provide information that compensates for knowledge gaps.

If operator knows plant topology perfectly, interface can show abstract symbols. If operator is novice, interface needs spatial layout showing physical relationships.

If operator understands causal relationships, interface can show effects and let operator infer causes. If operator lacks causal model, interface needs diagnostic support that suggests causes.

The "information assumed" column identifies design trade-offs:
- **Assume more knowledge → Simpler interface, but excludes less knowledgeable users**
- **Assume less knowledge → More comprehensive interface, but cluttered for experts**

Resolution: Adaptive interfaces that reveal complexity progressively as user demonstrates mastery. But this requires explicit modeling of knowledge requirements per sub-goal.

## The Agent Design Implication: Skill Prerequisites

For AI agents, the knowing-doing gap manifests as:

**Skill availability ≠ Skill applicability**

You might have a "code refactoring" skill, but knowing when to apply it requires understanding:
- What makes code "need refactoring"?
- What trade-offs exist (time vs. quality)?
- What downstream consequences matter (will this break tests)?
- What alternatives exist (refactor now vs. later vs. never)?

These aren't skill parameters; they're contextual knowledge needed to decide whether to invoke the skill.

Design implications:

### 1. Explicit Prerequisite Specification
Each skill declares:
- Required input information (data dependencies)
- Required domain knowledge (conceptual prerequisites)  
- Required context (when is this skill applicable)

Example:
```
Skill: "Detect SQL injection vulnerabilities"
Input: Codebase with database queries
Domain knowledge: Understanding of SQL syntax, parameterized queries, input sanitization
Context: Web application with user-facing forms
```

This makes knowledge gaps explicit. If agent lacks domain knowledge, it can't reliably use skill.

### 2. Graduated Skill Versions  
Same functional goal, different knowledge requirements:

- **Basic version**: Pattern matching (low knowledge requirement)
- **Intermediate version**: Structural analysis (medium knowledge requirement)  
- **Advanced version**: Semantic reasoning (high knowledge requirement)

Agent selects version based on available knowledge/resources.

### 3. Skill Composition with Knowledge Transfer
Some skills produce knowledge that other skills consume:

- Skill A: "Analyze codebase structure" → Produces architectural model
- Skill B: "Identify design issues" → Consumes architectural model

The architectural model is both output (information) and input (knowledge). This makes knowledge flow explicit in agent coordination.

### 4. Meta-Skills for Knowledge Acquisition
Skills that build knowledge rather than perform tasks:

- "Learn domain terminology from codebase"
- "Build causal model from documentation"
- "Extract design patterns from examples"

These meta-skills address knowledge gaps dynamically rather than assuming prerequisites.

## The Implicit Assumption Problem

Many HTA analyses contain hidden assumptions about what operators/agents "obviously know."

Example (emergency response): Sub-goal "Assess situation to establish extent of emergency"

Unstated assumptions:
- Knows what constitutes "emergency" vs "incident"
- Understands severity indicators  
- Recognizes escalation triggers
- Appreciates time constraints
- Aware of available resources

These aren't in plans or procedures. They're background knowledge that experienced responders have but novices don't.

For agent systems, implicit assumptions are bugs waiting to happen. The agent doesn't share human cultural context. What's "obvious" to human designer isn't obvious to LLM or rule-based system.

Solution: Make assumptions explicit through annotation:
- **Assumed knowledge**: List what must be already known
- **Assumed context**: Specify environmental/situational assumptions  
- **Assumed capabilities**: Detail prerequisite skills
- **Assumed constraints**: Note limitations and boundaries

This transforms implicit assumptions into explicit requirements that can be validated.

## The Verification Problem: Do They Actually Know?

Even when knowledge requirements are specified, how do you verify agents have them?

**For humans**: Training, testing, certification, supervised practice

**For AI agents**: Much harder. LLMs have vast knowledge but:
- Inconsistent (know X in one context, forget in another)
- Unreliable (hallucinate facts)
- Unverifiable (can't inspect what's "known")

Approaches:

### 1. Prerequisite Testing
Before invoking skill, test if agent has required knowledge:
- "What is SQL injection?"
- "How do parameterized queries prevent it?"
- "Give example of vulnerable code"

If answers are correct, proceed. If not, use fallback (simpler skill, human escalation, knowledge acquisition phase).

### 2. Confidence Estimation  
Agent estimates its own knowledge sufficiency:
- "I'm 95% confident I understand this domain"
- "I'm 30% confident in my assessment"

Use confidence to guide autonomy level (high confidence → autonomous, low confidence → supervised).

### 3. Performance Monitoring
Track skill success rates:
- If "detect vulnerabilities" succeeds 95% of time → Knowledge adequate
- If succeeds 60% of time → Knowledge inadequate, needs improvement

Feedback loop: performance → knowledge gap identification → targeted learning → improved performance.

### 4. Knowledge Provenance
Track where knowledge came from:
- Pretrained model (high breadth, variable reliability)
- Fine-tuned on domain (high relevance, limited scope)
- Retrieved from docs (verifiable, potentially incomplete)
- Human-provided (high quality, expensive)

Different sources have different trust levels. Critical sub-goals might require human-provided or retrieval-based knowledge rather than model-generated.

## Case Study: The VCR Programming Knowledge Gap

Stanton's VCR analysis reveals knowing-doing gap:

Users know they want to record a program (goal knowledge). But they don't know:
- **Procedural**: 8-step sequence with timing constraints
- **Conceptual**: Why wait 5 seconds between start and finish time?
- **Contextual**: Must set timer selector AND press timer record (redundant confirmation)
- **Causal**: How does VCR distinguish "set start time" vs "set finish time"? (modal interface)

Result: 40% task failure rate among first-time users.

Design solutions emerge from knowledge gap analysis:
- **Reduce procedural knowledge requirement**: Simplify sequence, remove redundant steps
- **Reduce conceptual knowledge requirement**: Replace abstract time entry with visual calendar/clock
- **Reduce contextual knowledge requirement**: Eliminate mode confusions, make state visible
- **Reduce causal knowledge requirement**: Direct manipulation (drag program from EPG to timeline)

Same goal ("record program at specified time"), drastically reduced knowledge prerequisites. This is only possible by analyzing knowledge requirements systematically.

For agent systems: If task has high knowledge prerequisites, either:
1. Ensure agents have that knowledge (training, retrieval, reasoning)
2. Redesign task to reduce knowledge requirements (simpler procedures, better tools, more automation)

## Meta-Lesson: Information Architecture ≠ Knowledge Architecture

Information is external, objective, transferable. Knowledge is internal, subjective, constructed.

HTA's tabular format handles information well:
- Information flow (→ ←)
- Information sources (where does data come from)
- Information requirements (what must be displayed)

HTA handles knowledge less well, but extensions help:
- Knowledge prerequisites (what must be already known)
- Knowledge gaps (what's missing)
- Knowledge acquisition (how to develop understanding)

For intelligent systems, both matter:
- **Information architecture**: Data schemas, APIs, message passing, databases
- **Knowledge architecture**: Ontologies, domain models, inference rules, learned representations

Systems fail when designers provide information but assume knowledge. "Here's the data you need" ≠ "Here's what you need to know."

The gap between knowing and doing is the gap between information provision and knowledge construction. HTA makes this gap visible by forcing analysts to ask: "What must the operator/agent already understand to execute this sub-goal successfully?"

Answer that question for every sub-goal, and you've moved from task analysis to knowledge analysis. That's where the real design work begins.
```

### FILE: hierarchies-of-abstraction-enable-action.md

```markdown
# Hierarchies of Abstraction Enable (or Prevent) Effective Action

## The Abstraction Problem: Detail vs. Comprehension

Miller, Galanter & Pribram (1960) noted that the hammering analysis (figure two in source) could continue indefinitely: "hammer nail" decomposes to "lift hammer" and "strike nail," which decompose to muscle activations, which decompose to neural signals, which decompose to molecular interactions.

At what level should analysis stop? They observed: "most of the therbligs refer to physical movement, there were some 'cognitive' therbligs, such as 'search,' 'select,' and 'find.'" The critical insight: abstraction level determines what's visible.

At molecular level, you can't see "hammering." At behavioral level, you can't see neural computation. At task level, you can't see organizational strategy. Each level of abstraction reveals certain aspects while hiding others.

HTA's contribution: systematic method for navigating abstraction levels through hierarchical decomposition with stopping rules.

## The Three-to-Ten Rule: Cognitive Chunking

Patrick et al (1986) recommend 3-8 immediate subordinates per super-ordinate goal, extending to 10 maximum. Why?

**Cognitive science**: Working memory holds 7±2 chunks (Miller, 1956). More than 10 subordinates exceeds comprehension capacity.

**Practical usability**: Hierarchical diagrams with 3-8 branches are visually parseable. Diagrams with 20 branches are incomprehensible tangles.

**Logical coherence**: If super-ordinate has 15+ subordinates, probably missing an intermediate abstraction level.

Example of too many subordinates:
```
0. Prepare meal (20 subordinates)
  1. Get flour
  2. Get eggs  
  3. Get milk
  4. Get butter
  5. Get sugar
  ...
  20. Wash dishes
```

This is a list, not a hierarchy. Better:
```
0. Prepare meal
  1. Gather ingredients
  2. Mix ingredients
  3. Cook mixture
  4. Serve meal
  5. Clean up
```

Now each super-ordinate has 4-5 subordinates. Further decomposition reveals details:
```
1. Gather ingredients
  1.1. Get dry ingredients (flour, sugar)
  1.2. Get wet ingredients (eggs, milk, butter)
  1.3. Get equipment (bowl, whisk, pan)
```

The abstraction hierarchy enables comprehension at multiple levels:
- **Executive level**: "Prepare meal" (1 goal, overview)
- **Management level**: "Gather, mix, cook, serve, clean" (5 goals, operational flow)
- **Worker level**: "Get flour, eggs, milk..." (20+ goals, execution detail)

Each level is understandable because subordinates are chunked into manageable groups.

## The Right Granularity: What's Too Abstract vs. Too Concrete?

Annett (2004) distinguishes between "abstraction that's appropriate to the purpose" and "abstraction that's too high or too low to be useful."

**Too abstract**: "Solve the problem" → Provides no guidance on how
- Example: "Ensure security" (what does that mean operationally?)
- Agent system: "Be helpful" (what actions does this trigger?)

**Too concrete**: "Move mouse cursor 3cm, click button at pixel (247, 183)" → Binds to specific implementation
- Example: "Press CTRL+SHIFT+F3" (what if keyboard layout changes?)
- Agent system: "Execute command string 'git commit -m \"fix bug\"'" (what if command syntax changes?)

**Appropriate abstraction**: "Commit code changes with descriptive message"
- Abstract enough to allow implementation flexibility (UI vs. command line vs. API)
- Concrete enough to specify what must be achieved (commit, not just save)
- Measurable (can verify commit occurred with message)

Finding appropriate abstraction requires asking:
- **Purpose**: What decision does this level support?
- **Stability**: What's likely to change vs. remain constant?
- **Actionability**: Can someone act on this level of description?

Different purposes need different abstractions:

**Strategic planning**: High abstraction ("Improve system security")  
**Resource allocation**: Medium abstraction ("Implement authentication, encryption, audit logging")  
**Implementation**: Low abstraction ("Use bcrypt for password hashing with cost factor 12")

HTA accommodates multiple abstraction levels simultaneously through hierarchical structure. Top levels stay abstract and stable. Bottom levels become concrete and specific.

## The Interface Between Abstraction Levels: Plans as Bridges

Plans connect abstraction levels by specifying how high-level goals decompose to low-level actions.

Consider: "Make nail flush with surface"
- **Abstract goal**: Nail should not protrude
- **Concrete actions**: Lift hammer, strike nail
- **Plan**: Test if nail protrudes → If yes, lift hammer then strike nail, repeat test → If no, exit

The plan mediates between "flush nail" (abstract) and "hammer movements" (concrete). It answers: "How do these concrete actions achieve that abstract goal?"

Without plans, hierarchy is just taxonomy. With plans, hierarchy is executable specification.

For agent systems, this means:
- **High-level goals** → What the system should achieve (abstract)
- **Low-level skills** → What capabilities exist (concrete)
- **Plans** → How capabilities combine to achieve goals (bridge)

The orchestrator operates at plan level, mapping abstract goals to concrete skill invocations.

## The Stopping Rule Revisited: Abstraction Economy

P×C stopping rule is really an abstraction economy rule: refine abstraction only where precision matters.

Low P×C → Stay abstract. No need for detail when:
- Success is likely (low P)
- Failure is inconsequential (low C)

High P×C → Get concrete. Need detail when:
- Success is uncertain (high P)
- Failure is catastrophic (high C)

This creates variable-depth hierarchies where critical paths are refined to concrete actions while routine paths remain abstract.

Example (emergency response):
- "Receive notification" → Single abstract sub-goal (low P, low C)
- "Identify chemical hazard" → Deep refinement with 5+ levels (high P, high C)

The hierarchy visually communicates where complexity and risk concentrate. Uneven depth is feature, not bug.

For agent systems: Allocate detailed analysis (error prediction, resource estimation, monitoring) to deep branches. Shallow branches get minimal overhead.

## The Wrong Abstraction: When Hierarchies Mislead

Hierarchies can prevent effective action when abstraction is wrong:

### Problem 1: Premature Commitment to Structure

Imposing hierarchy before understanding problem locks in wrong abstraction.

Example: "Respond to security incident" initially decomposed as:
```
1. Detect intrusion
2. Identify attacker
3. Block access
4. Restore system
```

This assumes linear sequence: detect → identify → block → restore.

Reality: Detection and blocking might happen concurrently. Restoration might begin before complete identification. The imposed hierarchy constrains response strategy.

Better: Analyze actual incident response patterns, then extract hierarchy that reflects real dependencies and opportunities.

### Problem 2: Conflating Multiple Abstraction Dimensions

Hierarchies assume single decomposition basis. But systems have multiple valid decompositions:

**Functional decomposition**: What functions exist?
- "Provide authentication" → "Verify credentials" + "Manage sessions" + "Enforce access control"

**Temporal decomposition**: What happens when?
- "User login" → "Enter credentials" → "Verify password" → "Create session"

**Spatial decomposition**: What components exist where?
- "Distributed system" → "Web server" + "Application server" + "Database server"

**Organizational decomposition**: Who does what?
- "Software development" → "Frontend team" + "Backend team" + "DevOps team"

HTA primarily supports functional decomposition (goals and sub-goals). Temporal structure goes in plans. Spatial and organizational structure requires additional annotation.

Trying to encode multiple dimensions in single hierarchy creates confusion. Sub-goals at same level might mix functional, temporal, and organizational concerns.

Solution: Primary hierarchy for functional decomposition, supplementary representations for other dimensions.

### Problem 3: Hiding Cross-Cutting Concerns

Hierarchies partition problems cleanly. But some concerns cross boundaries:

**Security**: Affects authentication, data storage, communication, error handling (multiple branches)
**Performance**: Affects database queries, UI rendering, network calls (multiple branches)
**Error handling**: Affects every sub-goal (all branches)

In functional hierarchy, these cross-cutting concerns get buried in multiple places or omitted entirely.

Shepherd (2001) addresses this with contextual constraint analysis (table thirteen in source): annotate each sub-goal with difficulty, predictability, controllability, consequences, stresses, etc.

These cross-cutting concerns aren't part of hierarchical decomposition but supplementary analysis using hierarchy as framework.

## Abstraction Mismatch: When Levels Don't Align

Problems arise when abstraction levels mix within same hierarchical tier:

**Mixed abstraction**: 
```
1. Analyze codebase
  1.1. Tokenize files (very low-level)
  1.2. Detect security issues (high-level)
  1.3. Write to output buffer (very low-level)
```

Sub-goals 1.1 and 1.3 are implementation details. Sub-goal 1.2 is conceptual outcome. They don't belong at same level.

**Proper abstraction**:
```
1. Analyze codebase
  1.1. Parse code structure
  1.2. Detect security issues  
  1.3. Generate report
```

Now all three are at similar abstraction (functional steps). Implementation details move to deeper levels:
```
1.1. Parse code structure
  1.1.1. Tokenize source files
  1.1.2. Build abstract syntax tree
  1.1.3. Extract semantic information
```

Consistent abstraction at each level makes hierarchy navigable. Mixed abstraction creates cognitive dissonance—some sub-goals are "what to achieve," others are "how to do it."

## Dynamic Abstraction: Zooming In and Out

Effective use of hierarchies requires dynamic abstraction adjustment: