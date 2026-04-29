# The Retrospective Distortion Problem: Why Learning From Human-Reported Cases Is Dangerous

## The Central Warning

One of the most epistemologically uncomfortable conclusions in Njå and Rake's analysis concerns the reliability of the primary data sources used to build both the NDM and Contingency Approach frameworks. Both research traditions rely heavily on retrospective interviews with incident commanders — structured conversations, often hours or days after the event, in which commanders describe what they observed, decided, and did.

The problem is fundamental: these interviews do not reliably capture what actually happened. They capture what the commanders believe happened, or what they believe should have happened, or what they believe the interviewer wants to hear. The gap between these and the actual event is systematic, not random.

Quarantelli, one of the most experienced disaster researchers, is cited by Njå and Rake with a devastating observation:

> "It has always bothered us that the 'decision-making' we have observed during actual crises seldom corresponds to the picture evoked in later interviews outside of the actual crisis context, where the process is often depicted as explicit, conscious, individually based and involves the consideration of alternative options."

This is not a minor methodological concern. It is a direct challenge to the foundations of crisis decision-making research. If the retrospective interviews don't match what observers actually saw — if the interviews depict *rational deliberation* where observation found *frantic improvisation* — then the theories built on those interviews may describe a fictional decision process rather than the real one.

For agent systems that learn from human-described cases, from human-generated training data, or from human feedback on outputs, this is a critical warning about the quality and type of learning signal.

## The Mechanics of Retrospective Distortion

Why does retrospective recall fail so systematically? Njå and Rake identify several reinforcing mechanisms:

### 1. Normative Reconstruction

**"Scott (1955) suggested that there is a possibility that memory errs in the direction of how the respondent feels he/she should have behaved."**

Memory is not a recording. It is a reconstruction, and reconstruction is shaped by current beliefs about what was appropriate. A commander who, in the heat of the incident, made a rapid intuitive decision without examining alternatives will, in retrospect, describe that decision in terms that sound more deliberate and principled — because deliberate and principled decision making is the norm they believe should govern their behavior.

This means retrospective accounts systematically overreport:
- Conscious deliberation
- Alternative consideration
- Principled reasoning
- Orderly procedure

And systematically underreport:
- Automatic pattern execution
- Gut-level recognition
- Improvisation
- Confusion and uncertainty

The result is that the retrospective interview produces a version of events that is more rational, more deliberate, and more normatively appropriate than the actual event — a post-hoc rationalization that the commander may sincerely believe is accurate.

### 2. Social and Legal Pressure Toward Self-Justification

**"Since damage and/or severe consequences are always involved, blame fixing is an integral — but often indirect — part of communication. Leaders, particularly formal leaders, may be defensive about the way they played their roles during the crisis."**

The stakes of the retrospective interview are high. If the incident resulted in deaths or major damage, the interview occurs in a context where responsibility for those outcomes is being assigned. Commanders know (consciously or not) that their account will be read as evidence for or against their competence. This creates systematic pressure toward accounts that emphasize reasonable choices, appropriate procedures, and unavoidable circumstances.

The defensive interview is not lying. The commander may sincerely believe the account they are giving. But the account has been unconsciously selected and shaped to minimize perceived culpability. The result is a systematically skewed picture of what actually drove the decisions.

### 3. Group Narrative Formation

**"A 'group version' of an event can develop during a very short period."**

Before researchers conduct formal interviews, the people involved in the incident have already talked to each other. A shared story develops — often within hours of the event. This shared story reconciles individual perspectives, resolves contradictions, and establishes a collective account. By the time researchers arrive, they are not getting individual memories but fragments of a socially negotiated narrative.

This group narrative is particularly dangerous for research because it appears to offer consistency (multiple accounts converge) that suggests accuracy, when the consistency actually reflects social construction rather than memorial accuracy.

### 4. Temporal Decay and Telescoping

**"With time, there is a danger that the subjects will have forgotten many details of their experience and that distortion of other recollections will have occurred."**

Memory for sequential detail decays rapidly. The specific cues that triggered a recognition, the exact sequence of decisions, the specific moment at which a situation reassessment occurred — these granular details are precisely the ones most important for understanding the decision process, and they are also the ones most rapidly forgotten. What persists is the gist — the high-level narrative — which is much more amenable to retrospective rationalization.

### 5. Interviewer Bias

**"Interviewers must be cautioned and recautioned against retaining only the data which support the hypotheses of the research design."**

The researchers conducting the interviews have a theory they are testing. The NDM researcher is looking for evidence of recognition-primed decision making. The CA researcher is looking for evidence of organizational political behavior. Both researchers are human, and humans find what they are looking for. The interview data is filtered through the researcher's theoretical lens before it ever reaches the analysis stage.

## The Candor Problem: What Real-Time Observation Finds

Njå and Rake report something remarkable about on-site observation compared to retrospective interview. During an actual crisis, when a researcher directly observed an incident commander and then conducted an informal, in-the-moment interview:

**"As one respondent remarked to Quarantelli's research group, 'I could tell you I know what I am doing, but you can clearly see I'm wildly guessing in much of what I'm doing.'"**

This is an extraordinary admission — one that would almost certainly not appear in a formal retrospective interview. The commander, in the heat of the event, was willing to acknowledge the reality: that much of crisis decision making involves improvisation under profound uncertainty, not principled expertise. But in the post-hoc interview, that same commander would likely describe the decisions in terms of expertise, experience, and professional judgment.

