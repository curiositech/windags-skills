# Eliciting Tacit Expert Knowledge: The CDM Method and Its Application to Building Agent Knowledge Bases

## The Knowledge Elicitation Problem

The central challenge in building expert agent systems is not architecture — it is knowledge. Experts possess vast amounts of domain knowledge that is genuinely effective in practice, but most of this knowledge is tacit: it is not written down, not consciously accessible to the expert, and not easily transferable through direct instruction.

When firefighters, pilots, or police officers are asked why they made a particular decision, they frequently cannot explain. They "just knew," their "gut told them," or "it was obvious." This is not evasion — it is accurate reporting of the phenomenology of expert decision-making. The expert's knowledge is proceduralized to the point of automaticity, running outside conscious awareness as fast parallel processing rather than slow serial reasoning.

The practical problem: you cannot put into an agent what you cannot get out of a human. If expert knowledge cannot be elicited, it cannot be encoded.

The solution developed by NDM researchers, and applied by Zimmerman to law enforcement, is the Critical Decision Method (CDM): a structured retrospective interview technique designed specifically to surface tacit expert knowledge in a form that can be captured, analyzed, and applied.

## Why Standard Elicitation Fails

Before describing what the CDM does, it helps to understand what goes wrong with simpler approaches.

**Direct introspection fails.** Experts cannot report on their cognitive processes by simply being asked about them. Nisbett and Wilson (1977) demonstrated that people "do not have access to their cognitive processes" and will "make implicit assumptions based on a priori theories about their responses to stimuli" (cited in Zimmerman, p. 18). When asked "why did you do that?", experts produce plausible-sounding post-hoc rationalizations that may not reflect the actual process.

**Observation without probing fails.** Watching experts work provides behavioral data but not cognitive data. "Observations require interpretation of behaviors but do not provide insight into internal processes" (Cooke, 1994, cited in Zimmerman, p. 19). The researcher sees what the expert does but not why, what they noticed, what they expected, or what alternatives they considered.

**Think-aloud methods partially fail.** Having experts verbalize their thinking in real time can work for some tasks, but "real-time reporting methods... may result in inadequate information elicitation, especially if the expert is involved in a complex task that has high cognitive demands" (Cooke, 1994; Ericsson & Simon, 1993, cited in Zimmerman, p. 19). In high-stakes, high-tempo situations, the expert cannot simultaneously perform and narrate. Demanding narration may also interfere with performance.

**Unstructured interviews fail.** Without specific probing, experts default to high-level procedural descriptions: "I assessed the situation and responded appropriately." This is accurate but not useful. Structured, semi-structured interviews that use specific cognitive probes produce dramatically more useful information: in a firefighting study, "those in the structured interview condition reported more information about the cues they attended to compared to those in the unstructured interview condition. The information obtained was more specific, more detailed, and more often linked to specific actions and plans" (Crandall, 1989, cited in Zimmerman, p. 17).

## The CDM Architecture: Five Steps, Three Sweeps

The Critical Decision Method is a semi-structured interview technique using "a four-step knowledge elicitation process to capture the knowledge of domain experts in real-world situations" (Hoffman et al., 1998, cited in Zimmerman, p. 17). In Zimmerman's implementation, this becomes a five-step process with three distinct information-gathering sweeps.

### Step 1: Incident Recall — Establishing the Baseline

The expert recounts the episode in its entirety, from beginning to end, without interruption. The interviewer listens actively but does not ask questions. The purpose is threefold: (1) to establish the basic factual structure of the incident, (2) to activate the expert's memory through uninterrupted narration, and (3) to identify the narrative structure — where the story pauses, where it accelerates, where the action changes — which indicates decision points.

**Key interviewing principle:** The interviewer maintains "encouraging body language and verbal indicators" to convey interest without directing the narrative. Interrupting the expert's memory reconstruction damages it.

### Step 2: Incident Retelling — Building Shared Understanding

The interviewer tells the story back to the expert "using the participant's phrasing and terminology." The purpose is to establish a shared factual baseline and to give the expert the opportunity to correct misunderstandings, fill in gaps, and add details.

