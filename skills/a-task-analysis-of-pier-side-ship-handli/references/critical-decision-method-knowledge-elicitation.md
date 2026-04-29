# The Critical Decision Method: Extracting What Experts Cannot Volunteer

## The Fundamental Problem of Expert Knowledge

The most consequential insight in Grassi's thesis — one that has profound implications for how AI agent systems are built and trained — is that the people who possess the most valuable knowledge for system design cannot, without special assistance, tell you what that knowledge is:

> "Experts have implicit knowledge of how to perform a task, but they do not always have the explicit knowledge about how or why they perform the way they do." (p. 16)

> "Another area of concern is the tendency to emphasize explicit knowledge, yet overlook the contribution made by implicit knowledge and by perceptual learning. Knowledge elicitation methods should describe the function served by implicit knowledge in proficient task performance so that it should not appear that explicit knowledge is sufficient for proficient performance." (p. 16)

This is not a failure of expert communication. Experts are not holding back, being vague, or underestimating the questioner's sophistication. The knowledge genuinely does not exist in declarative, retrievable form. It is encoded procedurally and perceptually — as automatic pattern recognition, as calibrated physical intuition, as the ability to notice the right things without consciously deciding to look for them.

Ask an expert ship-handler how they know when to begin a turn: "I just know when it's time." This is not evasion. It is an accurate report of the phenomenology of expert performance. The knowledge is *used* without being *stored* as propositions.

## The CDM Solution: Probing Through Concrete Episodes

The Critical Decision Method, developed by Klein, Calderwood, and MacGregor, is specifically designed to extract this kind of knowledge. Its insight is that tacit knowledge, while not retrievable as abstract propositions, *is* retrievable as specific memories of specific events:

> "The Critical Decision Method... involves having experts recall and retrospect about a critical or non-routine incident. What makes the CDM different from other knowledge elicitation methods is that by continuing to ask the experts probing questions concerning specific events during the incident, it is able to progressively uncover many perceptual cues used in the decision-making process." (p. 21)

The method works because episodic memory preserves the perceptual richness of the original experience. An expert who cannot answer "how do you assess the current?" can often answer "that time in Pearl Harbor when the current was running at 3 knots and you had the [ship name] — what were you actually looking at when you decided the current was strong enough to matter?"

The CDM operates in three phases:

**Phase 1: Incident Reconstruction**
The expert recalls the entire event without interruption. The interviewer allows a complete narrative to emerge, recording everything but asking no questions. Purpose: establish the event structure and identify what the expert *chooses* to mention when unconstrained.

> "The first phase establishes the order of events or procedures that took place during the task. This is accomplished by allowing the expert to recall the entire event without being interrupted." (p. 21-22)

**Phase 2: Decision Point Identification**
The expert goes through the event a second time, and the interviewer identifies "decision points" — specific moments where the expert's judgment changed the trajectory of the event.

> "The second phase of the CDM leads to a more comprehensive and 'contextually rich account' of the incident. As the expert goes through the task a second time, the interviewer tries to identify 'decision points,' which are specific points in the incident where the expert makes judgements that affected the outcome." (p. 22)

**Phase 3: Probe Questioning**
The expert goes through the event a third time. The interviewer asks specific probe questions at each decision point, focused on *what the expert observed* that drove the decision.

> "The third phase of the CDM process has the expert go through the event for a third time. During this phase the elicitor asks the expert a number of probe questions in an attempt to get even more detailed information about the incident. The interviewer also inquires about the informational cues that were used in the initial description throughout. In addition to the probe questions, the elicitor poses various 'What if' questions to identify any inaccuracies, differences between experts and novices, and any alternative methods." (p. 22)

The "What if" questions are particularly powerful: they reveal the expert's mental model of the causal structure of the task. "What if the wind had been from the other direction?" forces the expert to articulate what they were implicitly compensating for.

## What the CDM Reveals That Direct Questioning Misses

The thesis provides a concrete example of the knowledge gap the CDM closes:

> "When experts were asked to first describe the task of getting a ship underway from a pier, they often failed to mention the perceptual cues that they used in making an initial assessment of the environmental effects on the ship. It was only after asking how he determined the current of the water that he began to explain his use of visual cues, such as wakes being made by the channel buoy, to make an assessment." (p. 22-23)

The expert's initial narrative omitted the current assessment entirely — not because it was unimportant, but because it had become so automatic that it was invisible to introspection. Only a targeted probe question unlocked the specific observational technique.

This phenomenon — the automaticity of expertise making the most important knowledge the hardest to surface — is precisely why agent systems built from expert interviews and documentation are incomplete. The experts write and say what they consciously attend to. The perceptual substrate that makes their conscious attention correct is invisible to them and therefore absent from all documentation.

## The CDM-Derived Critical Cue Inventories: What They Look Like

The thesis presents 15 Critical Cue Inventories generated through CDM interviews. These are worth studying in detail because they show exactly what shape perceptual expert knowledge takes when successfully extracted.

Consider the CCI for assessing ship motion and position (Table 8, p. 107):