The implication is disturbing for research: **the more authentic, accurate account of crisis decision making is available only in real time, and obtaining real-time accounts requires methods that most research programs cannot implement.** Retrospective interviews, which are far easier to conduct, provide systematically distorted accounts.

## From the Wildfire Study: A Quantitative Measure of Distortion

The paper reports a concrete data point on recall reliability from the wildfire study component of the NDM research program:

When eight respondents were recalled for a second interview three to five months after the first, **the correspondence between critical decision points identified in the first and second interview varied from 56% to 100%.**

The lower end of that range — 56% correspondence — means that nearly half of the critical decision points identified in the first interview were not identified in the second, or vice versa. Given that these are experienced professionals being asked about events they themselves participated in, a 56% consistency rate is remarkably low. It suggests that even the most structured retrospective interview technique (the Critical Decision Method, designed specifically to maximize recall accuracy) produces data that is substantially inconsistent across time.

## Implications for Agent System Learning

### 1. Human-Described Cases Are Not Ground Truth

When agent systems are trained on human-described cases — case libraries, expert knowledge bases, feedback from subject matter experts on what the correct action would have been — the training data reflects the retrospective distortion problem. The cases describe what the expert believes they did or should have done, not necessarily what they actually did or what would actually have worked.

This creates a systematic bias: training data will overrepresent deliberate, rational, procedure-following behavior and underrepresent the actual mixture of intuition, improvisation, and real-time adaptation that characterizes effective expert performance in complex situations.

**Mitigation**: Complement human-described cases with behavioral observation data wherever possible. If the system is being used to support a task where outcomes are measurable, track actual outcomes against predicted outcomes to calibrate the case library. Weight cases toward those where outcomes have been observed and validated rather than simply reported.

### 2. The Normative Contamination Problem

The retrospective distortion problem means that case libraries are likely to contain a significant fraction of *normative* accounts — descriptions of what should have happened, presented as accounts of what did happen. These normative accounts are not useless, but they should not be treated as empirical descriptions of effective expert behavior. They describe an idealized version of expert behavior.

For agent systems, this means calibrating appropriately: normative accounts teach you what the expert thinks is correct procedure; behavioral observation data teaches you what actually works in practice. Both are valuable. Conflating them is dangerous.

### 3. Avoid Building Systems That Replicate Post-Hoc Rationalization

If agent systems are trained primarily on retrospective accounts, they may learn to produce outputs that *sound like* expert reasoning — deliberate, principled, alternatives-considered — without actually implementing the underlying cognitive process. The system becomes a generator of normatively appropriate-sounding explanations rather than a genuine decision support tool.

This is the inverse of the RPD problem. The RPD expert makes good decisions without deliberate comparison. The post-hoc-rationalization-trained agent makes apparently deliberate-sounding recommendations without the underlying experiential knowledge that makes those recommendations trustworthy. The form of expertise without the substance.

**Detection**: Evaluate agent outputs not only for their surface plausibility but for their predictive accuracy. Does the agent's reasoning actually predict outcomes better than baseline? If the agent is producing well-reasoned-sounding explanations that don't actually improve outcome prediction, the system has learned the form of expertise without the substance.

### 4. Real-Time Behavioral Data Is Precious

The paper's finding that real-time observation produces more authentic accounts than retrospective interviews has a direct implication for agent system evaluation: **observing agent behavior in real task execution is more informative than asking agents (or humans) to describe what they do**.

For WinDAGs evaluation, this means:
- Instrument the actual execution traces, not just the outputs
- Compare what agents report doing to what execution logs show they did
- When agents produce explanations of their reasoning, check whether the explanation is consistent with the actual skill invocations and information flows that occurred
- Build evaluation pipelines that track behavior, not just outcomes

### 5. The Group Narrative Problem in Multi-Agent Learning

The "group version of events" problem has a direct parallel in multi-agent systems where agents share intermediate outputs. When agents update on each other's outputs before an evaluation is complete, the eventual collective assessment may appear consistent while being systematically wrong in the same direction — a multi-agent version of the group narrative phenomenon.

**Architectural safeguard**: For critical evaluations, enforce a protocol where agents form initial assessments independently before accessing each other's outputs. The independent assessments are more valuable as training signal — even if they disagree — than the post-convergence consensus.

## The Positive Case: What Real-Time Research Looks Like

Njå and Rake's conclusion is not that crisis decision making is unresearchable. It is that the methodology must match the epistemological challenge:

**"The first thing you must do is to walk very slowly and several times through the area and observe everything you can. Your interpretation of all the statistics you may later play with will differ depending on your observations."** (Quarantelli, 2002)

This methodological principle — that direct observation of actual behavior provides context that no amount of retrospective analysis can replicate — applies directly to agent system design and evaluation. There is no substitute for watching the system work on real tasks, in real conditions, with real consequences. No amount of synthetic evaluation, no number of benchmark scores, and no volume of self-reported capability assessments can substitute for behavioral observation in the actual operational environment.

The retrospective distortion problem is ultimately a call to ground-truth constantly, to prefer behavioral observation over reported behavior, and to maintain epistemic humility about what case libraries and training data actually teach — especially when that data derives from human self-report.