**Critical technical point:** "Mismatching will interfere with their mental representation and hinder recall. Instead, mirror their account, which will assist in memory retrieval." The CDM relies on the expert's memory being actively engaged throughout the interview. Using the expert's language rather than the interviewer's maintains the mental context that keeps the memory accessible.

### Step 3: Timeline Verification and Decision Point Identification — Structural Mapping

The interviewer and expert work together to construct an explicit timeline of the incident, identifying "key events and points when decisions were made and actions were taken." Decision points are moments when "a major shift in assessment of the situation took place or where the participant took an action that influenced the outcome of events."

Not all actions are decision points in the CDM sense. Purely procedural actions — things any officer would do in any similar situation — are not the focus. The focus is on "decisions made when participants had to evaluate an ambiguous situation and choose a course of action from among multiple options." These are the moments of genuine expert cognition, where tacit knowledge is most actively engaged.

### Step 4: Progressive Deepening — Cognitive Archaeology

This is the core of the CDM. Using the timeline as a scaffold, the interviewer returns to each identified decision point and asks probe questions that dig progressively deeper into the expert's cognitive processing.

The probe questions target:
- **Cues**: "What were you seeing, hearing, smelling? What specific factors led to your interpretation?"
- **Concerns**: "What concerns did you have at this point? What was your stress level?"
- **Goals**: "What were your specific objectives at this time? What were you trying to achieve?"
- **Basis of choice**: "Why was this option selected? Why were other options rejected?"
- **Mental modeling**: "Did you think of the events that would unfold? Did you imagine the possible consequences?"
- **Expectations**: "What outcome did you expect? What did you think would happen next?"
- **Reasoning rules**: "Is this always the case? Under what conditions would you do it differently?"

**The guiding heuristic:** Whenever the expert says "I just knew," "my gut told me," or "it was obvious" — probe immediately. These phrases signal automatized expert knowledge that the interview technique is designed to surface. "Let natural questions that arise, and curiosity guide the questioning."

**The depth standard:** "By the end of step four, the interviewer should have a detailed, specific, and complete picture of each segment of the event and of the overall incident." Not just *what* happened, but *what the expert knew, when they knew it, how they knew it, and what they did with what they knew.*

### Step 5: "What-If" Queries — Boundary Condition Mapping

The final sweep uses hypothetical modifications to the incident to map the boundaries of the expert's knowledge. The interviewer poses changes to the scenario and asks how the expert would have responded differently.

Types of what-ifs:
- **Error introduction**: "Suppose that when you did X, the victim was injured — what would that have changed?"
- **Assumption testing**: "What if the suspect's nervous behavior was not due to deception but to physical illness?"
- **Expectancy violations**: "What if, instead of quiet when you arrived, you heard screaming?"
- **Experience level probing**: "What would a less experienced officer have done differently at this point? What cues might they have missed?"

The what-if sweep serves two functions: it reveals the conditions under which the expert's typical response would change (boundary conditions on mental models), and it surfaces alternatives that were considered and rejected, revealing the expert's option-evaluation process.

## The Three-Sweep Structure: Why Multiple Passes Work

The CDM uses multiple passes through the same incident not to gather more information but to gather deeper information at each pass. Each pass serves a different function:

**Pass 1 (incident recall):** Establishes the narrative frame, activates memory
**Pass 2 (retelling):** Confirms understanding, catches major gaps
**Pass 3 (timeline verification):** Structures the narrative into analyzable segments with identified decision points
**Pass 4 (progressive deepening):** Extracts cognitive content at each decision point
**Pass 5 (what-ifs):** Maps boundary conditions and reveals counterfactuals

The multi-pass structure works because "the CDM enhances recall by providing participants with multiple opportunities to recount the event, thus reinstating context in a slow and systematic manner" (Zimmerman, p. 36-37). Each retelling is not merely repetition — it reinstates mental context that makes previously inaccessible memories accessible. Research on context-dependent memory confirms that "mentally reinstating context can be as effective as physically returning to the location of the original incident" (Krafka & Penrod, 1985; Smith, 1988, cited in Zimmerman, p. 44).

## Validating CDM Data: The Triangulation Principle

A consistent concern in verbal report methods is accuracy. Retrospective accounts may be distorted by post-hoc rationalization, selective memory, or motivated reasoning. The CDM addresses this through several mechanisms.

