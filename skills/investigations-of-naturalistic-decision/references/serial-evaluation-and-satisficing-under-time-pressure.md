# Serial Evaluation and Satisficing: Why the First Good Answer Beats the Best Answer

## The Optimization Trap

The dominant framework for rational choice — from economics, from decision theory, from most AI planning systems — is optimization: generate all candidate options, evaluate each against the relevant criteria, select the one with the highest score. This framework has deep mathematical roots and is often treated as synonymous with rationality itself.

Gary Klein and Roberta Calderwood's research demonstrates that this framework is not what expert decision-makers use, and that there are good reasons — not just practical shortcuts — for this divergence. The alternative strategy, which they call serial evaluation, is not a degraded form of optimization. It is a different and in many respects superior strategy for time-pressured, dynamic, high-stakes decisions.

## What Serial Evaluation Looks Like in Practice

Klein and Calderwood provide a detailed example from their interview data — a rescue squad commander dealing with a woman trapped on a highway sign strut, lying face-down and semi-conscious, while two squad members hold her in place:

> "He first considered using a Kingsley harness which is the standard rescue equipment, but in imagining its use he could see that it would not work. Since it is attached from the front, he couldn't see how to push the woman to a sitting position without risk to all three people. He imagined attaching the Kingsley harness from the back, but saw it would put excessive strain on the woman's back and so rejected that option. Next, he thought of using a Howd strap... but saw that it ran into the same problems so he rejected it. The next option he considered was using a ladder belt... He imagined lifting her up a few inches, slipping the ladder belt under her waist, buckling it closed... This is the option that he selected, and the rescue was made." (p. 12-13)

Several features of this example are worth unpacking:

**No comparison between options occurred.** The commander never asked "which of these four options is best?" He asked, of each option in turn: "will this work?" The moment he found one that would work, he stopped evaluating and started acting.

**The whole decision took less than a minute.** This is not the decision process of someone doing systematic analysis. It is rapid, sequential, simulation-based evaluation.

**Options were considered in order of typicality.** The Kingsley harness is standard rescue equipment — it was considered first. The commander moved down the typicality-ordered queue until he found a workable option.

**Evaluation was done by mental simulation, not by abstract criteria.** The commander didn't ask "does this option score well on the criteria of security, speed, and safety?" He imagined using each piece of equipment on this specific woman in this specific position and checked whether it would work.

## Why Serial Evaluation Beats Optimization in Operational Conditions

The research identifies several concrete advantages of serial over concurrent evaluation:

### 1. Constant Response Readiness

"A serial evaluation strategy as posited by the RPD model continuously makes available to a decision maker a preferred course of action. If time pressure forces a response, decision makers are prepared. In contrast, a concurrent evaluation model would leave a decision maker unprepared for action during the time course of the analysis. Only when all the analyses were completed would it become clear which course of action to select." (p. 14)

This is a decisive advantage in dynamic environments. An agent using optimization is in a state of suspended action during the entire evaluation process. An agent using serial evaluation is, after evaluating the first option, always holding a "current best answer" that can be executed immediately if needed.

### 2. Typicality-Ordered Queues Bias Toward Quality

Serial evaluation is only as good as the ordering of the option queue. If options are generated randomly and evaluated in random order, satisficing produces poor results on average — you might happen to evaluate the worst option first.

But in the RPD model, options are not generated randomly. They are generated in order of typicality — most common/standard first. Typicality reflects accumulated domain experience: the most typical response is the one that has most often been found to work in situations like this. Therefore the first option evaluated is, on average, the most likely to work.

This means that expert serial evaluation tends to find workable options quickly, with the first or second candidate. The expected search depth is low precisely because expertise biases the search order.

### 3. Reduced Computational Burden with Maintained Quality

Comparing N options across M criteria is expensive. Evaluating options sequentially until one passes a "workable" threshold is, in the best case, O(1) work (if the first option passes). Even in the worst case (all options except the last are rejected), the work done is N sequential evaluations — still not cross-product comparison.

More importantly: the work of concurrent evaluation grows with N (the number of options considered), creating pressure to artificially limit the option set. Serial evaluation does not have this property — considering additional options costs only the evaluation of those additional options, not the re-evaluation of all previous options in comparison.

### 4. Satisficing Does Not Mean Settling for Low Quality

