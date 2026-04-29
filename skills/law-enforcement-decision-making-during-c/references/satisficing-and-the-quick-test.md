# Satisficing and the Quick Test: How Intelligent Systems Should Decide When to Think and When to Act

## The Foundational Problem

Every intelligent system operating under real-world conditions faces a paradox: the situations that most demand careful deliberation are precisely the situations that most severely constrain the time available for deliberation. Time pressure, high stakes, incomplete information, and dynamic conditions are not independent variables — they co-occur in the most consequential decisions.

Traditional decision theory resolves this by abstracting away time constraints and assuming the decision-maker can evaluate all alternatives against all criteria. This produces optimal decisions in theory and useless advice in practice.

Zimmerman's research, drawing on the NDM tradition, offers a better framework: **satisficing combined with explicit stop-search rules.** Together, these concepts tell an intelligent system both what to look for (the first acceptable option, not the best option) and when to stop looking (as soon as an option clears a threshold, unless specific conditions justify further analysis).

## Satisficing: The Logic of "Good Enough"

Herbert Simon's concept of satisficing describes decision-making that "lead[s] quickly to satisfying outcomes [that] allow for resolutions that may not be optimal, but are nonetheless acceptable" (Simon, 1990, cited in Zimmerman, p. 13). In time-limited, dynamic environments, "the optimal solution may not be attainable given the task constraints, and if the situation is dynamic, the optimal solution may change as events unfold, leaving the decision maker to redefine goals and reconsider the acceptableness of the outcome possibilities" (Gigerenzer & Todd, 1999; Simon, 1990, cited in Zimmerman, p. 13).

The logic of satisficing is not sloppiness — it is rational adaptation to real constraints. Goodrich, Stirling, and Boer (2000) state that "finding a 'good enough' solution entails weighing the costs and benefits of each option under consideration. When reaching a solution that satisfices, particularly in time-pressured situations that have unclear parameters and are dynamic, the costs of continuing to search may outweigh the costs of stopping" (cited in Zimmerman, p. 13).

Simon's scissors metaphor captures the essential structure: satisficing requires both "the structure of the task environment" and "the computational capabilities of the decision maker." Optimal satisficing — the fastest path to an acceptable solution — requires the decision-maker to read the environment accurately (what does "acceptable" mean here?) and apply the appropriate level of cognitive effort.

**For agent systems:** Satisficing has two design implications. First, agents need explicit *acceptability thresholds* for each class of task — not "find the best solution" but "find a solution that meets criterion X at cost Y." Second, agents need *dynamic threshold adjustment* — what counts as acceptable changes as the situation evolves, resources deplete, or time pressure increases.

## The Error Continuum: Reframing "Success"

Traditional evaluation frameworks ask: did the decision-maker choose the optimal option? The NDM framework replaces this binary with a continuum: "decision makers evaluate errors on a continuum from optimal to worst-case (often fatal) outcomes" (Zimmerman, p. 31).

The distinction matters enormously for how we evaluate and design intelligent systems. Weiss and Shanteau (2004) "make the differentiation between experts' evaluations of errors and researchers' evaluations of errors. They state that while experts try to avoid big mistakes, researchers tend to search for the 'correct answer.' Experts show little concern for minor deviations from the optimal outcome, but researchers find deviations from optimality a major source of concern" (cited in Zimmerman, p. 32).

The practical implication: an agent that reliably avoids worst-case outcomes while frequently missing the optimum is performing well by expert standards. An agent that occasionally achieves the optimum but also occasionally produces catastrophic outcomes is performing poorly by expert standards, even if its average outcome is higher.

**For agent systems:** Evaluate agents on the distribution of outcomes, not the mean. An agent with a lower mean outcome but a shorter left tail (fewer catastrophic failures) is often preferable for high-stakes applications to an agent with a higher mean but fat left tail. The error continuum framework demands robust evaluation, not just average-case evaluation.

## The Quick Test: A Three-Question Decision Gate

Cohen, Freeman, and Wolf (1996) developed the "quick test" as a practical mechanism for deciding whether a decision-maker should act immediately or invest time in "critiquing and correcting" — evaluating and refining the current plan before execution.

The quick test consists of three questions:
1. **Is the cost of delay acceptable?**
2. **Is the cost of an error high?**
3. **Is the situation unfamiliar or problematic?**

The routing logic: "If the answer to any one of these questions is 'no' then the decision maker engages in immediate action. If the answer to all of these is 'yes' then the decision maker engages in critical thinking" (Cohen et al., 1996; Cohen et al., 1998, cited in Zimmerman, pp. 14-15).

The elegance of this framework is that it converts a meta-decision ("should I think more?") into a three-question structured test that can be answered quickly. It is itself a satisficing strategy for the meta-decision about whether to engage in deeper analysis.

### Unpacking the Three Questions

**Is the cost of delay acceptable?**
This is not "do I have time?" but "what happens if I take more time?" In some situations, delay is neutral — the problem persists while you think. In others, delay itself causes harm — the opportunity closes, the situation deteriorates, the adversary acts first. If delay is costless, there is no reason to act without full analysis. If delay is costly, even imperfect analysis must eventually yield to action.

