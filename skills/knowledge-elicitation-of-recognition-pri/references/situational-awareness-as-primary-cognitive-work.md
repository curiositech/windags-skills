# Situational Awareness as the Primary Cognitive Work of Expertise

## The Central Insight

Conventional analysis of expert performance focuses on what experts *do* — their actions, their decisions, their outputs. Klein and MacGregor's research consistently redirects attention upstream: the decisive work happens before any action is selected. It happens in the formation of **situational awareness** — the expert's understanding of what kind of situation this is, what is at stake, what forces are operating, what will happen next.

The report defines this precisely: situation assessment involves an expert's understanding of "the dynamics of a particular case and is the basis for the ability to recognize cases as examples of standard prototypes." The Situation Assessment Record (SAR) the authors develop treats decision-making as fundamentally a **pattern-matching and causal-modeling process**, not an option-evaluation process.

This reframing has profound implications for how agent systems should allocate cognitive resources and structure their reasoning pipelines.

---

## The Structure of Situational Awareness

Klein and MacGregor's analysis of fireground commanders reveals that situational awareness has layered structure. For the urban fireground command task, experts assess across nine dimensions simultaneously:

1. **Problem** — smoke characteristics (color, amount, toxicity), fire amount and location, explosion potential, chemicals, rate of change
2. **Structure** — building type, materials, architecture, age
3. **Problem × Structure interaction** — where is the seat of the fire? What are the possibilities for fire movement given this structure?
4. **Weather** — temperature, moisture, wind velocity and direction
5. **Risk to Life** — direct cues, knowledge of potential risk, special populations
6. **Risk to Firefighters**
7. **Nature of Attack** — progress, hindrances
8. **Resources** — available, needed, special needs
9. **Goals Assessment** — search and rescue, fire control, property conservation

The expert doesn't check these dimensions sequentially. They are integrated simultaneously into a coherent picture — a *gestalt* of the situation — that immediately suggests what prototype applies and what actions are appropriate.

For a tank platoon leader, the dimensions are different (terrain, enemy position, friendly positions, mission objectives, timing) but the structure is the same: **multi-dimensional simultaneous integration** into a coherent situational model.

---

## Dynamic Situational Awareness: Elaboration and Shift

Situational awareness is not static. As incidents unfold, new information either:

**Elaborates** the existing model (SA-Elaboration): The commander's prototype match is confirmed, but additional detail becomes available. Goals become more specific. The action queue can be refined. The mental simulation of options becomes more accurate.

**Shifts** the existing model (SA-Shift): New information contradicts the current prototype match. The existing goals may need to be abandoned. A new prototype must be found or constructed. This is cognitively expensive and time-consuming — exactly when expert performance advantage is largest.

The Situational Awareness Record (SAR) makes this dynamic explicit:

```
SA-1: Initial Cues/Goals → Decision Points 1 and 2 (based on this assessment)
SA-2: Elaboration — additional cues deepen but don't change the model → Decision Point 3
SA-3: Shift — contradicting information → original goals rejected, new goals established → Decision Points 4, 5, 6
```

The most dangerous moments in expert decision-making are SA-Shifts that are *missed* — situations where contradicting information arrives but the expert fails to update their situational model. This is the mechanism behind confirmation bias in expert performance: the prototype match is so strong that disconfirming evidence is filtered out or reinterpreted to fit the existing model.

---

## The Tanker Truck Incident: A Case Study in Situational Awareness

The exemplar incident (Appendix B) demonstrates the SAR structure vividly. Chief McW responds to a tanker truck fire:

**Initial SA formation (first ~30 seconds):**
- Visual cue: large column of black smoke in unexpected location → acts on visual rather than dispatcher's location report (expertise: dispatch coordinates can be wrong; smoke doesn't lie)
- First sight of tanker: ruptured *lengthwise* rather than split in half → immediate relief, because "the danger of explosion was less"
- This is pure cue-to-prototype matching. The Chief knows that a lengthwise rupture has different explosion dynamics than a transverse split. This knowledge is not in any standard operating procedure — it's accumulated from experience with fuel fires.
- Second tanker: ~50 feet away → new threat element added to situational model
- Driver interview: JP-4 jet fuel, full load → refines the causal model (combustibility, foam vs. water requirements)

