# When to Use Algorithms vs. Expert Judgment: A Routing Framework for Agent Systems

## The Meehl Paradigm and Its Uncomfortable Finding

Paul Meehl's 1954 monograph launched what became the Heuristics and Biases research tradition by reviewing approximately 20 studies comparing clinical (human) versus actuarial (algorithmic) judgment. The finding was stark: "Although the algorithms were based on a subset of the information available to the clinicians, statistical predictions were more accurate than human predictions in almost every case." (p. 517)

Grove et al.'s 2000 meta-analysis of 136 studies confirmed and extended this finding: algorithms outperformed clinical judgment in approximately half the studies; the two approaches were equivalent in most of the remainder; and human clinical judgment outperformed algorithms in only a handful of cases. Tasks where algorithms showed large advantages included college academic performance, diagnosis of gastrointestinal disorders, length of psychiatric hospitalization, job turnover, suicide attempts, and juvenile delinquency prediction. (p. 523)

This is a dramatic finding about human judgment. It would be easy to read it as a general argument for replacing human (and therefore agent-simulated-expert) judgment with algorithms. Kahneman and Klein argue explicitly against this conclusion — and their argument is the key to understanding when each approach is appropriate.

## The Correct Interpretation of Meehl's Findings

"Findings in which the performance of human judges is inferior to that of simple algorithms are often cited as evidence of cognitive ineptitude, but this conclusion is unwarranted. The correct conclusion is that people perform significantly more poorly than algorithms in low-validity environments." (p. 523)

The environments studied in the Meehl paradigm share a structural characteristic: they are noisy and/or highly complex, with weak signal-to-noise ratios in the available cues. Algorithms beat human judges in these environments for two specific reasons:

**Reason 1: Algorithms can detect weakly valid cues that humans miss.** In low-signal environments, the valid cues that exist are subtle. Statistical analysis can identify cues with validity that falls below the threshold of human detection. Human pattern recognition is calibrated to stronger signals.

**Reason 2: Algorithms apply weak cues consistently.** Even when humans can identify weakly valid cues, they apply them inconsistently. "The meta-analysis performed by Karelaia and Hogarth (2008) showed that consistency accounted for much of the advantage of algorithms over humans." (p. 523) The famous "bootstrapping effect" demonstrates this: a statistical model of a judge's *own* decision-making typically outperforms the judge themselves, purely because the model applies the judge's implicit cue weights more consistently than the judge does across cases.

Note what this does *not* say: it does not say that human judgment is always inferior. It says human judgment is inferior in low-validity noisy environments — precisely the environments where intuitive pattern recognition cannot develop genuine skill.

## The Two Conditions Where Algorithms Dominate

Kahneman and Klein identify two distinct environmental conditions under which algorithms outperform human judgment:

**Condition A: Very low validity.** "When validity is so low that human difficulties in detecting weak regularities and in maintaining consistency of judgment are critical." (p. 524) In these environments, the regularities that exist are too weak and too noisy for humans to learn reliably. Algorithms can sometimes extract marginally above-chance predictability from these environments through consistent application of slight statistical signals. The forecast won't be accurate, but it will be better than human intuition.

**Condition B: Very high validity, near-ceiling performance.** "When validity is very high, in highly predictable environments, where ceiling effects are encountered and occasional lapses of attention can cause humans to fail. Automatic transportation systems in airports are an example in that class." (p. 524) When the environment is so regular that perfect or near-perfect performance is achievable, human inconsistency and attention lapses become the binding constraint. Algorithms win not because they're smarter but because they don't get distracted.

## The Conditions Where Expert Human Judgment Dominates

The paper's framework implies (though it articulates it more by what's left over): expert judgment is most valuable in *medium-validity* environments with *rich tacit cues* that are difficult to formalize.

"The studies in the Meehl paradigm have not produced 'smoking gun' demonstrations in which clinicians miss highly valid cues that the algorithm detects and uses. Indeed, such an outcome would be unlikely, because human learning is normally quite efﬁcient. Where simple and valid cues exist, humans will find them if they are given sufficient experience and enough rapid feedback to do so." (p. 523)

Human pattern recognition is excellent at finding and using strongly valid cues. The algorithm advantage only appears when valid cues are weak (too weak for humans to detect reliably) or when the valid cues require context and nuance that resist formalization.

Expert judgment is also essential when:
- The situation is genuinely novel, outside the distribution that any training dataset captures
- The context involves dynamic, shifting patterns where static algorithms become quickly outdated
- The judgment requires integration of tacit knowledge that hasn't been or cannot be codified

## The Loan Officer vs. Fireground Commander Contrast

The paper's most vivid institutional example: "The evaluation and approval of personal loans by loan officers is an example of a situation in which algorithms should be used to replace human judgment. Identifying the relatively small number of defaulting loans is a low-validity task because of the low base rate of the critical outcome. Algorithms have largely replaced human judges in this task, using as inputs objective demographic and personal data rather than subjective impression of reliability. The result is an unequivocal improvement: We have fairer loan judgments (i.e., judgments that are not improperly influenced by gender or race), faster decisions, and reduced expenses." (p. 523)

