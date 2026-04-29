# Decision Support vs. Decision Replacement: Building Systems That Amplify Expert Judgment

## The Core Tension

Every intelligent agent system that operates in a domain with human experts faces a fundamental architectural choice: should the system support human expert judgment, or replace it? This is not merely a question of automation level — it is a question of how expert knowledge is modeled, what role situation assessment plays in the system architecture, and what happens when the system and the human disagree.

Klein and MacGregor's research reveals why this choice matters so much and why it is so often made wrong.

## The Failure of Designer-Centric System Design

Klein and MacGregor diagnose a systemic problem in how decision support systems are built:

"The design of decision aid and support technologies generally begins with a model of the task to be performed. Often the model selected is a normative one, such as a decision analytic model. The rationale generally given for this choice is that such models provide optimal solutions to a problem and cannot be outperformed by humans' natural abilities. An alternative and arguably more accurate reason is that systems designers are often far removed from the substantive aspects of the tasks with which they deal" (p. 36).

The result: "the task is then fit to the model rather than the model to the task. Consequently, opportunities for aiding and support are sought by looking to the designer's abstract model rather than to the task's substantive elements" (p. 36).

This is a profound and widely applicable critique. System designers, working in the abstract, build normative models that are elegant and mathematically tractable. They then force the messy reality of human performance into this model — defining what "information" the decision-maker needs, what "options" exist, what "criteria" should be applied. The resulting system may function perfectly within its own model while being nearly useless for the actual task.

The alternative is to begin with "a set of methodologies for identifying critical elements in task performance in terms that directly relate to the task as defined by those who perform it" (p. 36) — which is exactly what the CDM provides.

## The Four Criteria for Aiding Opportunities

Klein and MacGregor specify four criteria that should guide the identification of appropriate decision support interventions:

### 1. Criticality
"The more critical a component is for overall task performance, the more important it becomes to have the component performed accurately and reliably" (p. 36). Aid should be directed at the components where performance failures have the highest consequences, not at the components that are most technically tractable.

### 2. Temporal Sufficiency
"Constraints exist on the amount of time available for the performance of a task component before a window of opportunity has passed" (p. 36-37). Decision support that requires more time than is available in the decision window is worse than no support, because it creates the illusion of rigor while actually impeding action. Critically: "a relatively small improvement in the amount of time required to perform situation assessment can have a large impact on the quality of a decision maker's performance" (p. 37). Speed improvements on critical path tasks compound.

### 3. Quality of Human Performance
"Even experts are not always exceptional at all aspects of the tasks they perform. Aspects of the environment in which they work can force upon them tasks that are inherently difficult for humans to do and make them prone to errors" (p. 37). Support is most valuable where human performance has known systematic weaknesses — not where performance is already strong.

The pre-flight checklist example is instructive: "Highly trained, expert pilots, for example, are required to execute pre-flight checklists to insure that important task elements will not be overlooked due to limitations in their ability to remember the large number of details associated with preparing an aircraft for flight" (p. 37). The checklist supports a specific human limitation (working memory capacity under load) without attempting to replace pilot judgment on the tasks where pilot judgment is expert.

### 4. Technical Achievability
Not all support opportunities are technically feasible. "Highly generalized process aids are the most difficult to construct. This category includes aids intended to enhance cognitive processes such as generation of decision options. In general, the more domain-independent a decision aid becomes, the more difficult it is to technically execute. Highly achievable aids, in a relative sense, are those that present, collate or summarize information relevant to specific aspects of task performance" (p. 37).

This suggests a tiered approach: first build information organization and display aids (high achievability, direct impact on situation assessment); then consider decision structuring aids (medium achievability); last consider general process improvement aids (low achievability, high risk of designer-model imposition).

## What to Aid: The Information Architecture

Klein and MacGregor's list of decision-aiding questions (pp. 37-38) provides a rich inventory of where intelligent systems can actually add value:

**On Task Difficulty**:
- What task elements does the expert perform well vs. poorly?
- What are the specific sources of stress?
- What would the expert want in the way of assistance?

**On Time Requirements**:
- Where is time a critical factor?
- How can the tempo of the task be reduced?

**On Information Requirements**:
- What databases are required? Are they accessible in meaningful time?
- Where is information insufficient?
- Where is there more information than can be adequately synthesized?
- Where can information be made more meaningful — translated from data into knowledge?

**On Communication Requirements**:
- What messages need to be sent? In what time frame? How difficult is this?

**On Tool Use**:
- What tools are currently in use? How are they used? How can they be improved?

Notice that this list is almost entirely about *information support* — organizing, presenting, collating, timing, translating data into knowledge. It is not about generating options or making decisions. The highest-value support is in enabling better situation assessment, not in replacing the expert's decision-making with algorithmic optimization.

## The Situation Assessment Support Paradigm

The most important insight from Klein and MacGregor's treatment of decision aiding is this: **the highest-leverage point for intelligent support is situation assessment, not option evaluation**.

Because the RPD model places situation assessment at the center of expert performance — because option selection follows from SA rather than preceding it — improvements in SA quality translate directly into improvements in decision quality. The expert who correctly assesses the situation will, by the logic of the RPD model, almost automatically select an adequate course of action.

