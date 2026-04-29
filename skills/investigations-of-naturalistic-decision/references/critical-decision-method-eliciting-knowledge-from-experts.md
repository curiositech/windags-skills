# The Critical Decision Method: Extracting What Experts Know But Cannot Tell You

## The Knowledge Elicitation Problem

When you ask an expert how they make decisions, they often cannot tell you. The FGCs Klein interviewed "rejected the notions that they were 'making choices,' 'considering alternatives,' or 'assessing probabilities.'" They knew they were doing something — they were clearly effective — but the cognitive processes driving their effectiveness were largely tacit, automatic, and below the threshold of conscious introspection.

This is not a unique problem. Expertise in almost any complex domain involves processes that resist verbal articulation. The chess grandmaster cannot explain their intuition about which position is stronger. The experienced nurse cannot fully explain why a patient "just doesn't look right." The skilled programmer cannot always articulate why they feel a particular design is fragile.

Yet this tacit knowledge is exactly what we most need to extract — for training novices, for building decision support systems, for designing intelligent agents. The Critical Decision Method (CDM) is Klein and Calderwood's solution to this problem.

## The Core Insight Behind CDM

Standard knowledge elicitation methods — interviews, questionnaires, think-aloud protocols during routine tasks — fail to access tacit expertise because routine tasks are handled automatically. The expert processes the situation and responds without the kind of effortful conscious deliberation that generates articulable reasoning.

The CDM targets non-routine incidents — cases that were challenging, unusual, or pivotal. These are the cases where the automatic recognition process was stressed, where the expert had to work harder, where conscious deliberation was more likely to occur and therefore more likely to be remembered.

"Non-routine specific cases" are the methodological key. They force the expert into a mode of reflection that routine cases do not. By focusing on the hardest cases — the incidents that the expert remembers because they were difficult — the interviewer accesses the edge cases of expertise, where the tacit knowledge is most visible because it was most taxed.

## The Five-Step Protocol

**Step 1: Select Incident**

The expert selects an incident that "represents a 'command challenge'": a situation where a decision had significant impact on the outcome, either successfully or unsuccessfully. This self-selection is deliberate — the expert's own judgment about what was difficult is itself data about where the complexity lies.

In some studies, interviewers or supervisors selected incidents. Either way, the selection criterion is challenge and significance, not typicality. "Incidents were selected so as to obtain the most detailed and accurate reconstructions."

**Step 2: Obtain Unstructured Account**

The participant describes the incident from onset to resolution, proceeding without interruption except for minor clarifications. This serves multiple purposes:

- Creates context for the interviewer
- Activates the expert's memory of the event (memory is context-dependent; narrating the story in sequence re-activates related memories)
- Establishes rapport and positions the interviewer as a listener rather than an interrogator

The unstructured account captures the expert's natural framing of what happened — which aspects they emphasize, where they see the key moments, how they understand causation. This framing is itself data about their cognitive model.

**Step 3: Construct Incident Timeline**

The interviewer reconstructs the account as an explicit timeline, establishing sequence and duration of both objective events ("second alarm arrived at 14:07") and the expert's perceptions and judgments ("I thought at this point the situation was getting out of control").

The timeline serves to detect inconsistencies in the account (which often reveal hidden complexity), fill in missing events, and create a shared artifact that both parties can reference during subsequent questioning. "Many times inconsistencies in the account could be detected and corrected on the basis of the timeline, and missing facts filled in."

The timeline also forces the expert to reconstruct the temporal order of their reasoning — which perception preceded which judgment, which decision came before which action. This temporal reconstruction is essential for understanding the cognitive process, not just its outcome.

**Step 4: Decision Point Identification**

The interviewer identifies specific decision points for further probing. These are not necessarily moments the expert explicitly flagged as decisions ("I had to decide") — they may be moments where the expert took one course of action when another was clearly available, or where a different level of expertise would clearly have led to a different response.

"A decision point was probed if the participant confirmed that other reasonable courses of action were possible or that another participant (perhaps one with less or greater expertise) might have chosen differently." This definition — focused on the availability of meaningful alternatives rather than on the decision maker's conscious experience of choosing — is more effective than asking "when did you make decisions?"

**Step 5: Decision Point Probing**

Each identified decision point is probed with a standardized set of questions:

