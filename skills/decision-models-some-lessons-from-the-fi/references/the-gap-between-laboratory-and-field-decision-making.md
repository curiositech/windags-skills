# The Laboratory-Field Gap: Why Theoretical Models Fail in Operational Settings

## The Paradigm Problem

Klein and Calderwood open with a claim about research methodology that has direct implications for how we build and evaluate agent systems: "The prevailing paradigms in decision research, based as they are in simplified and highly structured laboratory tasks, have limited utility in operational domains."

This is a challenge not just to academic psychology but to any framework that is developed in controlled, simplified conditions and then deployed in complex, dynamic, real-world environments. The laboratory-field gap is a fundamental epistemological problem: what you learn about decision-making from studying naïve subjects performing context-free tasks under no time pressure may not generalize to experienced practitioners solving contextual problems under high time pressure.

The gap is not a matter of degree — it is structural. The operational environment has qualitatively different features that change the nature of the cognitive task itself.

## What the Laboratory Eliminates

The laboratory paradigm — at least as Klein and Calderwood characterize its dominant form — systematically eliminates several features that are central to operational decision-making:

**Time pressure**: Laboratory studies of decision-making typically allow subjects unlimited or generous time. Real operational decisions frequently must be made in seconds or minutes. This is not just a quantitative difference. Under time pressure, the feasibility of analytical strategies collapses entirely. You cannot complete a MAUA in 30 seconds. You can complete pattern recognition in 30 seconds.

**Context and expertise**: Laboratory studies typically use "naive subjects" — people without relevant domain experience. This produces decisions that must be made analytically because no recognition patterns are available. Studying naive subjects tells us about novice decision-making, not expert decision-making, and the two are qualitatively different.

**Dynamic conditions**: Laboratory tasks are typically static — the situation is fixed when the subject begins and does not change during the decision period. Real operational tasks are dynamic; the situation changes as the decision-maker acts. A fire spread. A market moved. An adversary responded. The decision-maker must update their situation model continuously.

**Ill-defined goals**: Laboratory tasks have well-specified goals. Real operational goals are ambiguous, nested, sometimes contradictory, and emergent. The goal "put out the fire" dissolves into "do the best job with available resources given multiple competing demands" the moment you try to specify it operationally.

**High uncertainty**: Laboratory probability estimates are often derived from controlled frequency distributions. Real operational uncertainty is often deep — genuinely one-off events where no frequency data exists and where the relevant "base rate" is not retrievable.

**Distributed responsibilities**: Laboratory tasks are performed by individual subjects. Real operational decisions occur in teams, organizations, and distributed systems where responsibility, information, and authority are divided across multiple actors.

Eliminating all six features from a decision-making study produces a task that is so different from operational decision-making that findings may not transfer — or may transfer in a misleading way, creating false confidence that laboratory-validated methods will work in the field.

## The Deeper Issue: The Root Metaphor

Klein and Calderwood identify not just a methodological gap but a conceptual one. The decision tree is not just a research method — it is "a 'natural' format for representing and thinking about decisions." It is a root metaphor that shapes what questions get asked, what variables get studied, what results get expected.

"Beneath the apparent diversity, there is a common or root metaphor that has determined what variables are likely to be considered and even what questions are likely to be asked. This metaphor is concretely illustrated by the pervasiveness of the decision tree."

The decision tree metaphor highlights the decision-maker as analyst: generating alternatives, evaluating consequences, selecting the optimal option. It makes "the moment of choice" the natural unit of analysis. It naturalizes the concepts of "facing alternatives," "assessing probabilities," and "weighing utilities."

Once this metaphor is in place, it shapes everything. The questions asked will be questions about how alternatives are generated, how probabilities are estimated, how utilities are weighted. The biases studied will be biases in these processes. The supports designed will support these processes. The training developed will train these processes.

But if expert decision-making is fundamentally recognitional rather than analytical, then the entire research agenda built around the decision tree metaphor is studying the wrong thing and building the wrong tools.

## The Citation Bias and the Persistence of False Models

