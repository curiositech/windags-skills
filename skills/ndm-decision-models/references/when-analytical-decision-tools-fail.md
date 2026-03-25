# When Analytical Decision Frameworks Fail: Boundary Conditions for Classical Methods

## The Problem With Prescriptive Models in Operational Environments

Klein and Calderwood identify a class of failure that is subtle and pernicious: the application of powerful analytical tools to domains where the foundational assumptions those tools require simply cannot be met. The result is not just that the tools fail to help — they actively interfere with the competence of the people (or agents) using them.

Classical decision theory — decision analysis, multiattribute utility analysis (MAUA), Bayesian statistics — has genuine strengths: it is domain-general, it ensures shared language and metrics among participants, and it produces optimal selections *when its assumptions are met*. The problem is that these assumptions are rarely met in operational environments, and the tools are frequently applied anyway.

This is not an abstract academic concern. As the authors note: "As people have tried to implement these programs and decision aids, it has become clear that analytic approaches are not very useful in the field. Application of inappropriate decision models can result in a variety of unfortunate outcomes, including training programs that are of limited benefit."

More dangerously: "by trying to force experienced decision makers to adjust to the needs of the prescriptive models we run the risk of degrading their ability to make use of their own experience. We can interfere with their proficiency."

## The Five Assumptions That Rarely Hold

Klein and Calderwood enumerate the assumptions underlying classical decision models and examine each in operational context:

### Assumption 1: Goals Can Be Isolated

Classical decision theory requires goals to be stated clearly as an anchor for analysis. In practice, goals in operational environments are embedded in networks of parallel and higher-order goals that cannot be cleanly separated.

The authors give a military example: the goal of "slowing an enemy advance by denying key roads" is entangled with "using the same resources in other ways," "planning for a counterattack over those same roads in a few days," and broader strategic positioning goals. "Obviously, it is risky to segment goals out of the larger context."

**For agent systems**: Any agent that accepts a single, stated objective as its complete goal specification is operating under this assumption. In complex domains, goal specifications are necessarily incomplete. The agent's actual performance will be evaluated against an implicit goal network that was never fully articulated. Agents should actively probe for unstated goals, constraint hierarchies, and goal interactions before committing to an optimization target.

### Assumption 2: Utilities Can Be Assessed Independent of Context

MAUA requires evaluation of options using a general set of dimensions applicable to all options. In practice, the value of an action is deeply context-dependent in ways that abstract evaluation dimensions cannot capture.

The chess example from the paper is telling: "we do not see chess masters rating different moves using a standard set of dimensions (e.g., center control, potential for kingside attacks). Instead, the moves are evaluated in context, in terms of the specific advantages and disadvantages of the outcomes arising from each option."

Expertise enables sensitivity to contextual implications that generic dimensions obscure. A MAUA analysis of chess moves would miss the things that matter most.

**For agent systems**: Scoring functions, reward models, and utility estimators that are trained or specified in abstraction from context will systematically miss the things that matter most in specific situations. The alternative is evaluation within context — the mental simulation approach of RPD — where options are assessed not against abstract dimensions but against the specific features and constraints of the current situation.

### Assumption 3: Probabilities Can Be Accurately Estimated

Decision analyses require probability estimates for different branches of an option tree. These estimates are difficult under ideal conditions and nearly impossible under time pressure, incomplete information, and psychological stress. Furthermore: "probabilities are more suited for decision tasks involving repeated occurrences of randomly generated events, rather than unique 'one shot' events."

Most operational decisions are unique. The probability of a particular battle condition, a specific fire configuration, a novel system failure mode — these are not frequentist probabilities. They cannot be reliably calibrated. Yet decision analysis requires them as inputs.

**For agent systems**: Agents that represent uncertainty as calibrated probabilities and propagate those probabilities through decision trees are implicitly assuming the frequentist framing. For unique or rare events, this assumption fails. Agents in operational domains should represent uncertainty in ways that support action under ambiguity — recognition of situation type, confidence in classification, attention to expectancy violations — rather than requiring precise probability estimates that cannot be provided.

### Assumption 4: Choices, Goals, and Evidence Are Clearly Defined

Decision analysis works best with bounded decisions. In operational environments, end states are rarely well-defined. The authors give the fireground example: "a fireground commander rushing to a fire would seem to have a simple, well-defined goal — put the fire out. But if the fire has spread too far, it may make more sense to just prevent it from spreading."