Simon's (1955) original formulation of satisficing has sometimes been understood as "accepting a mediocre option to avoid the effort of finding the best one." Klein and Calderwood show that expert satisficing is not this. When expert decision-makers satisfice over a typicality-ordered queue:

- The first option considered is already likely to be good (because it is the most typical response to this situation type)
- The evaluation criterion is "will this work here, in this specific situation?" — not some abstract threshold
- Options are frequently improved during evaluation rather than simply accepted or rejected; weaknesses found in mental simulation often lead to modifications that strengthen the option

Expert satisficing is more accurately described as: *find the first workable option, which will usually be a good option, and improve it until it is definitely workable.*

## The Time Pressure Interaction

Study 5 of the research program — the chess experiment — directly tested the hypothesis that expertise insulates decision quality from time pressure. The prediction: skilled players rely more on recognition (fast, not time-dependent) while weaker players rely more on calculation (slow, time-dependent). Therefore, time pressure should hurt weaker players more than skilled ones.

The results supported this exactly: "the decrement in move quality for blitz games compared to regulation games was greater for the class B players than for the masters." (p. 41-42) Masters maintained higher quality moves even in blitz (6-minute total game) conditions, and generated more moves and more complex moves than class B players under pressure.

This is a crucial finding for agent system design. It predicts that:

- **Expert-mode agents** (those with rich pattern libraries and typicality-ordered action queues) will degrade gracefully under time pressure: they lose some quality but remain functional
- **Novice-mode agents** (those relying on systematic evaluation) will degrade sharply under time pressure: their quality depends on having time to complete the analysis

Systems that must operate under variable time budgets should be designed to have a "recognition path" that produces reasonable answers quickly, with a "deliberation path" available for additional quality when time permits. The recognition path should be the default, not the fallback.

## Implications for Agent System Orchestration

In a multi-agent system, the serial evaluation insight suggests specific orchestration patterns:

**Maintain a working answer at all times.** An orchestrating agent should never be in a state where it has no current actionable plan. As soon as one option has been evaluated and found workable, that becomes the current plan — even if evaluation of additional options is ongoing. If the orchestration is interrupted (by a deadline, a context switch, or a new urgent input), there is always something ready to execute.

**Order the evaluation queue by expected quality.** When an orchestrator assigns evaluation tasks to subagents, it should assign the most-likely-to-succeed options first. The subagent evaluating the first option should be able to report back quickly with either "workable" (stop evaluating) or "not workable" (move to next). This is much more efficient than assigning all evaluations in parallel and waiting for all to complete.

**Use simulation-based evaluation, not criteria-based scoring.** When evaluating an option, ask "what happens when this is executed?" — run the option through a forward simulation of consequences — rather than asking "how does this score on criteria X, Y, Z?" Simulation catches implementation problems that abstract scoring misses; it also reveals opportunities that scoring would not identify.

**Reserve parallel evaluation for genuinely important decisions with available time.** The research found that concurrent evaluation does occur — but in specific conditions: novel situations, interpersonal/organizational decisions, and when time permits. These are exactly the conditions under which the extra cost of parallel evaluation is justified. For routine decisions under time pressure, serial evaluation should be the default.

**Build in option improvement, not just acceptance/rejection.** Serial evaluation in the RPD model is not purely binary. When mental simulation reveals a problem with an option, the decision-maker often modifies the option to fix the problem rather than discarding it. Agent evaluation systems should similarly produce not just pass/fail verdicts but improvement suggestions — identified weaknesses and possible repairs — as outputs of evaluation.

## The Anti-Pattern: Forced Optimization in Expert Systems

The research provides an important warning: forcing expert decision-makers to use analytical/concurrent evaluation methods "will be unable to make effective use of their own expertise. The Decision Analysis and MAUA approaches may not leave much room for the recognitional skills of experienced personnel. Therefore the risk of using these approaches is that decision performance will become worse, not better." (p. 20)

The analogue for agent systems: do not design orchestration systems that force experienced, well-trained agents to enumerate and compare options before acting. If an agent has high-quality pattern matching and a rich typicality-ordered action queue, requiring it to generate 5 options and compare them on 3 dimensions before acting will slow it down and prevent it from using its actual capabilities.

The correct design is: allow experienced agents to act on recognition, with deliberation as an optional deeper path for genuinely novel or ambiguous situations. The trigger for deliberation should be "this situation does not match well to any known prototype" — not "this situation is important, therefore we should be more analytical."