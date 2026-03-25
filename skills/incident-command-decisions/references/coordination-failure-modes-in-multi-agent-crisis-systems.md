# Coordination Failure in Multi-Agent Systems: What Incident Command Research Teaches About Collective Intelligence

## The Coordination Problem at Scale

Individual agent expertise, however excellent, is not sufficient for complex problem resolution. The real test of any intelligent system — human or artificial — comes when multiple agents with different capabilities, different information states, and different authority structures must coordinate toward a shared goal in a dynamic, uncertain environment.

Njå and Rake's analysis of incident command research is fundamentally a study of this coordination problem. The incident commander is not working alone; they are orchestrating a team of responders, coordinating with other agencies, managing communication flows, and trying to maintain a coherent shared picture of a rapidly evolving situation. The failures they document are not primarily individual cognitive failures. They are coordination failures — breakdowns in the mechanisms that should allow multiple agents to operate as an effective collective.

This makes the paper's findings directly relevant to WinDAGs and similar multi-agent orchestration systems.

## The Handoff Problem: Transfer of Command at Critical Moments

One of the most important and underappreciated observations in the paper concerns command handoffs:

**"Normally, there is at least one transfer of the leading officer during a major incident, which is critical for response performance. The dynamics of the commanding structure are almost absent from the research literature."**

Consider what a command handoff actually involves. The outgoing commander has accumulated a rich, tacit, partially verbal situation model — they know where all the resources are deployed, what the current tactical plan is, what they tried that failed, what they're monitoring, what concerns them that they haven't acted on yet, and what they're waiting for. The incoming commander has none of this.

The formal handoff briefing — however well executed — cannot transfer the full richness of the outgoing commander's situational understanding. The gaps are always larger than either party realizes. The incoming commander starts with an impoverished situation model and must rapidly reconstruct it from available cues — a process that takes time, during which the quality of command degrades.

**"In Norway and Sweden, normally two to six persons are involved in the initial phase, in which a low-ranking officer carries out the commanding on-scene. The nominated incident commander arrives later, within an hour after the first alert has been received."**

This is not a bug in the incident command system; it is an unavoidable feature of how emergency response works. But it means that the transition from the initial low-ranking officer (who has been on-scene and has rich situational knowledge but limited authority and resources) to the nominated incident commander (who has authority and resources but limited situational knowledge) is a predictable coordination failure point.

**Agent system translation**: Every handoff between agents — every moment where one skill completes and passes its output to the next — involves a version of this problem. What information is actually transferred? What tacit context does the passing agent have that is not captured in its formal output? What assumptions has it made that the receiving agent will inherit without knowing they are assumptions?

**Design principles**:
- Handoff specifications should be richer than output specifications. The output of a skill is what it produced; the handoff should include what it found notable, what it tried and rejected, what it's uncertain about, and what would change its conclusions.
- Receiving agents should have an explicit "situational reconstruction" phase where they verify their understanding of the situation before proceeding, rather than simply inheriting the passing agent's output as ground truth.
- Critical handoff moments should be logged with richer context than routine handoffs, because they are the moments most likely to introduce systematic errors.

## The Role Ambiguity Problem: When Orchestration Structure Breaks Down

Njå and Rake note that in crisis situations, "bureaucratic patterns are bound to change profoundly." The formal organizational structure — which agent is responsible for what, who has authority to make which decisions, how escalation should work — is designed for anticipated conditions. Major crises often violate those anticipated conditions, and the formal structure fails to map cleanly onto the actual situation.

The result is role ambiguity: multiple agents believe they have responsibility for the same decision, or no agent believes it has responsibility for a critical decision. Both patterns produce coordination failure.

The paper describes a related phenomenon in the Scandinavian emergency services context: "It can be quite circumstantial who becomes the incident commander and what managerial background and experience he/she possesses to make adequate decisions." In other words, the person in the commanding role may not be the person best equipped for that role — they happened to arrive first, or they happened to hold the relevant rank. The formal structure assigns authority by position, but capability may not follow position.

**Agent system translation**: In WinDAGs, this maps to the problem of skill selection under novel conditions. The skill selection system may be designed for anticipated task types. Novel task types may activate skills that are formally appropriate (they handle the right domain) but not actually best positioned for the specific variant of the problem at hand.

**Design principles**:
- Role assignment should be capability-based and dynamic, not fixed by position in the DAG. The right skill for a task should be determined by the specific task characteristics, not by a static assignment.
- When role ambiguity is detected (multiple skills claiming jurisdiction, or no skill claiming jurisdiction), the coordination layer must explicitly resolve it rather than letting it proceed with informal arrangements.
- The coordination layer should monitor for cases where the assigned skill and the best-available skill differ and flag these for review.

## Information Flow Architecture: The Intelligence Picture Problem

Crisis coordination depends critically on maintaining a shared operational picture — a common understanding of the situation across all coordinating agents. But different agents have access to different information, develop different partial models of the situation, and communicate those models imperfectly to each other.

The Contingency Approach identifies several systematic distortions in this information flow:

**Upward distortion**: Information filtered as it moves up the command structure. Each intermediate layer summarizes, interprets, and presents information in a form that supports their own situation model. By the time information reaches the top-level decision maker, it has passed through multiple interpretive filters.

**Downward distortion**: Directives and plans from the top level are interpreted and adapted by each intermediate level before being executed. The original intent may be significantly modified by the time it reaches the executing agents.

**Lateral gaps**: Information shared horizontally between agents at the same level is often incomplete. Agents may not know what other agents at the same level know, leading to duplicate effort, conflicting actions, or gaps where each assumes the other is covering.

