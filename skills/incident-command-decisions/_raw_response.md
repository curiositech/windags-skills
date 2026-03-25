## BOOK IDENTITY

**Title**: "A Discussion of Decision Making Applied in Incident Command"
**Author**: Ove Njå and Eivind L. Rake (Academic paper, *International Journal of Emergency Management*)
**Core Question**: How do incident commanders actually make decisions under extreme uncertainty, time pressure, and information fragmentation — and how well do our theoretical models capture what really happens?
**Irreplaceable Contribution**: This paper sits at the intersection of two competing paradigms — the psychological (Naturalistic Decision Making / Recognition-Primed Decision model) and the sociological (Contingency Approach) — and honestly interrogates both. Its irreplaceable value is its *epistemological honesty*: it refuses to simply endorse either framework, instead exposing the methodological gaps, retrospective distortion problems, and measurement failures that plague our understanding of expert crisis decision-making. For agent systems, this paper is a warning about the difference between how we *model* expert reasoning and how it *actually operates* in novel, fragmented, high-stakes environments.

---

## KEY IDEAS (3-5 sentences each)

1. **Recognition Before Reasoning**: Expert incident commanders rarely compare alternatives. Instead, they recognize situation patterns from experience, identify the first workable course of action, mentally simulate it, and act — often without conscious deliberation. This "recognition-primed" approach (Klein's RPD model) means that expertise manifests primarily as superior *situation assessment*, not superior *analytical reasoning*. For agent systems, this implies that routing and action-selection based on pattern matching over prior cases will often outperform explicit option enumeration in time-constrained, information-sparse environments.

2. **The Three Levels of Behavior**: Rasmussen's SB/RB/KB hierarchy (Skill-Based, Rule-Based, Knowledge-Based) describes how human performance transitions from automatic pattern execution to rule lookup to conscious analytical reasoning as situations become more novel. Crisis decisions live primarily at the boundary between RB and KB — familiar enough to attempt pattern matching, novel enough to require adaptation. Agent systems must detect which behavioral register a task demands and route accordingly, since applying KB-style deliberation to SB-appropriate tasks wastes resources, while applying SB-style automation to KB-appropriate situations produces catastrophic errors.

3. **Uncertainty Is Epistemic, Not Aleatory**: The paper frames crisis uncertainty as fundamentally epistemic — "we are uncertain because we lack sufficient knowledge." The quantities that matter (number of trapped victims, gas diffusion rates, structural integrity) are uncertain not because the world is random but because information is fragmented, delayed, and ambiguous at the incident scene. This reframes the agent problem: the goal is not to compute expected values but to systematically reduce knowledge gaps while acting on best current estimates.

4. **Retrospective Distortion Corrupts Learning**: Both the NDM and CA research traditions rely heavily on post-hoc interviews with incident commanders, and both face a devastating problem — what commanders *report* they did rarely matches what observers saw them do. Memory reconstructs events toward normative ideals ("what I should have done") rather than preserving actual decision paths. For agent systems, this is a fundamental warning about learning from human-reported case studies: the training signal may encode idealized post-hoc rationalization, not real expert behavior.

5. **The Gap Between Individual Cognition and System Performance**: Neither the psychological nor sociological framework adequately accounts for the handoff moments — when command transfers between officers, when information must flow across organizational boundaries, when individual expertise must coordinate with team dynamics. Drabek's observation that "emergency workers had been swallowed up in a system that failed them despite their best individual efforts" captures the core tension: individual expert decision-making is necessary but not sufficient. System-level coordination failures can override even excellent individual reasoning.

---

## REFERENCE DOCUMENTS

### FILE: recognition-primed-decision-making-for-agents.md
```markdown
# Recognition-Primed Decision Making: How Experts Actually Choose Actions Under Pressure

## The Core Insight

There is a persistent myth in the design of intelligent systems: that better decisions require evaluating more alternatives more rigorously. Classical decision theory — subjective expected utility, cost-benefit analysis, multi-criteria optimization — assumes that a good decision maker exhaustively generates options, weights them against each other, and selects the maximum expected value solution.

Njå and Rake's analysis of incident command research, drawing heavily on Klein's Recognition-Primed Decision (RPD) model, demolishes this myth for time-pressured, high-stakes, information-scarce domains.

**"Klein's conclusion was that proficient decision makers rarely compare alternatives. Instead, they assess the essence of the situation and select an action which they 'know' will cope with the urgent situation."**

This is not a failure of expert reasoning. It is expert reasoning, correctly adapted to the actual structure of crisis environments. Understanding why requires understanding what makes crisis environments different from laboratory decision problems.

## Why Comparison-Based Decision Making Fails in Crisis Contexts

Classical decision theory was built in the laboratory. Its subjects had:
- Complete option sets (all alternatives were given)
- Stable problem framings (the situation didn't change mid-evaluation)
- No time pressure
- Symmetric uncertainty (probabilities could be estimated)
- No skin in the game

Real incident commanders have none of these. The paper identifies the actual conditions they face:

> "The decision-making context is limited in time and space; situations occur which involve stress and uncertainty with respect to dynamic and continually changing conditions. Changing conditions require real-time reactions. At the incident site, the information is fragmented and ambiguous and it is difficult to form a clear picture of the situation."

In this environment, spending time comparing alternatives means:
1. The situation changes before you finish evaluating
2. The cognitive resources used for comparison are unavailable for situation monitoring
3. The act of evaluation delays action, which has its own consequences
4. The alternatives you're comparing may already be outdated

More fundamentally, the paper notes that normative tools like cost-benefit analysis are "hardly employed at all in crisis decisions" — not because incident commanders are irrational, but because the tools are inapplicable to the actual decision structure.

## How the RPD Model Actually Works

The Recognition-Primed Decision model describes a process with two major cognitive elements: **situation assessment** and **mental simulation**.

**Situation Assessment** is pattern recognition against accumulated experience. The expert incident commander scans the environment for *cues* — the specific observable features that distinguish one situation type from another. These cues trigger a *recognition* process that rapidly classifies the situation into a familiar category, which comes bundled with:
- **Goals**: What needs to be achieved in this type of situation
- **Expectancies**: What should happen next if the situation is what it appears to be
- **Typical actions**: What has worked in situations like this before

The crucial insight is that this classification is *not* a deliberate search through a database. For experts, it is fast, automatic, and largely pre-conscious — closer to perception than to reasoning. The fire officer who arrives at the Bryne fire and immediately reads "fire burning intensively in the basement and main floor, wind direction significant" is not consciously running through a checklist. He is recognizing a gestalt.

**Mental Simulation** is what happens after recognition. Once the expert has identified a candidate action (the first workable one surfaced by recognition), they do not immediately implement it. Instead, they run a brief mental forward simulation: *if I do this, what will happen?* This simulation is not a full causal model — it is a rapid "sense check" that draws on the same experiential knowledge that produced the recognition. If the simulation reveals no show-stopping problems, the action proceeds. If it reveals a problem, the action is modified or a new candidate is surfaced.

This produces the characteristic shape of expert decision-making:
- Very fast initial action selection (recognition phase)
- Brief internal verification (mental simulation)
- Implement, observe feedback, reassess
- Serial rather than parallel option evaluation

**"Experienced decision makers usually try to find a satisfactory course of action; one simply chooses an option that is available and will work."**

Note: *satisfactory*, not *optimal*. This is satisficing (Simon, 1955) applied to time-pressured domains. The first workable option beats the delayed optimal one.

## The Skill/Rule/Knowledge Hierarchy and When Each Applies

Rasmussen's three-level behavior model, which Njå and Rake embed in this analysis, provides the structural framework for understanding when RPD-style recognition applies versus when more deliberate reasoning is needed:

**Skill-Based (SB) behavior**: Performance governed by stored patterns of pre-programmed instructions, executed as analogue structures in a time-space domain. This is automatic, pre-conscious, and fast. Experienced firefighters executing a known hose deployment pattern are operating at this level. Errors at this level are slips and lapses — the right program runs in the wrong context, or execution fails.

**Rule-Based (RB) behavior**: Familiar problems where solutions are governed by stored if-then rules. "If gas leak detected, then shut off supply and ventilate before any ignition source." The rules exist in memory and are retrieved by situation recognition. Errors at this level involve misclassification (applying the wrong rule) or rule gaps (no rule exists for this variant).

**Knowledge-Based (KB) behavior**: Novel situations for which "actions must be planned online using conscious analytical processes and stored knowledge." This is the slow, effortful, explicit reasoning that classical decision theory models. It is cognitively expensive and error-prone. It is also, crucially, necessary in genuinely novel situations — which is precisely where the experienced commander is most likely to be operating without applicable patterns.

The key implication: **expertise does not eliminate KB behavior. It reduces the frequency of KB invocations by expanding the range of situations that can be handled at the SB or RB level.** A novice must think consciously about situations that the expert handles automatically. But both novice and expert must invoke KB behavior in truly novel situations — and the expert may actually be *more* dangerous there, because their strong pattern-recognition will attempt to force a novel situation into a familiar category.

## What This Means for Agent System Design

### 1. Pattern Matching Before Option Generation

Agent systems designed for time-constrained, information-sparse tasks should lead with pattern matching against prior cases, not option generation. The RPD model suggests that the first question should be: "What type of situation is this?" — not "What are all the possible actions?"

This has direct implications for task routing in WinDAGs. The routing layer should not be generating and evaluating multiple possible skill invocation paths simultaneously as its primary strategy. It should first classify the situation type, retrieve the canonical response pattern for that type, verify it via lightweight simulation, and act. Comparative evaluation across multiple paths should be reserved for genuinely novel situations (KB territory) or situations where the initial pattern recognition fails verification.

### 2. Situation Assessment as the Primary Bottleneck

**"Experts are distinguished from novices mainly by their situation assessment abilities, not their general reasoning skills."**

In agent systems, this means the quality of the situational context provided to agents matters far more than the sophistication of the reasoning engine. A highly capable reasoning agent operating on poor situational input will perform like a novice — because expert performance depends on recognizing the situation correctly, which depends on having accurate, appropriately cued situational information.

Implication: Invest heavily in the *representation* of context passed to agents. What cues are surfaced? What gestalt is presented? The agent's ability to pattern-match depends entirely on whether the right features are visible.

### 3. Mental Simulation as Lightweight Verification

Before committing to an action plan, agents should run a brief forward simulation: "Given this action sequence, what are the likely next-state outcomes, and do any of them violate critical constraints?" This is not full exhaustive planning. It is a rapid sanity check that catches obvious failures before execution.

This simulation should be:
- **Fast**: Not a full search tree
- **Failure-focused**: Looking for show-stoppers, not optimizing for best outcomes
- **Experience-grounded**: Drawing on patterns of what has gone wrong in similar past cases

### 4. The Satisficing Threshold Matters

Agents should be calibrated to know when "good enough now" beats "optimal later." In time-pressured decomposition tasks, the first workable sub-task allocation should often be accepted rather than refined further. The cost of continued deliberation (time, resources, cognitive load on coordinating agents) often exceeds the marginal benefit of a better plan.

### 5. Feedback Loops Are Not Optional

The RPD model explicitly includes feedback loops — the incident commander who deploys hoses and then observes whether the fire is actually being suppressed, adjusting tactics based on the result. The mental simulation phase provides *feed-forward* (anticipating outcomes before acting); operational feedback provides *feed-back* (learning from actual outcomes).

Agent systems must close both loops. Action without observation of effect is open-loop control, which fails in dynamic environments. The architectural implication: every skill invocation in WinDAGs should produce observable state changes that feed back into the orchestrating agent's situation assessment.

## Boundary Conditions: When RPD-Style Reasoning Fails

The paper is careful to note limits:

**Novel situations**: When no stored pattern matches, recognition-primed decision making cannot initialize. The commander defaults to KB behavior — slow, effortful, error-prone. Agents must detect the boundary between familiar and novel situation types and escalate appropriately when they cross into genuinely novel territory.

**Tunnel vision**: The sociological (CA) perspective warns that serial commitment to a chosen course of action can become catastrophic when the situation has fundamentally changed. The experienced commander who cannot redefine the situation "sticks with a chosen course of action" even when feedback is signaling failure. Agents need explicit mechanisms for detecting when feedback is persistently negative and triggering full situation reassessment rather than incremental adjustment.

**Groupthink at the agent level**: When multiple agents converge on the same situation assessment and the same action plan without independent verification, the collective intelligence fails. Njå and Rake note that "the preservation of group harmony overrides the group's ability to critically assess decision problems." In multi-agent systems, agents that simply agree with the coordinating agent's situation assessment without independent checking replicate this failure mode.

**Information priority over content**: Commanders under pressure "tend to give priority to the source of information instead of its contents." This is a bias that agent systems can replicate — treating outputs from "trusted" upstream agents as ground truth without evaluating the actual quality of the information. The pipeline must maintain epistemic independence at each stage.

## The Irreducible Role of Experience

The RPD model is fundamentally experiential. Recognition requires having encountered similar situations before. Mental simulation accuracy requires knowing how similar situations have evolved before. Satisfactory action identification requires knowing what has worked before.

For agent systems, this translates to the role of the *case library* — the accumulated store of prior problems, solutions, and outcomes that pattern-matching draws on. A system with no case library has no basis for recognition; it must operate entirely in KB mode. A system with a rich, well-organized case library can operate predominantly in efficient SB/RB mode, reserving KB resources for genuinely novel problems.

The practical implication: case library construction and maintenance is not a nice-to-have. It is the infrastructure on which efficient expert-like performance depends.
```

---

### FILE: epistemic-uncertainty-and-information-triage-in-crisis-systems.md
```markdown
# Epistemic Uncertainty and Information Triage: Acting Well When You Cannot Know Enough

## The Nature of Crisis Uncertainty

When we speak of uncertainty in intelligent systems, we often reach for probabilistic frameworks — probability distributions, confidence intervals, Bayesian updates. These tools assume that uncertainty is *aleatory* — inherent randomness in the world that we can characterize statistically even if we cannot eliminate it.

The incident command research analyzed by Njå and Rake points to a different, more fundamental kind of uncertainty that dominates real crisis environments. Their characterization is precise:

**"Such quantities are uncertain and this uncertainty could be expressed by probabilities. In this sense, the risk is purely epistemic; we are uncertain because we lack sufficient knowledge."**

*Epistemic* uncertainty is uncertainty that exists in the knower, not the world. The number of victims trapped in a collapsed building is not random — it is a fixed, knowable number. But from the incident commander's position, that number is unknown because information retrieval is impossible, dangerous, or delayed. The uncertainty is a property of the *information state*, not the *world state*.

This distinction matters enormously for how systems should handle it. Aleatory uncertainty is managed by expected value calculation. Epistemic uncertainty is managed by *knowledge acquisition* — by reducing the gap between the information state and the world state.

## What Makes Crisis Information So Difficult

The paper catalogs the specific features that make information management hard in crisis environments. Each one maps directly to challenges in complex agent systems:

**Fragmentation**: Information arrives in pieces from multiple sources, each with partial coverage. No single agent at the scene has a complete picture. "The information is fragmented and ambiguous and it is difficult to form a clear picture of the situation."

**Ambiguity**: The same observable cues can be consistent with multiple situation types. Smoke from a basement can indicate a contained fire or a structurally compromised building about to collapse. Without additional cues, the reading is ambiguous.

**Source priority over content**: Under information overload, commanders tend to evaluate information by its source (known, trusted responder) rather than its content. This is cognitively efficient but epistemically dangerous — it means bad information from trusted sources gets through.

**Simultaneous overload and underload**: Crisis systems paradoxically suffer from both too much and too little information simultaneously. "Decision makers need to cope with a peculiar variety of information 'overload' and 'underload' in incoming data." The channel is flooded with low-value information while the specific high-value information needed for the critical decision is absent.

**Analogical gap-filling**: When critical information is missing, decision makers "reduce uncertainty by supplementing sparse information with analogous data and arguments." They treat past similar situations as informative about the current one. This is reasonable — and dangerous. It is reasonable because past cases are genuinely informative. It is dangerous because the current situation may differ from the analogue in precisely the ways that matter most.

**Dynamic drift**: The situation changes while information is being gathered. Information that was accurate 10 minutes ago may be misleading now. There is no stable target — the epistemic goal is a moving one.

## The Three-Layer Information Problem

Njå and Rake's analysis reveals that crisis information problems exist at three distinct layers, each requiring different management strategies:

### Layer 1: First-Order Uncertainty (What Is The Situation?)

The most immediate problem is situation assessment — determining what type of crisis this is and what the current state of the key variables actually is. This is the cue-to-recognition mapping in the RPD model. The quality of first-order information determines the quality of pattern recognition.

Agent system translation: This is the quality of the input context provided to the decision-making agent. If the upstream information gathering is poor, the decision-making agent's pattern recognition will be miscued regardless of its sophistication.

### Layer 2: Second-Order Uncertainty (What Don't I Know, and How Bad Is That?)

More sophisticated than knowing what you don't know is knowing *which of the things you don't know actually matter for the decision at hand*. A commander at a house fire doesn't know the exact gas composition in the basement, but they may not need to for the immediate tactical decision. They do need to know whether anyone is still inside.

This is triage of epistemic gaps — not all missing information is equally consequential. Effective crisis commanders know which gaps to prioritize closing and which gaps to operate through. This is a skill that cannot be formalized through a checklist; it requires understanding the causal structure of how different pieces of information feed into different decisions.

Agent system translation: Agents should maintain an explicit model of *decision-critical unknowns* — the specific information gaps whose resolution would most change the current action plan. Information gathering should be targeted at these gaps, not at generating comprehensive situational awareness.

### Layer 3: Meta-Uncertainty (How Reliable Is My Situation Assessment?)

The most difficult layer is uncertainty about the quality of the situation assessment itself. The experienced commander has a working hypothesis about what type of situation this is. But how confident should they be in that hypothesis? What evidence would falsify it?

The paper's discussion of the Piper Alpha disaster is instructive here. Flin's analysis revealed that the offshore installation managers had "significant weaknesses in their situation awareness and willingness to mitigate risk." They had a situation assessment — but it was wrong, and they weren't testing it against falsifying evidence.

Agent system translation: Every situation assessment should be tagged with a confidence level and a list of observations that would invalidate it. Agents should actively seek disconfirming evidence, not just confirming evidence. The tendency to "give priority to the source of information instead of its contents" is a meta-uncertainty failure — the agent is not questioning whether their situation model is correct.

## The Analogy Trap: When Pattern Matching Misfires

One of the most important and underappreciated warnings in this paper concerns the use of analogical reasoning under uncertainty:

**"Decision makers tend to reduce uncertainty by supplementing sparse information with analogous data and arguments. Specifically, decision makers are inclined to refer to previous crises as a reference point and a means to achieve stability in an unstable and uncertain environment."**

This is the dark side of recognition-primed decision making. The same mechanism that enables experts to make rapid, effective decisions in familiar situations — pattern matching to prior experience — can systematically mislead in genuinely novel situations by forcing novel situations into familiar categories.

The analogical trap has a specific structure:
1. Novel situation presents partial pattern match to a familiar category
2. Expert classifies the situation as familiar type X
3. Expert's mental simulation and action selection are now governed by the X-template
4. But the current situation differs from type X in the specific dimension that determines the correct response
5. The expert acts on the wrong model without realizing the mismatch

For agent systems, this is the fundamental failure mode of any pattern-matching architecture: the system will perform excellently on in-distribution cases and fail silently on out-of-distribution cases that appear superficially similar to in-distribution ones. The failure is silent because the system believes it has correctly classified the situation.

**Mitigation strategies**:
- Maintain explicit "anomaly registers" — features of the current situation that do *not* match the inferred category
- Require active reasoning about what would be different if the situation were *not* of the inferred type
- Monitor expected vs. actual outcomes and flag persistent divergence as a signal of category misclassification
- Do not allow high pattern-matching confidence to suppress KB-level scrutiny in high-stakes situations

## Information Triage in Practice: The Bryne Fire Example

Njå and Rake provide a concrete example that illustrates effective information triage in action. At the Bryne house fire:

The first officer identifies critical cues: location and extent of fire, wind direction, feasible spread. He does not try to gather all possible information — he targets the cues most relevant to the immediate tactical decision (which doors of attack, how many engines).

As the situation evolves, new critical cues emerge: the fire is not being suppressed, which suggests more resource commitment; then, a cue about potential occupants, which shifts the priority entirely. The officer doesn't wait for complete information before acting; he acts on best available information, maintains observation of outcomes, and updates his information priorities as the situation develops.

When the incident commander arrives 20 minutes later, the information triage shifts: now the critical questions are about the comprehensive situation (who is safe, what can be saved, what is the spread risk) rather than the immediate tactical questions. Different decision layer, different information requirements.

**The pattern**: Information gathering is *goal-directed*, not *comprehensive*. The question is always "what do I need to know to make the next critical decision?" not "what can I learn about this situation?"

## Implications for Agent System Architecture

### Design for Active Information Acquisition

Agents in WinDAGs should not be passive recipients of context. They should be equipped with mechanisms to request specific information from upstream agents or the environment when they detect decision-critical gaps. The architecture should support targeted information requests, not just push-based information flows.

### Distinguish Information States from World States

The system should maintain an explicit separation between what is known (information state) and what is estimated to be true (world state model). Actions are taken based on the world state model, but the world state model is always partial and potentially wrong. The gap between them — the epistemic uncertainty — should be a first-class object in the system's reasoning.

### Build Anomaly Detection Into Pattern Matching

Every pattern-match should surface the "anomaly register" — features of the current situation that don't fit the matched category. These anomalies should not be ignored; they should trigger a brief KB-level check: "Could this be a different type of situation than I've classified it as?"

### Prioritize Reducing Decision-Critical Unknowns

When information gathering resources are limited, they should be allocated to closing the gaps that most directly affect the next critical decision. This requires agents to maintain an explicit model of which unknowns are decision-critical and which can be operated through.

### Build Feedback Loops That Detect Model Failure

The paper emphasizes that experienced commanders "collect more information, collect it more systematically, establish adequate goals and evaluate the effects of their decisions." This evaluation is epistemic feedback — comparing expected outcomes to actual outcomes. Persistent divergence signals that the situation model is wrong, not that the situation is being unlucky.

Agent systems should implement this same feedback mechanism: expected outcomes from the current situation model are compared to observed outcomes, and significant divergence triggers situation reassessment rather than incremental plan adjustment.
```

---

### FILE: three-behavior-levels-for-agent-routing.md
```markdown
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
```

---

### FILE: crisis-decision-failures-taxonomy-for-agent-systems.md
```markdown
# A Taxonomy of Crisis Decision Failures: What Breaks When Systems Face Hard Problems

## Introduction: The Contingency Approach's Warning System

While the Recognition-Primed Decision model offers an optimistic view of expert performance — what experts do *well* — the sociological Contingency Approach (CA) analyzed by Njå and Rake catalogs the systematic ways that decision making *breaks down* in crisis conditions. This catalog is not an indictment of individual commanders; it is a structural analysis of failure modes that emerge from the interaction of crisis conditions with human cognitive and organizational constraints.

For agent systems, this taxonomy is invaluable. Each failure mode identified in the CA literature corresponds to a specific failure mode in multi-agent systems operating under uncertainty, time pressure, and information degradation. Understanding these failure modes is the prerequisite for designing systems that avoid them.

## The Master List: Eight Systematic Failure Modes

Rosenthal et al.'s (1989) contingent decision path perspective, as synthesized by Njå and Rake, identifies eight characteristic failure modes in crisis decision making. Each is worth examining in depth.

### Failure Mode 1: Centralization of Decision Making

**The pattern**: "Decision-making becomes increasingly centralised."

In organizational crisis response, what begins as a distributed, multi-agent operation progressively collapses toward a single decision point — the incident commander — who becomes a bottleneck for all critical decisions. This centralization is not simply a poor design choice; it is an emergent property of high-stakes situations. Subordinate agents (human responders) defer decisions upward when stakes are high, because the consequences of being wrong feel personally catastrophic. The result is a system that has nominally distributed capability but operationally centralized throughput.

**Agent system translation**: In multi-agent orchestration, this failure mode appears when agents under pressure route all decisions to the coordinating agent rather than exercising their own bounded authority. The coordinating agent becomes a bottleneck — all sub-tasks await its approval, its bandwidth limits throughput, and its failure (or overload) collapses the entire system.

**Mitigation**: Explicit authority delegation with hard boundaries. Sub-agents must be given genuine authority to make specific classes of decisions without escalation, with clear criteria for what *does* require escalation. The escalation boundary must be enforced both upward (sub-agents don't escalate unnecessarily) and downward (the coordinating agent doesn't re-centralize authority it has delegated).

### Failure Mode 2: Collapse of Formal Procedures

**The pattern**: "Formal rules and procedures give way to informal processes and improvisation."

This is paradoxical: the situations for which procedures were most carefully developed (major crises) are precisely the situations in which procedures are most likely to be abandoned. The cause is that formal procedures are designed for anticipated scenarios, and major crises are characterized by features that were not fully anticipated. When the procedure doesn't quite fit, agents improvise — which may or may not produce better outcomes than following an imperfect procedure.

**Agent system translation**: This failure mode appears when skill invocations begin to deviate from their defined interfaces under pressure — agents modify their input/output contracts, bypass established validation steps, or invoke skills in unauthorized combinations. The system begins operating in a way that differs from its designed behavior, making the actual operation unpredictable and hard to monitor.

**Mitigation**: Procedures must be designed with explicit "graceful degradation" modes — how to operate when the full procedure isn't applicable. Agents should have clear criteria for when improvisation is authorized and what constraints govern it. Post-incident logging should capture deviations from standard invocation patterns for retrospective analysis.

### Failure Mode 3: Bureaucratic Politics

**The pattern**: "Bureaucratic politics flourish."

In multi-organizational crisis response, different agencies with different mandates, cultures, and leadership structures must coordinate. But the crisis simultaneously increases each agency's need to protect its own jurisdiction and authority. The result is political behavior — information hoarding, authority disputes, public positioning — that degrades coordination at the moment coordination is most critical.

**Agent system translation**: In multi-agent systems, this failure mode appears as *resource competition* and *interface disputes* — agents optimizing for their own performance metrics at the expense of system-level outcomes, agents in different subsystems with incompatible interfaces that nobody resolves, agents that hold intermediate results rather than sharing them because sharing creates dependency.

**Mitigation**: System-level metrics that dominate individual agent metrics. Agents must be rewarded for system-level outcomes, not individual throughput. Interface standards must be enforced architecturally, not by convention. Information sharing between agents must be the default, not the exception.

### Failure Mode 4: Information Volume and Speed Overload

**The pattern**: "There is a considerable increase in the volume and speed of upward and downward communications. Crises demand rapid information processing, but also very careful information processing."

The tension is acute: more information is generated per unit time in crisis conditions, and more information is needed per unit time to make good decisions — but human (and agent) bandwidth for processing information does not increase. The result is selective processing, which introduces systematic distortions (what gets through is what confirms existing hypotheses) and latency.

**Agent system translation**: When agent systems scale up in response to a complex problem, the orchestrating agent's communication bandwidth becomes the binding constraint. If it must read and process all messages from all sub-agents, and those sub-agents are generating high-volume outputs, the orchestrator is necessarily processing selectively — and what it selects may not be what matters most.

**Mitigation**: Active filtering at the sub-agent level (sub-agents summarize and prioritize before reporting up), explicit information prioritization protocols (high-criticality signals get through regardless of volume), and bandwidth-aware communication design where orchestrators explicitly manage their attention rather than assuming they can process everything.

### Failure Mode 5: Source Priority Over Content Quality

**The pattern**: "Decision makers tend to give priority to the source of information instead of its contents. It may become impossible to acquire the most crucial aspects of the crisis."

Under time pressure and cognitive load, evaluating the quality of each piece of information is expensive. The cheap heuristic is to evaluate the source: information from trusted, authoritative, proximate sources gets through; information from unknown, peripheral, or low-status sources gets discounted. This heuristic works reasonably well under normal conditions but fails badly in crisis conditions, where the most critical information may arrive from unexpected sources (a civilian who witnessed the initial incident, a junior responder who spotted a structural anomaly).

**Agent system translation**: This is the problem of *provenance-based trust* in agent pipelines. If downstream agents weight upstream agent outputs by the upstream agent's track record or position in the hierarchy rather than by the quality of the current output, the pipeline will systematically discount valuable information from agents with shorter histories or lower positions.

**Mitigation**: Content-based evaluation that supplements source-based trust. Every agent output should carry quality indicators derived from the content itself (internal consistency, consistency with other sources, specificity of claims) alongside source-based trust scores. High-content-quality signals from low-trust sources should trigger verification rather than automatic discounting.

### Failure Mode 6: Anchoring to Initial Situation Definition

**The pattern**: "Decision makers can have extreme difficulty in redefining the situation. They stick to the chosen course of action. Decision makers tend to focus on one goal and one particular way of achieving that goal."

This is perhaps the most dangerous failure mode in high-stakes situations: once an initial situation model has been formed and action has been committed, it becomes very difficult to update the model when new information contradicts it. The commitment to the initial course of action creates psychological and organizational momentum that resists correction. The Piper Alpha disaster is the canonical example: managers who had classified the situation as manageable continued treating it as manageable even as contradicting evidence mounted.

**Agent system translation**: In agent systems, this failure mode appears as *plan commitment without revision triggers*. Once a plan is generated and execution begins, the system continues executing even when intermediate results are signaling that the plan is failing. The system has committed to a course of action and lacks the mechanism to detect that the course of action is wrong.

**Mitigation**: Every plan in execution should have explicit *revision triggers* — conditions under which the plan is suspended and the situation reassessed from scratch. These triggers should be defined at plan generation time, not discovered retrospectively. The revision process should not be incremental adjustment but full situation reassessment, because the failure mode being guarded against is one where the initial situation model is wrong, not where the plan has small execution errors.

### Failure Mode 7: Groupthink

**The pattern**: "Decision makers in crisis units can yield to groupthink — the preservation of group harmony overrides the group's ability to critically assess decision problems and choose an adequate course of action."

Groupthink (Janis, 1982) is the collapse of critical evaluation within a decision-making group under social pressure. In crisis conditions, the social pressure toward consensus is intense: there is no time for extended debate, dissenting voices feel they are impeding the response, and the emotional intensity of the situation makes disagreement feel disloyal. The result is superficial agreement on a course of action that nobody actually believes is optimal, with critical objections suppressed.

**Agent system translation**: In multi-agent systems, groupthink appears when agents converge on a collective assessment or plan without independent evaluation. If agents are sharing intermediate outputs and updating on each other before forming their own assessments, the eventual collective assessment will be more internally consistent but less independently validated. The system effectively loses the diversity of perspective that makes collective intelligence valuable.

**Mitigation**: Architectural independence of assessment. When agents are tasked with evaluating the same situation, they should form initial assessments independently before comparing notes. If a coordinating agent is seeking validation of a plan, it should receive independent assessments from sub-agents, not sequentially updated opinions that have already converged. At least one agent in any critical evaluation should be explicitly tasked with finding reasons the current plan is wrong.

### Failure Mode 8: Inability to Acquire Crucial Information

**The pattern**: A corollary to the overload problem — while the channel is flooded with low-value information, "it may become impossible to acquire the most crucial aspects of the crisis."

This is the information triage failure: the specific information most needed for the critical decision is precisely the hardest to obtain. In crisis environments, this happens because the most critical information often requires accessing dangerous, difficult, or politically sensitive sources. The easier-to-obtain information fills the channel instead.

**Agent system translation**: The pipeline produces large volumes of easily generated information (surface-level analysis, background information, general context) while failing to acquire the specific, targeted information that would most improve the decision quality. Agents generate output because they have bandwidth, not because the output is what the system needs.

**Mitigation**: Decision-driven information requests. Before initiating information gathering, the system should explicitly model what information would most change the current decision, and target information acquisition at those gaps. Agents should be evaluated on the decision-relevance of their outputs, not on volume or comprehensiveness.

## The Compound Failure: When Multiple Modes Interact

The most dangerous crisis situations are not those where one failure mode appears. They are those where multiple failure modes interact and reinforce each other.

Consider the compound failure: centralization occurs (Mode 1), which increases the information load on the central decision maker, who defaults to source priority (Mode 5) to manage the load, which means critical peripheral information is discarded; simultaneously the group converges on an initial situation definition (Mode 7), which triggers anchoring (Mode 6), so new information that contradicts the initial assessment is not just discarded by the overloaded central decision maker but is actively suppressed as a threat to group consensus.

In this compound state, the system continues to operate with high confidence and high activity — but the activity is systematically wrong. There is no visible signal that something is failing; everything looks busy and purposeful. The failure only becomes visible when outcomes diverge catastrophically from expectations.

For agent system design, the most important implication is that **failure mode detection must be architectural, not incidental**. The system must actively monitor for the signatures of each failure mode:
- Is decision throughput disproportionately concentrated in one agent? (Mode 1)
- Are standard skill invocation patterns being bypassed? (Mode 2)
- Are agents sharing critical results? (Mode 3)
- Is orchestrator bandwidth saturated? (Mode 4)
- Is content quality evaluation active alongside source trust? (Mode 5)
- Are revision triggers being monitored? (Mode 6)
- Are agent assessments genuinely independent? (Mode 7)
- Is information acquisition targeted at decision-critical gaps? (Mode 8)

None of these monitors are glamorous. None of them directly solve the primary task. But they are the difference between a system that degrades gracefully under pressure and one that fails catastrophically at the exact moment when performance matters most.
```

---

### FILE: the-retrospective-distortion-problem-for-agent-learning.md
```markdown
# The Retrospective Distortion Problem: Why Learning From Human-Reported Cases Is Dangerous

## The Central Warning

One of the most epistemologically uncomfortable conclusions in Njå and Rake's analysis concerns the reliability of the primary data sources used to build both the NDM and Contingency Approach frameworks. Both research traditions rely heavily on retrospective interviews with incident commanders — structured conversations, often hours or days after the event, in which commanders describe what they observed, decided, and did.

The problem is fundamental: these interviews do not reliably capture what actually happened. They capture what the commanders believe happened, or what they believe should have happened, or what they believe the interviewer wants to hear. The gap between these and the actual event is systematic, not random.

Quarantelli, one of the most experienced disaster researchers, is cited by Njå and Rake with a devastating observation:

> "It has always bothered us that the 'decision-making' we have observed during actual crises seldom corresponds to the picture evoked in later interviews outside of the actual crisis context, where the process is often depicted as explicit, conscious, individually based and involves the consideration of alternative options."

This is not a minor methodological concern. It is a direct challenge to the foundations of crisis decision-making research. If the retrospective interviews don't match what observers actually saw — if the interviews depict *rational deliberation* where observation found *frantic improvisation* — then the theories built on those interviews may describe a fictional decision process rather than the real one.

For agent systems that learn from human-described cases, from human-generated training data, or from human feedback on outputs, this is a critical warning about the quality and type of learning signal.

## The Mechanics of Retrospective Distortion

Why does retrospective recall fail so systematically? Njå and Rake identify several reinforcing mechanisms:

### 1. Normative Reconstruction

**"Scott (1955) suggested that there is a possibility that memory errs in the direction of how the respondent feels he/she should have behaved."**

Memory is not a recording. It is a reconstruction, and reconstruction is shaped by current beliefs about what was appropriate. A commander who, in the heat of the incident, made a rapid intuitive decision without examining alternatives will, in retrospect, describe that decision in terms that sound more deliberate and principled — because deliberate and principled decision making is the norm they believe should govern their behavior.

This means retrospective accounts systematically overreport:
- Conscious deliberation
- Alternative consideration
- Principled reasoning
- Orderly procedure

And systematically underreport:
- Automatic pattern execution
- Gut-level recognition
- Improvisation
- Confusion and uncertainty

The result is that the retrospective interview produces a version of events that is more rational, more deliberate, and more normatively appropriate than the actual event — a post-hoc rationalization that the commander may sincerely believe is accurate.

### 2. Social and Legal Pressure Toward Self-Justification

**"Since damage and/or severe consequences are always involved, blame fixing is an integral — but often indirect — part of communication. Leaders, particularly formal leaders, may be defensive about the way they played their roles during the crisis."**

The stakes of the retrospective interview are high. If the incident resulted in deaths or major damage, the interview occurs in a context where responsibility for those outcomes is being assigned. Commanders know (consciously or not) that their account will be read as evidence for or against their competence. This creates systematic pressure toward accounts that emphasize reasonable choices, appropriate procedures, and unavoidable circumstances.

The defensive interview is not lying. The commander may sincerely believe the account they are giving. But the account has been unconsciously selected and shaped to minimize perceived culpability. The result is a systematically skewed picture of what actually drove the decisions.

### 3. Group Narrative Formation

**"A 'group version' of an event can develop during a very short period."**

Before researchers conduct formal interviews, the people involved in the incident have already talked to each other. A shared story develops — often within hours of the event. This shared story reconciles individual perspectives, resolves contradictions, and establishes a collective account. By the time researchers arrive, they are not getting individual memories but fragments of a socially negotiated narrative.

This group narrative is particularly dangerous for research because it appears to offer consistency (multiple accounts converge) that suggests accuracy, when the consistency actually reflects social construction rather than memorial accuracy.

### 4. Temporal Decay and Telescoping

**"With time, there is a danger that the subjects will have forgotten many details of their experience and that distortion of other recollections will have occurred."**

Memory for sequential detail decays rapidly. The specific cues that triggered a recognition, the exact sequence of decisions, the specific moment at which a situation reassessment occurred — these granular details are precisely the ones most important for understanding the decision process, and they are also the ones most rapidly forgotten. What persists is the gist — the high-level narrative — which is much more amenable to retrospective rationalization.

### 5. Interviewer Bias

**"Interviewers must be cautioned and recautioned against retaining only the data which support the hypotheses of the research design."**

The researchers conducting the interviews have a theory they are testing. The NDM researcher is looking for evidence of recognition-primed decision making. The CA researcher is looking for evidence of organizational political behavior. Both researchers are human, and humans find what they are looking for. The interview data is filtered through the researcher's theoretical lens before it ever reaches the analysis stage.

## The Candor Problem: What Real-Time Observation Finds

Njå and Rake report something remarkable about on-site observation compared to retrospective interview. During an actual crisis, when a researcher directly observed an incident commander and then conducted an informal, in-the-moment interview:

**"As one respondent remarked to Quarantelli's research group, 'I could tell you I know what I am doing, but you can clearly see I'm wildly guessing in much of what I'm doing.'"**

This is an extraordinary admission — one that would almost certainly not appear in a formal retrospective interview. The commander, in the heat of the event, was willing to acknowledge the reality: that much of crisis decision making involves improvisation under profound uncertainty, not principled expertise. But in the post-hoc interview, that same commander would likely describe the decisions in terms of expertise, experience, and professional judgment.

The implication is disturbing for research: **the more authentic, accurate account of crisis decision making is available only in real time, and obtaining real-time accounts requires methods that most research programs cannot implement.** Retrospective interviews, which are far easier to conduct, provide systematically distorted accounts.

## From the Wildfire Study: A Quantitative Measure of Distortion

The paper reports a concrete data point on recall reliability from the wildfire study component of the NDM research program:

When eight respondents were recalled for a second interview three to five months after the first, **the correspondence between critical decision points identified in the first and second interview varied from 56% to 100%.**

The lower end of that range — 56% correspondence — means that nearly half of the critical decision points identified in the first interview were not identified in the second, or vice versa. Given that these are experienced professionals being asked about events they themselves participated in, a 56% consistency rate is remarkably low. It suggests that even the most structured retrospective interview technique (the Critical Decision Method, designed specifically to maximize recall accuracy) produces data that is substantially inconsistent across time.

## Implications for Agent System Learning

### 1. Human-Described Cases Are Not Ground Truth

When agent systems are trained on human-described cases — case libraries, expert knowledge bases, feedback from subject matter experts on what the correct action would have been — the training data reflects the retrospective distortion problem. The cases describe what the expert believes they did or should have done, not necessarily what they actually did or what would actually have worked.

This creates a systematic bias: training data will overrepresent deliberate, rational, procedure-following behavior and underrepresent the actual mixture of intuition, improvisation, and real-time adaptation that characterizes effective expert performance in complex situations.

**Mitigation**: Complement human-described cases with behavioral observation data wherever possible. If the system is being used to support a task where outcomes are measurable, track actual outcomes against predicted outcomes to calibrate the case library. Weight cases toward those where outcomes have been observed and validated rather than simply reported.

### 2. The Normative Contamination Problem

The retrospective distortion problem means that case libraries are likely to contain a significant fraction of *normative* accounts — descriptions of what should have happened, presented as accounts of what did happen. These normative accounts are not useless, but they should not be treated as empirical descriptions of effective expert behavior. They describe an idealized version of expert behavior.

For agent systems, this means calibrating appropriately: normative accounts teach you what the expert thinks is correct procedure; behavioral observation data teaches you what actually works in practice. Both are valuable. Conflating them is dangerous.

### 3. Avoid Building Systems That Replicate Post-Hoc Rationalization

If agent systems are trained primarily on retrospective accounts, they may learn to produce outputs that *sound like* expert reasoning — deliberate, principled, alternatives-considered — without actually implementing the underlying cognitive process. The system becomes a generator of normatively appropriate-sounding explanations rather than a genuine decision support tool.

This is the inverse of the RPD problem. The RPD expert makes good decisions without deliberate comparison. The post-hoc-rationalization-trained agent makes apparently deliberate-sounding recommendations without the underlying experiential knowledge that makes those recommendations trustworthy. The form of expertise without the substance.

**Detection**: Evaluate agent outputs not only for their surface plausibility but for their predictive accuracy. Does the agent's reasoning actually predict outcomes better than baseline? If the agent is producing well-reasoned-sounding explanations that don't actually improve outcome prediction, the system has learned the form of expertise without the substance.

### 4. Real-Time Behavioral Data Is Precious

The paper's finding that real-time observation produces more authentic accounts than retrospective interviews has a direct implication for agent system evaluation: **observing agent behavior in real task execution is more informative than asking agents (or humans) to describe what they do**.

For WinDAGs evaluation, this means:
- Instrument the actual execution traces, not just the outputs
- Compare what agents report doing to what execution logs show they did
- When agents produce explanations of their reasoning, check whether the explanation is consistent with the actual skill invocations and information flows that occurred
- Build evaluation pipelines that track behavior, not just outcomes

### 5. The Group Narrative Problem in Multi-Agent Learning

The "group version of events" problem has a direct parallel in multi-agent systems where agents share intermediate outputs. When agents update on each other's outputs before an evaluation is complete, the eventual collective assessment may appear consistent while being systematically wrong in the same direction — a multi-agent version of the group narrative phenomenon.

**Architectural safeguard**: For critical evaluations, enforce a protocol where agents form initial assessments independently before accessing each other's outputs. The independent assessments are more valuable as training signal — even if they disagree — than the post-convergence consensus.

## The Positive Case: What Real-Time Research Looks Like

Njå and Rake's conclusion is not that crisis decision making is unresearchable. It is that the methodology must match the epistemological challenge:

**"The first thing you must do is to walk very slowly and several times through the area and observe everything you can. Your interpretation of all the statistics you may later play with will differ depending on your observations."** (Quarantelli, 2002)

This methodological principle — that direct observation of actual behavior provides context that no amount of retrospective analysis can replicate — applies directly to agent system design and evaluation. There is no substitute for watching the system work on real tasks, in real conditions, with real consequences. No amount of synthetic evaluation, no number of benchmark scores, and no volume of self-reported capability assessments can substitute for behavioral observation in the actual operational environment.

The retrospective distortion problem is ultimately a call to ground-truth constantly, to prefer behavioral observation over reported behavior, and to maintain epistemic humility about what case libraries and training data actually teach — especially when that data derives from human self-report.
```

---

### FILE: coordination-failure-modes-in-multi-agent-crisis-systems.md
```markdown
# Coordination Failure in Multi-Agent Systems: What Incident Command Research Teaches About Collective Intelligence

## The Coordination Problem at Scale

Individual agent expertise, however excellent, is not sufficient for complex problem resolution. The real test of any intelligent system — human or artificial — comes when multiple agents with different capabilities, different information states, and different authority structures must coordinate toward a shared goal in a dynamic, uncertain environment.

Njå and Rake's analysis of incident command research is fundamentally a study of this coordination problem. The incident commander is not working alone; they are orchestrating a team of responders, coordinating with other agencies, managing communication flows, and trying to maintain a coherent shared picture of a rapidly evolving situation. The failures they document are not primarily individual cognitive failures. They are coordination failures — breakdowns in the mechanisms that should allow multiple agents to operate as an effective collective.

This makes the paper's findings directly relevant to WinDAGs and similar multi-agent orchestration systems.

## The Handoff Problem: Transfer of Command at Critical Moments

One of the most important and underappreciated observations in the paper concerns command handoffs:

**"Normally, there is at least one transfer of the leading officer during a major incident, which is critical for response performance. The dynamics of the commanding structure are almost absent from the research literature."**

Consider what a command handoff actually involves. The outgoing commander has accumulated a rich, tacit, partially verbal situation model — they know where all the resources are deployed, what the current tactical plan is, what they tried that failed, what they're monitoring, what concerns them that they haven't acted on yet, and what they're waiting for. The incoming commander has none of this.

The formal handoff briefing — however well executed — cannot transfer the full richness of the outgoing commander's situational understanding. The gaps are always larger than either party realizes. The incoming commander starts with an impoverished situation model and must rapidly reconstruct it from available cues — a process that takes time, during which the quality of command degrades.

**"In Norway and Sweden, normally two to six persons are involved in the initial phase, in which a low-ranking officer carries out the commanding on-scene. The nominated incident commander arrives later, within an hour after the first alert has been received."**

This is not a bug in the incident command system; it is an unavoidable feature of how emergency response works. But it means that the transition from the initial low-ranking officer (who has been on-scene and has rich situational knowledge but limited authority and resources) to the nominated incident commander (who has authority and resources but limited situational knowledge) is a predictable coordination failure point.

**Agent system translation**: Every handoff between agents — every moment where one skill completes and passes its output to the next — involves a version of this problem. What information is actually transferred? What tacit context does the passing agent have that is not captured in its formal output? What assumptions has it made that the receiving agent will inherit without knowing they are assumptions?

**Design principles**:
- Handoff specifications should be richer than output specifications. The output of a skill is what it produced; the handoff should include what it found notable, what it tried and rejected, what it's uncertain about, and what would change its conclusions.
- Receiving agents should have an explicit "situational reconstruction" phase where they verify their understanding of the situation before proceeding, rather than simply inheriting the passing agent's output as ground truth.
- Critical handoff moments should be logged with richer context than routine handoffs, because they are the moments most likely to introduce systematic errors.

## The Role Ambiguity Problem: When Orchestration Structure Breaks Down

Njå and Rake note that in crisis situations, "bureaucratic patterns are bound to change profoundly." The formal organizational structure — which agent is responsible for what, who has authority to make which decisions, how escalation should work — is designed for anticipated conditions. Major crises often violate those anticipated conditions, and the formal structure fails to map cleanly onto the actual situation.

The result is role ambiguity: multiple agents believe they have responsibility for the same decision, or no agent believes it has responsibility for a critical decision. Both patterns produce coordination failure.

The paper describes a related phenomenon in the Scandinavian emergency services context: "It can be quite circumstantial who becomes the incident commander and what managerial background and experience he/she possesses to make adequate decisions." In other words, the person in the commanding role may not be the person best equipped for that role — they happened to arrive first, or they happened to hold the relevant rank. The formal structure assigns authority by position, but capability may not follow position.

**Agent system translation**: In WinDAGs, this maps to the problem of skill selection under novel conditions. The skill selection system may be designed for anticipated task types. Novel task types may activate skills that are formally appropriate (they handle the right domain) but not actually best positioned for the specific variant of the problem at hand.

**Design principles**:
- Role assignment should be capability-based and dynamic, not fixed by position in the DAG. The right skill for a task should be determined by the specific task characteristics, not by a static assignment.
- When role ambiguity is detected (multiple skills claiming jurisdiction, or no skill claiming jurisdiction), the coordination layer must explicitly resolve it rather than letting it proceed with informal arrangements.
- The coordination layer should monitor for cases where the assigned skill and the best-available skill differ and flag these for review.

## Information Flow Architecture: The Intelligence Picture Problem

Crisis coordination depends critically on maintaining a shared operational picture — a common understanding of the situation across all coordinating agents. But different agents have access to different information, develop different partial models of the situation, and communicate those models imperfectly to each other.

The Contingency Approach identifies several systematic distortions in this information flow:

**Upward distortion**: Information filtered as it moves up the command structure. Each intermediate layer summarizes, interprets, and presents information in a form that supports their own situation model. By the time information reaches the top-level decision maker, it has passed through multiple interpretive filters.

**Downward distortion**: Directives and plans from the top level are interpreted and adapted by each intermediate level before being executed. The original intent may be significantly modified by the time it reaches the executing agents.

**Lateral gaps**: Information shared horizontally between agents at the same level is often incomplete. Agents may not know what other agents at the same level know, leading to duplicate effort, conflicting actions, or gaps where each assumes the other is covering.

The paper quotes Quarantelli on a fundamental limitation: "Too many current disaster researchers who are the ultimate analysts of data often not only get the information third-hand via first an interviewer and then a coder, but also have absolutely no direct experience in disaster occasions which would give them a larger context for interpreting the data."

The chain of information transformation — from incident to interviewer to coder to analyst — degrades fidelity at each step. The same chain exists in agent pipelines: from raw environment to sensor to classifier to analyst to orchestrator to output.

**Design principles**:
- Information should travel as close to its raw form as possible through agent pipelines, with interpretation happening at the consuming end rather than the generating end.
- Each stage of information processing should be logged, allowing the receiving agent to inspect not just the processed output but the processing chain that produced it.
- The orchestrating agent should maintain an explicit model of the information gap between its own picture and the ground truth — acknowledging what it doesn't know rather than treating its current model as complete.

## The Expertise Distribution Problem: No Single Expert Holds All Knowledge

Crisis incidents require expertise that is distributed across multiple responders. The fire brigade knows fire suppression. The police control crowd and traffic. The medical team manages casualties. The structural engineer assesses building integrity. No single agent holds all the relevant expertise, and the coordination challenge is ensuring that the right expertise is applied to the right sub-problem at the right moment.

But expertise coordination faces a characteristic challenge: experts in different domains often cannot fully communicate their knowledge to each other. The fire officer who knows intuitively that a particular fire pattern suggests structural risk cannot fully articulate that knowledge to the structural engineer; the structural engineer cannot fully articulate the specific threshold concerns to the fire officer. The knowledge is partially tacit and partially domain-specific in its expression.

The paper notes this asymmetry in the different research approaches: NDM research is deeply concerned with individual expert knowledge and its characteristics; the CA is concerned with organizational and political coordination. Both are correct about what they focus on, but neither has a complete theory of how individual expert knowledge gets coordinated into collective expert performance.

**Agent system translation**: In WinDAGs, different skills encapsulate different forms of expertise. The coordination challenge is ensuring that the orchestrator correctly identifies which skills' expertise is relevant to which sub-problem, that relevant outputs from one skill are communicated in a form that can be used by other skills, and that conflicts between different skills' recommendations are resolved intelligently rather than by arbitrary priority.

**Design principles**:
- Skill outputs should include not just conclusions but the key evidence and reasoning that support those conclusions, so that other skills (and the orchestrator) can evaluate their relevance.
- When skills with different domain expertise produce conflicting outputs, the conflict should be surfaced and explicitly resolved rather than resolved by default priority ordering.
- The orchestrator should maintain a model of which sub-problems have been addressed by which skills' expertise and which sub-problems remain without expert coverage.

## The Performance Measurement Problem: Knowing When You're Doing Well

Njå and Rake raise a challenge that strikes at the heart of both crisis management research and agent system evaluation:

**"There is no easily accessible and measurable output quantity of incident commanding which can be used as the dependent variable."**

In a manufacturing process, performance is easily measured: output rate, defect rate, throughput time. In crisis management, what is the performance metric? Number of lives saved? But the counterfactual — how many would have been saved under different management — is unknowable. Response time? But faster isn't always better; a well-coordinated slower response may save more lives than a rapid but chaotic one.

The same problem confronts agent system evaluation. What does it mean for a multi-agent system to perform well on a complex, open-ended task? The output may be objectively correct (technically accurate, logically valid) but inappropriate for the context. It may be contextually appropriate but arrived at through a fragile reasoning chain that will break on slight variations. It may satisfy the stated requirements while missing the actual need.

**"If the outcomes were used as a basis for the assessment of the incident commanders' decision making, this would also be a highly dubious process. The decisions are contextual and should be assessed on specific evidence, circumstances and the commander's assessments in real time."**

This is a profound point: outcome-based evaluation of decision quality is problematic because good decisions can produce bad outcomes (bad luck) and bad decisions can produce good outcomes (good luck). Evaluating the decision requires evaluating the *process* — was it reasonable given what was known at the time? — not just the outcome.

**Design principles for agent system evaluation**:
- Evaluate the *process* as well as the outcome: Was the situation assessment accurate given available information? Were the actions selected appropriate for the situation as understood? Were feedback loops active?
- Include diversity of evaluation: technical accuracy, contextual appropriateness, reasoning transparency, robustness to variation, and process quality are all distinct dimensions.
- Distinguish lucky successes from reliable successes: a system that produces the right answer through a flawed process is less trustworthy than one that produces the right answer through a sound process, even if both produce the same outcome on a given case.
- Maintain longitudinal evaluation: performance on a single task is weak evidence; performance patterns across many tasks in varied conditions is the true measure of system capability.

## Conclusion: Building Coordination Into Architecture, Not Policy

The central lesson from Njå and Rake's coordination analysis is that coordination failures are not primarily the result of agents behaving incorrectly by their own lights. They are structural — built into the way the system is organized, the way authority is distributed, the way information flows, and the way performance is measured. "Emergency workers had been swallowed up in a system that failed them despite their best individual efforts."

This means coordination quality cannot be enforced through better instructions to individual agents. It must be built into the architecture: the structure of handoffs, the format of information sharing, the mechanisms of conflict resolution, the granularity of authority delegation, and the design of feedback loops. Individual agents doing their best within a poorly coordinated architecture will produce poor collective performance. Individual agents doing their best within a well-coordinated architecture will produce collective performance that exceeds what any individual agent could achieve alone.

This is the promise and the challenge of multi-agent systems: the potential for collective intelligence that exceeds individual capability, and the very real risk of collective failure that falls below individual capability. Njå and Rake's analysis of incident command failure modes is a detailed map of the traps on the path between those two outcomes.
```

---

### FILE: novice-to-expert-progression-in-agent-capability.md
```markdown
# From Novice to Expert: How Intelligent Systems Should Develop Capability Over Time

## The Dreyfus Model and What It Means for Agent Development

Klein, Orasanu and Connolly, Cosgrave, and Dreyfus and Dreyfus (1986) converge on a description of expertise that is fundamentally different from what we might naively expect. Njå and Rake synthesize this view:

**"An expert is a person who generally knows what needs to be done based on mature and practised understanding. An expert's skill has become so much a part of him that he does not need to be more aware of it than of his own body. When things proceed normally, experts are not actively solving problems or making decisions; they are intuitively doing what normally works."**

This is a striking picture. The expert is not a person who deliberates better, reasons more carefully, or has access to more decision rules than the novice. The expert's defining characteristic is that *conscious deliberation has become unnecessary for the vast majority of situations they encounter*. The knowledge has been internalized to the point where it executes automatically.

But this description also contains an important qualification:

**"Whilst most expert performance is ongoing and nonreflective, when time permits and outcomes are crucial, an expert will deliberate before acting. This deliberation does not require calculative problem solving, but rather involves critically reflecting on one's intuition."**

The expert is not always in automatic mode. They have the capacity to step back and critically examine their intuitive response — to ask "Is my intuition right here?" — and to do this without defaulting to the slow, calculative KB mode. Expert deliberation is *reflective* rather than *calculative*. It is checking the intuition, not replacing it.

This two-mode picture of expertise — automatic intuitive action in familiar situations, reflective checking in high-stakes or ambiguous situations — is the target state for any intelligent agent system that must operate in complex, dynamic environments.

## The Novice-Expert Distinction in Practice

The paper identifies a specific empirical finding from fire ground commander research that concretely illustrates the novice-expert distinction:

**"The experts showed a higher tendency to deliberate over situations and novices deliberated more on alternative options."**

This is counterintuitive. One might expect novices to deliberate less (being less capable of sophisticated reasoning) and experts to deliberate more (having more sophisticated reasoning available). But the finding is the opposite: novices deliberate *about which option to choose*, while experts deliberate *about whether their situation assessment is correct*.

This distinction maps precisely onto the Rasmussen SB/RB/KB framework:
- Novices operate primarily at KB level even in routine situations, because they lack the compiled patterns to handle situations at SB or RB level. Their deliberation is about option selection.
- Experts operate at SB/RB level in routine situations. Their deliberation, when it occurs, is meta-level — checking whether the situation actually belongs to the category they've classified it into.

The novice's problem is not that they make bad choices from the options they're considering. It is that they spend cognitive resources on option selection that the expert spends on situation assessment. And because situation assessment is the more fundamental problem — a correct situation assessment with good-enough option selection beats an incorrect situation assessment with optimal option selection — the expert's allocation of cognitive resources is superior.

## The Generalization-Discrimination Balance

One of the most practically important concepts in Njå and Rake's analysis is the balance between generalization and discrimination:

**"Personnel must be able to recognise typical signs (cues, characteristics) of the situations and respond with determined behaviour. The personnel must also be able to evaluate the consequences of their own behaviour and recognise whether it is effective or not."**

**"Discrimination is the opposite of generalisation. The personnel must be able to distinguish between situations that require different behaviour. The balance between discrimination and generalisation represents emergency management's philosophy regarding the behaviour flexibility of their emergency response organisations."**

*Generalization*: Applying the same response to all situations that share critical features, even when they differ in non-critical features. A fire in a residential building of type A and a fire in a residential building of type B may share enough features that the same tactical template applies — the experienced commander generalizes across the superficial differences.

*Discrimination*: Recognizing that apparently similar situations actually require different responses because of critical distinguishing features. A fire in a building with known occupants and a fire in an empty building look similar but require different priority allocation.

The expert must do both. Over-generalization means applying the same response to situations that actually require different handling. Under-generalization means treating every situation as unique and reinventing the response from scratch.

For agent systems, this balance maps to the fundamental tension in machine learning between underfitting (over-generalization, treating too many situations as the same type) and overfitting (under-generalization, treating slightly different situations as fundamentally different types requiring unique handling).

**The practical implication**: Agent capability assessment should evaluate both generalization ability (can the agent correctly handle novel instances of familiar situation types?) and discrimination ability (can the agent correctly distinguish situations that look similar but require different responses?). A system that generalizes well but discriminates poorly will confidently apply the wrong template to cases that are superficially similar but critically different. A system that discriminates well but generalizes poorly will treat familiar situations as novel, wasting KB resources on routine cases.

## The Quality Problem: What Makes a Good Decision?

Njå and Rake raise a pointed critique of NDM research that has direct implications for agent evaluation:

**"Yates (2001) raised questions about NDM researchers' lack of distinction between good and bad decisions. The issue is that experienced decision makers, whoever they might be, make better decisions in concurrence with the RPD model. On the other hand, a bad decision could very well be a result of people actually 'knowing too few facts that really matter and too many about things that don't.'"**

This critique is fundamental. The NDM framework shows that experienced decision makers use recognition-primed decision making. But this doesn't mean all recognition-primed decisions are good. An experienced decision maker with incorrect or incomplete pattern knowledge will make fast, confident, consistently wrong decisions. The speed and confidence are features of the recognition-primed mode; the accuracy is a function of the quality of the underlying knowledge.

This means expertise has two components that must both be evaluated:
1. **Process expertise**: Does the agent use appropriate decision processes — situation assessment, pattern recognition, mental simulation, feedback integration?
2. **Content expertise**: Is the agent's knowledge base accurate, complete, and appropriately calibrated?

An agent with strong process expertise but poor content expertise will apply expert-like decision processes to reach wrong conclusions quickly and confidently. An agent with strong content expertise but poor process expertise will have the right knowledge but apply it inefficiently or incorrectly.

The most dangerous failure mode is an agent with high process expertise confidence and poor content expertise — it will produce rapid, confident, well-reasoned-sounding wrong answers, and it will be the hardest to catch because the form of its outputs will appear expert-like.

**For WinDAGs**: Skill evaluation must assess both process quality (Is the skill following sound reasoning procedures?) and content quality (Is the knowledge the skill is drawing on accurate and appropriately current?). High process quality scores do not guarantee high content quality. Both must be independently assessed.

## Building Toward Expert Performance: The Learning Architecture

Rasmussen's framework implies a specific learning trajectory: KB → RB → SB. Novel situations handled through KB reasoning, when they produce good outcomes, provide the raw material for RB rule formation. RB rules that prove reliably applicable across many situations become SB patterns.

For agent systems, this suggests a learning architecture with three phases:

**Phase 1 — KB Phase (Novel Situation Handling)**:
- All genuinely novel situations are handled through first-principles KB reasoning
- KB reasoning processes are fully logged with decision points, information considered, alternatives examined, and conclusion rationale
- Outcomes are tracked against predictions

**Phase 2 — RB Rule Induction**:
- When a cluster of KB-handled situations shares a common pattern (similar features → similar successful response), induce an explicit RB rule
- The induced rule captures the situation classification criteria and the associated response
- Rules are tested prospectively on new cases before being added to the active RB layer

**Phase 3 — SB Pattern Formation**:
- When an RB rule has been validated across many cases with high reliability, it can be promoted to SB-equivalent automated response
- SB-level responses require no deliberation; they execute automatically on matching situation recognition
- SB patterns are monitored for context drift — cases where the situation features that triggered the SB pattern have changed in ways that invalidate the underlying logic

**The critical safety constraint**: Promotion from KB to RB to SB should be conservative. The cost of incorrectly promoting a KB response to SB level is high — the system will make confident, rapid, wrong decisions in situations that actually required deliberation. False promotion is more dangerous than false retention. It is always better to be overly conservative in promoting patterns and waste some KB resources than to be overly aggressive and embed wrong patterns into the automatic response layer.

## The Leadership Paradox: Why Crisis Performance Differs From Routine Performance

Flin's (2001) analysis of the Piper Alpha disaster, cited by Njå and Rake, produces a finding with profound implications:

**"Leadership in routine situations may not predict leadership ability for crisis management."**

This is striking. The skills that make someone an effective leader in normal conditions — maintaining organizational order, managing routine complexity, executing established procedures, coordinating normal operations — are not the same skills that make someone effective in a major crisis. Crisis leadership requires situation assessment under extreme uncertainty, rapid decision making with incomplete information, willingness to violate established procedures when they are inapplicable, and maintaining cognitive clarity under intense emotional stress.

Worse: the patterns of behavior that work well in routine situations can actively impede crisis performance. The manager who succeeds by following procedures carefully will be impeded by their commitment to procedure when the crisis requires improvisation. The manager who succeeds by centralized control will create a bottleneck when the crisis demands distributed rapid response.

**Agent system translation**: An agent system tuned for routine performance may actually be misconfigured for crisis performance. The optimizations that improve routine performance — aggressive caching, pattern matching, automated execution, centralized coordination — can become liabilities in novel, high-stakes situations that require deliberation, novelty detection, and distributed authority.

This is a fundamental argument for building *mode-switching* into agent systems. The system should be capable of detecting when it is in routine mode versus crisis mode, and adjusting its operating parameters accordingly:
- Routine mode: aggressive pattern matching, automated execution, centralized coordination, fast throughput
- Crisis mode: conservative pattern matching with explicit anomaly checking, KB-level deliberation, distributed authority, slower throughput with higher verification

The failure to implement mode switching means the system will be optimized for one mode and vulnerable in the other. Given that crises are precisely when performance matters most, the failure to perform well in crisis mode is the more costly misconfiguration.
```

---

### FILE: the-theory-practice-gap-in-crisis-decision-research.md
```markdown
# The Theory-Practice Gap: When Research Models Fail to Meet Operational Reality

## The Gap Njå and Rake Are Actually Diagnosing

The surface reading of this paper is that it compares two frameworks for crisis decision making. But the deeper diagnosis is about an institutional failure: the gap between research communities that produce models of crisis decision making and operational communities that practice crisis management. This gap is not incidental; it is structural, culturally conditioned, and self-perpetuating — and it has direct consequences for how decision support systems get designed.

Njå and Rake are explicit about this at the paper's conclusion:

**"Incident commanders and their emergency organisations appear to be very little concerned with research and the practical use of scientific results. The barriers between researchers and first responders are both structurally and culturally conditioned. There are very few arenas where researchers and operative responders meet. Researchers developing descriptive and normative models seem unable to communicate with the responders. The responders, on the other hand, work in a rather enclosed community in which exposure to outside criticism is infrequent and experience transfer within and across services does not work very well."**

This is a diagnosis of mutual isolation. The researchers don't understand operations well enough to make their models applicable. The practitioners don't engage with research enough to benefit from it. And critically: neither side has good feedback loops to the other.

For agent systems, this is a warning about the relationship between the system designers (analogous to researchers) and the system operators (analogous to practitioners). If this relationship is not actively managed, the same mutual isolation will develop: a system built on models that don't accurately represent operational reality, used by operators who have neither the context to evaluate the model's validity nor the channel to communicate its failures back to the designers.

## The Normative vs. Descriptive Confusion

A central methodological challenge the paper identifies is the confusion between normative models (how decisions *should* be made) and descriptive models (how decisions *are* made). Both NDM and the CA claim to be primarily descriptive — they are telling us how decisions actually happen in crisis environments. But both inevitably import normative elements:

- The RPD model was developed by observing expert decision makers and identifying their strategies. But which decision makers were selected as "expert"? The selection criteria import a normative judgment about what good performance looks like.
- The CA's description of bureaucratic failure modes implies a normative standard: these are failures because there is a better way to operate. But what is that better way?

**"The literature on crisis and emergency management outlines theories and models on how decisions are typically made (descriptive models) or how they should be made (prescriptive models)."**

The problem is that when normative and descriptive models are conflated, the prescriptive force of the model is incorrectly grounded. If I say "you should make decisions like this because this is how experts actually decide," and it turns out that experts actually decide differently, then my prescriptive advice is built on a false empirical premise.

For agent systems, this confusion appears in the design of decision support: is the system modeling how humans actually make decisions in this domain (descriptive), or how they should make decisions (normative), or how the system's own reasoning process works (mechanistic)? These are three different things, and conflating them produces systems that are evaluated against the wrong standard.

**Design implication**: Agent systems should be explicit about which mode they are operating in:
- *Descriptive mode*: Modeling how domain experts actually behave, for purposes of automation or assistance that matches expert practice
- *Normative mode*: Implementing an ideal decision process, regardless of how humans currently do it
- *Mechanistic mode*: Executing a computational procedure that may not correspond to any human decision process

Each mode has appropriate evaluation criteria. Descriptive mode should be evaluated against behavioral match to expert practice. Normative mode should be evaluated against outcome quality. Mechanistic mode should be evaluated against computational correctness. Mixing these evaluation criteria produces systematically misleading assessments.

## Action Cards, Procedures, and the Limits of Explicit Knowledge

The paper notes that one application of crisis decision research is "a basis for developing procedures (e.g., action cards)." Action cards are explicit, pre-written guidance documents that responders are supposed to consult in specific situations. They are the embodiment of normative decision guidance — the "correct" action sequence for defined situation types.

But the paper's analysis of actual crisis behavior reveals the fundamental tension with this approach:

**"Formal rules and procedures give way to informal processes and improvisation."** (From the CA's findings)

And from the RPD perspective: experienced decision makers don't consult action cards — they act on recognition. The action card is essentially an attempt to make an expert's compiled RB knowledge available to a novice in text form. But the novice's problem is not that they lack the action sequence — it is that they lack the situation classification ability needed to know *which* action card applies.

This is a version of the classic problem in knowledge management: explicit knowledge (what can be written down) is a subset of tacit knowledge (what experts actually know). The action card can capture the "if-then" rule, but it cannot fully capture the pattern recognition ability that correctly classifies the situation as one to which the rule applies.

**The implication for agent systems**: Pre-written skill invocation sequences, decision trees, and fixed protocols face the same limitation. They encode the action part of expert knowledge but not the situation assessment part. A system that has excellent decision procedures but poor situation classification will apply excellent procedures to the wrong situations — often with high confidence.

This is why the paper argues for developing better *naturalistic* methods — approaches that can capture the tacit, experiential, perceptual elements of expert knowledge, not just the explicit rule structures.

**For WinDAGs**: The skill library should be understood as encoding procedural knowledge (the "what to do" part), but the orchestration layer must encode situational knowledge (the "when this applies" part). Gaps in the orchestration layer's situational knowledge will produce confident, systematic misapplication of otherwise correct skills.

## The Control Problem: Measuring Performance Without a Dependent Variable

Njå and Rake raise a methodological challenge that goes to the heart of both research and system evaluation:

**"There is no easily accessible and measurable output quantity of incident commanding which can be used as the dependent variable, for example, the production rate of a process system. The independent variables are also difficult to retrieve and scale in an analysis of incident command."**

This is the control problem: without a clear, measurable dependent variable (outcome quality), it is impossible to conduct the kind of controlled analysis that would allow us to definitively say "this decision process produces better outcomes than that one." We are left comparing processes without a reliable measure of their outputs.

The researchers have attempted workarounds:
- Using expert judgment to evaluate decision quality (but expert judgment is itself subject to retrospective distortion)
- Using incident outcomes as proxies (but outcomes depend on factors beyond command quality)
- Using process adherence as a measure (but normative and descriptive models disagree about what good process looks like)

None of these is satisfactory. And the paper is honest about it: both NDM and CA research have the problem of controls — both struggle to make valid inferences about causal relationships in crises.

**This matters for agent system design in three ways**:

**1. Evaluation methodology must be matched to domain characteristics**: Agent systems operating in crisis-like domains (high uncertainty, dynamic environments, novel problem types) face the same dependent-variable problem. The evaluation metrics appropriate for well-defined tasks (accuracy, precision, recall, BLEU score, etc.) may be inappropriate or misleading for open-ended, contextual tasks.

**2. Process metrics supplement outcome metrics**: Since outcome quality is often difficult to measure directly, process quality metrics (Is the reasoning transparent? Is the situation assessment calibrated? Are feedback loops active? Are uncertainty estimates appropriate?) provide complementary evaluation evidence.

**3. Longitudinal evaluation matters more than single-task evaluation**: In the absence of clean causal analysis, the best evidence for system quality is consistent performance across many diverse tasks. This requires maintaining evaluation infrastructure that tracks performance over time, not just at deployment.

## The Research-Practice Interface as a System Design Problem

Njå and Rake's conclusion about the researcher-practitioner gap is ultimately a statement about system design: a system in which feedback from operations doesn't flow back to system design will perpetuate systematic errors. The researchers produce models; the practitioners operate under those models; the models are wrong in ways that the practitioners can see; the practitioners have no channel to communicate those errors back to the researchers; the researchers continue developing increasingly sophisticated versions of the wrong model.

This is a closed-loop failure. The system is producing high-volume outputs (research models, procedures, training programs) and receiving no effective feedback. It is operating open-loop.

**The agent system parallel is exact**: A WinDAGs system that does not have effective feedback from operators about where its outputs are wrong, where its skill invocations are inappropriate, where its situation assessments are miscalibrated, will perpetuate those errors even as it accumulates more experience. More experience without feedback correction produces more confident, more consistent wrong answers.

The practical requirements for closing the loop:
- **Structured feedback channels**: Operators must have a mechanism to flag specific outputs as wrong, with enough context for the system designers to understand why
- **Active error seeking**: The system designers must actively seek failure cases, not wait for operators to report them — operators under time pressure will not systematically document system failures
- **Feedback integration**: Error reports must be integrated into system improvement, not merely logged
- **Validation before deployment**: Changes to system behavior must be validated against the class of errors they are supposed to fix before being deployed

The theory-practice gap is not a natural law. It is a failure of system design. The agent orchestration system that takes this lesson seriously will build feedback mechanisms as core architecture, not as afterthoughts.

## What This Book Is Really Arguing

Stepping back to the meta-level: Njå and Rake's paper is an argument for *epistemological humility* in crisis decision research — and, by extension, in the design of any system meant to operate in complex, uncertain, high-stakes environments.

Their argument:
1. Both dominant frameworks (NDM and CA) have genuine insights
2. Both are also built on methodologically compromised foundations (retrospective interviews, selection effects, researcher bias)
3. The frameworks have been developed in relative isolation from each other and from operational practice
4. The gap between the models and reality is larger than either research community acknowledges
5. Closing that gap requires better methods, better researcher-practitioner interaction, and greater honesty about what we don't know

For agent systems, this translates to: operate with confidence appropriate to the quality of your knowledge base; maintain active mechanisms for updating that knowledge base when it is wrong; prefer robust processes over optimal ones in novel situations; and build feedback loops as core architecture, not as optional instrumentation.

The agent system that embodies this epistemological humility will outperform the one that doesn't — not because humility is intrinsically valuable, but because the domain is genuinely uncertain and systems calibrated to the actual uncertainty of their domain will outperform those that are overconfident about their knowledge.
```

---

## SKILL ENRICHMENT

- **Task Decomposition**: The SB/RB/KB hierarchy provides a principled basis for decomposition decisions — tasks should be decomposed to the level at which sub-tasks can be handled at the appropriate behavioral level. Sub-tasks that can be handled at SB/RB level should not be further decomposed into explicit KB reasoning steps; sub-tasks that genuinely require KB-level reasoning should not be assigned SB/RB handling. The paper teaches decomposers to first classify the cognitive demand of each sub-task before assigning it.

- **Debugging and Root Cause Analysis**: The crisis decision failure taxonomy directly enriches debugging frameworks. The eight failure modes (centralization, procedure collapse, politics, information overload, source priority bias, anchoring, groupthink, information starvation) map to debugging anti-patterns: anchoring on initial hypotheses, accepting tool outputs uncritically because of source trust, failing to revise the mental model when evidence contradicts it. The RPD model suggests that expert debuggers recognize problem signatures first and only deliberate about alternatives when recognition fails.

- **Code Review**: The generalization-discrimination balance is directly applicable to code review. A code reviewer that over-generalizes (applies the same pattern judgment to all structurally similar code) will miss critical contextual differences. One that under-generalizes (treats every piece of code as unique) will be inefficient and inconsistent. The paper teaches calibration between these modes.

- **Security Auditing**: The analogical trap warning is critical for security work — auditors must not assume that a pattern that looks like a known vulnerability actually *is* that vulnerability, nor that the absence of known vulnerability patterns means a system is safe. The anomaly register concept (explicitly tracking features that don't fit the inferred category) is a valuable tool for auditing novel attack surfaces.

- **Architecture Design**: The coordination failure taxonomy (especially the centralization, information flow, and role ambiguity failure modes) provides a checklist for architectural anti-patterns. Architectures that centralize all decisions at a single coordinator, that allow information to be heavily filtered as it flows through the system, or that have ambiguous authority boundaries will replicate the crisis coordination failures documented in the paper.

- **Agent Orchestration**: The full RPD model and the SB/RB/KB hierarchy provide the theoretical foundation for a principled orchestration routing system — one that routes tasks to the appropriate behavioral level based on novelty assessment, stakes, and time pressure, rather than routing based on arbitrary pipeline position.

- **Human-AI Interaction and Feedback System Design**: The retrospective distortion analysis directly enriches the design of human feedback collection mechanisms. Human feedback on AI outputs is subject to the same normative reconstruction bias documented in this paper — humans will report what they think should have been correct, not necessarily what would actually have been most useful. Feedback collection systems must be designed to elicit behavioral evidence, not retrospective judgment.

- **System Monitoring and Observability**: The paper's argument for real-time observation over retrospective analysis translates directly into requirements for system observability. Execution traces must capture enough detail about the actual decision process (not just the output) to support meaningful retrospective analysis. The chain from execution to log to analyst is a fidelity-degrading transformation at each step.

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: The RPD model provides the psychological basis for recognition-before-deliberation orchestration architectures. The coordination failure taxonomy provides the checklist for orchestration anti-patterns to avoid. The SB/RB/KB hierarchy provides the theoretical basis for capability-level routing.

- **Task Decomposition**: Rasmussen's behavior levels suggest a principled decomposition strategy: identify the appropriate cognitive level for each sub-task, then decompose until each sub-task can be handled at its appropriate level. Do not decompose SB tasks into KB sub-tasks (over-decomposition); do not assign KB tasks to SB handling (under-decomposition).

- **Failure Prevention**: The eight crisis decision failure modes (centralization, procedure collapse, bureaucratic politics, information overload, source priority bias, anchoring, groupthink, information starvation) constitute a failure prevention checklist. Architectural review should explicitly test each of these failure modes against the proposed system design.

- **Expert Decision-Making**: The RPD model, the novice-expert distinction, the quality problem, and the retrospective distortion problem together constitute a comprehensive theory of how expert decision-making actually works, how it differs from how it appears in retrospective accounts, and how it develops over time through the KB-to-RB-to-SB compilation process.