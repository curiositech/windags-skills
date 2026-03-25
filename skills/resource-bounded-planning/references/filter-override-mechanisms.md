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