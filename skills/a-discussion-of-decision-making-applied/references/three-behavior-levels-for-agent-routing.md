# Skill-Based, Rule-Based, and Knowledge-Based Behavior: A Framework for Agent Task Routing

## Rasmussen's Hierarchy and Why It Matters for AI Orchestration

Jens Rasmussen, the Danish cognitive systems engineer, developed one of the most practically useful frameworks in the history of human factors research. His three-level model of human performance — Skill-Based (SB), Rule-Based (RB), and Knowledge-Based (KB) behavior — was originally designed to explain human error patterns in complex sociotechnical systems. Njå and Rake apply it to incident command, but its implications reach far deeper: it provides a rigorous basis for designing how intelligent agent systems should route tasks and allocate cognitive resources.

The model is deceptively simple in description and profound in application:

**Skill-Based (SB) behavior**: "Human performance is governed by stored patterns of pre-programmed instructions represented as analogue structures in a time-space domain." This is automatic, smooth, fast, and pre-conscious. An experienced fire officer who deploys hoses in a standard attack pattern is not thinking about where to place each hose — the pattern executes. The same is true for any highly practiced, routinized sequence of actions. Errors at the SB level are *slips* and *lapses* — the right program runs at the wrong time, or execution fails mid-sequence.

**Rule-Based (RB) behavior**: Problems are handled through stored if-then rules — "if (state) then (diagnosis)" or "if (state) then (remedial action)." The rules exist as compiled knowledge, retrieved by situation recognition. The person doesn't derive the appropriate action from first principles — they look it up. Errors at the RB level are *mistakes* — applying the wrong rule, or applying a correct rule in a situation where it doesn't actually apply.

**Knowledge-Based (KB) behavior**: Novel situations for which "actions must be planned online using conscious analytical processes and stored knowledge." This is the slow, deliberate, effortful reasoning that requires holding a mental model of the situation in working memory and reasoning forward from it. Errors at the KB level are complex — they can involve faulty mental models, incorrect causal reasoning, or failure to consider relevant possibilities. This is the most cognitively demanding and error-prone mode.

## The Continuum, Not the Hierarchy

It's tempting to think of SB/RB/KB as a strict hierarchy where KB is "higher" and "better" than SB. Rasmussen's framework rejects this. The appropriate behavioral level is determined by the *situation*, not the agent's capability. In fact:

- **Using KB behavior for SB-appropriate situations is wasteful and slower**. An expert who consciously thinks through every step of a routine sequence is slower and more error-prone than one who lets the automatic program run.
- **Using SB behavior for KB-appropriate situations is catastrophic**. An agent that applies an automatic pattern to a genuinely novel situation that superficially resembles the trained pattern will produce confident, rapid, wrong actions.

The skill of expertise is not just being good at KB reasoning. It is knowing which mode to be in, and switching modes correctly.

Njå and Rake note: "Experience and training can influence a person's behaviour to become more automatic (moving from KB towards SB)." This is the mechanism by which expertise develops — through repeated encounter with situations, the KB-level reasoning required in early encounters gets compiled into RB rules and eventually SB patterns. What was once effortful becomes automatic.

But they also note: "Experience and training can also improve the cognitive process and increase the quality of decisions (improving performance within the SB, RB and KB levels of behaviour)." The hierarchy is not just about what level you're at — quality matters within each level.

## The Three-Level Framework Applied to Agent Task Routing

For WinDAGs and similar orchestration systems, Rasmussen's framework translates into a principled basis for task routing decisions. The central question is: **What level of cognitive processing does this task actually require?**

### SB-Equivalent Agent Tasks: Automated Execution

Tasks that are fully specified, have been executed thousands of times in similar contexts, and have no significant novelty should be executed with minimal overhead — the agent equivalent of SB behavior. This means:
- No deliberation about alternatives
- No meta-level planning
- Direct execution of the canonical action pattern
- Monitoring for execution failures (slips) rather than planning failures

Examples in agent systems: formatting a response according to a known template, calling a well-defined API with standard parameters, generating boilerplate code for a familiar pattern, reformatting data between known schemas.

**Routing principle**: Detect that the task is fully specified and canonical; dispatch directly to the executing skill with minimal orchestration overhead. The primary monitoring is *execution quality* — did the output match the expected form?

**Failure mode**: Over-applying SB routing to tasks that have novel features requires explicit detection of novelty before dispatch. The agent pipeline must be able to detect "this looks like a familiar task but has these anomalous features that warrant escalation."

### RB-Equivalent Agent Tasks: Rule-Governed Reasoning

Tasks that can be handled by retrieving and applying known rules — if-then patterns that have been validated in similar situations — correspond to RB behavior. This is a very large category for well-designed agent systems.

Examples: Code review against known anti-patterns, security auditing against known vulnerability types, architecture evaluation against established design principles, debugging via known error signatures.

The critical property of RB tasks is that the *rules exist* — the relevant if-then mappings have been compiled from prior KB-level reasoning and are available for retrieval. The agent's job is situation classification (which rule applies here?) followed by rule application.

**Routing principle**: Classify the situation type, retrieve the canonical rule set for that type, apply. The primary monitoring is *classification quality* — was the right rule selected? And *rule validity* — is this rule still accurate for current conditions?