The paper quotes Quarantelli on a fundamental limitation: "Too many current disaster researchers who are the ultimate analysts of data often not only get the information third-hand via first an interviewer and then a coder, but also have absolutely no direct experience in disaster occasions which would give them a larger context for interpreting the data."

The chain of information transformation — from incident to interviewer to coder to analyst — degrades fidelity at each step. The same chain exists in agent pipelines: from raw environment to sensor to classifier to analyst to orchestrator to output.

**Design principles**:
- Information should travel as close to its raw form as possible through agent pipelines, with interpretation happening at the consuming end rather than the generating end.
- Each stage of information processing should be logged, allowing the receiving agent to inspect not just the processed output but the processing chain that produced it.
- The orchestrating agent should maintain an explicit model of the information gap between its own picture and the ground truth — acknowledging what it doesn't know rather than treating its current model as complete.

## The Expertise Distribution Problem: No Single Expert Holds All Knowledge

Crisis incidents require expertise that is distributed across multiple responders. The fire brigade knows fire suppression. The police control crowd and traffic. The medical team manages casualties. The structural engineer assesses building integrity. No single agent holds all the relevant expertise, and the coordination challenge is ensuring that the right expertise is applied to the right sub-problem at the right moment.

But expertise coordination faces a characteristic challenge: experts in different domains often cannot fully communicate their knowledge to each other. The fire officer who knows intuitively that a particular fire pattern suggests structural risk cannot fully articulate that knowledge to the structural engineer; the structural engineer cannot fully articulate the specific threshold concerns to the fire officer. The knowledge is partially tacit and partially domain-specific in its expression.

The paper notes this asymmetry in the different research approaches: NDM research is deeply concerned with individual expert knowledge and its characteristics; the CA is concerned with organizational and political coordination. Both are correct about what they focus on, but neither has a complete theory of how individual expert knowledge gets coordinated into collective expert performance.

**Agent system translation**: In WinDAGs, different skills encapsulate different forms of expertise. The coordination challenge is ensuring that the orchestrator correctly identifies which skills' expertise is relevant to which sub-problem, that relevant outputs from one skill are communicated in a form that can be used by other skills, and that conflicts between different skills' recommendations are resolved intelligently rather than by arbitrary priority.

**Design principles**:
- Skill outputs should include not just conclusions but the key evidence and reasoning that support those conclusions, so that other skills (and the orchestrator) can evaluate their relevance.
- When skills with different domain expertise produce conflicting outputs, the conflict should be surfaced and explicitly resolved rather than resolved by default priority ordering.
- The orchestrator should maintain a model of which sub-problems have been addressed by which skills' expertise and which sub-problems remain without expert coverage.

## The Performance Measurement Problem: Knowing When You're Doing Well

Njå and Rake raise a challenge that strikes at the heart of both crisis management research and agent system evaluation:

**"There is no easily accessible and measurable output quantity of incident commanding which can be used as the dependent variable."**

In a manufacturing process, performance is easily measured: output rate, defect rate, throughput time. In crisis management, what is the performance metric? Number of lives saved? But the counterfactual — how many would have been saved under different management — is unknowable. Response time? But faster isn't always better; a well-coordinated slower response may save more lives than a rapid but chaotic one.

The same problem confronts agent system evaluation. What does it mean for a multi-agent system to perform well on a complex, open-ended task? The output may be objectively correct (technically accurate, logically valid) but inappropriate for the context. It may be contextually appropriate but arrived at through a fragile reasoning chain that will break on slight variations. It may satisfy the stated requirements while missing the actual need.

**"If the outcomes were used as a basis for the assessment of the incident commanders' decision making, this would also be a highly dubious process. The decisions are contextual and should be assessed on specific evidence, circumstances and the commander's assessments in real time."**

This is a profound point: outcome-based evaluation of decision quality is problematic because good decisions can produce bad outcomes (bad luck) and bad decisions can produce good outcomes (good luck). Evaluating the decision requires evaluating the *process* — was it reasonable given what was known at the time? — not just the outcome.

**Design principles for agent system evaluation**:
- Evaluate the *process* as well as the outcome: Was the situation assessment accurate given available information? Were the actions selected appropriate for the situation as understood? Were feedback loops active?
- Include diversity of evaluation: technical accuracy, contextual appropriateness, reasoning transparency, robustness to variation, and process quality are all distinct dimensions.
- Distinguish lucky successes from reliable successes: a system that produces the right answer through a flawed process is less trustworthy than one that produces the right answer through a sound process, even if both produce the same outcome on a given case.
- Maintain longitudinal evaluation: performance on a single task is weak evidence; performance patterns across many tasks in varied conditions is the true measure of system capability.

## Conclusion: Building Coordination Into Architecture, Not Policy

The central lesson from Njå and Rake's coordination analysis is that coordination failures are not primarily the result of agents behaving incorrectly by their own lights. They are structural — built into the way the system is organized, the way authority is distributed, the way information flows, and the way performance is measured. "Emergency workers had been swallowed up in a system that failed them despite their best individual efforts."

This means coordination quality cannot be enforced through better instructions to individual agents. It must be built into the architecture: the structure of handoffs, the format of information sharing, the mechanisms of conflict resolution, the granularity of authority delegation, and the design of feedback loops. Individual agents doing their best within a poorly coordinated architecture will produce poor collective performance. Individual agents doing their best within a well-coordinated architecture will produce collective performance that exceeds what any individual agent could achieve alone.

This is the promise and the challenge of multi-agent systems: the potential for collective intelligence that exceeds individual capability, and the very real risk of collective failure that falls below individual capability. Njå and Rake's analysis of incident command failure modes is a detailed map of the traps on the path between those two outcomes.