**Is the cost of an error high?**
This question calibrates risk tolerance. High error costs mean the wrong action is worse than no action, which favors more deliberation before commitment. Low error costs mean that even a wrong action can be corrected, which favors faster action with course-correction. Note that this interacts with reversibility: an irreversible action with high error cost demands maximum pre-action analysis. A reversible action with low error cost can be taken immediately and corrected if needed.

**Is the situation unfamiliar or problematic?**
This question triggers the expert's anomaly detection. If the situation fits a familiar pattern (Level 1 RPD), additional analysis adds little — the mental model already contains the relevant information. If the situation is genuinely novel or contains anomalous elements, the mental model may not apply, and additional analysis is warranted.

The logical structure is:
- If ANY answer is "no" (delay is costless, OR errors are cheap, OR the situation is familiar) → the cost of further deliberation exceeds its benefit → act on current best judgment
- If ALL three answers are "yes" (delay is costly AND errors are expensive AND the situation is novel) → the cost of acting without further deliberation is high enough to justify additional analysis → think before acting

## Applying the Quick Test to Agent Orchestration

In a multi-agent system, the quick test operates at multiple levels simultaneously.

**At the task level:** Before an agent begins a complex subtask, the quick test should run: Is time-to-completion critical? Can errors be corrected? Is this task type within the agent's trained distribution? The answers should determine how much pre-task planning to do before beginning execution.

**At the action level:** Within a task, as an agent considers each action step, a lightweight version of the quick test should run: Is acting now vs. gathering more information the right call? The quick test prevents both premature action (when more information would genuinely improve the decision) and analysis paralysis (when additional information would not change the decision).

**At the coordination level:** In multi-agent orchestration, the quick test determines when to escalate vs. proceed. An orchestrator receiving a partial result from a subagent should ask: Is waiting for a better result acceptable? Is the cost of using this imperfect result high? Is this situation outside the expected parameter space? These questions determine whether to accept the current result, request revision, or escalate to a more capable agent.

## The Critique-and-Correct Loop

The Cohen et al. Recognition/Metacognition (R/M) model introduces a more detailed version of the quick test logic: after initial situation recognition, the decision-maker engages in a critique-and-correct loop that evaluates the current plan against available evidence, looks for incomplete or conflicting information, and makes corrections before commitment.

This loop is terminated by the quick test: "if the costs [of critiquing and correcting] outweigh the benefits, the decision maker will take action without critical assessment" (Zimmerman, p. 14).

The critique-and-correct loop has a natural analog in agent systems: chain-of-thought reasoning, plan validation, adversarial self-checking ("what would need to be true for this plan to fail?"). These are all implementations of critiquing and correcting. The quick test determines when to run them.

**Critical design principle:** The critique-and-correct loop must have a time budget. An agent that critiques indefinitely is not sophisticated — it is stuck. The quick test provides the exit condition.

## Satisficing vs. Optimization: A Deeper Point

The choice between satisficing and optimizing is not simply a performance tradeoff — it reflects fundamentally different assumptions about the environment.

Optimization assumes: the problem is stable, all options are available simultaneously, and the cost of analysis is negligible compared to the benefit of finding the best option.

Satisficing assumes: the problem is dynamic, options appear sequentially, and analysis itself consumes resources (time, attention, energy) that have opportunity costs.

In most real-world agent deployment contexts, the satisficing assumptions are correct. The agent operates in a dynamic environment, options are generated sequentially (not pre-enumerated), and analysis time has real costs. Under these conditions, "finding an optimal solution... could be too costly compared to the benefits of selecting the option that is good enough" (Zimmerman, p. 13-14).

**The deeper design principle:** Build agents that satisfice efficiently, not agents that optimize exhaustively. The former will outperform the latter in almost every real-world deployment context.

## Boundary Conditions: When Satisficing Fails

Satisficing is not always the right strategy. It fails when:

1. **The acceptability threshold is wrong.** If the agent's threshold for "good enough" is miscalibrated — too high (misses acceptable solutions) or too low (accepts terrible solutions) — satisficing produces consistent errors. Threshold calibration is as important as the satisficing mechanism itself.

2. **The first option generated is systematically biased.** The RPD model generates actions in order of plausibility — the most pattern-matched option first. If pattern matching is biased, the first option will be wrong, and satisficing will accept it too quickly. Anti-bias mechanisms need to operate on the pattern library, not on the search process.

3. **The situation is stable and analysis is cheap.** When time pressure is genuinely low and deliberation is cheap, satisficing sacrifices solution quality unnecessarily. The quick test's first question ("Is the cost of delay acceptable?") guards against this: if delay is free, don't satisfice.

4. **Errors are catastrophic and irreversible.** Satisficing accepts "good enough" — but if the gap between good enough and worst-case is catastrophic, the expected cost of satisficing may be higher than the expected cost of exhaustive optimization. High-stakes, irreversible decisions warrant more deliberation even under time pressure.