A system that supports SA does not need to know what action should be taken. It needs to help the expert see the situation more clearly, more quickly, and more accurately. This means:

- Organizing incoming information into the SA dimensions relevant to the domain
- Highlighting cues that are diagnostically significant
- Flagging anomalies — observations that don't fit the current SA
- Tracking which SA dimensions have incomplete information
- Maintaining timeline representations that show how the situation has evolved

None of this requires the system to have a complete model of the decision space. It requires the system to have a model of *what the expert needs to perceive* — which the CDM and its Critical Cue Inventories provide.

## What Not to Aid: The Limits of Algorithmic Decision-Making

Klein and MacGregor are equally clear about where intelligent support should *not* try to operate: "How many decision makers, feeling the pressure of time, would begin an analytical process knowing that it might not generate a useful answer at the end?" (p. 19).

Decision support systems that attempt to generate and rank options algorithmically in time-pressured domains will fail because:
1. They require complete option enumeration, which experts cannot provide
2. They require probability assessments, which are systematically miscalibrated
3. They require time that is typically not available
4. They require that the task fit the normative model that the designer imposed

The CDM research reinforces this with a specific example: after studying expert data analysts using the CDM, the research team presented their findings to a sponsor investigating whether to build an expert system. "As a result of the sponsor's new understanding, the expert system project was abandoned" (p. 35). The expert system was the wrong tool for the expertise.

## The Training Parallel: Teach Cases, Not Rules

The same distinction between rule-based and case-based knowledge applies to training systems. Klein and MacGregor's critique of ISD (bottom-up skill decomposition) parallels their critique of normative decision aids:

"This approach assumes that mastery of a skill must be achieved by incremental attainment of lower skill levels. Expertise is defined as an aggregation of knowledge through successful accomplishment of subordinate skills" (p. 39).

The alternative — the "Socratic" or "Suzuki" method in their terminology — teaches expertise directly by:
- Exposing novices to expert solutions to a wide range of situations
- Including not just the actions taken but "the rationale behind the actions and the mental deliberations involved in assessment and choice" (p. 40)
- Creating a "data base of expertise" that serves as the direct transfer vehicle for upper-level knowledge

This is case-based instruction rather than rule-based instruction. The learner builds pattern libraries by exposure to annotated cases, not by mastering decomposed skills and attempting to reintegrate them.

**For agent systems**: This suggests that training should be organized around:
- Curated sets of non-routine cases, annotated with expert decision rationale
- Explicit representation of the SA at each decision point
- Counterfactual annotations: what would a novice have done here, and why would it have been wrong?
- Progressive exposure to increasing difficulty within the non-routine zone

## The User Acceptance Criterion

Klein and MacGregor note a practical and often overlooked criterion for decision support success: "decision support and instructional system designs that incorporate CDM analysis results are more apt to be accepted and used by the target population" (p. viii, Executive Summary).

This is not trivial. A theoretically optimal decision aid that experts refuse to use provides zero benefit. Expert acceptance requires that the system:
- Respects the expert's situational understanding rather than overriding it
- Speaks in the domain's natural terms rather than the designer's abstract model
- Supports rather than replaces the recognitional decision-making that experts rely on
- Provides value at the right time in the right format

CDM-based design, by grounding system design in how experts actually think, produces systems that experts recognize as reflecting their genuine experience — and therefore systems they are willing to use.

## Implications for WinDAGs Agent Orchestration

In a multi-agent orchestration system, the decision support vs. replacement distinction has direct architectural implications:

**Human-in-the-loop orchestration**: When human experts are in the loop, agent systems should be designed explicitly as SA support — organizing information, flagging anomalies, maintaining timeline representations, highlighting critical cues. The human expert makes the recognitional judgment; the system provides the perceptual scaffolding.

**Agent-to-agent orchestration**: When one agent supports another, the supporting agent should similarly focus on SA enrichment for the acting agent rather than attempting to take over the decision. A routing agent that provides a classified situation type and associated context enriches the decision of the acting agent without replacing it.

**Escalation design**: Explicit escalation paths should be built for when an agent detects it is outside its competence — when the current situation doesn't fit known types, when confidence is low, when multiple hypotheses remain viable. Rather than proceeding with low-confidence actions, agents should have graceful degradation paths that preserve the possibility of human or higher-capability intervention.

**Avoiding the normative model trap**: In designing agent tasks, resist the temptation to specify them in terms of the normative model that is most convenient for the designer. Use CDM-style elicitation from the domain experts (human or agent) who actually perform the task to identify what information they need, what decisions they face, and where support would actually help.

## Summary

The lesson Klein and MacGregor teach about decision support is precise and actionable: start from how experts actually perform the task, not from the normative model that the designer prefers. Identify the specific points where support is most valuable — typically in SA rather than option selection. Build systems that enhance the expert's perceptual and cognitive capabilities rather than replacing their judgment. Measure success by expert acceptance and performance outcomes, not by internal model elegance. And know that the highest-value intervention is often the simplest: better information organization, better cue highlighting, better timeline representation — the infrastructure of perception rather than the machinery of decision.