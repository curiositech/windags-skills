# Extracting What Experts Can't Tell You: The Critical Decision Method and Tacit Knowledge

## The Problem of Automatic Knowledge

The deepest irony in expertise is that the more skilled a person becomes, the less able they are to explain what they're doing. As skills become automated — as pattern recognition operates faster and below conscious awareness — the introspective access that would allow verbal description degrades. "Action becomes fluid and intuitive and decision makers have trouble describing their decision process, which have now become automatic" (Zimmerman, p. 30, summarizing Dreyfus & Dreyfus, 1986).

This is not evasion. It is a well-documented feature of expertise. The chess grandmaster cannot explain why a particular move is correct — they "see" it. The experienced officer cannot explain what made them uneasy about a particular traffic stop — they "noticed something." The experienced nurse who recognizes sepsis in a patient hours before lab values confirm it cannot always articulate the constellation of signs that triggered the recognition.

This creates a critical knowledge elicitation problem: the people who most need to be learned from are least able to teach explicitly. Rule-based knowledge capture ("what are your decision rules?") systematically misses the most valuable knowledge, which operates through pattern recognition below the level of articulable rules.

## The Nisbett and Wilson Problem

Nisbett and Wilson (1977) raised the challenge directly: "people do not have adequate introspective ability to report on their cognitive processes, and... retrospective verbal reports can be biased" (cited in Zimmerman, p. 18).

Their argument: when asked why they made a choice, people confabulate — they generate post-hoc rationalizations that feel like genuine recall but are actually reconstructions based on implicit theories about how decisions "should" have been made. The result is reports that are internally consistent and plausible but systematically wrong about actual cognitive mechanisms.

Ericsson and Simon (1993) partially rebut this: **the accuracy of verbal reports depends on the method of knowledge elicitation used**. Specifically, effective knowledge elicitation methods can enhance report accuracy by structuring recall in ways that align with how memory actually stores situational information — episodically, contextually, with specific sensory and temporal anchors.

The key distinction: asking "why did you do that?" invites confabulation. Asking "walk me through exactly what you noticed in the first thirty seconds, starting from when you entered the room" invites episodic retrieval that is much more likely to capture actual cognitive processes.

## The Critical Decision Method: A Structured Retrospective Protocol

The CDM (Klein, Calderwood, & MacGregor, 1989) is the primary tool developed in the NDM literature for overcoming the tacit knowledge problem. It is a semi-structured interview technique that uses four features to extract tacit decision knowledge:

**1. Specific incident selection.** The interview focuses on a particular incident — one the expert remembers specifically, that was challenging or unusual. Abstract knowledge ("in general, I...") is not what the CDM is after. The episodic anchoring of memory to specific events is what makes retrieval of genuine cognitive processes possible rather than generic rules.

**2. Multiple retrospective sweeps.** The incident is recounted multiple times, each sweep going deeper:
- First sweep: free recall, uninterrupted, from beginning to end
- Second sweep: interviewer retells the story back, in the expert's words, for correction and enrichment
- Third sweep: timeline construction — identifying key events and decision points
- Fourth sweep: progressive deepening — structured probes at each decision point, asking what was noticed, what was expected, what alternatives were considered, what would have changed the decision
- Fifth sweep: "what-if" queries — hypothetical variations that reveal the boundaries of the decision and surface factors the expert didn't know they were using

"The CDM enhances recall by providing participants with multiple opportunities to recount the event, thus reinstating context in a slow and systematic manner" (p. 36).

**3. Cognitive probes at decision points.** The probes are designed to extract specific categories of tacit knowledge:
- *Cue identification*: "What were you seeing/hearing/smelling at that moment?"
- *Expectancy*: "What did you expect to happen next?"
- *Mental modeling*: "Did you imagine what would happen if you did X?"
- *Anomaly detection*: "Was anything different from what you expected?"
- *Knowledge basis*: "What experience or training were you drawing on here?"
- *Option consideration*: "Were there other courses of action you considered but rejected?"

**4. Counterfactual probing.** The "what-if" sweep is particularly valuable because it reveals the decision's sensitivity structure — what would have had to be different for the expert to decide differently. This surfaces implicit threshold conditions that the expert was using but couldn't have stated in advance.