**SA-Elaboration through the incident:**
- Foam units arrive → goal shifts from containment to suppression
- Protective water streams established → safety goal integrated
- "The Chief felt that the situation was pretty much under control"

**SA-Shift (unexpected):**
- Storm sewer explodes into flame
- Burning fuel is in the sewer system
- This is *not* in the current prototype — it exceeds the incident type the Chief was managing
- Immediate recognition: "this new aspect of the situation would exceed his span of control"
- Response: call another alarm, delegate the sewer problem to the arriving Chief, retain personal focus on the tanker

The SA-Shift is handled correctly because the Chief has a *meta-prototype*: when a situation exceeds the current model in a way that creates a second, separate threat thread, escalate and distribute command. The shift itself is recognized and acted on within seconds.

---

## Why Situation Assessment is Where Expertise Lives

Klein and MacGregor observe that expertise "often occurs only at the boundaries of a problem domain." Routine problems don't require deep expertise — trained people can handle them. Novel problems don't reveal expertise — everyone is effectively a novice. The productive zone is:

> "Non-routine incidents that required expertise, and were carried out effectively only because of that expertise."

And the expertise that matters in these incidents is almost never option-evaluation skill. It is:

1. **Detecting non-routine features** — noticing that the situation has elements that don't fit the standard pattern
2. **Accessing the right prototype** — having a rich enough prototype library that the non-routine situation still resembles something familiar
3. **Correctly modeling causal dynamics** — understanding *why* the situation will evolve the way the prototype predicts
4. **Forming accurate expectations** — knowing what should happen next if the current assessment is correct, and being alert to disconfirmation

An expert who gets these right will generate an adequate action automatically. An expert who gets these wrong cannot be saved by superior option-evaluation — they will be selecting from the wrong option queue for the wrong prototype.

---

## Implications for Agent Architecture

### Situation Assessment as a Dedicated Phase
Agent systems should explicitly separate **situation assessment** from **action selection**. These are not the same computation and should not be collapsed into a single "decision" step.

The situation assessment phase should produce:
- A prototype label (what kind of situation is this?)
- A confidence score (how well does this situation match the prototype?)
- A set of active goals (what can/should be accomplished?)
- A set of monitored cues (what should I watch for next?)
- A set of expectations (what should I see if my assessment is correct?)
- A flag for SA-Shift risk (am I seeing disconfirming evidence?)

Only after situation assessment produces a sufficiently confident prototype match should the action selection phase activate — pulling from the associated action queue.

### Expectation Violation as a Primary Signal
Because situational awareness depends on forming accurate expectations, **expectation violation** — receiving information that contradicts what the current prototype predicted — should be treated as a high-priority interrupt. It is the primary signal that an SA-Shift may be required.

Agents that can only process what they receive passively, without actively monitoring for what they *expect* to receive and didn't, will systematically miss SA-Shift triggers.

### Cue Weighting is Domain-Specific and Cannot Be Generic
The nine situational awareness dimensions for fireground command are completely different from those for tank platoon command, which are different from those for paramedic triage, which are different from those for MIS system management. Klein and MacGregor found this consistently across all their CDM studies.

This means there is no generic "situation assessment module" that will work across domains. Situation assessment must be **domain-specialized**. For agent systems, this implies that the cue-to-prototype mappings, the relevant monitoring dimensions, and the causal dynamics models must be built from domain-specific knowledge elicitation — not from general-purpose reasoning.

### Span of Control Awareness
One of Chief McW's most important cognitive acts in the tanker incident was recognizing that the sewer fire exceeded his span of control. He did not try to manage both threads simultaneously. He escalated and delegated.

Agent systems should similarly model their own span of control — the number of simultaneous situational models they can maintain with adequate fidelity. When a new sub-situation emerges that would exceed this span, the appropriate response is escalation (request additional agent resources) or delegation (hand off one thread to another agent), not degraded performance across all threads.

---

## What Distinguishes This from Generic "Context Awareness"

Many agent systems claim to be "context aware." Klein and MacGregor's framework is more specific and more demanding:

Generic context awareness: "I know what data is in my current state."

Expert situational awareness: "I know what kind of situation this is, what will happen next, what I should be monitoring that I haven't received yet, and what would force me to reassess my current model."

The difference is the presence of **active causal modeling** and **expectation formation**. Situational awareness is not a snapshot — it is a running prediction about how the situation will evolve, subject to continuous confirmation or disconfirmation.