**Cue: Change in separation between ship and pier**
> "The conning officer will visually watch the space between the edge of ship and the edge of the pier. As the space gets larger it indicates that the ship is moving away from the pier. As the space decreases in size, the indication is that the ship is moving towards the pier."

**Cue: Rate of swing of the ship's bow or stern**
> "The conning officer wants a rate of swing that is fast enough to quickly get away from the pier, but not so fast as to be unable to control the momentum of the moving ship. For the bow, the conning officer can look through the 'bull nose,' an opening at the tip of the bow used to pass the forward mooring line through, or look at the jack staff and observe the rate at which the water or fixed objects in the distance pass by."

**Cue: Forward or aft motion of a fixed point on the pier**
> "The conning officer will select a fixed point on the pier, such as a crate or paint marking, and will watch to see if it develops some sort of relative motion. For example, if the conning officer chooses an empty box on the pier and it appears to drift forward, then the conning knows the ship is moving backward or aft. If the box appears to drift backward, then the conning officer knows the ship is moving forward or has gained some headway."

Each of these entries has a specific structure:
1. **What to look at** (the specific visual target)
2. **How to interpret relative motion or change** (larger = moving away, fixed point drifting = ship moving)
3. **What threshold or quality of the signal matters** (fast enough but not too fast)

This is the level of specificity that a trainable agent needs. Not "monitor your position" but "select a fixed point on the pier and watch for relative motion; if the point appears to drift forward, you have sternway."

## The CDM's Role in Surfacing Redundancy and Fallback

One of the most valuable outputs of CDM is the revelation that experts maintain redundant observational arrays — multiple independent signals for the same underlying state. The thesis consistently shows this pattern.

For determining whether an engine order has been executed (CCI Table 6, p. 106):
- Observe churning of water at stern (visual)
- See plume of smoke exiting smoke stack (visual)
- Hear sound of engines accelerating (auditory)
- Hear bell of EOT acknowledgment (auditory)

Four independent signals, two sensory channels. The expert is not checking all four consciously — they have learned to maintain a background awareness of all four simultaneously, using any single one as confirmation and all four together as high confidence.

This redundancy is critical for robustness. In degraded conditions (heavy rain obscuring the stern, engine noise masking the EOT bell), the expert can still reliably assess engine status because the other signals remain available. A novice who has learned only the most common signal (EOT bell) is helpless when that signal is unavailable.

For agent systems, this suggests that **sensor specifications for agent decisions should always include multiple independent observational strategies**, each with explicit fallback logic.

## Applying CDM Principles to Agent Knowledge Construction

The CDM methodology suggests a specific approach to building richer agent task models:

**Step 1: Build the procedural model first (GOMS or equivalent)**
Get the task structure right — what are the goals, sub-goals, and methods? This can often be done from documentation.

**Step 2: Identify every decision point and selection rule**
Wherever the model has a conditional branch — "IF [condition] THEN [method A] ELSE [method B]" — mark it as requiring perceptual specification.

**Step 3: Apply CDM-style probing to each decision point**
For each condition: What does the environment look like when this condition is true? What signals indicate it? What signals were absent or different in cases where this condition was missed or misidentified?

**Step 4: Build the CCI layer**
For each decision point condition, specify:
- Primary signal(s) that confirm the condition
- Secondary signals for redundancy
- Anti-signals that suggest the condition is NOT met despite appearances
- Degraded-condition fallbacks when primary signals are unavailable

**Step 5: "What if" testing**
Apply the probe questions: What if the primary signal were unavailable? What if the opposite condition were true? What would that look like? This surfaces the expert's discriminative features — the signals that separate "condition met" from "condition not met."

## The Interview Structure and Its Implications for Agent Evaluation

The CDM validation process in the thesis used a specific structure that translates directly into agent evaluation methodology:

1. **Scenario familiarization**: Give the agent (or expert) all relevant information about the scenario before starting
2. **Initial task recount**: Have the agent perform the task without interruption, recording all actions
3. **Probe questioning**: Go back through the task and ask the agent (or review its traces) to explain what it was observing at each decision point
4. **Model review**: Compare the agent's actual decisions against the model, investigating discrepancies

This structure — especially the distinction between initial performance and subsequent probe questioning — reveals whether an agent is making correct decisions for correct reasons or producing correct outputs accidentally. An agent that gets the right answer for the wrong perceptual reason will fail as soon as conditions change.

## Boundary Conditions

The CDM is most powerful when:
- Human expert practitioners exist who can be interviewed
- The domain involves perceptual judgment under uncertainty
- The knowledge to be extracted is mature (well-developed expert patterns)
- Time and resources permit multi-session elicitation

The CDM is less applicable when:
- The domain is entirely computational (no perceptual substrate)
- No human experts exist (novel domains)
- The expert's perceptual experience cannot be reconstructed verbally (some forms of motor expertise may be truly non-verbalizable)

The critical failure mode: conducting only a single-session interview and treating the expert's initial narrative as complete. The first pass will always omit the most important tacit elements. The CDM's power comes specifically from the second and third passes.

For agent system designers, the lesson is: **the first version of any task model is always wrong in the same way — it captures the declarative and misses the perceptual.** Plan from the start for multiple rounds of model refinement through adversarial testing.