**Triangulation**: Zimmerman's study used video recordings of the simulated scenarios to crosscheck interview data. "Participants' verbal reports were highly consistent with the observational data. Particularly, the conversation details and environmental cues reported by participants were reflected in the videos" (p. 69). Where discrepancies existed — such as participants understating how quickly or aggressively they approached a subject — these were themselves informative, revealing elements of the event that participants did not consciously process as decision-relevant.

**Internal consistency checking**: The multi-sweep structure of the CDM creates multiple opportunities for the expert to contradict themselves or fill in gaps inconsistently, which the interviewer can probe.

**Expert validation**: Zimmerman used subject matter experts who were not study participants to review and validate scenario design and coding categories. This provides external anchoring for the knowledge categories extracted.

**The appropriate epistemic position:** CDM produces *accurate verbal reports of cognitive content* — the cues noticed, the mental models applied, the goals pursued. It does not produce accurate reports of *meta-cognitive process* — why the decision-maker reasoned as they did at a neurological or computational level. These are different questions, and confusing them leads to unfair criticism of the method.

## From CDM Output to Agent Knowledge Base: The Translation Problem

The CDM produces richly structured qualitative data: decision points with associated cues, interpretations, expectancies, goals, and action rationales. Converting this into an agent knowledge base requires a translation process.

**Decision requirement tables**: "Researchers use decision requirement tables to categorize the cognitive demands of given tasks. Typically, each decision requirement table centers around one decision requirement and describes the cognitive components that contribute to that decision, such as the critical decisions and judgments necessary to that decision, the challenges and cues unique to that decision, and the strategies employed by the decision makers" (Phillips et al., 2001; Wong & Blandford, 2001, cited in Zimmerman, p. 77). These tables provide structured, analyzable representations of expert knowledge at each decision point.

**Pattern libraries**: The cues and cue-combinations that trigger recognition at Level 1 of the RPD model can be encoded as pattern libraries. Each pattern links a set of observable features to a situation type, a set of expectancies, and a typical course of action.

**Situation assessment rubrics**: The story-building logic at Level 2 can be encoded as structured reasoning templates: given this set of cues, what stories are consistent with them, and what additional evidence would distinguish between stories?

**Mental simulation scripts**: The forward-reasoning chains used at Level 3 can be encoded as "if I take action X in situation of type Y, the likely consequences are Z" templates, with associated monitoring conditions.

**The limit of CDM-based knowledge extraction**: CDM is best at extracting knowledge about *the expert's current practice* — how they currently perceive, interpret, and respond. It is less good at extracting knowledge about *what the expert should do in situations they have rarely or never encountered*. For novel situations, the expert's what-if responses are useful but speculative. Agent knowledge bases should be explicitly marked for coverage — where knowledge comes from real expert experience vs. extrapolation.

## Implications for Ongoing Agent Learning

The CDM framework suggests a model for ongoing agent knowledge development that goes beyond one-time knowledge elicitation.

**Post-incident interviews for agents**: After an agent completes a complex task — especially one that required non-routine decisions — a structured retrospective analysis should be conducted: what signals indicated the situation type? What interpretation was applied? What alternative interpretations were considered? What actions were taken and why? This creates an ongoing CDM-like process that continuously enriches the agent's knowledge base.

**High-performer feedback seeking**: Sonnentag's (2001) finding that high-performing software developers "sought significantly more feedback from team leaders and coworkers" (cited in Zimmerman, p. 28) suggests that agents should be designed to actively seek feedback, not just receive it when offered. Build feedback-seeking as a standard post-task behavior.

**Experience bank accumulation**: "It is possible to develop or expand mental models simply by hearing other people's stories" (Zimmerman, p. 69). Agents can accumulate vicarious experience — not just their own task completions but documented patterns from other agents, case studies, and retrospective analyses — to expand their pattern libraries beyond direct experience.

**The critical design principle**: Knowledge elicitation is not a one-time event before deployment — it is an ongoing process that should continue throughout an agent system's operational life. Treat every complex task as a knowledge elicitation opportunity, and build the retrospective analysis infrastructure to capture it.