Christensen-Szalanski and Beach's finding — that there is a "citation bias" in the judgment and decision literature, favoring studies that find biases over studies that show competent performance — reveals a deeper problem with the laboratory paradigm. Laboratory studies of decision-making systematically find that people are bad at decision-making. This is because the laboratory strips away the expertise, time structure, and contextual cues that make real decision-making work, and then evaluates people against mathematical norms they have no chance of meeting.

The result is a research literature that portrays human decision-makers as inherently biased and suboptimal. This portrait then drives training programs designed to "correct" the biases and decision support systems designed to "compensate for" the limitations. The programs and systems may work well in laboratory settings. They perform poorly or even negatively in operational settings.

"Since it is apparently not happenstance that field studies present a more positive view of human decision performance than laboratory-based studies, a greater emphasis on field studies may itself go a long way in bridging the gap between research and applied needs."

## The Evaluation Problem for Agent Systems

The laboratory-field gap has a direct parallel in AI system evaluation. Agent systems are typically developed and evaluated in controlled conditions:
- Benchmark datasets with well-specified tasks
- Evaluation metrics that reward particular outputs
- Testing environments that are more structured and predictable than deployment environments
- Evaluation by people who understand the system and have designed the test cases

Deployment environments are:
- Unpredictable and dynamic
- Full of edge cases not represented in benchmarks
- Inhabited by users who bring unexpected goals, contexts, and failure modes
- Subject to time pressures and resource constraints not present in testing

An agent system that performs well on benchmarks may perform poorly in deployment for the same reasons that laboratory-validated decision models fail in the field: the conditions of evaluation are structurally different from the conditions of use.

This suggests several design principles:

**Evaluate in conditions that match deployment conditions.** If the system will be used under time pressure, evaluate it under time pressure. If it will handle ambiguous, context-rich tasks, evaluate it on ambiguous, context-rich tasks. If it will interact with users who have incomplete or mistaken models of the system's capabilities, include such users in evaluation.

**Treat benchmark performance as necessary but not sufficient.** Benchmark performance tells you about performance in controlled conditions. It is a floor, not a ceiling. Field performance may be substantially lower, for structural reasons that are not visible in benchmark evaluation.

**Build feedback loops from deployment to development.** The only way to close the laboratory-field gap is to systematically study what happens in deployment, bring those findings back to development, and revise the system based on what actually happens when real users use it in real conditions. This is what Klein and Calderwood did with fireground commanders — they went to the field.

**Be suspicious of apparent cognitive failures in deployment.** If users are not using the system as designed, or are not following the prescribed analytical procedures, the first hypothesis should not be "user error" — it should be "the system's model of how decisions are made is wrong." The FGCs who resisted characterizing their roles in terms of "making choices" and "considering alternatives" were not being difficult. They were reporting accurately on their actual experience.

## The Deeper Lesson for Agent System Design

Klein and Calderwood's paper is, at its root, an argument for ecological validity: the study and design of decision systems must be responsive to the actual conditions in which those systems will operate.

For AI agent system design, this translates to a foundational design principle: **the architecture of the system should match the structure of the task as it actually occurs in practice, not the structure of the task as it is convenient to model in controlled conditions**.

The convenient model of complex tasks is: well-specified goals, clear options, measurable outcomes, stable conditions. Design for this model produces systems that work elegantly in testing and struggle in deployment.

The actual structure of complex tasks is: emergent goals, recognition-generated options, contextual evaluation, dynamic conditions. Design for this structure is harder — it requires field study, case collection, recognition-pattern development, and iterative deployment — but it produces systems that work where it matters.

The lesson of Klein and Calderwood is ultimately a lesson about intellectual honesty: be willing to go to the field, study what actually happens, and let those findings revise your assumptions about how intelligent systems should work. The decision tree metaphor was not the result of field study — it was the result of theoretical convenience. The RPD model was the result of going to the field and watching what experts actually do.

For WinDAGs and any serious agent orchestration system: the architecture that will work is the one built from the structure of expert practice, not the one built from the structure of analytical convenience.