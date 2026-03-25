# Indeterminate Causation: How to Reason About Causes That Cannot Be Fully Known

## The Indeterminacy Problem

One of Klein and Hoffman's most important challenges to conventional thinking is their insistence that many real-world causal questions are *indeterminate* — they have no single correct answer, and no amount of additional investigation would reveal "the" cause.

"Why did the American military situation in Iraq improve from 2004 to 2008? Why did Hillary Clinton lose the contest to become the Democratic candidate for president in 2008? Why did a certain sports team beat another in a championship game?"

Klein and Hoffman's response is direct: "There are no single or uniquely correct answers to such questions, and no amount of research would discover 'the real' cause."

This is not a statement about our ignorance — it is a statement about the nature of the questions. These are indeterminate problems, and treating them as determinate problems (the way philosophers and scientists reason) is a category error.

The distinction is fundamental:

**Determinate causal problems**: There is a fact of the matter about the cause, and investigation can uncover it. Watson and Crick figured out the structure of DNA. HIV was discovered as the cause of AIDS. These investigations led to real discoveries.

**Indeterminate causal problems**: There are multiple valid causal accounts, none of which is "the real" cause. The causes are multiple, partial, and interacting. Even a complete account of every event would not uniquely determine a single cause — it would produce a complex story with many legitimate causal interpretations.

Most of the problems that organizations, managers, military leaders, and AI agents face in practice are *indeterminate*. The goal is not to find the true cause but to construct the *most useful* causal account — one that is actionable, honest about its limitations, and open to revision.

---

## Why This Matters for Agent Systems

An agent designed to "find the root cause" of an indeterminate problem is an agent designed to fail in a specific and dangerous way: it will produce a confident single-cause answer to a question that has no single-cause answer. This answer will feel complete (it satisfies the cognitive demand for closure) while being wrong (it omits the interacting partial causes that together produced the outcome).

The harm is not merely academic. Organizations that act on single-cause diagnoses of multi-cause problems will implement targeted fixes that address one contributing factor while leaving the others intact. The same failure (or a closely related variant) will then recur, attributed to a "different" cause that is actually just another partial factor in the same underlying causal structure.

This is a well-documented pattern in safety engineering, known as "whack-a-mole" failure management: you fix the identified cause, the next incident has a different identified cause, you fix that, and so on — without ever addressing the structural conditions that make the system vulnerable to this class of failure.

---

## The Five Characteristics of Indeterminate Causal Problems

Klein and Hoffman's analysis allows us to characterize indeterminate causal problems along five dimensions:

### 1. Multiple valid causal accounts
For any indeterminate event, multiple causal stories can be constructed, each legitimate, each emphasizing different aspects of the situation. A sports championship can be explained by the winning team's execution, the losing team's errors, the referee's decisions, the weather conditions, injuries, historical rivalry dynamics, and dozens of other factors. None of these accounts is wrong; none is complete.

### 2. No discovery procedure converges to "the" cause
In determinate problems, more evidence and better methods converge toward the true cause. In indeterminate problems, more evidence often produces more competing causal hypotheses rather than convergence. The investigation into Clinton's 2008 campaign failure generated dozens of serious causal analyses that disagreed with each other on fundamental points — and no amount of additional analysis produced consensus.

### 3. Causes are partial and conditional
Each cause in an indeterminate explanation contributes partially to the outcome. No single cause is sufficient; no single cause is uniquely necessary (other combinations of causes might have produced the same outcome). This is radically different from the clean necessary-and-sufficient causation of determinate problems.

### 4. The effect itself may be indeterminate
Klein and Hoffman note that "the initial effect may be re-framed and re-cast during the investigation into its causes." In indeterminate problems, even the description of what happened is contested. Was the AIDS epidemic a failure of the medical system? A failure of public health policy? A story of scientific success in identifying a novel pathogen? The answer depends on who is asking and why.

### 5. Action requires premature closure
Managers and decision-makers must act despite indeterminacy. They must stop their causal investigation at a "certain point" (as Klein and Hoffman note) and commit to an explanation sufficient to support a decision. This premature closure is necessary but is always epistemically unjustified — the investigation was stopped because action was required, not because the cause was found.

---

## Strategies for Reasoning Under Causal Indeterminacy

### Strategy 1: Maintain Multiple Concurrent Hypotheses

Rather than seeking a single cause, maintain multiple candidate explanations simultaneously, each with an assigned credibility level. Do not prematurely collapse to a single explanation. Make decisions based on the distribution of explanations, not on the pretend certainty of a single one.

This is analogous to Bayesian reasoning in technical domains: you don't find "the" probability of an event; you maintain a probability distribution over possible events. For indeterminate causal problems, you maintain a distribution over possible causal accounts.

**Implementation for agents**: A causal analysis output should include a structured list of causal hypotheses, each with:
- Explanatory type (event, condition, story, etc.)
- Evidence supporting it
- Evidence against it
- Actions it would support
- Actions it would contraindicate
- Confidence level