**Failure mode**: The most dangerous RB failure is applying the right rule to the wrong situation — the classic Type I error of crisis decision making, where a situation is confidently misclassified. Every RB application should include an anomaly check: does the current situation actually match the conditions under which this rule applies?

### KB-Equivalent Agent Tasks: First-Principles Reasoning

Tasks that are genuinely novel — no prior case is close enough to serve as a template, no existing rule directly applies — require KB-level processing. This is the slow, expensive, error-prone mode that should be reserved for situations that genuinely demand it.

Examples: Novel system architecture design, debugging an unfamiliar failure mode with no known cause, security analysis of a novel threat vector, designing an algorithm for a problem type not previously encountered.

**Routing principle**: Detect genuine novelty, allocate maximum resources (longer context, more sophisticated reasoning agent, human oversight if available), execute with explicit first-principles reasoning, and attempt to compile the outcome into an RB rule for future use.

**Failure mode**: The most common KB failure is false novelty — treating a situation as genuinely novel when it actually has applicable prior cases, thereby wasting KB resources unnecessarily. The second most common is the reverse: treating a genuinely novel situation as if it were an RB case, applying an inapplicable rule with high confidence.

## Detecting the Correct Behavioral Level: The Classification Problem

The hardest problem in applying Rasmussen's framework is the meta-level task: correctly classifying which behavioral level a given situation demands. This classification is itself a cognitive task — and it can be performed at any of the three levels.

For agent systems, this meta-classification is the job of the orchestration layer. The orchestrator must:

1. **Assess novelty**: How closely does this task match prior cases? What is the distribution of prior cases most similar to this one?

2. **Assess stakes**: What is the cost of being wrong at each level? High-stakes situations warrant escalation to higher behavioral levels even when the task appears routine.

3. **Assess time constraints**: KB behavior is slow. If time pressure is severe, SB/RB responses may be required even for tasks that would warrant KB treatment under less constrained conditions.

4. **Assess anomaly indicators**: Are there features of the current task that don't fit the most similar prior cases? These anomalies are signals that the task may be more novel than initial assessment suggests.

5. **Assess failure consequences**: What happens if the automatic pattern is wrong? If the consequences of an SB-level failure are catastrophic, escalate to RB or KB even if the task appears routine.

## The Compilation Effect: Building an Agent Knowledge Base

Rasmussen's framework implies a dynamic process: KB-level reasoning in novel situations, when executed well and produces good outcomes, should be compiled into RB rules for future use. Over time, RB rules with high validity across many cases should be compiled into SB-equivalent automatic patterns.

For WinDAGs, this means the system should maintain an active process of:

1. **KB outcome capture**: When an agent successfully resolves a novel situation through KB-level reasoning, the reasoning process and outcome should be recorded as a case.

2. **Rule induction**: When a cluster of similar cases produces consistent conclusions, they should be generalized into an explicit if-then rule added to the RB layer.

3. **Pattern formation**: When a rule proves highly reliable across many applications, it can be promoted to SB-equivalent automated dispatch — requiring no deliberation.

This is how agent systems develop expertise over time: not through static rule sets, but through dynamic compilation of KB reasoning into increasingly efficient lower-level patterns.

## The Danger of Over-Routinization: When SB Behavior Encounters KB Situations

Njå and Rake emphasize the sociological perspective's warning about incident commanders who "stick to the chosen course of action" and cannot redefine the situation. This is the failure mode of over-routinization: an agent operating in SB or RB mode when the situation has actually entered KB territory.

This failure has a characteristic signature:
- Outcome feedback is persistently negative (the fire is not being suppressed)
- But the agent continues executing the same pattern (continuing the same attack)
- Because the SB program, once initiated, runs to completion without KB-level monitoring

For agent systems, the architectural safeguard is continuous outcome monitoring with explicit escalation triggers. When:
- Expected outcomes persistently fail to materialize
- Anomaly indicators accumulate beyond a threshold
- The situation timeline diverges significantly from the prior-case template

...the system should trigger a mandatory escalation from SB/RB mode to KB mode — forcing a full situation reassessment rather than continuing automatic execution.

This is not a sign of failure. It is correct behavior in a correctly designed system. The failure would be continuing SB execution while feedback persistently signals model error.

## Implications for WinDAGs Skill Selection

Every skill in a WinDAGs system can be characterized along the SB/RB/KB dimension:
- **SB skills**: Execute a fixed, well-defined transformation (format conversion, template instantiation, standard API calls)
- **RB skills**: Apply a known decision rule or analytical framework to classified input
- **KB skills**: Reason from first principles about novel situations (complex reasoning agents, human escalation)

The orchestration layer should maintain this characterization and use it in skill selection. When a task arrives:
1. Assess novelty relative to prior cases
2. Select the behavioral level appropriate to the task
3. Dispatch to the skill(s) that operate at that level
4. Monitor outcomes and escalate if behavioral level appears insufficient

This is a principled, psychologically grounded basis for skill selection — not arbitrary routing, but a system-level implementation of how expert human cognizers allocate their own cognitive resources.