The actual goal — "do the best job possible with the appropriate amount of resources" — is "hardly a well-defined goal." In messy operational environments, definitional completeness is a fiction.

**For agent systems**: Agents that require fully specified problem definitions before they can begin processing will fail at the front door of most real-world tasks. Agents must be capable of operating under goal ambiguity, refining their understanding of the task as they proceed, and making decisions that are appropriate for a range of possible goal interpretations rather than optimized for a single clean specification.

### Assumption 5: Utilities of Outcomes Are Independent of Each Other

Decision analysis requires independent utility estimates for each outcome. In complex operational environments, outcomes are interrelated — "decision makers can't be trusted to provide useful outputs" when the assumption of independence is violated.

**For agent systems**: In any domain where outcomes interact (scheduling, resource allocation, multi-step planning), the independence assumption fails. Utility estimates made in isolation are unreliable. The appropriate response is not better independence estimation but recognition that serial, context-sensitive evaluation (the RPD approach) handles interdependencies naturally by simulating full trajectories rather than summing independent utilities.

## The Dangerous Middle Ground: Apparent Analysis

One of the most important findings from field research — cited from Soelberg's study of business school graduates making career choices — is that people sometimes engage in apparent analysis while actually operating on prior intuitive decisions. Soelberg found that "the apparent reliance on analytic option evaluation was largely a fiction used to buttress their intuitive choice made much earlier than the business students were prepared to admit."

This creates a failure mode more dangerous than either pure analysis or pure intuition: **post-hoc rationalization dressed as decision analysis.** The agent (or person) has already decided, then constructs analytical justification for the predetermined conclusion. The analysis provides false confidence while consuming time and obscuring the actual decision process from inspection.

**For agent systems**: Chain-of-thought reasoning and explicit deliberation can serve as post-hoc rationalization just as readily as genuine reasoning. The question is whether the reasoning process *actually drives* the output or whether it *explains* a conclusion reached by other means. Systems should be designed to expose this distinction — to track whether the reasoning trace is causally upstream of the decision or merely descriptively downstream of it.

## When Analytical Tools *Do* Work

Klein and Calderwood are careful not to dismiss analytical methods entirely. "In the hands of an expert, decision analysis can be helpful in identifying factors entering into the decision, and in enabling decision makers to understand the differences in their goals and values. But expert decision analysts have also learned the boundary conditions and are careful not to push the methods beyond those boundaries."

Hammond et al.'s research on highway engineers provides the key insight: analytical strategies work best when the information structure of the problem favors analysis (decomposable, quantifiable, combinable) and when time allows deliberation. Intuitive strategies work best when context-dependence is high and time is limited.

The practical guidance: **match the decision strategy to the problem structure and the time available.**

Analytical frameworks are appropriate when:
- Goals can be cleanly isolated without distorting the problem
- The decision is genuinely repeated (frequentist probability applies)
- Time allows full deliberation
- Stakes are high enough to warrant the overhead
- The decision is novel enough that experience-based recognition is unreliable

Recognitional frameworks are appropriate when:
- Time pressure is significant
- The situation matches known prototypes reasonably well
- Goals are entangled and context-dependent
- The decision-maker has substantial relevant experience
- Consequences are reversible enough that a satisficing approach is acceptable

## Implications for Agent System Architecture

1. **Audit your decision framework's assumptions before applying it.** Before using a scoring function, probability estimate, or utility analysis, verify that the problem structure actually supports these operations. If the assumptions don't hold, don't use the tool — find a situationally appropriate alternative.

2. **Don't make analytical frameworks mandatory.** Agent systems should have multiple decision modalities available and should select the modality based on situational features (time available, problem novelty, goal clarity, stakes) rather than always defaulting to the most analytically rigorous available method.

3. **Protect expert pattern recognition from analytical interference.** When an agent has relevant experience encoded in case libraries or trained patterns, analytical frameworks should be used to augment and verify that pattern-based judgment, not to replace it. Replacing pattern recognition with formal analysis in time-pressured, ambiguous domains will degrade performance.

4. **Build explicit boundary condition checking.** Any analytical decision module should include an upstream check on whether the problem meets the necessary assumptions. A module that computes expected utility should refuse to operate, or flag its output as unreliable, when the independence, probability, and goal-isolation assumptions are not met.