| Probe Type | Content |
|------------|---------|
| CUES | What were you seeing, hearing, smelling? |
| KNOWLEDGE | What information did you use, and how was it obtained? |
| ANALOGUE | Were you reminded of any previous experience? |
| GOALS | What were your specific goals at this time? |
| OPTIONS | What other courses of action were considered or available? |
| BASIS | How was this option selected/other options rejected? |
| EXPERIENCE | What training or experience was necessary for this decision? |
| AIDING | If suboptimal, what could have helped? |
| TIME PRESSURE | How much time pressure was involved? |
| SITUATION ASSESSMENT | How would you describe this situation to a relief officer at this point? |
| HYPOTHETICALS | If a key feature had been different, what difference would it have made? |

The hypotheticals probe is particularly powerful. "If the patient had been younger, how would your decision have changed?" "If the second alarm had been unavailable, what would you have done?" Counterfactual questions access the expert's implicit model of causal factors — by varying one feature at a time, the interviewer reveals which features the expert considers essential to their decision and which they consider incidental.

## Why This Method Works for Accessing Tacit Knowledge

The CDM succeeds where standard methods fail for several reasons:

**Episodic memory as a backdoor**: The expert may not be able to articulate their schema directly — "I don't know how I know, I just knew it was that kind of fire" — but they can often narrate what they saw, what they inferred, and what they did in a specific case. The specific case serves as a memory cue that makes the tacit knowledge accessible through narrative reconstruction.

**Non-routine events force slower processing**: Routine decisions are largely automatic and leave little memory trace. Non-routine decisions require more deliberate processing and are more likely to be remembered with detail. The CDM's focus on challenging incidents accesses the expert's deliberate decision processing rather than their automatic processing.

**Multiple perspectives through timeline**: By establishing a timeline and then revisiting decision points within it, the CDM creates multiple opportunities to access the same knowledge from different angles — what the expert was attending to, what they were expecting, what they were trying to achieve. Each angle can reveal tacit knowledge invisible from other angles.

**Counterfactuals access implicit models**: Asking "what if X had been different?" forces the expert to articulate the causal model they were using, even if they cannot articulate it in the abstract. "If the wind had been coming from the south, I would have redirected the crews to the north perimeter" reveals something about how the expert models fire-wind interaction that would not emerge from direct questions about their knowledge.

## Limitations and Boundary Conditions

**Retrospective distortion**: CDM relies on memory of past events. Memory is reconstructive, not reproductive — experts may retrospectively impose order on decisions that were messier at the time, or may attribute more foresight to themselves than they actually had. This is a genuine limitation, though the timeline construction step and hypothetical probes help detect and reduce distortions.

**Selection bias in incident choice**: Expert-selected incidents may be skewed toward cases where the expert performed well or toward cases that are narratively coherent. Near-misses and cases of error may be underreported, especially in high-stakes domains where errors have consequences.

**Limited access to unconscious processing**: Even with CDM, some expert processes remain inaccessible. "The processes involved in selecting and using analogues are relatively automatic and unconscious." When the expert says "I just knew," CDM can document the inputs and outputs but cannot always access the transformation process.

**Domain requirement**: CDM requires interviewers with sufficient domain knowledge to follow the expert's account, identify when implicit assumptions are being made, and formulate useful counterfactuals. An interviewer who doesn't understand fireground command cannot effectively probe an FGC's decision points.

## Application to Agent System Design

The Critical Decision Method provides a direct methodology for building agent knowledge bases and testing agent decision quality:

**Knowledge Engineering via CDM**: Before deploying an agent in a domain, conduct CDM interviews with domain experts. The resulting data provides: situation typologies (from the patterns across many incidents), critical cue inventories (from the CUES probes), causal chain encodings (from KNOWLEDGE and BASIS probes), expectancy structures (from SITUATION ASSESSMENT probes), and action queues (from OPTIONS and BASIS probes). This is the input material for schema construction.

**Scenario Design from CDM Data**: The challenging incidents collected via CDM are directly usable as test scenarios for agent systems. They represent the actual edge cases that tax expert decision making — and therefore the cases where agent performance most needs to be validated.

**Counterfactual Probing of Agent Decisions**: The hypotheticals probe from CDM can be applied to agent outputs: "If X had been different in this situation, would your recommendation have changed, and how?" An agent that cannot answer this question meaningfully has not developed the causal model that characterizes expert situation assessment.

**Error Archaeology**: When an agent makes an error, apply CDM-style retrospective analysis: What was the agent's situation assessment at the time? What cues was it attending to? What expectancies did it have? Where did the error originate — in situation classification, cue interpretation, option evaluation, or forward simulation? This analysis supports targeted improvement rather than generic retraining.

**Eliciting Human Expert Knowledge for Training Data**: CDM provides a principled method for generating high-quality expert decision data for training agent systems. The resulting data is richer than simple outcome labels because it captures the expert's cognitive process, not just their final choice.