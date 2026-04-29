# Expertise as Pattern Recognition, Not Superior Analysis

## The Fundamental Misconception About Expertise

The classical model of expertise is essentially quantitative: experts have more analytical capability, better probability estimation, larger mental capacity for considering alternatives. They do what novices do, but better, faster, and with more options in play.

Klein and Calderwood's field research establishes a different view: **expert decision-making is qualitatively different from novice decision-making, not just quantitatively better**. The difference is not that experts run the same analytical processes faster — it is that experts use a fundamentally different cognitive architecture, one built on pattern recognition rather than analysis.

This has profound implications for how we build systems intended to embody or support expertise.

## What Expertise Actually Looks Like in the Field

"The proficient FGC's we studied could use their experience to generate a workable option as the first one they considered."

Note what this does not say: it does not say they could generate a better set of options, or evaluate options more accurately, or estimate probabilities more precisely. It says they could generate a **workable option first** — meaning their first response was already likely to be adequate, without requiring exploration of the option space.

This is the payoff of expertise: not better analysis but the ability to **bypass analysis** because pattern recognition provides immediate access to contextually appropriate responses. The expert's first instinct is reliable in a way that a novice's first instinct is not. The expert can act immediately and with confidence because experience has calibrated their recognition machinery.

This is why the expert fireground commander didn't need to think through options systematically. Their recognition system had already done the work of connecting "situations like this" to "actions like that" through thousands of hours of experience. The analytical work was done in advance, implicitly, through the accumulation of cases. The result is available instantly as recognition.

## Rasmussen's Three-Level Skill Taxonomy

Jens Rasmussen's categorization of skills — sensorimotor (skill-based), rule-based, and knowledge-based — provides a complementary framework that Klein and Calderwood explicitly connect to the RPD model.

"Rule-based skill is essentially what is described in the RPD model. Considering a rule of the form: If X then do Y, a recognitional model would suggest that the expertise of the skilled operator resides primarily in recognizing when relevant antecedent conditions have occurred."

This is a crucial observation. The rule "If X then do Y" looks simple. The difficulty is entirely in recognizing X. A novice who knows the rule might fail to trigger it because they don't recognize X when it occurs. An expert triggers the rule reliably because their recognition machinery is calibrated to detect X in its many variations, partial manifestations, and noisy presentations.

"One of the deceptive qualities of rules is that the consequent follows so naturally from the antecedent; it is not always readily apparent how much expertise is needed in order to recognize when the antecedent has occurred."

This is a profound insight for system design: **the bottleneck in rule-based expertise is not the rule itself, but the recognition of when the rule applies**. Systems that encode rules without encoding the recognition patterns that trigger them will have the rules without the expertise.

## The Novice-Expert Distinction Reframed

In the classical model, novices need more support than experts because they can't analyze as well. The RPD model reframes this: novices need the decision tree framework because they lack the pattern recognition to bypass it. Experts don't need the framework because their recognition is reliable.

"It seems quite possible that the static tree representation is most appropriate for well-structured decisions made by 'novices,' those who do not have the knowledge base to perform well using recognition strategies."

This is a design principle with direct implications: **decision support systems should be designed differently for novice and expert users**. For novices: provide structure, guide through option generation and evaluation, support systematic analysis. For experts: provide situation recognition support, surface relevant cases, support mental simulation, get out of the way.

The common error is designing for the novice (because their decision process is more legible and more easily analyzed) and then deploying to experts (who may actively resist or be degraded by the novice-optimized system).

## Isenberg's Study of Senior Executives

Isenberg's finding that business executives "could recall few if any instances where they made decisions using concurrent deliberation about options" is consistent with the FGC findings. These are not irrational actors or simplifiers — they are among the most successful decision-makers in their domain. Their success is built on recognition, not analysis.

Similarly, Soelberg's study of business school graduates' career choices found that "the apparent reliance on analytic option evaluation was largely a fiction used to buttress their intuitive choice made much earlier than the business students were prepared to admit." The analytical display was post-hoc rationalization of a recognition-based intuitive decision. The analysis didn't drive the choice; it justified it.

This matters for agent systems: **agents that produce elaborate analytical justifications for their outputs may be post-hoc rationalizing recognition-based outputs**. The analysis is real, but it may not be the actual basis for the decision. Understanding this prevents over-trust in the analytical output as the ground truth of the agent's reasoning.

## Case-Based Reasoning as the Architecture of Expertise

If expertise is primarily pattern recognition, then the knowledge base of an expert is primarily a collection of cases — specific, contextualized experiences that serve as the templates against which new situations are matched.

Klein and Calderwood explicitly note the connection to case-based reasoning: "Prior cases could be stored in an analogy bank so that they could be retrieved individually, or there could be a means of retrieving and synthesizing several cases at once, to allow prototype matching. The identification of one or several prior cases would allow the recognition of goals that were plausible, reactions that were typical, critical cues to monitor, and expectancies to monitor."

This is not just a support system feature — it is a description of how expertise is structured in human memory. Expert knowledge is episodic and analogical, not propositional and analytical. The expert remembers specific cases and reasons by analogy, not by applying abstract rules to general principles.

For agent system design:
- **Case retrieval is a core competency**, not a supplementary feature
- Case indexing should be based on situational features, not just task type
- Cases should include not just what happened but what cues triggered recognition, what expectancies were confirmed or violated, and what adjustments were made
- Prototype matching (retrieving multiple cases and extracting their common pattern) is as important as specific case retrieval

## The Role of Experience in Building Expert Pattern Recognition

Expert pattern recognition is not innate — it is built through experience. Specifically, through experience that is:
- **Varied**: exposure to many different cases, including unusual and edge-case scenarios
- **Feedback-rich**: clear, timely feedback on the accuracy of recognition and the success of actions
- **Reflective**: opportunities to analyze and internalize lessons from specific cases

Training programs designed around the RPD model should therefore focus not on teaching analytical procedures but on building the case library: "Rather than trying to train general skills it would be more effective to use domain-specific training programs and augment these with feedback and training scenario features that focus on decision processes, thereby leveraging the value of the existing programs."

For agent systems, this translates to a design principle for agent learning: **agents should be trained through case exposure and feedback, not through optimization against abstract metrics alone**. The learning should build recognition patterns, not just improve scoring functions.

## Implications for Agent Capability Design

### Recognition as a First-Class Capability

In current AI system design, the emphasis is typically on reasoning, planning, and generation — the analytical and productive capabilities. Recognition is treated as a preprocessing step (classification, retrieval) rather than as the central capability.

The RPD model argues for inverting this priority. **Recognition should be the primary capability**, with reasoning and generation serving as support for refining and verifying recognition-based outputs. The agent that recognizes the situation correctly has already done most of the hard work. The agent that cannot recognize the situation type is forced into slow, unreliable first-principles analysis.

### Building Rich Situational Memory

An agent system designed around expertise-as-recognition should have:
- A rich, well-indexed case base
- Retrieval mechanisms that match on situational features, not just keyword similarity
- Prototype abstraction: the ability to form generalizations from multiple cases
- Case annotation with cues, expectancies, and outcomes, not just the core decision

### Knowing What You Don't Know

Expert pattern recognition includes knowing when recognition has failed — when you're looking at something genuinely novel that doesn't match any case in your library. This metacognitive awareness is crucial. An expert who mistakes a novel situation for a familiar one will apply inappropriate responses confidently.

For agent systems: **confidence in situation recognition should be an explicit, monitored output**. When recognition confidence is low, the system should flag this and shift to a more deliberate, first-principles mode rather than proceeding with low-confidence recognition. This is not a weakness — it is a mark of genuine expertise.