## What CDM Extracts That Other Methods Miss

Three knowledge types that conventional rule-elicitation fails to capture:

**Anomaly sensitivity.** Experts notice when something is *absent* that should be present, or *present* that should be absent. "When there is no evidence of a crime at a scene that should have evidence, that absence is itself a cue." Rules capture what experts do when things match expectations. CDM captures how experts respond to expectation violations.

**Cue-bundles and pattern gestalt.** Officers couldn't always say why they felt a situation was dangerous — but when probed with "what specifically did you notice?" they could reconstruct the constellation: tone of voice + specific body posture + particular word choice + timing relative to a question. Each element alone might be innocuous. The combination triggered recognition. No rule captures this because the rule would require enumerating all possible combinations.

**Situation evolution tracking.** CDM's timeline structure makes explicit how the expert's assessment *changed* as the event unfolded. This captures the update process — what new information arrived, when, and how it modified the working model — in a way that a simple "why did you do X?" question cannot.

## The Self-Report Limitation and How to Handle It

Honest assessment: CDM reports are still self-reports, and still subject to retrospective reconstruction. The videotape comparison in this study is revealing:

"The interview data did not indicate the speed at which participants approached the subject or how close they got to the subject when they first entered the room... In some instances, this quick approach prompted the subject to react by immediately drawing his weapon" (p. 69-70).

Officers' subjective accounts were largely consistent with their actual behavior at the level of *what decisions they made*. They were less accurate about *how* they executed those decisions — timing, distance, physical approach. The subjective representation of "I approached cautiously" doesn't always match the objective record.

This suggests a triangulation principle: **CDM self-reports are most reliable for capturing cognitive processes (what was noticed, what was considered, how the situation was framed) and least reliable for capturing behavioral details (timing, distance, physical approach)**. Pairing CDM with observational data or video review produces the most complete picture.

## Application to Agent System Knowledge Capture

The CDM framework translates directly to agent system design in several ways:

**1. Incident-based rather than rule-based knowledge capture.** When trying to encode domain expertise into a system, don't ask experts for their rules. Ask them to recount specific incidents — their most challenging cases, their near-misses, their surprising successes — and probe those incidents with CDM-style questions. The resulting knowledge base will be richer and more accurate than rule specifications.

**2. Decision point mapping as an engineering artifact.** The CDM timeline identifies *decision points* — moments where the decision-maker's assessment or action changes. These are the architectural junctions in any intelligent system — the moments where routing decisions happen, where plan revisions occur, where new information changes the execution path. Mapping these explicitly creates the skeleton of a decision architecture.

**3. Anomaly detection as a first-class system component.** CDM interviews consistently surface the "something wasn't right" signal — the pre-conscious recognition that expectations have been violated before the decision-maker can articulate what violated them. Building systems with anomaly detection capabilities (rather than just feature detection) requires understanding what the expected state looks like and flagging departures.

**4. Multiple passes in retrospective analysis.** When an agent system reviews its own execution history to improve, it should not do so in a single pass. Multiple passes at different levels of analysis — behavioral (what did the system do?), cognitive (what was the system's working model?), counterfactual (what would have changed the outcome?) — produce richer improvement signals.

**5. Structured probing for counterfactual sensitivity.** "What-if" queries in CDM reveal the sensitivity structure of decisions. For AI systems, this maps onto ablation analysis and edge case testing — systematically varying input conditions to understand where decision boundaries lie.

## The Transfer Lesson

The CDM literature teaches something fundamental about knowledge that any system design must grapple with: **the most valuable knowledge in a domain is often tacit, automatic, and inaccessible through direct questioning**. The knowledge exists — it produces real performance differences — but it cannot be retrieved through the obvious path of "just ask the expert."

Getting access to that knowledge requires:
- The right elicitation structure (specific incidents, not abstract rules)
- The right probing strategy (what did you notice, not why did you do that)
- Multiple passes at different levels of analysis
- Triangulation with behavioral records where available

For AI agent systems, this means that expert knowledge capture is itself a skilled cognitive task — and that the quality of a system's domain knowledge is bounded by the quality of the elicitation process that produced it.