Compare this to the fireground commander, who operates in a medium-high validity environment with rich tacit cues (building architecture, smoke behavior, team state) that resist algorithmic formalization. The expert intuition of the experienced commander is irreplaceable not because algorithms couldn't in principle be built, but because the cues are contextual, dynamic, and require integration with real-time situational awareness that exceeds current formalization capacity.

The routing principle emerges: **use algorithms in low-validity environments and near-ceiling environments; use calibrated expert judgment (human or agent-simulated) in medium-validity environments with rich tacit cues.**

## The Consistency Advantage and Its Implications for Agents

The bootstrapping effect — where a model of a judge outperforms the judge — is worth dwelling on as an agent design principle. The implication is that **consistency is itself a form of accuracy**. An agent that applies its judgment criteria consistently across cases will outperform a human expert who applies the same criteria inconsistently, even if the agent's model of the criteria is imperfect.

For agent systems: consistency should be treated as a performance objective, not just an implementation detail. An agent that reaches different conclusions on identical inputs across invocations is replicating human inconsistency — and thereby giving up one of the core advantages that algorithmic/agent systems have over human judgment.

This is an argument for:
- Deterministic or low-temperature outputs for systematic judgment tasks
- Explicit rubrics and criteria encoded in the agent's prompting rather than left to implicit pattern matching
- Consistency checks across similar cases as a quality control mechanism

## The Conditions for Algorithm Adoption (And Why They're Stringent)

The NDM tradition's objections to algorithmic replacement of human judgment are legitimate and should be taken seriously. Kahneman and Klein enumerate the necessary conditions for algorithm adoption:

"These conditions include (a) confidence in the adequacy of the list of variables that will be used, (b) a reliable and measurable criterion, (c) a body of similar cases, (d) a cost/benefit ratio that warrants the investment in the algorithmic approach, and (e) a low likelihood that changing conditions will render the algorithm obsolete." (p. 524)

Each condition is a genuine constraint. An algorithm built on an incomplete variable set will systematically ignore information that matters. A task without a reliable, measurable criterion cannot be optimized. An insufficient case base produces algorithms that overfit. Environmental drift renders algorithms obsolete — sometimes dangerously so, since the algorithm continues to produce confident outputs even after the cue-outcome relationships it was trained on have changed.

## The Automation Bias Warning

Perhaps the most important operational warning in the paper: "Maintaining adequate supervision of algorithms can be difficult, because there is evidence that human operators become more passive and less vigilant when algorithms are in charge — a phenomenon that has been labeled 'automation bias.'" (p. 524, citing Skitka et al.)

Automation bias is not irrational laziness. It is a rational response to the experience that algorithms are usually right — combined with the perceptual problem that algorithm failures are often invisible until they're catastrophic. The USS Vincennes was "one of the most technologically advanced systems in the Navy inventory, but the technology was not sufficient to stave off the disaster." Advanced automation creates advanced automation bias.

For agent systems: the introduction of a highly capable agent skill for a given task will reduce the scrutiny that other agents (and human supervisors) apply to its outputs. This is the behavior that should be engineered against:

- High-capability agents should produce confidence-calibrated outputs that explicitly flag when they're operating near their validity boundaries
- Orchestration systems should maintain mandatory review checkpoints for high-stakes decisions that cannot be bypassed even when the primary agent's confidence is high
- Agent performance should be monitored for drift — changes in the cue-outcome relationships the agent was trained on will produce automation-bias failures where the system continues to act on outdated patterns with high confidence

## A Routing Decision Tree for WinDAGs

When deciding how to route a judgment task in a multi-agent system:

**Step 1: Assess environmental validity**
- Is this domain characterized by stable cue-outcome relationships?
- Are there valid predictive cues that can in principle be identified?
- *If no: route to statistical/algorithmic approach; flag to user that confident judgment is not achievable*

**Step 2: Assess available algorithms**
- Does a well-validated algorithm exist for this specific task?
- Is the algorithm trained on sufficient similar cases?
- Is the criterion measurable and reliable?
- Is the environment likely stable enough that the algorithm isn't obsolete?
- *If yes to all: prefer algorithm; apply with mandatory human-or-agent supervision*

**Step 3: Assess expert pattern knowledge**
- Does the environment contain rich tacit cues that exceed current formalization capacity?
- Is the task medium-validity (too complex for algorithmic formalization, but regular enough for expert learning)?
- Has the relevant agent skill been validated specifically for this sub-task (not just the adjacent domain)?
- *If yes: invoke expert agent skill; apply simulation/validation pass; check for fractionation boundary*

**Step 4: Apply consistency enhancement**
- For either algorithmic or expert-agent path: ensure consistent application of criteria
- For medium-validity tasks: use structured prompting with explicit criteria rather than open-ended judgment
- Flag high-stakes outputs for secondary review regardless of confidence level

**Step 5: Monitor for automation bias**
- Track whether downstream agents are appropriately scrutinizing outputs from high-performing upstream agents
- Inject periodic adversarial reviews to counteract vigilance decay
- Maintain explicit uncertainty in confidence propagation through the pipeline