### Strategy 2: Act on the Overlap

When multiple causal hypotheses agree on a specific factor, that factor deserves priority attention even if its causal role is uncertain. If five different causal accounts all include "inadequate testing protocols" as a contributing factor, then improving testing protocols is a high-value intervention regardless of which causal account is most correct.

**Implementation for agents**: Agents should identify the *intersection* of their multiple causal hypotheses — the causes that appear across all or most accounts. Interventions targeting the intersection are robust across hypotheses.

### Strategy 3: Design Reversible Interventions

When you must act under causal indeterminacy, prefer interventions that are reversible (can be undone if the causal hypothesis turns out to be wrong) over interventions that are irreversible (commit the system to a path that may be wrong).

This follows directly from the reversibility criterion: if you treat an intervention as an experiment (will removing this cause reduce the effect?), you want to be able to run the experiment in both directions.

**Implementation for agents**: Agents recommending interventions should flag the reversibility of each proposed intervention and recommend reversible interventions as first steps in genuinely indeterminate situations.

### Strategy 4: Distinguish Closure Type from Truth Claim

When action requires premature closure, explicitly distinguish between:
- **Pragmatic closure**: "For the purpose of making this decision, we are treating X as the cause" (explicitly acknowledging that this is a decision-enabling simplification)
- **Epistemic claim**: "X is the cause of this event" (a truth claim about reality)

These are different statements. Most organizational communication collapses them. Agents should preserve the distinction.

### Strategy 5: Invest in Causal Model Building Before Problems Occur

In domains where indeterminate problems are common, the best preparation is building richer causal models of the domain *before* problems occur. A military analyst who has studied past campaigns has richer explanatory frames available when a new campaign must be analyzed. A financial analyst who has studied past crises can recognize causal patterns in new crises more quickly.

**Implementation for agents**: Domain-specific causal libraries — structured collections of causal patterns, interaction types, and explanatory frames — should be built and maintained as a core knowledge resource. When an agent faces a novel situation, it should query the causal library for analogous patterns before beginning fresh causal analysis.

---

## The Specific Failure of the "Correlation Does Not Imply Causation" Rule

Klein and Hoffman address one of the most commonly invoked cautions in causal reasoning and find it misleading. The statement "correlation does not imply causation" is technically true in the strong sense ("correlation does not prove causation") but practically harmful if interpreted as "correlation tells us nothing about causation."

"Correlation as a suite of mathematical techniques was invented precisely to enable the exploration of causal relations or potential ones. Correlation is a major cue to causality. Even in scientific investigations, correlation is required in order for causation to be proved."

The correct interpretation: correlation is *necessary but not sufficient* evidence of causation. It should initiate investigation, not be dismissed. "It often initiates a fruitful causal investigation."

This is particularly important for agent systems that work with statistical patterns. An agent that dismisses a strong statistical covariation as "not evidence of causation" is throwing away potentially the most important signal it has about the causal structure of the domain. The appropriate response to strong covariation is: "This is a credible causal candidate. What is the mechanism? Are there confounds? Does it pass the reversibility test?"

---

## Knowing When to Stop: The Closure Problem

Klein and Hoffman raise but do not fully solve the problem of when to stop causal investigation. "Managers have to stop at a certain point and make decisions." But when is that point?

The investigators plan for Phase 2 of their research is revealing: "We seek to understand how decision makers achieve closure in their causal explanations of events in which they themselves have causal powers, and prevent themselves from a never ending spiral into further depth. We suspect that decision makers learn by action as much as by analysis — they take some actions in order to see how the situation changes."

This points to an important insight: in indeterminate domains, *action is itself a form of causal investigation*. You take an intervention, observe the effect, and use the observation to update your causal model. This is not the same as acting carelessly — it is treating action as a hypothesis test.

**For agent systems**: In indeterminate domains, agents should be designed to recommend *probe interventions* — small, reversible actions taken specifically to generate information about the causal structure of the situation. The results of probe interventions should then feed back into the causal analysis, updating the distribution of causal hypotheses. This is an active, adaptive approach to causal investigation that respects the indeterminate nature of the problem while still making progress toward actionable understanding.

---

## Summary Principles for Indeterminate Causal Reasoning

1. Explicitly identify whether a problem is determinate (single true cause discoverable) or indeterminate (multiple valid accounts, no convergence to single cause)
2. For indeterminate problems, maintain multiple concurrent causal hypotheses rather than forcing premature convergence
3. Identify the intersection of competing hypotheses — this is where high-value, hypothesis-robust interventions lie
4. Prefer reversible interventions when causal uncertainty is high
5. Distinguish pragmatic closure (for decision purposes) from epistemic claims (about reality)
6. Treat covariation as a credible and important causal signal, not something to be dismissed
7. Build domain-specific causal model libraries as a pre-crisis resource
8. Use action as a form of causal investigation in ongoing dynamic situations
9. Update causal models continuously as new evidence (including the results of interventions) arrives