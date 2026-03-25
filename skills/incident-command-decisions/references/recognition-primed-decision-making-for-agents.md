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